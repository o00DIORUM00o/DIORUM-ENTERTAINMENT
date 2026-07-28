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
            
            const blockType = this.getBlock(x, y, z);
            const isGoldChest = blockType === BlockType.GOLD_CHEST;
            
            const keys = Object.keys(ITEMS);
            
            // Define categories for our new Loot Table system
            const junkKeys = ['dirt', 'bone', 'carrot_seed', 'wheat_seed', 'wood', 'stone'];
            const craftingKeys = ['wood', 'stone', 'leather', 'copper_ore', 'iron_ore', 'green_metal_ore', 'red_metal_ore', 'coal', 'mithril_ore', 'fabric'];
            const magicKeys = keys.filter(k => ITEMS[k] && ((ITEMS[k] as any).spellId || (ITEMS[k] as any).damageType === 'MAGIC' || k.includes('mana_potion') || k.includes('staff') || k.includes('wand')));
            const weaponKeys = keys.filter(k => ITEMS[k] && ((ITEMS[k] as any).category === 'WEAPON' || (ITEMS[k] as any).category === 'AMMO'));
            const armorKeys = keys.filter(k => ITEMS[k] && (ITEMS[k] as any).category === 'ARMOR');
            const goldKeys = ['copper_piece', 'silver_piece', 'gold_piece', 'ruby', 'emerald', 'black_diamond', 'amethyst', 'sapphire'];
            const epicKeys = keys.filter(k => ITEMS[k] && ((ITEMS[k] as any).summonsMount || (ITEMS[k] as any).summonsPet || (ITEMS[k] as any).summonsCompanion || k.includes('saddle') || k.includes('boss_token') || k.includes('obsidian')));
            
            const blockKeys = keys.filter(k => ITEMS[k] && ITEMS[k].stackable && ((ITEMS[k] as any).category === 'MATERIAL' || (ITEMS[k] as any).category === 'MISC'));
            
            const lootTables = ['JUNK', 'GOOD_LOOT', 'BLOCKS', 'GOLD', 'EPIC', 'WEAPONS', 'CRAFTING', 'MAGIC', 'ARMOR'];
            
            // Bias Gold Chests towards better tables
            let chosenTable = lootTables[Math.floor(Math.random() * lootTables.length)];
            if (isGoldChest && (chosenTable === 'JUNK' || chosenTable === 'BLOCKS')) {
                 const betterTables = ['GOLD', 'EPIC', 'MAGIC', 'GOOD_LOOT'];
                 chosenTable = betterTables[Math.floor(Math.random() * betterTables.length)];
            }
            
            let pool = [];
            let isStackableTable = false;
            let numItems = isGoldChest ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 4) + 2; // 2 to 5 items, gold 4 to 9
            
            switch (chosenTable) {
                case 'JUNK':
                    pool = junkKeys;
                    break;
                case 'GOOD_LOOT':
                    pool = [...weaponKeys, ...armorKeys, ...goldKeys, 'health_potion', 'mana_potion'];
                    break;
                case 'BLOCKS':
                    pool = blockKeys;
                    isStackableTable = true;
                    break;
                case 'GOLD':
                    pool = goldKeys;
                    break;
                case 'EPIC':
                    pool = [...epicKeys, ...magicKeys, 'gemini_coin'];
                    break;
                case 'WEAPONS':
                    pool = weaponKeys;
                    break;
                case 'CRAFTING':
                    pool = craftingKeys;
                    isStackableTable = true;
                    break;
                case 'MAGIC':
                    pool = magicKeys;
                    break;
                case 'ARMOR':
                    pool = armorKeys;
                    break;
            }
            
            // Fallback if pool empty
            if (pool.length === 0) pool = craftingKeys;
            
            let slot = 0;
            
            for (let i = 0; i < numItems; i++) {
                // Pick random from pool
                let selectedKey = pool[Math.floor(Math.random() * pool.length)];
                
                // Fallback to make sure item exists
                if (!ITEMS[selectedKey]) {
                    const valid = pool.filter(k => ITEMS[k]);
                    if (valid.length > 0) {
                         selectedKey = valid[Math.floor(Math.random() * valid.length)];
                    } else {
                         continue;
                    }
                }
                
                const item = ITEMS[selectedKey];
                let quantity = 1;
                
                if (item.stackable && item.maxStack) {
                    if (isStackableTable) {
                        quantity = Math.floor(Math.random() * (Math.min(item.maxStack, 50))) + 10;
                    } else if (Math.random() < 0.5) {
                        quantity = Math.floor(Math.random() * 5) + 1;
                    }
                    if (quantity > item.maxStack) quantity = item.maxStack;
                    if (quantity < 1) quantity = 1;
                }
                
                // Prevent village bell from spawning
                if (item.id !== 'village_bell') {
                    newChest[slot] = { ...item, quantity };
                    slot++;
                }
            }
            
            // 20% chance to also just add some coins to any chest
            if (Math.random() < 0.2) {
                newChest[slot] = { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 10) + 1 };
                slot++;
            }
            
            // Ultra rare chance for a GEMINI coin (1% in normal, 3% in gold)
            if (Math.random() < (isGoldChest ? 0.03 : 0.01)) {
                newChest[slot] = { ...ITEMS['gemini_coin'], quantity: 1 };
                slot++;
            }
            
            // Add a generated procedural item on rare occasions
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
