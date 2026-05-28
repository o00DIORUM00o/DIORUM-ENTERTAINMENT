import { isIndestructible } from '../World';
import { BlockType } from '../constants/BlockType';
import { RecipeRegistry } from '../registries/RecipeRegistry';
import { ITEMS } from '../Inventory';

export class AutomationSystem {
    static update(engine: any, dt: number) {
        // Conveyor Belts
        for (const item of engine.droppedItems) {
            const bx = Math.floor(item.x);
            const by = Math.floor(item.y);
            const bz = Math.floor(item.z - 0.1);
            const block = engine.world.getBlock(bx, by, bz);
            
            const speed = 3.0;
            if (block === BlockType.CONVEYOR_BELT_N) {
                item.vy = -speed;
                item.vx = 0;
            } else if (block === BlockType.CONVEYOR_BELT_S) {
                item.vy = speed;
                item.vx = 0;
            } else if (block === BlockType.CONVEYOR_BELT_E) {
                item.vx = speed;
                item.vy = 0;
            } else if (block === BlockType.CONVEYOR_BELT_W) {
                item.vx = -speed;
                item.vy = 0;
            }
        }

        // Auto Miner and Auto Dropper (1 tick per second)
        engine.automationTimer += dt;
        if (engine.automationTimer >= 1.0) {
            engine.automationTimer = 0;
            
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.automation || chunk.automation.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                const activeAuto = Array.from(chunk.automation as Set<number>);
                for (const idx of activeAuto) {
                    const block = chunk.blocks[idx as number];
                    const x = wx + ((idx as number) % 16);
                    const y = wy + (Math.floor((idx as number) / 16) % 16);
                    const z = Math.floor((idx as number) / 256);
                    
                    if (block === BlockType.AUTO_MINER) {
                            const targetZ = z - 1;
                            const targetBlock = engine.world.getBlock(x, y, targetZ);
                            if (targetBlock !== BlockType.AIR && 
                                !isIndestructible(targetBlock) && 
                                targetBlock !== BlockType.CONVEYOR_BELT_N && 
                                targetBlock !== BlockType.CONVEYOR_BELT_S && 
                                targetBlock !== BlockType.CONVEYOR_BELT_E && 
                                targetBlock !== BlockType.CONVEYOR_BELT_W && 
                                targetBlock !== BlockType.AUTO_MINER && 
                                targetBlock !== BlockType.AUTO_DROPPER && 
                                targetBlock !== BlockType.CHEST) {
                                const key = `${x},${y},${targetZ}`;
                                let hp = engine.world.blockHealth.get(key) ?? 50;
                                hp -= 25; // 25 damage per second
                                
                                if (hp <= 0) {
                                    engine.breakBlock(x, y, targetZ, targetBlock, true);
                                } else {
                                    engine.world.blockHealth.set(key, hp);
                                }
                            }
                        } else if (block === BlockType.AUTO_DROPPER) {
                            // Check adjacent blocks for chest
                            const adjacents = [
                                {dx: 1, dy: 0, dz: 0}, {dx: -1, dy: 0, dz: 0},
                                {dx: 0, dy: 1, dz: 0}, {dx: 0, dy: -1, dz: 0},
                                {dx: 0, dy: 0, dz: -1}, {dx: 0, dy: 0, dz: 1}
                            ];
                            
                            for (const adj of adjacents) {
                                const cx = x + adj.dx;
                                const cy = y + adj.dy;
                                const cz = z + adj.dz;
                                if (engine.world.getBlock(cx, cy, cz) === BlockType.CHEST) {
                                    const chestInv = engine.world.getChest(cx, cy, cz);
                                    if (chestInv) {
                                        // Find first item
                                        let foundItem = false;
                                        for (let i = 0; i < chestInv.length; i++) {
                                            if (chestInv[i]) {
                                                const item = chestInv[i];
                                                // Drop 1 of this item
                                                const dropItem = { ...item };
                                                if (dropItem.quantity) dropItem.quantity = 1;
                                                
                                                // Drop it above the dropper
                                                engine.dropItem(x + 0.5, y + 0.5, z + 1.5, dropItem);
                                                
                                                if (item.quantity && item.quantity > 1) {
                                                    item.quantity--;
                                                } else {
                                                    chestInv[i] = null;
                                                }
                                                
                                                engine.world.setChest(cx, cy, cz, chestInv);
                                                foundItem = true;
                                                break; // Only drop 1 item per second
                                            }
                                        }
                                        if (foundItem) break; // Only process one chest per second
                                    }
                                }
                            }
                        } else if (block === BlockType.AUTO_CRAFTER) {
                            // Check adjacent blocks for chest
                            const adjacents = [
                                {dx: 1, dy: 0, dz: 0}, {dx: -1, dy: 0, dz: 0},
                                {dx: 0, dy: 1, dz: 0}, {dx: 0, dy: -1, dz: 0},
                                {dx: 0, dy: 0, dz: -1}, {dx: 0, dy: 0, dz: 1}
                            ];
                            
                            for (const adj of adjacents) {
                                const cx = x + adj.dx;
                                const cy = y + adj.dy;
                                const cz = z + adj.dz;
                                if (engine.world.getBlock(cx, cy, cz) === BlockType.CHEST) {
                                    const chestInv = engine.world.getChest(cx, cy, cz);
                                    if (chestInv) {
                                        let crafted = false;
                                        
                                        // Try all recipes
                                        for (const recipe of RecipeRegistry.getAll()) {
                                            // Check if we have ingredients
                                            let hasIngredients = true;
                                            const ingredientsToConsume: {index: number, quantity: number}[] = [];
                                            
                                            // Create a temporary copy of chest inventory to check quantities
                                            const tempInv = chestInv.map((item: any) => item ? { ...item } : null);
                                            
                                            for (const ing of recipe.ingredients) {
                                                let remainingNeeded = ing.quantity;
                                                
                                                for (let i = 0; i < tempInv.length; i++) {
                                                    const item = tempInv[i];
                                                    if (item && item.id === ing.id) {
                                                        const available = item.quantity || 1;
                                                        const toTake = Math.min(remainingNeeded, available);
                                                        
                                                        ingredientsToConsume.push({ index: i, quantity: toTake });
                                                        remainingNeeded -= toTake;
                                                        
                                                        if (item.quantity) {
                                                            item.quantity -= toTake;
                                                            if (item.quantity <= 0) tempInv[i] = null;
                                                        } else {
                                                            tempInv[i] = null;
                                                        }
                                                        
                                                        if (remainingNeeded <= 0) break;
                                                    }
                                                }
                                                
                                                if (remainingNeeded > 0) {
                                                    hasIngredients = false;
                                                    break;
                                                }
                                            }
                                            
                                            if (hasIngredients) {
                                                // Consume ingredients
                                                for (const consume of ingredientsToConsume) {
                                                    const item = chestInv[consume.index];
                                                    if (item) {
                                                        if (item.quantity) {
                                                            item.quantity -= consume.quantity;
                                                            if (item.quantity <= 0) chestInv[consume.index] = null;
                                                        } else {
                                                            chestInv[consume.index] = null;
                                                        }
                                                    }
                                                }
                                                
                                                engine.world.setChest(cx, cy, cz, chestInv);
                                                
                                                // Drop result
                                                const resultItem = { ...ITEMS[recipe.result.id] };
                                                if (recipe.result.quantity > 1) {
                                                    resultItem.quantity = recipe.result.quantity;
                                                }
                                                engine.dropItem(x + 0.5, y + 0.5, z + 1.5, resultItem);
                                                
                                                crafted = true;
                                                break; // Only craft one item per second
                                            }
                                        }
                                        
                                        if (crafted) break; // Only process one chest per second
                                    }
                                }
                            }
                        } else if (block === BlockType.VACUUM_HOPPER) {
                            // Check adjacent blocks for chest
                            const adjacents = [
                                {dx: 1, dy: 0, dz: 0}, {dx: -1, dy: 0, dz: 0},
                                {dx: 0, dy: 1, dz: 0}, {dx: 0, dy: -1, dz: 0},
                                {dx: 0, dy: 0, dz: -1}, {dx: 0, dy: 0, dz: 1}
                            ];
                            
                            for (const adj of adjacents) {
                                const cx = x + adj.dx;
                                const cy = y + adj.dy;
                                const cz = z + adj.dz;
                                if (engine.world.getBlock(cx, cy, cz) === BlockType.CHEST) {
                                    const chestInv = engine.world.getChest(cx, cy, cz);
                                    if (chestInv) {
                                        // Find dropped items within 3x3 radius
                                        for (let i = engine.droppedItems.length - 1; i >= 0; i--) {
                                            const item = engine.droppedItems[i];
                                            const dist = Math.sqrt(Math.pow(item.x - (x + 0.5), 2) + Math.pow(item.y - (y + 0.5), 2) + Math.pow(item.z - (z + 0.5), 2));
                                            
                                            if (dist < 3) {
                                                // Try to add to chest
                                                let added = false;
                                                
                                                // Try to stack first
                                                for (let j = 0; j < chestInv.length; j++) {
                                                    if (chestInv[j] && chestInv[j].id === item.item.id) {
                                                        chestInv[j].quantity = (chestInv[j].quantity || 1) + (item.item.quantity || 1);
                                                        added = true;
                                                        break;
                                                    }
                                                }
                                                
                                                // If not stacked, find empty slot
                                                if (!added) {
                                                    for (let j = 0; j < chestInv.length; j++) {
                                                        if (!chestInv[j]) {
                                                            chestInv[j] = { ...item.item };
                                                            added = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                                if (added) {
                                                    engine.droppedItems.splice(i, 1);
                                                    engine.world.setChest(cx, cy, cz, chestInv);
                                                    break; // Only suck one item per second per hopper to prevent lag
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (block === BlockType.ARCANE_TURRET) {
                            let target: any = null;
                            let minD = 12 * 12;
                            const px = x + 0.5;
                            const py = y + 0.5;
                            const pz = z + 1.2;
                            
                            engine.forEachEntity((ent: any, t: string) => {
                                if (['goblin', 'orc', 'skeleton', 'lavaGolem', 'rat', 'ant', 'abyssalKnight', 'drake', 'kobold', 'gargoyle', 'djinn', 'gremlin', 'sphinx', 'fireDragonBoss', 'observer_void', 'observer_fire', 'sand_worm', 'tricera_folk', 'raptor_folk', 'frog_folk', 'pterodactyl', 't_rex', 'raptor', 'fungi_folk', 'ogre', 'troll', 'clay_golem'].includes(t)) {
                                    if (ent.hp <= 0 && ent.health <= 0) return;
                                    const d = (ent.x - px)**2 + (ent.y - py)**2 + (ent.z - pz)**2;
                                    if (d < minD) {
                                        minD = d;
                                        target = ent;
                                    }
                                }
                            });
                            
                            if (target) {
                                const dx = target.x - px;
                                const dy = target.y - py;
                                const dz = target.z + 0.5 - pz;
                                const mag = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
                                
                                engine.projectiles.push({
                                    x: px, y: py, z: pz,
                                    vx: (dx/mag)*20, vy: (dy/mag)*20, vz: (dz/mag)*20,
                                    damage: 25, life: 2.0, isPlayer: true, color: '#f0f',
                                    damageType: 'MAGIC'
                                });
                            }
                        }
                } // activeAuto
            } // chunk entries
        } // automationTimer
    }
}
