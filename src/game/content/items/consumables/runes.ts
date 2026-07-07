import type { Item } from '../../../registries/ItemRegistry';

export const RUNES_ITEMS: Record<string, Item> = {
    'mark_rune': {
        id: "mark_rune",
        name: "Mark Rune",
        description: "Creates a magical mark at your current location.",
        category: "CONSUMABLE",
        maxStack: 20,
    },
    'return_rune': {
        id: "return_rune",
        name: "Return Rune",
        description: "Returns you to your last magical mark.",
        category: "CONSUMABLE",
        maxStack: 20,
    },
    'arcane_rune_key': {
        id: "arcane_rune_key",
        name: "Arcane Rune Key",
        description: "A universal key that can unlock any Arcane Gate.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        maxStack: 99
    },
};
