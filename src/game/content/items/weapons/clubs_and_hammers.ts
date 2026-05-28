import type { Item } from '../../../registries/ItemRegistry';

export const CLUBS_AND_HAMMERS_ITEMS: Record<string, Item> = {
    'dwarven_hammer': {
        id: "dwarven_hammer",
        name: "Dwarven Warhammer",
        description: "A massive block of steel on a stick. Unbelievably heavy.",
        category: "WEAPON",
        type: "MELEE",
        twoHanded: true,
        damage: 40,
        reach: 1.6,
        cooldown: 1.2,
        spread: 1.0,
        damageType: "PHYSICAL"
    },
    'bone_club': {
        id: "bone_club",
        name: "Giant Bone Club",
        description: "A massively heavy club carved from a dinosaur femur.",
        category: "WEAPON",
        twoHanded: true,
        damage: 45,
        reach: 2.5,
        cooldown: 1.5, // Slow but devastating
        spread: 1.2
    },
    'ogre_club': {
        id: 'ogre_club',
        name: 'Ogre Splinter Club',
        description: 'A massive, crude club that deals devastating damage slowly.',
        category: 'WEAPON',
        twoHanded: true,
        damage: 55,
        reach: 2.2,
        cooldown: 1.5,
        spread: 1.0
    },
    'gargoyle_hammer': {
        id: 'gargoyle_hammer',
        name: 'Gargoyle Demolisher',
        description: 'A colossal slab of enchanted stone. Cleaves enormous arcs.',
        category: 'WEAPON',
        twoHanded: true,
        damage: 80,
        reach: 2.5,
        cooldown: 1.4,
        spread: 2.5,
        damageType: 'PHYSICAL'
    },
};
