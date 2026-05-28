import type { Item } from '../../../registries/ItemRegistry';

export const DINO_AND_NATURE_ITEMS: Record<string, Item> = {
    'dino_helmet': {
        id: "dino_helmet",
        name: "Dino Scale Helmet",
        description: "A helmet crafted from hardened dino scales.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 18,
        magicDefense: 5,
        stackable: false,
        maxStack: 1
    },
    'dino_chestplate': {
        id: "dino_chestplate",
        name: "Dino Scale Chestplate",
        description: "A sturdy chestplate crafted from hardened dino scales.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 25,
        magicDefense: 8,
        stackable: false,
        maxStack: 1
    },
    'dino_leggings': {
        id: "dino_leggings",
        name: "Dino Scale Leggings",
        description: "Tough leggings crafted from hardened dino scales.",
        category: "ARMOR",
        equipmentSlot: "LEGS",
        defense: 20,
        magicDefense: 6,
        stackable: false,
        maxStack: 1
    },
    'ptero_cloak': {
        id: "ptero_cloak",
        name: "Pterodactyl Wing Cloak",
        description: "A very light cloak that increases your jump power.",
        category: "ARMOR",
        equipmentSlot: "CLOAK",
        defense: 5,
        magicDefense: 10,
        stackable: false,
        maxStack: 1,
        jumpPowerBonus: 5
    },
    'acorn_helmet': {
        id: "acorn_helmet",
        name: "Acorn Helmet",
        description: "A funny but sturdy helmet made of a Giant Acorn shell.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 12,
        magicDefense: 8,
        stackable: false,
        maxStack: 1
    },
    'squirrel_suit': {
        id: "squirrel_suit",
        name: "Squirrel Glider Suit",
        description: "Allows for incredible jumps.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 8,
        jumpPowerBonus: 20,
        stackable: false,
        maxStack: 1
    },
    'glider_wings': {
        id: "glider_wings",
        name: "Glider Wings",
        description: "Equip to the body to drastically slow falling speed and glide horizontally while holding jump.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'fungal_shield': {
        id: "fungal_shield",
        name: "Fungal Shield",
        description: "A massive, hardened mushroom cap that acts as a great shield.",
        category: "ARMOR",
        equipmentSlot: "OFF_HAND",
        defense: 12,
        maxStack: 1,
        quantity: 1
    },
    'spore_cloak': {
        id: "spore_cloak",
        name: "Spore Cloak",
        description: "A cloak woven from bioluminescent mycelial threads.",
        category: "ARMOR",
        equipmentSlot: "CLOAK",
        defense: 6,
        maxStack: 1,
        quantity: 1
    },
};
