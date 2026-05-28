import type { Spell } from '../../registries/ItemRegistry';

export const DARK_SPELLS: Record<string, Spell> = {
  'rune_of_void': {
        id: "rune_of_void",
        name: "Rune of Void",
        description: "An abyssal rune that implodes space with a void blast.",
        manaCost: 50,
        cooldown: 14.0,
        damage: 180,
        reach: 6,
        spread: 0,
        damageType: "ARCANE",
        type: "AOE",
        castTime: 1.5,
        stackable: true,
        maxStack: 99
    },
};
