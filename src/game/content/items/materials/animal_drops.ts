import type { Item } from '../../../registries/ItemRegistry';

export const ANIMAL_DROPS_ITEMS: Record<string, Item> = {
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
    'wolf_tooth': {
        id: "wolf_tooth",
        name: "Wolf Tooth",
        description: "A sharp tooth from a wolf.",
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
    'acorn': {
        id: "acorn",
        name: "Giant Acorn",
        description: "A massive acorn found in Thaer's forests. Loved by Squirrel Folk.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'boar_tusk': {
        id: "boar_tusk",
        name: "Boar Tusk",
        description: "A thick, sharp tusk from a Giant Boar.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'moose_antler': {
        id: "moose_antler",
        name: "Moose Antler",
        description: "A huge, heavy antler from a wild Moose.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    
    // THERA UPDATE,
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
    'troll_tusk': {
        id: "troll_tusk",
        name: "Troll Tusk",
        description: "A thick, curved tusk from a cave troll.",
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
    },
    'gargoyle_horn': {
        id: "gargoyle_horn",
        name: "Gargoyle Horn",
        description: "A tough demonic horn.",
        category: "MATERIAL",
        maxStack: 64,
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
};
