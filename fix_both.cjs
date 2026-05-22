const fs = require('fs');

// Fix both files with the same duplicate closing pattern
['src/components/WarmupPlanner.tsx', 'src/components/ContentPlanner.tsx'].forEach(fp => {
  let c = fs.readFileSync(fp, 'utf-8');
  
  // Pattern: "}\r    </div>\n  );\n}" => "}\n    </div>\n      </div>\n    </div>\n  );\n}"
  const badPattern = /\}\r\s*<\/div>\n\s*\);\n\}/;
  if (badPattern.test(c)) {
    c = c.replace(badPattern, "}\n    </div>\n      </div>\n    </div>\n  );\n}");
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`Fixed: ${fp}`);
  } else {
    // Look for the pattern at end of file
    const lines = c.split('\n');
    const lastLines = lines.slice(-5).join('\n');
    console.log(`${fp} last 5 lines:`, JSON.stringify(lastLines));
    
    // More aggressive: just find the index of the duplicate
    const firstClose = c.lastIndexOf('  );\n}');
    if (firstClose !== -1) {
      const prevClose = c.lastIndexOf('  );\n}', firstClose - 1);
      if (prevClose !== -1 && firstClose - prevClose < 20) {
        // Two closes too close together - remove the first one and keep only the wrapper
        c = c.slice(0, prevClose) + "    </div>\n      </div>\n    </div>\n  );\n}";
        fs.writeFileSync(fp, c, 'utf-8');
        console.log(`Fixed by removing dup: ${fp}`);
      }
    }
  }
});
