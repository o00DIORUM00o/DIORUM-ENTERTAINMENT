import { Player } from '../Player';
import { World } from '../World';
import { Item, EquipmentSlot, ITEMS } from '../Inventory';
import { BlockType } from '../constants/BlockType';
import { RecipeRegistry } from '../registries/RecipeRegistry';

import { getZodiacStats } from '../StarSigns';

export class PlayerInventoryManager {
    static getEquipmentStats(player: Player) {
        let stats = {
            defense: 0,
            lifesteal: 0,
            bonusHealth: 0,
            bonusMana: 0,
            bonusStamina: 0,
            healthRegen: 0,
            manaRegen: 0,
            speedBonus: 0,
            bonusDamage: 0,
            jumpPowerBonus: 0
        };
        for (const slot in player.equipment) {
            const item = player.equipment[slot as EquipmentSlot];
            if (item) {
                let defBonusMultiplier = 1.0;
                let isLight = item.armorWeight === 'LIGHT' || item.id.includes('fabric') || item.id.includes('cloth') || item.id.includes('silk') || item.id.includes('glider') || item.id.includes('mask') || item.id.includes('suit');
                let isMedium = item.armorWeight === 'MEDIUM' || item.id.includes('leather') || item.id.includes('hide');
                let isHeavy = item.armorWeight === 'HEAVY' || item.id.includes('iron') || item.id.includes('abyssal') || item.id.includes('dragon') || item.id.includes('metal') || item.id.includes('mithril') || item.id.includes('adamantium') || item.id.includes('eternium') || item.id.includes('gold') || item.id.includes('silver') || item.id.includes('copper') || item.id.includes('platinum');

                const lightTalent = player.talents['light_armor'] || 0;
                const mediumTalent = player.talents['medium_armor'] || 0;
                const heavyTalent = player.talents['heavy_armor'] || 0;

                if (isLight) {
                    if (lightTalent === 1) defBonusMultiplier = 1.1;
                    if (lightTalent === 2) defBonusMultiplier = 1.25;
                    if (lightTalent === 3) defBonusMultiplier = 1.5;
                } else if (isMedium) {
                    if (mediumTalent === 1) defBonusMultiplier = 1.1;
                    if (mediumTalent === 2) defBonusMultiplier = 1.25;
                    if (mediumTalent === 3) defBonusMultiplier = 1.5;
                } else if (isHeavy || item.defense && item.defense >= 3) {
                    if (heavyTalent === 1) defBonusMultiplier = 1.1;
                    if (heavyTalent === 2) defBonusMultiplier = 1.25;
                    if (heavyTalent === 3) defBonusMultiplier = 1.5;
                }

                if (item.defense) stats.defense += Math.floor(item.defense * defBonusMultiplier);
                if (item.lifesteal) stats.lifesteal += item.lifesteal;
                if (item.bonusHealth) stats.bonusHealth += item.bonusHealth;
                if (item.bonusMana) stats.bonusMana += item.bonusMana;
                if (item.healthRegen) stats.healthRegen += item.healthRegen;
                if (item.manaRegen) stats.manaRegen += item.manaRegen;
                if (item.speedBonus) stats.speedBonus += item.speedBonus;
                if (item.bonusDamage) stats.bonusDamage += item.bonusDamage;
                if (item.jumpPowerBonus) stats.jumpPowerBonus += item.jumpPowerBonus;
            }
        }
        
        const lightArmorTalentLevel = player.talents['light_armor'] || 0;
        stats.bonusMana += lightArmorTalentLevel * 20;

        const mediumArmorTalentLevel = player.talents['medium_armor'] || 0;
        stats.bonusStamina += mediumArmorTalentLevel * 20;
        
        const heavyArmorTalentLevel = player.talents['heavy_armor'] || 0;
        stats.bonusHealth += heavyArmorTalentLevel * 20;

        const ss = player.starSign ? getZodiacStats(player.starSign) : null;
        if (ss) {
            if (ss.maxHealth) stats.bonusHealth += ss.maxHealth;
            if (ss.maxMana) stats.bonusMana += ss.maxMana;
            if (ss.maxStamina) stats.bonusStamina += ss.maxStamina;
            if (ss.defense) stats.defense += ss.defense;
            if (ss.healthRegen) stats.healthRegen += ss.healthRegen;
            if (ss.manaRegen) stats.manaRegen += ss.manaRegen;
            if (ss.speedBonus) stats.speedBonus += ss.speedBonus;
            if (ss.bonusDamage) stats.bonusDamage += ss.bonusDamage;
            if (ss.lifesteal) stats.lifesteal += ss.lifesteal;
        }

        if (player.buffs.arcaneProtection > 0) {
            stats.defense += 20;
        }

        return stats;
    }

