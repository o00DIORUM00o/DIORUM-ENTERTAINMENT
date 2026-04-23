export interface AbilityContext {
    engine: any;
    caster: any;
    x: number;
    y: number;
    z: number;
    aimAngle: number;
}

export type AbilityAction = (ctx: AbilityContext) => void;

class AbilityRegistryImpl {
    private abilities: Map<string, AbilityAction> = new Map();

    register(id: string, action: AbilityAction) {
        this.abilities.set(id.toUpperCase(), action);
    }

    cast(id: string, ctx: AbilityContext): boolean {
        const action = this.abilities.get(id.toUpperCase());
        if (action) {
            action(ctx);
            return true;
        }
        return false;
    }
    
    unregister(id: string) {
        this.abilities.delete(id.toUpperCase());
    }
}

export const AbilityRegistry = new AbilityRegistryImpl();
