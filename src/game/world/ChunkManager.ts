import { Chunk } from './Chunk';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { TerrainGenerator } from './TerrainGenerator';
import { BlockType } from '../constants/BlockType';

export class ChunkManager {
    world: any = null;
    chunks: Map<string, Chunk> = new Map();
    lastChunkCx: number | null = null;
    lastChunkCy: number | null = null;
    lastChunkPlanet: string | null = null;
    lastChunk: Chunk | null = null;

    setWorld(world: any) {
        this.world = world;
    }

    getChunkKey(activePlanet: string, cx: number, cy: number) {
        return `${activePlanet}_${cx},${cy}`;
    }

    getChunk(activePlanet: string, cx: number, cy: number): Chunk {
        if (this.lastChunkCx === cx && this.lastChunkCy === cy && this.lastChunkPlanet === activePlanet && this.lastChunk) {
            return this.lastChunk;
        }

        const key = this.getChunkKey(activePlanet, cx, cy);
        let chunk = this.chunks.get(key);
        
        if (!chunk) {
            chunk = new Chunk(cx, cy, activePlanet);
            // Pre-register to prevent recursion
            this.chunks.set(key, chunk);
            this.lastChunkCx = cx;
            this.lastChunkCy = cy;
            this.lastChunkPlanet = activePlanet;
            this.lastChunk = chunk;
            
            TerrainGenerator.generate(chunk);
            chunk.rebuildMetadata();
            
            if (this.world) {
                if (!this.world.hasBuiltSpawn && cx === 0 && cy === 0) {
                    this.world.buildSpawn();
                }

                // Check for Spawners placed by TerrainGenerator
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    for (let y = 0; y < CHUNK_SIZE; y++) {
                        for (let z = 0; z < WORLD_HEIGHT; z++) {
                            const block = chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE];
                            if (block === BlockType.QUEST_DUNGEON_SPAWNER) {
                                chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                this.world.buildDungeon(cx * CHUNK_SIZE + x, cy * CHUNK_SIZE + y);
                            } else if (block === BlockType.QUEST_NPC_SPAWNER) {
                                chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                                this.world.questNpcEntrances.push({ x: cx * CHUNK_SIZE + x, y: cy * CHUNK_SIZE + y, z });
                            }
                        }
                    }
                }

                if (!this.world.hasBuiltWizardTower && (Math.abs(cx) >= 1 || Math.abs(cy) >= 1)) {
                    if (Math.random() < 0.2) {
                        const lx = Math.floor(Math.random() * (CHUNK_SIZE - 10)) + 5;
                        const ly = Math.floor(Math.random() * (CHUNK_SIZE - 10)) + 5;
                        this.world.buildWizardTower(cx * CHUNK_SIZE + lx, cy * CHUNK_SIZE + ly);
                    }
                }
            }
        } else {
            this.lastChunkCx = cx;
            this.lastChunkCy = cy;
            this.lastChunkPlanet = activePlanet;
            this.lastChunk = chunk;
        }
        
        return chunk;
    }

    hasChunk(activePlanet: string, cx: number, cy: number): boolean {
        return this.chunks.has(this.getChunkKey(activePlanet, cx, cy));
    }

    getBlock(activePlanet: string, x: number, y: number, z: number): BlockType {
        if (z < 0 || z >= WORLD_HEIGHT) return BlockType.AIR;
        const cx = Math.floor(x / CHUNK_SIZE);
        const cy = Math.floor(y / CHUNK_SIZE);
        
        const chunk = this.getChunk(activePlanet, cx, cy);
        
        const lx = x - cx * CHUNK_SIZE;
        const ly = y - cy * CHUNK_SIZE;
        return chunk.getBlock(lx, ly, z);
    }

    setBlock(activePlanet: string, x: number, y: number, z: number, type: BlockType) {
        if (z < 0 || z >= WORLD_HEIGHT) return;
        const cx = Math.floor(x / CHUNK_SIZE);
        const cy = Math.floor(y / CHUNK_SIZE);
        
        const chunk = this.getChunk(activePlanet, cx, cy);
        
        const lx = x - cx * CHUNK_SIZE;
        const ly = y - cy * CHUNK_SIZE;
        chunk.setBlock(lx, ly, z, type);
    }

    getSurface(activePlanet: string, x: number, y: number, maxZ: number) {
        const cx = Math.floor(x / CHUNK_SIZE);
        const cy = Math.floor(y / CHUNK_SIZE);
        
        const chunk = this.getChunk(activePlanet, cx, cy);
        
        const lx = x - cx * CHUNK_SIZE;
        const ly = y - cy * CHUNK_SIZE;
        
        const highestZ = chunk.heightMap[lx + ly * CHUNK_SIZE];
        let drawZ = Math.min(maxZ, highestZ);
        
        let block = BlockType.AIR;
        while (drawZ >= 0) {
            block = chunk.getBlock(lx, ly, drawZ);
            if (block !== BlockType.AIR) break;
            drawZ--;
        }
        
        if (drawZ < 0) return { block: BlockType.AIR, z: -1, highestZ };
        
        return {
            block,
            z: drawZ,
            highestZ
        };
    }
}
