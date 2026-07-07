import { BlockType } from '../constants/BlockType';
import { ITEMS } from '../Inventory';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { StructureRegistry } from '../registries/StructureRegistry';

export class StructureGenerator {
    static buildSpawn(world: any) {
        if (world.activePlanet === 'ARETH') {
            this.buildRana(world);
            return;
        }
        if (world.activePlanet === 'HEART') {
            this.buildHeart(world);
            return;
        }

        // Base elevation for most generic start lots
        const spawnZ = 16; 

        // 1. The Arcane Gate (Center-ish)
        world.setBlock(2, 5, spawnZ, BlockType.OBSIDIAN);
        world.setBlock(2, 5, spawnZ + 1, BlockType.ARCANE_GATE);

        // 2. A friendly Tent
        world.setBlock(-4, -4, spawnZ, BlockType.TENT);

        // 3. Campfire
        world.setBlock(-2, -3, spawnZ - 1, BlockType.CASTLE_STONE);
        world.setBlock(-2, -3, spawnZ, BlockType.CAMPFIRE);

        // 4. Merchant
        world.setBlock(4, -2, spawnZ, BlockType.MERCHANT);
        
        // 5. Storage Chest
        world.setBlock(-5, -2, spawnZ, BlockType.CHEST);
        const chestInventory = new Array(80).fill(null);
        chestInventory[0] = { ...ITEMS['sword_1'] };
        chestInventory[1] = { ...ITEMS['pickaxe_1'] };
        chestInventory[2] = { ...ITEMS['tent'] };
        chestInventory[3] = { ...ITEMS['arcane_rune_key'], quantity: 5 };
        chestInventory[5] = { ...ITEMS['axe_1'] };
        chestInventory[6] = { ...ITEMS['red_berry_seed'], quantity: 5 };
        chestInventory[7] = { ...ITEMS['health_potion'], quantity: 5 };
        
        chestInventory[8] = { ...ITEMS['carpenters_bench'] };
        chestInventory[9] = { ...ITEMS['masonry_table'] };
        chestInventory[10] = { ...ITEMS['stone'], quantity: 99 };
        chestInventory[11] = { ...ITEMS['wood'], quantity: 99 };
        
        world.setChest(-5, -2, spawnZ, chestInventory);

        // 6. Lantern Pillars
        const pillars = [
            [-6, -6], [6, -6], [-6, 6], [6, 6]
        ];
        for (const [px, py] of pillars) {
            world.setBlock(px, py, spawnZ, BlockType.CASTLE_STONE);
            world.setBlock(px, py, spawnZ + 1, BlockType.LANTERN_BLOCK);
        }
    }

