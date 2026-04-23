import { PlanetRegistry } from './registries/PlanetRegistry';
import { StructureRegistry } from './registries/StructureRegistry';
import { CHUNK_SIZE, WORLD_HEIGHT } from './Constants';
import { Item, ITEMS } from './Inventory';
import { generateProceduralDungeon } from './DungeonGenerator';
import { StructureGenerator } from './world/StructureGenerator';

import { BlockType } from './constants/BlockType';
import { BlockRegistry } from './registries/BlockRegistry';
import { ItemGenerator } from './ItemGenerator';
export { BlockType };

export function isSolid(block: BlockType): boolean {
    return BlockRegistry.isSolid(block);
}

export function isIndestructible(block: BlockType): boolean {
    return BlockRegistry.isIndestructible(block);
}

import { Chunk } from './world/Chunk';
import { ChunkManager } from './world/ChunkManager';
import { TerrainGenerator } from './world/TerrainGenerator';

export class World {
    activePlanet: string = 'THRAE';
    chunkManager: ChunkManager = new ChunkManager();
    chestData: Map<string, (Item | null)[]> = new Map();
    blockHealth: Map<string, number> = new Map();
    respawningBlocks: Map<string, { type: BlockType, timer: number }> = new Map();
    hasBuiltSpawn = false;
    hasBuiltDungeon = false;
    hasBuiltWizardTower = false;
    wizardTowerEntrance: {x: number, y: number, z: number} | null = null;
    questNpcEntrances: {x: number, y: number, z: number}[] = [];
    timeOfDay: number = 8.0; // Start at 8 AM (24 hour clock)
    dayCount: number = 1; // Start on day 1
    
    constructor() {
        this.chunkManager.setWorld(this);
    }

    update(dt: number) {
        // 1 real minute = 1 in-game hour
        this.timeOfDay += dt / 60.0;
        if (this.timeOfDay >= 24.0) {
            this.timeOfDay -= 24.0;
            this.dayCount += 1;
        }

        for (const [key, data] of this.respawningBlocks.entries()) {
            data.timer -= dt;
            if (data.timer <= 0) {
                const [x, y, z] = key.split(',').map(Number);
                this.setBlock(x, y, z, data.type);
                this.respawningBlocks.delete(key);
                
                // Crop chaining
                if (data.type === BlockType.CROP_STAGE_1) {
                    this.respawningBlocks.set(key, { type: BlockType.CROP_STAGE_2, timer: 60.0 });
                } else if (data.type === BlockType.CROP_STAGE_2) {
                    // Check if soil is wet down below 
                    const ground = this.getBlock(x, y, z - 1);
                    if (ground === BlockType.TILLED_SOIL_WET) {
                        this.respawningBlocks.set(key, { type: BlockType.CROP_STAGE_3, timer: 60.0 });
                    } else {
                        this.respawningBlocks.set(key, { type: BlockType.CROP_STAGE_3, timer: 120.0 }); // Takes twice as long if dry
                    }
                }
            }
        }
    }

    pregenerateChunks(playerX: number, playerY: number) {
        const pcx = Math.floor(playerX / CHUNK_SIZE);
        const pcy = Math.floor(playerY / CHUNK_SIZE);
        const radius = 3; // Pre-generate 3 chunks in each direction

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const cx = pcx + dx;
                const cy = pcy + dy;
                // Just calling getChunk will generate it if it doesn't exist
                if (!this.chunkManager.hasChunk(this.activePlanet, cx, cy)) {
                    this.chunkManager.getChunk(this.activePlanet, cx, cy);
                    return; // Only generate one chunk per frame to avoid lag spikes
                }
            }
        }
    }

    getChunkKey(cx: number, cy: number): string {
        return this.chunkManager.getChunkKey(this.activePlanet, cx, cy);
    }

    getChestKey(x: number, y: number, z: number) {
        return `${this.activePlanet}_${x},${y},${z}`;
    }

    getChest(x: number, y: number, z: number): (Item | null)[] {
        const key = this.getChestKey(x, y, z);
        if (!this.chestData.has(key)) {
            const newChest = new Array(80).fill(null);
            
            // Auto-populate random ruin loot since it's uninitialized
            const keys = Object.keys(ITEMS);
            const numItems = Math.floor(Math.random() * 4) + 1; // 1 to 4 items
            let slot = 0;
            for (let i = 0; i < numItems; i++) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const item = ITEMS[randomKey];
                if (item && (item as any).category !== 'BLOCK' && item.id !== 'village_bell') {
                    const quantity = item.maxStack && item.maxStack > 1 ? Math.floor(Math.random() * 5) + 1 : 1;
                    newChest[slot] = { ...item, quantity };
                    slot++;
                }
            }
            // Add some gold pieces randomly
            if (Math.random() < 0.5) {
                newChest[slot] = { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 15) + 5 };
                slot++;
            }
            
            // Add a generated item on rare occasions
            if (Math.random() < 0.35) {
                const dangerLevel = Math.abs(z - 15) * 2 + 1; // Deeper/Higher = better
                if (Math.random() > 0.5) {
                    newChest[slot] = ItemGenerator.generateWeapon(dangerLevel);
                } else {
                    newChest[slot] = ItemGenerator.generateAccessory(dangerLevel);
                }
                slot++;
            }
            
            this.chestData.set(key, newChest);
        }
        return this.chestData.get(key)!;
    }

    setChest(x: number, y: number, z: number, inventory: (Item | null)[]) {
        this.chestData.set(this.getChestKey(x, y, z), inventory);
    }
    
    getElevation(x: number, y: number): number {
        for (let z = WORLD_HEIGHT - 1; z >= 0; z--) {
            const block = this.getBlock(x, y, z);
            if (isSolid(block) && block !== BlockType.LEAVES && block !== BlockType.PINE_LEAVES && block !== BlockType.WATER) {
                return z;
            }
        }
        return 0;
    }

    getChunk(cx: number, cy: number): Chunk {
        return this.chunkManager.getChunk(this.activePlanet, cx, cy);
    }

    buildSpawn() {
        this.hasBuiltSpawn = true;
        StructureGenerator.buildSpawn(this);
    }

    buildRana() {
        StructureGenerator.buildRana(this);
    }

    buildHeart() {
        StructureGenerator.buildHeart(this);
    }
    
    buildStructure(id: string, startX: number, startY: number, startZ: number) {
        StructureGenerator.buildStructure(this, id, startX, startY, startZ);
    }

    buildDungeon(startX: number, startY: number) {
        StructureGenerator.buildDungeon(this, startX, startY);
    }

    buildWizardTower(startX: number, startY: number) {
        StructureGenerator.buildWizardTower(this, startX, startY);
    }

    getBlock(x: number, y: number, z: number) {
        return this.chunkManager.getBlock(this.activePlanet, x, y, z);
    }

    setBlock(x: number, y: number, z: number, type: BlockType) {
        this.chunkManager.setBlock(this.activePlanet, x, y, z, type);
    }

    getSurface(x: number, y: number, maxZ: number) {
        return this.chunkManager.getSurface(this.activePlanet, x, y, maxZ);
    }
}

import { getLootForBlock as _getLootForBlock } from './content/loot/LootTables';

export function getLootForBlock(block: BlockType): { item: Item, quantity?: number }[] {
    return _getLootForBlock(block);
}
