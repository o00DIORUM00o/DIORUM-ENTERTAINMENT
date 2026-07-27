import type { Item } from '../../../registries/ItemRegistry';

export const COLOR_METAL_WEAPONS: Record<string, Item> = {
    // Green Metal
    'green_metal_dagger': {
        id: "green_metal_dagger",
        name: "Green Metal Dagger",
        description: "A fast, toxic dagger. Hold attack to charge a Poison Wave.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 8, reach: 0.9, cooldown: 0.2, spread: 0.3,
        secondaryAbility: "SPIN_POISON_WAVE", chargeTime: 1.0, chargeManaCost: 15
    },
    'green_metal_staff': {
        id: "green_metal_staff",
        name: "Green Metal Staff",
        description: "Fires acid bolts. Hold attack for a wider Acid Burst.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 15, reach: 12, cooldown: 0.5, projectileSpeed: 12, projectileColor: "#22c55e",
        spellId: "acid_bolt", damageType: "ACID", manaCost: 5, secondaryAbility: "BOOMERANG_SPREAD_SHOT", chargeTime: 1.2, chargeManaCost: 20, maxStack: 1
    },

    // Red Metal
    'red_metal_dagger': {
        id: "red_metal_dagger",
        name: "Red Metal Dagger",
        description: "A blistering hot dagger. Hold attack to unleash Dragon Breath.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 12, reach: 1.0, cooldown: 0.3, spread: 0.4,
        secondaryAbility: "SPIN_DRAGON_BREATH", chargeTime: 1.2, chargeManaCost: 20
    },
    'red_metal_staff': {
        id: "red_metal_staff",
        name: "Red Metal Staff",
        description: "Fires firebolts. Hold attack to call a Meteor.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 20, reach: 15, cooldown: 0.8, projectileSpeed: 14, projectileColor: "#ff4500",
        spellId: "fire_bolt", damageType: "FIRE", manaCost: 8, secondaryAbility: "METEOR", chargeTime: 1.5, chargeManaCost: 30, maxStack: 1
    },

    // Blue Metal
    'blue_metal_boomerang': {
        id: "blue_metal_boomerang",
        name: "Blue Metal Boomerang",
        description: "An icy boomerang. Hold attack to charge a Seeker Shot.",
        category: "WEAPON", type: "RANGED", twoHanded: false, damage: 16, cooldown: 0.9, projectileSpeed: 15,
        secondaryAbility: "BOOMERANG_SEEKER_SHOT", chargeTime: 1.0, chargeManaCost: 15
    },
    'blue_metal_dagger': {
        id: "blue_metal_dagger",
        name: "Blue Metal Dagger",
        description: "A freezing dagger. Hold attack to Blink to enemies.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 10, reach: 0.9, cooldown: 0.25, spread: 0.3,
        secondaryAbility: "BLINK", chargeTime: 0.8, chargeManaCost: 15
    },
    'blue_metal_staff': {
        id: "blue_metal_staff",
        name: "Blue Metal Staff",
        description: "Fires ice shards. Hold attack to cast Frost Nova.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 18, reach: 14, cooldown: 0.7, projectileSpeed: 16, projectileColor: "#add8e6",
        spellId: "ice_bolt", damageType: "ICE", manaCost: 7, secondaryAbility: "FROST_NOVA", chargeTime: 1.2, chargeManaCost: 25, maxStack: 1
    },

    // Yellow Metal
    'yellow_metal_boomerang': {
        id: "yellow_metal_boomerang",
        name: "Yellow Metal Boomerang",
        description: "An electric boomerang. Hold attack to charge a Spread Shot.",
        category: "WEAPON", type: "RANGED", twoHanded: false, damage: 18, cooldown: 0.7, projectileSpeed: 18,
        secondaryAbility: "BOOMERANG_SPREAD_SHOT", chargeTime: 1.0, chargeManaCost: 15
    },
    'yellow_metal_dagger': {
        id: "yellow_metal_dagger",
        name: "Yellow Metal Dagger",
        description: "A lightning-fast dagger. Hold attack to unleash Thunder Strike.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 11, reach: 0.9, cooldown: 0.15, spread: 0.3,
        secondaryAbility: "SPIN_THUNDER_STRIKE", chargeTime: 1.0, chargeManaCost: 20
    },
    'yellow_metal_staff': {
        id: "yellow_metal_staff",
        name: "Yellow Metal Staff",
        description: "Fires lightning bolts. Hold attack to cast Lightning Strike.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 22, reach: 18, cooldown: 0.6, projectileSpeed: 20, projectileColor: "#ffff00",
        spellId: "magic_missile", damageType: "LIGHTNING", manaCost: 9, secondaryAbility: "LIGHTNING_STRIKE", chargeTime: 1.2, chargeManaCost: 30, maxStack: 1
    },

    // Orange Metal
    'orange_metal_boomerang': {
        id: "orange_metal_boomerang",
        name: "Orange Metal Boomerang",
        description: "A heavy magma boomerang. Hold attack to charge a Seeker Shot.",
        category: "WEAPON", type: "RANGED", twoHanded: false, damage: 22, cooldown: 1.2, projectileSpeed: 12,
        secondaryAbility: "BOOMERANG_SEEKER_SHOT", chargeTime: 1.2, chargeManaCost: 15
    },
    'orange_metal_dagger': {
        id: "orange_metal_dagger",
        name: "Orange Metal Dagger",
        description: "A sturdy magma dagger. Hold attack for Earthshatter.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 14, reach: 0.9, cooldown: 0.35, spread: 0.4,
        secondaryAbility: "SPIN_EARTHQUAKE", chargeTime: 1.2, chargeManaCost: 20
    },
    'orange_metal_staff': {
        id: "orange_metal_staff",
        name: "Orange Metal Staff",
        description: "Fires magma bolts. Hold attack to create a Lava Puddle.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 25, reach: 12, cooldown: 0.9, projectileSpeed: 12, projectileColor: "#ff8c00",
        spellId: "fire_bolt", damageType: "FIRE", manaCost: 10, secondaryAbility: "LAVA_PUDDLE", chargeTime: 1.5, chargeManaCost: 30, maxStack: 1
    },

    // Purple Metal
    'purple_metal_boomerang': {
        id: "purple_metal_boomerang",
        name: "Purple Metal Boomerang",
        description: "An arcane boomerang. Hold attack to charge a Spread Shot.",
        category: "WEAPON", type: "RANGED", twoHanded: false, damage: 17, cooldown: 0.8, projectileSpeed: 16,
        secondaryAbility: "BOOMERANG_SPREAD_SHOT", chargeTime: 1.0, chargeManaCost: 15
    },
    'purple_metal_dagger': {
        id: "purple_metal_dagger",
        name: "Purple Metal Dagger",
        description: "An arcane dagger. Hold attack to use Teleport Strike.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 11, reach: 0.9, cooldown: 0.2, spread: 0.3,
        secondaryAbility: "SPIN_TELEPORT_STRIKE", chargeTime: 1.0, chargeManaCost: 20
    },
    'purple_metal_staff': {
        id: "purple_metal_staff",
        name: "Purple Metal Staff",
        description: "Fires arcane bolts. Hold attack to cast Push Back.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 19, reach: 16, cooldown: 0.6, projectileSpeed: 18, projectileColor: "#8a2be2",
        spellId: "magic_missile", damageType: "MAGIC", manaCost: 8, secondaryAbility: "PUSH_BACK", chargeTime: 1.0, chargeManaCost: 25, maxStack: 1
    },

    // Black Metal
    'black_metal_boomerang': {
        id: "black_metal_boomerang",
        name: "Black Metal Boomerang",
        description: "A dark void boomerang. Hold attack to charge a Seeker Shot.",
        category: "WEAPON", type: "RANGED", twoHanded: false, damage: 20, cooldown: 0.8, projectileSpeed: 17,
        secondaryAbility: "BOOMERANG_SEEKER_SHOT", chargeTime: 1.0, chargeManaCost: 20
    },
    'black_metal_dagger': {
        id: "black_metal_dagger",
        name: "Black Metal Dagger",
        description: "A dark dagger. Hold attack to unleash Spectral Blades.",
        category: "WEAPON", type: "MELEE", twoHanded: false, damage: 13, reach: 0.9, cooldown: 0.2, spread: 0.3,
        secondaryAbility: "SPIN_SPECTRAL_BLADES", chargeTime: 1.0, chargeManaCost: 25
    },
    'black_metal_staff': {
        id: "black_metal_staff",
        name: "Black Metal Staff",
        description: "Fires void bolts. Hold attack to create a Black Hole.",
        type: "MAGIC_RANGED", category: "WEAPON", damage: 23, reach: 15, cooldown: 0.7, projectileSpeed: 15, projectileColor: "#4b0082",
        spellId: "magic_missile", damageType: "MAGIC", manaCost: 10, secondaryAbility: "BLACK_HOLE", chargeTime: 1.5, chargeManaCost: 35, maxStack: 1
    }
};
