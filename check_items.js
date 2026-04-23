import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllTsFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      getAllTsFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllTsFiles('src/game');
files.push(...getAllTsFiles('src/components'));
const usedItems = new Set();
const itemRegex = /ITEMS\['([a-zA-Z0-9_]+)'\]/g;

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  let match;
  while ((match = itemRegex.exec(content)) !== null) {
    usedItems.add(match[1]);
  }
}

const itemsDefinedString = readFileSync('src/game/content/items/consumable.ts', 'utf-8') + 
  readFileSync('src/game/content/items/material.ts', 'utf-8') +
  readFileSync('src/game/content/items/weapon.ts', 'utf-8') +
  readFileSync('src/game/content/items/armor.ts', 'utf-8') +
  readFileSync('src/game/content/items/misc.ts', 'utf-8') +
  readFileSync('src/game/content/items/ammo.ts', 'utf-8') +
  readFileSync('src/game/content/items/tool.ts', 'utf-8');

const missing = [];
for (const item of usedItems) {
  if (!itemsDefinedString.includes(`id: "${item}"`) && !itemsDefinedString.includes(`id: '${item}'`)) {
    missing.push(item);
  }
}

console.log("Missing items:", missing);
