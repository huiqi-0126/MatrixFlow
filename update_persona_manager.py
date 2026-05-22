import re

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Loader2 to imports if not there
if 'Loader2' not in content:
    content = content.replace('UploadCloud,', 'UploadCloud, Loader2,')

# 2. Add state variables
state_pattern = r'const \[isEditingPersona, setIsEditingPersona\] = useState\(false\);'
new_state = '''const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [isFetchingCompetitors, setIsFetchingCompetitors] = useState(false);
  const [showCompetitors, setShowCompetitors] = useState(false);

  const handleFetchCompetitors = () => {
    setIsFetchingCompetitors(true);
    setTimeout(() => {
      setIsFetchingCompetitors(false);
      setShowCompetitors(true);
    }, 3000);
  };'''
content = content.replace(state_pattern, new_state)

# 3. Update Header
header_old = """<div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
          <div className="flex items-center gap-4">
            <Flame className="text-rose-500 w-5 h-5" />
            <h3 className="text-xs font-bold text-slate-150">近期对标账号爆款视频抓取 (Trending Competitor Content)</h3>
          </div>
          
          <span className="text-xs text-slate-500 font-mono tracking-wider">
            AUTO-SYNCED: JUST NOW
          </span>
        </div>"""

header_new = """<div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
          <div className="flex items-center gap-4">
            <Flame className="text-rose-500 w-5 h-5" />
            <h3 className="text-xs font-bold text-slate-150">近期对标账号爆款视频抓取 (Trending Competitor Content)</h3>
          </div>
          
          <div className="flex items-center gap-3">
            {showCompetitors && (
              <span className="text-xs text-slate-500 font-mono tracking-wider">
                AUTO-SYNCED: JUST NOW
              </span>
            )}
            <button
              onClick={handleFetchCompetitors}
              disabled={isFetchingCompetitors || showCompetitors}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                showCompetitors
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]'
              }`}
            >
              {isFetchingCompetitors ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  抓取中...
                </>
              ) : showCompetitors ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已抓取
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  立刻抓取
                </>
              )}
            </button>
          </div>
        </div>"""

content = content.replace(header_old, header_new)

# 4. Wrap List Grid
list_old = """{/* Assets List Grid */}
        <div className="flex-1 overflow-y-auto h-full min-h-[460px] pr-1 space-y-3 scrollbar-narrow">
          {["""

list_new = """{/* Assets List Grid */}
        <div className="flex-1 overflow-y-auto h-full min-h-[460px] pr-1 space-y-3 scrollbar-narrow relative">
          
          {!showCompetitors && !isFetchingCompetitors && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Flame className="w-8 h-8 text-slate-500" />
              </div>
              <h4 className="text-slate-200 font-bold mb-2">等待抓取对标爆款</h4>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                系统将根据当前人设赛道（{device.niche}）和标签特征，自动抓取全网最新高互动量爆款视频作为参考。
              </p>
            </div>
          )}

          {isFetchingCompetitors && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <h4 className="text-indigo-400 font-bold mb-2 animate-pulse">正在全网扫描爆款视频...</h4>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Matching tags: {persona.interests.slice(0, 2).join(', ')}...
              </p>
            </div>
          )}

          {showCompetitors && (
            ["""

content = content.replace(list_old, list_new)

# 5. Close the conditional at the bottom
# The bottom of the file looks like:
#             }
#           ].map((asset, i) => (
# ... (a bunch of lines)
#               </div>
#             </div>
#           ))}
#         </div>

# Wait, `].map((asset, i) => (` needs to be closed with `)}` at the end!
bottom_old = """          ))}
        </div>

      </div>
    </div>
  );
}"""

bottom_new = """          ))}
          )}
        </div>

      </div>
    </div>
  );
}"""

content = content.replace(bottom_old, bottom_new)

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Update successful')
