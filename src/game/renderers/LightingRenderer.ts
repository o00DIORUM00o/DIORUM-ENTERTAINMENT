import { TILE_SIZE } from '../Constants';
import { BlockType } from '../constants/BlockType';

export class LightingRenderer {
    static lightCache: Map<string, HTMLCanvasElement> = new Map();

    static getLightCanvas(radiusTiles: number, r: number, g: number, b: number): HTMLCanvasElement {
        const radius = Math.floor(radiusTiles * TILE_SIZE);
        const key = `${radius}_${r}_${g}_${b}`;
        if (this.lightCache.has(key)) return this.lightCache.get(key)!;

        const size = radius * 2;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d')!;
        const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        
        this.lightCache.set(key, c);
        return c;
    }

    static draw(engine: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, halfW: number, halfH: number, visibleLights: any[], playerZ: number) {
        const { world, player } = engine;
        const depthDarkness = Math.max(0, (8 - player.z) * 0.15);
        
        let timeDarkness = 0;
        const t = world.timeOfDay;
        if (t >= 20 || t < 4) {
            timeDarkness = 0.70;
        } else if (t >= 18 && t < 20) {
            timeDarkness = 0.70 * ((t - 18) / 2);
        } else if (t >= 4 && t < 6) {
            timeDarkness = 0.70 * (1 - ((t - 4) / 2));
        }

        const darkness = Math.min(0.95, Math.max(timeDarkness, depthDarkness));
        
        if (darkness > 0) {
            const lctx = engine.lightCtx;
            lctx.globalCompositeOperation = 'source-over';
            
            let r = 0, g = 0, b = 0;
            if (world.isBloodMoon && timeDarkness > depthDarkness) {
                r = 40; g = 5; b = 5; // Deep red tint for blood moon
            } else if (timeDarkness > depthDarkness) {
                r = 5; g = 15; b = 35; // Dark blue tint for night
            }
            
            lctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${darkness})`;
            lctx.fillRect(0, 0, canvas.width, canvas.height);

            lctx.globalCompositeOperation = 'destination-out';

            // Helper to draw light using pre-cached canvas images and globalAlpha
            const drawLight = (x: number, y: number, radiusTiles: number, intensity: number = 1, r: number = 255, g: number = 255, b: number = 255) => {
                const screenX = halfW + (x - player.x) * TILE_SIZE;
                const screenY = halfH + (y - player.y) * TILE_SIZE;
                
                const lightImg = LightingRenderer.getLightCanvas(radiusTiles, r, g, b);
                const size = lightImg.width;
                
                lctx.globalAlpha = intensity;
                lctx.drawImage(lightImg, screenX - size / 2, screenY - size / 2, size, size);
                lctx.globalAlpha = 1.0;
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
    }
}
