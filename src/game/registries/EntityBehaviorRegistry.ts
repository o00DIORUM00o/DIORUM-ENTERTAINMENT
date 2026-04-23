import { Engine } from '../Engine';
import { Item } from '../Inventory';

export interface EntityBehaviorContext {
    engine: Engine;
    entity: any;
    dt: number;
    index: number;
}

export interface EntityBehavior {
    update: (ctx: EntityBehaviorContext) => void;
    onDeath?: (ctx: EntityBehaviorContext) => void;
}

class BehaviorRegistry {
    private behaviors: Map<string, EntityBehavior> = new Map();
    private fallbackBehavior: EntityBehavior | null = null;

    register(type: string, behavior: EntityBehavior) {
        this.behaviors.set(type, behavior);
    }

    setFallback(behavior: EntityBehavior) {
        this.fallbackBehavior = behavior;
    }

    get(type: string): EntityBehavior | null {
        return this.behaviors.get(type) || this.fallbackBehavior;
    }
}

export const EntityBehaviorRegistry = new BehaviorRegistry();
