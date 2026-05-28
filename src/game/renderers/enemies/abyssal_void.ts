import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineAbyssalVoidRenderers() {
    const drawObserver = (ctx: RenderContext, c1: string, c2: string) => {
        const ts = ctx.TILE_SIZE;
        ctx.ctx.fillStyle = c1;
        ctx.ctx.beginPath();
        ctx.ctx.arc(0, 0, ts * 0.4, 0, Math.PI * 2);
        ctx.ctx.fill();
        ctx.ctx.fillStyle = c2;
        ctx.ctx.beginPath();
        ctx.ctx.arc(0, 0, ts * 0.2, 0, Math.PI * 2);
        ctx.ctx.fill();
        ctx.ctx.fillStyle = '#000000';
        ctx.ctx.beginPath();
        ctx.ctx.arc(0, 0, ts * 0.1, 0, Math.PI * 2);
        ctx.ctx.fill();
    };

    RenderRegistry.register('OBSERVER_FIRE', { draw: (ctx: RenderContext) => drawObserver(ctx, '#8b0000', '#ffaa00') });
    RenderRegistry.register('OBSERVER_VOID', { draw: (ctx: RenderContext) => drawObserver(ctx, '#4b0082', '#bb00ff') });
    RenderRegistry.register('BLACK_HOLE', {
        draw: (ctx: RenderContext) => {
            const rot = (performance.now() / 200) % (Math.PI * 2);
            ctx.ctx.rotate(rot);
            let gradient = ctx.ctx.createRadialGradient(0, 0, 0, 0, 0, ctx.TILE_SIZE);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#4b0082');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.ctx.fillStyle = gradient;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('VOID_LORD', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            if (ent.state === 'TELEPORT') {
                ctx.ctx.globalAlpha = ent.stateTimer * 2;
            } else if (ent.state === 'SPAWN') {
                ctx.ctx.globalAlpha = 1.0 - (ent.stateTimer / 2.0);
            }

            // Big dark body
            ctx.ctx.rotate(ent.aimAngle || performance.now() / 1000);
            
            ctx.ctx.fillStyle = '#110022';
            ctx.ctx.strokeStyle = '#9900ff';
            ctx.ctx.lineWidth = 3;
            
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 1.5, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.stroke();

            // Inner glowing core
            const scale = 1.0 + Math.sin(performance.now() / 200) * 0.2;
            ctx.ctx.fillStyle = '#ff00ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.5 * scale, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Tentacles/Spikes
            for (let i = 0; i < 6; i++) {
                const rot = (i / 6) * Math.PI * 2 + (performance.now() / 500);
                ctx.ctx.save();
                ctx.ctx.rotate(rot);
                ctx.ctx.fillStyle = '#330066';
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts, -ts*0.3);
                ctx.ctx.lineTo(ts * 2.5, 0);
                ctx.ctx.lineTo(ts, ts*0.3);
                ctx.ctx.fill();
                ctx.ctx.restore();
            }
            ctx.ctx.globalAlpha = 1.0;
        }
    });
}
