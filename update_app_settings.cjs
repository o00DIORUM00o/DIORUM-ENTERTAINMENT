const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add state for AI
if (!content.includes('const [aiEnabled, setAiEnabled]')) {
    content = content.replace(
        /const \[customTexturePack, setCustomTexturePack\] = useState\(''\);/,
        `const [customTexturePack, setCustomTexturePack] = useState('');
    const [aiEnabled, setAiEnabled] = useState(localStorage.getItem('ai_enabled') === 'true');
    const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('ai_api_key') || '');`
    );
}

// Add the UI
const settingsBlock = `<div className="mt-8 text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">AI Settings</div>
                                        <div className="text-gray-400 text-xs md:text-sm mb-2">Enable live AI NPC chat using your own Gemini API key. API keys are stored only in your browser's local storage.</div>
                                        <div className="flex flex-col gap-4 bg-[#0f0805] p-4 border border-[#4a2e1b]">
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="ai_toggle" 
                                                    checked={aiEnabled}
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        setAiEnabled(val);
                                                        localStorage.setItem('ai_enabled', val ? 'true' : 'false');
                                                    }}
                                                    className="w-4 h-4 accent-orange-500"
                                                />
                                                <label htmlFor="ai_toggle" className="text-orange-200 font-bold cursor-pointer">Enable AI Chat</label>
                                            </div>
                                            
                                            {aiEnabled && (
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[#d4b499] text-xs font-bold uppercase tracking-wider">Gemini API Key</label>
                                                    <input 
                                                        type="password"
                                                        value={aiApiKey}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setAiApiKey(val);
                                                            localStorage.setItem('ai_api_key', val);
                                                        }}
                                                        placeholder="AIzaSy..."
                                                        className="w-full bg-[#1a0f0a] border border-[#5c3a21] p-2 text-gray-300 font-mono text-xs focus:outline-none focus:border-[#fb923c]"
                                                    />
                                                    <div className="text-gray-500 text-[10px] mt-1">Get an API key from Google AI Studio. Note that using LLMs consumes tokens.</div>
                                                </div>
                                            )}
                                        </div>`;

content = content.replace(
    /<div className="mt-8 text-orange-400 text-lg font-bold border-b border-\[#5c3a21\] pb-2">Community Pack<\/div>/,
    settingsBlock + '\n\n                                        <div className="mt-8 text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Community Pack</div>'
);

fs.writeFileSync(path, content);
console.log("Updated App.tsx with AI settings");
