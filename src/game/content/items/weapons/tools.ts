import type { Item } from '../../../registries/ItemRegistry';

export const TOOLS_ITEMS: Record<string, Item> = {
    'chisel': {
        id: "chisel",
        name: "Runecrafter's Chisel",
        description: "A small, sturdy chisel. Can be used to carve runes into stone and marble blocks.",
        category: "WEAPON",
        twoHanded: false,
        damage: 4,
        reach: 1.5,
        cooldown: 0.5,
        spread: 0.2
    },
    'shovel_1': {
        id: "shovel_1",
        name: "Iron Shovel",
        description: "A sturdy shovel. Can be used as a weapon or assigned to quick slots to dig.",
        category: "WEAPON",
        twoHanded: true,
        damage: 8,
        reach: 1.5,
        cooldown: 0.8,
        spread: 0.5
    },
    'pickaxe_1': {
        id: "pickaxe_1",
        name: "Iron Pickaxe",
        description: "A sturdy pickaxe. Can be used as a weapon or assigned to quick slots to mine downwards.",
        category: "WEAPON",
        twoHanded: true,
        damage: 12,
        reach: 1.5,
        cooldown: 0.9,
        spread: 0.5
    },
    'axe_1': {
        id: "axe_1",
        name: "Iron Axe",
        description: "A sharp axe. Can be used as a weapon or assigned to quick slots to chop down trees.",
        category: "WEAPON",
        twoHanded: true,
        damage: 15,
        reach: 1.5,
        cooldown: 1,
        spread: 0.5
    },
    'hoe_1': {
        id: "hoe_1",
        name: "Wooden Hoe",
        description: "A simple wooden hoe. Assign to quick slots to till dirt into soil.",
        category: "WEAPON",
        twoHanded: true,
        damage: 5,
        reach: 1.5,
        cooldown: 0.8,
        spread: 0.5
    },
    'dwarven_pickaxe': {
        id: "dwarven_pickaxe",
        name: "Dwarven Pickaxe",
        description: "An incredibly sturdy tool. Cuts through stone like butter, and skull like thinner stone.",
        category: "WEAPON",
        type: "MELEE",
        twoHanded: true, // Typically high-tier pickaxes in this game are two-handed
        damage: 25,
        reach: 1.5,
        cooldown: 0.6,
        damageType: "DIG" // Essential for 5x block braking modifier
    },
    'watering_can': {
        id: "watering_can",
        name: "Watering Can",
        description: "Waters dry tilled soil so crops grow.",
        damage: 1,
        reach: 1.5,
        cooldown: 0.5,
        spread: 0.2,
        category: "WEAPON",
        twoHanded: false,
        stackable: false,
        damageType: 'PHYSICAL'
    },
    'golden_shovel': {
        id: "golden_shovel",
        name: "Golden Shovel",
        description: "A very shiny shovel. Useful for gathering rare items, like honeycombs from Bee Hives.",
        damage: 15,
        reach: 1.5,
        cooldown: 0.6,
        spread: 0.2,
        category: "WEAPON",
        twoHanded: false,
        stackable: false,
        damageType: 'PHYSICAL'
    },
    
    // THERA WEAPONS,
    'raptor_sickle': {
        id: "raptor_sickle",
        name: "Raptor Sickle",
        description: "A fast, slashing weapon crafted from raptor claws. Causes bleeding.",
        category: "WEAPON",
        twoHanded: false,
        damage: 22,
        reach: 1.0,
        cooldown: 0.3, // Extremely fast
        spread: 0.5,
        statusEffect: { type: 'bleed', chance: 0.3, duration: 4.0 }
    },
    'fossil_pickaxe': {
        id: "fossil_pickaxe",
        name: "Fossil Pickaxe",
        description: "A pickaxe made of fossilized bone and amber. Extracts fossils easily.",
        category: "WEAPON",
        twoHanded: true,
        damage: 25,
        reach: 1.5,
        cooldown: 0.6,
        spread: 0.5
    },
    'star_metal_pickaxe': {
        id: "star_metal_pickaxe",
        name: "Star Metal Pickaxe",
        description: "A super-hard pickaxe perfect for digging through deep ice and stone.",
        category: "WEAPON",
        twoHanded: true,
        damage: 35,
        reach: 1.5,
        cooldown: 0.4,
        spread: 0.5
    },
    'star_metal_axe': {
        id: "star_metal_axe",
        name: "Star Metal Axe",
        description: "A sharp, frozen axe that easily cuts through frozen wood.",
        category: "WEAPON",
        twoHanded: true,
        damage: 40,
        reach: 1.5,
        cooldown: 0.5,
        spread: 0.5
    }
};
