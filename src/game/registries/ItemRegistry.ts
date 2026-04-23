export type EquipmentSlot = 'MAIN_HAND' | 'OFF_HAND' | 'HEAD' | 'SHOULDERS' | 'BODY' | 'HANDS' | 'BELT' | 'LEGS' | 'FEET' | 'CLOAK' | 'RIGHT_RING' | 'LEFT_RING' | 'NECKLACE' | 'AMMO';

export const EQUIPMENT_SLOTS: EquipmentSlot[] = [
    'MAIN_HAND', 'OFF_HAND', 'HEAD', 'SHOULDERS', 'BODY', 'HANDS', 'BELT', 'LEGS', 'FEET', 'CLOAK', 'RIGHT_RING', 'LEFT_RING', 'NECKLACE', 'AMMO'
];

export type ItemCategory = 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'MISC' | 'AMMO' | 'MATERIAL' | 'TOOL';

export type DamageType = 'PHYSICAL' | 'FIRE' | 'ICE' | 'LIGHTNING' | 'ARCANE' | 'ACID' | 'MAGIC' | 'DIG' | 'ANIMATE_STONE' | 'BOOMERANG' | 'MAGIC_SWORD' | 'GRAPPLE' | 'PIERCING';

export interface TradeListing {
    itemToGive: { id: string, quantity: number, stackable?: boolean, maxStack?: number };
    cost: { id: string, quantity: number, stackable?: boolean, maxStack?: number }[];
}

export interface MerchantLootTable {
    guaranteed: TradeListing[];
    random: {
        rolls: number;
        pool: { listing: TradeListing, weight: number }[];
    };
}

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Item {
    secondaryAbility?: string;
    chargeTime?: number;
    chargeManaCost?: number;
    id: string;
    name: string;
    description: string;
    category: ItemCategory;
    quantity?: number;
    maxStack?: number;
    stackable?: boolean;
    manaCost?: number;
    projectileColor?: string;
    
    // Generator specific
    rarity?: Rarity;
    itemColor?: string;
    affixes?: string[];

    // Weapon specific
    ammoType?: string;
    type?: 'MELEE' | 'RANGED' | 'MAGIC_RANGED' | 'MAGIC_AOE';
    damageType?: DamageType;
    twoHanded?: boolean;
    damage?: number;
    reach?: number; // in tiles
    cooldown?: number; // in seconds
    spread?: number; // in radians (half-angle of the slash)
    projectileSpeed?: number; // in tiles per second
    statusEffect?: { type: 'burn' | 'poison' | 'chill' | 'bleed', chance: number, duration: number };
    // Consumable specific
    summonsMount?: string;
    spellId?: string;
    spellIds?: string[];
    healing?: number;
    manaRestore?: number;
    staminaRestore?: number;
    buff?: {
        speed?: number;
        maxHealth?: number;
        maxMana?: number;
        healthRegen?: number;
        manaRegen?: number;
        duration: number; // in seconds
    };
    chestInventory?: (Item | null)[];
    // Armor specific
    equipmentSlot?: EquipmentSlot;
    armorWeight?: 'LIGHT' | 'MEDIUM' | 'HEAVY';
    defense?: number;
    
    // Bonus Stat Modifiers
    lifesteal?: number;
    bonusHealth?: number;
    bonusMana?: number;
    healthRegen?: number;
    manaRegen?: number;
    speedBonus?: number;
    bonusDamage?: number;
}

export interface Spell {
    id: string;
    name: string;
    description: string;
    manaCost: number;
    cooldown: number;
    damage: number;
    reach: number;
    spread: number;
    damageType: DamageType;
    type?: 'CONE' | 'PROJECTILE' | 'AOE' | 'UTILITY';
    projectileSpeed?: number;
    castTime?: number;
    stackable?: boolean;
    maxStack?: number;
    statusEffect?: { type: 'burn' | 'poison' | 'chill' | 'bleed', chance: number, duration: number };
}

class Registry {
    private items: Map<string, Item> = new Map();
    private spells: Map<string, Spell> = new Map();

    public registerItem(item: Item) {
        this.items.set(item.id, item);
    }
    
    public registerSpell(spell: Spell) {
        this.spells.set(spell.id, spell);
    }

    public getItem(id: string): Item {
        return this.items.get(id) || { id: 'unknown', name: 'Unknown Item (' + id + ')', description: 'Missing item definition', category: 'MISC' };
    }

    public getSpell(id: string): Spell {
        return this.spells.get(id) || { id: 'unknown', name: 'Unknown Spell (' + id + ')', description: 'Missing definition', manaCost: 0, cooldown: 0, damage: 0, reach: 0, spread: 0, damageType: 'PHYSICAL' };
    }

    public getAllItems(): Record<string, Item> {
        const obj: Record<string, Item> = {};
        for (const [k, v] of this.items.entries()) obj[k] = v;
        return obj;
    }
    
    public getAllSpells(): Record<string, Spell> {
        const obj: Record<string, Spell> = {};
        for (const [k, v] of this.spells.entries()) obj[k] = v;
        return obj;
    }
}

export const ItemRegistry = new Registry();

export function defineItems(items: Record<string, Item>) {
    for (const key of Object.keys(items)) {
        ItemRegistry.registerItem(items[key]);
    }
}

export function defineSpells(spells: Record<string, Spell>) {
    for (const key of Object.keys(spells)) {
        ItemRegistry.registerSpell(spells[key]);
    }
}
