const fs = require('fs');

// 1. INVENTORY.TS: Add the 10 artifact staves
let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

const newStaves = `
    'staff_inferno': { id: 'staff_inferno', name: 'Staff of the Inferno', description: 'Channels intense flames. Hold attack to call down a meteor.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'FIRE', twoHanded: true, damage: 25, cooldown: 1.0, projectileSpeed: 10, spellId: 'fire_bolt', manaCost: 5, secondaryAbility: 'METEOR', chargeTime: 2.0, chargeManaCost: 40 },
    'staff_necromancer': { id: 'staff_necromancer', name: 'Necromancer\\'s Crook', description: 'A twisted staff of bone. Hold attack to summon a skeleton minion.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ACID', twoHanded: true, damage: 15, cooldown: 0.8, projectileSpeed: 12, spellId: 'acid_bolt', manaCost: 5, secondaryAbility: 'SUMMON_SKELETON', chargeTime: 2.5, chargeManaCost: 50 },
    'staff_grove': { id: 'staff_grove', name: 'Staff of the Grove', description: 'A living branch. Hold attack to root nearby enemies.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'PHYSICAL', twoHanded: true, damage: 12, cooldown: 0.6, projectileSpeed: 15, spellId: 'arcane_bolt', manaCost: 4, secondaryAbility: 'ROOT', chargeTime: 1.5, chargeManaCost: 25 },
    'staff_heavens': { id: 'staff_heavens', name: 'Staff of the Heavens', description: 'Crackles with energy. Hold attack for a lightning strike.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'LIGHTNING', twoHanded: true, damage: 20, cooldown: 0.9, projectileSpeed: 18, spellId: 'lightning_bolt', manaCost: 6, secondaryAbility: 'LIGHTNING_STRIKE', chargeTime: 2.0, chargeManaCost: 35 },
    'staff_magma': { id: 'staff_magma', name: 'Magma Channeler', description: 'Radiates heat. Hold attack to create a lava puddle at cursor.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'FIRE', twoHanded: true, damage: 18, cooldown: 1.0, projectileSpeed: 10, spellId: 'fire_bolt', manaCost: 5, secondaryAbility: 'LAVA_PUDDLE', chargeTime: 1.5, chargeManaCost: 20 },
    'staff_glacial': { id: 'staff_glacial', name: 'Glacial Staff', description: 'Freezing to the touch. Hold attack for Frost Nova.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ICE', twoHanded: true, damage: 16, cooldown: 0.8, projectileSpeed: 12, spellId: 'ice_bolt', manaCost: 5, secondaryAbility: 'FROST_NOVA', chargeTime: 2.0, chargeManaCost: 30 },
    'staff_void': { id: 'staff_void', name: 'Void Staff', description: 'Absorbs all light. Hold attack to conjure a Black Hole.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ARCANE', twoHanded: true, damage: 30, cooldown: 1.5, projectileSpeed: 8, spellId: 'arcane_bolt', manaCost: 10, secondaryAbility: 'BLACK_HOLE', chargeTime: 3.0, chargeManaCost: 60 },
    'staff_druid': { id: 'staff_druid', name: 'Staff of the Druid', description: 'Teems with life. Hold attack for Mass Heal.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ACID', twoHanded: true, damage: 10, cooldown: 0.5, projectileSpeed: 14, spellId: 'acid_bolt', manaCost: 3, secondaryAbility: 'MASS_HEAL', chargeTime: 2.5, chargeManaCost: 45 },
    'staff_time': { id: 'staff_time', name: 'Time-Mender\\'s Staff', description: 'Distorts reality. Hold attack to stop time.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ARCANE', twoHanded: true, damage: 22, cooldown: 1.2, projectileSpeed: 20, spellId: 'arcane_bolt', manaCost: 8, secondaryAbility: 'TIME_STOP', chargeTime: 3.0, chargeManaCost: 80 },
    'staff_wind': { id: 'staff_wind', name: 'Staff of the Wind', description: 'Light as a feather. Hold attack to push enemies back.', category: 'WEAPON', type: 'MAGIC_RANGED', damageType: 'ARCANE', twoHanded: true, damage: 14, cooldown: 0.7, projectileSpeed: 16, spellId: 'arcane_bolt', manaCost: 4, secondaryAbility: 'PUSH_BACK', chargeTime: 1.0, chargeManaCost: 15 },
`;

invCode = invCode.replace(/'iron_shield': \{ id: 'iron_shield', name: 'Iron Shield', description: 'A sturdy shield made of iron.', category: 'ARMOR', equipmentSlot: 'OFF_HAND', defense: 6, maxStack: 1, quantity: 1 \}/g,
`'iron_shield': { id: 'iron_shield', name: 'Iron Shield', description: 'A sturdy shield made of iron.', category: 'ARMOR', equipmentSlot: 'OFF_HAND', defense: 6, maxStack: 1, quantity: 1 },
${newStaves}`);

fs.writeFileSync('src/game/Inventory.ts', invCode);

// 2. PLAYER.TS: Add onTriggerSecondary to UpdateContext and trigger logic
let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

playerCode = playerCode.replace(/onOpenPortalMenu\?\: \(color\: string\) \=\> void\;\n\}/g,
`onOpenPortalMenu?: (color: string) => void;
    onTriggerSecondary?: (ability: string, aimAngle: number, x: number, y: number, z: number) => void;
}`);

playerCode = playerCode.replace(/const \{ world\, dx\, dy\, aimX\, aimY\, attacking\, casting\, interacting\, jumping\, dashing\, quick1\, quick2\, quick3\, dt\, onHit\, onShoot\, onAoE\, onCastSpell\, onMelee\, onDropItem\, onOpenPortalMenu\, onSaddleUse\, onPlantBomb \} \= ctx\;/g,
`const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;`);

playerCode = playerCode.replace(/if \(weapon\?\.secondaryAbility \=\=\= \'BLINK\'\) \{\n\s*this\.castBlink\(ctx\)\;\n\s*\}/g,
`if (weapon?.secondaryAbility === 'BLINK') {
                                this.castBlink(ctx);
                            } else if (onTriggerSecondary) {
                                onTriggerSecondary(weapon.secondaryAbility, this.aimAngle, this.x, this.y, this.z);
                            }`);

fs.writeFileSync('src/game/Player.ts', playerCode);

console.log("Success modifying Inventory and Player");
