import { BlockDef } from '../../registries/BlockRegistry';

import { BELLS_BLOCKS } from './bells';
import { CRAFTING_BLOCKS } from './crafting';
import { MISC_BLOCKS } from './misc';
import { STRUCTURES_BLOCKS } from './structures';
import { TERRAIN_BLOCKS } from './terrain';
import { STONE_BLOCKS } from './stone';
import { LIQUIDS_BLOCKS } from './liquids';
import { WOOD_BLOCKS } from './wood';
import { DOORS_BLOCKS } from './doors';
import { CHESTS_BLOCKS } from './chests';
import { LIGHTING_BLOCKS } from './lighting';
import { FLORA_BLOCKS } from './flora';
import { ORES_BLOCKS } from './ores';
import { NORTH_HEART_BLOCKS } from './north_heart';

export const CORE_BLOCKS: BlockDef[] = [
    ...BELLS_BLOCKS,
    ...CRAFTING_BLOCKS,
    ...MISC_BLOCKS,
    ...STRUCTURES_BLOCKS,
    ...TERRAIN_BLOCKS,
    ...STONE_BLOCKS,
    ...LIQUIDS_BLOCKS,
    ...WOOD_BLOCKS,
    ...DOORS_BLOCKS,
    ...CHESTS_BLOCKS,
    ...LIGHTING_BLOCKS,
    ...FLORA_BLOCKS,
    ...ORES_BLOCKS,
    ...NORTH_HEART_BLOCKS
];
