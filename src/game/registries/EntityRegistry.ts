export interface EntityDef {
    id: string;
    name: string;
    maxHealth: number;
    damage: number;
    speed?: number;
    attackCooldown?: number;
}

class Registry {
    private entities: Map<string, EntityDef> = new Map();

    public register(def: EntityDef) {
        this.entities.set(def.id, def);
    }

    public get(id: string): EntityDef {
        const ent = this.entities.get(id);
        if (!ent) {
            console.warn(`Entity ${id} not found in registry!`);
            return { id, name: 'Unknown', maxHealth: 10, damage: 1 };
        }
        return ent;
    }
    
    public getAll(): EntityDef[] {
        return Array.from(this.entities.values());
    }
}

export const EntityRegistry = new Registry();

export function defineEntities(entities: EntityDef[]) {
    for (const ent of entities) {
        EntityRegistry.register(ent);
    }
}
