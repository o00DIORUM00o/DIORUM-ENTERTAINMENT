import { isSolid } from "../World";
import { BlockType } from "../constants/BlockType";
import { ZeldaAI } from "./ai/ZeldaAI";
import { TILE_SIZE } from "../Constants";

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class DarkKnightUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.darkKnights.length - 1; i >= 0; i--) {
            const knight = engine.darkKnights[i];
            
            // Check if spawner still exists
            if (knight.spawnerKey) {
                const [cx, cy, cz] = knight.spawnerKey.split(',').map(Number);
                if (engine.world.getBlock(cx, cy, cz) !== BlockType.DARK_KNIGHT_TENT) {
                    removeFromArray(engine.darkKnights, i);
                    continue;
                }
            }
            
            if (!knight.state) {
                knight.state = 'WANDER';
                knight.stateTimer = 0;
            }

            const dx = engine.player.x - knight.x;
            const dy = engine.player.y - knight.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Handle custom state machine for Zelda ALttP dark knight logic
            if (knight.stateTimer > 0) knight.stateTimer -= dt;

            // Collision check flags
            let hitWall = false;

            if (knight.state === 'WANDER') {
                knight.moveSpeed = 1.5;
                knight.chaseDist = 0; // We are handling the transition to AIM manually
                knight.stopDist = 0;
                knight.attackDist = 0;
                
                // Fallback wander via ZeldaAI for simple wandering
                ZeldaAI.update(knight, engine, dt);

                if (dist < 8.0 && Math.abs(engine.player.z - knight.z) < 2) {
                    // Line of sight check? We can just trigger AIM
                    knight.state = 'AIM';
                    knight.stateTimer = 0.8; // Time spent aiming/drawing sword
                    knight.vx = 0;
                    knight.vy = 0;
                    knight.aimAngle = Math.atan2(dy, dx);
                    
                    // Add an exclamation mark!
                    engine.particles.push({
                        x: knight.x, y: knight.y, z: knight.z + 1.2,
                        text: '!', color: '#ff0000',
                        life: 0.5, maxLife: 0.5, vx: 0, vy: 0.5, vz: 0, speed: 0
                    });
                }
            } else if (knight.state === 'AIM') {
                knight.vx = 0;
                knight.vy = 0;
                // constantly track player
                knight.aimAngle = Math.atan2(dy, dx);
                
                if (knight.stateTimer <= 0) {
                    knight.state = 'CHARGE';
                    knight.stateTimer = 1.2; // How long to charge at max
                    
                    // Set high charge velocity
                    const chargeSpeed = 8.0;
                    knight.vx = Math.cos(knight.aimAngle) * chargeSpeed;
                    knight.vy = Math.sin(knight.aimAngle) * chargeSpeed;
                    
                    // Sword swoosh sound/effect
                }
            } else if (knight.state === 'CHARGE') {
                // Moving forward fast
                const nextX = knight.x + knight.vx * dt;
                const nextY = knight.y + knight.vy * dt;
                const pz = Math.floor(knight.z);

                if (!engine.world.isSolid(Math.floor(nextX), Math.floor(knight.y), pz) &&
                    !engine.world.isSolid(Math.floor(nextX), Math.floor(knight.y), pz + 1)) {
                    knight.x = nextX;
                } else {
                    hitWall = true;
                    // Clang effect
                    engine.particles.push({
                        x: knight.x, y: knight.y, z: knight.z + 0.5,
                        text: 'CLANG', color: '#aaaaaa',
                        life: 0.4, maxLife: 0.4, vx: 0, vy: 0, vz: 1, speed: 0
                    });
                }

                if (!engine.world.isSolid(Math.floor(knight.x), Math.floor(nextY), pz) &&
                    !engine.world.isSolid(Math.floor(knight.x), Math.floor(nextY), pz + 1)) {
                    knight.y = nextY;
                } else {
                    hitWall = true;
                }

                // Check player collision during charge
                if (dist < 1.2 && Math.abs(engine.player.z - knight.z) < 2) {
                    // Hit player!
                    engine.player.health -= knight.damage;
                    engine.events.emit('HUD_UPDATE');
                    // Knockback player
                    engine.player.vx += Math.cos(knight.aimAngle) * 5;
                    engine.player.vy += Math.sin(knight.aimAngle) * 5;
                    
                    hitWall = true; // Stop charging
                }

                if (hitWall || knight.stateTimer <= 0) {
                    knight.state = 'RECOVER';
                    knight.stateTimer = 1.0;
                    knight.vx = 0;
                    knight.vy = 0;
                }
            } else if (knight.state === 'RECOVER') {
                knight.vx = 0;
                knight.vy = 0;
                if (knight.stateTimer <= 0) {
                    knight.state = 'WANDER';
                }
            }

            // Gravity
            knight.vz -= 20.0 * dt;
            let nextZ = knight.z + knight.vz * dt;

            // Floor collision
            if (engine.world.isSolid(Math.floor(knight.x), Math.floor(knight.y), Math.floor(nextZ))) {
                knight.z = Math.floor(nextZ) + 1;
                knight.vz = 0;
            } else {
                knight.z = nextZ;
            }
        }
    }
}
