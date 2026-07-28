const fs = require('fs');
require('child_process').execSync('node restore_script.cjs');
let content = fs.readFileSync('src/components/NPCChat.tsx', 'utf8');
content = content.replace("import React", "import { GoogleGenAI } from '@google/genai';\nimport React");
const handleSelectRegex = /    const handleSelectOption = \(option: string\) => \{[\s\S]*?        if \(mode === 'ERROR' || option === 'Goodbye' || option === 'GOODBYE' || option\.includes\('\(Leave\)'\)\) \{/;
const match = handleSelectRegex.exec(content);
console.log("MATCH INDEX:", match.index);
console.log("MATCH LENGTH:", match[0].length);
console.log("FIRST 50 CHARS OF MATCH:", match[0].substring(0, 50));
