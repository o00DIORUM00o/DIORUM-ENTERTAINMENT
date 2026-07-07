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
import { FrostCasterUpdater } from "./entities/FrostCasterUpdater";
import { LavaGolemUpdater } from "./entities/LavaGolemUpdater";
import { BeeUpdater } from "./entities/BeeUpdater";
import { FireDragonBossUpdater } from "./entities/FireDragonBossUpdater";
import { RatheEntitiesUpdater } from "./entities/RatheEntitiesUpdater";
import { SphinxBossUpdater } from "./entities/SphinxBossUpdater";
import { SandTerrorUpdater } from "./entities/SandTerrorUpdater";
import { PhantomWizardUpdater } from "./entities/PhantomWizardUpdater";
import { VoidLordUpdater } from "./entities/VoidLordUpdater";
import { CompanionUpdater } from "./entities/CompanionUpdater";
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
import { StructureSpawnerSystem } from './systems/StructureSpawnerSystem';
import { DivineWrathSystem } from './systems/DivineWrathSystem';
import { EnvironmentalParticleSystem } from './systems/EnvironmentalParticleSystem';
import { EventSpawnerSystem } from './systems/EventSpawnerSystem';
import { DroppedItemSystem } from './systems/DroppedItemSystem';

import { PlayerInteractionSystem } from './player/PlayerInteractionSystem';
import { QuestSystem } from './systems/QuestSystem';

export class Updater {
    static update(engine: any, dt: number) {

        // --- DIVINE WRATH SYSTEM ---
        DivineWrathSystem.update(engine, dt);
        // -----------------------------

        EnvironmentalParticleSystem.update(engine, dt);

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

        let playerAttacking = attacking;
        let potThrown = false;

        if (engine.player.carryingPot && (interacting || attacking)) {
            // Throw pot
            engine.player.carryingPot = false;
            const speed = 12;
                        if (engine.player.carriedBlockType === 14 || engine.player.carriedBlockType === 47 || engine.player.carriedBlockType === 48 || engine.player.carriedBlockType === 49 || engine.player.carriedBlockType === 50) {
                (audioEngine as any)?.playThrowBush?.();
            } else {
                audioEngine?.playShoot?.();
            }
engine.projectiles.push({x: engine.player.x,
                y: engine.player.y,
                z: engine.player.z + 0.5,
                vx: Math.cos(engine.player.aimAngle) * speed,
                vy: Math.sin(engine.player.aimAngle) * speed,
                damage: 20, // Pot damage
                life: 1.0,
                isPlayer: true,
                isPot: true,
                thrownBlockType: engine.player.carriedBlockType
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

        EventSpawnerSystem.update(engine, dt);

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

            let behavior = EntityBehaviorRegistry.get(ent.type);
            if (!behavior && ent.type) behavior = EntityBehaviorRegistry.get(ent.type.toUpperCase());
            if (behavior && behavior.update) {
                behavior.update({ engine, entity: ent, dt, index: i });
            }
        }

        // Update NPCs
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { NPCUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { VillagerUpdater.updateAll(engine, dt); }

        // Update dropped items
        DroppedItemSystem.update(engine, dt);

        // Structure Spawning Logic (Camps, Beacons, Bone Piles, etc)
        StructureSpawnerSystem.update(engine, dt);

        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { CompanionUpdater.updateAll(engine, dt); }

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
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { VoidLordUpdater.updateAll(engine, dt); }

        // Update Kobolds
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { KoboldUpdater.updateAll(engine, dt); }
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { FrostCasterUpdater.updateAll(engine, dt); }

        // Update Rathe Entities
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { RatheEntitiesUpdater.updateAll(engine, dt); }

        // Update Skeletons
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SkeletonUpdater.updateAll(engine, dt); }

        // Update Skeleton Remains
        if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { SkeletonRemainsUpdater.updateAll(engine, dt); }

        // Offload off-screen trash mobs
        const OFFSCREEN_DIST_SQ = 50 * 50; 
        const collectionsToOffload = [
            engine.goblins, engine.orcs, engine.rats, engine.abyssalKnights, engine.frostCasters, engine.lavaGolems, engine.skeletons, engine.ants, engine.kobolds,
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

        PlayerInteractionSystem.handleInteraction(engine, interacting, potThrown);

        // Process global status effects
        StatusSystem.update(engine, dt);
        
        // Update Quests
        QuestSystem.checkQuestProgress(engine.player);
    }
}
