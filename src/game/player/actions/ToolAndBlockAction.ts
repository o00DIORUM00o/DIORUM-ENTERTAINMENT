import { Player, UpdateContext } from '../../Player';
import { ToolAction } from './ToolAction';
import { RecipeAndBlockAction } from './RecipeAndBlockAction';

export class ToolAndBlockAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        if (item.id === 'shovel_1' || item.id === 'golden_shovel' || item.id === 'pickaxe_1' || item.id === 'dwarven_pickaxe' || item.id === 'bee_hive' || item.id === 'lute' || item.id === 'ocarina') {
            return ToolAction.execute(item, slotIndex, player, ctx);
        }
        return RecipeAndBlockAction.execute(item, slotIndex, player, ctx);
    }
}