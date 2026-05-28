import type { Item } from '../../../registries/ItemRegistry';

export const FOOD_ITEMS: Record<string, Item> = {
    'cooked_fish': {
        id: "cooked_fish",
        name: "Cooked Fish",
        description: "A nicely roasted piece of fish. Restores 30 HP and grants slight health regen.",
        category: "CONSUMABLE",
        maxStack: 20,
        healing: 30,
        buff: { healthRegen: 1, duration: 60 }
    },
    'cooked_meat': {
        id: "cooked_meat",
        name: "Cooked Meat",
        description: "A hearty steak. Restores 50 HP and buffs maximum health temporarily.",
        category: "CONSUMABLE",
        maxStack: 20,
        healing: 50,
        buff: { maxHealth: 1, duration: 120 }
    },
    'carrot_soup': {
        id: "carrot_soup",
        name: "Carrot Soup",
        description: "A warm, rejuvenating bowl of soup. Restores mana and grants mana regen.",
        category: "CONSUMABLE",
        maxStack: 10,
        manaRestore: 50,
        buff: { manaRegen: 1, duration: 180 }
    },
    'berry_pie': {
        id: "berry_pie",
        name: "Mixed Berry Pie",
        description: "A delicious baked treat. Grants swiftness and stamina regeneration.",
        category: "CONSUMABLE",
        maxStack: 10,
        staminaRestore: 100,
        buff: { speed: 1, duration: 120 }
    },
    'golden_feast': {
        id: "golden_feast",
        name: "Golden Feast",
        description: "A luxurious grand meal fit for a King. Massive buffs.",
        category: "CONSUMABLE",
        maxStack: 5,
        healing: 1000,
        manaRestore: 1000,
        buff: { maxHealth: 1, maxMana: 1, healthRegen: 1, manaRegen: 1, speed: 1, duration: 600 }
    },
    'raw_fish': {
        id: "raw_fish",
        name: "Raw Fish",
        description: "A slippery, silver fish. Heals 10 HP. Better cooked.",
        category: "CONSUMABLE",
        maxStack: 20,
        quantity: 1,
        healing: 10
    },
    'golden_fish': {
        id: "golden_fish",
        name: "Golden Fish",
        description: "A rare, shimmering fish! Sells for a lot, heals fully.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1,
        healing: 1000
    },
    'mushroom': {
        id: "mushroom",
        name: "Mushroom",
        description: "A large, slightly glowing mushroom. Restores some health when eaten, but might cause hallucinations.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 25
    },
    'meat': {
        id: "meat",
        name: "Raw Meat",
        description: "Fresh meat from a wild animal. Can be cooked or eaten raw (if you are brave).",
        category: "CONSUMABLE",
        quantity: 1,
        maxStack: 64,
        healing: 10
    },
    'red_berry': {
        id: "red_berry",
        name: "Red Berry",
        description: "A juicy red berry. Restores 10 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'blue_berry': {
        id: "blue_berry",
        name: "Blue Berry",
        description: "A plump blue berry. Restores 10 mana.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'black_berry': {
        id: "black_berry",
        name: "Black Berry",
        description: "A tart black berry. Restores 10 stamina.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'yellow_berry': {
        id: "yellow_berry",
        name: "Yellow Berry",
        description: "A sweet yellow berry. Restores 5 health, mana, and stamina.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'carrot': {
        id: "carrot",
        name: "Carrot",
        description: "A crunchy vegetable. Restores 20 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 20
    },
    'honeycomb': {
        id: "honeycomb",
        name: "Honeycomb",
        description: "Sticky and sweet. Can be eaten to restore 50 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 50
    },
};
