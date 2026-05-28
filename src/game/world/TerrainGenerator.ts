import { DungeonCarver } from './DungeonCarver';
import { LotGenerator } from './LotGenerator';
import { CityGenerator } from './CityGenerator';
import { PlanetRegistry } from '../registries/PlanetRegistry';
import { StructureRegistry } from '../registries/StructureRegistry';
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { BlockType } from '../constants/BlockType';
import { Chunk } from './Chunk';

const noise2D = createNoise2D();
const noise3D = createNoise3D();

function getBlock(chunk, x: number, y: number, z: number): BlockType {
    return chunk.getBlock(x, y, z) as BlockType;
}

export class TerrainGenerator {
    static generate(chunk) {
        const { cx, cy, activePlanet } = chunk;
        const chunkHiveNoise = Math.abs(noise2D(cx * 10.1, cy * 10.1));
        const chunkHasHive = chunkHiveNoise < 0.05;
        const hiveX = Math.floor(Math.abs(noise2D(cx * 20.2, cy * 20.2)) * CHUNK_SIZE);
        const hiveY = Math.floor(Math.abs(noise2D(cx * 30.3, cy * 30.3)) * CHUNK_SIZE);

        const planetDef = PlanetRegistry.get(activePlanet);
        let PL_SURFACE = planetDef.surfaceBlock;
        let PL_DIRT = planetDef.dirtBlock;
        let PL_STONE = planetDef.stoneBlock;
        let PL_WATER = planetDef.waterBlock;
        let PL_WOOD = planetDef.woodBlock;
        let PL_LEAVES = planetDef.leafBlock;
        let PL_PINE_LEAF = planetDef.pineLeafBlock;
        let PL_ELEV_MOD = planetDef.elevationMod;
        let PL_BASE_ELEV = planetDef.baseElevation;
        let PL_WATER_LEVEL = planetDef.waterLevel;
        let PL_ORE_MULT = planetDef.oreMultiplier;

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                const wx = cx * CHUNK_SIZE + x;
                const wy = cy * CHUNK_SIZE + y;
                
                // Multi-Noise System - Scaled down for LARGER biomes
                
                let ACT_SURFACE = planetDef.surfaceBlock;
                let ACT_DIRT = planetDef.dirtBlock;
                let ACT_STONE = planetDef.stoneBlock;
                let ACT_WATER = planetDef.waterBlock;
                let ACT_WOOD = planetDef.woodBlock;
                let ACT_LEAVES = planetDef.leafBlock;
                let ACT_PINE_LEAF = planetDef.pineLeafBlock;
                
                // THREA DYNAMIC BIOMES
                if (planetDef.id === 'THREA') {
                    const temp = noise2D(wx * 0.002 + 5000, wy * 0.002 + 5000);
                    const moist = noise2D(wx * 0.003 + 10000, wy * 0.003 + 10000);
                    
                    if (temp > 0.5) {
                        if (moist > 0.2) {
                            ACT_SURFACE = BlockType.MUD; ACT_DIRT = BlockType.MUD; ACT_WATER = BlockType.SWAMP_WATER;
                            ACT_WOOD = BlockType.TROPICAL_WOOD; ACT_LEAVES = BlockType.TROPICAL_LEAVES; ACT_PINE_LEAF = BlockType.FERN;
                        } else if (moist < -0.2) {
                            ACT_SURFACE = BlockType.SAND; ACT_DIRT = BlockType.SAND;
                            ACT_WOOD = BlockType.WOOD_LOG; ACT_LEAVES = BlockType.AIR; ACT_PINE_LEAF = BlockType.AIR;
                        } else {
                            ACT_SURFACE = BlockType.DIRT; ACT_DIRT = BlockType.DIRT;
                            ACT_WOOD = BlockType.WOOD_LOG; ACT_LEAVES = BlockType.LEAVES; ACT_PINE_LEAF = BlockType.PINE_LEAVES;
                        }
                    } else if (temp < -0.5) {
                        ACT_SURFACE = BlockType.SNOW; ACT_DIRT = BlockType.DIRT; ACT_WATER = BlockType.ICE;
                        ACT_WOOD = BlockType.FROST_WOOD; ACT_LEAVES = BlockType.FROZEN_LEAVES; ACT_PINE_LEAF = BlockType.FROZEN_LEAVES;
                    } else {
                        if (moist > 0.6) {
                            ACT_SURFACE = BlockType.GREEN_DIRT; ACT_DIRT = BlockType.GREEN_DIRT; ACT_STONE = BlockType.GREEN_STONE;
                            ACT_WOOD = BlockType.GREEN_WOOD; ACT_LEAVES = BlockType.GREEN_LEAVES; ACT_PINE_LEAF = BlockType.GREEN_LEAVES;
                        } else if (moist < -0.6) {
                            ACT_SURFACE = BlockType.BLUE_DIRT; ACT_DIRT = BlockType.BLUE_DIRT; ACT_STONE = BlockType.BLUE_STONE;
                            ACT_WOOD = BlockType.BLUE_WOOD; ACT_LEAVES = BlockType.BLUE_LEAVES; ACT_PINE_LEAF = BlockType.BLUE_LEAVES;
                        }
                    }
                }
let e = noise2D(wx * 0.003, wy * 0.003); // Elevation
                let m = noise2D(wx * 0.003 + 10000, wy * 0.003 + 10000); // Moisture
                let r = noise2D(wx * 0.001 - 10000, wy * 0.001 - 10000); // River/Erosion
                let t = noise2D(wx * 0.002 + 5000, wy * 0.002 + 5000); // Temperature

                // Flatten spawn area (radius 30 around 0,0) to ensure a safe, flat Fields biome
                const dist = Math.sqrt(wx * wx + wy * wy);
                if (planetDef.safeAreaMethod === 'BOX') {
                    if (wx >= -16 && wx < 32 && wy >= -16 && wy < 32) {
                        e = 0; // Completely flat
                        r = 0.5; // No river
                    }
                } else if (planetDef.safeAreaMethod === 'RADIAL' && dist < 30) {
                    const blend = Math.max(0, Math.min(1, (30 - dist) / 10));
                    e = e * (1 - blend) + (0) * blend; 
                    m = m * (1 - blend) + (-0.5) * blend; 
                    r = r * (1 - blend) + (0.5) * blend; 
                }

                // Shape elevation to create massive flat plains
                // We compress the noise so that anything between -0.4 and 0.4 becomes exactly 0 (flat).
                let shapedE = 0;
                const flatThreshold = 0.4;
                if (e > flatThreshold) {
                    shapedE = (e - flatThreshold) * (1 / (1 - flatThreshold)); // Scales 0 to 1
                } else if (e < -flatThreshold) {
                    shapedE = (e + flatThreshold) * (1 / (1 - flatThreshold)); // Scales 0 to -1
                }

                // Base elevation calculation
                let elevation = Math.floor(PL_BASE_ELEV + shapedE * PL_ELEV_MOD);

                // THREA MOUNTAINS & CANYONS
                if (planetDef.id === 'THREA') {
                    let mnt = noise2D(wx * 0.002, wy * 0.002);
                    let mntPnt = Math.pow(1.0 - Math.abs(mnt), 4.0);
                    if (mntPnt > 0.3) {
                        elevation += Math.floor((mntPnt - 0.3) * 25);
                        if (elevation > 22) {
                            ACT_SURFACE = BlockType.SNOW;
                            ACT_DIRT = BlockType.STONE;
                        }
                    }
                    
                    let crack = noise2D(wx * 0.006 + 888, wy * 0.006 + 888);
                    if (Math.abs(crack) < 0.015) {
                        elevation = Math.max(2, elevation - Math.floor(15 * (1 - Math.abs(crack)/0.015)));
                    }
                }


                // River carving
                const riverVal = Math.abs(r);
                if (riverVal < 0.015) {
                    elevation = PL_WATER_LEVEL - 2; // Deep river (below water level)
                } else if (riverVal < 0.04) {
                    // River banks (blend to normal elevation)
                    const bankBlend = (riverVal - 0.015) / 0.025;
                    elevation = Math.floor((PL_WATER_LEVEL - 2) * (1 - bankBlend) + elevation * bankBlend);
                }

                // Lake carving
                const lakeNoise = noise2D(wx * 0.008 + 500, wy * 0.008 + 500);
                if (lakeNoise > 0.35) { // Big lakes
                    elevation = PL_WATER_LEVEL - 4; // Deep lake bottom
                } else if (lakeNoise > 0.25) {
                    // Lake shores
                    const shoreBlend = (lakeNoise - 0.25) / 0.10;
                    elevation = Math.floor((PL_WATER_LEVEL - 4) * shoreBlend + elevation * (1 - shoreBlend));
                }

                
                if (planetDef.id === 'THREA' && dist < 40) {
                     const blend = Math.max(0, Math.min(1, (40 - dist) / 10));
                     elevation = Math.floor(elevation * (1 - blend) + PL_BASE_ELEV * blend);
                     ACT_SURFACE = planetDef.surfaceBlock;
                     ACT_DIRT = planetDef.dirtBlock;
                     ACT_STONE = planetDef.stoneBlock;
                     ACT_WATER = planetDef.waterBlock;
                     ACT_WOOD = planetDef.woodBlock;
                     ACT_LEAVES = planetDef.leafBlock;
                     ACT_PINE_LEAF = planetDef.pineLeafBlock;
                }

                const origElevation = elevation;
                let isRoad = false;
                let isNearRoad = false;
                let isLot = false;

                if (planetDef.id !== 'TARHE') {
                    const REGION_SIZE = 128;
                    const wxMod = (wx % REGION_SIZE + REGION_SIZE) % REGION_SIZE;
                    const wyMod = (wy % REGION_SIZE + REGION_SIZE) % REGION_SIZE;
                    
                    const dxFromCenter = wxMod < REGION_SIZE / 2 ? wxMod : REGION_SIZE - wxMod;
                    const dyFromCenter = wyMod < REGION_SIZE / 2 ? wyMod : REGION_SIZE - wyMod;

                    if (dxFromCenter <= 1 || dyFromCenter <= 1) isRoad = true; // 3 tiles wide
                    if (dxFromCenter <= 4 || dyFromCenter <= 4) isNearRoad = true; // Keep trees/bushes away
                    if (dxFromCenter <= 15 && dyFromCenter <= 15) isLot = true; // 31x31 lot
                    
                    if (CityGenerator.isCityRegion(wx, wy)) {
                         isLot = true; // Flatten the entire county for the city
                    }

                    if (planetDef.id === 'THREA') {
                        let distToLot = 0;
                        if (dxFromCenter > 15 || dyFromCenter > 15) {
                            distToLot = Math.max(dxFromCenter - 15, dyFromCenter - 15);
                        }
                        const distToRoad = Math.min(dxFromCenter, dyFromCenter);
                        let distToInfra = Math.min(distToRoad, distToLot);
                        if (CityGenerator.isCityRegion(wx, wy)) {
                             distToInfra = 0; 
                        }
                        
                        const targetElev = PL_BASE_ELEV + 1;
                        if (distToInfra < 16 && origElevation > targetElev) {
                            let blend = Math.max(0, Math.min(1, (16 - distToInfra) / 16));
                            blend = blend * blend * (3 - 2 * blend);
                            elevation = Math.floor(origElevation * (1 - blend) + targetElev * blend);
                        }
                    }

                    if (isRoad || isLot) {
                        const targetElev = PL_BASE_ELEV + 1;
                        if (isLot) {
                            elevation = targetElev;
                        } else if (isRoad) {
                            // Smooth the road slightly into hills, steep cuts
                            if (elevation > targetElev) {
                                elevation = targetElev; // Cut
                            } else if (elevation < targetElev) {
                                elevation = targetElev; // Bridge over water or valleys
                            }
                        }
                    }
                }

                let highest = elevation;
                if (planetDef.id === 'TARHE') {
                    // Tarhe is entirely subterranean!
                    highest = WORLD_HEIGHT - 1; // It goes to the very top ceiling
                } else if (elevation < PL_WATER_LEVEL) {
                    highest = PL_WATER_LEVEL;
                }

                chunk.heightMap[x + y * CHUNK_SIZE] = highest;

                // We no longer precalculate cavernFloor and cavernCeiling here for 3D caves.
                // We will evaluate caves using 3D noise directly inside the Z loop.
                const cavBaseNoise = noise2D(wx * 0.015 + 100, wy * 0.015 + 100);
                const cavernFloorBase = Math.floor(2 + noise2D(wx * 0.03 + 200, wy * 0.03 + 200) * 2);
                const cavernCeilBase = Math.floor(10 + cavBaseNoise * 4);
                const isPillar = noise2D(wx * 0.05 + 300, wy * 0.05 + 300) > 0.6;

                // Generate blocks vertically
                for (let z = 0; z <= highest; z++) {
                    let type = BlockType.AIR;
                    if (planetDef.id === 'TARHE') {
                        type = ACT_STONE;
                        if (z === 0) type = BlockType.CASTLE_STONE;
                    } else {
                        if (z < elevation - 3) {
                            type = ACT_STONE;
                        } else if (z < elevation) {
                            if ((isRoad || isLot) && z >= origElevation && origElevation < PL_WATER_LEVEL) {
                                // Bridge pillars
                                type = ACT_STONE;
                            } else {
                                type = ACT_DIRT;
                            }
                        } else if (z === elevation) {
                            if (isRoad || isLot) {
                                if (origElevation < PL_WATER_LEVEL) {
                                    type = BlockType.STONE; // Stone bridge
                                } else {
                                    if (planetDef.id === 'ARETH') type = BlockType.OBSIDIAN;
                                    else if (planetDef.id === 'RAETH') type = BlockType.SLIME_PUDDLE;
                                    else if (planetDef.id === 'THERA') type = BlockType.WOOD_FLOOR;
                                    else if (planetDef.id === 'HERAT') type = BlockType.COBBLESTONE_ROAD;
                                    else type = BlockType.PAVED_ROAD;
                                }
                            } else {
                                type = elevation < PL_WATER_LEVEL ? ACT_DIRT : ACT_SURFACE;
                            }
                        } else if (z <= PL_WATER_LEVEL && !(isRoad || isLot)) {
                            type = ACT_WATER;
                        }
                    }

                    // Cavern carving (only in stone, below surface)
                    let isCarved = false;
                    if (z > 0 && z < highest - 2) {
                        const scale3D = 0.04;
                        const n1 = noise3D(wx * scale3D, wy * scale3D, z * scale3D);
                        
                        // 1. Sprawling Swiss Cheese Caves
                        if (n1 > 0.35) {
                            isCarved = true;
                        } else {
                            // 2. Intersecting Worm Tunnels
                            const n2 = noise3D(wx * scale3D * 1.5 + 4321, wy * scale3D * 1.5 + 4321, z * scale3D * 1.5 + 4321);
                            if (Math.abs(n1) < 0.06 && Math.abs(n2) < 0.06) {
                                isCarved = true;
                            }
                        }

                        // 3. Giant Caverns (Legacy style, adds wide open rooms)
                        if (cavBaseNoise > 0.3 && z >= cavernFloorBase && z <= cavernCeilBase && !isPillar) {
                            isCarved = true;
                        }

                        if (isCarved) {
                            if (z <= 2) {
                                const heatNoise = noise2D(wx * 0.01 + 500, wy * 0.01 + 500);
                                if (heatNoise > 0.3) {
                                    type = BlockType.LAVA; // Underground lava lake
                                } else {
                                    type = ACT_WATER; // Underground lake
                                }
                            } else {
                                type = BlockType.AIR; // Open cavern
                            }
                        }
                    }

                    // Add crystals to cavern walls/floor (dynamically placed)
                    if (type === ACT_STONE && z > 0 && z < highest - 2) {
                        // Sparse crystal clumps along the rock walls
                        const crystalNoise = noise3D(wx * 0.1 + 800, wy * 0.1 + 800, z * 0.1 + 800);
                        if (crystalNoise > 0.82) {
                            type = BlockType.CRYSTAL;
                        }
                    }

                    // Marble Generation
                    if (type === ACT_STONE) {
                        const marbleNoise = noise2D(wx * 0.03 + 1234, wy * 0.03 + 1234);
                        if (marbleNoise > 0.6) {
                            const marbleTypeNoise = noise2D(wx * 0.05 + 5678, wy * 0.05 + 5678);
                            if (marbleTypeNoise > 0.5) type = BlockType.GREEN_MARBLE;
                            else if (marbleTypeNoise < -0.5) type = BlockType.BLACK_MARBLE;
                            else type = BlockType.MARBLE;
                        }
                    }

                    // Obsidian and Lava Rock near lava
                    if (type === ACT_STONE && z <= 5) {
                        const heatNoise = noise2D(wx * 0.01 + 500, wy * 0.01 + 500);
                        if (heatNoise > 0.2) {
                            if (Math.random() < 0.3) type = BlockType.OBSIDIAN;
                            else type = BlockType.LAVA_ROCK;
                        }
                    }

                    // Ore Vein Generation
                    if (type === ACT_STONE) {
                        // 3D noise for vein structures
                        const oreNoise = noise3D(wx * 0.15, wy * 0.15, z * 0.15);
                        if (oreNoise > 0.65) { 
                            // Determine ore type based on smooth 3D noise so veins are consistent types
                            const randNoise = noise3D(wx * 0.05 + 111, wy * 0.05 + 111, z * 0.05 + 111);
                            const rand = (randNoise + 1) / 2; // 0 to 1
                            
                            if (z >= 25) {
                                if (rand < 0.5) type = BlockType.COAL_ORE;
                                else type = BlockType.COPPER_ORE;
                            } else if (z >= 15) {
                                if (rand < 0.3) type = BlockType.COAL_ORE;
                                else if (rand < 0.6) type = BlockType.COPPER_ORE;
                                else if (rand < 0.9) type = BlockType.IRON_ORE;
                                else type = BlockType.SILVER_ORE;
                            } else if (z >= 5) {
                                if (rand < 0.2) type = BlockType.COAL_ORE;
                                else if (rand < 0.4) type = BlockType.COPPER_ORE;
                                else if (rand < 0.6) type = BlockType.IRON_ORE;
                                else if (rand < 0.7) type = BlockType.SILVER_ORE;
                                else if (rand < 0.8) type = BlockType.GOLD_ORE;
                                else if (rand < 0.9) type = BlockType.PLATINUM_ORE;
                                else type = BlockType.GREEN_METAL_ORE;
                            } else {
                                if (rand < 0.1) type = BlockType.COAL_ORE;
                                else if (rand < 0.2) type = BlockType.COPPER_ORE;
                                else if (rand < 0.3) type = BlockType.IRON_ORE;
                                else if (rand < 0.4) type = BlockType.SILVER_ORE;
                                else if (rand < 0.5) type = BlockType.GOLD_ORE;
                                else if (rand < 0.55) type = BlockType.PLATINUM_ORE;
                                else if (rand < 0.6) type = BlockType.GREEN_METAL_ORE;
                                else if (rand < 0.65) type = BlockType.RED_METAL_ORE;
                                else if (rand < 0.7) type = BlockType.BLUE_METAL_ORE;
                                else if (rand < 0.75) type = BlockType.MITHRIL_ORE;
                                else if (rand < 0.8) type = BlockType.ADAMANTIUM_ORE;
                                else if (rand < 0.83) type = BlockType.ETERNIUM_ORE;
                                else if (rand < 0.86) type = BlockType.BLACK_METAL_ORE;
                                else if (rand < 0.89) type = BlockType.ORANGE_METAL_ORE;
                                else if (rand < 0.92) type = BlockType.PURPLE_METAL_ORE;
                                else if (rand < 0.95) type = BlockType.YELLOW_METAL_ORE;
                                else if (rand < 0.98) type = BlockType.PLUTONIUM_ORE;
                                else type = BlockType.RUBY;
                            }
                            
                            // RAETH VOIDSIGHT ORE OVERRIDE
                            if (planetDef.id === 'RAETH' && rand > 0.85) {
                                type = BlockType.VOIDSIGHT_ORE;
                            }
                            // NORTH_HEART OVERRIDES
                            else if (planetDef.id === 'NORTH_HEART' && rand > 0.8) {
                                if (z < 15 && rand > 0.95) {
                                    type = BlockType.STAR_METAL_ORE;
                                } else {
                                    type = BlockType.GLACIAL_CRYSTAL_ORE;
                                }
                            }
                            // THERA OVERRIDES
                            else if (planetDef.id === 'THERA' && rand > 0.75) {
                                if (z < 20 && rand > 0.9) {
                                    type = BlockType.AMBER;
                                } else {
                                    type = BlockType.FOSSIL_ORE;
                                }
                            }
                        }
                    }

                    if (type !== BlockType.AIR) {
                        chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = type;
                    }
                }

                // Phase 2 Decorations (Trees, Bushes, Rocks)
                // Only place if above water and on the surface grass
                if (elevation > PL_WATER_LEVEL && elevation === highest && !isNearRoad && !isLot) {
                    const isForest = m > 0.2;
                    const isHills = e > 0.4;
                    const isPine = t < 0; // Temperature determines Pine vs Oak
                    
                    // Deterministic random based on position
                    const rand = Math.abs(noise2D(wx * 123.45, wy * 678.90));
                    
                    let treeChance = 0.001; // Default Fields
                    let bushChance = 0.005;
                    let rockChance = 0.002;
                    let spawnerChance = 0.001; // 0.1% chance per block in fields
                    
                    if (isForest) {
                        treeChance = 0.04; // Dense trees
                        bushChance = 0.02;
                        rockChance = 0.005;
                        spawnerChance = 0.002; // 0.2% chance in forest
                    } else if (isHills) {
                        treeChance = 0.005; // Sparse trees
                        bushChance = 0.01;
                        rockChance = 0.03; // Rocky hills
                        spawnerChance = 0.003; // 0.3% chance in hills
                    } else {
                        if (chunkHasHive && x === hiveX && y === hiveY) {
                            spawnerChance = 1.0;
                        }
                    }

                    // Keep spawn area completely clear of trees/bushes/rocks/hives/camps
                    if (dist > 15) {
                        if (rand < treeChance) {
                            if (isPine) {
                            // Generate a Pine Tree (Taller, narrower)
                            const treeHeight = Math.floor(rand * 1000) % 4 + 5; // 5 to 8 blocks tall
                            for (let tz = 1; tz <= treeHeight; tz++) {
                                if (elevation + tz < WORLD_HEIGHT) {
                                    chunk.blocks[x + y * CHUNK_SIZE + (elevation + tz) * CHUNK_SIZE * CHUNK_SIZE] = ACT_WOOD;
                                    if (elevation + tz > chunk.heightMap[x + y * CHUNK_SIZE]) {
                                        chunk.heightMap[x + y * CHUNK_SIZE] = elevation + tz;
                                    }
                                }
                            }
                            // Pine Leaves (Cone shape)
                            for (let tz = 2; tz <= treeHeight + 2; tz++) {
                                const radius = tz > treeHeight ? 0 : Math.max(1, Math.floor((treeHeight - tz) / 2) + 1);
                                for (let lx = -radius; lx <= radius; lx++) {
                                    for (let ly = -radius; ly <= radius; ly++) {
                                        if (lx === 0 && ly === 0 && tz <= treeHeight) continue; // Trunk
                                        if (Math.abs(lx) === radius && Math.abs(ly) === radius && radius > 1) continue; // Round corners
                                        
                                        const px = x + lx;
                                        const py = y + ly;
                                        const pz = elevation + tz;
                                        
                                        if (px >= 0 && px < CHUNK_SIZE && py >= 0 && py < CHUNK_SIZE && pz < WORLD_HEIGHT) {
                                            if (chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] === BlockType.AIR) {
                                                chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] = ACT_PINE_LEAF;
                                                if (pz > chunk.heightMap[px + py * CHUNK_SIZE]) {
                                                    chunk.heightMap[px + py * CHUNK_SIZE] = pz;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            // Generate an Oak Tree (Shorter, wider)
                            const treeHeight = Math.floor(rand * 1000) % 3 + 4; // 4 to 6 blocks tall
                            for (let tz = 1; tz <= treeHeight; tz++) {
                                if (elevation + tz < WORLD_HEIGHT) {
                                    chunk.blocks[x + y * CHUNK_SIZE + (elevation + tz) * CHUNK_SIZE * CHUNK_SIZE] = ACT_WOOD;
                                    if (elevation + tz > chunk.heightMap[x + y * CHUNK_SIZE]) {
                                        chunk.heightMap[x + y * CHUNK_SIZE] = elevation + tz;
                                    }
                                }
                            }
                            // Oak Leaves (Blob shape)
                            for (let lx = -2; lx <= 2; lx++) {
                                for (let ly = -2; ly <= 2; ly++) {
                                    for (let lz = treeHeight - 2; lz <= treeHeight + 1; lz++) {
                                        if (lx === 0 && ly === 0 && lz < treeHeight + 1) continue; // Trunk is here
                                        if (Math.abs(lx) === 2 && Math.abs(ly) === 2) continue; // Round corners
                                        if (Math.abs(lx) >= 1 && Math.abs(ly) >= 1 && lz === treeHeight + 1) continue; // Pointy top
                                        
                                        const px = x + lx;
                                        const py = y + ly;
                                        const pz = elevation + lz;
                                        
                                        if (px >= 0 && px < CHUNK_SIZE && py >= 0 && py < CHUNK_SIZE && pz < WORLD_HEIGHT) {
                                            if (chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] === BlockType.AIR) {
                                                chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] = ACT_LEAVES;
                                                if (pz > chunk.heightMap[px + py * CHUNK_SIZE]) {
                                                    chunk.heightMap[px + py * CHUNK_SIZE] = pz;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (rand < treeChance + bushChance) {
                        // Generate a bush
                        if (elevation + 1 < WORLD_HEIGHT) {
                            let bushType = BlockType.BUSH;
                            if (Math.random() < 0.05) { // 1 in 20 chance for a berry bush
                                const berryTypes = [
                                    BlockType.RED_BERRY_BUSH,
                                    BlockType.BLUE_BERRY_BUSH,
                                    BlockType.BLACK_BERRY_BUSH,
                                    BlockType.YELLOW_BERRY_BUSH
                                ];
                                bushType = berryTypes[Math.floor(Math.random() * berryTypes.length)];
                            } else if (Math.random() < 0.1) {
                                bushType = BlockType.WEED;
                            }
                            chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = bushType;
                            if (elevation + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) {
                                chunk.heightMap[x + y * CHUNK_SIZE] = elevation + 1;
                            }
                        }
                    } else if (rand < treeChance + bushChance + rockChance) {
                        // Generate a surface rock
                        if (elevation + 1 < WORLD_HEIGHT) {
                            if (isHills) {
                                chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = ACT_STONE;
                            } else {
                                chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = ACT_STONE;
                            }
                            if (elevation + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) {
                                chunk.heightMap[x + y * CHUNK_SIZE] = elevation + 1;
                            }
                        }
                    } else if (rand < treeChance + bushChance + rockChance + spawnerChance) {
                        // Spawner generation
                        const worldX = cx * CHUNK_SIZE + x;
                        const worldY = cy * CHUNK_SIZE + y;
                        const distToOrigin = Math.hypot(worldX, worldY);
                        
                        if (elevation + 1 < WORLD_HEIGHT && distToOrigin > 48) { // Peaceful starting area (radius 48 blocks)
                            const spawnerRand = Math.random();
                            let spawnerType = BlockType.BEE_HIVE;
                            
                            let roll = Math.random();
                                for (const entry of planetDef.spawnerTable) {
                                    if (roll < entry.chance) {
                                        spawnerType = entry.block;
                                        break;
                                    }
                                    roll -= entry.chance;
                                }
                            
                            chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = spawnerType;
                            if (elevation + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) {
                                chunk.heightMap[x + y * CHUNK_SIZE] = elevation + 1;
                            }
                            
                            // If it's a graveyard, add gravestones around it
                            if (spawnerType === BlockType.BONE_PILE_SPAWNER) {
                                for (let dx = -3; dx <= 3; dx++) {
                                    for (let dy = -3; dy <= 3; dy++) {
                                        if (dx === 0 && dy === 0) continue;
                                        const dist = Math.sqrt(dx*dx + dy*dy);
                                        if (dist <= 3 && Math.random() < 0.4) {
                                            const gx = x + dx;
                                            const gy = y + dy;
                                            if (gx >= 0 && gx < CHUNK_SIZE && gy >= 0 && gy < CHUNK_SIZE) {
                                                const gElev = chunk.heightMap[gx + gy * CHUNK_SIZE];
                                                if (gElev > PL_WATER_LEVEL && gElev + 1 < WORLD_HEIGHT && chunk.blocks[gx + gy * CHUNK_SIZE + gElev * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) {
                                                    chunk.blocks[gx + gy * CHUNK_SIZE + (gElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRAVESTONE;
                                                    chunk.heightMap[gx + gy * CHUNK_SIZE] = gElev + 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                } // closes if (elevation > PL_WATER_LEVEL && elevation === highest && !isNearRoad && !isLot)
                
                // Add street lamps and road signs ALONG the roads
                if (isRoad && !isLot && elevation > PL_WATER_LEVEL && origElevation > PL_WATER_LEVEL && x % 4 === 0 && y % 4 === 0) {
                    if (Math.random() < 0.2) {
                        // Place a lamp post!
                        let lampX = x;
                        let lampY = y;
                        if (x > 0 && chunk.blocks[x - 1 + y * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) lampX = x - 1;
                        else if (x < CHUNK_SIZE - 1 && chunk.blocks[x + 1 + y * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) lampX = x + 1;
                        else if (y > 0 && chunk.blocks[x + (y - 1) * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) lampY = y - 1;
                        else if (y < CHUNK_SIZE - 1 && chunk.blocks[x + (y + 1) * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) lampY = y + 1;
                        
                        // We only place it on grass/dirt adjacent to the road
                        if (lampX !== x || lampY !== y) {
                            const lElev = chunk.heightMap[lampX + lampY * CHUNK_SIZE];
                            if (lElev === elevation && lElev + 3 < WORLD_HEIGHT) {
                                chunk.blocks[lampX + lampY * CHUNK_SIZE + (lElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                chunk.blocks[lampX + lampY * CHUNK_SIZE + (lElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                                chunk.heightMap[lampX + lampY * CHUNK_SIZE] = Math.max(chunk.heightMap[lampX + lampY * CHUNK_SIZE], lElev + 2);
                            }
                        }
                    } else if (Math.random() < 0.1) {
                         // Place a road sign!
                        let signX = x;
                        let signY = y;
                        if (x > 0 && chunk.blocks[x - 1 + y * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) signX = x - 1;
                        else if (x < CHUNK_SIZE - 1 && chunk.blocks[x + 1 + y * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) signX = x + 1;
                        else if (y > 0 && chunk.blocks[x + (y - 1) * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) signY = y - 1;
                        else if (y < CHUNK_SIZE - 1 && chunk.blocks[x + (y + 1) * CHUNK_SIZE + elevation * CHUNK_SIZE * CHUNK_SIZE] === ACT_SURFACE) signY = y + 1;
                        
                        if (signX !== x || signY !== y) {
                            const lElev = chunk.heightMap[signX + signY * CHUNK_SIZE];
                            if (lElev === elevation && lElev + 2 < WORLD_HEIGHT) {
                                chunk.blocks[signX + signY * CHUNK_SIZE + (lElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ROAD_SIGN;
                                chunk.heightMap[signX + signY * CHUNK_SIZE] = Math.max(chunk.heightMap[signX + signY * CHUNK_SIZE], lElev + 1);
                            }
                        }
                    }
                }

                // Phase 2.5 Cavern Decorations (Mushroom Trees and stalagmites on natural cave floors)
                // We'll scan from top to bottom locally and look for cavern floors.
                if (highest > 5) { // Needs to have enough depth to have caves
                    const cavRand = Math.abs(noise2D(wx * 321.12, wy * 987.65));
                    if (cavRand < 0.04) { // 4% chance to start a feature column search
                        for (let z = highest - 4; z >= 3; z--) { // only below surface, above lava
                            const idxOver = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE;
                            const idxUnder = x + y * CHUNK_SIZE + (z - 1) * CHUNK_SIZE * CHUNK_SIZE;
                            if (chunk.blocks[idxOver] === BlockType.AIR && (chunk.blocks[idxUnder] === ACT_STONE || chunk.blocks[idxUnder] === BlockType.DIRT)) {
                                // We found a cavern floor!
                                let featureType = 'NONE';
                                
                                if (planetDef.id === 'TARHE') {
                                    if (cavRand < 0.015) featureType = 'DWARF_SPAWNER';
                                    else if (cavRand < 0.025) featureType = 'GNOME_SPAWNER';
                                    else if (cavRand < 0.030) featureType = 'ROCK_GOLEM_SPAWNER';
                                    else if (cavRand < 0.038) featureType = 'MINESHAFT';
                                    else if (cavRand < 0.04) featureType = 'MUSHROOM'; // Rare mushrooms
                                } else {
                                    if (cavRand < 0.02) featureType = 'MUSHROOM';
                                    else if (cavRand < 0.026) featureType = 'POT';
                                    else if (cavRand < 0.033) featureType = 'DEMON_PORTAL';
                                    else if (cavRand < 0.036) featureType = 'BONE_PILE_SPAWNER';
                                    else if (cavRand < 0.04) featureType = 'MINESHAFT';
                                }
                                
                                if (featureType === 'MUSHROOM') {
                                    const treeHeight = Math.floor(cavRand * 1000) % 3 + 3; // 3 to 5 blocks tall
                                    
                                    // Check if there is enough vertical space
                                    let hasSpace = true;
                                    for(let checkZ = z; checkZ <= z + treeHeight; checkZ++){
                                        if (chunk.blocks[x + y * CHUNK_SIZE + checkZ * CHUNK_SIZE * CHUNK_SIZE] !== BlockType.AIR) {
                                            hasSpace = false; break;
                                        }
                                    }

                                    if (hasSpace) {
                                        // Stem
                                        for (let tz = 0; tz < treeHeight; tz++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (z + tz) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MUSHROOM_STEM;
                                        }
                                        
                                        // Cap
                                        for (let lx = -1; lx <= 1; lx++) {
                                            for (let ly = -1; ly <= 1; ly++) {
                                                if (Math.abs(lx) === 1 && Math.abs(ly) === 1) continue; // Round corners
                                                
                                                const px = x + lx;
                                                const py = y + ly;
                                                const pz = z + treeHeight - 1;
                                                if (px >= 0 && px < CHUNK_SIZE && py >= 0 && py < CHUNK_SIZE && pz < WORLD_HEIGHT) {
                                                    if (chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] === BlockType.AIR) {
                                                        chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MUSHROOM_CAP;
                                                    }
                                                }
                                            }
                                        }
                                        break; // stop searching down this column
                                    }
                                } else if (featureType === 'DWARF_SPAWNER') {
                                    chunk.blocks[idxOver] = BlockType.DWARF_SPAWNER;
                                    break;
                                } else if (featureType === 'GNOME_SPAWNER') {
                                    chunk.blocks[idxOver] = BlockType.GNOME_SPAWNER;
                                    break;
                                } else if (featureType === 'ROCK_GOLEM_SPAWNER') {
                                    chunk.blocks[idxOver] = BlockType.ROCK_GOLEM_SPAWNER;
                                    break;
                                } else if (featureType === 'POT') {
                                    chunk.blocks[idxOver] = BlockType.POT;
                                    break;
                                } else if (featureType === 'SLIME_PUDDLE') {
                                    chunk.blocks[idxOver] = BlockType.SLIME_PUDDLE;
                                    break;
                                } else if (featureType === 'DEMON_PORTAL') {
                                    chunk.blocks[idxOver] = BlockType.DEMON_PORTAL;
                                    break;
                                } else if (featureType === 'BONE_PILE_SPAWNER') {
                                    chunk.blocks[idxOver] = BlockType.BONE_PILE_SPAWNER;
                                    break;
                                } else if (featureType === 'MINESHAFT') {
                                    chunk.blocks[idxOver] = planetDef.id === 'TARHE' ? BlockType.MINE_SHAFT_WOOD : BlockType.WOOD_WALL;
                                    chunk.blocks[idxUnder] = planetDef.id === 'TARHE' ? BlockType.MINE_SHAFT_WOOD : BlockType.WOOD_WALL;
                                    
                                    // if there is space above, add a torch randomly
                                    if (chunk.blocks[idxOver + CHUNK_SIZE * CHUNK_SIZE] === BlockType.AIR && Math.random() < 0.2) {
                                        chunk.blocks[idxOver + CHUNK_SIZE * CHUNK_SIZE] = planetDef.id === 'TARHE' ? BlockType.LANTERN_BLOCK : BlockType.TORCH;
                                    }
                                    break;
                                }
                            } else if (chunk.blocks[idxOver] === BlockType.AIR && chunk.blocks[idxOver + CHUNK_SIZE * CHUNK_SIZE] === ACT_STONE) {
                                // Ceiling detected!
                                if (cavRand > 0.035 && cavRand < 0.04) {
                                    chunk.blocks[idxOver] = BlockType.SPIDER_WEB;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Phase 3: Crossroad Locations
        LotGenerator.generate(chunk, planetDef, PL_BASE_ELEV);
        CityGenerator.generate(chunk, planetDef, PL_BASE_ELEV);
        DungeonCarver.applyDungeons(chunk);
    }


    
    static buildStructureLocal(chunk: Chunk, id: string, startX: number, startY: number, startZ: number) {
        const struct = StructureRegistry.get(id);
        if (!struct) return;
        
        for (let z = 0; z < struct.layers.length; z++) {
            const layer = struct.layers[z];
            for (let y = 0; y < layer.length; y++) {
                const row = layer[y];
                for (let x = 0; x < row.length; x++) {
                    const char = row[x];
                    if (char === ' ') continue; // Skip explicit whitespace (NO-OP)
                    
                    const entry = struct.palette[char];
                    if (entry) {
                        const localX = startX + x - struct.anchorX;
                        const localY = startY + y - struct.anchorY;
                        const localZ = startZ + z - struct.anchorZ;
                        
                        // Local Chunk bounds check
                        if (localX >= 0 && localX < CHUNK_SIZE && localY >= 0 && localY < CHUNK_SIZE && localZ >= 0 && localZ < WORLD_HEIGHT) {
                            chunk.blocks[localX + localY * CHUNK_SIZE + localZ * CHUNK_SIZE * CHUNK_SIZE] = entry.block;
                        }
                    }
                }
            }
        }
    }



}
