import type { Item } from '../../registries/ItemRegistry';
import { FURNITURE_AND_STATIONS_ITEMS } from './misc_items/furniture_and_stations';
import { TRAPS_AND_MECHANISMS_ITEMS } from './misc_items/traps_and_mechanisms';
import { STRUCTURES_AND_SPAWNERS_ITEMS } from './misc_items/structures_and_spawners';
import { DUNGEON_ITEMS_ITEMS } from './misc_items/dungeon_items';
import { CONTRACTS_AND_VEHICLES_ITEMS } from './misc_items/contracts_and_vehicles';
import { BLOCKS_AND_MATERIALS_ITEMS } from './misc_items/blocks_and_materials';
import { GEMS_AND_ORES_ITEMS } from './misc_items/gems_and_ores';
import { INGOTS_AND_METALS_ITEMS } from './misc_items/ingots_and_metals';
import { MISC_MATERIALS_ITEMS } from './misc_items/misc_materials';
import { SEEDS_ITEMS } from './misc_items/seeds';
import { RUNED_BLOCK_ITEMS } from './misc_items/runed_blocks';
import { NORTH_HEART_MATERIALS_ITEMS } from './misc_items/north_heart_materials';

export const MISC_ITEMS: Record<string, Item> = {
    ...FURNITURE_AND_STATIONS_ITEMS,
    ...TRAPS_AND_MECHANISMS_ITEMS,
    ...STRUCTURES_AND_SPAWNERS_ITEMS,
    ...DUNGEON_ITEMS_ITEMS,
    ...CONTRACTS_AND_VEHICLES_ITEMS,
    ...BLOCKS_AND_MATERIALS_ITEMS,
    ...GEMS_AND_ORES_ITEMS,
    ...INGOTS_AND_METALS_ITEMS,
    ...MISC_MATERIALS_ITEMS,
    ...SEEDS_ITEMS,
    ...RUNED_BLOCK_ITEMS,
    ...NORTH_HEART_MATERIALS_ITEMS,
};
