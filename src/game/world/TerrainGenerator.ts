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

                // River carving
                const riverVal = Math.abs(r);
                if (riverVal < 0.015) {
                    elevation = PL_WATER_LEVEL - 2; // Deep river (below water level)
                } else if (riverVal < 0.04) {
                    // River banks (blend to normal elevation)
                    const bankBlend = (riverVal - 0.015) / 0.025;
                    elevation = Math.floor((PL_WATER_LEVEL - 2) * (1 - bankBlend) + elevation * bankBlend);
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
                        type = PL_STONE;
                        if (z === 0) type = BlockType.HEAVY_STONE;
                    } else {
                        if (z < elevation - 3) {
                            type = PL_STONE;
                        } else if (z < elevation) {
                            if ((isRoad || isLot) && z >= origElevation && origElevation < PL_WATER_LEVEL) {
                                // Bridge pillars
                                type = PL_STONE;
                            } else {
                                type = PL_DIRT;
                            }
                        } else if (z === elevation) {
                            if (isRoad || isLot) {
                                if (origElevation < PL_WATER_LEVEL) {
                                    type = BlockType.STONE; // Stone bridge
                                } else {
                                    type = BlockType.DIRT_PATH;
                                }
                            } else {
                                type = elevation < PL_WATER_LEVEL ? PL_DIRT : PL_SURFACE;
                            }
                        } else if (z <= PL_WATER_LEVEL && !(isRoad || isLot)) {
                            type = PL_WATER;
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
                                    type = PL_WATER; // Underground lake
                                }
                            } else {
                                type = BlockType.AIR; // Open cavern
                            }
                        }
                    }

                    // Add crystals to cavern walls/floor (dynamically placed)
                    if (type === PL_STONE && z > 0 && z < highest - 2) {
                        // Sparse crystal clumps along the rock walls
                        const crystalNoise = noise3D(wx * 0.1 + 800, wy * 0.1 + 800, z * 0.1 + 800);
                        if (crystalNoise > 0.82) {
                            type = BlockType.CRYSTAL;
                        }
                    }

                    // Marble Generation
                    if (type === PL_STONE) {
                        const marbleNoise = noise2D(wx * 0.03 + 1234, wy * 0.03 + 1234);
                        if (marbleNoise > 0.6) {
                            const marbleTypeNoise = noise2D(wx * 0.05 + 5678, wy * 0.05 + 5678);
                            if (marbleTypeNoise > 0.5) type = BlockType.GREEN_MARBLE;
                            else if (marbleTypeNoise < -0.5) type = BlockType.BLACK_MARBLE;
                            else type = BlockType.MARBLE;
                        }
                    }

                    // Obsidian and Lava Rock near lava
                    if (type === PL_STONE && z <= 5) {
                        const heatNoise = noise2D(wx * 0.01 + 500, wy * 0.01 + 500);
                        if (heatNoise > 0.2) {
                            if (Math.random() < 0.3) type = BlockType.OBSIDIAN;
                            else type = BlockType.LAVA_ROCK;
                        }
                    }

                    // Ore Vein Generation
                    if (type === PL_STONE) {
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
                                    chunk.blocks[x + y * CHUNK_SIZE + (elevation + tz) * CHUNK_SIZE * CHUNK_SIZE] = PL_WOOD;
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
                                                chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] = PL_PINE_LEAF;
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
                                    chunk.blocks[x + y * CHUNK_SIZE + (elevation + tz) * CHUNK_SIZE * CHUNK_SIZE] = PL_WOOD;
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
                                                chunk.blocks[px + py * CHUNK_SIZE + pz * CHUNK_SIZE * CHUNK_SIZE] = PL_LEAVES;
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
                                chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = PL_STONE;
                            } else {
                                chunk.blocks[x + y * CHUNK_SIZE + (elevation + 1) * CHUNK_SIZE * CHUNK_SIZE] = PL_STONE;
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
                                                if (gElev > PL_WATER_LEVEL && gElev + 1 < WORLD_HEIGHT && chunk.blocks[gx + gy * CHUNK_SIZE + gElev * CHUNK_SIZE * CHUNK_SIZE] === PL_SURFACE) {
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

                // Phase 2.5 Cavern Decorations (Mushroom Trees and stalagmites on natural cave floors)
                // We'll scan from top to bottom locally and look for cavern floors.
                if (highest > 5) { // Needs to have enough depth to have caves
                    const cavRand = Math.abs(noise2D(wx * 321.12, wy * 987.65));
                    if (cavRand < 0.04) { // 4% chance to start a feature column search
                        for (let z = highest - 4; z >= 3; z--) { // only below surface, above lava
                            const idxOver = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE;
                            const idxUnder = x + y * CHUNK_SIZE + (z - 1) * CHUNK_SIZE * CHUNK_SIZE;
                            if (chunk.blocks[idxOver] === BlockType.AIR && (chunk.blocks[idxUnder] === PL_STONE || chunk.blocks[idxUnder] === BlockType.DIRT)) {
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
                            } else if (chunk.blocks[idxOver] === BlockType.AIR && chunk.blocks[idxOver + CHUNK_SIZE * CHUNK_SIZE] === PL_STONE) {
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
        if (planetDef.id !== 'TARHE') {
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

                    // Skip spawn
                    if (ix === 0 && iy === 0) continue;

                    // Seed based on intersection coordinate
                    const hash = Math.abs(noise2D(ix * 0.123, iy * 0.456));
                    
                    let lotTypeVal = 'CAMP';
                    
                    if (planetDef.id === 'ARETH') {
                        if (hash < 0.25) lotTypeVal = 'DRAGON_LAIR_LOT';
                        else if (hash < 0.50) lotTypeVal = 'KOBOLD_MINING_RIG';
                        else if (hash < 0.80) lotTypeVal = 'BASALT_PILLARS';
                        else lotTypeVal = 'LAVA_DELTA';
                    } else if (planetDef.id === 'TARHE') {
                        if (hash < 0.40) lotTypeVal = 'DWARVEN_FORTRESS';
                        else if (hash < 0.70) lotTypeVal = 'GNOMISH_EXCAVATION';
                        else lotTypeVal = 'ROCK_GOLEM_QUARRY';
                    } else if (planetDef.id === 'TERHA') {
                        if (hash < 0.40) lotTypeVal = 'ORC_STRONGHOLD';
                        else if (hash < 0.70) lotTypeVal = 'SLIME_BOG';
                        else lotTypeVal = 'ANCIENT_WILLOW';
                    } else {
                        if (hash < 0.05) lotTypeVal = 'VILLAGE';
                        else if (hash < 0.10) lotTypeVal = 'HALFLING_VILLAGE';
                        else if (hash < 0.15) lotTypeVal = 'RUINS';
                        else if (hash < 0.20) lotTypeVal = 'GRAVEYARD';
                        else if (hash < 0.30) lotTypeVal = 'FARM';
                        else if (hash < 0.40) lotTypeVal = 'POND';
                        else if (hash < 0.45) lotTypeVal = 'POMERANIAN_CARAVAN_CAMP';
                        else if (hash < 0.50) lotTypeVal = 'WOLF_FOLK_CAMP';
                        else if (hash < 0.55) lotTypeVal = 'TERRIER_OUTPOST';
                        else if (hash < 0.60) lotTypeVal = 'PIT_BULL_OUTPOST';
                        else if (hash < 0.65) lotTypeVal = 'WIZARD_TOWER';
                        else if (hash < 0.68) lotTypeVal = 'ARENA';
                        else if (hash < 0.71) lotTypeVal = 'ARENA_WORM';
                        else if (hash < 0.75) lotTypeVal = 'ARENA_WIZARD';
                        else if (hash < 0.81) lotTypeVal = 'HUMAN_CASTLE';
                        else if (hash < 0.84) lotTypeVal = 'HUMAN_OUTPOST';
                        else if (hash < 0.87) lotTypeVal = 'FAIRY_RING';
                        else if (hash < 0.90) lotTypeVal = 'TEMPLE';
                        else if (hash < 0.94) lotTypeVal = 'DEEP_DUNGEON';
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
                                        
                                        // Towers
                                        if (Math.abs(dx) >= 10 && Math.abs(dy) >= 10) {
                                            for (let h = 1; h <= 7; h++) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                            }
                                        }
                                        
                                        // Keep in middle
                                        if (Math.abs(dx) <= 4 && Math.abs(dy) <= 4 && dy < 4) {
                                            for (let h = 1; h <= 6; h++) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BLACK_STONE;
                                            }
                                        }
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
                                    }
                                } else if (lotTypeVal === 'POND') {
                                    const distSq = dx*dx + dy*dy;
                                    if (distSq < 80) { 
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ - 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    } else if (distSq < 144) { 
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SAND;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                } else if (lotTypeVal === 'LAVA_DELTA') {
                                    const distSq = dx*dx + dy*dy;
                                    if (distSq < 150 + Math.sin(dx * 0.5) * 50) { 
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ - 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                    }
                                } else if (lotTypeVal === 'BASALT_PILLARS') {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                    const hashPillar = Math.abs(noise2D(wx * 0.8, wy * 0.8));
                                    if (hashPillar > 0.8) {
                                        // Massive spike
                                        const height = Math.floor(hashPillar * 15);
                                        for (let h = 1; h <= height; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                        }
                                    }
                                } else if (lotTypeVal === 'DRAGON_LAIR_LOT') {
                                    const distSq = dx*dx + dy*dy;
                                    // Huge obsidian dome
                                    if (distSq < 100) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                        if (distSq > 60) {
                                            // Walls of the lair
                                            for (let h = 1; h <= 10; h++) {
                                                if (h > 6 && Math.random() < 0.5) continue;
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                            }
                                        } else {
                                            // Inside the lair
                                            if (dx === 0 && dy === 0) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DRAGON_LAIR;
                                            } else if (distSq < 15 && Math.random() < 0.1) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STORAGE_CHEST;
                                            } else if (Math.random() < 0.05) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA;
                                            }
                                        }
                                    }
                                } else if (lotTypeVal === 'KOBOLD_MINING_RIG') {
                                    if (Math.abs(dx) <= 1 || Math.abs(dy) <= 1) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LAVA;
                                        for (let h = 0; h < 4; h++) {
                                             chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2 + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                        }
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 6) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.IRON_BLOCK; // Bridge
                                    } else {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                                    }
                                    
                                    if (Math.abs(dx) === 10 && Math.abs(dy) === 10) {
                                        // Pillars
                                        for (let h = 1; h <= 10; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                    }
                                    
                                    if (dx === 5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_WARRIOR;
                                    if (dx === -5 && dy === 5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_BOMBER;
                                    if (dx === 5 && dy === -5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_TRAPPER;
                                    if (dx === -5 && dy === -5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT;
                                } else if (lotTypeVal === 'DWARVEN_FORTRESS') {
                                    // Deep slate base
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DEEP_SLATE;
                                    
                                    const distSq = dx*dx + dy*dy;
                                    if (Math.abs(dx) === 12 || Math.abs(dy) === 12) {
                                        // Thick walls
                                        for (let h = 1; h <= 8; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HEAVY_STONE;
                                        }
                                    } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
                                        // Inside
                                        if (distSq < 2) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DWARF_SPAWNER;
                                        } else if (Math.abs(dx) === 6 && Math.abs(dy) === 6) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                                            for(let h = 2; h <= 5; h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.IRON_BLOCK;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ANVIL;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.FURNACE;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STORAGE_CHEST;
                                        }
                                        
                                        // Ceiling
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 8) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HEAVY_STONE;
                                    }
                                } else if (lotTypeVal === 'GNOMISH_EXCAVATION') {
                                    // Mining operations
                                    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
                                        if (Math.abs(dx) % 3 === 0 && Math.abs(dy) % 3 === 0 && dx !== 0 && dy !== 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MINE_SHAFT_WOOD;
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MINE_SHAFT_WOOD;
                                            if (Math.random() < 0.5) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                                        } else if (dx === 0 && Math.abs(dy) < 8) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CONVEYOR_BELT_S;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GNOME_SPAWNER;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.IRON_ORE;
                                        } else if (Math.random() < 0.02) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AUTO_MINER;
                                        }
                                    }
                                } else if (lotTypeVal === 'ROCK_GOLEM_QUARRY') {
                                    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR; // Dig down
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ - 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                        
                                        if (dx === 0 && dy === 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ - 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ROCK_GOLEM_SPAWNER;
                                        } else if (Math.random() < 0.1) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE; // Rubble
                                        }
                                    }
                                } else if (lotTypeVal === 'ORC_STRONGHOLD') {
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MUD; // Muddy base
                                    if (Math.abs(dx) === 14 || Math.abs(dy) === 14) {
                                        // Spike walls
                                        for (let h = 1; h <= 4; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                        if (Math.random() < 0.2) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 5) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL; // just tall wood
                                    } else if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
                                        if (dx === 0 && dy === 0) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_BRUTE;
                                        } else if (Math.abs(dx) === 8 && Math.abs(dy) === 8) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_HUNTER;
                                        } else if (dx === -8 && Math.abs(dy) === 8) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT;
                                        } else if (dx === 8 && dy === -8) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_SHAMAN;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                                        } else if (Math.random() < 0.05) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STORAGE_CHEST;
                                        }
                                    }
                                } else if (lotTypeVal === 'SLIME_BOG') {
                                    const distSq = dx*dx + dy*dy;
                                    if (distSq < 150) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.POISON_WATER;
                                        if (Math.random() < 0.1) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SLIME_PUDDLE;
                                        }
                                    } else if (distSq < 225) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MUD;
                                    }
                                } else if (lotTypeVal === 'ANCIENT_WILLOW') {
                                    // Huge tree
                                    const distSq = dx*dx + dy*dy;
                                    chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = (distSq < 150) ? BlockType.SWAMP_DIRT : BlockType.GRASS;
                                    if (distSq < 12) {
                                        for (let h = 1; h <= 20; h++) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BLACK_WOOD;
                                        }
                                    } else if (distSq < 150 && Math.random() < 0.3) {
                                        // Massive canopy
                                        let h = 20 - Math.floor(Math.sqrt(distSq));
                                        if (h > 5) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BLACK_LEAVES;
                                        }
                                        if (Math.random() < 0.05) {
                                            // Hanging moss
                                            for(let m = 1; m < 5; m++) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + h - m) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.VINE;
                                            }
                                        }
                                    }
                                    
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_SHAMAN; // Swamp witch essentially
                                    }

                                } else if (lotTypeVal === 'FARM') {
                                    // Tilled soil and crops
                                    if (Math.abs(dx) <= 8 && Math.abs(dy) <= 8 && dx !== 0 && dy !== 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SOIL;
                                        if (Math.random() < 0.5) {
                                            const crop = Math.random() < 0.5 ? BlockType.CROP_STAGE_2 : BlockType.CROP_STAGE_3;
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = crop;
                                        }
                                    }
                                    // Fences
                                    if (Math.abs(dx) === 12 || Math.abs(dy) === 12) {
                                        if (Math.abs(dx) > 2 && Math.abs(dy) > 2 && Math.random() < 0.8) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_WALL;
                                        }
                                    }
                                } else if (lotTypeVal === 'VILLAGE') {
                                    if (Math.abs(dx) <= 2 || Math.abs(dy) <= 2) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT_PATH;
                                    }
                                } else if (lotTypeVal === 'RUINS') {
                                    if (Math.random() < 0.5) {
                                        chunk.blocks[x + y * CHUNK_SIZE + baseZ * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STONE;
                                    }
                                    if (Math.abs(dx) === 10 || Math.abs(dy) === 10) {
                                        if (Math.random() < 0.6) {
                                            chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HEAVY_STONE;
                                            if (Math.random() < 0.4) {
                                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HEAVY_STONE;
                                            }
                                        }
                                    }
                                    // Cobwebs
                                    if (Math.random() < 0.05) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SPIDER_WEB;
                                    }
                                    // Chest
                                    if (dx === 0 && dy === 0) {
                                        chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
                                    }
                                }
                                
                                // Make sure we set highest properly!
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

                    // Structure Placements Overlay
                    if (lotTypeVal === 'VILLAGE') {
                        const houseCenters = [
                            {hx: -8, hy: -8}, {hx: 8, hy: -8}, {hx: -8, hy: 8}, {hx: 8, hy: 8}
                        ];
                        for (const hc of houseCenters) {
                            TerrainGenerator.buildStructureLocal(chunk, 'VILLAGE_HOUSE', ix + hc.hx - minWx, iy + hc.hy - minWy, baseZ);
                        }
                        TerrainGenerator.buildStructureLocal(chunk, 'VILLAGE_WELL', ix - minWx, iy - minWy, baseZ);
                        // Place Village Bell by the well
                        const cx = ix - minWx + 3, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.VILLAGE_BELL;
                        }
                    } else if (lotTypeVal === 'WIZARD_TOWER') {
                        TerrainGenerator.buildStructureLocal(chunk, 'WIZARD_TOWER', ix - minWx, iy - minWy, baseZ);
                    } else if (lotTypeVal === 'ARENA') {
                        TerrainGenerator.buildStructureLocal(chunk, 'ARENA', ix - minWx, iy - minWy, baseZ);
                    } else if (lotTypeVal === 'ARENA_WORM') {
                        TerrainGenerator.buildStructureLocal(chunk, 'ARENA_WORM', ix - minWx, iy - minWy, baseZ);
                    } else if (lotTypeVal === 'ARENA_WIZARD') {
                        TerrainGenerator.buildStructureLocal(chunk, 'ARENA_WIZARD', ix - minWx, iy - minWy, baseZ);
                    } else if (lotTypeVal === 'FARM') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.VILLAGE_BELL;
                        }
                    } else if (lotTypeVal === 'HALFLING_VILLAGE') {
                        const houseCenters = [
                            {hx: -6, hy: -6}, {hx: 6, hy: -6}, {hx: 0, hy: 6}
                        ];
                        for (const hc of houseCenters) {
                            const cx = ix + hc.hx - minWx;
                            const cy = iy + hc.hy - minWy;
                            if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                                chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HALFLING_HOUSE_SPAWNER;
                            }
                        }
                    } else if (lotTypeVal === 'POMERANIAN_CARAVAN_CAMP') {
                        // Place a campfire surrounded by wagons
                        const hcx = ix - minWx, hcy = iy - minWy;
                        if (hcx >= 0 && hcx < CHUNK_SIZE && hcy >= 0 && hcy < CHUNK_SIZE) {
                            chunk.blocks[hcx + hcy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                        }
                        const wagonPlacements = [
                            {hx: -4, hy: 0}, {hx: 4, hy: 0}, {hx: 0, hy: 4}
                        ];
                        for (const hc of wagonPlacements) {
                            const cx = ix + hc.hx - minWx;
                            const cy = iy + hc.hy - minWy;
                            if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                                chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.POMERANIAN_WAGON;
                            }
                        }
                    } else if (lotTypeVal === 'WOLF_FOLK_CAMP') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                            
                        }
                        const tents = [{x: cx + 3, y: cy}, {x: cx - 3, y: cy}, {x: cx, y: cy + 3}, {x: cx, y: cy - 3}];
                        for (const t of tents) {
                            if (t.x >= 0 && t.x < CHUNK_SIZE && t.y >= 0 && t.y < CHUNK_SIZE) {
                                chunk.blocks[t.x + t.y * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOLF_FOLK_CAMP;
                            }
                        }
                    } else if (lotTypeVal === 'TERRIER_OUTPOST') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TERRIER_TENT;
                        }
                    } else if (lotTypeVal === 'PIT_BULL_OUTPOST') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PIT_BULL_TENT;
                        }
                    } else if (lotTypeVal === 'HUMAN_CASTLE') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HUMAN_CASTLE_SPAWNER;
                        }
                    } else if (lotTypeVal === 'HUMAN_OUTPOST') {
                        const cx = ix - minWx, cy = iy - minWy;
                        if (cx >= 0 && cx < CHUNK_SIZE && cy >= 0 && cy < CHUNK_SIZE) {
                            chunk.blocks[cx + cy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HUMAN_OUTPOST_SPAWNER;
                        }
                    } else if (lotTypeVal === 'CAMP') {
                        const hx1 = ix - 6 - minWx, hy1 = iy - 6 - minWy;
                        const hx2 = ix + 6 - minWx, hy2 = iy + 6 - minWy;
                        if (hx1 >= 0 && hx1 < CHUNK_SIZE && hy1 >= 0 && hy1 < CHUNK_SIZE) {
                            if (Math.random() < 0.2) chunk.blocks[hx1 + hy1 * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GOBLIN_TENT_ALCHEMIST;
                            else if (Math.random() < 0.2) chunk.blocks[hx1 + hy1 * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ORC_TENT_BRUTE;
                            else chunk.blocks[hx1 + hy1 * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TENT;
                        }
                        if (hx2 >= 0 && hx2 < CHUNK_SIZE && hy2 >= 0 && hy2 < CHUNK_SIZE) {
                            if (Math.random() < 0.2) chunk.blocks[hx2 + hy2 * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KOBOLD_TENT_WARRIOR;
                            else chunk.blocks[hx2 + hy2 * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TENT;
                        }
                        const hcx = ix - minWx, hcy = iy - minWy;
                        if (hcx >= 0 && hcx < CHUNK_SIZE && hcy >= 0 && hcy < CHUNK_SIZE) {
                            chunk.blocks[hcx + hcy * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
                        }
                        const htx = hcx + 2, hty = hcy;
                        if (htx >= 0 && htx < CHUNK_SIZE && hty >= 0 && hty < CHUNK_SIZE) {
                            chunk.blocks[htx + hty * CHUNK_SIZE + (baseZ + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TRUNK;
                        }
                    }
                    
                    // Always recompute heightmap inside the lot if we did structure overlay
                    if (lotTypeVal === 'CASTLE' || lotTypeVal === 'DEEP_DUNGEON' || lotTypeVal === 'TEMPLE' || lotTypeVal === 'VILLAGE' || lotTypeVal === 'CAMP' || lotTypeVal === 'WIZARD_TOWER' || lotTypeVal === 'FARM' || lotTypeVal === 'ARENA' || lotTypeVal === 'ARENA_WORM' || lotTypeVal === 'ARENA_WIZARD' || lotTypeVal === 'HALFLING_VILLAGE' || lotTypeVal === 'POMERANIAN_CARAVAN_CAMP' || lotTypeVal === 'WOLF_FOLK_CAMP' || lotTypeVal === 'TERRIER_OUTPOST' || lotTypeVal === 'PIT_BULL_OUTPOST' || lotTypeVal === 'HUMAN_CASTLE' || lotTypeVal === 'HUMAN_OUTPOST') {
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
        TerrainGenerator.applyDungeons(chunk);
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

    static applyDungeons(chunk: Chunk) {
        const { cx, cy, activePlanet } = chunk;
        if (cx >= 60000) {
            TerrainGenerator.generateAbyssalRealm(chunk);
            return;
        }

        // Overworld seamless dungeons
        if (PlanetRegistry.get(activePlanet).safeAreaMethod === 'BOX') {
            if (cx >= -2 && cx <= 2 && cy >= -2 && cy <= 2) {
                return;
            }
        } else if (PlanetRegistry.get(activePlanet).safeAreaMethod === 'RADIAL') {
            if (cx * cx + cy * cy <= 4) {
                return;
            }
        }

        const isHeart = activePlanet === 'HEART';
        const isTarhe = activePlanet === 'TARHE';
        const wallBlock = isHeart ? BlockType.OBSIDIAN : (isTarhe ? BlockType.MINE_SHAFT_WOOD : BlockType.HEAVY_STONE);
        const floorBlock = isHeart ? BlockType.BLACK_MARBLE : (isTarhe ? BlockType.DEEP_SLATE : BlockType.DUNGEON_FLOOR);

        // Grid size of 4x4 chunks (64x64 blocks)
        const gx = Math.floor(cx / 4);
        const gy = Math.floor(cy / 4);
        
        // Simple seeded random based on grid coords
        const seedVal = Math.abs(Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453);
        
        if (seedVal % 1 < 0.2) { // 20% chance for a dungeon in this 4x4 area
            // Base Z level for the dungeon
            const dungeonZ = 8; // Between Z=3 and Z=12
            
            // Generate a few rooms
            const numRooms = 3 + Math.floor((seedVal * 10) % 4);
            const rooms = [];
            
            for (let i = 0; i < numRooms; i++) {
                const rs = Math.abs(Math.sin(seedVal + i * 1.234) * 10000);
                const rw = 5 + Math.floor(rs % 6);
                const rh = 5 + Math.floor((rs / 10) % 6);
                const rx = (gx * 64) + 10 + Math.floor((rs / 100) % 40);
                const ry = (gy * 64) + 10 + Math.floor((rs / 1000) % 40);
                rooms.push({ x: rx, y: ry, w: rw, h: rh });
            }
            
            // Carve rooms into this chunk
            for (let x = 0; x < CHUNK_SIZE; x++) {
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    const wx = cx * CHUNK_SIZE + x;
                    const wy = cy * CHUNK_SIZE + y;
                    
                    let inRoom = false;
                    let isWall = false;
                    
                    for (const r of rooms) {
                        if (wx >= r.x && wx < r.x + r.w && wy >= r.y && wy < r.y + r.h) {
                            if (wx === r.x || wx === r.x + r.w - 1 || wy === r.y || wy === r.y + r.h - 1) {
                                isWall = true;
                            } else {
                                inRoom = true;
                            }
                        }
                    }
                    
                    if (inRoom && !isWall) {
                        for (let z = dungeonZ; z < dungeonZ + 4; z++) {
                            chunk.setBlock(x, y, z, BlockType.AIR);
                        }
                        chunk.setBlock(x, y, dungeonZ - 1, floorBlock);
                        chunk.setBlock(x, y, dungeonZ + 4, wallBlock);
                        
                        if (isHeart) {
                            const detailSeed = Math.abs(Math.sin(wx * 2.34 + wy * 3.45) * 100);
                            if (detailSeed % 1 < 0.05) {
                                chunk.setBlock(x, y, dungeonZ, BlockType.GLOWING_MUSHROOM_BLOCK);
                            } else if (detailSeed % 1 > 0.98) {
                                chunk.setBlock(x, y, dungeonZ, BlockType.DARK_ELF_SPAWNER);
                            }
                        } else if (isTarhe) {
                            const detailSeed = Math.abs(Math.sin(wx * 4.34 + wy * 1.45) * 100);
                            if (detailSeed % 1 < 0.05) {
                                chunk.setBlock(x, y, dungeonZ, BlockType.LANTERN_BLOCK);
                            } else if (detailSeed % 1 > 0.98) {
                                chunk.setBlock(x, y, dungeonZ, BlockType.GNOME_SPAWNER);
                            }
                        }
                    } else if (isWall) {
                        for (let z = dungeonZ - 1; z <= dungeonZ + 4; z++) {
                            chunk.setBlock(x, y, z, wallBlock);
                        }
                    }
                }
            }
            
            // Carve corridors (simple lines between room centers)
            for (let i = 0; i < rooms.length - 1; i++) {
                const r1 = rooms[i];
                const r2 = rooms[i+1];
                const c1x = Math.floor(r1.x + r1.w/2);
                const c1y = Math.floor(r1.y + r1.h/2);
                const c2x = Math.floor(r2.x + r2.w/2);
                const c2y = Math.floor(r2.y + r2.h/2);
                
                // Draw L-shape corridor
                TerrainGenerator.carveCorridor(chunk, c1x, c1y, c2x, c1y, dungeonZ, wallBlock, floorBlock);
                TerrainGenerator.carveCorridor(chunk, c2x, c1y, c2x, c2y, dungeonZ, wallBlock, floorBlock);
            }
        }
        
        // Abyssal Gateway at bottom of world (Z=2)
        if (Math.abs(Math.sin(cx * 7.123 + cy * 3.456) * 10000) % 1 < 0.05) {
            // 5% chance per chunk to have a gateway
            const gx = Math.floor(Math.abs(Math.sin(cx * 1.1) * 10)) + 3;
            const gy = Math.floor(Math.abs(Math.sin(cy * 1.1) * 10)) + 3;
            chunk.setBlock(gx, gy, 2, BlockType.ABYSSAL_GATEWAY);
            chunk.setBlock(gx, gy, 1, BlockType.OBSIDIAN);
        }
    }

    static carveCorridor(chunk: Chunk, x1: number, y1: number, x2: number, y2: number, z: number, wallBlock: BlockType = BlockType.HEAVY_STONE, floorBlock: BlockType = BlockType.DUNGEON_FLOOR) {
        const { cx, cy } = chunk;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        for (let wx = minX; wx <= maxX; wx++) {
            for (let wy = minY; wy <= maxY; wy++) {
                // Check if in this chunk
                if (wx >= cx * CHUNK_SIZE && wx < (cx + 1) * CHUNK_SIZE &&
                    wy >= cy * CHUNK_SIZE && wy < (cy + 1) * CHUNK_SIZE) {
                    
                    const lx = wx - cx * CHUNK_SIZE;
                    const ly = wy - cy * CHUNK_SIZE;
                    
                    for (let dz = z; dz < z + 3; dz++) {
                        chunk.setBlock(lx, ly, dz, BlockType.AIR);
                    }
                    chunk.setBlock(lx, ly, z - 1, floorBlock);
                    chunk.setBlock(lx, ly, z + 3, wallBlock);
                    
                    // Walls
                    TerrainGenerator.setBlockSafe(chunk, lx - 1, ly, z, wallBlock);
                    TerrainGenerator.setBlockSafe(chunk, lx + 1, ly, z, wallBlock);
                    TerrainGenerator.setBlockSafe(chunk, lx, ly - 1, z, wallBlock);
                    TerrainGenerator.setBlockSafe(chunk, lx, ly + 1, z, wallBlock);
                }
            }
        }
    }
    
    static setBlockSafe(chunk: Chunk, lx: number, ly: number, z: number, type: BlockType) {
        if (lx >= 0 && lx < CHUNK_SIZE && ly >= 0 && ly < CHUNK_SIZE && z >= 0 && z < WORLD_HEIGHT) {
            const current = chunk.blocks[lx + ly * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE];
            if (current !== BlockType.AIR && current !== BlockType.DUNGEON_FLOOR) {
                chunk.blocks[lx + ly * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = type;
            }
        }
    }

    static generateAbyssalRealm(chunk: Chunk) {
        const { cx, cy } = chunk;
        const floor = Math.floor((cx - 60000) / 10);
        const localCx = (cx - 60000) % 10;
        const localCy = cy;
        
        // Bounded 10x10 chunk area (160x160 blocks)
        if (localCy < 0 || localCy >= 10) {
            // Empty void outside
            return;
        }
        
        const seedVal = Math.abs(Math.sin(floor * 123.456) * 10000);
        
        // Fill with Abyssal Brick
        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let z = 0; z < 10; z++) {
                    chunk.setBlock(x, y, z, BlockType.ABYSSAL_BRICK);
                }
            }
        }
        
        // Generate rooms for this floor
        const numRooms = 10 + Math.floor((seedVal * 10) % 10);
        const rooms = [];
        
        for (let i = 0; i < numRooms; i++) {
            const rs = Math.abs(Math.sin(seedVal + i * 1.234) * 10000);
            const rw = 6 + Math.floor(rs % 8);
            const rh = 6 + Math.floor((rs / 10) % 8);
            const rx = 10 + Math.floor((rs / 100) % 120);
            const ry = 10 + Math.floor((rs / 1000) % 120);
            rooms.push({ x: rx, y: ry, w: rw, h: rh });
        }
        
        // Carve rooms
        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                const wx = localCx * CHUNK_SIZE + x;
                const wy = localCy * CHUNK_SIZE + y;
                
                let inRoom = false;
                let isWall = false;
                
                for (const r of rooms) {
                    if (wx >= r.x && wx < r.x + r.w && wy >= r.y && wy < r.y + r.h) {
                        if (wx === r.x || wx === r.x + r.w - 1 || wy === r.y || wy === r.y + r.h - 1) {
                            isWall = true;
                        } else {
                            inRoom = true;
                        }
                    }
                }
                
                if (inRoom && !isWall) {
                    for (let z = 2; z < 7; z++) {
                        chunk.setBlock(x, y, z, BlockType.AIR);
                    }
                    chunk.setBlock(x, y, 1, BlockType.ABYSSAL_FLOOR);
                    
                    // Spawn chests and spawners in the center of rooms
                    if (inRoom && !isWall) {
                        for (const r of rooms) {
                            const cx = r.x + Math.floor(r.w/2);
                            const cy = r.y + Math.floor(r.h/2);
                            if (wx === cx && wy === cy) {
                                if (Math.random() < 0.3) {
                                    chunk.setBlock(x, y, 2, BlockType.CHEST);
                                } else if (Math.random() < 0.5) {
                                    chunk.setBlock(x, y, 2, BlockType.ABYSSAL_SPAWNER);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Carve corridors
        for (let i = 0; i < rooms.length - 1; i++) {
            const r1 = rooms[i];
            const r2 = rooms[i+1];
            const c1x = Math.floor(r1.x + r1.w/2);
            const c1y = Math.floor(r1.y + r1.h/2);
            const c2x = Math.floor(r2.x + r2.w/2);
            const c2y = Math.floor(r2.y + r2.h/2);
            
            TerrainGenerator.carveAbyssalCorridor(chunk, c1x, c1y, c2x, c1y, 2, localCx, localCy);
            TerrainGenerator.carveAbyssalCorridor(chunk, c2x, c1y, c2x, c2y, 2, localCx, localCy);
        }
        
        // Place stairs
        const startRoom = rooms[0];
        const endRoom = rooms[rooms.length - 1];
        
        if (localCx * CHUNK_SIZE <= startRoom.x + 2 && (localCx + 1) * CHUNK_SIZE > startRoom.x + 2 &&
            localCy * CHUNK_SIZE <= startRoom.y + 2 && (localCy + 1) * CHUNK_SIZE > startRoom.y + 2) {
            chunk.setBlock(startRoom.x + 2 - localCx * CHUNK_SIZE, startRoom.y + 2 - localCy * CHUNK_SIZE, 2, BlockType.STAIRS_UP);
        }
        
        if (localCx * CHUNK_SIZE <= endRoom.x + 2 && (localCx + 1) * CHUNK_SIZE > endRoom.x + 2 &&
            localCy * CHUNK_SIZE <= endRoom.y + 2 && (localCy + 1) * CHUNK_SIZE > endRoom.y + 2) {
            chunk.setBlock(endRoom.x + 2 - localCx * CHUNK_SIZE, endRoom.y + 2 - localCy * CHUNK_SIZE, 2, BlockType.STAIRS_DOWN);
        }
    }
    
    static carveAbyssalCorridor(chunk: Chunk, x1: number, y1: number, x2: number, y2: number, z: number, localCx: number, localCy: number) {
        const { cx, cy } = chunk;
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        
        for (let wx = minX; wx <= maxX; wx++) {
            for (let wy = minY; wy <= maxY; wy++) {
                if (wx >= localCx * CHUNK_SIZE && wx < (localCx + 1) * CHUNK_SIZE &&
                    wy >= localCy * CHUNK_SIZE && wy < (localCy + 1) * CHUNK_SIZE) {
                    
                    const lx = wx - localCx * CHUNK_SIZE;
                    const ly = wy - localCy * CHUNK_SIZE;
                    
                    for (let dz = z; dz < z + 4; dz++) {
                        chunk.setBlock(lx, ly, dz, BlockType.AIR);
                    }
                    chunk.setBlock(lx, ly, z - 1, BlockType.ABYSSAL_FLOOR);
                }
            }
        }
    }


    }
