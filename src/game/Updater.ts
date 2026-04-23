import { PlayerActionCallbacks } from './updaters/PlayerActionCallbacks';
import { LocationManager } from './LocationManager';
import { MechanismUpdater } from './updaters/MechanismUpdater';
import { EffectUpdater } from './updaters/EffectUpdater';
import { ProjectileUpdater } from './updaters/ProjectileUpdater';
import { EntityRegistry } from './registries/EntityRegistry';
import { PlanetRegistry } from './registries/PlanetRegistry';
import { VillagerUpdater } from './updaters/VillagerUpdater';
import { SpawnerUpdater } from './updaters/SpawnerUpdater';
import { audioEngine } from './AudioEngine';
import { SkeletonRemainsUpdater } from "./entities/SkeletonRemainsUpdater";
import { SkeletonUpdater } from "./entities/SkeletonUpdater";
import { OrcUpdater } from "./entities/OrcUpdater";
import { GoblinUpdater } from "./entities/GoblinUpdater";
import { AbyssalKnightUpdater } from "./entities/AbyssalKnightUpdater";
import { AntUpdater } from "./entities/AntUpdater";
import { AnimalUpdater } from "./entities/AnimalUpdater";
import { NPCUpdater } from "./entities/NPCUpdater";
import { RatUpdater } from "./entities/RatUpdater";
import { DrakeUpdater } from "./entities/DrakeUpdater";
import { KoboldUpdater } from "./entities/KoboldUpdater";
import { LavaGolemUpdater } from "./entities/LavaGolemUpdater";
import { BeeUpdater } from "./entities/BeeUpdater";
import { FireDragonBossUpdater } from "./entities/FireDragonBossUpdater";
import { RatheEntitiesUpdater } from "./entities/RatheEntitiesUpdater";
import { SphinxBossUpdater } from "./entities/SphinxBossUpdater";
import { SandTerrorUpdater } from "./entities/SandTerrorUpdater";
import { PhantomWizardUpdater } from "./entities/PhantomWizardUpdater";
import { ITEMS } from './Inventory';
import { ItemGenerator } from './ItemGenerator';

import { Engine } from "./Engine";
import { isSolid, isIndestructible, getLootForBlock } from "./World";
import { BlockType } from "./constants/BlockType";
import { SPELLS } from "./Inventory";
import { TILE_SIZE, CHUNK_SIZE, WORLD_HEIGHT } from "./Constants";

import { EntityBehaviorRegistry } from './registries/EntityBehaviorRegistry';
import { defineCoreBehaviors } from './entities/behaviors/core_behaviors';

// Ensure behaviors are defined early
defineCoreBehaviors();

export function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

import { ShadowWizardUpdater } from "./entities/ShadowWizardUpdater";
import { ArcherUpdater } from "./entities/ArcherUpdater";
import { DarkKnightUpdater } from "./entities/DarkKnightUpdater";

import { StatusSystem } from './systems/StatusSystem';

export class Updater {
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
            engine.goblins, engine.orcs, engine.rats, engine.abyssalKnights,
            engine.lavaGolems, engine.skeletons, engine.animals, engine.ants, engine.entities,
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

