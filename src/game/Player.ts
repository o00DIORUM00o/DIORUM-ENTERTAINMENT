import { RaceRegistry } from './registries/RaceRegistry';
import { STARTING_PACKS } from './content/packs/core_packs';
import { RecipeRegistry } from './registries/RecipeRegistry';
import { BlockRegistry } from './registries/BlockRegistry';
import { World, isSolid, isIndestructible, getLootForBlock } from './World';
import { BlockType } from './constants/BlockType';
import { Item, EquipmentSlot, ITEMS, SPELLS } from './Inventory';
import { getZodiacStats } from './StarSigns';
import { TALENTS } from './Talents';
import { CHUNK_SIZE, WORLD_RADIUS_CHUNKS, WORLD_HEIGHT } from './Constants';
import { audioEngine } from './AudioEngine';
import { PlayerCombat } from './player/PlayerCombat';
import { PlayerController } from './player/PlayerController';
import { PlayerInventory } from './player/PlayerInventory';
import { PlayerEnvironment } from './player/PlayerEnvironment';
import { PlayerInventoryManager } from './player/PlayerInventoryManager';
import { PlayerProgression } from './player/PlayerProgression';
import { PlayerStatsManager } from './player/PlayerStatsManager';

export interface UpdateContext {
    engine?: any;
    world: World;
    dx: number;
    dy: number;
    aimX: number;
    aimY: number;
    attacking: boolean;
    casting: boolean;
    interacting: boolean;
    jumping: boolean;
    jumpDown?: boolean;
    dashing: boolean;
    quick1: boolean;
    quick2: boolean;
    quick3: boolean;
    dt: number;
    onHit?: (x: number, y: number, z: number, damage: number, blockType: BlockType) => void;
    onShoot?: (x: number, y: number, z: number, vx: number, vy: number, damage: number, damageType?: string, life?: number, statusEffect?: any, scale?: number, pierce?: boolean) => void;
    onAoE?: (x: number, y: number, z: number, radius: number, damage: number, damageType?: string, statusEffect?: any) => void;
    onPersistentAoE?: (x: number, y: number, z: number, radius: number, life: number, type: string, color: string, damage?: number) => void;
    onCastSpell?: (x: number, y: number, z: number, spellId: string, aimAngle: number) => void;
    onSaddleUse?: (x: number, y: number, z: number, aimAngle: number) => boolean;
    onSaddleBagUse?: (x: number, y: number, z: number, aimAngle: number) => boolean;
    onPlantBomb?: (x: number, y: number, z: number) => boolean;
    onMelee?: (reach: number, spread: number, damage: number, statusEffect?: any) => void;
    onDropItem?: (x: number, y: number, z: number, item: Item) => void;
    onOpenPortalMenu?: (color: string) => void;
    onTriggerSecondary?: (ability: string, aimAngle: number, x: number, y: number, z: number) => void;
    onChangePlanet?: (planetId: string) => void;
}

export interface QuestReward {
    type: 'XP' | 'GOLD' | 'ITEM';
    id?: string;
    amount: number;
}

export interface Quest {
    id: string;
    giverId: string; // The NPC type or ID that gave it
    title: string;
    description: string;
    type: 'FETCH' | 'KILL' | 'EXPLORE' | 'DESTROY_SPAWNER';
    targetId: string; // item id, or enemy id
    requiredCount: number;
    currentCount: number;
    state: 'ACTIVE' | 'COMPLETED' | 'TURNED_IN';
    rewards: QuestReward[];
}

export class Player {
    starSign: string = 'SWIFT_FALCON'; // Default star sign
    quests: Quest[] = [];
    x = 0;
    y = 0;
    z = 16;
    spawnX = 0;
    spawnY = 0;
    spawnZ = 16;
    markPosition: {x: number, y: number, z: number, planet?: string} | null = null;
    statuses: { burn: number, poison: number, chill: number, bleed: number, slowFall: number } = { burn: 0, poison: 0, chill: 0, bleed: 0, slowFall: 0 };
    portals: Record<string, {x: number, y: number, z: number, planet?: string}> = {};
    preAbyssalLocation?: {x: number, y: number, z: number};
    vz = 0;
    aimAngle = 0;
    color = '#fff';
    race = 'HUMAN';
    onMessage?: (text: string) => void;
    
    health = 100;
    maxHealth = 100;
    
    mana = 100;
    maxMana = 100;
    manaRegen = 5; // 5 mana per second
    
    campfireHealTimer = 0;
    
    stamina = 100;
    maxStamina = 100;
    staminaRegen = 10; // 10 stamina per second
    
    xp = 0;
    level = 1;
    xpToNextLevel = 100;
    skillPoints = 0;
    talents: Record<string, number> = {};
    learnedRecipes: string[] = [];
    
