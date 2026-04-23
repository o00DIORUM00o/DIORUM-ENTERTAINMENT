const fs = require('fs');

let code = fs.readFileSync('src/game/Renderer.ts', 'utf8');

code = code.replace(/ctx\.arc\(screenX \+ TILE_SIZE \* 0\.3, screenY \+ TILE_SIZE \* 0\.18, TILE_SIZE \* 0\.15, 0, Math\.PI \* 2\);/,
`ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.18 + Math.sin(Date.now() / 200) * 2, TILE_SIZE * 0.15 + Math.sin(Date.now() / 150) * 1, 0, Math.PI * 2);`);

fs.writeFileSync('src/game/Renderer.ts', code);
