import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineMonstersRenderers() {
    RenderRegistry.register('SAND_TERROR', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            if (ent.state === 'BURROWED') return; // Don't draw the body when fully burrowed. The updater spawns dirt particles.
            
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // A segmented worm. We just draw a large stylized worm head/body here since segments aren't fully physics-simulated yet.
            ctx.ctx.fillStyle = '#b8860b'; // Dark goldenrod
            ctx.ctx.strokeStyle = '#8b4513';
            ctx.ctx.lineWidth = 3;

            // Main body
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts*1.5, ts*0.8, 0, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Head pincers
            ctx.ctx.fillStyle = '#f4a460';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*1.2, -ts*0.3);
            ctx.ctx.lineTo(ts*2.0, -ts*0.6);
            ctx.ctx.lineTo(ts*1.5, 0);
            ctx.ctx.lineTo(ts*2.0, ts*0.6);
            ctx.ctx.lineTo(ts*1.2, ts*0.3);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Eyes
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.0, -ts*0.4, ts*0.15, 0, Math.PI*2);
            ctx.ctx.arc(ts*1.0, ts*0.4, ts*0.15, 0, Math.PI*2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });
    RenderRegistry.register('GARGOYLE', {
        draw: (ctx: RenderContext) => {
            const g = ctx.entity;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.fillStyle = g.state === 'AWAKE' || g.state === 'CHASE' || g.state === 'ATTACK' ? '#444455' : '#888888';
            ctx.ctx.strokeStyle = '#222222';
            ctx.ctx.lineWidth = 2;
            
            // Wings
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ts*0.2, 0);
            if (g.state === 'SLEEPING') {
                ctx.ctx.lineTo(-ts*0.8, -ts*0.8);
                ctx.ctx.lineTo(ts*0.8, -ts*0.8);
            } else {
                ctx.ctx.lineTo(-ts*1.2, -ts);
                ctx.ctx.lineTo(ts*1.2, -ts);
            }
            ctx.ctx.lineTo(ts*0.2, 0);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Body
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ts*0.4, -ts*0.4, ts*0.8, ts*0.8);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Glowing eyes
            if (g.state !== 'SLEEPING') {
                ctx.ctx.fillStyle = '#ff0000';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
                ctx.ctx.arc(ts*0.15, ts*0.1, 3, 0, Math.PI*2);
                ctx.ctx.fill();
            }
        }
    });
    RenderRegistry.register('SLIME', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.fillStyle = 'rgba(50, 205, 50, 0.8)';
            ctx.ctx.beginPath();
            const scaleY = ent.vz !== 0 ? 1.2 : 0.8;
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4 * scaleY, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ctx.TILE_SIZE*0.15, -ctx.TILE_SIZE*0.1, 2, 0, Math.PI*2);
            ctx.ctx.arc(ctx.TILE_SIZE*0.15, -ctx.TILE_SIZE*0.1, 2, 0, Math.PI*2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('OGRE', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.scale(1.2, 1.2);
            ctx.ctx.fillStyle = '#556b2f';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2); // Club
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1, 3, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 3, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
    
    RenderRegistry.register('GIANT', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);
            
            // Scaled up humanoid
            ctx.ctx.scale(2.5, 2.5);

            // Body
            ctx.ctx.fillStyle = '#a8a29e'; // Stone-like giant skin
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head
            ctx.ctx.fillStyle = '#d6d3d1';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, 0, ts * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Club
            ctx.ctx.fillStyle = '#4a3018'; // Dark wood
            ctx.ctx.fillRect(ts * 0.2, -ts * 0.1, ts * 0.6, ts * 0.2);

            // Eyes
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, -ts * 0.1, 2, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.2, ts * 0.1, 2, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('COLOSSAL_LIZARD_TITAN', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // Massive size
            ctx.ctx.scale(4.0, 4.0);

            // Body (Lizard-like)
            ctx.ctx.fillStyle = '#064e3b'; // Very dark green
            ctx.ctx.strokeStyle = '#022c22';
            ctx.ctx.lineWidth = 2;

            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts * 0.6, ts * 0.4, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.stroke();

            // Head
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts * 0.4, -ts * 0.2);
            ctx.ctx.lineTo(ts * 0.8, -ts * 0.1);
            ctx.ctx.lineTo(ts * 0.8, ts * 0.1);
            ctx.ctx.lineTo(ts * 0.4, ts * 0.2);
            ctx.ctx.closePath();
            ctx.ctx.fill();
            ctx.ctx.stroke();

            // Tail
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ts * 0.5, -ts * 0.1);
            ctx.ctx.lineTo(-ts * 1.2, 0);
            ctx.ctx.lineTo(-ts * 0.5, ts * 0.1);
            ctx.ctx.fill();
            ctx.ctx.stroke();

            // Eyes
            ctx.ctx.fillStyle = '#facc15'; // Glowing yellow eyes
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.6, -ts * 0.1, 2, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.6, ts * 0.1, 2, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });
    RenderRegistry.register('TROLL', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.scale(1.1, 1.1);
            ctx.ctx.fillStyle = '#1e90ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#fff0f5'; // Tusks
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('SPHINX', {
        draw: (ctx: RenderContext) => {
            const s = ctx.entity;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.save();
            ctx.ctx.rotate(s.aimAngle || 0);

            // Body (Lion)
            ctx.ctx.fillStyle = '#daa520'; 
            ctx.ctx.strokeStyle = '#b8860b';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ts*1.2, -ts*0.8, ts*2.4, ts*1.6);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Shoulders/Legs
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*1.2, -ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(-ts*1.2, ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.8, -ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.8, ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Sphinx Head (Human/Pharaoh)
            ctx.ctx.fillStyle = '#f0e68c';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.2, 0, ts*0.6, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Nemes (Headdress)
            ctx.ctx.fillStyle = '#0000cd';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*1.2, -ts*0.6);
            ctx.ctx.lineTo(ts*0.6, -ts*1.2);
            ctx.ctx.lineTo(ts*0.6, ts*1.2);
            ctx.ctx.lineTo(ts*1.2, ts*0.6);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Eyes
            if (s.state === 'ATTACK_LASER') {
                ctx.ctx.fillStyle = '#00ffff';
            } else if (s.state === 'SLEEP') {
                ctx.ctx.fillStyle = '#888888';
            } else {
                ctx.ctx.fillStyle = '#ff0000';
            }
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.5, -ts*0.2, 4, 0, Math.PI*2);
            ctx.ctx.arc(ts*1.5, ts*0.2, 4, 0, Math.PI*2);
            ctx.ctx.fill();

            ctx.ctx.restore();
            
            // Health bar 
            if (s.state !== 'SLEEP') {
                 const hpPercent = Math.max(0, s.health / s.maxHealth);
                 ctx.ctx.fillStyle = 'black';
                 ctx.ctx.fillRect(-ts*2, -ts*3.5 - 5, ts*4, 10);
                 ctx.ctx.fillStyle = 'red';
                 ctx.ctx.fillRect(-ts*2, -ts*3.5 - 5, ts*4 * hpPercent, 10);
            }
        }
    });
}
