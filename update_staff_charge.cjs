const fs = require('fs');

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

// Replace charge logic block in update()
const oldChargeLogic = `                if (isSword && swordTalentLevel >= 1) {
                    this.isCharging = true;
                    this.chargeTimer = 0;
                }
            } else if (this.isCharging && isSword && swordTalentLevel >= 1) {
                this.chargeTimer += dt;
                if (this.chargeTimer >= 1.0) {
                    this.spinAttackReady = true;
                }
            } else if (this.isCharging && (!isSword || swordTalentLevel < 1)) {
                this.isCharging = false;
                this.chargeTimer = 0;
                this.spinAttackReady = false;
            }
        } else {
            if (this.isCharging) {
                if (this.spinAttackReady && isSword) {
                    // Execute spin attack
                    this.isAttacking = true;
                    this.hasHitThisSwing = false;
                    this.attackDuration = weapon?.cooldown || 0.25;
                    this.attackReach = weapon?.reach || 1.0;
                    this.attackSpread = Math.PI; // Full circle (spread is half-angle)
                    this.attackTimer = this.attackDuration;
                    this.stamina -= 10; // Costs more stamina
                }
                this.isCharging = false;
                this.chargeTimer = 0;
                this.spinAttackReady = false;
            }
        }`;

const newChargeLogic = `                const hasSecondary = !!weapon?.secondaryAbility;

                if ((isSword && swordTalentLevel >= 1) || hasSecondary) {
                    this.isCharging = true;
                    this.chargeTimer = 0;
                }
            } else if (this.isCharging) {
                const hasSecondary = !!weapon?.secondaryAbility;
                if (isSword && swordTalentLevel >= 1) {
                    this.chargeTimer += dt;
                    if (this.chargeTimer >= 1.0 && !this.spinAttackReady) {
                        this.spinAttackReady = true;
                        // Spawn ready particles
                        if (ctx.onShoot) { /* Just to use ctx, but we could play a sound */ }
                    }
                } else if (hasSecondary) {
                    this.chargeTimer += dt;
                    if (this.chargeTimer >= (weapon?.chargeTime || 1.5) && !this.spinAttackReady) {
                        this.spinAttackReady = true;
                    }
                } else {
                    this.isCharging = false;
                    this.chargeTimer = 0;
                    this.spinAttackReady = false;
                }
            }
        } else {
            if (this.isCharging) {
                const hasSecondary = !!weapon?.secondaryAbility;
                if (this.spinAttackReady) {
                    if (isSword && swordTalentLevel >= 1) {
                        // Execute spin attack
                        this.isAttacking = true;
                        this.hasHitThisSwing = false;
                        this.attackDuration = weapon?.cooldown || 0.25;
                        this.attackReach = weapon?.reach || 1.0;
                        this.attackSpread = Math.PI; // Full circle (spread is half-angle)
                        this.attackTimer = this.attackDuration;
                        this.stamina -= 10; // Costs more stamina
                    } else if (hasSecondary) {
                        const chargeCost = weapon?.chargeManaCost || 20;
                        if (this.mana >= chargeCost) {
                            this.mana -= chargeCost;
                            if (weapon?.secondaryAbility === 'BLINK') {
                                this.castBlink(ctx);
                            }
                        }
                    }
                }
                this.isCharging = false;
                this.chargeTimer = 0;
                this.spinAttackReady = false;
            }
        }`;

playerCode = playerCode.replace(oldChargeLogic, newChargeLogic);

// Add castBlink method before update method
const updateIndex = playerCode.indexOf('update(ctx: UpdateContext) {');
playerCode = playerCode.slice(0, updateIndex) + `    castBlink(ctx: UpdateContext) {
        let distance = 0;
        let destX = this.x;
        let destY = this.y;
        while (distance < 8) {
            const nextX = destX + Math.cos(this.aimAngle) * 0.5;
            const nextY = destY + Math.sin(this.aimAngle) * 0.5;
            if (isSolid(ctx.world.getBlock(Math.floor(nextX), Math.floor(nextY), Math.floor(this.z)))) {
                break;
            }
            destX = nextX;
            destY = nextY;
            distance += 0.5;
        }
        // Emit blink effect start
        if (ctx.onShoot) {
            ctx.onShoot(this.x, this.y, this.z + 1, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0, 'BLINK_FX', 0.5);
        }
        
        this.x = destX;
        this.y = destY;
        
        // Emit blink effect end
        if (ctx.onShoot) {
            ctx.onShoot(this.x, this.y, this.z + 1, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, 0, 'BLINK_FX', 0.5);
        }
    }\n\n    ` + playerCode.slice(updateIndex);

