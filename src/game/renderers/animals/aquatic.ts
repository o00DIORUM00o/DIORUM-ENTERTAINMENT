import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineAquaticRenderers() {
    RenderRegistry.register('TURTLE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#228B22';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            c.fillStyle = '#006400';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#32CD32';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
        }
    });
    RenderRegistry.register('DRAGON_TURTLE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#2F4F4F'; 
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.8, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = '#8B0000'; 
            c.fillRect(-TILE_SIZE * 0.2, -TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
            c.fillStyle = '#556B2F'; 
            c.fillRect(TILE_SIZE * 0.6, -TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
        }
    });
}
