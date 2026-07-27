const fs = require('fs');

const path = 'src/game/content/items/weapons/swords.ts';
let content = fs.readFileSync(path, 'utf8');

const updates = [
    { id: 'green_metal_sword', ability: 'SPIN_POISON_WAVE', cost: 20 },
    { id: 'yellow_metal_sword', ability: 'SPIN_THUNDER_STRIKE', cost: 20 },
    { id: 'blue_metal_sword', ability: 'SPIN_LIGHT_BURST', cost: 20 }, // Wait, blue is ice, maybe 'FROST_NOVA' or 'SPIN_SPECTRAL_BLADES' ? Let's use 'SPIN_SPECTRAL_BLADES'
    { id: 'red_metal_sword', ability: 'SPIN_DRAGON_BREATH', cost: 25 },
    { id: 'black_metal_sword', ability: 'SPIN_BLOOD_THIRST', cost: 25 },
    { id: 'purple_metal_sword', ability: 'SPIN_TELEPORT_STRIKE', cost: 25 },
    { id: 'orange_metal_sword', ability: 'SPIN_EARTHQUAKE', cost: 25 }
];

updates.forEach(u => {
    // We are looking for the sword definition
    const regex = new RegExp(`id:\\s*"${u.id}",([\\s\\S]*?)(spread:\\s*[0-9.]+)`, 'g');
    content = content.replace(regex, (match, p1, p2) => {
        if (match.includes('secondaryAbility')) return match; // already added
        return match + `,\n        secondaryAbility: '${u.ability}',\n        chargeTime: 1.0,\n        chargeManaCost: ${u.cost}`;
    });
});

fs.writeFileSync(path, content);
console.log("Swords patched!");
