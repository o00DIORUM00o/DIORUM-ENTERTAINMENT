import { AbilityRegistry } from "../../registries/AbilityRegistry";
import { BlockType } from "../../constants/BlockType";

function getSummonDuration(caster: any): number {
    let duration = 10;
    const conj = caster.talents?.['conjure_caster']?.level || 0;
    const necro = caster.talents?.['necromancy']?.level || 0;
    if (conj > 0) duration += 15;
    if (conj > 2) duration += 30;
    if (necro > 0) duration += 10;
    return duration;
}

function enforceSummonCap(engine: any, caster: any) {
    const conj = caster.talents?.['conjure_caster']?.level || 0;
    const necro = caster.talents?.['necromancy']?.level || 0;
    const cap = 1 + Math.floor(conj / 2) + Math.floor(necro / 2);

    const summons: any[] = [];
    if (engine.forEachEntity) {
        engine.forEachEntity((ent: any) => {
            if (ent.isFriendly && ent.owner === caster) {
                summons.push(ent);
            }
        });
    }

    if (summons.length >= cap) {
        summons.sort((a, b) => (a.expirationTimer || 0) - (b.expirationTimer || 0));
        while (summons.length >= cap) {
            const oldest = summons.shift();
            if (oldest) {
                if (oldest.hp !== undefined) oldest.hp = -999;
                if (oldest.health !== undefined) oldest.health = -999;
            }
        }
    }
}

export function defineSummonAbilities() {
  AbilityRegistry.register(
    "SUMMON_SKELETON",
    ({ engine: e, x: o, y: a, z: s, caster: i }) => {
      enforceSummonCap(e, i);
      e.skeletons.push({
        expirationTimer: getSummonDuration(i),
        x: o + (Math.random() - 0.5) * 2,
        y: a + (Math.random() - 0.5) * 2,
        z: s,
        health: 150,
        maxHealth: 150,
        damage: 10,
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
      enforceSummonCap(e, i);
      e.skeletons.push({
        expirationTimer: getSummonDuration(i),
        x: o + (Math.random() - 0.5) * 2,
        y: a + (Math.random() - 0.5) * 2,
        z: s,
        health: 300,
        maxHealth: 300,
        damage: 20,
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
      enforceSummonCap(e, i);
      for (let c = 0; c < 1; c++)
        e.rats.push({
          expirationTimer: getSummonDuration(i),
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
      e.world.setBlock(o, a, s, BlockType.BONE_PILE_SPAWNER);
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
      enforceSummonCap(e, s);
      e.animals.push({
        expirationTimer: getSummonDuration(s),
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        health: 200,
        maxHealth: 200,
        damage: 15,
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
      enforceSummonCap(e, s);
      e.animals.push({
        expirationTimer: getSummonDuration(s),
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        health: 600,
        maxHealth: 600,
        damage: 25,
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
      enforceSummonCap(e, s);
      e.drakes.push({
        expirationTimer: getSummonDuration(s),
        x: i + (Math.random() - 0.5) * 2,
        y: o + (Math.random() - 0.5) * 2,
        z: a,
        health: 400,
        maxHealth: 400,
        damage: 35,
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
