import { TILE_SIZE } from '../Constants';

export class DroppedItemRenderer {
    static draw(ctx: CanvasRenderingContext2D, engine: any, halfW: number, halfH: number, playerZ: number) {
        const { world, player, droppedItems } = engine;
        for (const item of droppedItems) {
            const surface = world.getSurface(Math.floor(item.x), Math.floor(item.y), playerZ);
            if (item.z < surface.z) continue;

            const screenX = halfW + (item.x - player.x) * TILE_SIZE;
            const screenY = halfH + (item.y - player.y) * TILE_SIZE;
            const depth = Math.max(0, player.z - item.z);
            const scale = Math.max(0.2, 1 - (depth * 0.1));
            
            if (scale > 0.2) {
                ctx.save();
                ctx.translate(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
                ctx.scale(scale * 0.5, scale * 0.5); // make them smaller than full tiles
                
                // Simple representation: a colored circle with a border
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE / 2, 0, Math.PI * 2);
                
                if (item.item.id === 'gold_piece') {
                    ctx.fillStyle = '#fbbf24';
                } else if (item.item.id === 'copper_piece') {
                    ctx.fillStyle = '#b45309';
                } else if (item.item.id === 'wood') {
                    ctx.fillStyle = '#8B4513';
                } else if (item.item.id === 'stone') {
                    ctx.fillStyle = '#808080';
                } else if (item.item.id === 'tent') {
                    ctx.fillStyle = '#654321';
                } else if (item.item.id === 'meat') {
                    ctx.fillStyle = '#ef4444';
                } else if (item.item.id === 'leather') {
                    ctx.fillStyle = '#d97706';
                } else {
                    ctx.fillStyle = '#e5e7eb'; // default item color
                }
                
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}
