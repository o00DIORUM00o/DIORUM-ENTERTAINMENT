import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineDragonsRenderers() {
    RenderRegistry.register('FIRE_DRAGON_BOSS', {
        draw: (ctx: RenderContext) => {
            const dragon = ctx.entity;
            const t = performance.now() / 300;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.rotate(dragon.aimAngle || 0);

            // Wing flap physics based on state
            let wingSpan = 1.0;
            if (dragon.state === 'SLEEPING') {
                wingSpan = (Math.sin(t / 2) * 0.1) + 0.3; // Breathing slowly
            } else if (dragon.state === 'FLY_ATTACK') {
                wingSpan = Math.sin(t * 3) * 0.6 + 0.8; // Fast frantic flap
            } else {
                wingSpan = Math.sin(t * 1.5) * 0.5 + 0.8; // Normal flap
            }

            // Massive red scales
            ctx.ctx.fillStyle = '#8a0303'; 
            ctx.ctx.strokeStyle = '#3d0101';
            ctx.ctx.lineWidth = 3;

            // Tail
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ts*1.5, 0);
            ctx.ctx.lineTo(-ts*3.5, Math.sin(t*2)*ts*0.5);
            ctx.ctx.lineTo(-ts*1.5, ts*0.5);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Wings
            ctx.ctx.fillStyle = '#b31212';
            ctx.ctx.beginPath(); // Left
            ctx.ctx.moveTo(-ts*0.5, -ts*0.5);
            ctx.ctx.lineTo(-ts, -ts*4 * wingSpan);
            ctx.ctx.lineTo(ts*0.5, -ts*3 * wingSpan);
            ctx.ctx.lineTo(ts*0.5, -ts*0.5);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            ctx.ctx.beginPath(); // Right
            ctx.ctx.moveTo(-ts*0.5, ts*0.5);
            ctx.ctx.lineTo(-ts, ts*4 * wingSpan);
            ctx.ctx.lineTo(ts*0.5, ts*3 * wingSpan);
            ctx.ctx.lineTo(ts*0.5, ts*0.5);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Main Body Round
            ctx.ctx.fillStyle = '#8a0303';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts*1.8, ts*1.2, 0, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Head and Neck extension
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*1.5, -ts*0.3);
            ctx.ctx.lineTo(ts*2.5, -ts*0.5);
            ctx.ctx.lineTo(ts*3.2, 0);
            ctx.ctx.lineTo(ts*2.5, ts*0.5);
            ctx.ctx.lineTo(ts*1.5, ts*0.3);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Eyes / Glowing mouth if breathing fire
            if (dragon.state === 'BREATH_ATTACK') {
                ctx.ctx.fillStyle = '#FFA500';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*3.2, 0, ts*0.3 + Math.random()*ts*0.2, 0, Math.PI*2);
                ctx.ctx.fill();
            } else {
                ctx.ctx.fillStyle = '#FFA500'; // orange eyes
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*2.5, -ts*0.3, ts*0.1, 0, Math.PI*2);
                ctx.ctx.arc(ts*2.5, ts*0.3, ts*0.1, 0, Math.PI*2);
                ctx.ctx.fill();
            }

            // Health Bar
            ctx.ctx.rotate(-(dragon.aimAngle || 0)); // Reset rotation for health bar
            const hpPct = Math.max(0, dragon.health / dragon.maxHealth);
            ctx.ctx.fillStyle = '#000';
            ctx.ctx.fillRect(-ts*2, -ts*3, ts*4, ts*0.4);
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.fillRect(-ts*2, -ts*3, ts*4 * hpPct, ts*0.4);
            ctx.ctx.fillStyle = '#fff';
            ctx.ctx.font = 'bold 12px monospace';
            ctx.ctx.textAlign = 'center';
            ctx.ctx.fillText("FIRE DRAGON BOSS", 0, -ts*3.2);
            
            // Draw state if wanted
            // ctx.ctx.fillText(dragon.state, 0, -ts*3.8);
        }
    });
    RenderRegistry.register('DRAKE', {
        draw: (ctx: RenderContext) => {
            const drake = ctx.entity;
            ctx.ctx.rotate(drake.aimAngle || 0);
            ctx.ctx.fillStyle = '#cc0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ff9900';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.15, Math.PI / 4, 0, Math.PI * 2);
            ctx.ctx.ellipse(0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.15, -Math.PI / 4, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
}

function drawObserver(ctx: RenderContext, baseColor: string, eyeColor: string) {
    const ent = ctx.entity;
    ctx.ctx.translate(0, Math.sin(Date.now() / 200 + ent.x) * 4);
    ctx.ctx.fillStyle = baseColor;
    ctx.ctx.beginPath();
    ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.6, 0, Math.PI * 2);
    ctx.ctx.fill();
    ctx.ctx.fillStyle = '#ffffff';
    ctx.ctx.beginPath();
    ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
    ctx.ctx.fill();
    ctx.ctx.fillStyle = eyeColor;
    ctx.ctx.beginPath();
    ctx.ctx.arc(ctx.TILE_SIZE * 0.3, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
    ctx.ctx.fill();
    ctx.ctx.strokeStyle = baseColor;
    ctx.ctx.lineWidth = 3;
    const stalks = [{ a: -0.5, l: 0.8 }, { a: -1.5, l: 0.9 }, { a: 0.5, l: 0.8 }, { a: 1.5, l: 0.9 }];
    for (let stk of stalks) {
        ctx.ctx.beginPath();
        ctx.ctx.moveTo(0, 0);
        const sx = Math.cos(stk.a) * ctx.TILE_SIZE * stk.l;
        const sy = Math.sin(stk.a) * ctx.TILE_SIZE * stk.l;
        ctx.ctx.lineTo(sx, sy);
        ctx.ctx.stroke();
        ctx.ctx.fillStyle = '#ffffff';
        ctx.ctx.beginPath();
        ctx.ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.ctx.fill();
        ctx.ctx.fillStyle = eyeColor;
        ctx.ctx.beginPath();
        ctx.ctx.arc(sx + 1, sy, 2, 0, Math.PI * 2);
        ctx.ctx.fill();
    }
    if (ent.attackCooldown && ent.attackCooldown > 1.5) {
        ctx.ctx.fillStyle = ctx.entity.type === 'OBSERVER_FIRE' ? '#ffa500' : '#da70d6';
        ctx.ctx.globalAlpha = (ent.attackCooldown - 1.5) / 0.5;
        ctx.ctx.beginPath();
        ctx.ctx.arc(ctx.TILE_SIZE * 0.3, 0, ctx.TILE_SIZE * 0.2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.ctx.fill();
        ctx.ctx.globalAlpha = 1.0;
    }
    RenderRegistry.register('wyrmling', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#ba55d3';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8a2be2';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1, Math.PI / 4, 0, Math.PI * 2);
            ctx.ctx.ellipse(0, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1, -Math.PI / 4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#FFD700';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.05, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });
}
