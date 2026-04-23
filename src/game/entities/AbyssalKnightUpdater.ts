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
import { ZeldaAI } from "./ai/ZeldaAI";

export class AbyssalKnightUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.abyssalKnights.length - 1; i >= 0; i--) {
            const k = engine.abyssalKnights[i];
            
            const distToPlayer = Math.hypot(engine.player.x - k.x, engine.player.y - k.y);
            
            if (!k.state) k.state = 'WANDER';

            k.target = distToPlayer < 20 * engine.player.getVisibilityMult() ? engine.player : undefined;
            k.moveSpeed = 3.5;
            k.chaseDist = 20.0;
            k.stopDist = 0.8;
            k.attackDist = 1.2;
            k.alertTime = 0.1;
            k.fleeHealthThreshold = 0.15; // flees when < 15% HP

            ZeldaAI.update(k, engine, dt);

            // Special Abyssal Knight Mechanics (DASH / DARK ATTACK)
            if (k.state === 'CHASE' && k.target) {
                const tx = k.target.x - k.x;
                const ty = k.target.y - k.y;
                const dist2D = Math.hypot(tx, ty);

                // Dark Dash capability
                if (dist2D > 4.0 && dist2D < 10.0 && k.attackCooldown <= 0 && Math.random() < 0.05) {
                    k.state = 'ATTACK_DASH';
                    k.attackTimer = 0.8;
                    k.attackCooldown = 2.0;
                    engine.particles.push({
                        x: k.x, y: k.y, z: k.z + 1.0,
                        text: '☄️', color: '#8800ff', life: 1.0, maxLife: 1.0, vy: 0
                    });
                }
            }

            if (k.state === 'ATTACK_DASH') {
                const dashProg = 1 - (k.attackTimer / 0.8);
                if (dashProg > 0.3 && dashProg < 0.7) {
                    k.vx = Math.cos(k.aimAngle) * 15;
                    k.vy = Math.sin(k.aimAngle) * 15;
                    // Leave a trail
                    if (Math.random() < 0.5) {
                        engine.particles.push({
                            x: k.x, y: k.y, z: k.z + 0.5,
                            vx: (Math.random() - 0.5)*2, vy: (Math.random() - 0.5)*2,
                            text: '', color: '#000000', life: 0.3, maxLife: 0.3, size: 4
                        });
                    }
                } else if (dashProg >= 0.7) {
                    k.vx *= 0.5;
                    k.vy *= 0.5;
                } else {
                    k.vx = 0; k.vy = 0;
                }

                // Hit during dash
                if (dashProg > 0.3 && dashProg < 0.8) {
                    const hitDist = Math.hypot(engine.player.x - k.x, engine.player.y - k.y);
                    if (hitDist < 1.5 && !k.didDamage) {
                        k.didDamage = true;
                        engine.player.takeDamage(15);
                        let kb = 8.0;
                        engine.player.vx += Math.cos(k.aimAngle) * kb;
                        engine.player.vy += Math.sin(k.aimAngle) * kb;
                    }
                }

                k.attackTimer -= dt;
                if (k.attackTimer <= 0) {
                    k.state = 'CHASE';
                    k.didDamage = false;
                }
            }

            // Standard Melee Attack logic via ZeldaAI leaves k.state === 'ATTACK'
            if (k.state === 'ATTACK') {
                if (k.attackTimer === undefined || k.attackTimer <= 0) {
                    k.attackTimer = 0.5;
                    k.attackCooldown = 1.0;
                }
                k.attackTimer -= dt;
                if (k.attackTimer <= 0.2 && !k.didDamage) {
                    const hitDist = Math.hypot(engine.player.x - k.x, engine.player.y - k.y);
                    if (hitDist < 2.0) {
                        engine.player.takeDamage(k.damage || 10);
                        k.didDamage = true;
                    }
                }
                if (k.attackTimer <= 0) {
                    k.state = 'CHASE';
                    k.didDamage = false;
                    k.attackTimer = undefined;
                }
            }
            
            k.vz -= 20 * dt;
            
            Updater.applyBoids(k, engine, dt);
            Updater.applyDodge(k, engine, dt);
            
            const newX = k.x + k.vx * dt;
            const newY = k.y + k.vy * dt;
            const currentZ = Math.floor(k.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(k.y), currentZ);
                if (!isSolid(blockX)) k.x = newX;
                const blockY = engine.world.getBlock(Math.floor(k.x), Math.floor(newY), currentZ);
                if (!isSolid(blockY)) k.y = newY;
            } else {
                k.x = newX;
                k.y = newY;
            }
            
            k.z += k.vz * dt;
            if (k.z < 0 || distToPlayer > 80) {
                removeFromArray(engine.abyssalKnights, i);
                continue;
            }
            
            const blockStandingOn = engine.world.getBlock(Math.floor(k.x), Math.floor(k.y), Math.floor(k.z - 0.01));
            if (isSolid(blockStandingOn)) {
                k.z = Math.floor(k.z - 0.01) + 1;
                k.vz = 0;
            }
            
            if (k.health <= 0) {
                engine.player.addXp(100);
                engine.dropItem(k.x, k.y, k.z, { ...ITEMS['abyssal_core'] });
                removeFromArray(engine.abyssalKnights, i);
            }
        }
    }
}
