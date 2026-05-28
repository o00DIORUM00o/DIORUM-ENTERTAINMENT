import { Engine } from '../Engine';
import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE } from '../Constants';
import { EntityRegistry } from '../registries/EntityRegistry';

export class StructureSpawnerSystem {
    static update(engine: Engine, dt: number) {
        engine.campScanTimer -= dt;
        engine.bonePileScanTimer -= dt;
        
        let shouldScanCamps = engine.campScanTimer <= 0;
        let shouldScanBones = engine.bonePileScanTimer <= 0;
        
        if (!shouldScanCamps && !shouldScanBones) return;
        
        if (shouldScanCamps) engine.campScanTimer = 1.0;
        if (shouldScanBones) engine.bonePileScanTimer = 1.0;

        const px = Math.floor(engine.player.x);
        const py = Math.floor(engine.player.y);
        const pz = Math.floor(engine.player.z);
        const scanRadius = 35; // Scan further for camps/bones

        // Proceed to scan chunks for spawners
        for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
            if (!chunk.spawners || chunk.spawners.size === 0) continue;
            const wx = chunk.cx * 16;
            const wy = chunk.cy * 16;
            const activeSpawners = Array.from(chunk.spawners as Set<number>);
            
            for (const idx of activeSpawners) {
                const blockType = chunk.blocks[idx as number];
                const x = wx + ((idx as number) % 16);
                const y = wy + (Math.floor((idx as number) / 16) % 16);
                const z = Math.floor((idx as number) / 256);
                
                // Check distance
                if (Math.abs(px - x) > scanRadius || Math.abs(py - y) > scanRadius) continue;

                if (shouldScanCamps) {
                    this.processCampSpawns(engine, x, y, z, blockType);
                }

                if (shouldScanBones) {
                    this.processBoneSpawns(engine, px, x, y, z, blockType);
                }
            }
        }
    }

    private static processCampSpawns(engine: any, x: number, y: number, z: number, blockType: number) {
        const isGoblinCamp = blockType === BlockType.GOBLIN_CAMP || blockType === BlockType.GOBLIN_SHAMAN_TENT || blockType === BlockType.GOBLIN_TENT_ROCKHURLER || blockType === BlockType.GOBLIN_TENT_GARDENER || blockType === BlockType.GOBLIN_TENT_BOOMERANGER || blockType === BlockType.GOBLIN_TENT_ALCHEMIST || blockType === BlockType.GOBLIN_TENT_MINER;
        const isArcherCamp = blockType === BlockType.ARCHER_TENT;
        const isDarkKnightCamp = blockType === BlockType.DARK_KNIGHT_TENT;
        const isOrcCamp = blockType === BlockType.ORC_TENT || blockType === BlockType.ORC_TENT_BRUTE || blockType === BlockType.ORC_TENT_SHAMAN || blockType === BlockType.ORC_TENT_HUNTER;
        const isKoboldCamp = blockType === BlockType.KOBOLD_TENT || blockType === BlockType.KOBOLD_TENT_TRAPPER || blockType === BlockType.KOBOLD_TENT_WARRIOR || blockType === BlockType.KOBOLD_TENT_SHAMAN || blockType === BlockType.KOBOLD_TENT_BOMBER || blockType === BlockType.KOBOLD_TENT_DRAGONKEEPER;
        const isDarkElfCamp = blockType === BlockType.DARK_ELF_TENT;
        const isGiantCamp = blockType === BlockType.GIANT_CAMP;
        const isTitanNest = blockType === BlockType.TITAN_NEST;
        const isHeratCamp = [BlockType.HALFLING_HOUSE_SPAWNER, BlockType.PIT_BULL_TENT, BlockType.POMERANIAN_WAGON, BlockType.TERRIER_TENT, BlockType.WOLF_FOLK_CAMP, BlockType.HUMAN_CASTLE_SPAWNER, BlockType.HUMAN_OUTPOST_SPAWNER].includes(blockType);
        const isThaerCamp = [BlockType.SQUIRREL_FOLK_TREEHOUSE, BlockType.BEAST_CAMP, BlockType.BEAST_TAMER_CAMP].includes(blockType);
        const isFrostCasterCamp = blockType === BlockType.FROST_CASTER_TENT || blockType === BlockType.LOYAL_FROST_CASTER_TENT;
        const isCrossroadsSpawners = blockType === BlockType.BAG_MERCHANT_STALL || blockType === BlockType.BERRY_FARMER_SHED;

        if (!(isGoblinCamp || isArcherCamp || isDarkKnightCamp || isOrcCamp || isKoboldCamp || isDarkElfCamp || isGiantCamp || isTitanNest || isHeratCamp || isThaerCamp || isFrostCasterCamp || isCrossroadsSpawners)) return;

        const campKey = `${x},${y},${z}`;
        let timer = engine.campSpawnTimers.get(campKey);
        
        if (timer === undefined) timer = 30; // Ready immediately
        else timer += 1.0;
        
        const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
        const multiplier = 1 + Math.floor(distChunks / 5);

        if (isGoblinCamp) {
            let goblinsFromCamp = engine.goblins.filter((g: any) => g.campKey === campKey).length;
            if (timer >= 30 && goblinsFromCamp < 3 && engine.goblins.length < 20) {
                const isShaman = blockType === BlockType.GOBLIN_SHAMAN_TENT;
                let goblinType = 'basic';
                if (blockType === BlockType.GOBLIN_TENT_ROCKHURLER) goblinType = 'rockhurler';
                if (blockType === BlockType.GOBLIN_TENT_GARDENER) goblinType = 'gardener';
                if (blockType === BlockType.GOBLIN_TENT_BOOMERANGER) goblinType = 'boomeranger';
                if (blockType === BlockType.GOBLIN_TENT_ALCHEMIST) goblinType = 'alchemist';
                if (blockType === BlockType.GOBLIN_TENT_MINER) goblinType = 'miner';

                engine.goblins.push({
                    type: goblinType, x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: (isShaman ? 20 : 30) * multiplier, maxHealth: (isShaman ? 20 : 30) * multiplier,
                    damage: (isShaman ? 15 : 10) * multiplier,
                    state: goblinType === 'gardener' ? 'WANDER' : 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, campKey, isShaman
                });
                timer = 0;
            }
        } else if (isOrcCamp) {
            let orcsFromCamp = engine.orcs.filter((o: any) => o.campKey === campKey).length;
            if (timer >= 30 && orcsFromCamp < 3 && engine.orcs.length < 15) {
                let orcType = 'basic';
                if (blockType === BlockType.ORC_TENT_BRUTE) orcType = 'brute';
                else if (blockType === BlockType.ORC_TENT_SHAMAN) orcType = 'shaman';
                else if (blockType === BlockType.ORC_TENT_HUNTER) orcType = 'hunter';
                const isShaman = orcType === 'shaman';
                const isBrute = orcType === 'brute';

                engine.orcs.push({
                    type: orcType, x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: (isBrute ? 140 : isShaman ? 60 : 80) * multiplier, maxHealth: (isBrute ? 140 : isShaman ? 60 : 80) * multiplier,
                    damage: (isBrute ? 35 : isShaman ? 15 : 20) * multiplier, state: 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, campKey
                });
                timer = 0;
            }
        } else if (isArcherCamp) {
            let archersFromCamp = engine.archers.filter((a: any) => a.spawnerKey === campKey).length;
            if (timer >= 30 && archersFromCamp < 3 && engine.archers.length < 15) {
                engine.archers.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 40 * multiplier, maxHealth: 40 * multiplier, damage: 15 * multiplier,
                    state: 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, spawnerKey: campKey
                });
                timer = 0;
            }
        } else if (isDarkKnightCamp) {
            let knightsFromCamp = engine.darkKnights.filter((k: any) => k.spawnerKey === campKey).length;
            if (timer >= 35 && knightsFromCamp < 3 && engine.darkKnights.length < 10) {
                engine.darkKnights.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 120 * multiplier, maxHealth: 120 * multiplier, damage: 30 * multiplier,
                    state: 'WANDER', stateTimer: 0, aimAngle: 0, spawnerKey: campKey
                });
                timer = 0;
            }
        } else if (isKoboldCamp) {
            if (!engine.kobolds) engine.kobolds = [];
            let koboldsFromCamp = engine.kobolds.filter((k: any) => k.campKey === campKey).length;
            if (timer >= 30 && koboldsFromCamp < 3 && engine.kobolds.length < 20) {
                let koboldType = 'worker';
                if (blockType === BlockType.KOBOLD_TENT_TRAPPER) koboldType = 'trapper';
                if (blockType === BlockType.KOBOLD_TENT_WARRIOR) koboldType = 'warrior';
                if (blockType === BlockType.KOBOLD_TENT_SHAMAN) koboldType = 'shaman';
                if (blockType === BlockType.KOBOLD_TENT_BOMBER) koboldType = 'bomber';
                if (blockType === BlockType.KOBOLD_TENT_DRAGONKEEPER) koboldType = 'dragonkeeper';

                engine.kobolds.push({
                    type: koboldType, x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 20 * multiplier, maxHealth: 20 * multiplier, damage: 5 * multiplier,
                    state: 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, campKey
                });
                timer = 0;
            }
        } else if (isDarkElfCamp) {
            let elvesFromCamp = (engine.entities || []).filter((e: any) => e.type === 'DARK_ELF_ASSASSIN' && e.campKey === campKey).length;
            if (timer >= 30 && elvesFromCamp < 3 && (engine.entities?.length || 0) < 30) {
                engine.entities.push({
                    type: 'DARK_ELF_ASSASSIN', x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 120 * multiplier, maxHealth: 120 * multiplier, damage: 25 * multiplier, hp: 120 * multiplier,
                    state: 'CHASE', target: engine.player, speed: 6.0, campKey
                });
                timer = 0;
            }
        } else if (isGiantCamp) {
            let giantsFromCamp = (engine.entities || []).filter((e: any) => e.type === 'GIANT' && e.campKey === campKey).length;
            if (timer >= 60 && giantsFromCamp < 3 && (engine.entities?.length || 0) < 30) {
                engine.entities.push({
                    type: 'GIANT', x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 800 * multiplier, maxHealth: 800 * multiplier, damage: 60 * multiplier, hp: 800 * multiplier,
                    state: 'CHASE', target: engine.player, speed: 2.0, campKey
                });
                timer = 0;
            }
        } else if (isTitanNest) {
            let titansFromCamp = (engine.entities || []).filter((e: any) => e.type === 'COLOSSAL_LIZARD_TITAN' && e.campKey === campKey).length;
            if (timer >= 120 && titansFromCamp < 3 && (engine.entities?.length || 0) < 30) {
                engine.entities.push({
                    type: 'COLOSSAL_LIZARD_TITAN', x: x + 2.5, y: y + 2.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 2000 * multiplier, maxHealth: 2000 * multiplier, damage: 120 * multiplier, hp: 2000 * multiplier,
                    state: 'CHASE', target: engine.player, speed: 1.5, campKey
                });
                timer = 0;
            }
        } else if (isHeratCamp) {
            let residentsFromCamp = (engine.npcs || []).filter((n: any) => n.campKey === campKey).length;
            if (timer >= 60 && residentsFromCamp < 3 && (engine.npcs?.length || 0) < 50) {
                let type = 'HALFLING';
                if (blockType === BlockType.PIT_BULL_TENT) type = 'PIT_BULL_FOLK';
                else if (blockType === BlockType.POMERANIAN_WAGON) type = 'POMERANIAN_FOLK';
                else if (blockType === BlockType.TERRIER_TENT) type = 'TERRIER_FOLK';
                else if (blockType === BlockType.WOLF_FOLK_CAMP) type = 'WOLF_FOLK';
                else if (blockType === BlockType.HUMAN_CASTLE_SPAWNER) type = Math.random() < 0.2 ? 'HUMAN_PALADIN' : 'HUMAN_KNIGHT';
                else if (blockType === BlockType.HUMAN_OUTPOST_SPAWNER) type = Math.random() < 0.5 ? 'HUMAN_RANGER' : 'HUMAN_KNIGHT';

                let state = 'WANDER';
                if (type === 'POMERANIAN_FOLK') {
                    const hasLeader = engine.npcs.some((n: any) => n.type === 'POMERANIAN_FOLK' && n.state === 'CARAVAN_LEADER');
                    state = hasLeader ? 'CARAVAN_FOLLOWER' : 'CARAVAN_LEADER';
                }

                engine.npcs.push({
                    id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9), type,
                    x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: (type === 'HUMAN_PALADIN' ? 250 : type === 'HUMAN_KNIGHT' ? 200 : type === 'PIT_BULL_FOLK' ? 150 : type === 'WOLF_FOLK' ? 120 : 60) * multiplier, 
                    maxHealth: (type === 'HUMAN_PALADIN' ? 250 : type === 'HUMAN_KNIGHT' ? 200 : type === 'PIT_BULL_FOLK' ? 150 : type === 'WOLF_FOLK' ? 120 : 60) * multiplier, 
                    state, speed: 2.0, campKey, homeX: x, homeY: y, homeZ: z
                });
                timer = 0;
            }
        } else if (isThaerCamp) {
            let npcResidents = (engine.npcs || []).filter((n: any) => n.campKey === campKey).length;
            let beastResidents = (engine.animals || []).filter((a: any) => a.campKey === campKey).length;
            
            if (timer >= 60) {
                if (blockType === BlockType.SQUIRREL_FOLK_TREEHOUSE && npcResidents < 3 && (engine.npcs?.length || 0) < 50) {
                    engine.npcs.push({
                        id: 'squirrel_folk_' + Math.random().toString(36).substr(2, 9), type: 'SQUIRREL_FOLK',
                        x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: 400 * multiplier, maxHealth: 400 * multiplier, 
                        state: 'WANDER', speed: 5.0, campKey, homeX: x, homeY: y, homeZ: z, merchantType: 'SQUIRREL_FOLK_MERCHANT'
                    });
                    timer = 0;
                } else if (blockType === BlockType.BEAST_TAMER_CAMP && npcResidents < 3 && (engine.npcs?.length || 0) < 50) {
                    engine.npcs.push({
                        id: 'beast_tamer_' + Math.random().toString(36).substr(2, 9), type: 'BEAST_TAMER',
                        x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: 800 * multiplier, maxHealth: 800 * multiplier, 
                        state: 'WANDER', speed: 3.0, campKey, homeX: x, homeY: y, homeZ: z, merchantType: 'BEAST_TAMER_MERCHANT'
                    });
                    timer = 0;
                } else if (blockType === BlockType.BEAST_CAMP && beastResidents < 3 && (engine.animals?.length || 0) < 60) {
                    const rand = Math.random();
                    let type = 'DIRE_WOLF';
                    if (rand < 0.3) type = 'GIANT_BOAR';
                    else if (rand < 0.6) type = 'MOOSE';
                    engine.animals.push({
                        id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9), type: type as any,
                        x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                        health: (type === 'MOOSE' ? 150 : type === 'GIANT_BOAR' ? 120 : 80) * multiplier, maxHealth: (type === 'MOOSE' ? 150 : type === 'GIANT_BOAR' ? 120 : 80) * multiplier, 
                        state: 'WANDER', speed: (type === 'DIRE_WOLF' ? 5.5 : 4.0), campKey, homeX: x, homeY: y, homeZ: z, aimAngle: 0, fleeTimer: 0, attackCooldown: 0, behavior: 'AGGRESSIVE', damage: (type === 'DIRE_WOLF' ? 25 : type === 'MOOSE' ? 20 : 15)
                    });
                    timer = 0;
                }
            }
        } else if (isFrostCasterCamp) {
            let frostCastersFromCamp = engine.frostCasters.filter((f: any) => f.campKey === campKey).length;
            if (timer >= 30 && frostCastersFromCamp < 3 && engine.frostCasters.length < 20) {
                const isLoyal = blockType === BlockType.LOYAL_FROST_CASTER_TENT;
                engine.frostCasters.push({
                    type: 'FROST_CASTER',
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 120 * multiplier, maxHealth: 120 * multiplier,
                    state: 'IDLE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, 
                    campKey, isLoyal, magicShield: 50 * multiplier, castTimer: 0
                });
                timer = 0;
            }
        }
        engine.campSpawnTimers.set(campKey, timer);
    }

    private static processBoneSpawns(engine: any, px: number, x: number, y: number, z: number, block: number) {
        if (block === 83 || block === BlockType.VOID_BEACON) { 
            if (block === 83 && px < 60000 * 16) return;

            const spawnerKey = `${x},${y},${z}`;
            let timer = engine.abyssalSpawnerTimers.get(spawnerKey);
            
            if (timer === undefined) timer = block === BlockType.VOID_BEACON ? 1 : 10;
            else timer += 1.0;
            
            let knightsFromSpawner = engine.abyssalKnights.filter((k: any) => k.spawnerKey === spawnerKey).length;
            let maxTimer = block === BlockType.VOID_BEACON ? 3 : 10;
            let maxKnights = 3;
            let maxTotal = block === BlockType.VOID_BEACON ? 40 : 15;

            if (timer >= maxTimer && knightsFromSpawner < maxKnights && engine.abyssalKnights.length < maxTotal) {
                engine.abyssalKnights.push({
                    x: x + 0.5 + (Math.random() - 0.5) * 2, y: y + 0.5 + (Math.random() - 0.5) * 2, z: z + 1.0,
                    vx: 0, vy: 0, vz: 0, health: 150, maxHealth: 150, damage: 25,
                    state: 'CHASE', attackCooldown: 0, aimAngle: 0, chargeTimer: 0, target: engine.player, spawnerKey
                } as any);
                
                if (block === BlockType.VOID_BEACON) {
                    for(let i=0; i<10; i++){
                        engine.particles.push({
                            x: x + 0.5, y: y + 0.5, z: z + 1.0, text: '', color: '#ff00aa', life: 1, maxLife: 1,
                            vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, vz: Math.random()*5
                        });
                    }
                }
                timer = 0;
            }
            engine.abyssalSpawnerTimers.set(spawnerKey, timer);
        
        } else if (block === BlockType.LAVA_GOLEM_SPAWNER) {
            const spawnerKey = `${x},${y},${z}`;
            let timer = engine.campSpawnTimers.get(spawnerKey) || 15;
            timer += 1.0;
            let count = engine.lavaGolems.filter((e: any) => e.spawnerKey === spawnerKey).length;
            if (timer >= 20 && count < 2 && engine.lavaGolems.length < 15) {
                engine.lavaGolems.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 400, maxHealth: 400,
                    state: 'IDLE', attackCooldown: 0, aimAngle: 0, spawnerKey
                } as any);
                timer = 0;
            }
            engine.campSpawnTimers.set(spawnerKey, timer);
        } else if (block === BlockType.GARGOYLE_SPAWNER) {
            const spawnerKey = `${x},${y},${z}`;
            let timer = engine.campSpawnTimers.get(spawnerKey) || 15;
            timer += 1.0;
            let count = (engine.gargoyles || []).filter((e: any) => e.spawnerKey === spawnerKey).length;
            if (timer >= 15 && count < 3 && (engine.gargoyles?.length || 0) < 15) {
                if (!engine.gargoyles) engine.gargoyles = [];
                engine.gargoyles.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 200, maxHealth: 200, isStone: true,
                    state: 'IDLE', attackCooldown: 0, aimAngle: 0, spawnerKey
                } as any);
                timer = 0;
            }
            engine.campSpawnTimers.set(spawnerKey, timer);
        } else if (block === BlockType.PHANTOM_WIZARD_SPAWNER) {
            const spawnerKey = `${x},${y},${z}`;
            let timer = engine.campSpawnTimers.get(spawnerKey) || 30;
            timer += 1.0;
            let count = (engine.phantomWizards || []).filter((e: any) => e.spawnerKey === spawnerKey).length;
            if (timer >= 30 && count < 1 && (engine.phantomWizards?.length || 0) < 10) {
                if (!engine.phantomWizards) engine.phantomWizards = [];
                engine.phantomWizards.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: 300, maxHealth: 300,
                    state: 'IDLE', attackCooldown: 0, aimAngle: 0, spawnerKey, floatOffset: 0
                } as any);
                timer = 0;
            }
            engine.campSpawnTimers.set(spawnerKey, timer);
} else if (block === BlockType.BONE_PILE_SPAWNER) {
            const spawnerKey = `${x},${y},${z}`;
            let timer = engine.bonePileSpawnTimers.get(spawnerKey);
            if (timer === undefined) timer = 15;
            else timer += 1.0;
            
            let skeletonsFromSpawner = 0;
            engine.skeletons.forEach((s: any) => s.spawnerKey === spawnerKey && skeletonsFromSpawner++);
            engine.skeletonRemains.forEach((s: any) => s.spawnerKey === spawnerKey && skeletonsFromSpawner++);

            if (timer >= 15 && skeletonsFromSpawner < 3 && engine.skeletons.length + engine.skeletonRemains.length < 25) {
                const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                const multiplier = 1 + Math.floor(distChunks / 5);
                const type = Math.random() > 0.5 ? 'SWORDSMAN' : 'ARCHER';

                engine.skeletons.push({
                    x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                    health: EntityRegistry.get('skeleton').maxHealth * multiplier, maxHealth: EntityRegistry.get('skeleton').maxHealth * multiplier,
                    damage: EntityRegistry.get('skeleton').damage * multiplier, type, state: 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, spawnerKey
                });
                timer = 0;
            }
            engine.bonePileSpawnTimers.set(spawnerKey, timer);
        }
    }
}
