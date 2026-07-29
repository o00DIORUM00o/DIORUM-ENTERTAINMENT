const fs = require('fs');

let playerPath = 'src/game/Player.ts';
let pContent = fs.readFileSync(playerPath, 'utf8');
pContent = pContent.replace('takeDamage(amount: number) {', 'takeDamage(amount: number, type?: string) {');
pContent = pContent.replace('PlayerStatsManager.takeDamage(this, amount);', 'PlayerStatsManager.takeDamage(this, amount, type);');
fs.writeFileSync(playerPath, pContent);

let mgrPath = 'src/game/player/PlayerStatsManager.ts';
let mContent = fs.readFileSync(mgrPath, 'utf8');
mContent = mContent.replace('takeDamage(player: Player, amount: number) {', 'takeDamage(player: Player, amount: number, type?: string) {');
if (mContent.includes('const actualDamage = Math.max(1, amount - defense);')) {
    mContent = mContent.replace('const actualDamage = Math.max(1, amount - defense);', 
`        let mult = 1.0;
        if (type === 'FIRE' || type === 'EXPLOSION') {
            const fireResistantRaces = ['MOUNTAIN DWARF', 'RED ELF', 'COPPER KOBOLD', 'COPPER DRAGON FOLK', 'COPPER DRAKKEN', 'IMP'];
            if (fireResistantRaces.includes(player.race)) mult = 0.5;
        }
        const actualDamage = Math.max(1, Math.floor((amount * mult) - defense));`);
}
fs.writeFileSync(mgrPath, mContent);

let ctrlPath = 'src/game/player/PlayerController.ts';
let cContent = fs.readFileSync(ctrlPath, 'utf8');
cContent = cContent.replace(
`        let inLava = false;
        if (blockStandingIn === BlockType.LAVA) {
            inLava = true;
            player.health -= 20 * dt; // 20 damage per second`,
`        let inLava = false;
        if (blockStandingIn === BlockType.LAVA) {
            let fireMult = 1.0;
            const fireResistantRaces = ['MOUNTAIN DWARF', 'RED ELF', 'COPPER KOBOLD', 'COPPER DRAGON FOLK', 'COPPER DRAKKEN', 'IMP'];
            if (fireResistantRaces.includes(player.race)) fireMult = 0.5;
            inLava = true;
            player.health -= (20 * fireMult) * dt; // 20 damage per second`);

cContent = cContent.replace(
`        if (world.activePlanet === 'ARETH') {
            // Check for heat resistance (e.g., ring of ice, or nearby ice)
            let hasHeatResistance = false;
            for (const slotKey in player.equipment) {
                const item = player.equipment[slotKey as keyof typeof player.equipment];
                if (item && item.id.toLowerCase().includes('ice')) {
                    hasHeatResistance = true;
                    break;
                }
            }`,
`        if (world.activePlanet === 'ARETH') {
            // Check for heat resistance (e.g., ring of ice, or nearby ice)
            let hasHeatResistance = false;
            const fireResistantRaces = ['MOUNTAIN DWARF', 'RED ELF', 'COPPER KOBOLD', 'COPPER DRAGON FOLK', 'COPPER DRAKKEN', 'IMP'];
            if (fireResistantRaces.includes(player.race)) hasHeatResistance = true;
            for (const slotKey in player.equipment) {
                const item = player.equipment[slotKey as keyof typeof player.equipment];
                if (item && item.id.toLowerCase().includes('ice')) {
                    hasHeatResistance = true;
                    break;
                }
            }`);
fs.writeFileSync(ctrlPath, cContent);

let projPath = 'src/game/updaters/ProjectileUpdater.ts';
let prContent = fs.readFileSync(projPath, 'utf8');
prContent = prContent.replace('engine.player.takeDamage(p.damage);', "engine.player.takeDamage(p.damage, p.damageType || (p.isFireball ? 'FIRE' : 'PHYSICAL'));");
fs.writeFileSync(projPath, prContent);

console.log('patched');
