const fs = require('fs');
let content = fs.readFileSync('src/components/PersonaManager.tsx', 'utf-8');

// Just split by `<Lock className="w-4 h-4" />`
let parts = content.split('<Lock className="w-4 h-4" />');
if (parts.length > 1) {
    // split the second part by `</button>`
    let subParts = parts[1].split('</button>');
    if (subParts.length > 1) {
        // recombine
        subParts[0] = ' 锁定操控\n            ';
        parts[1] = subParts.join('</button>');
        content = parts.join('<Lock className="w-4 h-4" />');
        fs.writeFileSync('src/components/PersonaManager.tsx', content, 'utf-8');
        console.log('Successfully fixed using split!');
    }
} else {
    console.log('Could not find Lock icon');
}
