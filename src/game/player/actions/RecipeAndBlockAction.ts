import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class RecipeAndBlockAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.id === 'wooden_staircase_recipe_scroll') {
                    if ((player.talents['carpentry'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('wooden_staircase')) {
                            player.learnedRecipes.push('wooden_staircase');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'wooden_boomerang_recipe_scroll') {
                    if ((player.talents['carpentry'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('wooden_boomerang')) {
                            player.learnedRecipes.push('wooden_boomerang');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'shrine_recipe_scroll') {
                    if ((player.talents['masonry'] || 0) >= 2) {
                        if (!player.learnedRecipes.includes('shrine')) {
                            player.learnedRecipes.push('shrine');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'furnace_recipe_scroll') {
                    if ((player.talents['masonry'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('furnace')) {
                            player.learnedRecipes.push('furnace');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'anvil_recipe_scroll') {
                    if ((player.talents['smithing'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('anvil')) {
                            player.learnedRecipes.push('anvil');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'dungeon_blocks_recipe_scroll') {
                    if ((player.talents['masonry'] || 0) >= 2 && (player.talents['smithing'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('spike_floor')) {
                            player.learnedRecipes.push('spike_floor');
                            player.learnedRecipes.push('pressure_plate');
                            player.learnedRecipes.push('lever');
                            player.learnedRecipes.push('castle_stone');
                            player.learnedRecipes.push('iron_block');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'storage_chest_recipe_scroll') {
                    if ((player.talents['carpentry'] || 0) >= 1) {
                        if (!player.learnedRecipes.includes('storage_chest')) {
                            player.learnedRecipes.push('storage_chest');
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                } else if (item.id === 'campfire_recipe_scroll') {
                    if (!player.learnedRecipes.includes('campfire')) {
                        player.learnedRecipes.push('campfire');
                        
                        // Consume item
                        if (item.quantity && item.quantity > 1) {
                            item.quantity--;
                        } else {
                            player.quickSlots[slotIndex] = null;
                            for (let i = 0; i < player.inventory.length; i++) {
                                if (player.inventory[i] === item) {
                                    player.inventory[i] = null;
                                    break;
                                }
                            }
                        }
                        return true;
                    }
                } else if (item.id === 'wooden_staircase') {
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    let placeZ = pZ;
                    let blockToDestroy = BlockType.AIR;
                    if (slotIndex === 1) {
                        placeZ = pZ - 1;
                        blockToDestroy = world.getBlock(targetX, targetY, placeZ);
                    }
                    
                    const currentBlock = world.getBlock(targetX, targetY, placeZ);
                    // We can place if it's air, or if we are digging down and it's destructible
                    let canPlace = currentBlock === BlockType.AIR;
                    
                    if (slotIndex === 1 && currentBlock !== BlockType.AIR && currentBlock !== BlockType.WATER && currentBlock !== BlockType.LAVA && currentBlock !== BlockType.SLIME_PUDDLE && currentBlock !== BlockType.SPIDER_WEB && currentBlock !== BlockType.DEMON_PORTAL) {
                        canPlace = true;
                    }

                    if (canPlace) {
                        if (slotIndex === 1 && currentBlock !== BlockType.AIR) {
                            // Drop item if destructible
                            if (onDropItem) {
                                if (currentBlock === BlockType.TENT || currentBlock === BlockType.GOBLIN_CAMP || currentBlock === BlockType.GOBLIN_SHAMAN_TENT || currentBlock === BlockType.ORC_TENT) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['tent'] });
                                } else if (currentBlock === BlockType.WOOD_WALL) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['wood'] });
                                } else if (currentBlock === BlockType.STONE || currentBlock === BlockType.GRAVESTONE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['stone'] });
                                } else if (currentBlock === BlockType.COPPER_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['copper_ore'] });
                                } else if (currentBlock === BlockType.IRON_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['iron_ore'] });
                                } else if (currentBlock === BlockType.GREEN_METAL_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['green_metal_ore'] });
                                } else if (currentBlock === BlockType.RED_METAL_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['red_metal_ore'] });
                                } else if (currentBlock === BlockType.MITHRIL_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['mithril_ore'] });
                                } else if (currentBlock === BlockType.COAL_ORE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['coal'] });
                                } else if (currentBlock === BlockType.CAMPFIRE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['campfire'] });
                                } else if (currentBlock >= BlockType.VILLAGE_BELL && currentBlock <= BlockType.BLACK_BELL) {
                                    const bellIds = {
                                        [BlockType.VILLAGE_BELL]: 'village_bell',
                                        [BlockType.COPPER_BELL]: 'copper_bell',
                                        [BlockType.IRON_BELL]: 'iron_bell',
                                        [BlockType.GREEN_BELL]: 'green_bell',
                                        [BlockType.RED_BELL]: 'red_bell',
                                        [BlockType.MITHRIL_BELL]: 'mithril_bell',
                                        [BlockType.BLACK_BELL]: 'black_bell'
                                    };
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS[bellIds[currentBlock] as keyof typeof ITEMS] });
                                } else if (currentBlock === BlockType.ALCHEMY_TABLE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['alchemy_table'] });
                                } else if (currentBlock === BlockType.COOKING_POT) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['cooking_pot'] });
                                } else if (currentBlock === BlockType.CARPENTERS_BENCH) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['carpenters_bench'] });
                                } else if (currentBlock === BlockType.WOODEN_STAIRCASE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['wooden_staircase'] });
                                } else if (currentBlock === BlockType.TORCH) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['torch'] });
                                } else if (currentBlock === BlockType.CRYSTAL) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['crystal_shard'], quantity: Math.floor(Math.random() * 3) + 1 });
                                } else if (currentBlock === BlockType.MUSHROOM_STEM || currentBlock === BlockType.MUSHROOM_CAP) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['mushroom'] });
                                } else if (currentBlock === BlockType.BEE_HIVE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['bee_hive'] });
                                } else if (currentBlock === BlockType.BONE_PILE_SPAWNER) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['bone'], quantity: 5 });
                                } else if (currentBlock === BlockType.TRUNK) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['wood'], quantity: Math.floor(Math.random() * 3) + 1 });
                                }
                            }
                        }
                        
                        world.setBlock(targetX, targetY, placeZ, BlockType.WOODEN_STAIRCASE);
                        
                        // Consume item
                        if (item.quantity && item.quantity > 1) {
                            item.quantity--;
                        } else {
                            player.quickSlots[slotIndex] = null;
                            for (let i = 0; i < player.inventory.length; i++) {
                                if (player.inventory[i] === item) {
                                    player.inventory[i] = null;
                                    break;
                                }
                            }
                        }
                        return true;
                    }
                } else if (item.id === 'carrot_seed') {
                    const pZ = Math.floor(player.z);
                    for (let dist = 0.25; dist <= 1.75; dist += 0.5) {
                        const targetX = Math.floor(player.x + Math.cos(player.aimAngle) * dist);
                        const targetY = Math.floor(player.y + Math.sin(player.aimAngle) * dist);
                        
                        const blockBelow = world.getBlock(targetX, targetY, pZ - 1);
                        const blockAt = world.getBlock(targetX, targetY, pZ);
                        
                        if ((blockBelow === BlockType.TILLED_SOIL_DRY || blockBelow === BlockType.TILLED_SOIL_WET) && blockAt === BlockType.AIR) {
                            
                            world.setBlock(targetX, targetY, pZ, BlockType.CROP_STAGE_1);
                            const key = `${targetX},${targetY},${pZ}`;
                            world.respawningBlocks.set(key, { type: BlockType.CROP_STAGE_2, timer: 60.0 });
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            if (player.onMessage) player.onMessage("Planted Carrot Seed");
                            return true;
                        }
                    }
                } else if (item.id === 'red_berry_seed' || item.id === 'blue_berry_seed' || item.id === 'black_berry_seed' || item.id === 'yellow_berry_seed' || item.id === 'weed_seed') {
                    const pZ = Math.floor(player.z);
                    for (let dist = 0.25; dist <= 1.75; dist += 0.5) {
                        const targetX = Math.floor(player.x + Math.cos(player.aimAngle) * dist);
                        const targetY = Math.floor(player.y + Math.sin(player.aimAngle) * dist);
                        
                        const blockBelow = world.getBlock(targetX, targetY, pZ - 1);
                        const blockAt = world.getBlock(targetX, targetY, pZ);
                        
                        if (blockBelow === BlockType.SOIL && blockAt === BlockType.AIR) {
                            let seedlingType = BlockType.SEEDLING_RED;
                            let matureType = BlockType.RED_BERRY_BUSH;
                            if (item.id === 'blue_berry_seed') { seedlingType = BlockType.SEEDLING_BLUE; matureType = BlockType.BLUE_BERRY_BUSH; }
                            if (item.id === 'black_berry_seed') { seedlingType = BlockType.SEEDLING_BLACK; matureType = BlockType.BLACK_BERRY_BUSH; }
                            if (item.id === 'yellow_berry_seed') { seedlingType = BlockType.SEEDLING_YELLOW; matureType = BlockType.YELLOW_BERRY_BUSH; }
                            if (item.id === 'weed_seed') { seedlingType = BlockType.SEEDLING_YELLOW; matureType = BlockType.WEED; }
                            
                            world.setBlock(targetX, targetY, pZ, seedlingType);
                            const key = `${targetX},${targetY},${pZ}`;
                            // 120 seconds to grow
                            world.respawningBlocks.set(key, { type: matureType, timer: 120.0 });
                            
                            // Consume item
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                                } else if (ITEM_TO_BLOCK.hasOwnProperty(item.id)) {
                    // Place block
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (world.getBlock(targetX, targetY, pZ) === BlockType.AIR) {
                        let blockToPlace = ITEM_TO_BLOCK[item.id];
                        
                        if (item.id === 'conveyor_belt') {
                            let angle = player.aimAngle;
                            while (angle < -Math.PI) angle += Math.PI * 2;
                            while (angle > Math.PI) angle -= Math.PI * 2;
                            
                            if (angle >= -Math.PI/4 && angle < Math.PI/4) blockToPlace = BlockType.CONVEYOR_BELT_E;
                            else if (angle >= Math.PI/4 && angle < 3*Math.PI/4) blockToPlace = BlockType.CONVEYOR_BELT_S;
                            else if (angle >= -3*Math.PI/4 && angle < -Math.PI/4) blockToPlace = BlockType.CONVEYOR_BELT_N;
                            else blockToPlace = BlockType.CONVEYOR_BELT_W;
                        }

                        world.setBlock(targetX, targetY, pZ, blockToPlace);
                        if (item.id === 'storage_chest') {
                            world.setChest(targetX, targetY, pZ, item.chestInventory || new Array(80).fill(null));
                        }
                        
                        // Consume item
                        if (item.quantity && item.quantity > 1) {
                            item.quantity--;
                        } else {
                            player.quickSlots[slotIndex] = null;
                            // Also remove from inventory if it's the same reference
                            for (let i = 0; i < player.inventory.length; i++) {
                                if (player.inventory[i] === item) {
                                    player.inventory[i] = null;
                                    break;
                                }
                            }
                        }
                        return true;
                    }
                }
        
        return false;
    }
}