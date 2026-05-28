import { Item, Rarity, DamageType } from './registries/ItemRegistry';

const WEAPON_BASES = {
    'SWORD': { name: 'Sword', reach: 1.5, cooldown: 0.6, spread: 0.5, twoHanded: false, damage: 10, category: 'WEAPON', type: 'MELEE' },
    'DAGGER': { name: 'Dagger', reach: 1.0, cooldown: 0.3, spread: 0.2, twoHanded: false, damage: 6, category: 'WEAPON', type: 'MELEE' },
    'BATTLEAXE': { name: 'Battleaxe', reach: 2.0, cooldown: 1.2, spread: 1.2, twoHanded: true, damage: 20, category: 'WEAPON', type: 'MELEE' },
    'HAMMER': { name: 'Warhammer', reach: 1.8, cooldown: 1.5, spread: 0.8, twoHanded: true, damage: 25, category: 'WEAPON', type: 'MELEE' },
    'SPEAR': { name: 'Spear', reach: 2.5, cooldown: 0.8, spread: 0.2, twoHanded: true, damage: 15, category: 'WEAPON', type: 'MELEE' },
} as const;

type WeaponBaseType = keyof typeof WEAPON_BASES;

const MATERIALS = [
    { name: 'Wooden', mult: 1.0, color: '#8B4513', minLevel: 1 },
    { name: 'Copper', mult: 1.5, color: '#b87333', minLevel: 2 },
    { name: 'Iron', mult: 2.5, color: '#bcc6cc', minLevel: 5 },
    { name: 'Red Metal', mult: 3.0, color: '#ff4444', minLevel: 8 },
    { name: 'Blue Metal', mult: 3.2, color: '#4444ff', minLevel: 9 },
    { name: 'Green Metal', mult: 3.5, color: '#2e8b57', minLevel: 10 },
    { name: 'Mithril', mult: 5.0, color: '#e0ffff', minLevel: 15 },
    { name: 'Black Metal', mult: 7.0, color: '#333333', minLevel: 20 },
    { name: 'Adamantium', mult: 8.5, color: '#b5b5b5', minLevel: 23 },
    { name: 'Eternium', mult: 10.0, color: '#00ffd0', minLevel: 25 },
    { name: 'Void', mult: 12.0, color: '#4b0082', minLevel: 30 },
];

const PREFIXES: Record<string, { dmgMod: number, dmgType?: DamageType, desc: string, color?: string }> = {
    'Flaming': { dmgMod: 1.2, dmgType: 'FIRE', desc: 'Sears enemies with fire damage.', color: '#ff4500' },
    'Venomous': { dmgMod: 1.1, dmgType: 'ACID', desc: 'Coated in deadly poison causing acid damage.', color: '#32cd32' },
    'Electric': { dmgMod: 1.3, dmgType: 'LIGHTNING', desc: 'Crackles with lightning energy.', color: '#ffff00' },
    'Arcane': { dmgMod: 1.4, dmgType: 'ARCANE', desc: 'Infused with void arcane magic.', color: '#9932cc' },
    'Frost': { dmgMod: 1.1, dmgType: 'ICE', desc: 'Chills targets with ice damage.', color: '#00ffff' },
    'Kinetic': { dmgMod: 1.3, dmgType: 'MAGIC', desc: 'Blasts enemies with pure force.', color: '#ffffff' },
    'Heavy': { dmgMod: 1.5, desc: 'Exceptionally heavy, increasing raw damage.' },
    'Keen': { dmgMod: 1.3, desc: 'Sharpened to a razor edge.' }
};

const SUFFIXES: Record<string, { cdMod?: number, reachMod?: number, spreadMod?: number, desc: string }> = {
    'of Haste': { cdMod: 0.7, desc: 'Increases attack speed drastically.' },
    'of the Giant': { reachMod: 1.5, spreadMod: 1.5, desc: 'Massively increases attack reach and spread.' },
    'of Precision': { reachMod: 1.2, spreadMod: 0.5, desc: 'Increases reach while narrowing attack angle.' },
    'of the Wind': { cdMod: 0.8, reachMod: 1.2, desc: 'Slightly increases attack speed and reach.' },
    'of Destruction': { spreadMod: 1.5, desc: 'Increases attack spread heavily.' },
    'of Arcane Protection': { desc: 'Spin attack leaves a magic circle of protection (+Defense for 20s).' },
    'of Fire Circle': { desc: 'Spin attack leaves a fiery AOE on the ground for 10s.' }
};

export const RARITY_COLORS: Record<Rarity, string> = {
    'COMMON': '#ffffff',     // White
    'UNCOMMON': '#1eff00',   // Green
    'RARE': '#0070dd',       // Blue
    'EPIC': '#a335ee',       // Purple
    'LEGENDARY': '#ff8000'   // Orange
};

const ACCESSORY_BASES = {
    'RING': { name: 'Ring', category: 'ARMOR', equipmentSlot: 'RIGHT_RING' }, // We'll randomize left or right during generation
    'AMULET': { name: 'Amulet', category: 'ARMOR', equipmentSlot: 'NECKLACE' }
} as const;

