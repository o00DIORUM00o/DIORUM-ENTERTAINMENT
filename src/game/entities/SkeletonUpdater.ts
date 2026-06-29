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
import { ZeldaAI } from "./ai/ZeldaAI";

export class SkeletonUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.skeletons.length - 1; i >= 0; i--) {
            const skel = engine.skeletons[i];
            
            // Check if spawner still exists
            if (skel.spawnerKey) {
                const [cx, cy, cz] = skel.spawnerKey.split(',').map(Number);
                if (engine.world.getBlock(cx, cy, cz) !== BlockType.BONE_PILE_SPAWNER) {
                    // Spawner destroyed, skeleton dies
                    removeFromArray(engine.skeletons, i);
                    continue;
                }
            }
            
            // Gravity
            skel.vz -= 20 * dt;
            
            // Movement
            EntitySteeringSystem.applyBoids(skel, engine, dt);
                    EntitySteeringSystem.applyDodge(skel, engine, dt);
            skel.x += skel.vx * dt;
            skel.y += skel.vy * dt;
            skel.z += skel.vz * dt;
            
            // Floor collision
            const blockStandingOn = engine.world.getBlock(Math.floor(skel.x), Math.floor(skel.y), Math.floor(skel.z - 0.01));
            if (isSolid(blockStandingOn)) {
                skel.z = Math.floor(skel.z - 0.01) + 1;
                skel.vz = 0;
            }
            
            // Wall collision
            const block = engine.world.getBlock(Math.floor(skel.x), Math.floor(skel.y), Math.floor(skel.z));
            if (isSolid(block)) {
                skel.x -= skel.vx * dt;
                skel.y -= skel.vy * dt;
                skel.vx = 0;
                skel.vy = 0;
            }
            
            // ALttP Properties based on type
            const isArcher = skel.type === 'ARCHER';
            // Validate state property
            if (!skel.state) skel.state = 'WANDER';

            skel.moveSpeed = isArcher ? 2.0 : 2.5;
            skel.chaseDist = 15.0;
            skel.stopDist = isArcher ? 4.0 : 1.2;
            skel.attackDist = isArcher ? 8.0 : 1.5;
            skel.alertTime = 0.5;

            // Trigger evades for Archers when player gets too close!
            const dx = engine.player.x - skel.x;
            const dy = engine.player.y - skel.y;
            const dist2D = Math.sqrt(dx*dx + dy*dy);

            if (isArcher && dist2D < 3.0 && skel.state !== 'EVADE' && skel.state !== 'FLEE' && skel.state !== 'ATTACK') {
                skel.state = 'EVADE';
                skel.stateTimer = 0.6; // Dodge out of the way for a moment!
            }
            
            ZeldaAI.update(skel, engine, dt);

            if (skel.state === 'ATTACK') {
                if (skel.attackTimer === undefined || skel.attackTimer <= 0) {
                    skel.attackTimer = isArcher ? 0.8 : 0.6;
                    skel.attackCooldown = isArcher ? 2.5 : 1.5;
                }
                
                skel.vx = 0;
                skel.vy = 0;
                skel.attackTimer -= dt;
                
                if (skel.attackTimer <= 0) {
                    // Execute Attack
                    if (isArcher) {
                        // Shoot bone projectile
                        const pSpeed = 10;
                        const distToP = Math.sqrt(Math.pow(engine.player.x - skel.x, 2) + Math.pow(engine.player.y - skel.y, 2));
                        const timeToHit = distToP / pSpeed;
                        const inputObj = engine.input.getMovement();
                        const pDx = engine.player.x + (inputObj.dx * 5.0 * timeToHit) - skel.x;
                        const pDy = engine.player.y + (inputObj.dy * 5.0 * timeToHit) - skel.y;
                        const predictiveAimAngle = Math.atan2(pDy, pDx);

                        engine.projectiles.push({
                            x: skel.x, y: skel.y, z: skel.z + 0.5,
                            vx: Math.cos(predictiveAimAngle) * pSpeed,
                            vy: Math.sin(predictiveAimAngle) * pSpeed,
                            vz: 0,
                            damage: skel.damage,
                            life: 2.0, maxLife: 2.0,
                            isPlayer: false, color: '#e2e8f0'
                        });
                    } else {
                        // SWORDSMAN Melee Hit
                        if (dist2D < 2.0 && Math.abs(engine.player.z - skel.z) < 1.0) {
                            engine.player.takeDamage(skel.damage);
                            engine.particles.push({
                                x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                text: `-${skel.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                            });
                        }
                    }
                }
            }

            if (skel.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(skel.x, skel.y, skel.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.skeletons, i);
                QuestSystem.onEnemyKilled(engine, 'SKELETON');
                
                // Turn into remains
                engine.skeletonRemains.push({
                    x: skel.x,
                    y: skel.y,
                    z: skel.z,
                    health: skel.maxHealth / 2,
                    maxHealth: skel.maxHealth / 2,
                    reviveTimer: 10.0, // 10 seconds to revive
                    type: skel.type,
                    spawnerKey: skel.spawnerKey
                });
            }
        }
    }
}
