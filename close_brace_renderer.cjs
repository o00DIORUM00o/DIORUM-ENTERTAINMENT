const fs = require('fs');

let rCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');

rCode = rCode.replace(/\/\/ Staff Gem\n\s*ctx\.fillStyle \= \'\#38bdf8\'\; \/\/ Light blue gem\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(TILE_SIZE \* 0\.6\, TILE_SIZE \* 0\.2\, TILE_SIZE \* 0\.06\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;/g,
`// Staff Gem
            ctx.fillStyle = '#38bdf8'; // Light blue gem
            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.6, TILE_SIZE * 0.2, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.fill();
            }`);

fs.writeFileSync('src/game/Renderer.ts', rCode);
