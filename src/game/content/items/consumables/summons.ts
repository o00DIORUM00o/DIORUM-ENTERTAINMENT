import type { Item } from '../../../registries/ItemRegistry';

export const SUMMONS_ITEMS: Record<string, Item> = {
    'dragon_egg_mount': {
        id: "dragon_egg_mount",
        name: "Dragon Egg",
        description: "A radiating large egg. Hatching it summons a loyalty-bound Fire Dragon mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'FIRE_DRAGON'
    },
    't_rex_egg': {
        id: "t_rex_egg",
        name: "T-Rex Egg",
        description: "A colossal, speckled egg. Hatching it summons a loyal T-Rex mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'T_REX'
    },
    'pterodactyl_egg': {
        id: "pterodactyl_egg",
        name: "Pterodactyl Egg",
        description: "A smooth, blue egg. Hatching it summons a swift Pterodactyl mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'PTERODACTYL'
    },
    'raptor_egg': {
        id: "raptor_egg",
        name: "Raptor Egg",
        description: "A small, jagged egg. Hatching it summons a fast Wild Raptor mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'WILD_RAPTOR'
    },
    'dire_wolf_mount': {
        id: "dire_wolf_mount",
        name: "Dire Wolf Pup",
        description: "A fierce pup that will grow into a rideable Dire Wolf mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'DIRE_WOLF'
    },
    'companion_dragon_egg': {
        id: "companion_dragon_egg",
        name: "Tiny Dragon Egg",
        description: "Hatch this to acquire a tiny Fire Dragon as a companion!",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'TINY_FIRE_DRAGON'
    },
    'companion_frog_egg': {
        id: "companion_frog_egg",
        name: "Giant Frog Egg",
        description: "Hatch this to acquire a Giant Frog companion! It loves to jump around.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'GIANT_FROG'
    },
    'companion_fairy': {
        id: "companion_fairy",
        name: "Bottle of Fairy",
        description: "Open to release a Fairy companion! She heals you in combat.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'FAIRY'
    },
    'companion_shadow_wisp': {
        id: "companion_shadow_wisp",
        name: "Shadow Wisp Core",
        description: "Summon a Shadow Wisp companion to fire dark bolts at enemies.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'SHADOW_WISP'
    },
    'companion_battle_pig': {
        id: "companion_battle_pig",
        name: "Battle Pig Whistle",
        description: "Blow to summon a loyal Battle Pig. High health and melee damage.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'BATTLE_PIG'
    },
    'companion_arcane_crystal': {
        id: "companion_arcane_crystal",
        name: "Dormant Arcane Crystal",
        description: "Activate to summon a floating crystal that shoots lasers and regenerates your mana.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'ARCANE_CRYSTAL'
    },
    'companion_baby_treant': {
        id: "companion_baby_treant",
        name: "Treant Seedling",
        description: "Plant this to summon a Baby Treant. Drops berries passively.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsCompanion: 'BABY_TREANT'
    },
    'giant_boar_mount': {
        id: "giant_boar_mount",
        name: "Giant Boar Piglet",
        description: "A tough little piglet that will grow into a Giant Boar mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'GIANT_BOAR'
    },
    'moose_mount': {
        id: "moose_mount",
        name: "Moose Calf",
        description: "A majestic calf that will grow into a towering Moose mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'MOOSE'
    },

    'red_dragon_egg': {
        id: 'red_dragon_egg', name: 'Red Dragon Egg', description: 'Summons a Red Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'RED_DRAGON'
    },
    'green_dragon_egg': {
        id: 'green_dragon_egg', name: 'Green Dragon Egg', description: 'Summons a Green Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'GREEN_DRAGON'
    },
    'black_dragon_egg': {
        id: 'black_dragon_egg', name: 'Black Dragon Egg', description: 'Summons a Black Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BLACK_DRAGON'
    },
    'blue_dragon_egg': {
        id: 'blue_dragon_egg', name: 'Blue Dragon Egg', description: 'Summons a Blue Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BLUE_DRAGON'
    },
    'purple_dragon_egg': {
        id: 'purple_dragon_egg', name: 'Purple Dragon Egg', description: 'Summons a Purple Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'PURPLE_DRAGON'
    },
    'brown_dragon_egg': {
        id: 'brown_dragon_egg', name: 'Brown Dragon Egg', description: 'Summons a Brown Dragon mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BROWN_DRAGON'
    },
    'red_dragon_horse_egg': {
        id: 'red_dragon_horse_egg', name: 'Red Dragon Horse Egg', description: 'Summons a Red Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'RED_DRAGON_HORSE'
    },
    'green_dragon_horse_egg': {
        id: 'green_dragon_horse_egg', name: 'Green Dragon Horse Egg', description: 'Summons a Green Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'GREEN_DRAGON_HORSE'
    },
    'black_dragon_horse_egg': {
        id: 'black_dragon_horse_egg', name: 'Black Dragon Horse Egg', description: 'Summons a Black Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BLACK_DRAGON_HORSE'
    },
    'blue_dragon_horse_egg': {
        id: 'blue_dragon_horse_egg', name: 'Blue Dragon Horse Egg', description: 'Summons a Blue Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BLUE_DRAGON_HORSE'
    },
    'purple_dragon_horse_egg': {
        id: 'purple_dragon_horse_egg', name: 'Purple Dragon Horse Egg', description: 'Summons a Purple Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'PURPLE_DRAGON_HORSE'
    },
    'brown_dragon_horse_egg': {
        id: 'brown_dragon_horse_egg', name: 'Brown Dragon Horse Egg', description: 'Summons a Brown Dragon Horse mount.', category: 'CONSUMABLE', maxStack: 1, quantity: 1, summonsMount: 'BROWN_DRAGON_HORSE'
    },
};
