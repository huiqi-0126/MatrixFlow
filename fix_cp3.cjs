const fs = require('fs');
let c = fs.readFileSync('src/components/ContentPlanner.tsx', 'utf-8');

// Find the line that has "    </div>" with LF (unix) and "      </div>" lines after position 580
// The file has mixed CRLF and LF endings. Let's just take everything up to line 584 (")}" with CRLF)
// and replace the tail

// Find the last ")}" in the original CRLF section
const lastCRLFClose = c.lastIndexOf('      )}\r\n');
if (lastCRLFClose !== -1) {
  // Everything after this should be the proper closing
  c = c.slice(0, lastCRLFClose + '      )}\r\n'.length) + '\r\n    </div>\r\n      </div>\r\n    </div>\r\n  );\r\n}\r\n';
  fs.writeFileSync('src/components/ContentPlanner.tsx', c, 'utf-8');
  console.log('Fixed by slicing after last CRLF close!');
  console.log('End:', JSON.stringify(c.slice(-60)));
} else {
  console.log('Pattern not found');
}
