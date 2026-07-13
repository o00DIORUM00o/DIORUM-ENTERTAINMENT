import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { Chunk } from './Chunk';
import { createNoise2D } from 'simplex-noise';
import { TerrainGenerator } from './TerrainGenerator';
import { DungeonTemplate } from './DungeonTemplate';
import { CastleTemplate } from './CastleTemplate';

const noise2D = createNoise2D();

export class LotGenerator {
    static generate(chunk: Chunk, planetDef: any, PL_BASE_ELEV: number) {
        if (planetDef.id === 'TARHE') return;
        
        const { cx, cy } = chunk;
        const minWx = cx * CHUNK_SIZE;
        const maxWx = minWx + CHUNK_SIZE - 1;
        const minWy = cy * CHUNK_SIZE;
        const maxWy = minWy + CHUNK_SIZE - 1;

        const N_min = Math.floor((minWx - 15) / 128);
        const N_max = Math.floor((maxWx + 15) / 128);
        const M_min = Math.floor((minWy - 15) / 128);
        const M_max = Math.floor((maxWy + 15) / 128);

        for (let N = N_min; N <= N_max; N++) {
            for (let M = M_min; M <= M_max; M++) {
                const ix = N * 128;
                const iy = M * 128;

                // Seed based on intersection coordinate
                const hash = Math.abs(noise2D(ix * 0.123, iy * 0.456));

                let lotTypeVal = 'CAMP';
                
                if (ix === 0 && iy === 0) {
                    lotTypeVal = 'SPAWN_CAMP';
                } else if (ix === 0 && iy === -128 && (!planetDef.id || planetDef.id === 'THREA' || !['ARETH','THAER','TERHA','TARHE'].includes(planetDef.id))) {
                    lotTypeVal = 'NORTH_DUNGEON';
                } else if (ix === -128 && iy === 0 && (!planetDef.id || planetDef.id === 'THREA' || !['ARETH','THAER','TERHA','TARHE'].includes(planetDef.id))) {
                    lotTypeVal = 'WEST_CASTLE';
                } else if (planetDef.id === 'ARETH') {
                    if (hash < 0.25) lotTypeVal = 'DRAGON_LAIR_LOT';
                    else if (hash < 0.50) lotTypeVal = 'KOBOLD_MINING_RIG';
                    else if (hash < 0.80) lotTypeVal = 'BASALT_PILLARS';
                    else lotTypeVal = 'LAVA_DELTA';
                } else if (planetDef.id === 'THAER') {
                    if (hash < 0.35) lotTypeVal = 'SQUIRREL_FOLK_VILLAGE';
                    else if (hash < 0.65) lotTypeVal = 'BEAST_TAMER_OUTPOST';
                    else lotTypeVal = 'PRIMAL_BEAST_DEN';
                } else if (planetDef.id === 'TERHA') {
                    if (hash < 0.40) lotTypeVal = 'ORC_STRONGHOLD';
                    else if (hash < 0.70) lotTypeVal = 'SLIME_BOG';
                    else lotTypeVal = 'ANCIENT_WILLOW';
                } else if (planetDef.id === 'THREA') {
                    if (hash < 0.02) lotTypeVal = 'MARBLE_DUNGEON';
                    else if (hash < 0.04) lotTypeVal = 'GREEN_STONE_DUNGEON';
                    else if (hash < 0.06) lotTypeVal = 'OBSIDIAN_DUNGEON';
                    else if (hash < 0.08) lotTypeVal = 'ICE_DUNGEON';
                    else if (hash < 0.10) lotTypeVal = 'BLOOD_STONE_DUNGEON';
                    else if (hash < 0.12) lotTypeVal = 'FOREST_RUINS_DUNGEON';
                    else if (hash < 0.14) lotTypeVal = 'ROYAL_TOMB_DUNGEON';
                    else if (hash < 0.16) lotTypeVal = 'CRYSTAL_CAVERN_DUNGEON';
                    else if (hash < 0.18) lotTypeVal = 'LAVA_FORGE_DUNGEON';
                    else if (hash < 0.20) lotTypeVal = 'DESERT_CRYPT_DUNGEON';
                    else if (hash < 0.22) lotTypeVal = 'NIGHTMARE_DUNGEON';
                    else if (hash < 0.24) lotTypeVal = 'MAGIC_ACADEMY_DUNGEON';
                    else if (hash < 0.26) lotTypeVal = 'SUNKEN_ZIGGURAT_DUNGEON';
                    else if (hash < 0.28) lotTypeVal = 'VILLAGE';
                    else if (hash < 0.32) lotTypeVal = 'HALFLING_VILLAGE';
                    else if (hash < 0.38) lotTypeVal = 'FARM';
                    else if (hash < 0.44) lotTypeVal = 'POND';
                    else if (hash < 0.48) lotTypeVal = 'RUINS';
                    else if (hash < 0.52) lotTypeVal = 'GRAVEYARD';
                    else if (hash < 0.56) lotTypeVal = 'WIZARD_TOWER';
                    else if (hash < 0.60) lotTypeVal = 'HUMAN_OUTPOST';
                    else if (hash < 0.64) lotTypeVal = 'CROSSROAD_VILLAGE';
                    else if (hash < 0.68) lotTypeVal = 'ROADSIDE_MERCHANT';
                    else if (hash < 0.72) lotTypeVal = 'ROADSIDE_INN';
                    else if (hash < 0.76) lotTypeVal = 'BANDIT_TOLL_GATE';
                    else if (hash < 0.80) lotTypeVal = 'RUINED_WAGON_AMBUSH';
                    else if (hash < 0.85) lotTypeVal = 'ORC_WAR_CAMP';
                    else if (hash < 0.90) lotTypeVal = 'DEEP_DUNGEON';
                    else lotTypeVal = 'HUMAN_CASTLE';
                } else {
                    if (hash < 0.05) lotTypeVal = 'VILLAGE';
                    else if (hash < 0.10) lotTypeVal = 'HALFLING_VILLAGE';
                    else if (hash < 0.15) lotTypeVal = 'RUINS';
                    else if (hash < 0.20) lotTypeVal = 'GRAVEYARD';
                    else if (hash < 0.25) lotTypeVal = 'FARM';
                    else if (hash < 0.30) lotTypeVal = 'POND';
                    else if (hash < 0.35) lotTypeVal = 'POMERANIAN_CARAVAN_CAMP';
                    else if (hash < 0.40) lotTypeVal = 'WOLF_FOLK_CAMP';
                    else if (hash < 0.45) lotTypeVal = 'TERRIER_OUTPOST';
                    else if (hash < 0.50) lotTypeVal = 'PIT_BULL_OUTPOST';
                    else if (hash < 0.55) lotTypeVal = 'WIZARD_TOWER';
                    else if (hash < 0.60) lotTypeVal = 'ARENA';
                    else if (hash < 0.65) lotTypeVal = 'ARENA_WORM';
                    else if (hash < 0.70) lotTypeVal = 'ARENA_WIZARD';
                    else if (hash < 0.75) lotTypeVal = 'HUMAN_CASTLE';
                    else if (hash < 0.80) lotTypeVal = 'HUMAN_OUTPOST';
                    else if (hash < 0.85) lotTypeVal = 'FAIRY_RING';
                    else if (hash < 0.88) lotTypeVal = 'TEMPLE';
                    else if (hash < 0.92) lotTypeVal = 'DEEP_DUNGEON';
                    else if (hash < 0.95) lotTypeVal = 'CROSSROAD_VILLAGE';
                    else if (hash < 0.96) lotTypeVal = 'ROADSIDE_MERCHANT';
                    else if (hash < 0.97) lotTypeVal = 'ROADSIDE_INN';
                    else if (hash < 0.977) lotTypeVal = 'PILGRIMS_REST';
                    else if (hash < 0.985) lotTypeVal = 'BANDIT_TOLL_GATE';
                    else if (hash < 0.99) lotTypeVal = 'RUINED_WAGON_AMBUSH';
                    else if (hash < 0.995) lotTypeVal = 'ORC_WAR_CAMP';
                    else if (hash < 0.997) lotTypeVal = 'DRACONIC_ROOST';
                    else lotTypeVal = 'CASTLE';
                }
                
                const baseZ = PL_BASE_ELEV + 1;

                for (let x = 0; x < CHUNK_SIZE; x++) {
                    for (let y = 0; y < CHUNK_SIZE; y++) {
                        const wx = minWx + x;
                        const wy = minWy + y;
                        
                        const dx = wx - ix;
                        const dy = wy - iy;
                        
                        if (Math.abs(dx) <= 15 && Math.abs(dy) <= 15) {
                            // Default grass base
                            chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRASS;
                            
                            // Let's add LOT enhancements!
                            if (lotTypeVal !== 'GRAVEYARD' && lotTypeVal !== 'POND' && lotTypeVal !== 'DEEP_DUNGEON' && lotTypeVal !== 'CASTLE' && lotTypeVal !== 'ARENA' && lotTypeVal !== 'WIZARD_TOWER') {
                                // Add small wooden fences to the outer edges of the lot
                                if (Math.abs(dx) === 15 || Math.abs(dy) === 15) {
                                    if (Math.abs(dx) > 4 && Math.abs(dy) > 4) { // Leave gaps in the middle for entrances
                                        if ((wx + wy) % 2 === 0) { // Alternating fence posts
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                            chunk.heightMap[x + y * CHUNK_SIZE] = baseZ + 1;
                                        }
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT; // Dirt under fences
                                    }
                                }
                                
                                // Draw a neat paved road connecting to the center
                                if (Math.abs(dx) <= 1 || Math.abs(dy) <= 1) {
                                     chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PAVED_ROAD;
                                }
                            }

                            if (lotTypeVal === 'WIZARD_TOWER' || lotTypeVal === 'FAIRY_RING') {
                                // Magical Blue Glade base
                                if (Math.abs(noise2D(wx * 0.1, wy * 0.1)) > 0) {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BLUE_DIRT;
                                } else {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BLUE_STONE;
                                }
                            
                                if (lotTypeVal === 'FAIRY_RING') {
                                    const distSq = dx*dx + dy*dy;
                                    if (distSq > 30 && distSq < 45) {
                                        if (Math.random() < 0.2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GLOWING_MUSHROOM_BLOCK;
                                    }
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.FAIRY_SPAWNER;
                                    }
                                }
                            } else if (lotTypeVal === 'TEMPLE') {
                                if (Math.abs(dx) <= 6 && Math.abs(dy) <= 8) {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MARBLE;
                                    
                                    // Floor padding and altar
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ALTAR_DIVINE;
                                    }

                                    // Pillars
                                    if ((Math.abs(dx) === 6 || Math.abs(dx) === 3 || Math.abs(dx) === 0) &&
                                        (Math.abs(dy) === 8 || Math.abs(dy) === 4 || Math.abs(dy) === 0)) {
                                        if (dx !== 0 || dy !== 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MARBLE;
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MARBLE;
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 3) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MARBLE;
                                            if (Math.random() > 0.5) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 4) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TORCH;
                                            }
                                        }
                                    }
                                    
                                    // Remove grass decorations
                                    for(let zOff = 1; zOff < 10; zOff++) {
                                        if (zOff !== 1 || (dx !== 0 && dy !== 0 && !((Math.abs(dx) === 6 || Math.abs(dx) === 3 || Math.abs(dx) === 0) && (Math.abs(dy) === 8 || Math.abs(dy) === 4 || Math.abs(dy) === 0)))) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + zOff) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                        }
                                    }
                                } else {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRASS;
                                }
                            } else if (lotTypeVal === 'GRAVEYARD') {
                                // 20% dirt path
                                if (Math.abs(noise2D(wx * 0.1, wy * 0.1)) > 0.2) {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
                                } else {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRASS;
                                }
                                
                                // Gravestones & bones
                                if (Math.abs(dx) > 2 && Math.abs(dy) > 2 && dx % 4 === 0 && dy % 4 === 0) {
                                    if (Math.abs(noise2D(wx * 0.5, wy * 0.5)) > 0.3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRAVESTONE;
                                    }
                                } else if (Math.abs(dx) > 2 && Math.abs(dy) > 2 && Math.abs(noise2D(wx * 0.7, wy * 0.7)) > 0.8) {
                                    chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BONE_PILE_SPAWNER;
                                }
                                
                                // Iron fence
                                if (Math.abs(dx) === 14 || Math.abs(dy) === 14) {
                                    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { 
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.IRON_BLOCK;
                                    }
                                }
                            } else if (lotTypeVal === 'DEEP_DUNGEON') {
                                if (dx === 0 && dy === 0) {
                                    chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.QUEST_DUNGEON_SPAWNER;
                                }
                            } else if (lotTypeVal === 'CASTLE') {
                                if (Math.abs(dx) <= 12 && Math.abs(dy) <= 12) {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                    chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    
                                    // Walls
                                    if (Math.abs(dx) === 12 || Math.abs(dy) === 12) {
                                        if (dy === 12 && Math.abs(dx) <= 2) {
                                            // Gate
                                            if (Math.abs(dx) === 2) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 3) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TORCH;
                                            }
                                        } else {
                                            for (let h = 1; h <= 4; h++) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                            }
                                            if ((x + y) % 2 === 0) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 5) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                            }
                                        }
                                    }
                                    
                                    // Spawner
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DARK_KNIGHT_TENT;
                                    }
                                } else if (Math.abs(dx) <= 14 && Math.abs(dy) <= 14) {
                                    if (Math.abs(dx) === 14 || Math.abs(dy) === 14) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                    if (dy >= 12 && dy <= 14 && Math.abs(dx) <= 2) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                    }
                                }
                            } else if (lotTypeVal === 'ARENA' || lotTypeVal === 'ARENA_WORM' || lotTypeVal === 'ARENA_WIZARD') {
                                if (Math.abs(dx) <= 12 && Math.abs(dy) <= 12) {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SAND;
                                    chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    
                                    // Walls
                                    if (Math.abs(dx) === 12 || Math.abs(dy) === 12) {
                                        for (let h = 1; h <= 6; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                        }
                                    }
                                    // Spawner
                                    if (dx === 0 && dy === 0) {
                                        let b = BlockType.ARETH_SPAWNER;
                                        if (lotTypeVal === 'ARENA_WORM') b = BlockType.ARETH_SPAWNER;
                                        if (lotTypeVal === 'ARENA_WIZARD') b = BlockType.ARETH_SPAWNER;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = b;
                                    }
                                }
                            } else if (lotTypeVal === 'CROSSROAD_VILLAGE') {
                                if (dx === 0 && dy === 0) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.VILLAGE_BELL;
                                
                                // Bag Merchant Stall
                                if (dx === -5 && dy === -5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BAG_MERCHANT_STALL;
                                
                                // Berry Farmer Shed
                                if (dx === 5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BERRY_FARMER_SHED;
                                
                                // Till soil around berry farmer
                                if (dx >= 3 && dx <= 7 && dy >= 3 && dy <= 7 && !(dx === 5 && dy === 5)) {
                                    if (Math.random() < 0.6) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TILLED_SOIL_DRY;
                                        if (Math.random() < 0.4) {
                                            const bushTypes = [BlockType.RED_BERRY_BUSH, BlockType.BLUE_BERRY_BUSH, BlockType.YELLOW_BERRY_BUSH];
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = bushTypes[Math.floor(Math.random() * bushTypes.length)];
                                        }
                                    }
                                }

                                // General village house
                                if (dx >= -8 && dx <= -4 && dy >= 4 && dy <= 8) {
                                    if (Math.abs(dx) === 8 || Math.abs(dx) === 4 || Math.abs(dy) === 8 || Math.abs(dy) === 4) {
                                        if (dx === -6 && dy === 8) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DOOR_CLOSED;
                                        else {
                                            for(let h=1; h<3; h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                    } else {
                                        if (dx === -6 && dy === 6) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT_TENT;
                                    }
                                }
                                
                                // Additional npc spawners
                                if (dx === 6 && dy === -6) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WANDERING_BARD_TENT;

                            } else if (lotTypeVal === 'ROADSIDE_MERCHANT') {
                                if (Math.abs(dx) <= 3 && Math.abs(dy) <= 3) {
                                    for(let h=0;h<3;h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                    chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 3) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LEAVES;
                                    if(dx === 0 && dy === 0) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT;
                                }
                            } else if (lotTypeVal === 'ROADSIDE_INN') {
                                if (Math.abs(dx) <= 6 && Math.abs(dy) <= 5) {
                                    // Inn House
                                    for(let h=0;h<4;h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                    if (dx === 0 && dy === 5) { // Door
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DOOR_CLOSED;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                    if (Math.abs(dx) === 6 && Math.abs(dy) === 5) { // Torches
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                                    }
                                    if ((Math.abs(dx) === 3 || Math.abs(dx) === 4) && Math.abs(dy) < 3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BED;
                                    }
                                    if (dx === -5 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT;
                                    }
                                }
                            } else if (lotTypeVal === 'PILGRIMS_REST') {
                                if (Math.abs(dx) <= 7 && Math.abs(dy) <= 7) {
                                    // Serene stone path footprint
                                    if (Math.random() > 0.1) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                    }

                                    // Water basin at the center
                                    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                    
                                    // A shrine overlooking the water
                                    if (dx === 0 && dy === -3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SHRINE;
                                    }

                                    // Surrounding priest tents and rest spots
                                    if (dx === 5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PRIEST_TENT;
                                    if (dx === -5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PRIEST_TENT;

                                    if (dx === -4 && dy === -4) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                    }
                                    if (dx === 4 && dy === -4) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                    }

                                    // Benches (Wooden stairs)
                                    if ((Math.abs(dx) === 3 && Math.abs(dy) <= 1) || (Math.abs(dy) === 3 && Math.abs(dx) <= 1)) {
                                        if (dx !== 0 || dy === 3 || dy === -3) { // keep path to shrine clear
                                            if (Math.random() > 0.5) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOODEN_STAIRCASE;
                                            }
                                        }
                                    }

                                    // Serene lighting
                                    if ((Math.abs(dx) === 6 && Math.abs(dy) === 6)) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                                    }
                                }
                            } else if (lotTypeVal === 'BANDIT_TOLL_GATE') {
                                if (Math.abs(dx) <= 5 && Math.abs(dy) <= 5) {
                                    // Paved area
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.COBBLESTONE_ROAD;
                                    
                                    // Wooden barricades restricting road access
                                    if (Math.abs(dx) === 5 || Math.abs(dy) === 5) {
                                        if (dx !== 0 && dy !== 0 && Math.abs(dx) !== 1 && Math.abs(dy) !== 1) { // Leave small gap
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        } else {
                                            // Place a heavy iron block to block wagons
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.IRON_BLOCK;
                                        }
                                    }
                                    
                                    // Corner guard towers
                                    if (Math.abs(dx) === 4 && Math.abs(dy) === 4) {
                                        for (let h = 1; h <= 3; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 4) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
                                        if (dx === -4 && dy === -4) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 5) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ARCHER_TENT;
                                    }
                                    
                                    // Inside area
                                    if (dx === 2 && dy === 2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DARK_KNIGHT_TENT;
                                    if (dx === -2 && dy === 2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                                    if (dx === 2 && dy === -2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                }
                            } else if (lotTypeVal === 'RUINED_WAGON_AMBUSH') {
                                if (Math.abs(dx) <= 4 && Math.abs(dy) <= 4) {
                                    // Tilled soil to indicate rough, damaged ground
                                    if (Math.random() > 0.3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TILLED_SOIL_DRY;
                                    }
                                    
                                    // Ruined wagon made of wood floors / walls
                                    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 2 && Math.random() > 0.4) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
                                    }
                                    
                                    // Skeleton spawners / Bones
                                    if (dx === 2 && dy === 2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BONE_PILE_SPAWNER;
                                    if (dx === -3 && dy === 1) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRAVESTONE;
                                    
                                    // Scattered pots and a chest
                                    if (Math.random() < 0.1) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.POT;
                                    if (dx === 0 && dy === 0) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                    
                                    // Hidden ambushers
                                    if (dx === -4 && dy === -4) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GOBLIN_TENT_ROCKHURLER;
                                    if (dx === 4 && dy === 4) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GOBLIN_TENT_ALCHEMIST;
                                }
                            } else if (lotTypeVal === 'ORC_WAR_CAMP') {
                                if (Math.abs(dx) <= 12 && Math.abs(dy) <= 12) {
                                    // Make ground rough dirt and mud
                                    if (Math.random() > 0.3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MUD; 
                                    }

                                    // Spiked wooden barricades on perimeter
                                    if (Math.abs(dx) === 12 || Math.abs(dy) === 12) {
                                        // Leave an entrance
                                        if (Math.abs(dx) > 3 && Math.abs(dy) > 3) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                    }
                                    
                                    // Massive central bonfire
                                    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                        if (dx === 0 && dy === 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                                        }
                                    }
                                    
                                    // Placed tents
                                    if (dx === 5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_BRUTE;
                                    if (dx === -5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_HUNTER;
                                    if (dx === 5 && dy === -5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_SHAMAN;
                                    if (dx === -5 && dy === -5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT;
                                    
                                    if (dx === 0 && dy === 8) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_BRUTE;
                                    if (dx === 0 && dy === -8) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_HUNTER;
                                    if (dx === 8 && dy === 0) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_SHAMAN;
                                    if (dx === -8 && dy === 0) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT;

                                    // Spawners and totems
                                    if (dx === 0 && dy === -3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BONE_PILE_SPAWNER;
                                    }
                                    if (Math.abs(dx) === 3 && Math.abs(dy) === 3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TORCH;
                                    }
                                    
                                    // Random loot & supplies
                                    if (dx === 10 && dy === 10) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                    if (dx === -10 && dy === 10) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                    
                                    if ((Math.abs(dx) === 10 || Math.abs(dy) === 10) && Math.random() < 0.2) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.POT;
                                    }
                                }
                            } else if (lotTypeVal === 'DRACONIC_ROOST') {
                                if (Math.abs(dx) <= 12 && Math.abs(dy) <= 12) {
                                    const distSq = dx*dx + dy*dy;
                                    
                                    // Make ground ash and obsidian crater
                                    if (distSq < 13 * 13) {
                                        if (distSq < 7 * 7) {
                                            chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA_ROCK;
                                        } else {
                                            chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN; 
                                        }
                                    }
                                    
                                    // Lava pools in corners
                                    if (distSq < 11 * 11 && distSq >= 7 * 7 && Math.random() < 0.3) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA_POOL;
                                    }

                                    // Spiked dragon bones on perimeter
                                    if (distSq >= 10 * 10 && distSq <= 12 * 12) {
                                        if (Math.random() < 0.15) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DRAGON_BONE;
                                            if (Math.random() < 0.5) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DRAGON_BONE;
                                            }
                                        }
                                    }
                                    
                                    // Massive central runed obsidian
                                    if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.RUNED_OBSIDIAN;
                                        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.RUNED_OBSIDIAN;
                                        }
                                        if (dx === 0 && dy === 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 3) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.RUNED_OBSIDIAN;
                                            // Draconic shrine on top
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 4) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DRACONIC_SHRINE;
                                        }
                                    }
                                    
                                    // Tents and Merchants
                                    if (dx === 0 && dy === -8) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_DRAGONKEEPER;
                                    }
                                    if (dx === 0 && dy === 8) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_DRAGONKEEPER;
                                    }
                                    if (dx === -8 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DRACONIC_MERCHANT;
                                    }

                                    // Treasure/Chests
                                    if (dx === 8 && dy === 3) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                    if (dx === -8 && dy === -3) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.01 ? BlockType.GOLD_CHEST : BlockType.CHEST;
                                }
                            } else if (lotTypeVal === 'NORTH_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.DUNGEON_BRICK,
                                    floorBlock: BlockType.DUNGEON_FLOOR,
                                    pillarBlock: BlockType.RUNED_DUNGEON_BRICK,
                                    ceilingBlock: BlockType.CASTLE_STONE,
                                    surfaceRuinBlock: BlockType.RUNED_CASTLE_STONE,
                                    spawnersByFloor: [BlockType.BONE_PILE_SPAWNER, BlockType.ORC_TENT_BRUTE]
                                });
                            } else if (lotTypeVal === 'MARBLE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.MARBLE,
                                    floorBlock: BlockType.BLACK_MARBLE,
                                    pillarBlock: BlockType.MARBLE,
                                    ceilingBlock: BlockType.MARBLE,
                                    surfaceRuinBlock: BlockType.MARBLE,
                                    spawnersByFloor: [BlockType.KOBOLD_TENT_WARRIOR, BlockType.GOBLIN_TENT_ROCKHURLER]
                                });
                            } else if (lotTypeVal === 'GREEN_STONE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.GREEN_STONE,
                                    floorBlock: BlockType.DUNGEON_FLOOR,
                                    pillarBlock: BlockType.RUNED_GREEN_STONE,
                                    ceilingBlock: BlockType.GREEN_STONE,
                                    surfaceRuinBlock: BlockType.RUNED_GREEN_STONE,
                                    spawnersByFloor: [BlockType.ORC_TENT_BRUTE, BlockType.ORC_TENT_BRUTE]
                                });
                            } else if (lotTypeVal === 'OBSIDIAN_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 3,
                                    wallBlock: BlockType.OBSIDIAN,
                                    floorBlock: BlockType.BLACK_MARBLE,
                                    pillarBlock: BlockType.RUNED_OBSIDIAN,
                                    ceilingBlock: BlockType.OBSIDIAN,
                                    surfaceRuinBlock: BlockType.RUNED_OBSIDIAN,
                                    spawnersByFloor: [BlockType.DARK_ELF_SPAWNER, BlockType.ABYSSAL_SPAWNER, BlockType.ABYSSAL_SPAWNER]
                                });
                            } else if (lotTypeVal === 'ICE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.ICE,
                                    floorBlock: BlockType.GLACIAL_ICE,
                                    pillarBlock: BlockType.ICE,
                                    ceilingBlock: BlockType.ICE,
                                    surfaceRuinBlock: BlockType.GLACIAL_ICE,
                                    spawnersByFloor: [BlockType.WINTER_ELF_TENT, BlockType.FROST_CASTER_TENT]
                                });
                            } else if (lotTypeVal === 'BLOOD_STONE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.BLOOD_STONE,
                                    floorBlock: BlockType.RED_MARBLE,
                                    pillarBlock: BlockType.RUNED_BLOOD_STONE,
                                    ceilingBlock: BlockType.BLOOD_STONE,
                                    surfaceRuinBlock: BlockType.BLOOD_STONE,
                                    spawnersByFloor: [BlockType.KOBOLD_TENT_WARRIOR, BlockType.ORC_TENT_BRUTE]
                                });
                            } else if (lotTypeVal === 'FOREST_RUINS_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.GREEN_STONE,
                                    floorBlock: BlockType.GREEN_DIRT,
                                    pillarBlock: BlockType.ANCIENT_WOOD,
                                    ceilingBlock: BlockType.GREEN_LEAVES,
                                    surfaceRuinBlock: BlockType.ANCIENT_WOOD,
                                    spawnersByFloor: [BlockType.GOBLIN_TENT_GARDENER, BlockType.FUNGI_FOLK_TENT]
                                });
                            } else if (lotTypeVal === 'ROYAL_TOMB_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 3,
                                    wallBlock: BlockType.MARBLE,
                                    floorBlock: BlockType.YELLOW_MARBLE,
                                    pillarBlock: BlockType.DUNGEON_BRICK,
                                    ceilingBlock: BlockType.STONE,
                                    surfaceRuinBlock: BlockType.RUNED_MARBLE,
                                    spawnersByFloor: [BlockType.SPHINX_SPAWNER, BlockType.KING_SPAWNER, BlockType.KING_SPAWNER]
                                });
                            } else if (lotTypeVal === 'CRYSTAL_CAVERN_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.PURPLE_STONE,
                                    floorBlock: BlockType.PURPLE_MARBLE,
                                    pillarBlock: BlockType.PURPLE_CRYSTAL,
                                    ceilingBlock: BlockType.PURPLE_STONE,
                                    surfaceRuinBlock: BlockType.PURPLE_CRYSTAL,
                                    spawnersByFloor: [BlockType.OBSERVER_SPAWNER, BlockType.DARK_KNIGHT_TENT]
                                });
                            } else if (lotTypeVal === 'LAVA_FORGE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.RED_STONE,
                                    floorBlock: BlockType.RED_METAL_BLOCK,
                                    pillarBlock: BlockType.RUNED_RED_STONE,
                                    ceilingBlock: BlockType.RED_STONE,
                                    surfaceRuinBlock: BlockType.RUNED_RED_STONE,
                                    spawnersByFloor: [BlockType.LAVA_GOLEM_SPAWNER, BlockType.ORC_TENT_SHAMAN]
                                });
                            } else if (lotTypeVal === 'DESERT_CRYPT_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.YELLOW_STONE,
                                    floorBlock: BlockType.YELLOW_MARBLE,
                                    pillarBlock: BlockType.RUNED_YELLOW_STONE,
                                    ceilingBlock: BlockType.YELLOW_STONE,
                                    surfaceRuinBlock: BlockType.RUNED_YELLOW_STONE,
                                    spawnersByFloor: [BlockType.BONE_PILE_SPAWNER, BlockType.ORC_TENT_HUNTER]
                                });
                            } else if (lotTypeVal === 'NIGHTMARE_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 3,
                                    wallBlock: BlockType.ABYSSAL_BRICK,
                                    floorBlock: BlockType.BLACK_STONE,
                                    pillarBlock: BlockType.RUNED_ABYSSAL_BRICK,
                                    ceilingBlock: BlockType.ABYSSAL_BRICK,
                                    surfaceRuinBlock: BlockType.RUNED_ABYSSAL_BRICK,
                                    spawnersByFloor: [BlockType.PHANTOM_WIZARD_SPAWNER, BlockType.GARGOYLE_SPAWNER, BlockType.GARGOYLE_SPAWNER]
                                });
                            } else if (lotTypeVal === 'MAGIC_ACADEMY_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 2,
                                    wallBlock: BlockType.BLUE_MARBLE,
                                    floorBlock: BlockType.BLUE_STONE,
                                    pillarBlock: BlockType.RUNED_BLUE_MARBLE,
                                    ceilingBlock: BlockType.BLUE_MARBLE,
                                    surfaceRuinBlock: BlockType.RUNED_BLUE_MARBLE,
                                    spawnersByFloor: [BlockType.GOBLIN_TENT_ALCHEMIST, BlockType.FROST_CASTER_TENT]
                                });
                            } else if (lotTypeVal === 'SUNKEN_ZIGGURAT_DUNGEON') {
                                DungeonTemplate.carve(chunk, x, y, dx, dy, baseZ, {
                                    floors: 4,
                                    wallBlock: BlockType.GREEN_STONE,
                                    floorBlock: BlockType.SWAMP_DIRT,
                                    pillarBlock: BlockType.RUNED_GREEN_STONE,
                                    ceilingBlock: BlockType.GREEN_STONE,
                                    surfaceRuinBlock: BlockType.RUNED_GREEN_STONE,
                                    spawnersByFloor: [BlockType.FROG_TENT, BlockType.FROG_TENT, BlockType.FROG_TENT, BlockType.FROG_TENT],
                                    bossSpawner: BlockType.OBSERVER_SPAWNER,
                                    hasBottomFloorHalls: true
                                });
                            } else if (lotTypeVal === 'WEST_CASTLE') {
                                CastleTemplate.build(chunk, x, y, dx, dy, baseZ, {
                                    floors: 5,
                                    wallBlock: BlockType.GREEN_MARBLE,
                                    floorBlock: BlockType.BLACK_MARBLE,
                                    stairBlock: BlockType.DUNGEON_STAIRS,
                                    chestFloor: 4,
                                    spawnersByFloor: [BlockType.BONE_PILE_SPAWNER, BlockType.DARK_ELF_SPAWNER, BlockType.ORC_TENT, BlockType.DARK_KNIGHT_TENT, BlockType.ABYSSAL_SPAWNER],
                                    radius: 10
                                });
                            } else if (lotTypeVal === 'SPAWN_CAMP') {
                                if (Math.abs(dx) <= 6 && Math.abs(dy) <= 6) {
                                    // Paved area
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.2 ? BlockType.COBBLESTONE_ROAD : BlockType.PAVED_ROAD;
                                    
                                    // Make sure center is clear so player doesn't spawn inside anything
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                }
                            } else if (lotTypeVal === 'POND') {
                                const distSq = dx*dx + dy*dy;
                                if (distSq < 15*15) {
                                    if (distSq < 13*13) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SAND;
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Add structures via local space
                if (lotTypeVal === 'WIZARD_TOWER') TerrainGenerator.buildStructureLocal(chunk, 'wizard_tower', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'RUINS') TerrainGenerator.buildStructureLocal(chunk, 'ruins', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'VILLAGE') TerrainGenerator.buildStructureLocal(chunk, 'village', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'HALFLING_VILLAGE') TerrainGenerator.buildStructureLocal(chunk, 'halfling_village', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'FARM') TerrainGenerator.buildStructureLocal(chunk, 'farm', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'CAMP') TerrainGenerator.buildStructureLocal(chunk, 'camp', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'WOLF_FOLK_CAMP') TerrainGenerator.buildStructureLocal(chunk, 'wolf_folk_camp', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'POMERANIAN_CARAVAN_CAMP') TerrainGenerator.buildStructureLocal(chunk, 'pomeranian_caravan_camp', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'TERRIER_OUTPOST') TerrainGenerator.buildStructureLocal(chunk, 'terrier_outpost', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'PIT_BULL_OUTPOST') TerrainGenerator.buildStructureLocal(chunk, 'pit_bull_outpost', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'HUMAN_CASTLE') TerrainGenerator.buildStructureLocal(chunk, 'human_castle', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'HUMAN_OUTPOST') TerrainGenerator.buildStructureLocal(chunk, 'human_outpost', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'SQUIRREL_FOLK_VILLAGE') TerrainGenerator.buildStructureLocal(chunk, 'squirrel_folk_village', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'BEAST_TAMER_OUTPOST') TerrainGenerator.buildStructureLocal(chunk, 'beast_tamer_outpost', ix, iy, baseZ + 1);
                else if (lotTypeVal === 'PRIMAL_BEAST_DEN') TerrainGenerator.buildStructureLocal(chunk, 'primal_beast_den', ix, iy, baseZ + 1);
                
                // Always recompute heightmap inside the lot if we did structure overlay
                if (['WEST_CASTLE', 'NORTH_DUNGEON', 'MARBLE_DUNGEON', 'GREEN_STONE_DUNGEON', 'OBSIDIAN_DUNGEON', 'ICE_DUNGEON', 'BLOOD_STONE_DUNGEON', 'FOREST_RUINS_DUNGEON', 'ROYAL_TOMB_DUNGEON', 'CRYSTAL_CAVERN_DUNGEON', 'LAVA_FORGE_DUNGEON', 'DESERT_CRYPT_DUNGEON', 'NIGHTMARE_DUNGEON', 'MAGIC_ACADEMY_DUNGEON', 'SUNKEN_ZIGGURAT_DUNGEON', 'SPAWN_CAMP', 'DRACONIC_ROOST', 'ORC_WAR_CAMP', 'PILGRIMS_REST', 'BANDIT_TOLL_GATE', 'RUINED_WAGON_AMBUSH', 'CASTLE', 'DEEP_DUNGEON', 'TEMPLE', 'VILLAGE', 'CAMP', 'WIZARD_TOWER', 'FARM', 'ARENA', 'ARENA_WORM', 'ARENA_WIZARD', 'HALFLING_VILLAGE', 'POMERANIAN_CARAVAN_CAMP', 'WOLF_FOLK_CAMP', 'TERRIER_OUTPOST', 'PIT_BULL_OUTPOST', 'HUMAN_CASTLE', 'HUMAN_OUTPOST', 'SQUIRREL_FOLK_VILLAGE', 'BEAST_TAMER_OUTPOST', 'PRIMAL_BEAST_DEN'].includes(lotTypeVal)) {
                    for (let x = 0; x < CHUNK_SIZE; x++) {
                        for (let y = 0; y < CHUNK_SIZE; y++) {
                            const wx = minWx + x;
                            const wy = minWy + y;
                            const dx = wx - ix;
                            const dy = wy - iy;
                            if (Math.abs(dx) <= 15 && Math.abs(dy) <= 15) {
                                let highest = 0;
                                for (let z = WORLD_HEIGHT - 1; z >= 0; z--) {
                                    if (chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] !== BlockType.AIR) {
                                        highest = z;
                                        break;
                                    }
                                }
                                chunk.heightMap[x + y * CHUNK_SIZE] = highest;
                            }
                        }
                    }
                }
            }
        }
    }
}
