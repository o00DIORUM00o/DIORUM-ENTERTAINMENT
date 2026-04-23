import { Engine } from '../Engine';
import { FireDragonBoss } from '../types/EntityTypes';
import { ITEMS } from '../Inventory';

export class FireDragonBossUpdater {
    static update(engine: Engine, dt: number) {
        for (let i = engine.fireDragonBosses.length - 1; i >= 0; i--) {
            const boss = engine.fireDragonBosses[i];
            
            if (boss.health <= 0) {
                engine.fireDragonBosses.splice(i, 1);
                engine.player.addXp(5000);
                engine.particles.push({
                    x: boss.x, y: boss.y, z: boss.z + 5,
                    text: 'DRAGON DEFEATED!', color: '#FFD700', life: 5.0, maxLife: 5.0, vy: -1
                });
                // Epic loot
                for (let k=0; k<10; k++) {
                    engine.droppedItems.push({
                        x: boss.x + (Math.random()-0.5)*4, y: boss.y + (Math.random()-0.5)*4, z: boss.z,
                        vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, vz: 10 + Math.random()*5,
                        item: { ...ITEMS['gold_piece'], quantity: 50 }, life: 300
                    });
                }
                engine.droppedItems.push({
                    x: boss.x, y: boss.y, z: boss.z,
                    vx: 0, vy: 0, vz: 5,
                    item: { ...ITEMS['obsidian_sword'], quantity: 1, damage: 50, reach: 3, speedBonus: 1.5, lifesteal: 0.1 }, life: 300
                });
                engine.droppedItems.push({
                    x: boss.x, y: boss.y, z: boss.z,
                    vx: 0, vy: 0, vz: 5,
                    item: { ...ITEMS['dragon_scale_armor'], quantity: 1 }, life: 300
                });
                continue;
            }

            // Simple state machine
            boss.x += boss.vx * dt;
            boss.y += boss.vy * dt;
            boss.z += boss.vz * dt;

            // Gravity/Hovering
            if (boss.state === 'SLEEPING' || boss.state === 'WANDER') {
                const surfaceInfo = engine.world.getSurface(boss.x, boss.y, boss.z);
                const surfaceZ = surfaceInfo ? surfaceInfo.z : boss.z;
                if (boss.z > surfaceZ) {
                    boss.vz -= 20 * dt;
                } else {
                    boss.z = surfaceZ;
                    boss.vz = 0;
                }
            } else {
                // Flying!
                const surfaceInfo = engine.world.getSurface(boss.x, boss.y, boss.z);
                const surfaceZ = surfaceInfo ? surfaceInfo.z : boss.z;
                const targetZ = surfaceZ + boss.flightHeight;
                if (boss.z < targetZ) boss.vz += 10 * dt;
                else boss.vz -= 10 * dt;
                
                boss.vz *= 0.9; // damp
                if (Math.abs(boss.z - targetZ) < 0.5) boss.vz *= 0.5;
            }

            const distToPlayer = Math.hypot(engine.player.x - boss.x, engine.player.y - boss.y);
            
            if (boss.state === 'SLEEPING') {
                if (distToPlayer < 12 || boss.health < boss.maxHealth) {
                    boss.state = 'CHASE';
                    boss.flightHeight = 6.0;
                }
            } else {
                boss.attackTimer -= dt;
                
                if (boss.state === 'CHASE') {
                    // Chase player
                    const angle = Math.atan2(engine.player.y - boss.y, engine.player.x - boss.x);
                    boss.aimAngle = angle;
                    boss.vx = Math.cos(angle) * 4;
                    boss.vy = Math.sin(angle) * 4;
                    
                    if (distToPlayer < 8 && boss.attackTimer <= 0) {
                        boss.state = 'BREATH_ATTACK';
                        boss.attackTimer = 3.0; // Breathe fire for 3s
                    } else if (Math.random() < 0.01 && boss.attackTimer <= 0) {
                        boss.state = 'FLY_ATTACK';
                        boss.flightHeight = 15.0; // Fly high
                        boss.attackTimer = 4.0;
                    }
                } else if (boss.state === 'BREATH_ATTACK') {
                    boss.vx = 0;
                    boss.vy = 0;
                    const angle = Math.atan2(engine.player.y - boss.y, engine.player.x - boss.x);
                    boss.aimAngle += (angle - boss.aimAngle) * Math.min(1, 5 * dt); // slow turn
                    
                    // shoot fire
                    if (Math.random() < 0.3) {
                        engine.projectiles.push({
                            x: boss.x + Math.cos(boss.aimAngle)*3,
                            y: boss.y + Math.sin(boss.aimAngle)*3,
                            z: boss.z + 1,
                            vx: Math.cos(boss.aimAngle)*15 + (Math.random()-0.5)*2,
                            vy: Math.sin(boss.aimAngle)*15 + (Math.random()-0.5)*2,
                            vz: -2,
                            damage: 30,
                            life: 2.0,
                            isPlayer: false,
                            color: '#ff4500' // Fireball color
                        });
                    }

                    if (boss.attackTimer <= 0) {
                        boss.state = 'CHASE';
                        boss.attackTimer = 2.0; // cooldown
                    }
                } else if (boss.state === 'FLY_ATTACK') {
                    // Dive bomb or drop meteors
                    const angle = Math.atan2(engine.player.y - boss.y, engine.player.x - boss.x);
                    boss.vx = Math.cos(angle) * 6;
                    boss.vy = Math.sin(angle) * 6;
                    
                    if (Math.random() < 0.1) {
                        engine.projectiles.push({
                            x: boss.x,
                            y: boss.y,
                            z: boss.z,
                            vx: (Math.random()-0.5)*5,
                            vy: (Math.random()-0.5)*5,
                            vz: -20,
                            damage: 50,
                            life: 3.0,
                            isPlayer: false,
                            color: '#ff0000' // Meteor color
                        });
                    }

                    if (boss.attackTimer <= 0) {
                        boss.state = 'CHASE';
                        boss.flightHeight = 6.0;
                        boss.attackTimer = 2.0;
                    }
                }
            }
        }
    }
}
