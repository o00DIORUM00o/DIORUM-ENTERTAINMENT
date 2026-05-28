import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { BlockType } from '../constants/BlockType';
import { isSolid } from '../World';;
import { ITEMS } from "../Inventory";
import { Updater } from "../Updater";

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class KoboldUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.kobolds.length - 1; i >= 0; i--) {
            const kobold = engine.kobolds[i];
            
            if (kobold.stunTimer && kobold.stunTimer > 0) {
                kobold.stunTimer -= dt;
                kobold.vx = 0;
                kobold.vy = 0;
            } else {
                // AI Logic
                const dx = engine.player.x - kobold.x;
                const dy = engine.player.y - kobold.y;
                const dz = engine.player.z - kobold.z;
                const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const dist2D = Math.sqrt(dx*dx + dy*dy);
                
                if (kobold.state !== 'ATTACK') {
                    if (kobold.type === 'worker' && kobold.health < kobold.maxHealth * 0.5) {
                        kobold.state = 'FLEE';
                    } else if (distToPlayer < 25 * engine.player.getVisibilityMult()) {
                        kobold.state = 'CHASE';
                    } else if (distToPlayer > 40 * engine.player.getVisibilityMult()) {
                        kobold.state = 'WANDER';
                    }
                    
                    // The Cult of the Dragon
                    if (kobold.state !== 'CHASE' && engine.world.activePlanet === 'ARETH') {
                        let defendDragon = false;
                        for (const d of engine.drakes) {
                            if (d.health < d.maxHealth && Math.hypot(d.x - kobold.x, d.y - kobold.y) < 30) {
                                defendDragon = true;
                                break;
                            }
                        }
                        for (const b of engine.fireDragonBosses) {
                            if (b.health < b.maxHealth && Math.hypot(b.x - kobold.x, b.y - kobold.y) < 40) {
                                defendDragon = true;
                                break;
                            }
                        }
                        if (defendDragon) {
                            kobold.state = 'CHASE';
                            if (Math.random() < 0.2) {
                                engine.particles.push({x: kobold.x, y: kobold.y, z: kobold.z + 1, text: 'Defend the Gods!', color: '#ffaaaa', life: 1.5, maxLife: 1.5, vy: -1, vx:0, speed:0});
                            }
                        }
                    }
                }
                
                if (kobold.state === 'FLEE') {
                    kobold.vx = -(dx / dist2D) * 5.0;
                    kobold.vy = -(dy / dist2D) * 5.0;
                    kobold.aimAngle = Math.atan2(-dy, -dx);
                    
                    if (Math.random() < 0.05) {
                        engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['gold_piece'], quantity: 1 });
                    }
                } else if (kobold.state === 'CHASE') {
                    let speed = 3.5;
                    let stopDist = 1.0;
                    let attackTriggerDist = 1.2;

                    if (kobold.type === 'warrior') {
                        speed = 4.5;
                    } else if (kobold.type === 'shaman') {
                        stopDist = 8.0;
                        attackTriggerDist = 9.0;
                    } else if (kobold.type === 'bomber') {
                        speed = 6.0;
                        stopDist = 0.5;
                        attackTriggerDist = 1.0;
                    }
                    
                    if (dist2D > stopDist) {
                        kobold.vx = (dx / dist2D) * speed;
                        kobold.vy = (dy / dist2D) * speed;
                        kobold.aimAngle = Math.atan2(dy, dx);
                    } else {
                        kobold.vx = 0;
                        kobold.vy = 0;
                        kobold.aimAngle = Math.atan2(dy, dx);
                    }
                    
                    if (dist2D < attackTriggerDist && Math.abs(dz) < 1.0 && kobold.attackCooldown <= 0) {
                        kobold.state = 'ATTACK';
                        kobold.attackTimer = 0.4;
                        if (kobold.type === 'shaman') kobold.attackCooldown = 2.5;
                        else if (kobold.type === 'warrior') kobold.attackCooldown = 0.5;
                        else kobold.attackCooldown = 0.8;
                    }
                } else if (kobold.state === 'ATTACK') {
                    kobold.vx = 0;
                    kobold.vy = 0;
                    kobold.attackTimer -= dt;
                    
                    if (kobold.attackTimer <= 0) {
                        if (kobold.type === 'bomber') {
                            // EXPLODE
                            kobold.health = 0;
                            engine.particles.push({
                                x: kobold.x, y: kobold.y, z: kobold.z,
                                text: 'BOOM!', color: '#ff4500', life: 1.0, maxLife: 1.0, vy: -2
                            });
                            if (dist2D < 3.0) {
                                engine.player.takeDamage(kobold.damage * 3);
                            }
                        } else if (kobold.type === 'shaman') {
                            // Shoot fire bolt
                            engine.projectiles.push({
                                x: kobold.x, y: kobold.y, z: kobold.z + 0.5,
                                vx: Math.cos(kobold.aimAngle) * 8, vy: Math.sin(kobold.aimAngle) * 8, vz: 0,
                                damage: kobold.damage, life: 2.0, isPlayer: false, color: '#ff4500'
                            });
                        } else {
                            // Melee
                            if (dist2D < 1.5 && Math.abs(dz) < 1.0) {
                                engine.player.takeDamage(kobold.damage);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                    text: `-${kobold.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                                });
                            }
                        }
                        kobold.state = 'CHASE';
                    }
                } else {
                    // WANDER
                    kobold.vx = 0;
                    kobold.vy = 0;
                    if (Math.random() < 0.02) {
                        kobold.vx = (Math.random() - 0.5) * 2;
                        kobold.vy = (Math.random() - 0.5) * 2;
                        if (kobold.vx !== 0 || kobold.vy !== 0) {
                            kobold.aimAngle = Math.atan2(kobold.vy, kobold.vx);
                        }
                    }
                }
            }
            
            // Gravity
            kobold.vz -= 20 * dt;
            
            EntitySteeringSystem.applyBoids(kobold, engine, dt);
            EntitySteeringSystem.applyDodge(kobold, engine, dt);
            
            // Movement
            const newX = kobold.x + kobold.vx * dt;
            const newY = kobold.y + kobold.vy * dt;
            
            const currentZ = Math.floor(kobold.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                // Try step up
                const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                if (!isSolid(blockAbove)) {
                    kobold.z = currentZ + 1;
                    kobold.x = newX;
                    kobold.y = newY;
                } else {
                    const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(kobold.y), currentZ);
                    if (!isSolid(blockX)) kobold.x = newX;
                    const blockY = engine.world.getBlock(Math.floor(kobold.x), Math.floor(newY), currentZ);
                    if (!isSolid(blockY)) kobold.y = newY;
                }
            } else {
                kobold.x = newX;
                kobold.y = newY;
            }
            
            kobold.z += kobold.vz * dt;
            
            if (kobold.z < 0) {
                removeFromArray(engine.kobolds, i);
                continue;
            }
            
            // Collision with ground
            const blockStandingOn = engine.world.getBlock(Math.floor(kobold.x), Math.floor(kobold.y), Math.floor(kobold.z - 0.01));
            if (isSolid(blockStandingOn)) {
                kobold.z = Math.floor(kobold.z - 0.01) + 1;
                kobold.vz = 0;
            }
            
            if (kobold.attackCooldown > 0) kobold.attackCooldown -= dt;

            if (kobold.type === 'trapper') {
                if (!kobold.trapTimer) kobold.trapTimer = 0;
                kobold.trapTimer += dt;
                // Lay a spike floor trap every 10 seconds if wandering or chasing
                if (kobold.trapTimer > 10.0 && isSolid(blockStandingOn)) {
                    kobold.trapTimer = 0;
                    const bX = Math.floor(kobold.x);
                    const bY = Math.floor(kobold.y);
                    const bZ = Math.floor(kobold.z);
                    if (engine.world.getBlock(bX, bY, bZ) === BlockType.AIR) {
                        engine.world.setBlock(bX, bY, bZ, BlockType.SPIKE_FLOOR);
                    }
                }
            } else if (kobold.type === 'dragonkeeper') {
                if (!kobold.healTimer) kobold.healTimer = 0;
                kobold.healTimer += dt;
                if (kobold.healTimer > 5.0) {
                    kobold.healTimer = 0;
                    // Heal nearby kobolds
                    for (const other of engine.kobolds) {
                        if (other !== kobold) {
                            const dDist = Math.sqrt((other.x - kobold.x)**2 + (other.y - kobold.y)**2 + (other.z - kobold.z)**2);
                            if (dDist < 10) {
                                other.health = Math.min(other.health + 20, other.maxHealth);
                                engine.particles.push({
                                    x: other.x, y: other.y, z: other.z + 1,
                                    text: '+20', color: '#10b981', life: 1.0, maxLife: 1.0, vy: -1
                                });
                            }
                        }
                    }
                }
            }

            if (kobold.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.kobolds, i);
                engine.player.addXp(Math.floor(30 * (kobold.maxHealth / 50)));
                
                // Loot drop
                const rand = Math.random();
                if (rand < 0.4) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                }
                if (Math.random() < 0.1) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['ruby'] });
                }

                // specific loot
                if (kobold.type === 'bomber' && Math.random() < 0.2) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['bomb'], quantity: 1 });
                }
                if (kobold.type === 'shaman' && Math.random() < 0.2) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['mana_potion'], quantity: 1 });
                }
                if (kobold.type === 'dragonkeeper' && Math.random() < 0.5) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['crystal_shard'], quantity: 1 });
                }
                if (kobold.type === 'worker' && Math.random() < 0.1) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['kobold_dagger'], quantity: 1 });
                }
                if (kobold.type === 'warrior' && Math.random() < 0.1) {
                    engine.dropItem(kobold.x, kobold.y, kobold.z, { ...ITEMS['kobold_spear'], quantity: 1 });
                }
            }
        }
    }
}
