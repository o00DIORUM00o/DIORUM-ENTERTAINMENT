export interface TalentDef {
    id: string;
    name: string;
    maxLevel: number;
    descriptions: string[];
}

export const TALENTS: Record<string, TalentDef> = {
    'trading': {
        id: 'trading',
        name: 'Trading',
        maxLevel: 1,
        descriptions: [
            'Master merchant. Reduces the cost of all trades by 30%.'
        ]
    },
    'heavy_armor': {
        id: 'heavy_armor',
        name: 'Heavy Armor',
        maxLevel: 3,
        descriptions: [
            'Increases Heavy Armor defensive values and max Health by a small amount.',
            'Increases Heavy Armor defensive values and max Health by a moderate amount.',
            'Increases Heavy Armor defensive values and max Health by a large amount.'
        ]
    },
    'medium_armor': {
        id: 'medium_armor',
        name: 'Medium Armor',
        maxLevel: 3,
        descriptions: [
            'Increases Medium Armor defensive values and max Stamina by a small amount.',
            'Increases Medium Armor defensive values and max Stamina by a moderate amount.',
            'Increases Medium Armor defensive values and max Stamina by a large amount.'
        ]
    },
    'light_armor': {
        id: 'light_armor',
        name: 'Light Armor',
        maxLevel: 3,
        descriptions: [
            'Increases Light Armor defensive values and max Magic by a small amount.',
            'Increases Light Armor defensive values and max Magic by a moderate amount.',
            'Increases Light Armor defensive values and max Magic by a large amount.'
        ]
    },
    'cooking': {
        id: 'cooking',
        name: 'Cooking',
        maxLevel: 1,
        descriptions: [
            'Learn to construct a Cooking Pot and craft restorative meals. Unlocks grand feasts with powerful buffs.'
        ]
    },
    'fishing': {
        id: 'fishing',
        name: 'Fishing',
        maxLevel: 1,
        descriptions: [
            'Allows you to use a Fishing Pole. Increases the chance of catching rare fish, reduces junk, and decreases hooking time.'
        ]
    },
    'carpentry': {
        id: 'carpentry',
        name: 'Carpentry',
        maxLevel: 1,
        descriptions: [
            'Unlock the Carpenter\'s Workbench, furniture, and all wooden structures and tools.'
        ]
    },
    'reading': {
        id: 'reading',
        name: 'Reading',
        maxLevel: 1,
        descriptions: [
            'Learn to read any magical scrolls, signs, and spell books.'
        ]
    },
    'jump': {
        id: 'jump',
        name: 'Jump',
        maxLevel: 1,
        descriptions: [
            'Unlock the ability to jump over obstacles.'
        ]
    },
    'sneak': {
        id: 'sneak',
        name: 'Sneak',
        maxLevel: 1,
        descriptions: [
            'Unlock the ability to sneak by pressing the right stick. Reduces detection radius and stamina drain.'
        ]
    },
    'dash': {
        id: 'dash',
        name: 'Dash',
        maxLevel: 2,
        descriptions: [
            'Unlock a short dash to quickly evade attacks.',
            'Upgrade to a long dash for maximum mobility.'
        ]
    },
    'boomerang': {
        id: 'boomerang',
        name: 'Boomerang',
        maxLevel: 3,
        descriptions: [
            'Unlock the ability to grab items with the boomerang.',
            'Unlock the ability to stun enemies with the boomerang.',
            'BOOMERANG MASTERY'
        ]
    },
    'masonry': {
        id: 'masonry',
        name: 'Masonry',
        maxLevel: 1,
        descriptions: [
            'Unlock the Masonry Table, Shrine, and all stone structures and techniques.'
        ]
    },
    'fabric_crafting': {
        id: 'fabric_crafting',
        name: 'Fabric Crafting',
        maxLevel: 1,
        descriptions: [
            'Unlock the Fabric Station and fabric crafting recipes.'
        ]
    },
    'leather_crafting': {
        id: 'leather_crafting',
        name: 'Leather Crafting',
        maxLevel: 1,
        descriptions: [
            'Unlock the Leather Station and leather crafting recipes.'
        ]
    },
    'vitality': {
        id: 'vitality',
        name: 'Vitality',
        maxLevel: 5,
        descriptions: [
            'Increase max health by 20.',
            'Increase max health by 40.',
            'Increase max health by 60.',
            'Increase max health by 80.',
            'Increase max health by 100.'
        ]
    },
    'endurance': {
        id: 'endurance',
        name: 'Endurance',
        maxLevel: 5,
        descriptions: [
            'Increase max stamina by 20.',
            'Increase max stamina by 40.',
            'Increase max stamina by 60.',
            'Increase max stamina by 80.',
            'Increase max stamina by 100.'
        ]
    },
    'focus': {
        id: 'focus',
        name: 'Focus',
        maxLevel: 5,
        descriptions: [
            'Increase max mana by 20.',
            'Increase max mana by 40.',
            'Increase max mana by 60.',
            'Increase max mana by 80.',
            'Increase max mana by 100.'
        ]
    },
    
    'hunting': {
        id: 'hunting',
        name: 'Hunting',
        maxLevel: 1,
        descriptions: [
            'Increases damage dealt to wild animals, resource drops from animals, and the frequency of rare wild animals.'
        ]
    },

    'riding': {
        id: 'riding',
        name: 'Riding',
        maxLevel: 1,
        descriptions: [
            'Increases riding movement speed by 50%.'
        ]
    },
    'ball_caster': {
        id: 'ball_caster',
        name: 'Ball Caster',
        maxLevel: 3,
        descriptions: [
            'Increases the radius of ball and AoE spells by 1 block.',
            'Increases the radius by 2 blocks and damage by 15%.',
            'BALL CASTER MASTERY: Increases radius by 3 blocks, damage by 25%, and reduces cooldown.'
        ]
    },
    'travel_caster': {
        id: 'travel_caster',
        name: 'Travel Caster',
        maxLevel: 3,
        descriptions: [
            'Increases the duration of Speed and Levitate by 5 seconds.',
            'Reduces the mana cost of utility spells by 25%.',
            'TRAVEL CASTER MASTERY: Blink distance increased. Utility spells cost 50% less mana.'
        ]
    },
    'conjure_caster': {
        id: 'conjure_caster',
        name: 'Conjure Caster',
        maxLevel: 3,
        descriptions: [
            'Summoned creatures last 15 seconds longer.',
            'Summoned creatures have 50% more health and deal more damage.',
            'CONJURE CASTER MASTERY: Summons last 30 seconds longer and are significantly stronger.'
        ]
    },
    'arcane_healing': {
        id: 'arcane_healing',
        name: 'Arcane Healing',
        maxLevel: 3,
        descriptions: [
            'Healing spells restore 10 additional health.',
            'Healing spells restore 20 additional health and cost less mana.',
            'ARCANE HEALING MASTERY: Healing spells restore 35 additional health.'
        ]
    },
    'necromancy': {
        id: 'necromancy',
        name: 'Necromancy',
        maxLevel: 3,
        descriptions: [
            'Undead summons are 20% stronger.',
            'Undead summons cost 25% less mana.',
            'NECROMANCY MASTERY: Summoning an undead grants you 25% lifesteal for a short time.'
        ]
    },
    'rune_caster': {
        id: 'rune_caster',
        name: 'Rune Caster',
        maxLevel: 3,
        descriptions: [
            'Increases the duration and effectiveness of rune spells.',
            'Reduces the cast time and cooldown of rune spells by 15%.',
            'RUNE CASTER MASTERY: Greatly increases duration, reduces cast time and cooldown by 30%, and increases rune damage.'
        ]
    },
    'bolt_caster': {
        id: 'bolt_caster',
        name: 'Bolt Caster',
        maxLevel: 3,
        descriptions: [
            'Increases the range of bolt spells by 2 blocks and damage by 10%.',
            'Decreases the cooldown of bolt spells and increases damage by 15%.',
            'BOLT CASTER MASTERY: Increases range by 4 blocks, further decreases cooldown, and increases damage by 20%.'
        ]
    },
    'archery': {
        id: 'archery',
        name: 'Archery',
        maxLevel: 3,
        descriptions: [
            'Increases bow range by 2 blocks and damage by 10%.',
            'Decreases bow draw time and increases damage by 15%.',
            'ARCHERY MASTERY: Hold attack to charge a piercing shot. Increases range by 4 blocks, further decreases draw time, and increases damage by 20%.'
        ]
    },
    'swords': {
        id: 'swords',
        name: 'Swords',
        maxLevel: 3,
        descriptions: [
            'Hold attack to charge a Spin Attack. Increases sword damage by 10%.',
            'Dashing with a sword performs a Dash Attack. Increases sword damage by 20%.',
            'SWORD MASTERY: Swinging a sword at 50% health or more fires a Sword Beam. Increases sword damage by 30%.'
        ]
    },
    'smithing': {
        id: 'smithing',
        name: 'Smithing',
        maxLevel: 1,
        descriptions: [
            'Unlock all smithing techniques, weapons, and armor.'
        ]
    },
    'pick_pocket': {
        id: 'pick_pocket',
        name: 'Pick Pocket',
        maxLevel: 3,
        descriptions: [
            '50% chance to successfully pick pocket an NPC.',
            '75% chance to successfully pick pocket an NPC.',
            '95% chance to successfully pick pocket an NPC.'
        ]
    }
};
