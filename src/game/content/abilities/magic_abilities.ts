import { AbilityRegistry } from "../../registries/AbilityRegistry";
import { BlockType } from "../../constants/BlockType";

import { EntityRegistry } from "../../registries/EntityRegistry";

export function defineMagicAbilities() {
  AbilityRegistry.register(
    "METEOR",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = i + Math.cos(s) * 8,
        f = o + Math.sin(s) * 8;
      for (let u = 0; u < 40; u++)
        e.particles.push({
          x: c,
          y: f,
          z: a + 4 - Math.random() * 2,
          text: "",
          color: "#ff4500",
          life: 1,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          vz: (Math.random() - 0.5) * 8,
          speed: 0,
        });
      e.forEachEntity((u) => {
        Math.sqrt((u.x - c) ** 2 + (u.y - f) ** 2) <= 6 &&
          (u.health !== void 0 && (u.health -= 150),
          u.hp !== void 0 && (u.hp -= 150));
      });
    },
  );

  AbilityRegistry.register("ROOT", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 15 &&
        !a.isFriendly &&
        a.type !== "npc" &&
        a.type !== "villager" &&
        (a.vx !== void 0 && (a.vx = 0),
        a.vy !== void 0 && (a.vy = 0),
        (a.rootTimer = 5));
    });
  });

  AbilityRegistry.register(
    "LAVA_PUDDLE",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = i + Math.cos(s) * 8,
        f = o + Math.sin(s) * 8;
      for (let u = -1; u <= 1; u++)
        for (let m = -1; m <= 1; m++)
          e.world.setBlock(
            Math.floor(c + u),
            Math.floor(f + m),
            Math.floor(a - 1),
            BlockType.LAVA,
          );
    },
  );

  AbilityRegistry.register(
    "METEOR_SHOWER",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = i + Math.cos(s) * 8,
        f = o + Math.sin(s) * 8;
      for (let u = 0; u < 15; u++) {
        const m = c + (Math.random() - 0.5) * 16,
          _ = f + (Math.random() - 0.5) * 16;
        setTimeout(() => {
          const g = e.world.getSurface(m, _, a + 5) || a;
          e.aoeEffects.push({
            x: m,
            y: _,
            z: g,
            radius: 0,
            maxRadius: 6,
            life: 0.5,
            maxLife: 0.5,
            damageType: "EXPLOSION",
          });
          for (let y = 0; y < 30; y++)
            e.particles.push({
              x: m,
              y: _,
              z: g + Math.random() * 2,
              text: "",
              color: "#ff4500",
              life: 1,
              maxLife: 1,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              vz: (Math.random() - 0.5) * 10 + 2,
              speed: 0,
            });
          e.forEachEntity((y) => {
            Math.sqrt((y.x - m) ** 2 + (y.y - _) ** 2) <= 6 &&
              !y.isFriendly &&
              y.type !== "npc" &&
              y.type !== "villager" &&
              (y.health !== void 0 && (y.health -= 200),
              y.hp !== void 0 && (y.hp -= 200));
          });
        }, Math.random() * 2500);
      }
    },
  );

  AbilityRegistry.register(
    "FROST_NOVA",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 16; c++) {
        const f = ((Math.PI * 2) / 16) * c;
        e.projectiles.push({
          x: o,
          y: a,
          z: s + 0.5,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          damage: 40,
          damageType: "ICE",
          life: 2,
          maxLife: 2,
          isPlayerProjectile: !0,
        });
      }
    },
  );

  AbilityRegistry.register(
    "BLACK_HOLE",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = i + Math.cos(s) * 8,
        f = o + Math.sin(s) * 8;
      e.entities.push({
        type: "black_hole",
        x: c,
        y: f,
        z: a,
        lifeTime: 5,
        timer: 0,
        health: 9999,
        maxHealth: 9999,
        vx: 0,
        vy: 0,
      });
    },
  );

  AbilityRegistry.register("TIME_STOP", ({ engine: e }) => {
    e.timeStopTimer = 5;
  });

  AbilityRegistry.register(
    "EXPLODING_RUNES",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 3; c++)
        e.bombs.push({
          x: o + (Math.random() - 0.5) * 6,
          y: a + (Math.random() - 0.5) * 6,
          z: s,
          timer: c * 0.5 + 1,
          damage: 100,
        });
    },
  );

  AbilityRegistry.register("PUSH_BACK", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      if (
        !a.isFriendly &&
        a.type !== "npc" &&
        a.type !== "villager" &&
        Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 10
      ) {
        const c = Math.atan2(a.y - o, a.x - i);
        (a.vx !== void 0 && (a.vx = Math.cos(c) * 20),
          a.vy !== void 0 && (a.vy = Math.sin(c) * 20));
      }
    });
  });

  AbilityRegistry.register(
    "FEAR",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      e.forEachEntity((c) => {
        !c.isFriendly &&
          c.health > 0 &&
          Math.hypot(c.x - e.player.x, c.y - e.player.y) < 8 &&
          ((c.customData = c.customData || {}), (c.customData.fear = 10));
      });
      for (let c = 0; c < 40; c++)
        e.particles.push({
          x: e.player.x + (Math.random() - 0.5) * 10,
          y: e.player.y + (Math.random() - 0.5) * 10,
          z: s + Math.random() * 3,
          text: "",
          color: "#9932CC",
          life: 0.5,
          maxLife: 0.5,
          vx: 0,
          vy: 0,
          vz: 0,
        });
    },
  );

  AbilityRegistry.register("MAGIC_BLOCK", ({ engine: e, aimAngle: i }) => {
    let o = 3,
      a = Math.floor(e.player.x + Math.cos(i) * o),
      s = Math.floor(e.player.y + Math.sin(i) * o),
      c = Math.floor(e.player.z);
    e.world.getBlock(a, s, c) === 0 &&
      (e.world.setBlock(a, s, c, 92),
      e.world.respawningBlocks.set(`${a},${s},${c}`, { type: 0, timer: 30 }));
  });

  AbilityRegistry.register("EXPLODING_RUNE", ({ engine: e }) => {
    e.entities.push({
      id: Math.random().toString(36).substr(2, 9),
      type: "exploding_rune",
      x: Math.floor(e.player.x) + 0.5,
      y: Math.floor(e.player.y) + 0.5,
      z: e.player.z,
      hp: 1,
      maxHp: 1,
      state: "idle",
      timer: 0,
      friendly: !0,
      lifeTime: 300,
    });
  });

  AbilityRegistry.register("ARCANE_LIGHT", ({ engine: e }) => {
    e.entities.push({
      id: Math.random().toString(36).substr(2, 9),
      type: "arcane_light",
      x: e.player.x,
      y: e.player.y,
      z: e.player.z + 1.5,
      hp: 1,
      maxHp: 1,
      state: "idle",
      timer: 0,
      friendly: !0,
      lifeTime: 300,
    });
  });

  AbilityRegistry.register(
    "PROTECTION_CIRCLE",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      (e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 4,
        life: 10,
        maxLife: 10,
        damageType: "AURA",
        isHealing: !0,
        owner: s,
      }),
        s &&
          ((s.defense = (s.defense || 0) + 10),
          setTimeout(() => {
            s && (s.defense -= 10);
          }, 1e4),
          s.onMessage && s.onMessage("Protection Circle active!")));
    },
  );

  AbilityRegistry.register(
    "FIRE_CIRCLE",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 6,
        life: 10,
        maxLife: 10,
        damageType: "FIRE",
        damage: 10,
        owner: s,
      });
    },
  );

  AbilityRegistry.register("MIST_FORM", ({ engine: e }) => {
    ((e.player.buffs.mistForm = 15),
      e.player.onMessage && e.player.onMessage("You dissolve into mist..."));
  });

  AbilityRegistry.register(
    "CHAIN_LIGHTNING",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = (b, N, M) => {
        let w = null,
          O = 1 / 0;
        return (
          e.forEachEntity((x) => {
            if (
              x.isFriendly ||
              x.type === "npc" ||
              x.type === "villager" ||
              !x.id ||
              M.has(x.id)
            )
              return;
            const v = Math.hypot(x.x - b, x.y - N),
              C = Math.abs((x.z || 0) - a);
            v < 12 && C < 5 && v < O && ((O = v), (w = x));
          }),
          w
        );
      };
      let f = null,
        u = 1 / 0;
      e.forEachEntity((b) => {
        if (b.isFriendly || b.type === "npc" || b.type === "villager" || !b.id)
          return;
        const N = b.x - i,
          M = b.y - o,
          w = Math.hypot(N, M),
          O = Math.abs((b.z || 0) - a);
        if (w < 15 && O < 5) {
          let x = Math.atan2(M, N),
            v = Math.abs(x - s);
          for (; v > Math.PI; ) v -= Math.PI * 2;
          ((v = Math.abs(v)), v < 0.8 && w < u && ((u = w), (f = b)));
        }
      });
      const m = new Set();
      let _ = i,
        g = o,
        y = a + 0.5,
        R = f || c(_, g, m);
      for (let b = 0; b < 4 && R; b++) {
        m.add(R.id);
        let N = R.health !== void 0 ? "health" : "hp";
        (R[N] !== void 0 && (R[N] -= 40),
          R.stunTimer !== void 0 && (R.stunTimer = 1),
          e.particles.push({
            x: R.x,
            y: R.y,
            z: R.z + 0.5,
            text: "-40",
            color: "#ffff00",
            life: 1,
            maxLife: 1,
            vy: -2,
          }),
          Math.hypot(R.x - _, R.y - g));
        for (let M = 0; M <= 10; M++)
          e.particles.push({
            x: _ + (R.x - _) * (M / 10),
            y: g + (R.y - g) * (M / 10),
            z: y + ((R.z || 0) + 0.5 - y) * (M / 10),
            text: "",
            color: "#ffff00",
            life: 0.5,
            maxLife: 0.5,
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5,
          });
        ((_ = R.x), (g = R.y), (y = (R.z || 0) + 0.5), (R = c(_, g, m)));
      }
    },
  );

  AbilityRegistry.register("STONE_CREATION", ({ engine: e, caster: i }) => {
    if (!i) return;
    const o = i.aimAngle || 0,
      a = Math.floor((i.x + Math.cos(o) * 32) / 16),
      s = Math.floor((i.y + Math.sin(o) * 32) / 16),
      c = Math.floor(i.z);
    let f = !1;
    for (let u = 0; u < 3; u++)
      if (e.world.getBlock(a, s, c + u) === 0) {
        (e.world.setBlock(a, s, c + u, 3), (f = !0));
        break;
      }
    if (!f) {
      const u = Math.floor(i.x / 16);
      e.world.setBlock(u, s, c - 1, 3);
    }
    i.onMessage && i.onMessage("Stone Conjured!");
  });

  AbilityRegistry.register("FLIGHT", ({ engine: e, caster: i }) => {
    i &&
      ((i.vz = 25),
      i.statuses && (i.statuses.slowFall = 30),
      i.onMessage && i.onMessage("Up, up and away!"));
  });

  AbilityRegistry.register("GARDENER", ({ engine: e, caster: i }) => {
    if (!i) return;
    const o = 3,
      a = Math.floor(i.x / 16),
      s = Math.floor(i.y / 16),
      c = Math.floor(i.z - 1);
    let f = 0;
    for (let u = -o; u <= o; u++)
      for (let m = -o; m <= o; m++)
        if (u * u + m * m <= o * o) {
          const _ = e.world.getBlock(a + u, s + m, c);
          (_ === 2 || _ === 1) && (e.world.setBlock(a + u, s + m, c, 245), f++);
        }
    i.onMessage && i.onMessage(`Tilled ${f} blocks of soil!`);
  });

  AbilityRegistry.register(
    "SPIN_FROST_NOVA",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      AbilityRegistry.cast("FROST_NOVA", {
        engine: e,
        caster: i,
        x: o,
        y: a,
        z: s,
        aimAngle: 0,
      });
    },
  );

  AbilityRegistry.register(
    "SPIN_FLAME_WAVE",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 6,
        life: 1,
        maxLife: 1,
        damageType: "FIRE",
        damage: 30,
        owner: s,
      });
    },
  );

  AbilityRegistry.register("SPIN_VOID_PULL", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      if (
        !a.isFriendly &&
        a.type !== "npc" &&
        a.type !== "villager" &&
        Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 8
      ) {
        const c = Math.atan2(o - a.y, i - a.x);
        (a.vx !== void 0 && (a.vx = Math.cos(c) * 15),
          a.vy !== void 0 && (a.vy = Math.sin(c) * 15));
      }
    });
  });

  AbilityRegistry.register(
    "SPIN_BLOOD_THIRST",
    ({ engine: e, caster: i, x: o, y: a }) => {
      let s = 0;
      (e.forEachEntity((c) => {
        Math.sqrt((c.x - o) ** 2 + (c.y - a) ** 2) <= 4 &&
          !c.isFriendly &&
          c.type !== "npc" &&
          c.type !== "villager" &&
          (c.health !== void 0 && (c.health -= 25),
          c.hp !== void 0 && (c.hp -= 25),
          s++);
      }),
        i &&
          s > 0 &&
          (i.health = Math.min(i.effectiveMaxHealth, i.health + s * 10)));
    },
  );

  AbilityRegistry.register(
    "SPIN_SHADOW_STEP",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      let c = null,
        f = 15;
      if (
        (e.forEachEntity((u) => {
          if (!u.isFriendly && u.type !== "npc" && u.type !== "villager") {
            const m = Math.sqrt((u.x - o) ** 2 + (u.y - a) ** 2);
            m < f && ((f = m), (c = u));
          }
        }),
        c && i)
      ) {
        const u = Math.atan2(c.y - a, c.x - o);
        ((i.x = c.x - Math.cos(u) * 1.5), (i.y = c.y - Math.sin(u) * 1.5));
      }
    },
  );

  AbilityRegistry.register("SPIN_EARTHQUAKE", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 6 &&
        !a.isFriendly &&
        a.type !== "npc" &&
        a.type !== "villager" &&
        (a.stunTimer = 3);
    });
  });

  AbilityRegistry.register(
    "SPIN_WIND_BLADE",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      for (let c = 0; c < 8; c++) {
        const f = (Math.PI / 4) * c;
        e.projectiles.push({
          x: i,
          y: o,
          z: a + 0.5,
          vx: Math.cos(f) * 20,
          vy: Math.sin(f) * 20,
          damage: 20,
          life: 1,
          damageType: "PHYSICAL",
          isPlayer: !0,
          owner: s,
        });
      }
    },
  );

  AbilityRegistry.register("SPIN_LIGHT_BURST", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 6 &&
        !a.isFriendly &&
        a.type !== "npc" &&
        a.type !== "villager" &&
        (a.health !== void 0 && (a.health -= 30),
        a.hp !== void 0 && (a.hp -= 30),
        (a.stunTimer = 1));
    });
  });

  AbilityRegistry.register(
    "SPIN_POISON_WAVE",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 4,
        life: 1,
        maxLife: 1,
        damageType: "POISON",
        damage: 15,
        statusEffect: { type: "poison", chance: 1, duration: 5 },
        owner: s,
      });
    },
  );

  AbilityRegistry.register(
    "SPIN_METEOR_SMASH",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      (i && (i.vz = 15),
        setTimeout(() => {
          e.aoeEffects.push({
            x: i ? i.x : o,
            y: i ? i.y : a,
            z: i ? i.z : s,
            radius: 0,
            maxRadius: 5,
            life: 0.5,
            maxLife: 0.5,
            damageType: "EXPLOSION",
            owner: i,
          });
        }, 300));
    },
  );

  AbilityRegistry.register("SPIN_TIME_STOP", ({ engine: e, x: i, y: o }) => {
    e.forEachEntity((a) => {
      Math.sqrt((a.x - i) ** 2 + (a.y - o) ** 2) <= 8 &&
        !a.isFriendly &&
        a.type !== "npc" &&
        (a.stunTimer = 5);
    });
  });

  AbilityRegistry.register(
    "SPIN_ARCANE_BLAST",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 6,
        life: 0.5,
        maxLife: 0.5,
        damageType: "ARCANE",
        damage: 60,
        owner: s,
      });
    },
  );

  AbilityRegistry.register(
    "SPIN_HOLY_CROSS",
    ({ engine: e, x: i, y: o, z: a, caster: s }) => {
      e.aoeEffects.push({
        x: i,
        y: o,
        z: a,
        radius: 0,
        maxRadius: 4,
        life: 5,
        maxLife: 5,
        damageType: "MAGIC",
        damage: 10,
        owner: s,
      });
    },
  );

  AbilityRegistry.register(
    "SPIN_SPECTRAL_BLADES",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 3; c++) {
        const f = Math.random() * Math.PI * 2;
        e.projectiles.push({
          x: o,
          y: a,
          z: s + 1,
          vx: Math.cos(f) * 10,
          vy: Math.sin(f) * 10,
          damage: 25,
          life: 5,
          isPlayer: !0,
          isHoming: !0,
          damageType: "MAGIC_SWORD",
          owner: i,
        });
      }
    },
  );

  AbilityRegistry.register(
    "SPIN_DRAGON_BREATH",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      if (!i) return;
      const f = 12;
      for (let u = 0; u < f; u++)
        setTimeout(() => {
          const m = c + (Math.random() - 0.5) * 0.5,
            _ = 12 + Math.random() * 5;
          e.projectiles.push({
            x: i.x,
            y: i.y,
            z: i.z + 1,
            vx: Math.cos(m) * _,
            vy: Math.sin(m) * _,
            damage: 15,
            life: 1.5,
            damageType: "FIRE",
            isPlayer: !0,
            owner: i,
            scale: 2,
            pierce: !0,
            statusEffect: { type: "burn", chance: 0.3, duration: 4 },
          });
        }, u * 50);
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_DESTRUCTION",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#ff00ff",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#8a2be2",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_GRAVITY",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 80; c++) {
        const f = Math.random() * Math.PI * 2,
          u = 6 + Math.random() * 2;
        e.particles.push({
          x: o + Math.cos(f) * u,
          y: a + Math.sin(f) * u,
          z: s + Math.random() * 4,
          vx: -Math.cos(f) * 5,
          vy: -Math.sin(f) * 5,
          vz: -0.5,
          text: "○",
          color: "#4b0082",
          life: 1.5,
          maxLife: 1.5,
          speed: 0.2,
        });
      }
      e.forEachEntity((c) => {
        const f = (c.x - o) ** 2 + (c.y - a) ** 2;
        if (f <= 36 && f > 1) {
          const u = Math.sqrt(f);
          ((c.vx = (-(c.x - o) / u) * 5), (c.vy = (-(c.y - a) / u) * 5));
        }
      });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_FIRE",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#ff4500",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#ff0000",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_ICE",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#00ffff",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#add8e6",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_LIGHTNING",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#ffff00",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#ffeb3b",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_ACID",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#32cd32",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#00ff00",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_ARCANE",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#8a2be2",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#9400d3",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_HOLY",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#fffacd",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#ffffe0",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_VOID",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      for (let c = 0; c < 60; c++) {
        const f = (c / 60) * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 1,
          y: a + Math.sin(f) * 1,
          z: s + 0.1,
          vx: Math.cos(f) * 15,
          vy: Math.sin(f) * 15,
          vz: 0,
          text: "▼",
          color: "#4b0082",
          life: 1,
          maxLife: 1,
          speed: 0.1,
        });
      }
      for (let c = 0; c < 20; c++)
        e.particles.push({
          x: o + (Math.random() - 0.5) * 2,
          y: a + (Math.random() - 0.5) * 2,
          z: s + 1,
          vx: 0,
          vy: 0,
          vz: 15,
          text: "▲",
          color: "#000000",
          life: 0.5,
          maxLife: 0.5,
          speed: 0.2,
        });
    },
  );

  AbilityRegistry.register(
    "RUNE_OF_LIFE",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      (i.health
        ? (i.health = Math.min(i.maxHealth || 100, i.health + 100))
        : i.hp && (i.hp = Math.min(i.maxHp || 100, i.hp + 100)),
        i.buffs &&
          (i.buffs.healthRegen = Math.max(i.buffs.healthRegen || 0, 10)));
      for (let c = 0; c < 40; c++) {
        const f = Math.random() * Math.PI * 2;
        e.particles.push({
          x: o + Math.cos(f) * 2,
          y: a + Math.sin(f) * 2,
          z: s,
          vx: Math.cos(f + Math.PI / 2) * 3,
          vy: Math.sin(f + Math.PI / 2) * 3,
          vz: 2 + Math.random() * 2,
          text: "✚",
          color: "#32cd32",
          life: 2,
          maxLife: 2,
          speed: 0.1,
        });
      }
      i.onMessage && i.onMessage("Rune of Life Restores You!");
    },
  );
}
