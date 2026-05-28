import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function definePetsRenderers() {
    RenderRegistry.register('BEAST_TAMER', {
        draw: (ctx: RenderContext) => {
            // Burly, beast skin cloak
            ctx.ctx.fillStyle = '#5c4033'; // Dark brown pelt
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.15, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * -0.35);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.35, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * 0.35);
            ctx.ctx.fill();

            // Shoulders/arms (thick bared arms)
            ctx.ctx.fillStyle = '#d2b48c';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.12, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * -0.2, ctx.TILE_SIZE * 0.12, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Body (leather straps)
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head
            ctx.ctx.fillStyle = '#d2b48c'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Whip/Staff
            ctx.ctx.strokeStyle = '#2d1a11';
            ctx.ctx.lineWidth = ctx.TILE_SIZE * 0.04;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.stroke();
        }
    });
}