    static buildRana(world: any) {
        const spawnZ = 12;

        for(let x = -35; x <= 35; x++) {
            for(let y = -35; y <= 35; y++) {
                for (let zOffset = 1; zOffset <= 30; zOffset++) {
                    world.setBlock(x, y, spawnZ + zOffset, BlockType.AIR);
                }

                if (Math.abs(x) <= 10 && Math.abs(y) <= 10) {
                    if (Math.abs(x) > 8 || Math.abs(y) > 8) {
                        world.setBlock(x, y, spawnZ, BlockType.LAVA);
                    } else if (Math.abs(x) > 6 || Math.abs(y) > 6) {
                        world.setBlock(x, y, spawnZ, BlockType.OBSIDIAN);
                    } else {
                        world.setBlock(x, y, spawnZ, BlockType.RED_MARBLE);
                    }
                } else {
                    const distSq = x*x + y*y;
                    if (distSq < 32*32) {
                        world.setBlock(x, y, spawnZ, BlockType.LAVA_ROCK);
                    }
                }
            }
        }
        
        world.setBlock(0, 0, spawnZ + 1, BlockType.ARCANE_GATE);
        world.setBlock(0, 0, spawnZ + 2, BlockType.ARCANE_GATE);
        world.setBlock(0, -1, spawnZ + 3, BlockType.BLACK_MARBLE);
        world.setBlock(0, 1, spawnZ + 3, BlockType.BLACK_MARBLE);
        world.setBlock(0, 0, spawnZ + 4, BlockType.BLACK_MARBLE); 

        const pillars = [
            [-4, -4], [4, -4], [-4, 4], [4, 4]
        ];
        for (const [px, py] of pillars) {
            world.setBlock(px, py, spawnZ + 1, BlockType.OBSIDIAN);
            world.setBlock(px, py, spawnZ + 2, BlockType.OBSIDIAN);
            world.setBlock(px, py, spawnZ + 3, BlockType.CAMPFIRE);
        }

        world.setBlock(3, -2, spawnZ + 1, BlockType.DRACONIC_MERCHANT);
        
        world.setBlock(-3, -2, spawnZ + 1, BlockType.CHEST);
        const chestInventory = new Array(80).fill(null);
        chestInventory[0] = { ...ITEMS['sword_1'] };
        chestInventory[1] = { ...ITEMS['pickaxe_1'] };
        chestInventory[2] = { ...ITEMS['tent'] };
        chestInventory[3] = { ...ITEMS['arcane_rune_key'], quantity: 5 };
        chestInventory[5] = { ...ITEMS['axe_1'] };
        chestInventory[6] = { ...ITEMS['health_potion'], quantity: 5 };
        
        chestInventory[8] = { ...ITEMS['carpenters_bench'] };
        chestInventory[9] = { ...ITEMS['masonry_table'] };
        chestInventory[10] = { ...ITEMS['furnace'] };
        chestInventory[11] = { ...ITEMS['anvil_recipe_scroll'] };
        chestInventory[12] = { ...ITEMS['stone'], quantity: 99 };
        chestInventory[13] = { ...ITEMS['wood'], quantity: 99 };
        
        world.setChest(-3, -2, spawnZ + 1, chestInventory);

        const buildTower = (cx: number, cy: number, radius: number, height: number, blockType: number, floorType: number) => {
            for (let x = cx - radius - 1; x <= cx + radius + 1; x++) {
                for (let y = cy - radius - 1; y <= cy + radius + 1; y++) {
                    const distSq = (x - cx) ** 2 + (y - cy) ** 2;
                    if (distSq <= radius ** 2) {
                        for (let zOffset = 1; zOffset <= height + 2; zOffset++) {
                            world.setBlock(x, y, spawnZ + zOffset, BlockType.AIR);
                        }
                        
                        world.setBlock(x, y, spawnZ, floorType);
                        
                        const innerDistSq = (radius - 1.2) ** 2;
                        if (distSq >= innerDistSq) {
                            for (let zOffset = 1; zOffset <= height; zOffset++) {
                                world.setBlock(x, y, spawnZ + zOffset, blockType);
                            }
                        }
                    }
                }
            }
            const angleToCenter = Math.atan2(-cy, -cx);
            const doorX = Math.round(cx + Math.cos(angleToCenter) * radius);
            const doorY = Math.round(cy + Math.sin(angleToCenter) * radius);
            
            for (let zOffset = 1; zOffset <= 2; zOffset++) {
                world.setBlock(doorX, doorY, spawnZ + zOffset, BlockType.AIR);
                world.setBlock(doorX + (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 0 : 1), doorY + (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 1 : 0), spawnZ + zOffset, BlockType.AIR);
                world.setBlock(doorX - (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 0 : 1), doorY - (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 1 : 0), spawnZ + zOffset, BlockType.AIR);
            }
        };

        const towerPositions = [
            [-18, 0, 5, 4], [18, 0, 5, 4], [0, -18, 5, 4], [0, 18, 5, 4],
            [-15, -15, 4, 3], [15, -15, 4, 3], [-15, 15, 4, 3], [15, 15, 4, 3],
            [-22, -8, 6, 5], [22, 8, 6, 5], [8, -22, 6, 5], [-8, 22, 6, 5],
            [-26, 16, 4, 3], [26, -16, 4, 3], [-16, -26, 4, 3], [16, 26, 4, 3],
        ];

        for (const [px, py, r, h] of towerPositions) {
             buildTower(px, py, r, h, BlockType.OBSIDIAN, BlockType.BLACK_MARBLE);
        }
    }

