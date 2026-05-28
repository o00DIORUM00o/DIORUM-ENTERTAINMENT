import { Gargoyle, Djinn, Gremlin } from '../types/EntityTypes';
import { removeFromArray } from '../Updater';
import { BlockType } from '../constants/BlockType';
import { ITEMS } from '../Inventory';

export class RatheEntitiesUpdater {
    static updateAll(engine: any, dt: number) {
        RatheEntitiesUpdater.updateGargoyles(engine, dt);
        RatheEntitiesUpdater.updateDjinns(engine, dt);
        RatheEntitiesUpdater.updateGremlins(engine, dt);
    }
    
    static updateGargoyles(engine: any, dt: number) {
        for (let i = engine.gargoyles.length - 1; i >= 0; i--) {
            const g = engine.gargoyles[i];
            
            if (g.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(g.x, g.y, g.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                engine.player.addXp(250);
                engine.dropItem(g.x, g.y, g.z, { id: 'stone', name: 'Stone', category: 'MATERIAL', maxStack: 64, quantity: 2 });
                if (Math.random() < 0.2) {
                    engine.dropItem(g.x, g.y, g.z, { id: 'gargoyle_horn', name: 'Gargoyle Horn', description: 'A tough demonic horn.', category: 'MATERIAL', maxStack: 64, quantity: 1 });
                }
                
                engine.particles.push({
                    x: g.x, y: g.y, z: g.z + 0.5,
                    text: '💥', life: 0.5, maxLife: 0.5, vy: -1
                });
                removeFromArray(engine.gargoyles, i);
                continue;
            }
            
            g.vz -= 30.0 * dt;
            g.z += g.vz * dt;
            
            const floorBlock = engine.world.getBlock(Math.floor(g.x), Math.floor(g.y), Math.floor(g.z - 0.01));
            if (floorBlock !== BlockType.AIR && floorBlock !== BlockType.WATER) {
                if (g.vz < 0) {
                    g.z = Math.floor(g.z - 0.01) + 1;
                    g.vz = 0;
                }
            } else if (g.z < 0) {
                g.z = 0; g.vz = 0;
            }

            if (g.stunTimer && g.stunTimer > 0) {
                g.stunTimer -= dt;
                g.x += g.vx * dt;
                g.y += g.vy * dt;
                continue;
            }

            const dx = engine.player.x - g.x;
            const dy = engine.player.y - g.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (g.state === 'SLEEPING') {
                if (dist < 4) {
                    g.state = 'AWAKE';
                    engine.particles.push({
                        x: g.x, y: g.y, z: g.z + 1,
                        text: 'AWAKEN', color: '#ff4444', life: 1, maxLife: 1, vy: -1
                    });
                }
            } else if (g.state === 'AWAKE') {
                g.state = 'CHASE';
            } else if (g.state === 'CHASE') {
                g.aimAngle = Math.atan2(dy, dx);
                if (dist > 1.0 && dist < 12) {
                    g.vx = Math.cos(g.aimAngle) * 3.5;
                    g.vy = Math.sin(g.aimAngle) * 3.5;
                } else if (dist <= 1.2) {
                    g.vx = 0; g.vy = 0;
                    g.state = 'ATTACK';
                    g.attackTimer = 0.5;
                } else {
                    g.vx = 0; g.vy = 0;
                }
                g.x += g.vx * dt;
                g.y += g.vy * dt;
            } else if (g.state === 'ATTACK') {
                g.attackTimer -= dt;
                if (g.attackTimer <= 0) {
                    if (dist <= 1.5) {
                        if (engine.player.health > 0) {
                            engine.player.health -= g.damage;
                            if (engine.player.health < 0) engine.player.health = 0;
                            if (engine.onHit) engine.onHit(engine.player.x, engine.player.y, engine.player.z, g.damage, 'PHYSICAL');
                            
                            engine.player.vx += Math.cos(g.aimAngle) * 15;
                            engine.player.vy += Math.sin(g.aimAngle) * 15;
                        }
                    }
                    g.state = 'CHASE';
                    g.attackCooldown = 1.0;
                }
            }
        }
    }
    
    static updateDjinns(engine: any, dt: number) {
        for (let i = engine.djinns.length - 1; i >= 0; i--) {
            const d = engine.djinns[i];
            
            if (d.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(d.x, d.y, d.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                engine.player.addXp(300);
                engine.dropItem(d.x, d.y, d.z, { id: 'djinn_lamp', name: 'Djinn Lamp', description: 'A magical lamp that grants a wish.', category: 'MISC', maxStack: 1, quantity: 1 });
                engine.particles.push({
                    x: d.x, y: d.y, z: d.z + 0.5,
                    text: 'PUFF', color: '#8800ff', life: 1, maxLife: 1, vy: -1
                });
                removeFromArray(engine.djinns, i);
                continue;
            }
            
            // Hovering floating AI
            d.z = Math.floor(d.z) + 1.2 + Math.sin(Date.now() / 300) * 0.2;
            
            if (d.stunTimer && d.stunTimer > 0) {
                d.stunTimer -= dt;
                d.x += d.vx * dt;
                d.y += d.vy * dt;
                continue;
            }
            
            const dx = engine.player.x - d.x;
            const dy = engine.player.y - d.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (d.attackCooldown > 0) d.attackCooldown -= dt;
            
            if (dist < 10 * engine.player.getVisibilityMult()) {
                d.state = 'CHASE';
            } else {
                d.state = 'WANDER';
            }
            
            if (d.state === 'CHASE') {
                d.aimAngle = Math.atan2(dy, dx);
                // Keep distance
                if (dist > 6) {
                    d.vx = Math.cos(d.aimAngle) * 2;
                    d.vy = Math.sin(d.aimAngle) * 2;
                } else if (dist < 4) {
                    d.vx = -Math.cos(d.aimAngle) * 2;
                    d.vy = -Math.sin(d.aimAngle) * 2;
                } else {
                    d.vx = 0; d.vy = 0;
                }
                
                if (d.attackCooldown <= 0 && dist < 8) {
                    d.state = 'ATTACK';
                    d.attackTimer = 0.5;
                }
                
                d.x += d.vx * dt;
                d.y += d.vy * dt;
            } else if (d.state === 'ATTACK') {
                d.attackTimer -= dt;
                if (d.attackTimer <= 0) {
                    // Shoot magic tornado
                    engine.projectiles.push({
                        x: d.x, y: d.y, z: d.z,
                        vx: Math.cos(d.aimAngle) * 10,
                        vy: Math.sin(d.aimAngle) * 10,
                        damage: 35,
                        life: 2.0,
                        damageType: 'MAGIC_TORNADO',
                        isPlayer: false
                    });
                    d.state = 'CHASE';
                    d.attackCooldown = 3.0; // Slow attacks
                }
            }
        }
    }
    
    static updateGremlins(engine: any, dt: number) {
        for (let i = engine.gremlins.length - 1; i >= 0; i--) {
            const g = engine.gremlins[i];
            
            if (g.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(g.x, g.y, g.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                engine.player.addXp(120);
                engine.dropItem(g.x, g.y, g.z, { id: 'scrap_metal', name: 'Scrap Metal', description: 'Rusty iron pieces.', category: 'MATERIAL', maxStack: 64, quantity: 1 });
                engine.particles.push({
                    x: g.x, y: g.y, z: g.z + 0.5,
                    text: '💢', life: 0.5, maxLife: 0.5, vy: -1
                });
                removeFromArray(engine.gremlins, i);
                continue;
            }
            
            g.vz -= 30.0 * dt;
            g.z += g.vz * dt;
            
            const floorBlock = engine.world.getBlock(Math.floor(g.x), Math.floor(g.y), Math.floor(g.z - 0.01));
            let grounded = false;
            if (floorBlock !== BlockType.AIR && floorBlock !== BlockType.WATER) {
                if (g.vz < 0) {
                    g.z = Math.floor(g.z - 0.01) + 1;
                    g.vz = 0;
                    grounded = true;
                }
            } else if (g.z < 0) {
                g.z = 0; g.vz = 0; grounded = true;
            }
            
            if (g.stunTimer && g.stunTimer > 0) {
                g.stunTimer -= dt;
                g.x += g.vx * dt;
                g.y += g.vy * dt;
                continue;
            }
            
            const dx = engine.player.x - g.x;
            const dy = engine.player.y - g.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (g.attackCooldown > 0) g.attackCooldown -= dt;
            
            if (dist < 10 * engine.player.getVisibilityMult()) {
                if (g.state !== 'JUMPING') g.state = 'CHASE';
            }
            
            if (g.state === 'CHASE') {
                g.aimAngle = Math.atan2(dy, dx);
                g.vx = Math.cos(g.aimAngle) * 5.0; // Extremely fast
                g.vy = Math.sin(g.aimAngle) * 5.0;
                
                // Random jump!
                if (grounded && Math.random() < 0.02) {
                    g.vz = 15.0;
                    g.state = 'JUMPING';
                }
                
                if (dist <= 1.0 && g.attackCooldown <= 0) {
                    g.state = 'ATTACK';
                    g.attackTimer = 0.2;
                }
                
                g.x += g.vx * dt;
                g.y += g.vy * dt;
                
            } else if (g.state === 'JUMPING') {
                g.x += g.vx * dt;
                g.y += g.vy * dt;
                if (grounded) {
                    g.state = 'CHASE';
                }
            } else if (g.state === 'ATTACK') {
                g.attackTimer -= dt;
                if (g.attackTimer <= 0) {
                    if (dist <= 1.5) {
                        engine.player.health -= g.damage;
                        if (engine.player.health < 0) engine.player.health = 0;
                        if (engine.onHit) engine.onHit(engine.player.x, engine.player.y, engine.player.z, g.damage, 'PHYSICAL');
                    }
                    g.state = 'CHASE';
                    g.attackCooldown = 0.5; // Fast attacker
                }
            }
        }
    }
}
