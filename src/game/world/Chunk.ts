import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { TerrainGenerator } from './TerrainGenerator';

export class Chunk {
    blocks: Uint16Array;
    heightMap: Uint8Array;
    // We store the global coordinates or local coords? Local coords is better: index = lx + ly*16 + z*256
    mechanisms: Set<number> = new Set();
    spawners: Set<number> = new Set();
    automation: Set<number> = new Set();

    constructor(public cx: number, public cy: number, public activePlanet: string = 'THRAE') {
        this.blocks = new Uint16Array(CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT);
        this.heightMap = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);
        // Generation is now explicit via TerrainGenerator
    }

    getBlock(x: number, y: number, z: number) {
        if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE || z < 0 || z >= WORLD_HEIGHT) return 0;
        return this.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE];
    }

    setBlock(x: number, y: number, z: number, type: number) {
        if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE || z < 0 || z >= WORLD_HEIGHT) return;
        const idx = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE;
        this.blocks[idx] = type;
        
        // Mechanism & Spawner tracking
        this.mechanisms.delete(idx);
        this.spawners.delete(idx);
        this.automation.delete(idx);
        
        // Add to tracking sets based on type (assuming types > 0)
        if (type !== 0) {
            // These numbers correspond to MechanismUpdater block checks
            if (type === 56 || type === 61 || type === 101 || type === 124 || type === 134 || type === 240 || type === 239 || type === 241 || type === 242) { // SPIKE_FLOOR, ACTIVE, WALL_SHOOTER, LEVER_ON, PRESSURE_PLATE_ACTIVE, WIRE_ON, WIRE_OFF, PISTON_CLOSED, PISTON_OPEN
                this.mechanisms.add(idx);
            }
            if (type === 244 || type === 250 || type === 88 || type === 89 || type === 90 || type === 84 || type === 85 || type === 86 || type === 87 || type === 91 || type === 303 || type === 304 || type === 305 || type === 306) { 
                // WORKER_GNOME, ARCHER_MERCENARY, AUTO_MINER, AUTO_DROPPER, AUTO_CRAFTER, BELTs, VACUUM_HOPPER, ARCANE_TURRET, GARDENER_GNOME, GUARD_MERCENARY, MINER_GNOME
                this.automation.add(idx);
            }
            // Add Spawners (from SpawnerUpdater and Updater)
            const isSpawner = type === 106 || type === 107 || type === 108 || type === 224 || type === 225 || type === 226 || type === 235 || type === 27 || type === 100 || type === 259 || type === 17 || type === 44 || type === 221 || type === 230 || type === 231 || type === 232 || type === 233 || type === 234 || type === 83 || type === 263 || type === 110 || type === 111 || type === 112 || type === 113 || type === 114 || type === 115 || type === 116 || type === 222 || type === 223 || type === 267 || type === 268 || [18, 39, 43, 251, 252, 253, 254, 255, 256, 257, 258, 260, 261, 262, 273, 274, 275, 276].includes(type);
            if (isSpawner) {
                this.spawners.add(idx);
            }
        }

        if (type !== 0 && z > this.heightMap[x + y * CHUNK_SIZE]) {
            this.heightMap[x + y * CHUNK_SIZE] = z;
        } else if (type === 0 && z === this.heightMap[x + y * CHUNK_SIZE]) {
            let newHighest = 0;
            for(let nz = z; nz >= 0; nz--) {
                if (this.blocks[x + y * CHUNK_SIZE + nz * CHUNK_SIZE * CHUNK_SIZE] !== 0) {
                    newHighest = nz;
                    break;
                }
            }
            this.heightMap[x + y * CHUNK_SIZE] = newHighest;
        }
    }

    rebuildMetadata() {
        this.mechanisms.clear();
        this.spawners.clear();
        this.automation.clear();
        
        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                let highestZ = 0;
                for (let z = 0; z < WORLD_HEIGHT; z++) {
                    const idx = x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE;
                    const type = this.blocks[idx];
                    if (type !== 0) {
                        highestZ = z;
                        
                        // Mechanism & Spawner tracking logic replicated
                        if (type === 56 || type === 61 || type === 101 || type === 124 || type === 134 || type === 240 || type === 239 || type === 241 || type === 242) { // SPIKE_FLOOR, ACTIVE, WALL_SHOOTER...
                            this.mechanisms.add(idx);
                        }
                        if (type === 244 || type === 250 || type === 88 || type === 89 || type === 90 || type === 84 || type === 85 || type === 86 || type === 87 || type === 91 || type === 303 || type === 304 || type === 305 || type === 306) { 
                            this.automation.add(idx);
                        }
                        const isSpawner = type === 106 || type === 107 || type === 108 || type === 224 || type === 225 || type === 226 || type === 235 || type === 27 || type === 100 || type === 259 || type === 17 || type === 44 || type === 221 || type === 230 || type === 231 || type === 232 || type === 233 || type === 234 || type === 83 || type === 263 || type === 110 || type === 111 || type === 112 || type === 113 || type === 114 || type === 115 || type === 116 || type === 222 || type === 223 || type === 267 || type === 268 || [18, 39, 43, 251, 252, 253, 254, 255, 256, 257, 258, 260, 261, 262, 273, 274, 275, 276].includes(type);
                        if (isSpawner) {
                            this.spawners.add(idx);
                        }
                    }
                }
                this.heightMap[x + y * CHUNK_SIZE] = highestZ;
            }
        }
    }
}
