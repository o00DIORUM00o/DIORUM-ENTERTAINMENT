import { BlockType } from '../constants/BlockType';
import { ITEMS } from '../Inventory';
import { removeFromArray } from '../Updater';
import { isSolid } from '../World';

export class DroppedItemSystem {
    static update(engine: any, dt: number) {
        // Update dropped items
        for (let i = engine.droppedItems.length - 1; i >= 0; i--) {
            const item = engine.droppedItems[i];
            item.life -= dt;
            if (item.life <= 0) {
                removeFromArray(engine.droppedItems, i);
                continue;
            }

            item.vz -= 30.0 * dt; // gravity
            item.x += item.vx * dt;
            item.y += item.vy * dt;
            item.z += item.vz * dt;

            const bX = Math.floor(item.x);
            const bY = Math.floor(item.y);
            const bZ = Math.floor(item.z);
            const block = engine.world.getBlock(bX, bY, bZ);
            const blockBelow = engine.world.getBlock(bX, bY, bZ - 1);
            
            if (isSolid(block)) {
                item.z = bZ + 1;
                item.vz = 0;
                item.vx *= 0.8;
                item.vy *= 0.8;
            } else if (isSolid(blockBelow) && item.z - bZ < 0.1 && item.vz < 0) {
                item.z = bZ;
                item.vz = 0;
                item.vx *= 0.8;
                item.vy *= 0.8;

                if (blockBelow === BlockType.CONVEYOR_BELT_N) { item.y -= 1.5 * dt; item.vy = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_S) { item.y += 1.5 * dt; item.vy = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_W) { item.x -= 1.5 * dt; item.vx = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_E) { item.x += 1.5 * dt; item.vx = 0; }

                // Auto-Hopper Logic: When over an AUTO_DROPPER or AUTO_CRAFTER, maybe it gets sucked in.
                // We'll add vacuum hopper logic here too
                if (blockBelow === BlockType.VACUUM_HOPPER) {
                    const chestKey = `${bX},${bY},${bZ - 1}`;
                    const inv = engine.world.chestInventories.get(chestKey);
                    if (inv) {
                        // Suck item in and destroy entity
                        let remaining = item.item.quantity || 1;
                        for (const slot of inv) {
                            if (slot && slot.id === item.item.id) {
                                const max = ITEMS[item.item.id]?.maxStack || 64;
                                const space = max - (slot.quantity || 1);
                                if (space > 0) {
                                    const add = Math.min(space, remaining);
                                    slot.quantity += add;
                                    remaining -= add;
                                    if (remaining <= 0) break;
                                }
                            }
                        }
                        if (remaining > 0) {
                            for (let idx = 0; idx < inv.length; idx++) {
                                if (!inv[idx]) {
                                    inv[idx] = { ...item.item, quantity: remaining };
                                    remaining = 0;
                                    break;
                                }
                            }
                        }
                        
                        if (remaining <= 0) {
                            // fully sucked
                            removeFromArray(engine.droppedItems, i);
                            continue;
                        } else {
                            item.item.quantity = remaining;
                        }
                    }
                }
            }

            // Player pickup
            const dx = item.x - engine.player.x;
            const dy = item.y - engine.player.y;
            const dz = item.z - engine.player.z;
            if (dx*dx + dy*dy + dz*dz < 2.0) {
                if (engine.player.hasFavoredDeity('FIDIRI') && Math.random() < 0.2) {
                    item.item.quantity = (item.item.quantity || 1) * 2;
                }
                if (engine.player.addToInventory({ ...item.item })) {
                    removeFromArray(engine.droppedItems, i);
                    engine.particles.push({
                        x: engine.player.x,
                        y: engine.player.y,
                        z: engine.player.z + 1,
                        text: `+${item.item.name}`,
                        color: '#fbbf24',
                        life: 1.5,
                        maxLife: 1.5,
                        vy: -1
                    });
                }
            }
        }
    }
}
