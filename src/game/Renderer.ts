import { PlanetRegistry } from './registries/PlanetRegistry';
import { ThemeManager } from './ThemeManager';

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
import { DroppedItemRenderer } from './renderers/DroppedItemRenderer';
import { ParticleRenderer } from './renderers/ParticleRenderer';
import { LightingRenderer } from './renderers/LightingRenderer';
import { OverlayRenderer } from './renderers/OverlayRenderer';

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
        // Pre-compute canvas bounds for Frustum Culling
        const canvasW = halfW * 2;
        const canvasH = halfH * 2;
        const pad = TILE_SIZE * 4;

        for (const ent of list) {
            const screenX = halfW + (ent.x - player.x) * TILE_SIZE;
            const screenY = halfH + (ent.y - player.y) * TILE_SIZE;

            // Frustum Culling: If deeply off-screen, skip entirely
            if (screenX < -pad || screenX > canvasW + pad || screenY < -pad || screenY > canvasH + pad) continue;

            const depth = player.z - ent.z;
            if (depth > 5 || depth < -1) continue;

            const surface = world.getSurface(Math.floor(ent.x), Math.floor(ent.y), playerZ);
            if (ent.z < surface.z) continue;

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
        const activePlanetDef = PlanetRegistry.get(world.activePlanet);
        if (activePlanetDef) {
            airColor = activePlanetDef.airColor;
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

                let displayBlock = block;
                // For top-down retro themes, we want cliff cross-sections to match their top surface appearance instead of revealing plain subterranean dirt.
                if (ThemeManager && ThemeManager.currentThemeId !== 'classic' && isExposed && drawZ < highestZ) {
                    const topBlock = world.getBlock(x, y, highestZ);
                    if ([BlockType.GRASS, BlockType.SAND, BlockType.SNOW, BlockType.SWAMP_DIRT, BlockType.BLUE_DIRT, BlockType.RED_DIRT, BlockType.GREEN_DIRT].includes(topBlock)) {
                        displayBlock = topBlock;
                    }
                }

                const color = BLOCK_COLORS[displayBlock] || BLOCK_COLORS[block];
                const shade = Math.max(0.05, 1 - (depth * 0.1));
                
                if (color) {
                    let { r, g, b } = color;
                    r *= shade; g *= shade; b *= shade;

                    if (displayBlock === BlockType.ICE) {
                        ctx.fillStyle = `rgba(${r},${g},${b}, 0.8)`;
                    } else {
                        ctx.fillStyle = `rgb(${r},${g},${b})`;
                    }
                    ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
                }

                const renderer = BlockRenderRegistry.get(displayBlock);
                if (renderer) {
                    renderer.draw({ ctx, TILE_SIZE, entity: null, screenX, screenY, halfW, halfH, time: performance.now(), block: displayBlock, shade });
                }
                // Draw grid lines for definition (Optimized: fillRect is much faster than strokeRect)
                ctx.fillStyle = `rgba(0,0,0,${0.2 + Math.max(0, depth) * 0.1})`;
                ctx.fillRect(screenX + TILE_SIZE - 1, screenY, 1, TILE_SIZE); // Right edge
                ctx.fillRect(screenX, screenY + TILE_SIZE - 1, TILE_SIZE, 1); // Bottom edge
            }
        }

        Renderer.drawEntityList(ctx, engine.bees, player, playerZ, world, halfW, halfH, 'BEE');
        Renderer.drawEntityList(ctx, engine.ants, player, playerZ, world, halfW, halfH, 'ANT');
        Renderer.drawEntityList(ctx, engine.entities, player, playerZ, world, halfW, halfH);
        Renderer.drawEntityList(ctx, engine.animals, player, playerZ, world, halfW, halfH);
        Renderer.drawEntityList(ctx, engine.goblins, player, playerZ, world, halfW, halfH, 'GOBLIN');
        Renderer.drawEntityList(ctx, engine.frostCasters, player, playerZ, world, halfW, halfH, 'FROST_CASTER');
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
        Renderer.drawEntityList(ctx, engine.voidLords, player, playerZ, world, halfW, halfH, 'VOID_LORD');
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

        if (player.isEyeMode && player.eyeReturnPos && Math.floor(player.eyeReturnPos.z) === playerZ) {
            const returnScreenX = halfW + (player.eyeReturnPos.x - player.x) * TILE_SIZE;
            const returnScreenY = halfH + (player.eyeReturnPos.y - player.y) * TILE_SIZE;
            ctx.globalAlpha = 0.5;
            PlayerRenderer.draw(ctx, { ...player, isEyeMode: false, x: player.eyeReturnPos.x, y: player.eyeReturnPos.y }, engine, returnScreenX, returnScreenY);
            ctx.globalAlpha = 1.0;
        }

        PlayerRenderer.draw(ctx, player, engine, halfW, halfH);
        
        DroppedItemRenderer.draw(ctx, engine, halfW, halfH, playerZ);
        ParticleRenderer.draw(ctx, engine, halfW, halfH, playerZ);
        LightingRenderer.draw(engine, canvas, ctx, halfW, halfH, visibleLights, playerZ);
        OverlayRenderer.draw(engine, canvas, ctx);
    }
}
