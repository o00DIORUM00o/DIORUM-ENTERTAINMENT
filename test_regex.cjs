const fs = require('fs');
require('child_process').execSync('node restore_script.cjs');
let content = fs.readFileSync('src/components/NPCChat.tsx', 'utf8');

console.log("INITIAL:", content.substring(0, 20));

if (!content.includes('@google/genai')) {
    content = content.replace(
        "import React",
        "import { GoogleGenAI } from '@google/genai';\nimport React"
    );
}

console.log("AFTER IMPORT:", content.substring(0, 20));

const useEffectRegex = /useEffect\(\(\) => \{\n        if \(npc\.type === 'QUEST_GIVER'\) \{[\s\S]*?setSelectedIndex\(0\);\n    \}, \[npc, engine\]\);/;
content = content.replace(useEffectRegex, "test");

console.log("AFTER USE_EFFECT:", content.substring(0, 20));

const handleSelectRegex = /    const handleSelectOption = \(option: string\) => \{[\s\S]*?        if \(mode === 'ERROR' || option === 'Goodbye' || option === 'GOODBYE' || option\.includes\('\(Leave\)'\)\) \{/;
content = content.replace(handleSelectRegex, "test2");

console.log("AFTER HANDLE_SELECT:", content.substring(0, 20));

