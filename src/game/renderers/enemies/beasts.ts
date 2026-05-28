import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineBeastsRenderers() {
    RenderRegistry.register('RAT', {
        draw: (ctx: RenderContext) => {
            const rat = ctx.entity;
            ctx.ctx.rotate(rat.aimAngle || 0);
            
            // Draw rat body (brown)
            ctx.ctx.fillStyle = '#8B4513';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.15, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Draw tail
            ctx.ctx.strokeStyle = '#A0522D';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.3, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.6, Math.sin(performance.now() / 100) * 5); // Wiggle tail
            ctx.ctx.stroke();
        }
    });
    RenderRegistry.register('CAVE_SPIDER', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.rotate(ent.target ? Math.atan2(ent.target.y - ent.y, ent.target.x - ent.x) : 0);
            ctx.ctx.fillStyle = '#222222';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill(); // body
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI*2);
            ctx.ctx.fill(); // head
            ctx.ctx.strokeStyle = '#111';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            for(let i=0; i<4; i++) {
                ctx.ctx.moveTo(0, 0); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.4, ctx.TILE_SIZE*(i*0.2 - 0.3));
                ctx.ctx.moveTo(0, 0); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.4, -ctx.TILE_SIZE*(i*0.2 - 0.3));
            }
            ctx.ctx.stroke();
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, -ctx.TILE_SIZE * 0.05, 1.5, 0, Math.PI*2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.05, 1.5, 0, Math.PI*2);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('BEE', {
        draw: (ctx: RenderContext) => {
            const bee = ctx.entity;
            ctx.ctx.translate(0, Math.sin(performance.now() / 100 + bee.x) * 4); // Hover effect
            ctx.ctx.rotate(bee.aimAngle || 0);
            
            // Body
            ctx.ctx.fillStyle = '#FFD700'; // Yellow
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Stripes
            ctx.ctx.fillStyle = '#000000'; // Black
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.05, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.15, -ctx.TILE_SIZE * 0.08, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.16);
            
            // Wings
            ctx.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            const wingFlap = Math.sin(performance.now() / 20) * 0.2;
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, Math.max(0.01, ctx.TILE_SIZE * (0.15 + wingFlap)), 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, Math.max(0.01, ctx.TILE_SIZE * (0.15 + wingFlap)), 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Stinger
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.2, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, -3);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, 3);
            ctx.ctx.fill();
        }
    });
    RenderRegistry.register('ANT', {
        draw: (ctx: RenderContext) => {
            const ant = ctx.entity;
            ctx.ctx.rotate(ant.aimAngle || 0);
            
            // Ant body - 3 segments
            ctx.ctx.fillStyle = ant.isWarrior ? '#8B0000' : '#8B4513'; // Dark red for warriors, brown for workers
            
            // Abdomen
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.1, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Thorax
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.08, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Legs (6 legs)
            ctx.ctx.strokeStyle = ant.isWarrior ? '#8B0000' : '#8B4513';
            ctx.ctx.lineWidth = 1.5;
            const walkCycle = Math.sin(performance.now() / 50 + ant.x);
            
            for (let i = 0; i < 3; i++) {
                const offsetX = -ctx.TILE_SIZE * 0.1 + (i * ctx.TILE_SIZE * 0.1);
                const legWiggle = (i % 2 === 0 ? walkCycle : -walkCycle) * 3;
                
                // Top legs
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(offsetX, 0);
                ctx.ctx.lineTo(offsetX + legWiggle, -ctx.TILE_SIZE * 0.15);
                ctx.ctx.lineTo(offsetX - 2, -ctx.TILE_SIZE * 0.2);
                ctx.ctx.stroke();
                
                // Bottom legs
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(offsetX, 0);
                ctx.ctx.lineTo(offsetX - legWiggle, ctx.TILE_SIZE * 0.15);
                ctx.ctx.lineTo(offsetX - 2, ctx.TILE_SIZE * 0.2);
                ctx.ctx.stroke();
            }
            
            // Mandibles
            if (ant.isWarrior) {
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ctx.TILE_SIZE * 0.3, -3);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -6);
                ctx.ctx.stroke();
                
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ctx.TILE_SIZE * 0.3, 3);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, 6);
                ctx.ctx.stroke();
            }
        }
    });
    RenderRegistry.register('SAND_WORM', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            if (ent.state === 'HIDDEN') {
                ctx.ctx.fillStyle = '#111111';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4 + Math.random() * 2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else {
                ctx.ctx.fillStyle = '#554433';
                for (let s = 0; s < 4; s++) {
                    ctx.ctx.beginPath();
                    ctx.ctx.arc(-s * ctx.TILE_SIZE * 0.3, 0, ctx.TILE_SIZE * (0.6 - s * 0.1), 0, Math.PI * 2);
                    ctx.ctx.fill();
                    ctx.ctx.strokeStyle = '#332211';
                    ctx.ctx.lineWidth = 1;
                    ctx.ctx.stroke();
                }
                ctx.ctx.fillStyle = '#000000';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
                ctx.ctx.fill();
                ctx.ctx.fillStyle = '#dddddd';
                for (let t = 0; t < 6; t++) {
                    const a = t * (Math.PI / 3);
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2 + Math.cos(a) * ctx.TILE_SIZE * 0.3, Math.sin(a) * ctx.TILE_SIZE * 0.3);
                    ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2 + Math.cos(a) * ctx.TILE_SIZE * 0.2, Math.sin(a) * ctx.TILE_SIZE * 0.2);
                    ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2 + Math.cos(a + 0.2) * ctx.TILE_SIZE * 0.3, Math.sin(a + 0.2) * ctx.TILE_SIZE * 0.3);
                    ctx.ctx.fill();
                }
            }
        }
    });
}
