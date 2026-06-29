import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { QuestSystem } from '../systems/QuestSystem';
function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

import { BlockType } from '../constants/BlockType';
import { isSolid } from '../World';;
import { ITEMS, SPELLS } from "../Inventory";
import { Updater } from "../Updater";
import { audioEngine } from '../AudioEngine';

export class GoblinUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.goblins.length - 1; i >= 0; i--) {
            const gob = engine.goblins[i];
            
            // Check if camp still exists
            if (gob.campKey) {
                const [cx, cy, cz] = gob.campKey.split(',').map(Number);
                const campBlock = engine.world.getBlock(cx, cy, cz);
                if (campBlock === 0) { // 0 is BlockType.AIR
                    // Camp destroyed, goblin dies
                    removeFromArray(engine.goblins, i);
                    continue;
                }
            }
            
            if (gob.stunTimer && gob.stunTimer > 0) {
                gob.stunTimer -= dt;
                // friction
                gob.vx *= 0.9;
                gob.vy *= 0.9;
            } else {
                // AI Logic (ALttP Style)
                const dx = engine.player.x - gob.x;
                const dy = engine.player.y - gob.y;
                const dz = engine.player.z - gob.z;
                const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const dist2D = Math.sqrt(dx*dx + dy*dy);
                
                // Initialize ALttP state timers if not present
                if (!gob.stateTimer) gob.stateTimer = 0;

                // State Transitions
                if (gob.state !== 'ATTACK' && gob.state !== 'FLEE') {
                    if (distToPlayer < 7 * engine.player.getVisibilityMult() && gob.state === 'WANDER') {
                        // Spotting the player!
                        gob.state = 'ALERT';
                        gob.stateTimer = 0.5; // Pause for half a second in alert mode
                        gob.vx = 0;
                        gob.vy = 0;
                        engine.particles.push({
                            x: gob.x, y: gob.y, z: gob.z + 1.2,
                            text: '!', color: '#ff0000', life: 0.5, maxLife: 0.5, vy: 0
                        });
                        audioEngine.playShoot(); // Maybe a small click or chirp
                    } else if (distToPlayer > 12 * engine.player.getVisibilityMult() && gob.state === 'CHASE') {
                        gob.state = 'WANDER';
                        gob.stateTimer = 1.0;
                    }
                }
                
                // State Executions
                if (gob.state === 'ALERT') {
                    gob.stateTimer -= dt;
                    gob.aimAngle = Math.atan2(dy, dx); // Look at player
                    if (gob.stateTimer <= 0) {
                        gob.state = 'CHASE';
                    }
                } else if (gob.state === 'CHASE') {
                    const speed = gob.isShaman ? 2.0 : 3.5; // Fast charge!
                    const stopDist = gob.isShaman ? 8.0 : 1.0;
                    
                    if (dist2D > stopDist) {
                        gob.vx = (dx / dist2D) * speed;
                        gob.vy = (dy / dist2D) * speed;
                        gob.aimAngle = Math.atan2(dy, dx);
                    } else {
                        gob.vx = 0;
                        gob.vy = 0;
                        gob.aimAngle = Math.atan2(dy, dx);
                    }
                    
                    const attackTriggerDist = gob.isShaman ? 8.5 : 0.9;
                    if (dist2D < attackTriggerDist && Math.abs(dz) < 1.0 && gob.attackCooldown <= 0) {
                        gob.state = 'ATTACK';
                        gob.attackTimer = gob.isShaman ? 0.6 : 0.3; // Attack windup
                        gob.attackCooldown = gob.isShaman ? 2.5 : 1.5;
                        gob.vx = 0;
                        gob.vy = 0;
                    }
                } else if (gob.state === 'WANDER') {
                    gob.stateTimer -= dt;
                    if (gob.stateTimer <= 0) {
                        if (Math.random() < 0.5) {
                            // Pick a new random direction
                            gob.aimAngle = Math.random() * Math.PI * 2;
                            const speed = 1.0;
                            gob.vx = Math.cos(gob.aimAngle) * speed;
                            gob.vy = Math.sin(gob.aimAngle) * speed;
                            gob.stateTimer = 1.0 + Math.random(); // Walk for 1-2 seconds
                        } else {
                            // Stop and look around
                            gob.vx = 0;
                            gob.vy = 0;
                            gob.stateTimer = 1.0 + Math.random(); // Wait for 1-2 seconds
                        }
                    }
                } else if (gob.state === 'FLEE') {
                    const speed = 4.0; // Running away fast
                    gob.vx = -(dx / dist2D) * speed;
                    gob.vy = -(dy / dist2D) * speed;
                    gob.aimAngle = Math.atan2(-dy, -dx);
                } else if (gob.state === 'ATTACK') {
                    gob.vx = 0;
                    gob.vy = 0;
                    gob.attackTimer -= dt;
                    
                    if (gob.attackTimer <= 0) {
                        // Deal damage
                        if (gob.isShaman || gob.type === 'alchemist') {
                            const isFire = gob.type === 'alchemist';
                            // Shoot bolt/bomb
                            const projSpeed = isFire ? 8.0 : 12.0; // Alchemists throw slower bombs
                            const distToP = Math.sqrt(dx*dx + dy*dy);
                            const timeToHit = distToP / projSpeed;
                            const inputObj = engine.input.getMovement();
                            const pDx = engine.player.x + (inputObj.dx * 5.0 * timeToHit) - gob.x;
                            const pDy = engine.player.y + (inputObj.dy * 5.0 * timeToHit) - gob.y;
                            const angle = Math.atan2(pDy, pDx);
                            
                            engine.projectiles.push({
                                x: gob.x,
                                y: gob.y,
                                z: gob.z + 0.5,
                                vx: Math.cos(angle) * projSpeed,
                                vy: Math.sin(angle) * projSpeed,
                                vz: isFire ? 5.0 : 0, // Alchemist bombs arch
                                damage: gob.damage,
                                life: 2.0,
                                maxLife: 2.0,
                                isPlayer: false,
                                isFireball: isFire,
                                damageType: isFire ? 'FIRE' : 'ACID'
                            });
                        } else if (gob.type === 'rockhurler') {
                            const projSpeed = 10.0;
                            const angle = Math.atan2(dy, dx);
                            engine.projectiles.push({
                                x: gob.x, y: gob.y, z: gob.z + 0.5,
                                vx: Math.cos(angle) * projSpeed,
                                vy: Math.sin(angle) * projSpeed,
                                vz: 2.0,
                                damage: gob.damage,
                                life: 1.5, maxLife: 1.5,
                                isPlayer: false,
                                isPot: true // Renders as something solid (maybe a pot or rock equivalent)
                            });
                        } else if (gob.type === 'boomeranger') {
                            const speed = 15.0;
                            const angle = Math.atan2(dy, dx);
                            engine.projectiles.push({
                                x: gob.x, y: gob.y, z: gob.z + 0.5,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                vz: 0,
                                damage: gob.damage,
                                life: Math.min(distToPlayer/speed, 0.8), // Max range of boomerang
                                maxLife: Math.min(distToPlayer/speed, 0.8),
                                isPlayer: false,
                                isBoomerang: true,
                                ownerId: gob // Will return to gob
                            });
                        } else if (gob.type === 'miner') {
                            // Melee attack but higher damage to player armor
                            if (dist2D < 1.4 && Math.abs(dz) < 1.0) {
                                engine.player.takeDamage(gob.damage * 1.5);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                    text: `-${Math.floor(gob.damage * 1.5)}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                                });
                            }
                        } else {
                            if (dist2D < 1.2 && Math.abs(dz) < 1.0) { // Slightly larger than trigger range to allow for player movement
                                engine.player.takeDamage(gob.damage);
                                engine.particles.push({
                                    x: engine.player.x,
                                    y: engine.player.y,
                                    z: engine.player.z + 1,
                                    text: `-${gob.damage}`,
                                    color: '#ef4444',
                                    life: 1.0,
                                    maxLife: 1.0,
                                    vy: -2
                                });
                            }
                        }
                        gob.state = 'CHASE';
                    }
                } else {
                    // WANDER
                    gob.vx = 0;
                    gob.vy = 0;
                    if (Math.random() < 0.01) {
                        gob.vx = (Math.random() - 0.5) * 2;
                        gob.vy = (Math.random() - 0.5) * 2;
                        if (gob.vx !== 0 || gob.vy !== 0) {
                            gob.aimAngle = Math.atan2(gob.vy, gob.vx);
                        }
                    }
                }
            }
            
            // Gravity
            gob.vz -= 20 * dt;
            
            EntitySteeringSystem.applyBoids(gob, engine, dt);
                    EntitySteeringSystem.applyDodge(gob, engine, dt);
            // Movement
            const newX = gob.x + gob.vx * dt;
            const newY = gob.y + gob.vy * dt;
            
            const currentZ = Math.floor(gob.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                // Try step up
                const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                if (!isSolid(blockAbove)) {
                    gob.z = currentZ + 1;
                    gob.x = newX;
                    gob.y = newY;
                } else {
                    // Slide along walls
                    const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(gob.y), currentZ);
                    if (!isSolid(blockX)) gob.x = newX;
                    const blockY = engine.world.getBlock(Math.floor(gob.x), Math.floor(newY), currentZ);
                    if (!isSolid(blockY)) gob.y = newY;
                }
            } else {
                gob.x = newX;
                gob.y = newY;
            }
            
            gob.z += gob.vz * dt;
            
            if (gob.z < 0) {
                removeFromArray(engine.goblins, i);
                continue;
            }
            
            // Collision with ground
            const blockStandingOn = engine.world.getBlock(Math.floor(gob.x), Math.floor(gob.y), Math.floor(gob.z - 0.01));
            if (isSolid(blockStandingOn)) {
                gob.z = Math.floor(gob.z - 0.01) + 1;
                gob.vz = 0;
            }
            

            if (gob.attackCooldown > 0) gob.attackCooldown -= dt;

            if (gob.health <= 0) {
                removeFromArray(engine.goblins, i);
                engine.player.addXp(Math.floor(25 * (gob.maxHealth / 30)));
                QuestSystem.onEnemyKilled(engine, 'GOBLIN');
                
                // Loot drop
                const rand = Math.random();
                if (rand < 0.3) {
                    engine.dropItem(gob.x, gob.y, gob.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 5) + 1 });
                } else if (rand < 0.4) {
                    engine.dropItem(gob.x, gob.y, gob.z, { ...ITEMS['gold_piece'], quantity: 1 });
                }
                if (Math.random() < 0.1) {
                    engine.dropItem(gob.x, gob.y, gob.z, { ...ITEMS['dagger_1'] });
                }
            }
        }
    }
}
