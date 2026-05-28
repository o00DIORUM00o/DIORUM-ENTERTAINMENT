import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { Chunk } from './Chunk';
import { PlanetRegistry } from '../registries/PlanetRegistry';

export class DungeonCarver {
    static applyDungeons(chunk: Chunk) {
        const { cx, cy, activePlanet } = chunk;
        if (cx >= 60000) {
            DungeonCarver.generateAbyssalRealm(chunk);
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
        const wallBlock = isHeart ? BlockType.OBSIDIAN : (isTarhe ? BlockType.MINE_SHAFT_WOOD : BlockType.CASTLE_STONE);
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
                DungeonCarver.carveCorridor(chunk, c1x, c1y, c2x, c1y, dungeonZ, wallBlock, floorBlock);
                DungeonCarver.carveCorridor(chunk, c2x, c1y, c2x, c2y, dungeonZ, wallBlock, floorBlock);
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

    static carveCorridor(chunk: Chunk, x1: number, y1: number, x2: number, y2: number, z: number, wallBlock: BlockType = BlockType.CASTLE_STONE, floorBlock: BlockType = BlockType.DUNGEON_FLOOR) {
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
                    DungeonCarver.setBlockSafe(chunk, lx - 1, ly, z, wallBlock);
                    DungeonCarver.setBlockSafe(chunk, lx + 1, ly, z, wallBlock);
                    DungeonCarver.setBlockSafe(chunk, lx, ly - 1, z, wallBlock);
                    DungeonCarver.setBlockSafe(chunk, lx, ly + 1, z, wallBlock);
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
            
            DungeonCarver.carveAbyssalCorridor(chunk, c1x, c1y, c2x, c1y, 2, localCx, localCy);
            DungeonCarver.carveAbyssalCorridor(chunk, c2x, c1y, c2x, c2y, 2, localCx, localCy);
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
