import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineDinosaurFolkRenderers() {
    RenderRegistry.register('TRICERA_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.rotate(ctx.entity?.aimAngle || 0);
            ctx.ctx.fillStyle = '#2f4f4f';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.5, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#adff2f';
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('RAPTOR_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.rotate(ctx.entity?.aimAngle || 0);
            ctx.ctx.fillStyle = '#808000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -2, ctx.TILE_SIZE * 0.3, 4);
        }
    });
    RenderRegistry.register('WILD_RAPTOR', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.rotate(ctx.entity?.aimAngle || 0);
            ctx.ctx.fillStyle = '#556b2f';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffffe0'; // Strip
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -2, ctx.TILE_SIZE * 0.4, 4);
        }
    });
    RenderRegistry.register('T_REX', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.rotate(ctx.entity?.aimAngle || 0);
            ctx.ctx.scale(1.5, 1.5);
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.6);
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, 4, ctx.TILE_SIZE * 0.4); // Teeth
        }
    });
    RenderRegistry.register('PTERODACTYL', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.rotate(ctx.entity?.aimAngle || 0);
            ctx.ctx.fillStyle = '#4682b4';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#5f9ea0'; // Wings
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(0, -ctx.TILE_SIZE * 0.6);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, 0);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.6);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, 0);
            ctx.ctx.fill();
        }
    });
}
