import re

with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For Chart 1
c1_old = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>10k</span><span>5k</span><span>0</span>
              </div>
            </div>
          </div>"""

c1_new = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>10k</span><span>5k</span><span>0</span>
              </div>
              <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                <span>05/{15 + selectedVideoIndex * 2}</span>
                <span>05/{16 + selectedVideoIndex * 2}</span>
                <span>05/{17 + selectedVideoIndex * 2}</span>
                <span>05/{18 + selectedVideoIndex * 2}</span>
              </div>
            </div>
          </div>"""
content = content.replace(c1_old, c1_new)

# For Chart 2
c2_old = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>800</span><span>400</span><span>0</span>
              </div>
            </div>
          </div>"""

c2_new = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>800</span><span>400</span><span>0</span>
              </div>
              <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                <span>05/{15 + selectedVideoIndex * 2}</span>
                <span>05/{16 + selectedVideoIndex * 2}</span>
                <span>05/{17 + selectedVideoIndex * 2}</span>
                <span>05/{18 + selectedVideoIndex * 2}</span>
              </div>
            </div>
          </div>"""
content = content.replace(c2_old, c2_new)

# For Chart 3
c3_old = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>50</span><span>25</span><span>0</span>
              </div>
            </div>
          </div>"""

c3_new = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>50</span><span>25</span><span>0</span>
              </div>
              <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                <span>05/{15 + selectedVideoIndex * 2}</span>
                <span>05/{16 + selectedVideoIndex * 2}</span>
                <span>05/{17 + selectedVideoIndex * 2}</span>
                <span>05/{18 + selectedVideoIndex * 2}</span>
              </div>
            </div>
          </div>"""
content = content.replace(c3_old, c3_new)

# For Chart 4
c4_old = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>120</span><span>60</span><span>0</span>
              </div>
            </div>
          </div>"""

c4_new = """              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>120</span><span>60</span><span>0</span>
              </div>
              <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                <span>05/{15 + selectedVideoIndex * 2}</span>
                <span>05/{16 + selectedVideoIndex * 2}</span>
                <span>05/{17 + selectedVideoIndex * 2}</span>
                <span>05/{18 + selectedVideoIndex * 2}</span>
              </div>
            </div>
          </div>"""
content = content.replace(c4_old, c4_new)

# Modify container padding
# find `<div className="bg-slate-900/40 p-4 rounded-xl` and change to `p-4 pb-6`
content = content.replace('bg-slate-900/40 p-4 rounded-xl', 'bg-slate-900/40 p-4 pb-7 rounded-xl')

with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
