import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { defineStandardAnimalsRenderers } from './animals/standard_animals';
import { defineMountsRenderers } from './animals/mounts';
import { defineAquaticRenderers } from './animals/aquatic';
import { defineExoticRenderers } from './animals/exotic';

export function defineAnimalRenderers() {
    defineStandardAnimalsRenderers();
    defineMountsRenderers();
    defineAquaticRenderers();
    defineExoticRenderers();
}
