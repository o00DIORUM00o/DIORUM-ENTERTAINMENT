import type { Item } from '../../registries/ItemRegistry';

export const TOOL_ITEMS: Record<string, Item> = {
    'grappling_hook': {
        id: "grappling_hook",
        name: "Grappling Hook",
        description: "Fires a hook that pulls you to solid blocks.",
        category: "WEAPON",
        type: "MAGIC_RANGED",
        twoHanded: false,
        damage: 5,
        reach: 25,
        cooldown: 1.0,
        projectileSpeed: 30,
        damageType: "GRAPPLE",
        stackable: false,
        maxStack: 1
    },
    'fishing_pole': {
        id: "fishing_pole",
        name: "Fishing Pole",
        description: "Cast into water blocks to fish! (Equip and 'attack' water).",
        category: "WEAPON", // Make it a weapon so it has reach and can be aimed
        twoHanded: true,
        damage: 1, // Doesn't do real damage, used for fishing
        reach: 5,
        cooldown: 2.0, // Slow swing
        stackable: false,
        maxStack: 1
    },
    'key_small': {
        id: "key_small",
        name: "Small Key",
        description: "Opens a locked door in this dungeon.",
        category: "TOOL",
        twoHanded: false,
        stackable: true
    },
    'key_boss': {
        id: "key_boss",
        name: "Boss Key",
        description: "A powerful key radiating dark energy. Opens the boss door.",
        category: "TOOL",
        twoHanded: false,
        stackable: true,
        maxStack: 99
    },
};
