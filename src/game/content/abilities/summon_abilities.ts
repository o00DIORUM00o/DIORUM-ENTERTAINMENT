import { AbilityRegistry } from "../../registries/AbilityRegistry";
import { BlockType } from "../../constants/BlockType";
import { EntityRegistry } from "../../registries/EntityRegistry";

export function defineSummonAbilities() {
  AbilityRegistry.register(
    "SUMMON_SKELETON",
    ({ engine: e, x: o, y: a, z: s, caster: i }) => {
      e.skeletons.push({
        x: o + (Math.random() - 0.5) * 2,
        y: a + (Math.random() - 0.5) * 2,
        z: s,
        hp: 150,
        maxHp: 150,
        vx: 0,
        vy: 0,
        state: "WANDER",
        timer: 0,
        isFriendly: !0,
        owner: i,
        type: 'SKELETON'
      });
    },
  );

  AbilityRegistry.register(
    "SUMMON_ZOMBIE",
    ({ engine: e, x: o, y: a, z: s, caster: i }) => {
      // Zombies use the skeletal renderer for now in terms of array, wait! They are undead so probably skeletons array, since it renders zombies too (in undead.ts). Or use `entities`
      e.skeletons.push({
        x: o + (Math.random() - 0.5) * 2,
        y: a + (Math.random() - 0.5) * 2,
        z: s,
        hp: 300,
        maxHp: 300,
        vx: 0,
        vy: 0,
        state: "WANDER",
        timer: 0,
        isFriendly: !0,
        owner: i,
        type: 'zombie'
      });
    },
  );

  AbilityRegistry.register(
    "SUMMON_RAT",
    ({ engine: e, x: o, y: a, z: s, caster: i }) => {
      for (let c = 0; c < 3; c++)
        e.rats.push({
          id: "rat_summon_" + Math.random(),
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s,
          vx: 0,
          vy: 0,
          vz: 0,
          timer: 0,
          health: 50,
          maxHealth: 50,
          behavior: "AGGRESSIVE",
          type: "RAT",
          isFriendly: !0,
          owner: i,
          speed: 6,
          damage: 15,
        });
      for (let c = 0; c < 10; c++)
        e.particles.push({
          x: o,
          y: a,
          z: s + 1,
          text: "",
          color: "#8B4513",
          life: 1,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          vz: 5,
          speed: 0,
        });
    },
  );

  AbilityRegistry.register("SUMMON_BONE_PILE", ({ engine: e, aimAngle: i }) => {
    let o = Math.floor(e.player.x + Math.cos(i) * 2),
      a = Math.floor(e.player.y + Math.sin(i) * 2),
      s = Math.floor(e.player.z);
    if (e.world.getBlock(o, a, s) === 0) {
      e.world.setBlock(o, a, s, BlockType.BONE_PILE);
      for (let c = 0; c < 30; c++)
        e.particles.push({
          x: o + 0.5,
          y: a + 0.5,
          z: s + 0.5,
          text: "",
          color: "#D3D3D3",
          life: 1,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          vz: (Math.random() - 0.5) * 2,
        });
    }
  });

  AbilityRegistry.register(
    "SUMMON_WOLF",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.animals.push({
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        hp: 200,
        maxHp: 200,
        vx: 0,
        vy: 0,
        state: "CHASE",
        behavior: "AGGRESSIVE",
        timer: 0,
        isFriendly: !0,
        type: "WOLF",
        owner: s,
      });
    },
  );

  AbilityRegistry.register(
    "SUMMON_BEAR",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.animals.push({
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        hp: 600,
        maxHp: 600,
        vx: 0,
        vy: 0,
        state: "CHASE",
        behavior: "AGGRESSIVE",
        timer: 0,
        isFriendly: !0,
        type: "BEAR",
        owner: s,
      });
    },
  );

  AbilityRegistry.register(
    "SUMMON_WYRMLING",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.drakes.push({
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        health: 400,
        maxHealth: 400,
        vx: 0,
        vy: 0,
        state: "CHASE",
        behavior: "AGGRESSIVE",
        timer: 0,
        isFriendly: !0,
        type: "DRAKE",
        owner: s,
      });
    },
  );
}
