import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class CompanionAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.summonsCompanion) {
                    let companionNameBase = ['Spark', 'Cinder', 'Ember', 'Smaug', 'Ignis'][Math.floor(Math.random()*5)];
                    let companionTitle = 'Tiny Dragon';
                    let health = 500;
                    let speed = 18.0;

                    if (item.summonsCompanion === 'GIANT_FROG') {
                        companionTitle = 'Giant Frog';
                        companionNameBase = ['Kermit', 'Hops', 'Slippy', 'Croak', 'Wart'][Math.floor(Math.random()*5)];
                        health = 300;
                        speed = 14.0;
                    } else if (item.summonsCompanion === 'FAIRY') {
                        companionTitle = 'Fairy';
                        companionNameBase = ['Navi', 'Pixie', 'Tink', 'Fae', 'Lumina'][Math.floor(Math.random()*5)];
                        health = 200;
                        speed = 22.0;
                    } else if (item.summonsCompanion === 'SHADOW_WISP') {
                        companionTitle = 'Shadow Wisp';
                        companionNameBase = ['Nox', 'Umbra', 'Shade', 'Grim', 'Murk'][Math.floor(Math.random()*5)];
                        health = 400;
                        speed = 20.0;
                    } else if (item.summonsCompanion === 'BATTLE_PIG') {
                        companionTitle = 'Battle Pig';
                        companionNameBase = ['Bacon', 'Pumba', 'Snout', 'Truffle', 'Oink'][Math.floor(Math.random()*5)];
                        health = 800; // Tanky
                        speed = 12.0;
                    } else if (item.summonsCompanion === 'ARCANE_CRYSTAL') {
                        companionTitle = 'Arcane Crystal';
                        companionNameBase = ['Prism', 'Shard', 'Resonance', 'Focus', 'Core'][Math.floor(Math.random()*5)];
                        health = 200;
                        speed = 16.0;
                    } else if (item.summonsCompanion === 'BABY_TREANT') {
                        companionTitle = 'Baby Treant';
                        companionNameBase = ['Twig', 'Bark', 'Leaf', 'Root', 'Splinter'][Math.floor(Math.random()*5)];
                        health = 400;
                        speed = 10.0;
                    }

                    const newCompanion = { 
                        id: `comp_${Date.now()}`,
                        type: item.summonsCompanion, 
                        name: `${companionTitle} ${companionNameBase}`,
                        damage: 35,
                        health: health,
                        maxHealth: health,
                        speed: speed
                    };
                    if (!player.companions) player.companions = [];
                    player.companions.push(newCompanion);
                    
                    // Consume the item
                    item.quantity--;
                    if (item.quantity <= 0) {
                        player.quickSlots[slotIndex] = null;
                    }
                    player.quickCooldown = 15;
                    return true;
                }
        
        return false;
    }
}