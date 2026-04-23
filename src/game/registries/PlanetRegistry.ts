import { BlockType } from '../constants/BlockType';

export interface PlanetDef {
    id: string; // e.g., 'THRAE', 'ARETH', etc.
    name: string;
    description: string;
    surfaceBlock: BlockType;
    dirtBlock: BlockType;
    stoneBlock: BlockType;
    waterBlock: BlockType;
    woodBlock: BlockType;
    leafBlock: BlockType;
    pineLeafBlock: BlockType;
    elevationMod: number;
    baseElevation: number;
    waterLevel: number;
    oreMultiplier: number;
    safeAreaMethod: 'BOX' | 'RADIAL';
    airColor: string;
    spawnerTable: { block: BlockType, chance: number }[];
}

class Registry {
    private planets: Map<string, PlanetDef> = new Map();
    private defaultPlanet!: PlanetDef;

    public register(planet: PlanetDef) {
        this.planets.set(planet.id, planet);
        if (!this.defaultPlanet) {
            this.defaultPlanet = planet;
        }
    }

    public get(id: string): PlanetDef {
        const planet = this.planets.get(id);
        if (!planet) {
            console.warn(`Planet ${id} not found in registry. Falling back to default.`);
            return this.defaultPlanet;
        }
        return planet;
    }
    
    public getAll(): PlanetDef[] {
        return Array.from(this.planets.values());
    }
}

export const PlanetRegistry = new Registry();

export function definePlanets(planets: PlanetDef[]) {
    for (const planet of planets) {
        PlanetRegistry.register(planet);
    }
}
