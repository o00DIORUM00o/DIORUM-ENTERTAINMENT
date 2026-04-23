import { isSolid } from "../World";
import { BlockType } from "../constants/BlockType";
import { ZeldaAI } from "./ai/ZeldaAI";

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class ArcherUpdater {
    static updateAll(engine: any, dt: number) {
        for (let i = engine.archers.length - 1; i >= 0; i--) {
            const archer = engine.archers[i];
            
            // Check if spawner tent still exists
            if (archer.spawnerKey) {
                const [cx, cy, cz] = archer.spawnerKey.split(',').map(Number);
                if (engine.world.getBlock(cx, cy, cz) !== BlockType.ARCHER_TENT) {
                    removeFromArray(engine.archers, i);
                    continue;
                }
            }
            
            if (!archer.state) archer.state = 'WANDER';

            archer.moveSpeed = 3.0; 
            archer.chaseDist = 12.0;
            archer.stopDist = 6.0; 
            archer.attackDist = 8.0;
            archer.alertTime = 0.3;
            
            ZeldaAI.update(archer, engine, dt);

            if (archer.state === 'ATTACK') {
                if (archer.attackTimer === undefined || archer.attackTimer <= 0) {
                    archer.attackTimer = 0.4;
                    archer.attackCooldown = 2.0;

                    const dx = engine.player.x - archer.x;
                    const dy = engine.player.y - archer.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const shootVx = (dx / len) * 15;
                    const shootVy = (dy / len) * 15;
                    
                    engine.projectiles.push({
                        x: archer.x,
                        y: archer.y,
                        z: archer.z + 1.0,
                        vx: shootVx,
                        vy: shootVy,
                        damage: archer.damage,
                        life: 2.0,
                        type: 'ARROW',
                        ownerZ: archer.z
                    });
                }
            }
        }
    }
}
