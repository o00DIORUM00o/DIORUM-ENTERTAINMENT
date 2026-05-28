export class EnvironmentalParticleSystem {
    static update(engine: any, dt: number) {
        if (engine.world.activePlanet === 'ARETH') {
            // Spawn ambient ember and ash particles
            if (Math.random() < 30 * dt) { // Scale by dt to be frame-rate independent
               engine.particles.push({
                   x: engine.player.x + (Math.random() - 0.5) * 60,
                   y: engine.player.y + (Math.random() - 0.5) * 60,
                   z: engine.player.z + 5 + Math.random() * 10,
                   text: '',
                   color: Math.random() > 0.4 ? '#f97316' : '#4b5563', // Ember (orange) or Ash (dark gray)
                   life: 5.0,
                   maxLife: 5.0,
                   vx: (Math.random() - 0.5) * 2 + 3, // Strong wind on Areth
                   vy: (Math.random() - 0.5) * 2 + 3,
                   vz: -1.0 - Math.random() * 2, // falling
                   speed: 0
               });
            }
        } else if (engine.world.activePlanet === 'TARHE') {
            // Spawn falling pebbles and glowing dust
            if (Math.random() < 25 * dt) {
               const isPebble = Math.random() < 0.2;
               
               // Dust spores and pebbles
               const color = isPebble ? '#4b5563' : (Math.random() < 0.5 ? '#93c5fd' : '#10b981'); // Gray pebbles, blue/green spores
               
               engine.particles.push({
                   x: engine.player.x + (Math.random() - 0.5) * 50,
                   y: engine.player.y + (Math.random() - 0.5) * 50,
                   z: engine.player.z + 10 + Math.random() * 5,
                   text: isPebble ? '▪' : '⋅',
                   color: color,
                   life: isPebble ? 2.0 : 4.0,
                   maxLife: 5.0,
                   vx: (Math.random() - 0.5) * 1, // gentle drift
                   vy: (Math.random() - 0.5) * 1,
                   vz: isPebble ? -4.0 - Math.random() * 2 : -0.2 - Math.random() * 0.5, // pebbles fall fast, dust floats down
                   speed: 0
               });
            }
        } else if (engine.world.activePlanet === 'TERHA') {
            // Spawn fireflies and toxic bubbles
            if (Math.random() < 20 * dt) {
               const isBubble = Math.random() < 0.4;
               
               // Firefly or bubble
               const color = isBubble ? '#4ade80' : '#fef08a'; // Bright green bubbles, yellow-green fireflies
               
               // Bubbles rise from the ground, fireflies appear around player mid-air
               const pZ = isBubble ? engine.player.z - 1 + Math.random() * 2 : engine.player.z + Math.random() * 8;
               
               engine.particles.push({
                   x: engine.player.x + (Math.random() - 0.5) * 40,
                   y: engine.player.y + (Math.random() - 0.5) * 40,
                   z: pZ,
                   text: isBubble ? 'o' : '•',
                   color: color,
                   life: isBubble ? 1.5 : 3.0,
                   maxLife: 5.0,
                   vx: (Math.random() - 0.5) * 1, // gentle drift
                   vy: (Math.random() - 0.5) * 1,
                   vz: isBubble ? 1.0 + Math.random() * 1.5 : (Math.random() - 0.5) * 1, // Bubbles rise, fireflies hover
                   speed: 0
               });
            }
        }
    }
}
