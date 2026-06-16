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
    type?: 'SPHINX';
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

export interface VoidLord {
    id?: string;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    health: number; maxHealth: number; damage: number;
    state: 'SPAWN' | 'IDLE' | 'CHASE' | 'VOID_BLAST' | 'SUMMON_MINIONS' | 'TELEPORT';
    stateTimer: number;
    aimAngle: number;
}