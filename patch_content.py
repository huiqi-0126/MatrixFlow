import re

with open('src/components/ContentPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
state_code = """  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [hasPlanned, setHasPlanned] = useState<boolean>(false);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);"""
content = content.replace("  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);", state_code)

# 2. Add loading simulation function
sim_code = """  const handleSmartPlan = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
      setHasPlanned(true);
    }, 2000);
  };

  const handleAutoReplicate = () => {"""
content = content.replace("  const handleAutoReplicate = () => {", sim_code)

# 3. Replace UI section
ui_old = """        {/* 30-Day mini grid selection */}
        <div className=\"grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-5 gap-1.5 mb-4 overflow-y-auto pr-1 scrollbar-narrow\">
          {Array.from({ length: 30 }).map((_, id) => {
            const hasDraft = id < plans.length;
            const isSelected = selectedDayIndex === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedDayIndex(id)}
                className={`p-4 text-center rounded text-xs font-mono font-bold transition cursor-pointer flex flex-col items-center justify-center ${isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35'
                    : hasDraft
                      ? 'bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 hover:bg-indigo-900/40'
                      : 'bg-slate-800 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-700'
                  }`}
              >
                <span>D{id + 1}</span>
                {hasDraft && <span className=\"w-1 h-1 rounded-full bg-indigo-400 mt-0.5\"></span>}
              </button>
            );
          })}
        </div>"""

ui_new = """        {/* 30-Day mini grid selection */}
        {!hasPlanned ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed mb-4">
            {isPlanning ? (
              <div className="w-full max-w-xs text-center">
                <div className="text-slate-300 text-xs font-bold mb-3">大模型正在基于人设画像自动规划内容表...</div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden w-full">
                  <div className="h-full bg-indigo-500 animate-pulse w-full origin-left" style={{ animation: 'progress 2s ease-in-out forwards' }}></div>
                </div>
                <style>{`@keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-4 opacity-50">🤖</div>
                <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
                  当前暂无月度内容选题规划数据。<br/>请点击下方按钮，由系统根据该账号的垂直领域自动生成30天阶梯式的内容排期表。
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
        <div className=\"grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-5 gap-1.5 mb-4 overflow-y-auto pr-1 scrollbar-narrow\">
          {Array.from({ length: 30 }).map((_, id) => {
            const hasDraft = id < plans.length;
            const isSelected = selectedDayIndex === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedDayIndex(id)}
                className={`p-4 text-center rounded text-xs font-mono font-bold transition cursor-pointer flex flex-col items-center justify-center ${isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35'
                    : hasDraft
                      ? 'bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 hover:bg-indigo-900/40'
                      : 'bg-slate-800 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-700'
                  }`}
              >
                <span>D{id + 1}</span>
                {hasDraft && <span className=\"w-1 h-1 rounded-full bg-indigo-400 mt-0.5\"></span>}
              </button>
            );
          })}
        </div>"""

content = content.replace(ui_old, ui_new)

ui_close_old = """          <div className="border-t border-slate-900 pt-3.5 mt-5 text-xs text-slate-500 text-left">
            <span>ℹ️ 说明: 该日度排片表与 [定时发布] 队列模块完全挂钩，有助于实现多设备间的内容交叉不重叠。</span>
          </div>

        </div>"""

ui_close_new = """          <div className="border-t border-slate-900 pt-3.5 mt-5 text-xs text-slate-500 text-left">
            <span>ℹ️ 说明: 该日度排片表与 [定时发布] 队列模块完全挂钩，有助于实现多设备间的内容交叉不重叠。</span>
          </div>
          </>
        )}
        </div>"""

content = content.replace(ui_close_old, ui_close_new)

with open('src/components/ContentPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
