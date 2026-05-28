import { BlockType } from '../constants/BlockType';
import { Chunk } from './Chunk';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';

export interface DungeonArchetype {
    floors: number; // e.g. 2
    wallBlock: BlockType;
    floorBlock: BlockType;
    pillarBlock: BlockType;
    ceilingBlock: BlockType;
    surfaceRuinBlock?: BlockType;
    spawnersByFloor: BlockType[]; // e.g. [BlockType.BONE_PILE_SPAWNER, BlockType.ORC_TENT_BRUTE]
    radius?: number; // default 15
    hasBottomFloorHalls?: boolean;
    bossSpawner?: BlockType;
}

export class DungeonTemplate {
    static carve(chunk: Chunk, x: number, y: number, dx: number, dy: number, baseZ: number, archetype: DungeonArchetype) {
        const radius = archetype.radius || 15;
        const outerBound = archetype.hasBottomFloorHalls ? radius + 25 : radius + 3;

        if (Math.abs(dx) <= outerBound && Math.abs(dy) <= outerBound) {
            // Surface ruins (if specified)
            if (archetype.surfaceRuinBlock && baseZ + 1 >= 0 && baseZ + 1 < WORLD_HEIGHT) {
                if (archetype.hasBottomFloorHalls) { // Ziggurat surface style
                    const adx = Math.abs(dx);
                    const ady = Math.abs(dy);
                    const maxD = Math.max(adx, ady);
                    if (maxD <= 7) {
                        const height = 7 - maxD;
                        for (let h = 0; h <= height; h++) {
                            if (baseZ + 1 + h < WORLD_HEIGHT) {
                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + h) * CHUNK_SIZE * CHUNK_SIZE] = (h === height && maxD > 1) ? archetype.surfaceRuinBlock : BlockType.AIR;
                                if (h === height && maxD <= 1) {
                                    // Opening for staircase going down
                                }
                            }
                        }
                        // Set the actual blocks at the step level
                        if (maxD > 1) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + (7 - maxD)) * CHUNK_SIZE * CHUNK_SIZE] = archetype.surfaceRuinBlock;
                        // Fill inside solid
                        for (let h = 0; h < 7 - maxD; h++) {
                             chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + h) * CHUNK_SIZE * CHUNK_SIZE] = archetype.surfaceRuinBlock;
                        }
                        // Clear a path down
                        if (maxD <= 1) {
                            for (let h = 0; h <= 7; h++) {
                                chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                            }
                        }
                    }
                } else {
                    if (Math.abs(dx) === 6 && Math.abs(dy) <= 6 && dy !== 0) {
                        for(let h=0; h<2; h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + h) * CHUNK_SIZE * CHUNK_SIZE] = archetype.surfaceRuinBlock;
                    }
                    if (Math.abs(dy) === 6 && Math.abs(dx) <= 6 && dx !== 0) {
                        for(let h=0; h<2; h++) chunk.blocks[x + y * CHUNK_SIZE + (baseZ + 1 + h) * CHUNK_SIZE * CHUNK_SIZE] = archetype.surfaceRuinBlock;
                    }
                }
            }
            
            const floorElevations = [];
            for (let i = 0; i < archetype.floors; i++) {
                // floor -2, then -5, then -8, etc.
                floorElevations.push(baseZ - 2 - (i * 3));
            }
            
            for (let i = 0; i < floorElevations.length; i++) {
                const fz = floorElevations[i];
                if (fz <= 0 || fz >= WORLD_HEIGHT) continue;
                
                let inCarveZone = false;
                let isWall = false;
                let isPillar = false;
                let isTorchInfo = false;
                let spawnerToPlace: BlockType | null = null;
                let isChest = false;

                const rSq = dx*dx + dy*dy;
                if (rSq < radius * radius) {
                    inCarveZone = true;
                    if (Math.abs(dx) === radius - 1 || Math.abs(dy) === radius - 1) isWall = true;
                    if (Math.abs(dx) % 5 === 0 && Math.abs(dy) % 5 === 0 && Math.abs(dx) <= 10 && Math.abs(dy) <= 10 && dx !== 0 && dy !== 0) isPillar = true;
                    if (dx === 0 && Math.abs(dy) === 8) isTorchInfo = true;
                    
                    if (Math.abs(dx) === 10 && Math.abs(dy) === 10) spawnerToPlace = archetype.spawnersByFloor[Math.min(i, archetype.spawnersByFloor.length - 1)];
                    if (Math.abs(dx) === 12 && Math.abs(dy) === 0 && i === archetype.floors - 1) isChest = true;
                }

                if (archetype.hasBottomFloorHalls && i === archetype.floors - 1) {
                    const roomD = radius + 15;
                    const isNSHall = Math.abs(dx) <= 2 && Math.abs(dy) >= radius - 2 && Math.abs(dy) <= roomD;
                    const isEWHall = Math.abs(dy) <= 2 && Math.abs(dx) >= radius - 2 && Math.abs(dx) <= roomD;
                    
                    const isNRoom = Math.abs(dx) <= 6 && Math.abs(dy + roomD) <= 6;
                    const isSRoom = Math.abs(dx) <= 6 && Math.abs(dy - roomD) <= 6;
                    const isERoom = Math.abs(dx - roomD) <= 6 && Math.abs(dy) <= 6;
                    const isWRoom = Math.abs(dx + roomD) <= 6 && Math.abs(dy) <= 6;
                    
                    if (isNSHall || isEWHall || isNRoom || isSRoom || isERoom || isWRoom) {
                        inCarveZone = true;
                        
                        // Walls around halls and rooms
                        const isNSHallWall = Math.abs(dx) === 3 && Math.abs(dy) >= radius - 2 && Math.abs(dy) <= roomD - 5;
                        const isEWHallWall = Math.abs(dy) === 3 && Math.abs(dx) >= radius - 2 && Math.abs(dx) <= roomD - 5;
                        
                        const nRoomWall = isNRoom && (Math.abs(dx) === 6 || Math.abs(dy + roomD) === 6) && !(dy === -(roomD-6) && Math.abs(dx) <= 2);
                        const sRoomWall = isSRoom && (Math.abs(dx) === 6 || Math.abs(dy - roomD) === 6) && !(dy === (roomD-6) && Math.abs(dx) <= 2);
                        const eRoomWall = isERoom && (Math.abs(dx - roomD) === 6 || Math.abs(dy) === 6) && !(dx === (roomD-6) && Math.abs(dy) <= 2);
                        const wRoomWall = isWRoom && (Math.abs(dx + roomD) === 6 || Math.abs(dy) === 6) && !(dx === -(roomD-6) && Math.abs(dy) <= 2);

                        if (isNSHallWall || isEWHallWall || nRoomWall || sRoomWall || eRoomWall || wRoomWall) isWall = true;

                        // Punch holes for hall entrances
                        if (rSq < radius * radius && (Math.abs(dx) <= 2 || Math.abs(dy) <= 2)) isWall = false;

                        // Add chests and spawners in the rooms at the end of halls
                        if (dx === 0 && dy === -roomD) spawnerToPlace = archetype.bossSpawner || archetype.spawnersByFloor[Math.min(i, archetype.spawnersByFloor.length - 1)];
                        if (dx === 0 && dy === roomD) spawnerToPlace = archetype.spawnersByFloor[Math.min(i, archetype.spawnersByFloor.length - 1)];
                        if (dy === 0 && Math.abs(dx) === roomD) isChest = true;
                        
                        // Add some torches in rooms
                        if (Math.abs(dx) === 5 && Math.abs(dy + roomD) === 5) isTorchInfo = true;
                        if (Math.abs(dx) === 5 && Math.abs(dy - roomD) === 5) isTorchInfo = true;
                        if (Math.abs(dx - roomD) === 5 && Math.abs(dy) === 5) isTorchInfo = true;
                        if (Math.abs(dx + roomD) === 5 && Math.abs(dy) === 5) isTorchInfo = true;
                    }
                }

                if (inCarveZone) {
                    for (let h = 0; h < 2; h++) {
                        if (fz + h < WORLD_HEIGHT) {
                            chunk.blocks[x + y * CHUNK_SIZE + (fz + h) * CHUNK_SIZE * CHUNK_SIZE] = isWall ? archetype.wallBlock : (isPillar ? archetype.pillarBlock : BlockType.AIR);
                        }
                    }
                    if (fz - 1 > 0) {
                        chunk.blocks[x + y * CHUNK_SIZE + (fz - 1) * CHUNK_SIZE * CHUNK_SIZE] = archetype.floorBlock;
                    }
                    if (fz + 2 < WORLD_HEIGHT) {
                        chunk.blocks[x + y * CHUNK_SIZE + (fz + 2) * CHUNK_SIZE * CHUNK_SIZE] = archetype.ceilingBlock;
                    }

                    if (!isWall && !isPillar) {
                        if (isTorchInfo) chunk.blocks[x + y * CHUNK_SIZE + fz * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TORCH;
                        if (spawnerToPlace) chunk.blocks[x + y * CHUNK_SIZE + fz * CHUNK_SIZE * CHUNK_SIZE] = spawnerToPlace;
                        if (isChest) chunk.blocks[x + y * CHUNK_SIZE + fz * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
                    }
                }
            }
            
            for (let floor = 1; floor <= archetype.floors; floor++) {
                const stairDx = (floor % 2 === 1) ? -2 : 2; 
                if (dx === stairDx && dy === 0) {
                    const lowerFz = baseZ - (floor * 3) + 1;
                    const upperSolid = lowerFz + 2; 
                    for (let hz = lowerFz; hz <= upperSolid; hz++) {
                        if (hz > 0 && hz < WORLD_HEIGHT) {
                            chunk.blocks[x + y * CHUNK_SIZE + hz * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DUNGEON_STAIRS;
                        }
                    }
                }
            }
        }
    }
}
