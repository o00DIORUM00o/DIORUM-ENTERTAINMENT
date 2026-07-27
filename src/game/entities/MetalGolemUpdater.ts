import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { BlockType } from '../constants/BlockType';
import { isSolid } from '../World';
import { ITEMS } from "../Inventory";

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class MetalGolemUpdater {
    static updateAll(engine: any, dt: number) {
        if (!engine.metalGolems) return;
        for (let i = engine.metalGolems.length - 1; i >= 0; i--) {
            const golem = engine.metalGolems[i];
            
            // Distance to player
            const dx = engine.player.x - golem.x;
            const dy = engine.player.y - golem.y;
            const dz = engine.player.z - golem.z;
            const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            if (distToPlayer < 10 * engine.player.getVisibilityMult()) {
                golem.state = 'ATTACK';
            } else if (distToPlayer < 20 * engine.player.getVisibilityMult()) {
                golem.state = 'CHASE';
            } else {
                golem.state = 'WANDER';
            }

            // Gravity
            golem.vz = (golem.vz || 0) - 20 * dt;
            golem.z += golem.vz * dt;
            
            const blockStandingOn = engine.world.getBlock(Math.floor(golem.x), Math.floor(golem.y), Math.floor(golem.z - 0.01));
            
            if (isSolid(blockStandingOn)) {
                golem.z = Math.floor(golem.z - 0.01) + 1;
                golem.vz = 0;
            }

            // Movement
            let speed = 0;
            if (golem.state === 'CHASE') {
                speed = 3.0;
                golem.aimAngle = Math.atan2(dy, dx);
            } else if (golem.state === 'WANDER') {
                speed = 1.0;
                if (Math.random() < 0.02) {
                    golem.aimAngle = Math.random() * Math.PI * 2;
                }
            } else if (golem.state === 'ATTACK') {
                speed = 1.0; // Moves slowly while attacking
                golem.aimAngle = Math.atan2(dy, dx);
                
                golem.attackCooldown = (golem.attackCooldown || 0) - dt;
                
                if (golem.attackCooldown <= 0 && distToPlayer < 10) {
                    golem.attackTimer = 0.5;
                    golem.attackCooldown = 3.0;
                    
                    const pSpeed = 15;
                    const timeToHit = distToPlayer / pSpeed;
                    const inputObj = engine.input.getMovement();
                    const pDx = engine.player.x + (inputObj.dx * 5.0 * timeToHit) - golem.x;
                    const pDy = engine.player.y + (inputObj.dy * 5.0 * timeToHit) - golem.y;
                    const predictiveAimAngle = Math.atan2(pDy, pDx);
                    
                    let color = '#ffffff';
                    let damageType = 'PHYSICAL';
                    
                    if (golem.type === 'RED_METAL_GOLEM') { color = '#ff0000'; damageType = 'FIRE'; }
                    else if (golem.type === 'GREEN_METAL_GOLEM') { color = '#00ff00'; damageType = 'POISON'; }
                    else if (golem.type === 'BLUE_METAL_GOLEM') { color = '#0000ff'; damageType = 'ICE'; }
                    else if (golem.type === 'YELLOW_METAL_GOLEM') { color = '#ffff00'; damageType = 'ELECTRIC'; }
                    else if (golem.type === 'ORANGE_METAL_GOLEM') { color = '#ffa500'; damageType = 'FIRE'; }
                    else if (golem.type === 'PURPLE_METAL_GOLEM') { color = '#800080'; damageType = 'ARCANE'; }
                    else if (golem.type === 'BLACK_METAL_GOLEM') { color = '#333333'; damageType = 'DARK'; }

                    engine.projectiles.push({
                        x: golem.x,
                        y: golem.y,
                        z: golem.z + 0.5,
                        vx: Math.cos(typeof predictiveAimAngle !== "undefined" ? predictiveAimAngle : golem.aimAngle) * pSpeed,
                        vy: Math.sin(typeof predictiveAimAngle !== "undefined" ? predictiveAimAngle : golem.aimAngle) * pSpeed,
                        vz: (dz / distToPlayer) * pSpeed,
                        life: 2.0,
                        damage: golem.damage,
                        isPlayer: false,
                        color: color,
                        damageType: damageType
                    });
                }
            }
            
            if (golem.attackTimer > 0) golem.attackTimer -= dt;

            golem.vx = Math.cos(golem.aimAngle || 0) * speed;
            golem.vy = Math.sin(golem.aimAngle || 0) * speed;

            EntitySteeringSystem.applyBoids(golem, engine, dt);
            EntitySteeringSystem.applyDodge(golem, engine, dt);

            golem.x += golem.vx * dt;
            golem.y += golem.vy * dt;

            // Simple collision with blocks
            if (isSolid(engine.world.getBlock(Math.floor(golem.x), Math.floor(golem.y), Math.floor(golem.z)))) {
                golem.x -= golem.vx * dt;
                golem.y -= golem.vy * dt;
                golem.aimAngle = (golem.aimAngle || 0) + Math.PI; // Turn around
            }

            if (golem.health <= 0) {
                // Drops metal bars
                const metalPrefix = golem.type.split('_')[0].toLowerCase();
                const ingotId = `${metalPrefix}_metal_ingot`;
                engine.dropItem(golem.x, golem.y, golem.z, { ...ITEMS[ingotId], quantity: Math.floor(Math.random() * 5) + 3 });
                engine.dropItem(golem.x, golem.y, golem.z, { ...ITEMS['stone'], quantity: Math.floor(Math.random() * 10) + 5 });
                
                removeFromArray(engine.metalGolems, i);
                engine.player.addXp(500);
            }
        }
    }
}
