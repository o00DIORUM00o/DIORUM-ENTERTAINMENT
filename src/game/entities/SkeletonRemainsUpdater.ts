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

export class SkeletonRemainsUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.skeletonRemains.length - 1; i >= 0; i--) {
            const rem = engine.skeletonRemains[i];
            
            // Check if spawner still exists
            if (rem.spawnerKey) {
                const [cx, cy, cz] = rem.spawnerKey.split(',').map(Number);
                if (engine.world.getBlock(cx, cy, cz) !== BlockType.BONE_PILE_SPAWNER) {
                    // Spawner destroyed, remains destroyed
                    removeFromArray(engine.skeletonRemains, i);
                    continue;
                }
            }
            
            rem.reviveTimer -= dt;
            
            if (rem.reviveTimer <= 0) {
                // Revive!
                removeFromArray(engine.skeletonRemains, i);
                engine.skeletons.push({
                    x: rem.x,
                    y: rem.y,
                    z: rem.z,
                    vx: 0,
                    vy: 0,
                    vz: 0,
                    health: rem.maxHealth * 2,
                    maxHealth: rem.maxHealth * 2,
                    damage: rem.maxHealth * 2 * (15/40), // Approximate damage based on health multiplier
                    type: rem.type,
                    state: 'CHASE',
                    attackCooldown: 0,
                    attackTimer: 0,
                    aimAngle: 0,
                    spawnerKey: rem.spawnerKey
                });
                
                // Revive particles
                for (let j = 0; j < 10; j++) {
                    engine.particles.push({
                        x: rem.x + (Math.random() - 0.5),
                        y: rem.y + (Math.random() - 0.5),
                        z: rem.z + Math.random(),
                        text: '',
                        color: '#e2e8f0',
                        life: 0.5,
                        maxLife: 0.5,
                        vy: Math.random() * 2
                    });
                }
            } else if (rem.health <= 0) {
                // Destroyed completely
                removeFromArray(engine.skeletonRemains, i);
                engine.player.addXp(Math.floor(40 * (rem.maxHealth / 20))); // XP for destroying remains
                
                // Loot drop
                const rand = Math.random();
                if (rand < 0.4) {
                    engine.dropItem(rem.x, rem.y, rem.z, { ...ITEMS['bone'], quantity: Math.floor(Math.random() * 3) + 1 });
                }
                if (Math.random() < 0.1) {
                    engine.dropItem(rem.x, rem.y, rem.z, { ...ITEMS['iron_piece'], quantity: 1 });
                }
            }
        }
    }
}
