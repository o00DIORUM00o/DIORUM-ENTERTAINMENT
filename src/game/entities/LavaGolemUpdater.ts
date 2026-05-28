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

export class LavaGolemUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.lavaGolems.length - 1; i >= 0; i--) {
            const golem = engine.lavaGolems[i];
            
            // Distance to player
            const dx = engine.player.x - golem.x;
            const dy = engine.player.y - golem.y;
            const dz = engine.player.z - golem.z;
            const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (distToPlayer < 8 * engine.player.getVisibilityMult()) {
                golem.state = 'ATTACK';
            } else if (distToPlayer < 15 * engine.player.getVisibilityMult()) {
                golem.state = 'CHASE';
            } else {
                golem.state = 'WANDER';
            }

            // Gravity
            golem.vz -= 20 * dt;
            golem.z += golem.vz * dt;

            const blockStandingOn = engine.world.getBlock(Math.floor(golem.x), Math.floor(golem.y), Math.floor(golem.z - 0.01));
            
            // Lava interactions
            if (blockStandingOn === BlockType.LAVA) {
                // Walk on lava and regenerate
                golem.z = Math.floor(golem.z - 0.01) + 1;
                golem.vz = 0;
                
                if (golem.health < golem.maxHealth) {
                    golem.health = Math.min(golem.maxHealth, golem.health + 50 * dt);
                    if (Math.random() < 0.1) {
                         engine.particles.push({x: golem.x, y: golem.y, z: golem.z + 1, text: '+', color: '#ffaaaa', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                    }
                }
            } else if (isSolid(blockStandingOn)) {
                golem.z = Math.floor(golem.z - 0.01) + 1;
                golem.vz = 0;
            }

            // Movement
            let speed = 0;
            if (golem.state === 'CHASE') {
                speed = 2.0;
                golem.aimAngle = Math.atan2(dy, dx);
            } else if (golem.state === 'WANDER') {
                speed = 0.5;
                if (Math.random() < 0.02) {
                    golem.aimAngle = Math.random() * Math.PI * 2;
                }
            } else if (golem.state === 'ATTACK') {
                speed = 0;
                golem.aimAngle = Math.atan2(dy, dx);
                
                if (golem.attackCooldown > 0) golem.attackCooldown -= dt;
                
                if (golem.attackCooldown <= 0 && distToPlayer < 8) {
                    // Throw fireball
                    golem.attackTimer = 0.5;
                    golem.attackCooldown = 3.0;

                    // Predictive fireball angle
                    const pSpeed = 10;
                    const timeToHit = distToPlayer / pSpeed;
                    const inputObj = engine.input.getMovement();
                    const pDx = engine.player.x + (inputObj.dx * 5.0 * timeToHit) - golem.x;
                    const pDy = engine.player.y + (inputObj.dy * 5.0 * timeToHit) - golem.y;
                    const predictiveAimAngle = Math.atan2(pDy, pDx);
                    engine.projectiles.push({
                        x: golem.x,
                        y: golem.y,
                        z: golem.z + 0.5,
                        vx: Math.cos(typeof predictiveAimAngle !== "undefined" ? predictiveAimAngle : golem.aimAngle) * (typeof pSpeed !== "undefined" ? pSpeed : 10),
                        vy: Math.sin(typeof predictiveAimAngle !== "undefined" ? predictiveAimAngle : golem.aimAngle) * (typeof pSpeed !== "undefined" ? pSpeed : 10),
                        vz: (dz / distToPlayer) * pSpeed,
                        life: 2.0,
                        damage: golem.damage,
                        isPlayer: false,
                        color: '#ff4500' // Orange-red fireball
                    });
                }
            }
            
            if (golem.attackTimer > 0) golem.attackTimer -= dt;

            golem.vx = Math.cos(golem.aimAngle) * speed;
            golem.vy = Math.sin(golem.aimAngle) * speed;
            EntitySteeringSystem.applyBoids(golem, engine, dt);
                    EntitySteeringSystem.applyDodge(golem, engine, dt);

            golem.x += golem.vx * dt;
            golem.y += golem.vy * dt;

            // Simple collision with blocks
            if (isSolid(engine.world.getBlock(Math.floor(golem.x), Math.floor(golem.y), Math.floor(golem.z)))) {
                golem.x -= golem.vx * dt;
                golem.y -= golem.vy * dt;
                golem.aimAngle += Math.PI; // Turn around
            }

            if (golem.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(golem.x, golem.y, golem.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                removeFromArray(engine.lavaGolems, i);
                engine.player.addXp(50);
                engine.dropItem(golem.x, golem.y, golem.z, { ...ITEMS['stone'], quantity: Math.floor(Math.random() * 5) + 3 });
                if (Math.random() < 0.5) {
                    engine.dropItem(golem.x, golem.y, golem.z, { ...ITEMS['magma_core'], quantity: 1 });
                }
            }
        }
    }
}
