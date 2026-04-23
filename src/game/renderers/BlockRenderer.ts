import { BlockRenderRegistry, BlockRenderContext } from '../registries/BlockRenderRegistry';
import { BlockType } from '../constants/BlockType';
;
import { BLOCK_COLORS } from '../Constants';

export function defineBlockRenderers() {
    // A single fallback switch based block renderer for all the legacy blocks
    // Ideally these would be split by specific blocks but for now this acts as a macro-renderer
    const legacyRenderer = {
        draw: (context: BlockRenderContext) => {
            const { ctx, screenX, screenY, TILE_SIZE, block, shade } = context;
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
                } else if (block === BlockType.HEAVY_STONE) {
                    ctx.fillStyle = `rgba(60, 60, 60, ${shade})`;
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = `rgba(40, 40, 40, ${shade})`;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    // Cross pattern
                    ctx.beginPath();
                    ctx.moveTo(screenX, screenY);
                    ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE);
                    ctx.moveTo(screenX + TILE_SIZE, screenY);
                    ctx.lineTo(screenX, screenY + TILE_SIZE);
                    ctx.stroke();
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
