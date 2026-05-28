export interface RaceDef {
    id: string; // e.g. 'HUMAN'
    name: string;
    description: string;
    startingTalents: Record<string, number>;
}

class Registry {
    private races: Map<string, RaceDef> = new Map();

    public register(race: RaceDef) {
        this.races.set(race.id, race);
    }

    public get(id: string): RaceDef | undefined {
        return this.races.get(id.toUpperCase());
    }

    public getAll(): RaceDef[] {
        return Array.from(this.races.values());
    }
}

export const RaceRegistry = new Registry();

export function defineRaces(races: RaceDef[]) {
    races.forEach(r => RaceRegistry.register(r));
}
