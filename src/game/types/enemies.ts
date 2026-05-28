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
export interface FrostCaster {
    type?: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    state: string;
    target?: any;
    attackCooldown?: number;
    attackTimer?: number;
    campKey?: string;
    isLoyal?: boolean;
    aimAngle?: number;
    magicShield?: number;
    castTimer?: number;
    wanderX?: number;
    wanderY?: number;
}
