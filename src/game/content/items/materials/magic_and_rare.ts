import type { Item } from '../../../registries/ItemRegistry';

export const MAGIC_AND_RARE_ITEMS: Record<string, Item> = {
    'magic_dust': {
        id: "magic_dust",
        name: "Magic Dust",
        description: "A pile of glowing magical dust.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'seer_eye': {
        id: "seer_eye",
        name: "Seer's Eye",
        description: "An unblinking eye from an Observer. Radiates void energy.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'dark_matter': {
        id: "dark_matter",
        name: "Dark Matter",
        description: "Essence of a shadow wizard.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'magitech_mech': { 
        id: "magitech_mech", 
        name: "Magitech Mech", 
        description: "Use to deploy a devastating, controllable mechanical walker.", 
        category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 1 
    },
    'abyssal_core': {
        id: "abyssal_core",
        name: "Abyssal Core",
        description: "A pulsing core of dark energy. Used for advanced crafting.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'fairy_dust': {
        id: "fairy_dust",
        name: "Fairy Dust",
        description: "Shimmering, magical dust dropped by fairies. Frequently used in enchanting.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'living_stone': {
        id: "living_stone",
        name: "Living Stone",
        description: "A chunk of animate rock, dropped by Rock Golems.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'gnomish_gear': {
        id: "gnomish_gear",
        name: "Gnomish Gear",
        description: "A highly complex gear used in subterranean engineering.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'amber': {
        id: "amber",
        name: "Amber",
        description: "Fossilized tree resin from Thera.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'green_amber': {
        id: "green_amber",
        name: "Green Amber",
        description: "Rare green fossilized tree resin from Thera.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
};
