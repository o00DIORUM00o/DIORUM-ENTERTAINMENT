import type { Item } from '../../registries/ItemRegistry';
import { SWORDS_ITEMS } from './weapons/swords';
import { DAGGERS_AND_SPEARS_ITEMS } from './weapons/daggers_and_spears';
import { BOWS_AND_RANGED_ITEMS } from './weapons/bows_and_ranged';
import { STAVES_ITEMS } from './weapons/staves';
import { CLUBS_AND_HAMMERS_ITEMS } from './weapons/clubs_and_hammers';
import { TOOLS_ITEMS } from './weapons/tools';

export const WEAPON_ITEMS: Record<string, Item> = {
    ...SWORDS_ITEMS,
    ...DAGGERS_AND_SPEARS_ITEMS,
    ...BOWS_AND_RANGED_ITEMS,
    ...STAVES_ITEMS,
    ...CLUBS_AND_HAMMERS_ITEMS,
    ...TOOLS_ITEMS,
};
