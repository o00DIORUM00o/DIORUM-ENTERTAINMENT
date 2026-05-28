import { Player, UpdateContext } from '../../Player';
import { CompanionAction } from './CompanionAction';
import { MountAction } from './MountAction';
import { SaddleBagAction } from './SaddleBagAction';
import { SaddleAction } from './SaddleAction';
import { BombAction } from './BombAction';
import { ConsumableAction } from './ConsumableAction';
import { PipeAction } from './PipeAction';
import { FireVialAction } from './FireVialAction';
import { ToolAndBlockAction } from './ToolAndBlockAction';

export class ItemActionHandler {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        if (item.summonsCompanion) return CompanionAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'boat' || item.id === 'skyship' || item.id === 'magitech_mech' || item.id === 'gnome_buggy' || item.summonsMount) return MountAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'saddle_bag') return SaddleBagAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'saddle') return SaddleAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'bomb') return BombAction.execute(item, slotIndex, player, ctx);
        if (item.category === 'CONSUMABLE' && item.id !== 'fire_vial') return ConsumableAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'pipe') return PipeAction.execute(item, slotIndex, player, ctx);
        if (item.id === 'fire_vial') return FireVialAction.execute(item, slotIndex, player, ctx);
        
        return ToolAndBlockAction.execute(item, slotIndex, player, ctx);
    }
}