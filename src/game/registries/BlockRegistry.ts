import { BlockType } from '../constants/BlockType';

export const BLOCK_COLORS: Record<number, { r: number, g: number, b: number }> = {};

export interface BlockDef {
    type: BlockType;
    id: string;
    name: string;
    isSolid?: boolean;
    isIndestructible?: boolean;
    hardness?: number; // HP for the block to be destroyed
    color?: { r: number, g: number, b: number };
}

class Registry {
    private blocks: Map<BlockType, BlockDef> = new Map();

    // Fast lookup arrays for performance critical paths
    private _isSolid = new Uint8Array(512);
    private _isIndestructible = new Uint8Array(512);
    private _hardness = new Uint16Array(512);
    
    constructor() {
        // Pre-fill solidness with 1s (default solid), then we'll flip the non-solid ones to 0
        this._isSolid.fill(1);
    }

    public registerBlock(def: BlockDef) {
        this.blocks.set(def.type, def);

        // Update fast lookup tables
        this._isSolid[def.type] = def.isSolid === false ? 0 : 1;
        this._isIndestructible[def.type] = def.isIndestructible === true ? 1 : 0;
        this._hardness[def.type] = def.hardness !== undefined ? def.hardness : 50; // default 50
        
        if (def.color) {
            BLOCK_COLORS[def.type] = def.color;
        } else {
            // Default grey fallback
            BLOCK_COLORS[def.type] = { r: 100, g: 100, b: 100 };
        }
    }

    public getBlock(type: BlockType): BlockDef | undefined {
        return this.blocks.get(type);
    }

    public isSolid(type: BlockType): boolean {
        return this._isSolid[type] === 1;
    }

    public isIndestructible(type: BlockType): boolean {
        if (type === BlockType.AIR || 
            type === BlockType.WATER || 
            type === BlockType.LAVA) {
            return true;
        }
        return false;
    }

    public getHardness(type: BlockType): number {
        return this._hardness[type];
    }
    
    public getAllBlocks(): BlockDef[] {
        return Array.from(this.blocks.values());
    }
}

export const BlockRegistry = new Registry();

export function defineBlocks(blocks: BlockDef[]) {
    for (const block of blocks) {
        BlockRegistry.registerBlock(block);
    }
}
