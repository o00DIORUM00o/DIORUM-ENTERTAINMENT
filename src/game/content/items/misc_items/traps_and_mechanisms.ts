import type { Item } from '../../../registries/ItemRegistry';

export const TRAPS_AND_MECHANISMS_ITEMS: Record<string, Item> = {
    'arcane_turret': {
        id: "arcane_turret",
        name: "Arcane Turret",
        description: "An automated defense turret that fires arcane projectiles at hostile entities.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
        quantity: 1
    },
    'spike_floor': {
        id: "spike_floor",
        name: "Spike Floor",
        description: "A floor trap with retractable spikes. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'pressure_plate': {
        id: "pressure_plate",
        name: "Pressure Plate",
        description: "A mechanism that triggers when stepped on. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'piston': {
        id: "piston",
        name: "Piston Wall",
        description: "A mechanical wall that extends when unpowered, and retracts when powered.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'lever': {
        id: "lever",
        name: "Lever",
        description: "A switch to toggle mechanisms. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'wire': {
        id: "wire",
        name: "Gnomish Wire",
        description: "Transmits mechanical power from levers and plates to other mechanisms.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'arrow_turret': {
        id: "arrow_turret",
        name: "Arrow Turret",
        description: "A mechanical turret that fires arrows when powered by a wire.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
};
