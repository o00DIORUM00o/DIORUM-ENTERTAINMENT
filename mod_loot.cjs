const fs = require('fs');

let lootTables = fs.readFileSync('src/game/content/loot/LootTables.ts', 'utf8');
const lootAdditions = `
    [BlockType.PERMAFROST]: () => [{ item: ITEMS['permafrost'] }],
    [BlockType.FROZEN_WOOD]: () => [{ item: ITEMS['frozen_wood'] }],
    [BlockType.FROZEN_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['frozen_wood'] }] : [],
    [BlockType.GLACIAL_ICE]: () => [{ item: ITEMS['glacial_ice'] }],
    [BlockType.GLACIAL_CRYSTAL_ORE]: () => [{ item: ITEMS['glacial_crystal'] }, { item: ITEMS['permafrost'] }],
    [BlockType.STAR_METAL_ORE]: () => [{ item: ITEMS['star_metal_ore'] }],
    [BlockType.WINTER_ELF_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.YETI_CAVE]: () => [{ item: ITEMS['stone'] }],
`;
// find a place to insert
lootTables = lootTables.replace('    [BlockType.POT]:', lootAdditions + '\n    [BlockType.POT]:');
fs.writeFileSync('src/game/content/loot/LootTables.ts', lootTables);
