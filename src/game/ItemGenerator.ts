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
    { name: 'Green Metal', mult: 3.5, color: '#2e8b57', minLevel: 10 },
    { name: 'Mithril', mult: 5.0, color: '#e0ffff', minLevel: 15 },
    { name: 'Black Metal', mult: 7.0, color: '#333333', minLevel: 20 },
    { name: 'Void', mult: 10.0, color: '#4b0082', minLevel: 25 },
];

const PREFIXES: Record<string, { dmgMod: number, dmgType?: DamageType, desc: string, color?: string }> = {
    'Flaming': { dmgMod: 1.2, dmgType: 'FIRE', desc: 'Sears enemies with fire damage.', color: '#ff4500' },
    'Venomous': { dmgMod: 1.1, dmgType: 'ACID', desc: 'Coated in deadly poison causing acid damage.', color: '#32cd32' },
    'Electric': { dmgMod: 1.3, dmgType: 'LIGHTNING', desc: 'Crackles with lightning energy.', color: '#ffff00' },
    'Arcane': { dmgMod: 1.4, dmgType: 'ARCANE', desc: 'Infused with void arcane magic.', color: '#9932cc' },
    'Frost': { dmgMod: 1.1, dmgType: 'ICE', desc: 'Chills targets with ice damage.', color: '#00ffff' },
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

export class ItemGenerator {
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
        let itemColor = material.color;
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
            base = { name: 'Staff', reach: 8.0, cooldown: 1.0, spread: 0.1, twoHanded: true, damage: 15, category: 'WEAPON', type: Math.random() > 0.5 ? 'MAGIC_RANGED' : 'MAGIC_AOE' };
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
        let itemColor = material.color;
        let affixes: string[] = [];
        let secondaryAbility: string | undefined;

        if (isStaff) {
             const attackTypeLabel = base.type === 'MAGIC_RANGED' ? 'Bolt' : 'Ball';
             name = `${material.name} ${attackTypeLabel} Staff`;
             if (base.type === 'MAGIC_AOE') {
                 damage *= 1.5;
                 cooldown *= 1.5;
             }
        }

        // Distribute affixes between prefixes and suffixes
        const availablePrefixes = Object.keys(PREFIXES);
        
        const STAFF_SUFFIXES: Record<string, { ability: string, desc: string }> = {
            'of Blink': { ability: 'BLINK', desc: 'Allows the wielder to teleport short distances.' },
            'of Rat Summoning': { ability: 'SUMMON_RAT', desc: 'Summons aggressive rats to fight for you.' },
            'of Healing': { ability: 'MASS_HEAL', desc: 'Channels energy to heal the wielder and allies.' },
            'of Exploding Runes': { ability: 'EXPLODING_RUNES', desc: 'Places cascading explosive runes.' }
        };

        const availableSuffixes = isStaff ? Object.keys(STAFF_SUFFIXES) : Object.keys(SUFFIXES);
        
        let hasPrefix = false;
        let hasSuffix = false;

        for (let i = 0; i < numAffixes; i++) {
            if (!hasPrefix && (Math.random() > 0.5 || hasSuffix)) {
                // Add Prefix
                const pre = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
                const preData = PREFIXES[pre];
                
                if (isStaff) {
                   const attackTypeLabel = base.type === 'MAGIC_RANGED' ? 'Bolt' : 'Ball';
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
                hasPrefix = true;
                availablePrefixes.splice(availablePrefixes.indexOf(pre), 1);
            } else if (!hasSuffix) {
                // Add Suffix
                const suf = availableSuffixes[Math.floor(Math.random() * availableSuffixes.length)];
                name = `${name} ${suf}`;

                if (isStaff) {
                    const sufData = STAFF_SUFFIXES[suf];
                    secondaryAbility = sufData.ability;
                    affixes.push(`Secondary Attack: ${sufData.desc}`);
                } else {
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
            chargeTime: secondaryAbility ? 1.5 : undefined,
            chargeManaCost: secondaryAbility ? 20 : undefined,
            stackable: false,
            maxStack: 1,
            quantity: 1
        };
    }
}
