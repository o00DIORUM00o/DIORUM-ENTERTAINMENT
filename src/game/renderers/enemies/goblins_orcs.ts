import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';
import { getZodiacStats } from '../../StarSigns';

export function defineGoblinsOrcsRenderers() {
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
}
