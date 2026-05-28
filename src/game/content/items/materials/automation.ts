import type { Item } from '../../../registries/ItemRegistry';

export const AUTOMATION_ITEMS: Record<string, Item> = {
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
};
