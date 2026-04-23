const fs = require('fs');

let updater = fs.readFileSync('src/game/Updater.ts', 'utf8');

const bearLogic = `const types: any[] = [
                                            { type: 'DEER', hp: 30, speed: 4.5, jump: 6, stamina: 60 },
                                            { type: 'SHEEP', hp: 20, speed: 3.0, jump: 5, stamina: 40 },
                                            { type: 'HORSE', hp: 50, speed: 6.0, jump: 7, stamina: 100 },
                                            { type: 'TURTLE', hp: 100, speed: 1.5, jump: 2, stamina: 30 },
                                            { type: 'GIANT_CHICKEN', hp: 20, speed: 4.0, jump: 10, stamina: 50 },
                                            { type: 'GIANT_FROG', hp: 30, speed: 3.0, jump: 12, stamina: 40 },
                                            { type: 'CAPYBARA', hp: 40, speed: 4.0, jump: 4, stamina: 70 }
                                        ];
                                        
                                        if (Math.random() < 0.05) {
                                            types.push({ type: 'UNICORN', hp: 60, speed: 7.0, jump: 9, stamina: 120 });
                                        }
                                        if (Math.random() < 0.1) {
                                            types.push({ type: 'BEAR', hp: 80, speed: 3.5, jump: 4, stamina: 80 });
                                        }`;

updater = updater.replace(/const types: any\[\] = \[[^]*?UNICORN[^]*?}\;/g, bearLogic);

fs.writeFileSync('src/game/Updater.ts', updater);


let world = fs.readFileSync('src/game/World.ts', 'utf8');

const spawnerLogic = `                            const spawnerRand = Math.random();
                            let spawnerType = BlockType.BEE_HIVE;
                            
                            if (spawnerRand < 0.2) spawnerType = BlockType.BEE_HIVE;
                            else if (spawnerRand < 0.4) spawnerType = BlockType.GOBLIN_CAMP;
                            else if (spawnerRand < 0.5) spawnerType = BlockType.ORC_TENT;
                            else if (spawnerRand < 0.6) spawnerType = BlockType.GOBLIN_SHAMAN_TENT;
                            else if (spawnerRand < 0.8) spawnerType = BlockType.BONE_PILE_SPAWNER;
                            else if (spawnerRand < 0.97) spawnerType = BlockType.ANT_HILL;
                            else {
                                const rareRand = Math.random();
                                if (rareRand < 0.33) spawnerType = BlockType.SLIME_PUDDLE;
                                else if (rareRand < 0.66) spawnerType = BlockType.SPIDER_WEB;
                                else spawnerType = BlockType.DEMON_PORTAL;
                            }`;

world = world.replace(/const spawnerRand = Math\.random\(\);\n[^]*?else spawnerType = BlockType\.ANT_HILL;/g, spawnerLogic);

fs.writeFileSync('src/game/World.ts', world);

console.log("Updated bear rarity and spawner rarity");
