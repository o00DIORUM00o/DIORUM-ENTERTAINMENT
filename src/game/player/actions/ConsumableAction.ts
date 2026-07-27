import { audioEngine } from '../../AudioEngine';
import { TALENTS } from '../../Talents';
import { Player, UpdateContext } from '../../Player';
import { BlockType } from '../../constants/BlockType';
import { ITEMS } from '../../Inventory';
import { RecipeRegistry } from '../../registries/RecipeRegistry';
import { ITEM_TO_BLOCK } from '../ItemToBlock';


export class ConsumableAction {
    static execute(item: any, slotIndex: number, player: Player, ctx: UpdateContext): boolean {
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, dt, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        if (item.category === 'CONSUMABLE' && item.id !== 'fire_vial') {
                    let consumed = false;
                    
                    if (item.healing) {
                        player.health = Math.min(player.effectiveMaxHealth, player.health + item.healing);
                        if (player.onMessage) player.onMessage(`+${item.healing} HP`);
                        consumed = true;
                    }
                    if (item.manaRestore) {
                        player.mana = Math.min(player.effectiveMaxMana, player.mana + item.manaRestore);
                        if (player.onMessage) player.onMessage(`+${item.manaRestore} MP`);
                        consumed = true;
                    }
                    if (item.staminaRestore) {
                        player.stamina = Math.min(player.maxStamina, player.stamina + item.staminaRestore);
                        if (player.onMessage) player.onMessage(`+${item.staminaRestore} SP`);
                        consumed = true;
                    }
                    if (item.buff) {
                        if (item.buff.speed) player.buffs.speed = item.buff.duration;
                        if (item.buff.maxHealth) player.buffs.maxHealth = item.buff.duration;
                        if (item.buff.maxMana) player.buffs.maxMana = item.buff.duration;
                        if (item.buff.healthRegen) player.buffs.healthRegen = item.buff.duration;
                        if (item.buff.manaRegen) player.buffs.manaRegen = item.buff.duration;
                        if (player.onMessage) player.onMessage(`BUFF APPLIED!`);
                        consumed = true;
                    }
                    if (item.id === 'bag_expansion') {
                        if (player.inventoryCapacity < 160) {
                            player.inventoryCapacity = Math.min(160, player.inventoryCapacity + 10);
                            if (player.onMessage) player.onMessage('Inventory Expanded!');
                            consumed = true;
                        } else {
                            if (player.onMessage) player.onMessage('Max capacity reached!');
                        }
                    }

                    if (item.id === 'mark_rune') {
                        player.markPosition = { x: player.x, y: player.y, z: player.z };
                        if (player.onMessage) player.onMessage('Location Marked!');
                        if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'ARCANE_NOVA');
                        consumed = true;
                    }
                    if (item.id === 'return_rune') {
                        if (player.markPosition) {
                            player.x = player.markPosition.x;
                            player.y = player.markPosition.y;
                            player.z = player.markPosition.z;
                            if (player.onMessage) player.onMessage('Returned to Mark!');
                            if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'ARCANE_NOVA');
                            consumed = true;
                        } else {
                            if (player.onMessage) player.onMessage('No active mark!');
                        }
                    }

                    if (item.id === 'djinn_lamp') {
                        player.health = player.effectiveMaxHealth;
                        player.mana = player.effectiveMaxMana;
                        player.stamina = player.maxStamina;
                        if (player.onMessage) player.onMessage('The Djinn grants your wish! +FULL STATS!');
                        if (onAoE) onAoE(player.x, player.y, player.z, 2, 0, 'HEAL_NOVA');
                        consumed = true;
                    }
                    
                    // Specific overrides for old hardcoded behaviors
                    
                    if (item.summonsBoss) {
                        if (ctx.engine) {
                            const newBoss = {
                                id: `boss_${Date.now()}`,
                                type: item.summonsBoss,
                                name: item.name,
                                x: player.x,
                                y: player.y + 2,
                                z: player.z,
                                vx: 0, vy: 0, vz: 0,
                                maxHealth: 2000,
                                health: 2000,
                                damage: 40,
                                speed: 2,
                                state: 'WANDER'
                            };
                            if (!ctx.engine.metalGolems) ctx.engine.metalGolems = [];
                            ctx.engine.metalGolems.push(newBoss);
                            if (player.onMessage) player.onMessage(`Summoned ${item.name}!`);
                            consumed = true;
                        }
                    }
                    if (item.summonsNPC) {
                        if (ctx.engine) {
                            const newNPC = {
                                id: `npc_${Date.now()}`,
                                type: item.summonsNPC,
                                name: item.name,
                                x: player.x,
                                y: player.y + 2,
                                z: player.z,
                                vx: 0, vy: 0, vz: 0,
                                maxHealth: 1000,
                                health: 1000,
                                damage: 0,
                                speed: 1,
                                isMerchant: true,
                                tradeInventory: [],
                                state: 'WANDER'
                            };
                            if (!ctx.engine.npcs) ctx.engine.npcs = [];
                            ctx.engine.npcs.push(newNPC);
                            if (player.onMessage) player.onMessage(`Summoned ${item.name}!`);
                            consumed = true;
                        }
                    }
                    if (item.id === 'red_berry') {
 player.health = Math.min(player.effectiveMaxHealth, player.health + 10); consumed = true; }
                    if (item.id === 'blue_berry') { player.mana = Math.min(player.effectiveMaxMana, player.mana + 10); consumed = true; }
                    if (item.id === 'black_berry') { player.stamina = Math.min(player.maxStamina, player.stamina + 10); consumed = true; }
                    if (item.id === 'yellow_berry') { 
                        player.health = Math.min(player.effectiveMaxHealth, player.health + 5);
                        player.mana = Math.min(player.effectiveMaxMana, player.mana + 5);
                        player.stamina = Math.min(player.maxStamina, player.stamina + 5);
                        consumed = true;
                    }
                    if (item.id === 'swiftness_potion') { player.buffs.speed = 60.0; if(player.onMessage) player.onMessage('SPEED UP!'); consumed = true;}

                    if (consumed) {
                        audioEngine.playHeal(); // Play heal sound instead of hit for eating
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
}