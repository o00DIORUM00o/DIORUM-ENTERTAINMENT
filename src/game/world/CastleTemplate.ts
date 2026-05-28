import { Chunk } from './Chunk';
import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';

export interface CastleArchetype {
    floors: number;
    wallBlock: BlockType;
    floorBlock: BlockType;
    stairBlock: BlockType;
    spawnersByFloor: BlockType[];
    chestFloor: number;
    radius?: number;
    doorBlock?: BlockType;
}

export class CastleTemplate {
    static build(chunk: Chunk, x: number, y: number, dx: number, dy: number, baseZ: number, archetype: CastleArchetype) {
        const radius = archetype.radius || 10;
        
        if (Math.abs(dx) <= radius + 1 && Math.abs(dy) <= radius + 1) {
            // Pre-clear space up to max height to ensure no terrain is overlapping
            const maxZ = baseZ + 1 + (archetype.floors * 3);
            for (let z = baseZ + 1; z <= Math.min(maxZ, WORLD_HEIGHT - 1); z++) {
                chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
            }

            if (Math.abs(dx) <= radius && Math.abs(dy) <= radius) {
                for (let f = 0; f < archetype.floors; f++) {
                const zFloor = baseZ + 1 + (f * 3);
                if (zFloor >= WORLD_HEIGHT) continue;
                
                // Floor
                chunk.blocks[x + y * CHUNK_SIZE + zFloor * CHUNK_SIZE * CHUNK_SIZE] = (f === 0) ? BlockType.CASTLE_STONE : archetype.floorBlock;
                
                // Internal space / ceiling
                const zCeil = zFloor + 3; // The ceiling is the next floor
                
                // Walls
                const isWall = Math.abs(dx) === radius || Math.abs(dy) === radius;
                
                if (isWall) {
                    for (let hz = 1; hz < 3; hz++) {
                        const zWall = zFloor + hz;
                        if (zWall < WORLD_HEIGHT) {
                            chunk.blocks[x + y * CHUNK_SIZE + zWall * CHUNK_SIZE * CHUNK_SIZE] = archetype.wallBlock;
                        }
                    }
                    
                    // Windows every 3 blocks, height zWall + 1
                    if (f > 0 && Math.abs(dx) % 3 === 0 && Math.abs(dy) % 3 === 0 && dx !== dy && dx !== -dy) {
                        if (zFloor + 1 < WORLD_HEIGHT) {
                            chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR; // Window
                        }
                    }
                }
                
                // Doors at ground floor on all 4 sides
                if (f === 0 && ((Math.abs(dy) === radius && dx === 0) || (Math.abs(dx) === radius && dy === 0))) {
                    const door = archetype.doorBlock || BlockType.STONE_DOOR_CLOSED;
                    if (zFloor + 1 < WORLD_HEIGHT) chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 1) * CHUNK_SIZE * CHUNK_SIZE] = door;
                    if (zFloor + 2 < WORLD_HEIGHT) chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 2) * CHUNK_SIZE * CHUNK_SIZE] = archetype.wallBlock; // Above door
                }

                // Internal
                if (!isWall) {
                    // Spawners
                    if (f < archetype.floors - 1) { // Not top floor necessarily, but according to array
                        const spawner = archetype.spawnersByFloor[f];
                        if (spawner && dx === -5 && dy === 5) {
                            chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 1) * CHUNK_SIZE * CHUNK_SIZE] = spawner;
                        }
                        if (spawner && dx === 5 && dy === -5) {
                            chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 1) * CHUNK_SIZE * CHUNK_SIZE] = spawner;
                        }
                    }
                    
                    // Chest
                    if (f === archetype.chestFloor && dx === 0 && dy === 0) {
                        chunk.blocks[x + y * CHUNK_SIZE + (zFloor + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
                    }
                }
            }
            
            // Stairs
            for (let f = 0; f < archetype.floors - 1; f++) {
                const stairLoc = (f % 2 === 0) ? -radius + 2 : radius - 2;
                if (dx === stairLoc && Math.abs(dy) <= 1) {
                    const zFloor = baseZ + 1 + (f * 3);
                    const zNextFloor = zFloor + 3;
                    for (let hz = zFloor + 1; hz <= zNextFloor; hz++) {
                        if (hz < WORLD_HEIGHT) {
                            chunk.blocks[x + y * CHUNK_SIZE + hz * CHUNK_SIZE * CHUNK_SIZE] = archetype.stairBlock;
                        }
                    }
                }
            }
            }
        }
    }
}
