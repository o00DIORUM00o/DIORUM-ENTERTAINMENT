import { Player, UpdateContext } from '../Player';
import { World, isSolid, isIndestructible, getLootForBlock } from '../World';
import { BlockType } from '../constants/BlockType';
import { Item, EquipmentSlot, ITEMS, SPELLS } from '../Inventory';
import { BlockRegistry } from '../registries/BlockRegistry';
import { audioEngine } from '../AudioEngine';
import { WORLD_HEIGHT } from '../Constants';

export class PlayerCombat {
        static update(player: Player, ctx: UpdateContext) {
        let { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;

        const originalDropItem = onDropItem;
        if (originalDropItem) {
            onDropItem = (bx: number, by: number, bz: number, item: Item & { quantity?: number }) => {
                let multiplier = 1;
                
                // Gnomes double gem drops
                if (player.race === 'TINKER GNOME' || player.race === 'GLOW GNOME') {
                    if (['ruby', 'emerald', 'black_diamond', 'ruby_gem', 'emerald_gem', 'black_diamond_gem'].includes(item.id)) {
                        multiplier *= 2;
                    }
                }
                
                // Rabbit folk double plant drops
                if (player.race === 'RABBIT FOLK') {
                    const plantItems = [
                        'red_berry', 'blue_berry', 'black_berry', 'yellow_berry', 'fern_frond', 'weed', 
                        'carrot', 'pumpkin', 'corn', 'red_berry_seed', 'blue_berry_seed', 'black_berry_seed', 
                        'yellow_berry_seed', 'weed_seed', 'carrot_seed', 'fungal_spore', 'glowcap'
                    ];
                    if (plantItems.includes(item.id)) {
                        multiplier *= 2;
                    }
                }

                if (multiplier > 1) {
                    item = { ...item, quantity: (item.quantity ?? 1) * multiplier };
                }

                originalDropItem(bx, by, bz, item);
            };
        }

// Attacking
        const weapon = player.equipment['MAIN_HAND'];
        const isSword = weapon?.id?.includes('sword') || false;
        const swordTalentLevel = player.talents['swords'] || 0;

        if (attacking) {
            if (player.attackTimer <= 0 && player.stamina >= 5 && !player.isCharging) {
                player.isAttacking = true;
                player.hasHitThisSwing = false;
                
                player.attackDuration = weapon?.cooldown || 0.25;
                player.attackReach = weapon?.reach || 1.0;
                player.attackSpread = weapon?.spread || 0.5;

                // Override for MAGITECH_MECH
                if (player.isMounted && player.activeMount && player.activeMount.type === 'MAGITECH_MECH') {
                    player.attackDuration = 0.5;
                    player.attackReach = 15.0;
                }
                
                if (weapon?.id === 'staff_fire_ranged' || weapon?.id === 'staff_lightning_ranged') {
                    const boltCasterLevel = player.talents['bolt_caster'] || 0;
                    if (boltCasterLevel >= 2) player.attackDuration *= 0.8;
                    if (boltCasterLevel >= 3) player.attackDuration *= 0.75;
                } else if (weapon?.type === 'RANGED') {
                    const archeryLevel = player.talents['archery'] || 0;
                    if (archeryLevel >= 2) player.attackDuration *= 0.8;
                    if (archeryLevel >= 3) player.attackDuration *= 0.75;
                }
                
                player.attackTimer = player.attackDuration;
                player.stamina -= 5;

                const hasSecondary = !!weapon?.secondaryAbility;

                if ((isSword && swordTalentLevel >= 1) || hasSecondary) {
                    player.isCharging = true;
                    player.chargeTimer = 0;
                }
            } else if (player.isCharging) {
                const hasSecondary = !!weapon?.secondaryAbility;
                if (isSword && swordTalentLevel >= 1) {
                    player.chargeTimer += dt;
                    if (player.chargeTimer >= 1.0 && !player.spinAttackReady) {
                        player.spinAttackReady = true;
                        // Spawn ready particles
                        if (ctx.onShoot) { /* Just to use ctx, but we could play a sound */ }
                    }
                } else if (hasSecondary) {
                    player.chargeTimer += dt;
                    if (player.chargeTimer >= (weapon?.chargeTime || 1.5) && !player.spinAttackReady) {
                        player.spinAttackReady = true;
                        // Just beep or not
                        if (audioEngine) audioEngine.playJump();
                    }
                } else {
                    player.isCharging = false;
                    player.chargeTimer = 0;
                    player.spinAttackReady = false;
                }
            }
        } else {
            if (player.isCharging) {
                const hasSecondary = !!weapon?.secondaryAbility;
                if (player.spinAttackReady) {
                    if (isSword && swordTalentLevel >= 1) {
                        // Execute spin attack
                        player.isAttacking = true;
                        player.hasHitThisSwing = false;
                        player.attackDuration = weapon?.cooldown || 0.25;
                        player.attackReach = weapon?.reach || 1.0;
                        player.attackSpread = Math.PI; // Full circle (spread is half-angle)
                        player.attackTimer = player.attackDuration;
                        player.stamina -= 10; // Costs more stamina

                        if (weapon && weapon.affixes) {
                            if (weapon.affixes.some((a: string) => a.includes('magic circle of protection'))) {
                                player.buffs.arcaneProtection = 20.0;
                                if (ctx.onPersistentAoE) {
                                    ctx.onPersistentAoE(player.x, player.y, player.z, 2.0, 20.0, 'ARCANE_PROTECTION', '#9932cc');
                                }
                            }
                            if (weapon.affixes.some((a: string) => a.includes('fiery AOE'))) {
                                if (ctx.onPersistentAoE) {
                                    ctx.onPersistentAoE(player.x, player.y, player.z, 3.0, 10.0, 'FIRE', '#ff4500', Math.max(1, Math.floor(weapon.damage * 0.2)));
                                }
                            }
                        }
                    } else if (hasSecondary) {
                        const chargeCost = weapon?.chargeManaCost || 20;
                        if (player.mana >= chargeCost) {
                            player.mana -= chargeCost;
                            if (weapon?.secondaryAbility === 'BLINK') {
                                player.castBlink(ctx);
                            } else if (onTriggerSecondary) {
                                onTriggerSecondary(weapon.secondaryAbility, player.aimAngle, player.x, player.y, player.z);
                            }
                        }
                    }
                }
                player.isCharging = false;
                player.chargeTimer = 0;
                player.spinAttackReady = false;
            }
        }

        if (player.isAttacking) {
            const weapon = player.equipment['MAIN_HAND'];
            let weaponDamage = weapon?.damage || 1;
            
            if (weapon?.id === 'staff_fire_ranged' || weapon?.id === 'staff_lightning_ranged') {
                const boltCasterLevel = player.talents['bolt_caster'] || 0;
                let damageMult = 1.0;
                if (boltCasterLevel >= 1) damageMult += 0.10;
                if (boltCasterLevel >= 2) damageMult += 0.15;
                if (boltCasterLevel >= 3) damageMult += 0.20;
                weaponDamage *= damageMult;
            } else if (weapon?.type === 'RANGED') {
                const archeryLevel = player.talents['archery'] || 0;
                let damageMult = 1.0;
                if (archeryLevel >= 1) damageMult += 0.10;
                if (archeryLevel >= 2) damageMult += 0.15;
                if (archeryLevel >= 3) damageMult += 0.20;
                weaponDamage *= damageMult;
            } else if (isSword) {
                let damageMult = 1.0;
                if (swordTalentLevel >= 1) damageMult += 0.10;
                if (swordTalentLevel >= 2) damageMult += 0.20;
                if (swordTalentLevel >= 3) damageMult += 0.30;
                weaponDamage *= damageMult;
            }

            if (weapon?.type === 'MELEE' || isSword || (!weapon && !player.isMounted) || (weapon as any)?.type === 'TOOL') {
                if (player.race === 'ORC' || player.race === 'DARK ORC' || player.race === 'BEAR FOLK') {
                    weaponDamage *= 1.25; // 25% racial bonus
                }
                if (player.hasFavoredDeity('TELUM')) {
                    weaponDamage *= 1.25; // 25% deity bonus
                }
            } else if (weapon?.type === 'RANGED' || weapon?.id?.includes('staff_')) {
                if (player.hasFavoredDeity('RIULIRI')) {
                    weaponDamage *= 1.25; // 25% deity bonus
                }
            }

            if (player.isMounted && player.activeMount && player.activeMount.type === 'MAGITECH_MECH') {
                const drawTime = player.attackDuration * 0.2; 
                if (!player.hasHitThisSwing && player.attackTimer <= player.attackDuration - drawTime) {
                    player.hasHitThisSwing = true;
                    if (onShoot) {
                        const speed = 25;
                        const vx = Math.cos(player.aimAngle) * speed;
                        const vy = Math.sin(player.aimAngle) * speed;
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, 150, 'EXPLOSION', 15.0 / speed); // Heavy damage shell
                        audioEngine.playShoot();
                    }
                }
            } else if (player.isMounted && player.activeMount && player.activeMount.type === 'GIANT_EAGLE') {
                if (!player.hasHitThisSwing) {
                    player.hasHitThisSwing = true;
                    if (onMelee) {
                        onMelee(3.0, Math.PI / 2, 45); // Eagle swipe
                        audioEngine.playMelee();
                    }
                }
            } else if (weapon?.id?.includes('boomerang')) {
                const castTime = player.attackDuration * 0.2;
                if (!player.hasHitThisSwing && player.attackTimer <= player.attackDuration - castTime) {
                    player.hasHitThisSwing = true;
                    if (onShoot) {
                        const speed = weapon.projectileSpeed || 15;
                        const vx = Math.cos(player.aimAngle) * speed;
                        const vy = Math.sin(player.aimAngle) * speed;
                        // Range is based on talent level
                        const talentLevel = player.talents['boomerang'] || 1;
                        const range = talentLevel >= 3 ? 10 : 5;
                        const life = range / speed;
                        
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, weaponDamage, 'BOOMERANG', life);
                                    audioEngine.playShoot();
                    }
                }
            } else if (weapon?.type === 'RANGED') {
                const ammo = player.equipment['AMMO'];
                if (ammo && ammo.quantity && ammo.quantity > 0) {
                    const drawTime = player.attackDuration * 0.5; // Fire halfway through cooldown
                    if (!player.hasHitThisSwing && player.attackTimer <= player.attackDuration - drawTime) {
                        player.hasHitThisSwing = true;
                        
                        // Consume ammo
                        ammo.quantity--;
                        if (ammo.quantity <= 0) {
                            player.equipment['AMMO'] = null;
                        }

                        if (onShoot) {
                            const speed = weapon.projectileSpeed || 15;
                            const vx = Math.cos(player.aimAngle) * speed;
                            const vy = Math.sin(player.aimAngle) * speed;
                            
                            const archeryLevel = player.talents['archery'] || 0;
                            let reach = weapon.reach || 10.0;
                            if (archeryLevel >= 1) reach += 2;
                            if (archeryLevel >= 3) reach += 4;
                            
                            const life = reach / speed;
                            
                            const totalDamage = weaponDamage + (ammo.damage || 0);
                            
                            // Shoot from slightly above the feet
                            onShoot(player.x, player.y, player.z + 0.5, vx, vy, totalDamage, undefined, life, weapon.statusEffect);
                                    audioEngine.playShoot();
                        }
                    }
                } else if (!player.hasHitThisSwing) {
                    // Out of ammo, just play the animation but don't shoot
                    player.hasHitThisSwing = true;
                }
            } else if (weapon?.type === 'MAGIC_RANGED') {
                const castTime = player.attackDuration * 0.5;
                if (!player.hasHitThisSwing && player.attackTimer <= player.attackDuration - castTime) {
                    player.hasHitThisSwing = true;
                    if (onShoot) {
                        const speed = weapon.projectileSpeed || 15;
                        const vx = Math.cos(player.aimAngle) * speed;
                        const vy = Math.sin(player.aimAngle) * speed;
                        
                        let reach = weapon.reach || 5.0; // Default range for bolt staves
                        if (weapon?.id === 'staff_fire_ranged' || weapon?.id === 'staff_lightning_ranged') {
                            const boltCasterLevel = player.talents['bolt_caster'] || 0;
                            if (boltCasterLevel >= 1) reach += 2;
                            if (boltCasterLevel >= 3) reach += 4;
                        }
                        const life = reach / speed;
                        
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, weaponDamage, weapon.damageType, life, weapon.statusEffect);
                                    audioEngine.playShoot();
                    }
                }
            } else if (weapon?.type === 'MAGIC_AOE') {
                const castTime = player.attackDuration * 0.5;
                if (!player.hasHitThisSwing && player.attackTimer <= player.attackDuration - castTime) {
                    player.hasHitThisSwing = true;
                    const radius = player.attackReach;
                    const pZ = Math.floor(player.z);
                    
                    if (onAoE) {
                        onAoE(player.x, player.y, player.z + 0.5, radius, weaponDamage, weapon.damageType, weapon.statusEffect);
                    }

                    const minX = Math.floor(player.x - radius);
                    const maxX = Math.floor(player.x + radius);
                    const minY = Math.floor(player.y - radius);
                    const maxY = Math.floor(player.y + radius);

                    for(let bx = minX; bx <= maxX; bx++) {
                        for(let by = minY; by <= maxY; by++) {
                            const dx = bx + 0.5 - player.x;
                            const dy = by + 0.5 - player.y;
                            if (dx*dx + dy*dy <= radius*radius) {
                                const block = world.getBlock(bx, by, pZ);
                                if (!isIndestructible(block)) {
                                    if (block === BlockType.BUSH || block === BlockType.FERN || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH || block === BlockType.DIRT || block === BlockType.GRASS || block === BlockType.WEED) {
                                        if (weapon?.id === 'hoe_1' && (block === BlockType.DIRT || block === BlockType.GRASS || block === BlockType.WEED)) {
                                            world.setBlock(bx, by, pZ, BlockType.SOIL);
                                        } else {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                            audioEngine.playBreakBlock();
                                            if (block === BlockType.RED_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['red_berry'], quantity: 2 });
                                                onDropItem(bx, by, pZ, { ...ITEMS['red_berry_seed'], quantity: 2 });
                                            } else if (block === BlockType.BLUE_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['blue_berry'], quantity: 2 });
                                                onDropItem(bx, by, pZ, { ...ITEMS['blue_berry_seed'], quantity: 2 });
                                            } else if (block === BlockType.BLACK_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['black_berry'], quantity: 2 });
                                                onDropItem(bx, by, pZ, { ...ITEMS['black_berry_seed'], quantity: 2 });
                                            } else if (block === BlockType.YELLOW_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry'], quantity: 2 });
                                                onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry_seed'], quantity: 2 });
                                            } else if (block === BlockType.WEED && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['weed'], quantity: Math.floor(Math.random() * 2) + 1 });
                                                onDropItem(bx, by, pZ, { ...ITEMS['weed_seed'], quantity: Math.floor(Math.random() * 2) + 1 });
                                            } else if (block === BlockType.FERN && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['fern_frond'], quantity: Math.floor(Math.random() * 2) + 1 });
                                            }
                                        }
                                    } else if (block === BlockType.DUMMY) {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? 50;
                                        hp -= weaponDamage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);
                                            world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
                                            player.addXp(10);
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    } else if (block === BlockType.BEE_HIVE) {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? 30;
                                        hp -= weaponDamage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    } else {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? (
                                            BlockRegistry.getHardness(block)
                                        );
                                        
                                        let actualDamage = weaponDamage;
                                        if ((block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) && weapon?.id === 'axe_1') actualDamage *= 5;
                                        const isOresAndMetals = (block >= BlockType.COPPER_ORE && block <= BlockType.PLUTONIUM_ORE) || (block >= BlockType.COPPER_BLOCK && block <= BlockType.PLUTONIUM_BLOCK);
                                        const isStoneGemMetal = block === BlockType.STONE || block === BlockType.GRAVESTONE || isOresAndMetals || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE || block === BlockType.MARBLE || block === BlockType.BLACK_MARBLE || block === BlockType.GREEN_MARBLE || block === BlockType.OBSIDIAN || block === BlockType.LAVA_ROCK || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND || block === BlockType.CLAY_ORE;
                                        
                                        if (isStoneGemMetal && weapon?.id === 'pickaxe_1') actualDamage *= 5;
                                        if (isStoneGemMetal && (player.race === 'HILL DWARF' || player.race === 'MOUNTAIN DWARF' || player.race === 'CYCLOPSE DWARF')) actualDamage *= 2; // Dwarven bonus

                                        if (block === BlockType.CARPENTERS_BENCH && weapon?.id === 'axe_1') actualDamage *= 5;
                                        if (block === BlockType.CHEST && weapon?.id === 'axe_1') actualDamage *= 5;
                                        if (block === BlockType.CAMPFIRE && weapon?.id === 'axe_1') actualDamage *= 5;
                                        if (block === BlockType.WOODEN_STAIRCASE && weapon?.id === 'axe_1') actualDamage *= 5;
                                        
                                        hp -= actualDamage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);

                                            if (player.hasFavoredDeity('RANA') && Math.random() < 0.15) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['gold_piece'], quantity: 1 });
                                            }

                                            if (block === BlockType.TENT || block === BlockType.GOBLIN_CAMP || block === BlockType.GOBLIN_SHAMAN_TENT || block === BlockType.ORC_TENT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['tent'] });
                                            } else if (block === BlockType.GOBLIN_TENT_ROCKHURLER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['goblin_tent_rockhurler'] });
                                            } else if (block === BlockType.GOBLIN_TENT_GARDENER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['goblin_tent_gardener'] });
                                            } else if (block === BlockType.GOBLIN_TENT_BOOMERANGER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['goblin_tent_boomeranger'] });
                                            } else if (block === BlockType.GOBLIN_TENT_ALCHEMIST) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['goblin_tent_alchemist'] });
                                            } else if (block === BlockType.GOBLIN_TENT_MINER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['goblin_tent_miner'] });
                                            } else if (block === BlockType.ORC_TENT_BRUTE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['orc_tent_brute'] });
                                            } else if (block === BlockType.ORC_TENT_SHAMAN) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['orc_tent_shaman'] });
                                            } else if (block === BlockType.ORC_TENT_HUNTER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['orc_tent_hunter'] });
                                            } else if (block === BlockType.KOBOLD_TENT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent'] });
                                            } else if (block === BlockType.KOBOLD_TENT_TRAPPER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent_trapper'] });
                                            } else if (block === BlockType.KOBOLD_TENT_WARRIOR) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent_warrior'] });
                                            } else if (block === BlockType.KOBOLD_TENT_SHAMAN) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent_shaman'] });
                                            } else if (block === BlockType.KOBOLD_TENT_BOMBER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent_bomber'] });
                                            } else if (block === BlockType.KOBOLD_TENT_DRAGONKEEPER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['kobold_tent_dragonkeeper'] });
                                            } else if (block === BlockType.DARK_ELF_TENT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['dark_elf_tent'] });
                                            } else if (block === BlockType.HALFLING_HOUSE_SPAWNER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['halfling_house_spawner'] });
                                            } else if (block === BlockType.PIT_BULL_TENT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['pit_bull_tent'] });
                                            } else if (block === BlockType.POMERANIAN_WAGON) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['pomeranian_wagon'] });
                                            } else if (block === BlockType.TERRIER_TENT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['terrier_tent'] });
                                            } else if (block === BlockType.WOLF_FOLK_CAMP) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['wolf_folk_camp'] });
                                            } else if (block === BlockType.GIANT_CAMP) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['giant_camp'] });
                                            } else if (block === BlockType.TITAN_NEST) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['titan_nest'] });
                                            } else if (block === BlockType.VOID_BEACON) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['void_beacon'] });
                                            } else if (block === BlockType.GARGOYLE_PEDESTAL) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['gargoyle_pedestal'] });
                                            } else if (block === BlockType.DJINN_LAMP_SHRINE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['djinn_lamp_shrine'] });
                                            } else if (block === BlockType.GREMLIN_CAMP) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['gremlin_camp'] });
                                            } else if (block === BlockType.SPHINX_SPAWNER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['sphinx_spawner'] });
                                            } else if (block === BlockType.WOOD_WALL) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['wood'] });
                                                                                } else if (block === BlockType.GIANT_MUSHROOM_STALK) {
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['fungal_spore'] });
                                        let currentZ = pZ + 1;
                                        while (currentZ < WORLD_HEIGHT) {
                                            const aboveBlock = world.getBlock(bx, by, currentZ);
                                            if (aboveBlock === BlockType.GIANT_MUSHROOM_STALK || aboveBlock === BlockType.GIANT_MUSHROOM_CAP_RED || aboveBlock === BlockType.GIANT_MUSHROOM_CAP_BROWN) {
                                                world.setBlock(bx, by, currentZ, BlockType.AIR);
                                                if (aboveBlock === BlockType.GIANT_MUSHROOM_STALK && onDropItem && Math.random() < 0.5) onDropItem(bx, by, currentZ, { ...ITEMS['fungal_spore'] });
                                                for (let lx = -2; lx <= 2; lx++) {
                                                    for (let ly = -2; ly <= 2; ly++) {
                                                        if (lx === 0 && ly === 0) continue;
                                                        const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
                                                        if (leafBlock === BlockType.GIANT_MUSHROOM_CAP_RED || leafBlock === BlockType.GIANT_MUSHROOM_CAP_BROWN || leafBlock === BlockType.GLOWCAP_MUSHROOM) {
                                                            world.setBlock(bx + lx, by + ly, currentZ, BlockType.AIR);
                                                            if (leafBlock === BlockType.GLOWCAP_MUSHROOM && onDropItem && Math.random() < 0.2) onDropItem(bx + lx, by + ly, currentZ, { ...ITEMS['glowcap'] });
                                                        }
                                                    }
                                                }
                                                currentZ++;
                                            } else { break; }
                                        }
                                    } else if (block === BlockType.CLAY_ORE) {
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['clay'], quantity: Math.floor(Math.random() * 3) + 2 });
} else if (block === BlockType.STONE || block === BlockType.GRAVESTONE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['stone'] });
                                            } else if (block === BlockType.COPPER_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['copper_ore'] });
                                            } else if (block === BlockType.IRON_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['iron_ore'] });
                                            } else if (block === BlockType.GREEN_METAL_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['green_metal_ore'] });
                                            } else if (block === BlockType.RED_METAL_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['red_metal_ore'] });
                                            } else if (block === BlockType.MITHRIL_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['mithril_ore'] });
                                            } else if (block === BlockType.COAL_ORE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['coal'] });
                                            } else if (block === BlockType.CHEST) {
                                                const chestInv = world.getChest(bx, by, pZ);
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['storage_chest'], chestInventory: chestInv });
                                                world.chestData.delete(world.getChestKey(bx, by, pZ));
                                            } else if ((block >= BlockType.VILLAGE_BELL && block <= BlockType.BLACK_BELL)) {
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['village_bell'] });
                                                } else if (block === BlockType.ALCHEMY_TABLE) {
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['alchemy_table'] });
                                                } else if (block === BlockType.CARPENTERS_BENCH) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['carpenters_bench'] });
                                            } else if (block === BlockType.COOKING_POT) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['cooking_pot'] });
                                            } else if (block === BlockType.WOODEN_STAIRCASE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['wooden_staircase'] });
                                            } else if (block === BlockType.MARBLE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['marble'] });
                                            } else if (block === BlockType.BLACK_MARBLE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['black_marble'] });
                                            } else if (block === BlockType.GREEN_MARBLE) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['green_marble'] });
                                            } else if (block === BlockType.OBSIDIAN) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['obsidian'] });
                                            } else if (block === BlockType.LAVA_ROCK) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['lava_rock'] });
                                            } else if (block === BlockType.RUBY) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['ruby'] });
                                            } else if (block === BlockType.EMERALD) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['emerald'] });
                                            } else if (block === BlockType.BLACK_DIAMOND) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['black_diamond'] });
                                            } else if (block === BlockType.CONVEYOR_BELT_N || block === BlockType.CONVEYOR_BELT_S || block === BlockType.CONVEYOR_BELT_E || block === BlockType.CONVEYOR_BELT_W) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['conveyor_belt'] });
                                            } else if (block === BlockType.AUTO_MINER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['auto_miner'] });
                                            } else if (block === BlockType.AUTO_DROPPER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['auto_dropper'] });
                                            } else if (block === BlockType.AUTO_CRAFTER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['auto_crafter'] });
                                            } else if (block === BlockType.VACUUM_HOPPER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['vacuum_hopper'] });
                                            } else if (block === BlockType.BONE_PILE_SPAWNER) {
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['bone'], quantity: 5 });
                                            } else if (block === BlockType.POT) {
                                                if (onDropItem && Math.random() < 0.5) {
                                                    const randomLoot = ['gold_piece', 'copper_piece', 'health_potion', 'red_berry', 'slime'];
                                                    const itemToDrop = randomLoot[Math.floor(Math.random() * randomLoot.length)];
                                                    onDropItem(bx, by, pZ, { ...ITEMS[itemToDrop] });
                                                }
                                            } else if (block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) {
                                                const woodType = block === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
                                                let currentZ = pZ + 1;
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
                                                                const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
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
                                            }
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    }
                                    if (onHit) onHit(bx, by, pZ, weaponDamage, block);
                                }
                            }
                        }
                    }
                }
            } else if (!player.hasHitThisSwing) {
                player.hasHitThisSwing = true;
                const reach = player.attackReach;
                const spread = player.attackSpread;
                const pZ = Math.floor(player.z);
                
                if (onMelee) {
                    onMelee(reach, spread, weaponDamage, weapon?.statusEffect);
                    audioEngine.playMelee();
                }
                
                // Sword Beam
                if (isSword && swordTalentLevel >= 3 && player.health >= player.maxHealth / 2) {
                    if (onShoot) {
                        const speed = 20;
                        const vx = Math.cos(player.aimAngle) * speed;
                        const vy = Math.sin(player.aimAngle) * speed;
                        const life = 10.0 / speed; // 10 blocks range
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, weaponDamage, 'MAGIC_SWORD', life);
                                    audioEngine.playShoot();
                    }
                }

                const minX = Math.floor(player.x - reach);
                const maxX = Math.floor(player.x + reach);
                const minY = Math.floor(player.y - reach);
                const maxY = Math.floor(player.y + reach);

                for(let bx = minX; bx <= maxX; bx++) {
                    for(let by = minY; by <= maxY; by++) {
                        let targetZ = pZ;
                        let block = world.getBlock(bx, by, targetZ);
                        const isFarmingTool = weapon?.id === 'hoe_1' || weapon?.id === 'watering_can';

                        if ((block === BlockType.AIR || !isSolid(block) || block === BlockType.CROP_STAGE_1 || block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_3) && isFarmingTool) {
                            if (world.getBlock(bx, by, pZ - 1) !== BlockType.AIR) {
                                targetZ = pZ - 1;
                                block = world.getBlock(bx, by, targetZ);
                            }
                        }
                        
                        let isDestructible = !isIndestructible(block);
                        if (!isDestructible && !(block === BlockType.WATER && weapon?.id === 'fishing_pole')) continue;
                        
                        let blockHit = false;
                        // Sample a 5x5 grid on the block to see if any part of it intersects the attack sector
                        for (let i = 0; i <= 4; i++) {
                            for (let j = 0; j <= 4; j++) {
                                const testX = bx + (i * 0.25);
                                const testY = by + (j * 0.25);
                                const dx = testX - player.x;
                                const dy = testY - player.y;
                                const dist = Math.sqrt(dx*dx + dy*dy);
                                
                                if (dist === 0) {
                                    blockHit = true;
                                    break;
                                } else if (dist <= reach) {
                                    const angle = Math.atan2(dy, dx);
                                    let angleDiff = angle - player.aimAngle;
                                    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                                    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                                    
                                    if (Math.abs(angleDiff) <= spread) {
                                        blockHit = true;
                                        break;
                                    }
                                }
                            }
                            if (blockHit) break;
                        }

                        if (blockHit) {
                            if (block === BlockType.WATER && weapon?.id === 'fishing_pole') {
                                // Add fishing mechanics
                                if (!player.isFishing) {
                                    player.isFishing = true;
                                    
                                    const fishingLevel = player.talents['fishing'] || 0;
                                    let rand = Math.random();
                                    let itemOutput: Item | null = null;
                                    
                                    if (fishingLevel >= 3 && Math.random() < 0.05) {
                                        itemOutput = { ...ITEMS['djinn_lamp'] };
                                    } else if (fishingLevel >= 2 && Math.random() < 0.1) {
                                        itemOutput = { ...ITEMS['golden_fish'] };
                                    } else if (rand < 0.3 + (fishingLevel * 0.15)) {
                                        itemOutput = { ...ITEMS['raw_fish'] };
                                    }
                                    
                                    if (itemOutput) {
                                        // Spawn it slightly randomly 
                                        if (onDropItem) {
                                            onDropItem(bx, by, targetZ + 1, itemOutput);
                                            audioEngine.playSplash(); // We'll need to define this or reuse
                                        }
                                        if (ctx.onAoE) {
                                            ctx.onAoE(bx, by, targetZ, 1, 0, 'WATER'); // Splash visual
                                        }
                                        player.addXp(15);
                                    } else {
                                        if (ctx.onAoE) {
                                            ctx.onAoE(bx, by, targetZ, 0.5, 0, 'WATER'); // Small miss splash
                                        }
                                    }
                                    
                                    // Set a cooldown flag so we only fish one block per swing
                                    const cooldownTime = fishingLevel >= 3 ? 1000 : 2000;
                                    setTimeout(() => { if(player) player.isFishing = false; }, cooldownTime);
                                }
                                break; // Only check one water block per swing
                            } else if (block === BlockType.BEE_HIVE) {
                                const key = `${bx},${by},${pZ}`;
                                let hp = world.blockHealth.get(key) ?? 30; // default health 30
                                hp -= weaponDamage;
                                if (hp <= 0) {
                                    world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    world.blockHealth.delete(key);
                                    if (weapon?.id === 'golden_shovel') {
                                        if (onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['honeycomb'], quantity: Math.floor(Math.random() * 3) + 1 });
                                        }
                                    } else if (weapon?.id === 'shovel_1' && Math.random() < 0.5) {
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['bee_hive'] });
                                    }
                                } else {
                                    world.blockHealth.set(key, hp);
                                }
                            } else if (block === BlockType.DUMMY) {
                                const key = `${bx},${by},${pZ}`;
                                let hp = world.blockHealth.get(key) ?? 50; // default health 50
                                hp -= weaponDamage;
                                if (hp <= 0) {
                                    world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    world.blockHealth.delete(key);
                                    world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
                                    player.addXp(10); // Grant 10 XP
                                } else {
                                    world.blockHealth.set(key, hp);
                                }
                            } else if (block === BlockType.BUSH || block === BlockType.FERN || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH || block === BlockType.DIRT || block === BlockType.GRASS || block === BlockType.TILLED_SOIL_DRY || block === BlockType.CROP_STAGE_1 || block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_3 || block === BlockType.WEED) {
                                if (weapon?.id === 'hoe_1' && (block === BlockType.DIRT || block === BlockType.GRASS || block === BlockType.WEED)) {
                                    world.setBlock(bx, by, targetZ, BlockType.TILLED_SOIL_DRY);
                                } else if (weapon?.id === 'watering_can' && block === BlockType.TILLED_SOIL_DRY) {
                                    world.setBlock(bx, by, targetZ, BlockType.TILLED_SOIL_WET);
                                } else if (block === BlockType.DIRT || block === BlockType.GRASS || block === BlockType.TILLED_SOIL_DRY) {
                                    // if it's dirt/grass and we aren't hoeing/watering it, allow pick/shovel to destroy? 
                                    // Actually we just don't do anything unless it's a shovel/pickaxe
                                    if (weapon?.id?.includes('shovel')) {
                                        world.setBlock(bx, by, targetZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    }
                                } else {
                                    world.setBlock(bx, by, targetZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    if (block === BlockType.RED_BERRY_BUSH && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['red_berry'], quantity: 2 });
                                        onDropItem(bx, by, targetZ, { ...ITEMS['red_berry_seed'], quantity: 2 });
                                    } else if (block === BlockType.BLUE_BERRY_BUSH && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['blue_berry'], quantity: 2 });
                                        onDropItem(bx, by, targetZ, { ...ITEMS['blue_berry_seed'], quantity: 2 });
                                    } else if (block === BlockType.BLACK_BERRY_BUSH && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['black_berry'], quantity: 2 });
                                        onDropItem(bx, by, targetZ, { ...ITEMS['black_berry_seed'], quantity: 2 });
                                    } else if (block === BlockType.YELLOW_BERRY_BUSH && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['yellow_berry'], quantity: 2 });
                                        onDropItem(bx, by, targetZ, { ...ITEMS['yellow_berry_seed'], quantity: 2 });
                                    } else if (block === BlockType.WEED && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['weed'], quantity: Math.floor(Math.random() * 2) + 1 });
                                        onDropItem(bx, by, targetZ, { ...ITEMS['weed_seed'], quantity: Math.floor(Math.random() * 2) + 1 });
                                    } else if (block === BlockType.FERN && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['fern_frond'], quantity: Math.floor(Math.random() * 2) + 1 });
                                    } else if (block === BlockType.CROP_STAGE_3 && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['carrot'], quantity: Math.floor(Math.random() * 2) + 2 }); // 2-3 carrots
                                        onDropItem(bx, by, targetZ, { ...ITEMS['carrot_seed'], quantity: Math.floor(Math.random() * 2) + 1 }); // 1-2 seeds
                                    } else if ((block === BlockType.CROP_STAGE_2 || block === BlockType.CROP_STAGE_1) && onDropItem) {
                                        onDropItem(bx, by, targetZ, { ...ITEMS['carrot_seed'], quantity: 1 }); // refund seed
                                    }
                                }
                            } else {
                                const key = `${bx},${by},${pZ}`;
                                let hp = world.blockHealth.get(key) ?? (
                                    BlockRegistry.getHardness(block)
                                );

                                let actualDamage = weaponDamage;
                                if ((block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) && weapon?.id === 'axe_1') actualDamage *= 5; // Axe is super effective against trees
                                const isOresAndMetals = (block >= BlockType.COPPER_ORE && block <= BlockType.PLUTONIUM_ORE) || (block >= BlockType.COPPER_BLOCK && block <= BlockType.PLUTONIUM_BLOCK);
                                const isStoneGemMetal = block === BlockType.STONE || block === BlockType.GRAVESTONE || isOresAndMetals || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE || block === BlockType.MARBLE || block === BlockType.BLACK_MARBLE || block === BlockType.GREEN_MARBLE || block === BlockType.OBSIDIAN || block === BlockType.LAVA_ROCK || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND || block === BlockType.CLAY_ORE;
                                
                                if (isStoneGemMetal && weapon?.id === 'pickaxe_1') actualDamage *= 5;
                                if (isStoneGemMetal && (player.race === 'HILL DWARF' || player.race === 'MOUNTAIN DWARF' || player.race === 'CYCLOPSE DWARF')) actualDamage *= 2; // Dwarven bonus
                                
                                if (block === BlockType.CARPENTERS_BENCH && weapon?.id === 'axe_1') actualDamage *= 5;
                                if (block === BlockType.CHEST && weapon?.id === 'axe_1') actualDamage *= 5;

                                hp -= actualDamage;
                                if (hp <= 0) {
                                    world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                    world.blockHealth.delete(key);
                                    if (block === BlockType.CHEST) {
                                        const chestInv = world.getChest(bx, by, pZ);
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['storage_chest'], chestInventory: chestInv });
                                        world.chestData.delete(world.getChestKey(bx, by, pZ));
                                    } else if (block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) {
                                        const woodType = block === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
                                        // Dwarf fortress style: destroy all connected trunk/leaves above
                                        let currentZ = pZ + 1;
                                        while (currentZ < WORLD_HEIGHT) {
                                            const aboveBlock = world.getBlock(bx, by, currentZ);
                                            if (aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.LEAVES || aboveBlock === BlockType.PINE_LEAVES || aboveBlock === BlockType.TROPICAL_WOOD || aboveBlock === BlockType.TROPICAL_LEAVES) {
                                                world.setBlock(bx, by, currentZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                                if ((aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.TROPICAL_WOOD) && onDropItem && Math.random() < 0.5) {
                                                    const woodTypeAbove = aboveBlock === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                                    onDropItem(bx, by, currentZ, { ...ITEMS[woodTypeAbove] });
                                                }
                                                // Also clear adjacent leaves
                                                for (let lx = -2; lx <= 2; lx++) {
                                                    for (let ly = -2; ly <= 2; ly++) {
                                                        if (lx === 0 && ly === 0) continue;
                                                        const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
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
                                        if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['fungal_spore'] });
                                        let currentZ = pZ + 1;
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
                                                onDropItem(bx, by, pZ, { ...drop.item, quantity: drop.quantity ?? 1 });
                                            }
                                        }
                                    }
                                    
                                    if (player.hasFavoredDeity('ANIMA') && player.health < player.effectiveMaxHealth && Math.random() < 0.05) {
                                        player.health = Math.min(player.effectiveMaxHealth, player.health + 1);
                                        // audioEngine.playHeal();
                                    }
                                } else {
                                    world.blockHealth.set(key, hp);
                                }
                            }
                            if (onHit) {
                                onHit(bx, by, pZ, weaponDamage, block);
                            }
                        }
                    }
                }
            }
        }

        if (player.attackTimer > 0) {
            player.attackTimer -= dt;
            if (player.attackTimer <= 0) {
                player.isAttacking = false;
            }
        } else {
            player.isAttacking = false;
        }

        // Casting
        if (player.castTimer > 0) {
            player.castTimer -= dt;
            if (player.castTimer <= 0) {
                player.isCasting = false;
            }
        } else {
            player.isCasting = false;
        }

        if (casting && player.castTimer <= 0 && player.activeSpell) {
            const spell = SPELLS[player.activeSpell];
            if (spell && player.mana >= spell.manaCost) {
                let actualCost = spell.manaCost;
                if (spell.type === 'UTILITY') {
                    const travelLevel = player.talents['travel_caster'] || 0;
                    if (travelLevel >= 2) actualCost *= 0.75;
                    if (travelLevel >= 3) actualCost *= 0.5;
                }
                player.mana -= actualCost;
                player.isCasting = true;
                player.hasHitThisCast = false;
                
                let cooldown = spell.cooldown;
                if (player.activeSpell?.endsWith('_bolt')) {
                    const boltCasterLevel = player.talents['bolt_caster'] || 0;
                    if (boltCasterLevel >= 2) cooldown *= 0.8;
                    if (boltCasterLevel >= 3) cooldown *= 0.75; // Total 40% reduction
                }
                
                player.castDuration = cooldown;
                player.castTimer = player.castDuration;
            }
        }

        if (player.isCasting && !player.hasHitThisCast && player.activeSpell) {
            const spell = SPELLS[player.activeSpell];
            if (spell) {
                const castTime = spell.castTime !== undefined ? spell.castTime : player.castDuration * 0.5;
                if (player.castTimer <= player.castDuration - castTime) {
                    player.hasHitThisCast = true;
                    
                    if (onCastSpell) {
                        onCastSpell(player.x, player.y, player.z + 0.5, player.activeSpell, player.aimAngle);
                    }

                    if (spell.type === 'PROJECTILE') {
                        if (onShoot) {
                            const speed = spell.projectileSpeed || 15.0;
                            const vx = Math.cos(player.aimAngle) * speed;
                            const vy = Math.sin(player.aimAngle) * speed;
                            
                            let damage = spell.damage;
                            let reach = spell.reach || 5.0;
                            
                            if (player.activeSpell?.endsWith('_bolt')) {
                                const boltCasterLevel = player.talents['bolt_caster'] || 0;
                                let damageMult = 1.0;
                                if (boltCasterLevel >= 1) {
                                    reach += 2;
                                    damageMult += 0.10;
                                }
                                if (boltCasterLevel >= 2) {
                                    damageMult += 0.15;
                                }
                                if (boltCasterLevel >= 3) {
                                    reach += 4;
                                    damageMult += 0.20;
                                }
                                damage *= damageMult;
                            }
                            
                            const life = reach / speed;
                            
                            onShoot(player.x, player.y, player.z + 0.5, vx, vy, damage, spell.damageType, life);
                                    audioEngine.playShoot();
                        }
                    } else if (spell.type === 'UTILITY') {
                        if (player.activeSpell === 'mark') {
                            player.markPosition = { x: player.x, y: player.y, z: player.z, planet: world.activePlanet };
                            if (player.onMessage) player.onMessage("Mark placed!");
                        } else if (player.activeSpell === 'return') {
                            if (player.markPosition) {
                                if (player.markPosition.planet && player.markPosition.planet !== world.activePlanet && ctx.onChangePlanet) {
                                    ctx.onChangePlanet(player.markPosition.planet);
                                }
                                player.x = player.markPosition.x;
                                player.y = player.markPosition.y;
                                player.z = player.markPosition.z;
                                if (player.onMessage) player.onMessage("Returned to mark!");
                            } else {
                                if (player.onMessage) player.onMessage("No mark found!");
                            }
                        } else if (player.activeSpell?.startsWith('portal_')) {
                            const color = player.activeSpell.split('_')[1];
                            player.portals[color] = { x: player.x, y: player.y, z: player.z, planet: world.activePlanet };
                            if (player.onMessage) player.onMessage(`${color.charAt(0).toUpperCase() + color.slice(1)} Portal placed!`);
                        }
                    } else if (spell.type === 'CONE') {
                        if (onMelee) {
                            let dmg = spell.damage;
                            if (player.race === 'BEAR FOLK' || player.race === 'ORC' || player.race === 'DARK ORC' || player.race === 'OGRE' || player.race === 'PIT BULL FOLK' || player.race === 'WOLF FOLK') {
                                dmg = Math.floor(dmg * 1.25);
                            }
                            onMelee(spell.reach, spell.spread, dmg);
                    audioEngine.playMelee();
                        }
                    } else if (spell.type === 'AOE') {
                        let reach = spell.reach;
                        let damage = spell.damage;
                        const ballCasterLevel = player.talents['ball_caster'] || 0;
                        if (ballCasterLevel >= 1) reach += 1;
                        if (ballCasterLevel >= 2) { reach += 1; damage *= 1.15; }
                        if (ballCasterLevel >= 3) { reach += 1; damage *= 1.25; }
                        
                        if (onAoE) {
                            onAoE(player.x, player.y, player.z + 0.5, reach, damage, spell.damageType, spell.statusEffect);
                        }
                        
                        const radius = reach;
                        const pZ = Math.floor(player.z);
                        const minX = Math.floor(player.x - radius);
                        const maxX = Math.floor(player.x + radius);
                        const minY = Math.floor(player.y - radius);
                        const maxY = Math.floor(player.y + radius);

                        for(let bx = minX; bx <= maxX; bx++) {
                            for(let by = minY; by <= maxY; by++) {
                                const dx = bx + 0.5 - player.x;
                                const dy = by + 0.5 - player.y;
                                if (dx*dx + dy*dy <= radius*radius) {
                                    const block = world.getBlock(bx, by, pZ);
                                    if (!isIndestructible(block)) {
                                        if (block === BlockType.BUSH || block === BlockType.FERN || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH || block === BlockType.DIRT || block === BlockType.GRASS) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            let mult = player.race === 'RABBIT FOLK' ? 2 : 1;
                                            if (block === BlockType.RED_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['red_berry'], quantity: 2 * mult });
                                                onDropItem(bx, by, pZ, { ...ITEMS['red_berry_seed'], quantity: 2 * mult });
                                            } else if (block === BlockType.BLUE_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['blue_berry'], quantity: 2 * mult });
                                                onDropItem(bx, by, pZ, { ...ITEMS['blue_berry_seed'], quantity: 2 * mult });
                                            } else if (block === BlockType.BLACK_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['black_berry'], quantity: 2 * mult });
                                                onDropItem(bx, by, pZ, { ...ITEMS['black_berry_seed'], quantity: 2 * mult });
                                            } else if (block === BlockType.YELLOW_BERRY_BUSH && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry'], quantity: 2 * mult });
                                                onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry_seed'], quantity: 2 * mult });
                                            } else if (block === BlockType.FERN && onDropItem) {
                                                onDropItem(bx, by, pZ, { ...ITEMS['fern_frond'], quantity: Math.floor(Math.random() * 2 * mult) + 1 });
                                            }
                                        } else if (block === BlockType.DUMMY) {
                                            const key = `${bx},${by},${pZ}`;
                                            let hp = world.blockHealth.get(key) ?? 50;
                                            hp -= (spell.type === 'AOE' ? damage : spell.damage);
                                            if (hp <= 0) {
                                                world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                                world.blockHealth.delete(key);
                                                world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
                                                player.addXp(10);
                                            } else {
                                                world.blockHealth.set(key, hp);
                                            }
                                        } else if (block === BlockType.BEE_HIVE) {
                                            const key = `${bx},${by},${pZ}`;
                                            let hp = world.blockHealth.get(key) ?? 30;
                                            hp -= (spell.type === 'AOE' ? damage : spell.damage);
                                            if (hp <= 0) {
                                                world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                                world.blockHealth.delete(key);
                                            } else {
                                                world.blockHealth.set(key, hp);
                                            }
                                        } else {
                                            const key = `${bx},${by},${pZ}`;
                                            let hp = world.blockHealth.get(key) ?? (
                                                BlockRegistry.getHardness(block)
                                            );
                                            let appliedDamage = (spell.type === 'AOE' ? damage : spell.damage);
                                            if (player.race === 'HILL DWARF' || player.race === 'MOUNTAIN DWARF' || player.race === 'CYCLOPSE DWARF') {
                                                if (block === BlockType.STONE || block === BlockType.HEAVY_STONE || block === BlockType.COPPER_ORE || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) {
                                                    appliedDamage *= 2;
                                                }
                                            }
                                            hp -= appliedDamage;
                                            if (hp <= 0) {
                                                world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                                world.blockHealth.delete(key);
                                                if (block === BlockType.CHEST) {
                                                    const chestInv = world.getChest(bx, by, pZ);
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['storage_chest'], chestInventory: chestInv });
                                                    world.chestData.delete(world.getChestKey(bx, by, pZ));
                                                } else if (block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) {
                                                    const woodType = block === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
                                                    let currentZ = pZ + 1;
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
                                                                    const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
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
                                                            onDropItem(bx, by, pZ, { ...drop.item, quantity: qty });
                                                        }
                                                    }
                                                }
                                            } else {
                                                world.blockHealth.set(key, hp);
                                            }

                                            if (player.hasFavoredDeity('ANIMA') && player.health < player.effectiveMaxHealth && Math.random() < 0.05) {
                                                player.health = Math.min(player.effectiveMaxHealth, player.health + 1);
                                                // audioEngine.playHeal(); // Provide audio feedback if healing happens
                                            }
                                        }
                                        if (onHit) onHit(bx, by, pZ, (spell.type === 'AOE' ? damage : spell.damage), block);
                                    }
                                }
                            }
                        }
                    } else {
                        // Handle damage for cone AoE
                        const reach = spell.reach;
                        const spread = spell.spread;
                        const pZ = Math.floor(player.z);

                        const minX = Math.floor(player.x - reach);
                        const maxX = Math.floor(player.x + reach);
                        const minY = Math.floor(player.y - reach);
                        const maxY = Math.floor(player.y + reach);

                        for(let bx = minX; bx <= maxX; bx++) {
                            for(let by = minY; by <= maxY; by++) {
                                const block = world.getBlock(bx, by, pZ);
                                if (isIndestructible(block)) continue;
                                
                                let blockHit = false;
                                for (let i = 0; i <= 4; i++) {
                                    for (let j = 0; j <= 4; j++) {
                                        const testX = bx + (i * 0.25);
                                        const testY = by + (j * 0.25);
                                        const dx = testX - player.x;
                                        const dy = testY - player.y;
                                        const dist = Math.sqrt(dx*dx + dy*dy);
                                        
                                        if (dist === 0) {
                                            blockHit = true;
                                            break;
                                        } else if (dist <= reach) {
                                            const angle = Math.atan2(dy, dx);
                                            let angleDiff = angle - player.aimAngle;
                                            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                                            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                                            
                                            if (Math.abs(angleDiff) <= spread) {
                                                blockHit = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (blockHit) break;
                                }

                                if (blockHit) {
                                    if (block === BlockType.BUSH || block === BlockType.FERN || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH || block === BlockType.DIRT || block === BlockType.GRASS) {
                                        world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                        let mult = player.race === 'RABBIT FOLK' ? 2 : 1;
                                        if (block === BlockType.RED_BERRY_BUSH && onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['red_berry'], quantity: 2 * mult });
                                            onDropItem(bx, by, pZ, { ...ITEMS['red_berry_seed'], quantity: 2 * mult });
                                        } else if (block === BlockType.BLUE_BERRY_BUSH && onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['blue_berry'], quantity: 2 * mult });
                                            onDropItem(bx, by, pZ, { ...ITEMS['blue_berry_seed'], quantity: 2 * mult });
                                        } else if (block === BlockType.BLACK_BERRY_BUSH && onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['black_berry'], quantity: 2 * mult });
                                            onDropItem(bx, by, pZ, { ...ITEMS['black_berry_seed'], quantity: 2 * mult });
                                        } else if (block === BlockType.YELLOW_BERRY_BUSH && onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry'], quantity: 2 * mult });
                                            onDropItem(bx, by, pZ, { ...ITEMS['yellow_berry_seed'], quantity: 2 * mult });
                                        } else if (block === BlockType.FERN && onDropItem) {
                                            onDropItem(bx, by, pZ, { ...ITEMS['fern_frond'], quantity: Math.floor(Math.random() * 2 * mult) + 1 });
                                        }
                                    } else if (block === BlockType.BEE_HIVE) {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? 30;
                                        hp -= spell.damage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    } else if (block === BlockType.DUMMY) {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? 50;
                                        hp -= spell.damage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);
                                            world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
                                            player.addXp(10);
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    } else {
                                        const key = `${bx},${by},${pZ}`;
                                        let hp = world.blockHealth.get(key) ?? (
                                                BlockRegistry.getHardness(block)
                                            );
                                        let appliedDamage = spell.damage;
                                        if (player.race === 'HILL DWARF' || player.race === 'MOUNTAIN DWARF' || player.race === 'CYCLOPSE DWARF') {
                                            if (block === BlockType.STONE || block === BlockType.HEAVY_STONE || block === BlockType.COPPER_ORE || block === BlockType.IRON_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.COAL_ORE || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) {
                                                appliedDamage *= 2;
                                            }
                                        }
                                        hp -= appliedDamage;
                                        if (hp <= 0) {
                                            world.setBlock(bx, by, pZ, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                                            world.blockHealth.delete(key);
                                            if (block === BlockType.CHEST) {
                                                const chestInv = world.getChest(bx, by, pZ);
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['storage_chest'], chestInventory: chestInv });
                                                world.chestData.delete(world.getChestKey(bx, by, pZ));
                                            } else if (block === BlockType.TRUNK || block === BlockType.TROPICAL_WOOD) {
                                                const woodType = block === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
                                                let currentZ = pZ + 1;
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
                                                                const leafBlock = world.getBlock(bx + lx, by + ly, currentZ);
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
                                                        onDropItem(bx, by, pZ, { ...drop.item, quantity: qty });
                                                    }
                                                }
                                            }

                                            if (player.hasFavoredDeity('ANIMA') && player.health < player.effectiveMaxHealth && Math.random() < 0.05) {
                                                player.health = Math.min(player.effectiveMaxHealth, player.health + 1);
                                                // audioEngine.playHeal();
                                            }
                                        } else {
                                            world.blockHealth.set(key, hp);
                                        }
                                    }
                                    if (onHit) {
                                        onHit(bx, by, pZ, spell.damage, block);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        
    }
}
