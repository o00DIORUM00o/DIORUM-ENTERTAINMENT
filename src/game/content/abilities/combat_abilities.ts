import { AbilityRegistry } from "../../registries/AbilityRegistry";
import { BlockType } from "../../constants/BlockType";

import { EntityRegistry } from "../../registries/EntityRegistry";

export function defineCombatAbilities() {
  AbilityRegistry.register(
    "LIGHTNING_STRIKE",
    ({ engine: e, x: i, y: o, z: a, aimAngle: s }) => {
      const c = i + Math.cos(s) * 8,
        f = o + Math.sin(s) * 8;
      for (let u = 0; u < 20; u++)
        e.particles.push({
          x: c,
          y: f,
          z: a + u * 0.5,
          text: "",
          color: "#00ffff",
          life: 0.5,
          maxLife: 0.5,
          vx: Math.random() - 0.5,
          vy: Math.random() - 0.5,
          vz: 0,
          speed: 0,
        });
      e.forEachEntity((u) => {
        Math.sqrt((u.x - c) ** 2 + (u.y - f) ** 2) <= 4 &&
          !u.isFriendly &&
          u.type !== "npc" &&
          u.type !== "villager" &&
          (u.health !== void 0 && (u.health -= 120),
          u.hp !== void 0 && (u.hp -= 120));
      });
    },
  );

  AbilityRegistry.register(
    "BOW_MULTI_SHOT",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      var b, N;
      const f =
          (b = i == null ? void 0 : i.equipment) == null ? void 0 : b.MAIN_HAND,
        u = (N = i == null ? void 0 : i.equipment) == null ? void 0 : N.AMMO;
      if (i === e.player && (!u || !u.quantity)) return;
      const m = (f == null ? void 0 : f.projectileSpeed) || 25,
        _ = (f == null ? void 0 : f.damage) || 15,
        g = (u == null ? void 0 : u.damage) || 0,
        y = _ + g,
        R = (((f == null ? void 0 : f.reach) || 10) + 15) / m;
      for (let M = -2; M <= 2; M++) {
        const w = c + M * 0.15;
        e.projectiles.push({
          x: o,
          y: a,
          z: s + 0.5,
          vx: Math.cos(w) * m,
          vy: Math.sin(w) * m,
          vz: 0,
          damage: y,
          life: R,
          maxLife: R,
          isPlayer: i === e.player,
          owner: i,
        });
      }
      u &&
        i === e.player &&
        (u.quantity--, u.quantity <= 0 && (i.equipment.AMMO = null));
    },
  );

  AbilityRegistry.register(
    "BOOMERANG_SPREAD_SHOT",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      var b, N;
      const f =
          (b = i == null ? void 0 : i.equipment) == null ? void 0 : b.MAIN_HAND,
        u = (f == null ? void 0 : f.projectileSpeed) || 15,
        m = (f == null ? void 0 : f.damage) || 15,
        y =
          ((((N = i == null ? void 0 : i.talents) == null
            ? void 0
            : N.boomerang) || 1) >= 3
            ? 10
            : 5) / u;
      let R = "#d2b48c";
      (f == null ? void 0 : f.id) === "green_metal_boomerang" &&
        (R = "#32cd32");
      for (let M = -1; M <= 1; M++) {
        const w = c + M * 0.2;
        e.projectiles.push({
          x: o,
          y: a,
          z: s + 0.5,
          vx: Math.cos(w) * u,
          vy: Math.sin(w) * u,
          vz: 0,
          damage: m,
          life: y,
          maxLife: y,
          damageType: "BOOMERANG",
          isPlayer: i === e.player,
          isBoomerang: !0,
          color: R,
          returning: !1,
          owner: i,
          rotation: 0,
        });
      }
    },
  );

  AbilityRegistry.register(
    "BOOMERANG_SEEKER_SHOT",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      var b, N;
      const f =
          (b = i == null ? void 0 : i.equipment) == null ? void 0 : b.MAIN_HAND,
        u = (f == null ? void 0 : f.projectileSpeed) || 15,
        m = (f == null ? void 0 : f.damage) || 15,
        y =
          ((((N = i == null ? void 0 : i.talents) == null
            ? void 0
            : N.boomerang) || 1) >= 3
            ? 10
            : 5) / u;
      let R = "#d2b48c";
      ((f == null ? void 0 : f.id) === "red_metal_boomerang" && (R = "#ff4500"),
        e.projectiles.push({
          x: o,
          y: a,
          z: s + 0.5,
          vx: Math.cos(c) * u,
          vy: Math.sin(c) * u,
          vz: 0,
          damage: m * 1.5,
          life: y + 2,
          maxLife: y + 2,
          damageType: "BOOMERANG",
          isPlayer: i === e.player,
          isBoomerang: !0,
          isSeekerBoomerang: !0,
          color: R,
          returning: !1,
          owner: i,
          rotation: 0,
        }));
    },
  );

  AbilityRegistry.register(
    "BOW_EXPLOSIVE_SHOT",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      var b, N;
      const f =
          (b = i == null ? void 0 : i.equipment) == null ? void 0 : b.MAIN_HAND,
        u = (N = i == null ? void 0 : i.equipment) == null ? void 0 : N.AMMO;
      if (i === e.player && (!u || !u.quantity)) return;
      const m = ((f == null ? void 0 : f.projectileSpeed) || 25) * 1.5,
        _ = ((f == null ? void 0 : f.damage) || 25) * 1.5,
        g = (u == null ? void 0 : u.damage) || 0,
        y = _ + g,
        R = (((f == null ? void 0 : f.reach) || 15) + 20) / m;
      (e.projectiles.push({
        x: o,
        y: a,
        z: s + 0.5,
        vx: Math.cos(c) * m,
        vy: Math.sin(c) * m,
        vz: 0,
        damage: y,
        damageType: "EXPLOSION",
        life: R,
        maxLife: R,
        isPlayer: i === e.player,
        owner: i,
      }),
        AbilityRegistry.register(
          "BOW_PIERCING_SHOT",
          ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
            var j, F;
            const P =
                (j = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : j.MAIN_HAND,
              V =
                (F = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : F.AMMO;
            if (w === M.player && (!V || !V.quantity)) return;
            const Q = ((P == null ? void 0 : P.projectileSpeed) || 25) * 1.5,
              z = ((P == null ? void 0 : P.damage) || 15) * 1.25,
              B = (V == null ? void 0 : V.damage) || 0,
              K = z + B,
              ie = (((P == null ? void 0 : P.reach) || 10) + 15) / Q;
            (M.projectiles.push({
              x: O,
              y: x,
              z: v + 0.5,
              vx: Math.cos(C) * Q,
              vy: Math.sin(C) * Q,
              vz: 0,
              damage: K,
              pierce: !0,
              life: ie,
              maxLife: ie,
              isPlayer: w === M.player,
              owner: w,
            }),
              V &&
                w === M.player &&
                (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null)));
          },
        ),
        AbilityRegistry.register(
          "BOW_HOMING_SHOT",
          ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
            var j, F;
            const P =
                (j = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : j.MAIN_HAND,
              V =
                (F = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : F.AMMO;
            if (w === M.player && (!V || !V.quantity)) return;
            const Q = (P == null ? void 0 : P.projectileSpeed) || 25,
              z = (P == null ? void 0 : P.damage) || 15,
              B = (V == null ? void 0 : V.damage) || 0,
              K = z + B,
              ie = (((P == null ? void 0 : P.reach) || 10) + 20) / Q;
            for (let k = -1; k <= 1; k++) {
              const G = C + k * 0.2;
              M.projectiles.push({
                x: O,
                y: x,
                z: v + 0.5,
                vx: Math.cos(G) * Q,
                vy: Math.sin(G) * Q,
                vz: 0,
                damage: K * 0.75,
                isHoming: !0,
                life: ie,
                maxLife: ie,
                isPlayer: w === M.player,
                owner: w,
              });
            }
            V &&
              w === M.player &&
              (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null));
          },
        ),
        AbilityRegistry.register(
          "BOW_FROST_SHOT",
          ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
            var j, F;
            const P =
                (j = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : j.MAIN_HAND,
              V =
                (F = w == null ? void 0 : w.equipment) == null
                  ? void 0
                  : F.AMMO;
            if (w === M.player && (!V || !V.quantity)) return;
            const Q = (P == null ? void 0 : P.projectileSpeed) || 25,
              z = (P == null ? void 0 : P.damage) || 15,
              B = (V == null ? void 0 : V.damage) || 0,
              K = z + B,
              ie = (((P == null ? void 0 : P.reach) || 10) + 15) / Q;
            for (let k = -1; k <= 1; k++) {
              const G = C + k * 0.1;
              M.projectiles.push({
                x: O,
                y: x,
                z: v + 0.5,
                vx: Math.cos(G) * Q,
                vy: Math.sin(G) * Q,
                vz: 0,
                damage: K,
                damageType: "ICE",
                statusEffect: { type: "chill", chance: 1, duration: 4 },
                projectileColor: "#00ffff",
                life: ie,
                maxLife: ie,
                isPlayer: w === M.player,
                owner: w,
              });
            }
            V &&
              w === M.player &&
              (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null));
          },
        ),
        u &&
          i === e.player &&
          (u.quantity--, u.quantity <= 0 && (i.equipment.AMMO = null)));
    },
  );

  AbilityRegistry.register(
    "BOW_PIERCING_SHOT",
    ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
      var j, F;
      const P =
          (j = w == null ? void 0 : w.equipment) == null ? void 0 : j.MAIN_HAND,
        V = (F = w == null ? void 0 : w.equipment) == null ? void 0 : F.AMMO;
      if (w === M.player && (!V || !V.quantity)) return;
      const Q = ((P == null ? void 0 : P.projectileSpeed) || 25) * 1.5,
        z = ((P == null ? void 0 : P.damage) || 15) * 1.25,
        B = (V == null ? void 0 : V.damage) || 0,
        K = z + B,
        ie = (((P == null ? void 0 : P.reach) || 10) + 15) / Q;
      (M.projectiles.push({
        x: O,
        y: x,
        z: v + 0.5,
        vx: Math.cos(C) * Q,
        vy: Math.sin(C) * Q,
        vz: 0,
        damage: K,
        pierce: !0,
        life: ie,
        maxLife: ie,
        isPlayer: w === M.player,
        owner: w,
      }),
        V &&
          w === M.player &&
          (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null)));
    },
  );

  AbilityRegistry.register(
    "BOW_HOMING_SHOT",
    ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
      var j, F;
      const P =
          (j = w == null ? void 0 : w.equipment) == null ? void 0 : j.MAIN_HAND,
        V = (F = w == null ? void 0 : w.equipment) == null ? void 0 : F.AMMO;
      if (w === M.player && (!V || !V.quantity)) return;
      const Q = (P == null ? void 0 : P.projectileSpeed) || 25,
        z = (P == null ? void 0 : P.damage) || 15,
        B = (V == null ? void 0 : V.damage) || 0,
        K = z + B,
        ie = (((P == null ? void 0 : P.reach) || 10) + 20) / Q;
      for (let k = -1; k <= 1; k++) {
        const G = C + k * 0.2;
        M.projectiles.push({
          x: O,
          y: x,
          z: v + 0.5,
          vx: Math.cos(G) * Q,
          vy: Math.sin(G) * Q,
          vz: 0,
          damage: K * 0.75,
          isHoming: !0,
          life: ie,
          maxLife: ie,
          isPlayer: w === M.player,
          owner: w,
        });
      }
      V &&
        w === M.player &&
        (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null));
    },
  );

  AbilityRegistry.register(
    "BOW_FROST_SHOT",
    ({ engine: M, caster: w, x: O, y: x, z: v, aimAngle: C }) => {
      var j, F;
      const P =
          (j = w == null ? void 0 : w.equipment) == null ? void 0 : j.MAIN_HAND,
        V = (F = w == null ? void 0 : w.equipment) == null ? void 0 : F.AMMO;
      if (w === M.player && (!V || !V.quantity)) return;
      const Q = (P == null ? void 0 : P.projectileSpeed) || 25,
        z = (P == null ? void 0 : P.damage) || 15,
        B = (V == null ? void 0 : V.damage) || 0,
        K = z + B,
        ie = (((P == null ? void 0 : P.reach) || 10) + 15) / Q;
      for (let k = -1; k <= 1; k++) {
        const G = C + k * 0.1;
        M.projectiles.push({
          x: O,
          y: x,
          z: v + 0.5,
          vx: Math.cos(G) * Q,
          vy: Math.sin(G) * Q,
          vz: 0,
          damage: K,
          damageType: "ICE",
          statusEffect: { type: "chill", chance: 1, duration: 4 },
          projectileColor: "#00ffff",
          life: ie,
          maxLife: ie,
          isPlayer: w === M.player,
          owner: w,
        });
      }
      V &&
        w === M.player &&
        (V.quantity--, V.quantity <= 0 && (w.equipment.AMMO = null));
    },
  );

  AbilityRegistry.register(
    "SPIN_THUNDER_STRIKE",
    ({ engine: e, caster: i, x: o, y: a, z: s }) => {
      e.forEachEntity((c) => {
        Math.sqrt((c.x - o) ** 2 + (c.y - a) ** 2) <= 8 &&
          !c.isFriendly &&
          c.type !== "npc" &&
          c.type !== "villager" &&
          (e.particles.push({
            x: c.x,
            y: c.y,
            z: c.z + 5,
            text: "",
            color: "#ffff00",
            life: 0.5,
            maxLife: 0.5,
            vy: -10,
          }),
          c.health !== void 0 && (c.health -= 50),
          c.hp !== void 0 && (c.hp -= 50));
      });
    },
  );

  AbilityRegistry.register(
    "SPIN_TELEPORT_STRIKE",
    ({ engine: e, caster: i, x: o, y: a, z: s, aimAngle: c }) => {
      if (!i) return;
      const f = i.x + Math.cos(c) * 5,
        u = i.y + Math.sin(c) * 5;
      for (let m = 0; m < 15; m++)
        e.particles.push({
          x: i.x,
          y: i.y,
          z: i.z + 1,
          text: "",
          color: "#C71585",
          life: 0.5,
          maxLife: 0.5,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          vz: Math.random() * 5,
          speed: 0,
        });
      ((i.x = f),
        (i.y = u),
        e.aoeEffects.push({
          x: f,
          y: u,
          z: i.z,
          radius: 0,
          maxRadius: 5,
          life: 0.2,
          maxLife: 0.2,
          damageType: "EXPLOSION",
          damage: 60,
          owner: i,
        }));
      for (let m = 0; m < 30; m++)
        e.particles.push({
          x: f,
          y: u,
          z: i.z + 1,
          text: "",
          color: "#FF1493",
          life: 1,
          maxLife: 1,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          vz: Math.random() * 5,
          speed: 0,
        });
    },
  );
}
