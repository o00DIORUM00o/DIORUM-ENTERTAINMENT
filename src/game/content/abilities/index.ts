import { defineSummonAbilities } from "./summon_abilities";
import { defineMagicAbilities } from "./magic_abilities";
import { defineCombatAbilities } from "./combat_abilities";
import { defineUtilityAbilities } from "./utility_abilities";

export function defineCoreAbilities() {
  defineSummonAbilities();
  defineMagicAbilities();
  defineCombatAbilities();
  defineUtilityAbilities();
}
