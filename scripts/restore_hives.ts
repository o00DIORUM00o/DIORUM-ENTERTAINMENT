import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve('src/game/updaters/SpawnerUpdater.ts');
let content = fs.readFileSync(file, 'utf8');

const replacement = `                    } else if (block === BlockType.ARETH_SPAWNER) {
                        // Fallback for old saves
                        const roll = Math.random();
                        if (roll < 0.2 && engine.drakes.length < 15) {
                            engine.drakes.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('drake').maxHealth, maxHealth: EntityRegistry.get('drake').maxHealth, damage: EntityRegistry.get('drake').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (roll < 0.4 && engine.lavaGolems.length < 10) {
                            engine.lavaGolems.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('lava_golem').maxHealth, maxHealth: EntityRegistry.get('lava_golem').maxHealth, damage: EntityRegistry.get('lava_golem').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (engine.kobolds.length < 30) {
                            engine.kobolds.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('kobold').maxHealth, maxHealth: EntityRegistry.get('kobold').maxHealth, damage: EntityRegistry.get('kobold').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        }
                    } else if (block === BlockType.BEE_HIVE) {
                        if (Math.random() < 0.2 && engine.bees.length < 20) {
                            engine.bees.push({
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 10, maxHealth: 10,
                                state: 'WANDER', attackCooldown: 0, aimAngle: 0
                            });
                        }
                    } else if (block === BlockType.ANT_HILL) {
                        if (Math.random() < 0.2 && engine.ants.length < 30) {
                            engine.ants.push({
                                x: x + 0.5, y: y + 0.5, z: z + 1,
                                vx: 0, vy: 0, vz: 0,
                                health: 15, maxHealth: 15,
                                state: 'WANDER', attackCooldown: 0, aimAngle: 0
                            });
                        }
                    }`;

const target = `                    } else if (block === BlockType.ARETH_SPAWNER) {
                        // Fallback for old saves
                        const roll = Math.random();
                        if (roll < 0.2 && engine.drakes.length < 15) {
                            engine.drakes.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('drake').maxHealth, maxHealth: EntityRegistry.get('drake').maxHealth, damage: EntityRegistry.get('drake').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (roll < 0.4 && engine.lavaGolems.length < 10) {
                            engine.lavaGolems.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('lava_golem').maxHealth, maxHealth: EntityRegistry.get('lava_golem').maxHealth, damage: EntityRegistry.get('lava_golem').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        } else if (engine.kobolds.length < 30) {
                            engine.kobolds.push({ x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, health: EntityRegistry.get('kobold').maxHealth, maxHealth: EntityRegistry.get('kobold').maxHealth, damage: EntityRegistry.get('kobold').damage, state: 'CHASE', attackCooldown: Math.random(), attackTimer: 0, aimAngle: 0 });
                        }
                    }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Restored Bee Hives and Ant Hills to SpawnerUpdater");
} else {
    console.log("Could not find target block to restore bee hives.");
}
