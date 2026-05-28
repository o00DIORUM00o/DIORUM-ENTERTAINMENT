import { RenderContext } from '../../registries/RenderRegistry';

export function defineWinterElfRenderer() {
    return {
        draw: (ctx: RenderContext) => {
            const e = ctx.entity;
            const size = ctx.TILE_SIZE * 0.7;
            
            // Draw Body - Pale blue/white armor
            ctx.ctx.fillStyle = '#d4e6f1'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.strokeStyle = '#a9cce3';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.stroke();

            // Draw Head
            ctx.ctx.fillStyle = '#ffdfc4'; // Pale skin
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Draw bow (Winter Elves are archers)
            ctx.ctx.strokeStyle = '#5499c7'; // Ice-colored bow
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(e.aimAngle) * size * 1.2, Math.sin(e.aimAngle) * size * 1.2, size, e.aimAngle - Math.PI / 2, e.aimAngle + Math.PI / 2);
            ctx.ctx.stroke();
            
            // Draw string
            ctx.ctx.strokeStyle = 'white';
            ctx.ctx.lineWidth = 1;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(
                Math.cos(e.aimAngle) * size * 1.2 + Math.cos(e.aimAngle - Math.PI / 2) * size,
                Math.sin(e.aimAngle) * size * 1.2 + Math.sin(e.aimAngle - Math.PI / 2) * size
            );
            ctx.ctx.lineTo(
                Math.cos(e.aimAngle) * size * 1.2 + Math.cos(e.aimAngle + Math.PI / 2) * size,
                Math.sin(e.aimAngle) * size * 1.2 + Math.sin(e.aimAngle + Math.PI / 2) * size
            );
            ctx.ctx.stroke();
        }
    };
}

export function defineYetiRenderer() {
    return {
        draw: (ctx: RenderContext) => {
            const e = ctx.entity;
            const size = ctx.TILE_SIZE * 1.5; // Big guy
            
            // Draw thick fur body
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Shaggy details
            ctx.ctx.strokeStyle = '#e5e7eb';
            ctx.ctx.lineWidth = 4;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(Math.cos(angle) * size * 0.8, Math.sin(angle) * size * 0.8);
                ctx.ctx.lineTo(Math.cos(angle) * size * 1.2, Math.sin(angle) * size * 1.2);
                ctx.ctx.stroke();
            }

            // Head
            ctx.ctx.fillStyle = '#d1d5db';
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(e.aimAngle) * size * 0.4, Math.sin(e.aimAngle) * size * 0.4, size * 0.6, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Big fists
            ctx.ctx.fillStyle = '#e5e7eb';
            const leftFistAngle = e.aimAngle - 0.7;
            const rightFistAngle = e.aimAngle + 0.7;
            
            // Pummeling animation
            const leftExt = e.attackTimer > 0 && e.attackTimer < 0.2 ? 1.5 : 1.0;
            const rightExt = e.attackTimer >= 0.2 ? 1.5 : 1.0;

            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(leftFistAngle) * size * leftExt, Math.sin(leftFistAngle) * size * leftExt, size * 0.5, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(rightFistAngle) * size * rightExt, Math.sin(rightFistAngle) * size * rightExt, size * 0.5, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    };
}

export function defineFrostWolfRenderer() {
    return {
        draw: (ctx: RenderContext) => {
            const e = ctx.entity;
            const size = ctx.TILE_SIZE * 0.9;
            
            ctx.ctx.fillStyle = '#e0f2fe';
            ctx.ctx.beginPath();
            // Body shape
            ctx.ctx.ellipse(0, 0, size, size * 0.5, e.aimAngle, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(e.aimAngle) * size * 0.8, Math.sin(e.aimAngle) * size * 0.8, size * 0.5, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Icy eyes
            ctx.ctx.fillStyle = '#38bdf8';
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.cos(e.aimAngle) * size * 1.0, Math.sin(e.aimAngle) * size * 1.0, size * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    };
}
