const fs = require('fs');

// 1. Update Spells
let spellsPath = 'src/game/content/spells/spells.ts';
let spellsContent = fs.readFileSync(spellsPath, 'utf8');

const newSpells = `
    'carrot_bloom': {
        id: "carrot_bloom",
        name: "Carrot Bloom",
        description: "Creates carrots all around you.",
        manaCost: 20,
        cooldown: 5.0,
        castTime: 3.0,
        damage: 0,
        reach: 4,
        spread: 0,
        damageType: 'CARROT_BLOOM' as any,
        type: 'AOE'
    },
    'fire_vortice': {
        id: "fire_vortice",
        name: "Fire Vortice",
        description: "Summons a slow moving fire twister.",
        manaCost: 15,
        cooldown: 6.0,
        castTime: 0.5,
        damage: 15,
        reach: 1,
        spread: 0,
        damageType: 'FIRE',
        type: 'PROJECTILE' 
    },
    'frost_vortice': {
        id: "frost_vortice",
        name: "Frost Vortice",
        description: "Summons a slow moving frost twister.",
        manaCost: 15,
        cooldown: 6.0,
        castTime: 0.5,
        damage: 15,
        reach: 1,
        spread: 0,
        damageType: 'ICE',
        statusEffect: { type: 'chill', chance: 1.0, duration: 4.0 },
        type: 'PROJECTILE' 
    },
    'acid_vortice': {
        id: "acid_vortice",
        name: "Acid Vortice",
        description: "Summons a slow moving acid twister.",
        manaCost: 15,
        cooldown: 6.0,
        castTime: 0.5,
        damage: 15,
        reach: 1,
        spread: 0,
        damageType: 'ACID',
        statusEffect: { type: 'poison', chance: 1.0, duration: 4.0 },
        type: 'PROJECTILE' 
    },
`;

if (!spellsContent.includes('carrot_bloom')) {
    spellsContent = spellsContent.replace('export const ALL_SPELLS: Record<string, Spell> = {', 'export const ALL_SPELLS: Record<string, Spell> = {' + newSpells);
    fs.writeFileSync(spellsPath, spellsContent);
    console.log("Updated spells.ts");
} else {
    console.log("spells.ts already updated");
}

// 2. Update Spell Books
let booksPath = 'src/game/content/items/consumables/spellbooks.ts';
let booksContent = fs.readFileSync(booksPath, 'utf8');

const newBooks = `
    'book_carrot_bloom': {
        id: "book_carrot_bloom",
        name: "Spell Book: Carrot Bloom",
        description: "Read to learn the Carrot Bloom spell.",
        category: "CONSUMABLE",
        spellId: "carrot_bloom",
        quantity: 1,
        maxStack: 1
    },
    'book_fire_vortice': {
        id: "book_fire_vortice",
        name: "Spell Book: Fire Vortice",
        description: "Read to learn the Fire Vortice spell.",
        category: "CONSUMABLE",
        spellId: "fire_vortice",
        quantity: 1,
        maxStack: 1
    },
    'book_frost_vortice': {
        id: "book_frost_vortice",
        name: "Spell Book: Frost Vortice",
        description: "Read to learn the Frost Vortice spell.",
        category: "CONSUMABLE",
        spellId: "frost_vortice",
        quantity: 1,
        maxStack: 1
    },
    'book_acid_vortice': {
        id: "book_acid_vortice",
        name: "Spell Book: Acid Vortice",
        description: "Read to learn the Acid Vortice spell.",
        category: "CONSUMABLE",
        spellId: "acid_vortice",
        quantity: 1,
        maxStack: 1
    },
`;

if (!booksContent.includes('book_carrot_bloom')) {
    booksContent = booksContent.replace('export const SPELLBOOKS_ITEMS: Record<string, Item> = {', 'export const SPELLBOOKS_ITEMS: Record<string, Item> = {' + newBooks);
    fs.writeFileSync(booksPath, booksContent);
    console.log("Updated spellbooks.ts");
} else {
    console.log("spellbooks.ts already updated");
}
