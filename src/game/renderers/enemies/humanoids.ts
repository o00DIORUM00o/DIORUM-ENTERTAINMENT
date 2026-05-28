import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineHumanoidsRenderers() {
    RenderRegistry.register('DARK_KNIGHT', {
        draw: (ctx: RenderContext) => {
            const knight = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.save();
            ctx.ctx.rotate(knight.aimAngle || 0);

            // Shadow / base
            ctx.ctx.fillStyle = '#111827'; // Dark armor base
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.45, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Armor plating
            ctx.ctx.fillStyle = '#374151'; // Lighter gray for plates
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts * 0.35, ts * 0.45, 0, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head / Helmet
            ctx.ctx.fillStyle = '#111827';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, 0, ts * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Glowing red eyes
            ctx.ctx.fillStyle = '#ef4444'; 
            if (knight.state === 'CHARGE') ctx.ctx.fillStyle = '#fbbf24'; // Yellow/orange while charging

            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, -ts * 0.1, ts * 0.05, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.2, ts * 0.1, ts * 0.05, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Sword
            ctx.ctx.fillStyle = '#9ca3af'; // silver sword
            ctx.ctx.strokeStyle = '#4b5563';
            ctx.ctx.lineWidth = 1;

            ctx.ctx.beginPath();
            if (knight.state === 'AIM' || knight.state === 'CHARGE') {
                // Sword pointing straight forward
                ctx.ctx.rect(ts * 0.3, -ts * 0.05, ts * 0.8, ts * 0.1);
            } else {
                // Sword resting at angle
                ctx.ctx.rotate(Math.PI / 4);
                ctx.ctx.rect(ts * 0.2, ts * 0.3, ts * 0.8, ts * 0.1);
            }
            ctx.ctx.fill();
            ctx.ctx.stroke();

            ctx.ctx.restore();
        }
    });
    RenderRegistry.register('ARCHER', {
        draw: (ctx: RenderContext) => {
            const arch = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.fillStyle = '#6b7280'; // gray-500 armor
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.rotate(arch.aimAngle || 0);

            // Bow
            ctx.ctx.strokeStyle = '#8b4513';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, 0, ts * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.stroke();

            // Arrow loaded 
            if (arch.state === 'ATTACK') {
                ctx.ctx.strokeStyle = '#fff';
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts * -0.2, 0);
                ctx.ctx.lineTo(ts * 0.5, 0);
                ctx.ctx.stroke();
            }
        }
    });
    RenderRegistry.register('SHADOW_WIZARD', {
        draw: (ctx: RenderContext) => {
            const w = ctx.entity;
            const ts = ctx.TILE_SIZE;
            const t = performance.now() / 200;

            // Hover bob
            ctx.ctx.translate(0, Math.sin(t) * 3);

            // Phase logic 
            let opacity = 1.0;
            if (w.state === 'TELEPORTING') {
                opacity = w.teleportPhase === 0 ? w.phaseTimer / 0.5 : 1.0 - (w.phaseTimer / 0.5);
            }
            if (opacity < 0.05) return;
            
            ctx.ctx.globalAlpha = opacity;
            
            ctx.ctx.fillStyle = '#111'; // Dark robes
            ctx.ctx.strokeStyle = '#6b21a8'; // Purple outline
            ctx.ctx.lineWidth = 2;
            
            // Robe base
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, ts*0.4);
            ctx.ctx.lineTo(-ts*0.4, ts*0.6);
            ctx.ctx.lineTo(ts*0.4, ts*0.6);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Hood
            ctx.ctx.fillStyle = '#222';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.4, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Glowing Eyes
            ctx.ctx.fillStyle = w.attackType === 'SHATTER' ? '#00ffff' : '#ff00ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
            ctx.ctx.fill();

            // Glowing hands
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*0.5, ts*0.2, 5, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.5, ts*0.2, 5, 0, Math.PI*2);
            ctx.ctx.fill();
            
            ctx.ctx.globalAlpha = 1.0;
        }
    });
    RenderRegistry.register('PHANTOM_WIZARD', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            if (ent.state === 'HIDDEN') return;
            
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            ctx.ctx.globalAlpha = ent.state === 'APPEAR' || ent.state === 'VANISH' ? 0.5 : 1.0;

            // Robes
            ctx.ctx.fillStyle = '#4b0082'; // Indigo
            ctx.ctx.strokeStyle = '#000000';
            ctx.ctx.lineWidth = 2;
            
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*0.5, 0);
            ctx.ctx.lineTo(-ts*0.5, ts*0.8);
            ctx.ctx.lineTo(-ts*0.8, 0);
            ctx.ctx.lineTo(-ts*0.5, -ts*0.8);
            ctx.ctx.closePath();
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Head/Hood
            ctx.ctx.fillStyle = '#8a2be2'; // Blue Violet
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.5, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Shadow Face
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.3, 0, Math.PI*2);
            ctx.ctx.fill();

            // Glowing Eyes
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*0.1, -ts*0.15, ts*0.06, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.1, ts*0.15, ts*0.06, 0, Math.PI*2);
            ctx.ctx.fill();

            // Magical Orb on hand
            if (ent.state === 'CHARGE_SPELL' || ent.state === 'ATTACK') {
                ctx.ctx.fillStyle = '#ff00ff';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*0.8, -ts*0.5, ts*0.3 + Math.random() * ts*0.1, 0, Math.PI*2);
                ctx.ctx.fill();
            }

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('DARK_ELF', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // Cloak
            ctx.ctx.fillStyle = '#1e1b4b'; // Dark violet/black
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts * 0.4, 0);
            ctx.ctx.lineTo(-ts * 0.5, ts * 0.5);
            ctx.ctx.lineTo(-ts * 0.6, 0);
            ctx.ctx.lineTo(-ts * 0.5, -ts * 0.5);
            ctx.ctx.fill();

            // Head 
            ctx.ctx.fillStyle = '#4c1d95'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Glowing Eyes
            ctx.ctx.fillStyle = '#a855f7';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, -ts * 0.15, 3, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.1, ts * 0.15, 3, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('DARK_ELF_ASSASSIN', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // Cloak
            ctx.ctx.fillStyle = '#1e1b4b'; // Dark violet/black
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts * 0.4, 0);
            ctx.ctx.lineTo(-ts * 0.5, ts * 0.5);
            ctx.ctx.lineTo(-ts * 0.6, 0);
            ctx.ctx.lineTo(-ts * 0.5, -ts * 0.5);
            ctx.ctx.fill();

            // Head 
            ctx.ctx.fillStyle = '#4c1d95'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Glowing Eyes
            ctx.ctx.fillStyle = '#a855f7';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, -ts * 0.15, 3, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.1, ts * 0.15, 3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Daggers
            ctx.ctx.fillStyle = '#9ca3af';
            if (ent.attackTimer > 0) {
                ctx.ctx.fillRect(ts * 0.2, -ts * 0.4, ts * 0.6, 4);
                ctx.ctx.fillRect(ts * 0.2, ts * 0.4, ts * 0.6, 4);
            } else {
                ctx.ctx.fillRect(-ts * 0.2, -ts * 0.4, ts * 0.6, 4);
                ctx.ctx.fillRect(-ts * 0.2, ts * 0.4, ts * 0.6, 4);
            }
            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('HUMAN_RANGER', {
        draw: (ctx: RenderContext) => {
            const arch = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.save();
            ctx.ctx.rotate(arch.aimAngle || 0);

            // Cloak / Body
            ctx.ctx.fillStyle = '#166534'; // Forest Green
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Hood
            ctx.ctx.fillStyle = '#14532d'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Bow
            ctx.ctx.strokeStyle = '#78350f';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, 0, ts * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.stroke();
            
            // Arrow
            if (arch.attackCooldown > 0) {
                ctx.ctx.strokeStyle = '#fff';
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts * -0.2, 0);
                ctx.ctx.lineTo(ts * 0.5, 0);
                ctx.ctx.stroke();
            }

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('HUMAN_KNIGHT', {
        draw: (ctx: RenderContext) => {
            const knight = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.save();
            ctx.ctx.rotate(knight.aimAngle || 0);

            // Steel armor
            ctx.ctx.fillStyle = '#9ca3af'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.45, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head 
            ctx.ctx.fillStyle = '#d1d5db';
            ctx.ctx.beginPath();
            ctx.ctx.arc( ts * 0.1, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Sword
            ctx.ctx.fillStyle = '#e5e7eb';
            ctx.ctx.strokeStyle = '#4b5563';
            ctx.ctx.lineWidth = 1;

            ctx.ctx.beginPath();
            if (knight.attackTimer > 0) {
                ctx.ctx.rect(ts * 0.3, -ts * 0.05, ts * 0.8, ts * 0.1);
            } else {
                ctx.ctx.translate(ts*0.1, ts*0.1);
                ctx.ctx.rotate(Math.PI / 4);
                ctx.ctx.rect(ts * 0.2, 0, ts * 0.8, ts * 0.1);
            }
            ctx.ctx.fill();
            ctx.ctx.stroke();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('HUMAN_PALADIN', {
        draw: (ctx: RenderContext) => {
            const knight = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.save();
            ctx.ctx.rotate(knight.aimAngle || 0);

            // Shiny/Gold armor
            ctx.ctx.fillStyle = '#fef08a'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.45, 0, Math.PI * 2);
            ctx.ctx.fill();

            // White tabbard
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.fillRect(-ts*0.2, -ts*0.3, ts*0.4, ts*0.6);

            // Head / Helmet
            ctx.ctx.fillStyle = '#fde047';
            ctx.ctx.beginPath();
            ctx.ctx.arc( ts * 0.1, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Glowing Sword
            ctx.ctx.fillStyle = '#fef08a';
            ctx.ctx.shadowColor = '#fef08a';
            ctx.ctx.shadowBlur = 10;

            ctx.ctx.beginPath();
            if (knight.attackTimer > 0) {
                ctx.ctx.rect(ts * 0.3, -ts * 0.1, ts * 0.9, ts * 0.2);
            } else {
                ctx.ctx.translate(ts*0.1, ts*0.1);
                ctx.ctx.rotate(Math.PI / 4);
                ctx.ctx.rect(ts * 0.2, 0, ts * 0.9, ts * 0.2);
            }
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });
}