    static update(engine: any, dt: number) {

        // --- DIVINE WRATH SYSTEM ---
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
        // -----------------------------

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

        const { dx, dy } = engine.input.getMovement();
        const { ax, ay } = engine.input.getAim();
        const attacking = engine.input.isAttacking();
        const casting = engine.input.isCasting();
        const interacting = engine.input.isInteracting();

        const jumping = engine.input.isJumping();
        const jumpDown = engine.input.isJumpDown();
        const dashing = engine.input.isDashing();
        const quick1 = engine.input.isQuickSlot1();
        const quick2 = engine.input.isQuickSlot2();
        const quick3 = engine.input.isQuickSlot3();
        
        if (engine.input.isSneakPressed()) {
            engine.player.isSneaking = !engine.player.isSneaking;
            if (engine.player.isSneaking && engine.player.stamina <= 0) {
                engine.player.isSneaking = false;
            }
        }

        let activeBoss = null;
        if (engine.sphinxs.length > 0) {
            activeBoss = { name: 'The Sphinx', health: engine.sphinxs[0].health, maxHealth: engine.sphinxs[0].maxHealth, state: engine.sphinxs[0].state };
        } else if (engine.fireDragonBosses.length > 0) {
            activeBoss = { name: 'Fire Dragon', health: engine.fireDragonBosses[0].health, maxHealth: engine.fireDragonBosses[0].maxHealth, state: engine.fireDragonBosses[0].state };
        }

        // Delegate UI Updates to React Bridge
        const {rx, ry} = LocationManager.getRegionCoords(engine.player.x, engine.player.y);
        const locationName = LocationManager.getCrossroadName(rx, ry);

        engine.events.emit('HUD_UPDATE', { 
            health: engine.player.health, 
            maxHealth: engine.player.effectiveMaxHealth,
            mana: engine.player.mana, 
            maxMana: engine.player.effectiveMaxMana,
            stamina: engine.player.stamina, 
            maxStamina: engine.player.maxStamina,
            xp: engine.player.xp,
            xpToNextLevel: engine.player.xpToNextLevel,
            level: engine.player.level,
            defense: engine.player.getDefense(),
            activeBoss,
            locationName
        });

        if (engine.player.health <= 0) {
            engine.player.health = engine.player.effectiveMaxHealth;
            engine.player.x = engine.player.spawnX;
            engine.player.y = engine.player.spawnY;
            engine.player.z = engine.player.spawnZ + 2; // Default, will be clamped
            // Clamp to surface so we don't respawn and fall repeatedly
            const surfaceInfo = engine.world.getSurface(engine.player.x, engine.player.y, WORLD_HEIGHT - 1);
            if (surfaceInfo.z > 0) engine.player.z = surfaceInfo.z + 1;
            engine.player.vz = 0;
            
            engine.events.emit('PLAYER_DEATH');
        }

        engine.world.update(dt);
        engine.world.pregenerateChunks(engine.player.x, engine.player.y);
        engine.updateAutomation(dt);

        // Spawn Wizard
        if (engine.world.wizardTowerEntrance && !engine.npcs.find(n => n.type === 'OLD_WIZARD')) {
            engine.npcs.push({
                id: 'old_wizard',
                x: engine.world.wizardTowerEntrance.x,
                y: engine.world.wizardTowerEntrance.y,
                z: engine.world.wizardTowerEntrance.z,
                vx: 0, vy: 0, vz: 0,
                health: EntityRegistry.get('villager').maxHealth, maxHealth: EntityRegistry.get('villager').maxHealth,
                type: 'OLD_WIZARD',
                state: 'IDLE',
                disposition: 0,
                aimAngle: 0,
                attackTimer: 0,
                attackCooldown: 0,
                merchantType: 'WIZARD',
                tradeInventory: [],
                lastRestockDay: 0
            });
            // Clear the entrance so we only spawn once
            engine.world.wizardTowerEntrance = null;
        }

        // Spawn Quest NPCs
        if (engine.world.questNpcEntrances && engine.world.questNpcEntrances.length > 0) {
            for (const spawner of engine.world.questNpcEntrances) {
                // Determine a unique ID so we don't spawn multiple for the same spawner location
                const npcId = 'quest_giver_' + spawner.x + '_' + spawner.y;
                if (!engine.npcs.find((n: any) => n.id === npcId)) {
                    engine.npcs.push({
                        id: npcId,
                        x: spawner.x + 0.5,
                        y: spawner.y + 0.5,
                        z: spawner.z + 1,
                        vx: 0, vy: 0, vz: 0,
                        health: 999999, maxHealth: 999999,
                        type: 'QUEST_GIVER',
                        state: 'IDLE',
                        disposition: 0,
                        aimAngle: 0,
                        attackTimer: 0,
                        attackCooldown: 0,
                        merchantType: null,
                        tradeInventory: [],
                        lastRestockDay: 0
                    });
                }
            }
            engine.world.questNpcEntrances = [];
        }

        let playerAttacking = attacking;
        let potThrown = false;

        if (engine.player.carryingPot && (interacting || attacking)) {
            // Throw pot
            engine.player.carryingPot = false;
            const speed = 12;
            audioEngine?.playShoot?.();
engine.projectiles.push({x: engine.player.x,
                y: engine.player.y,
                z: engine.player.z + 0.5,
                vx: Math.cos(engine.player.aimAngle) * speed,
                vy: Math.sin(engine.player.aimAngle) * speed,
                damage: 20, // Pot damage
                life: 1.0,
                isPlayer: true,
                isPot: true
            });
            playerAttacking = false; // Don't swing sword
            potThrown = true;
        }

        MechanismUpdater.update(engine, dt);

        const callbacks = PlayerActionCallbacks.getCallbacks(engine);
        engine.player.update({
            world: engine.world,
            engine: engine,
            dx, dy, aimX: ax, aimY: ay,
            attacking: playerAttacking, casting, interacting, jumping, jumpDown, dashing,
            quick1, quick2, quick3, dt,
            ...callbacks
        } as any);

        ProjectileUpdater.update(engine, dt);
        EffectUpdater.update(engine, dt);
        
        if (engine.arena) {
            engine.arena.update(engine, dt);
        }

        // Animal Spawning Logic
        engine.deerSpawnTimer -= dt;
        if (engine.deerSpawnTimer <= 0) {
            engine.deerSpawnTimer = 3.0; // Scan every 3 seconds
            
            const numWolves = engine.animals.filter(a => a.type === 'WOLF').length;
            const numPassive = engine.animals.filter(a => a.behavior === 'PASSIVE').length;
            
            const currentPlanetInfo = PlanetRegistry.get(engine.world.activePlanet);
            const surfaceZLevel = currentPlanetInfo.waterLevel + 1;
            
            // Wolf Pack Event (Dusk, 19:00)
            if (engine.world.timeOfDay >= 19.0 && engine.lastWolfPackDay < engine.world.dayCount && engine.player.z >= surfaceZLevel) {
                engine.lastWolfPackDay = engine.world.dayCount;
                const wolvesToSpawn = Math.floor(Math.random() * 3) + 3; // 3 to 5 wolves
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                
                for (let i = 0; i < wolvesToSpawn; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 15 + Math.random() * 5;
                    const wx = px + Math.cos(angle) * dist;
                    const wy = py + Math.sin(angle) * dist;
                    
                    // Find ground
                    let wz = pz;
                    for (let z = pz + 5; z >= pz - 5; z--) {
                        if (engine.world.getBlock(Math.floor(wx), Math.floor(wy), z) !== BlockType.AIR) {
                            wz = z + 1;
                            break;
                        }
                    }
                    
                    engine.animals.push({
                        id: 'wolf_' + Math.random().toString(36).substr(2, 9),
                        type: 'WOLF',
                        behavior: 'AGGRESSIVE',
                        x: wx, y: wy, z: wz,
                        vx: 0, vy: 0, vz: 0,
                        health: 40, maxHealth: 40,
                        state: 'CHASE',
                        fleeTimer: 0,
                        attackCooldown: 0,
                        aimAngle: 0,
                        tameProgress: 0,
                        isTamed: false,
                        speed: 5.5,
                        jumpPower: 6,
                        stamina: 50,
                        maxStamina: 50
                    });
                }
            } else if (engine.player.z >= surfaceZLevel && numPassive < 20) { // Only on surface, max 20 passive animals
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                const scanRadius = 25;

                const surfaceBlockType = PlanetRegistry.get(engine.world.activePlanet).surfaceBlock;

                // Test 50 random spots instead of looping the whole volume
                for (let i = 0; i < 50; i++) {
                    const x = px + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const y = py + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const z = pz + Math.floor((Math.random() - 0.5) * 4); // pz - 2 to pz + 2
                    
                    if (engine.world.getBlock(x, y, z) === surfaceBlockType) {
                        if (Math.random() < 0.2) { // 20% chance if we hit grass
                            // Make sure there is air above the grass
                            if (engine.world.getBlock(x, y, z + 1) === BlockType.AIR) {
                                let types: any[] = [];
                                
                                if (engine.world.activePlanet === 'ARETH') {
                                    types = [
                                        { type: 'DRAGON_HORSE', hp: 200, speed: 7.0, jump: 8, stamina: 150 },
                                        { type: 'DRAGON_TURTLE', hp: 300, speed: 1.2, jump: 1, stamina: 40 },
                                        { type: 'GIANT_TOAD', hp: 80, speed: 2.5, jump: 15, stamina: 50 },
                                        { type: 'OBSIDIAN_SHEEP', hp: 60, speed: 3.0, jump: 4, stamina: 50 }
                                    ];
                                } else {
                                    types = [
                                        { type: 'DEER', hp: EntityRegistry.get('deer').maxHealth, speed: 4.5, jump: 6, stamina: 60 },
                                        { type: 'SHEEP', hp: EntityRegistry.get('sheep').maxHealth, speed: 3.0, jump: 5, stamina: 40 },
                                        { type: 'HORSE', hp: EntityRegistry.get('horse').maxHealth, speed: 6.0, jump: 7, stamina: 100 },
                                        { type: 'TURTLE', hp: EntityRegistry.get('turtle').maxHealth, speed: 1.5, jump: 2, stamina: 30 },
                                        { type: 'GIANT_CHICKEN', hp: EntityRegistry.get('giant_chicken').maxHealth, speed: 4.0, jump: 10, stamina: 50 },
                                        { type: 'GIANT_FROG', hp: EntityRegistry.get('giant_frog').maxHealth, speed: 3.0, jump: 12, stamina: 40 },
                                        { type: 'CAPYBARA', hp: EntityRegistry.get('capybara').maxHealth, speed: 4.0, jump: 4, stamina: 70 }
                                    ];
                                    
                                    if (engine.world.activePlanet === 'THERA') {
                                         types = [
                                            { type: 'PTERODACTYL', hp: EntityRegistry.get('pterodactyl').maxHealth, speed: 8.0, jump: 10, stamina: 100 },
                                            { type: 'T_REX', hp: EntityRegistry.get('t_rex').maxHealth, speed: 5.0, jump: 5, stamina: 200 },
                                            { type: 'WILD_RAPTOR', hp: EntityRegistry.get('raptor').maxHealth, speed: 6.5, jump: 12, stamina: 100 }
                                        ];
                                    }

                                    // Increase Unicorn spawn rate significantly on HEART
                                    let unicornChance = engine.world.activePlanet === 'HEART' ? 0.40 : 0.05;
                                    let bearChance = 0.06;
                                    
                                    const huntingLevel = engine.player.talents['hunting'] || 0;
                                    if (huntingLevel >= 3) {
                                        unicornChance *= 3;
                                        bearChance *= 3; // Rare animals are more frequent
                                    }

                                    if (Math.random() < unicornChance) {
                                        types.push({ type: 'UNICORN', hp: EntityRegistry.get('unicorn').maxHealth, speed: 7.0, jump: 9, stamina: 120 });
                                    }
                                    if (Math.random() < bearChance) {
                                        types.push({ type: 'BEAR', hp: EntityRegistry.get('bear').maxHealth, speed: 3.5, jump: 4, stamina: 80 });
                                    }
                                    if (Math.random() < 0.1) {
                                        types.push({ type: 'GIANT_EAGLE', hp: 200, speed: 9.0, jump: 15, stamina: 150 });
                                    }
                                }
                                
                                const selected = types[Math.floor(Math.random() * types.length)];
                                
                                engine.animals.push({
                                    id: selected.type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                                    type: selected.type,
                                    behavior: selected.type === 'BEAR' ? 'AGGRESSIVE' : 'PASSIVE',
                                    x: x + 0.5,
                                    y: y + 0.5,
                                    z: z + 1.0,
                                    vx: 0, vy: 0, vz: 0,
                                    health: selected.hp,
                                    maxHealth: selected.hp,
                                    state: 'WANDER',
                                    fleeTimer: 0,
                                    attackCooldown: 0,
                                    aimAngle: 0,
                                    tameProgress: 0,
                                    isTamed: false,
                                    speed: selected.speed,
                                    jumpPower: selected.jump,
                                    stamina: selected.stamina,
                                    maxStamina: selected.stamina
                                });
                            }
                        }
                    }
                }
            }
        }

        // Lava Golem Spawning Logic
        engine.golemSpawnTimer -= dt;
        if (engine.golemSpawnTimer <= 0) {
            engine.golemSpawnTimer = 2.0; // Scan every 2 seconds
            if (engine.player.z < 8 && engine.lavaGolems.length < 5) { // Only in caverns, max 5 golems
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const pz = Math.floor(engine.player.z);
                const scanRadius = 15;

                for (let i = 0; i < 30; i++) {
                    const x = px + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const y = py + Math.floor((Math.random() - 0.5) * scanRadius * 2);
                    const z = pz + Math.floor((Math.random() - 0.5) * 10);
                    
                    if (engine.world.getBlock(x, y, z) === BlockType.LAVA) {
                        if (Math.random() < 0.25 && engine.lavaGolems.length < 5) {
                            if (engine.world.getBlock(x, y, z + 1) === BlockType.AIR) {
                                engine.lavaGolems.push({
                                    x: x + 0.5,
                                    y: y + 0.5,
                                    z: z + 1.0,
                                    vx: 0,
                                    vy: 0,
                                    vz: 0,
                                    health: 200,
                                    maxHealth: 200,
                                    damage: 15,
                                    state: 'WANDER',
                                    attackCooldown: 0,
                                    attackTimer: 0,
                                    aimAngle: 0
                                });
                            }
                        }
                    }
                }
            }
        }

        // Update Lava Golems
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { LavaGolemUpdater.updateAll(engine, dt); }

        // Update Rats
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { RatUpdater.updateAll(engine, dt); }

        // Update Spawners before generic entities
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SpawnerUpdater.updateAll(engine, dt); }
        
