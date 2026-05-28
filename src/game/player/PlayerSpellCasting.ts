import { Player, UpdateContext } from '../Player';
import { World, isIndestructible } from '../World';
import { SPELLS } from '../Inventory';
import { PlayerBlockInteraction } from './PlayerBlockInteraction';
import { audioEngine } from '../AudioEngine';

export class PlayerSpellCasting {
    static handleCasting(player: Player, world: World, dt: number, casting: boolean, ctx: UpdateContext, onCastSpell: any, onShoot: any, onMelee: any, onAoE: any, onDropItem: any, onHit: any) {
        if (player.activeSpell === 'eye') {
            if (casting && player.mana > 1) {
                if (!player.isEyeMode) {
                    player.isEyeMode = true;
                    player.eyeReturnPos = { x: player.x, y: player.y, z: player.z };
                    player.mana -= SPELLS['eye'].manaCost || 10;
                    if (onCastSpell) onCastSpell(player.x, player.y, player.z + 0.5, 'eye', player.aimAngle);
                }
                player.mana -= 10 * dt;
                
                if (player.mana <= 0) {
                    player.isEyeMode = false;
                    if (player.eyeReturnPos) {
                        player.x = player.eyeReturnPos.x;
                        player.y = player.eyeReturnPos.y;
                        player.z = player.eyeReturnPos.z;
                        player.eyeReturnPos = null;
                    }
                }
                return;
            } else if (player.isEyeMode && !casting) {
                player.isEyeMode = false;
                if (player.eyeReturnPos) {
                    player.x = player.eyeReturnPos.x;
                    player.y = player.eyeReturnPos.y;
                    player.z = player.eyeReturnPos.z;
                    player.eyeReturnPos = null;
                }
            }
        }

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
                let actualCastTime = spell.castTime;
                
                if (player.activeSpell?.endsWith('_bolt')) {
                    const boltCasterLevel = player.talents['bolt_caster'] || 0;
                    if (boltCasterLevel >= 2) cooldown *= 0.8;
                    if (boltCasterLevel >= 3) cooldown *= 0.75; // Total 40% reduction
                }
                
                if (player.activeSpell?.startsWith('rune_')) {
                    const runeCasterLevel = player.talents['rune_caster'] || 0;
                    if (runeCasterLevel >= 2) {
                        cooldown *= 0.85;
                        if (actualCastTime) actualCastTime *= 0.85;
                    }
                    if (runeCasterLevel >= 3) {
                        cooldown *= 0.85;
                        if (actualCastTime) actualCastTime *= 0.85;
                    }
                }
                
                player.castDuration = cooldown;
                player.castTimer = player.castDuration;
            }
        }

        if (player.isCasting && !player.hasHitThisCast && player.activeSpell) {
            const spell = SPELLS[player.activeSpell];
            if (spell) {
                let castTimeCalc = spell.castTime !== undefined ? spell.castTime : player.castDuration * 0.5;
                if (player.activeSpell?.startsWith('rune_')) {
                    const runeCasterLevel = player.talents['rune_caster'] || 0;
                    if (runeCasterLevel >= 2) castTimeCalc *= 0.85;
                    if (runeCasterLevel >= 3) castTimeCalc *= 0.85;
                }
                const castTime = castTimeCalc;
                if (player.castTimer <= player.castDuration - castTime) {
                    player.hasHitThisCast = true;
                    
                    if (onCastSpell) {
                        onCastSpell(player.x, player.y, player.z + 0.5, player.activeSpell, player.aimAngle);
                    }

                    
                    if (spell.type === 'PROJECTILE') {
                        if (onShoot) {
                            let speed = spell.projectileSpeed || 15.0;
                            let life = spell.reach / speed;
                            if (spell.id.includes('vortice')) {
                                speed = 3.0; // Slow moving
                                life = 5.0; // Persists for 5 seconds
                            }
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
                            
                            if (!spell.id.includes("vortice")) { life = reach / speed; }
                            
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

                        if (player.activeSpell?.startsWith('rune_')) {
                            const runeCasterLevel = player.talents['rune_caster'] || 0;
                            if (runeCasterLevel >= 3) damage *= 1.25;
                        }
                        
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
                                        PlayerBlockInteraction.damageBlock(player, world, bx, by, pZ, (spell.type === 'AOE' ? damage : spell.damage), null, onDropItem, onHit, ctx);
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
                                    PlayerBlockInteraction.damageBlock(player, world, bx, by, pZ, spell.damage, null, onDropItem, onHit, ctx);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
