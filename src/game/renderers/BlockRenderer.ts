import { BlockRenderRegistry, BlockRenderContext } from '../registries/BlockRenderRegistry';
import { BlockType } from '../constants/BlockType';
import { ThemeManager } from '../ThemeManager';
import { BLOCK_COLORS } from '../Constants';

export function defineBlockRenderers() {
    const legacyRenderer = {
        draw: (context: BlockRenderContext) => {
            const { ctx, screenX, screenY, TILE_SIZE, block, shade } = context;
            
            // Apply retro quest Zelda-style 'sprite' overrides for basic blocks
            if (ThemeManager.currentThemeId !== 'classic') {
                const isDark = ThemeManager.currentThemeId === 'dark_fantasy_sprites' || ThemeManager.currentThemeId === 'gothic' || ThemeManager.currentThemeId === 'noir';
                
                if ([BlockType.GRASS, BlockType.BLUE_DIRT, BlockType.RED_DIRT, BlockType.GREEN_DIRT, BlockType.SWAMP_DIRT].includes(block)) {
                    const bc = BLOCK_COLORS[block] || {r:50, g:150, b:50};
                    const offset = isDark ? -10 : 20;
                    ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, (bc.r + offset)*shade))}, ${Math.max(0, Math.min(255, (bc.g + offset + 10)*shade))}, ${Math.max(0, Math.min(255, (bc.b + offset)*shade))})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, 2, 4);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.6, 2, 4);
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.8, 2, 4);
                } else if (block === BlockType.DIRT || block === BlockType.DIRT_PATH || block === BlockType.MUD || block === BlockType.BLUE_CLAY || block === BlockType.RED_CLAY || block === BlockType.GREEN_CLAY) {
                    const bc = BLOCK_COLORS[block] || {r:100, g:70, b:40};
                    ctx.fillStyle = `rgb(${Math.max(0, (bc.r - 20)*shade)}, ${Math.max(0, (bc.g - 20)*shade)}, ${Math.max(0, (bc.b - 20)*shade)})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.15, TILE_SIZE * 0.15);
                } else if (block === BlockType.SAND || block === BlockType.BLACK_SAND || block === BlockType.ORANGE_SAND) {
                    const bc = BLOCK_COLORS[block] || {r:200, g:180, b:130};
                    ctx.fillStyle = `rgb(${Math.max(0, (bc.r - 30)*shade)}, ${Math.max(0, (bc.g - 30)*shade)}, ${Math.max(0, (bc.b - 30)*shade)})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, 2, 2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.5, 3, 3);
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8, 2, 2);
                } else if (block === BlockType.SNOW) {
                    ctx.fillStyle = isDark ? `rgb(${150*shade}, ${150*shade}, ${160*shade})` : `rgb(${240*shade}, ${240*shade}, ${255*shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.25, screenY + TILE_SIZE * 0.25, TILE_SIZE * 0.2, 3);
                    ctx.fillRect(screenX + TILE_SIZE * 0.65, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.25, 3);
                } else if (block === BlockType.WATER) {
                    ctx.fillStyle = isDark ? `rgba(10, 20, 40, ${shade * 0.5})` : `rgba(100, 200, 255, ${shade * 0.5})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, 2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.3, 2);
                } else if (block === BlockType.STONE || block === BlockType.CASTLE_STONE || block === BlockType.MARBLE || block === BlockType.BLACK_MARBLE || block === BlockType.OBSIDIAN) {
                    ctx.strokeStyle = isDark ? `rgb(${30*shade}, ${30*shade}, ${30*shade})` : `rgb(${50*shade}, ${50*shade}, ${50*shade})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    // draw a subtle rocky crack or border
                    ctx.moveTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.9);
                    ctx.lineTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.9);
                    ctx.closePath();
                    ctx.stroke();
                    // Rock shading detail
                    ctx.fillStyle = isDark ? `rgb(${40*shade}, ${40*shade}, ${40*shade})` : `rgb(${100*shade}, ${100*shade}, ${100*shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.1, TILE_SIZE * 0.2);
                } else if (block >= BlockType.RUNED_STONE && block <= BlockType.RUNED_ABYSSAL_BRICK) {
                    ctx.strokeStyle = isDark ? `rgb(${30*shade}, ${30*shade}, ${30*shade})` : `rgb(${50*shade}, ${50*shade}, ${50*shade})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.9);
                    ctx.lineTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.9);
                    ctx.closePath();
                    ctx.stroke();
                    
                    ctx.fillStyle = isDark ? `rgb(${40*shade}, ${40*shade}, ${40*shade})` : `rgb(${100*shade}, ${100*shade}, ${100*shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.1, TILE_SIZE * 0.2);
                    
                    ctx.strokeStyle = `rgb(${0}, ${255*shade}, ${255*shade})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.7);
                    ctx.lineTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.3);
                    ctx.lineTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.7);
                    ctx.moveTo(screenX + TILE_SIZE * 0.35, screenY + TILE_SIZE * 0.5);
                    ctx.lineTo(screenX + TILE_SIZE * 0.65, screenY + TILE_SIZE * 0.5);
                    ctx.stroke();
                } else if (block === BlockType.WOOD_WALL) {
                    ctx.strokeStyle = isDark ? `rgba(30, 15, 15, ${shade})` : `rgba(60, 30, 15, ${shade})`;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.2, screenY);
                    ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE);
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY);
                    ctx.lineTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE);
                    ctx.moveTo(screenX + TILE_SIZE * 0.8, screenY);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE);
                    ctx.stroke();
                } else if (block === BlockType.WOOD_FLOOR) {
                    ctx.strokeStyle = isDark ? `rgba(30, 15, 15, ${shade * 0.5})` : `rgba(60, 30, 15, ${shade * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY + TILE_SIZE * 0.33);
                    ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE * 0.33);
                    ctx.moveTo(screenX, screenY + TILE_SIZE * 0.66);
                    ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE * 0.66);
                    ctx.stroke();
                    ctx.fillStyle = isDark ? `rgba(40, 20, 10, ${shade * 0.3})` : `rgba(80, 40, 20, ${shade * 0.3})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                } else if (block === BlockType.PAVED_ROAD) {
                    // A packed dirt / gravel road, fitting for a fantasy setting
                    ctx.fillStyle = `rgba(110, 95, 80, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(130, 115, 100, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.15, TILE_SIZE * 0.15);
                    ctx.fillStyle = `rgba(90, 75, 60, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                } else if (block === BlockType.COBBLESTONE_ROAD) {
                    // A pattern of irregular grey stones for city streets
                    ctx.fillStyle = `rgba(90, 90, 90, ${shade})`; // Dark grey grout
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(140, 140, 140, ${shade})`; // Light grey stones
                    
                    // Top-left
                    ctx.fillRect(screenX + 1, screenY + 1, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
                    // Top-right
                    ctx.fillRect(screenX + TILE_SIZE * 0.45 + 1, screenY + 1, TILE_SIZE * 0.5, TILE_SIZE * 0.3);
                    // Bottom-left
                    ctx.fillRect(screenX + 1, screenY + TILE_SIZE * 0.45 + 1, TILE_SIZE * 0.6, TILE_SIZE * 0.5);
                    // Bottom-right
                    ctx.fillRect(screenX + TILE_SIZE * 0.65 + 1, screenY + TILE_SIZE * 0.35 + 1, TILE_SIZE * 0.3, TILE_SIZE * 0.6);
                } else if (block === BlockType.ROAD_SIGN) {
                    // Pole
                    ctx.fillStyle = `rgba(100, 60, 30, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    // Board
                    ctx.fillStyle = `rgba(150, 100, 60, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.3);
                    // Text
                    ctx.fillStyle = `rgba(50, 20, 10, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, 2);
                } else if (block === BlockType.TRUNK || block === BlockType.WOOD_LOG || block === BlockType.RED_WOOD || block === BlockType.BLACK_WOOD || block === BlockType.GREEN_WOOD || block === BlockType.BLUE_WOOD || block === BlockType.ORANGE_WOOD || block === BlockType.PURPLE_WOOD || block === BlockType.YELLOW_WOOD || block === BlockType.BROWN_WOOD || block === BlockType.FROST_WOOD || block === BlockType.ANCIENT_WOOD || block === BlockType.MINE_SHAFT_WOOD || block === BlockType.TROPICAL_WOOD || block === BlockType.MUSHROOM_STEM || block === BlockType.GIANT_MUSHROOM_STALK) {
                    const bc = BLOCK_COLORS[block] || (isDark ? {r: 50, g: 30, b: 20} : {r: 101, g: 67, b: 33});
                    ctx.fillStyle = `rgba(${Math.max(0, bc.r - 20)}, ${Math.max(0, bc.g - 20)}, ${Math.max(0, bc.b - 20)}, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(${Math.max(0, bc.r - 40)}, ${Math.max(0, bc.g - 40)}, ${Math.max(0, bc.b - 40)}, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (block === BlockType.LEAVES || block === BlockType.PINE_LEAVES) {
                    ctx.fillStyle = isDark ? `rgba(15, 40, 15, ${shade})` : `rgba(30, 120, 30, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.45, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = isDark ? `rgba(25, 60, 25, ${shade})` : `rgba(50, 180, 50, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.LAVA) {
                    ctx.fillStyle = isDark ? `rgba(150, 10, 10, ${shade})` : `rgba(255, 100, 0, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
                    ctx.fillStyle = isDark ? `rgba(180, 20, 20, ${shade})` : `rgba(255, 200, 0, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                } else if (block === BlockType.GRAVESTONE) {
                    ctx.fillStyle = isDark ? `rgba(60, 60, 60, ${shade})` : `rgba(120, 120, 120, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.8);
                    ctx.fillStyle = isDark ? `rgba(40, 40, 40, ${shade})` : `rgba(90, 90, 90, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, 2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.45, TILE_SIZE * 0.2, 2);
                } else if (block === BlockType.TORCH || block === BlockType.CAMPFIRE) {
                    // Sprite 2D torch/campfire base
                    const yOffset = block === BlockType.CAMPFIRE ? 0.6 : 0.4;
                    const height = block === BlockType.CAMPFIRE ? 0.4 : 0.6;
                    ctx.fillStyle = isDark ? `rgba(80, 40, 20, ${shade})` : `rgba(139, 69, 19, ${shade})`;
                    if (block === BlockType.CAMPFIRE) {
                        ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.6, TILE_SIZE * 0.2);
                        ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
                    } else {
                        ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.2, TILE_SIZE * 0.6);
                    }
                    ctx.fillStyle = isDark ? `rgba(200, 20, 20, ${shade})` : `rgba(255, 100, 0, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * (yOffset - 0.1), TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = isDark ? `rgba(255, 100, 0, ${shade})` : `rgba(255, 200, 0, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * (yOffset - 0.05), TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.CROP_STAGE_3) {
                    // Retro carrot/crop sprite
                    ctx.fillStyle = isDark ? `rgba(180, 80, 0, ${shade})` : `rgba(255, 140, 0, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
                    // leaves
                    ctx.fillStyle = isDark ? `rgba(20, 60, 20, ${shade})` : `rgba(50, 200, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                } else if (block === BlockType.SPIKE_FLOOR || block === BlockType.SPIKE_FLOOR_ACTIVE) {
                    ctx.fillStyle = isDark ? `rgba(40,40,40,${shade})` : `rgba(100,100,100,${shade})`; // base
                    ctx.fillRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                    if (block === BlockType.SPIKE_FLOOR_ACTIVE) {
                        ctx.fillStyle = isDark ? `rgba(150,150,150,${shade})` : `rgba(220,220,220,${shade})`; // spikes
                        ctx.beginPath();
                        for (let ix=0; ix<3; ix++) {
                            for (let iy=0; iy<3; iy++) {
                                const px = screenX + TILE_SIZE * (0.2 + ix*0.3);
                                const py = screenY + TILE_SIZE * (0.2 + iy*0.3);
                                ctx.moveTo(px, py); ctx.lineTo(px+2, py-4); ctx.lineTo(px+4, py);
                            }
                        }
                        ctx.fill();
                    } else {
                        // holes
                        ctx.fillStyle = `rgba(10,10,10,${shade})`;
                        for (let ix=0; ix<3; ix++) {
                            for (let iy=0; iy<3; iy++) {
                                ctx.fillRect(screenX + TILE_SIZE * (0.2 + ix*0.3), screenY + TILE_SIZE * (0.2 + iy*0.3), 3, 3);
                            }
                        }
                    }
                } else if (block === BlockType.PRESSURE_PLATE || block === BlockType.PRESSURE_PLATE_ACTIVE) {
                    ctx.fillStyle = isDark ? `rgba(40,40,40,${shade})` : `rgba(100,100,100,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
                    ctx.fillStyle = isDark ? `rgba(30,30,30,${shade})` : `rgba(80,80,80,${shade})`;
                    const margin = block === BlockType.PRESSURE_PLATE_ACTIVE ? 0.3 : 0.2;
                    ctx.fillRect(screenX + TILE_SIZE * margin, screenY + TILE_SIZE * margin, TILE_SIZE * (1 - 2*margin), TILE_SIZE * (1 - 2*margin));
                } else if (block === BlockType.LEVER || block === BlockType.LEVER_ON) {
                    ctx.fillStyle = isDark ? `rgba(40,40,40,${shade})` : `rgba(100,100,100,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.4, TILE_SIZE * 0.2);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = `rgba(139,90,43,${shade})`;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8);
                    if (block === BlockType.LEVER_ON) {
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.3);
                    } else {
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.3);
                    }
                    ctx.stroke();
                    ctx.fillStyle = `rgba(255,50,50,${shade})`; // red knob
                    ctx.beginPath();
                    ctx.arc(block === BlockType.LEVER_ON ? screenX + TILE_SIZE * 0.8 : screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.3, 3, 0, Math.PI*2);
                    ctx.fill();
                } else if (block === BlockType.BED) {
                    ctx.fillStyle = isDark ? `rgba(60,20,20,${shade})` : `rgba(200,50,50,${shade})`; // bed cover
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                    ctx.fillStyle = isDark ? `rgba(100,100,100,${shade})` : `rgba(220,220,220,${shade})`; // pillow
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.2);
                    ctx.fillStyle = isDark ? `rgba(40,30,20,${shade})` : `rgba(139,90,43,${shade})`; // bed frame posts
                    ctx.fillRect(screenX + TILE_SIZE * 0.05, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.8);
                    ctx.fillRect(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.8);
                } else if (block === BlockType.DOOR_CLOSED || block === BlockType.STONE_DOOR_CLOSED) {
                    const doorColor = block === BlockType.DOOR_CLOSED ? (isDark ? `60,40,20` : `139,90,43`) : (isDark ? `60,60,60` : `120,120,120`);
                    ctx.fillStyle = `rgba(${doorColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY, TILE_SIZE * 0.8, TILE_SIZE);
                    ctx.strokeStyle = `rgba(0,0,0,${shade * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX + TILE_SIZE * 0.1, screenY, TILE_SIZE * 0.8, TILE_SIZE);
                    ctx.fillStyle = `rgba(200,200,50,${shade})`; // knob
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.75, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.DOOR_OPEN || block === BlockType.STONE_DOOR_OPEN) {
                    const doorColor = block === BlockType.DOOR_OPEN ? (isDark ? `60,40,20` : `139,90,43`) : (isDark ? `60,60,60` : `120,120,120`);
                    ctx.fillStyle = `rgba(${doorColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY, TILE_SIZE * 0.2, TILE_SIZE); // open to side
                } else if (block === BlockType.ICE) {
                    ctx.fillStyle = isDark ? `rgba(40,60,80,${shade * 0.8})` : `rgba(180,220,255,${shade * 0.8})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = `rgba(255,255,255,${shade * 0.5})`; // ice sheen/crack
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                    ctx.stroke();
                } else if ([BlockType.BUSH, BlockType.RED_BERRY_BUSH, BlockType.BLUE_BERRY_BUSH, BlockType.BLACK_BERRY_BUSH, BlockType.YELLOW_BERRY_BUSH].includes(block)) {
                    // Bush with color dots
                    ctx.fillStyle = isDark ? `rgba(20,50,20,${shade})` : `rgba(30,120,30,${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    // Berries
                    if (block === BlockType.RED_BERRY_BUSH) ctx.fillStyle = isDark ? `rgba(150,20,20,${shade})` : `rgba(255,0,0,${shade})`;
                    else if (block === BlockType.BLUE_BERRY_BUSH) ctx.fillStyle = isDark ? `rgba(20,20,150,${shade})` : `rgba(0,0,255,${shade})`;
                    else if (block === BlockType.BLACK_BERRY_BUSH) ctx.fillStyle = `rgba(20,20,20,${shade})`;
                    else if (block === BlockType.YELLOW_BERRY_BUSH) ctx.fillStyle = isDark ? `rgba(150,150,20,${shade})` : `rgba(255,255,0,${shade})`;
                    
                    if (block !== BlockType.BUSH) {
                        ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.5, 2, 2);
                        ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.4, 2, 2);
                        ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.7, 2, 2);
                        ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.8, 2, 2);
                    }
                } else if ([BlockType.GREEN_CRYSTAL, BlockType.RED_CRYSTAL, BlockType.BLACK_CRYSTAL, BlockType.BLUE_CRYSTAL, BlockType.ORANGE_CRYSTAL, BlockType.PURPLE_CRYSTAL, BlockType.YELLOW_CRYSTAL, BlockType.GREEN_GLOW_CRYSTAL, BlockType.RED_GLOW_CRYSTAL, BlockType.BLUE_GLOW_CRYSTAL, BlockType.ORANGE_GLOW_CRYSTAL, BlockType.PURPLE_GLOW_CRYSTAL, BlockType.YELLOW_GLOW_CRYSTAL, BlockType.JADE, BlockType.DIAMOND, BlockType.GREEN_DIAMOND, BlockType.PURPLE_DIAMOND, BlockType.SAPPHIRE, BlockType.AMBER, BlockType.GREEN_AMBER, BlockType.MOONSTONE].includes(block)) {
                    // Crystal cluster
                    const strBlock = block.toString();
                    let cryR = 255, cryG = 255, cryB = 255;
                    // very simple logic to extract color based on id group just to match roughly
                    if (block === BlockType.RED_CRYSTAL || block === BlockType.RED_GLOW_CRYSTAL || block === BlockType.RUBY) { cryG=50; cryB=50; }
                    else if (block === BlockType.GREEN_CRYSTAL || block === BlockType.GREEN_GLOW_CRYSTAL || block === BlockType.JADE || block === BlockType.EMERALD || block === BlockType.GREEN_DIAMOND || block === BlockType.GREEN_AMBER) { cryR=50; cryB=50; }
                    else if (block === BlockType.BLUE_CRYSTAL || block === BlockType.BLUE_GLOW_CRYSTAL || block === BlockType.SAPPHIRE) { cryR=50; cryG=50; }
                    else if (block === BlockType.PURPLE_CRYSTAL || block === BlockType.PURPLE_GLOW_CRYSTAL || block === BlockType.PURPLE_DIAMOND) { cryG=50; }
                    else if (block === BlockType.ORANGE_CRYSTAL || block === BlockType.ORANGE_GLOW_CRYSTAL || block === BlockType.AMBER) { cryB=50; cryG=150; }
                    else if (block === BlockType.YELLOW_CRYSTAL || block === BlockType.YELLOW_GLOW_CRYSTAL) { cryB=50; }
                    else if (block === BlockType.BLACK_CRYSTAL || block === BlockType.BLACK_DIAMOND) { cryR=50; cryG=50; cryB=50; }
                    
                    if (isDark) { cryR = Math.max(30, cryR - 100); cryG = Math.max(30, cryG - 100); cryB = Math.max(30, cryB - 100); }
                    
                    ctx.fillStyle = `rgba(${cryR},${cryG},${cryB},${shade})`;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8);
                    ctx.fill();
                    ctx.fillStyle = `rgba(255,255,255,${shade*0.4})`; // highlight
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 0.55, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.8);
                    ctx.fill();
                } else if ([BlockType.CONVEYOR_BELT_N, BlockType.CONVEYOR_BELT_S, BlockType.CONVEYOR_BELT_E, BlockType.CONVEYOR_BELT_W].includes(block)) {
                    ctx.fillStyle = isDark ? `rgba(40,40,40,${shade})` : `rgba(80,80,80,${shade})`;
                    ctx.fillRect(screenX + 1, screenY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                    ctx.fillStyle = `rgba(200,200,200,${shade})`; // arrow
                    ctx.beginPath();
                    if (block === BlockType.CONVEYOR_BELT_N) {
                        ctx.moveTo(screenX + TILE_SIZE*0.5, screenY + TILE_SIZE*0.2); ctx.lineTo(screenX + TILE_SIZE*0.8, screenY + TILE_SIZE*0.8); ctx.lineTo(screenX + TILE_SIZE*0.2, screenY + TILE_SIZE*0.8);
                    } else if (block === BlockType.CONVEYOR_BELT_S) {
                        ctx.moveTo(screenX + TILE_SIZE*0.5, screenY + TILE_SIZE*0.8); ctx.lineTo(screenX + TILE_SIZE*0.2, screenY + TILE_SIZE*0.2); ctx.lineTo(screenX + TILE_SIZE*0.8, screenY + TILE_SIZE*0.2);
                    } else if (block === BlockType.CONVEYOR_BELT_E) {
                        ctx.moveTo(screenX + TILE_SIZE*0.8, screenY + TILE_SIZE*0.5); ctx.lineTo(screenX + TILE_SIZE*0.2, screenY + TILE_SIZE*0.2); ctx.lineTo(screenX + TILE_SIZE*0.2, screenY + TILE_SIZE*0.8);
                    } else if (block === BlockType.CONVEYOR_BELT_W) {
                        ctx.moveTo(screenX + TILE_SIZE*0.2, screenY + TILE_SIZE*0.5); ctx.lineTo(screenX + TILE_SIZE*0.8, screenY + TILE_SIZE*0.8); ctx.lineTo(screenX + TILE_SIZE*0.8, screenY + TILE_SIZE*0.2);
                    }
                    ctx.fill();
                } else if ([BlockType.AUTO_MINER, BlockType.AUTO_DROPPER, BlockType.AUTO_CRAFTER, BlockType.VACUUM_HOPPER].includes(block)) {
                    ctx.fillStyle = isDark ? `rgba(50,50,60,${shade})` : `rgba(100,100,120,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE*0.1, screenY + TILE_SIZE*0.1, TILE_SIZE*0.8, TILE_SIZE*0.8);
                    ctx.fillStyle = `rgba(255,200,50,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE*0.3, screenY + TILE_SIZE*0.3, TILE_SIZE*0.4, TILE_SIZE*0.4);
                    // Add distinct features
                    if (block === BlockType.AUTO_MINER) {
                        ctx.fillStyle = `rgba(200,50,50,${shade})`; // Pickaxe shape
                        ctx.fillRect(screenX + TILE_SIZE*0.4, screenY + TILE_SIZE*0.2, TILE_SIZE*0.2, TILE_SIZE*0.2);
                    } else if (block === BlockType.AUTO_DROPPER) {
                        ctx.fillStyle = `rgba(50,50,200,${shade})`; // Down arrow
                        ctx.fillRect(screenX + TILE_SIZE*0.4, screenY + TILE_SIZE*0.6, TILE_SIZE*0.2, TILE_SIZE*0.2);
                    } else if (block === BlockType.AUTO_CRAFTER) {
                        ctx.fillStyle = `rgba(50,200,50,${shade})`; // Plus
                        ctx.fillRect(screenX + TILE_SIZE*0.4, screenY + TILE_SIZE*0.45, TILE_SIZE*0.2, TILE_SIZE*0.1);
                        ctx.fillRect(screenX + TILE_SIZE*0.45, screenY + TILE_SIZE*0.4, TILE_SIZE*0.1, TILE_SIZE*0.2);
                    } else if (block === BlockType.VACUUM_HOPPER) {
                        ctx.fillStyle = `rgba(200,50,200,${shade})`; // Hole
                        ctx.beginPath();
                        ctx.arc(screenX + TILE_SIZE*0.5, screenY + TILE_SIZE*0.5, TILE_SIZE*0.1, 0, Math.PI*2);
                        ctx.fill();
                    }
                } else if (block === BlockType.BONE_PILE_SPAWNER || block === BlockType.ABYSSAL_SPAWNER || block === BlockType.HORDE_SPAWNER || block === BlockType.ARETH_SPAWNER || block === BlockType.FAIRY_SPAWNER || block === BlockType.DARK_ELF_SPAWNER || block === BlockType.DWARF_SPAWNER || block === BlockType.GNOME_SPAWNER || block === BlockType.ROCK_GOLEM_SPAWNER || block === BlockType.OBSERVER_SPAWNER || block === BlockType.SPHINX_SPAWNER || block === BlockType.QUEST_DUNGEON_SPAWNER || block === BlockType.QUEST_NPC_SPAWNER || block === BlockType.BOUNTY_HUNTER_SPAWNER || block === BlockType.ESCALATION_SPAWNER || block === BlockType.LAVA_GOLEM_SPAWNER || block === BlockType.GARGOYLE_SPAWNER || block === BlockType.PHANTOM_WIZARD_SPAWNER || block === BlockType.KING_SPAWNER) {
                    ctx.fillStyle = isDark ? `rgba(20,20,20,${shade * 0.8})` : `rgba(40,40,40,${shade * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE*0.5, screenY + TILE_SIZE*0.5, TILE_SIZE*0.4, 0, Math.PI*2);
                    ctx.fill();
                    ctx.strokeStyle = `rgba(200,50,200,${shade})`; // Spawner magic rune outline
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE*0.5, screenY + TILE_SIZE*0.5, TILE_SIZE*0.3, 0, Math.PI*2);
                    ctx.stroke();
                    // Star shape inside
                    ctx.beginPath();
                    for (let i=0; i<5; i++) {
                        const angle = (i * 2 + 1.5) * Math.PI / 2.5; // star math
                        const px = screenX + TILE_SIZE*0.5 + Math.cos(angle) * TILE_SIZE*0.25;
                        const py = screenY + TILE_SIZE*0.5 + Math.sin(angle) * TILE_SIZE*0.25;
                        if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                    }
                    ctx.closePath();
                    ctx.stroke();
                } else if ([BlockType.SEEDLING_RED, BlockType.SEEDLING_BLUE, BlockType.SEEDLING_BLACK, BlockType.SEEDLING_YELLOW].includes(block)) {
                    // Seedling sprite
                    ctx.fillStyle = isDark ? `rgba(20,50,20,${shade})` : `rgba(40,150,40,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.2, TILE_SIZE * 0.3); // stem
                    ctx.fillStyle = isDark ? `rgba(40,80,40,${shade})` : `rgba(80,200,80,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.4, TILE_SIZE * 0.2); // leaves
                } else if (block === BlockType.POT) {
                    ctx.fillStyle = isDark ? `rgba(80,50,30,${shade})` : `rgba(180,100,50,${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = isDark ? `rgba(50,30,20,${shade})` : `rgba(120,60,30,${shade})`; // opening
                    ctx.beginPath();
                    ctx.ellipse(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, TILE_SIZE * 0.05, 0, 0, Math.PI * 2);
                    ctx.fill();
                } else if ([BlockType.MUSHROOM_CAP, BlockType.GLOWING_MUSHROOM_BLOCK, BlockType.GIANT_MUSHROOM_CAP_RED, BlockType.GIANT_MUSHROOM_CAP_BROWN, BlockType.GLOWCAP_MUSHROOM].includes(block)) {
                    if (block === BlockType.GLOWING_MUSHROOM_BLOCK) {
                        ctx.fillStyle = isDark ? `rgba(200, 200, 200, ${shade})` : `rgba(240, 240, 220, ${shade})`; // Stem
                        ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.8);
                    } else { // CAP
                        const capColor = block === BlockType.GIANT_MUSHROOM_CAP_BROWN ? (isDark ? `80,50,30` : `139,90,43`) : 
                                         block === BlockType.GLOWCAP_MUSHROOM ? `50,200,250` : 
                                         (isDark ? `150,20,20` : `250,50,50`); // red cap default
                        ctx.fillStyle = `rgba(${capColor}, ${shade})`;
                        ctx.beginPath();
                        ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.5, Math.PI, 0); // half circle
                        ctx.fill();
                        // dots
                        if (block !== BlockType.GIANT_MUSHROOM_CAP_BROWN) {
                            ctx.fillStyle = `rgba(255,255,255,${shade})`;
                            ctx.beginPath(); ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.1, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.1, 0, Math.PI * 2); ctx.fill();
                            ctx.beginPath(); ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.1, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                } else if (block === BlockType.SHRINE || block === BlockType.ALTAR_DIVINE || block === BlockType.ALTAR_CORRUPTED || block === BlockType.BLOOD_ALTAR || block === BlockType.SAND_TERROR_ALTAR || block === BlockType.PHANTOM_WIZARD_ALTAR || block === BlockType.DARK_WIZARD_PEDESTAL || block === BlockType.VOID_LORD_ALTAR) {
                    const altarColor = block === BlockType.ALTAR_DIVINE ? `200,200,220` : 
                                       (block === BlockType.ALTAR_CORRUPTED || block === BlockType.BLOOD_ALTAR || block === BlockType.DARK_WIZARD_PEDESTAL || block === BlockType.VOID_LORD_ALTAR) ? `30,10,10` :
                                       `120,120,120`;
                    ctx.fillStyle = `rgba(${altarColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6); // Base
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY, TILE_SIZE * 0.4, TILE_SIZE * 0.3); // Top pillar
                    
                    const runeColor = block === BlockType.ALTAR_DIVINE ? `100,200,255` : 
                                      (block === BlockType.ALTAR_CORRUPTED || block === BlockType.DARK_WIZARD_PEDESTAL) ? `150,20,20` :
                                      block === BlockType.BLOOD_ALTAR ? `255,0,0` : `200,150,50`;
                    ctx.fillStyle = `rgba(${runeColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.2, TILE_SIZE * 0.1); 
                } else if (block === BlockType.COPPER_ORE || block === BlockType.IRON_ORE || block === BlockType.COAL_ORE || block === BlockType.RED_METAL_ORE || block === BlockType.GREEN_METAL_ORE || block === BlockType.MITHRIL_ORE || block === BlockType.SILVER_ORE || block === BlockType.GOLD_ORE || block === BlockType.PLATINUM_ORE || block === BlockType.ADAMANTIUM_ORE || block === BlockType.ETERNIUM_ORE || block === BlockType.PLUTONIUM_ORE || block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) {
                    let oreColorStr = `100,100,100`;
                    
                    if (block === BlockType.COAL_ORE) oreColorStr = isDark ? `10,10,10` : `30,30,30`;
                    else if (block === BlockType.COPPER_ORE) oreColorStr = isDark ? `150,60,30` : `200,100,50`;
                    else if (block === BlockType.IRON_ORE) oreColorStr = isDark ? `100,100,100` : `180,180,180`;
                    else if (block === BlockType.RED_METAL_ORE || block === BlockType.RUBY) oreColorStr = isDark ? `150,20,20` : `255,50,50`;
                    else if (block === BlockType.GREEN_METAL_ORE || block === BlockType.EMERALD) oreColorStr = isDark ? `20,150,20` : `50,255,50`;
                    else if (block === BlockType.MITHRIL_ORE) oreColorStr = isDark ? `50,100,150` : `150,200,255`;
                    else if (block === BlockType.SILVER_ORE) oreColorStr = `200,210,220`;
                    else if (block === BlockType.GOLD_ORE) oreColorStr = `255,215,0`;
                    else if (block === BlockType.PLATINUM_ORE) oreColorStr = `229,228,226`;
                    else if (block === BlockType.ADAMANTIUM_ORE) oreColorStr = `0,255,100`;
                    else if (block === BlockType.ETERNIUM_ORE) oreColorStr = `200,50,255`;
                    else if (block === BlockType.PLUTONIUM_ORE) oreColorStr = `0,255,0`;
                    else if (block === BlockType.BLACK_DIAMOND) oreColorStr = `10,10,20`;
                    
                    // Stone boundary
                    ctx.strokeStyle = isDark ? `rgba(30, 30, 30, ${shade * 0.7})` : `rgba(50, 50, 50, ${shade * 0.7})`;
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
                    
                    // Ore chunks
                    ctx.fillStyle = `rgba(${oreColorStr}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, TILE_SIZE * 0.3);
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.25, TILE_SIZE * 0.15);
                } else if (block === BlockType.CHEST || block === BlockType.STORAGE_CHEST) {
                    // Chest as a 2D Sprite
                    const chestColor = block === BlockType.STORAGE_CHEST ? (isDark ? `100,80,100` : `140,120,180`) : (isDark ? `80,50,30` : `139,69,19`);
                    ctx.fillStyle = `rgba(${chestColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
                    ctx.strokeStyle = `rgba(0,0,0,${shade})`; // outlining
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
                    ctx.fillStyle = `rgba(180,180,180,${shade})`; // Lock
                    ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, TILE_SIZE * 0.15);
                } else if (block === BlockType.FURNACE) {
                    // Furnace Sprite
                    ctx.fillStyle = isDark ? `rgba(60,60,60,${shade})` : `rgba(120,120,120,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
                    ctx.fillStyle = `rgba(30,30,30,${shade})`; // opening
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    ctx.fillStyle = `rgba(255, 100, 0, ${shade})`; // fire glow inside
                    ctx.fillRect(screenX + TILE_SIZE * 0.35, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
                } else if (block === BlockType.ANVIL) {
                    // Anvil Sprite
                    ctx.fillStyle = isDark ? `rgba(40,40,40,${shade})` : `rgba(80,80,80,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.6, TILE_SIZE * 0.3);
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.15);
                } else if (block === BlockType.CARPENTERS_BENCH || block === BlockType.MASONRY_TABLE) {
                    const benchColor = block === BlockType.CARPENTERS_BENCH ? (isDark ? `80,50,30` : `160,100,50`) : (isDark ? `60,60,60` : `100,100,100`);
                    ctx.fillStyle = `rgba(${benchColor}, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                    ctx.fillStyle = isDark ? `rgba(40,30,20,${shade})` : `rgba(120,70,30,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.35, TILE_SIZE * 0.7, TILE_SIZE * 0.15);
                    // little tools on top
                    ctx.fillStyle = `rgba(200,200,200,${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.15, TILE_SIZE * 0.05);
                } else if (block === BlockType.FABRIC_STATION) {
                    ctx.fillStyle = isDark ? `rgba(80,50,30,${shade})` : `rgba(139,90,43,${shade})`; // frame
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.7);
                    ctx.fillStyle = isDark ? `rgba(150,150,150,${shade})` : `rgba(230,230,230,${shade})`; // fabric
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, TILE_SIZE * 0.5);
                } else if (block === BlockType.LEATHER_STATION) {
                    ctx.fillStyle = isDark ? `rgba(60,40,20,${shade})` : `rgba(100,60,30,${shade})`; // frame
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.7);
                    ctx.fillStyle = isDark ? `rgba(100,50,20,${shade})` : `rgba(180,90,30,${shade})`; // leather
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, TILE_SIZE * 0.5);
                    ctx.strokeStyle = `rgba(200,200,200,${shade})`; // strings
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3); ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2);
                    ctx.moveTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.3); ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8); ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.9);
                    ctx.moveTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.8); ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.9);
                    ctx.stroke();
                } else if (block === BlockType.ALCHEMY_TABLE) {
                    // Wood table base sprite
                    ctx.fillStyle = isDark ? `rgba(60,40,20,${shade})` : `rgba(139,90,43,${shade})`; // Table
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                    ctx.fillRect(screenX + TILE_SIZE * 0.05, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.9, TILE_SIZE * 0.2); // top
                    // Flasks/potions
                    ctx.fillStyle = `rgba(255, 50, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.15, TILE_SIZE * 0.15, TILE_SIZE * 0.15);
                    ctx.fillStyle = `rgba(50, 50, 255, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(50, 255, 50, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.75, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.12, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Return here so it skips the rest of the legacy render if we matched something special, OR
                // if we just added sprite detail, we let it fall through for blocks we didn't specify above.
                // Wait, if it's gravestone/torch, we probably DONT want it to fall through and draw the 3D model!
                if ([
                    BlockType.GRAVESTONE, BlockType.TORCH, BlockType.CAMPFIRE, BlockType.CROP_STAGE_3, 
                    BlockType.CHEST, BlockType.STORAGE_CHEST, BlockType.FURNACE, BlockType.ANVIL, 
                    BlockType.CARPENTERS_BENCH, BlockType.MASONRY_TABLE, BlockType.FABRIC_STATION, 
                    BlockType.LEATHER_STATION, BlockType.ALCHEMY_TABLE, BlockType.BED,
                    BlockType.DOOR_CLOSED, BlockType.DOOR_OPEN, BlockType.STONE_DOOR_CLOSED, BlockType.STONE_DOOR_OPEN,
                    BlockType.RED_BERRY_BUSH, BlockType.BLUE_BERRY_BUSH, BlockType.BLACK_BERRY_BUSH, BlockType.YELLOW_BERRY_BUSH,
                    BlockType.SHRINE, BlockType.ALTAR_DIVINE, BlockType.ALTAR_CORRUPTED, BlockType.BLOOD_ALTAR, 
                    BlockType.SAND_TERROR_ALTAR, BlockType.PHANTOM_WIZARD_ALTAR, BlockType.DARK_WIZARD_PEDESTAL, BlockType.VOID_LORD_ALTAR,
                    BlockType.GREEN_CRYSTAL, BlockType.RED_CRYSTAL, BlockType.BLACK_CRYSTAL, BlockType.BLUE_CRYSTAL, 
                    BlockType.ORANGE_CRYSTAL, BlockType.PURPLE_CRYSTAL, BlockType.YELLOW_CRYSTAL,
                    BlockType.GREEN_GLOW_CRYSTAL, BlockType.RED_GLOW_CRYSTAL, BlockType.BLUE_GLOW_CRYSTAL,
                    BlockType.ORANGE_GLOW_CRYSTAL, BlockType.PURPLE_GLOW_CRYSTAL, BlockType.YELLOW_GLOW_CRYSTAL,
                    BlockType.JADE, BlockType.DIAMOND, BlockType.GREEN_DIAMOND, BlockType.PURPLE_DIAMOND,
                    BlockType.SAPPHIRE, BlockType.AMBER, BlockType.GREEN_AMBER, BlockType.MOONSTONE,
                    BlockType.MUSHROOM_STEM, BlockType.MUSHROOM_CAP, BlockType.GLOWING_MUSHROOM_BLOCK,
                    BlockType.GIANT_MUSHROOM_STALK, BlockType.GIANT_MUSHROOM_CAP_RED, BlockType.GIANT_MUSHROOM_CAP_BROWN,
                    BlockType.GLOWCAP_MUSHROOM, BlockType.ICE,
                    BlockType.SPIKE_FLOOR, BlockType.SPIKE_FLOOR_ACTIVE, BlockType.PRESSURE_PLATE, BlockType.PRESSURE_PLATE_ACTIVE,
                    BlockType.LEVER, BlockType.LEVER_ON, BlockType.POT,
                    BlockType.SEEDLING_RED, BlockType.SEEDLING_BLUE, BlockType.SEEDLING_BLACK, BlockType.SEEDLING_YELLOW,
                    BlockType.CONVEYOR_BELT_N, BlockType.CONVEYOR_BELT_S, BlockType.CONVEYOR_BELT_E, BlockType.CONVEYOR_BELT_W,
                    BlockType.AUTO_MINER, BlockType.AUTO_DROPPER, BlockType.AUTO_CRAFTER, BlockType.VACUUM_HOPPER,
                    BlockType.BONE_PILE_SPAWNER, BlockType.ABYSSAL_SPAWNER, BlockType.HORDE_SPAWNER, BlockType.ARETH_SPAWNER,
                    BlockType.FAIRY_SPAWNER, BlockType.DARK_ELF_SPAWNER, BlockType.DWARF_SPAWNER, BlockType.GNOME_SPAWNER,
                    BlockType.ROCK_GOLEM_SPAWNER, BlockType.OBSERVER_SPAWNER, BlockType.SPHINX_SPAWNER, 
                    BlockType.QUEST_DUNGEON_SPAWNER, BlockType.QUEST_NPC_SPAWNER, BlockType.BOUNTY_HUNTER_SPAWNER, BlockType.ESCALATION_SPAWNER, 
                    BlockType.LAVA_GOLEM_SPAWNER, BlockType.GARGOYLE_SPAWNER, BlockType.PHANTOM_WIZARD_SPAWNER, BlockType.KING_SPAWNER
                ].includes(block)) {
                    return; 
                }
            }

            // Always render Arcane Gate (regardless of theme)
            if (block === BlockType.ARCANE_GATE) {
                ctx.fillStyle = ThemeManager.currentThemeId !== 'classic' ? `rgba(40,20,50,${shade})` : `rgba(80,40,100,${shade})`; // frame
                ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
                ctx.fillStyle = ThemeManager.currentThemeId !== 'classic' ? `rgba(150,50,200,${shade})` : `rgba(200,100,255,${shade})`; // swirling portal inside
                ctx.beginPath();
                ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `rgba(255,255,255,${shade * 0.5})`; // portal center
                ctx.beginPath();
                ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }

            // Add stripes for bee hive
            if (block === BlockType.BEE_HIVE) {
                    ctx.fillStyle = `rgba(100, 60, 10, ${shade})`;
                    ctx.fillRect(screenX, screenY + TILE_SIZE * 0.3, TILE_SIZE, TILE_SIZE * 0.15);
                    ctx.fillRect(screenX, screenY + TILE_SIZE * 0.7, TILE_SIZE, TILE_SIZE * 0.15);
                } else if (block === BlockType.ANT_HILL) {
                    ctx.fillStyle = `rgba(80, 40, 10, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2, TILE_SIZE * 0.4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2 - TILE_SIZE * 0.1, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.GOBLIN_CAMP || block === BlockType.GOBLIN_SHAMAN_TENT || block === BlockType.ORC_TENT || block === BlockType.TENT) {
                    if (block === BlockType.ORC_TENT) {
                        ctx.fillStyle = `rgba(30, 40, 10, ${shade})`;
                    } else if (block === BlockType.GOBLIN_SHAMAN_TENT) {
                        ctx.fillStyle = `rgba(60, 15, 60, ${shade})`;
                    } else {
                        ctx.fillStyle = `rgba(50, 20, 10, ${shade})`;
                    }
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY);
                    ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE);
                    ctx.lineTo(screenX, screenY + TILE_SIZE);
                    ctx.fill();
                    
                    if (block === BlockType.GOBLIN_SHAMAN_TENT) {
                        // Draw a glowing green skull/symbol on the tent
                        ctx.fillStyle = `rgba(50, 205, 50, ${shade})`;
                        ctx.beginPath();
                        ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.15, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
                        ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.55, TILE_SIZE * 0.05, TILE_SIZE * 0.05);
                        ctx.fillRect(screenX + TILE_SIZE * 0.55, screenY + TILE_SIZE * 0.55, TILE_SIZE * 0.05, TILE_SIZE * 0.05);
                    }
                } else if (block === BlockType.GRAVESTONE) {
                    ctx.fillStyle = `rgba(105, 105, 105, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.3, Math.PI, 0);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE);
                    ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE);
                    ctx.fill();
                } else if (block === BlockType.ANVIL) {
                    ctx.fillStyle = `rgba(80, 80, 80, ${shade})`;
                    // Base
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.6, TILE_SIZE * 0.3);
                    // Body
                    ctx.fillRect(screenX + TILE_SIZE * 0.35, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
                    // Top
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.8, TILE_SIZE * 0.2);
                    // Horn
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 1.1, screenY + TILE_SIZE * 0.3);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.4);
                    ctx.fill();
                } else if (block === BlockType.FABRIC_STATION) {
                    // Loom frame
                    ctx.fillStyle = `rgba(139, 90, 43, ${shade})`; // Wood color
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.8, TILE_SIZE * 0.1);
                    // Woven fabric in the middle
                    ctx.fillStyle = `rgba(220, 220, 220, ${shade})`; // White/gray fabric
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                    // Threads
                    ctx.fillStyle = `rgba(180, 180, 180, ${shade})`;
                    for (let i = 0; i < 5; i++) {
                        ctx.fillRect(screenX + TILE_SIZE * 0.2 + (i * TILE_SIZE * 0.12), screenY + TILE_SIZE * 0.2, 2, TILE_SIZE * 0.6);
                    }
                } else if (block === BlockType.LEATHER_STATION) {
                    // Tanning rack frame
                    ctx.fillStyle = `rgba(101, 67, 33, ${shade})`; // Dark wood
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.8, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.8, TILE_SIZE * 0.1);
                    // Stretched leather
                    ctx.fillStyle = `rgba(139, 69, 19, ${shade})`; // Leather color
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.5);
                    ctx.lineTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.5);
                    ctx.fill();
                    // Strings
                    ctx.strokeStyle = `rgba(200, 200, 200, ${shade})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2); ctx.lineTo(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.15);
                    ctx.moveTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.2); ctx.lineTo(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.15);
                    ctx.moveTo(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.8); ctx.lineTo(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.85);
                    ctx.moveTo(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8); ctx.lineTo(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.85);
                    ctx.stroke();
                } else if (block === BlockType.VILLAGE_BELL) {
                    // Golden Bell
                    ctx.fillStyle = `rgba(255, 215, 0, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.3, Math.PI, 0);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8);
                    ctx.fill();
                    
                    // Clapper
                    ctx.fillStyle = `rgba(184, 134, 11, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.08, 0, Math.PI*2);
                    ctx.fill();
                    
                    // Wooden post holding it
                    ctx.fillStyle = `rgba(101, 67, 33, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.6, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                } else if (block === BlockType.ALCHEMY_TABLE) {
                    // Wood table base
                    ctx.fillStyle = `rgba(101, 67, 33, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
                    ctx.fillStyle = `rgba(139, 90, 43, ${shade})`; // Table top
                    ctx.fillRect(screenX + TILE_SIZE * 0.05, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.9, TILE_SIZE * 0.2);
                    
                    // Cauldron/Flasks on top
                    ctx.fillStyle = `rgba(40, 40, 40, ${shade})`; // Cauldron
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bubbling liquid inside cauldron
                    ctx.fillStyle = `rgba(50, 205, 50, ${shade})`; 
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.18 + Math.sin(Date.now() / 200) * 2, TILE_SIZE * 0.15 + Math.sin(Date.now() / 150) * 1, 0, Math.PI * 2);
                    ctx.fill();

                    // Flask 1 (Red)
                    ctx.fillStyle = `rgba(255, 50, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.15, TILE_SIZE * 0.1, TILE_SIZE * 0.15);
                    ctx.fillStyle = `rgba(200, 200, 200, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.72, screenY + TILE_SIZE * 0.08, TILE_SIZE * 0.06, TILE_SIZE * 0.07);

                    // Flask 2 (Blue)
                    ctx.fillStyle = `rgba(50, 50, 255, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(200, 200, 200, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.82, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.06, TILE_SIZE * 0.05);
                } else if (block === BlockType.SPIKE_FLOOR || block === BlockType.SPIKE_FLOOR_ACTIVE) {
                    ctx.fillStyle = `rgba(120, 120, 120, ${shade})`;
                    ctx.fillRect(screenX, screenY + TILE_SIZE * 0.8, TILE_SIZE, TILE_SIZE * 0.2);
                    if (block === BlockType.SPIKE_FLOOR_ACTIVE) {
                        // Spikes
                        ctx.fillStyle = `rgba(180, 180, 180, ${shade})`;
                        for (let i = 0; i < 3; i++) {
                            ctx.beginPath();
                            ctx.moveTo(screenX + TILE_SIZE * (0.2 + i * 0.3), screenY + TILE_SIZE * 0.8);
                            ctx.lineTo(screenX + TILE_SIZE * (0.3 + i * 0.3), screenY + TILE_SIZE * 0.4);
                            ctx.lineTo(screenX + TILE_SIZE * (0.4 + i * 0.3), screenY + TILE_SIZE * 0.8);
                            ctx.fill();
                        }
                    } else {
                        // Retracted spikes (just dots)
                        ctx.fillStyle = `rgba(80, 80, 80, ${shade})`;
                        for (let i = 0; i < 3; i++) {
                            ctx.fillRect(screenX + TILE_SIZE * (0.25 + i * 0.3), screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.1, TILE_SIZE * 0.1);
                        }
                    }
                } else if (block === BlockType.PRESSURE_PLATE || block === BlockType.PRESSURE_PLATE_ACTIVE) {
                    ctx.fillStyle = `rgba(150, 150, 150, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.8, TILE_SIZE * 0.2);
                    ctx.fillStyle = block === BlockType.PRESSURE_PLATE_ACTIVE ? `rgba(100, 100, 100, ${shade})` : `rgba(120, 120, 120, ${shade})`;
                    const yOffset = block === BlockType.PRESSURE_PLATE_ACTIVE ? 0.8 : 0.7;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * yOffset, TILE_SIZE * 0.6, TILE_SIZE * 0.1);
                } else if (block === BlockType.LEVER || block === BlockType.LEVER_ON) {
                    ctx.fillStyle = `rgba(100, 100, 100, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.6, TILE_SIZE * 0.2);
                    // Stick
                    ctx.strokeStyle = `rgba(139, 69, 19, ${shade})`;
                    ctx.lineWidth = TILE_SIZE * 0.1;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8);
                    if (block === BlockType.LEVER_ON) {
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2);
                    } else {
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                    }
                    ctx.stroke();
                    // Handle
                    ctx.fillStyle = block === BlockType.LEVER_ON ? `rgba(50, 200, 50, ${shade})` : `rgba(200, 50, 50, ${shade})`;
                    ctx.beginPath();
                    if (block === BlockType.LEVER_ON) {
                        ctx.arc(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    } else {
                        ctx.arc(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    }
                    ctx.fill();
                } else if (block === BlockType.WIRE_ON || block === BlockType.WIRE_OFF) {
                    ctx.fillStyle = block === BlockType.WIRE_ON ? `rgba(255, 50, 50, ${shade})` : `rgba(100, 30, 30, ${shade})`;
                    // A simple cross pattern for wire on the ground
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
                    ctx.fillRect(screenX, screenY + TILE_SIZE * 0.85, TILE_SIZE, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.1, TILE_SIZE * 0.6);
                } else if (block === BlockType.PISTON_OPEN) {
                    // Just the base
                    ctx.fillStyle = `rgba(80, 80, 80, ${shade})`;
                    ctx.fillRect(screenX, screenY + TILE_SIZE * 0.8, TILE_SIZE, TILE_SIZE * 0.2);
                } else if (block === BlockType.PISTON_CLOSED) {
                    // Full block with metallic look
                    const c = BLOCK_COLORS[block] || { r: 120, g: 120, b: 120 };
                    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = `rgba(50, 50, 50, ${shade})`;
                    ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                } else if (block === BlockType.WORKER_GNOME) {
                    // Gnome Body
                    ctx.fillStyle = `rgba(50, 100, 200, ${shade})`; // Blue overalls
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                    // Gnome Head
                    ctx.fillStyle = `rgba(255, 200, 150, ${shade})`; // Skin tone
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    // Gnome Hat
                    ctx.fillStyle = `rgba(255, 50, 50, ${shade})`; // Red pointed hat
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY - TILE_SIZE * 0.3);
                    ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.1);
                    ctx.fill();
                } else if (block === BlockType.GARDENER_GNOME) {
                    // Gardener Body
                    ctx.fillStyle = `rgba(139, 69, 19, ${shade})`; // Brown overalls
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                    // Gnome Head
                    ctx.fillStyle = `rgba(255, 200, 150, ${shade})`; // Skin tone
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    // Straw Hat
                    ctx.fillStyle = `rgba(218, 165, 32, ${shade})`; // Goldenrod hat
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY - TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.0, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 1.0, screenY + TILE_SIZE * 0.2);
                    ctx.fill();
                } else if (block === BlockType.MINER_GNOME) {
                    // Miner Body
                    ctx.fillStyle = `rgba(105, 105, 105, ${shade})`; // Dim grey suit
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                    // Gnome Head
                    ctx.fillStyle = `rgba(255, 200, 150, ${shade})`; // Skin tone
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    // Miner Hat
                    ctx.fillStyle = `rgba(255, 215, 0, ${shade})`; // Yellow hard hat
                    ctx.fillRect(screenX + TILE_SIZE * 0.25, screenY, TILE_SIZE * 0.5, TILE_SIZE * 0.2);
                } else if (block === BlockType.GUARD_MERCENARY) {
                    // Guard Body
                    ctx.fillStyle = `rgba(192, 192, 192, ${shade})`; // Silver armor
                    ctx.fillRect(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.7, TILE_SIZE * 0.6);
                    // Guard Head
                    ctx.fillStyle = `rgba(255, 224, 189, ${shade})`; // Skin tone
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    // Helmet
                    ctx.fillStyle = `rgba(169, 169, 169, ${shade})`; // Helmet
                    ctx.fillRect(screenX + TILE_SIZE * 0.25, screenY, TILE_SIZE * 0.5, TILE_SIZE * 0.2);
                    // Sword representation
                    ctx.fillStyle = `rgba(220, 220, 220, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.1, TILE_SIZE * 0.6);
                } else if (block === BlockType.ARCHER_MERCENARY) {
                    // Elf Archer Body
                    ctx.fillStyle = `rgba(34, 139, 34, ${shade})`; // Hunter green tunic
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
                    // Elf Head
                    ctx.fillStyle = `rgba(255, 224, 189, ${shade})`; // Skin tone
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
                    // Elf Hood/Hair
                    ctx.fillStyle = `rgba(100, 200, 100, ${shade})`; // Light green hood
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY - TILE_SIZE * 0.1);
                    ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                    ctx.fill();
                    // Bow (brown line across body)
                    ctx.strokeStyle = `rgba(139, 69, 19, ${shade})`; // SaddleBrown
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.2);
                    ctx.quadraticCurveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8);
                    ctx.stroke();
                } else if (block === BlockType.CROP_STAGE_1) {
                    ctx.fillStyle = `rgba(100, 200, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.2, TILE_SIZE * 0.3);
                } else if (block === BlockType.CROP_STAGE_2) {
                    ctx.fillStyle = `rgba(50, 205, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.4, TILE_SIZE * 0.6);
                } else if (block === BlockType.CROP_STAGE_3) {
                    // Draw a full carrot
                    ctx.fillStyle = `rgba(255, 140, 0, ${shade})`; // Orange root
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE);
                    ctx.fill();
                    // Green top
                    ctx.fillStyle = `rgba(34, 139, 34, ${shade})`; // Dark green leaves
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.6);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.2);
                } else if (
                    block === BlockType.GOBLIN_TENT_ROCKHURLER ||
                    block === BlockType.GOBLIN_TENT_GARDENER ||
                    block === BlockType.GOBLIN_TENT_BOOMERANGER ||
                    block === BlockType.GOBLIN_TENT_ALCHEMIST ||
                    block === BlockType.GOBLIN_TENT_MINER ||
                    block === BlockType.ORC_TENT_BRUTE ||
                    block === BlockType.ORC_TENT_SHAMAN ||
                    block === BlockType.ORC_TENT_HUNTER ||
                    block === BlockType.KOBOLD_TENT_TRAPPER ||
                    block === BlockType.KOBOLD_TENT_WARRIOR ||
                    block === BlockType.KOBOLD_TENT_SHAMAN ||
                    block === BlockType.KOBOLD_TENT_BOMBER ||
                    block === BlockType.KOBOLD_TENT_DRAGONKEEPER ||
                    block === BlockType.DARK_ELF_TENT ||
                    block === BlockType.GREMLIN_CAMP
                ) {
                    const c = BLOCK_COLORS[block] || { r: 100, g: 100, b: 100 };
                    // Draw a tent shape
                    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${shade})`;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY);
                    ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE);
                    ctx.lineTo(screenX, screenY + TILE_SIZE);
                    ctx.closePath();
                    ctx.fill();

                    // Optional tent stripes
                    ctx.strokeStyle = `rgba(${c.r * 0.7}, ${c.g * 0.7}, ${c.b * 0.7}, ${shade})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Tent door
                    ctx.fillStyle = `rgba(30,30,30,${shade})`; // Dark entrance
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.4);
                    ctx.lineTo(screenX + TILE_SIZE * 0.65, screenY + TILE_SIZE);
                    ctx.lineTo(screenX + TILE_SIZE * 0.35, screenY + TILE_SIZE);
                    ctx.closePath();
                    ctx.fill();
                } else if (block === BlockType.ARROW_TURRET) {
                    const c = BLOCK_COLORS[block] || { r: 160, g: 100, b: 40 };
                    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(0, 0, 0, ${shade})`;
                    // little hole in the center
                    ctx.fillRect(screenX + TILE_SIZE * 0.35, screenY + TILE_SIZE * 0.35, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
                } else if (block === BlockType.AUTO_MINER) {
                    ctx.fillStyle = `rgba(100, 100, 100, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(255, 255, 0, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.25, screenY + TILE_SIZE * 0.25, TILE_SIZE * 0.5, TILE_SIZE * 0.5);
                } else if (block === BlockType.AUTO_DROPPER) {
                    ctx.fillStyle = `rgba(150, 100, 50, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(50, 50, 50, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
                } else if (block === BlockType.VACUUM_HOPPER) {
                    ctx.fillStyle = `rgba(50, 50, 50, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(100, 150, 255, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.CONVEYOR_BELT_N || block === BlockType.CONVEYOR_BELT_S || block === BlockType.CONVEYOR_BELT_E || block === BlockType.CONVEYOR_BELT_W) {
                    ctx.fillStyle = `rgba(50, 50, 50, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = `rgba(200, 200, 50, ${shade})`;
                    
                    // Draw arrows
                    ctx.beginPath();
                    if (block === BlockType.CONVEYOR_BELT_N) {
                        ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2);
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.8);
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8);
                    } else if (block === BlockType.CONVEYOR_BELT_S) {
                        ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8);
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2);
                    } else if (block === BlockType.CONVEYOR_BELT_E) {
                        ctx.moveTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.5);
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.2);
                        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.8);
                    } else if (block === BlockType.CONVEYOR_BELT_W) {
                        ctx.moveTo(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.5);
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.2);
                        ctx.lineTo(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.8);
                    }
                    ctx.fill();
                } else if (block === BlockType.IRON_BLOCK) {
                    ctx.fillStyle = `rgba(180, 180, 190, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = `rgba(220, 220, 230, ${shade})`;
                    ctx.lineWidth = 3;
                    ctx.strokeRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                    // Rivets
                    ctx.fillStyle = `rgba(100, 100, 110, ${shade})`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.1, 4, 4);
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.1, 4, 4);
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8, 4, 4);
                    ctx.fillRect(screenX + TILE_SIZE * 0.8, screenY + TILE_SIZE * 0.8, 4, 4);
                } else if (block === BlockType.BONE_PILE_SPAWNER) {
                    ctx.fillStyle = `rgba(226, 232, 240, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.7, TILE_SIZE * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(203, 213, 225, ${shade})`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.arc(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.TORCH || block === BlockType.CAMPFIRE) {
                    // Draw the flame
                    ctx.fillStyle = `rgba(255, 165, 0, ${shade})`; // Orange flame
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `rgba(255, 255, 0, ${shade})`; // Yellow inner flame
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH) {
                    let berryColor = `rgba(255, 0, 0, ${shade})`;
                    if (block === BlockType.BLUE_BERRY_BUSH) berryColor = `rgba(0, 0, 255, ${shade})`;
                    if (block === BlockType.BLACK_BERRY_BUSH) berryColor = `rgba(50, 50, 50, ${shade})`;
                    if (block === BlockType.YELLOW_BERRY_BUSH) berryColor = `rgba(255, 255, 0, ${shade})`;
                    
                    ctx.fillStyle = berryColor;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.arc(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.fill();
                } else if (block === BlockType.SEEDLING_RED || block === BlockType.SEEDLING_BLUE || block === BlockType.SEEDLING_BLACK || block === BlockType.SEEDLING_YELLOW) {
                    // Draw a small green sprout
                    ctx.fillStyle = `rgba(46, 139, 87, ${shade})`;
                    ctx.beginPath();
                    ctx.moveTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.5);
                    ctx.lineTo(screenX + TILE_SIZE * 0.6, screenY + TILE_SIZE * 0.5);
                    ctx.fill();
                }

        }
    };

    // We'll iterate all known block types and point them to the legacy renderer
    // In the future these can be overridden independently
    Object.values(BlockType).forEach((type) => {
        BlockRenderRegistry.register(type as BlockType, legacyRenderer);
    });
}
