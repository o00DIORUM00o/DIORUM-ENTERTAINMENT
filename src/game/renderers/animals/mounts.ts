import { RenderRegistry, RenderContext } from '../../registries/RenderRegistry';

export function defineMountsRenderers() {
    RenderRegistry.register('HORSE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#A0522D';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
        }
    });
    RenderRegistry.register('DRAGON_HORSE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B0000'; 
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FF4500'; 
            c.fillRect(TILE_SIZE * 0.5, -TILE_SIZE * 0.15, 6, 6);
        }
    });

const colors: Record<string, string> = {
    'RED': '#8B0000',
    'GREEN': '#006400',
    'BLACK': '#2F4F4F',
    'BLUE': '#00008B',
    'PURPLE': '#4B0082',
    'BROWN': '#8B4513'
};
const dragonColors: Record<string, { body: string, wing: string }> = {
    'RED': { body: '#8a0303', wing: '#b31212' },
    'GREEN': { body: '#004d00', wing: '#008000' },
    'BLACK': { body: '#1a1a1a', wing: '#333333' },
    'BLUE': { body: '#000080', wing: '#0000ff' },
    'PURPLE': { body: '#30004a', wing: '#660099' },
    'BROWN': { body: '#5c4033', wing: '#8b4513' },
    'FIRE': { body: '#8a0303', wing: '#b31212' }
};

for (const [color, hex] of Object.entries(colors)) {
    RenderRegistry.register(color + '_DRAGON_HORSE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = hex; 
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FF4500'; 
            c.fillRect(TILE_SIZE * 0.5, -TILE_SIZE * 0.15, 6, 6);
        }
    });
}

for (const [color, hexes] of Object.entries(dragonColors)) {
    RenderRegistry.register(color + '_DRAGON', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE: ts, entity } = ctx;
            const t = performance.now() / 300;
            c.rotate(entity?.aimAngle || 0);

            let wingSpan = Math.sin(t * 1.5) * 0.5 + 0.8;
            if (entity?.state === 'FLY_ATTACK') wingSpan = Math.sin(t * 3) * 0.6 + 0.8;
            if (entity?.state === 'SLEEPING') wingSpan = (Math.sin(t / 2) * 0.1) + 0.3;

            c.fillStyle = hexes.body; 
            c.strokeStyle = '#222';
            c.lineWidth = 2;

            // Tail
            c.beginPath();
            c.moveTo(-ts*0.8, 0);
            c.lineTo(-ts*1.5, Math.sin(t*2)*ts*0.3);
            c.lineTo(-ts*0.8, ts*0.3);
            c.fill(); c.stroke();

            // Wings
            c.fillStyle = hexes.wing;
            c.beginPath(); // Left
            c.moveTo(-ts*0.2, -ts*0.3);
            c.lineTo(-ts*0.5, -ts*2 * wingSpan);
            c.lineTo(ts*0.3, -ts*1.5 * wingSpan);
            c.lineTo(ts*0.2, -ts*0.3);
            c.fill(); c.stroke();
            
            c.beginPath(); // Right
            c.moveTo(-ts*0.2, ts*0.3);
            c.lineTo(-ts*0.5, ts*2 * wingSpan);
            c.lineTo(ts*0.3, ts*1.5 * wingSpan);
            c.lineTo(ts*0.2, ts*0.3);
            c.fill(); c.stroke();

            // Main Body Round
            c.fillStyle = hexes.body;
            c.beginPath();
            c.ellipse(0, 0, ts*0.9, ts*0.6, 0, 0, Math.PI*2);
            c.fill(); c.stroke();

            // Head and Neck extension
            c.beginPath();
            c.moveTo(ts*0.7, -ts*0.2);
            c.lineTo(ts*1.2, -ts*0.3);
            c.lineTo(ts*1.5, 0);
            c.lineTo(ts*1.2, ts*0.3);
            c.lineTo(ts*0.7, ts*0.2);
            c.fill(); c.stroke();

            c.fillStyle = '#FFA500'; // orange eyes
            c.beginPath();
            c.arc(ts*1.2, -ts*0.15, ts*0.05, 0, Math.PI*2);
            c.fill();
            c.beginPath();
            c.arc(ts*1.2, ts*0.15, ts*0.05, 0, Math.PI*2);
            c.fill();
        }
    });
}

RenderRegistry.register('TINY_FIRE_DRAGON', {
    draw: (ctx) => {
        const { ctx: c, TILE_SIZE: ts, entity } = ctx;
        const t = performance.now() / 300;
        
        const isHovering = true;
        const bob = isHovering ? Math.sin(t * 3) * ts * 0.1 : 0;
        
        c.rotate(entity?.aimAngle || 0);

        let wingSpan = Math.sin(t * 4) * 0.6 + 0.8;

        const hexes = dragonColors['FIRE'] || {body: '#8B0000', head: '#A52A2A', wing: '#B22222'};

        c.translate(0, bob);
        c.scale(0.5, 0.5);

        c.fillStyle = hexes.body; 
        c.strokeStyle = '#222';
        c.lineWidth = 2;

        // Tail
        c.beginPath();
        c.moveTo(-ts*0.8, 0);
        c.lineTo(-ts*1.5, Math.sin(t*2)*ts*0.3);
        c.lineTo(-ts*0.8, ts*0.3);
        c.fill(); c.stroke();

        // Wings
        c.fillStyle = hexes.wing;
        c.beginPath(); // Left
        c.moveTo(-ts*0.2, -ts*0.3);
        c.lineTo(-ts*0.5, -ts*2 * wingSpan);
        c.lineTo(ts*0.3, -ts*1.5 * wingSpan);
        c.lineTo(ts*0.2, -ts*0.3);
        c.fill(); c.stroke();
        
        c.beginPath(); // Right
        c.moveTo(-ts*0.2, ts*0.3);
        c.lineTo(-ts*0.5, ts*2 * wingSpan);
        c.lineTo(ts*0.3, ts*1.5 * wingSpan);
        c.lineTo(ts*0.2, ts*0.3);
        c.fill(); c.stroke();

        // Main Body Round
        c.fillStyle = hexes.body;
        c.beginPath();
        c.ellipse(0, 0, ts*0.9, ts*0.6, 0, 0, Math.PI*2);
        c.fill(); c.stroke();

        c.fillStyle = (hexes as any).head || hexes.body;
        c.beginPath();
        c.ellipse(ts*0.7, 0, ts*0.5, ts*0.4, 0, 0, Math.PI*2);
        c.fill(); c.stroke();
        
        // Eyes
        c.fillStyle = '#FFAA00';
        c.beginPath(); c.arc(ts*0.8, -ts*0.2, ts*0.08, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(ts*0.8, ts*0.2, ts*0.08, 0, Math.PI*2); c.fill();
    }
});

}
