import { TILE_SIZE } from '../Constants';

export interface RenderContext {
    ctx: CanvasRenderingContext2D;
    entity: any;
    screenX: number;
    screenY: number;
    TILE_SIZE: number;
    halfW: number;
    halfH: number;
    time: number;
    scale?: number;
    isFlashing?: boolean;
}

export interface EntityRenderer {
    draw: (ctx: RenderContext) => void;
}

class RenderRegistryClass {
    private renderers: Map<string, EntityRenderer> = new Map();
    private fallbackRenderer: EntityRenderer | null = null;

    register(type: string, renderer: EntityRenderer) {
        this.renderers.set(type, renderer);
    }

    setFallback(renderer: EntityRenderer) {
        this.fallbackRenderer = renderer;
    }

    get(type: string): EntityRenderer | null {
        return this.renderers.get(type) || this.fallbackRenderer;
    }
}

export const RenderRegistry = new RenderRegistryClass();
