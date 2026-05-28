const fs = require('fs');
const path = require('path');

const runedBlocks = [
    'stone', 'heavy_stone', 'marble', 'black_marble', 'green_marble', 
    'obsidian', 'red_stone', 'red_marble', 'black_stone', 'green_stone', 
    'blue_stone', 'blue_marble', 'orange_stone', 'orange_marble', 
    'purple_stone', 'purple_marble', 'yellow_stone', 'yellow_marble', 
    'brown_stone', 'brown_marble', 'moonstone', 'blood_stone', 
    'echo_stone', 'dungeon_brick', 'abyssal_brick'
];

let itemsContent = `import type { Item } from '../../../registries/ItemRegistry';

export const RUNED_BLOCK_ITEMS: Record<string, Item> = {
`;

runedBlocks.forEach(base => {
    const name = base.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    itemsContent += `    'runed_${base}': {
        id: "runed_${base}",
        name: "Runed ${name}",
        description: "A solid block of ${name} carved with a decorative rune. Can be placed in the world.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
`;
});

itemsContent += `};
`;

fs.writeFileSync(path.join(__dirname, 'src/game/content/items/misc_items/runed_blocks.ts'), itemsContent);

// Add to ITEM_TO_BLOCK.ts
let itemToBlockPath = path.join(__dirname, 'src/game/player/ItemToBlock.ts');
let itemToBlock = fs.readFileSync(itemToBlockPath, 'utf8');

let appends = ``;
runedBlocks.forEach(base => {
    appends += `    'runed_${base}': BlockType.RUNED_${base.toUpperCase()},\n`;
});

itemToBlock = itemToBlock.replace('};', appends + '};\n');
fs.writeFileSync(itemToBlockPath, itemToBlock);

// Add to misc.ts
let miscPath = path.join(__dirname, 'src/game/content/items/misc.ts');
let misc = fs.readFileSync(miscPath, 'utf8');

if (!misc.includes('RUNED_BLOCK_ITEMS')) {
    misc = misc.replace('import { SEEDS_ITEMS }', 'import { SEEDS_ITEMS } from \'./misc_items/seeds\';\nimport { RUNED_BLOCK_ITEMS } from \'./misc_items/runed_blocks\';');
    misc = misc.replace('...SEEDS_ITEMS,', '...SEEDS_ITEMS,\n    ...RUNED_BLOCK_ITEMS,');
    fs.writeFileSync(miscPath, misc);
}

console.log('done modifying items and itemToBlock!');
