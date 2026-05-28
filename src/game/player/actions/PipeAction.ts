import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class PipeAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.id === 'pipe') {
                    // Try to consume weed
                    let consumedWeed = false;
                    let weedItem: any = null;
                    const weedTypes = ['pipe_weed_green', 'pipe_weed_blue', 'pipe_weed_red', 'pipe_weed_purple'];
                    
                    for (const wType of weedTypes) {
                        if (player.hasItem(wType, 1)) {
                            player.removeItem(wType, 1);
                            weedItem = ITEMS[wType];
                            consumedWeed = true;
                            break;
                        }
                    }

                    if (consumedWeed && weedItem) {
                        if (weedItem.healing) player.health = Math.min(player.effectiveMaxHealth, player.health + weedItem.healing);
                        if (weedItem.manaRestore) player.mana = Math.min(player.effectiveMaxMana, player.mana + weedItem.manaRestore);
                        if (weedItem.staminaRestore) player.stamina = Math.min(player.maxStamina, player.stamina + weedItem.staminaRestore);
                        
                        if (weedItem.buff) {
                            if (weedItem.buff.speed) player.buffs.speed = weedItem.buff.duration;
                            if (weedItem.buff.maxHealth) player.buffs.maxHealth = weedItem.buff.duration;
                            if (weedItem.buff.maxMana) player.buffs.maxMana = weedItem.buff.duration;
                            if (weedItem.buff.healthRegen) player.buffs.healthRegen = weedItem.buff.duration;
                            if (weedItem.buff.manaRegen) player.buffs.manaRegen = weedItem.buff.duration;
                            if (weedItem.buff.staminaRegen) player.buffs.staminaRegen = weedItem.buff.duration;
                        }
                        
                        if (player.onMessage) player.onMessage(`Smoked ${weedItem.name}!`);
                        audioEngine.playHit(); // Play sound
                        
                        // Emit smoke particles
                        if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'SMOKE_FX');
                    } else {
                        if (player.onMessage) player.onMessage(`Need Pipe Weed!`);
                    }
                    return true;
                }
        
        return false;
    }
}