const fs = require('fs');
const path = 'src/components/NPCChat.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add GoogleGenAI Import safely
if (!content.includes('@google/genai')) {
    content = content.replace(
        "import React",
        "import { GoogleGenAI } from '@google/genai';\nimport React"
    );
}

// 2. Replace options logic
const useEffectRegex = /    useEffect\(\(\) => \{\n        if \(npc\.type === 'QUEST_GIVER'\) \{[\s\S]*?setSelectedIndex\(0\);\n    \}, \[npc, engine\]\);/;

const newOptionsLogic = `    useEffect(() => {
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

// 3. Replace handleSelectOption safely using substring since the text is known
const startText = "    const handleSelectOption = (option: string) => {\n        if (mode === 'MENU') {\n            if (option === 'TALK') {";
const endText = "        if (mode === 'ERROR' || option === 'Goodbye' || option === 'GOODBYE' || option.includes('(Leave)')) {";
const startIndex = content.indexOf("    const handleSelectOption = (option: string) => {");
const endIndex = content.indexOf(endText);

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
                    PlayerProgression.addXp(engine.player, Math.max(1, engine.player.xpToNextLevel - engine.player.xp));
                    setGreeting("You feel yourself growing stronger...");
                    const newOptions = options.filter(o => o !== 'TRAIN');
                    setOptions(newOptions.length > 0 ? newOptions : ['GOODBYE']);
                    setSelectedIndex(0);
                } else {
                    setGreeting("Training costs 15 gold pieces. Come back when you have it.");
                }
            } else if (option === 'CHAT') {
                const aiEnabled = localStorage.getItem('ai_enabled') === 'true';
                const apiKey = localStorage.getItem('ai_api_key');
                if (aiEnabled && apiKey) {
                    setMode('LLM');
                    generateResponse([{ role: 'user', text: '*Approaches the NPC*' }]);
                } else {
                    setMode('ERROR');
                }
            } else if (option === 'PICKPOCKET') {
                setMode('PICK_POCKET');
                handlePickPocket();
            } else if (option === 'GOODBYE') {
                onClose();
            }
            return;
        }

`;

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newHandleSelectLogic + content.substring(endIndex);
}

// 4. Replace generateResponse safely (between "const generateResponse" and "return (")
const generateRegex = /    const generateResponse = async \(history: ChatMessage\[\]\) => \{[\s\S]*?    \};\n\n    return \(/;

const newGenerate = `    const generateResponse = async (history: ChatMessage[]) => {
        setIsLoading(true);
        setOptions([]);
        
        try {
            const aiEnabled = localStorage.getItem('ai_enabled') === 'true';
            const apiKey = localStorage.getItem('ai_api_key');
            
            const lastMsg = history[history.length - 1];
            const lowerText = lastMsg?.text.toLowerCase() || '';

            if (aiEnabled && apiKey) {
                try {
                    const ai = new GoogleGenAI({ apiKey });
                    const npcName = npc.type === 'NPC_KING' ? 'The King' : npc.type === 'BOUNTY_HUNTER' ? 'Bounty Hunter' : npc.type === 'VILLAGER' ? 'Villager' : 'Arcanis';
                    
                    const sysInstruction = \`You are a character in a 2D RPG game.
Your name/role is \${npcName}.
Your type is \${npc.type}.
\${npc.type === 'VILLAGER' ? \`Your profession is \${(npc as any).profession || 'Commoner'}.\` : ''}

Keep your responses short, under 3 sentences. 
You must respond in JSON format with the following structure:
{
  "response": "Your spoken dialogue and actions",
  "options": ["3 to 4 short player dialogue choices to continue the conversation"],
  "action": "Optional action. Valid values: '', 'open_trade_menu', 'turn_hostile', 'leave'"
}
Do not include markdown blocks, just the JSON object.\`;

                    const contents = history.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }));

                    const aiResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents,
                        config: {
                            systemInstruction: sysInstruction,
                            responseMimeType: 'application/json',
                            temperature: 0.7
                        }
                    });

                    let parsed = {
                        response: "*The NPC stares blankly.*",
                        options: ["Goodbye."],
                        action: ""
                    };
                    
                    if (aiResponse.text) {
                        try {
                            parsed = JSON.parse(aiResponse.text);
                        } catch (e) {
                            console.error("Failed to parse LLM JSON:", e, aiResponse.text);
                            parsed.response = aiResponse.text;
                            parsed.options = ["Goodbye."];
                        }
                    }

                    if (parsed.action === 'open_trade_menu' && onTrade) {
                        onTrade();
                        return;
                    } else if (parsed.action === 'turn_hostile' && onHostile) {
                        onHostile();
                        return;
                    } else if (parsed.action === 'leave' || parsed.options.length === 0) {
                        parsed.options = ["GOODBYE"];
                    }
                    
                    setMessages(prev => [...prev, { role: 'model', text: parsed.response }]);
                    setOptions(parsed.options.length ? parsed.options.map(o => o.toUpperCase() === 'GOODBYE' ? 'GOODBYE' : o) : ["GOODBYE"]);
                    setSelectedIndex(0);
                    setIsLoading(false);
                    return;
                } catch (apiError) {
                    console.error("API Error:", apiError);
                    setMessages(prev => [...prev, { role: 'model', text: "*The AI seems disconnected...* (Check your API key in Settings)" }]);
                    setOptions(["GOODBYE"]);
                    setIsLoading(false);
                    return;
                }
            }

            // Fallback simulated response
            await new Promise(resolve => setTimeout(resolve, 300));
            
            let parsed = {
                response: "Hello there, traveler. What do you need?",
                options: ["Let's trade.", "Who are you?", "Goodbye."],
                action: ""
            };

            if (lowerText.includes('trade') || lowerText.includes('buy') || lowerText.includes('sell') || lowerText.includes('shop')) {
                parsed.action = 'open_trade_menu';
            } else if (lowerText.includes('attack') || lowerText.includes('die') || lowerText.includes('kill')) {
                parsed.action = 'turn_hostile';
            } else if (lowerText.includes('bye') || lowerText.includes('leave') || lowerText.includes('goodbye')) {
                parsed.response = "Farewell, traveler.";
                parsed.options = ["GOODBYE"];
            }
            
            if (parsed.action === 'open_trade_menu' && onTrade) {
                onTrade();
                return;
            } else if (parsed.action === 'turn_hostile' && onHostile) {
                onHostile();
                return;
            }
            
            setMessages(prev => [...prev, { role: 'model', text: parsed.response }]);
            setOptions(parsed.options.length ? parsed.options : ["GOODBYE"]);
            setSelectedIndex(0);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "*The NPC mumbles.*" }]);
            setOptions(["GOODBYE"]);
        } finally {
            setIsLoading(false);
        }
    };

    return (`;

content = content.replace(generateRegex, newGenerate);


// 5. Replace ERROR and Rate Limit text in the render
content = content.replace(
    /The villagers are too tired to banter today\.\.\. \(AI connection exhausted\)/g,
    `Live AI Chat is disabled or missing an API Key. Please configure it in the Settings menu.`
);

content = content.replace(
    /options\.includes\('Chat'\)/g,
    `options.includes('CHAT')`
);
content = content.replace(
    /Chat unavailable \(Rate limit hit\)/g,
    `AI Chat Disabled (Check Settings)`
);

fs.writeFileSync(path, content);
console.log("Updated NPCChat.tsx safely!");
