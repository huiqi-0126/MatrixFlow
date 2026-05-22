import re

with open('src/components/WarmupPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
state_code = """  const [viewMode, setViewMode] = useState<'log' | 'screenshot'>('log');
  const [hasPlanned, setHasPlanned] = useState<boolean>(false);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);"""
content = content.replace("  const [viewMode, setViewMode] = useState<'log' | 'screenshot'>('log');", state_code)

# 2. Add loading simulation
sim_code = """  const handleSmartPlan = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
      setHasPlanned(true);
    }, 2000);
  };

  const handleRunSimulation = () => {"""
content = content.replace("  const handleRunSimulation = () => {", sim_code)

# 3. Replace UI section
ui_old = """              {/* Days buttons row */}
              <div className=\"grid grid-cols-5 gap-4 mb-2\">
                {plans.map(p => (
                  <button
                    key={p.day}
                    onClick={() => {
                      if (!isSimulating) setSelectedDay(p.day);
                    }}
                    disabled={isSimulating}
                    className={`py-2 text-center rounded text-xs font-bold font-mono transition cursor-pointer ${selectedDay === p.day
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-slate-800 hover:bg-slate-705 text-slate-300 disabled:opacity-40'
                      }`}
                  >
                    DAY {p.day}
                  </button>
                ))}
              </div>"""

ui_new = """              {/* Days buttons row */}
              {!hasPlanned ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">
                  {isPlanning ? (
                    <div className="w-full max-w-xs text-center">
                      <div className="text-slate-300 text-xs font-bold mb-3">大模型正在基于人设画像自动规划互动剧本...</div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden w-full">
                        <div className="h-full bg-purple-500 animate-pulse w-full origin-left" style={{ animation: 'progress 2s ease-in-out forwards' }}></div>
                      </div>
                      <style>{`@keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-4 opacity-50">🤖</div>
                      <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
                        当前暂无互动规划数据。<br/>请点击下方按钮，由系统根据该账号的垂直领域自动生成5天阶梯式的养号剧本。
                      </p>
                      <button 
                        onClick={handleSmartPlan}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
                      >
                        ✨ 基于人设智能规划
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
              <div className=\"grid grid-cols-5 gap-4 mb-2\">
                {plans.map(p => (
                  <button
                    key={p.day}
                    onClick={() => {
                      if (!isSimulating) setSelectedDay(p.day);
                    }}
                    disabled={isSimulating}
                    className={`py-2 text-center rounded text-xs font-bold font-mono transition cursor-pointer ${selectedDay === p.day
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-slate-800 hover:bg-slate-705 text-slate-300 disabled:opacity-40'
                      }`}
                  >
                    DAY {p.day}
                  </button>
                ))}
              </div>"""

content = content.replace(ui_old, ui_new)

ui_close_old = """                {/* Click run button */}
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className={`w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 hover:opacity-90 font-bold text-white text-xs rounded transition shadow-lg flex items-center justify-center gap-4 cursor-pointer mt-3`}
                >
                  <Play className="w-3.5 h-3.5 fill-currentScale" />
                  {isSimulating ? `正在远程代运营养号中...` : `一键运行养号脚本`}
                </button>

              </div>"""

ui_close_new = """                {/* Click run button */}
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className={`w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 hover:opacity-90 font-bold text-white text-xs rounded transition shadow-lg flex items-center justify-center gap-4 cursor-pointer mt-3`}
                >
                  <Play className="w-3.5 h-3.5 fill-currentScale" />
                  {isSimulating ? `正在远程代运营养号中...` : `一键运行养号脚本`}
                </button>
                </>
              )}
              </div>"""

content = content.replace(ui_close_old, ui_close_new)

with open('src/components/WarmupPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
