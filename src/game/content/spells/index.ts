import type { Spell } from '../../registries/ItemRegistry';
import { FIRE_SPELLS } from './fire_spells';
import { ICE_SPELLS } from './ice_spells';
import { ARCANE_SPELLS } from './arcane_spells';
import { NATURE_SPELLS } from './nature_spells';
import { DARK_SPELLS } from './dark_spells';
import { HOLY_SPELLS } from './holy_spells';
import { UTILITY_SPELLS } from './utility_spells';
import { COMBAT_SPELLS } from './combat_spells';

export const ALL_SPELLS: Record<string, Spell> = {
  ...FIRE_SPELLS,
  ...ICE_SPELLS,
  ...ARCANE_SPELLS,
  ...NATURE_SPELLS,
  ...DARK_SPELLS,
  ...HOLY_SPELLS,
  ...UTILITY_SPELLS,
  ...COMBAT_SPELLS,
};
