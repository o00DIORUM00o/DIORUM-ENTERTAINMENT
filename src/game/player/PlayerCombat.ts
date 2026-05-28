import { Player, UpdateContext } from '../Player';
import { World, isSolid, isIndestructible, getLootForBlock } from '../World';
import { BlockType } from '../constants/BlockType';
import { Item, EquipmentSlot, ITEMS, SPELLS } from '../Inventory';
import { BlockRegistry } from '../registries/BlockRegistry';
import { audioEngine } from '../AudioEngine';
import { WORLD_HEIGHT } from '../Constants';

import { PlayerBlockInteraction } from './PlayerBlockInteraction';
import { PlayerSpellCasting } from './PlayerSpellCasting';

export class PlayerCombat {
        static update(player: Player, ctx: UpdateContext) {
        let { engine, world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;

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
                if (player.isMounted && player.activeMount) {
                    if (player.activeMount.type === 'MAGITECH_MECH') {
                        player.attackDuration = 0.5;
                        player.attackReach = 15.0;
                    } else if ((player.activeMount.type.endsWith('_DRAGON') || player.activeMount.type === 'FIRE_DRAGON')) {
                        player.attackDuration = 0.8;
                        player.attackReach = 15.0;
                    } else if (player.activeMount.type === 'T_REX') {
                        player.attackDuration = 0.8;
                        player.attackReach = 3.5;
                    } else if (player.activeMount.type === 'WILD_RAPTOR' || player.activeMount.type === 'GIANT_EAGLE' || player.activeMount.type === 'PTERODACTYL') {
                        player.attackDuration = 0.5;
                        player.attackReach = 3.5;
                    }
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

                        // Spin attack visual splash
                        if (engine) {
                            for (let i = 0; i < 30; i++) {
                                const angle = (i / 30) * Math.PI * 2;
                                const dist = player.attackReach;
                                engine.particles.push({
                                    x: player.x + Math.cos(angle) * dist,
                                    y: player.y + Math.sin(angle) * dist,
                                    z: player.z + 0.5,
                                    text: '✦',
                                    color: weapon?.itemColor || '#ffffff',
                                    life: 0.4, maxLife: 0.4,
                                    vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, vz: Math.random() * 2,
                                    speed: 0
                                });
                            }
                        }

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
                        if (weapon && weapon.secondaryAbility) {
                            const manaCost = weapon.chargeManaCost || 0;
                            const stamCost = weapon.chargeStaminaCost || 0;
                            if (player.mana >= manaCost && player.stamina >= stamCost) {
                                player.mana -= manaCost;
                                player.stamina -= stamCost;
                                if (weapon.secondaryAbility === 'BLINK') {
                                    player.castBlink(ctx);
                                } else if (ctx.onTriggerSecondary) {
                                    ctx.onTriggerSecondary(weapon.secondaryAbility, player.aimAngle, player.x, player.y, player.z);
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
            } else if (player.isMounted && player.activeMount && (player.activeMount.type === 'GIANT_EAGLE' || player.activeMount.type === 'PTERODACTYL' || player.activeMount.type === 'WILD_RAPTOR' || player.activeMount.type === 'T_REX' || (player.activeMount.type.endsWith('_DRAGON') || player.activeMount.type === 'FIRE_DRAGON'))) {
                if (!player.hasHitThisSwing) {
                    player.hasHitThisSwing = true;
                    if ((player.activeMount.type.endsWith('_DRAGON') || player.activeMount.type === 'FIRE_DRAGON') && onShoot) {
                        const speed = 20;
                        const vx = Math.cos(player.aimAngle) * speed;
                        const vy = Math.sin(player.aimAngle) * speed;
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, 120, 'EXPLOSION', 12.0 / speed); // Fireball
                        audioEngine.playShoot();
                    } else if (onMelee) {
                        const dmg = player.activeMount.type === 'T_REX' ? 80 : 45;
                        onMelee(3.5, Math.PI / 2, dmg); 
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
                        
                        onShoot(player.x, player.y, player.z + 0.5, vx, vy, weaponDamage, 'BOOMERANG', life, weapon.statusEffect);
                        
                        if (weapon.id === 'splitting_boomerang') {
                            const vx1 = Math.cos(player.aimAngle - 0.2) * speed;
                            const vy1 = Math.sin(player.aimAngle - 0.2) * speed;
                            onShoot(player.x, player.y, player.z + 0.5, vx1, vy1, weaponDamage, 'BOOMERANG', life, weapon.statusEffect);
                            const vx2 = Math.cos(player.aimAngle + 0.2) * speed;
                            const vy2 = Math.sin(player.aimAngle + 0.2) * speed;
                            onShoot(player.x, player.y, player.z + 0.5, vx2, vy2, weaponDamage, 'BOOMERANG', life, weapon.statusEffect);
                        }
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
                                    PlayerBlockInteraction.damageBlock(player, world, bx, by, pZ, weaponDamage, weapon, onDropItem, onHit, ctx);
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
                        const beamMod = weapon?.swordBeamModifier;
                        let speed = 20;
                        let scale = 1.0;
                        let count = 1;
                        let angleSpread = 0;
                        let pierce = false;

                        let homing = false;
                        let bounce = false;

                        if (beamMod === 'GIANT') {
                            speed = 10;
                            scale = 3.0;
                        } else if (beamMod === 'SPREAD') {
                            count = 3;
                            angleSpread = Math.PI / 8; // 22.5 degrees spread
                        } else if (beamMod === 'BURST') {
                            count = 8;
                            angleSpread = Math.PI / 4; 
                        } else if (beamMod === 'RAPID') {
                            speed = 30; // Faster moving, duration adjustment handled via life formula
                        } else if (beamMod === 'PIERCE') {
                            pierce = true;
                        } else if (beamMod === 'HOMING') {
                            homing = true;
                        } else if (beamMod === 'BOUNCE') {
                            bounce = true;
                        }

                        for(let i=0; i<count; i++) {
                            const angleOffset = (i - Math.floor(count/2)) * angleSpread;
                            const curAngle = player.aimAngle + angleOffset;
                            const vx = Math.cos(curAngle) * speed;
                            const vy = Math.sin(curAngle) * speed;
                            const life = 10.0 / speed; // 10 blocks range
                            if (engine) {
                                engine.projectiles.push({
                                    x: player.x,
                                    y: player.y,
                                    z: player.z + 0.5,
                                    vx, vy, damage: weaponDamage,
                                    life, damageType: 'MAGIC_SWORD',
                                    isPlayer: true,
                                    scale, pierce,
                                    isHoming: homing,
                                    bounce: bounce ? 3 : 0,
                                    owner: player
                                });
                            } else {
                                onShoot(player.x, player.y, player.z + 0.5, vx, vy, weaponDamage, 'MAGIC_SWORD', life, undefined, scale, pierce);
                            }
                        }
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
                            PlayerBlockInteraction.damageBlock(player, world, bx, by, targetZ, weaponDamage, weapon, onDropItem, onHit, ctx);
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

        PlayerSpellCasting.handleCasting(player, world, dt, casting, ctx, onCastSpell, onShoot, onMelee, onAoE, onDropItem, onHit);

        
    }
}