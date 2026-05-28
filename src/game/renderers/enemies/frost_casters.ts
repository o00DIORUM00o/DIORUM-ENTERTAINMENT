import { RenderContext } from '../../registries/RenderRegistry';

export function defineFrostCasterRenderer() {
    return {
        draw: (ctx: RenderContext) => {
            const e = ctx.entity;
            const size = ctx.TILE_SIZE * 0.7; // Human scale
            
            // Draw magic shield
            if (e.magicShield > 0) {
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
                ctx.ctx.fillStyle = `rgba(0, 255, 255, ${Math.min(0.3, e.magicShield / 100)})`;
                ctx.ctx.fill();
                ctx.ctx.strokeStyle = `rgba(0, 200, 255, ${Math.min(0.6, e.magicShield / 100)})`;
                ctx.ctx.lineWidth = 2;
                ctx.ctx.stroke();
            }

            // Draw Robe/Body
            ctx.ctx.fillStyle = e.isLoyal ? '#4a90e2' : '#ffffff'; // Loyal = blue robes, Hostile = white robes
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head/Hood area
            ctx.ctx.fillStyle = '#1e3a8a';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Ice spikes from back (pure aesthetic)
            ctx.ctx.strokeStyle = '#00ffff';
            ctx.ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const angle = e.aimAngle + Math.PI + (i - 1) * 0.5;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(Math.cos(angle) * size * 0.5, Math.sin(angle) * size * 0.5);
                ctx.ctx.lineTo(Math.cos(angle) * size * 1.5, Math.sin(angle) * size * 1.5);
                ctx.ctx.stroke();
            }

            // Draw staff/wand
            ctx.ctx.strokeStyle = '#4b5563'; // metal staff
            ctx.ctx.lineWidth = 4;
            const staffAngle = e.aimAngle + 0.5;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(Math.cos(staffAngle) * size * 0.5, Math.sin(staffAngle) * size * 0.5);
            ctx.ctx.lineTo(Math.cos(staffAngle) * size * 2.0, Math.sin(staffAngle) * size * 2.0);
            ctx.ctx.stroke();
            
            // Staff glow
            ctx.ctx.fillStyle = '#00ffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(staffAngle) * size * 2.0, Math.sin(staffAngle) * size * 2.0, size * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Cast indicator
            if (e.castTimer > 0) {
                const castProgress = Math.min(1.0, e.castTimer / 1.0);
                ctx.ctx.fillStyle = `rgba(0, 255, 255, ${castProgress})`;
                ctx.ctx.beginPath();
                ctx.ctx.arc(Math.cos(e.aimAngle) * size * 1.5, Math.sin(e.aimAngle) * size * 1.5, size * 0.5 * castProgress, 0, Math.PI * 2);
                ctx.ctx.fill();
            }
        }
    };
}
