const fs = require('fs');

const path = 'src/game/player/actions/CompanionAction.ts';
let content = fs.readFileSync(path, 'utf8');

const spawnLogic = `
                    } else if (item.summonsCompanion === 'COPPER_GOLEM') {
                        companionTitle = 'Copper Golem';
                        companionNameBase = ['Clank', 'Gear', 'Cog', 'Rusty', 'Bolt'][Math.floor(Math.random()*5)];
                        health = 1000;
                        speed = 10.0;
                    } else if (item.summonsCompanion === 'SILVER_GOLEM') {
                        companionTitle = 'Silver Golem';
                        companionNameBase = ['Aura', 'Gleam', 'Shimmer', 'Lumina', 'Healbot'][Math.floor(Math.random()*5)];
                        health = 800;
                        speed = 12.0;
                    }
                    const newCompanion = { 
`;

content = content.replace("const newCompanion = {", spawnLogic);
fs.writeFileSync(path, content);
console.log("Patched CompanionAction.ts");
