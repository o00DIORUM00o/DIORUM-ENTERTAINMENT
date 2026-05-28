import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { TerrainGenerator } from './TerrainGenerator';
import { BlockType } from '../constants/BlockType';

export class Chunk {
    blocks: Uint16Array;
    heightMap: Uint8Array;
    // We store the global coordinates or local coords? Local coords is better: index = lx + ly*16 + z*256
    mechanisms: Set<number> = new Set();
    spawners: Set<number> = new Set();
    automation: Set<number> = new Set();

    constructor(public cx: number, public cy: number, public activePlanet: string = 'HERAT') {
        this.blocks = new Uint16Array(CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT);
        this.heightMap = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);
        // Generation is now explicit via TerrainGenerator
    }

    getBlock(x: number, y: number, z: number) {
        if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE || z < 0 || z >= WORLD_HEIGHT) return 0;
        return this.blocks[x | (y << 4) | (z << 8)];
    }

    setBlock(x: number, y: number, z: number, type: number) {
        if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE || z < 0 || z >= WORLD_HEIGHT) return;
        const idx = x | (y << 4) | (z << 8);
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
            const key = BlockType[type] || '';
            const isSpawner = key.includes('SPAWNER') || key.includes('TENT') || key.includes('CAMP') || key.includes('NEST') || key.includes('CAVE') || key.includes('DEN') || key.includes('SHRINE') || key.includes('PEDESTAL') || key.includes('ALTAR') || key === 'MERCHANT' || key === 'DRACONIC_MERCHANT' || key === 'SLUG_FOLK_MERCHANT' || key === 'BAG_MERCHANT_STALL' || key === 'BERRY_FARMER_SHED' || key === 'BEE_HIVE' || key === 'ANT_HILL' || key === 'VOID_BEACON' || key === 'SLIME_PUDDLE' || key === 'SPIDER_WEB' || key === 'DEMON_PORTAL' || key === 'LAVA_POOL' || key.startsWith('STALL_');
            if (isSpawner) {
                this.spawners.add(idx);
            }
        }

        if (type !== 0 && z > this.heightMap[x | (y << 4)]) {
            this.heightMap[x | (y << 4)] = z;
        } else if (type === 0 && z === this.heightMap[x | (y << 4)]) {
            let newHighest = 0;
            for(let nz = z; nz >= 0; nz--) {
                if (this.blocks[x | (y << 4) | (nz << 8)] !== 0) {
                    newHighest = nz;
                    break;
                }
            }
            this.heightMap[x | (y << 4)] = newHighest;
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
                        const key = BlockType[type] || '';
                        const isSpawner = key.includes('SPAWNER') || key.includes('TENT') || key.includes('CAMP') || key.includes('NEST') || key.includes('CAVE') || key.includes('DEN') || key.includes('SHRINE') || key.includes('PEDESTAL') || key.includes('ALTAR') || key === 'MERCHANT' || key === 'DRACONIC_MERCHANT' || key === 'SLUG_FOLK_MERCHANT' || key === 'BAG_MERCHANT_STALL' || key === 'BERRY_FARMER_SHED' || key === 'BEE_HIVE' || key === 'ANT_HILL' || key === 'VOID_BEACON' || key === 'SLIME_PUDDLE' || key === 'SPIDER_WEB' || key === 'DEMON_PORTAL' || key === 'LAVA_POOL' || key.startsWith('STALL_');
                        if (isSpawner) {
                            this.spawners.add(idx);
                        }
                    }
                }
                this.heightMap[x | (y << 4)] = highestZ;
            }
        }
    }
}
