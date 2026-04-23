const fs = require('fs');

// 1. Teleport Range to 20 blocks
let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');
playerCode = playerCode.replace(/let distance \= 0\;\n\s*let destX \= this\.x\;\n\s*let destY \= this\.y\;\n\s*while \(distance \< 8\) \{/g,
`let distance = 0;
        let destX = this.x;
        let destY = this.y;
        while (distance < 20) {`);
fs.writeFileSync('src/game/Player.ts', playerCode);

// 2. Fix the missing damageType on the Acid Staff
let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');
invCode = invCode.replace(/spellId\: \'acid_bolt\'\,\n\s*manaCost\: 8\,\n\s*secondaryAbility\: \'BLINK\'/g,
`spellId: 'acid_bolt',
        damageType: 'ACID',
        manaCost: 8,
        secondaryAbility: 'BLINK'`);
fs.writeFileSync('src/game/Inventory.ts', invCode);

// 3. Renderer updating sword charge vs staff charge
let renderCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');
renderCode = renderCode.replace(/\/\/ Draw Sword Charge Animation\n\s*if \(player\.isCharging\) \{\n\s*ctx\.save\(\)\;\n\s*ctx\.translate\(halfW\, halfH\)\;\n\s*ctx\.rotate\(player\.aimAngle\)\;\n\s*\/\/ Draw sword held back\n\s*ctx\.strokeStyle \= \'\#e2e8f0\'\;\n\s*ctx\.lineWidth \= 4\;\n\s*ctx\.lineCap \= \'round\'\;\n\s*ctx\.beginPath\(\)\;\n\s*const handleOffset \= TILE_SIZE \* 0\.3\;\n\s*const chargeAngle \= \-Math\.PI \/ 4\; \/\/ Held back\n\s*ctx\.moveTo\(\n\s*Math\.cos\(chargeAngle\) \* handleOffset\,\n\s*Math\.sin\(chargeAngle\) \* handleOffset\n\s*\)\;\n\s*ctx\.lineTo\(\n\s*Math\.cos\(chargeAngle\) \* TILE_SIZE \* player\.attackReach\,\n\s*Math\.sin\(chargeAngle\) \* TILE_SIZE \* player\.attackReach\n\s*\)\;\n\s*ctx\.stroke\(\)\;\n\s*\/\/ Draw charge particle effect/g,
`// Draw Charge Animation (Sword or Staff)
        const weaponCharge = player.equipment['MAIN_HAND'];
        const isSwordWeapon = weaponCharge?.id?.includes('sword') || false;
        
        if (player.isCharging) {
            ctx.save();
            ctx.translate(halfW, halfH);
            ctx.rotate(player.aimAngle);
            
            if (isSwordWeapon) {
                // Draw sword held back
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.beginPath();
                const handleOffset = TILE_SIZE * 0.3;
                const chargeAngle = -Math.PI / 4; // Held back
                
                ctx.moveTo(
                    Math.cos(chargeAngle) * handleOffset,
                    Math.sin(chargeAngle) * handleOffset
                );
                ctx.lineTo(
                    Math.cos(chargeAngle) * TILE_SIZE * player.attackReach,
                    Math.sin(chargeAngle) * TILE_SIZE * player.attackReach
                );
                ctx.stroke();
            }

            // Draw charge particle effect / glowing circle
            // For staves, calculate progress based on staff charge time, else default sword 1.0s`);

renderCode = renderCode.replace(/\} else \{\n\s*const progress \= Math\.min\(1\, player\.chargeTimer \/ 1\.0\)\;\n\s*ctx\.shadowBlur \= 10 \* progress\;\n\s*ctx\.shadowColor \= \'\#fff\'\;\n\s*ctx\.fillStyle \= \`rgba\(255\, 255\, 255\, \$\{progress \* 0\.3\}\)\`\;\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(0\, 0\, TILE_SIZE \* player\.attackReach \* progress\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*\}/g,
`} else {
                const chargeBaseTime = weaponCharge?.chargeTime || 1.0;
                const progress = Math.min(1, player.chargeTimer / chargeBaseTime);
                ctx.shadowBlur = 10 * progress;
                ctx.shadowColor = '#fff';
                ctx.fillStyle = \`rgba(255, 255, 255, \${progress * 0.3})\`;
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * player.attackReach * progress, 0, Math.PI * 2);
                ctx.fill();
            }`);

fs.writeFileSync('src/game/Renderer.ts', renderCode);
