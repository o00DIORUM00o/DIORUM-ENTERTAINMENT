import { PlanetRegistry } from './registries/PlanetRegistry';
import { StructureRegistry } from './registries/StructureRegistry';
import { CHUNK_SIZE, WORLD_HEIGHT } from './Constants';
import { Item, ITEMS } from './Inventory';
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
    activePlanet: string = 'HERAT';
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
    
    get isBloodMoon(): boolean {
        return this.dayCount > 1 && this.dayCount % 7 === 0 && (this.timeOfDay >= 19.0 || this.timeOfDay < 5.0);
    }

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
            
            // Build pools based on user suggestion
            const commonKeys = ['fabric_gloves', 'leather_gloves', 'copper_piece', 'silver_piece', 'carrot', 'red_berry', 'health_potion', 'mana_potion', 'bone', 'leather', 'wood', 'stone', 'dirt'];
            
            const rareKeys = keys.filter(k => {
                const item = ITEMS[k];
                if (!item) return false;
                if (commonKeys.includes(k)) return false;
                
                const cat = (item as any).category;
                const isBlock = !!(item as any).ITEM_TO_BLOCK || cat === 'MATERIAL' || cat === 'MISC'; // Note: actual block check would import ITEM_TO_BLOCK but we approximate with MATERIAL/MISC
                const isSpellbook = !!(item as any).spellId;
                
                if (cat === 'WEAPON' || cat === 'ARMOR' || isBlock || isSpellbook || cat === 'AMMO' || cat === 'CONSUMABLE') return true;
                return false;
            });
            
            const legendaryKeys = keys.filter(k => {
                const item = ITEMS[k];
                if (!item) return false;
                const cat = (item as any).category;
                const isSummon = (item as any).summonsMount || (item as any).summonsPet || (item as any).summonsCompanion;
                
                if (cat === 'TOOL' || isSummon || k.includes('saddle')) return true;
                return false;
            });
            
            const numItems = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
            let slot = 0;
            
            for (let i = 0; i < numItems; i++) {
                const roll = Math.random();
                let selectedKey;
                let isStackOfBlocks = false;
                
                if (roll < 0.05 && legendaryKeys.length > 0) {
                    // Legendary (5%)
                    if (Math.random() < 0.3) {
                        // Stack of blocks
                        const blockKeys = keys.filter(k => {
                            const it = ITEMS[k];
                            const cat = (it as any)?.category;
                            return (cat === 'MATERIAL' || cat === 'MISC') && it?.stackable;
                        });
                        if (blockKeys.length > 0) {
                            selectedKey = blockKeys[Math.floor(Math.random() * blockKeys.length)];
                            isStackOfBlocks = true;
                        } else {
                            selectedKey = legendaryKeys[Math.floor(Math.random() * legendaryKeys.length)];
                        }
                    } else {
                        selectedKey = legendaryKeys[Math.floor(Math.random() * legendaryKeys.length)];
                    }
                } else if (roll < 0.30 && rareKeys.length > 0) {
                    // Rare (25%)
                    selectedKey = rareKeys[Math.floor(Math.random() * rareKeys.length)];
                } else {
                    // Common (70%)
                    const availableCommon = commonKeys.filter(k => ITEMS[k]); // ensure item exists
                    if (availableCommon.length > 0) {
                        selectedKey = availableCommon[Math.floor(Math.random() * availableCommon.length)];
                    } else {
                        selectedKey = keys[Math.floor(Math.random() * keys.length)]; // fallback
                    }
                }
                
                if (selectedKey) {
                    const item = ITEMS[selectedKey];
                    let quantity = 1;
                    if (isStackOfBlocks && item.maxStack) {
                        quantity = Math.floor(Math.random() * 50) + 20; // Stack of 20-69
                        if (quantity > item.maxStack) quantity = item.maxStack;
                    } else if (item.stackable && item.maxStack && item.maxStack > 1) {
                        if (roll >= 0.30) {
                            quantity = Math.floor(Math.random() * 3) + 1;
                        } else {
                            quantity = 1;
                        }
                    }
                    
                    // Filter out bell
                    if (item.id !== 'village_bell') {
                        newChest[slot] = { ...item, quantity };
                        slot++;
                    }
                }
            }
            // Add some gold pieces randomly
            if (Math.random() < 0.5) {
                newChest[slot] = { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 15) + 5 };
                slot++;
            }
            
            // Ultra rare chance for a GEMINI coin
            if (Math.random() < 0.01) {
                newChest[slot] = { ...ITEMS['gemini_coin'], quantity: 1 };
                slot++;
            }

            // Chance for colored metal swords
            if (Math.random() < 0.15) {
                const colorSwords = [
                    'copper_broadsword', 'iron_longsword', 'mithril_greatsword', 'sword_1', 'silver_sword', 'platinum_sword', 'gold_sword', 'star_metal_sword',
                    'green_metal_sword', 'yellow_metal_sword', 'blue_metal_sword', 
                    'red_metal_sword', 'black_metal_sword', 'purple_metal_sword', 'orange_metal_sword'
                ];
                const swordKey = colorSwords[Math.floor(Math.random() * colorSwords.length)];
                if (ITEMS[swordKey]) {
                    newChest[slot] = { ...ITEMS[swordKey], quantity: 1 };
                    slot++;
                }
            }
            
            // Add a generated item on rare occasions
            if (Math.random() < 0.35) {
                const dangerLevel = Math.abs(z - 15) * 2 + 1; // Deeper/Higher = better
                const roll = Math.random();
                if (roll > 0.75) {
                    newChest[slot] = ItemGenerator.generateWeapon(dangerLevel);
                } else if (roll > 0.50) {
                    newChest[slot] = ItemGenerator.generateArmor(dangerLevel);
                } else if (roll > 0.25) {
                    newChest[slot] = ItemGenerator.generateBow(dangerLevel);
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