    knownSpells: string[] = [];
    activeSpell: string | null = null;
    buffs: Record<string, number> = { speed: 0, levitate: 0, invisibility: 0, mistForm: 0, maxHealth: 0, maxMana: 0, healthRegen: 0, manaRegen: 0, arcaneProtection: 0 };
    eyeReturnPos: {x: number, y: number, z: number} | null = null;
    isEyeMode: boolean = false;
    
    deityStandings: Record<string, { standing: number, favored: boolean, blessings: string[] }> = {};

    initDeity(deityName: string) {
        this.deityStandings = {};
        this.deityStandings[deityName] = { standing: 50, favored: true, blessings: [] };
    }

    hasFavoredDeity(deityName: string): boolean {
        return this.deityStandings[deityName]?.favored || false;
    }

    hasWrathDeity(deityName: string): boolean {
        return (this.deityStandings[deityName]?.standing ?? 0) <= -50;
    }

    isAttacking = false;
    hasHitThisSwing = false;
    carryingPot = false;
    carriedBlockType: number = 0;
    attackTimer = 0;
    attackDuration = 0.25;
    attackReach = 1.0;
    attackSpread = 0.5;
    lastRagiTick = 0;
    wrathTimer = 0;

    // Sword mechanics
    isCharging = false;
    chargeTimer = 0;
    spinAttackReady = false;
    
    // Fishing mechanics
    isFishing = false;

    isCasting = false;
    hasHitThisCast = false;
    castTimer = 0;
    castDuration = 0;

    quickSlots: (Item | null)[] = [null, null, null];
    quickCooldown = 0;
    handleQuickSlot: (slotIndex: number) => boolean = () => false;
    
    isDashing = false;
    isSneaking = false;
    dashTimer = 0;
    dashDuration = 0.2;
    dashCooldown = 0;
    dashSpeed = 25.0;

    inventory: (Item | null)[] = new Array(160).fill(null);
    inventoryCapacity: number = 80;
    mounts: any[] = [];
    activeMount: any = null;
    isMounted = false;
    companions: any[] = [];
    activeCompanion: any = null;
    equipment: Record<EquipmentSlot, Item | null> = {
        MAIN_HAND: null, OFF_HAND: null, HEAD: null, SHOULDERS: null, BODY: null, HANDS: null, BELT: null, LEGS: null, FEET: null, CLOAK: null, RIGHT_RING: null, LEFT_RING: null, NECKLACE: null, AMMO: null
    };

    getEquipmentStats() {
        return PlayerInventoryManager.getEquipmentStats(this);
    }

    getVisibilityMult(): number {
        if (!this.isSneaking) return 1.0;
        const sneakLevel = this.talents['sneak'] || 0;
        if (sneakLevel === 0) return 0.6;
        return 0.1;
    }

    get effectiveMaxStamina(): number {
        return this.maxStamina + this.getEquipmentStats().bonusStamina + (this.hasFavoredDeity('DORIM') ? 50 : 0);
    }

    get effectiveMaxHealth(): number {
        return this.maxHealth + this.getEquipmentStats().bonusHealth + (this.buffs.maxHealth > 0 ? 50 : 0) + (this.hasFavoredDeity('PRIMORDIAL') ? 100 : 0) + (this.hasFavoredDeity('HALO') ? 50 : 0) + (this.hasFavoredDeity('DERGU') ? 50 : 0);
    }

    get effectiveMaxMana(): number {
        return this.maxMana + this.getEquipmentStats().bonusMana + (this.buffs.maxMana > 0 ? 50 : 0) + (this.hasFavoredDeity('ARCANIS') ? 50 : 0) + (this.hasFavoredDeity('INANIS') ? 50 : 0);
    }

    get effectiveSpeed(): number {
        let spd = 9.0 + this.getEquipmentStats().speedBonus; 
        if (this.hasFavoredDeity('DI')) spd *= 1.25;
        if (this.statuses.chill > 0) spd *= 0.5; // 50% slow while chilled
        return spd;
    }

    constructor() {
        // Initial empty inventory
    }

    applyRacialBenefits(raceName: string) {
        this.race = raceName;
        const race = RaceRegistry.get(raceName);
        if (race && race.startingTalents) {
            for (const [talent, bonus] of Object.entries(race.startingTalents)) {
                this.talents[talent] = (this.talents[talent] || 0) + bonus;
            }
        } else {
            // Default generic fallback
            this.talents['vitality'] = (this.talents['vitality'] || 0) + 2;
            this.talents['endurance'] = (this.talents['endurance'] || 0) + 1;
        }
    }