const ACCESSORY_MATERIALS = [
    { name: 'Copper', mult: 1.0, color: '#b87333', minLevel: 1 },
    { name: 'Silver', mult: 1.5, color: '#c0c0c0', minLevel: 5 },
    { name: 'Gold', mult: 2.5, color: '#ffd700', minLevel: 10 },
    { name: 'Platinum', mult: 4.0, color: '#e5e4e2', minLevel: 15 },
    { name: 'Void-Touched', mult: 6.0, color: '#4b0082', minLevel: 20 },
];

const ACCESSORY_PREFIXES: Record<string, { stat: string, baseVal: number, desc: string, color: string }> = {
    'Vampiric': { stat: 'lifesteal', baseVal: 0.1, desc: 'Heals you for a portion of damage dealt.', color: '#8a0303' },
    'Aegis': { stat: 'defense', baseVal: 4, desc: 'Increases raw physical defense.', color: '#2b2b2b' },
    'Energetic': { stat: 'manaRegen', baseVal: 2, desc: 'Passively restores mana over time.', color: '#00ced1' },
    'Rejuvenating': { stat: 'healthRegen', baseVal: 1, desc: 'Passively restores health over time.', color: '#32cd32' },
    'Swift': { stat: 'speedBonus', baseVal: 1.5, desc: 'Grants increased movement speed.', color: '#ffb6c1' },
};

const ACCESSORY_SUFFIXES: Record<string, { stat: string, baseVal: number, desc: string }> = {
    'of the Titan': { stat: 'bonusHealth', baseVal: 30, desc: 'Grants additional maximum health.' },
    'of the Sage': { stat: 'bonusMana', baseVal: 40, desc: 'Grants additional maximum mana.' },
    'of Destruction': { stat: 'bonusDamage', baseVal: 5, desc: 'Increases all damage dealt directly.' }
};

const ARMOR_BASES = {
    'HEAD': { bases: { 'LIGHT': 'Hood', 'MEDIUM': 'Cap', 'HEAVY': 'Helm' } },
    'SHOULDERS': { bases: { 'LIGHT': 'Mantle', 'MEDIUM': 'Spaulders', 'HEAVY': 'Pauldrons' } },
    'BODY': { bases: { 'LIGHT': 'Robe', 'MEDIUM': 'Tunic', 'HEAVY': 'Chestplate' } },
    'HANDS': { bases: { 'LIGHT': 'Gloves', 'MEDIUM': 'Bracers', 'HEAVY': 'Gauntlets' } },
    'BELT': { bases: { 'LIGHT': 'Sash', 'MEDIUM': 'Belt', 'HEAVY': 'Girdle' } },
    'LEGS': { bases: { 'LIGHT': 'Pants', 'MEDIUM': 'Leggings', 'HEAVY': 'Greaves' } },
    'FEET': { bases: { 'LIGHT': 'Shoes', 'MEDIUM': 'Boots', 'HEAVY': 'Sabatons' } },
    'CLOAK': { bases: { 'LIGHT': 'Cape', 'MEDIUM': 'Cloak', 'HEAVY': 'Heavy Cloak' } },
} as const;

const ARMOR_MATERIALS = {
    'LIGHT': [
        { name: 'Cloth', mult: 1.0, color: '#d3d3d3', minLevel: 1 },
        { name: 'Linen', mult: 1.5, color: '#f0e68c', minLevel: 5 },
        { name: 'Silk', mult: 2.5, color: '#e0ffff', minLevel: 10 },
        { name: 'Spider-Silk', mult: 4.0, color: '#8a2be2', minLevel: 15 },
        { name: 'Void-Silk', mult: 6.0, color: '#4b0082', minLevel: 25 },
    ],
    'MEDIUM': [
        { name: 'Leather', mult: 1.2, color: '#8b4513', minLevel: 1 },
        { name: 'Hard Leather', mult: 1.8, color: '#a0522d', minLevel: 5 },
        { name: 'Chainmail', mult: 3.0, color: '#bcc6cc', minLevel: 10 },
        { name: 'Scalemail', mult: 4.5, color: '#2e8b57', minLevel: 15 },
        { name: 'Dragon-hide', mult: 7.0, color: '#8b0000', minLevel: 25 },
    ],
    'HEAVY': [
        { name: 'Copper', mult: 1.5, color: '#b87333', minLevel: 1 },
        { name: 'Iron', mult: 2.5, color: '#808080', minLevel: 5 },
        { name: 'Steel', mult: 3.8, color: '#b0c4de', minLevel: 10 },
        { name: 'Mithril', mult: 5.5, color: '#e0ffff', minLevel: 15 },
        { name: 'Adamantium', mult: 7.5, color: '#b5b5b5', minLevel: 20 },
        { name: 'Eternium', mult: 10.0, color: '#00ffd0', minLevel: 25 },
    ]
} as const;

const ARMOR_PREFIXES: Record<string, { stat: string, baseVal: number, desc: string, color?: string }> = {
    'Stout': { stat: 'defense', baseVal: 2, desc: 'Increases physical defense.' },
    'Ethereal': { stat: 'magicDefense', baseVal: 2, desc: 'Increases magic defense.', color: '#dda0dd' },
    'Vigorous': { stat: 'bonusHealth', baseVal: 10, desc: 'Increases maximum health.' },
    'Arcane': { stat: 'bonusMana', baseVal: 15, desc: 'Increases maximum mana.', color: '#9932cc' },
    'Nimble': { stat: 'speedBonus', baseVal: 0.5, desc: 'Slightly increases movement speed.' }
};

