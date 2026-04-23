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
                const dx = engine.player.x - drake.x;
                const dy = engine.player.y - drake.y;
                const dz = engine.player.z - drake.z;
                const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const dist2D = Math.sqrt(dx*dx + dy*dy);
                
                if (drake.state !== 'ATTACK') {
                    if (distToPlayer < 40 * engine.player.getVisibilityMult()) {
                        drake.state = 'CHASE';
                    } else if (distToPlayer > 60 * engine.player.getVisibilityMult()) {
                        drake.state = 'WANDER';
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
                    if (dist2D < attackTriggerDist && Math.abs(dz) < 1.5 && drake.attackCooldown <= 0) {
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
                        if (dist2D < 1.5 && Math.abs(dz) < 2.0) {
                            engine.player.takeDamage(drake.damage);
                            engine.particles.push({
                                x: engine.player.x,
                                y: engine.player.y,
                                z: engine.player.z + 1,
                                text: `-${drake.damage}`,
                                color: '#ef4444',
                                life: 1.0,
                                maxLife: 1.0,
                                vy: -2
                            });
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
            
            Updater.applyBoids(drake, engine, dt);
            Updater.applyDodge(drake, engine, dt);
            
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
