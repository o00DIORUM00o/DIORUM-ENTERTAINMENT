import type { Item } from '../../registries/ItemRegistry';

export const MATERIAL_ITEMS: Record<string, Item> = {
    'dirt': {
        id: "dirt",
        name: "Dirt",
        description: "Common dirt.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'sand': {
        id: "sand",
        name: "Sand",
        description: "Loose sand.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'clay': {
        id: "clay",
        name: "Clay",
        description: "Moldable clay.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'mud': {
        id: "mud",
        name: "Mud",
        description: "Wet dirt.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'snow': {
        id: "snow",
        name: "Snow",
        description: "Cold snow.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'ice': {
        id: "ice",
        name: "Ice",
        description: "Solid ice.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'dungeon_brick_hard': {
        id: "dungeon_brick_hard",
        name: "Hard Dungeon Brick",
        description: "Very tough brick.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'gargoyle_horn': {
        id: "gargoyle_horn",
        name: "Gargoyle Horn",
        description: "A tough demonic horn.",
        category: "MATERIAL",
        maxStack: 64,
        stackable: true
    },
    'scrap_metal': {
        id: "scrap_metal",
        name: "Scrap Metal",
        description: "Rusty iron pieces.",
        category: "MATERIAL",
        maxStack: 64,
        stackable: true
    },
    'dungeon_brick_cracked': {
        id: "dungeon_brick_cracked",
        name: "Cracked Dungeon Brick",
        description: "A crumbling brick.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'magic_dust': {
        id: "magic_dust",
        name: "Magic Dust",
        description: "A pile of glowing magical dust.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'gold_ingot': {
        id: "gold_ingot",
        name: "Gold Ingot",
        description: "A heavy, shiny bar of pure gold.",
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
    'sand_worm_scale': {
        id: "sand_worm_scale",
        name: "Worm Scale",
        description: "A tough plate from a Dune Sand Worm.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'wood_floor': {
        id: "wood_floor",
        name: "Wood Floor",
        description: "A wooden floor tile.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'conveyor_belt': {
        id: "conveyor_belt",
        name: "Conveyor Belt",
        description: "Moves dropped items. Place while facing a direction to set flow.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'auto_miner': {
        id: "auto_miner",
        name: "Auto Miner",
        description: "Automatically mines the block directly below it and drops the item.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'auto_dropper': {
        id: "auto_dropper",
        name: "Auto Dropper",
        description: "Takes items from an adjacent chest and drops them in front of it.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'auto_crafter': {
        id: "auto_crafter",
        name: "Auto Crafter",
        description: "Automatically crafts items using ingredients from an adjacent chest and drops the result.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'vacuum_hopper': {
        id: "vacuum_hopper",
        name: "Vacuum Hopper",
        description: "Sucks up nearby dropped items and places them into an adjacent chest.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
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
    'goblin_tent_rockhurler': { id: "goblin_tent_rockhurler", name: "Goblin Rockhurler Tent", description: "Spawns Rockhurler Goblins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'goblin_tent_gardener': { id: "goblin_tent_gardener", name: "Goblin Gardener Tent", description: "Spawns peaceful Gardener Goblins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'goblin_tent_boomeranger': { id: "goblin_tent_boomeranger", name: "Goblin Boomeranger Tent", description: "Spawns Boomeranger Goblins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'goblin_tent_alchemist': { id: "goblin_tent_alchemist", name: "Goblin Alchemist Tent", description: "Spawns firebombing Alchemist Goblins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'goblin_tent_miner': { id: "goblin_tent_miner", name: "Goblin Miner Tent", description: "Spawns pickaxe wielding Miner Goblins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'orc_tent_brute': { id: "orc_tent_brute", name: "Orc Brute Tent", description: "Spawns mighty Orc Brutes.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'orc_tent_shaman': { id: "orc_tent_shaman", name: "Orc Shaman Tent", description: "Spawns magic-wielding Orc Shamans.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'orc_tent_hunter': { id: "orc_tent_hunter", name: "Orc Hunter Tent", description: "Spawns arrow-shooting Orc Hunters.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'kobold_tent_trapper': { id: "kobold_tent_trapper", name: "Kobold Trapper Tent", description: "Spawns trap-laying Kobolds.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'dark_elf_tent': { id: "dark_elf_tent", name: "Dark Elf Tent", description: "Spawns Dark Elf Assassins.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'giant_camp': { id: "giant_camp", name: "Giant Camp", description: "Spawns massive Giants.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'titan_nest': { id: "titan_nest", name: "Titan Nest", description: "Spawns colossal Lizard Titans.", category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 },
    'void_beacon': { 
        id: "void_beacon", 
        name: "Void Beacon", 
        description: "Place to summon a relentless Abyssal Invasion. SURVIVE.", 
        category: "MATERIAL", twoHanded: false, damage: 0, reach: 0, cooldown: 0, spread: 0, stackable: true, maxStack: 99 
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
    'saddle': {
        id: "saddle",
        name: "Saddle",
        description: "Used to tame and ride wild animals. Put in quick slot and use on an animal.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 1.5,
        cooldown: 1,
        spread: 0.2,
        stackable: true,
        maxStack: 99
    },
    'weed': {
        id: 'weed',
        name: 'Wild Weed',
        description: 'A clump of wild weeds. Can be dried and smoked.',
        category: 'MATERIAL',
        maxStack: 99,
        stackable: true
    },
    'weed_seed': {
        id: 'weed_seed',
        name: 'Weed Seed',
        description: 'A seed for a weed. Can be planted.',
        category: 'MATERIAL',
        maxStack: 99,
        stackable: true
    },
    'wool': {
        id: "wool",
        name: "Wool",
        description: "Soft wool sheared from a sheep.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'teeth': {
        id: "teeth",
        name: "Sharp Teeth",
        description: "Teeth from a wild predator.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'shell': {
        id: "shell",
        name: "Turtle Shell",
        description: "A hard shell from a giant turtle.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'unicorn_horn': {
        id: "unicorn_horn",
        name: "Unicorn Horn",
        description: "A magical horn from a rare unicorn.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'feather': {
        id: "feather",
        name: "Giant Feather",
        description: "A massive feather from a giant chicken.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'slime': {
        id: "slime",
        name: "Slime",
        description: "Sticky slime from a giant frog.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        stackable: true,
        maxStack: 99
    },
    'fabric': {
        id: "fabric",
        name: "Fabric",
        description: "A soft cloth woven from wool.",
        category: "MATERIAL",
        maxStack: 64,
        quantity: 1
    },
    'leather': {
        id: "leather",
        name: "Leather",
        description: "Tough animal hide. Useful for crafting.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'wolf_tooth': {
        id: "wolf_tooth",
        name: "Wolf Tooth",
        description: "A sharp tooth from a wolf.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fairy_dust': {
        id: "fairy_dust",
        name: "Fairy Dust",
        description: "Shimmering, magical dust dropped by fairies. Frequently used in enchanting.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'gryphon_feather': {
        id: "gryphon_feather",
        name: "Gryphon Feather",
        description: "A giant elegant feather from a gryphon.",
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
    
    // THERA UPDATE
    'tropical_wood': {
        id: "tropical_wood",
        name: "Tropical Wood",
        description: "A dark, dense wood harvested from tropical jungles.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fern_frond': {
        id: "fern_frond",
        name: "Fern Frond",
        description: "A giant leaf from a prehistoric fern.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fossil': {
        id: "fossil",
        name: "Fossil",
        description: "A piece of ancient bone preserved in rock.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'dino_scale': {
        id: "dino_scale",
        name: "Dinosaur Scale",
        description: "A very thick reptile scale.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'raptor_claw': {
        id: "raptor_claw",
        name: "Raptor Claw",
        description: "A razor-sharp sickle claw.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'tricera_horn': {
        id: "tricera_horn",
        name: "Tricera Horn",
        description: "A massive, heavy bone horn.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'ptero_wing': {
        id: "ptero_wing",
        name: "Ptero Wing",
        description: "A leathery flap from a flying reptile.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'frog_spice': {
        id: "frog_spice",
        name: "Frog Spice",
        description: "A secretive blend of swamp spices created by the Frog Folk.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fungal_spore': {
        id: "fungal_spore",
        name: "Fungal Spore",
        description: "A large, glowing spore that smells earthy.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'troll_tusk': {
        id: "troll_tusk",
        name: "Troll Tusk",
        description: "A thick, curved tusk from a cave troll.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'glowcap': {
        id: "glowcap",
        name: "Glowcap",
        description: "A radiant glowing mushroom cap.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'ogre_club_splinter': {
        id: "ogre_club_splinter",
        name: "Ogre Club Splinter",
        description: "A massive, dense wood splinter from an ogre's club.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    }
};
