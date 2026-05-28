import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
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

export class RatUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.rats.length - 1; i >= 0; i--) {
            const rat = engine.rats[i];
            
            rat.vz -= 20 * dt; // Gravity
            EntitySteeringSystem.applyBoids(rat, engine, dt);
                    EntitySteeringSystem.applyDodge(rat, engine, dt);
            rat.x += rat.vx * dt;
            rat.y += rat.vy * dt;
            rat.z += rat.vz * dt;

            // Floor collision
            const blockStandingOn = engine.world.getBlock(Math.floor(rat.x), Math.floor(rat.y), Math.floor(rat.z - 0.01));
            if (isSolid(blockStandingOn)) {
                rat.z = Math.floor(rat.z - 0.01) + 1;
                rat.vz = 0;
            }

            // Wall collision
            const block = engine.world.getBlock(Math.floor(rat.x), Math.floor(rat.y), Math.floor(rat.z));
            if (isSolid(block)) {
                rat.x -= rat.vx * dt;
                rat.y -= rat.vy * dt;
            }

            // AI
            let closestEnemy: any = null;
            let closestDist = 8; // Aggro radius
            const enemies = [...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.lavaGolems, ...engine.bees, ...engine.ants];
            
            for (const e of enemies) {
                const dist = Math.hypot(e.x - rat.x, e.y - rat.y);
                if (dist < closestDist && Math.abs(e.z - rat.z) < 1.0) {
                    closestDist = dist;
                    closestEnemy = e;
                }
            }

            if (rat.attackTimer > 0) rat.attackTimer -= dt;

            if (closestEnemy) {
                if (rat.attackTimer === undefined) rat.attackTimer = 0;
                if (rat.state !== 'ATTACK_LUNGE') {
                    rat.state = 'CHASE';
                    rat.aimAngle = Math.atan2(closestEnemy.y - rat.y, closestEnemy.x - rat.x);
                    
                    if (closestDist > 1.2) {
                        rat.vx = Math.cos(rat.aimAngle) * 5;
                        rat.vy = Math.sin(rat.aimAngle) * 5;
                    } else if (rat.attackTimer <= 0) {
                        rat.state = 'ATTACK_LUNGE';
                        rat.attackTimer = 0.5; // lunge duration
                        rat.attackCooldown = 1.0;
                    } else {
                        rat.vx = 0;
                        rat.vy = 0;
                    }
                }
                
                if (rat.state === 'ATTACK_LUNGE') {
                    const lungeProg = rat.attackTimer / 0.5; // 1 to 0
                    if (lungeProg > 0.5) {
                        // Flying in
                        rat.vx = Math.cos(rat.aimAngle) * 8;
                        rat.vy = Math.sin(rat.aimAngle) * 8;
                    } else {
                        // Stop
                        rat.vx = 0;
                        rat.vy = 0;
                    }
                    
                    if (rat.attackTimer <= 0.25 && !rat.didDamage) {
                        rat.didDamage = true;
                        if (closestDist < 1.5) {
                            closestEnemy.health -= 8;
                            engine.particles.push({
                                x: closestEnemy.x, y: closestEnemy.y, z: closestEnemy.z + 0.5,
                                text: '-8', color: '#ef4444', life: 0.5, maxLife: 0.5, vy: -2
                            });
                        }
                    }
                    if (rat.attackTimer <= 0) {
                        rat.state = 'CHASE';
                        rat.attackTimer = 1.0; // cooldown
                        rat.didDamage = false;
                    }
                }
            } else {
                rat.state = 'FOLLOW';
                const distToPlayer = Math.hypot(engine.player.x - rat.x, engine.player.y - rat.y);
                if (distToPlayer > 3.0) {
                    rat.aimAngle = Math.atan2(engine.player.y - rat.y, engine.player.x - rat.x);
                    rat.vx = Math.cos(rat.aimAngle) * 5;
                    rat.vy = Math.sin(rat.aimAngle) * 5;
                } else {
                    rat.vx *= 0.8;
                    rat.vy *= 0.8;
                }
            }

            if (rat.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(rat.x, rat.y, rat.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.rats, i);
                engine.player.addXp(15);
                // Death particles
                for (let p = 0; p < 5; p++) {
                    engine.particles.push({
                        x: rat.x, y: rat.y, z: rat.z,
                        text: '', color: '#8B4513', life: 0.5, maxLife: 0.5,
                        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: Math.random() * 2
                    });
                }
            }
        }
    }
}
