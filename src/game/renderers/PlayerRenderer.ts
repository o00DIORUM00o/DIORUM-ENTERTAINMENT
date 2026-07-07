import { TILE_SIZE, BLOCK_COLORS } from '../Constants';
import { BlockType } from '../constants/BlockType';
;
import { SPELLS } from '../Inventory';
import { RenderRegistry } from '../registries/RenderRegistry';
import { Renderer } from '../Renderer';

export class PlayerRenderer {
    static draw(ctx: CanvasRenderingContext2D, player: any, engine: any, halfW: number, halfH: number) {
        if (player.isEyeMode) {
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(0, 0, TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.1, 0, TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.15, 0, TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return;
        }

        if (player.buffs && player.buffs.mistForm > 0) {
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#cccccc';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc((Math.random() - 0.5) * TILE_SIZE, (Math.random() - 0.5) * TILE_SIZE, TILE_SIZE * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            return;
        }

        // Draw Mount First if mounted
        if (player.isMounted && player.activeMount) {
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            Renderer.drawAnimalShape(ctx, player.activeMount.type);
            ctx.restore();
            // We can add a slight offset so the player looks like they are sitting on the mount
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            ctx.fillStyle = player.color;
            if (player.isSneaking) ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(0, -TILE_SIZE * 0.1, TILE_SIZE * 0.3, 0, Math.PI * 2); // Shifted slightly backward
            ctx.fill();
            ctx.restore();
        } else {
            // Draw Player Normally
            ctx.save();
            if (player.isSneaking) ctx.globalAlpha = 0.5;
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.arc(halfW, halfH, TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw carried pot
        if (player.carryingPot) {
            ctx.fillStyle = `rgb(${BLOCK_COLORS[player.carriedBlockType || BlockType.POT].r}, ${BLOCK_COLORS[player.carriedBlockType || BlockType.POT].g}, ${BLOCK_COLORS[player.carriedBlockType || BlockType.POT].b})`;
            ctx.beginPath();
            // Draw it above the player
            ctx.arc(halfW, halfH - TILE_SIZE * 0.5, TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw Aim
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
            halfW + Math.cos(player.aimAngle) * TILE_SIZE * 0.3, 
            halfH + Math.sin(player.aimAngle) * TILE_SIZE * 0.3
        );
        ctx.lineTo(
            halfW + Math.cos(player.aimAngle) * TILE_SIZE * 0.5, 
            halfH + Math.sin(player.aimAngle) * TILE_SIZE * 0.5
        );
        ctx.stroke();

        // Draw Spell Casting Animation (Independent of weapon)
        if (player.isCasting && player.activeSpell) {
            const spell = SPELLS[player.activeSpell];
            if (spell) {
                const timeElapsed = player.castDuration - player.castTimer;
                const castTime = player.castDuration * 0.5;
                
                let castProgress = 0;
                if (player.castDuration > 0) {
                    if (timeElapsed <= castTime) {
                        castProgress = timeElapsed / castTime; // 0 to 1
                    } else {
                        castProgress = 1 - ((timeElapsed - castTime) / (player.castDuration - castTime)); // 1 to 0
                    }
                }
                castProgress = Math.max(0, castProgress);

                ctx.save();
                ctx.translate(halfW, halfH);
                ctx.rotate(player.aimAngle);
                
                // Draw a glowing casting hand/orb
                let color = '#fff';
                if (spell.damageType === 'FIRE') color = '#ff4500';
                else if (spell.damageType === 'ICE') color = '#00ffff';
                else if (spell.damageType === 'LIGHTNING') color = '#ffff00';
                else if (spell.damageType === 'ARCANE') color = '#9932cc';
                else if (spell.damageType === 'ACID') color = '#32cd32';
                else if (spell.damageType === 'PHYSICAL') color = '#a8a29e';

                ctx.beginPath();
                // Offset to the "off-hand" side slightly, or straight ahead
                ctx.arc(TILE_SIZE * 0.4, -TILE_SIZE * 0.2, TILE_SIZE * 0.1 * castProgress, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                
                // Glow
                ctx.shadowBlur = 15 * castProgress;
                ctx.shadowColor = color;
                ctx.beginPath();
                ctx.arc(TILE_SIZE * 0.4, -TILE_SIZE * 0.2, TILE_SIZE * 0.05 * castProgress, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();

                ctx.restore();
            }
        }

        // Draw Charge Animation (Sword or Staff)
        const weaponCharge = player.equipment['MAIN_HAND'];
        const isSwordWeapon = weaponCharge?.id?.includes('sword') || false;
        const isMech = player.isMounted && player.activeMount && player.activeMount.type === 'MAGITECH_MECH';
        
        if (player.isCharging && !isMech) {
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            
            if (isSwordWeapon) {
                // Draw sword held back
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                const handleOffset = TILE_SIZE * 0.3;
                const chargeAngle = -Math.PI / 4; // Held back
                
                ctx.moveTo(
                    Math.cos(chargeAngle) * handleOffset,
                    Math.sin(chargeAngle) * handleOffset
                );
                ctx.lineTo(
                    Math.cos(chargeAngle) * TILE_SIZE * player.attackReach,
                    Math.sin(chargeAngle) * TILE_SIZE * player.attackReach
                );
                ctx.stroke();
            }

            // Draw charge particle effect / glowing circle
            // For staves, calculate progress based on staff charge time, else default sword 1.0s
            if (player.spinAttackReady) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffff00'; // Yellow glow when ready
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * player.attackReach, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                const chargeBaseTime = weaponCharge?.chargeTime || 1.0;
                const progress = Math.min(1, player.chargeTimer / chargeBaseTime);
                ctx.shadowBlur = 10 * progress;
                ctx.shadowColor = '#fff';
                ctx.fillStyle = `rgba(255, 255, 255, ${progress * 0.3})`;
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * player.attackReach * progress, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }

        // Draw Attack Arc or Bow
        const weapon = player.equipment['MAIN_HAND'];
        if (player.isAttacking && !isMech) {
            if (weapon?.type === 'RANGED') {
                // Draw Bow Animation
                const timeElapsed = player.attackDuration - player.attackTimer;
                const drawDuration = player.attackDuration * 0.5;
                
                let drawProgress = 0;
                if (timeElapsed <= drawDuration) {
                    drawProgress = timeElapsed / drawDuration; // 0 to 1
                } else {
                    drawProgress = 0; // Snap back after firing
                }

                ctx.save();
                ctx.translate(halfW, halfH);
                ctx.rotate(player.aimAngle);
                
                // Bow wood
                ctx.strokeStyle = '#8B4513'; // SaddleBrown
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * 0.4, -Math.PI/3, Math.PI/3);
                ctx.stroke();

                // Bow string
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.beginPath();
                const bowTipX = Math.cos(Math.PI/3) * TILE_SIZE * 0.4;
                const bowTipY = Math.sin(Math.PI/3) * TILE_SIZE * 0.4;
                
                // Draw string from top tip, to the pulled back hand, to bottom tip
                const pullBackX = bowTipX - (TILE_SIZE * 0.3 * drawProgress);
                
                ctx.moveTo(bowTipX, -bowTipY);
                ctx.lineTo(pullBackX, 0);
                ctx.lineTo(bowTipX, bowTipY);
                ctx.stroke();

                // Draw arrow being nocked
                const hasAmmo = player.equipment['AMMO'] !== null;
                if (drawProgress > 0 && !player.hasHitThisSwing && hasAmmo) {
                    ctx.strokeStyle = '#5c4033';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(pullBackX, 0);
                    ctx.lineTo(pullBackX + TILE_SIZE * 0.3, 0);
                    ctx.stroke();
                }

                ctx.restore();
            } else if (weapon?.type === 'MAGIC_RANGED' || weapon?.type === 'MAGIC_AOE') {
                // Draw Staff Animation
                const timeElapsed = player.attackDuration - player.attackTimer;
                const castDuration = player.attackDuration * 0.5;
                
                let castProgress = 0;
                if (timeElapsed <= castDuration) {
                    castProgress = timeElapsed / castDuration; // 0 to 1
                } else {
                    castProgress = 1 - ((timeElapsed - castDuration) / (player.attackDuration - castDuration)); // 1 to 0
                }

                ctx.save();
                ctx.translate(halfW, halfH);
                ctx.rotate(player.aimAngle);
                
                // Staff wood
                ctx.strokeStyle = '#654321'; // Dark brown
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(TILE_SIZE * 0.6, 0);
                ctx.stroke();

                // Staff Gem
                let color = '#fff';
                if (weapon.damageType === 'FIRE') color = '#ff4500';
                else if (weapon.damageType === 'ICE') color = '#00ffff';
                else if (weapon.damageType === 'LIGHTNING') color = '#ffff00';
                else if (weapon.damageType === 'ARCANE') color = '#9932cc';
                else if (weapon.damageType === 'ACID') color = '#32cd32';
                else if (weapon.damageType === 'PHYSICAL') color = '#a8a29e';

                ctx.beginPath();
                ctx.arc(TILE_SIZE * 0.6, 0, TILE_SIZE * 0.1 + (castProgress * TILE_SIZE * 0.05), 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                
                // Glow
                ctx.shadowBlur = 15 * castProgress;
                ctx.shadowColor = color;
                ctx.beginPath();
                ctx.arc(TILE_SIZE * 0.6, 0, TILE_SIZE * 0.05, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();

                ctx.restore();
            } else {
                // Slash animation takes the first 40% of the cooldown
                const slashDuration = player.attackDuration * 0.4;
                const timeElapsed = player.attackDuration - player.attackTimer;
                
                if (timeElapsed <= slashDuration) {
                    const progress = timeElapsed / slashDuration; // 0 to 1
                    
                    const startAngle = player.aimAngle - player.attackSpread;
                    const endAngle = player.aimAngle + player.attackSpread;
                    const currentAngle = startAngle + (endAngle - startAngle) * progress;
                    
                    // Draw the sweeping trail
                    ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
                    ctx.beginPath();
                    ctx.moveTo(halfW, halfH);
                    ctx.arc(halfW, halfH, TILE_SIZE * player.attackReach, startAngle, currentAngle);
                    ctx.fill();
                    
                    // Draw the weapon blade
                    ctx.strokeStyle = '#e2e8f0';
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    const handleOffset = TILE_SIZE * 0.3;
                    ctx.moveTo(
                        halfW + Math.cos(currentAngle) * handleOffset,
                        halfH + Math.sin(currentAngle) * handleOffset
                    );
                    ctx.lineTo(
                        halfW + Math.cos(currentAngle) * TILE_SIZE * player.attackReach,
                        halfH + Math.sin(currentAngle) * TILE_SIZE * player.attackReach
                    );
                    ctx.stroke();
                }
            }
        } else if (!isMech && weapon?.type === 'RANGED') {
            // Idle Bow
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, TILE_SIZE * 0.4, -Math.PI/3, Math.PI/3);
            ctx.stroke();
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const bowTipX = Math.cos(Math.PI/3) * TILE_SIZE * 0.4;
            const bowTipY = Math.sin(Math.PI/3) * TILE_SIZE * 0.4;
            ctx.moveTo(bowTipX, -bowTipY);
            ctx.lineTo(bowTipX, bowTipY);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Player Statuses
        if (player.statuses && (player.statuses.burn > 0 || player.statuses.poison > 0 || player.statuses.chill > 0 || player.statuses.bleed > 0)) {
            let iconX = halfW - TILE_SIZE * 0.4;
            const iconY = halfH - TILE_SIZE * 0.8;
            const iconSize = 8;
            
            if (player.statuses.burn > 0) {
                ctx.fillStyle = '#ff4500';
                ctx.fillRect(iconX, iconY, iconSize, iconSize);
                iconX += iconSize + 2;
            }
            if (player.statuses.poison > 0) {
                ctx.fillStyle = '#32cd32';
                ctx.fillRect(iconX, iconY, iconSize, iconSize);
                iconX += iconSize + 2;
            }
            if (player.statuses.chill > 0) {
                ctx.fillStyle = '#add8e6';
                ctx.fillRect(iconX, iconY, iconSize, iconSize);
                iconX += iconSize + 2;
            }
            if (player.statuses.bleed > 0) {
                ctx.fillStyle = '#8b0000';
                ctx.fillRect(iconX, iconY, iconSize, iconSize);
                iconX += iconSize + 2;
            }
        }
    }
}
