import { CORE_BLOCKS } from './src/game/content/blocks/core_blocks';
import { ITEMS } from './src/game/Inventory';
import { getLootForBlock, BLOCK_LOOT_TABLES } from './src/game/content/loot/LootTables';
import { BlockRegistry } from './src/game/registries/BlockRegistry';

let errors = [];

// Blocks handled manually in PlayerBlockInteraction.ts
const manuallyHandled = [
    'dummy', 'bee_hive', 'chest', 'trunk', 'tropical_wood',
    'giant_mushroom_stalk', 'giant_mushroom_cap_red', 'giant_mushroom_cap_brown',
    'glowcap_mushroom',
    'bush', 'fern', 'red_berry_bush', 'blue_berry_bush', 'black_berry_bush', 'yellow_berry_bush',
    'weeds', 'crop_stage_1', 'crop_stage_2', 'crop_stage_3', 'seedling_red', 'seedling_blue', 'seedling_black', 'seedling_yellow', 'water', 'tilled_soil_dry', 'tilled_soil_wet'
];

for (const block of CORE_BLOCKS) {
    if (block.isIndestructible) continue; // It's fine if unbreakable blocks drop nothing

    if (manuallyHandled.includes(block.id)) {
        continue;
    }

    // Check if it has a manual table
    if (BLOCK_LOOT_TABLES[block.type]) {
       const drop = BLOCK_LOOT_TABLES[block.type]();
       if(drop.length > 0) continue;
    }

    if (!ITEMS[block.id]) {
        // Fallback would fail!
        errors.push(block.id + " (" + block.type + ") has no item drop!");
    }
}

console.log("Found " + errors.length + " destructible blocks that drop nothing.");
console.log(errors.join('\n'));
