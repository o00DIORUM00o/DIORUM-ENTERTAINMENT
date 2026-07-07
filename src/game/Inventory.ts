import { 
    EQUIPMENT_SLOTS, ItemRegistry, defineItems, defineSpells 
} from './registries/ItemRegistry';

import type { EquipmentSlot, ItemCategory, DamageType, TradeListing, MerchantLootTable, Item, Spell } from './registries/ItemRegistry';

export {
    EQUIPMENT_SLOTS
};

export type {
    EquipmentSlot, ItemCategory, DamageType, TradeListing, 
    MerchantLootTable, Item, Spell
};

import { ALL_SPELLS } from './content/spells/index';
import { WEAPON_ITEMS } from './content/items/weapon';
import { ARMOR_ITEMS } from './content/items/armor';
import { CONSUMABLE_ITEMS } from './content/items/consumable';
import { MISC_ITEMS } from './content/items/misc';
import { AMMO_ITEMS } from './content/items/ammo';
import { MATERIAL_ITEMS } from './content/items/material';
import { TOOL_ITEMS } from './content/items/tool';

defineSpells(ALL_SPELLS);
defineItems(WEAPON_ITEMS);
defineItems(ARMOR_ITEMS);
defineItems(CONSUMABLE_ITEMS);
defineItems(MISC_ITEMS);
defineItems(AMMO_ITEMS);
defineItems(MATERIAL_ITEMS);
defineItems(TOOL_ITEMS);

export const SPELLS = ItemRegistry.getAllSpells();
export const ITEMS = ItemRegistry.getAllItems();

