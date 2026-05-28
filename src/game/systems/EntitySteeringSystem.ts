import { EntityBehaviorRegistry } from '../registries/EntityBehaviorRegistry';

export class EntitySteeringSystem {
    static applyDodge(entity: any, engine: any, dt: number) {
        if (!entity || typeof entity.x !== 'number') return;
        const dodgeRadius = 3.0; // Notice projectiles within 3 blocks
        let dodgeX = 0;
        let dodgeY = 0;

        for (const proj of engine.projectiles) {
            if (proj.isPlayer) {
                const dx = entity.x - proj.x;
                const dy = entity.y - proj.y;
                const dz = entity.z - (proj.z || 0);
                if (Math.abs(dz) > 1.5) continue;

                const distSq = dx*dx + dy*dy;
                if (distSq > 0 && distSq < dodgeRadius*dodgeRadius) {
                    // Check if projectile is heading roughly towards us
                    const dot = proj.vx * (-dx) + proj.vy * (-dy);
                    if (dot > 0) { // Projectile is approaching
                        const perpX = -proj.vy / Math.sqrt(proj.vx*proj.vx + proj.vy*proj.vy || 1);
                        const perpY = proj.vx / Math.sqrt(proj.vx*proj.vx + proj.vy*proj.vy || 1);
                        const dodgeForce = 6.0;
                        const sign = (dx * perpX + dy * perpY > 0) ? 1 : -1;
                        dodgeX += perpX * dodgeForce * sign;
                        dodgeY += perpY * dodgeForce * sign;
                    }
                }
            }
        }
        if (entity.vx !== undefined) entity.vx += dodgeX;
        if (entity.vy !== undefined) entity.vy += dodgeY;
    }

    static applyBoids(entity: any, engine: any, dt: number) {
        if (!entity || typeof entity.x !== 'number') return;
        
        const separationDist = 0.8;
        const repulsionForce = 4.0;
        
        let sepX = 0;
        let sepY = 0;
        
        // Let's use an array of collections to prevent allocating new arrays
        const collections = [
            engine.goblins, engine.orcs, engine.rats, engine.abyssalKnights, engine.frostCasters, engine.lavaGolems, engine.skeletons, engine.animals, engine.ants, engine.entities,
            engine.kobolds, engine.gargoyles, engine.djinns, engine.gremlins, engine.sphinxs
        ];
        
        for (const col of collections) {
            if (!col) continue;
            for (const other of col) {
                if (other === entity) continue;
                if (!other || typeof other.x !== 'number') continue;
                
                const dx = entity.x - other.x;
                const dy = entity.y - other.y;
                const dz = entity.z - (other.z || 0); // some entities might not have z right away
                if (Math.abs(dz) > 1.5) continue;
                
                const distSq = dx*dx + dy*dy;
                if (distSq > 0 && distSq < separationDist * separationDist) {
                    const dist = Math.sqrt(distSq);
                    const strength = (separationDist - dist) / separationDist;
                    sepX += (dx / dist) * strength * repulsionForce;
                    sepY += (dy / dist) * strength * repulsionForce;
                }
            }
        }
        
        if (entity.vx !== undefined) entity.vx += sepX;
        if (entity.vy !== undefined) entity.vy += sepY;
    }
}
