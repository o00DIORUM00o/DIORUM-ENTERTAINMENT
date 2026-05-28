import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineVillagersRenderers() {
    RenderRegistry.register('NPC_KING', {
        draw: (ctx: RenderContext) => {
            // Golden Robes
            ctx.ctx.fillStyle = '#ffb703'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head
            ctx.ctx.fillStyle = '#fcd34d';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Crown
            ctx.ctx.fillStyle = '#fb8500';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.1, -ctx.TILE_SIZE * 0.35);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.05, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.2, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.05, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.1, ctx.TILE_SIZE * 0.35);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('NPC_WIZARD', {
        draw: (ctx: RenderContext) => {
            // Blue Robes
            ctx.ctx.fillStyle = '#1d4ed8'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head
            ctx.ctx.fillStyle = '#fcd34d';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Wizard Hat
            ctx.ctx.fillStyle = '#1e3a8a';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.4, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('VILLAGER', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const prof = (ent as any).profession;
            let renderColor = '#78716c'; 
            if (prof === 'VILLAGER_GUARD') renderColor = '#1e3a8a';
            else if (prof === 'VILLAGER_FARMER') renderColor = '#65a30d';
            else if (prof === 'VILLAGER_MERCHANT') renderColor = '#b45309';
            else if (prof === 'VILLAGER_BEGGAR') renderColor = '#57534e'; 
            else if (prof === 'VILLAGER_THIEF') renderColor = '#1c1917'; 
            else if (prof === 'VILLAGER_SMITH') renderColor = '#b45309'; 
            else if (prof === 'VILLAGER_ALCHEMIST') renderColor = '#059669'; 
            else if (prof === 'VILLAGER_PRIEST') renderColor = '#fafafa'; 
            else if (prof === 'VILLAGER_BOUNTY_HUNTER') renderColor = '#451a03'; 
            else if (prof === 'VILLAGER_GLADIATOR') renderColor = '#991b1b'; 
            else if (prof === 'VILLAGER_ENCHANTER') renderColor = '#4f46e5'; 
            else if (prof === 'VILLAGER_KNIGHT') renderColor = '#cbd5e1'; 
            else if (prof === 'VILLAGER_NOBLE') renderColor = '#7e22ce'; 
            else if (prof === 'VILLAGER_COUNCILOR') renderColor = '#0f172a'; 
            else if (prof === 'VILLAGER_NECROMANCER') renderColor = '#000000'; 
            else if (prof === 'VILLAGER_JESTER') renderColor = '#ef4444'; 
            else if (prof === 'VILLAGER_SHAMAN') renderColor = '#14532d'; 
            else if (prof === 'VILLAGER_WIZARD') renderColor = '#1d4ed8'; 
            else if (ent.type === 'DRACONIC_MERCHANT') renderColor = '#7a0000';
            
            ctx.ctx.fillStyle = renderColor;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.fillStyle = (prof === 'VILLAGER_NECROMANCER') ? '#f1f5f9' : '#fcd34d';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            if (prof === 'VILLAGER_GUARD') {
                ctx.ctx.fillStyle = '#cbd5e1';
                ctx.ctx.fillRect(ctx.TILE_SIZE * -0.1, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.5);
                ctx.ctx.fillStyle = '#78350f';
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.8, 4);
                ctx.ctx.fillStyle = '#94a3b8'; 
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ctx.TILE_SIZE * 1.0, ctx.TILE_SIZE * 0.25 + 2);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 1.2, ctx.TILE_SIZE * 0.25 + 2);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 1.0, ctx.TILE_SIZE * 0.25 + 8);
                ctx.ctx.fill();
            } else if (prof === 'VILLAGER_FARMER') {
                ctx.ctx.fillStyle = '#fef08a';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * -0.05, 0, ctx.TILE_SIZE * 0.35, 0, Math.PI * 2);
                ctx.ctx.fill();
                ctx.ctx.fillStyle = '#ca8a04';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.05, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (prof === 'VILLAGER_KNIGHT') {
                ctx.ctx.fillStyle = '#cbd5e1';
                ctx.ctx.fillRect(ctx.TILE_SIZE * -0.1, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.5);
                ctx.ctx.fillStyle = '#0f172a'; 
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.05);
            } else if (prof === 'VILLAGER_MERCHANT' || prof === 'VILLAGER_NOBLE') {
                ctx.ctx.fillStyle = prof === 'VILLAGER_NOBLE' ? '#ef4444' : '#eab308';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.4, 0, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (prof === 'VILLAGER_NECROMANCER') {
                ctx.ctx.fillStyle = '#10b981';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.08, ctx.TILE_SIZE * 0.05, 0, Math.PI * 2);
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.08, ctx.TILE_SIZE * 0.05, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (prof === 'VILLAGER_SMITH') {
                ctx.ctx.fillStyle = '#94a3b8'; 
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1);
                ctx.ctx.fillStyle = '#78350f'; 
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.22, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.06);
            }
        }
    });
}
