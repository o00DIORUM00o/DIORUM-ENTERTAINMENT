import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class BombAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.id === 'bomb') {
                    if (onPlantBomb) {
                        const px = Math.floor(player.x + Math.cos(player.aimAngle));
                        const py = Math.floor(player.y + Math.sin(player.aimAngle));
                        const pz = Math.floor(player.z);
                        if (onPlantBomb(px, py, pz)) {
                            if (item.quantity && item.quantity > 1) {
                                item.quantity--;
                            } else {
                                player.quickSlots[slotIndex] = null;
                                for (let i = 0; i < player.inventory.length; i++) {
                                    if (player.inventory[i] === item) {
                                        player.inventory[i] = null;
                                        break;
                                    }
                                }
                            }
                            return true;
                        }
                    }
                    return false;
                }
        
        return false;
    }
}