    static buildHeart(world: any) {
        const spawnZ = 20;

        for(let x = -40; x <= 40; x++) {
            for(let y = -40; y <= 40; y++) {
                for (let zOffset = 1; zOffset <= 25; zOffset++) {
                    world.setBlock(x, y, spawnZ + zOffset, BlockType.AIR);
                }

                if (Math.abs(x) <= 12 && Math.abs(y) <= 12) {
                    if (Math.abs(x) > 10 || Math.abs(y) > 10) {
                        world.setBlock(x, y, spawnZ, BlockType.WATER);
                    } else if (Math.abs(x) > 8 || Math.abs(y) > 8) {
                        world.setBlock(x, y, spawnZ, BlockType.MARBLE);
                    } else {
                        world.setBlock(x, y, spawnZ, BlockType.ANCIENT_LEAVES);
                    }
                } else {
                    const distSq = x*x + y*y;
                    if (distSq < 38*38) {
                        world.setBlock(x, y, spawnZ, BlockType.GRASS);
                    }
                }
            }
        }
        
        world.setBlock(0, 0, spawnZ + 1, BlockType.ARCANE_GATE);
        world.setBlock(0, 0, spawnZ + 2, BlockType.ARCANE_GATE);
        world.setBlock(0, -1, spawnZ + 3, BlockType.MARBLE);
        world.setBlock(0, 1, spawnZ + 3, BlockType.MARBLE);
        world.setBlock(0, 0, spawnZ + 4, BlockType.MARBLE); 

        const pillars = [
            [-6, -6], [6, -6], [-6, 6], [6, 6]
        ];
        for (const [px, py] of pillars) {
            world.setBlock(px, py, spawnZ + 1, BlockType.MARBLE);
            world.setBlock(px, py, spawnZ + 2, BlockType.MARBLE);
            world.setBlock(px, py, spawnZ + 3, BlockType.MARBLE);
            world.setBlock(px, py, spawnZ + 4, BlockType.MARBLE);
            world.setBlock(px, py, spawnZ + 5, BlockType.CRYSTAL);
        }

        world.setBlock(3, -2, spawnZ + 1, BlockType.MERCHANT);
        
        world.setBlock(-3, -2, spawnZ + 1, BlockType.CHEST);
        const chestInventory = new Array(80).fill(null);
        chestInventory[0] = { ...ITEMS['sword_1'] };
        chestInventory[1] = { ...ITEMS['pickaxe_1'] };
        chestInventory[2] = { ...ITEMS['tent'] };
        chestInventory[3] = { ...ITEMS['arcane_rune_key'], quantity: 5 };
        chestInventory[6] = { ...ITEMS['health_potion'], quantity: 5 };
        
        chestInventory[8] = { ...ITEMS['carpenters_bench'] };
        chestInventory[9] = { ...ITEMS['masonry_table'] };
        chestInventory[10] = { ...ITEMS['furnace'] };
        chestInventory[11] = { ...ITEMS['anvil_recipe_scroll'] };
        chestInventory[12] = { ...ITEMS['stone'], quantity: 99 };
        chestInventory[13] = { ...ITEMS['wood'], quantity: 99 };
        
        world.setChest(-3, -2, spawnZ + 1, chestInventory);

        const buildSpire = (cx: number, cy: number, radius: number, height: number, blockType: number, floorType: number) => {
            for (let x = cx - radius - 1; x <= cx + radius + 1; x++) {
                for (let y = cy - radius - 1; y <= cy + radius + 1; y++) {
                    const distSq = (x - cx) ** 2 + (y - cy) ** 2;
                    if (distSq <= radius ** 2) {
                        for (let zOffset = 1; zOffset <= height + 4; zOffset++) {
                            world.setBlock(x, y, spawnZ + zOffset, BlockType.AIR);
                        }
                        
                        world.setBlock(x, y, spawnZ, floorType);
                        
                        const innerDistSq = (radius - 1.2) ** 2;
                        if (distSq >= innerDistSq) {
                            for (let zOffset = 1; zOffset <= height; zOffset++) {
                                world.setBlock(x, y, spawnZ + zOffset, blockType);
                            }
                            if (distSq < (radius - 0.5) ** 2) {
                                world.setBlock(x, y, spawnZ + height + 1, BlockType.CRYSTAL);
                            }
                        }
                    }
                }
            }
            const angleToCenter = Math.atan2(-cy, -cx);
            const doorX = Math.round(cx + Math.cos(angleToCenter) * radius);
            const doorY = Math.round(cy + Math.sin(angleToCenter) * radius);
            
            for (let zOffset = 1; zOffset <= 2; zOffset++) {
                world.setBlock(doorX, doorY, spawnZ + zOffset, BlockType.AIR);
                world.setBlock(doorX + (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 0 : 1), doorY + (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 1 : 0), spawnZ + zOffset, BlockType.AIR);
                world.setBlock(doorX - (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 0 : 1), doorY - (Math.abs(doorX - cx) > Math.abs(doorY - cy) ? 1 : 0), spawnZ + zOffset, BlockType.AIR);
            }
        };

        const spirePositions = [
            [-20, 0, 4, 8], [20, 0, 4, 8], [0, -20, 4, 8], [0, 20, 4, 8],
            [-16, -16, 3, 10], [16, -16, 3, 10], [-16, 16, 3, 10], [16, 16, 3, 10],
            [-24, -10, 5, 12], [24, 10, 5, 12], [10, -24, 5, 12], [-10, 24, 5, 12]
        ];

        for (const [px, py, r, h] of spirePositions) {
             buildSpire(px, py, r, h, BlockType.MARBLE, BlockType.WOOD_FLOOR);
        }
    }

    static buildStructure(world: any, id: string, startX: number, startY: number, startZ: number) {
        const struct = StructureRegistry.get(id);
        if (!struct) return;
        
        for (let z = 0; z < struct.layers.length; z++) {
            const layer = struct.layers[z];
            for (let y = 0; y < layer.length; y++) {
                const row = layer[y];
                for (let x = 0; x < row.length; x++) {
                    const char = row[x];
                    if (char === ' ') continue;
                    
                    const entry = struct.palette[char];
                    if (entry) {
                        const worldX = startX + x - struct.anchorX;
                        const worldY = startY + y - struct.anchorY;
                        const worldZ = startZ + z - struct.anchorZ;
                        world.setBlock(worldX, worldY, worldZ, entry.block);
                    }
                }
            }
        }
    }


    static buildWizardTower(world: any, startX: number, startY: number) {
        world.hasBuiltWizardTower = true;
        
        let surfaceZ = 15;
        const surfaceInfo = world.getSurface(startX, startY, WORLD_HEIGHT - 1);
        if (surfaceInfo.z > 0) {
            surfaceZ = surfaceInfo.z;
        }

        this.buildStructure(world, 'WIZARD_TOWER', startX, startY, surfaceZ);
        
        world.wizardTowerEntrance = { x: startX, y: startY, z: surfaceZ + 1 };
    }
}
