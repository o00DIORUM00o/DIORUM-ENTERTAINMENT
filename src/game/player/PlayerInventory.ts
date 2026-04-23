import { audioEngine } from '../AudioEngine';
import { TALENTS } from '../Talents';
import { Player, UpdateContext } from '../Player';
import { World } from '../World';
import { BlockType } from '../constants/BlockType';
import { Item, EquipmentSlot, ITEMS } from '../Inventory';
import { RecipeRegistry } from '../registries/RecipeRegistry';

export class PlayerInventory {
    static updateQuickSlots(player: Player, ctx: UpdateContext) {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;
// Quick Slots Logic Placeholder
        if (player.quickCooldown > 0) player.quickCooldown -= dt;
        
        if (player.quickCooldown <= 0) {
            const handleQuickSlot = (slotIndex: number) => {
                const item = player.quickSlots[slotIndex];
                if (!item) return false;

                if (item.id === 'boat' || item.id === 'skyship' || item.id === 'magitech_mech' || item.id === 'gnome_buggy' || item.summonsMount) {
                    const mountId = 'vehicle_' + Date.now();
                    
                    let mountType = item.summonsMount || 'BOAT';
                    let mountName = item.name;
                    let mountSpeed = 12.0;
                    let mountJump = 0.0;
                    
                    if (item.id === 'skyship') {
                        mountType = 'SKYSHIP'; mountName = 'Gnomish Skyship'; mountSpeed = 18.0; mountJump = 15.0;
                    } else if (item.id === 'magitech_mech') {
                        mountType = 'MAGITECH_MECH'; mountName = 'Magitech Mech'; mountSpeed = 15.0; mountJump = 25.0;
                    } else if (item.id === 'gnome_buggy') {
                        mountType = 'GNOME_BUGGY'; mountName = 'Gnome Buggy'; mountSpeed = 22.0; mountJump = 8.0;
                    } else if (item.summonsMount === 'FIRE_DRAGON') {
                        mountSpeed = 16.0; mountJump = 20.0; mountName = 'Fire Dragon';
                    }
                    
                    const mount = {
                        id: mountId,
                        type: mountType,
                        name: mountName,
                        speed: mountSpeed,
                        jumpPower: mountJump,
                        maxStamina: 100
                    };
                    if (!player.mounts) player.mounts = [];
                    player.mounts.push(mount);
                    
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
                    if (player.onMessage) player.onMessage(`Added ${mount.name} to Mounts menu!`);
                    return true;
                }
                if (item.id === 'saddle') {
                    if (ctx.onSaddleUse) {
                        const success = ctx.onSaddleUse(player.x, player.y, player.z, player.aimAngle);
                        if (success) {
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
                    return false;
                }
                if (item.id === 'bomb') {
                    if (onPlantBomb) {
                        const px = Math.floor(player.x + Math.cos(player.aimAngle));
                        const py = Math.floor(player.y + Math.sin(player.aimAngle));
                        const pz = Math.floor(player.z);
                        if (onPlantBomb(px, py, pz)) {
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
                    return false;
                }
                if (item.category === 'CONSUMABLE' && item.id !== 'fire_vial') {
                    let consumed = false;
                    
                    if (item.healing) {
                        player.health = Math.min(player.effectiveMaxHealth, player.health + item.healing);
                        if (player.onMessage) player.onMessage(`+${item.healing} HP`);
                        consumed = true;
                    }
                    if (item.manaRestore) {
                        player.mana = Math.min(player.effectiveMaxMana, player.mana + item.manaRestore);
                        if (player.onMessage) player.onMessage(`+${item.manaRestore} MP`);
                        consumed = true;
                    }
                    if (item.staminaRestore) {
                        player.stamina = Math.min(player.maxStamina, player.stamina + item.staminaRestore);
                        if (player.onMessage) player.onMessage(`+${item.staminaRestore} SP`);
                        consumed = true;
                    }
                    if (item.buff) {
                        if (item.buff.speed) player.buffs.speed = item.buff.duration;
                        if (item.buff.maxHealth) player.buffs.maxHealth = item.buff.duration;
                        if (item.buff.maxMana) player.buffs.maxMana = item.buff.duration;
                        if (item.buff.healthRegen) player.buffs.healthRegen = item.buff.duration;
                        if (item.buff.manaRegen) player.buffs.manaRegen = item.buff.duration;
                        if (player.onMessage) player.onMessage(`BUFF APPLIED!`);
                        consumed = true;
                    }

                    if (item.id === 'djinn_lamp') {
                        player.health = player.effectiveMaxHealth;
                        player.mana = player.effectiveMaxMana;
                        player.stamina = player.maxStamina;
                        if (player.onMessage) player.onMessage('The Djinn grants your wish! +FULL STATS!');
                        if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'HEAL_NOVA');
                        consumed = true;
                    }
                    
                    // Specific overrides for old hardcoded behaviors
                    if (item.id === 'red_berry') { player.health = Math.min(player.effectiveMaxHealth, player.health + 10); consumed = true; }
                    if (item.id === 'blue_berry') { player.mana = Math.min(player.effectiveMaxMana, player.mana + 10); consumed = true; }
                    if (item.id === 'black_berry') { player.stamina = Math.min(player.maxStamina, player.stamina + 10); consumed = true; }
                    if (item.id === 'yellow_berry') { 
                        player.health = Math.min(player.effectiveMaxHealth, player.health + 5);
                        player.mana = Math.min(player.effectiveMaxMana, player.mana + 5);
                        player.stamina = Math.min(player.maxStamina, player.stamina + 5);
                        consumed = true;
                    }
                    if (item.id === 'swiftness_potion') { player.buffs.speed = 60.0; if(player.onMessage) player.onMessage('SPEED UP!'); consumed = true;}

                    if (consumed) {
                        audioEngine.playHit(); // Play a nice sound (TODO: play eat sound)
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

                if (item.id === 'pipe') {
                    // Try to consume weed
                    let consumedWeed = false;
                    let weedItem: any = null;
                    const weedTypes = ['pipe_weed_green', 'pipe_weed_blue', 'pipe_weed_red', 'pipe_weed_purple'];
                    
                    for (const wType of weedTypes) {
                        if (player.hasItem(wType, 1)) {
                            player.removeItem(wType, 1);
                            weedItem = ITEMS[wType];
                            consumedWeed = true;
                            break;
                        }
                    }

                    if (consumedWeed && weedItem) {
                        if (weedItem.healing) player.health = Math.min(player.effectiveMaxHealth, player.health + weedItem.healing);
                        if (weedItem.manaRestore) player.mana = Math.min(player.effectiveMaxMana, player.mana + weedItem.manaRestore);
                        if (weedItem.staminaRestore) player.stamina = Math.min(player.maxStamina, player.stamina + weedItem.staminaRestore);
                        
                        if (weedItem.buff) {
                            if (weedItem.buff.speed) player.buffs.speed = weedItem.buff.duration;
                            if (weedItem.buff.maxHealth) player.buffs.maxHealth = weedItem.buff.duration;
                            if (weedItem.buff.maxMana) player.buffs.maxMana = weedItem.buff.duration;
                            if (weedItem.buff.healthRegen) player.buffs.healthRegen = weedItem.buff.duration;
                            if (weedItem.buff.manaRegen) player.buffs.manaRegen = weedItem.buff.duration;
                            if (weedItem.buff.staminaRegen) player.buffs.staminaRegen = weedItem.buff.duration;
                        }
                        
                        if (player.onMessage) player.onMessage(`Smoked ${weedItem.name}!`);
                        audioEngine.playHit(); // Play sound
                        
                        // Emit smoke particles
                        if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'SMOKE_FX');
                    } else {
                        if (player.onMessage) player.onMessage(`Need Pipe Weed!`);
                    }
                    return true;
                }
                
                if (item.id === 'fire_vial') {
                    if (ctx.onShoot) {
                        ctx.onShoot(
                            player.x + Math.cos(player.aimAngle) * 0.5, 
                            player.y + Math.sin(player.aimAngle) * 0.5, 
                            player.z + 1.0, 
                            Math.cos(player.aimAngle) * 15, 
                            Math.sin(player.aimAngle) * 15, 
                            40,
                            'EXPLOSION', 
                            1.5
                        );
                    }
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

                if (item.id === 'shovel_1' || item.id === 'golden_shovel' || item.id === 'pickaxe_1' || item.id === 'dwarven_pickaxe') {
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (slotIndex === 0) {
                        // Dig channel down
                        if (world.getBlock(targetX, targetY, pZ - 1) !== BlockType.AIR) {
                            world.setBlock(targetX, targetY, pZ - 1, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                            return true;
                        }
                    } else if (slotIndex === 1) {
                        // Dig dirt path
                        if (world.getBlock(targetX, targetY, pZ - 1) === BlockType.GRASS || world.getBlock(targetX, targetY, pZ - 1) === BlockType.DIRT) {
                            world.setBlock(targetX, targetY, pZ - 1, BlockType.DIRT_PATH);
                            return true;
                        }
                    }
                } else if (item.id === 'bee_hive') {
                    // Place bee hive
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (world.getBlock(targetX, targetY, pZ) === BlockType.AIR) {
                        world.setBlock(targetX, targetY, pZ, BlockType.BEE_HIVE);
                        
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
                } else if (item.id === 'wooden_staircase_recipe_scroll') {
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
                            player.learnedRecipes.push('heavy_stone');
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
                } else if (item.id === 'door' || item.id === 'glass_block' || item.id === 'stone_staircase' || item.id === 'stone_door' || item.id === 'archer_tent' || item.id === 'dark_knight_tent' || item.id === 'buggy_ramp' || item.id === 'dark_wizard_pedestal' || item.id === 'thera_gateway' || item.id === 'gargoyle_pedestal' || item.id === 'djinn_lamp_shrine' || item.id === 'gremlin_camp' || item.id === 'sphinx_spawner' || item.id === 'cooking_pot' || item.id === 'ancient_wood' || item.id === 'ancient_leaves' || item.id === 'glowing_mushroom_block' || item.id === 'void_beacon' || item.id === 'giant_camp' || item.id === 'titan_nest' || item.id === 'goblin_tent_rockhurler' || item.id === 'goblin_tent_gardener' || item.id === 'goblin_tent_boomeranger' || item.id === 'goblin_tent_alchemist' || item.id === 'goblin_tent_miner' || item.id === 'orc_tent_brute' || item.id === 'orc_tent_shaman' || item.id === 'orc_tent_hunter' || item.id === 'kobold_tent' || item.id === 'kobold_tent_trapper' || item.id === 'kobold_tent_warrior' || item.id === 'kobold_tent_shaman' || item.id === 'kobold_tent_bomber' || item.id === 'kobold_tent_dragonkeeper' || item.id === 'dark_elf_tent' || item.id === 'village_bell' || item.id === 'copper_bell' || item.id === 'iron_bell' || item.id === 'green_bell' || item.id === 'red_bell' || item.id === 'mithril_bell' || item.id === 'black_bell' || item.id === 'alchemy_table' || item.id === 'pot' || item.id === 'slime_puddle' || item.id === 'spider_web' || item.id === 'demon_portal' || item.id === 'tent' || item.id === 'wood' || item.id === 'stone' || item.id === 'torch' || item.id === 'campfire' || item.id === 'carpenters_bench' || item.id === 'masonry_table' || item.id === 'fabric_station' || item.id === 'leather_station' || item.id === 'shrine' || item.id === 'furnace' || item.id === 'storage_chest' || item.id === 'anvil' || item.id === 'spike_floor' || item.id === 'pressure_plate' || item.id === 'lever' || item.id === 'heavy_stone' || item.id === 'iron_block' || item.id === 'marble' || item.id === 'black_marble' || item.id === 'green_marble' || item.id === 'obsidian' || item.id === 'lava_rock' || item.id === 'ruby' || item.id === 'emerald' || item.id === 'black_diamond' || item.id === 'conveyor_belt' || item.id === 'auto_miner' || item.id === 'auto_dropper' || item.id === 'auto_crafter' || item.id === 'vacuum_hopper' || item.id === 'wire' || item.id === 'piston' || item.id === 'arrow_turret' || item.id === 'worker_contract' || item.id === 'archer_contract' || item.id === 'gardener_contract' || item.id === 'guard_contract' || item.id === 'miner_contract' || item.id === 'arcane_turret' || item.id === 'halfling_house_spawner' || item.id === 'pit_bull_tent' || item.id === 'pomeranian_wagon' || item.id === 'terrier_tent' || item.id === 'wolf_folk_camp') {
                    // Place block
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (world.getBlock(targetX, targetY, pZ) === BlockType.AIR) {
                        let blockToPlace = BlockType.TENT;
                        if (item.id === 'door') blockToPlace = BlockType.DOOR_CLOSED;
                        if (item.id === 'glass_block') blockToPlace = BlockType.GLASS;
                        if (item.id === 'stone_staircase') blockToPlace = BlockType.STONE_STAIRCASE;
                        if (item.id === 'stone_door') blockToPlace = BlockType.STONE_DOOR_CLOSED;
                        if (item.id === 'archer_tent') blockToPlace = BlockType.ARCHER_TENT;
                        if (item.id === 'dark_knight_tent') blockToPlace = BlockType.DARK_KNIGHT_TENT;
                        if (item.id === 'wood') blockToPlace = BlockType.WOOD_WALL;
                        if (item.id === 'stone') blockToPlace = BlockType.STONE;
                        if (item.id === 'torch') blockToPlace = BlockType.TORCH;
                        if (item.id === 'campfire') blockToPlace = BlockType.CAMPFIRE;
                        if (item.id === 'carpenters_bench') blockToPlace = BlockType.CARPENTERS_BENCH;
                        if (item.id === 'masonry_table') blockToPlace = BlockType.MASONRY_TABLE;
                        if (item.id === 'fabric_station') blockToPlace = BlockType.FABRIC_STATION;
                        if (item.id === 'leather_station') blockToPlace = BlockType.LEATHER_STATION;
                        if (item.id === 'shrine') blockToPlace = BlockType.SHRINE;
                        if (item.id === 'furnace') blockToPlace = BlockType.FURNACE;
                        if (item.id === 'anvil') blockToPlace = BlockType.ANVIL;
                        if (item.id === 'spike_floor') blockToPlace = BlockType.SPIKE_FLOOR;
                        if (item.id === 'pressure_plate') blockToPlace = BlockType.PRESSURE_PLATE;
                        if (item.id === 'lever') blockToPlace = BlockType.LEVER;
                        if (item.id === 'wire') blockToPlace = BlockType.WIRE_OFF;
                        if (item.id === 'piston') blockToPlace = BlockType.PISTON_CLOSED;
                        if (item.id === 'arrow_turret') blockToPlace = BlockType.ARROW_TURRET;
                        if (item.id === 'worker_contract') blockToPlace = BlockType.WORKER_GNOME;
                        if (item.id === 'archer_contract') blockToPlace = BlockType.ARCHER_MERCENARY;
                        if (item.id === 'gardener_contract') blockToPlace = BlockType.GARDENER_GNOME;
                        if (item.id === 'miner_contract') blockToPlace = BlockType.MINER_GNOME;
                        if (item.id === 'guard_contract') blockToPlace = BlockType.GUARD_MERCENARY;
                        if (item.id === 'heavy_stone') blockToPlace = BlockType.HEAVY_STONE;
                        if (item.id === 'iron_block') blockToPlace = BlockType.IRON_BLOCK;
                        if (item.id === 'marble') blockToPlace = BlockType.MARBLE;
                        if (item.id === 'black_marble') blockToPlace = BlockType.BLACK_MARBLE;
                        if (item.id === 'green_marble') blockToPlace = BlockType.GREEN_MARBLE;
                        if (item.id === 'obsidian') blockToPlace = BlockType.OBSIDIAN;
                        if (item.id === 'lava_rock') blockToPlace = BlockType.LAVA_ROCK;
                        if (item.id === 'ruby') blockToPlace = BlockType.RUBY;
                        if (item.id === 'emerald') blockToPlace = BlockType.EMERALD;
                        if (item.id === 'black_diamond') blockToPlace = BlockType.BLACK_DIAMOND;
                        if (item.id === 'storage_chest') blockToPlace = BlockType.CHEST;
                        if (item.id === 'storage_chest') blockToPlace = BlockType.CHEST;
                        if (item.id === 'auto_miner') blockToPlace = BlockType.AUTO_MINER;
                        if (item.id === 'auto_dropper') blockToPlace = BlockType.AUTO_DROPPER;
                        if (item.id === 'auto_crafter') blockToPlace = BlockType.AUTO_CRAFTER;
                        if (item.id === 'vacuum_hopper') blockToPlace = BlockType.VACUUM_HOPPER;
                        if (item.id === 'buggy_ramp') blockToPlace = BlockType.BUGGY_RAMP;
                        if (item.id === 'slime_puddle') blockToPlace = BlockType.SLIME_PUDDLE;
                        if (item.id === 'pot') blockToPlace = BlockType.POT;
                        if (item.id === 'spider_web') blockToPlace = BlockType.SPIDER_WEB;
                        if (item.id === 'demon_portal') blockToPlace = BlockType.DEMON_PORTAL;
                        if (item.id === 'alchemy_table') blockToPlace = BlockType.ALCHEMY_TABLE;
                        if (item.id === 'village_bell') blockToPlace = BlockType.VILLAGE_BELL;
                        if (item.id === 'copper_bell') blockToPlace = BlockType.COPPER_BELL;
                        if (item.id === 'iron_bell') blockToPlace = BlockType.IRON_BELL;
                        if (item.id === 'green_bell') blockToPlace = BlockType.GREEN_BELL;
                        if (item.id === 'red_bell') blockToPlace = BlockType.RED_BELL;
                        if (item.id === 'mithril_bell') blockToPlace = BlockType.MITHRIL_BELL;
                        if (item.id === 'black_bell') blockToPlace = BlockType.BLACK_BELL;
                        if (item.id === 'ancient_wood') blockToPlace = BlockType.ANCIENT_WOOD;
                        if (item.id === 'ancient_leaves') blockToPlace = BlockType.ANCIENT_LEAVES;
                        if (item.id === 'glowing_mushroom_block') blockToPlace = BlockType.GLOWING_MUSHROOM_BLOCK;
                        
                        if (item.id === 'goblin_tent_rockhurler') blockToPlace = BlockType.GOBLIN_TENT_ROCKHURLER;
                        if (item.id === 'goblin_tent_gardener') blockToPlace = BlockType.GOBLIN_TENT_GARDENER;
                        if (item.id === 'goblin_tent_boomeranger') blockToPlace = BlockType.GOBLIN_TENT_BOOMERANGER;
                        if (item.id === 'goblin_tent_alchemist') blockToPlace = BlockType.GOBLIN_TENT_ALCHEMIST;
                        if (item.id === 'goblin_tent_miner') blockToPlace = BlockType.GOBLIN_TENT_MINER;
                        if (item.id === 'orc_tent_brute') blockToPlace = BlockType.ORC_TENT_BRUTE;
                        if (item.id === 'orc_tent_shaman') blockToPlace = BlockType.ORC_TENT_SHAMAN;
                        if (item.id === 'orc_tent_hunter') blockToPlace = BlockType.ORC_TENT_HUNTER;
                        if (item.id === 'kobold_tent') blockToPlace = BlockType.KOBOLD_TENT;
                        if (item.id === 'kobold_tent_trapper') blockToPlace = BlockType.KOBOLD_TENT_TRAPPER;
                        if (item.id === 'kobold_tent_warrior') blockToPlace = BlockType.KOBOLD_TENT_WARRIOR;
                        if (item.id === 'kobold_tent_shaman') blockToPlace = BlockType.KOBOLD_TENT_SHAMAN;
                        if (item.id === 'kobold_tent_bomber') blockToPlace = BlockType.KOBOLD_TENT_BOMBER;
                        if (item.id === 'kobold_tent_dragonkeeper') blockToPlace = BlockType.KOBOLD_TENT_DRAGONKEEPER;
                        if (item.id === 'dark_elf_tent') blockToPlace = BlockType.DARK_ELF_TENT;
                        if (item.id === 'giant_camp') blockToPlace = BlockType.GIANT_CAMP;
                        if (item.id === 'titan_nest') blockToPlace = BlockType.TITAN_NEST;
                        if (item.id === 'void_beacon') blockToPlace = BlockType.VOID_BEACON;
                        if (item.id === 'gargoyle_pedestal') blockToPlace = BlockType.GARGOYLE_PEDESTAL;
                        if (item.id === 'djinn_lamp_shrine') blockToPlace = BlockType.DJINN_LAMP_SHRINE;
                        if (item.id === 'gremlin_camp') blockToPlace = BlockType.GREMLIN_CAMP;
                        if (item.id === 'sphinx_spawner') blockToPlace = BlockType.SPHINX_SPAWNER;
                        if (item.id === 'cooking_pot') blockToPlace = BlockType.COOKING_POT;
                        if (item.id === 'thera_gateway') blockToPlace = BlockType.THERA_GATEWAY;
                        if (item.id === 'halfling_house_spawner') blockToPlace = BlockType.HALFLING_HOUSE_SPAWNER;
                        if (item.id === 'pit_bull_tent') blockToPlace = BlockType.PIT_BULL_TENT;
                        if (item.id === 'pomeranian_wagon') blockToPlace = BlockType.POMERANIAN_WAGON;
                        if (item.id === 'terrier_tent') blockToPlace = BlockType.TERRIER_TENT;
                        if (item.id === 'wolf_folk_camp') blockToPlace = BlockType.WOLF_FOLK_CAMP;
                        if ((item.id as string) === 'arcane_turret') blockToPlace = BlockType.ARCANE_TURRET;

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
            };
            player.handleQuickSlot = handleQuickSlot;

            if (quick1 && handleQuickSlot(0)) {
                player.quickCooldown = 0.5;
            } else if (quick2 && handleQuickSlot(1)) {
                player.quickCooldown = 0.5;
            } else if (quick3 && handleQuickSlot(2)) {
                player.quickCooldown = 0.5;
            }
        }

        
    }
}
