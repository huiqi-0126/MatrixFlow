const fs = require('fs');
let content = fs.readFileSync('src/components/PersonaManager.tsx', 'utf-8');

// Use regex to find and replace the lock button text
content = content.replace(/<Lock className="w-4 h-4" \/>.*?<\/button>/s, '<Lock className="w-4 h-4" /> 锁定操控\\n            </button>');

fs.writeFileSync('src/components/PersonaManager.tsx', content, 'utf-8');
console.log('Fixed Node!');