const ARMOR_SUFFIXES: Record<string, { stat: string, baseVal: number, desc: string }> = {
    'of the Bear': { stat: 'bonusHealth', baseVal: 20, desc: 'Grants significant health.' },
    'of the Owl': { stat: 'bonusMana', baseVal: 30, desc: 'Grants significant mana.' },
    'of the Cheetah': { stat: 'speedBonus', baseVal: 1.0, desc: 'Grants extra movement speed.' },
    'of the Troll': { stat: 'healthRegen', baseVal: 1, desc: 'Passively heals you.' },
    'of Rejuvenation': { stat: 'manaRegen', baseVal: 2, desc: 'Passively restores mana.' },
    'of the Titan': { stat: 'defense', baseVal: 5, desc: 'Greatly increases physical defense.' }
};


const BOW_BASES = {
    'SHORTBOW': { name: 'Shortbow', cooldown: 0.6, reach: 20.0, damage: 8, projectileSpeed: 25, twoHanded: true },
    'LONGBOW': { name: 'Longbow', cooldown: 1.0, reach: 25.0, damage: 14, projectileSpeed: 30, twoHanded: true },
    'CROSSBOW': { name: 'Crossbow', cooldown: 1.5, reach: 22.0, damage: 20, projectileSpeed: 35, twoHanded: true },
    'REPEATER': { name: 'Repeater', cooldown: 0.3, reach: 18.0, damage: 5, projectileSpeed: 22, twoHanded: true }
} as const;

const BOW_MATERIALS = [
    { name: 'Pine', mult: 1.0, color: '#cd853f', minLevel: 1 },
    { name: 'Oak', mult: 1.5, color: '#8b4513', minLevel: 5 },
    { name: 'Ironwood', mult: 2.5, color: '#5c4033', minLevel: 10 },
    { name: 'Elven', mult: 4.0, color: '#556b2f', minLevel: 15 },
    { name: 'Dragon-bone', mult: 6.0, color: '#e0eee0', minLevel: 22 },
    { name: 'Void-wood', mult: 8.5, color: '#4b0082', minLevel: 28 },
];

const BOW_PREFIXES: Record<string, { stat: string, baseVal: number, desc: string }> = {
    'Nimble': { stat: 'cooldown', baseVal: -0.15, desc: 'Increases firing speed.' },
    'Heavy': { stat: 'damage', baseVal: 5, desc: 'Increases raw damage, but heavier.' },
    'Piercing': { stat: 'armorPen', baseVal: 0, desc: 'Arrows pierce armor.' },
    'Sniper': { stat: 'projectileSpeed', baseVal: 5, desc: 'Arrows fly much faster.' }
};

const BOW_SUFFIXES: Record<string, { stat: string, baseVal: number, desc: string }> = {
    'of the Wind': { stat: 'cooldown', baseVal: -0.2, desc: 'Fires like the wind.' },
    'of the Eagle': { stat: 'reach', baseVal: 5.0, desc: 'Arrows fly further.' },
    'of the Bear': { stat: 'damage', baseVal: 10, desc: 'Massive damage bonus.' }
};

const BOW_SECONDARY_ABILITIES = [
    { name: 'Multishot', id: 'BOW_MULTI_SHOT', chargeTime: 1.5, manaCost: 15, desc: 'Hold for 1.5s to fire a spread of arrows.' },
    { name: 'Explosive Shot', id: 'BOW_EXPLOSIVE_SHOT', chargeTime: 2.0, manaCost: 20, desc: 'Hold for 2s to fire a volatile explosive arrow.' },
    { name: 'Piercing Arrow', id: 'BOW_PIERCING_SHOT', chargeTime: 1.0, manaCost: 10, desc: 'Hold for 1s to fire an arrow that pierces enemies.' },
    { name: 'Homing Swarm', id: 'BOW_HOMING_SHOT', chargeTime: 2.5, manaCost: 30, desc: 'Hold for 2.5s to fire multiple homing arrows.' },
    { name: 'Frost Volley', id: 'BOW_FROST_SHOT', chargeTime: 1.5, manaCost: 20, desc: 'Hold for 1.5s to fire freezing arrows.' }
];

