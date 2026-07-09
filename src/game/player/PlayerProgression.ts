import { Player } from '../Player';
import { ITEMS } from '../Inventory';
import { TALENTS } from '../Talents';
import { audioEngine } from '../AudioEngine';

export class PlayerProgression {
    static learnSpell(player: Player, inventoryIndex: number): boolean {
        const item = player.inventory[inventoryIndex];
        if (item) {
            const baseItem = ITEMS[item.id];
            const spellId = item.spellId || baseItem?.spellId;
            const spellIds = item.spellIds || baseItem?.spellIds;

            const spellsToLearn: string[] = [];
            if (spellId && !player.knownSpells.includes(spellId)) {
                spellsToLearn.push(spellId);
            }
            if (spellIds) {
                for (const sid of spellIds) {
                    if (!player.knownSpells.includes(sid)) {
                        spellsToLearn.push(sid);
                    }
                }
            }

            if (spellsToLearn.length > 0) {
                const readingLevel = player.talents['reading'] || 0;
                if (readingLevel < 1) {
                    if (player.onMessage) player.onMessage("Need Reading talent to read this!");
                    return false;
                }
                for (const sid of spellsToLearn) {
                    player.knownSpells.push(sid);
                }
                if (player.onMessage) player.onMessage("Learned new spells!");
                if (item.quantity && item.quantity > 1) {
                    item.quantity--;
                } else {
                    player.inventory[inventoryIndex] = null;
                }
                return true;
            } else {
                if (player.onMessage) player.onMessage("Already know these spells!");
                return false;
            }
        }
        return false;
    }

    static getXpMultiplier(player: Player): number {
        return player.hasFavoredDeity('ERUDI') ? 1.5 : 1.0;
    }

    static addXp(player: Player, amount: number) {
        player.xp += amount * PlayerProgression.getXpMultiplier(player);
        
        if (player.hasFavoredDeity('OBITU') && Math.random() < 0.1 && player.health < player.effectiveMaxHealth) {
            player.health = Math.min(player.effectiveMaxHealth, player.health + 5);
        }

        while (player.xp >= player.xpToNextLevel) {
            player.xp -= player.xpToNextLevel;
            player.level++;
            audioEngine.playLevelUp();
            player.skillPoints++;
            player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5);
            player.maxHealth += 10;
            player.health = player.effectiveMaxHealth;
            player.maxStamina += 10;
            player.stamina = player.effectiveMaxStamina;
            player.maxMana += 10;
            player.mana = player.effectiveMaxMana;
        }
    }

    static upgradeTalent(player: Player, talentId: string): boolean {
        const talentDef = TALENTS[talentId];
        if (!talentDef) return false;
        
        const currentLevel = player.talents[talentId] || 0;
        if (player.skillPoints > 0 && currentLevel < talentDef.maxLevel) {
            player.skillPoints--;
            player.talents[talentId] = currentLevel + 1;
            
            if (talentId === 'vitality') {
                player.maxHealth += 20;
                player.health += 20;
            } else if (talentId === 'endurance') {
                player.maxStamina += 20;
                player.stamina += 20;
            } else if (talentId === 'focus') {
                player.maxMana += 20;
                player.mana += 20;
            }
            
            return true;
        }
        return false;
    }
}
