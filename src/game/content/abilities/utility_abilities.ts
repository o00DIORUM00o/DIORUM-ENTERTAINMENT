import { AbilityRegistry } from "../../registries/AbilityRegistry";
import { BlockType } from "../../constants/BlockType";

import { EntityRegistry } from "../../registries/EntityRegistry";

export function defineUtilityAbilities() {
  AbilityRegistry.register(
    "MASS_HEAL",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      ((e.player.health = Math.min(
        e.player.effectiveMaxHealth,
        e.player.health + 100,
      )),
        e.forEachEntity((c) => {
          (c.isFriendly || c.type === "npc" || c.type === "villager") &&
            (c.health !== void 0 &&
              (c.health = Math.min(c.maxHealth || 100, c.health + 100)),
            c.hp !== void 0 && (c.hp = Math.min(c.maxHp || 100, c.hp + 100)));
        }));
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o,
          y: a,
          z: s + 1,
          text: "➕",
          color: "#00ff00",
          life: 1,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: 2,
          speed: 0,
        });
    },
  );

  AbilityRegistry.register("INVISIBILITY", ({ engine: e, z: i }) => {
    ((e.player.buffs.invisibility = 15),
      e.player.talents.travel_caster >= 1 &&
        (e.player.buffs.invisibility = 25));
    for (let o = 0; o < 30; o++)
      e.particles.push({
        x: e.player.x,
        y: e.player.y,
        z: i,
        text: "",
        color: "#D3D3D3",
        life: 1,
        maxLife: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
      });
  });

  AbilityRegistry.register("BLINK", ({ engine: e, aimAngle: i, z: o }) => {
    let a = 5;
    e.player.talents.travel_caster >= 3 && (a = 8);
    let s = e.player.x + Math.cos(i) * a,
      c = e.player.y + Math.sin(i) * a;
    const f = Math.floor(s),
      u = Math.floor(c),
      m = Math.floor(e.player.z);
    e.world.getBlock(f, u, m) === 0 && ((e.player.x = s), (e.player.y = c));
    for (let _ = 0; _ < 20; _++)
      e.particles.push({
        x: s,
        y: c,
        z: o,
        text: "",
        color: "#C71585",
        life: 1,
        maxLife: 1,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
      });
  });

  AbilityRegistry.register("LEVITATE", ({ engine: e }) => {
    let i = 10;
    (e.player.talents.travel_caster >= 1 && (i = 15),
      (e.player.buffs.levitate = i));
  });

  AbilityRegistry.register("SPEED", ({ engine: e }) => {
    let i = 10;
    (e.player.talents.travel_caster >= 1 && (i = 15),
      (e.player.buffs.speed = i));
  });

  AbilityRegistry.register("HEAL", ({ engine: e }) => {
    let i = 25;
    (e.player.talents.arcane_healing >= 1 && (i += 10),
      (e.player.health = Math.min(
        e.player.effectiveMaxHealth,
        e.player.health + i,
      )));
  });

  AbilityRegistry.register("MAJOR_HEAL", ({ engine: e }) => {
    let i = 60;
    (e.player.talents.arcane_healing >= 1 && (i += 20),
      (e.player.health = Math.min(
        e.player.effectiveMaxHealth,
        e.player.health + i,
      )));
  });
}
