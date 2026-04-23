const fs = require('fs');
let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

const tStaff = `
    'travelers_staff_acid': {
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
`;

invCode = invCode.replace(/export const ITEMS\: Record\<string\, Item\> \= \{/g, `export const ITEMS: Record<string, Item> = {${tStaff}`);

fs.writeFileSync('src/game/Inventory.ts', invCode);
