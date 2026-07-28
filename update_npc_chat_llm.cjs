const fs = require('fs');
const path = 'src/components/NPCChat.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('@google/genai')) {
    content = `import { GoogleGenAI } from '@google/genai';\n` + content;
}

const llmFunctionRegex = /    const generateResponse = async \(history: ChatMessage\[\]\) => \{[\s\S]*?    \};\n/;

const newLLMFunction = `    const generateResponse = async (history: ChatMessage[]) => {
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
    };\n`;

content = content.replace(llmFunctionRegex, newLLMFunction);
fs.writeFileSync(path, content);
console.log("Updated generateResponse with LLM implementation");
