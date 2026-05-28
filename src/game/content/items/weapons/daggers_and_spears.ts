import type { Item } from '../../../registries/ItemRegistry';

export const DAGGERS_AND_SPEARS_ITEMS: Record<string, Item> = {
    'dagger_1': {
        id: "dagger_1",
        name: "Iron Dagger",
        description: "A short, quick blade. Good for close encounters.",
        category: "WEAPON",
        twoHanded: false,
        damage: 5,
        reach: 0.8,
        cooldown: 0.3,
        spread: 0.4
    },
    'kobold_dagger': {
        id: "kobold_dagger",
        name: "Kobold Dagger",
        description: "A small, jagged blade used by kobold workers.",
        category: "WEAPON",
        damage: 6,
        reach: 0.8,
        cooldown: 0.2,
        spread: 0.4
    },
    'kobold_spear': {
        id: "kobold_spear",
        name: "Kobold Spear",
        description: "A crude but effective spear used by kobold warriors.",
        category: "WEAPON",
        twoHanded: true,
        damage: 15,
        reach: 2.2,
        cooldown: 0.7,
        spread: 0.4
    },
    'tusk_spear': {
        id: "tusk_spear",
        name: "Boar Tusk Spear",
        description: "A long spear tipped with a sharpened Giant Boar tusk.",
        category: "WEAPON",
        twoHanded: true,
        damage: 45,
        reach: 4.0,
        cooldown: 1.1,
        spread: 0.3,
        stackable: false,
        maxStack: 1
    },
};
