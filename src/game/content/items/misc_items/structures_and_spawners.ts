import type { Item } from '../../../registries/ItemRegistry';

export const STRUCTURES_AND_SPAWNERS_ITEMS: Record<string, Item> = {
    'ant_hill': {
        id: "ant_hill",
        name: "Ant Hill",
        description: "Spawn point for ants.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'slime_puddle': {
        id: "slime_puddle",
        name: "Slime Puddle",
        description: "Spawns Slimes.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'spider_web': {
        id: "spider_web",
        name: "Spider Web",
        description: "Spawns Cave Spiders.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'demon_portal': {
        id: "demon_portal",
        name: "Demon Portal",
        description: "Spawns Fire Imps.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'fairy_spawner': {
        id: "fairy_spawner",
        name: "Fairy Pool",
        description: "A magical pool that spawns fairies.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'wandering_bard_tent': {
        id: "wandering_bard_tent",
        name: "Wandering Bard Tent",
        description: "Can be placed in the world to summon a Wandering Bard.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'bee_hive': {
        id: "bee_hive",
        name: "Bee Hive",
        description: "A buzzing bee hive. Can be placed in the world to spawn bees.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    
    'frost_caster_tent': {
        id: 'frost_caster_tent',
        name: 'Frost Caster Tent',
        description: 'A tent that spawns hostile Frost Casters.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'loyal_frost_caster_tent': {
        id: 'loyal_frost_caster_tent',
        name: 'Loyal Frost Caster Tent',
        description: 'A tent that spawns friendly Frost Casters who fight for you.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'tent': {
        id: "tent",
        name: "Tent",
        description: "A cozy tent. Can be placed to rest.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'archer_tent': {
        id: 'archer_tent',
        name: 'Archer Tent',
        description: 'A tent that spawns archers.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'dark_knight_tent': {
        id: 'dark_knight_tent',
        name: 'Dark Knight Spawner',
        description: 'A spawner that summons Dark Knights.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'dark_wizard_pedestal': {
        id: "dark_wizard_pedestal",
        name: "Shadow Pedestal",
        description: "A dark altar that summons an exiled wizard. Be prepared to reflect his magic!",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'halfling_house_spawner': {
        id: "halfling_house_spawner",
        name: "Halfling House",
        description: "A cozy hole in the ground where halflings rest.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'pit_bull_tent': {
        id: "pit_bull_tent",
        name: "Pit Bull Tent",
        description: "A sturdy, well-constructed tent.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'pomeranian_wagon': {
        id: "pomeranian_wagon",
        name: "Pomeranian Wagon",
        description: "A brightly colored, mobile wagon.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'terrier_tent': {
        id: "terrier_tent",
        name: "Terrier Tent",
        description: "A scrappy, haphazardly assembled tent.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'wolf_folk_camp': {
        id: "wolf_folk_camp",
        name: "Wolf Folk Camp",
        description: "A minimalist camp for the nomadic wolf folk.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'squirrel_folk_treehouse': {
        id: "squirrel_folk_treehouse",
        name: "Squirrel Folk Treehouse",
        description: "A small, sturdy treehouse for the nimble squirrel folk.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'beast_camp': {
        id: "beast_camp",
        name: "Beast Camp",
        description: "A primal den where wild beasts gather.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'beast_tamer_camp': {
        id: "beast_tamer_camp",
        name: "Beast Tamer Camp",
        description: "A rugged camp set up by a master beast tamer.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'thera_gateway': {
        id: "thera_gateway",
        name: "Thera Gateway",
        description: "A portal to the prehistoric world of Thera. Place in the world and touch it to travel.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'void_lord_altar': {
        id: "void_lord_altar",
        name: "Void Lord Altar",
        description: "A dark block radiating void energy. Activating it might be a bad idea.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
};