fs.writeFileSync('src/game/Player.ts', playerCode);

// Engine.ts needed for BLINK_FX handling
let engineCode = fs.readFileSync('src/game/Engine.ts', 'utf8');
engineCode = engineCode.replace(/if \(damageType \=\=\= \'MAGIC_HEAL\'\) \{([\s\S]*?)            \} else \{/g,
`if (damageType === 'MAGIC_HEAL') {
                for (let i = 0; i < 15; i++) {
                    this.particles.push({
                        x, y, z,
                        text: '',
                        color: Math.random() > 0.5 ? '#10b981' : '#34d399',
                        life: 1.0, maxLife: 1.0,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        vz: Math.random() * 2,
                        speed: 0
                    });
                }
            } else if (damageType === 'BLINK_FX') {
                for (let i = 0; i < 20; i++) {
                    this.particles.push({
                        x, y, z,
                        text: '',
                        color: '#8b5cf6', // Purple spark
                        life: 0.5, maxLife: 0.5,
                        vx: vx + (Math.random() - 0.5) * 2,
                        vy: vy + (Math.random() - 0.5) * 2,
                        vz: (Math.random() - 0.5) * 2,
                        speed: 0
                    });
                }
            } else {`);

fs.writeFileSync('src/game/Engine.ts', engineCode);

// Inventory.ts update for new item and Types
let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

invCode = invCode.replace(/interface Item \{/g,
`interface Item {
    secondaryAbility?: string;
    chargeTime?: number;
    chargeManaCost?: number;`);

invCode = invCode.replace(/\'book_lightning_board\'\: \{/g,
`'travelers_staff_acid': {
        id: 'travelers_staff_acid',
        name: 'Traveler\\'s Staff of Acid',
        description: 'Fires an acid bolt. Hold attack for 1.5s then release to Blink.',
        type: 'MAGIC_RANGED',
        damage: 25,
        reach: 18,
        cooldown: 0.8,
        projectileSpeed: 10,
        projectileColor: '#22c55e',
        spellId: 'acid_bolt',
        manaCost: 8,
        secondaryAbility: 'BLINK',
        chargeTime: 1.5,
        chargeManaCost: 30,
        category: 'WEAPON',
        maxStack: 1
    },
    'book_lightning_board': {`);

fs.writeFileSync('src/game/Inventory.ts', invCode);

// Renderer.ts particles/glow during charge
let renderCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');
renderCode = renderCode.replace(/if \(\!engine\.player\.hasHitThisSwing \&\& weapon\?\.type \=\=\= \'MELEE\' \&\& engine\.player\.isAttacking\) \{/g,
`// Draw weapon charging glow for magic staves
        if (engine.player.isCharging && weapon?.secondaryAbility) {
            const chargeRatio = Math.min(1.0, engine.player.chargeTimer / (weapon?.chargeTime || 1.5));
            const glowSize = TILE_SIZE * 0.3 * chargeRatio;
            ctx.fillStyle = engine.player.spinAttackReady ? '#fff' : weapon.projectileColor || '#8b5cf6';
            ctx.globalAlpha = engine.player.spinAttackReady ? 0.8 : 0.4 * chargeRatio;
            ctx.beginPath();
            
            // Draw glow at end of weapon (approximate position)
            const wepLen = TILE_SIZE * (weapon.reach ? weapon.reach / 3 : 1.0);
            const gx = screenX + TILE_SIZE/2 + Math.cos(engine.player.aimAngle) * wepLen;
            const gy = screenY + TILE_SIZE/2 + Math.sin(engine.player.aimAngle) * wepLen;
            
            ctx.arc(gx, gy, glowSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        if (!engine.player.hasHitThisSwing && weapon?.type === 'MELEE' && engine.player.isAttacking) {`);

fs.writeFileSync('src/game/Renderer.ts', renderCode);
