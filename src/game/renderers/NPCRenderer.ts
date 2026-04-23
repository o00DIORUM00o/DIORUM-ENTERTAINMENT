import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';

export function defineNPCRenderers() {
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

    RenderRegistry.register('DRACONIC_MERCHANT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#cc0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.35, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffcc00'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.15, 6, 6);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 6, 6);
            ctx.ctx.fillStyle = '#eab308';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.4, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('SLUG_FOLK_MERCHANT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#8bc34a'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8bc34a';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.2, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2, 4);
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.5, -ctx.TILE_SIZE * 0.25, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillStyle = '#795548';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('HALFLING', {
        draw: (ctx: RenderContext) => {
            const prof = (ctx.entity as any).profession;
            let tunicColor = '#65a30d'; // Default green tunic
            if (prof === 'VILLAGER_MERCHANT') tunicColor = '#ca8a04';
            else if (prof === 'VILLAGER_FARMER') tunicColor = '#84cc16';
            
            // Smaller body
            ctx.ctx.fillStyle = tunicColor;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.22, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Bare feet (big) sticking out
            ctx.ctx.fillStyle = '#fcd34d'; // Skin tone
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.18, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.18, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head/hair (curly/brown)
            ctx.ctx.fillStyle = '#78350f'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.05, 0, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('PIT_BULL_FOLK', {
        draw: (ctx: RenderContext) => {
            // Bulky, muscular
            ctx.ctx.fillStyle = '#4b5563'; // Grey hide
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.2, ctx.TILE_SIZE * -0.3, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.6);
            
            // Apron or Armor
            ctx.ctx.fillStyle = '#78350f'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.1, ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.5);
            
            // Head & Snout (Wide, cropped ears)
            ctx.ctx.fillStyle = '#6b7280';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // White patch
            ctx.ctx.fillStyle = '#f3f4f6';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.25, 0, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.08, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Nose
            ctx.ctx.fillStyle = '#111827';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.35, 0, 3, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Small ears
            ctx.ctx.fillStyle = '#374151';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.05, -ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('POMERANIAN_FOLK', {
        draw: (ctx: RenderContext) => {
            // Small, extremely fluffy, giant backpack
            
            // Giant backpack (larger than them)
            ctx.ctx.fillStyle = '#8b5cf6'; // Bright purple or color
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * -0.15, 0, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.35, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            // Backpack bedroll
            ctx.ctx.fillStyle = '#d946ef';
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.3, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3);

            // Fluffy orange/tan body
            ctx.ctx.fillStyle = '#f97316';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
            // Fluff accents
            ctx.ctx.fillStyle = '#fb923c';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head & Snout
            ctx.ctx.fillStyle = '#fdba74';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.12, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Cute small nose
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, 0, 2, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Floofy curved tail
            ctx.ctx.fillStyle = '#f97316';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * -0.1, 0, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.08, Math.PI/4, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('TERRIER_FOLK', {
        draw: (ctx: RenderContext) => {
            // Scrappy, wiry, medium-small
            ctx.ctx.fillStyle = '#451a03'; // Dark brown
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.3);
            
            // Digging claws / gloves
            ctx.ctx.fillStyle = '#94a3b8';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head and beard/wiry fur
            ctx.ctx.fillStyle = '#57534e'; // Greyish brown
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.18, ctx.TILE_SIZE * 0.15, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Snout (longer)
            ctx.ctx.fillStyle = '#292524';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.08);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.25, -ctx.TILE_SIZE * 0.05);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.05);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.08);
            ctx.ctx.fill();

            // Nose
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, 0, 2, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Floppy ears forward
            ctx.ctx.fillStyle = '#451a03';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.15, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.08, Math.PI/4, 0, Math.PI * 2);
            ctx.ctx.ellipse(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.08, -Math.PI/4, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('WOLF_FOLK', {
        draw: (ctx: RenderContext) => {
            // Ranger-like, agile, cloak
            ctx.ctx.fillStyle = '#1e293b'; // Dark blue/grey cloak
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.2, ctx.TILE_SIZE * -0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.3, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * -0.2, ctx.TILE_SIZE * 0.3);
            ctx.ctx.fill();

            // Body (grey fur)
            ctx.ctx.fillStyle = '#64748b';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.22, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Bushy tail
            ctx.ctx.fillStyle = '#475569';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(ctx.TILE_SIZE * -0.25, 0, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Head
            ctx.ctx.fillStyle = '#64748b';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, 0, ctx.TILE_SIZE * 0.18, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Pointy Ears
            ctx.ctx.fillStyle = '#475569';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.05, -ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.0, -ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.15, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.0, ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
            
            // Wolf Snout (Long, grey to black)
            ctx.ctx.fillStyle = '#334155';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.05);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.05);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
            
            // Nose tip
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, 0, 3, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    const darkElfDraw = (ctx: RenderContext) => {
        ctx.ctx.fillStyle = '#1e1e24'; 
        ctx.ctx.beginPath();
        ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
        ctx.ctx.fill();
        ctx.ctx.fillStyle = '#1e1e24';
        ctx.ctx.beginPath();
        ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2);
        ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4);
        ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2);
        ctx.ctx.fill();
        ctx.ctx.beginPath();
        ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2);
        ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4);
        ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2);
        ctx.ctx.fill();
        ctx.ctx.fillStyle = '#d946ef'; 
        ctx.ctx.fillRect(ctx.TILE_SIZE * 0.15, -ctx.TILE_SIZE * 0.12, 4, 4);
        ctx.ctx.fillRect(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.08, 4, 4);
        ctx.ctx.fillStyle = '#4a044e'; 
        ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.4, 3);
    };

    RenderRegistry.register('DARK_ELF', { draw: darkElfDraw });
    RenderRegistry.register('DARK_ELF_ASSASSIN', { draw: darkElfDraw });

    RenderRegistry.register('DWARF', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#3f3f46'; 
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.35, -ctx.TILE_SIZE * 0.35, ctx.TILE_SIZE * 0.7, ctx.TILE_SIZE * 0.7);
            ctx.ctx.fillStyle = '#b45309'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.5);
            ctx.ctx.fillStyle = '#52525b';
            ctx.ctx.fillRect(0, -ctx.TILE_SIZE * 0.35, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.7);
            ctx.ctx.fillStyle = '#27272a'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.6, 6);
            ctx.ctx.fillStyle = '#94a3b8'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.7, ctx.TILE_SIZE * 0.15, 12, 26);
        }
    });

    RenderRegistry.register('DRACONIC_MERCHANT', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.fillStyle = '#b31212'; // dark red dragon scales
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // snout
            ctx.ctx.fillStyle = '#8a0303';
            ctx.ctx.fillRect(0, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.3);

            // golden robes
            ctx.ctx.fillStyle = '#eab308';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();

            // backpack / merchant items
            ctx.ctx.fillStyle = '#78350f';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.5, -ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.6);

            // horns
            ctx.ctx.fillStyle = '#fef08a';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.5);
            ctx.ctx.lineTo(0, -ctx.TILE_SIZE * 0.3);
            ctx.ctx.fill();
            
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.5);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.3);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('GNOME', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#166534'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#dc2626'; 
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.15);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.15);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#78350f'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -5, ctx.TILE_SIZE * 0.4, 10);
            ctx.ctx.fillStyle = '#a1a1aa'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.4, -15, 3, 30);
        }
    });

    RenderRegistry.register('GIANT', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.scale(2.5, 2.5);
            ctx.ctx.fillStyle = '#d4a373'; 
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#5c4033'; 
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#e3b588';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.5);
            ctx.ctx.fillStyle = '#3d2314';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.3); 
        }
    });

    RenderRegistry.register('COLOSSAL_LIZARD_TITAN', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.scale(3.5, 3.5);
            ctx.ctx.fillStyle = '#2f4f4f'; 
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.4, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8b0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.4, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.5);
            ctx.ctx.lineTo(0, 0);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, 0);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#1e3838';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fillStyle = '#ffff00'; 
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.15, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.1, 4, 4);
            ctx.ctx.fillStyle = '#2f4f4f';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.5, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.9, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.9, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('HUMAN_KNIGHT', {
        draw: (ctx: RenderContext) => {
            // Steel Armor
            ctx.ctx.fillStyle = '#94a3b8';
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.5);
            // Shoulders
            ctx.ctx.fillStyle = '#cbd5e1';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.08, 0, 0, Math.PI * 2);
            ctx.ctx.ellipse(0, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.08, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            // Helmet (Visor)
            ctx.ctx.fillStyle = '#475569';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3);
            ctx.ctx.fillStyle = '#e2e8f0'; // eye slit
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * -0.05, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            // Sword
            ctx.ctx.fillStyle = '#f8fafc';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.05);
        }
    });

    RenderRegistry.register('HUMAN_PALADIN', {
        draw: (ctx: RenderContext) => {
            // Shiny Gold/White Armor
            ctx.ctx.fillStyle = '#fef08a';
            ctx.ctx.fillRect(ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * -0.25, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.5);
            // White Cape
            ctx.ctx.fillStyle = '#f8fafc';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * -0.2, 0, ctx.TILE_SIZE * 0.3, Math.PI/2, Math.PI*1.5);
            ctx.ctx.fill();
            // Helmet
            ctx.ctx.fillStyle = '#fde047';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3);
            // Greatsword
            ctx.ctx.fillStyle = '#e2e8f0';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.0, ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.1);
            // Glowing cross on shield
            ctx.ctx.fillStyle = '#38bdf8';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * -0.35, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * -0.275, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.05);
        }
    });

    RenderRegistry.register('HUMAN_RANGER', {
        draw: (ctx: RenderContext) => {
            // Leather & Green cloak
            ctx.ctx.fillStyle = '#166534';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            // Hood
            ctx.ctx.fillStyle = '#14532d';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * -0.15, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3);
            // Bow
            ctx.ctx.strokeStyle = '#78350f';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, 0, ctx.TILE_SIZE * 0.25, -Math.PI/2, Math.PI/2);
            ctx.ctx.stroke();
            ctx.ctx.strokeStyle = '#ffffff';
            ctx.ctx.lineWidth = 1;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.25);
            ctx.ctx.stroke();
        }
    });

    RenderRegistry.register('WIZARD', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#4c1d95';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#3b0764'; 
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, 0);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(-ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#fcd34d'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.strokeStyle = '#78350f'; 
            ctx.ctx.lineWidth = 4;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.2);
            ctx.ctx.stroke();
            ctx.ctx.fillStyle = '#38bdf8'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('OLD_WIZARD', RenderRegistry.get('WIZARD'));
    RenderRegistry.register('QUEST_GIVER', RenderRegistry.get('WIZARD'));
}
