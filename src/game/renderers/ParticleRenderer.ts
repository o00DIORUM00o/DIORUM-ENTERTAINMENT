import { TILE_SIZE } from '../Constants';

export class ParticleRenderer {
    static draw(ctx: CanvasRenderingContext2D, engine: any, halfW: number, halfH: number, playerZ: number) {
        const { player, particles } = engine;
        // Draw Particles
        for (const p of particles) {
            // Only draw particles near the player's Z level
            if (Math.abs(p.z - player.z) > 4) continue;

            const screenX = halfW + (p.x - player.x) * TILE_SIZE + TILE_SIZE / 2;
            const screenY = halfH + (p.y - player.y) * TILE_SIZE;
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            
            if (p.text === '') {
                // Draw ambient glowing dot
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(p.text, screenX, screenY);
            }
            ctx.globalAlpha = 1.0;
        }
    }
}
