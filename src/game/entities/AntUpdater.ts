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

export class AntUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.ants.length - 1; i >= 0; i--) {
            const ant = engine.ants[i];
            
            // Distance to player
            const dx = engine.player.x - ant.x;
            const dy = engine.player.y - ant.y;
            const distToPlayer = Math.sqrt(dx*dx + dy*dy);
            
            // AI Logic
            if (distToPlayer < 15 * engine.player.getVisibilityMult()) {
                // Chase player
                ant.aimAngle = Math.atan2(dy, dx);
                if (distToPlayer > ant.attackRange * 0.8) {
                    ant.vx = Math.cos(ant.aimAngle) * ant.speed;
                    ant.vy = Math.sin(ant.aimAngle) * ant.speed;
                } else {
                    ant.vx = 0;
                    ant.vy = 0;
                }
                
                // Attack
                if (ant.attackTimer > 0) ant.attackTimer -= dt;
                if (distToPlayer <= ant.attackRange && ant.attackTimer <= 0) {
                    engine.player.takeDamage(ant.damage);
                    ant.attackTimer = ant.attackCooldown;
                    
                    engine.particles.push({
                        x: engine.player.x,
                        y: engine.player.y,
                        z: engine.player.z + 1,
                        text: `-${ant.damage}`,
                        color: '#ff0000',
                        life: 1.0,
                        maxLife: 1.0,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        vz: 2
                    });
                }
            } else {
                // Wander
                if (Math.random() < 0.02) {
                    ant.aimAngle = Math.random() * Math.PI * 2;
                }
                ant.vx = Math.cos(ant.aimAngle) * ant.speed * 0.5;
                ant.vy = Math.sin(ant.aimAngle) * ant.speed * 0.5;
            }
            
            // Gravity
            ant.vz -= 20 * dt;

            Updater.applyBoids(ant, engine, dt);
                    Updater.applyDodge(ant, engine, dt);
            // Movement
            const newX = ant.x + ant.vx * dt;
            const newY = ant.y + ant.vy * dt;
            
            const currentZ = Math.floor(ant.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                // Try step up
                const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                if (!isSolid(blockAbove)) {
                    ant.z = currentZ + 1;
                    ant.x = newX;
                    ant.y = newY;
                } else {
                    // Slide along walls
                    const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(ant.y), currentZ);
                    if (!isSolid(blockX)) ant.x = newX;
                    const blockY = engine.world.getBlock(Math.floor(ant.x), Math.floor(newY), currentZ);
                    if (!isSolid(blockY)) ant.y = newY;
                }
            } else {
                ant.x = newX;
                ant.y = newY;
            }
            
            ant.z += ant.vz * dt;
            
            if (ant.z < 0) {
                removeFromArray(engine.ants, i);
                continue;
            }
            
            // Collision with ground
            const blockStandingOn = engine.world.getBlock(Math.floor(ant.x), Math.floor(ant.y), Math.floor(ant.z - 0.01));
            if (isSolid(blockStandingOn)) {
                ant.z = Math.floor(ant.z - 0.01) + 1;
                ant.vz = 0;
            }
            
            // Death
            if (ant.hp <= 0) {
                engine.player.addXp(20);
                removeFromArray(engine.ants, i);
            }
        }
    }
}
