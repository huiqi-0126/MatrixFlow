import re

with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the <div className=\"flex-[4] flex flex-col gap-4 min-h-0 overflow-y-auto scrollbar-narrow pr-1\"> block
# with a new block that contains 4 simple line charts in a 2x2 grid.

old_charts_block_match = re.search(r'(<div className="flex-\[4\].*?\{/\* Bottom 1/5: AI Audit \*/\})', content, re.DOTALL)
if not old_charts_block_match:
    print('Failed to match charts block')
    exit(1)
    
old_charts_block = old_charts_block_match.group(1)

new_charts_block = '''<div className="flex-[4] grid grid-cols-2 gap-4 min-h-0 overflow-y-auto scrollbar-narrow pr-1 pb-2">
          
          {/* Chart 1: Views */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">播放量趋势 (Views)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q30,16 60,10 T100,2" : "M0,18 Q40,15 70,5 T100,5"} fill="none" stroke="#3b82f6" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>10k</span><span>5k</span><span>0</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Likes */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">点赞数趋势 (Likes)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q50,17 80,12 T100,2" : "M0,18 Q30,15 60,10 T100,5"} fill="none" stroke="#10b981" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>800</span><span>400</span><span>0</span>
              </div>
            </div>
          </div>

          {/* Chart 3: Followers */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">粉丝增长 (Followers)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,15 L30,15 L30,14 L60,14 L60,13 L90,13 L90,12 L100,12" : "M0,16 L20,16 L20,13 L50,13 L50,10 L80,10 L80,8 L100,8"} fill="none" stroke="#f59e0b" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>50</span><span>25</span><span>0</span>
              </div>
            </div>
          </div>
          
          {/* Chart 4: Comments/Engagement */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">评论互动趋势 (Comments)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,19 L20,15 L40,15 L60,12 L80,8 L100,5" : "M0,18 L25,18 L50,14 L75,12 L100,8"} fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>120</span><span>60</span><span>0</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom 1/5: AI Audit */}'''

content = content.replace(old_charts_block, new_charts_block)

with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Charts updated to 2x2 simple lines')
