import type { Item } from '../../registries/ItemRegistry';
import { FOOD_ITEMS } from './consumables/food';
import { POTIONS_ITEMS } from './consumables/potions';
import { SCROLLS_ITEMS } from './consumables/scrolls';
import { RUNES_ITEMS } from './consumables/runes';
import { SPELLBOOKS_ITEMS } from './consumables/spellbooks';
import { SUMMONS_ITEMS } from './consumables/summons';
import { STRUCTURE_SPAWNERS_ITEMS } from './consumables/structure_spawners';
import { SEEDS_AND_HERBS_ITEMS } from './consumables/seeds_and_herbs';
import { MISC_ITEMS } from './consumables/misc';

export const CONSUMABLE_ITEMS: Record<string, Item> = {
    ...FOOD_ITEMS,
    ...POTIONS_ITEMS,
    ...SCROLLS_ITEMS,
    ...RUNES_ITEMS,
    ...SPELLBOOKS_ITEMS,
    ...SUMMONS_ITEMS,
    ...STRUCTURE_SPAWNERS_ITEMS,
    ...SEEDS_AND_HERBS_ITEMS,
    ...MISC_ITEMS,
};
