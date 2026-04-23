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

export interface UpdateContext {
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
    onShoot?: (x: number, y: number, z: number, vx: number, vy: number, damage: number, damageType?: string, life?: number, statusEffect?: any) => void;
    onAoE?: (x: number, y: number, z: number, radius: number, damage: number, damageType?: string, statusEffect?: any) => void;
    onPersistentAoE?: (x: number, y: number, z: number, radius: number, life: number, type: string, color: string, damage?: number) => void;
    onCastSpell?: (x: number, y: number, z: number, spellId: string, aimAngle: number) => void;
    onSaddleUse?: (x: number, y: number, z: number, aimAngle: number) => boolean;
    onPlantBomb?: (x: number, y: number, z: number) => boolean;
    onMelee?: (reach: number, spread: number, damage: number, statusEffect?: any) => void;
    onDropItem?: (x: number, y: number, z: number, item: Item) => void;
    onOpenPortalMenu?: (color: string) => void;
    onTriggerSecondary?: (ability: string, aimAngle: number, x: number, y: number, z: number) => void;
    onChangePlanet?: (planetId: string) => void;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    completed: boolean;
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
    statuses: { burn: number, poison: number, chill: number, bleed: number } = { burn: 0, poison: 0, chill: 0, bleed: 0 };
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
    buffs: Record<string, number> = { speed: 0, levitate: 0, invisibility: 0, maxHealth: 0, maxMana: 0, healthRegen: 0, manaRegen: 0, arcaneProtection: 0 };
    
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

    inventory: (Item | null)[] = new Array(80).fill(null);
    mounts: any[] = [];
    activeMount: any = null;
    isMounted = false;
    equipment: Record<EquipmentSlot, Item | null> = {
        MAIN_HAND: null, OFF_HAND: null, HEAD: null, SHOULDERS: null, BODY: null, HANDS: null, BELT: null, LEGS: null, FEET: null, CLOAK: null, RIGHT_RING: null, LEFT_RING: null, NECKLACE: null, AMMO: null
    };

    getEquipmentStats() {
        let stats = {
            defense: 0,
            lifesteal: 0,
            bonusHealth: 0,
            bonusMana: 0,
            bonusStamina: 0,
            healthRegen: 0,
            manaRegen: 0,
            speedBonus: 0,
            bonusDamage: 0
        };
        for (const slot in this.equipment) {
            const item = this.equipment[slot as EquipmentSlot];
            if (item) {
                let defBonusMultiplier = 1.0;
                let isLight = item.armorWeight === 'LIGHT' || item.id.includes('fabric') || item.id.includes('cloth') || item.id.includes('silk') || item.id.includes('glider') || item.id.includes('mask');
                let isMedium = item.armorWeight === 'MEDIUM' || item.id.includes('leather') || item.id.includes('hide');
                let isHeavy = item.armorWeight === 'HEAVY' || item.id.includes('iron') || item.id.includes('abyssal') || item.id.includes('dragon') || item.id.includes('metal') || item.id.includes('mithril') || item.id.includes('adamantium') || item.id.includes('eternium') || item.id.includes('gold') || item.id.includes('silver') || item.id.includes('copper') || item.id.includes('platinum');

                const lightTalent = this.talents['light_armor'] || 0;
                const mediumTalent = this.talents['medium_armor'] || 0;
                const heavyTalent = this.talents['heavy_armor'] || 0;

                if (isLight) {
                    if (lightTalent === 1) defBonusMultiplier = 1.1;
                    if (lightTalent === 2) defBonusMultiplier = 1.25;
                    if (lightTalent === 3) defBonusMultiplier = 1.5;
                } else if (isMedium) {
                    if (mediumTalent === 1) defBonusMultiplier = 1.1;
                    if (mediumTalent === 2) defBonusMultiplier = 1.25;
                    if (mediumTalent === 3) defBonusMultiplier = 1.5;
                } else if (isHeavy || item.defense && item.defense >= 3) {
                    if (heavyTalent === 1) defBonusMultiplier = 1.1;
                    if (heavyTalent === 2) defBonusMultiplier = 1.25;
                    if (heavyTalent === 3) defBonusMultiplier = 1.5;
                }

                if (item.defense) stats.defense += Math.floor(item.defense * defBonusMultiplier);
                if (item.lifesteal) stats.lifesteal += item.lifesteal;
                if (item.bonusHealth) stats.bonusHealth += item.bonusHealth;
                if (item.bonusMana) stats.bonusMana += item.bonusMana;
                if (item.healthRegen) stats.healthRegen += item.healthRegen;
                if (item.manaRegen) stats.manaRegen += item.manaRegen;
                if (item.speedBonus) stats.speedBonus += item.speedBonus;
                if (item.bonusDamage) stats.bonusDamage += item.bonusDamage;
            }
        }
        
        // Add global flat bonuses for talents
        const lightArmorTalentLevel = this.talents['light_armor'] || 0;
        stats.bonusMana += lightArmorTalentLevel * 20;

        const mediumArmorTalentLevel = this.talents['medium_armor'] || 0;
        stats.bonusStamina += mediumArmorTalentLevel * 20;
        
        const heavyArmorTalentLevel = this.talents['heavy_armor'] || 0;
        stats.bonusHealth += heavyArmorTalentLevel * 20;

        const ss = this.starSign ? getZodiacStats(this.starSign) : null;
        if (ss) {
            if (ss.maxHealth) stats.bonusHealth += ss.maxHealth;
            if (ss.maxMana) stats.bonusMana += ss.maxMana;
            if (ss.maxStamina) stats.bonusStamina += ss.maxStamina;
            if (ss.defense) stats.defense += ss.defense;
            if (ss.healthRegen) stats.healthRegen += ss.healthRegen;
            if (ss.manaRegen) stats.manaRegen += ss.manaRegen;
            if (ss.speedBonus) stats.speedBonus += ss.speedBonus;
            if (ss.bonusDamage) stats.bonusDamage += ss.bonusDamage;
            if (ss.lifesteal) stats.lifesteal += ss.lifesteal;
        }

        if (this.buffs.arcaneProtection > 0) {
            stats.defense += 20; // Increase defense by +20, or whatever. The prompt just said "increasing the players defence value for 20 seconds."
        }

        return stats;
    }

