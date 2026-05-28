export interface DeityDef {
    id: string; // e.g. 'PRIMORDIAL'
    name: string;
    description: string;
    domain?: string[];
}

class Registry {
    private deities: Map<string, DeityDef> = new Map();

    public register(deity: DeityDef) {
        this.deities.set(deity.id, deity);
    }

    public get(id: string): DeityDef | undefined {
        return this.deities.get(id.toUpperCase());
    }

    public getAll(): DeityDef[] {
        return Array.from(this.deities.values());
    }
}

export const DeityRegistry = new Registry();

export function defineDeities(deities: DeityDef[]) {
    deities.forEach(d => DeityRegistry.register(d));
}
