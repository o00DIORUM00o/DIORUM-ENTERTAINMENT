import React, { useState, useEffect, useRef } from 'react';
import { NPC } from '../game/Engine';
import { GoogleGenAI } from '@google/genai';
import { ITEMS } from '../game/Inventory';
import { QuestSystem } from '../game/systems/QuestSystem';

interface NPCChatProps {
    npc: NPC;
    engine: any;
    onClose: () => void;
    playerInventory: any[];
    onTrade?: () => void;
    onGiveItem?: (itemId: string) => void;
    onHostile?: () => void;
    locationName?: string;
}

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const getVillagerBark = (npc: NPC): string => {
    if (npc.type === 'VILLAGER') {
        const prof = (npc as any).profession;
        if (prof === 'VILLAGER_GUARD') {
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
        } else {
            const barks = ["Good morrow.", "Fine weather we're having.", "Just minding my business.", "Hello there."];
            return barks[Math.floor(Math.random() * barks.length)];
        }
    } else if (npc.type === 'DRACONIC_MERCHANT') {
        const barks = ["Gold warms the scales.", "What brings a soft-skin to my hoard?", "I trade in power and riches.", "Rune Keys, potions... for the right price."];
        return barks[Math.floor(Math.random() * barks.length)];
    } else if (npc.type === 'BEAST_TAMER') {
        const barks = ["The wilds listen to me.", "Care for a rugged companion?", "Only the strong survive Thaer.", "A mount can save your life out here."];
        return barks[Math.floor(Math.random() * barks.length)];
    } else if (npc.type === 'SQUIRREL_FOLK') {
        const barks = ["Quick, jump!", "Got any nuts?", "We built this treehouse high up to avoid the giant boars.", "*Chitters happily*"];
        return barks[Math.floor(Math.random() * barks.length)];
    } else if (npc.type === 'SLUG_FOLK_MERCHANT') {
        const barks = ["*Slurp* ... Need wares?", "The void sands provide...", "Carry much, walk slow...", "Trade for slime?"];
        return barks[Math.floor(Math.random() * barks.length)];
    } else if (npc.type === 'WANDERING_BARD') {
        const barks = ["A tune for a weary soul?", "The road is long, but the melody is sweet.", "I sing of dragons and ancient kings.", "Pull up a stool and listen awhile."];
        return barks[Math.floor(Math.random() * barks.length)];
    } else {
        const barks = ["Greetings, traveler.", "Ah, a visitor.", "Step closer, do not be afraid.", "I have been expecting you."];
        return barks[Math.floor(Math.random() * barks.length)];
    }
};

