import re

with open('src/components/WarmupPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if 'Camera,' not in content:
    content = content.replace('MessageSquare, AlertCircle, HelpCircle', 'MessageSquare, AlertCircle, HelpCircle, X, Camera, Image as ImageIcon')

# 2. State
state_str = """  const [currentCountdown, setCurrentCountdown] = useState<number>(0);

  // New States
  const [showParamsModal, setShowParamsModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'log' | 'screenshot'>('log');
"""
content = content.replace('  const [currentCountdown, setCurrentCountdown] = useState<number>(0);', state_str)

# 3. Modify `handleRunSimulation` to show modal
handle_run_old = """  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimProgress(0);
    setSimLogs([]);
    setActiveActionIndex(0);

    pushSimLog(`🤖 [PLAN ENGINE] Resolving Warm-up protocol Day ${selectedDay}: "${activePlan.title}"`);
    pushSimLog(`🛡️ [MCP SECURITY] Using residential secure IP proxy: ${device.ip}`);
    pushSimLog(`📱 [DEVICE] Bound model ID: ${device.name} - active account: @${device.username}`);
    pushSimLog(`⚙️ [PARAMS] Concurrency: ${concurrentDevices} devices | Duration Target: ${totalMinutes}m`);
    pushSimLog(`⚙️ [PARAMS] Algorithm Training Targets: Like Rate:${likeProb}%, Bookmark:${bookmarkProb}%, VisitProfile:${visitAuthorProb}%`);
    pushSimLog(`🔄 Initiating ADB injection simulation stream...`);

    executeStep(0);
  };"""

handle_run_new = """  const handleRunSimulation = () => {
    if (isSimulating) return;
    setShowParamsModal(true);
  };

  const startActualSimulation = () => {
    setShowParamsModal(false);
    setIsSimulating(true);
    setSimProgress(0);
    setSimLogs([]);
    setActiveActionIndex(0);
    setViewMode('log');

    const dt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ',123';
    pushSimLog(`${dt} - INFO - HTTP Request: POST https://rc.guokers.com/mcp "HTTP/1.1 200 OK"`);
    pushSimLog(`${dt} - INFO - [${device.name}] 📸 截图: 0.1s`);
    pushSimLog(`${dt} - INFO - [${device.name}] LLM: page='feed', action='scroll', 'x': 0, 'y': 0, 'is_fashion': False, 'content_type': '宠物/日常', 'has_liked': False`);

    executeStep(0);
  };"""
content = content.replace(handle_run_old, handle_run_new)

# 4. Modify executeStep to have realistic logs
exec_step_old = """    let logMessage = '';
    switch (action.type) {
      case 'search':
        logMessage = `🔍 Executing Search: typing query string "${action.param}" into search bar...`;
        break;
      case 'scroll':
        logMessage = `📱 Simulating infinite scroll on Feed matching query tag. Scrolling speed: normal...`;
        break;
      case 'bookmark':
        logMessage = `⭐️ Interacted: Bookmarked video to trigger sub-niche algorithm weights.`;
        break;
      case 'like':
        logMessage = `❤️ Double tap executed. Emulating randomized thumb placement at coordinates (452, 630).`;
        break;
      case 'profile':
        logMessage = `👤 Navigated to creator profile. Simulating human bio reading (2.4s).`;
        break;
      case 'comment':
        logMessage = `💬 Typed comment: "Love this so much 🔥" (simulated human typing speed: 84 WPM).`;
        break;
      case 'share':
        logMessage = `🔗 Copied video link to clipboard via share menu to boost algorithm points.`;
        break;
    }
    pushSimLog(`[STEP ${actionIdx + 1}/${activePlan.actions.length}] ${logMessage}`);"""

exec_step_new = """    let logMessage = '';
    const dt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ',' + Math.floor(Math.random() * 999).toString().padStart(3, '0');
    switch (action.type) {
      case 'search':
        logMessage = `${dt} - INFO - HTTP Request: POST https://rc.guokers.com/mcp "HTTP/1.1 200 OK"\\n${dt} - INFO - [${device.name}] LLM调用: 3.4s\\n${dt} - INFO - [${device.name}] 🤖 page=search, action=input, param='${action.param}'`;
        break;
      case 'scroll':
        logMessage = `${dt} - INFO - [${device.name}] ⬇️ 下滑: 0.47秒, 0.15x\\n${dt} - INFO - [${device.name}] ⏳ 停留 3.2s`;
        break;
      case 'bookmark':
        logMessage = `${dt} - INFO - [${device.name}] LLM: page='feed', action='bookmark', reason='符合目标画像'`;
        break;
      case 'like':
        logMessage = `${dt} - INFO - [${device.name}] LLM: page='feed', action='watch like and comment', reason='当前视频是关于${device.niche}的优质视频, 右侧心形按钮为白色轮廓, 尚未点赞, 故要点赞并互动'`;
        break;
      case 'profile':
        logMessage = `[${device.name}] --- loop=${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 20)}.3min / ${totalMinutes}min | v_likes=${Math.floor(Math.random() * 10)} comm=3 ---`;
        break;
      case 'comment':
        logMessage = `${dt} - INFO - HTTP Request: POST https://rc.guokers.com/mcp "HTTP/1.1 200 OK"\\n${dt} - INFO - [${device.name}] 📝 发送评论: 成功`;
        break;
      case 'share':
        logMessage = `${dt} - INFO - [${device.name}] 🚀 快速下滑 (跳过 LLM, 连续 2 次 scroll)\\n${dt} - INFO - LOOP#56 total=6.2s [ss=0.1 llm=0.0 mcp=0.0 sleep=0.0 guard=0.0 other=6.1] action=fast_scroll`;
        break;
    }
    const lines = logMessage.split('\\n');
    lines.forEach(l => pushSimLog(l));"""
content = content.replace(exec_step_old, exec_step_new)

# 5. Extract sliders into Modal
# We will locate `<div className="xl:col-span-4` and `<div className="xl:col-span-8`
sliders_start = content.find('{/* 1. Left controls panel: Simulation parameters (4 columns) */}')
sliders_end = content.find('{/* 2. Middle & Right panel: Plan List Planner Timeline + Virtual Simulator Output logs (8 columns) */}')

sliders_code = content[sliders_start:sliders_end]

# Modify the layout: `xl:col-span-12 grid grid-cols-1 md:grid-cols-2` -> `md:grid-cols-12`
# `xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4` -> `xl:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4`
content = content.replace('<div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">', '<div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4">')

# Left part of new layout -> `lg:col-span-5`
content = content.replace('{/* 2.1 Timeline Selection (Left) */}', '{/* 2.1 Timeline Selection (Left) */}\n        <div className="lg:col-span-5 flex flex-col h-full">')
content = content.replace('        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo">', '          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo flex-1">')

# Right part -> `lg:col-span-7`
content = content.replace('{/* 2.2 Terminal Log Simulation display (Right) */}', '        </div>\n        {/* 2.2 Terminal Log Simulation display (Right) */}\n        <div className="lg:col-span-7 flex flex-col h-full">')

# Inside Terminal Log
# We need to change the header to include tabs
terminal_header_old = """          <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2 justify-between">
            <div className="flex items-center gap-4">
              <Terminal className="text-emerald-400 w-5 h-5" />
              <h3 className="text-xs font-bold text-slate-150">脚本执行控制台日志 (Console Logs)</h3>
            </div>

            {isSimulating && (
              <span className="text-xs bg-red-950 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded animate-pulse font-mono tracking-tight">
                EXECUTING...
              </span>
            )}
          </div>"""

terminal_header_new = """          <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2 justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('log')} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${viewMode === 'log' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Terminal className="w-4 h-4" />
                <span className="text-xs">运行日志</span>
              </button>
              <button 
                onClick={() => setViewMode('screenshot')} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${viewMode === 'screenshot' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-xs">设备截图</span>
              </button>
            </div>

            {isSimulating && (
              <span className="text-xs bg-red-950 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded animate-pulse font-mono tracking-tight">
                EXECUTING...
              </span>
            )}
          </div>"""
content = content.replace(terminal_header_old, terminal_header_new)

# Inside Terminal Content
terminal_content_old = """            {/* Logs viewport */}
            <div
              ref={logScrollRef}
              className="flex-1 overflow-y-auto space-y-4 bg-black/40 p-4 rounded border border-slate-900 font-mono text-xs text-left text-slate-400 select-all scrollbar-narrow"
            >
              {simLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                  <Terminal className="w-8 h-8 mb-2" />
                  <span>等待指令... 点击左侧运行脚本。</span>
                </div>
              ) : (
                simLogs.map((log, i) => {
                  let col = 'text-slate-300';
                  if (log.includes('USER_EXEC')) col = 'text-yellow-400';
                  else if (log.includes('SUCCESS') || log.includes('✓')) col = 'text-emerald-400 font-bold';
                  else if (log.includes('AGENT') || log.includes('PLAN')) col = 'text-purple-400';
                  else if (log.includes('PARAMS') || log.includes('⚙️')) col = 'text-slate-500';
                  else if (log.includes('STEP')) col = 'text-sky-300 font-bold';

                  return (
                    <div key={i} className={`break-all leading-normal ${col}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>"""

terminal_content_new = """            {/* Viewport */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {viewMode === 'log' ? (
                <div
                  ref={logScrollRef}
                  className="absolute inset-0 overflow-y-auto space-y-1.5 bg-black/80 p-4 rounded border border-slate-900 font-mono text-[10px] text-left text-slate-400 select-all scrollbar-narrow leading-tight"
                >
                  {simLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                      <Terminal className="w-8 h-8 mb-2" />
                      <span>等待指令... 点击左侧运行脚本。</span>
                    </div>
                  ) : (
                    simLogs.map((log, i) => {
                      let col = 'text-slate-300';
                      if (log.includes('INFO - HTTP')) col = 'text-slate-500';
                      else if (log.includes('LLM调用')) col = 'text-yellow-400';
                      else if (log.includes('--- loop=')) col = 'text-purple-400';
                      else if (log.includes('LLM: page=')) col = 'text-sky-400';

                      // Remove timestamps from my own logs in formatting if needed, but it's fine.
                      return (
                        <div key={i} className={`break-all ${col}`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 overflow-y-auto bg-slate-900/50 p-4 rounded border border-slate-900 scrollbar-narrow grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {['exabc-iphone-3-nurture_428s_153308.png', 'exabc-iphone-3-nurture_436s_153316.png', 'exabc-iphone-3-nurture_521s_153442.png', 'exabc-iphone-3-nurture_547s_153507.png', 'exabc-iphone-3-nurture_85s_154613.png', 'exabc-iphone-3-nurture_119s_154647.png', 'exabc-iphone-3-nurture_219s_152939.png', 'exabc-iphone-3-nurture_344s_153144.png', 'exabc-iphone-3-nurture_452s_153332.png'].map((img, idx) => (
                    <div key={idx} className="relative group rounded overflow-hidden border border-slate-700 bg-black aspect-[9/16]">
                      <img src={`/screen/${img}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" alt="screen" />
                      <div className="absolute top-2 left-2 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-white flex items-center gap-1">
                        <Camera className="w-3 h-3 text-sky-400" />
                        {img.split('_')[1]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>"""
content = content.replace(terminal_content_old, terminal_content_new)


# Now remove sliders_code and add Modal at the end
content = content.replace(sliders_code, '')

modal_code = """
      {showParamsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Sliders className="text-indigo-400 w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-150">脚本运行参数配置</h3>
              </div>
              <button onClick={() => setShowParamsModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-narrow">
""" + sliders_code.replace('xl:col-span-4 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo', 'w-full flex flex-col text-left').replace('flex items-center gap-4 border-b border-slate-800 pb-4 mb-2', 'hidden') + """
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
              <button 
                onClick={() => setShowParamsModal(false)}
                className="px-4 py-2 rounded text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                取消
              </button>
              <button 
                onClick={startActualSimulation}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded text-xs font-bold text-white transition flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                <Play className="w-4 h-4" />
                确认并运行脚本
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace('    </div>\n  );\n}\n', '    </div>\n' + modal_code + '  );\n}\n')

# Close the new div blocks: 
# lg:col-span-5 has a div wrapping timeline, we need to close it.
content = content.replace('        </div>\n\n        {/* 2.2 Terminal Log Simulation display (Right) */}', '        </div>\n        </div>\n\n        {/* 2.2 Terminal Log Simulation display (Right) */}')

content = content.replace('      </div>\n\n    </div>\n', '      </div>\n        </div>\n\n    </div>\n')


with open('src/components/WarmupPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated WarmupPlanner.tsx")
