import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineConstructsRenderers() {
    RenderRegistry.register('CLAY_GOLEM', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#b0c4de';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#778899';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fillStyle = '#ff8c00';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 4, 4);
        }
    });
    RenderRegistry.register('stone_golem', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#808080';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#A9A9A9';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fillStyle = '#00FFFF';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 4, 4);
        }
    });
    RenderRegistry.register('LAVA_GOLEM', {
        draw: (ctx: RenderContext) => {
            const golem = ctx.entity;
            ctx.ctx.fillStyle = '#8b0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 1.2, ctx.TILE_SIZE * 1.2);
            ctx.ctx.fill();

            ctx.ctx.strokeStyle = '#ff4500'; 
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.stroke();

            ctx.ctx.rotate(golem.aimAngle || 0);
            ctx.ctx.fillStyle = '#ffff00'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.save();
            if (golem.state === 'ATTACK') {
                const attackProgress = 1 - (golem.attackTimer / 0.5);
                ctx.ctx.translate(ctx.TILE_SIZE * 0.4, 0);
                ctx.ctx.scale(1 + Math.sin(attackProgress * Math.PI) * 0.5, 1 + Math.sin(attackProgress * Math.PI) * 0.5);
                ctx.ctx.fillStyle = '#ff4500';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else {
                ctx.ctx.fillStyle = '#8b0000';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            }
            ctx.ctx.restore();
        }
    });
}
