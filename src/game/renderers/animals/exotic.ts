import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineExoticRenderers() {
    RenderRegistry.register('GRYPHON', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // Bird/Lion body
            ctx.ctx.fillStyle = '#f59e0b'; // Goldish 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts * 0.6, ts * 0.35, 0, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head/Beak
            ctx.ctx.fillStyle = '#ffffff'; // White head
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.4, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Beak
            ctx.ctx.fillStyle = '#eab308'; // Yellow beak
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts * 0.6, -ts * 0.1);
            ctx.ctx.lineTo(ts * 0.9, 0);
            ctx.ctx.lineTo(ts * 0.6, ts * 0.1);
            ctx.ctx.fill();
            
            // Wings
            ctx.ctx.fillStyle = '#fef08a';
            const wingFlap = Math.sin(ctx.time * 0.01) * 0.4;
            ctx.ctx.save();
            ctx.ctx.translate(0, -ts * 0.2);
            ctx.ctx.rotate(-wingFlap);
            ctx.ctx.fillRect(-ts * 0.2, -ts * 0.6, ts * 0.4, ts * 0.6);
            ctx.ctx.restore();

            ctx.ctx.save();
            ctx.ctx.translate(0, ts * 0.2);
            ctx.ctx.rotate(wingFlap);
            ctx.ctx.fillRect(-ts * 0.2, 0, ts * 0.4, ts * 0.6);
            ctx.ctx.restore();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('UNICORN', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FFD700';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.6, 0);
            c.lineTo(TILE_SIZE * 1.0, 0);
            c.lineTo(TILE_SIZE * 0.6, -TILE_SIZE * 0.1);
            c.fill();
        }
    });
    RenderRegistry.register('CAPYBARA', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B5A2B';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            c.fillStyle = '#5C4033';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#000000';
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.1, 4, 4);
        }
    });
    RenderRegistry.register('OBSIDIAN_SHEEP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#111111';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#333333';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#8B0000'; // Red glowing eyes
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.1, 4, 4);
        }
    });
    
    RenderRegistry.register('FAIRY', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            const t = performance.now() / 200;
            const bob = Math.sin(t * 3) * TILE_SIZE * 0.1;
            c.translate(0, bob);
            c.rotate(entity?.aimAngle || 0);
            
            // Wings
            c.fillStyle = 'rgba(255, 200, 255, 0.6)';
            c.beginPath();
            c.ellipse(0, -TILE_SIZE * 0.3, TILE_SIZE * 0.1, TILE_SIZE * 0.4, Math.sin(t*5)*0.5, 0, Math.PI*2);
            c.fill();
            c.beginPath();
            c.ellipse(0, TILE_SIZE * 0.3, TILE_SIZE * 0.1, TILE_SIZE * 0.4, -Math.sin(t*5)*0.5, 0, Math.PI*2);
            c.fill();

            // Body
            c.fillStyle = '#ffb6c1';
            c.shadowColor = '#ff69b4';
            c.shadowBlur = 15;
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.2, 0, Math.PI*2);
            c.fill();
            c.shadowBlur = 0;
        }
    });

    RenderRegistry.register('SHADOW_WISP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            const t = performance.now() / 300;
            const bob = Math.sin(t * 2) * TILE_SIZE * 0.15;
            c.translate(0, bob);
            c.rotate(entity?.aimAngle || 0);

            // Aura
            c.fillStyle = 'rgba(50, 0, 80, 0.5)';
            c.shadowColor = '#8000ff';
            c.shadowBlur = 20;
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.3 + Math.sin(t*4)*TILE_SIZE*0.05, 0, Math.PI*2);
            c.fill();

            // Core
            c.fillStyle = '#110022';
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.15, 0, Math.PI*2);
            c.fill();
            
            // Eye
            c.fillStyle = '#ff00ff';
            c.beginPath();
            c.arc(TILE_SIZE * 0.05, 0, TILE_SIZE * 0.05, 0, Math.PI*2);
            c.fill();
            c.shadowBlur = 0;
        }
    });

    RenderRegistry.register('ARCANE_CRYSTAL', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            const t = performance.now() / 400;
            const bob = Math.sin(t * 3) * TILE_SIZE * 0.2;
            c.translate(0, bob);
            c.rotate((t*0.5) % (Math.PI*2));

            c.fillStyle = '#00ffff';
            c.shadowColor = '#00ccff';
            c.shadowBlur = 15;
            
            // Draw diamond shape
            c.beginPath();
            c.moveTo(0, -TILE_SIZE * 0.4);
            c.lineTo(TILE_SIZE * 0.2, 0);
            c.lineTo(0, TILE_SIZE * 0.4);
            c.lineTo(-TILE_SIZE * 0.2, 0);
            c.closePath();
            c.fill();
            c.shadowBlur = 0;
            
            c.fillStyle = 'rgba(255, 255, 255, 0.5)';
            c.beginPath();
            c.moveTo(0, -TILE_SIZE * 0.4);
            c.lineTo(TILE_SIZE * 0.1, 0);
            c.lineTo(0, TILE_SIZE * 0.4);
            c.closePath();
            c.fill();
        }
    });

    RenderRegistry.register('BABY_TREANT', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            const t = performance.now() / 300;
            const bob = Math.sin(t * 4) * TILE_SIZE * 0.05;
            c.translate(0, bob);
            c.rotate(entity?.aimAngle || 0);

            // Trunk body
            c.fillStyle = '#5c4033';
            c.beginPath();
            c.ellipse(0, 0, TILE_SIZE * 0.3, TILE_SIZE * 0.2, 0, 0, Math.PI*2);
            c.fill();
            
            // Leaves on top
            c.fillStyle = '#228B22';
            c.beginPath();
            c.arc(0, -TILE_SIZE * 0.1, TILE_SIZE * 0.3, 0, Math.PI*2);
            c.fill();
            c.beginPath();
            c.arc(-TILE_SIZE * 0.15, 0, TILE_SIZE * 0.2, 0, Math.PI*2);
            c.fill();
            c.beginPath();
            c.arc(TILE_SIZE * 0.15, 0, TILE_SIZE * 0.2, 0, Math.PI*2);
            c.fill();

            // Eyes
            c.fillStyle = '#ffffbb';
            c.beginPath();
            c.arc(TILE_SIZE * 0.15, -TILE_SIZE * 0.05, 3, 0, Math.PI*2);
            c.fill();
            c.beginPath();
            c.arc(TILE_SIZE * 0.15, TILE_SIZE * 0.05, 3, 0, Math.PI*2);
            c.fill();
        }
    });

    RenderRegistry.register('BATTLE_PIG', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            const t = performance.now() / 200;
            const bob = Math.sin(t * 5) * TILE_SIZE * 0.05;
            c.translate(0, bob);
            c.rotate(entity?.aimAngle || 0);

            // Body
            c.fillStyle = '#ffb3c6';
            c.beginPath();
            c.ellipse(0, 0, TILE_SIZE * 0.5, TILE_SIZE * 0.3, 0, 0, Math.PI*2);
            c.fill();

            // Armor
            c.fillStyle = '#aaaaaa';
            c.beginPath();
            c.ellipse(0, 0, TILE_SIZE * 0.4, TILE_SIZE * 0.25, 0, -Math.PI/2, Math.PI/2);
            c.fill();

            // Head
            c.fillStyle = '#ffb3c6';
            c.beginPath();
            c.arc(TILE_SIZE * 0.4, 0, TILE_SIZE * 0.2, 0, Math.PI*2);
            c.fill();

            // Snout
            c.fillStyle = '#ff8fab';
            c.beginPath();
            c.arc(TILE_SIZE * 0.55, 0, TILE_SIZE * 0.1, 0, Math.PI*2);
            c.fill();

            // Eyes (angry)
            c.strokeStyle = '#000';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.45, -TILE_SIZE * 0.05);
            c.stroke();
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.4, TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.45, TILE_SIZE * 0.05);
            c.stroke();
            
            // Tusks
            c.fillStyle = '#ffffff';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.5, -TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.65, -TILE_SIZE * 0.2);
            c.lineTo(TILE_SIZE * 0.55, -TILE_SIZE * 0.05);
            c.fill();
            
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.5, TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.65, TILE_SIZE * 0.2);
            c.lineTo(TILE_SIZE * 0.55, TILE_SIZE * 0.05);
            c.fill();
        }
    });
}