export const NPCChat: React.FC<NPCChatProps> = ({ npc, engine, onClose, playerInventory, onTrade, onGiveItem, onHostile, locationName }) => {
    const [mode, setMode] = useState<'MENU' | 'LLM' | 'ERROR' | 'PICK_POCKET'>('MENU');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [pickPocketResult, setPickPocketResult] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial deterministic greeting
    useEffect(() => {
        if (npc.type === 'QUEST_GIVER') {
            setGreeting("I fear this dungeon contains a dark artifact... Take this Dungeon Key, seek the Boss Room at the bottom, and put an end to it!");
        } else {
            setGreeting(getVillagerBark(npc));
        }
        
        // Setup initial generic menu options
        const initialOptions = [];
        if (onTrade && npc.type === 'VILLAGER' && (npc as any).merchantType) {
            initialOptions.push("Trade");
        } else if (onTrade && npc.type === 'OLD_WIZARD') {
            initialOptions.push("Trade");
        } else if (onTrade && npc.type === 'DRACONIC_MERCHANT') {
            initialOptions.push("Trade");
        } else if (onTrade && npc.type === 'SLUG_FOLK_MERCHANT') {
            initialOptions.push("Trade");
        } else if (onTrade && (npc.type.startsWith('STALL_') || npc.type === 'BAG_MERCHANT' || npc.type === 'BERRY_FARMER' || npc.type === 'VILLAGER_MERCHANT')) {
            initialOptions.push("Trade");
        } else if (npc.type === 'BEAST_TAMER') {
            initialOptions.push("Adopt Companion (10 silver)");
        } else if (npc.type === 'WANDERING_BARD') {
            initialOptions.push("Listen to a song");
        }
        
        if (npc.type === 'QUEST_GIVER' && !(npc as any).hasGivenKey) {
            initialOptions.push("Accept Key");
        }
        
        const activeQuests = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
        for (const q of activeQuests) {
            if (q.state === 'COMPLETED') {
                initialOptions.push(`Turn in: ${q.title}`);
            } else {
                initialOptions.push(`(Quest Active) ${q.title}`);
            }
        }
        
        const availableQuests = QuestSystem.getAvailableQuests(engine.player, npc.type);
        for (const q of availableQuests) {
            initialOptions.push(`Accept: ${q.title}`);
        }
        
        initialOptions.push("Chat");
        
        const ppLevel = engine?.player?.talents['pick_pocket'] || 0;
        if (ppLevel > 0 && npc.disposition > -50 && !(npc as any).hasBeenPickpocketed) {
             initialOptions.push("Pick Pocket");
        }
        
        initialOptions.push("Leave");
        setOptions(initialOptions);
        setSelectedIndex(0);
    }, [npc, engine]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, options]);

    // Gamepad support
    useEffect(() => {
        let animationFrameId: number;
        let prevUp = false;
        let prevDown = false;
        let prevA = false;
        let prevB = false;

        const pollGamepad = () => {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0];
            if (gp) {
                const upPressed = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
                const downPressed = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
                const aPressed = gp.buttons[0]?.pressed;
                const bPressed = gp.buttons[1]?.pressed;

                if (upPressed && !prevUp) {
                    setSelectedIndex(prev => Math.max(0, prev - 1));
                }
                if (downPressed && !prevDown) {
                    setSelectedIndex(prev => Math.min(options.length - 1, prev + 1));
                }
                if (aPressed && !prevA && !isLoading && options.length > 0) {
                    handleSelectOption(options[selectedIndex]);
                }
                if (bPressed && !prevB) {
                    onClose();
                }

                prevUp = upPressed;
                prevDown = downPressed;
                prevA = aPressed;
                prevB = bPressed;
            }
            animationFrameId = requestAnimationFrame(pollGamepad);
        };

        animationFrameId = requestAnimationFrame(pollGamepad);
        return () => cancelAnimationFrame(animationFrameId);
    }, [options, selectedIndex, isLoading, mode]);

    const handleSelectOption = (option: string) => {
        if (mode === 'MENU') {
            if (option === 'Trade') {
                if (onTrade) onTrade();
            } else if (option === 'Adopt Companion (10 silver)') {
                if (engine.player.removeItem('silver_piece', 10)) {
                    const companionNameBase = ['Fang', 'Scout', 'Rex', 'Shadow', 'Ghost', 'Brutus', 'Ash'][Math.floor(Math.random()*7)];
                    const newCompanion = { 
                        id: `comp_${Date.now()}`,
                        type: 'WOLF', 
                        name: `Dire Wolf ${companionNameBase}`,
                        damage: 15,
                        health: 300,
                        maxHealth: 300,
                        speed: 15.0
                    };
                    if (!engine.player.companions) engine.player.companions = [];
                    engine.player.companions.push(newCompanion);
                    setGreeting(`Treat ${newCompanion.name} well. They'll fight to the death for you.`);
                    // Update main options (strip Adopt option)
                    const newOptions = options.filter(o => o !== 'Adopt Companion (10 silver)');
                    setOptions(newOptions.length > 0 ? newOptions : ['Leave']);
                    setSelectedIndex(0);
                } else {
                    setGreeting("You don't have 10 silver pieces, traveler.");
                    setOptions(["Leave"]);
                    setSelectedIndex(0);
                }
            } else if (option === 'Listen to a song') {
                engine.player.health = engine.player.effectiveMaxHealth;
                engine.player.stamina = engine.player.maxStamina;
                engine.player.mana = engine.player.effectiveMaxMana;
                setGreeting("Ah, a weary traveler! Let this melody restore your spirit.");
                engine.particles.push({
                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                    text: '♫ FULLY RESTORED ♫', color: '#ff69b4', life: 2.5, maxLife: 2.5, speed: 0, vy: 0.5, vx: 0, vz: 0
                });
                
                // Play a little arpeggio
                const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
                if (AudioCtx) {
                    const ctx = new AudioCtx();
                    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
                        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
                        life: 1.5 + Math.random(), maxLife: 2.5, speed: 0, vy: 1 + Math.random(), vx: (Math.random() - 0.5) * 2, vz: (Math.random() - 0.5) * 2, size: 2 + Math.random() * 2
                    });
                }
                const newOptions = options.filter(o => o !== 'Listen to a song');
                setOptions(newOptions.length > 0 ? newOptions : ['Leave']);
                setSelectedIndex(0);
            } else if (option === 'Accept Key') {
                engine.player.inventory.push({ ...ITEMS['dungeon_key'], quantity: 1 });
                (npc as any).hasGivenKey = true;
                setGreeting("Good luck... You'll need it.");
                setOptions(["Leave"]);
                setSelectedIndex(0);
            } else if (option.startsWith('Accept: ')) {
                const questTitle = option.replace('Accept: ', '');
                const available = QuestSystem.getAvailableQuests(engine.player, npc.type);
                const quest = available.find(q => q.title === questTitle);
                if (quest) {
                    QuestSystem.acceptQuest(engine, quest.id);
                    setGreeting(`Excellent! ${quest.description}`);
                    setOptions(["Leave"]);
                    setSelectedIndex(0);
                }
            } else if (option.startsWith('Turn in: ')) {
                const questTitle = option.replace('Turn in: ', '');
                const active = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
                const quest = active.find(q => q.title === questTitle);
                if (quest) {
                    QuestSystem.turnInQuest(engine, quest.id);
                    setGreeting(`Thank you so much! I've given you a reward.`);
                    setOptions(["Leave"]);
                    setSelectedIndex(0);
                }
            } else if (option.startsWith('(Quest Active)')) {
                const questTitle = option.replace('(Quest Active) ', '');
                const active = QuestSystem.getActiveQuestsForGiver(engine.player, npc.type);
                const quest = active.find(q => q.title === questTitle);
                if (quest) {
                    setGreeting(`${quest.description} (You have ${quest.currentCount}/${quest.requiredCount})`);
                    setOptions(["Leave"]);
                    setSelectedIndex(0);
                }
            } else if (option === 'Leave') {
                onClose();
            } else if (option === 'Chat') {
                // If API is already exhausted in this session, fallback immediately
                if ((window as any).__AI_EXHAUSTED__) {
                    setMode('ERROR');
                } else {
                    setMode('LLM');
                    generateResponse([{ role: 'user', text: '*Approaches the NPC*' }]);
                }
            } else if (option === 'Pick Pocket') {
                setMode('PICK_POCKET');
                handlePickPocket();
            }
            return;
        }

        if (mode === 'ERROR' || option === 'Goodbye' || option.includes('(Leave)')) {
            onClose();
            return;
        }
        
        if (mode === 'PICK_POCKET') {
           onClose();
           return;
        }

        setMessages(prev => [...prev, { role: 'user', text: option }]);
        generateResponse([
            ...messages,
            { role: 'user', text: option }
        ]);
    };

    const handlePickPocket = () => {
        setIsLoading(true);
        const ppLevel = engine.player.talents['pick_pocket'] || 0;
        let chance = 0;
        if (ppLevel === 1) chance = 0.50;
        else if (ppLevel === 2) chance = 0.75;
        else if (ppLevel >= 3) chance = 0.95;
        
        setTimeout(() => {
            setIsLoading(false);
            if (Math.random() < chance) {
                // Success
                (npc as any).hasBeenPickpocketed = true;
                const goldAmount = Math.floor(Math.random() * 20) + 5;
                setPickPocketResult(`Success! You stole ${goldAmount} gold.`);
                engine.player.inventory.push({ ...ITEMS['gold_piece'], quantity: goldAmount });
                setOptions(["Leave"]);
            } else {
                // Failure
                setPickPocketResult(`Failed! You were caught.`);
                setOptions(["Uh oh... (Leave)"]);
                if (onHostile) {
                    onHostile();
                }
            }
        }, 1000);
    };

    const generateResponse = async (history: ChatMessage[]) => {
        setIsLoading(true);
        setOptions([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            let systemInstruction = `You are an Old Wizard NPC in a top-down 2D RPG game. 
Your name is Arcanis. You live in a tower. You are wise, slightly eccentric, and speak in a mystical, slightly archaic manner.
You are currently located near: ${locationName || 'Unknown Region'}. Use this location occasionally for flavor, but don't force it.
You can teach the player about magic, the world, and offer trades.
Keep your responses relatively concise (1-3 sentences).
You MUST respond with a JSON object containing these fields:
1. "response": Your spoken response to the player.
2. "options": An array of 2 to 4 possible strings the player can say back to you. Keep these short (under 10 words). Include options like "Goodbye" or "Show me your wares" if appropriate.
3. "action": (Optional) If the player asks to trade, set this to "open_trade_menu". If the player insults you, threatens you, or tries to rob you, set this to "turn_hostile". If the player answers a riddle correctly or you feel generous, set this to "give_item". Otherwise, omit this field.
4. "itemId": (Optional) If "action" is "give_item", set this to the ID of the item to give (e.g., "health_potion", "mana_potion", "book_fire_bolt", "gold_piece").

Example Output:
{
  "response": "Ah, a traveler! What brings you to my humble tower?",
  "options": ["I seek knowledge.", "Do you have anything to trade?", "Just passing through. (Leave)"]
}`;

            if (npc.type === 'NPC_KING') {
                systemInstruction = `You are the King of Pantheona in a top-down 2D RPG game. 
Your name is King Alaric. You rule from the capital city. You are noble, commanding, and deeply concerned about the safety of your people.
You are currently located in: ${locationName || 'Pantheona Castle'}.
You speak with authority but fairness.
Keep your responses relatively concise (1-3 sentences).
You MUST respond with a JSON object containing these fields:
1. "response": Your spoken response to the player.
2. "options": An array of 2 to 4 possible strings the player can say back to you. Keep these short (under 10 words). Include options like "Goodbye".
3. "action": (Optional) If the player insults you or threatens you, set this to "turn_hostile". Otherwise, omit this field.

Example Output:
{
  "response": "Welcome to my court, traveler. The realm faces dark times.",
  "options": ["What plagues the realm, Your Majesty?", "I must be going. (Leave)"]
}`;
            } else if (npc.type === 'VILLAGER') {
                systemInstruction = `You are a Villager in a top-down 2D RPG game. 
Your profession is ${(npc as any).profession ? (npc as any).profession.replace('VILLAGER_', '') : 'Peasant'}. You live in a small settlement. You are friendly, practical, and talk like a medieval commoner.
You are currently located near: ${locationName || 'Unknown Region'}. Use this location occasionally for flavor, but don't force it.
You can chat, talk about the weather, or offer to trade your goods.
Keep your responses relatively concise (1-3 sentences).
You MUST respond with a JSON object containing these fields:
1. "response": Your spoken response to the player.
2. "options": An array of 2 to 4 possible strings the player can say back to you. Keep these short (under 10 words). Include options like "Goodbye" or "Show me your wares" if appropriate.
3. "action": (Optional) If the player asks to trade, set this to "open_trade_menu". If the player insults you or attacks, set this to "turn_hostile". Otherwise, omit this field.

Example Output:
{
  "response": "Hello there, traveler! Fine day for the crops, ain't it?",
  "options": ["What do you do here?", "Let's trade.", "Goodbye."]
}`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: history.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                })),
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                }
            });

            if (response.text) {
                try {
                    const parsed = JSON.parse(response.text);
                    
                    if (parsed.action === 'open_trade_menu' && onTrade) {
                        onTrade();
                        return;
                    } else if (parsed.action === 'turn_hostile' && onHostile) {
                        onHostile();
                        return;
                    } else if (parsed.action === 'give_item' && onGiveItem && parsed.itemId) {
                        onGiveItem(parsed.itemId);
                        setMessages(prev => [...prev, { role: 'model', text: `*The NPC hands you an item: ${parsed.itemId}*` }]);
                        setOptions(["Thank you.", "Goodbye"]);
                        setIsLoading(false);
                        return;
                    }

                    setMessages(prev => [...prev, { role: 'model', text: parsed.response }]);
                    setOptions(parsed.options || ["Goodbye"]);
                    setSelectedIndex(0);
                } catch (e) {
                    console.error("Failed to parse JSON from Gemini:", e);
                    setMessages(prev => [...prev, { role: 'model', text: response.text || "..." }]);
                    setOptions(["Goodbye"]);
                }
            }
        } catch (error: any) {
            console.error("Error communicating with Gemini:", error);
            if (error.status === 429) {
                (window as any).__AI_EXHAUSTED__ = true;
                setMode('ERROR');
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "*The NPC seems distracted and mumbles something incomprehensible.* (Error connecting to AI)" }]);
                setOptions(["Goodbye"]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm pointer-events-auto select-none font-serif">
            <div className="w-[450px] max-h-[85vh] flex flex-col bg-[#1a0f0a] border-2 border-[#5c3a21] rounded-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-b from-[#3e2718] to-[#1a0f0a] border-b-2 border-[#5c3a21] p-2 flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 bg-[#0f0805] border border-[#5c3a21] flex items-center justify-center text-lg rounded-sm shrink-0">
                        {npc.type === 'NPC_KING' ? '👑' :
                         npc.type === 'VILLAGER' ? (
                            (npc as any).profession === 'VILLAGER_GUARD' ? '🛡️' :
                            (npc as any).profession === 'VILLAGER_FARMER' ? '🌾' :
                            '💰'
                        ) : '🧙'}
                    </div>
                    <div className="flex-1 leading-tight">
                        <h2 className="text-lg font-bold text-orange-400">
                            {npc.type === 'NPC_KING' ? 'The King' : npc.type === 'VILLAGER' ? 'Villager' : 'Arcanis'}
                        </h2>
                        <div className="text-[#d4b499] text-[10px] uppercase tracking-wider">
                            {npc.type === 'NPC_KING' ? 'Ruler of Pantheona' : npc.type === 'VILLAGER' ? ((npc as any).profession || 'Commoner').replace('VILLAGER_', '') : 'Old Wizard'}
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#d4b499] hover:text-orange-400 text-lg px-2 rounded hover:bg-[#2a1f1a] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0f0805]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a2e1b #0f0805' }}>
                    {mode === 'MENU' ? (
                        <div className="text-orange-200 text-sm leading-relaxed p-2 bg-[#2a1b14] border-l-2 border-orange-500 rounded-sm">
                            "{greeting}"
                        </div>
                    ) : mode === 'ERROR' ? (
                        <div className="text-red-400 text-sm italic text-center p-4 border border-red-900 bg-[#2a1b14] rounded-sm">
                            The villagers are too tired to banter today... (AI connection exhausted)
                        </div>
                    ) : mode === 'PICK_POCKET' ? (
                        <div className="text-orange-300 text-sm bg-[#2a1b14] p-3 rounded-sm border border-orange-600 text-center animate-pulse">
                            {pickPocketResult || 'Attempting to pickpocket...'}
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-[#d4b499] mb-0.5 opacity-70 px-1">
                                    {msg.role === 'user' ? 'You' : (npc.type === 'NPC_KING' ? 'The King' : npc.type === 'VILLAGER' ? 'Villager' : 'Arcanis')}
                                </span>
                                <div className={`max-w-[90%] px-3 py-1.5 text-sm rounded-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-[#3e2718] text-orange-100 border border-[#5c3a21]' 
                                        : 'bg-[#2a1b14] text-orange-200 border border-[#4a2e1b]'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-[#d4b499] mb-0.5 opacity-70 px-1">
                                {npc.type === 'VILLAGER' ? 'Villager' : 'Arcanis'}
                            </span>
                            <div className="bg-[#2a1b14] p-2 rounded-sm border border-[#4a2e1b] flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-orange-500/50 rounded-full animate-pulse"></div>
                                <div className="w-1.5 h-1.5 bg-orange-500/70 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Options */}
                <div className="bg-[#1a0f0a] border-t-2 border-[#5c3a21] p-2 flex flex-col gap-1 shrink-0 overflow-y-auto max-h-[35vh]">
                    {mode === 'ERROR' && (
                        <button 
                            className="w-full text-left px-3 py-2 text-sm bg-[#2a1b14] border border-orange-700 text-orange-200 rounded-sm hover:bg-[#3e2718] transition-colors"
                            onClick={() => onClose()}
                        >
                            [Leave]
                        </button>
                    )}
                    {!isLoading && options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelectOption(opt)}
                            onMouseEnter={() => setSelectedIndex(i)}
                            className={`w-full text-left px-3 py-1.5 border rounded-sm transition-all text-sm flex items-center gap-2 ${
                                i === selectedIndex 
                                    ? 'bg-[#3e2718] border-orange-500 text-orange-100 shadow-[inset_0_0_8px_rgba(234,88,12,0.2)]' 
                                    : 'bg-[#0f0805] border-[#4a2e1b] text-[#d4b499] hover:border-[#5c3a21]'
                            }`}
                        >
                            <span className={`text-[10px] uppercase font-bold shrink-0 ${i === selectedIndex ? 'text-orange-500' : 'text-transparent'}`}>
                                ❯
                            </span>
                            <span className="leading-tight">{opt}</span>
                        </button>
                    ))}
                    {!isLoading && mode === 'MENU' && (window as any).__AI_EXHAUSTED__ && options.includes('Chat') && (
                        <div className="text-[10px] text-red-500/80 text-center mt-1 italic tracking-wide">
                            Chat unavailable (Rate limit hit)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
