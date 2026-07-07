import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { BLOCK_COLORS } from '../Constants';
import { BlockType } from '../constants/BlockType';
;

export function defineProjectileRenderers() {
    RenderRegistry.register('BOMB', {
        draw: (ctx: RenderContext) => {
            const b = ctx.entity;
            // Bomb body
            ctx.ctx.fillStyle = '#222';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Fuse
            ctx.ctx.strokeStyle = '#a52a2a';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, -ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(Math.sin(b.timer * 10) * 5, -ctx.TILE_SIZE * 0.6);
            ctx.ctx.stroke();
            
            // Spark
            ctx.ctx.fillStyle = b.timer % 0.2 > 0.1 ? '#ff4500' : '#ffff00';
            ctx.ctx.beginPath();
            ctx.ctx.arc(Math.sin(b.timer * 10) * 5, -ctx.TILE_SIZE * 0.6, 3, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('MAGIC_TORNADO', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            const sizeMultiplier = p.size || 1.0;
            ctx.ctx.fillStyle = p.color || '#daa520';
            ctx.ctx.globalAlpha = 0.8;
            
            // Draw a spinning tornado effect
            const spin = ctx.time * 0.01;
            for (let i = 0; i < 3; i++) {
                ctx.ctx.beginPath();
                ctx.ctx.ellipse(
                    Math.cos(spin + i) * 5, 
                    -i * 5, 
                    ctx.TILE_SIZE * 0.5 * sizeMultiplier * (1 - i*0.2), 
                    ctx.TILE_SIZE * 0.2 * sizeMultiplier * (1 - i*0.2), 
                    0, 0, Math.PI * 2
                );
                ctx.ctx.fill();
            }
            ctx.ctx.globalAlpha = 1.0;
        }
    });

    RenderRegistry.register('SAND_LASER', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            const angle = Math.atan2(p.vy, p.vx);
            const sizeMultiplier = p.size || 1.0;
            
            ctx.ctx.rotate(angle);
            ctx.ctx.fillStyle = p.color || '#00ffff';
            ctx.ctx.shadowBlur = 15;
            ctx.ctx.shadowColor = p.color || '#00ffff';
            
            // Laser beam shape
            ctx.ctx.fillRect(-ctx.TILE_SIZE * sizeMultiplier, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * sizeMultiplier * 2, ctx.TILE_SIZE * 0.2);
            
            ctx.ctx.shadowBlur = 0;
        }
    });

    RenderRegistry.register('PROJECTILE', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            const angle = Math.atan2(p.vy, p.vx);
            if (p.scale) ctx.ctx.scale(p.scale, p.scale);
            
            if (p.isPot) {
                ctx.ctx.fillStyle = `rgb(${BLOCK_COLORS[p.thrownBlockType || BlockType.POT].r}, ${BLOCK_COLORS[p.thrownBlockType || BlockType.POT].g}, ${BLOCK_COLORS[p.thrownBlockType || BlockType.POT].b})`;
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
                ctx.ctx.fill();
                ctx.ctx.strokeStyle = '#000';
                ctx.ctx.lineWidth = 1;
                ctx.ctx.stroke();
            } else if (p.isBoomerang) {
                ctx.ctx.rotate(p.rotation || 0);
                
                ctx.ctx.fillStyle = p.color || '#d2b48c';
                ctx.ctx.strokeStyle = '#000';
                ctx.ctx.lineWidth = 1.5;
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI); // Half circle
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.2, Math.PI, 0, true); // Inner half
                ctx.ctx.closePath();
                ctx.ctx.fill();
                ctx.ctx.stroke();
            } else if (p.damageType === 'MAGIC_SWORD') {
                ctx.ctx.rotate(angle);
                ctx.ctx.fillStyle = '#00ffff'; 
                ctx.ctx.shadowBlur = 15;
                ctx.ctx.shadowColor = '#00ffff';
                
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, -Math.PI / 2, Math.PI / 2);
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.4, Math.PI / 2, -Math.PI / 2, true);
                ctx.ctx.fill();
                ctx.ctx.shadowBlur = 0;
            } else if (p.damageType || p.color || p.isFireball || p.isAcid) {
                let color = p.color || '#fff';
                if (p.damageType === 'FIRE' || p.isFireball) color = '#ff4500';
                else if (p.damageType === 'ICE') color = '#00ffff';
                else if (p.damageType === 'LIGHTNING') color = '#ffff00';
                else if (p.damageType === 'ARCANE') color = '#9932cc';
                else if (p.damageType === 'ACID' || p.isAcid) color = '#32cd32';
                else if (p.damageType === 'PHYSICAL') color = '#a8a29e';
                else if (p.damageType === 'DIG') color = '#8b4513'; 

                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
                ctx.ctx.fillStyle = color;
                ctx.ctx.fill();
                
                ctx.ctx.shadowBlur = 10;
                ctx.ctx.shadowColor = color;
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
                ctx.ctx.fillStyle = '#fff';
                ctx.ctx.fill();
                ctx.ctx.shadowBlur = 0;
            } else {
                ctx.ctx.rotate(angle);
                ctx.ctx.strokeStyle = '#5c4033'; 
                ctx.ctx.lineWidth = 1.5;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(-6, 0);
                ctx.ctx.lineTo(6, 0);
                ctx.ctx.stroke();
                
                ctx.ctx.fillStyle = '#5c4033';
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(6, 0);
                ctx.ctx.lineTo(2, -3);
                ctx.ctx.lineTo(2, 3);
                ctx.ctx.fill();
            }
        }
    });

    RenderRegistry.register('ARROW', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            const angle = Math.atan2(p.vy, p.vx);
            ctx.ctx.rotate(angle);
            ctx.ctx.strokeStyle = '#5c4033'; 
            ctx.ctx.lineWidth = 1.5;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-6, 0);
            ctx.ctx.lineTo(6, 0);
            ctx.ctx.stroke();
            
            ctx.ctx.fillStyle = '#5c4033';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(6, 0);
            ctx.ctx.lineTo(2, -3);
            ctx.ctx.lineTo(2, 3);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('BOOMERANG', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            ctx.ctx.rotate(ctx.time * 0.02);
            ctx.ctx.strokeStyle = '#1a1005'; 
            ctx.ctx.lineWidth = 2;
            ctx.ctx.fillStyle = '#8b5a2b';
            
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, Math.sin(0) * 8);
            for (let i = 0; i <= Math.PI; i += 0.1) {
                ctx.ctx.lineTo(Math.cos(i) * 8, Math.sin(i) * 8);
            }
            ctx.ctx.lineTo(Math.cos(Math.PI) * 4, Math.sin(Math.PI) * 4);
            for (let i = Math.PI; i >= 0; i -= 0.1) {
                ctx.ctx.lineTo(Math.cos(i) * 4, Math.sin(i) * 4);
            }
            ctx.ctx.fill();
            ctx.ctx.stroke();
        }
    });

    RenderRegistry.register('FIRE_BOLT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fillStyle = '#ff4500';
            ctx.ctx.fill();
            
            ctx.ctx.shadowBlur = 10;
            ctx.ctx.shadowColor = '#ff4500';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fillStyle = '#fff';
            ctx.ctx.fill();
            ctx.ctx.shadowBlur = 0;
        }
    });

    RenderRegistry.register('PERSISTENT_AOE', {
        draw: (ctx: RenderContext) => {
            const paoe = ctx.entity;
            const t = ctx.time * 0.005;
            const alpha = 0.3 + Math.sin(t) * 0.1;

            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, (paoe.radius || 1) * ctx.TILE_SIZE, 0, Math.PI * 2);
            
            // Setup base style
            if (paoe.type === 'FIRE') {
                ctx.ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
                ctx.ctx.strokeStyle = `rgba(255, 0, 0, 0.8)`;
            } else if (paoe.type === 'ARCANE_PROTECTION') {
                ctx.ctx.fillStyle = `rgba(153, 50, 204, ${alpha * 0.5})`; // More transparent center
                ctx.ctx.strokeStyle = `rgba(153, 50, 204, 0.8)`;
            } else {
                ctx.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
            }

            ctx.ctx.fill();

            // Draw runes/border for Arcane Protection
            if (paoe.type === 'ARCANE_PROTECTION') {
                ctx.ctx.lineWidth = 2;
                ctx.ctx.stroke();
                
                // Draw inner spinning circle
                ctx.ctx.rotate(t * 0.2);
                ctx.ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.ctx.arc(0, 0, (paoe.radius || 1) * ctx.TILE_SIZE * 0.8, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 4);
                }
                ctx.ctx.stroke();
            } else if (paoe.type === 'FIRE') {
                // Flickering jagged border for fire
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                const numPoints = 12;
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const r = (paoe.radius || 1) * ctx.TILE_SIZE + (Math.random() * 4 - 2);
                    if (i === 0) ctx.ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                    else ctx.ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                }
                ctx.ctx.stroke();
            }
        }
    });

    RenderRegistry.register('AOE', {
        draw: (ctx: RenderContext) => {
            const aoe = ctx.entity;
            let color = 'rgba(255, 255, 255, 0.5)';
            if (aoe.damageType === 'FIRE') color = `rgba(255, 100, 0, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'ICE') color = `rgba(100, 200, 255, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'LIGHTNING') color = `rgba(255, 255, 100, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'ARCANE') color = `rgba(200, 100, 255, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'ACID') color = `rgba(100, 255, 100, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'EXPLOSION') color = `rgba(255, 50, 50, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'PHYSICAL') color = `rgba(168, 162, 158, ${aoe.life / aoe.maxLife})`;
            else if (aoe.damageType === 'WATER') color = `rgba(59, 130, 246, ${aoe.life / aoe.maxLife})`; // A nice ripple color

            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, (aoe.radius || 1) * ctx.TILE_SIZE, 0, Math.PI * 2);
            ctx.ctx.fillStyle = color;
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('CONE', {
        draw: (ctx: RenderContext) => {
            const cone = ctx.entity;
            ctx.ctx.rotate(cone.angle || 0);
            
            const alpha = Math.max(0, cone.life / cone.maxLife);
            let color = `rgba(255, 255, 255, ${alpha * 0.5})`;
            if (cone.damageType === 'FIRE') color = `rgba(255, 100, 0, ${alpha})`;
            else if (cone.damageType === 'ICE') color = `rgba(100, 200, 255, ${alpha})`;
            else if (cone.damageType === 'LIGHTNING') color = `rgba(255, 255, 100, ${alpha})`;
            else if (cone.damageType === 'ARCANE') color = `rgba(200, 100, 255, ${alpha})`;
            else if (cone.damageType === 'ACID') color = `rgba(100, 255, 100, ${alpha})`;
            else if (cone.damageType === 'PHYSICAL') color = `rgba(168, 162, 158, ${alpha})`;

            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, 0);
            ctx.ctx.arc(0, 0, (cone.radius || 1) * ctx.TILE_SIZE, -(cone.spread || Math.PI/4), (cone.spread || Math.PI/4));
            ctx.ctx.lineTo(0, 0);
            ctx.ctx.fillStyle = color;
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('arcane_light', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const pulse = Math.sin((ent.timer || 0) * 4) * 0.2 + 1;
            ctx.ctx.fillStyle = `rgba(135, 206, 250, ${0.5 * pulse})`; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.6 * pulse, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('magic_missile', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            const color = p.color || '#ff00ff';
            ctx.ctx.fillStyle = color;
            ctx.ctx.shadowColor = color;
            ctx.ctx.shadowBlur = 10;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.shadowBlur = 0;
        }
    });

    RenderRegistry.register('rock', {
        draw: (ctx: RenderContext) => {
            const p = ctx.entity;
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('exploding_rune', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.rotate((ent.timer || 0) % (Math.PI * 2));
            ctx.ctx.fillStyle = 'rgba(255, 69, 0, 0.7)'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * ctx.TILE_SIZE * 0.2, -Math.sin((18 + i * 72) / 180 * Math.PI) * ctx.TILE_SIZE * 0.2);
                ctx.ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * ctx.TILE_SIZE * 0.1, -Math.sin((54 + i * 72) / 180 * Math.PI) * ctx.TILE_SIZE * 0.1);
            }
            ctx.ctx.fill();
        }
    });
}
