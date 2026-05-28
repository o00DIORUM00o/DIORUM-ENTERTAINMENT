import type { Item } from '../../../registries/ItemRegistry';

export const CONTRACTS_AND_VEHICLES_ITEMS: Record<string, Item> = {
    'miner_contract': {
        id: "miner_contract",
        name: "Miner Contract",
        description: "Hire a Miner. Place the miner and they will gather ore of any type within 12 squares of them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'gardener_contract': {
        id: "gardener_contract",
        name: "Gardener Contract",
        description: "Hire a Gardener. Place the gardener and they will farm the 12 squares around them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'guard_contract': {
        id: "guard_contract",
        name: "Guard Contract",
        description: "Hire a Guard. Place the guard to attack enemies fiercely within 12 squares of them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'worker_contract': {
        id: "worker_contract",
        name: "Worker Contract",
        description: "Hire a Gnome Worker. Place next to a Chest and a Furnace to automate smelting.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'archer_contract': {
        id: "archer_contract",
        name: "Archer Contract",
        description: "Hire an Elven Archer. Place as a guard to fire arrows at nearby enemies automatically.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'gnome_buggy': {
        id: "gnome_buggy",
        name: "Gnome Buggy",
        description: "A fast ground vehicle engineered by gnomes. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'boat': {
        id: "boat",
        name: "Wooden Boat",
        description: "A small vessel for traversing rivers and oceans. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'skyship': {
        id: "skyship",
        name: "Gnomish Skyship",
        description: "A triumph of engineering! A flying ship that defies gravity. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
};
