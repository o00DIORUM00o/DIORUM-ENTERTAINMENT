import { BlockType } from '../constants/BlockType';
;
import { RenderContext } from '../registries/RenderRegistry';
import { BLOCK_COLORS } from '../Constants';

export interface BlockRenderContext extends RenderContext {
    block: BlockType;
    shade: number;
}

export interface BlockRenderer {
    draw: (ctx: BlockRenderContext) => void;
}

class BlockRendererRegistryClass {
    private renderers: Map<BlockType, BlockRenderer> = new Map();

    register(type: BlockType, renderer: BlockRenderer) {
        this.renderers.set(type, renderer);
    }

    get(type: BlockType): BlockRenderer | undefined {
        return this.renderers.get(type);
    }
}

export const BlockRenderRegistry = new BlockRendererRegistryClass();
