const fs = require('fs');
let c = fs.readFileSync('src/components/ContentPlanner.tsx', 'utf-8');

// Look for the section starting at the last </div> chain
// Find position of the "    </div>\r\n  );\r\n}\r\n" sequence near the end
// We need to remove the extra "      </div>\r\n    </div>\r\n" added by mistake

// The correct ending should just be:
//   </div>\r\n
//   );\r\n
// }
const correctEnd = '    </div>\r\n  );\r\n}\r\n';
const wrongEnd = '    </div>\r\n      </div>\r\n    </div>\r\n  );\r\n}\r\n';

if (c.endsWith(wrongEnd)) {
  c = c.slice(0, c.length - wrongEnd.length) + correctEnd;
  fs.writeFileSync('src/components/ContentPlanner.tsx', c, 'utf-8');
  console.log('Trimmed extra divs from end');
} else {
  // Try another pattern - check what's at the actual end
  console.log('End of file:', JSON.stringify(c.slice(-200)));
}
