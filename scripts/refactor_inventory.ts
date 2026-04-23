import * as fs from 'fs';
import * as path from 'path';

const invPath = path.resolve('./src/game/Inventory.ts');
const text = fs.readFileSync(invPath, 'utf8');

const merchantTablesMatch = text.match(/(export const MERCHANT_TABLES[\s\S]+?)export const ITEMS/);
if (!merchantTablesMatch) {
    throw new Error("Could not find MERCHANT_TABLES");
}

let newContent = `import { 
    EQUIPMENT_SLOTS, ItemRegistry, defineItems, defineSpells 
} from './registries/ItemRegistry';

import type { EquipmentSlot, ItemCategory, DamageType, TradeListing, MerchantLootTable, Item, Spell } from './registries/ItemRegistry';

export {
    EQUIPMENT_SLOTS
};

export type {
    EquipmentSlot, ItemCategory, DamageType, TradeListing, 
    MerchantLootTable, Item, Spell
};

import { ALL_SPELLS } from './content/spells/spells';
import { WEAPON_ITEMS } from './content/items/weapon';
import { ARMOR_ITEMS } from './content/items/armor';
import { CONSUMABLE_ITEMS } from './content/items/consumable';
import { MISC_ITEMS } from './content/items/misc';
import { AMMO_ITEMS } from './content/items/ammo';
import { MATERIAL_ITEMS } from './content/items/material';
import { TOOL_ITEMS } from './content/items/tool';

defineSpells(ALL_SPELLS);
defineItems(WEAPON_ITEMS);
defineItems(ARMOR_ITEMS);
defineItems(CONSUMABLE_ITEMS);
defineItems(MISC_ITEMS);
defineItems(AMMO_ITEMS);
defineItems(MATERIAL_ITEMS);
defineItems(TOOL_ITEMS);

export const SPELLS = ItemRegistry.getAllSpells();
export const ITEMS = ItemRegistry.getAllItems();

${merchantTablesMatch[1]}
`;

fs.writeFileSync(invPath, newContent);
console.log('Successfully re-wrote Inventory.ts');
