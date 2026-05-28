import type { Item } from '../../../registries/ItemRegistry';

export const RARE_AND_MAGIC_ITEMS: Record<string, Item> = {
    'sphinx_crown': {
        id: "sphinx_crown",
        name: "Crown of the Sphinx",
        description: "Imbued with ancient power. Grants vast life-draining capabilities.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        maxStack: 1,
        quantity: 1,
        defense: 15, lifesteal: 0.15
    },
    'abyssal_armor': {
        id: "abyssal_armor",
        name: "Abyssal Plate Armor",
        description: "Heavy armor made of abyssal brick and shadow.",
        category: "ARMOR",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        defense: 25
    },
    'dragon_scale_armor': {
        id: "dragon_scale_armor",
        name: "Dragon Scale Armor",
        description: "Nearly impenetrable set of scales stripped from the Fire Dragon Boss.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 45,
        maxStack: 1,
        quantity: 1
    },
    'gas_mask': {
        id: "gas_mask",
        name: "Gas Mask",
        description: "Filters out toxic fumes and miasma found on swamp worlds.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 3,
        maxStack: 1,
        quantity: 1
    },
    'wooden_shield': {
        id: "wooden_shield",
        name: "Wooden Shield",
        description: "A basic shield made of wood.",
        category: "ARMOR",
        equipmentSlot: "OFF_HAND",
        defense: 3,
        maxStack: 1,
        quantity: 1
    },
    'antigravity_artifact': {
        id: "antigravity_artifact",
        name: "Antigravity Artifact",
        description: "A glowing core of immense energy. Hold SPACE to ascend endlessly and defy gravity.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 20,
        maxStack: 1,
        quantity: 1
    },
    'star_metal_armor': {
        id: "star_metal_armor",
        name: "Star Metal Armor",
        description: "Intricately forged armor that feels as hard as a comet.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 38,
        maxStack: 1,
        quantity: 1
    },
    'yeti_fur_coat': {
        id: "yeti_fur_coat",
        name: "Yeti Fur Coat",
        description: "A thick, warm coat made from Yeti fur. Keeps you cozy in the freezing cold.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 18,
        maxStack: 1,
        quantity: 1
    }
};
