import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { isSolid } from "../World";
import { BlockType } from "../constants/BlockType";
import { ITEMS } from "../Inventory";
import { Updater } from "../Updater";

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class DrakeUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.drakes.length - 1; i >= 0; i--) {
            const drake = engine.drakes[i];
            
            if (drake.stunTimer && drake.stunTimer > 0) {
                drake.stunTimer -= dt;
                drake.vx = 0;
                drake.vy = 0;
            } else {
                // AI Logic - Drakes are aggressive and fast
                let target = engine.player;
                if (drake.isFriendly) {
                    let closestEnemy = null;
                    let closestDist = 15;
                    const allEnemies = [
                        ...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.ants, ...engine.rats, ...engine.drakes, ...engine.archers, ...engine.darkKnights, ...engine.abyssalKnights, ...engine.lavaGolems, ...engine.frostCasters, ...engine.phantomWizards, ...engine.shadowWizards, ...engine.sphinxs, ...engine.sandTerrors, ...engine.voidLords, ...engine.fireDragonBosses
                    ];
                    for (const enemy of allEnemies) {
                        if (enemy.isFriendly) continue;
                        const edist = Math.sqrt((enemy.x - drake.x)**2 + (enemy.y - drake.y)**2 + (enemy.z - drake.z)**2);
                        if (edist < closestDist) {
                            closestDist = edist;
                            closestEnemy = enemy;
                        }
                    }
                    if (closestEnemy) {
                        target = closestEnemy;
                    }
                }
                
                const dx = target.x - drake.x;
                const dy = target.y - drake.y;
                const dz = target.z - drake.z;
                const distToTarget = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const dist2D = Math.sqrt(dx*dx + dy*dy);
                
                if (drake.state !== 'ATTACK') {
                    if (!drake.isFriendly) {
                        if (distToTarget < 40 * engine.player.getVisibilityMult()) {
                            drake.state = 'CHASE';
                        } else if (distToTarget > 60 * engine.player.getVisibilityMult()) {
                            drake.state = 'WANDER';
                        }
                    } else {
                        if (target !== engine.player) {
                            drake.state = 'CHASE';
                        } else {
                            // Follow player
                            if (distToTarget > 15) {
                                drake.x = target.x + (Math.random() - 0.5) * 2;
                                drake.y = target.y + (Math.random() - 0.5) * 2;
                            } else if (distToTarget > 4) {
                                drake.state = 'CHASE';
                            } else {
                                drake.state = 'WANDER';
                            }
                        }
                    }
                }
                
                if (drake.state === 'CHASE') {
                    const speed = 4.5; // Fast
                    const stopDist = 1.0;
                    
                    if (dist2D > stopDist) {
                        drake.vx = (dx / dist2D) * speed;
                        drake.vy = (dy / dist2D) * speed;
                        drake.aimAngle = Math.atan2(dy, dx);
                    } else {
                        drake.vx = 0;
                        drake.vy = 0;
                        drake.aimAngle = Math.atan2(dy, dx);
                    }
                    
                    const attackTriggerDist = 1.2;
                    if (dist2D < attackTriggerDist && Math.abs(dz) < 1.0 && drake.attackCooldown <= 0) {
                        drake.state = 'ATTACK';
                        drake.attackTimer = 0.3; // Quick attack
                        drake.attackCooldown = 1.0;
                    }
                } else if (drake.state === 'ATTACK') {
                    drake.vx = 0;
                    drake.vy = 0;
                    drake.attackTimer -= dt;
                    
                    if (drake.attackTimer <= 0) {
                        // Deal damage
                        if (dist2D < 1.5 && Math.abs(dz) < 1.0) {
                            if (target === engine.player) {
                                engine.player.takeDamage(drake.damage);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                    text: `-${drake.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                                });
                            } else {
                                target.health -= drake.damage;
                                engine.particles.push({
                                    x: target.x, y: target.y, z: target.z + 1,
                                    text: `-${drake.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                                });
                            }
                        }
                        drake.state = 'CHASE';
                    }
                } else {
                    // WANDER
                    drake.vx = 0;
                    drake.vy = 0;
                    if (Math.random() < 0.05) {
                        drake.vx = (Math.random() - 0.5) * 3;
                        drake.vy = (Math.random() - 0.5) * 3;
                        if (drake.vx !== 0 || drake.vy !== 0) {
                            drake.aimAngle = Math.atan2(drake.vy, drake.vx);
                        }
                    }
                }
            }
            
            // Gravity (Drakes can fly slightly but let's stick to ground for now, maybe lessen gravity)
            drake.vz -= 10 * dt;
            
            EntitySteeringSystem.applyBoids(drake, engine, dt);
            EntitySteeringSystem.applyDodge(drake, engine, dt);
            
            // Movement
            const newX = drake.x + drake.vx * dt;
            const newY = drake.y + drake.vy * dt;
            
            const currentZ = Math.floor(drake.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                // Try step up
                const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                if (!isSolid(blockAbove)) {
                    drake.z = currentZ + 1;
                    drake.x = newX;
                    drake.y = newY;
                } else {
                    const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(drake.y), currentZ);
                    if (!isSolid(blockX)) drake.x = newX;
                    const blockY = engine.world.getBlock(Math.floor(drake.x), Math.floor(newY), currentZ);
                    if (!isSolid(blockY)) drake.y = newY;
                }
            } else {
                drake.x = newX;
                drake.y = newY;
            }
            
            drake.z += drake.vz * dt;
            
            if (drake.z < 0) {
                removeFromArray(engine.drakes, i);
                continue;
            }
            
            // Collision with ground
            const blockStandingOn = engine.world.getBlock(Math.floor(drake.x), Math.floor(drake.y), Math.floor(drake.z - 0.01));
            
            // Lava interactions
            if (blockStandingOn === BlockType.LAVA) {
                drake.z = Math.floor(drake.z - 0.01) + 1;
                drake.vz = 0;
                
                // Heal in lava
                if (drake.health < drake.maxHealth) {
                    drake.health = Math.min(drake.maxHealth, drake.health + 30 * dt);
                    if (Math.random() < 0.1) {
                         engine.particles.push({x: drake.x, y: drake.y, z: drake.z + 1, text: '+', color: '#facc15', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                    }
                }
            } else if (isSolid(blockStandingOn)) {
                drake.z = Math.floor(drake.z - 0.01) + 1;
                drake.vz = 0;
            }
            
            if (drake.attackCooldown > 0) drake.attackCooldown -= dt;

            if (drake.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(drake.x, drake.y, drake.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.drakes, i);
                engine.player.addXp(Math.floor(60 * (drake.maxHealth / 100)));
                
                // Loot drop
                engine.dropItem(drake.x, drake.y, drake.z, { ...ITEMS['magma_core'] });
                if (Math.random() < 0.25) {
                    engine.dropItem(drake.x, drake.y, drake.z, { ...ITEMS['gold_ingot'] });
                }
            }
        }
    }
}
