import type { Item } from '../../registries/ItemRegistry';
import { BLOCKS_ITEMS } from './materials/blocks';
import { AUTOMATION_ITEMS } from './materials/automation';
import { SPAWNERS_ITEMS } from './materials/spawners';
import { ANIMAL_DROPS_ITEMS } from './materials/animal_drops';
import { CRAFTED_MATERIALS_ITEMS } from './materials/crafted_materials';
import { MAGIC_AND_RARE_ITEMS } from './materials/magic_and_rare';
import { PLANTS_AND_FARMING_ITEMS } from './materials/plants_and_farming';
import { MISC_ITEMS } from './materials/misc';

export const MATERIAL_ITEMS: Record<string, Item> = {
    ...BLOCKS_ITEMS,
    ...AUTOMATION_ITEMS,
    ...SPAWNERS_ITEMS,
    ...ANIMAL_DROPS_ITEMS,
    ...CRAFTED_MATERIALS_ITEMS,
    ...MAGIC_AND_RARE_ITEMS,
    ...PLANTS_AND_FARMING_ITEMS,
    ...MISC_ITEMS,
};
