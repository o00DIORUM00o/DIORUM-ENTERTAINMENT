export interface Deer { x: number; y: number; z: number; vx: number; vy: number; vz: number; health: number; maxHealth: number; state: 'WANDER' | 'FLEE'; fleeTimer: number; aimAngle: number; }

export interface Wolf { x: number; y: number; z: number; vx: number; vy: number; vz: number; health: number; maxHealth: number; state: 'WANDER' | 'CHASE' | 'ATTACK'; target?: any; attackCooldown: number; aimAngle: number; }

export type AnimalType = 'DEER' | 'WOLF' | 'SHEEP' | 'BEAR' | 'HORSE' | 'TURTLE' | 'UNICORN' | 'GIANT_CHICKEN' | 'GIANT_FROG' | 'CAPYBARA' | 'DRAGON_HORSE' | 'DRAGON_TURTLE' | 'GIANT_TOAD' | 'OBSIDIAN_SHEEP' | 'FAIRY' | 'GRYPHON' | 'FIRE_DRAGON' | 'GIANT_EAGLE' | 'DIRE_WOLF' | 'GIANT_BOAR' | 'MOOSE';

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
    campKey?: string;
    homeX?: number;
    homeY?: number;
    homeZ?: number;
    behavior?: 'PASSIVE' | 'AGGRESSIVE';
    damage?: number;
}