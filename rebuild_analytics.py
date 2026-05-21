import re

with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Left panel (Published videos list)
# Currently it is the second main div under the flex-col layout.
# Searching for: `<div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">`
# Wait, there are two such divs. The first one is the Right Panel (currently on top), the second is the Published videos list.
divs = re.findall(r'<div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">(.*?)</div>\n\n\n    </div>', content, re.DOTALL)
if not divs:
    # try another way
    videos_match = re.search(r'<div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">\s*<div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">.*?(?=</div>\n\n\n    </div>)', content, re.DOTALL)
    videos_panel_inner = videos_match.group(0) if videos_match else ''
else:
    videos_panel_inner = divs[-1]

videos_panel_inner = content[content.find('<div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">\n\n        <div className="flex items-center justify-between'):]
videos_panel = videos_panel_inner[:videos_panel_inner.rfind('</div>\n    </div>\n  );\n}')]
videos_panel = videos_panel.replace('<div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">', '<div className="xl:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full bento-glow-indigo">')

# Main views chart
main_chart_match = re.search(r'(<div className="mb-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">.*?<div className="h-28 relative mb-3 ml-6">.*?</svg>.*?</div>.*?</div>\n              </div>)', content, re.DOTALL)
main_chart = main_chart_match.group(1) if main_chart_match else ''

# Oh wait, the Two mini charts row is inside main_chart right now!
# Let's extract them individually
chart1_match = re.search(r'(<div className="flex items-center gap-2 mb-4">.*?<div className="h-28 relative mb-3 ml-6">.*?</div>)', content, re.DOTALL)
chart1 = chart1_match.group(1) if chart1_match else ''
chart1 = f'<div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex-1 flex flex-col">\n{chart1}\n</div>'

mini1_match = re.search(r'(<div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">\s*<span className="text-\[10px\] text-slate-400 block mb-2">点赞数趋势 \(Engagement\).*?</div>\s*</div>)', content, re.DOTALL)
mini1 = mini1_match.group(1) if mini1_match else ''

mini2_match = re.search(r'(<div className="bg-slate-950/50 p-2.5 rounded border border-slate-800">\s*<span className="text-\[10px\] text-slate-400 block mb-2">粉丝增长 \(Followers\).*?</div>\s*</div>)', content, re.DOTALL)
mini2 = mini2_match.group(1) if mini2_match else ''

# Extract Diagnostics part
diag_match = re.search(r'(<div className="flex items-center gap-4 border-b border-slate-800 pb-3 mb-3">.*算法权重递增法则.*</div>)', content, re.DOTALL)
diag = diag_match.group(1) if diag_match else ''

if not videos_panel or not chart1 or not mini1 or not mini2 or not diag:
    print('Failed to extract some pieces')
else:
    # Modify mini charts to look like full rows
    mini1 = mini1.replace('bg-slate-950/50 p-2.5', 'bg-slate-900/40 p-4 flex-1 flex flex-col')
    mini2 = mini2.replace('bg-slate-950/50 p-2.5', 'bg-slate-900/40 p-4 flex-1 flex flex-col')
    mini1 = mini1.replace('h-10', 'flex-1 relative ml-6 mt-2')
    mini2 = mini2.replace('h-10', 'flex-1 relative ml-6 mt-2')
    
    y_axis_likes = '''
                <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                  <span>800</span><span>400</span><span>0</span>
                </div>
    '''
    y_axis_followers = '''
                <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                  <span>50</span><span>25</span><span>0</span>
                </div>
    '''
    mini1 = mini1.replace('</svg>', '</svg>' + y_axis_likes)
    mini2 = mini2.replace('</svg>', '</svg>' + y_axis_followers)
    
    right_panel = f'''
      <div className="xl:col-span-7 flex flex-col gap-4 h-full min-w-0">
        {{/* Top 4/5: Charts */}}
        <div className="flex-[4] flex flex-col gap-4 min-h-0">
          {{/* Chart 1 */}}
          {chart1}
          {{/* Chart 2 */}}
          {mini1}
          {{/* Chart 3 */}}
          {mini2}
        </div>
        
        {{/* Bottom 1/5: Diagnostics */}}
        <div className="flex-1 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-y-auto scrollbar-narrow min-h-0">
          {diag}
        </div>
      </div>
    '''
    
    new_wrapper = '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-slate-200 text-left h-full">\n' + videos_panel + '\n' + right_panel + '\n    </div>\n  );\n}'
    
    prefix = content[:content.find('<div className="flex flex-col gap-6 text-slate-200 text-left">')]
    with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
        f.write(prefix + new_wrapper)
    print('Layout updated successfully')
