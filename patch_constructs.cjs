const fs = require('fs');

const path = 'src/game/renderers/enemies/constructs.ts';
let content = fs.readFileSync(path, 'utf8');

const newRenderers = `
    RenderRegistry.register('RED_METAL_GOLEM', createMetalGolemRenderer('#ff0000', '#8b0000'));
    RenderRegistry.register('GREEN_METAL_GOLEM', createMetalGolemRenderer('#00ff00', '#006400'));
    RenderRegistry.register('BLUE_METAL_GOLEM', createMetalGolemRenderer('#0000ff', '#00008b'));
    RenderRegistry.register('YELLOW_METAL_GOLEM', createMetalGolemRenderer('#ffff00', '#b8860b'));
    RenderRegistry.register('ORANGE_METAL_GOLEM', createMetalGolemRenderer('#ffa500', '#ff4500'));
    RenderRegistry.register('PURPLE_METAL_GOLEM', createMetalGolemRenderer('#800080', '#4b0082'));
    RenderRegistry.register('BLACK_METAL_GOLEM', createMetalGolemRenderer('#333333', '#111111'));
    
    RenderRegistry.register('COPPER_GOLEM', createMetalGolemRenderer('#b87333', '#8b4513'));
    RenderRegistry.register('SILVER_GOLEM', createMetalGolemRenderer('#c0c0c0', '#a9a9a9'));
    RenderRegistry.register('GOLD_GOLEM', createMetalGolemRenderer('#ffd700', '#daa520'));
`;

const functionDef = `
function createMetalGolemRenderer(primaryColor: string, secondaryColor: string) {
    return {
        draw: (ctx: RenderContext) => {
            const golem = ctx.entity;
            ctx.ctx.fillStyle = secondaryColor; 
            ctx.ctx.beginPath();
            ctx.ctx.rect(-ctx.TILE_SIZE * 0.6, -ctx.TILE_SIZE * 0.6, ctx.TILE_SIZE * 1.2, ctx.TILE_SIZE * 1.2);
            ctx.ctx.fill();
            
            ctx.ctx.strokeStyle = primaryColor; 
            ctx.ctx.lineWidth = 2;
            ctx.ctx.beginPath();
            ctx.ctx.moveTo(-ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(0, ctx.TILE_SIZE * 0.2);
            ctx.ctx.lineTo(ctx.TILE_SIZE * 0.4, -ctx.TILE_SIZE * 0.1);
            ctx.ctx.stroke();
            
            ctx.ctx.rotate(golem.aimAngle || 0);
            
            ctx.ctx.fillStyle = primaryColor; 
            ctx.ctx.beginPath();
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, -ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.arc(ctx.TILE_SIZE * 0.3, ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.1, 0, Math.PI * 2);
            ctx.ctx.fill();
            
            ctx.ctx.save();
            if (golem.state === 'ATTACK') {
                const attackProgress = 1 - ((golem.attackTimer || 0) / 0.5);
                ctx.ctx.translate(ctx.TILE_SIZE * 0.4, 0);
                ctx.ctx.scale(1 + Math.sin(attackProgress * Math.PI) * 0.5, 1 + Math.sin(attackProgress * Math.PI) * 0.5);
                ctx.ctx.fillStyle = primaryColor;
                ctx.ctx.beginPath();
                ctx.ctx.arc(0, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(0, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            } else {
                ctx.ctx.fillStyle = secondaryColor;
                ctx.ctx.beginPath();
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, -ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.arc(ctx.TILE_SIZE * 0.2, ctx.TILE_SIZE * 0.4, ctx.TILE_SIZE * 0.2, 0, Math.PI * 2);
                ctx.ctx.fill();
            }
            ctx.ctx.restore();
        }
    };
}
`;

content = content.replace("export function defineConstructsRenderers() {", functionDef + "\nexport function defineConstructsRenderers() {" + newRenderers);

fs.writeFileSync(path, content);
console.log("Patched constructs.ts");