    static addToInventory(player: Player, item: Item): boolean {
        if (item.maxStack && item.maxStack > 1) {
            for (let i = 0; i < player.inventoryCapacity; i++) {
                const existing = player.inventory[i];
                if (existing && existing.id === item.id) {
                    const currentQty = existing.quantity || 1;
                    const addQty = item.quantity || 1;
                    if (currentQty + addQty <= item.maxStack) {
                        existing.quantity = currentQty + addQty;
                        return true;
                    }
                }
            }
        }
        
        for (let i = 0; i < player.inventoryCapacity; i++) {
            if (!player.inventory[i]) {
                player.inventory[i] = { ...item };
                return true;
            }
        }
        return false;
    }

    static hasItem(player: Player, id: string, quantity: number): boolean {
        let count = 0;
        for (const item of player.inventory) {
            if (item && item.id === id) {
                count += item.quantity || 1;
            }
        }
        return count >= quantity;
    }

    static removeItem(player: Player, id: string, quantity: number): boolean {
        let actualQuantityToRemove = quantity;
        if (player.hasFavoredDeity('TERRENUS')) {
            for (let i = 0; i < quantity; i++) {
                 if (Math.random() < 0.1) {
                     actualQuantityToRemove--;
                 }
            }
        }
        if (actualQuantityToRemove <= 0) return true;
        
        if (!PlayerInventoryManager.hasItem(player, id, actualQuantityToRemove)) return false;
        
        let remainingToRemove = actualQuantityToRemove;
        for (let i = 0; i < player.inventory.length; i++) {
            const item = player.inventory[i];
            if (item && item.id === id) {
                const currentQty = item.quantity || 1;
                if (currentQty > remainingToRemove) {
                    item.quantity = currentQty - remainingToRemove;
                    return true;
                } else {
                    remainingToRemove -= currentQty;
                    player.inventory[i] = null;
                    for(let q=0; q<3; q++) {
                        if (player.quickSlots[q] === item) player.quickSlots[q] = null;
                    }
                    if (remainingToRemove === 0) return true;
                }
            }
        }
        return remainingToRemove === 0;
    }

