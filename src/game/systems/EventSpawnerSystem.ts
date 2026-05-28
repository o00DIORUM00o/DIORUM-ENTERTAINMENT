import { Engine } from '../Engine';
import { BlockType } from '../constants/BlockType';
import { EntityRegistry } from '../registries/EntityRegistry';
import { PlanetRegistry } from '../registries/PlanetRegistry';

export class EventSpawnerSystem {
    static update(engine: any, dt: number) {
        // Spawn Wizard
        if (engine.world.wizardTowerEntrance && !engine.npcs.find((n: any) => n.type === 'OLD_WIZARD')) {
            engine.npcs.push({
                id: 'old_wizard',
                x: engine.world.wizardTowerEntrance.x,
                y: engine.world.wizardTowerEntrance.y,
                z: engine.world.wizardTowerEntrance.z,
                vx: 0, vy: 0, vz: 0,
                health: EntityRegistry.get('villager').maxHealth, maxHealth: EntityRegistry.get('villager').maxHealth,
                type: 'OLD_WIZARD',
                state: 'IDLE',
                disposition: 0,
                aimAngle: 0,
                attackTimer: 0,
                attackCooldown: 0,
                merchantType: 'WIZARD',
                tradeInventory: [],
                lastRestockDay: 0
            });
            // Clear the entrance so we only spawn once
            engine.world.wizardTowerEntrance = null;
        }

        // Spawn Quest NPCs
        if (engine.world.questNpcEntrances && engine.world.questNpcEntrances.length > 0) {
            for (const spawner of engine.world.questNpcEntrances as any[]) {
                // Determine a unique ID so we don't spawn multiple for the same spawner location
                const npcId = 'quest_giver_' + spawner.x + '_' + spawner.y;
                if (!engine.npcs.find((n: any) => n.id === npcId)) {
                    engine.npcs.push({
                        id: npcId,
                        x: spawner.x + 0.5,
                        y: spawner.y + 0.5,
                        z: spawner.z + 1,
                        vx: 0, vy: 0, vz: 0,
                        health: 999999, maxHealth: 999999,
                        type: 'QUEST_GIVER',
                        state: 'IDLE',
                        disposition: 0,
                        aimAngle: 0,
                        attackTimer: 0,
                        attackCooldown: 0,
                        merchantType: null,
                        tradeInventory: [],
                        lastRestockDay: 0
                    });
                }
            }
            engine.world.questNpcEntrances = [];
        }

        // Animal Spawning Logic
        engine.deerSpawnTimer -= dt;
        if (engine.deerSpawnTimer <= 0) {
            engine.deerSpawnTimer = 3.0; // Scan every 3 seconds
            
            const numWolves = engine.animals.filter((a: any) => a.type === 'WOLF').length;
            const numPassive = engine.animals.filter((a: any) => a.behavior === 'PASSIVE').length;
            
            const currentPlanetInfo = PlanetRegistry.get(engine.world.activePlanet);
            const surfaceZLevel = currentPlanetInfo.waterLevel + 1;
            
            // Wolf Pack Event (Dusk, 19:00)
            if (engine.world.timeOfDay >= 19.0 && engine.lastWolfPackDay < engine.world.dayCount && engine.player.z >= surfaceZLevel) {
                engine.lastWolfPackDay = engine.world.dayCount;
                const wolvesToSpawn = Math.floor(Math.random() * 3) + 3; // 3 to 5 wolves
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                
                for (let i = 0; i < wolvesToSpawn; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 15 + Math.random() * 5;
                    const wx = px + Math.cos(angle) * dist;
                    const wy = py + Math.sin(angle) * dist;
                    
                    // Find ground
                    let wz = pz;
                    for (let z = pz + 5; z >= pz - 5; z--) {
                        if (engine.world.getBlock(Math.floor(wx), Math.floor(wy), z) !== BlockType.AIR) {
                            wz = z + 1;
                            break;
                        }
                    }
                    
                    engine.animals.push({
                        id: 'wolf_' + Math.random().toString(36).substr(2, 9),
                        type: 'WOLF',
                        behavior: 'AGGRESSIVE',
                        x: wx, y: wy, z: wz,
                        vx: 0, vy: 0, vz: 0,
                        health: 40, maxHealth: 40,
                        state: 'CHASE',
                        fleeTimer: 0,
                        attackCooldown: 0,
                        aimAngle: 0,
                        tameProgress: 0,
                        isTamed: false,
                        speed: 5.5,
                        jumpPower: 6,
                        stamina: 50,
                        maxStamina: 50
                    });
                }
            } else if (engine.player.z >= surfaceZLevel && numPassive < 20) { // Only on surface, max 20 passive animals
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                const scanRadius = 25;

                const surfaceBlockType = PlanetRegistry.get(engine.world.activePlanet).surfaceBlock;

                // Test 50 random spots instead of looping the whole volume
                for (let i = 0; i < 50; i++) {
                    const x = px + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const y = py + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const z = pz + Math.floor((Math.random() - 0.5) * 4); // pz - 2 to pz + 2
                    
                    if (engine.world.getBlock(x, y, z) === surfaceBlockType) {
                        if (Math.random() < 0.2) { // 20% chance if we hit grass
                            // Make sure there is air above the grass
                            if (engine.world.getBlock(x, y, z + 1) === BlockType.AIR) {
                                if (engine.world.isBloodMoon) { // Spawn undead instead of wildlife
                                    const undeadTypes = ['zombie', 'SKELETON'];
                                    const type = undeadTypes[Math.floor(Math.random() * undeadTypes.length)];
                                    const stat = EntityRegistry.get(type);
                                    engine.entities.push({
                                        spawnerId: null,
                                        type: type,
                                        x: x + 0.5, y: y + 0.5, z: z + 1.0,
                                        vx: 0, vy: 0, vz: 0,
                                        hp: stat.maxHealth, maxHp: stat.maxHealth, damage: stat.damage,
                                        timer: 0, target: null
                                    });
                                } else {
                                    let types: any[] = [];
                                    
                                    if (engine.world.activePlanet === 'ARETH') {
                                    types = [
                                        { type: 'DRAGON_HORSE', hp: 200, speed: 7.0, jump: 8, stamina: 150 },
                                        { type: 'DRAGON_TURTLE', hp: 300, speed: 1.2, jump: 1, stamina: 40 },
                                        { type: 'GIANT_TOAD', hp: 80, speed: 2.5, jump: 15, stamina: 50 },
                                        { type: 'OBSIDIAN_SHEEP', hp: 60, speed: 3.0, jump: 4, stamina: 50 }
                                    ];
                                } else {
                                    types = [
                                        { type: 'DEER', hp: EntityRegistry.get('deer').maxHealth, speed: 4.5, jump: 6, stamina: 60 },
                                        { type: 'SHEEP', hp: EntityRegistry.get('sheep').maxHealth, speed: 3.0, jump: 5, stamina: 40 },
                                        { type: 'HORSE', hp: EntityRegistry.get('horse').maxHealth, speed: 6.0, jump: 7, stamina: 100 },
                                        { type: 'TURTLE', hp: EntityRegistry.get('turtle').maxHealth, speed: 1.5, jump: 2, stamina: 30 },
                                        { type: 'GIANT_CHICKEN', hp: EntityRegistry.get('giant_chicken').maxHealth, speed: 4.0, jump: 10, stamina: 50 },
                                        { type: 'GIANT_FROG', hp: EntityRegistry.get('giant_frog').maxHealth, speed: 3.0, jump: 12, stamina: 40 },
                                        { type: 'CAPYBARA', hp: EntityRegistry.get('capybara').maxHealth, speed: 4.0, jump: 4, stamina: 70 }
                                    ];
                                    
                                    if (engine.world.activePlanet === 'THERA') {
                                         types = [
                                            { type: 'PTERODACTYL', hp: EntityRegistry.get('pterodactyl').maxHealth, speed: 8.0, jump: 10, stamina: 100 },
                                            { type: 'T_REX', hp: EntityRegistry.get('t_rex').maxHealth, speed: 5.0, jump: 5, stamina: 200 },
                                            { type: 'WILD_RAPTOR', hp: EntityRegistry.get('raptor').maxHealth, speed: 6.5, jump: 12, stamina: 100 }
                                        ];
                                    } else if (engine.world.activePlanet === 'NORTH_HEART') {
                                        types = [
                                            { type: 'FROST_WOLF', hp: EntityRegistry.get('frost_wolf').maxHealth, speed: 5.5, jump: 7, stamina: 100 },
                                            { type: 'BEAR', hp: EntityRegistry.get('bear').maxHealth, speed: 3.5, jump: 4, stamina: 80 },
                                            { type: 'DEER', hp: EntityRegistry.get('deer').maxHealth, speed: 4.5, jump: 6, stamina: 60 }
                                        ];
                                    }

                                    // Increase Unicorn spawn rate significantly on HEART
                                    let unicornChance = engine.world.activePlanet === 'HEART' ? 0.40 : 0.05;
                                    let bearChance = 0.06;
                                    
                                    const huntingLevel = engine.player.talents['hunting'] || 0;
                                    if (huntingLevel >= 3) {
                                        unicornChance *= 3;
                                        bearChance *= 3; // Rare animals are more frequent
                                    }

                                    if (Math.random() < unicornChance) {
                                        types.push({ type: 'UNICORN', hp: EntityRegistry.get('unicorn').maxHealth, speed: 7.0, jump: 9, stamina: 120 });
                                    }
                                    if (Math.random() < bearChance) {
                                        types.push({ type: 'BEAR', hp: EntityRegistry.get('bear').maxHealth, speed: 3.5, jump: 4, stamina: 80 });
                                    }
                                    if (Math.random() < 0.1) {
                                        types.push({ type: 'GIANT_EAGLE', hp: 200, speed: 9.0, jump: 15, stamina: 150 });
                                    }
                                }
                                
                                const selected = types[Math.floor(Math.random() * types.length)];
                                
                                engine.animals.push({
                                    id: selected.type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                                    type: selected.type,
                                    behavior: (selected.type === 'BEAR' || selected.type === 'T_REX' || selected.type === 'WILD_RAPTOR' || selected.type === 'FROST_WOLF') ? 'AGGRESSIVE' : 'PASSIVE',
                                    x: x + 0.5,
                                    y: y + 0.5,
                                    z: z + 1.0,
                                    vx: 0, vy: 0, vz: 0,
                                    health: selected.hp,
                                    maxHealth: selected.hp,
                                    state: 'WANDER',
                                    fleeTimer: 0,
                                    attackCooldown: 0,
                                    aimAngle: 0,
                                    tameProgress: 0,
                                    isTamed: false,
                                    speed: selected.speed,
                                    jumpPower: selected.jump,
                                    stamina: selected.stamina,
                                    maxStamina: selected.stamina
                                });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Lava Golem Spawning Logic
        engine.golemSpawnTimer -= dt;
        if (engine.golemSpawnTimer <= 0) {
            engine.golemSpawnTimer = 2.0; // Scan every 2 seconds
            if (engine.player.z < 8 && engine.lavaGolems.length < 5) { // Only in caverns, max 5 golems
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                const scanRadius = 15;

                for (let i = 0; i < 30; i++) {
                    const x = px + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const y = py + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const z = pz + Math.floor((Math.random() - 0.5) * 10);
                    
                    if (engine.world.getBlock(x, y, z) === BlockType.LAVA) {
                        if (Math.random() < 0.25 && engine.lavaGolems.length < 5) {
                            if (engine.world.getBlock(x, y, z + 1) === BlockType.AIR) {
                                engine.lavaGolems.push({
                                    x: x + 0.5,
                                    y: y + 0.5,
                                    z: z + 1.0,
                                    vx: 0,
                                    vy: 0,
                                    vz: 0,
                                    health: 200,
                                    maxHealth: 200,
                                    damage: 15,
                                    state: 'WANDER',
                                    attackCooldown: 0,
                                    attackTimer: 0,
                                    aimAngle: 0
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}
