import { PlanetRegistry } from './registries/PlanetRegistry';

import { Engine } from "./Engine";
import { TILE_SIZE, BLOCK_COLORS } from "./Constants";
import { BlockType } from "./constants/BlockType";
import { ITEMS, SPELLS } from "./Inventory";

import { RenderRegistry } from './registries/RenderRegistry';
import { defineAnimalRenderers } from './renderers/AnimalRenderer';
import { defineEnemyRenderers } from './renderers/EnemyRenderer';
import { defineNPCRenderers } from './renderers/NPCRenderer';
import { defineProjectileRenderers } from './renderers/ProjectileRenderer';
import { PlayerRenderer } from './renderers/PlayerRenderer';

import { BlockRenderRegistry } from './registries/BlockRenderRegistry';
import { defineBlockRenderers } from './renderers/BlockRenderer';
// Ensure all Renderers are loaded
defineBlockRenderers();
defineAnimalRenderers();
defineEnemyRenderers();
defineNPCRenderers();
defineProjectileRenderers();

export class Renderer {
    static drawAnimalShape(ctx: any, type: string) {
        const renderer = RenderRegistry.get(type);
        if (renderer) {
            renderer.draw({ ctx, TILE_SIZE, entity: null, screenX: 0, screenY: 0, halfW: 0, halfH: 0, time: 0 });
        } else {
            // Fallback shape
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
        }
    }

    private static drawEntityList(ctx: CanvasRenderingContext2D, list: any[], player: any, playerZ: number, world: any, halfW: number, halfH: number, defaultTypeStr?: string) {
        for (const ent of list) {
            const surface = world.getSurface(Math.floor(ent.x), Math.floor(ent.y), playerZ);
            if (ent.z < surface.z) continue;

            const depth = player.z - ent.z;
            if (depth > 5 || depth < -1) continue;

            const screenX = halfW + (ent.x - player.x) * TILE_SIZE;
            const screenY = halfH + (ent.y - player.y) * TILE_SIZE;

            ctx.save();
            ctx.translate(screenX, screenY);
            
            // Generic Scale based on depth for animals/npcs (but let's scale inside renderers ideally)
            const scale = Math.max(0.5, 1 - depth * 0.1);
            if(ent.type !== 'BOMB' && ent.type !== 'PROJECTILE' && ent.type !== 'AOE' && ent.type !== 'CONE') {
              ctx.scale(scale, scale);
            }

            const type = ent.type ? ent.type.toUpperCase() : defaultTypeStr;
            let renderer = type ? RenderRegistry.get(type) : null;

            if (!renderer && ent.type) {
                renderer = RenderRegistry.get(ent.type);
            }
            if (!renderer && defaultTypeStr) {
                renderer = RenderRegistry.get(defaultTypeStr);
            }

            if (renderer) {
                renderer.draw({ ctx, TILE_SIZE, entity: ent, screenX, screenY, halfW, halfH, time: performance.now() });
            } else {
                // Fallback
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            }

            ctx.restore();

            // Default Generic Health bar (if renderer didn't draw one itself, which some might)
            // Wait, we let the external generic health bar run unless they want custom ones.
            // Let's just draw generic health bar right here for everyone except specific things
            if (ent.health !== undefined && ent.maxHealth !== undefined && ent.health < ent.maxHealth && type !== 'BOMB' && type !== 'PROJECTILE' && type !== 'AOE' && type !== 'CONE') {
                ctx.fillStyle = 'red';
                ctx.fillRect(screenX - TILE_SIZE * 0.4, screenY - TILE_SIZE * 0.6, TILE_SIZE * 0.8, 4);
                ctx.fillStyle = 'green';
                ctx.fillRect(screenX - TILE_SIZE * 0.4, screenY - TILE_SIZE * 0.6, (TILE_SIZE * 0.8) * Math.max(0, ent.health / ent.maxHealth), 4);
            } else if (ent.hp !== undefined && ent.maxHp !== undefined && ent.hp < ent.maxHp) {
                ctx.fillStyle = 'red';
                ctx.fillRect(screenX - TILE_SIZE * 0.4, screenY - TILE_SIZE * 0.6, TILE_SIZE * 0.8, 4);
                ctx.fillStyle = 'green';
                ctx.fillRect(screenX - TILE_SIZE * 0.4, screenY - TILE_SIZE * 0.6, (TILE_SIZE * 0.8) * Math.max(0, ent.hp / ent.maxHp), 4);
            }

            // Draw statuses
            if (ent.statuses && (ent.statuses.burn > 0 || ent.statuses.poison > 0 || ent.statuses.chill > 0 || ent.statuses.bleed > 0)) {
                let iconX = screenX - TILE_SIZE * 0.4;
                const iconY = screenY - TILE_SIZE * 0.8;
                const iconSize = 8;
                
                if (ent.statuses.burn > 0) {
                    ctx.fillStyle = '#ff4500';
                    ctx.fillRect(iconX, iconY, iconSize, iconSize);
                    iconX += iconSize + 2;
                }
                if (ent.statuses.poison > 0) {
                    ctx.fillStyle = '#32cd32';
                    ctx.fillRect(iconX, iconY, iconSize, iconSize);
                    iconX += iconSize + 2;
                }
                if (ent.statuses.chill > 0) {
                    ctx.fillStyle = '#add8e6';
                    ctx.fillRect(iconX, iconY, iconSize, iconSize);
                    iconX += iconSize + 2;
                }
                if (ent.statuses.bleed > 0) {
                    ctx.fillStyle = '#8b0000';
                    ctx.fillRect(iconX, iconY, iconSize, iconSize);
                    iconX += iconSize + 2;
                }
            }
        }
    }

