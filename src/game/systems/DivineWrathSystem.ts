import { Engine } from '../Engine';

export class DivineWrathSystem {
    static update(engine: any, dt: number) {
        engine.player.wrathTimer += dt;
        if (engine.player.wrathTimer > 30.0) { // Every 30 seconds
            engine.player.wrathTimer = 0;
            const deities = Object.keys(engine.player.deityStandings);
            for (const deity of deities) {
                 if (engine.player.hasWrathDeity(deity)) {
                     // Trigger Wrath Event
                     if (deity === 'RAGI') {
                         engine.player.health = Math.max(1, engine.player.health - 50);
                         engine.onAoE(engine.player.x, engine.player.y, engine.player.z, 2.0, 50, 'LIGHTNING');
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF RAGI: Lightning strikes you!`);
                     } else if (deity === 'RANA' || deity === 'PRIMORDIAL') {
                         let lostGold = false;
                         for (let i = 0; i < engine.player.inventory.length; i++) {
                             if (engine.player.inventory[i]?.id === 'gold_piece' && (engine.player.inventory[i].quantity || 1) > 0) {
                                 const amount = Math.min((engine.player.inventory[i].quantity || 1), 25);
                                 engine.player.inventory[i].quantity = (engine.player.inventory[i].quantity || 1) - amount;
                                 if ((engine.player.inventory[i].quantity || 1) <= 0) engine.player.inventory[i] = null;
                                 lostGold = true;
                                 break;
                             }
                         }
                         if (lostGold && engine.player.onMessage) engine.player.onMessage(`WRATH OF ${deity}: Your wealth slips away...`);
                     } else if (deity === 'ARCANIS') {
                         engine.player.mana = 0;
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF ARCANIS: Your mind is drained!`);
                     } else if (deity === 'DORIM') {
                         engine.player.stamina = 0;
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF DORIM: Your strength vanishes!`);
                     } else if (deity === 'ERUDI') {
                         engine.player.xp = Math.max(0, engine.player.xp - 50);
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF ERUDI: Knowledge is forcefully taken!`);
                     } else if (deity === 'FIDIRI') {
                         // Drops all ores from inventory onto the ground!
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF FIDIRI: The earth reclaims its bounty!`);
                         for (let i = 0; i < engine.player.inventory.length; i++) {
                             const item = engine.player.inventory[i];
                             if (item && item.id.includes('ore')) {
                                 engine.player.inventory[i] = null;
                                 // Add a dropped item entity in game? No, just destroy it to be simple.
                             }
                         }
                     } else if (deity === 'TERRENUS') {
                         engine.player.statuses.chill = 15; // 15 seconds of slow
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF TERRENUS: The earth grabs your feet!`);
                     } else if (deity === 'ANIMA') {
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF ANIMA: Nature rebels!`);
                         engine.animals.push({
                             id: 'wrath_bear_' + Math.random().toString(36).substr(2, 9),
                             x: engine.player.x + (Math.random() - 0.5) * 6,
                             y: engine.player.y + (Math.random() - 0.5) * 6,
                             z: engine.player.z + 1,
                             vx: 0, vy: 0, vz: 0,
                             health: 150, maxHealth: 150,
                             type: 'BEAR',
                             state: 'CHASE',
                             attackTimer: 0,
                             attackCooldown: 1.5,
                             aimAngle: 0,
                             isWrathSpawn: true
                         });
                     } else if (deity === 'OBITU' || deity === 'INMORI') {
                         if (engine.player.onMessage) engine.player.onMessage(`WRATH OF ${deity}: The dead rise...`);
                         for (let i = 0; i < 3; i++) {
                             engine.skeletons.push({
                                 id: 'wrath_skel_' + Math.random().toString(36).substr(2, 9),
                                 x: engine.player.x + (Math.random() - 0.5) * 6,
                                 y: engine.player.y + (Math.random() - 0.5) * 6,
                                 z: engine.player.z + 1,
                                 vx: 0, vy: 0, vz: 0,
                                 health: 30, maxHealth: 30,
                                 type: 'SKELETON',
                                 state: 'CHASE',
                                 attackTimer: 0,
                                 attackCooldown: 1.5,
                                 aimAngle: 0
                             });
                         }
                     } else if (deity === 'TELUM' || deity === 'RIULIRI') {
                         if (engine.player.equipment['MAIN_HAND']) {
                             const wpn = engine.player.equipment['MAIN_HAND'];
                             engine.player.equipment['MAIN_HAND'] = null;
                             let added = false;
                             for (let i = 0; i < engine.player.inventory.length; i++) {
                                 if (!engine.player.inventory[i]) {
                                     engine.player.inventory[i] = wpn;
                                     added = true;
                                     break;
                                 }
                             }
                             if (engine.player.onMessage) {
                                 if (added) engine.player.onMessage(`WRATH OF ${deity}: You drop your weapon in fear!`);
                                 else engine.player.onMessage(`WRATH OF ${deity}: Your weapon vanishes!`); // Inventory full
                             }
                         }
                     }
                 }
            }
        }
    }
}
