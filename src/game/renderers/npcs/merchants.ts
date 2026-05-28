import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineMerchantsRenderers() {
    RenderRegistry.register('DRACONIC_MERCHANT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#cc0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.35, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffcc00'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.15, 6, 6);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 6, 6);
            ctx.ctx.fillStyle = '#eab308';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.4, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('SLUG_FOLK_MERCHANT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#8bc34a'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8bc34a';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.2, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2, 4);
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.5, -ctx.TILE_SIZE * 0.25, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillStyle = '#795548';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
    
    RenderRegistry.register('WANDERING_BARD', {
        draw: (ctx: RenderContext) => {
            // Body (Colorful cloak)
            ctx.ctx.fillStyle = `hsl(${(Date.now() / 20) % 360}, 70%, 50%)`;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Lute (wood color)
            ctx.ctx.fillStyle = '#8B4513';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, Math.PI / 4, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Lute fretboard
            ctx.ctx.fillStyle = '#D2B48C';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * -0.1, ctx.TILE_SIZE * 0.3, 4);

            // Head & Hat
            ctx.ctx.fillStyle = '#ffcc99'; // skin
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.fillStyle = '#9400D3'; // DarkViolet hat
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.25, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(0, -ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.25, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
        }
    });
}
