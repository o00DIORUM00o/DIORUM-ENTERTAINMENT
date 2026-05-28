import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineOtherFolkRenderers() {
    RenderRegistry.register('FUNGI_FOLK', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#f5deb3';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8b0000'; // Mushroom cap
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('FROG_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#32cd32';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
}
