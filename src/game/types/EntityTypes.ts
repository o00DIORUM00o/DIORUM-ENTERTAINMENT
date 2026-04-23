import { Item } from '../Inventory';
import { Player } from '../Player';

export interface Particle {
    x: number;
    y: number;
    z: number;
    text: string;
    color: string;
    life: number;
    maxLife: number;
    vy: number;
    vx?: number;
    vz?: number;
    size?: number;
    speed?: number;
}

export interface Projectile {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz?: number;
    damage: number;
    life: number;
    maxLife?: number;
    damageType?: string;
    isPlayer?: boolean;
    color?: string;
    isPot?: boolean;
    isBoomerang?: boolean;
    returning?: boolean;
    grabbedItem?: DroppedItem | null;
    owner?: Player;
    rotation?: number;
    size?: number;
    type?: string;
    source?: string;
}

export interface Bomb {
    x: number;
    y: number;
    z: number;
    timer: number;
}

export interface AoEEffect {
    x: number;
    y: number;
    z: number;
    radius: number;
    maxRadius: number;
    life: number;
    maxLife: number;
    damageType?: string;
}

export interface ConeEffect {
    x: number;
    y: number;
    z: number;
    radius: number;
    spread: number;
    angle: number;
    life: number;
    maxLife: number;
    damageType?: string;
}

export interface Bee {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    hiveKey: string;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'ATTACK';
    attackCooldown: number;
}


export interface AbyssalKnight {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK' | 'CHARGE';
    target?: any;
    attackCooldown: number;
    aimAngle: number;
    chargeTimer: number;
    spawnerKey?: string;
}

export interface LavaGolem {
    spawnerId?: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
}

export interface GiantAnt {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    hp: number;
    maxHp: number;
    speed: number;
    damage: number;
    attackRange: number;
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
}

export interface Goblin {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
    campKey?: string;
    stunTimer?: number;
    isShaman?: boolean;
}

export interface Kobold {
    type: 'worker' | 'warrior' | 'shaman' | 'trapper' | 'bomber' | 'dragonkeeper';
    spawnerId?: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK' | 'FLEE';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
    campKey?: string;
    stunTimer?: number;
    trapTimer?: number;
    healTimer?: number;
}

export interface Gargoyle {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'SLEEPING' | 'AWAKE' | 'CHASE' | 'ATTACK';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    stunTimer?: number;
    campKey?: string;
}

export interface Djinn {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    stunTimer?: number;
    campKey?: string;
}

export interface Gremlin {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK' | 'JUMPING';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    stunTimer?: number;
    campKey?: string;
    jumpTimer?: number;
}

export interface Rat {
    id: string;
    spawnerId?: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage?: number;
    state: 'FOLLOW' | 'ATTACK' | 'CHASE' | 'WANDER';
    aimAngle: number;
    attackTimer: number;
    attackCooldown?: number;
}

export interface NPC {
    id: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    type: 'VILLAGER' | 'OLD_WIZARD' | 'DRACONIC_MERCHANT' | 'SLUG_FOLK_MERCHANT' | 'DARK_ELF' | 'DWARF' | 'GNOME' | 'HALFLING' | 'PIT_BULL_FOLK' | 'POMERANIAN_FOLK' | 'TERRIER_FOLK' | 'WOLF_FOLK' | 'HUMAN_KNIGHT' | 'HUMAN_PALADIN' | 'HUMAN_RANGER' | 'QUEST_GIVER';
    state: 'IDLE' | 'WANDER' | 'COMBAT' | 'TALKING' | 'FLEE' | 'PATROL' | 'CARAVAN_LEADER' | 'CARAVAN_FOLLOWER';
    disposition: number;
    aimAngle: number;
    attackTimer: number;
    attackCooldown: number;
    stunTimer?: number;
    merchantType?: string;
    tradeInventory?: any[]; // TradeListing[]
    lastRestockDay?: number;
    profession?: string;
    homeX?: number;
    homeY?: number;
    homeZ?: number;
}