    getVisibilityMult(): number {
        if (!this.isSneaking) return 1.0;
        const sneakLevel = this.talents['sneak'] || 0;
        if (sneakLevel === 0) return 0.6;
        if (sneakLevel === 1) return 0.4;
        if (sneakLevel === 2) return 0.2;
        return 0.1; // Level 3
    }

    get effectiveMaxStamina(): number {
        return this.maxStamina + this.getEquipmentStats().bonusStamina + (this.hasFavoredDeity('DORIM') ? 50 : 0);
    }

    get effectiveMaxHealth(): number {
        return this.maxHealth + this.getEquipmentStats().bonusHealth + (this.buffs.maxHealth > 0 ? 50 : 0) + (this.hasFavoredDeity('PRIMORDIAL') ? 100 : 0);
    }

    get effectiveMaxMana(): number {
        return this.maxMana + this.getEquipmentStats().bonusMana + (this.buffs.maxMana > 0 ? 50 : 0) + (this.hasFavoredDeity('ARCANIS') ? 50 : 0);
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

    applyRacialBenefits(race: string) {
        this.race = race;
        
        // Reset specific starting talents first? No, just apply them.
        switch (race) {
            case 'HUMAN':
            case 'HALF ELF':
                this.talents['vitality'] = (this.talents['vitality'] || 0) + 2;
                this.talents['endurance'] = (this.talents['endurance'] || 0) + 2;
                this.talents['focus'] = (this.talents['focus'] || 0) + 1;
                break;
            case 'HILL DWARF':
            case 'MOUNTAIN DWARF':
            case 'CYCLOPSE DWARF':
                this.talents['masonry'] = (this.talents['masonry'] || 0) + 3;
                break;
            case 'HIGH ELF':
            case 'WOOD ELF':
            case 'DARK ELF':
            case 'RED ELF':
            case 'TIGER ELF':
            case 'WINTER ELF':
            case 'SEA ELF':
                this.talents['focus'] = (this.talents['focus'] || 0) + 2;
                this.talents['reading'] = (this.talents['reading'] || 0) + 1;
                break;
            case 'TINKER GNOME':
            case 'GLOW GNOME':
                this.talents['smithing'] = (this.talents['smithing'] || 0) + 3;
                break;
            case 'WOOD GOBLIN':
            case 'SWAMP GOBLIN':
            case 'ORC':
            case 'DARK ORC':
            case 'OGRE':
                this.talents['swords'] = (this.talents['swords'] || 0) + 2;
                this.talents['vitality'] = (this.talents['vitality'] || 0) + 1;
                break;
            case 'BEAR FOLK':
            case 'DEER FOLK':
            case 'PIT BULL FOLK':
            case 'WOLF FOLK':
                this.talents['vitality'] = (this.talents['vitality'] || 0) + 3;
                break;
            case 'RABBIT FOLK':
                this.talents['jump'] = (this.talents['jump'] || 0) + 2;
                this.talents['dash'] = (this.talents['dash'] || 0) + 1;
                break;
            default:
                this.talents['vitality'] = (this.talents['vitality'] || 0) + 2;
                this.talents['endurance'] = (this.talents['endurance'] || 0) + 1;
                break;
        }
    }

    applyStartingPack(packName: string) {
        this.inventory = new Array(80).fill(null);
        
        // Traveler's Starter Pack
        if (packName === "Traveler's Starter Pack" || packName === "Travelers Starter Pack") {
            this.inventory[0] = { ...ITEMS['sword_1'] };
            this.inventory[1] = { ...ITEMS['pickaxe_1'] };
            this.inventory[2] = { ...ITEMS['tent'] };
            this.inventory[3] = { ...ITEMS['rune_key_threa'] };
            this.inventory[4] = { ...ITEMS['rune_key_areth'] };
            this.inventory[5] = { ...ITEMS['rune_key_thera'] };
            return;
        }

        // Everyone gets a tent and some basic supplies (legacy packs)
        this.inventory[0] = { ...ITEMS['tent'] };
        this.inventory[1] = { ...ITEMS['dagger_1'] };

        if (packName === "Warrior's Kit") {
            this.inventory[2] = { ...ITEMS['sword_1'] };
            this.inventory[3] = { ...ITEMS['greatsword_1'] };
        } else if (packName === "Mage's Satchel") {
            this.talents['reading'] = 3; // Mages start with max reading
            this.inventory[2] = { ...ITEMS['staff_fire_ranged'] };
            this.inventory[3] = { ...ITEMS['travelers_staff_acid'] };
            this.inventory[4] = { ...ITEMS['book_burning_hands'] };
            this.inventory[5] = { ...ITEMS['book_fire_bolt'] };
            this.inventory[6] = { ...ITEMS['book_ice_bolt'] };
            this.inventory[7] = { ...ITEMS['book_lightning_bolt'] };
            this.inventory[8] = { ...ITEMS['book_arcane_bolt'] };
            this.inventory[9] = { ...ITEMS['book_acid_bolt'] };
            this.inventory[10] = { ...ITEMS['book_force_bolt'] };
            this.inventory[11] = { ...ITEMS['book_fire_ball'] };
            this.inventory[12] = { ...ITEMS['book_ice_ball'] };
            this.inventory[13] = { ...ITEMS['book_lightning_ball'] };
            this.inventory[14] = { ...ITEMS['book_arcane_ball'] };
            this.inventory[15] = { ...ITEMS['book_acid_ball'] };
            this.inventory[16] = { ...ITEMS['book_force_ball'] };
            this.inventory[17] = { ...ITEMS['book_mark_return'] };
            this.inventory[18] = { ...ITEMS['book_color_portals'] };
        } else if (packName === "Ranger's Pack") {
            this.inventory[2] = { ...ITEMS['shortbow_1'] };
            this.inventory[3] = { ...ITEMS['arrow_1'], quantity: 99 };
        } else if (packName === "Builder's Crate") {
            this.inventory[2] = { ...ITEMS['shovel_1'] };
            this.inventory[3] = { ...ITEMS['goblin_tent_alchemist'], quantity: 5 };
            this.inventory[4] = { ...ITEMS['goblin_tent_rockhurler'], quantity: 5 };
            this.inventory[5] = { ...ITEMS['goblin_tent_gardener'], quantity: 5 };
            this.inventory[6] = { ...ITEMS['goblin_tent_boomeranger'], quantity: 5 };
            this.inventory[7] = { ...ITEMS['orc_tent_brute'], quantity: 5 };
            this.inventory[8] = { ...ITEMS['orc_tent_shaman'], quantity: 5 };
            this.inventory[9] = { ...ITEMS['orc_tent_hunter'], quantity: 5 };
            this.inventory[10] = { ...ITEMS['kobold_tent_trapper'], quantity: 5 };
            this.inventory[11] = { ...ITEMS['dark_elf_tent'], quantity: 5 };
            this.inventory[12] = { ...ITEMS['arrow_turret'], quantity: 5 };
            this.inventory[13] = { ...ITEMS['archer_contract'], quantity: 5 };
            this.inventory[14] = { ...ITEMS['worker_contract'], quantity: 5 };
            this.inventory[15] = { ...ITEMS['giant_camp'], quantity: 5 };
            this.inventory[16] = { ...ITEMS['titan_nest'], quantity: 5 };
            this.inventory[17] = { ...ITEMS['rune_key_terha'], quantity: 5 };
            this.inventory[18] = { ...ITEMS['void_beacon'], quantity: 5 };
            this.inventory[19] = { ...ITEMS['magitech_mech'], quantity: 2 };
            this.inventory[20] = { ...ITEMS['conveyor_belt'], quantity: 50 };
            this.inventory[21] = { ...ITEMS['auto_miner'], quantity: 10 };
            this.inventory[22] = { ...ITEMS['auto_dropper'], quantity: 10 };
            this.inventory[23] = { ...ITEMS['vacuum_hopper'], quantity: 10 };
            this.inventory[24] = { ...ITEMS['gardener_contract'], quantity: 5 };
            this.inventory[25] = { ...ITEMS['miner_contract'], quantity: 5 };
            this.inventory[26] = { ...ITEMS['guard_contract'], quantity: 5 };
            this.inventory[27] = { ...ITEMS['halfling_house_spawner'], quantity: 5 };
            this.inventory[28] = { ...ITEMS['pit_bull_tent'], quantity: 5 };
            this.inventory[29] = { ...ITEMS['pomeranian_wagon'], quantity: 5 };
            this.inventory[30] = { ...ITEMS['terrier_tent'], quantity: 5 };
            this.inventory[31] = { ...ITEMS['wolf_folk_camp'], quantity: 5 };
        } else if (packName === "Miner's Pack") {
            this.inventory[2] = { ...ITEMS['pickaxe_1'] };
            this.inventory[3] = { ...ITEMS['shovel_1'] };
            this.inventory[4] = { ...ITEMS['torch'], quantity: 10 };
            this.inventory[5] = { ...ITEMS['tent'] };
        } else if (packName === "Logger's Pack") {
            this.inventory[2] = { ...ITEMS['axe_1'] };
            this.inventory[3] = { ...ITEMS['tent'] };
            this.inventory[4] = { ...ITEMS['torch'], quantity: 10 };
        } else if (packName === "The Grab Bag Pack") {
            const allItems = Object.values(ITEMS);
            for (let i = 0; i < 10; i++) {
                const rItem = allItems[Math.floor(Math.random() * allItems.length)];
                this.inventory[i + 2] = { ...rItem, quantity: rItem.maxStack ? Math.floor(Math.random() * rItem.maxStack) + 1 : 1 };
            }
        } else if (packName === "The Caster Pack") {
            const allStaves = Object.values(ITEMS).filter(i => i.id.includes('staff'));
            const allSpellbooks = Object.values(ITEMS).filter(i => i.id.includes('book_'));
            this.inventory[2] = { ...allStaves[Math.floor(Math.random() * allStaves.length)] };
            this.inventory[3] = { ...allStaves[Math.floor(Math.random() * allStaves.length)] };
            this.inventory[4] = { ...allSpellbooks[Math.floor(Math.random() * allSpellbooks.length)] };
            this.inventory[5] = { ...allSpellbooks[Math.floor(Math.random() * allSpellbooks.length)] };
            this.talents['reading'] = 3;
        } else if (packName === "The Masons Pack") {
            this.inventory[2] = { ...ITEMS['stone'], quantity: 99 };
            this.inventory[3] = { ...ITEMS['stone'], quantity: 99 };
            this.inventory[4] = { ...ITEMS['stone'], quantity: 99 };
            this.inventory[5] = { ...ITEMS['stone'], quantity: 99 };
            const allWeapons = Object.values(ITEMS).filter(i => i.category === 'WEAPON');
            this.inventory[6] = { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
            this.inventory[7] = { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
        } else if (packName === "The Berry Pack") {
            const allBerrySeeds = Object.values(ITEMS).filter(i => i.id.includes('berry_seed'));
            this.inventory[2] = { ...allBerrySeeds[Math.floor(Math.random() * allBerrySeeds.length)], quantity: 99 };
            this.inventory[3] = { ...allBerrySeeds[Math.floor(Math.random() * allBerrySeeds.length)], quantity: 99 };
            this.inventory[4] = { ...ITEMS['hoe_1'] };
            this.inventory[5] = { ...ITEMS['gardener_contract'] };
            const allWeapons = Object.values(ITEMS).filter(i => i.category === 'WEAPON');
            this.inventory[6] = { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
            this.inventory[7] = { ...ITEMS['dirt'], quantity: 99 };
        } else if (packName === "The Wanderers Pack") {
            this.inventory[2] = { ...ITEMS['wooden_boomerang'] };
            const allArmors = Object.values(ITEMS).filter(i => i.category === 'ARMOR');
            const allTools = Object.values(ITEMS).filter(i => i.category === 'TOOL');
            const allWeapons = Object.values(ITEMS).filter(i => i.category === 'WEAPON');
            const allRuneKeys = Object.values(ITEMS).filter(i => i.id.includes('rune_key_'));
            this.inventory[3] = { ...allArmors[Math.floor(Math.random() * allArmors.length)] };
            this.inventory[4] = { ...allTools[Math.floor(Math.random() * allTools.length)] };
            this.inventory[5] = { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
            this.inventory[6] = { ...allRuneKeys[Math.floor(Math.random() * allRuneKeys.length)] };
        } else if (packName === "Gnome Buggy Starter Pack") {
            const allWeapons = Object.values(ITEMS).filter(i => i.category === 'WEAPON');
            const gnomeBuggyItem = Object.values(ITEMS).find(i => i.id.includes('gnome') && i.id.includes('buggy')) || ITEMS['magitech_mech']; 
            this.inventory[2] = { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
            this.inventory[3] = { ...gnomeBuggyItem };
        } else if (packName === "The Beastmaster's Pack") {
            const allMounts = Object.values(ITEMS).filter(i => i.id.endsWith('_mount'));
            const allMeat = Object.values(ITEMS).filter(i => i.id === 'meat' || i.id === 'cooked_meat');
            this.inventory[2] = { ...allMounts[Math.floor(Math.random() * allMounts.length)] };
            this.inventory[3] = { ...ITEMS['meat'], quantity: 50 };
            this.inventory[4] = { ...ITEMS['cooked_meat'], quantity: 25 };
            this.inventory[5] = { ...ITEMS['shortbow_1'] };
            this.inventory[6] = { ...ITEMS['arrow_1'], quantity: 99 };
        } else if (packName === "The Automation Tycoon Pack") {
            this.inventory[2] = { ...ITEMS['conveyor_belt'], quantity: 99 };
            this.inventory[3] = { ...ITEMS['auto_miner'], quantity: 15 };
            this.inventory[4] = { ...ITEMS['auto_dropper'], quantity: 15 };
            this.inventory[5] = { ...ITEMS['vacuum_hopper'], quantity: 15 };
            this.inventory[6] = { ...ITEMS['worker_contract'], quantity: 5 };
            this.inventory[7] = { ...ITEMS['storage_chest'], quantity: 10 };
            this.inventory[8] = { ...ITEMS['furnace'], quantity: 10 };
        } else if (packName === "The Lord's Retinue") {
            this.inventory[2] = { ...ITEMS['guard_contract'], quantity: 2 };
            this.inventory[3] = { ...ITEMS['archer_contract'], quantity: 2 };
            this.inventory[4] = { ...ITEMS['gardener_contract'], quantity: 1 };
            this.inventory[5] = { ...ITEMS['miner_contract'], quantity: 1 };
            this.inventory[6] = { ...ITEMS['worker_contract'], quantity: 1 };
            this.inventory[7] = { ...ITEMS['gold_piece'], quantity: 99 };
            this.inventory[8] = { ...ITEMS['silver_piece'], quantity: 99 };
            this.inventory[9] = { ...ITEMS['iron_armor'] };
            this.inventory[10] = { ...ITEMS['iron_legs'] };
            this.inventory[11] = { ...ITEMS['iron_helm'] };
            this.inventory[12] = { ...ITEMS['sword_1'] };
        } else if (packName === "The Daredevil's Kit") {
            this.inventory[2] = { ...ITEMS['glider'] };
            this.inventory[3] = { ...ITEMS['grappling_hook'] };
            this.inventory[4] = { ...ITEMS['ring_dash'] };
            this.inventory[5] = { ...ITEMS['health_potion'], quantity: 15 };
            this.inventory[6] = { ...ITEMS['rune_key_areth'] };
            this.talents['dash'] = 3;
            this.talents['jump'] = 3;
        } else if (packName === "The Potions Master") {
            this.inventory[2] = { ...ITEMS['health_potion'], quantity: 20 };
            this.inventory[3] = { ...ITEMS['mana_potion'], quantity: 20 };
            this.inventory[4] = { ...ITEMS['alchemy_table'] };
            this.inventory[5] = { ...ITEMS['pot'] };
            this.inventory[6] = { ...ITEMS['red_berry'], quantity: 99 };
            this.inventory[7] = { ...ITEMS['blue_berry'], quantity: 99 };
            this.inventory[8] = { ...ITEMS['weed'], quantity: 99 };
            this.inventory[9] = { ...ITEMS['spider_web'], quantity: 10 };
        } else if (packName === "Boomeranger Pack") {
            const allBoomerangs = Object.values(ITEMS).filter(i => i.id.includes('boomerang') && i.category === 'WEAPON');
            const allItems = Object.values(ITEMS);
            
            this.inventory[2] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
            
            // Random items need bounds or they might exceed stack capacities, but grabbing bag pack uses randoms too
            const rItem1 = allItems[Math.floor(Math.random() * allItems.length)];
            const rItem2 = allItems[Math.floor(Math.random() * allItems.length)];
            
            this.inventory[3] = { ...rItem1, quantity: rItem1.maxStack ? Math.floor(Math.random() * rItem1.maxStack) + 1 : 1 };
            this.inventory[4] = { ...rItem2, quantity: rItem2.maxStack ? Math.floor(Math.random() * rItem2.maxStack) + 1 : 1 };
            this.talents['boomerang'] = 1;
        } else {
            // Default fallback
            this.inventory[2] = { ...ITEMS['sword_1'] };
            this.inventory[3] = { ...ITEMS['shovel_1'] };
        }
    }

    learnSpell(inventoryIndex: number) {
        const item = this.inventory[inventoryIndex];
        if (item) {
            const baseItem = ITEMS[item.id];
            const spellId = item.spellId || baseItem?.spellId;
            const spellIds = item.spellIds || baseItem?.spellIds;

            const spellsToLearn: string[] = [];
            if (spellId && !this.knownSpells.includes(spellId)) {
                spellsToLearn.push(spellId);
            }
            if (spellIds) {
                for (const sid of spellIds) {
                    if (!this.knownSpells.includes(sid)) {
                        spellsToLearn.push(sid);
                    }
                }
            }

            if (spellsToLearn.length > 0) {
                const readingLevel = this.talents['reading'] || 0;
                if (readingLevel < 3) {
                    // Cannot read spell books without max reading talent
                    if (this.onMessage) this.onMessage("Need Reading Level 3!");
                    return false;
                }
                for (const sid of spellsToLearn) {
                    this.knownSpells.push(sid);
                }
                if (this.onMessage) this.onMessage("Learned new spells!");
                // Consume item
                if (item.quantity && item.quantity > 1) {
                    item.quantity--;
                } else {
                    this.inventory[inventoryIndex] = null;
                }
                return true;
            } else {
                if (this.onMessage) this.onMessage("Already know these spells!");
                return false;
            }
        }
        return false;
    }

    get xpMultiplier(): number {
        return this.hasFavoredDeity('ERUDI') ? 1.5 : 1.0;
    }

    addXp(amount: number) {
        this.xp += amount * this.xpMultiplier;
        
        // OBITU PASSIVE: 10% chance to heal for 5 on gaining XP (killing blows/breaking stuff)
        if (this.hasFavoredDeity('OBITU') && Math.random() < 0.1 && this.health < this.effectiveMaxHealth) {
            this.health = Math.min(this.effectiveMaxHealth, this.health + 5);
        }

        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.skillPoints++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
            this.maxHealth += 10;
            this.health = this.effectiveMaxHealth;
            this.maxStamina += 10;
            this.stamina = this.effectiveMaxStamina;
            this.maxMana += 10;
            this.mana = this.effectiveMaxMana;
        }
    }

    upgradeTalent(talentId: string): boolean {
        const talentDef = TALENTS[talentId];
        if (!talentDef) return false;
        
        const currentLevel = this.talents[talentId] || 0;
        if (this.skillPoints > 0 && currentLevel < talentDef.maxLevel) {
            this.skillPoints--;
            this.talents[talentId] = currentLevel + 1;
            
            // Apply immediate effects if needed
            if (talentId === 'vitality') {
                this.maxHealth += 20;
                this.health += 20;
            } else if (talentId === 'endurance') {
                this.maxStamina += 20;
                this.stamina += 20;
            } else if (talentId === 'focus') {
                this.maxMana += 20;
                this.mana += 20;
            }
            
            return true;
        }
        return false;
    }

    addToInventory(item: Item): boolean {
        // Try to stack first
        if (item.maxStack && item.maxStack > 1) {
            for (let i = 0; i < this.inventory.length; i++) {
                const existing = this.inventory[i];
                if (existing && existing.id === item.id) {
                    const currentQty = existing.quantity || 1;
                    const addQty = item.quantity || 1;
                    if (currentQty + addQty <= item.maxStack) {
                        existing.quantity = currentQty + addQty;
                        return true;
                    }
                }
            }
        }
        
        // Find empty slot
        for (let i = 0; i < this.inventory.length; i++) {
            if (!this.inventory[i]) {
                this.inventory[i] = { ...item };
                return true;
            }
        }
        return false;
    }

    hasItem(id: string, quantity: number): boolean {
        let count = 0;
        for (const item of this.inventory) {
            if (item && item.id === id) {
                count += item.quantity || 1;
            }
        }
        return count >= quantity;
    }

    removeItem(id: string, quantity: number): boolean {
        // TERRENUS PASSIVE: 10% chance to not consume a material when crafting or using it from inventory
        let actualQuantityToRemove = quantity;
        if (this.hasFavoredDeity('TERRENUS')) {
            for (let i = 0; i < quantity; i++) {
                 if (Math.random() < 0.1) {
                     actualQuantityToRemove--;
                 }
            }
        }
        if (actualQuantityToRemove <= 0) return true;
        
        // Use actualQuantityToRemove instead of quantity for the rest of function
        if (!this.hasItem(id, actualQuantityToRemove)) return false;
        
        let remainingToRemove = actualQuantityToRemove;
        for (let i = 0; i < this.inventory.length; i++) {
            const item = this.inventory[i];
            if (item && item.id === id) {
                const currentQty = item.quantity || 1;
                if (currentQty > remainingToRemove) {
                    item.quantity = currentQty - remainingToRemove;
                    return true;
                } else {
                    remainingToRemove -= currentQty;
                    this.inventory[i] = null;
                    // Also check quick slots
                    for(let q=0; q<3; q++) {
                        if (this.quickSlots[q] === item) this.quickSlots[q] = null;
                    }
                    if (remainingToRemove === 0) return true;
                }
            }
        }
        return remainingToRemove === 0;
    }

    isNearStation(stationId: string, world: World): boolean {
        let stationBlockType = BlockType.AIR;
        if (stationId === 'carpenters_bench') {
            stationBlockType = BlockType.CARPENTERS_BENCH;
        } else if (stationId === 'masonry_table') {
            stationBlockType = BlockType.MASONRY_TABLE;
        } else if (stationId === 'fabric_station') {
            stationBlockType = BlockType.FABRIC_STATION;
        } else if (stationId === 'leather_station') {
            stationBlockType = BlockType.LEATHER_STATION;
        } else if (stationId === 'furnace') {
            stationBlockType = BlockType.FURNACE;
        } else if (stationId === 'anvil') {
            stationBlockType = BlockType.ANVIL;
        } else if (stationId === 'forge') {
            // forge doesn't exist as a block type yet...
        } else if (stationId === 'alchemy_table') {
            stationBlockType = BlockType.ALCHEMY_TABLE;
        } else if (stationId === 'cooking_pot') {
            stationBlockType = BlockType.COOKING_POT;
        } else if (stationId === 'forge') {
            // A forge is an anvil directly next to a furnace
            const px = Math.floor(this.x);
            const py = Math.floor(this.y);
            const pz = Math.floor(this.z);
            const radius = 3;
            
            for (let x = px - radius; x <= px + radius; x++) {
                for (let y = py - radius; y <= py + radius; y++) {
                    for (let z = pz - 1; z <= pz + 1; z++) {
                        if (world.getBlock(x, y, z) === BlockType.ANVIL) {
                            // Check adjacent blocks for furnace
                            if (world.getBlock(x + 1, y, z) === BlockType.FURNACE ||
                                world.getBlock(x - 1, y, z) === BlockType.FURNACE ||
                                world.getBlock(x, y + 1, z) === BlockType.FURNACE ||
                                world.getBlock(x, y - 1, z) === BlockType.FURNACE) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        
        if (stationBlockType === BlockType.AIR) return true;

        const px = Math.floor(this.x);
        const py = Math.floor(this.y);
        const pz = Math.floor(this.z);
        const radius = 3;
        
        for (let x = px - radius; x <= px + radius; x++) {
            for (let y = py - radius; y <= py + radius; y++) {
                for (let z = pz - 1; z <= pz + 1; z++) {
                    if (world.getBlock(x, y, z) === stationBlockType) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    craftRecipe(recipeId: string, world: World): boolean {
        const recipe = RecipeRegistry.get(recipeId);
        if (!recipe) return false;

        // Check required station
        if (recipe.requiredStation && !this.isNearStation(recipe.requiredStation, world)) {
            return false;
        }

        // Check if we have all ingredients
        for (const ingredient of recipe.ingredients) {
            if (!this.hasItem(ingredient.id, ingredient.quantity)) {
                return false;
            }
        }

        // Check if we have space for the result (simplification: assume yes if we consume items, but to be safe, we should check)
        // Actually, we'll just try to add it after removing. If it fails to add, we drop it or something.
        // For now, just remove ingredients and add result.
        for (const ingredient of recipe.ingredients) {
            this.removeItem(ingredient.id, ingredient.quantity);
        }

        const resultItem = { ...ITEMS[recipe.result.id] };
        if (recipe.result.quantity > 1) {
            resultItem.quantity = recipe.result.quantity;
        }
        
        if (!this.addToInventory(resultItem)) {
            // If inventory is full, we should probably drop it on the ground, but we don't have access to world here easily.
            // For now, just return true anyway, the item is lost.
            // Ideally we'd check space first.
        }

        return true;
    }

    equipItem(inventoryIndex: number, targetSlot: EquipmentSlot) {
        const item = this.inventory[inventoryIndex];
        if (!item) return false;

        // Validate armor slot
        if (item.category === 'ARMOR' && item.equipmentSlot) {
            const isRing = item.equipmentSlot === 'RIGHT_RING' || item.equipmentSlot === 'LEFT_RING';
            const targetIsRing = targetSlot === 'RIGHT_RING' || targetSlot === 'LEFT_RING';
            
            if (isRing) {
                if (!targetIsRing) return false;
            } else if (item.equipmentSlot !== targetSlot) {
                return false;
            }
        }

        // Validate weapon slot
        if (item.category === 'WEAPON' && targetSlot !== 'MAIN_HAND' && targetSlot !== 'OFF_HAND') {
            return false;
        }

        // Handle Two-Handed logic
        if (item.category === 'WEAPON') {
            if (item.twoHanded) {
                // Unequip both hands first
                this.unequipItem('MAIN_HAND');
                this.unequipItem('OFF_HAND');
                targetSlot = 'MAIN_HAND'; // Force to main hand
            } else {
                // If equipping a 1H weapon, check if a 2H weapon is currently equipped
                const mainHandItem = this.equipment['MAIN_HAND'];
                if (mainHandItem?.twoHanded && (targetSlot === 'MAIN_HAND' || targetSlot === 'OFF_HAND')) {
                    this.unequipItem('MAIN_HAND');
                }
            }
        }

        // If there's already an item in the target slot, swap it
        const existingItem = this.equipment[targetSlot];
        
        this.equipment[targetSlot] = item;
        this.inventory[inventoryIndex] = existingItem;
        
        // Boomerang talent unlock
        if (targetSlot === 'MAIN_HAND' && item.id.includes('boomerang')) {
            if ((this.talents['boomerang'] || 0) === 0) {
                this.talents['boomerang'] = 1;
                if (this.onMessage) this.onMessage("Unlocked Boomerang Talent!");
            }
        }
        
        return true;
    }

    unequipItem(slot: EquipmentSlot) {
        const item = this.equipment[slot];
        if (!item) return false;

        // Find first empty inventory slot
        const emptyIndex = this.inventory.findIndex(i => i === null);
        if (emptyIndex !== -1) {
            this.inventory[emptyIndex] = item;
            this.equipment[slot] = null;
            return true;
        }
        
        // Inventory full
        return false;
    }

    getDefense(): number {
        return this.getEquipmentStats().defense;
    }

    takeDamage(amount: number) {
        if (amount <= 0) return;
        const defense = this.getDefense();
        // Flat reduction, minimum 1 damage
        const actualDamage = Math.max(1, amount - defense);
        this.health -= actualDamage;
        audioEngine.playHit();
        if (this.carryingPot) {
            this.carryingPot = false;
        }
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
        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;

        
        for (const buff in this.buffs) {
            if (this.buffs[buff] > 0) {
                this.buffs[buff] -= dt;
            }
        }
        
        const equipStats = this.getEquipmentStats();
        
        // Deity passive blessings
        if (this.hasFavoredDeity('SYLVARI') || this.hasFavoredDeity('FUNGAL WARPED')) {
            this.health = Math.min(this.effectiveMaxHealth, this.health + dt * 0.5); // Fast HP regen
        }
        if (this.hasFavoredDeity('UMBRIX') && this.isDashing) {
            this.buffs.invisibility = 0.5; // Brief invisibility on dash
        }
        if (this.hasFavoredDeity('RAGI')) {
            // Periodically emit a small lightning AoE around player
            if (!this.lastRagiTick) this.lastRagiTick = 0;
            this.lastRagiTick += dt;
            if (this.lastRagiTick > 5.0) {
                this.lastRagiTick = 0;
                if (onAoE) onAoE(this.x, this.y, this.z + 0.5, 3.0, 15, 'LIGHTNING');
                if (this.onMessage) this.onMessage("Ragi's storm strikes!");
            }
        }
        if (this.hasFavoredDeity('OBITU')) {
            this.buffs.poison = 0;
            this.buffs.bleed = 0;
        }
        if (this.hasFavoredDeity('INMORI')) {
            // TODO: Immunity to death at 1hp, implemented in death check
        }
        
        // Health regen from equipment
        if (equipStats.healthRegen > 0 && this.health < this.effectiveMaxHealth) {
            this.health = Math.min(this.effectiveMaxHealth, this.health + equipStats.healthRegen * dt);
        }
        
        // Mana regen
        if (this.mana < this.effectiveMaxMana) {
            const totalManaRegen = this.manaRegen + equipStats.manaRegen;
            this.mana = Math.min(this.effectiveMaxMana, this.mana + totalManaRegen * dt);
        }
        
        // Stamina regen
        if (this.stamina < this.effectiveMaxStamina) {
            this.stamina = Math.min(this.effectiveMaxStamina, this.stamina + this.staminaRegen * dt);
        }

        // Clamp values just in case gear was removed
        if (this.health > this.effectiveMaxHealth) this.health = this.effectiveMaxHealth;
        if (this.mana > this.effectiveMaxMana) this.mana = this.effectiveMaxMana;
        if (this.stamina > this.effectiveMaxStamina) this.stamina = this.effectiveMaxStamina;

        // Campfire & Generic Buff healing
        this.campfireHealTimer += dt;
        if (this.campfireHealTimer >= 1.0) {
            this.campfireHealTimer = 0;
            
            if (this.buffs.healthRegen > 0) {
                this.health = Math.min(this.effectiveMaxHealth, this.health + 5); // Regenerate 5 HP/sec
            }
            if (this.buffs.manaRegen > 0) {
                this.mana = Math.min(this.effectiveMaxMana, this.mana + 10); // Regenerate 10 MP/sec
            }
            
            if (this.health < this.effectiveMaxHealth) {
                let nearCampfire = false;
                const px = Math.floor(this.x);
                const py = Math.floor(this.y);
                const pz = Math.floor(this.z);
                for (let bx = px - 2; bx <= px + 2; bx++) {
                    for (let by = py - 2; by <= py + 2; by++) {
                        for (let bz = pz - 1; bz <= pz + 1; bz++) {
                            if (world.getBlock(bx, by, bz) === BlockType.CAMPFIRE) {
                                nearCampfire = true;
                                break;
                            }
                        }
                        if (nearCampfire) break;
                    }
                    if (nearCampfire) break;
                }
                if (nearCampfire) {
                    this.health = Math.min(this.effectiveMaxHealth, this.health + 2);
                }
            }
        }

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

        // Death check
        if (this.z < -40) {
            this.health = 0;
        }
        
        if (this.health <= 0) {
            if (this.hasFavoredDeity('INMORI')) {
                const inmoriStanding = this.deityStandings['INMORI']?.standing || 0;
                if (inmoriStanding >= 50) {
                    this.health = this.effectiveMaxHealth;
                    this.mana = this.effectiveMaxMana;
                    this.deityStandings['INMORI'].standing -= 50; // Consume favor to live
                    if (this.onMessage) this.onMessage("INMORI denies your death!");
                }
            }
        }
    }
}
