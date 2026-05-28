import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineStandardAnimalsRenderers() {
    RenderRegistry.register('DEER', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B4513';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.25, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.strokeStyle = '#D2B48C';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.6, -TILE_SIZE * 0.3);
            c.moveTo(TILE_SIZE * 0.4, TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.6, TILE_SIZE * 0.3);
            c.stroke();
        }
    });
    RenderRegistry.register('BEAR', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#5C4033';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.4, TILE_SIZE * 1.0, TILE_SIZE * 0.8);
            c.fillStyle = '#3E2723';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.25, TILE_SIZE * 0.4, TILE_SIZE * 0.5);
        }
    });
    RenderRegistry.register('WOLF', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#4a4a4a';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.2, TILE_SIZE * 0.8, TILE_SIZE * 0.4);
            c.fillStyle = '#333333';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#222222';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.2, -TILE_SIZE * 0.15);
            c.lineTo(TILE_SIZE * 0.3, -TILE_SIZE * 0.25);
            c.lineTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.15);
            c.fill();
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.2, TILE_SIZE * 0.15);
            c.lineTo(TILE_SIZE * 0.3, TILE_SIZE * 0.25);
            c.lineTo(TILE_SIZE * 0.4, TILE_SIZE * 0.15);
            c.fill();
            c.fillStyle = '#333333';
            c.fillRect(-TILE_SIZE * 0.6, -TILE_SIZE * 0.05, TILE_SIZE * 0.2, TILE_SIZE * 0.1);
        }
    });
    RenderRegistry.register('SHEEP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#ffcccc';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
        }
    });
    RenderRegistry.register('GIANT_CHICKEN', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            c.fillStyle = '#ff0000';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.1, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
            c.fillStyle = '#ffa500';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.5, 0);
            c.lineTo(TILE_SIZE * 0.7, 0);
            c.lineTo(TILE_SIZE * 0.5, TILE_SIZE * 0.1);
            c.fill();
        }
    });
    RenderRegistry.register('GIANT_FROG', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#32cd32';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            c.fillStyle = '#006400';
            c.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.3, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
            c.fillRect(TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
        }
    });
}
