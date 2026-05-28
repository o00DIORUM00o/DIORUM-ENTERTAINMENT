import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { defineVillagersRenderers } from './npcs/villagers';
import { defineMerchantsRenderers } from './npcs/merchants';
import { defineMiscFolkRenderers } from './npcs/misc_folk';
import { definePetsRenderers } from './npcs/pets';

export function defineNPCRenderers() {
    defineVillagersRenderers();
    defineMerchantsRenderers();
    defineMiscFolkRenderers();
    definePetsRenderers();
}
