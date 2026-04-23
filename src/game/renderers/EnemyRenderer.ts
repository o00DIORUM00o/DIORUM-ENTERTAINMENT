import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { Engine } from '../Engine';

export function defineEnemyRenderers() {
    RenderRegistry.register('DARK_KNIGHT', {
        draw: (ctx: RenderContext) => {
            const knight = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.save();
            ctx.ctx.rotate(knight.aimAngle || 0);

            // Shadow / base
            ctx.ctx.fillStyle = '#111827'; // Dark armor base
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.45, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Armor plating
            ctx.ctx.fillStyle = '#374151'; // Lighter gray for plates
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts * 0.35, ts * 0.45, 0, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Head / Helmet
            ctx.ctx.fillStyle = '#111827';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.1, 0, ts * 0.25, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Glowing red eyes
            ctx.ctx.fillStyle = '#ef4444'; 
            if (knight.state === 'CHARGE') ctx.ctx.fillStyle = '#fbbf24'; // Yellow/orange while charging

            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, -ts * 0.1, ts * 0.05, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.2, ts * 0.1, ts * 0.05, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Sword
            ctx.ctx.fillStyle = '#9ca3af'; // silver sword
            ctx.ctx.strokeStyle = '#4b5563';
            ctx.ctx.lineWidth = 1;

            ctx.ctx.beginPath();
            if (knight.state === 'AIM' || knight.state === 'CHARGE') {
                // Sword pointing straight forward
                ctx.ctx.rect(ts * 0.3, -ts * 0.05, ts * 0.8, ts * 0.1);
            } else {
                // Sword resting at angle
                ctx.ctx.rotate(Math.PI / 4);
                ctx.ctx.rect(ts * 0.2, ts * 0.3, ts * 0.8, ts * 0.1);
            }
            ctx.ctx.fill();
            ctx.ctx.stroke();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('ARCHER', {
        draw: (ctx: RenderContext) => {
            const arch = ctx.entity;
            const ts = ctx.TILE_SIZE;

            ctx.ctx.fillStyle = '#6b7280'; // gray-500 armor
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.rotate(arch.aimAngle || 0);

            // Bow
            ctx.ctx.strokeStyle = '#8b4513';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.2, 0, ts * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.stroke();

            // Arrow loaded 
            if (arch.state === 'ATTACK') {
                ctx.ctx.strokeStyle = '#fff';
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts * -0.2, 0);
                ctx.ctx.lineTo(ts * 0.5, 0);
                ctx.ctx.stroke();
            }
        }
    });

    RenderRegistry.register('SAND_TERROR', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            if (ent.state === 'BURROWED') return; // Don't draw the body when fully burrowed. The updater spawns dirt particles.
            
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            // A segmented worm. We just draw a large stylized worm head/body here since segments aren't fully physics-simulated yet.
            ctx.ctx.fillStyle = '#b8860b'; // Dark goldenrod
            ctx.ctx.strokeStyle = '#8b4513';
            ctx.ctx.lineWidth = 3;

            // Main body
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ts*1.5, ts*0.8, 0, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Head pincers
            ctx.ctx.fillStyle = '#f4a460';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*1.2, -ts*0.3);
            ctx.ctx.lineTo(ts*2.0, -ts*0.6);
            ctx.ctx.lineTo(ts*1.5, 0);
            ctx.ctx.lineTo(ts*2.0, ts*0.6);
            ctx.ctx.lineTo(ts*1.2, ts*0.3);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Eyes
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.0, -ts*0.4, ts*0.15, 0, Math.PI*2);
            ctx.ctx.arc(ts*1.0, ts*0.4, ts*0.15, 0, Math.PI*2);
            ctx.ctx.fill();

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('PHANTOM_WIZARD', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const ts = ctx.TILE_SIZE;
            if (ent.state === 'HIDDEN') return;
            
            ctx.ctx.save();
            ctx.ctx.rotate(ent.aimAngle || 0);

            ctx.ctx.globalAlpha = ent.state === 'APPEAR' || ent.state === 'VANISH' ? 0.5 : 1.0;

            // Robes
            ctx.ctx.fillStyle = '#4b0082'; // Indigo
            ctx.ctx.strokeStyle = '#000000';
            ctx.ctx.lineWidth = 2;
            
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*0.5, 0);
            ctx.ctx.lineTo(-ts*0.5, ts*0.8);
            ctx.ctx.lineTo(-ts*0.8, 0);
            ctx.ctx.lineTo(-ts*0.5, -ts*0.8);
            ctx.ctx.closePath();
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Head/Hood
            ctx.ctx.fillStyle = '#8a2be2'; // Blue Violet
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.5, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Shadow Face
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.3, 0, Math.PI*2);
            ctx.ctx.fill();

            // Glowing Eyes
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*0.1, -ts*0.15, ts*0.06, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.1, ts*0.15, ts*0.06, 0, Math.PI*2);
            ctx.ctx.fill();

            // Magical Orb on hand
            if (ent.state === 'CHARGE_SPELL' || ent.state === 'ATTACK') {
                ctx.ctx.fillStyle = '#ff00ff';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*0.8, -ts*0.5, ts*0.3 + Math.random() * ts*0.1, 0, Math.PI*2);
                ctx.ctx.fill();
            }

            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('SPHINX', {
        draw: (ctx: RenderContext) => {
            const s = ctx.entity;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.save();
            ctx.ctx.rotate(s.aimAngle || 0);

            // Body (Lion)
            ctx.ctx.fillStyle = '#daa520'; 
            ctx.ctx.strokeStyle = '#b8860b';
            ctx.ctx.lineWidth = 3;
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ts*1.2, -ts*0.8, ts*2.4, ts*1.6);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Shoulders/Legs
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*1.2, -ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(-ts*1.2, ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.8, -ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.8, ts*0.8, ts*0.4, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Sphinx Head (Human/Pharaoh)
            ctx.ctx.fillStyle = '#f0e68c';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.2, 0, ts*0.6, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Nemes (Headdress)
            ctx.ctx.fillStyle = '#0000cd';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts*1.2, -ts*0.6);
            ctx.ctx.lineTo(ts*0.6, -ts*1.2);
            ctx.ctx.lineTo(ts*0.6, ts*1.2);
            ctx.ctx.lineTo(ts*1.2, ts*0.6);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Eyes
            if (s.state === 'ATTACK_LASER') {
                ctx.ctx.fillStyle = '#00ffff';
            } else if (s.state === 'SLEEP') {
                ctx.ctx.fillStyle = '#888888';
            } else {
                ctx.ctx.fillStyle = '#ff0000';
            }
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*1.5, -ts*0.2, 4, 0, Math.PI*2);
            ctx.ctx.arc(ts*1.5, ts*0.2, 4, 0, Math.PI*2);
            ctx.ctx.fill();

            ctx.ctx.restore();
            
            // Health bar 
            if (s.state !== 'SLEEP') {
                 const hpPercent = Math.max(0, s.health / s.maxHealth);
                 ctx.ctx.fillStyle = 'black';
                 ctx.ctx.fillRect(-ts*2, -ts*3.5 - 5, ts*4, 10);
                 ctx.ctx.fillStyle = 'red';
                 ctx.ctx.fillRect(-ts*2, -ts*3.5 - 5, ts*4 * hpPercent, 10);
            }
        }
    });

    RenderRegistry.register('GARGOYLE', {
        draw: (ctx: RenderContext) => {
            const g = ctx.entity;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.fillStyle = g.state === 'AWAKE' || g.state === 'CHASE' || g.state === 'ATTACK' ? '#444455' : '#888888';
            ctx.ctx.strokeStyle = '#222222';
            ctx.ctx.lineWidth = 2;
            
            // Wings
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ts*0.2, 0);
            if (g.state === 'SLEEPING') {
                ctx.ctx.lineTo(-ts*0.8, -ts*0.8);
                ctx.ctx.lineTo(ts*0.8, -ts*0.8);
            } else {
                ctx.ctx.lineTo(-ts*1.2, -ts);
                ctx.ctx.lineTo(ts*1.2, -ts);
            }
            ctx.ctx.lineTo(ts*0.2, 0);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Body
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ts*0.4, -ts*0.4, ts*0.8, ts*0.8);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Glowing eyes
            if (g.state !== 'SLEEPING') {
                ctx.ctx.fillStyle = '#ff0000';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
                ctx.ctx.arc(ts*0.15, ts*0.1, 3, 0, Math.PI*2);
                ctx.ctx.fill();
            }
        }
    });

    RenderRegistry.register('DJINN', {
        draw: (ctx: RenderContext) => {
            const ts = ctx.TILE_SIZE;
            const t = performance.now() / 200;
            
            // Tornado bottom
            const gradient = ctx.ctx.createRadialGradient(0, 0, 0, 0, 0, ts);
            gradient.addColorStop(0, 'rgba(100, 0, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(50, 0, 150, 0)');
            
            ctx.ctx.fillStyle = gradient;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, ts*0.5, ts, 0, Math.PI*2);
            ctx.ctx.fill();
            
            // Geni upper body
            ctx.ctx.fillStyle = '#1e90ff'; // Dodger blue
            ctx.ctx.strokeStyle = '#000080';
            ctx.ctx.lineWidth = 2;
            
            // Torso
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ts*0.2, ts*0.6, ts*0.4, 0, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Muscular Arms crossed
            ctx.ctx.fillStyle = '#104e8b';
            ctx.ctx.fillRect(-ts*0.5, -ts*0.2, ts, ts*0.2);
            
            // Head and Hair/Turban
            ctx.ctx.fillStyle = '#1e90ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, -ts*0.6, ts*0.3, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Turban
            ctx.ctx.fillStyle = '#ffaa00';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ts*0.8, ts*0.35, ts*0.15, 0, 0, Math.PI*2);
            ctx.ctx.fill();
            
            // Eyes
            ctx.ctx.fillStyle = '#00ffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*0.1, -ts*0.6, 2, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.2, -ts*0.5, 2, 0, Math.PI*2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('GREMLIN', {
        draw: (ctx: RenderContext) => {
            const g = ctx.entity;
            const ts = ctx.TILE_SIZE;
            
            ctx.ctx.fillStyle = '#32cd32'; // Lime green
            ctx.ctx.strokeStyle = '#006400';
            
            // Gremlin ears (Huge out sticking ears)
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, 0);
            ctx.ctx.lineTo(-ts*0.8, -ts*0.5);
            ctx.ctx.lineTo(-ts*0.2, -ts*0.2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, 0);
            ctx.ctx.lineTo(-ts*0.8, ts*0.5);
            ctx.ctx.lineTo(-ts*0.2, ts*0.2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Body
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.3, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();
            
            // Goggles/Crazy eyes
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts*0.1, -ts*0.1, 4, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.1, ts*0.1, 4, 0, Math.PI*2);
            ctx.ctx.fill();
            
            // Holding wrench
            ctx.ctx.fillStyle = '#a9a9a9';
            ctx.ctx.fillRect(ts*0.2, -ts*0.4, ts*0.6, ts*0.1);
        }
    });

    RenderRegistry.register('SHADOW_WIZARD', {
        draw: (ctx: RenderContext) => {
            const w = ctx.entity;
            const ts = ctx.TILE_SIZE;
            const t = performance.now() / 200;

            // Hover bob
            ctx.ctx.translate(0, Math.sin(t) * 3);

            // Phase logic 
            let opacity = 1.0;
            if (w.state === 'TELEPORTING') {
                opacity = w.teleportPhase === 0 ? w.phaseTimer / 0.5 : 1.0 - (w.phaseTimer / 0.5);
            }
            if (opacity < 0.05) return;
            
            ctx.ctx.globalAlpha = opacity;
            
            ctx.ctx.fillStyle = '#111'; // Dark robes
            ctx.ctx.strokeStyle = '#6b21a8'; // Purple outline
            ctx.ctx.lineWidth = 2;
            
            // Robe base
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, ts*0.4);
            ctx.ctx.lineTo(-ts*0.4, ts*0.6);
            ctx.ctx.lineTo(ts*0.4, ts*0.6);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Hood
            ctx.ctx.fillStyle = '#222';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts*0.4, 0, Math.PI*2);
            ctx.ctx.fill(); ctx.ctx.stroke();

            // Glowing Eyes
            ctx.ctx.fillStyle = w.attackType === 'SHATTER' ? '#00ffff' : '#ff00ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.15, -ts*0.1, 3, 0, Math.PI*2);
            ctx.ctx.fill();

            // Glowing hands
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ts*0.5, ts*0.2, 5, 0, Math.PI*2);
            ctx.ctx.arc(ts*0.5, ts*0.2, 5, 0, Math.PI*2);
            ctx.ctx.fill();
            
            ctx.ctx.globalAlpha = 1.0;
        }
    });

    RenderRegistry.register('SLIME', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.fillStyle = 'rgba(50, 205, 50, 0.8)';
            ctx.ctx.beginPath();
            const scaleY = ent.vz !== 0 ? 1.2 : 0.8;
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4 * scaleY, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#000000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ctx.TILE_SIZE*0.15, -ctx.TILE_SIZE*0.1, 2, 0, Math.PI*2);
            ctx.ctx.arc(ctx.TILE_SIZE*0.15, -ctx.TILE_SIZE*0.1, 2, 0, Math.PI*2);
            ctx.ctx.fill();
        }
    });
    
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

    RenderRegistry.register('GOBLIN', {
        draw: (ctx: RenderContext) => {
            const gob = ctx.entity;
            const ts = ctx.TILE_SIZE;

            // Flash white if attacking/winding up
            if (gob.state === 'ATTACK' || (gob.stateTimer !== undefined && gob.stateTimer > 0 && gob.state === 'ALERT')) {
                const flashRate = Math.floor(ctx.time / 50) % 2 === 0;
                if (flashRate) {
                    ctx.ctx.filter = 'brightness(200%)';
                }
            }

            // Goblin body coloring
            let bodyColor = '#228b22'; // Forest green basic
            if (gob.isShaman) bodyColor = '#4b0082'; // Indigo
            if (gob.type === 'rockhurler') bodyColor = '#556b2f'; // Dark olive
            if (gob.type === 'boomeranger') bodyColor = '#2e8b57'; // Sea green
            if (gob.type === 'alchemist') bodyColor = '#006400'; // Dark green
            if (gob.type === 'miner') bodyColor = '#8b4513'; // Saddle brown
            if (gob.type === 'gardener') bodyColor = '#9acd32'; // Yellow green

            ctx.ctx.fillStyle = bodyColor;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.35, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Ears
            ctx.ctx.rotate(gob.aimAngle || 0);
            ctx.ctx.fillStyle = bodyColor;
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, -ts*0.35, ts*0.1, ts*0.25, -Math.PI/4, 0, Math.PI*2);
            ctx.ctx.ellipse(0, ts*0.35, ts*0.1, ts*0.25, Math.PI/4, 0, Math.PI*2);
            ctx.ctx.fill();

            // Eyes
            ctx.ctx.fillStyle = gob.isShaman || gob.type === 'alchemist' ? '#00ff00' : '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.15, -ts * 0.15, ts * 0.06, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.15, ts * 0.15, ts * 0.06, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Hat/Accessories
            if (gob.type === 'miner') {
                // Miner helmet
                ctx.ctx.fillStyle = '#ffcc00';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ts * 0.25, 0, Math.PI * 2);
                ctx.ctx.fill();
                // Lamp
                ctx.ctx.fillStyle = '#ffffff';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.2, 0, ts * 0.08, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (gob.type === 'alchemist') {
                // Goggles
                ctx.ctx.strokeStyle = '#333';
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts*0.15, -ts*0.15, ts*0.08, 0, Math.PI*2);
                ctx.ctx.arc(ts*0.15, ts*0.15, ts*0.08, 0, Math.PI*2);
                ctx.ctx.stroke();
            } else if (gob.type === 'gardener') {
                // Straw hat
                ctx.ctx.fillStyle = '#f5deb3';
                ctx.ctx.beginPath();
                ctx.ctx.arc(-ts*0.05, 0, ts*0.4, 0, Math.PI*2);
                ctx.ctx.fill();
            }

            // Weapon
            ctx.ctx.save();
            if (gob.isShaman) {
                // Staff
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ts * 0.2, -ts * 0.05, ts * 0.6, ts * 0.1);
                // Glowing gem
                ctx.ctx.fillStyle = '#32cd32';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.8, 0, ts * 0.12, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (gob.type === 'rockhurler') {
                // Holding a rock
                ctx.ctx.fillStyle = '#696969';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.3, ts * 0.3, ts * 0.15, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (gob.type === 'boomeranger') {
                // Holding boomerang
                ctx.ctx.strokeStyle = '#8b4513';
                ctx.ctx.lineWidth = 3;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts * 0.2, ts * 0.1);
                ctx.ctx.lineTo(ts * 0.5, ts * 0.3);
                ctx.ctx.lineTo(ts * 0.2, ts * 0.5);
                ctx.ctx.stroke();
            } else if (gob.type === 'alchemist') {
                // Holding a potion flask
                ctx.ctx.fillStyle = '#00ffff';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.3, ts * 0.3, ts * 0.1, 0, Math.PI * 2);
                ctx.ctx.fill();
                ctx.ctx.fillStyle = '#fff';
                ctx.ctx.fillRect(ts*0.25, ts*0.15, ts*0.1, ts*0.1);
            } else if (gob.type === 'miner') {
                // Holding a pickaxe
                if (gob.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (gob.attackTimer / 0.3));
                    ctx.ctx.rotate(Math.sin(attackProgress * Math.PI) * Math.PI / 2);
                }
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ts * 0.1, ts * 0.2, ts * 0.6, ts * 0.08); // handle
                ctx.ctx.fillStyle = '#778899';
                ctx.ctx.fillRect(ts * 0.6, ts * 0.05, ts * 0.1, ts * 0.38); // head
            } else if (gob.type === 'gardener') {
                // Holding a hoe
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ts * 0.1, ts * 0.2, ts * 0.6, ts * 0.08); // handle
                ctx.ctx.fillStyle = '#778899';
                ctx.ctx.fillRect(ts * 0.6, ts * 0.2, ts * 0.08, ts * 0.25); // blade
            } else {
                // Dagger
                if (gob.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (gob.attackTimer / 0.4));
                    ctx.ctx.rotate(Math.sin(attackProgress * Math.PI) * Math.PI / 2);
                    ctx.ctx.fillStyle = '#a9a9a9';
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, 0);
                    ctx.ctx.lineTo(ts * 0.6, -ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.6, ts * 0.1);
                    ctx.ctx.fill();
                } else {
                    ctx.ctx.fillStyle = '#a9a9a9';
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, ts * 0.2);
                    ctx.ctx.lineTo(ts * 0.5, ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.4, ts * 0.3);
                    ctx.ctx.fill();
                }
            }
            ctx.ctx.restore();
            ctx.ctx.filter = 'none';
        }
    });

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

    RenderRegistry.register('FIRE_IMP', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            ctx.ctx.translate(0, Math.sin(Date.now() / 150) * 4);
            ctx.ctx.fillStyle = '#8b0000';
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.4, ctx.TILE_SIZE*0.6, ctx.TILE_SIZE*0.7);
            ctx.ctx.fill();
            ctx.ctx.strokeStyle = '#ff4500';
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE*0.3, 0); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.7, -ctx.TILE_SIZE*0.5); ctx.ctx.lineTo(-ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.2);
            ctx.ctx.moveTo(ctx.TILE_SIZE*0.3, 0); ctx.ctx.lineTo(ctx.TILE_SIZE*0.7, -ctx.TILE_SIZE*0.5); ctx.ctx.lineTo(ctx.TILE_SIZE*0.3, -ctx.TILE_SIZE*0.2);
            ctx.ctx.stroke();
            if (ent.attackCooldown && ent.attackCooldown > 1.5) {
                ctx.ctx.fillStyle = '#ffa500';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, 0, ctx.TILE_SIZE*0.2 + Math.random()*2, 0, Math.PI*2);
                ctx.ctx.fill();
            }
        }
    });
    
    RenderRegistry.register('OBSERVER_FIRE', { draw: (ctx: RenderContext) => drawObserver(ctx, '#8b0000', '#ffaa00') });
    RenderRegistry.register('OBSERVER_VOID', { draw: (ctx: RenderContext) => drawObserver(ctx, '#4b0082', '#bb00ff') });

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

    RenderRegistry.register('CLAY_GOLEM', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#b0c4de';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#778899';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fillStyle = '#ff8c00';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 4, 4);
        }
    });

    RenderRegistry.register('OGRE', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.scale(1.2, 1.2);
            ctx.ctx.fillStyle = '#556b2f';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2); // Club
            ctx.ctx.fillStyle = '#ff0000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1, 3, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 3, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('TROLL', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.scale(1.1, 1.1);
            ctx.ctx.fillStyle = '#1e90ff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#fff0f5'; // Tusks
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.25);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('FUNGI_FOLK', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#f5deb3';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#8b0000'; // Mushroom cap
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, -Math.PI / 2, Math.PI / 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('TRICERA_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#2f4f4f';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.5, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#adff2f';
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.3);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.4);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('RAPTOR_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#808000';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffff00';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -2, ctx.TILE_SIZE * 0.3, 4);
        }
    });

    RenderRegistry.register('WILD_RAPTOR', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#556b2f';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.3, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffffe0'; // Strip
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -2, ctx.TILE_SIZE * 0.4, 4);
        }
    });

    RenderRegistry.register('T_REX', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.scale(1.5, 1.5);
            ctx.ctx.fillStyle = '#8b4513';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.6);
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, 4, ctx.TILE_SIZE * 0.4); // Teeth
        }
    });

    RenderRegistry.register('PTERODACTYL', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#4682b4';
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, 0, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#5f9ea0'; // Wings
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(0, -ctx.TILE_SIZE * 0.6);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, 0);
            ctx.ctx.fill();
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(0, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.6);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, 0);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('FROG_FOLK', {
        draw: (ctx: RenderContext) => {
            ctx.ctx.fillStyle = '#32cd32';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('BLACK_HOLE', {
        draw: (ctx: RenderContext) => {
            const rot = (performance.now() / 200) % (Math.PI * 2);
            ctx.ctx.rotate(rot);
            let gradient = ctx.ctx.createRadialGradient(0, 0, 0, 0, 0, ctx.TILE_SIZE);
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(0.5, '#4b0082');
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.ctx.fillStyle = gradient;
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE, 0, Math.PI * 2);
            ctx.ctx.fill();
        }
    });

    RenderRegistry.register('stone_golem', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#808080';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.8, ctx.TILE_SIZE * 0.8);
            ctx.ctx.fillStyle = '#A9A9A9';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fillStyle = '#00FFFF';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.2, 4, 4);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1, 4, 4);
        }
    });

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

    RenderRegistry.register('zombie', {
        draw: (ctx: RenderContext) => {
            const ent = ctx.entity;
            const aim = ent.aimAngle !== undefined ? ent.aimAngle : Math.atan2((ent.vy || 0), (ent.vx || 0));
            ctx.ctx.rotate(aim);
            ctx.ctx.fillStyle = '#2e8b57';
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ctx.TILE_SIZE * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.fillStyle = '#000';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.05, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillStyle = '#2e8b57';
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.25, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.15, ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.1);
        }
    });

    RenderRegistry.register('ORC', {
        draw: (ctx: RenderContext) => {
            const orc = ctx.entity;
            const ts = ctx.TILE_SIZE;

            if (orc.state === 'ATTACK' || (orc.stateTimer !== undefined && orc.stateTimer > 0 && orc.state === 'ALERT')) {
                const flashRate = Math.floor(ctx.time / 50) % 2 === 0;
                if (flashRate) {
                    ctx.ctx.filter = 'brightness(150%) sepia(50%) hue-rotate(-50deg) saturate(300%)'; // Angry red flash
                }
            }

            // Body
            let bodyColor = '#4a5d23'; // Base green
            if (orc.type === 'brute') bodyColor = '#2f4f4f'; // Dark slate
            if (orc.type === 'shaman') bodyColor = '#800080'; // Purple
            if (orc.type === 'hunter') bodyColor = '#8b4513'; // Saddle brown

            let scaleBase = orc.type === 'brute' ? 0.6 : 0.45;
            
            ctx.ctx.fillStyle = bodyColor; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * scaleBase, 0, Math.PI * 2);
            ctx.ctx.fill();

            // Orc eyes
            ctx.ctx.rotate(orc.aimAngle || 0);
            ctx.ctx.fillStyle = orc.type === 'shaman' ? '#00ffff' : '#ff4500'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * (scaleBase * 0.4), -ts * 0.15, ts * (scaleBase * 0.15), 0, Math.PI * 2);
            ctx.ctx.arc(ts * (scaleBase * 0.4), ts * 0.15, ts * (scaleBase * 0.15), 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Tusks
            ctx.ctx.fillStyle = '#ffffff';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ts * (scaleBase * 0.8), -ts * 0.15);
            ctx.ctx.lineTo(ts * (scaleBase * 1.2), -ts * 0.25);
            ctx.ctx.lineTo(ts * (scaleBase * 0.8), -ts * 0.05);
            ctx.ctx.moveTo(ts * (scaleBase * 0.8), ts * 0.15);
            ctx.ctx.lineTo(ts * (scaleBase * 1.2), ts * 0.25);
            ctx.ctx.lineTo(ts * (scaleBase * 0.8), ts * 0.05);
            ctx.ctx.fill();

            // Clothes / Armor
            if (orc.type === 'brute') {
                // Spiked shoulder pads
                ctx.ctx.fillStyle = '#696969';
                ctx.ctx.fillRect(-ts*0.2, -ts*scaleBase - ts*0.1, ts*0.4, ts*0.3);
                ctx.ctx.fillRect(-ts*0.2, ts*scaleBase - ts*0.2, ts*0.4, ts*0.3);
                // Spikes
                ctx.ctx.fillStyle = '#silver';
                for(let i=0; i<3; i++) {
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(0, -ts*scaleBase - ts*0.1);
                    ctx.ctx.lineTo(-ts*0.1 + i*ts*0.1, -ts*scaleBase - ts*0.2);
                    ctx.ctx.lineTo(ts*0.1, -ts*scaleBase - ts*0.1);
                    ctx.ctx.fill();
                }
            } else if (orc.type === 'shaman') {
                // Bone necklace / Skull mask
                ctx.ctx.fillStyle = '#f0e68c';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.3, 0, ts * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (orc.type === 'hunter') {
                // Animal pelt hood
                ctx.ctx.fillStyle = '#a0522d';
                ctx.ctx.beginPath();
                ctx.ctx.arc(-ts*0.1, 0, ts * 0.4, Math.PI/2, Math.PI*1.5);
                ctx.ctx.fill();
            }

            // Weapon
            ctx.ctx.save();
            const wepScale = orc.type === 'brute' ? 1.5 : 1.0;
            
            if (orc.type === 'shaman') {
                // Staff
                ctx.ctx.fillStyle = '#4e3629';
                ctx.ctx.fillRect(ts * 0.2, -ts * 0.05, ts * 0.7, ts * 0.1);
                ctx.ctx.fillStyle = '#ff00ff'; // Magic orb
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.9, 0, ts * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (orc.type === 'hunter') {
                // Bow
                ctx.ctx.strokeStyle = '#8b4513';
                ctx.ctx.lineWidth = 3;
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.2, 0, ts * 0.4, -Math.PI / 2, Math.PI / 2);
                ctx.ctx.stroke();
                ctx.ctx.strokeStyle = '#fff';
                ctx.ctx.lineWidth = 1;
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ts * 0.2, -ts * 0.4);
                ctx.ctx.lineTo(ts * 0.2, ts * 0.4);
                ctx.ctx.stroke();
            } else {
                // Club or Mace
                if (orc.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (orc.attackTimer / 0.6));
                    ctx.ctx.rotate(Math.sin(attackProgress * Math.PI) * Math.PI / 2);
                    ctx.ctx.translate(ts*0.2, -ts*0.1);
                } else {
                    ctx.ctx.translate(ts*0.2, ts*0.2);
                }
                
                ctx.ctx.fillStyle = '#8b4513'; 
                ctx.ctx.fillRect(0, -ts * 0.05 * wepScale, ts * 0.6 * wepScale, ts * 0.1 * wepScale);
                ctx.ctx.fillStyle = orc.type === 'brute' ? '#696969' : '#708090'; 
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.5 * wepScale, 0, ts * 0.2 * wepScale, 0, Math.PI * 2);
                ctx.ctx.fill();
            }
            ctx.ctx.restore();
            
            ctx.ctx.filter = 'none';
        }
    });

    RenderRegistry.register('SKELETON', {
        draw: (ctx: RenderContext) => {
            const skel = ctx.entity;
            const ts = ctx.TILE_SIZE;

            if (skel.state === 'ATTACK' || (skel.stateTimer !== undefined && skel.stateTimer > 0 && skel.state === 'ALERT')) {
                const flashRate = Math.floor(ctx.time / 50) % 2 === 0;
                if (flashRate) {
                    ctx.ctx.filter = 'brightness(150%) drop-shadow(0 0 5px red)'; // Scary red glow
                }
            }

            ctx.ctx.fillStyle = '#e2e8f0'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(0, 0, ts * 0.3, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Skull markings / hollows
            ctx.ctx.fillStyle = '#cbd5e1'; // darker bone
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(-ts*0.1, 0, ts*0.1, ts*0.2, 0, 0, Math.PI*2);
            ctx.ctx.fill();

            // Skull orientation
            ctx.ctx.rotate(skel.aimAngle || 0);
            
            // Hollow eye sockets
            ctx.ctx.fillStyle = '#000000'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.15, -ts * 0.1, ts * 0.08, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.15, ts * 0.1, ts * 0.08, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            // Red glowing pupils
            ctx.ctx.fillStyle = '#ef4444';
            ctx.ctx.beginPath();
            ctx.ctx.arc(ts * 0.15, -ts * 0.1, ts * 0.03, 0, Math.PI * 2);
            ctx.ctx.arc(ts * 0.15, ts * 0.1, ts * 0.03, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.save();
            if (skel.type === 'SWORDSMAN') {
                // Shield (Darknut style!)
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ts * 0.1, ts * 0.15, ts * 0.4, ts * 0.1);
                ctx.ctx.fillStyle = '#c0c0c0';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.3, ts * 0.2, ts * 0.1, 0, Math.PI*2);
                ctx.ctx.fill();
                
                if (skel.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (skel.attackTimer / 0.5));
                    ctx.ctx.rotate(Math.sin(attackProgress * Math.PI) * Math.PI / 2);
                    ctx.ctx.fillStyle = '#94a3b8'; 
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, 0);
                    ctx.ctx.lineTo(ts * 0.8, -ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.8, ts * 0.1);
                    ctx.ctx.fill();
                } else {
                    ctx.ctx.fillStyle = '#94a3b8';
                    ctx.ctx.beginPath();
                    ctx.ctx.moveTo(ts * 0.2, ts * 0.2);
                    ctx.ctx.lineTo(ts * 0.6, ts * 0.1);
                    ctx.ctx.lineTo(ts * 0.5, ts * 0.3);
                    ctx.ctx.fill();
                }
            } else { 
                ctx.ctx.strokeStyle = '#8b4513'; 
                ctx.ctx.lineWidth = 2;
                ctx.ctx.beginPath();
                ctx.ctx.arc(ts * 0.2, 0, ts * 0.3, -Math.PI/2, Math.PI/2);
                ctx.ctx.stroke();
                
                if (skel.state === 'ATTACK') {
                    const attackProgress = Math.max(0, 1 - (skel.attackTimer / 0.5));
                    if (attackProgress < 0.5) {
                        ctx.ctx.strokeStyle = '#e2e8f0'; 
                        ctx.ctx.beginPath();
                        ctx.ctx.moveTo(ts * 0.2, 0);
                        ctx.ctx.lineTo(ts * 0.2 - (attackProgress * ts * 0.4), 0); // draw back
                        ctx.ctx.stroke();
                    }
                }
            }
            ctx.ctx.restore();
            
            ctx.ctx.filter = 'none';
        }
    });

    RenderRegistry.register('SKELETON_REMAIN', {
        draw: (ctx: RenderContext) => {
            const rem = ctx.entity;
            ctx.ctx.fillStyle = '#e2e8f0'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(-ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.15, 0, Math.PI * 2);
            ctx.ctx.fill();
            ctx.ctx.lineWidth = 3;
            ctx.ctx.strokeStyle = '#e2e8f0';
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.1);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.3);
            ctx.ctx.stroke();
            
            ctx.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.6, 4);
            ctx.ctx.fillStyle = '#a855f7'; 
            ctx.ctx.fillRect(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.4, (ctx.TILE_SIZE * 0.6) * (1 - (rem.reviveTimer / 10.0)), 4);
        }
    });

    RenderRegistry.register('ABYSSAL_KNIGHT', {
        draw: (ctx: RenderContext) => {
            const k = ctx.entity;
            const scale = 1.2;
            
            ctx.ctx.beginPath();
            ctx.ctx.ellipse(0, 0, 12 * scale, 6 * scale, 0, 0, Math.PI * 2);
            ctx.ctx.fillStyle = 'rgba(74, 0, 128, 0.5)';
            ctx.ctx.fill();

            ctx.ctx.fillStyle = '#1a0f2e';
            ctx.ctx.fillRect(-8 * scale, -24 * scale, 16 * scale, 24 * scale);
            
            ctx.ctx.fillStyle = (k.state === 'ATTACK' || k.state === 'CHARGE') ? '#ff0000' : '#ff00ff';
            ctx.ctx.fillRect(-4 * scale, -20 * scale, 3 * scale, 3 * scale);
            ctx.ctx.fillRect(1 * scale, -20 * scale, 3 * scale, 3 * scale);

            ctx.ctx.save();
            ctx.ctx.translate(8 * scale, -12 * scale);
            if (k.state === 'ATTACK') ctx.ctx.rotate(Math.PI / 2);
            else if (k.state === 'CHARGE') ctx.ctx.rotate(Math.PI / 4);
            ctx.ctx.fillStyle = '#4a0080';
            ctx.ctx.fillRect(0, -15 * scale, 4 * scale, 20 * scale);
            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('LAVA_GOLEM', {
        draw: (ctx: RenderContext) => {
            const golem = ctx.entity;
            ctx.ctx.fillStyle = '#8b0000'; 
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 1.2, ctx.TILE_SIZE * 1.2);
            ctx.ctx.fill();

            ctx.ctx.strokeStyle = '#ff4500'; 
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.stroke();

            ctx.ctx.rotate(golem.aimAngle || 0);
            ctx.ctx.fillStyle = '#ffff00'; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();

            ctx.ctx.save();
            if (golem.state === 'ATTACK') {
                const attackProgress = 1 - (golem.attackTimer / 0.5);
                ctx.ctx.translate(ctx.TILE_SIZE * 0.4, 0);
                ctx.ctx.scale(1 + Math.sin(attackProgress * Math.PI) * 0.5, 1 + Math.sin(attackProgress * Math.PI) * 0.5);
                ctx.ctx.fillStyle = '#ff4500';
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else {
                ctx.ctx.fillStyle = '#8b0000';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            }
            ctx.ctx.restore();
        }
    });

    RenderRegistry.register('KOBOLD', {
        draw: (ctx: RenderContext) => {
            const kobold = ctx.entity;
            ctx.ctx.rotate(kobold.aimAngle || 0);

            // Base colors based on type
            let bodyColor = '#b45f06'; // Worker by default
            let headColor = '#e69138';

            if (kobold.type === 'warrior') {
                bodyColor = '#8b0000'; // Dark red
                headColor = '#ff0000';
            } else if (kobold.type === 'shaman') {
                bodyColor = '#00008b'; // Dark blue
                headColor = '#4169e1';
            } else if (kobold.type === 'bomber') {
                bodyColor = '#ff4500'; // Orange red
                headColor = '#ffff00';
            } else if (kobold.type === 'trapper') {
                bodyColor = '#556b2f'; // Dark olive green
                headColor = '#9acd32';
            } else if (kobold.type === 'dragonkeeper') {
                bodyColor = '#daa520'; // Goldenrod
                headColor = '#ffd700'; // Gold
            }

            // Body
            ctx.ctx.fillStyle = bodyColor;
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 0.4);
            ctx.ctx.fill();

            // Head / Snout
            ctx.ctx.fillStyle = headColor;
            ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.2);

            // Accessories based on type
            if (kobold.type === 'warrior') {
                // Sword/Spear
                ctx.ctx.fillStyle = '#aaa';
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.1);
            } else if (kobold.type === 'bomber') {
                // Holding a bomb!
                ctx.ctx.fillStyle = '#111';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
                // Spark
                ctx.ctx.fillStyle = (Math.random() < 0.5) ? '#ff0' : '#f00';
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.55, 4, 4);
            } else if (kobold.type === 'shaman') {
                // Staff
                ctx.ctx.fillStyle = '#8b4513';
                ctx.ctx.fillRect(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.1, ctx.TILE_SIZE * 0.8);
                // Crystal atop
                ctx.ctx.fillStyle = '#ff00ff';
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.15, -ctx.TILE_SIZE * 0.5, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else if (kobold.type === 'dragonkeeper') {
                // Golden crown/horns
                ctx.ctx.fillStyle = '#fff';
                ctx.ctx.beginPath();
                ctx.ctx.moveTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.1);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 0.1, -ctx.TILE_SIZE * 0.3);
                ctx.ctx.lineTo(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2);
                ctx.ctx.fill();
            }
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
}
