const fs = require('fs');

const path = 'src/components/NPCChat.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to add PlayerProgression import
if (!content.includes('PlayerProgression')) {
    content = content.replace(
        /import { QuestSystem } from '\.\.\/game\/systems\/QuestSystem';/,
        `import { QuestSystem } from '../game/systems/QuestSystem';\nimport { PlayerProgression } from '../game/player/PlayerProgression';`
    );
}

// Replace the options generation logic inside useEffect(() => { ... }, [npc, engine]);

// First find the boundaries of the useEffect
const useEffectRegex = /useEffect\(\(\) => \{\n        if \(npc\.type === 'QUEST_GIVER'\) \{[\s\S]*?setSelectedIndex\(0\);\n    \}, \[npc, engine\]\);/;

const newOptionsLogic = `useEffect(() => {
        if (npc.type === 'QUEST_GIVER') {
            setGreeting("I fear this dungeon contains a dark artifact... Take this Dungeon Key, seek the Boss Room at the bottom, and put an end to it!");
        } else {
            setGreeting(getVillagerBark(npc));
        }
        
        const initialOptions = [];
        
        initialOptions.push("TALK");
        
        if (onTrade && (
            npc.type === 'OLD_WIZARD' || 
            npc.type === 'DRACONIC_MERCHANT' || 
            npc.type === 'SLUG_FOLK_MERCHANT' || 
            npc.type === 'BAG_MERCHANT' || 
            npc.type === 'BERRY_FARMER' || 
            npc.type === 'VILLAGER_MERCHANT' || 
            npc.type.startsWith('STALL_') || 
            (npc.type === 'VILLAGER' && (npc as any).merchantType)
        )) {
            initialOptions.push("TRADE");
        }
        
        if (npc.type === 'BEAST_TAMER') {
            initialOptions.push("TRADE (Adopt Companion - 10 silver)");
        }
        
        if (npc.type === 'VILLAGER' && ['VILLAGER_PRIEST', 'VILLAGER_ALCHEMIST'].includes((npc as any).profession)) {
            initialOptions.push("HEAL");
        }
        
        if (npc.type === 'WANDERING_BARD') {
            initialOptions.push("HEAL (Listen to a song)");
        }
        
        if (npc.type === 'QUEST_GIVER' && !(npc as any).hasGivenKey) {
            initialOptions.push("QUEST (Accept Key)");
        }
        
        const activeQuests = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
        for (const q of activeQuests) {
            if (q.state === 'COMPLETED') {
                initialOptions.push(\`QUEST (Turn in): \${q.title}\`);
            } else {
                initialOptions.push(\`QUEST (Active): \${q.title}\`);
            }
        }
        
        const availableQuests = QuestSystem.getAvailableQuests(engine.player, npc.type);
        for (const q of availableQuests) {
            initialOptions.push(\`QUEST (Accept): \${q.title}\`);
        }
        
        if (npc.type === 'VILLAGER' && ['VILLAGER_GUARD', 'VILLAGER_GLADIATOR', 'VILLAGER_KNIGHT', 'VILLAGER_WIZARD', 'VILLAGER_SMITH', 'VILLAGER_FARMER'].includes((npc as any).profession)) {
            initialOptions.push("TRAIN");
        }
        
        initialOptions.push("CHAT");
        
        const ppLevel = engine?.player?.talents['pick_pocket'] || 0;
        if (ppLevel > 0 && npc.disposition > -50 && !(npc as any).hasBeenPickpocketed) {
             initialOptions.push("PICKPOCKET");
        }
        
        initialOptions.push("GOODBYE");
        
        setOptions(initialOptions);
        setSelectedIndex(0);
    }, [npc, engine]);`;

content = content.replace(useEffectRegex, newOptionsLogic);

// Next we replace the handleSelectOption logic
const handleSelectRegex = /    const handleSelectOption = \(option: string\) => \{[\s\S]*?        if \(mode === 'ERROR' || option === 'Goodbye' || option\.includes\('\(Leave\)'\)\) \{/;

const newHandleSelectLogic = `    const handleSelectOption = (option: string) => {
        if (mode === 'MENU') {
            if (option === 'TALK') {
                setGreeting(getVillagerBark(npc));
            } else if (option === 'TRADE') {
                if (onTrade) onTrade();
            } else if (option === 'TRADE (Adopt Companion - 10 silver)') {
                if (engine.player.removeItem('silver_piece', 10)) {
                    const companionNameBase = ['Fang', 'Scout', 'Rex', 'Shadow', 'Ghost', 'Brutus', 'Ash'][Math.floor(Math.random()*7)];
                    const newCompanion = { 
                        id: \`comp_\${Date.now()}\`,
                        type: 'WOLF', 
                        name: \`Dire Wolf \${companionNameBase}\`,
                        damage: 15,
                        health: 300,
                        maxHealth: 300,
                        speed: 15.0
                    };
                    if (!engine.player.companions) engine.player.companions = [];
                    engine.player.companions.push(newCompanion);
                    setGreeting(\`Treat \${newCompanion.name} well. They'll fight to the death for you.\`);
                    const newOptions = options.filter(o => o !== 'TRADE (Adopt Companion - 10 silver)');
                    setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                    setSelectedIndex(0);
                } else {
                    setGreeting("You don't have 10 silver pieces, traveler.");
                }
            } else if (option.startsWith('HEAL')) {
                engine.player.health = engine.player.effectiveMaxHealth;
                engine.player.stamina = engine.player.maxStamina;
                engine.player.mana = engine.player.effectiveMaxMana;
                setGreeting("You feel your vitality returning.");
                engine.particles.push({
                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                    text: '♫ FULLY RESTORED ♫', color: '#ff69b4', life: 2.5, maxLife: 2.5, speed: 0, vy: 0.5, vx: 0, vz: 0
                });
                if (option.includes('song')) {
                    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
                    if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const freqs = [523.25, 659.25, 783.99, 1046.50];
                        freqs.forEach((f, i) => {
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.type = 'triangle';
                            osc.frequency.value = f;
                            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
                            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.05);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.5);
                            osc.start(ctx.currentTime + i * 0.15);
                            osc.stop(ctx.currentTime + i * 0.15 + 0.5);
                        });
                    }
                    for (let i = 0; i < 15; i++) {
                        engine.particles.push({
                            x: engine.player.x + (Math.random() - 0.5) * 2,
                            y: engine.player.y + (Math.random() - 0.5) * 2,
                            z: engine.player.z + Math.random() * 2,
                            text: ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)],
                            color: \`hsl(\${Math.random() * 360}, 100%, 70%)\`,
                            life: 1.5 + Math.random(), maxLife: 2.5, speed: 0, vy: 1 + Math.random(), vx: (Math.random() - 0.5) * 2, vz: (Math.random() - 0.5) * 2, size: 2 + Math.random() * 2
                        });
                    }
                }
            } else if (option === 'QUEST (Accept Key)') {
                engine.player.inventory.push({ ...ITEMS['dungeon_key'], quantity: 1 });
                (npc as any).hasGivenKey = true;
                setGreeting("Good luck... You'll need it.");
                const newOptions = options.filter(o => o !== 'QUEST (Accept Key)');
                setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                setSelectedIndex(0);
            } else if (option.startsWith('QUEST (Accept): ')) {
                const questTitle = option.replace('QUEST (Accept): ', '');
                const available = QuestSystem.getAvailableQuests(engine.player, npc.type);
                const quest = available.find(q => q.title === questTitle);
                if (quest) {
                    QuestSystem.acceptQuest(engine, quest.id);
                    setGreeting(\`Excellent! \${quest.description}\`);
                    const newOptions = options.filter(o => o !== option);
                    setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                    setSelectedIndex(0);
                }
            } else if (option.startsWith('QUEST (Turn in): ')) {
                const questTitle = option.replace('QUEST (Turn in): ', '');
                const active = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
                const quest = active.find(q => q.title === questTitle);
                if (quest) {
                    QuestSystem.turnInQuest(engine, quest.id);
                    setGreeting(\`Thank you so much! I've given you a reward.\`);
                    const newOptions = options.filter(o => o !== option);
                    setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                    setSelectedIndex(0);
                }
            } else if (option.startsWith('QUEST (Active): ')) {
                const questTitle = option.replace('QUEST (Active): ', '');
                const active = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
                const quest = active.find(q => q.title === questTitle);
                if (quest) {
                    setGreeting(\`\${quest.description} (You have \${quest.currentCount}/\${quest.requiredCount})\`);
                }
            } else if (option === 'TRAIN') {
                if (engine.player.removeItem('gold_piece', 15)) {
                    PlayerProgression.addXp(engine.player, engine.player.xpToNextLevel - engine.player.xp);
                    setGreeting("You feel yourself growing stronger...");
                    const newOptions = options.filter(o => o !== 'TRAIN');
                    setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                    setSelectedIndex(0);
                } else {
                    setGreeting("Training costs 15 gold pieces. Come back when you have it.");
                }
            } else if (option === 'CHAT') {
                if ((window as any).__AI_EXHAUSTED__) {
                    setMode('ERROR');
                } else {
                    setMode('LLM');
                    generateResponse([{ role: 'user', text: '*Approaches the NPC*' }]);
                }
            } else if (option === 'PICKPOCKET') {
                setMode('PICK_POCKET');
                handlePickPocket();
            } else if (option === 'GOODBYE') {
                onClose();
            }
            return;
        }

        if (mode === 'ERROR' || option === 'Goodbye' || option === 'GOODBYE' || option.includes('(Leave)')) {`;

content = content.replace(handleSelectRegex, newHandleSelectLogic);

fs.writeFileSync(path, content);
console.log("Successfully replaced NPC Chat logic");
