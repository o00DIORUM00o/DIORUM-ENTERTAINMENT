import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineUndeadRenderers() {
    RenderRegistry.register('SKELETON', {
        draw: (ctx: RenderContext) => {
            const skel = ctx.entity;
            const ts = ctx.TILE_SIZE;

            if (skel.state === 'ATTACK' || (skel.stateTimer !== undefined && skel.stateTimer > 0 && skel.state === 'ALERT')) {
                const flashRate = Math.floor(ctx.time / 50) % 2 === 0;
                if (flashRate) {
                    ctx.ctx.filter = 'brightness(150%) drop-shadow(0 0 5px red)'; // Scary red glow
                }
            }

            ctx.ctx.fillStyle = '#e2e8f0'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Skull markings / hollows
            ctx.ctx.fillStyle = '#cbd5e1'; // darker bone
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ts*0.1, 0, ts*0.1, ts*0.2, 0, 0, Math.PI*2);
            ctx.ctx.fill();

            // Skull orientation
            ctx.ctx.rotate(skel.aimAngle || 0);
            
            // Hollow eye sockets
            ctx.ctx.fillStyle = '#000000'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.15, -ts * 0.1, ts * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.15, ts * 0.1, ts * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Red glowing pupils
            ctx.ctx.fillStyle = '#ef4444';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.15, -ts * 0.1, ts * 0.03, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.15, ts * 0.1, ts * 0.03, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.save();
            if (skel.type === 'SWORDSMAN') {
                // Shield (Darknut style!)
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ts * 0.1, ts * 0.15, ts * 0.4, ts * 0.1);
                ctx.ctx.fillStyle = '#c0c0c0';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.3, ts * 0.2, ts * 0.1, 0, Math.PI*2);
                ctx.ctx.fill();
                
                if (skel.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (skel.attackTimer / 0.5));
                    ctx.ctx.rotate(Math.sin(attackProgress * Math.PI) * Math.PI / 2);
                    ctx.ctx.fillStyle = '#94a3b8'; 
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, 0);
                    ctx.ctx.lineTo(ts * 0.8, -ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.8, ts * 0.1);
                    ctx.ctx.fill();
                } else {
                    ctx.ctx.fillStyle = '#94a3b8';
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, ts * 0.2);
                    ctx.ctx.lineTo(ts * 0.6, ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.5, ts * 0.3);
                    ctx.ctx.fill();
                }
            } else { 
                ctx.ctx.strokeStyle = '#8b4513'; 
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.2, 0, ts * 0.3, -Math.PI/2, Math.PI/2);
                ctx.ctx.stroke();
                
                if (skel.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (skel.attackTimer / 0.5));
                    if (attackProgress < 0.5) {
                        ctx.ctx.strokeStyle = '#e2e8f0'; 
                        ctx.ctx.beginPath();
                        ctx.ctx.moveTo(ts * 0.2, 0);
                        ctx.ctx.lineTo(ts * 0.2 - (attackProgress * ts * 0.4), 0); // draw back
                        ctx.ctx.stroke();
                    }
                }
            }
            ctx.ctx.restore();
            
            ctx.ctx.filter = 'none';
        }
    });
    RenderRegistry.register('SKELETON_REMAIN', {
        draw: (ctx: RenderContext) => {
            const rem = ctx.entity;
            ctx.ctx.fillStyle = '#e2e8f0'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.lineWidth = 3;
            ctx.ctx.strokeStyle = '#e2e8f0';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.3);
            ctx.ctx.stroke();
            
            ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.6, 4);
            ctx.ctx.fillStyle = '#a855f7'; 
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.4, (ctx.TILE_SIZE * 0.6) * (1 - (rem.reviveTimer / 10.0)), 4);
        }
    });
    RenderRegistry.register('zombie', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = ent.aimAngle !== undefined ? ent.aimAngle : Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#2e8b57';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#000';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillStyle = '#2e8b57';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
        }
    });
    RenderRegistry.register('ABYSSAL_KNIGHT', {
        draw: (ctx: RenderContext) => {
            const k = ctx.entity;
            const scale = 1.2;
            
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, 12 * scale, 6 * scale, 0, 0, Math.PI * 2);
            ctx.ctx.fillStyle = 'rgba(74, 0, 128, 0.5)';
            ctx.ctx.fill();

            ctx.ctx.fillStyle = '#1a0f2e';
            ctx.ctx.fillRect(-8 * scale, -24 * scale, 16 * scale, 24 * scale);
            
            ctx.ctx.fillStyle = (k.state === 'ATTACK' || k.state === 'CHARGE') ? '#ff0000' : '#ff00ff';
            ctx.ctx.fillRect(-4 * scale, -20 * scale, 3 * scale, 3 * scale);
            ctx.ctx.fillRect(1 * scale, -20 * scale, 3 * scale, 3 * scale);

            ctx.ctx.save();
            ctx.ctx.translate(8 * scale, -12 * scale);
            if (k.state === 'ATTACK') ctx.ctx.rotate(Math.PI / 2);
            else if (k.state === 'CHARGE') ctx.ctx.rotate(Math.PI / 4);
            ctx.ctx.fillStyle = '#4a0080';
            ctx.ctx.fillRect(0, -15 * scale, 4 * scale, 20 * scale);
            ctx.ctx.restore();
        }
    });
}
