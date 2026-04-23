const fs = require('fs');

const inventoryPath = './src/game/Inventory.ts';
const inventoryContent = fs.readFileSync(inventoryPath, 'utf8');

// I will just use regex to extract the large ITEMS object
const itemsStartStr = 'export const ITEMS: Record<string, Item> = {';
const spellsStartStr = 'export const SPELLS: Record<string, Spell> = {';

// It's probably easier to let the LLM do this in code using the abstract syntax tree, or just split it via manual `edit_file`.