    applyStartingPack(packName: string) {
        this.inventory = new Array(160).fill(null);
        this.inventory[0] = { ...ITEMS['tent'] };
        this.inventory[1] = { ...ITEMS['dagger_1'] };

        const pack = STARTING_PACKS.find(p => p.name === packName);
        if (pack) {
            pack.apply(this);
        } else {
            // Default fallback
            this.inventory[2] = { ...ITEMS['sword_1'] };
            this.inventory[3] = { ...ITEMS['shovel_1'] };
        }
    }

    learnSpell(inventoryIndex: number) {
        return PlayerProgression.learnSpell(this, inventoryIndex);
    }

    get xpMultiplier(): number {
        return PlayerProgression.getXpMultiplier(this);
    }

    addXp(amount: number) {
        PlayerProgression.addXp(this, amount);
    }

    upgradeTalent(talentId: string): boolean {
        return PlayerProgression.upgradeTalent(this, talentId);
    }

    addToInventory(item: Item): boolean {
        return PlayerInventoryManager.addToInventory(this, item);
    }

    hasItem(id: string, quantity: number): boolean {
        return PlayerInventoryManager.hasItem(this, id, quantity);
    }

    removeItem(id: string, quantity: number): boolean {
        return PlayerInventoryManager.removeItem(this, id, quantity);
    }

    isNearStation(stationId: string, world: World): boolean {
        return PlayerInventoryManager.isNearStation(this, stationId, world);
    }

    craftRecipe(recipeId: string, world: World): boolean {
        return PlayerInventoryManager.craftRecipe(this, recipeId, world);
    }

    equipItem(inventoryIndex: number, targetSlot: EquipmentSlot) {
        return PlayerInventoryManager.equipItem(this, inventoryIndex, targetSlot);
    }

    unequipItem(slot: EquipmentSlot) {
        return PlayerInventoryManager.unequipItem(this, slot);
    }

    getDefense(): number {
        let def = this.getEquipmentStats().defense;
        if (this.hasFavoredDeity('VERI')) def += 5;
        return def;
    }

    takeDamage(amount: number) {
        PlayerStatsManager.takeDamage(this, amount);
    }

    castBlink(ctx: UpdateContext) {
        let distance = 0;
        let destX = this.x;
        let destY = this.y;
        while (distance < 20) {
            const nextX = destX + Math.cos(this.aimAngle) * 0.5;
            const nextY = destY + Math.sin(this.aimAngle) * 0.5;
            if (isSolid(ctx.world.getBlock(Math.floor(nextX), Math.floor(nextY), Math.floor(this.z)))) {
                break;
            }
            destX = nextX;
            destY = nextY;
            distance += 0.5;
        }
        // Emit blink effect start
        if (ctx.onShoot) {
            ctx.onShoot(this.x, this.y, this.z + 1, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0, 'BLINK_FX', 0.5);
        }
        
        this.x = destX;
        this.y = destY;
        
        // Emit blink effect end
        if (ctx.onShoot) {
            ctx.onShoot(this.x, this.y, this.z + 1, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0, 'BLINK_FX', 0.5);
        }
    }

    update(ctx: UpdateContext) {
        if (this.buffs.mistForm > 0 || this.isEyeMode) {
            ctx.attacking = false;
            // Allow casting only for EYE spell to sustain it, but other spells no.
            // Actually, we process eye spell intercept early, so we can just set casting to same or false later if needed,
            // but ctx is passed to systems. Interaction/attack/dash should be blocked.
            ctx.interacting = false;
            ctx.dashing = false;
            if (this.isEyeMode && this.activeSpell !== 'eye') ctx.casting = false;
        }

        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onSaddleBagUse, onPlantBomb, onTriggerSecondary } = ctx;

        const equipStats = this.getEquipmentStats();
        
        PlayerStatsManager.updateStats(this, dt, equipStats, onAoE, world);

        // Aiming
        if (Math.abs(aimX) > 0.1 || Math.abs(aimY) > 0.1) {
            this.aimAngle = Math.atan2(aimY, aimX);
        } else if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            this.aimAngle = Math.atan2(dy, dx);
        }

        // Portal Interaction
        if (interacting) {
            const interacted = PlayerEnvironment.interact(this, ctx);
            if (interacted) {
                 return;
            }

            for (const [color, pos] of Object.entries(this.portals)) {
                const distSq = (this.x - pos.x)**2 + (this.y - pos.y)**2 + (this.z - pos.z)**2;
                if (distSq < 2.0) {
                    if (onOpenPortalMenu) {
                        onOpenPortalMenu(color);
                    }
                    break;
                }
            }
        }

        PlayerCombat.update(this, ctx);

        PlayerController.update(this, ctx);

        PlayerInventory.updateQuickSlots(this, ctx);

        PlayerStatsManager.handleDeath(this);
    }
}
