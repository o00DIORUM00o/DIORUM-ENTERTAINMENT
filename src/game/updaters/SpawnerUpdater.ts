import { EntityRegistry } from '../registries/EntityRegistry';
import type { Engine } from '../Engine';
import { BlockType } from '../constants/BlockType';
;

export class SpawnerUpdater {
    static lastSpawnTimes: Record<string, number> = {};

    static updateAll(engine: Engine, dt: number) {
        // Find spawners in loaded chunks
        
        // Let's increment a shared timer for spawners
        engine.spawnerTimer = (engine.spawnerTimer || 0) + dt;
        if (engine.spawnerTimer < 3.0) return; // Tick every 3 seconds
        engine.spawnerTimer = 0;
        
        const now = Date.now() / 1000;

        for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
            if (!chunk.spawners || chunk.spawners.size === 0) continue;
            const wx = chunk.cx * 16;
            const wy = chunk.cy * 16;
            const activeSpawners = Array.from(chunk.spawners as Set<number>);

            for (const idx of activeSpawners) {
                const x = wx + ((idx as number) % 16);
                const y = wy + (Math.floor((idx as number) / 16) % 16);
                const z = Math.floor((idx as number) / 256);
                const block = chunk.blocks[idx as number];                
                
                if (block === BlockType.SLIME_PUDDLE) {
                        this.spawnEnemy(engine, x, y, z, 'SLIME');
                        
                        // Emit a few glowing slime particles to help players find them underground
                        for (let p = 0; p < 2; p++) {
                            engine.particles.push({
                                x: x + Math.random(),
                                y: y + Math.random(),
                                z: z + 1.0,
                                text: '',
                                color: '#32cd32', // Lime green
                                life: 1.0 + Math.random(),
                                maxLife: 2.0,
                                vx: (Math.random() - 0.5) * 0.5,
                                vy: (Math.random() - 0.5) * 0.5,
                                vz: Math.random() * 0.5,
                                size: 2.0 + Math.random() * 2.0,
                                speed: 0.5
                            });
                        }
                    } else if (block === BlockType.SPIDER_WEB) {
                        this.spawnEnemy(engine, x, y, z, 'CAVE_SPIDER');
                    } else if (block === BlockType.DEMON_PORTAL) {
                        this.spawnEnemy(engine, x, y, z, 'FIRE_IMP');
                    } else if (block === BlockType.KOBOLD_TENT || block === BlockType.KOBOLD_TENT_WARRIOR || block === BlockType.KOBOLD_TENT_SHAMAN || block === BlockType.KOBOLD_TENT_BOMBER || block === BlockType.KOBOLD_TENT_DRAGONKEEPER || block === BlockType.KOBOLD_TENT_TRAPPER || block === BlockType.DRAKE_NEST || block === BlockType.LAVA_POOL || block === BlockType.ROCK_GOLEM_SPAWNER || block === BlockType.DRAGON_LAIR) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 30) {
                            // Check minions alive for this spawner
                            let alive = 0;
                            if (block === BlockType.KOBOLD_TENT || block === BlockType.KOBOLD_TENT_WARRIOR || block === BlockType.KOBOLD_TENT_SHAMAN || block === BlockType.KOBOLD_TENT_BOMBER || block === BlockType.KOBOLD_TENT_DRAGONKEEPER || block === BlockType.KOBOLD_TENT_TRAPPER) alive = engine.kobolds.filter(k => k.spawnerId === sid).length;
                            else if (block === BlockType.DRAKE_NEST) alive = engine.drakes.filter(d => d.spawnerId === sid).length;
                            else if (block === BlockType.LAVA_POOL) alive = engine.lavaGolems.filter(l => l.spawnerId === sid).length;
                            else if (block === BlockType.ROCK_GOLEM_SPAWNER) alive = engine.entities.filter(e => e.spawnerId === sid).length;
                            else if (block === BlockType.DRAGON_LAIR) alive = engine.fireDragonBosses.filter(d => d.spawnerId === sid).length;
                            
                            if (alive < (block === BlockType.DRAGON_LAIR ? 1 : 3)) {
                                this.lastSpawnTimes[sid] = now;
                                if (block === BlockType.KOBOLD_TENT || block === BlockType.KOBOLD_TENT_WARRIOR || block === BlockType.KOBOLD_TENT_SHAMAN || block === BlockType.KOBOLD_TENT_BOMBER || block === BlockType.KOBOLD_TENT_DRAGONKEEPER || block === BlockType.KOBOLD_TENT_TRAPPER) {
                                    let subType: 'worker' | 'warrior' | 'shaman' | 'bomber' | 'dragonkeeper' | 'trapper' = 'worker';
                                    if (block === BlockType.KOBOLD_TENT_WARRIOR) subType = 'warrior';
                                    else if (block === BlockType.KOBOLD_TENT_SHAMAN) subType = 'shaman';
                                    else if (block === BlockType.KOBOLD_TENT_BOMBER) subType = 'bomber';
                                    else if (block === BlockType.KOBOLD_TENT_TRAPPER) subType = 'trapper';
                                    else if (block === BlockType.KOBOLD_TENT_DRAGONKEEPER) subType = 'dragonkeeper';
                                    
                                    engine.kobolds.push({
                                        spawnerId: sid,
                                        type: subType,
                                        x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                        vx: 0, vy: 0, vz: 0,
                                        health: EntityRegistry.get('kobold').maxHealth, maxHealth: EntityRegistry.get('kobold').maxHealth, damage: EntityRegistry.get('kobold').damage,
                                        state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0
                                    });
                                } else if (block === BlockType.DRAKE_NEST) {
                                    engine.drakes.push({
                                        spawnerId: sid,
                                        x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                        vx: 0, vy: 0, vz: 0,
                                        health: EntityRegistry.get('drake').maxHealth, maxHealth: EntityRegistry.get('drake').maxHealth, damage: EntityRegistry.get('drake').damage,
                                        state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0
                                    });
                                } else if (block === BlockType.LAVA_POOL) {
                                    engine.lavaGolems.push({
                                        spawnerId: sid,
                                        x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                        vx: 0, vy: 0, vz: 0,
                                        health: EntityRegistry.get('lava_golem').maxHealth, maxHealth: EntityRegistry.get('lava_golem').maxHealth, damage: EntityRegistry.get('lava_golem').damage,
                                        state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0
                                    });
                                } else if (block === BlockType.ROCK_GOLEM_SPAWNER) {
                                    engine.entities.push({
                                        spawnerId: sid,
                                        type: 'stone_golem',
                                        x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                        vx: 0, vy: 0, vz: 0,
                                        hp: EntityRegistry.get('stone_golem').maxHealth, maxHp: EntityRegistry.get('stone_golem').maxHealth, damage: EntityRegistry.get('stone_golem').damage,
                                        timer: 0, target: null
                                    });
                                } else if (block === BlockType.DRAGON_LAIR) {
                                    // A massive dragon boss!
                                    engine.fireDragonBosses.push({
                                        id: `fire_dragon_${Math.random()}`,
                                        spawnerId: sid,
                                        x: x + 0.5, y: y + 0.5, z: z + 5.0, // spawn slightly high
                                        vx: 0, vy: 0, vz: 0,
                                        health: 2500, maxHealth: 2500, damage: 80,
                                        state: 'SLEEPING', attackCooldown: 0, attackTimer: 0, aimAngle: 0,
                                        flightHeight: 5.0, phase: 1
                                    });
                                }
                            }
                        }
                    } else if (block === BlockType.ARETH_SPAWNER) {
                        // Fallback for old saves
                        const roll = Math.random();
                        if (roll < 0.2 && engine.drakes.length < 15) {
                            engine.drakes.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('drake').maxHealth, maxHealth: EntityRegistry.get('drake').maxHealth, damage: EntityRegistry.get('drake').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (roll < 0.4 && engine.lavaGolems.length < 10) {
                            engine.lavaGolems.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('lava_golem').maxHealth, maxHealth: EntityRegistry.get('lava_golem').maxHealth, damage: EntityRegistry.get('lava_golem').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (engine.kobolds.length < 30) {
                            engine.kobolds.push({ type: 'worker', x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('kobold').maxHealth, maxHealth: EntityRegistry.get('kobold').maxHealth, damage: EntityRegistry.get('kobold').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        }
                    } else if (block === BlockType.FAIRY_SPAWNER) {
                        if (Math.random() < 0.2 && engine.animals.length < 50) {
                            engine.animals.push({
                                id: `fairy_${Math.random()}`,
                                type: 'FAIRY',
                                behavior: 'PASSIVE',
                                x: x + 0.5, y: y + 0.5, z: z + 2,
                                vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, vz: 0,
                                health: 15, maxHealth: 15,
                                state: 'WANDER', fleeTimer: 0, attackCooldown: 0, aimAngle: 0,
                                tameProgress: 0, isTamed: false, speed: 2, jumpPower: 0, stamina: 10, maxStamina: 10
                            });
                        }
                    } else if (block === BlockType.DARK_ELF_SPAWNER) {
                        if (Math.random() < 0.1 && engine.npcs.length < 50) {
                            engine.npcs.push({
                                id: `dark_elf_${Math.random()}`,
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 120, maxHealth: 120,
                                type: 'DARK_ELF',
                                state: 'WANDER',
                                disposition: -100, // Hostile
                                aimAngle: 0,
                                attackTimer: 0,
                                attackCooldown: 0,
                                homeX: x, homeY: y, homeZ: z
                            });
                        }
                    } else if (block === BlockType.GRYPHON_NEST) {
                        if (Math.random() < 0.1 && engine.animals.length < 50) {
                            engine.animals.push({
                                id: `gryphon_${Math.random()}`,
                                type: 'GRYPHON',
                                behavior: 'AGGRESSIVE',
                                x: x + 0.5, y: y + 0.5, z: z + 2,
                                vx: 0, vy: 0, vz: 0,
                                health: 150, maxHealth: 150,
                                state: 'WANDER', fleeTimer: 0, attackCooldown: 0, aimAngle: 0,
                                tameProgress: 0, isTamed: false, speed: 6, jumpPower: 12, stamina: 100, maxStamina: 100
                            });
                        }
                    } else if (block === BlockType.DWARF_SPAWNER) {
                        if (Math.random() < 0.1 && engine.npcs.length < 50) {
                            engine.npcs.push({
                                id: `dwarf_${Math.random()}`,
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 250, maxHealth: 250,
                                type: 'DWARF',
                                state: 'WANDER',
                                disposition: 0, // Neutral
                                aimAngle: 0, attackTimer: 0, attackCooldown: 0,
                                homeX: x, homeY: y, homeZ: z
                            });
                        }
                    } else if (block === BlockType.GNOME_SPAWNER) {
                        if (Math.random() < 0.1 && engine.npcs.length < 50) {
                            engine.npcs.push({
                                id: `gnome_${Math.random()}`,
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 150, maxHealth: 150,
                                type: 'GNOME',
                                state: 'WANDER',
                                disposition: -50, // Slightly hostile / trickster
                                aimAngle: 0, attackTimer: 0, attackCooldown: 0,
                                homeX: x, homeY: y, homeZ: z
                            });
                        }
                    } else if (block === BlockType.DRACONIC_MERCHANT) {
                        if (Math.random() < 0.1 && engine.npcs.length < 50) {
                            engine.npcs.push({
                                id: `draconic_merchant_${Math.random()}`,
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 500, maxHealth: 500,
                                type: 'DRACONIC_MERCHANT',
                                state: 'WANDER',
                                disposition: 0,
                                aimAngle: 0, attackTimer: 0, attackCooldown: 0,
                                homeX: x, homeY: y, homeZ: z
                            });
                        }
                    } else if (
                        block === BlockType.MERCHANT ||
                        block === BlockType.STALL_BOOKS ||
                        block === BlockType.STALL_STAVES ||
                        block === BlockType.STALL_SWORDS ||
                        block === BlockType.STALL_POTIONS ||
                        block === BlockType.STALL_INGOTS ||
                        block === BlockType.STALL_SEEDS ||
                        block === BlockType.STALL_FABRIC ||
                        block === BlockType.STALL_RUNE_KEYS ||
                        block === BlockType.STALL_BLOCKS ||
                        block === BlockType.STALL_LEATHER
                    ) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 30) {
                            let alive = engine.npcs.filter(n => n.homeX === x && n.homeY === y && n.homeZ === z).length;
                            if (alive === 0) { // Only 1 merchant per stall
                                this.lastSpawnTimes[sid] = now;
                                
                                let merchantType = 'VILLAGER_MERCHANT';
                                if (block === BlockType.MERCHANT) merchantType = 'VILLAGER_MERCHANT';
                                else if (block === BlockType.STALL_BOOKS) merchantType = 'STALL_BOOKS';
                                else if (block === BlockType.STALL_STAVES) merchantType = 'STALL_STAVES';
                                else if (block === BlockType.STALL_SWORDS) merchantType = 'STALL_SWORDS';
                                else if (block === BlockType.STALL_POTIONS) merchantType = 'STALL_POTIONS';
                                else if (block === BlockType.STALL_INGOTS) merchantType = 'STALL_INGOTS';
                                else if (block === BlockType.STALL_SEEDS) merchantType = 'STALL_SEEDS';
                                else if (block === BlockType.STALL_FABRIC) merchantType = 'STALL_FABRIC';
                                else if (block === BlockType.STALL_RUNE_KEYS) merchantType = 'STALL_RUNE_KEYS';
                                else if (block === BlockType.STALL_BLOCKS) merchantType = 'STALL_BLOCKS';
                                else if (block === BlockType.STALL_LEATHER) merchantType = 'STALL_LEATHER';
                                
                                engine.npcs.push({
                                    id: `merchant_${Math.random()}`,
                                    x: x + 0.5, y: y + 0.5, z: z + 1,
                                    vx: 0, vy: 0, vz: 0,
                                    health: 150, maxHealth: 150,
                                    type: merchantType as any,
                                    state: 'WANDER',
                                    disposition: 0,
                                    aimAngle: 0, attackTimer: 0, attackCooldown: 0,
                                    homeX: x, homeY: y, homeZ: z
                                });
                            }
                        }
                    } else if (block === BlockType.BEE_HIVE) {
                        if (Math.random() < 0.2 && engine.bees.length < 20) {
                            engine.bees.push({
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 10, maxHealth: 10,
                                damage: 10, // Assuming 10 damage
                                hiveKey: `${x},${y},${z}`,
                                attackCooldown: 0,
                                state: 'WANDER'
                            });
                        }
                    } else if (block === BlockType.ANT_HILL) {
                        if (Math.random() < 0.2 && engine.ants.length < 30) {
                            engine.ants.push({
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                hp: 15, maxHp: 15,
                                damage: 5,
                                speed: 3.0,
                                attackRange: 1.5,
                                attackCooldown: 1.0,
                                attackTimer: 0,
                                aimAngle: 0
                            });
                        }
                    } else if (block === BlockType.DARK_WIZARD_PEDESTAL) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 30) {
                            if (!engine.shadowWizards) engine.shadowWizards = [];
                            let alive = engine.shadowWizards.filter((w: any) => w.spawnerId === sid).length;
                            if (alive < 1) { // 1 per pedestal
                                this.lastSpawnTimes[sid] = now;
                                engine.shadowWizards.push({
                                    spawnerId: sid,
                                    x: x + 0.5, y: y + 0.5, z: z + 2,
                                    vx: 0, vy: 0, vz: 0,
                                });
                            }
                        }
                    } else if (block === BlockType.GARGOYLE_PEDESTAL) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 30) {
                            let alive = engine.gargoyles.filter(g => g.spawnerId === sid).length;
                            if (alive < 1) { // 1 per pedestal
                                this.lastSpawnTimes[sid] = now;
                                engine.gargoyles.push({
                                    spawnerId: sid,
                                    x: x + 0.5, y: y + 0.5, z: z + 1,
                                    vx: 0, vy: 0, vz: 0,
                                    health: 300, maxHealth: 300,
                                    damage: 40,
                                    state: 'SLEEPING',
                                    attackCooldown: 1.0, attackTimer: 0, aimAngle: 0
                                });
                            }
                        }
                    } else if (block === BlockType.DJINN_LAMP_SHRINE) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 20) {
                            let alive = engine.djinns.filter(d => d.spawnerId === sid).length;
                            if (alive < 2) {
                                this.lastSpawnTimes[sid] = now;
                                engine.djinns.push({
                                    spawnerId: sid,
                                    x: x + 0.5, y: y + 0.5, z: z + 2,
                                    vx: 0, vy: 0, vz: 0,
                                    health: 150, maxHealth: 150,
                                    damage: 35,
                                    state: 'WANDER',
                                    attackCooldown: 2.0, attackTimer: 0, aimAngle: 0
                                });
                            }
                        }
                    } else if (block === BlockType.GREMLIN_CAMP) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 10) {
                            let alive = engine.gremlins.filter(g => g.spawnerId === sid).length;
                            if (alive < 5) { // Gremlins spawn in packs
                                this.lastSpawnTimes[sid] = now;
                                engine.gremlins.push({
                                    spawnerId: sid,
                                    x: x + Math.random(), y: y + Math.random(), z: z + 1,
                                    vx: 0, vy: 0, vz: 0,
                                    health: 50, maxHealth: 50,
                                    damage: 15,
                                    state: 'WANDER',
                                    attackCooldown: 0.5, attackTimer: 0, aimAngle: 0
                                });
                            }
                        }
                    } else if (block === BlockType.SPHINX_SPAWNER) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 300) { // Infrequent spawn, it's a huge boss
                            let alive = engine.sphinxs.filter(s => s.spawnerId === sid).length;
                            if (alive < 1) { 
                                this.lastSpawnTimes[sid] = now;
                                engine.sphinxs.push({
                                    spawnerId: sid,
                                    x: x + 0.5, y: y + 0.5, z: z + 2,
                                    vx: 0, vy: 0, vz: 0,
                                    health: 3000, maxHealth: 3000,
                                    damage: 60,
                                    state: 'SLEEP',
                                    stateTimer: 0,
                                    attackCooldown: 0,
                                    aimAngle: 0,
                                    phase: 1
                                });
                            }
                        }
                    } else if (block === BlockType.OBSERVER_SPAWNER) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 20) {
                            let alive = engine.entities.filter(e => (e.type === 'OBSERVER_VOID' || e.type === 'OBSERVER_FIRE' || e.type === 'SAND_WORM') && e.spawnerId === sid).length;
                            if (alive < 3 && engine.entities.length < 50) {
                                this.lastSpawnTimes[sid] = now;
                                
                                const typeRoll = Math.random();
                                let type = 'OBSERVER_VOID';
                                if (typeRoll < 0.3) {
                                    type = 'OBSERVER_FIRE';
                                } else if (typeRoll < 0.6) {
                                    type = 'SAND_WORM';
                                }
                                
                                engine.entities.push({
                                    id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                                    spawnerId: sid,
                                    type: type,
                                    x: x + (Math.random() - 0.5) * 4,
                                    y: y + (Math.random() - 0.5) * 4,
                                    z: z + (type === 'SAND_WORM' ? 0 : 5 + Math.random() * 5),
                                    vx: 0, vy: 0, vz: 0,
                                    hp: 150, maxHp: 150,
                                    speed: type === 'SAND_WORM' ? 0.5 : 1.5,
                                    timer: 0,
                                    state: type === 'SAND_WORM' ? 'HIDDEN' : 'CHASE',
                                    attackCooldown: 0,
                                    friendly: false
                                });
                            }
                        }
                    } else if (block === BlockType.HORDE_SPAWNER) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 15) {
                            let alive = engine.rats.filter(r => r.spawnerId === sid).length;
                            if (alive < 5 && engine.rats.length < 30) {
                                this.lastSpawnTimes[sid] = now;
                                engine.rats.push({
                                    id: sid + '_' + now,
                                    spawnerId: sid,
                                    x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                    vx: 0, vy: 0, vz: 0,
                                    health: EntityRegistry.get('rat').maxHealth, maxHealth: EntityRegistry.get('rat').maxHealth, damage: EntityRegistry.get('rat').damage,
                                    state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0
                                });
                            }
                        }
                    } else if (
                        block === BlockType.TRICERA_TENT || block === BlockType.RAPTOR_TENT || block === BlockType.FROG_TENT || 
                        block === BlockType.FUNGI_FOLK_TENT || block === BlockType.OGRE_DEN || block === BlockType.TROLL_CAVE ||
                        block === BlockType.ARCHER_TENT || block === BlockType.DARK_KNIGHT_TENT || block === BlockType.DARK_ELF_TENT ||
                        block === BlockType.OBSERVER_SPAWNER || block === BlockType.TENT ||
                        block === BlockType.HUMAN_CASTLE_SPAWNER || block === BlockType.HUMAN_OUTPOST_SPAWNER
                    ) {
                        const sid = `${x}_${y}_${z}`;
                        const lastSpawn = this.lastSpawnTimes[sid] || 0;
                        if (now - lastSpawn >= 25) {
                            let alive = engine.entities.filter(e => e.spawnerId === sid).length;
                            if (alive < 3 && engine.entities.length < 100) {
                                this.lastSpawnTimes[sid] = now;
                                
                                let type = 'TRICERA_FOLK';
                                if (block === BlockType.RAPTOR_TENT) type = 'RAPTOR_FOLK';
                                else if (block === BlockType.FROG_TENT) type = 'FROG_FOLK';
                                else if (block === BlockType.FUNGI_FOLK_TENT) type = 'FUNGI_FOLK';
                                else if (block === BlockType.OGRE_DEN) type = 'OGRE';
                                else if (block === BlockType.TROLL_CAVE) type = 'TROLL';
                                else if (block === BlockType.ARCHER_TENT) type = 'ARCHER';
                                else if (block === BlockType.DARK_KNIGHT_TENT) type = 'DARK_KNIGHT';
                                else if (block === BlockType.DARK_ELF_TENT) type = 'DARK_ELF_ASSASSIN';
                                else if (block === BlockType.OBSERVER_SPAWNER) type = Math.random() > 0.5 ? 'OBSERVER_VOID' : 'OBSERVER_FIRE';
                                else if (block === BlockType.HUMAN_CASTLE_SPAWNER) type = Math.random() > 0.5 ? 'HUMAN_KNIGHT' : 'HUMAN_PALADIN';
                                else if (block === BlockType.HUMAN_OUTPOST_SPAWNER || block === BlockType.TENT) type = 'HUMAN_RANGER';
                                
                                const def = EntityRegistry.get(type.toLowerCase());
                                
                                engine.entities.push({
                                    id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                                    spawnerId: sid,
                                    type: type,
                                    x: x + (Math.random() - 0.5) * 4,
                                    y: y + (Math.random() - 0.5) * 4,
                                    z: z + 2.0,
                                    vx: 0, vy: 0, vz: 0,
                                    hp: def.maxHealth, maxHp: def.maxHealth, damage: def.damage,
                                    speed: def.speed || 3.0,
                                    timer: 0,
                                    state: 'WANDER',
                                    attackCooldown: def.attackCooldown || 1.5,
                                    friendly: false
                                });
                            }
                        }
                    }
                } // close activeSpawners loop
            } // close chunk entries loop
        } // close updateAll method

    static spawnEnemy(engine: Engine, sx: number, sy: number, sz: number, type: string) {
        // Enforce population limits per type to avoid crashing
        let currentCount = 0;
        const maxPop = 10;
        
        for (const ent of engine.entities) {
            if (ent.type === type) currentCount++;
        }
        
        if (currentCount >= maxPop) return;
        
        // Random chance to actually spawn this tick
        if (Math.random() > 0.3) return;

        // Try to find open spot
        const tx = sx + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
        const ty = sy + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random());
        // For air spawn
        if (engine.world.getBlock(Math.floor(tx), Math.floor(ty), sz) !== BlockType.AIR) return;
        
        let hp = 40;
        let speed = 2.0;

        if (type === 'SLIME') { hp = 30; speed = 3.5; } // Fast bouncing
        if (type === 'CAVE_SPIDER') { hp = 20; speed = 5.0; } // Very fast frail
        if (type === 'FIRE_IMP') { hp = 60; speed = 2.0; } // Slow ranged tank

        engine.entities.push({
            id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            x: tx, y: ty, z: sz,
            vx: 0, vy: 0, vz: 0,
            hp: hp, maxHp: hp,
            speed: speed,
            timer: 0,
            state: 'CHASE',
            attackCooldown: 0,
            friendly: false
        });
        
        let color = '#ffffff';
        if (type === 'SLIME') color = '#32cd32';
        if (type === 'CAVE_SPIDER') color = '#d3d3d3';
        if (type === 'FIRE_IMP') color = '#8b0000';
        
        for (let i=0; i<10; i++) {
            engine.particles.push({
                x: tx, y: ty, z: sz + 0.5,
                text: '', color: color, life: 1, maxLife: 1,
                vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: Math.random() * 2,
                speed: 0
            });
        }
    }
}