export interface Orc {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
    campKey?: string;
    stunTimer?: number;
}

export interface Drake {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    stunTimer?: number;
}

export interface RockGolem {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    stunTimer?: number;
}

export interface Archer {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'CHASE' | 'ATTACK' | 'FLEE';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
    spawnerKey?: string;
}

export interface DarkKnight {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    state: 'WANDER' | 'AIM' | 'CHARGE' | 'RECOVER';
    stateTimer: number;
    aimAngle: number;
    spawnerKey?: string;
}

export interface Skeleton {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    damage: number;
    type: 'SWORDSMAN' | 'ARCHER';
    state: 'WANDER' | 'CHASE' | 'ATTACK' | 'FLEE';
    attackCooldown: number;
    attackTimer: number;
    aimAngle: number;
    spawnerKey?: string;
    stunTimer?: number;
}

export interface SkeletonRemains {
    x: number;
    y: number;
    z: number;
    health: number;
    maxHealth: number;
    reviveTimer: number;
    type: 'SWORDSMAN' | 'ARCHER';
    spawnerKey?: string;
}

export interface FireDragonBoss {
    id: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'SLEEPING' | 'WANDER' | 'CHASE' | 'FLY_ATTACK' | 'BREATH_ATTACK';
    attackCooldown: number; attackTimer: number; aimAngle: number;
    flightHeight: number;
    target?: any;
    spawnerId?: string;
    phase: number;
}

export interface Sphinx {
    spawnerId?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'SLEEP' | 'IDLE' | 'ATTACK_LASER' | 'ATTACK_SANDSTORM' | 'SUMMON';
    stateTimer: number;
    attackCooldown: number;
    aimAngle: number;
    laserTimer?: number;
    phase?: number;
}

export interface SandTerror {
    id?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'BURROWED' | 'EMERGING' | 'ABOVE' | 'DIVING';
    stateTimer: number;
    aimAngle: number;
    segments: {x: number, y: number, z: number}[];
}

export interface PhantomWizard {
    id?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'APPEAR' | 'IDLE' | 'ATTACK' | 'CHARGE_SPELL' | 'VANISH' | 'HIDDEN';
    stateTimer: number;
    aimAngle: number;
    teleportX: number;
    teleportY: number;
}

export interface Deer { x: number; y: number; z: number; vx: number; vy: number; vz: number; health: number; maxHealth: number; state: 'WANDER' | 'FLEE'; fleeTimer: number; aimAngle: number; }
export interface Wolf { x: number; y: number; z: number; vx: number; vy: number; vz: number; health: number; maxHealth: number; state: 'WANDER' | 'CHASE' | 'ATTACK'; target?: any; attackCooldown: number; aimAngle: number; }
export type AnimalType = 'DEER' | 'WOLF' | 'SHEEP' | 'BEAR' | 'HORSE' | 'TURTLE' | 'UNICORN' | 'GIANT_CHICKEN' | 'GIANT_FROG' | 'CAPYBARA' | 'DRAGON_HORSE' | 'DRAGON_TURTLE' | 'GIANT_TOAD' | 'OBSIDIAN_SHEEP' | 'FAIRY' | 'GRYPHON' | 'FIRE_DRAGON' | 'GIANT_EAGLE';
export interface Mount { id: string; type: AnimalType; name: string; speed: number; jumpPower: number; maxStamina: number; }
export interface Animal {
    id: string;
    type: AnimalType;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number;
    state: 'WANDER' | 'FLEE' | 'CHASE' | 'ATTACK';
    fleeTimer: number;
    attackCooldown: number;
    aimAngle: number;
    target?: any;
    tameProgress: number;
    isTamed: boolean;
    speed: number;
    jumpPower: number;
    stamina: number;
    maxStamina: number;
}







export interface DroppedItem {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    item: Item;
    life: number;
}