    static isNearStation(player: Player, stationId: string, world: World): boolean {
        let stationBlockType = BlockType.AIR;
        if (stationId === 'carpenters_bench') stationBlockType = BlockType.CARPENTERS_BENCH;
        else if (stationId === 'masonry_table') stationBlockType = BlockType.MASONRY_TABLE;
        else if (stationId === 'fabric_station') stationBlockType = BlockType.FABRIC_STATION;
        else if (stationId === 'leather_station') stationBlockType = BlockType.LEATHER_STATION;
        else if (stationId === 'furnace') stationBlockType = BlockType.FURNACE;
        else if (stationId === 'anvil') stationBlockType = BlockType.ANVIL;
        else if (stationId === 'alchemy_table') stationBlockType = BlockType.ALCHEMY_TABLE;
        else if (stationId === 'cooking_pot') stationBlockType = BlockType.COOKING_POT;
        else if (stationId === 'forge') {
            const px = Math.floor(player.x);
            const py = Math.floor(player.y);
            const pz = Math.floor(player.z);
            for (let x = px - 3; x <= px + 3; x++) {
                for (let y = py - 3; y <= py + 3; y++) {
                    for (let z = pz - 1; z <= pz + 1; z++) {
                        if (world.getBlock(x, y, z) === BlockType.ANVIL) {
                            if (world.getBlock(x + 1, y, z) === BlockType.FURNACE ||
                                world.getBlock(x - 1, y, z) === BlockType.FURNACE ||
                                world.getBlock(x, y + 1, z) === BlockType.FURNACE ||
                                world.getBlock(x, y - 1, z) === BlockType.FURNACE) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        
        if (stationBlockType === BlockType.AIR) return true;

        const px = Math.floor(player.x);
        const py = Math.floor(player.y);
        const pz = Math.floor(player.z);
        for (let x = px - 3; x <= px + 3; x++) {
            for (let y = py - 3; y <= py + 3; y++) {
                for (let z = pz - 1; z <= pz + 1; z++) {
                    if (world.getBlock(x, y, z) === stationBlockType) return true;
                }
            }
        }
        return false;
    }

    static craftRecipe(player: Player, recipeId: string, world: World): boolean {
        const recipe = RecipeRegistry.get(recipeId);
        if (!recipe) return false;

        if (recipe.requiredStation && !PlayerInventoryManager.isNearStation(player, recipe.requiredStation, world)) {
            return false;
        }

        for (const ingredient of recipe.ingredients) {
            if (!PlayerInventoryManager.hasItem(player, ingredient.id, ingredient.quantity)) return false;
        }

        for (const ingredient of recipe.ingredients) {
            PlayerInventoryManager.removeItem(player, ingredient.id, ingredient.quantity);
        }

        const resultItem = { ...ITEMS[recipe.result.id] };
        if (recipe.result.quantity > 1) {
            resultItem.quantity = recipe.result.quantity;
        }
        
        PlayerInventoryManager.addToInventory(player, resultItem);
        return true;
    }

    static equipItem(player: Player, inventoryIndex: number, targetSlot: EquipmentSlot): boolean {
        const item = player.inventory[inventoryIndex];
        if (!item) return false;

        if (item.category === 'ARMOR' && item.equipmentSlot) {
            const isRing = item.equipmentSlot === 'RIGHT_RING' || item.equipmentSlot === 'LEFT_RING';
            const targetIsRing = targetSlot === 'RIGHT_RING' || targetSlot === 'LEFT_RING';
            if (isRing) {
                if (!targetIsRing) return false;
            } else if (item.equipmentSlot !== targetSlot) {
                return false;
            }
        }

        if (item.category === 'WEAPON' && targetSlot !== 'MAIN_HAND' && targetSlot !== 'OFF_HAND') {
            return false;
        }

        if (item.category === 'WEAPON') {
            if (item.twoHanded) {
                PlayerInventoryManager.unequipItem(player, 'MAIN_HAND');
                PlayerInventoryManager.unequipItem(player, 'OFF_HAND');
                targetSlot = 'MAIN_HAND'; 
            } else {
                const mainHandItem = player.equipment['MAIN_HAND'];
                if (mainHandItem?.twoHanded && (targetSlot === 'MAIN_HAND' || targetSlot === 'OFF_HAND')) {
                    PlayerInventoryManager.unequipItem(player, 'MAIN_HAND');
                }
            }
        }

        const existingItem = player.equipment[targetSlot];
        player.equipment[targetSlot] = item;
        player.inventory[inventoryIndex] = existingItem;
        
        if (targetSlot === 'MAIN_HAND' && item.id.includes('boomerang')) {
            if ((player.talents['boomerang'] || 0) === 0) {
                player.talents['boomerang'] = 1;
                if (player.onMessage) player.onMessage("Unlocked Boomerang Talent!");
            }
        }
        
        return true;
    }

    static unequipItem(player: Player, slot: EquipmentSlot): boolean {
        const item = player.equipment[slot];
        if (!item) return false;

        const emptyIndex = player.inventory.findIndex(i => i === null);
        if (emptyIndex !== -1) {
            player.inventory[emptyIndex] = item;
            player.equipment[slot] = null;
            return true;
        }
        return false;
    }
}
