import { StarSignDef } from '../StarSigns';

export interface StarSignRegistryDef extends StarSignDef {
    id: string; // e.g. 'THE DRAGON'
    name: string;
}

class Registry {
    private signs: Map<string, StarSignRegistryDef> = new Map();

    public register(sign: StarSignRegistryDef) {
        this.signs.set(sign.id, sign);
    }

    public get(id: string): StarSignRegistryDef | undefined {
        return this.signs.get(id.toUpperCase());
    }

    public getAll(): StarSignRegistryDef[] {
        return Array.from(this.signs.values());
    }
}

export const StarSignRegistry = new Registry();

export function defineStarSigns(signs: StarSignRegistryDef[]) {
    signs.forEach(s => StarSignRegistry.register(s));
}
