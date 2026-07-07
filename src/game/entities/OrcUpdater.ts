import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { QuestSystem } from '../systems/QuestSystem';
function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

import { isSolid } from "../World";
import { BlockType } from "../constants/BlockType";
import { ITEMS, SPELLS } from "../Inventory";
import { ZeldaAI } from "./ai/ZeldaAI";
import { Updater } from "../Updater";

export class OrcUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.orcs.length - 1; i >= 0; i--) {
            const orc = engine.orcs[i];
            
            // Check if camp still exists
            if (orc.campKey) {
                const [cx, cy, cz] = orc.campKey.split(',').map(Number);
                if (engine.world.getBlock(cx, cy, cz) === 0) { // 0 is BlockType.AIR
                    // Camp destroyed, orc dies
                    removeFromArray(engine.orcs, i);
                    continue;
                }
            }
            
            // Validate state property
            if (!orc.state) orc.state = 'WANDER';

            // ALttP Properties
            if (orc.type === 'brute') {
                orc.moveSpeed = 1.8;
                orc.chaseDist = 6.0;
                orc.stopDist = 1.8; // larger reach
                orc.attackDist = 1.8;
                orc.alertTime = 0.8; // Slow to alert
            } else if (orc.type === 'hunter') {
                orc.moveSpeed = 3.5; // fast!
                orc.chaseDist = 12.0; // spots from far
                orc.stopDist = 6.0; // stand back to shoot
                orc.attackDist = 8.0;
                orc.alertTime = 0.3; // fast to alert
            } else if (orc.type === 'shaman') {
                orc.moveSpeed = 2.0;
                orc.chaseDist = 10.0;
                orc.stopDist = 5.0; // shoot magic
                orc.attackDist = 7.0;
                orc.alertTime = 0.5;
            } else {
                orc.moveSpeed = 2.5;
                orc.chaseDist = 6.0;
                orc.stopDist = 1.2;
                orc.attackDist = 1.2;
                orc.alertTime = 0.6;
            }
            
            ZeldaAI.update(orc, engine, dt);

            if (orc.state === 'ATTACK') {
                if (orc.attackTimer === undefined || orc.attackTimer <= 0) {
                    if (orc.type === 'brute') {
                        orc.attackTimer = 1.0; // Big swing
                        orc.attackCooldown = 3.0;
                    } else if (orc.type === 'hunter') {
                        orc.attackTimer = 0.4;
                        orc.attackCooldown = 1.5;
                    } else if (orc.type === 'shaman') {
                        orc.attackTimer = 0.8;
                        orc.attackCooldown = 2.5;
                    } else {
                        orc.attackTimer = 0.6;
                        orc.attackCooldown = 2.0;
                    }
                }
                
                orc.vx = 0;
                orc.vy = 0;
                orc.attackTimer -= dt;
                
                if (orc.attackTimer <= 0) {
                    // Deal damage
                    const dx = engine.player.x - orc.x;
                    const dy = engine.player.y - orc.y;
                    const dz = engine.player.z - orc.z;
                    const dist2D = Math.sqrt(dx*dx + dy*dy);

                    if (orc.type === 'shaman') {
                        const projSpeed = 15.0;
                        const distToP = Math.sqrt(dx*dx + dy*dy);
                        const timeToHit = distToP / projSpeed;
                        const inputObj = engine.input.getMovement();
                        const pDx = engine.player.x + (inputObj.dx * 5.0 * timeToHit) - orc.x;
                        const pDy = engine.player.y + (inputObj.dy * 5.0 * timeToHit) - orc.y;
                        const angle = Math.atan2(pDy, pDx);

                        engine.projectiles.push({
                            x: orc.x,
                            y: orc.y,
                            z: orc.z + 0.5,
                            vx: Math.cos(angle) * projSpeed,
                            vy: Math.sin(angle) * projSpeed,
                            vz: 0,
                            damage: orc.damage,
                            life: 2.0,
                            maxLife: 2.0,
                            isPlayer: false,
                            damageType: 'ARCANE'
                        });
                    } else if (orc.type === 'hunter') {
                        const projSpeed = 22.0;
                        const angle = Math.atan2(dy, dx);
                        engine.projectiles.push({
                            x: orc.x, y: orc.y, z: orc.z + 0.5,
                            vx: Math.cos(angle) * projSpeed,
                            vy: Math.sin(angle) * projSpeed,
                            vz: 0,
                            damage: orc.damage,
                            life: 2.0, maxLife: 2.0,
                            isPlayer: false,
                            isArrow: true // Renders as an arrow
                        });
                    } else {
                        if (dist2D < 1.5 && Math.abs(dz) < 1.0) { // Larger hit range
                            engine.player.takeDamage(orc.damage);
                            let kb = orc.type === 'brute' ? 10.0 : 4.0; // Brute does massive knockback
                            const angle = Math.atan2(dy, dx);
                            engine.player.vx += Math.cos(angle) * kb;
                            engine.player.vy += Math.sin(angle) * kb;
                            engine.particles.push({
                                x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                text: `-${orc.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                            });
                        }
                    }
                    orc.state = 'CHASE';
                }
            }
            
            // Gravity
            orc.vz -= 20 * dt;
            
            EntitySteeringSystem.applyBoids(orc, engine, dt);
                    EntitySteeringSystem.applyDodge(orc, engine, dt);
            // Movement
            const newX = orc.x + orc.vx * dt;
            const newY = orc.y + orc.vy * dt;
            
            const currentZ = Math.floor(orc.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                // Try step up
                const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                if (!isSolid(blockAbove)) {
                    orc.z = currentZ + 1;
                    orc.x = newX;
                    orc.y = newY;
                } else {
                    // Slide along walls
                    const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(orc.y), currentZ);
                    if (!isSolid(blockX)) orc.x = newX;
                    const blockY = engine.world.getBlock(Math.floor(orc.x), Math.floor(newY), currentZ);
                    if (!isSolid(blockY)) orc.y = newY;
                }
            } else {
                orc.x = newX;
                orc.y = newY;
            }
            
            orc.z += orc.vz * dt;
            
            if (orc.z < 0) {
                removeFromArray(engine.orcs, i);
                continue;
            }
            
            // Collision with ground
            const blockStandingOn = engine.world.getBlock(Math.floor(orc.x), Math.floor(orc.y), Math.floor(orc.z - 0.01));
            if (isSolid(blockStandingOn)) {
                orc.z = Math.floor(orc.z - 0.01) + 1;
                orc.vz = 0;
            }
            

            if (orc.attackCooldown > 0) orc.attackCooldown -= dt;

            if (orc.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(orc.x, orc.y, orc.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.orcs, i);
                engine.player.addXp(Math.floor(50 * (orc.maxHealth / 80))); // More XP
                QuestSystem.onEnemyKilled(engine, 'ORC');
                
                // Loot drop
                const rand = Math.random();
                if (rand < 0.5) {
                    engine.dropItem(orc.x, orc.y, orc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                } else if (rand < 0.8) {
                    engine.dropItem(orc.x, orc.y, orc.z, { ...ITEMS['iron_ore'], quantity: Math.floor(Math.random() * 2) + 1 });
                }
                if (Math.random() < 0.15) {
                    engine.dropItem(orc.x, orc.y, orc.z, { ...ITEMS['sword_1'] });
                }
            }
        }
    }
}
