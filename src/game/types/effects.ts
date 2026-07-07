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
    thrownBlockType?: number;
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