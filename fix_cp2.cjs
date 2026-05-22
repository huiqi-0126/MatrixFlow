const fs = require('fs');
let c = fs.readFileSync('src/components/ContentPlanner.tsx', 'utf-8');

// The issue: the file has two closing sequences. 
// Lines 586-588 = "    </div>\n  );\n}" (original)
// Lines 589-591 = "    </div>\n  );\n}" (the extra wrapper we added, but duplicated)
// We need: the grid div close + wrapper divs close + single );\n}

// Remove the duplicate ending - lines 586 onward should be the single proper ending
c = c.replace(
  "    </div>\r\n  );\r\n}\n    </div>\n  );\n}",
  "    </div>\n      </div>\n    </div>\n  );\n}"
);
c = c.replace(
  "    </div>\r\n  );\r\n}\r\n    </div>\r\n  );\r\n}",
  "    </div>\n      </div>\n    </div>\n  );\n}"
);

// Also try the mixed case
const idx = c.indexOf("    </div>\r\n  );\r\n}");
if (idx !== -1) {
  // Find if there's another one after it
  const idx2 = c.indexOf("</div>", idx + 10);
  if (idx2 !== -1 && idx2 < idx + 30) {
    // There is a second closing after the first
    c = c.slice(0, idx) + "    </div>\n      </div>\n    </div>\n  );\n}";
  }
}

fs.writeFileSync('src/components/ContentPlanner.tsx', c, 'utf-8');
console.log("Fixed end:", c.slice(-100));
