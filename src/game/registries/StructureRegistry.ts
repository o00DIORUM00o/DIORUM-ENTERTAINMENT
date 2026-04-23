import { BlockType } from '../constants/BlockType';

export interface StructurePaletteEntry {
    block: BlockType;
    // Future expansion: inventory contents, interactive state, metadata.
    // e.g. chestContents?: string[] 
}

export interface SchematicDef {
    id: string;
    
    // The anchor defines the "origin" (0,0,0) coordinate relative to the layers array.
    // For example, if anchor is {x: 2, y: 2, z: 0}, then the exact center of the ground
    // floor of a 5x5 building is placed exactly where the generator requested.
    anchorX: number;
    anchorY: number;
    anchorZ: number; 
    
    // Maps a character to a block definition
    palette: Record<string, StructurePaletteEntry>;
    
    // 3D grid of characters. 
    // layers[z][y][x]
    // z=0 is the bottom-most layer of the structure.
    layers: string[][];
}

class Registry {
    private schematics: Map<string, SchematicDef> = new Map();

    public register(schematic: SchematicDef) {
        this.schematics.set(schematic.id, schematic);
    }

    public get(id: string): SchematicDef | undefined {
        return this.schematics.get(id);
    }
    
    public getAll(): SchematicDef[] {
        return Array.from(this.schematics.values());
    }
}

export const StructureRegistry = new Registry();

export function defineStructures(structures: SchematicDef[]) {
    for (const struct of structures) {
        StructureRegistry.register(struct);
    }
}
