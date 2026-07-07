import { isSolid } from "../../World";

export type AIState = 'WANDER' | 'ALERT' | 'CHASE' | 'ATTACK' | 'FLEE' | 'EVADE';

export interface ZeldaEntity {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    state: AIState;
    stateTimer?: number;
    stunTimer?: number;
    aimAngle: number;
    attackCooldown: number;
    attackTimer: number;
    speed?: number; // Base speed
    target?: {x: number, y: number, z: number}; // The target to chase/attack/flee from
    
    // Configurable behaviors
    moveSpeed: number;
    chaseDist: number;
    stopDist: number;
    attackDist: number;
    alertTime: number; // Time spent pausing when player spotted
    fleeHealthThreshold?: number; // E.g., flee if HP < 20%
    health?: number;
    maxHealth?: number;
}

export class ZeldaAI {
    /**
     * Applies an ALttP-style state machine to an entity.
     */
    static update(entity: ZeldaEntity, engine: any, dt: number) {
        if (entity.stunTimer && entity.stunTimer > 0) {
            entity.stunTimer -= dt;
            // High friction block for knockback
            entity.vx *= 0.85;
            entity.vy *= 0.85;
            return;
        }

        const target = entity.target || engine.player;

        const dx = target.x - entity.x;
        const dy = target.y - entity.y;
        const dz = target.z - entity.z;
        const distToTarget = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const dist2D = Math.sqrt(dx*dx + dy*dy);

        if (entity.stateTimer === undefined) entity.stateTimer = 0;

        // Flee Check (from Player always)
        const pdx = engine.player.x - entity.x;
        const pdy = engine.player.y - entity.y;
        const distToPlayer = Math.sqrt(pdx*pdx + pdy*pdy);

        if (entity.health && entity.maxHealth && entity.fleeHealthThreshold) {
            if (entity.health / entity.maxHealth < entity.fleeHealthThreshold) {
                // If fleeing, usually flee from player
                entity.target = engine.player;
                entity.state = 'FLEE';
            }
        }

        // State Transitions Out of Wander/Chase
        if (entity.state !== 'ATTACK' && entity.state !== 'FLEE' && entity.state !== 'EVADE') {
            
            // Check for incoming projectiles to EVADE
            let incomingThreat = false;
            if (engine.projectiles && Math.random() < 0.2) { // 20% chance to notice per frame
                for (const p of engine.projectiles) {
                    if (p.isPlayer || p.damage > 0) { // Threat!
                        const pdx = p.x - entity.x;
                        const pdy = p.y - entity.y;
                        const pdz = p.z - entity.z;
                        if (Math.sqrt(pdx*pdx + pdy*pdy + pdz*pdz) < 5.0) {
                            // Check if it's moving towards us
                            const dot = (p.vx * -pdx) + (p.vy * -pdy);
                            if (dot > 0) {
                                incomingThreat = true;
                                break;
                            }
                        }
                    }
                }
            }
            
            if (incomingThreat) {
                entity.state = 'EVADE';
                entity.stateTimer = 0.4;
            } else {
                let currentChaseDist = entity.chaseDist;
                if (target === engine.player && engine.player.isSneaking) {
                    const sneakLevel = engine.player.talents['sneak'] || 0;
                    if (sneakLevel === 0) currentChaseDist *= 0.8;
                    else currentChaseDist *= 0.15;
                }

                if (distToTarget < currentChaseDist && entity.state === 'WANDER') {
                    // Spot target
                    entity.state = 'ALERT';
                    entity.stateTimer = entity.alertTime;
                    entity.vx = 0;
                    entity.vy = 0;
                    engine.particles.push({
                        x: entity.x, y: entity.y, z: entity.z + 1.2,
                        text: '!', color: '#ffea00', life: 0.5, maxLife: 0.5, vy: 0
                    });
                } else if (distToTarget > currentChaseDist * 1.5 && entity.state === 'CHASE') {
                    // Lose interest
                    entity.state = 'WANDER';
                    entity.stateTimer = 1.0;
                    entity.target = undefined; // Drop focus
                }
            }
        }

        // Action Executions
        switch (entity.state) {
            case 'ALERT':
                entity.stateTimer -= dt;
                entity.aimAngle = Math.atan2(dy, dx); // Stare down the player
                if (entity.stateTimer <= 0) {
                    entity.state = 'CHASE';
                }
                break;

            case 'CHASE':
                if (dist2D > entity.stopDist) {
                    entity.vx = (dx / dist2D) * entity.moveSpeed;
                    entity.vy = (dy / dist2D) * entity.moveSpeed;
                    entity.aimAngle = Math.atan2(dy, dx);
                } else {
                    entity.vx = 0;
                    entity.vy = 0;
                    entity.aimAngle = Math.atan2(dy, dx);
                }
                
                if (dist2D < entity.attackDist && entity.attackCooldown <= 0) {
                    entity.state = 'ATTACK';
                    // We let the caller manage attackTimer duration because it varies heavily by entity type
                }
                break;

            case 'WANDER':
                entity.stateTimer -= dt;
                if (entity.stateTimer <= 0) {
                    if (Math.random() < 0.5) {
                        entity.aimAngle = Math.random() * Math.PI * 2;
                        const wSpeed = entity.moveSpeed * 0.4;
                        entity.vx = Math.cos(entity.aimAngle) * wSpeed;
                        entity.vy = Math.sin(entity.aimAngle) * wSpeed;
                        entity.stateTimer = 1.0 + Math.random(); 
                    } else {
                        entity.vx = 0;
                        entity.vy = 0;
                        entity.stateTimer = 1.0 + Math.random();
                    }
                }
                break;

            case 'FLEE':
                entity.vx = -(dx / dist2D) * (entity.moveSpeed * 1.2);
                entity.vy = -(dy / dist2D) * (entity.moveSpeed * 1.2);
                entity.aimAngle = Math.atan2(-dy, -dx);
                break;

            case 'EVADE':
                entity.stateTimer -= dt;
                // Dodge laterally
                const dodgeAngle = Math.atan2(dy, dx) + (Math.PI / 2);
                entity.vx = Math.cos(dodgeAngle) * (entity.moveSpeed * 1.5);
                entity.vy = Math.sin(dodgeAngle) * (entity.moveSpeed * 1.5);
                entity.aimAngle = Math.atan2(dy, dx);
                if (entity.stateTimer <= 0) {
                    entity.state = 'CHASE';
                }
                break;
        }

        // Update Attack Cooldown passively
        if (entity.attackCooldown > 0) {
            entity.attackCooldown -= dt;
        }
    }
}
