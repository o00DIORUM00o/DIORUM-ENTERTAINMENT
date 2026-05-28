import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineElementalsRenderers() {
    RenderRegistry.register('FIRE_IMP', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.translate(0, Math.sin(Date.now() / 150) * 4);
            ctx.ctx.fillStyle = '#8b0000';
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.4, ctx.TILE_SIZE*0.6, ctx.TILE_SIZE*0.7);
            ctx.ctx.fill();
            ctx.ctx.strokeStyle = '#ff4500';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE*0.3, 0); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.7, -ctx.TILE_SIZE*0.5); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.2);
            ctx.ctx.moveTo(ctx.TILE_SIZE*0.3, 0); ctx.ctx.lineTo(ctx.TILE_SIZE*0.7, -ctx.TILE_SIZE*0.5); ctx.ctx.lineTo(ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.2);
            ctx.ctx.stroke();
            if (ent.attackCooldown && ent.attackCooldown > 1.5) {
                ctx.ctx.fillStyle = '#ffa500';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE*0.2 + Math.random()*2, 0, Math.PI*2);
                ctx.ctx.fill();
            }
        }
    });
    RenderRegistry.register('DJINN', {
        draw: (ctx: RenderContext) => {
            const ts = ctx.TILE_SIZE;
            const t = performance.now() / 200;
            
            // Tornado bottom
            const gradient = ctx.ctx.createRadialGradient(0, 0, 0, 0, 0, ts);
            gradient.addColorStop(0, 'rgba(100, 0, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(50, 0, 150, 0)');
            
            ctx.ctx.fillStyle = gradient;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, ts*0.5, ts, 0, Math.PI*2);
            ctx.ctx.fill();
            
            // Geni upper body
            ctx.ctx.fillStyle = '#1e90ff'; // Dodger blue
            ctx.ctx.strokeStyle = '#000080';
            ctx.ctx.lineWidth = 2;
            
            // Torso
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ts*0.2, ts*0.6, ts*0.4, 0, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Muscular Arms crossed
            ctx.ctx.fillStyle = '#104e8b';
            ctx.ctx.fillRect(-ts*0.5, -ts*0.2, ts, ts*0.2);
            
            // Head and Hair/Turban
            ctx.ctx.fillStyle = '#1e90ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, -ts*0.6, ts*0.3, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Turban
            ctx.ctx.fillStyle = '#ffaa00';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ts*0.8, ts*0.35, ts*0.15, 0, 0, Math.PI*2);
            ctx.ctx.fill();
            
            // Eyes
            ctx.ctx.fillStyle = '#00ffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*0.1, -ts*0.6, 2, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.2, -ts*0.5, 2, 0, Math.PI*2);
            ctx.ctx.fill();
        }
    });
}
