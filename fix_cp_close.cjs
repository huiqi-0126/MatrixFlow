const fs = require('fs');

let c = fs.readFileSync('src/components/ContentPlanner.tsx', 'utf-8');

// Remove the broken mixed line
c = c.replace("}\r    </div>\n  );\n}", "}\n    </div>\n  );\n}");

fs.writeFileSync('src/components/ContentPlanner.tsx', c, 'utf-8');
console.log('Fixed ContentPlanner closing!');
