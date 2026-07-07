import { Player, UpdateContext } from '../Player';
import { World, isSolid, isIndestructible, getLootForBlock } from '../World';
import { BlockType } from '../constants/BlockType';
import { Item, ITEMS } from '../Inventory';
import { BlockRegistry } from '../registries/BlockRegistry';
import { audioEngine } from '../AudioEngine';
import { WORLD_HEIGHT } from '../Constants';
import { QuestSystem } from '../systems/QuestSystem';

export class PlayerBlockInteraction {
    static damageBlock(player: Player, world: World, bx: number, by: number, targetZ: number, damage: number, weapon: any, onDropItem: any, onHit: any, ctx: UpdateContext) {
        let block = world.getBlock(bx, by, targetZ);
        if (isIndestructible(block)) return;

        const isFarmingTool = weapon?.id === 'hoe_1' || weapon?.id === 'watering_can';
        if ((block === BlockType.AIR || !isSolid(block) || block === BlockType.CROP_STAGE_1 || block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_3) && isFarmingTool) {
            if (world.getBlock(bx, by, targetZ - 1) !== BlockType.AIR) {
                targetZ = targetZ - 1;
                block = world.getBlock(bx, by, targetZ);
            }
        }

        if (block === BlockType.WATER && weapon?.id === 'fishing_pole') {
            if (!player.isFishing) {
                player.isFishing = true;
                
                const fishingLevel = player.talents['fishing'] || 0;
                let rand = Math.random();
                let itemOutput: Item | null = null;
                
                if (fishingLevel >= 1 && Math.random() < 0.05) {
                    itemOutput = { ...ITEMS['djinn_lamp'] };
                } else if (fishingLevel >= 1 && Math.random() < 0.1) {
                    itemOutput = { ...ITEMS['golden_fish'] };
                } else if (rand < 0.3 + (fishingLevel * 0.15)) {
                    itemOutput = { ...ITEMS['raw_fish'] };
                }
                
                if (itemOutput) {
                    if (onDropItem) {
                        onDropItem(bx, by, targetZ + 1, itemOutput);
                        audioEngine.playSplash(); 
                    }
                    if (ctx.onAoE) ctx.onAoE(bx, by, targetZ, 1, 0, 'WATER');
                    player.addXp(15);
                } else {
                    if (ctx.onAoE) ctx.onAoE(bx, by, targetZ, 0.5, 0, 'WATER');
                }
                
                const cooldownTime = fishingLevel >= 1 ? 1000 : 2000;
                setTimeout(() => { if(player) player.isFishing = false; }, cooldownTime);
            }
            return;
        }

        const isDirtLike = [BlockType.DIRT, BlockType.GRASS, BlockType.TILLED_SOIL_DRY, BlockType.MUD, BlockType.SAND, BlockType.SNOW, BlockType.SWAMP_DIRT, BlockType.RED_DIRT, BlockType.RED_SAND, BlockType.BLACK_DIRT, BlockType.BLACK_SAND, BlockType.GREEN_DIRT, BlockType.GREEN_SAND, BlockType.BLUE_DIRT, BlockType.BLUE_SAND, BlockType.ORANGE_DIRT, BlockType.ORANGE_SAND, BlockType.PURPLE_DIRT, BlockType.PURPLE_SAND, BlockType.YELLOW_DIRT, BlockType.YELLOW_SAND, BlockType.BROWN_DIRT, BlockType.BROWN_SAND].includes(block);

        if (block === BlockType.BEE_HIVE) {
            const key = `${bx},${by},${targetZ}`;
            let hp = world.blockHealth.get(key) ?? 30;
            hp -= damage;
            if (hp <= 0) {
                world.setBlock(bx, by, targetZ, BlockType.AIR);
                audioEngine.playBreakBlock();
                world.blockHealth.delete(key);
                if (weapon?.id === 'golden_shovel') {
                    if (onDropItem) onDropItem(bx, by, targetZ, { ...ITEMS['honeycomb'], quantity: Math.floor(Math.random() * 3) + 1 });
                } else if (weapon?.id === 'shovel_1' && Math.random() < 0.5) {
                    if (onDropItem) onDropItem(bx, by, targetZ, { ...ITEMS['bee_hive'] });
                }
            } else {
                world.blockHealth.set(key, hp);
            }
        } else if (block === BlockType.DUMMY) {
            const key = `${bx},${by},${targetZ}`;
            let hp = world.blockHealth.get(key) ?? 50;
            hp -= damage;
            if (hp <= 0) {
                world.setBlock(bx, by, targetZ, BlockType.AIR);
                audioEngine.playBreakBlock();
                world.blockHealth.delete(key);
                world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
                player.addXp(10);
            } else {
                world.blockHealth.set(key, hp);
            }
        } else if (block === BlockType.BUSH || block === BlockType.FERN || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH || block === BlockType.CROP_STAGE_1 || block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_3 || block === BlockType.WEED) {
            world.setBlock(bx, by, targetZ, BlockType.AIR);
            audioEngine.playBreakBlock();
            let mult = player.race === 'RABBIT FOLK' ? 2 : 1;
            if (block === BlockType.RED_BERRY_BUSH && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['red_berry'], quantity: 2 * mult });
                onDropItem(bx, by, targetZ, { ...ITEMS['red_berry_seed'], quantity: 2 * mult });
            } else if (block === BlockType.BLUE_BERRY_BUSH && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['blue_berry'], quantity: 2 * mult });
                onDropItem(bx, by, targetZ, { ...ITEMS['blue_berry_seed'], quantity: 2 * mult });
            } else if (block === BlockType.BLACK_BERRY_BUSH && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['black_berry'], quantity: 2 * mult });
                onDropItem(bx, by, targetZ, { ...ITEMS['black_berry_seed'], quantity: 2 * mult });
            } else if (block === BlockType.YELLOW_BERRY_BUSH && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['yellow_berry'], quantity: 2 * mult });
                onDropItem(bx, by, targetZ, { ...ITEMS['yellow_berry_seed'], quantity: 2 * mult });
            } else if (block === BlockType.FERN && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['fern_frond'], quantity: Math.floor(Math.random() * 2 * mult) + 1 });
            } else if (block === BlockType.WEED && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['weed'], quantity: Math.floor(Math.random() * 2 * mult) + 1 });
                onDropItem(bx, by, targetZ, { ...ITEMS['weed_seed'], quantity: Math.floor(Math.random() * 2 * mult) + 1 });
            } else if (block === BlockType.CROP_STAGE_3 && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['carrot'], quantity: Math.floor(Math.random() * 2) + 2 }); 
                onDropItem(bx, by, targetZ, { ...ITEMS['carrot_seed'], quantity: Math.floor(Math.random() * 2) + 1 }); 
            } else if ((block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_1) && onDropItem) {
                onDropItem(bx, by, targetZ, { ...ITEMS['carrot_seed'], quantity: 1 }); 
            }
        } else if (weapon?.id === 'hoe_1' && isDirtLike && block !== BlockType.TILLED_SOIL_DRY && block !== BlockType.TILLED_SOIL_WET) {
            world.setBlock(bx, by, targetZ, BlockType.TILLED_SOIL_DRY);
            audioEngine.playBreakBlock();
        } else if (weapon?.id === 'watering_can' && block === BlockType.TILLED_SOIL_DRY) {
            world.setBlock(bx, by, targetZ, BlockType.TILLED_SOIL_WET);
        } else if (isDirtLike && weapon?.id?.includes('shovel')) {
            world.setBlock(bx, by, targetZ, BlockType.AIR);
            audioEngine.playBreakBlock();
        } else {
            const key = `${bx},${by},${targetZ}`;
            let hp = world.blockHealth.get(key) ?? BlockRegistry.getHardness(block);
            let appliedDamage = damage;
            
            if ((block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD || block === BlockType.FROZEN_WOOD) && (weapon?.id === 'axe_1' || weapon?.id === 'star_metal_axe')) appliedDamage *= 5;
            
            const isOresAndMetals = (block >= BlockType.COPPER_ORE && block <= BlockType.STAR_METAL_ORE) || (block >= BlockType.COPPER_BLOCK && block <= BlockType.PLUTONIUM_BLOCK);
            const isRunedStone = block >= BlockType.RUNED_STONE && block <= BlockType.RUNED_ABYSSAL_BRICK;
            const isStoneGemMetal = block === BlockType.STONE || block === BlockType.GRAVESTONE || isOresAndMetals || isRunedStone || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE || block === BlockType.MARBLE || block === BlockType.BLACK_MARBLE || block === BlockType.GREEN_MARBLE || block === BlockType.OBSIDIAN || block === BlockType.LAVA_ROCK || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND || block === BlockType.CLAY_ORE || block === BlockType.ICE || block === BlockType.GLACIAL_ICE || block === BlockType.GLACIAL_CRYSTAL_ORE || block === BlockType.PERMAFROST || block === BlockType.STAR_METAL_ORE;
            
            if (isStoneGemMetal && (weapon?.id === 'pickaxe_1' || weapon?.id === 'chisel' || weapon?.id === 'dwarven_pickaxe' || weapon?.id === 'fossil_pickaxe' || weapon?.id === 'star_metal_pickaxe')) appliedDamage *= 5;
            
            if (player.race === 'HILL DWARF' || player.race === 'MOUNTAIN DWARF' || player.race === 'CYCLOPSE DWARF') {
                if (isStoneGemMetal) {
                    appliedDamage *= 2;
                }
            }
            if (block === BlockType.CARPENTERS_BENCH && weapon?.id === 'axe_1') appliedDamage *= 5;
            if (block === BlockType.CHEST && weapon?.id === 'axe_1') appliedDamage *= 5;

            hp -= appliedDamage;
            if (hp <= 0) {
                world.blockHealth.delete(key);
                
                if (weapon?.id === 'chisel') {
                    const transformMap: Partial<Record<BlockType, BlockType>> = {
                        [BlockType.STONE]: BlockType.RUNED_STONE,
                        [BlockType.CASTLE_STONE]: BlockType.RUNED_CASTLE_STONE,
                        [BlockType.MARBLE]: BlockType.RUNED_MARBLE,
                        [BlockType.BLACK_MARBLE]: BlockType.RUNED_BLACK_MARBLE,
                        [BlockType.GREEN_MARBLE]: BlockType.RUNED_GREEN_MARBLE,
                        [BlockType.OBSIDIAN]: BlockType.RUNED_OBSIDIAN,
                        [BlockType.RED_STONE]: BlockType.RUNED_RED_STONE,
                        [BlockType.RED_MARBLE]: BlockType.RUNED_RED_MARBLE,
                        [BlockType.BLACK_STONE]: BlockType.RUNED_BLACK_STONE,
                        [BlockType.GREEN_STONE]: BlockType.RUNED_GREEN_STONE,
                        [BlockType.BLUE_STONE]: BlockType.RUNED_BLUE_STONE,
                        [BlockType.BLUE_MARBLE]: BlockType.RUNED_BLUE_MARBLE,
                        [BlockType.ORANGE_STONE]: BlockType.RUNED_ORANGE_STONE,
                        [BlockType.ORANGE_MARBLE]: BlockType.RUNED_ORANGE_MARBLE,
                        [BlockType.PURPLE_STONE]: BlockType.RUNED_PURPLE_STONE,
                        [BlockType.PURPLE_MARBLE]: BlockType.RUNED_PURPLE_MARBLE,
                        [BlockType.YELLOW_STONE]: BlockType.RUNED_YELLOW_STONE,
                        [BlockType.YELLOW_MARBLE]: BlockType.RUNED_YELLOW_MARBLE,
                        [BlockType.BROWN_STONE]: BlockType.RUNED_BROWN_STONE,
                        [BlockType.BROWN_MARBLE]: BlockType.RUNED_BROWN_MARBLE,
                        [BlockType.MOONSTONE]: BlockType.RUNED_MOONSTONE,
                        [BlockType.BLOOD_STONE]: BlockType.RUNED_BLOOD_STONE,
                        [BlockType.ECHO_STONE]: BlockType.RUNED_ECHO_STONE,
                        [BlockType.DUNGEON_BRICK]: BlockType.RUNED_DUNGEON_BRICK,
                        [BlockType.ABYSSAL_BRICK]: BlockType.RUNED_ABYSSAL_BRICK,
                    };
                    if (transformMap[block as BlockType]) {
                        world.setBlock(bx, by, targetZ, transformMap[block as BlockType]!);
                        if (ctx.onAoE) ctx.onAoE(bx, by, targetZ, 1, 0, 'HIT'); // Particle effect
                        audioEngine.playBreakBlock();
                        player.addXp(2);
                        return; // Done
                    }
                }
                
                if (ctx.engine) QuestSystem.onBlockDestroyed(ctx.engine, block);
                world.setBlock(bx, by, targetZ, BlockType.AIR);
                audioEngine.playBreakBlock();
                if (block === BlockType.CHEST) {
                    const chestInv = world.getChest(bx, by, targetZ);
                    if (onDropItem) onDropItem(bx, by, targetZ, { ...ITEMS['storage_chest'], chestInventory: chestInv });
                    world.chestData.delete(world.getChestKey(bx, by, targetZ));
                } else if (block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) {
                    const woodType = block === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                    if (onDropItem) onDropItem(bx, by, targetZ, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
                    let currentZ = targetZ + 1;
                    while (currentZ < WORLD_HEIGHT) {
                        const aboveBlock = world.getBlock(bx, by, currentZ);
                        if (aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.LEAVES || aboveBlock === BlockType.PINE_LEAVES || aboveBlock === BlockType.TROPICAL_WOOD || aboveBlock === BlockType.TROPICAL_LEAVES) {
                            world.setBlock(bx, by, currentZ, BlockType.AIR);
                            audioEngine.playBreakBlock();
                            if ((aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.TROPICAL_WOOD) && onDropItem && Math.random() < 0.5) {
                                const woodTypeAbove = aboveBlock === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                onDropItem(bx, by, currentZ, { ...ITEMS[woodTypeAbove] });
                            }
                            for (let lx = -2; lx <= 2; lx++) {
                                for (let ly = -2; ly <= 2; ly++) {
                                    if (lx === 0 && ly === 0) continue;
                                    const leafBlock = world.getBlock(bx + lx, by + currentZ, currentZ);
                                    if (leafBlock === BlockType.LEAVES || leafBlock === BlockType.PINE_LEAVES || leafBlock === BlockType.TROPICAL_LEAVES) {
                                        world.setBlock(bx + lx, by + ly, currentZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    }
                                }
                            }
                            currentZ++;
                        } else {
                            break;
                        }
                    }
                } else if (block === BlockType.GIANT_MUSHROOM_STALK) {
                    if (onDropItem) onDropItem(bx, by, targetZ, { ...ITEMS['fungal_spore'] });
                    let currentZ = targetZ + 1;
                    while (currentZ < WORLD_HEIGHT) {
                        const aboveBlock = world.getBlock(bx, by, currentZ);
                        if (aboveBlock === BlockType.GIANT_MUSHROOM_STALK || aboveBlock === BlockType.GIANT_MUSHROOM_CAP_RED || aboveBlock === BlockType.GIANT_MUSHROOM_CAP_BROWN) {
                            world.setBlock(bx, by, currentZ, BlockType.AIR);
                            audioEngine.playBreakBlock();
                            if (aboveBlock === BlockType.GIANT_MUSHROOM_STALK && onDropItem && Math.random() < 0.5) onDropItem(bx, by, currentZ, { ...ITEMS['fungal_spore'] });
                            for (let lx = -2; lx <= 2; lx++) {
                                for (let ly = -2; ly <= 2; ly++) {
                                    if (lx === 0 && ly === 0) continue;
                                    const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
                                    if (leafBlock === BlockType.GIANT_MUSHROOM_CAP_RED || leafBlock === BlockType.GIANT_MUSHROOM_CAP_BROWN || leafBlock === BlockType.GLOWCAP_MUSHROOM) {
                                        world.setBlock(bx + lx, by + ly, currentZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                        if (leafBlock === BlockType.GLOWCAP_MUSHROOM && onDropItem && Math.random() < 0.2) onDropItem(bx + lx, by + ly, currentZ, { ...ITEMS['glowcap'] });
                                    }
                                }
                            }
                            currentZ++;
                        } else { break; }
                    }
                } else {
                    if (onDropItem) {
                        const drops = getLootForBlock(block);
                        for (const drop of drops) {
                            let qty = drop.quantity ?? 1;
                            if (player.hasFavoredDeity('FIDIRI') && (block === BlockType.COPPER_ORE || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE)) {
                                if (Math.random() < 0.2) qty *= 2;
                            }
                            if ((player.race === 'TINKER GNOME' || player.race === 'GLOW GNOME') && (block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND)) {
                                qty *= 2;
                            }
                            onDropItem(bx, by, targetZ, { ...drop.item, quantity: qty });
                        }
                    }
                }

                if (player.hasFavoredDeity('ANIMA') && player.health < player.effectiveMaxHealth && Math.random() < 0.05) {
                    player.health = Math.min(player.effectiveMaxHealth, player.health + 1);
                }
            } else {
                world.blockHealth.set(key, hp);
            }
        }
        if (onHit) {
            onHit(bx, by, targetZ, damage, block);
        }
    }
}
