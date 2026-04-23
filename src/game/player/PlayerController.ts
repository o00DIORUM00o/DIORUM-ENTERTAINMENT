import { Player, UpdateContext } from '../Player';
import { isSolid } from '../World';
import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_RADIUS_CHUNKS } from '../Constants';
import { audioEngine } from '../AudioEngine';

export class PlayerController {
        static update(player: Player, ctx: UpdateContext) {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;
// Dash logic
        if (player.dashCooldown > 0) player.dashCooldown -= dt;
        
        let staminaRegenBlocked = false;

        const sneakTalentLevel = player.talents['sneak'] || 0;
        if (player.isSneaking && sneakTalentLevel > 0) {
            let drainRate = 5;
            if (sneakTalentLevel >= 2) drainRate = 3;
            if (sneakTalentLevel >= 3) drainRate = 1;
            player.stamina -= drainRate * dt;
            staminaRegenBlocked = true;
            if (player.stamina <= 0) {
                player.stamina = 0;
                player.isSneaking = false;
            }
        }
        
        const dashTalentLevel = player.talents['dash'] || 0;
        if (dashTalentLevel > 0 && dashing && player.dashCooldown <= 0 && !player.isDashing && (dx !== 0 || dy !== 0) && player.stamina >= 20) {
            player.isDashing = true;
            player.dashDuration = dashTalentLevel === 1 ? 0.15 : 0.3; // Short vs Long dash
            player.dashTimer = player.dashDuration;
            player.dashCooldown = 1.0; // 1 second cooldown
            player.stamina -= 20; // Consume 20 stamina
            (this as any).hasHitThisDash = false;
        }

        if (player.isDashing) {
            player.dashTimer -= dt;
            
            // Dash Attack
            const weapon = player.equipment['MAIN_HAND'];
            const isSword = weapon?.id?.includes('sword') || false;
            const swordTalentLevel = player.talents['swords'] || 0;
            
            if (isSword && swordTalentLevel >= 2 && !(this as any).hasHitThisDash) {
                // Deal damage in a small radius around the player while dashing
                if (onMelee) {
                    let weaponDamage = weapon?.damage || 1;
                    let damageMult = 1.0;
                    if (swordTalentLevel >= 1) damageMult += 0.10;
                    if (swordTalentLevel >= 2) damageMult += 0.20;
                    if (swordTalentLevel >= 3) damageMult += 0.30;
                    weaponDamage *= damageMult;
                    
                    onMelee(1.5, Math.PI * 2, weaponDamage);
                    audioEngine.playMelee(); // 1.5 reach, 360 spread
                    (this as any).hasHitThisDash = true;
                }
            }
            
            if (player.dashTimer <= 0) {
                player.isDashing = false;
            }
        }

        // Movement (speed in tiles per second)
        let speed = player.isMounted && player.activeMount ? player.activeMount.speed : player.effectiveSpeed;
        if (player.isMounted && player.activeMount) {
            const ridingTalentLevel = player.talents['riding'] || 0;
            if (ridingTalentLevel > 0) {
                speed *= (1 + (ridingTalentLevel * 0.1));
            }
        }
        
        if (player.buffs.speed > 0) speed *= 1.5;

        if (player.isSneaking) {
            speed *= 0.5;
            const sneakLevel = player.talents['sneak'] || 0;
            let staminaDrain = 10;
            if (sneakLevel === 1) staminaDrain = 8;
            if (sneakLevel === 2) staminaDrain = 5;
            if (sneakLevel >= 3) staminaDrain = 2;
            
            if (dx !== 0 || dy !== 0) {
                player.stamina -= staminaDrain * dt;
                if (player.stamina <= 0) {
                    player.stamina = 0;
                    player.isSneaking = false;
                    speed *= 2.0; // Restore speed
                }
            }
        }

        if (player.isDashing) speed = player.dashSpeed;
        
        if ((player as any).isFreezing) speed *= 0.5;
        if ((player as any).inMud) speed *= 0.6;
        
        let moveDx = dx;
        let moveDy = dy;
        const isGliding = player.equipment['BODY']?.id === 'glider_wings' && jumpDown && player.vz < 0;
        
        if (isGliding) {
            speed *= 2.0; // Faster horizontal movement
            // If no movement input, glide forward based on aim
            if (moveDx === 0 && moveDy === 0) {
                moveDx = Math.cos(player.aimAngle);
                moveDy = Math.sin(player.aimAngle);
            }
        }
        
        let newX = player.x + moveDx * speed * dt;
        let newY = player.y + moveDy * speed * dt;

        // World boundary check
        const maxTile = WORLD_RADIUS_CHUNKS * CHUNK_SIZE;
        if (newX < -maxTile) newX = -maxTile;
        if (newX > maxTile) newX = maxTile;
        if (newY < -maxTile) newY = -maxTile;
        if (newY > maxTile) newY = maxTile;

        const currentZ = Math.floor(player.z);
        const blockAtNewPos = world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
        const hitBuggyRamp = blockAtNewPos === BlockType.BUGGY_RAMP && player.isMounted && player.activeMount?.type === 'GNOME_BUGGY';

        if (isSolid(blockAtNewPos)) {
            // Try step up
            const blockAbove = world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
            if (!isSolid(blockAbove)) {
                player.z = currentZ + 1;
                player.x = newX;
                player.y = newY;
            } else {
                // Slide along walls
                const blockX = world.getBlock(Math.floor(newX), Math.floor(player.y), currentZ);
                if (!isSolid(blockX)) player.x = newX;
                const blockY = world.getBlock(Math.floor(player.x), Math.floor(newY), currentZ);
                if (!isSolid(blockY)) player.y = newY;
            }
        } else {
            player.x = newX;
            player.y = newY;
            if (hitBuggyRamp && player.vz <= 5.0) {
                player.vz = 25.0; // catch air!
            }
        }

        // Gravity and Jump mechanics
        const hasAntigravity = player.equipment['NECKLACE']?.id === 'antigravity_artifact';
        const isSkyship = player.isMounted && player.activeMount && player.activeMount.type === 'SKYSHIP';
        const isEagle = player.isMounted && player.activeMount && player.activeMount.type === 'GIANT_EAGLE';
        const isBoat = player.isMounted && player.activeMount && player.activeMount.type === 'BOAT';
        
        let gravity = 30.0;
        
        if (hasAntigravity || isSkyship || isEagle) {
            if (jumpDown) {
                gravity = -15.0; // Ascend
                if (player.vz > (isEagle ? 15.0 : 10.0)) player.vz = isEagle ? 15.0 : 10.0; // Cap ascent speed
            } else if (player.vz < (isSkyship || isEagle ? -0.5 : -2.0)) {
                gravity = 0.0; // Float slowly
                player.vz = isSkyship || isEagle ? -0.5 : -2.0; // Cap fall speed
            }
        } else if (isGliding) {
            gravity = 5.0; // Slow falling
            if (player.vz < -3.0) player.vz = -3.0; // Terminal velocity while gliding
        }
        
        player.vz -= gravity * dt;
        player.z += player.vz * dt;

        const blockStandingOn = world.getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z - 0.01));
        const blockInside = world.getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z));

        if (isBoat) {
            if (blockInside === BlockType.WATER) {
                // Instantly snap to the surface of the water if we are mostly inside it
                player.z = Math.floor(player.z) + 1;
                if (player.vz < 0) player.vz = 0;
            } else if (blockStandingOn === BlockType.WATER) {
                // If standing exactly on water
                if (player.vz < 0) {
                    player.z = Math.floor(player.z - 0.01) + 1;
                    player.vz = 0;
                }
            }
        }

        if (isSolid(blockStandingOn)) {
            if (player.vz <= 0) { // Only snap if we aren't currently flying up
                player.z = Math.floor(player.z - 0.01) + 1;
                player.vz = 0;
            }
            
            if (blockStandingOn === BlockType.CONVEYOR_BELT_N) { player.y -= 3.0 * dt; }
            else if (blockStandingOn === BlockType.CONVEYOR_BELT_S) { player.y += 3.0 * dt; }
            else if (blockStandingOn === BlockType.CONVEYOR_BELT_E) { player.x += 3.0 * dt; }
            else if (blockStandingOn === BlockType.CONVEYOR_BELT_W) { player.x -= 3.0 * dt; }
            
            // Jump or Liftoff logic
            if (jumping) {
                if (hasAntigravity || isSkyship || isEagle) {
                    player.vz = isEagle ? 25.0 : 15.0; // Guaranteed liftoff speed
                } else if (!isBoat && player.stamina >= 10 && (player.talents['jump'] || 0) > 0) {
                    player.vz = player.isMounted && player.activeMount ? player.activeMount.jumpPower : 12.0;
                    player.stamina -= 10;
                }
            }
        } else if (isBoat && blockStandingOn === BlockType.WATER) {
            // Can't jump normally from boat
            if (jumping) {
                // Maybe a tiny hop to get on land
                player.vz = 5.0;
            }
        }
        
        // Environmental Hazards
        const blockStandingIn = world.getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z));
        const blockStandingOnEnv = world.getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z - 0.01));
        
        let inLava = false;
        if (blockStandingIn === BlockType.LAVA) {
            inLava = true;
            player.health -= 20 * dt; // 20 damage per second
        } else if (blockStandingIn === BlockType.POISON_WATER) {
            player.health -= 10 * dt; // Poison hurts
        }
        if (player.health < 0) player.health = 0;

        if (world.activePlanet === 'ARETH') {
            // Check for heat resistance (e.g., ring of ice, or nearby ice)
            let hasHeatResistance = false;
            for (const slotKey in player.equipment) {
                const item = player.equipment[slotKey as keyof typeof player.equipment];
                if (item && item.id.toLowerCase().includes('ice')) {
                    hasHeatResistance = true;
                    break;
                }
            }
            
            if (!hasHeatResistance) {
                // Ambient stamina drain. Natural regen is 10/sec, so subtract 15/sec to get net -5/sec
                if (!inLava) {
                    player.stamina -= 15 * dt; 
                    
                    if (player.stamina <= 0) {
                        player.stamina = 0;
                        player.health -= 2 * dt; // Start taking heat damage if out of stamina
                    }
                }
            }
        } else if (world.activePlanet === 'TARHE') {
            let hasColdResistance = false;
            
            // Check for campfire proximity
            for (let dx = -3; dx <= 3; dx++) {
                for (let dy = -3; dy <= 3; dy++) {
                    for (let dz = -2; dz <= 2; dz++) {
                         if (world.getBlock(Math.floor(player.x) + dx, Math.floor(player.y) + dy, Math.floor(player.z) + dz) === BlockType.CAMPFIRE) {
                             hasColdResistance = true;
                         }
                    }
                }
            }

            // Check equipment (torch or fur/leather)
            if (player.equipment['MAIN_HAND'] && player.equipment['MAIN_HAND'].id === 'torch') hasColdResistance = true;
            else if (player.equipment['OFF_HAND'] && player.equipment['OFF_HAND'].id === 'torch') hasColdResistance = true;
            else {
                 for (const slotKey in player.equipment) {
                     const item = player.equipment[slotKey as keyof typeof player.equipment];
                     if (item && (item.id.toLowerCase().includes('leather') || item.id.toLowerCase().includes('cloth'))) {
                         hasColdResistance = true;
                         break;
                     }
                 }
            }

            if (!hasColdResistance) {
                // Freezing
                player.stamina -= 8 * dt; // Minor stamina drain
                if (player.stamina <= 0) {
                    player.stamina = 0;
                    player.health -= 5 * dt; // Frostbite damage
                }
            }
            (player as any).isFreezing = !hasColdResistance;
        } else if (world.activePlanet === 'TERHA') {
            // Miasma sickness / Deep Mud
            let hasFilthResistance = false;
            for (const slotKey in player.equipment) {
                const item = player.equipment[slotKey as keyof typeof player.equipment];
                // gas mask or amulet of purity, maybe bandana? We'll check for "mask" or "purity" or "nature"
                if (item && (item.id.toLowerCase().includes('mask') || item.id.toLowerCase().includes('amulet_of_nature'))) {
                    hasFilthResistance = true;
                    break;
                }
            }
            // Terha naturally saps health slowly if undefended
            if (!hasFilthResistance) {
                player.health -= 2.0 * dt; // 2.0 per sec ambient poison, bypass takeDamage array
                if (player.health < 0) player.health = 0;
            }
            
            if (blockStandingOnEnv === BlockType.MUD || blockStandingOnEnv === BlockType.SWAMP_DIRT) {
                (player as any).inMud = true;
            } else {
                (player as any).inMud = false;
            }
        }
        
    }
}
