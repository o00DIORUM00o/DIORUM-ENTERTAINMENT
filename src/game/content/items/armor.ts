import type { Item } from '../../registries/ItemRegistry';
import { FABRIC_ITEMS } from './armors/fabric';
import { LEATHER_ITEMS } from './armors/leather';
import { IRON_ITEMS } from './armors/iron';
import { DINO_AND_NATURE_ITEMS } from './armors/dino_and_nature';
import { RARE_AND_MAGIC_ITEMS } from './armors/rare_and_magic';
import { JEWELRY_ITEMS } from './armors/jewelry';

export const ARMOR_ITEMS: Record<string, Item> = {
    ...FABRIC_ITEMS,
    ...LEATHER_ITEMS,
    ...IRON_ITEMS,
    ...DINO_AND_NATURE_ITEMS,
    ...RARE_AND_MAGIC_ITEMS,
    ...JEWELRY_ITEMS,
};