        // Update general entities (summons, runes, hostiles, etc)
        for (let i = engine.entities.length - 1; i >= 0; i--) {
            const ent = engine.entities[i];
            ent.timer = (ent.timer || 0) + dt;
            
            if (ent.lifeTime) {
                ent.lifeTime -= dt;
                if (ent.lifeTime <= 0) {
                    engine.entities.splice(i, 1);
                    for (let p = 0; p < 10; p++) engine.particles.push({x:ent.x, y:ent.y, z:ent.z, text:'', color:'#aaaaaa', life:0.5, maxLife:0.5, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:Math.random(), speed: 0});
                    continue;
                }
            }

            const behavior = EntityBehaviorRegistry.get(ent.type);
            if (behavior && behavior.update) {
                behavior.update({ engine, entity: ent, dt, index: i });
            }
        }

        // Update NPCs
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { NPCUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { VillagerUpdater.updateAll(engine, dt); }

        // Update dropped items
        for (let i = engine.droppedItems.length - 1; i >= 0; i--) {
            const item = engine.droppedItems[i];
            item.life -= dt;
            if (item.life <= 0) {
                removeFromArray(engine.droppedItems, i);
                continue;
            }

            item.vz -= 30.0 * dt; // gravity
            item.x += item.vx * dt;
            item.y += item.vy * dt;
            item.z += item.vz * dt;

            const bX = Math.floor(item.x);
            const bY = Math.floor(item.y);
            const bZ = Math.floor(item.z);
            const block = engine.world.getBlock(bX, bY, bZ);
            const blockBelow = engine.world.getBlock(bX, bY, bZ - 1);
            
            if (isSolid(block)) {
                item.z = bZ + 1;
                item.vz = 0;
                item.vx *= 0.8;
                item.vy *= 0.8;
            } else if (isSolid(blockBelow) && item.z - bZ < 0.1 && item.vz < 0) {
                item.z = bZ;
                item.vz = 0;
                item.vx *= 0.8;
                item.vy *= 0.8;

                if (blockBelow === BlockType.CONVEYOR_BELT_N) { item.y -= 1.5 * dt; item.vy = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_S) { item.y += 1.5 * dt; item.vy = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_W) { item.x -= 1.5 * dt; item.vx = 0; }
                else if (blockBelow === BlockType.CONVEYOR_BELT_E) { item.x += 1.5 * dt; item.vx = 0; }

                // Auto-Hopper Logic: When over an AUTO_DROPPER or AUTO_CRAFTER, maybe it gets sucked in.
                // We'll add vacuum hopper logic here too
                if (blockBelow === BlockType.VACUUM_HOPPER) {
                    const chestKey = `${bX},${bY},${bZ - 1}`;
                    const inv = engine.world.chestInventories.get(chestKey);
                    if (inv) {
                        // Suck item in and destroy entity
                        let remaining = item.item.quantity || 1;
                        for (const slot of inv) {
                            if (slot && slot.id === item.item.id) {
                                const max = ITEMS[item.item.id]?.maxStack || 64;
                                const space = max - (slot.quantity || 1);
                                if (space > 0) {
                                    const add = Math.min(space, remaining);
                                    slot.quantity += add;
                                    remaining -= add;
                                    if (remaining <= 0) break;
                                }
                            }
                        }
                        if (remaining > 0) {
                            for (let idx = 0; idx < inv.length; idx++) {
                                if (!inv[idx]) {
                                    inv[idx] = { ...item.item, quantity: remaining };
                                    remaining = 0;
                                    break;
                                }
                            }
                        }
                        
                        if (remaining <= 0) {
                            // fully sucked
                            removeFromArray(engine.droppedItems, i);
                            continue;
                        } else {
                            item.item.quantity = remaining;
                        }
                    }
                }
            }

            // Player pickup
            const dx = item.x - engine.player.x;
            const dy = item.y - engine.player.y;
            const dz = item.z - engine.player.z;
            if (dx*dx + dy*dy + dz*dz < 2.0) {
                if (engine.player.hasFavoredDeity('FIDIRI') && Math.random() < 0.2) {
                    item.item.quantity = (item.item.quantity || 1) * 2;
                }
                if (engine.player.addToInventory({ ...item.item })) {
                    removeFromArray(engine.droppedItems, i);
                    engine.particles.push({
                        x: engine.player.x,
                        y: engine.player.y,
                        z: engine.player.z + 1,
                        text: `+${item.item.name}`,
                        color: '#fbbf24',
                        life: 1.5,
                        maxLife: 1.5,
                        vy: -1
                    });
                }
            }
        }

        // Goblin Camp Spawning Logic
        engine.campScanTimer -= dt;
        if (engine.campScanTimer <= 0) {
            engine.campScanTimer = 1.0; // Scan every 1 second
            const px = Math.floor(engine.player.x);
            const py = Math.floor(engine.player.y);
            const pz = Math.floor(engine.player.z);
            const scanRadius = 35; // Scan further for camps

            // Proceed to scan chunks for spawners
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.spawners || chunk.spawners.size === 0) continue;
                const wx = chunk.cx * 16;
                    const wy = chunk.cy * 16;
                    const activeSpawners = Array.from(chunk.spawners as Set<number>);
                    
                    for (const idx of activeSpawners) {
                        const blockType = chunk.blocks[idx as number];
                        const x = wx + ((idx as number) % 16);
                        const y = wy + (Math.floor((idx as number) / 16) % 16);
                        const z = Math.floor((idx as number) / 256);
                        
                        // Check distance
                        if (Math.abs(px - x) > scanRadius || Math.abs(py - y) > scanRadius) continue;

                        const isGoblinCamp = blockType === BlockType.GOBLIN_CAMP || blockType === BlockType.GOBLIN_SHAMAN_TENT || blockType === BlockType.GOBLIN_TENT_ROCKHURLER || blockType === BlockType.GOBLIN_TENT_GARDENER || blockType === BlockType.GOBLIN_TENT_BOOMERANGER || blockType === BlockType.GOBLIN_TENT_ALCHEMIST || blockType === BlockType.GOBLIN_TENT_MINER;
                        const isArcherCamp = blockType === BlockType.ARCHER_TENT;
                        const isDarkKnightCamp = blockType === BlockType.DARK_KNIGHT_TENT;
                        const isOrcCamp = blockType === BlockType.ORC_TENT || blockType === BlockType.ORC_TENT_BRUTE || blockType === BlockType.ORC_TENT_SHAMAN || blockType === BlockType.ORC_TENT_HUNTER;
                        const isKoboldCamp = blockType === BlockType.KOBOLD_TENT || blockType === BlockType.KOBOLD_TENT_TRAPPER || blockType === BlockType.KOBOLD_TENT_WARRIOR || blockType === BlockType.KOBOLD_TENT_SHAMAN || blockType === BlockType.KOBOLD_TENT_BOMBER || blockType === BlockType.KOBOLD_TENT_DRAGONKEEPER;
                        const isDarkElfCamp = blockType === BlockType.DARK_ELF_TENT;
                        const isGiantCamp = blockType === BlockType.GIANT_CAMP;
                        const isTitanNest = blockType === BlockType.TITAN_NEST;
                        const isThraeCamp = [BlockType.HALFLING_HOUSE_SPAWNER, BlockType.PIT_BULL_TENT, BlockType.POMERANIAN_WAGON, BlockType.TERRIER_TENT, BlockType.WOLF_FOLK_CAMP, BlockType.HUMAN_CASTLE_SPAWNER, BlockType.HUMAN_OUTPOST_SPAWNER].includes(blockType);

                            if (isGoblinCamp || isArcherCamp || isDarkKnightCamp || isOrcCamp || isKoboldCamp || isDarkElfCamp || isGiantCamp || isTitanNest || isThraeCamp) {
                                const campKey = `${x},${y},${z}`;
                                let timer = engine.campSpawnTimers.get(campKey);
                                
                                if (timer === undefined) {
                                    timer = 30; // Ready to spawn immediately when discovered
                                } else {
                                    timer += 1.0;
                                }
                                
                                if (isGoblinCamp) {
                                    // Count goblins from this camp
                                    let goblinsFromCamp = 0;
                                    for (const gob of engine.goblins) {
                                        if (gob.campKey === campKey) {
                                            goblinsFromCamp++;
                                        }
                                    }

                                    if (timer >= 30) { // Try to spawn every 30 seconds per camp
                                        // Try to spawn a goblin
                                        if (goblinsFromCamp < 3 && engine.goblins.length < 20) { // Max 3 per camp, 20 total
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            const isShaman = blockType === BlockType.GOBLIN_SHAMAN_TENT;
                                            
                                            let goblinType = 'basic';
                                            if (blockType === BlockType.GOBLIN_TENT_ROCKHURLER) goblinType = 'rockhurler';
                                            if (blockType === BlockType.GOBLIN_TENT_GARDENER) goblinType = 'gardener';
                                            if (blockType === BlockType.GOBLIN_TENT_BOOMERANGER) goblinType = 'boomeranger';
                                            if (blockType === BlockType.GOBLIN_TENT_ALCHEMIST) goblinType = 'alchemist';
                                            if (blockType === BlockType.GOBLIN_TENT_MINER) goblinType = 'miner';

                                            engine.goblins.push({
                                                type: goblinType,
                                                x: x + 0.5,
                                                y: y + 0.5,
                                                z: z + 1.0,
                                                vx: 0,
                                                vy: 0,
                                                vz: 0,
                                                health: (isShaman ? 20 : 30) * multiplier,
                                                maxHealth: (isShaman ? 20 : 30) * multiplier,
                                                damage: (isShaman ? 15 : 10) * multiplier,
                                                state: goblinType === 'gardener' ? 'WANDER' : 'CHASE', // Gardener wanders peacefully
                                                attackCooldown: 0,
                                                attackTimer: 0,
                                                aimAngle: 0,
                                                campKey: campKey,
                                                isShaman: isShaman
                                            });
                                            timer = 0; // Reset timer after successful spawn
                                        }
                                    }
                                } else if (isOrcCamp) {
                                    // Count orcs from this camp
                                    let orcsFromCamp = 0;
                                    for (const orc of engine.orcs) {
                                        if (orc.campKey === campKey) {
                                            orcsFromCamp++;
                                        }
                                    }

                                    if (timer >= 30) { // Try to spawn every 30 seconds per camp
                                        // Try to spawn an orc
                                        if (orcsFromCamp < 2 && engine.orcs.length < 15) { // Max 2 per camp, 15 total
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);

                                            let orcType = 'basic';
                                            if (blockType === BlockType.ORC_TENT_BRUTE) orcType = 'brute';
                                            else if (blockType === BlockType.ORC_TENT_SHAMAN) orcType = 'shaman';
                                            else if (blockType === BlockType.ORC_TENT_HUNTER) orcType = 'hunter';

                                            const isShaman = orcType === 'shaman';
                                            const isBrute = orcType === 'brute';

                                            engine.orcs.push({
                                                type: orcType,
                                                x: x + 0.5,
                                                y: y + 0.5,
                                                z: z + 1.0,
                                                vx: 0,
                                                vy: 0,
                                                vz: 0,
                                                health: (isBrute ? 140 : isShaman ? 60 : 80) * multiplier,
                                                maxHealth: (isBrute ? 140 : isShaman ? 60 : 80) * multiplier,
                                                damage: (isBrute ? 35 : isShaman ? 15 : 20) * multiplier,
                                                state: 'CHASE', // Start chasing immediately
                                                attackCooldown: 0,
                                                attackTimer: 0,
                                                aimAngle: 0,
                                                campKey: campKey
                                            });
                                            timer = 0; // Reset timer after successful spawn
                                        }
                                    }
                                } else if (isArcherCamp) {
                                    let archersFromCamp = 0;
                                    for (const archer of engine.archers) {
                                        if (archer.spawnerKey === campKey) {
                                            archersFromCamp++;
                                        }
                                    }

                                    if (timer >= 30) {
                                        if (archersFromCamp < 2 && engine.archers.length < 15) {
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            engine.archers.push({
                                                x: x + 0.5,
                                                y: y + 0.5,
                                                z: z + 1.0,
                                                vx: 0,
                                                vy: 0,
                                                vz: 0,
                                                health: 40 * multiplier,
                                                maxHealth: 40 * multiplier,
                                                damage: 15 * multiplier,
                                                state: 'CHASE',
                                                attackCooldown: 0,
                                                attackTimer: 0,
                                                aimAngle: 0,
                                                spawnerKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isDarkKnightCamp) {
                                    let knightsFromCamp = 0;
                                    for (const knight of engine.darkKnights) {
                                        if (knight.spawnerKey === campKey) {
                                            knightsFromCamp++;
                                        }
                                    }

                                    if (timer >= 35) {
                                        if (knightsFromCamp < 1 && engine.darkKnights.length < 10) {
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 4);
                                            engine.darkKnights.push({
                                                x: x + 0.5,
                                                y: y + 0.5,
                                                z: z + 1.0,
                                                vx: 0,
                                                vy: 0,
                                                vz: 0,
                                                health: 120 * multiplier,
                                                maxHealth: 120 * multiplier,
                                                damage: 30 * multiplier,
                                                state: 'WANDER',
                                                stateTimer: 0,
                                                aimAngle: 0,
                                                spawnerKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isKoboldCamp) {
                                    // Count kobolds from this camp
                                    let koboldsFromCamp = 0;
                                    for (const kobold of engine.kobolds || []) {
                                        if (kobold.campKey === campKey) {
                                            koboldsFromCamp++;
                                        }
                                    }
                                    if (timer >= 30) {
                                        if (koboldsFromCamp < 4 && (engine.kobolds?.length || 0) < 20) {
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            
                                            if (!engine.kobolds) engine.kobolds = [];
                                            
                                            let koboldType = 'worker';
                                            if (blockType === BlockType.KOBOLD_TENT) koboldType = 'worker';
                                            if (blockType === BlockType.KOBOLD_TENT_TRAPPER) koboldType = 'trapper';
                                            if (blockType === BlockType.KOBOLD_TENT_WARRIOR) koboldType = 'warrior';
                                            if (blockType === BlockType.KOBOLD_TENT_SHAMAN) koboldType = 'shaman';
                                            if (blockType === BlockType.KOBOLD_TENT_BOMBER) koboldType = 'bomber';
                                            if (blockType === BlockType.KOBOLD_TENT_DRAGONKEEPER) koboldType = 'dragonkeeper';

                                            engine.kobolds.push({
                                                type: koboldType,
                                                x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                                                health: 20 * multiplier, maxHealth: 20 * multiplier, damage: 5 * multiplier,
                                                state: 'CHASE', attackCooldown: 0, attackTimer: 0, aimAngle: 0, campKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isDarkElfCamp) {
                                    // Dark elves
                                    let elvesFromCamp = 0;
                                    for (const npc of engine.entities || []) {
                                        if (npc.type === 'DARK_ELF_ASSASSIN' && npc.campKey === campKey) {
                                            elvesFromCamp++;
                                        }
                                    }
                                    if (timer >= 30) {
                                        if (elvesFromCamp < 2 && (engine.entities?.length || 0) < 30) {
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            
                                            engine.entities.push({
                                                type: 'DARK_ELF_ASSASSIN',
                                                x: x + 0.5, y: y + 0.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                                                health: 120 * multiplier, maxHealth: 120 * multiplier, damage: 25 * multiplier, hp: 120 * multiplier,
                                                state: 'CHASE', target: engine.player, speed: 6.0, campKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isGiantCamp) {
                                    // Giants
                                    let giantsFromCamp = 0;
                                    for (const npc of engine.entities || []) {
                                        if (npc.type === 'GIANT' && npc.campKey === campKey) {
                                            giantsFromCamp++;
                                        }
                                    }
                                    if (timer >= 60) {
                                        if (giantsFromCamp < 1 && (engine.entities?.length || 0) < 30) { // Only 1 giant per camp
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            
                                            engine.entities.push({
                                                type: 'GIANT',
                                                x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0, // Giant spawn offset
                                                health: 800 * multiplier, maxHealth: 800 * multiplier, damage: 60 * multiplier, hp: 800 * multiplier,
                                                state: 'CHASE', target: engine.player, speed: 2.0, campKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isTitanNest) {
                                    // Colossal Lizard Titans
                                    let titansFromCamp = 0;
                                    for (const npc of engine.entities || []) {
                                        if (npc.type === 'COLOSSAL_LIZARD_TITAN' && npc.campKey === campKey) {
                                            titansFromCamp++;
                                        }
                                    }
                                    if (timer >= 120) {
                                        if (titansFromCamp < 1 && (engine.entities?.length || 0) < 30) { 
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            
                                            engine.entities.push({
                                                type: 'COLOSSAL_LIZARD_TITAN',
                                                x: x + 2.5, y: y + 2.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                                                health: 2000 * multiplier, maxHealth: 2000 * multiplier, damage: 120 * multiplier, hp: 2000 * multiplier,
                                                state: 'CHASE', target: engine.player, speed: 1.5, campKey: campKey
                                            });
                                            timer = 0;
                                        }
                                    }
                                } else if (isThraeCamp) {
                                    let residentsFromCamp = 0;
                                    for (const npc of engine.npcs || []) {
                                        if (npc.campKey === campKey) {
                                            residentsFromCamp++;
                                        }
                                    }
                                    if (timer >= 60) {
                                        const isHalfling = blockType === BlockType.HALFLING_HOUSE_SPAWNER;
                                        const isCastle = blockType === BlockType.HUMAN_CASTLE_SPAWNER;
                                        const maxSpawns = isHalfling ? 3 : isCastle ? 5 : 2;
                                        if (residentsFromCamp < maxSpawns && (engine.npcs?.length || 0) < 50) { 
                                            const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                            const multiplier = 1 + Math.floor(distChunks / 5);
                                            
                                            let type = 'HALFLING';
                                            if (blockType === BlockType.PIT_BULL_TENT) type = 'PIT_BULL_FOLK';
                                            else if (blockType === BlockType.POMERANIAN_WAGON) type = 'POMERANIAN_FOLK';
                                            else if (blockType === BlockType.TERRIER_TENT) type = 'TERRIER_FOLK';
                                            else if (blockType === BlockType.WOLF_FOLK_CAMP) type = 'WOLF_FOLK';
                                            else if (blockType === BlockType.HUMAN_CASTLE_SPAWNER) {
                                                const rand = Math.random();
                                                if (rand < 0.2) type = 'HUMAN_PALADIN';
                                                else type = 'HUMAN_KNIGHT';
                                            } else if (blockType === BlockType.HUMAN_OUTPOST_SPAWNER) {
                                                const rand = Math.random();
                                                if (rand < 0.5) type = 'HUMAN_RANGER';
                                                else type = 'HUMAN_KNIGHT';
                                            }
                                            
                                            let state = 'WANDER';
                                            if (type === 'POMERANIAN_FOLK') {
                                                const hasLeader = engine.npcs.some(n => n.type === 'POMERANIAN_FOLK' && n.state === 'CARAVAN_LEADER');
                                                state = hasLeader ? 'CARAVAN_FOLLOWER' : 'CARAVAN_LEADER';
                                            }

                                            engine.npcs.push({
                                                id: type.toLowerCase() + '_' + Math.random().toString(36).substr(2, 9),
                                                type: type,
                                                x: x + 1.5, y: y + 1.5, z: z + 1.0, vx: 0, vy: 0, vz: 0,
                                                health: (type === 'HUMAN_PALADIN' ? 250 : type === 'HUMAN_KNIGHT' ? 200 : type === 'PIT_BULL_FOLK' ? 150 : type === 'WOLF_FOLK' ? 120 : 60) * multiplier, 
                                                maxHealth: (type === 'HUMAN_PALADIN' ? 250 : type === 'HUMAN_KNIGHT' ? 200 : type === 'PIT_BULL_FOLK' ? 150 : type === 'WOLF_FOLK' ? 120 : 60) * multiplier, 
                                                state: state, speed: 2.0, campKey: campKey,
                                                homeX: x, homeY: y, homeZ: z
                                            });
                                            timer = 0;
                                        }
                                    }
                                }
                                engine.campSpawnTimers.set(campKey, timer);
                            }
                    } // activeSpawners
                } // chunk entries
        }

        // Bone Pile Spawning Logic
        engine.bonePileScanTimer -= dt;
        if (engine.bonePileScanTimer <= 0) {
            engine.bonePileScanTimer = 1.0; // Scan every 1 second
            const px = Math.floor(engine.player.x);
            const py = Math.floor(engine.player.y);
            const pz = Math.floor(engine.player.z);
            const scanRadius = 35; // Scan further for bone piles

            // Scan for abyssal spawners and void beacons and bone piles
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.spawners || chunk.spawners.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                const activeSpawners = Array.from(chunk.spawners as Set<number>);
                
                for (const idx of activeSpawners) {
                    const block = chunk.blocks[idx as number];
                    const x = wx + ((idx as number) % 16);
                    const y = wy + (Math.floor((idx as number) / 16) % 16);
                    const z = Math.floor((idx as number) / 256);

                    // Check distance
                    if (Math.abs(px - x) > scanRadius || Math.abs(py - y) > scanRadius) continue;

                    if (block === 83 || block === BlockType.VOID_BEACON) { // ABYSSAL_SPAWNER or VOID_BEACON
                        // Abyssal realm requirement only for spawner
                        if (block === 83 && engine.player.x < 60000 * 16) continue;

                        const spawnerKey = `${x},${y},${z}`;
                        let timer = engine.abyssalSpawnerTimers.get(spawnerKey);
                        
                        if (timer === undefined) {
                            timer = block === BlockType.VOID_BEACON ? 1 : 10; // Beacons spawn faster
                        } else {
                            timer += 1.0;
                        }
                        
                        // Count knights from this spawner
                        let knightsFromSpawner = 0;
                        for (const k of engine.abyssalKnights) {
                            if ((k as any).spawnerKey === spawnerKey) {
                                knightsFromSpawner++;
                            }
                        }

                        let maxTimer = block === BlockType.VOID_BEACON ? 3 : 10;
                        let maxKnights = block === BlockType.VOID_BEACON ? 8 : 3;
                        let maxTotal = block === BlockType.VOID_BEACON ? 40 : 15;

                        if (timer >= maxTimer) {
                            if (knightsFromSpawner < maxKnights && engine.abyssalKnights.length < maxTotal) {
                                engine.abyssalKnights.push({
                                    x: x + 0.5 + (Math.random() - 0.5) * 2,
                                    y: y + 0.5 + (Math.random() - 0.5) * 2,
                                    z: z + 2, // higher z for beacon to drop in
                                    vx: 0, vy: 0, vz: 0,
                                    health: 150,
                                    maxHealth: 150,
                                    damage: 25,
                                    state: 'CHASE',
                                    attackCooldown: 0,
                                    aimAngle: 0,
                                    chargeTimer: 0,
                                    target: engine.player,
                                    spawnerKey: spawnerKey
                                } as any);
                                
                                if (block === BlockType.VOID_BEACON) {
                                    // Extra effects for beacon spawn
                                    for(let i=0; i<10; i++){
                                        engine.particles.push({
                                            x: x + 0.5, y: y + 0.5, z: z + 2,
                                            text: '', color: '#ff00aa', life: 1, maxLife: 1,
                                            vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, vz: Math.random()*5
                                        });
                                    }
                                }

                                timer = 0;
                            }
                        }
                        engine.abyssalSpawnerTimers.set(spawnerKey, timer);
                    } else if (block === BlockType.BONE_PILE_SPAWNER) {
                        const spawnerKey = `${x},${y},${z}`;
                        let timer = engine.bonePileSpawnTimers.get(spawnerKey);
                        
                        if (timer === undefined) {
                            timer = 15; // Ready to spawn immediately when discovered
                        } else {
                            timer += 1.0;
                        }
                        
                        // Count skeletons from this spawner
                        let skeletonsFromSpawner = 0;
                        for (const skel of engine.skeletons) {
                            if (skel.spawnerKey === spawnerKey) {
                                skeletonsFromSpawner++;
                            }
                        }
                        for (const rem of engine.skeletonRemains) {
                            if (rem.spawnerKey === spawnerKey) {
                                skeletonsFromSpawner++;
                            }
                        }

                        if (timer >= 15) { // Try to spawn every 15 seconds per spawner
                            // Try to spawn a skeleton
                            if (skeletonsFromSpawner < 4 && engine.skeletons.length + engine.skeletonRemains.length < 25) { // Max 4 per spawner, 25 total
                                const distChunks = Math.sqrt(Math.pow(x / CHUNK_SIZE, 2) + Math.pow(y / CHUNK_SIZE, 2));
                                const multiplier = 1 + Math.floor(distChunks / 5);
                                
                                const type = Math.random() > 0.5 ? 'SWORDSMAN' : 'ARCHER';

                                engine.skeletons.push({
                                    x: x + 0.5,
                                    y: y + 0.5,
                                    z: z + 1.0,
                                    vx: 0,
                                    vy: 0,
                                    vz: 0,
                                    health: EntityRegistry.get('skeleton').maxHealth * multiplier,
                                    maxHealth: EntityRegistry.get('skeleton').maxHealth * multiplier,
                                    damage: EntityRegistry.get('skeleton').damage * multiplier,
                                    type: type,
                                    state: 'CHASE', // Start chasing immediately
                                    attackCooldown: 0,
                                    attackTimer: 0,
                                    aimAngle: 0,
                                    spawnerKey: spawnerKey
                                });
                                timer = 0; // Reset timer after successful spawn
                            }
                        }
                        engine.bonePileSpawnTimers.set(spawnerKey, timer);
                    }
                } // activeSpawners
            } // chunks entries
        }

                // Update Animals
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { AnimalUpdater.updateAll(engine, dt); }

        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { ShadowWizardUpdater.updateAll(engine, dt); }

        // Update Ants
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { AntUpdater.updateAll(engine, dt); }

        // Update Bees
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { BeeUpdater.updateAll(engine, dt); }

        
        // Update Abyssal Knights
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { AbyssalKnightUpdater.updateAll(engine, dt); }

        // Update Goblins
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { GoblinUpdater.updateAll(engine, dt); }

        // Update Orcs
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { OrcUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { ArcherUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { DarkKnightUpdater.updateAll(engine, dt); }

        // Update Drakes
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { DrakeUpdater.updateAll(engine, dt); }

        // Update Fire Dragon Boss
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { FireDragonBossUpdater.update(engine, dt); }

        // Update Sphinx Boss
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SphinxBossUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SandTerrorUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { PhantomWizardUpdater.updateAll(engine, dt); }

        // Update Kobolds
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { KoboldUpdater.updateAll(engine, dt); }

        // Update Rathe Entities
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { RatheEntitiesUpdater.updateAll(engine, dt); }

        // Update Skeletons
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SkeletonUpdater.updateAll(engine, dt); }

        // Update Skeleton Remains
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SkeletonRemainsUpdater.updateAll(engine, dt); }

        // Offload off-screen trash mobs
        const OFFSCREEN_DIST_SQ = 50 * 50; 
        const collectionsToOffload = [
            engine.goblins, engine.orcs, engine.rats, engine.abyssalKnights,
            engine.lavaGolems, engine.skeletons, engine.ants, engine.kobolds,
            engine.gargoyles, engine.djinns, engine.gremlins, engine.bees
        ];
        
        for (const col of collectionsToOffload) {
            if (!col) continue;
            for (let i = col.length - 1; i >= 0; i--) {
                const e = col[i];
                if (!e || typeof e.x !== 'number') {
                    if (i === col.length - 1) {
                        col.pop();
                    } else {
                        col[i] = col.pop()!;
                    }
                    continue;
                }
                const distSq = (e.x - engine.player.x)**2 + (e.y - engine.player.y)**2;
                if (distSq > OFFSCREEN_DIST_SQ) {
                    e.health = 0;
                    e.hp = 0;
                    if (i === col.length - 1) {
                        col.pop();
                    } else {
                        col[i] = col.pop()!;
                    }
                }
            }
        }

        // Pre-load chunks around the player to prevent stuttering
        const halfW = engine.canvas.width / 2;
        const halfH = engine.canvas.height / 2;
        const chunkRadiusX = Math.ceil((halfW / TILE_SIZE) / CHUNK_SIZE) + 1;
        const chunkRadiusY = Math.ceil((halfH / TILE_SIZE) / CHUNK_SIZE) + 1;
        const playerCX = Math.floor(engine.player.x / CHUNK_SIZE);
        const playerCY = Math.floor(engine.player.y / CHUNK_SIZE);

        // Load up to 2 chunks per frame in the background
        let loadedCount = 0;
        for (let cx = playerCX - chunkRadiusX; cx <= playerCX + chunkRadiusX; cx++) {
            for (let cy = playerCY - chunkRadiusY; cy <= playerCY + chunkRadiusY; cy++) {
                const key = engine.world.getChunkKey(cx, cy);
                if (!engine.world.chunkManager.chunks.has(key)) {
                    engine.world.getChunk(cx, cy);
                    loadedCount++;
                    if (loadedCount >= 2) break;
                }
            }
            if (loadedCount >= 2) break;
        }

        if (interacting && !potThrown) {
            const pZ = Math.floor(engine.player.z);
            const interactX = Math.floor(engine.player.x + Math.cos(engine.player.aimAngle));
            const interactY = Math.floor(engine.player.y + Math.sin(engine.player.aimAngle));
            
            let interactedWithNPC = false;
            for (const npc of engine.npcs) {
                const ndx = npc.x - engine.player.x;
                const ndy = npc.y - engine.player.y;
                const ndist = Math.sqrt(ndx*ndx + ndy*ndy);
                if (ndist < 1.5 && Math.abs(npc.z - engine.player.z) < 2) {
                    if (npc.state !== 'COMBAT') {
                        engine.onInteractNPC?.(npc);
                        interactedWithNPC = true;
                        break;
                    }
                }
            }

            if (!interactedWithNPC) {
                const block = engine.world.getBlock(interactX, interactY, pZ);
                if (block === BlockType.POT) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.AIR);
                    engine.player.carryingPot = true;
                } else if (block === BlockType.DOOR_CLOSED) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
                } else if (block === BlockType.STONE_DOOR_CLOSED) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.STONE_DOOR_OPEN);
                } else if (block === BlockType.DOOR_LOCKED) {
                    if (engine.player.hasItem('dungeon_key', 1)) {
                        engine.player.removeItem('dungeon_key', 1);
                        engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
                        if (engine.player.onMessage) engine.player.onMessage('Unlocked the door.');
                    } else {
                        if (engine.player.onMessage) engine.player.onMessage('You need a Dungeon Key.');
                    }
                } else if (block === BlockType.DOOR_BOSS) {
                    if (engine.player.hasItem('boss_key', 1)) {
                        engine.player.removeItem('boss_key', 1);
                        engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
                        if (engine.player.onMessage) engine.player.onMessage('Unlocked the boss door.');
                    } else {
                        if (engine.player.onMessage) engine.player.onMessage('You need the Boss Key.');
                    }
                } else if (block === BlockType.DOOR_OPEN) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_CLOSED);
                } else if (block === BlockType.STONE_DOOR_OPEN) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.STONE_DOOR_CLOSED);
                } else if (block === BlockType.LEVER) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.LEVER_ON);
                    // Check for nearby iron blocks and remove them (open door)
                    for (let dx = -2; dx <= 2; dx++) {
                        for (let dy = -2; dy <= 2; dy++) {
                            if (engine.world.getBlock(interactX + dx, interactY + dy, pZ) === BlockType.IRON_BLOCK) {
                                engine.world.setBlock(interactX + dx, interactY + dy, pZ, BlockType.AIR);
                            }
                        }
                    }
                } else if (block === BlockType.LEVER_ON) {
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.LEVER);
                    // We could close it, but let's just leave it open for now or we'd need to remember where it was
                } else if (block === BlockType.CHEST) {
                    engine.onOpenChest?.(interactX, interactY, pZ);
                } else if (block === BlockType.SHRINE || block === BlockType.ALTAR_DIVINE || block === BlockType.ALTAR_CORRUPTED) {
                    engine.onOpenShrine?.(interactX, interactY, pZ);
                } else if (block === BlockType.ARCANE_GATE || block === BlockType.RAETH_GATEWAY || block === BlockType.THERA_GATEWAY || block === BlockType.ATHER_GATEWAY) {
                    engine.onOpenArcaneGate?.();
                } else if (block === BlockType.TENT) {
                    // Rest at tent
                    engine.player.health = engine.player.effectiveMaxHealth;
                    engine.player.mana = engine.player.effectiveMaxMana;
                    engine.player.stamina = engine.player.maxStamina;
                    
                    // Set spawn point (we can just use the tent's location)
                    engine.player.spawnX = interactX + 0.5;
                    engine.player.spawnY = interactY + 0.5;
                    engine.player.spawnZ = pZ;

                    engine.particles.push({
                        x: engine.player.x,
                        y: engine.player.y,
                        z: engine.player.z + 1,
                        text: 'Rested!',
                        color: '#22c55e',
                        life: 2.0,
                        maxLife: 2.0,
                        vy: -1
                    });
                } else {
                    // Check staircase interaction if no other block interaction occurred
                    const px = Math.floor(engine.player.x);
                    const py = Math.floor(engine.player.y);
                    const blockIn = engine.world.getBlock(px, py, pZ);
                    const blockUnder = engine.world.getBlock(px, py, pZ - 1);

                    if (blockIn === BlockType.WOODEN_STAIRCASE) {
                        let targetZ = pZ;
                        while (targetZ < 32 && engine.world.getBlock(px, py, targetZ) === BlockType.WOODEN_STAIRCASE) {
                            targetZ++;
                        }
                        engine.player.z = targetZ;
                    } else if (blockUnder === BlockType.WOODEN_STAIRCASE) {
                        let targetZ = pZ - 1;
                        while (targetZ > 0 && engine.world.getBlock(px, py, targetZ - 1) === BlockType.WOODEN_STAIRCASE) {
                            targetZ--;
                        }
                        engine.player.z = targetZ;
                    }
                }
            }
        }

        // Process global status effects
        StatusSystem.update(engine, dt);
    }
}
