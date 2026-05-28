import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineMiscFolkRenderers() {
    RenderRegistry.register('DWARF', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // Short, stout body
            ctx.ctx.fillStyle = '#b45309'; // Brown clothing
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.45, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head
            ctx.ctx.fillStyle = '#fcd34d'; // Skin tone
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, 0, ts * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Big beard
            ctx.ctx.fillStyle = '#6b7280'; // Grey beard
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.3, 0, ts * 0.2, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('SQUIRREL_FOLK', {
        draw: (ctx: RenderContext) => {
            // Agile, small, leaf cloak
            ctx.ctx.fillStyle = '#2e5c1d'; // Forest green cloak
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * -0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.25, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();

            // Huge Bushy tail (main feature)
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * -0.3, 0, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.35, 0, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Body (brown/orange fur)
            ctx.ctx.fillStyle = '#cd853f';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.18, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Shoulders/arms
            ctx.ctx.fillStyle = '#a0522d';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Ears
            ctx.ctx.fillStyle = '#cd853f';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.05, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.15);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * -0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.05, ctx.TILE_SIZE * -0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * -0.15);
            ctx.ctx.fill();

            // Head
            ctx.ctx.fillStyle = '#d2b48c'; // lighter face
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.05, 0, ctx.TILE_SIZE * 0.14, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('GNOME', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#166534'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#dc2626'; 
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.15);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#78350f'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -5, ctx.TILE_SIZE * 0.4, 10);
            ctx.ctx.fillStyle = '#a1a1aa'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.4, -15, 3, 30);
        }
    });
}
