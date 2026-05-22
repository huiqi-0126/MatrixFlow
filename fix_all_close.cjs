const fs = require('fs');

// Fix all three files with the same pattern issue
// Pattern: "}\r      </div>" 
// (a CRLF "}" line immediately followed by LF "      </div>")
// This is caused by: the old `}\n  );\n}` pattern + the new `</div>\n  );\n}` 
// getting merged as "}\r" on the same line

['src/components/WarmupPlanner.tsx', 'src/components/ContentPlanner.tsx', 'src/components/PublisherScheduler.tsx'].forEach(fp => {
  let raw = fs.readFileSync(fp);
  // Convert to string preserving bytes
  let c = raw.toString('utf-8');
  
  // The broken pattern is: "}\r" followed directly by newline+spaces+</div>
  // This means the script's regex "\r" captured carriage return as part of "}"
  // Fix: replace "}\r\n(spaces)</div>" with just "(spaces)</div>" (remove the extra };\n})
  
  // Find the pattern: "  }\r\n    </div>" or "  }\r      </div>" etc.
  // These are the erroneous "}\r<linebreak>" that shouldn't be there
  const badPattern = /\}\r(\s*<\/div>)/g;
  const count = (c.match(badPattern) || []).length;
  
  if (count > 0) {
    c = c.replace(badPattern, (match, closeDiv) => closeDiv);
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`Fixed ${count} occurrences in: ${fp}`);
    console.log('End:', JSON.stringify(c.slice(-100)));
  } else {
    console.log(`No bad pattern in: ${fp}`);
    console.log('End:', JSON.stringify(c.slice(-100)));
  }
});