export class ItemGenerator {
    static generateBow(baseLevel: number): Item {
        const bases = Object.keys(BOW_BASES) as (keyof typeof BOW_BASES)[];
        const baseKey = bases[Math.floor(Math.random() * bases.length)];
        const baseData = BOW_BASES[baseKey];

        const validMats = BOW_MATERIALS.filter(m => m.minLevel <= baseLevel);
        const material = validMats[Math.floor(Math.random() * validMats.length)];

        // Roll Rarity
        const rand = Math.random();
        let rarity: Rarity = 'COMMON';
        let numAffixes = 0;
        let hasSecondary = false;
        
        if (rand > 0.95) { rarity = 'LEGENDARY'; numAffixes = 2; hasSecondary = true; }
        else if (rand > 0.85) { rarity = 'EPIC'; numAffixes = 2; hasSecondary = Math.random() > 0.5; }
        else if (rand > 0.60) { rarity = 'RARE'; numAffixes = 2; hasSecondary = Math.random() > 0.8; }
        else if (rand > 0.30) { rarity = 'UNCOMMON'; numAffixes = 1; }

        let name = `${material.name} ${baseData.name}`;
        let itemColor: string = material.color;
        let affixes: string[] = [];

        let damage = Math.round(baseData.damage * material.mult);
        let cooldown = baseData.cooldown;
        let reach = baseData.reach;
        let projectileSpeed = baseData.projectileSpeed;

        const itemObj: Item = {
            id: `gen_bow_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            description: `A ${rarity.toLowerCase()} ranged weapon.`,
            category: 'WEAPON',
            type: 'RANGED',
            ammoType: 'ARROW',
            twoHanded: true,
            equipmentSlot: 'MAIN_HAND',
            damage,
            cooldown,
            reach,
            projectileSpeed,
            projectileColor: '#dddddd',
            rarity,
            itemColor,
            affixes,
            stackable: false,
            maxStack: 1,
            quantity: 1
        };

        const availablePrefixes = Object.keys(BOW_PREFIXES);
        const availableSuffixes = Object.keys(BOW_SUFFIXES);
        let hasPrefix = false;
        let hasSuffix = false;

        for (let i = 0; i < numAffixes; i++) {
            if (!hasPrefix && (Math.random() > 0.5 || hasSuffix || numAffixes === 1)) {
                // Prefix
                const pre = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
                const preData = BOW_PREFIXES[pre];
                
                itemObj.name = `${pre} ${itemObj.name}`;
                
                if (preData.stat === 'cooldown') {
                    itemObj.cooldown = Math.max(0.1, (itemObj.cooldown || 1) + preData.baseVal);
                } else if (preData.stat === 'damage') {
                    itemObj.damage = (itemObj.damage || 0) + Math.round(preData.baseVal * material.mult);
                } else if (preData.stat === 'projectileSpeed') {
                    itemObj.projectileSpeed = (itemObj.projectileSpeed || 10) + preData.baseVal;
                }
                
                affixes.push(`${preData.desc}`);
                
                hasPrefix = true;
                availablePrefixes.splice(availablePrefixes.indexOf(pre), 1);
            } else if (!hasSuffix) {
                // Suffix
                const suf = availableSuffixes[Math.floor(Math.random() * availableSuffixes.length)];
                const sufData = BOW_SUFFIXES[suf];
                
                itemObj.name = `${itemObj.name} ${suf}`;
                
                if (sufData.stat === 'cooldown') {
                    itemObj.cooldown = Math.max(0.1, (itemObj.cooldown || 1) + sufData.baseVal);
                } else if (sufData.stat === 'damage') {
                    itemObj.damage = (itemObj.damage || 0) + Math.round(sufData.baseVal * material.mult);
                } else if (sufData.stat === 'reach') {
                    itemObj.reach = (itemObj.reach || 10) + sufData.baseVal;
                }

                affixes.push(`${sufData.desc}`);
                
                hasSuffix = true;
                availableSuffixes.splice(availableSuffixes.indexOf(suf), 1);
            }
        }
        
        if (hasSecondary) {
            const sec = BOW_SECONDARY_ABILITIES[Math.floor(Math.random() * BOW_SECONDARY_ABILITIES.length)];
            itemObj.secondaryAbility = sec.id;
            itemObj.chargeTime = sec.chargeTime;
            itemObj.chargeManaCost = sec.manaCost;
            affixes.push(`[Active] ${sec.name}: ${sec.desc}`);
        }
        
        itemObj.itemColor = itemColor;
        return itemObj;
    }
    static generateArmor(baseLevel: number): Item {
        const slots = Object.keys(ARMOR_BASES) as (keyof typeof ARMOR_BASES)[];
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const slotData = ARMOR_BASES[slot];

        const weights = ['LIGHT', 'MEDIUM', 'HEAVY'] as const;
        const weight = weights[Math.floor(Math.random() * weights.length)];
        const baseName = slotData.bases[weight];

        const validMats = ARMOR_MATERIALS[weight].filter(m => m.minLevel <= baseLevel);
        const material = validMats[Math.floor(Math.random() * validMats.length)];

        // Roll Rarity
        const rand = Math.random();
        let rarity: Rarity = 'COMMON';
        let numAffixes = 0;
        
        if (rand > 0.98) { rarity = 'LEGENDARY'; numAffixes = 2; }
        else if (rand > 0.90) { rarity = 'EPIC'; numAffixes = 2; }
        else if (rand > 0.70) { rarity = 'RARE'; numAffixes = 2; }
        else if (rand > 0.30) { rarity = 'UNCOMMON'; numAffixes = 1; }

        let name = `${material.name} ${baseName}`;
        let itemColor: string = material.color;
        let affixes: string[] = [];

        // Base stats based on weight and material mult
        let defense = 0;
        let magicDefense = 0;
        
        if (weight === 'LIGHT') {
            defense = Math.round(1 * material.mult);
            magicDefense = Math.round(3 * material.mult);
        } else if (weight === 'MEDIUM') {
            defense = Math.round(2.5 * material.mult);
            magicDefense = Math.round(1.5 * material.mult);
        } else {
            defense = Math.round(4 * material.mult);
            magicDefense = Math.round(0.5 * material.mult);
        }

        const itemObj: Item = {
            id: `gen_armor_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            description: `A ${rarity.toLowerCase()} ${weight.toLowerCase()} armor piece crafted from ${material.name}.`,
            category: 'ARMOR',
            equipmentSlot: slot as any,
            armorWeight: weight,
            defense,
            magicDefense,
            rarity,
            itemColor,
            affixes,
            stackable: false,
            maxStack: 1,
            quantity: 1
        };

        const availablePrefixes = Object.keys(ARMOR_PREFIXES);
        const availableSuffixes = Object.keys(ARMOR_SUFFIXES);
        let hasPrefix = false;
        let hasSuffix = false;

        for (let i = 0; i < numAffixes; i++) {
            if (!hasPrefix && (Math.random() > 0.5 || hasSuffix || numAffixes === 1)) {
                // Prefix
                const pre = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
                const preData = ARMOR_PREFIXES[pre];
                
                itemObj.name = `${pre} ${itemObj.name}`;
                if (preData.color) itemColor = preData.color; // Override color optionally
                
                const val = Math.round(preData.baseVal * material.mult * 10) / 10;
                (itemObj as any)[preData.stat] = ((itemObj as any)[preData.stat] || 0) + val;
                
                affixes.push(`${preData.desc} (+${val})`);
                
                hasPrefix = true;
                availablePrefixes.splice(availablePrefixes.indexOf(pre), 1);
            } else if (!hasSuffix) {
                // Suffix
                const suf = availableSuffixes[Math.floor(Math.random() * availableSuffixes.length)];
                const sufData = ARMOR_SUFFIXES[suf];
                
                itemObj.name = `${itemObj.name} ${suf}`;
                
                let val = Math.round(sufData.baseVal * material.mult * 10) / 10; 
                (itemObj as any)[sufData.stat] = ((itemObj as any)[sufData.stat] || 0) + val;

                affixes.push(`${sufData.desc} (+${val})`);
                
                hasSuffix = true;
                availableSuffixes.splice(availableSuffixes.indexOf(suf), 1);
            } else {
                // Hidden affix
                itemObj.defense = (itemObj.defense || 0) + Math.round(2 * material.mult);
                affixes.push("Masterfully crafted (+Defense).");
            }
        }
        
        itemObj.itemColor = itemColor;
        return itemObj;
    }
    static generateAccessory(baseLevel: number): Item {
        const bases = Object.keys(ACCESSORY_BASES) as (keyof typeof ACCESSORY_BASES)[];
        const baseKey = bases[Math.floor(Math.random() * bases.length)];
        const base = ACCESSORY_BASES[baseKey];

        const validMats = ACCESSORY_MATERIALS.filter(m => m.minLevel <= baseLevel);
        const material = validMats[Math.floor(Math.random() * validMats.length)];

        // Roll Rarity
        const rand = Math.random();
        let rarity: Rarity = 'COMMON';
        let numAffixes = 0;
        
        if (rand > 0.98) { rarity = 'LEGENDARY'; numAffixes = 2; }
        else if (rand > 0.90) { rarity = 'EPIC'; numAffixes = 2; }
        else if (rand > 0.70) { rarity = 'RARE'; numAffixes = 2; }
        else if (rand > 0.30) { rarity = 'UNCOMMON'; numAffixes = 1; }

        let name = `${material.name} ${base.name}`;
        let itemColor: string = material.color;
        let affixes: string[] = [];

        let slot: any = base.equipmentSlot;
        if (baseKey === 'RING') {
            slot = Math.random() > 0.5 ? 'RIGHT_RING' : 'LEFT_RING';
        }

        const itemObj: Item = {
            id: `gen_${baseKey.toLowerCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            description: `A ${rarity.toLowerCase()} accessory crafted from ${material.name}.`,
            category: 'ARMOR',
            equipmentSlot: slot as any,
            rarity,
            itemColor,
            affixes,
            stackable: false,
            maxStack: 1,
            quantity: 1
        };

        const availablePrefixes = Object.keys(ACCESSORY_PREFIXES);
        const availableSuffixes = Object.keys(ACCESSORY_SUFFIXES);
        let hasPrefix = false;
        let hasSuffix = false;

        for (let i = 0; i < numAffixes; i++) {
            if (!hasPrefix && (Math.random() > 0.5 || hasSuffix || numAffixes === 1)) {
                // Prefix
                const pre = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
                const preData = ACCESSORY_PREFIXES[pre];
                
                itemObj.name = `${pre} ${itemObj.name}`;
                itemColor = preData.color; // Override color
                
                const val = Math.round(preData.baseVal * material.mult * 10) / 10;
                (itemObj as any)[preData.stat] = ((itemObj as any)[preData.stat] || 0) + val;
                
                affixes.push(`${preData.desc} (+${val})`);
                
                hasPrefix = true;
                availablePrefixes.splice(availablePrefixes.indexOf(pre), 1);
            } else if (!hasSuffix) {
                // Suffix
                const suf = availableSuffixes[Math.floor(Math.random() * availableSuffixes.length)];
                const sufData = ACCESSORY_SUFFIXES[suf];
                
                itemObj.name = `${itemObj.name} ${suf}`;
                
                let val = Math.round(sufData.baseVal * material.mult); 
                (itemObj as any)[sufData.stat] = ((itemObj as any)[sufData.stat] || 0) + val;

                affixes.push(`${sufData.desc} (+${val})`);
                
                hasSuffix = true;
                availableSuffixes.splice(availableSuffixes.indexOf(suf), 1);
            } else {
                // If we get here and have both, just boost defense as a hidden affix
                itemObj.defense = (itemObj.defense || 0) + Math.round(2 * material.mult);
                affixes.push("Masterfully crafted (+Defense).");
            }
        }
        
        itemObj.itemColor = itemColor;
        return itemObj;
    }

    static generateWeapon(baseLevel: number): Item {
        // Roll between normal weapons and staves (e.g. 25% chance for a staff)
        const isStaff = Math.random() < 0.25;

        let baseKey: string;
        let base: any;

        if (isStaff) {
            baseKey = 'STAFF';
            const r = Math.random();
            let type = 'MAGIC_RANGED';
            if (r > 0.66) type = 'MAGIC_AOE';
            base = { name: 'Staff', reach: 8.0, cooldown: 1.0, spread: 0.1, twoHanded: true, damage: 15, category: 'WEAPON', type };
        } else {
            const bases = Object.keys(WEAPON_BASES) as WeaponBaseType[];
            baseKey = bases[Math.floor(Math.random() * bases.length)];
            base = WEAPON_BASES[baseKey as WeaponBaseType];
        }

        // Filter valid materials by level
        const validMats = MATERIALS.filter(m => m.minLevel <= baseLevel);
        const material = validMats[Math.floor(Math.random() * validMats.length)];

        // Roll Rarity based on Level/Random
        const rand = Math.random();
        let rarity: Rarity = 'COMMON';
        let numAffixes = 0;
        
        if (rand > 0.98) { rarity = 'LEGENDARY'; numAffixes = 3; }
        else if (rand > 0.90) { rarity = 'EPIC'; numAffixes = 2; }
        else if (rand > 0.70) { rarity = 'RARE'; numAffixes = 2; }
        else if (rand > 0.40) { rarity = 'UNCOMMON'; numAffixes = 1; }

        let name = isStaff ? `${material.name} Staff` : `${material.name} ${base.name}`;
        let damage = base.damage * material.mult;
        let cooldown = base.cooldown;
        let reach = base.reach;
        let spread = base.spread;
                let damageType: DamageType = 'PHYSICAL';
        let itemColor: string = material.color;
        let affixes: string[] = [];
        let secondaryAbility: string | undefined;
        let swordBeamModifier: string | undefined;
        let chargeManaCost: number | undefined;
        let chargeStaminaCost: number | undefined;
        let spellId: string | undefined;

        if (isStaff) {
             const attackTypeLabel = base.type === 'MAGIC_RANGED' ? (Math.random() > 0.5 ? 'Bolt' : 'Ball') : 'Burst';
             
             // 30% chance for a wand to be a powerful Rune Staff with an embedded spell
             if (Math.random() < 0.3) {
                 const runeSpells = ['rune_of_fire', 'rune_of_ice', 'rune_of_lightning', 'rune_of_acid', 'rune_of_arcane', 'rune_of_holy', 'rune_of_void'];
                 spellId = runeSpells[Math.floor(Math.random() * runeSpells.length)];
                 const runeType = spellId.replace('rune_of_', '');
                 damageType = runeType.toUpperCase() as DamageType;
                 name = `${material.name} ${runeType.charAt(0).toUpperCase() + runeType.slice(1)}craft Staff`;
                 affixes.push(`Grants the knowledge of ${spellId.replace(/_/g, ' ')} when read.`);
             } else {
                 name = `${material.name} ${attackTypeLabel} Staff`;
             }
             
             if (base.type === 'MAGIC_AOE') {
                 damage *= 1.5;
                 cooldown *= 1.5;
             }
        }

        // Distribute affixes between prefixes and suffixes
                const SWORD_BEAM_PREFIXES: Record<string, { beamMod: string, desc: string, color: string }> = {
            'Splitting': { beamMod: 'SPREAD', desc: 'Fires 3 sword beams in a spread.', color: '#aaffaa' },
            'Piercing': { beamMod: 'PIERCE', desc: 'Sword beams pierce through enemies.', color: '#ffaaff' },
            'Giant': { beamMod: 'GIANT', desc: 'Fires a massive, slow-moving sword beam.', color: '#ffffaa' },
            'Rapid': { beamMod: 'RAPID', desc: 'Fires rapid, faster sword beams.', color: '#aaaaff' },
            'Bursting': { beamMod: 'BURST', desc: 'Fires 8 sword beams in all directions.', color: '#ffaa00' },
            'Homing': { beamMod: 'HOMING', desc: 'Sword beams track nearby enemies.', color: '#ffaaaa' },
            'Bouncing': { beamMod: 'BOUNCE', desc: 'Sword beams bounce off walls.', color: '#aaffff' }
        };

const isSword = base.name === 'Sword';
        let availablePrefixes = Object.keys(PREFIXES);
        if (isSword) {
            availablePrefixes = availablePrefixes.concat(Object.keys(SWORD_BEAM_PREFIXES));
        }
        
        
        

        

        const SWORD_SUFFIXES: Record<string, { ability: string, desc: string, manaCost: number, stamCost: number }> = {
            'of Frost Nova': { ability: 'SPIN_FROST_NOVA', desc: 'Spin attack releases a freezing Frost Nova.', manaCost: 20, stamCost: 15 },
            'of Flame Wave': { ability: 'SPIN_FLAME_WAVE', desc: 'Spin attack conjures a wave of fire.', manaCost: 15, stamCost: 10 },
            'of Thunder Strike': { ability: 'SPIN_THUNDER_STRIKE', desc: 'Spin attack calls down lightning bolts on nearby foes.', manaCost: 25, stamCost: 10 },
            'of the Void': { ability: 'SPIN_VOID_PULL', desc: 'Spin attack pulls enemies towards you from the void.', manaCost: 30, stamCost: 20 },
            'of Blood Thirst': { ability: 'SPIN_BLOOD_THIRST', desc: 'Spin attack drains life from enemies hit.', manaCost: 10, stamCost: 25 },
            'of the Shadow Step': { ability: 'SPIN_SHADOW_STEP', desc: 'Spin attack teleports you behind the nearest enemy.', manaCost: 30, stamCost: 5 },
            'of the Quake': { ability: 'SPIN_EARTHQUAKE', desc: 'Spin attack stuns all nearby enemies.', manaCost: 15, stamCost: 30 },
            'of the Wind': { ability: 'SPIN_WIND_BLADE', desc: 'Spin attack shoots piercing wind blades in all directions.', manaCost: 20, stamCost: 20 },
            'of Light Burst': { ability: 'SPIN_LIGHT_BURST', desc: 'Spin attack blinds and damages nearby enemies with holy light.', manaCost: 25, stamCost: 10 },
            'of Venom': { ability: 'SPIN_POISON_WAVE', desc: 'Spin attack releases a toxic cloud.', manaCost: 15, stamCost: 15 },
            'of the Meteor': { ability: 'SPIN_METEOR_SMASH', desc: 'Spin attack causes an explosive jump smash.', manaCost: 20, stamCost: 30 },
            'of Chronos': { ability: 'SPIN_TIME_STOP', desc: 'Spin attack drastically slows nearby enemies.', manaCost: 40, stamCost: 15 },
            'of Arcane Blast': { ability: 'SPIN_ARCANE_BLAST', desc: 'Spin attack releases pure arcane energy.', manaCost: 20, stamCost: 10 },
            'of the Paladin': { ability: 'SPIN_HOLY_CROSS', desc: 'Spin attack leaves a holy circle that damages undead.', manaCost: 25, stamCost: 15 },
            'of Spectral Blades': { ability: 'SPIN_SPECTRAL_BLADES', desc: 'Spin attack conjures floating phantom swords.', manaCost: 30, stamCost: 15 },
            'of the Comet': { ability: 'SPIN_METEOR_SMASH', desc: 'Spin attack drops a devastating meteor crash.', manaCost: 25, stamCost: 35 },
            'of the Warlord': { ability: 'SPIN_EARTHQUAKE', desc: 'Spin attack causes an earthquake that stuns all nearby enemies.', manaCost: 10, stamCost: 40 },
            'of Teleportation': { ability: 'SPIN_TELEPORT_STRIKE', desc: 'Spin attack teleports you to your cursor and strikes a wide area.', manaCost: 35, stamCost: 20 },
            'of the Dragon': { ability: 'SPIN_DRAGON_BREATH', desc: 'Spin attack unleashes a continuous cone of dragon fire.', manaCost: 40, stamCost: 15 }
        };

        const STAFF_SUFFIXES: Record<string, { ability: string, desc: string }> = {
            'of Teleportation': { ability: 'BLINK', desc: 'Allows the wielder to instantly teleport short distances.' },
            'of Summon Wolf': { ability: 'SUMMON_WOLF', desc: 'Summons a loyal wolf spirit to fight for you.' },
            'of Healing': { ability: 'MASS_HEAL', desc: 'Channels energy to deeply heal the wielder and allies.' },
            'of Fire Circle': { ability: 'FIRE_CIRCLE', desc: 'Deploys a protective ring of continuous fire.' },
            'of Protection Circle': { ability: 'PROTECTION_CIRCLE', desc: 'Creates an aura of invulnerability around the caster.' },
            'of Rat Summoning': { ability: 'SUMMON_RAT', desc: 'Summons aggressive rats to fight for you.' },
            'of Exploding Runes': { ability: 'EXPLODING_RUNES', desc: 'Places cascading explosive runes.' },
            'of Stone Creation': { ability: 'STONE_CREATION', desc: 'Conjures a solid stone block at your target location.' },
            'of Flight': { ability: 'FLIGHT', desc: 'Launches you into the air, allowing you to glide down safely.' },
            'of the Gardener': { ability: 'GARDENER', desc: 'Transforms dirt into tilled soil in an area around the caster.' },
            'of the Fire Rune': { ability: 'RUNE_OF_FIRE', desc: 'Secondary attack casts a powerful Rune of Fire.' },
            'of the Ice Rune': { ability: 'RUNE_OF_ICE', desc: 'Secondary attack casts a freezing Rune of Ice.' },
            'of the Lightning Rune': { ability: 'RUNE_OF_LIGHTNING', desc: 'Secondary attack casts a shocking Rune of Lightning.' },
            'of the Acid Rune': { ability: 'RUNE_OF_ACID', desc: 'Secondary attack casts a toxic Rune of Acid.' },
            'of the Gravity Rune': { ability: 'RUNE_OF_GRAVITY', desc: 'Secondary attack casts a crushing Rune of Gravity.' },
            'of the Destruction Rune': { ability: 'RUNE_OF_DESTRUCTION', desc: 'Secondary attack casts an obliterating Rune of Destruction.' },
            'of the Life Rune': { ability: 'RUNE_OF_LIFE', desc: 'Secondary attack casts a restorative Rune of Life.' },
            'of the Arcane Rune': { ability: 'RUNE_OF_ARCANE', desc: 'Secondary attack casts a chaotic Rune of Arcane.' },
            'of the Holy Rune': { ability: 'RUNE_OF_HOLY', desc: 'Secondary attack casts a divine Rune of Holy.' },
            'of the Void Rune': { ability: 'RUNE_OF_VOID', desc: 'Secondary attack casts an abyssal Rune of Void.' }
        };

        
        let availableSuffixes = Object.keys(SUFFIXES);
        if (isStaff) {
            availableSuffixes = Object.keys(STAFF_SUFFIXES);
        } else if (isSword) {
            // Include both normal suffixes AND sword suffixes, or just sword suffixes to guarantee them
            availableSuffixes = availableSuffixes.concat(Object.keys(SWORD_SUFFIXES));
        }

        
        let hasPrefix = false;
        let hasSuffix = false;

        for (let i = 0; i < numAffixes; i++) {
            if (!hasPrefix && (Math.random() > 0.5 || hasSuffix)) {
                // Add Prefix
                const pre = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
                
                if (isSword && SWORD_BEAM_PREFIXES[pre]) {
                    const preData = SWORD_BEAM_PREFIXES[pre];
                    name = `${pre} ${name}`;
                    swordBeamModifier = preData.beamMod;
                    if (preData.color) itemColor = preData.color;
                    affixes.push(`Sword Beam: ${preData.desc}`);
                } else {
                    const preData = PREFIXES[pre];
                    if (isStaff && !spellId) {
                       const attackTypeLabel = base.type === 'MAGIC_RANGED' ? (Math.random() > 0.5 ? 'Bolt' : 'Ball') : 'Burst';
                       let elementLabel = preData.dmgType ? preData.dmgType.charAt(0).toUpperCase() + preData.dmgType.slice(1).toLowerCase() : pre;
                       if (elementLabel === 'Lightning') elementLabel = 'Shock';
                       name = `${material.name} ${elementLabel} ${attackTypeLabel} Staff`;
                    } else {
                       name = `${pre} ${name}`;
                    }

                    damage *= preData.dmgMod;
                    if (preData.dmgType) {
                        damageType = preData.dmgType;
                    }
                    if (preData.color) { // Prefix color overrides material color occasionally
                        itemColor = preData.color;
                    }
                    affixes.push(preData.desc);
                }
                hasPrefix = true;
                availablePrefixes.splice(availablePrefixes.indexOf(pre), 1);
            } else if (!hasSuffix) {
                // Add Suffix
                const suf = availableSuffixes[Math.floor(Math.random() * availableSuffixes.length)];
                name = `${name} ${suf}`;

                
                if (isStaff && STAFF_SUFFIXES[suf]) {
                    const sufData = STAFF_SUFFIXES[suf];
                    secondaryAbility = sufData.ability;
                    affixes.push(`Secondary Attack: ${sufData.desc}`);
                } else if (isSword && SWORD_SUFFIXES[suf]) {
                    const sufData = SWORD_SUFFIXES[suf];
                    secondaryAbility = sufData.ability;
                    chargeManaCost = sufData.manaCost;
                    chargeStaminaCost = sufData.stamCost;
                    affixes.push(`Spin Attack Modifier: ${sufData.desc}`);
                } else if (SUFFIXES[suf]) {
                    const sufData = SUFFIXES[suf];
                    if (sufData.cdMod) cooldown *= sufData.cdMod;
                    if (sufData.reachMod) reach *= sufData.reachMod;
                    if (sufData.spreadMod) spread *= sufData.spreadMod;
                    affixes.push(sufData.desc);
                }

                hasSuffix = true;
                availableSuffixes.splice(availableSuffixes.indexOf(suf), 1);
            } else {
                // If we get here and have both, just boost damage as a hidden affix
                damage *= 1.2;
                affixes.push("Masterfully crafted (+20% Damage).");
            }
        }

        return {
            id: `gen_${baseKey.toLowerCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name,
            description: `A ${rarity.toLowerCase()} weapon forged from ${material.name}.`,
            category: 'WEAPON' as const,
            type: base.type as any,
            twoHanded: base.twoHanded,
            damage: Math.round(damage),
            reach: Number(reach.toFixed(2)),
            cooldown: Number(cooldown.toFixed(2)),
            spread: Number(spread.toFixed(2)),
            damageType,
            rarity,
            itemColor,
            affixes,
            secondaryAbility,
            swordBeamModifier,
            chargeTime: secondaryAbility ? 1.5 : undefined,
            chargeManaCost: chargeManaCost !== undefined ? chargeManaCost : (secondaryAbility ? 20 : undefined),
            chargeStaminaCost,
            stackable: false,
            maxStack: 1,
            quantity: 1,
            spellId
        };
    }
}
