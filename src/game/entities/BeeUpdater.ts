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

export class BeeUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.bees.length - 1; i >= 0; i--) {
            const bee = engine.bees[i];
            
            // Check if hive still exists
            const [hx, hy, hz] = bee.hiveKey.split(',').map(Number);
            if (engine.world.getBlock(hx, hy, hz) !== BlockType.BEE_HIVE) {
                // Hive destroyed, bee dies or flies away. Let's just kill it.
                removeFromArray(engine.bees, i);
                continue;
            }

            // Distance to player
            const dx = engine.player.x - bee.x;
            const dy = engine.player.y - bee.y;
            const dz = engine.player.z - bee.z;
            const distToPlayer = Math.sqrt(dx*dx + dy*dy + dz*dz);
            const distToHive = Math.sqrt(Math.pow(hx + 0.5 - bee.x, 2) + Math.pow(hy + 0.5 - bee.y, 2) + Math.pow(hz + 0.5 - bee.z, 2));

            if (distToPlayer < 5 * engine.player.getVisibilityMult()) {
                bee.state = 'ATTACK';
            } else if (distToPlayer > 10 * engine.player.getVisibilityMult()) {
                bee.state = 'WANDER';
            }

            if (bee.state === 'ATTACK') {
                // Fly towards player
                const speed = 6.0;
                bee.vx = (dx / distToPlayer) * speed;
                bee.vy = (dy / distToPlayer) * speed;
                bee.vz = (dz / distToPlayer) * speed;

                if (bee.attackCooldown > 0) bee.attackCooldown -= dt;

                if (distToPlayer < 0.6 && bee.attackCooldown <= 0) {
                    // Attack player
                    engine.player.takeDamage(bee.damage);
                    bee.attackCooldown = 1.0;
                    
                    engine.particles.push({
                        x: engine.player.x,
                        y: engine.player.y,
                        z: engine.player.z + 1,
                        text: '-5',
                        color: '#ef4444',
                        life: 1.0,
                        maxLife: 1.0,
                        vy: -2
                    });
                }
            } else {
                // Wander around hive
                if (Math.random() < 0.05) {
                    bee.vx += (Math.random() - 0.5) * 2;
                    bee.vy += (Math.random() - 0.5) * 2;
                    bee.vz += (Math.random() - 0.5) * 1;
                }

                // Pull back to hive if too far
                if (distToHive > 8) {
                    bee.vx += (hx + 0.5 - bee.x) * 0.1;
                    bee.vy += (hy + 0.5 - bee.y) * 0.1;
                    bee.vz += (hz + 0.5 - bee.z) * 0.1;
                }

                // Speed limit
                const speed = Math.sqrt(bee.vx*bee.vx + bee.vy*bee.vy + bee.vz*bee.vz);
                if (speed > 3) {
                    bee.vx = (bee.vx / speed) * 3;
                    bee.vy = (bee.vy / speed) * 3;
                    bee.vz = (bee.vz / speed) * 3;
                }
            }
            EntitySteeringSystem.applyBoids(bee, engine, dt);
                    EntitySteeringSystem.applyDodge(bee, engine, dt);

            bee.x += bee.vx * dt;
            bee.y += bee.vy * dt;
            bee.z += bee.vz * dt;

            // Keep above ground
            const groundZ = engine.world.getBlock(Math.floor(bee.x), Math.floor(bee.y), Math.floor(bee.z - 1)) !== BlockType.AIR ? Math.floor(bee.z) : -1;
            if (groundZ !== -1 && bee.z < groundZ + 0.5) {
                bee.z = groundZ + 0.5;
                bee.vz = Math.abs(bee.vz);
            }

            if (bee.health <= 0) {
                removeFromArray(engine.bees, i);
                engine.player.addXp(10);
                
                // Loot drop
                if (Math.random() < 0.2) {
                    engine.dropItem(bee.x, bee.y, bee.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                }
            }
        }
    }
}