export const MERCHANT_TABLES: Record<string, MerchantLootTable> = {
    'BAG_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'bag_expansion', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 40 }] }
        ],
        random: { rolls: 0, pool: [] }
    },
    'BERRY_FARMER': {
        guaranteed: [
            { itemToGive: { id: 'red_berry', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
            { itemToGive: { id: 'red_berry_seed', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'copper_piece', quantity: 2 }] }
        ],
        random: { rolls: 0, pool: [] }
    },
    'VILLAGER_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'bread', quantity: 5 , stackable: true, maxStack: 99}, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'torch', quantity: 10 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
        ],
        random: {
            rolls: 3,
            pool: [
                { listing: { itemToGive: { id: 'health_potion', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'leather', quantity: 5 }, cost: [{ id: 'silver_piece', quantity: 1 }] }, weight: 10 },
                { listing: { itemToGive: { id: 'iron_ingot', quantity: 3 }, cost: [{ id: 'silver_piece', quantity: 3 }] }, weight: 5 }
            ]
        }
    },
    'VILLAGER_FARMER': {
        guaranteed: [
            { itemToGive: { id: 'red_berry_seed', quantity: 5 , stackable: true, maxStack: 99}, cost: [{ id: 'copper_piece', quantity: 5 }] },
            { itemToGive: { id: 'blue_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'yellow_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'weed_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'pipe', quantity: 1 }, cost: [{ id: 'copper_piece', quantity: 15 }] },
            { itemToGive: { id: 'pipe_weed_green', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'pipe_weed_red', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 15 }] },
            { itemToGive: { id: 'pipe_weed_blue', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 15 }] },
            { itemToGive: { id: 'pipe_weed_purple', quantity: 5 }, cost: [{ id: 'silver_piece', quantity: 2 }] },
            { itemToGive: { id: 'weed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 2 }] },
            // Buying things from player (giving player coins)
            { itemToGive: { id: 'copper_piece', quantity: 10 }, cost: [{ id: 'wood', quantity: 20 }] },
            { itemToGive: { id: 'copper_piece', quantity: 5 }, cost: [{ id: 'red_berry', quantity: 5 }] }
        ],
        random: {
            rolls: 1,
            pool: [
                { listing: { itemToGive: { id: 'bread', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] }, weight: 10 }
            ]
        }
    },
    'VILLAGER_SMITH': {
        guaranteed: [
            { itemToGive: { id: 'sword_1', quantity: 1 , stackable: true, maxStack: 99}, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'iron_armor', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 15 }] },
            // Buys ores
            { itemToGive: { id: 'copper_piece', quantity: 20 }, cost: [{ id: 'iron_ore', quantity: 5 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_ALCHEMIST': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 1 , stackable: true, maxStack: 99}, cost: [{ id: 'silver_piece', quantity: 2 }] },
            { itemToGive: { id: 'mana_potion', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_PRIEST': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 5 , stackable: true, maxStack: 99}, cost: [{ id: 'silver_piece', quantity: 8 }] },
            { itemToGive: { id: 'book_healing_word', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 20 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_ENCHANTER': {
        guaranteed: [
            { itemToGive: { id: 'ring_health', quantity: 1 , stackable: true, maxStack: 99}, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'ring_mana', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'book_mark_return', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 2 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_SHAMAN': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 3 , stackable: true, maxStack: 99}, cost: [{ id: 'bone', quantity: 10 }] },
            { itemToGive: { id: 'book_acid_bolt', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_THIEF': {
        guaranteed: [
            { itemToGive: { id: 'dagger_1', quantity: 1 , stackable: true, maxStack: 99}, cost: [{ id: 'copper_piece', quantity: 50 }] }, // Stolen goods discount
            { itemToGive: { id: 'shortbow_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'VILLAGER_NOBLE': {
        guaranteed: [
            { itemToGive: { id: 'gold_piece', quantity: 10 , stackable: true, maxStack: 99}, cost: [{ id: 'ruby', quantity: 1 }] },
            { itemToGive: { id: 'gold_piece', quantity: 15 }, cost: [{ id: 'emerald', quantity: 1 }] },
            { itemToGive: { id: 'gold_piece', quantity: 50 }, cost: [{ id: 'black_diamond', quantity: 1 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'BEAST_TAMER_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'dire_wolf_mount', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }, { id: 'meat', quantity: 20 }] },
            { itemToGive: { id: 'giant_boar_mount', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 40 }, { id: 'meat', quantity: 15 }] },
            { itemToGive: { id: 'moose_mount', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }, { id: 'leather', quantity: 10 }] },
            { itemToGive: { id: 'companion_dragon_egg', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 200 }] },
            { itemToGive: { id: 'companion_frog_egg', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 50 }] },
            { itemToGive: { id: 'companion_fairy', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'companion_shadow_wisp', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 150 }] },
            { itemToGive: { id: 'companion_battle_pig', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 120 }] },
            { itemToGive: { id: 'meat', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'WANDERING_BARD': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 2, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'mana_potion', quantity: 2, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'torch', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
            { itemToGive: { id: 'lute', quantity: 1, stackable: true, maxStack: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'ocarina', quantity: 1, stackable: true, maxStack: 1 }, cost: [{ id: 'gold_piece', quantity: 2 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'SQUIRREL_FOLK_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'acorn', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'companion_frog_egg', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'acorn', quantity: 50 }] },
            { itemToGive: { id: 'companion_baby_treant', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'acorn', quantity: 100 }] },
            { itemToGive: { id: 'health_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'acorn', quantity: 20 }] },
        ],
        random: { pool: [], rolls: 0 }
    },
    'DRACONIC_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 2 }] }, // Dragons love gold
            { itemToGive: { id: 'mana_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 2 }] },
            { itemToGive: { id: 'book_fire_bolt', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }] },
            { itemToGive: { id: 'arcane_rune_key', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'dragon_egg_mount', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5000 }] },
            { itemToGive: { id: 'companion_dragon_egg', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 500 }] },
            { itemToGive: { id: 'companion_arcane_crystal', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 600 }] },
            { itemToGive: { id: 'obsidian_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 800 }] },
            { itemToGive: { id: 'dragon_scale_armor', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 1200 }] },
            { itemToGive: { id: 'elven_longbow', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 600 }] },
            { itemToGive: { id: 'dragon_bone_bow', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 1500 }] },
            { itemToGive: { id: 'iron_arrow', quantity: 50, stackable: true, maxStack: 999 }, cost: [{ id: 'gold_piece', quantity: 10 }] },
            // Buying things from player
            { itemToGive: { id: 'gold_piece', quantity: 1 }, cost: [{ id: 'iron_ingot', quantity: 10 }] }, // Eating iron?
            { itemToGive: { id: 'gold_piece', quantity: 5 }, cost: [{ id: 'ruby', quantity: 1 }] } // Eating gems
        ],
        random: { pool: [], rolls: 0 }
    },
    'SLUG_FOLK_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'arcane_rune_key', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }] },
            { itemToGive: { id: 'slime_ball', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'health_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 10 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_BOOKS': {
        guaranteed: [
            { itemToGive: { id: 'book_healing_word', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 10 }] },
            { itemToGive: { id: 'book_fire_bolt', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 15 }] },
            { itemToGive: { id: 'book_ice_spike', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 15 }] },
            { itemToGive: { id: 'book_magic_missile', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 20 }] },
            { itemToGive: { id: 'book_acid_bolt', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 25 }] },
            { itemToGive: { id: 'book_mark_return', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 5 }] },

            { itemToGive: { id: 'book_volcanic_eruption', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }] },
            { itemToGive: { id: 'book_blizzard', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }] },
            { itemToGive: { id: 'book_venom_cloud', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 50 }] },
            { itemToGive: { id: 'book_divine_smite', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 60 }] },
            { itemToGive: { id: 'book_shadow_flare', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 45 }] },
            { itemToGive: { id: 'book_rune_of_fire', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }] },
            { itemToGive: { id: 'book_rune_of_ice', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }] },
            { itemToGive: { id: 'book_rune_of_lightning', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }] },
            { itemToGive: { id: 'book_rune_of_acid', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }] },
            { itemToGive: { id: 'book_rune_of_life', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 75 }] },
            { itemToGive: { id: 'book_rune_of_gravity', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'book_rune_of_destruction', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'book_rune_of_arcane', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'book_rune_of_holy', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'book_rune_of_void', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 100 }] },

        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_STAVES': {
        guaranteed: [
            { itemToGive: { id: 'staff_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 50 }] },
            { itemToGive: { id: 'staff_fire_ranged', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'staff_ice_ranged', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'staff_healing_word', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 10 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_SWORDS': {
        guaranteed: [
            { itemToGive: { id: 'sword_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 20 }] },
            { itemToGive: { id: 'greatsword_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 40 }] },
            { itemToGive: { id: 'iron_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'obsidian_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 50 }] },

            { itemToGive: { id: 'infernal_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'frostmourne_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'stormcaller_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] },
            { itemToGive: { id: 'void_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] },
            { itemToGive: { id: 'excalibur_sword', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] },

        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_POTIONS': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 20 }] },
            { itemToGive: { id: 'mana_potion', quantity: 5, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 20 }] },
            { itemToGive: { id: 'large_health_potion', quantity: 2, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 2 }] },
            { itemToGive: { id: 'large_mana_potion', quantity: 2, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 2 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_INGOTS': {
        guaranteed: [
            { itemToGive: { id: 'copper_ingot', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
            { itemToGive: { id: 'iron_ingot', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 25 }] },
            { itemToGive: { id: 'gold_piece', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_ingot', quantity: 1 }] },
            { itemToGive: { id: 'mithril_ingot', quantity: 2, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 5 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_SEEDS': {
        guaranteed: [
            { itemToGive: { id: 'carrot_seed', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'pumpkin_seed', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
            { itemToGive: { id: 'corn_seed', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 8 }] },
            { itemToGive: { id: 'weed_seed', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 2 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_FABRIC': {
        guaranteed: [
            { itemToGive: { id: 'fabric', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
            { itemToGive: { id: 'fabric_tunic', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 25 }] },
            { itemToGive: { id: 'fabric_shoes', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 15 }] },
            { itemToGive: { id: 'glider_wings', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 10 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_RUNE_KEYS': {
        guaranteed: [
            { itemToGive: { id: 'arcane_rune_key', quantity: 1, stackable: true, maxStack: 99 }, cost: [{ id: 'gold_piece', quantity: 20 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_BLOCKS': {
        guaranteed: [
            { itemToGive: { id: 'stone_block', quantity: 50, stackable: true, maxStack: 999 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
            { itemToGive: { id: 'wood', quantity: 50, stackable: true, maxStack: 999 }, cost: [{ id: 'silver_piece', quantity: 10 }] },
            { itemToGive: { id: 'marble_block', quantity: 20, stackable: true, maxStack: 999 }, cost: [{ id: 'silver_piece', quantity: 25 }] },
            { itemToGive: { id: 'obsidian_block', quantity: 10, stackable: true, maxStack: 999 }, cost: [{ id: 'gold_piece', quantity: 2 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'STALL_LEATHER': {
        guaranteed: [
            { itemToGive: { id: 'leather', quantity: 10, stackable: true, maxStack: 99 }, cost: [{ id: 'silver_piece', quantity: 15 }] },
            { itemToGive: { id: 'leather_tunic', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 40 }] },
            { itemToGive: { id: 'leather_boots', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 25 }] },
            { itemToGive: { id: 'saddle', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] }
        ],
        random: { pool: [], rolls: 0 }
    },
    'WIZARD': {
        guaranteed: [
            { itemToGive: { id: 'crystal_shard', quantity: 5 , stackable: true, maxStack: 99}, cost: [{ id: 'gold_piece', quantity: 2 }] },
            { itemToGive: { id: 'mana_potion', quantity: 3 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'health_potion', quantity: 3 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'book_meteor_shower', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 1500 }] }
        ],
        random: {
            rolls: 4,
            pool: [
                
                { listing: { itemToGive: { id: 'book_blink', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_levitate', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_speed', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_heal', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 120 }] }, weight: 8 },
                { listing: { itemToGive: { id: 'book_major_heal', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 250 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'book_summon_wolf', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 200 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_summon_bear', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 300 }] }, weight: 2 },
                { listing: { itemToGive: { id: 'book_magic_block', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_invisibility', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 400 }] }, weight: 2 },
                { listing: { itemToGive: { id: 'book_fear', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_arcane_light', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 50 }] }, weight: 10 },
                { listing: { itemToGive: { id: 'book_exploding_rune', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 200 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'book_summon_wyrmling', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 500 }] }, weight: 1 },
                { listing: { itemToGive: { id: 'book_summon_skeleton', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_summon_zombie', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 200 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'book_summon_bone_pile', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 350 }] }, weight: 2 },
                { listing: { itemToGive: { id: 'book_animate_stone', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 200 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_fire_bolt', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 50 }] }, weight: 10 },
                { listing: { itemToGive: { id: 'book_ice_shard', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 50 }] }, weight: 10 },
                { listing: { itemToGive: { id: 'book_healing_light', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 75 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'book_lightning_strike', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 100 }] }, weight: 2 },
                { listing: { itemToGive: { id: 'book_rune_of_fire', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 120 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_rune_of_ice', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 120 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_rune_of_lightning', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 120 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_rune_of_acid', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 120 }] }, weight: 4 },
                { listing: { itemToGive: { id: 'book_rune_of_arcane', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'book_rune_of_holy', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'book_rune_of_void', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 150 }] }, weight: 3 },
                { listing: { itemToGive: { id: 'magic_dust', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 10 }] }, weight: 20 },
                { listing: { itemToGive: { id: 'crystal_shard', quantity: 1 }, cost: [{ id: 'copper_piece', quantity: 50 }] }, weight: 20 }
            ]
        }
    }
};


