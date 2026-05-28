import { ItemActionHandler } from './actions/ItemActionHandler';
import { audioEngine } from '../AudioEngine';
import { TALENTS } from '../Talents';
import { Player, UpdateContext } from '../Player';
import { World } from '../World';
import { BlockType } from '../constants/BlockType';
import { Item, EquipmentSlot, ITEMS } from '../Inventory';
import { RecipeRegistry } from '../registries/RecipeRegistry';

import { ITEM_TO_BLOCK } from './ItemToBlock';

export class PlayerInventory {
    static updateQuickSlots(player: Player, ctx: UpdateContext) {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;
// Quick Slots Logic Placeholder
        if (player.quickCooldown > 0) player.quickCooldown -= dt;
        
        if (player.quickCooldown <= 0) {
            const handleQuickSlot = (slotIndex: number) => {
                const item = player.quickSlots[slotIndex];
                if (!item) return false;
                return ItemActionHandler.execute(item, slotIndex, player, ctx);
            };
            if (quick1 && handleQuickSlot(0)) {
                player.quickCooldown = 0.5;
            } else if (quick2 && handleQuickSlot(1)) {
                player.quickCooldown = 0.5;
            } else if (quick3 && handleQuickSlot(2)) {
                player.quickCooldown = 0.5;
            }
        }

        
    }
}
