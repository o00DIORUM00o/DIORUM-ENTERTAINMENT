import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class ToolAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.id === 'shovel_1' || item.id === 'golden_shovel' || item.id === 'pickaxe_1' || item.id === 'dwarven_pickaxe') {
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (slotIndex === 0) {
                        // Dig channel down
                        if (world.getBlock(targetX, targetY, pZ - 1) !== BlockType.AIR) {
                            world.setBlock(targetX, targetY, pZ - 1, BlockType.AIR);
                                        audioEngine.playBreakBlock();
                            return true;
                        }
                    } else if (slotIndex === 1) {
                        // Dig dirt path
                        if (world.getBlock(targetX, targetY, pZ - 1) === BlockType.GRASS || world.getBlock(targetX, targetY, pZ - 1) === BlockType.DIRT) {
                            world.setBlock(targetX, targetY, pZ - 1, BlockType.DIRT_PATH);
                            return true;
                        }
                    }
                } else if (item.id === 'bee_hive') {
                    // Place bee hive
                    const pZ = Math.floor(player.z);
                    const targetX = Math.floor(player.x + Math.cos(player.aimAngle));
                    const targetY = Math.floor(player.y + Math.sin(player.aimAngle));
                    
                    if (world.getBlock(targetX, targetY, pZ) === BlockType.AIR) {
                        world.setBlock(targetX, targetY, pZ, BlockType.BEE_HIVE);
                        
                        // Consume item
                        if (item.quantity && item.quantity > 1) {
                            item.quantity--;
                        } else {
                            player.quickSlots[slotIndex] = null;
                            // Also remove from inventory if it's the same reference
                            for (let i = 0; i < player.inventory.length; i++) {
                                if (player.inventory[i] === item) {
                                    player.inventory[i] = null;
                                    break;
                                }
                            }
                        }
                        return true;
                    }
                } else if (item.id === 'lute' || item.id === 'ocarina') {
                    if (player.onMessage) player.onMessage(`Played a tune on the ${item.name}!`);
                    
                    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
                    if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const freqs = item.id === 'lute' ? [392.00, 440.00, 493.88, 587.33] : [523.25, 587.33, 659.25, 698.46];
                        freqs.forEach((f, i) => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.type = item.id === 'lute' ? 'sine' : 'triangle';
                            osc.frequency.value = f;
                            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
                            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.2 + 0.05);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.4);
                            osc.start(ctx.currentTime + i * 0.2);
                            osc.stop(ctx.currentTime + i * 0.2 + 0.4);
                        });
                    }
                    
                    const pz = Math.floor(player.z);
                    for (let i = 0; i < 5; i++) {
                        if (onAoE) {
                            // We don't have direct access to engine.particles here, but we can emit floating text via another system or just use onMessage.
                            // The song plays via AudioContext anyway!
                        }
                    }
                    return true;
                }
        
        return false;
    }
}