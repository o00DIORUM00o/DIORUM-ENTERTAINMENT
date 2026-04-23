const fs = require('fs');

// 1. UPDATE BARKS IN NPCChat.tsx
let rCode = fs.readFileSync('src/components/NPCChat.tsx', 'utf8');

rCode = rCode.replace(/if \(prof \=\=\= \'VILLAGER_GUARD\'\) \{([\s\S]*?)        \} else \{/g,
`if (prof === 'VILLAGER_GUARD') {
            const barks = ["Keep your nose clean, traveler.", "No trouble on my watch.", "I'm watching you.", "Stay alert, goblins are about."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_FARMER') {
            const barks = ["Nice day for the crops.", "Need some seeds?", "Hard work, but it pays the bills.", "The dirt here is mighty fine."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_MERCHANT') {
            const barks = ["Care to see my wares?", "Coin for goods, friend?", "Best prices in the realm!", "Can't beat these deals."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_BEGGAR') {
            const barks = ["Spare a coin?", "I haven't eaten in days...", "Bless you, kind traveler.", "Just a crumb?"];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_THIEF') {
            const barks = ["Keep your voice down... wanna buy something?", "I found this falling off a cart.", "Quick, before the guards see."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_SMITH') {
            const barks = ["Steel wins battles.", "Need your blade sharpened?", "Hot from the forge!", "I work with iron and blood."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_ALCHEMIST') {
            const barks = ["Careful with that! It's highly volatile.", "Ah, a new concoction!", "Need a potion of healing?"];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_PRIEST') {
            const barks = ["May the light guide your path.", "Blessings upon you.", "Seek peace, traveler."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_BOUNTY_HUNTER') {
            const barks = ["Got a target? I've got a blade.", "I only work for coin.", "Everyone has a price on their head."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_GLADIATOR') {
            const barks = ["The arena calls to me.", "Blood and sand!", "My sword thirsts for battle."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_ENCHANTER') {
            const barks = ["Magic bound to metal and stone.", "Would you like an enchantment?", "Power has a price."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_KNIGHT') {
            const barks = ["Honor and duty above all.", "Stand firm!", "For the realm!"];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_NOBLE') {
            const barks = ["Do you have an appointment? No? Pity.", "Stay back, commoner.", "I deal in gems, not copper."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_COUNCILOR') {
            const barks = ["The affairs of the state are... complex.", "We must govern wisely.", "Bureaucracy is the true power."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_NECROMANCER') {
            const barks = ["Death is only the beginning.", "The dead do not sleep.", "More bones for the pile..."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_JESTER') {
            const barks = ["Why did the goblin cross the road? To get away from you!", "Jingle jangle!", "A laugh for a coin?"];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_SHAMAN') {
            const barks = ["The spirits speak to those who listen.", "The earth remembers.", "I speak for the elements."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else if (prof === 'VILLAGER_WIZARD') {
            const barks = ["The arcane flows through all things.", "Do not disturb my studies.", "Knowledge is power."];
            return barks[Math.floor(Math.random() * barks.length)];
        } else {`);

fs.writeFileSync('src/components/NPCChat.tsx', rCode);

// 2. Add custom rendering for all the professions
let renderCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');

const replacementRenderer = `// Base body
                let renderColor = '#78716c'; // Default Commoner
                if (prof === 'VILLAGER_GUARD') renderColor = '#1e3a8a';
                else if (prof === 'VILLAGER_FARMER') renderColor = '#65a30d';
                else if (prof === 'VILLAGER_MERCHANT') renderColor = '#b45309';
                else if (prof === 'VILLAGER_BEGGAR') renderColor = '#57534e'; // Grimy
                else if (prof === 'VILLAGER_THIEF') renderColor = '#1c1917'; // Dark cloaks
                else if (prof === 'VILLAGER_SMITH') renderColor = '#b45309'; // Leather apron
                else if (prof === 'VILLAGER_ALCHEMIST') renderColor = '#059669'; // Emerald robes
                else if (prof === 'VILLAGER_PRIEST') renderColor = '#fafafa'; // White robes
                else if (prof === 'VILLAGER_BOUNTY_HUNTER') renderColor = '#451a03'; // Dark leather
                else if (prof === 'VILLAGER_GLADIATOR') renderColor = '#991b1b'; // Red sash
                else if (prof === 'VILLAGER_ENCHANTER') renderColor = '#4f46e5'; // Blue robes
                else if (prof === 'VILLAGER_KNIGHT') renderColor = '#cbd5e1'; // Silver armor
                else if (prof === 'VILLAGER_NOBLE') renderColor = '#7e22ce'; // Royal purple
                else if (prof === 'VILLAGER_COUNCILOR') renderColor = '#0f172a'; // Official black
                else if (prof === 'VILLAGER_NECROMANCER') renderColor = '#000000'; // Pure black
                else if (prof === 'VILLAGER_JESTER') renderColor = '#ef4444'; // Red and yellow
                else if (prof === 'VILLAGER_SHAMAN') renderColor = '#14532d'; // Forest shaman
                else if (prof === 'VILLAGER_WIZARD') renderColor = '#1d4ed8'; // Wizard blue
                
                ctx.fillStyle = renderColor;
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // Head (tan or bone for necro)
                ctx.fillStyle = (prof === 'VILLAGER_NECROMANCER') ? '#f1f5f9' : '#fcd34d';
                ctx.beginPath();
                ctx.arc(TILE_SIZE * 0.1, 0, TILE_SIZE * 0.25, 0, Math.PI * 2);
                ctx.fill();
                
                // Details
                if (prof === 'VILLAGER_GUARD') {
                    // Iron Helmet line
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(TILE_SIZE * -0.1, -TILE_SIZE * 0.25, TILE_SIZE * 0.3, TILE_SIZE * 0.5);
                    // Spear
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.25, TILE_SIZE * 0.8, 4);
                    ctx.fillStyle = '#94a3b8'; // Spear tip
                    ctx.beginPath();
                    ctx.moveTo(TILE_SIZE * 1.0, TILE_SIZE * 0.25 + 2);
                    ctx.lineTo(TILE_SIZE * 1.2, TILE_SIZE * 0.25 + 2);
                    ctx.lineTo(TILE_SIZE * 1.0, TILE_SIZE * 0.25 + 8);
                    ctx.fill();
                } else if (prof === 'VILLAGER_FARMER') {
                    // Straw hat
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * -0.05, 0, TILE_SIZE * 0.35, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ca8a04';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * 0.05, 0, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (prof === 'VILLAGER_KNIGHT') {
                    // Great Helm
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(TILE_SIZE * -0.1, -TILE_SIZE * 0.25, TILE_SIZE * 0.4, TILE_SIZE * 0.5);
                    ctx.fillStyle = '#0f172a'; // Eye slit
                    ctx.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.1, TILE_SIZE * 0.2, TILE_SIZE * 0.05);
                } else if (prof === 'VILLAGER_MERCHANT' || prof === 'VILLAGER_NOBLE') {
                    // Cash bag / coin / gem
                    ctx.fillStyle = prof === 'VILLAGER_NOBLE' ? '#ef4444' : '#eab308';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * 0.4, 0, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                } else if (prof === 'VILLAGER_NECROMANCER') {
                    // Glowing eyes
                    ctx.fillStyle = '#10b981';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * 0.2, -TILE_SIZE * 0.08, TILE_SIZE * 0.05, 0, Math.PI * 2);
                    ctx.arc(TILE_SIZE * 0.2, TILE_SIZE * 0.08, TILE_SIZE * 0.05, 0, Math.PI * 2);
                    ctx.fill();
                } else if (prof === 'VILLAGER_SMITH') {
                    ctx.fillStyle = '#94a3b8'; // Anvil/Hammer head
                    ctx.fillRect(TILE_SIZE * 0.4, TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.1);
                    ctx.fillStyle = '#78350f'; // Handle
                    ctx.fillRect(TILE_SIZE * 0.3, TILE_SIZE * 0.22, TILE_SIZE * 0.1, TILE_SIZE * 0.06);
                }`;

renderCode = renderCode.replace(/\/\/ Base body\n\s*if \(prof \=\=\= \'VILLAGER_GUARD\'\) ctx\.fillStyle \= \'\#1e3a8a\'\; \/\/ Dark blue guard uniform\n\s*else if \(prof \=\=\= \'VILLAGER_FARMER\'\) ctx\.fillStyle \= \'\#65a30d\'\; \/\/ Olive green farmer\n\s*else ctx\.fillStyle \= \'\#78716c\'\; \/\/ Grey commoner\/merchant\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(0\, 0\, TILE_SIZE \* 0\.3\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*\/\/ Head \(tan\)\n\s*ctx\.fillStyle \= \'\#fcd34d\'\;\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(TILE_SIZE \* 0\.1\, 0\, TILE_SIZE \* 0\.25\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*\/\/ Profession Hat\/Item\n\s*if \(prof \=\=\= \'VILLAGER_GUARD\'\) \{\n\s*\/\/ Iron Helmet line\n\s*ctx\.fillStyle \= \'\#cbd5e1\'\;\n\s*ctx\.fillRect\(TILE_SIZE \* \-0\.1\, \-TILE_SIZE \* 0\.25\, TILE_SIZE \* 0\.3\, TILE_SIZE \* 0\.5\)\;\n\s*\/\/ Spear\n\s*ctx\.fillStyle \= \'\#78350f\'\;\n\s*ctx\.fillRect\(TILE_SIZE \* 0\.2\, TILE_SIZE \* 0\.25\, TILE_SIZE \* 0\.8\, 4\)\;\n\s*ctx\.fillStyle \= \'\#94a3b8\'\; \/\/ Spear tip\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.moveTo\(TILE_SIZE \* 1\.0\, TILE_SIZE \* 0\.25 \+ 2\)\;\n\s*ctx\.lineTo\(TILE_SIZE \* 1\.2\, TILE_SIZE \* 0\.25 \+ 2\)\;\n\s*ctx\.lineTo\(TILE_SIZE \* 1\.0\, TILE_SIZE \* 0\.25 \+ 8\)\;\n\s*ctx\.fill\(\)\;\n\s*\} else if \(prof \=\=\= \'VILLAGER_FARMER\'\) \{\n\s*\/\/ Straw hat\n\s*ctx\.fillStyle \= \'\#fef08a\'\;\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(TILE_SIZE \* \-0\.05\, 0\, TILE_SIZE \* 0\.35\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*ctx\.fillStyle \= \'\#ca8a04\'\;\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(TILE_SIZE \* 0\.05\, 0\, TILE_SIZE \* 0\.2\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*\} else \{\n\s*\/\/ Cash bag \/ coin for merchant\n\s*ctx\.fillStyle \= \'\#eab308\'\;\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(TILE_SIZE \* 0\.4\, 0\, TILE_SIZE \* 0\.1\, 0\, Math\.PI \* 2\)\;\n\s*ctx\.fill\(\)\;\n\s*\}/, replacementRenderer);

fs.writeFileSync('src/game/Renderer.ts', renderCode);