    static render(engine: any) { // using any temporarily to bypass strict circular private access if any
        const { ctx, canvas, player, world } = engine;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const halfW = canvas.width / 2;
        const halfH = canvas.height / 2;

        const startX = Math.floor(player.x - (halfW / TILE_SIZE));
        const endX = Math.floor(player.x + (halfW / TILE_SIZE)) + 1;
        const startY = Math.floor(player.y - (halfH / TILE_SIZE));
        const endY = Math.floor(player.y + (halfH / TILE_SIZE)) + 1;

        const playerZ = Math.floor(player.z);
        
        let airColor = 'rgb(10, 35, 25)';
        switch (world.activePlanet) {
            case 'ARETH': airColor = 'rgb(30, 0, 0)'; break; // Dragons, Lava
            case 'TARHE': airColor = 'rgb(40, 50, 60)'; break; // Dwarves, Snow
            case 'TERHA': airColor = 'rgb(10, 25, 15)'; break; // Orcs, Swamps
            case 'HEART': airColor = 'rgb(30, 20, 50)'; break; // Elves, Magic
            case 'RATHE': airColor = 'rgb(50, 40, 20)'; break; // Sphinx, Desert
            case 'THAER': airColor = 'rgb(0, 40, 10)'; break;  // Beasts, Forests
            case 'THERA': airColor = 'rgb(0, 20, 30)'; break;  // Frogs, Coralline
            case 'ATHER': airColor = 'rgb(20, 10, 30)'; break; // Giants, Fungi
            case 'THREA': airColor = 'rgb(10, 35, 25)'; break; // Biodiverse
            case 'THRAE': airColor = 'rgb(10, 35, 25)'; break; // Humans, Earth
            case 'RAETH': airColor = 'rgb(5, 5, 5)'; break;    // Black Dunes
        }

        // Z-Slicing: Strict Dwarf Fortress style.
        // We only ever render up to the player's current Z level. 
        // This ensures doors and walls are always visible, even from the outside.
        const maxRenderZ = playerZ;

        const visibleLights: {x: number, y: number, z: number, block: BlockType}[] = [];

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const surface = world.getSurface(x, y, maxRenderZ);
                const block = surface.block;
                const drawZ = surface.z;
                const highestZ = surface.highestZ;

                if ((block === BlockType.TORCH || block === BlockType.LANTERN_BLOCK || block === BlockType.CAMPFIRE || block === BlockType.MUSHROOM_CAP || block === BlockType.LAVA || block === BlockType.CRYSTAL) && Math.abs(drawZ - playerZ) < 2) {
                    visibleLights.push({x, y, z: drawZ, block});
                }

                const screenX = halfW + (x - player.x) * TILE_SIZE;
                const screenY = halfH + (y - player.y) * TILE_SIZE;

                if (block === BlockType.AIR) {
                    ctx.fillStyle = airColor; // Darker, greener blue-green
                    ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
                    continue;
                }

                const depth = playerZ - drawZ;
                if (depth > 3) {
                    ctx.fillStyle = airColor; // Darker, greener blue-green
                    ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
                    continue;
                }

                // Dwarf Fortress style: hide blocks that are deep inside a hill
                let isExposed = true;
                const blockAbove = world.getBlock(x, y, drawZ + 1);
                if (blockAbove !== BlockType.AIR) {
                    // There is a block above us. We are a cross-section.
                    // Are we a visible wall? (Adjacent to AIR at our own Z-level)
                    if (world.getBlock(x - 1, y, drawZ) === BlockType.AIR ||
                        world.getBlock(x + 1, y, drawZ) === BlockType.AIR ||
                        world.getBlock(x, y - 1, drawZ) === BlockType.AIR ||
                        world.getBlock(x, y + 1, drawZ) === BlockType.AIR) {
                        isExposed = true;
                    } else {
                        isExposed = false;
                    }
                }

                if (!isExposed) {
                    ctx.fillStyle = 'rgb(20, 10, 5)'; // Very dark brown
                    ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
                    continue;
                }

                const color = BLOCK_COLORS[block];
                const shade = Math.max(0.05, 1 - (depth * 0.1));
                
                if (color) {
                    let { r, g, b } = color;
                    r *= shade; g *= shade; b *= shade;

                    if (block === BlockType.ICE) {
                        ctx.fillStyle = `rgba(${r},${g},${b}, 0.8)`;
                    } else {
                        ctx.fillStyle = `rgb(${r},${g},${b})`;
                    }
                    ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
                }

                const renderer = BlockRenderRegistry.get(block);
                if (renderer) {
                    renderer.draw({ ctx, TILE_SIZE, entity: null, screenX, screenY, halfW, halfH, time: performance.now(), block, shade });
                }
                // Draw grid lines for definition
                ctx.strokeStyle = `rgba(0,0,0,${0.2 + Math.max(0, depth) * 0.1})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            }
        }

        Renderer.drawEntityList(ctx, engine.bees, player, playerZ, world, halfW, halfH, 'BEE');
        Renderer.drawEntityList(ctx, engine.ants, player, playerZ, world, halfW, halfH, 'ANT');
        Renderer.drawEntityList(ctx, engine.entities, player, playerZ, world, halfW, halfH);
        Renderer.drawEntityList(ctx, engine.animals, player, playerZ, world, halfW, halfH);
        Renderer.drawEntityList(ctx, engine.goblins, player, playerZ, world, halfW, halfH, 'GOBLIN');
        Renderer.drawEntityList(ctx, engine.rats, player, playerZ, world, halfW, halfH, 'RAT');
        Renderer.drawEntityList(ctx, engine.npcs, player, playerZ, world, halfW, halfH);
        Renderer.drawEntityList(ctx, engine.archers, player, playerZ, world, halfW, halfH, 'ARCHER');
        Renderer.drawEntityList(ctx, engine.darkKnights, player, playerZ, world, halfW, halfH, 'DARK_KNIGHT');
        Renderer.drawEntityList(ctx, engine.orcs, player, playerZ, world, halfW, halfH, 'ORC');
        Renderer.drawEntityList(ctx, engine.skeletons, player, playerZ, world, halfW, halfH, 'SKELETON');
        Renderer.drawEntityList(ctx, engine.skeletonRemains, player, playerZ, world, halfW, halfH, 'SKELETON_REMAIN');
        Renderer.drawEntityList(ctx, engine.persistentAoEs, player, playerZ, world, halfW, halfH, 'PERSISTENT_AOE');
        Renderer.drawEntityList(ctx, engine.aoeEffects, player, playerZ, world, halfW, halfH, 'AOE');
        Renderer.drawEntityList(ctx, engine.coneEffects, player, playerZ, world, halfW, halfH, 'CONE');
        Renderer.drawEntityList(ctx, engine.bombs, player, playerZ, world, halfW, halfH, 'BOMB');
        Renderer.drawEntityList(ctx, engine.projectiles, player, playerZ, world, halfW, halfH, 'PROJECTILE');
        Renderer.drawEntityList(ctx, engine.abyssalKnights, player, playerZ, world, halfW, halfH, 'ABYSSAL_KNIGHT');
        Renderer.drawEntityList(ctx, engine.lavaGolems, player, playerZ, world, halfW, halfH, 'LAVA_GOLEM');
        Renderer.drawEntityList(ctx, engine.kobolds, player, playerZ, world, halfW, halfH, 'KOBOLD');
        Renderer.drawEntityList(ctx, engine.gargoyles, player, playerZ, world, halfW, halfH, 'GARGOYLE');
        Renderer.drawEntityList(ctx, engine.djinns, player, playerZ, world, halfW, halfH, 'DJINN');
        Renderer.drawEntityList(ctx, engine.gremlins, player, playerZ, world, halfW, halfH, 'GREMLIN');
        Renderer.drawEntityList(ctx, engine.sphinxs, player, playerZ, world, halfW, halfH, 'SPHINX');
        Renderer.drawEntityList(ctx, engine.sandTerrors, player, playerZ, world, halfW, halfH, 'SAND_TERROR');
        Renderer.drawEntityList(ctx, engine.phantomWizards, player, playerZ, world, halfW, halfH, 'PHANTOM_WIZARD');
        Renderer.drawEntityList(ctx, engine.drakes, player, playerZ, world, halfW, halfH, 'DRAKE');
        Renderer.drawEntityList(ctx, (engine as any).shadowWizards || [], player, playerZ, world, halfW, halfH, 'SHADOW_WIZARD');
        Renderer.drawEntityList(ctx, engine.fireDragonBosses, player, playerZ, world, halfW, halfH, 'FIRE_DRAGON_BOSS');

        // Draw Mark
        if (player.markPosition && Math.floor(player.markPosition.z) === playerZ) {
            const markScreenX = halfW + (player.markPosition.x - player.x) * TILE_SIZE;
            const markScreenY = halfH + (player.markPosition.y - player.y) * TILE_SIZE;
            
            ctx.save();
            ctx.translate(markScreenX, markScreenY);
            ctx.strokeStyle = '#a855f7'; // purple-500
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, TILE_SIZE * 0.4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-TILE_SIZE * 0.2, -TILE_SIZE * 0.2);
            ctx.lineTo(TILE_SIZE * 0.2, TILE_SIZE * 0.2);
            ctx.moveTo(TILE_SIZE * 0.2, -TILE_SIZE * 0.2);
            ctx.lineTo(-TILE_SIZE * 0.2, TILE_SIZE * 0.2);
            ctx.stroke();
            ctx.restore();
        }

        // Draw Portals
        const portalColors: Record<string, string> = {
            'red': '#ef4444',
            'blue': '#3b82f6',
            'yellow': '#eab308',
            'green': '#22c55e',
            'purple': '#a855f7',
            'orange': '#f97316'
        };

        for (const [color, p] of Object.entries(player.portals)) {
            const pos = p as any;
            if (Math.floor(pos.z) === playerZ) {
                const screenX = halfW + (pos.x - player.x) * TILE_SIZE;
                const screenY = halfH + (pos.y - player.y) * TILE_SIZE;
                
                ctx.save();
                ctx.translate(screenX, screenY);
                ctx.strokeStyle = portalColors[color] || '#ffffff';
                ctx.lineWidth = 3;
                
                // Swirling portal effect
                const t = performance.now() * 0.002;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, TILE_SIZE * 0.4, TILE_SIZE * 0.2, t + (i * Math.PI / 3), 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        }

        PlayerRenderer.draw(ctx, player, engine, halfW, halfH);
        // Draw Dropped Items
        for (const item of engine.droppedItems) {
            const surface = world.getSurface(Math.floor(item.x), Math.floor(item.y), playerZ);
            if (item.z < surface.z) continue;

            const screenX = halfW + (item.x - player.x) * TILE_SIZE;
            const screenY = halfH + (item.y - player.y) * TILE_SIZE;
            const depth = Math.max(0, player.z - item.z);
            const scale = Math.max(0.2, 1 - (depth * 0.1));
            
            if (scale > 0.2) {
                ctx.save();
                ctx.translate(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
                ctx.scale(scale * 0.5, scale * 0.5); // make them smaller than full tiles
                
                // Simple representation: a colored circle with a border
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE / 2, 0, Math.PI * 2);
                
                if (item.item.id === 'gold_piece') {
                    ctx.fillStyle = '#fbbf24';
                } else if (item.item.id === 'copper_piece') {
                    ctx.fillStyle = '#b45309';
                } else if (item.item.id === 'wood') {
                    ctx.fillStyle = '#8B4513';
                } else if (item.item.id === 'stone') {
                    ctx.fillStyle = '#808080';
                } else if (item.item.id === 'tent') {
                    ctx.fillStyle = '#654321';
                } else if (item.item.id === 'meat') {
                    ctx.fillStyle = '#ef4444';
                } else if (item.item.id === 'leather') {
                    ctx.fillStyle = '#d97706';
                } else {
                    ctx.fillStyle = '#e5e7eb'; // default item color
                }
                
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
        }

        // Draw Particles
        for (const p of engine.particles) {
            // Only draw particles near the player's Z level
            if (Math.abs(p.z - player.z) > 4) continue;

            const screenX = halfW + (p.x - player.x) * TILE_SIZE + TILE_SIZE / 2;
            const screenY = halfH + (p.y - player.y) * TILE_SIZE;
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            
            if (p.text === '') {
                // Draw ambient glowing dot
                ctx.beginPath();
                ctx.arc(screenX, screenY, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.font = 'bold 16px monospace';
                ctx.textAlign = 'center';
                ctx.fillText(p.text, screenX, screenY);
            }
            ctx.globalAlpha = 1.0;
        }

        // Lighting Pass
        const depthDarkness = Math.max(0, (8 - player.z) * 0.15);
        
        let timeDarkness = 0;
        const t = world.timeOfDay;
        if (t >= 20 || t < 4) {
            timeDarkness = 0.85;
        } else if (t >= 18 && t < 20) {
            timeDarkness = 0.85 * ((t - 18) / 2);
        } else if (t >= 4 && t < 6) {
            timeDarkness = 0.85 * (1 - ((t - 4) / 2));
        }

        const darkness = Math.min(0.95, Math.max(timeDarkness, depthDarkness));
        
        if (darkness > 0) {
            const lctx = engine.lightCtx;
            lctx.globalCompositeOperation = 'source-over';
            
            let r = 0, g = 0, b = 0;
            if (timeDarkness > depthDarkness) {
                r = 5; g = 15; b = 35; // Dark blue tint for night
            }
            
            lctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${darkness})`;
            lctx.fillRect(0, 0, canvas.width, canvas.height);

            lctx.globalCompositeOperation = 'destination-out';

            // Helper to draw light
            const drawLight = (x: number, y: number, radius: number, intensity: number = 1, r: number = 255, g: number = 255, b: number = 255) => {
                const screenX = halfW + (x - player.x) * TILE_SIZE;
                const screenY = halfH + (y - player.y) * TILE_SIZE;
                const grad = lctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * TILE_SIZE);
                grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`);
                grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                lctx.fillStyle = grad;
                lctx.beginPath();
                lctx.arc(screenX, screenY, radius * TILE_SIZE, 0, Math.PI * 2);
                lctx.fill();
            };

            // Player light (small radius)
            drawLight(player.x, player.y, 4, 0.8);

            // Draw lights for visible blocks
            for (const t of visibleLights) {
                if (t.block === BlockType.TORCH || t.block === BlockType.CAMPFIRE) {
                    const flicker = 0.9 + Math.random() * 0.1;
                    drawLight(t.x + 0.5, t.y + 0.5, t.block === BlockType.CAMPFIRE ? 12 : 8, flicker, 255, 200, 150);
                } else if (t.block === BlockType.MUSHROOM_CAP) {
                    drawLight(t.x + 0.5, t.y + 0.5, 5, 0.6, 0, 255, 255); // Cyan glow for mushrooms
                } else if (t.block === BlockType.LAVA) {
                    const flicker = 0.8 + Math.random() * 0.2;
                    drawLight(t.x + 0.5, t.y + 0.5, 6, flicker, 255, 69, 0); // Orange/Red glow for lava
                } else if (t.block === BlockType.CRYSTAL) {
                    drawLight(t.x + 0.5, t.y + 0.5, 4, 0.5, 186, 85, 211); // Purple glow for crystals
                } else if (t.block === BlockType.LANTERN_BLOCK) {
                    drawLight(t.x + 0.5, t.y + 0.5, 9, 0.9 + Math.random() * 0.05, 255, 240, 150); // Warm bright glow
                }
            }

            // Draw lights for Lava Golems
            for (const golem of engine.lavaGolems) {
                if (Math.abs(golem.z - player.z) < 2) {
                    const flicker = 0.8 + Math.random() * 0.2;
                    drawLight(golem.x, golem.y, 8, flicker, 255, 69, 0); // Large orange glow
                }
            }

            // Draw lights for bombs
            for (const b of engine.bombs) {
                if (Math.abs(b.z - player.z) < 2) {
                    drawLight(b.x, b.y, Math.random() * 2 + 1, 0.4, 255, 69, 0);
                }
            }

            // Draw lights for projectiles
            for (const p of engine.projectiles) {
                if (Math.abs(p.z - player.z) < 2) {
                    drawLight(p.x, p.y, 3, 0.6);
                }
            }

            // Draw lights for Persistent AoEs
            for (const paoe of engine.persistentAoEs) {
                if (Math.abs(paoe.z - player.z) < 2) {
                    if (paoe.type === 'FIRE') {
                        drawLight(paoe.x, paoe.y, paoe.radius * 1.5, 0.6 + Math.random() * 0.2, 255, 69, 0);
                    } else if (paoe.type === 'ARCANE_PROTECTION') {
                        drawLight(paoe.x, paoe.y, paoe.radius * 1.2, 0.5, 153, 50, 204);
                    }
                }
            }

            // Draw lights for AoE
            for (const aoe of engine.aoeEffects) {
                if (Math.abs(aoe.z - player.z) < 2) {
                    drawLight(aoe.x, aoe.y, aoe.radius, (aoe.life / aoe.maxLife));
                }
            }

            // Draw lights for Cone
            for (const cone of engine.coneEffects) {
                if (Math.abs(cone.z - player.z) < 2) {
                    drawLight(cone.x, cone.y, cone.radius, (cone.life / cone.maxLife));
                }
            }

            // Draw light for Mark
            if (player.markPosition && Math.floor(player.markPosition.z) === Math.floor(player.z)) {
                drawLight(player.markPosition.x, player.markPosition.y, 3, 0.5, 168, 85, 247); // purple-500
            }

            // Draw lights for Portals
            const portalLightColors: Record<string, [number, number, number]> = {
                'red': [239, 68, 68],
                'blue': [59, 130, 246],
                'yellow': [234, 179, 8],
                'green': [34, 197, 94],
                'purple': [168, 85, 247],
                'orange': [249, 115, 22]
            };
            for (const [color, p] of Object.entries(player.portals)) {
                const pos = p as any;
                if (Math.floor(pos.z) === Math.floor(player.z)) {
                    const [r, g, b] = portalLightColors[color] || [255, 255, 255];
                    drawLight(pos.x, pos.y, 4, 0.6, r, g, b);
                }
            }

            // Apply lightmap to main canvas
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(engine.lightCanvas, 0, 0);
        }
        
        if (world.activePlanet === 'ARETH') {
             // Red/orange vignette mask for heat
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.1,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.7
             );
             vignette.addColorStop(0, 'rgba(255, 69, 0, 0)');
             vignette.addColorStop(1, 'rgba(180, 20, 0, 0.4)');
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (world.activePlanet === 'TARHE') {
             // Light blue/white frost vignette for cold
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.8
             );
             vignette.addColorStop(0, 'rgba(173, 216, 230, 0)');
             vignette.addColorStop(1, 'rgba(173, 216, 230, 0.35)');
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (world.activePlanet === 'TERHA') {
             // Green/Brown murky vignette for swamp
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.8
             );
             vignette.addColorStop(0, 'rgba(34, 139, 34, 0)'); // Forest green
             vignette.addColorStop(1, 'rgba(85, 107, 47, 0.45)'); // Dark olive green
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw Abyssal Floor UI
        if (player.x >= 60000 * 16) {
            const currentFloor = Math.floor((player.x / 16 - 60000) / 10);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(canvas.width / 2 - 100, 20, 200, 40);
            ctx.strokeStyle = '#5c3a21';
            ctx.lineWidth = 2;
            ctx.strokeRect(canvas.width / 2 - 100, 20, 200, 40);
            
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff4444';
            ctx.fillText(`ABYSSAL FLOOR ${currentFloor}`, canvas.width / 2, 40);
        }
    }
}
