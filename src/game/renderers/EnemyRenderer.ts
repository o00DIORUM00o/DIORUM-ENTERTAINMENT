import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { defineHumanoidsRenderers } from './enemies/humanoids';
import { defineMonstersRenderers } from './enemies/monsters';
import { defineGoblinsOrcsRenderers } from './enemies/goblins_orcs';
import { defineUndeadRenderers } from './enemies/undead';
import { defineBeastsRenderers } from './enemies/beasts';
import { defineConstructsRenderers } from './enemies/constructs';
import { defineElementalsRenderers } from './enemies/elementals';
import { defineDragonsRenderers } from './enemies/dragons';
import { defineDinosaurFolkRenderers } from './enemies/dinosaur_folk';
import { defineOtherFolkRenderers } from './enemies/other_folk';
import { defineAbyssalVoidRenderers } from './enemies/abyssal_void';
import { defineFrostCasterRenderer } from './enemies/frost_casters';
import { defineWinterElfRenderer, defineYetiRenderer, defineFrostWolfRenderer } from './enemies/north_heart_creatures';

export function defineEnemyRenderers() {
    RenderRegistry.register('FROST_CASTER', defineFrostCasterRenderer());
    RenderRegistry.register('WINTER_ELF', defineWinterElfRenderer());
    RenderRegistry.register('YETI', defineYetiRenderer());
    RenderRegistry.register('FROST_WOLF', defineFrostWolfRenderer());
    defineHumanoidsRenderers();
    defineMonstersRenderers();
    defineGoblinsOrcsRenderers();
    defineUndeadRenderers();
    defineBeastsRenderers();
    defineConstructsRenderers();
    defineElementalsRenderers();
    defineDragonsRenderers();
    defineDinosaurFolkRenderers();
    defineOtherFolkRenderers();
    defineAbyssalVoidRenderers();
}
