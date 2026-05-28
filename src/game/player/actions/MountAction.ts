import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class MountAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.id === 'boat' || item.id === 'skyship' || item.id === 'magitech_mech' || item.id === 'gnome_buggy' || item.summonsMount) {
                    const mountId = 'vehicle_' + Date.now();
                    
                    let mountType = item.summonsMount || 'BOAT';
                    let mountName = item.name;
                    let mountSpeed = 12.0;
                    let mountJump = 0.0;
                    
                    if (item.id === 'skyship') {
                        mountType = 'SKYSHIP'; mountName = 'Gnomish Skyship'; mountSpeed = 18.0; mountJump = 15.0;
                    } else if (item.id === 'magitech_mech') {
                        mountType = 'MAGITECH_MECH'; mountName = 'Magitech Mech'; mountSpeed = 15.0; mountJump = 25.0;
                    } else if (item.id === 'gnome_buggy') {
                        mountType = 'GNOME_BUGGY'; mountName = 'Gnome Buggy'; mountSpeed = 22.0; mountJump = 8.0;
                    
                    } else if (item.summonsMount && item.summonsMount.endsWith('_DRAGON_HORSE')) {
                        mountSpeed = 22.0; mountJump = 25.0; mountName = item.summonsMount.replace('_DRAGON_HORSE', ' Dragon Horse').split(' ').map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(' ');
                    } else if (item.summonsMount && item.summonsMount.endsWith('_DRAGON')) {
                        mountSpeed = 16.0; mountJump = 20.0; mountName = item.summonsMount.replace('_DRAGON', ' Dragon').split(' ').map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(' ');
} else if (item.summonsMount === 'FIRE_DRAGON') {
                        mountSpeed = 16.0; mountJump = 20.0; mountName = 'Fire Dragon';
                    } else if (item.summonsMount === 'DIRE_WOLF') {
                        mountSpeed = 18.0; mountJump = 12.0; mountName = 'Dire Wolf';
                    } else if (item.summonsMount === 'GIANT_BOAR') {
                        mountSpeed = 14.0; mountJump = 8.0; mountName = 'Giant Boar';
                    } else if (item.summonsMount === 'MOOSE') {
                        mountSpeed = 15.0; mountJump = 10.0; mountName = 'Moose';
                    } else if (item.summonsMount === 'T_REX') {
                        mountSpeed = 16.0; mountJump = 8.0; mountName = 'T-Rex';
                    } else if (item.summonsMount === 'PTERODACTYL') {
                        mountSpeed = 20.0; mountJump = 30.0; mountName = 'Pterodactyl';
                    } else if (item.summonsMount === 'WILD_RAPTOR') {
                        mountSpeed = 24.0; mountJump = 20.0; mountName = 'Raptor';
                    }
                    
                    const mount = {
                        id: mountId,
                        type: mountType,
                        name: mountName,
                        speed: mountSpeed,
                        jumpPower: mountJump,
                        maxStamina: 100
                    };
                    if (!player.mounts) player.mounts = [];
                    player.mounts.push(mount);
                    
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
                    if (player.onMessage) player.onMessage(`Added ${mount.name} to Mounts menu!`);
                    return true;
                }
        
        return false;
    }
}