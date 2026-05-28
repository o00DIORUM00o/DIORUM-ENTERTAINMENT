import { Engine } from '../Engine';

export interface StatusEffects {
    burn: number;
    poison: number;
    chill: number;
    bleed: number;
}

export class StatusSystem {
    static tickTimer = 0;

    static update(engine: Engine, dt: number) {
        this.tickTimer += dt;
        const isTick = this.tickTimer >= 1.0;
        if (isTick) this.tickTimer = 0;

        const collections = [
            engine.goblins, engine.orcs, engine.rats, engine.abyssalKnights, engine.frostCasters, engine.lavaGolems, engine.rockGolems, engine.skeletons, engine.skeletonRemains, engine.ants, engine.kobolds,
            engine.gargoyles, engine.djinns, engine.gremlins, engine.bees,
            engine.sphinxs, engine.sandTerrors, engine.phantomWizards, engine.shadowWizards,
            engine.fireDragonBosses, engine.animals, engine.drakes, engine.npcs
        ];

        for (const col of collections) {
            if (!col) continue;
            for (let i = 0; i < col.length; i++) {
                 const ent = col[i];
                 if (!ent.health || ent.health <= 0) continue;
                 
                 // Initialize if missing
                 if (!ent.statuses) {
                     ent.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                 }

                 const statuses = ent.statuses as StatusEffects;

                 if (statuses.burn > 0) {
                     statuses.burn -= dt;
                     if (isTick) {
                         ent.health -= 5;
                         engine.events.emit('FLOATING_TEXT', { x: ent.x, y: ent.y, z: ent.z + 1, text: '5', color: '#ff4500' });
                     }
                     if (Math.random() < 10 * dt) {
                         engine.particles.push({x: ent.x, y: ent.y, z: ent.z+1, color: '#ff4500', life: 0.5, maxLife: 0.5, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz: Math.random()*2, text: ''});
                     }
                 }
                 
                 if (statuses.poison > 0) {
                     statuses.poison -= dt;
                     if (isTick) {
                         ent.health -= 3;
                         engine.events.emit('FLOATING_TEXT', { x: ent.x, y: ent.y, z: ent.z + 1, text: '3', color: '#32cd32' });
                     }
                     if (Math.random() < 5 * dt) {
                         engine.particles.push({x: ent.x + (Math.random()-0.5), y: ent.y+ (Math.random()-0.5), z: ent.z+1, color: '#228b22', life: 1.0, maxLife: 1.0, vx:0, vy:0, vz: Math.random(), text: '°'});
                     }
                 }
                 
                 if (statuses.chill > 0) {
                     statuses.chill -= dt;
                     // Trick to slow them down universally: undo 50% of their frame movement!
                     if (ent.vx !== undefined && ent.vy !== undefined) {
                         ent.x -= ent.vx * dt * 0.5;
                         ent.y -= ent.vy * dt * 0.5;
                     }
                     if (Math.random() < 4 * dt) {
                         engine.particles.push({x: ent.x, y: ent.y, z: ent.z+0.5, color: '#add8e6', life: 0.5, maxLife: 0.5, vx:0, vy:0, vz:0, text: '❄'});
                     }
                 }

                 if (statuses.bleed > 0) {
                     statuses.bleed -= dt;
                     if (isTick) {
                         ent.health -= 2;
                         engine.events.emit('FLOATING_TEXT', { x: ent.x, y: ent.y, z: ent.z + 0.5, text: '2', color: '#8b0000' });
                     }
                     if (Math.random() < 6 * dt) {
                         engine.particles.push({x: ent.x + (Math.random()-0.5), y: ent.y + (Math.random()-0.5), z: ent.z+0.5, color: '#8b0000', life: 0.5, maxLife: 0.5, vx:0, vy:0, vz:-2, text: ''});
                     }
                 }

                 // Clean up negative timers
                 for(let k in statuses) { if ((statuses as any)[k] < 0) (statuses as any)[k] = 0; }
            }
        }

        // Apply Player ticks
        const p = engine.player;
        if (isTick) {
            let dmg = 0;
            if (p.statuses.burn > 0) dmg += 5;
            if (p.statuses.poison > 0) dmg += 3;
            if (p.statuses.bleed > 0) dmg += 2;
            
            if (dmg > 0) {
                p.health -= dmg;
                engine.events.emit('PLAY_SOUND', 'hurt');
                // Could emit floating text for player too
            }
        }
        
        if (p.statuses.burn > 0) p.statuses.burn -= dt;
        if (p.statuses.poison > 0) p.statuses.poison -= dt;
        if (p.statuses.chill > 0) p.statuses.chill -= dt;
        if (p.statuses.bleed > 0) p.statuses.bleed -= dt;
        if (p.statuses.slowFall > 0) p.statuses.slowFall -= dt;

        for(let k in p.statuses) { if ((p.statuses as any)[k] < 0) (p.statuses as any)[k] = 0; }

        if (p.statuses.burn > 0 && Math.random() < 10 * dt) engine.particles.push({x: p.x, y: p.y, z: p.z+1, color: '#ff4500', life: 0.5, maxLife: 0.5, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz: Math.random()*2, text: ''});
        if (p.statuses.poison > 0 && Math.random() < 5 * dt) engine.particles.push({x: p.x, y: p.y, z: p.z+1, color: '#32cd32', life: 1, maxLife: 1, vx:0, vy:0, vz: Math.random(), text: '°'});
        if (p.statuses.chill > 0 && Math.random() < 4 * dt) engine.particles.push({x: p.x, y: p.y, z: p.z+1, color: '#add8e6', life: 0.5, maxLife: 0.5, vx:0, vy:0, vz: 0, text: '❄'});
        if (p.statuses.bleed > 0 && Math.random() < 8 * dt) engine.particles.push({x: p.x, y: p.y, z: p.z+1, color: '#8b0000', life: 0.5, maxLife: 0.5, vx:0, vy:0, vz:-2, text: ''});
        
    }
}
