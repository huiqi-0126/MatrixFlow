import re

with open('src/components/WarmupPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state hooks
hooks_target = """export default function WarmupPlanner({ device, onUpdateDeviceStats }: WarmupPlannerProps) {
  const [plans, setPlans] = useState<WarmupPlan[]>(DEFAULT_WARMUP_PLANS);
  const [selectedDay, setSelectedDay] = useState<number>(1);"""

hooks_replacement = """export default function WarmupPlanner({ device, onUpdateDeviceStats }: WarmupPlannerProps) {
  const todayDate = new Date();
  const CALENDAR_DAYS = Array.from({ length: 7 }).map((_, i) => {
    const offset = i - 3;
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + offset);
    const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      offset,
      dateStr,
      label: offset === 0 ? '今日' : `周${['日','一','二','三','四','五','六'][d.getDay()]}`,
      type: offset <= 0 ? 'executed' : 'planned'
    };
  });
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [plans, setPlans] = useState<WarmupPlan[]>(DEFAULT_WARMUP_PLANS);
  const selectedDay = 1; // dummy for compatibility"""

content = content.replace(hooks_target, hooks_replacement)

# 2. Replace Calendar Header
cal_target = """          {/* 2.1 Calendar Header */}
          <div className="flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner relative">
            <div className="absolute inset-y-0 left-0 bg-indigo-500/20 rounded-xl" style={{ width: `${simProgress}%`, transition: 'width 1s linear' }}></div>
            {plans.map((p, idx) => (
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

cal_replacement = """          {/* 2.1 Calendar Header (7-Day Agent Execution Planner) */}
          <div className="flex items-center justify-between mb-4 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner relative">
            <div className="absolute inset-y-0 left-0 bg-indigo-500/20 rounded-xl" style={{ width: `${simProgress}%`, transition: 'width 1s linear' }}></div>
            {CALENDAR_DAYS.map((p) => {
              const isSelected = selectedDayOffset === p.offset;
              const isPast = p.offset <= 0;
              const isToday = p.offset === 0;
              return (
                <button
                  key={p.offset}
                  onClick={() => {
                    if (!isSimulating) setSelectedDayOffset(p.offset);
                  }}
                  disabled={isSimulating}
                  className={`py-2 px-1 flex-1 text-center rounded text-xs font-bold font-mono transition cursor-pointer flex flex-col items-center gap-0.5 relative ${isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-transparent hover:bg-slate-800 text-slate-400 disabled:opacity-40'
                    }`}
                >
                  <span className={isSelected ? 'text-white' : isToday ? 'text-purple-400' : 'text-slate-500'}>{p.dateStr}</span>
                  <span className="flex items-center">
                    {p.label}
                    {isPast && <CheckCircle className={`w-2.5 h-2.5 inline ml-1 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />}
                  </span>
                  {p.offset > 0 && (
                    <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                  )}
                </button>
              );
            })}
          </div>"""

content = content.replace(cal_target, cal_replacement)

# 3. Replace Left Panel
import re
left_panel_pattern = re.compile(r'\{\/\* Day detail preview \*\/\}.*?(?=\<\!\-\- Click run button \-\-\>|\{\/\* Click run button \*\/\})', re.DOTALL)

left_panel_replacement = """{/* Panel Content based on Selection */}
                  {selectedDayOffset <= 0 ? (
                    <div className="bg-slate-800/20 rounded-xl border border-slate-800 flex-1 overflow-hidden relative flex flex-col mb-3">
                      <div className="flex items-center gap-4 p-4 border-b border-slate-800 shrink-0 bg-slate-900/50">
                        <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          EXECUTED
                        </span>
                        <span className="text-xs text-slate-300 font-bold truncate">已执行结果列表</span>
                        <span className="text-[10px] text-slate-500 ml-auto">共 {MOCK_RESULTS.length} 条记录</span>
                      </div>
                      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-narrow">
                        <table className="w-full text-left text-[10px] text-slate-300 font-mono whitespace-nowrap min-w-[600px]">
                          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-slate-800">
                            <tr className="text-slate-500 uppercase">
                              <th className="py-2.5 px-3 font-bold">脚本名称</th>
                              <th className="py-2.5 px-2 font-bold">时间</th>
                              <th className="py-2.5 px-2 font-bold text-center">操作</th>
                              <th className="py-2.5 px-2 font-bold">状态</th>
                              <th className="py-2.5 px-2 font-bold">赞视</th>
                              <th className="py-2.5 px-2 font-bold">开评</th>
                              <th className="py-2.5 px-2 font-bold">滑评</th>
                              <th className="py-2.5 px-2 font-bold">赞评</th>
                              <th className="py-2.5 px-2 font-bold">回评</th>
                              <th className="py-2.5 px-2 font-bold">新评</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {MOCK_RESULTS.map((res, i) => (
                              <tr key={i} className="hover:bg-slate-800/50 transition group">
                                <td className="py-2 px-3 font-bold text-slate-200 truncate max-w-[120px]">{res.name}</td>
                                <td className="py-2 px-2 text-slate-400">{res.time.split(' ')[1]}</td>
                                <td className="py-2 px-2 text-center">
                                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={() => setViewMode('log')} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-950/40 text-sky-400 hover:bg-sky-900/60 transition">日志</button>
                                    <button onClick={() => setViewMode('screenshot')} className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 transition">截图</button>
                                  </div>
                                </td>
                                <td className="py-2 px-2">
                                  {res.status === 'success' ? (
                                    <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/50">完成</span>
                                  ) : (
                                    <span className="text-[9px] bg-rose-950/40 text-rose-400 px-1 py-0.5 rounded border border-rose-900/50">异常</span>
                                  )}
                                </td>
                                <td className="py-2 px-2">{res.v_likes}</td>
                                <td className="py-2 px-2">{res.open_comm}</td>
                                <td className="py-2 px-2">{res.scroll_comm}</td>
                                <td className="py-2 px-2">{res.c_likes}</td>
                                <td className="py-2 px-2">{res.c_replies}</td>
                                <td className="py-2 px-2">{res.c_news}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col justify-start space-y-3 overflow-y-auto scrollbar-narrow mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-purple-950 border border-purple-800 text-purple-400 px-2 py-0.5 rounded font-mono">
                            PLANNED TASKS
                          </span>
                          <span className="text-xs text-slate-300 font-bold">已规划执行队列</span>
                        </div>
                      </div>
                      
                      {[
                        { time: '10:00', name: 'TikTok浏览养号+评论', dur: '20分钟' },
                        { time: '14:30', name: 'TikTok搜索养号', dur: '15分钟' },
                        { time: '18:15', name: 'TikTok点赞+访问感兴趣主页', dur: '25分钟' },
                        { time: '21:00', name: '直播间挂机+随机互动', dur: '30分钟' },
                      ].map((script, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-850 bg-slate-900/60 hover:border-slate-700 transition group">
                          <div className="flex items-center gap-4 overflow-hidden mr-2">
                            <span className="text-slate-400 font-bold font-mono text-sm">{script.time}</span>
                            <div className="truncate text-left">
                              <span className="font-bold text-slate-200 text-xs block">{script.name}</span>
                              <span className="text-slate-500 block text-[10px] mt-0.5">预计执行时长: {script.dur}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition">
                            <button className="text-[10px] font-bold bg-indigo-600/80 hover:bg-indigo-500 text-white px-2 py-1 rounded transition shadow-lg shadow-indigo-500/20 flex items-center gap-1">
                              <Play className="w-3 h-3" /> 立即执行
                            </button>
                            <button className="text-[10px] font-bold bg-slate-800 border border-slate-700 hover:bg-red-900/60 text-slate-400 hover:text-red-400 px-2 py-1 rounded transition">
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button className="w-full mt-2 border border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-600 transition text-slate-400 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        + 添加自动执行脚本
                      </button>
                    </div>
                  )}
                  
                  """
content = left_panel_pattern.sub(left_panel_replacement, content)


# 4. Replace Right Panel completely
right_panel_pattern = re.compile(r'\{\/\* 2\.2 Terminal Log Simulation display \(Right\) \*\/\}.*?(?=\<\!\-\- Run dynamic progress bar hidden \-\-\>|\{\/\* Run dynamic progress bar hidden \*\/\})', re.DOTALL)

right_panel_replacement = """{/* 2.2 Terminal Log Simulation display (Right) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left h-full bento-glow-indigo">
              {selectedDayOffset <= 0 ? (
                <>
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2 justify-between">
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
                      <button
                        onClick={() => {
                          setIsSimulating(false);
                          if (timeoutRef.current) clearTimeout(timeoutRef.current);
                          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                          setCurrentCountdown(0);
                          const dt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ',000';
                          pushSimLog(`${dt} - INFO - 🛑 脚本已手动终止`);
                        }}
                        className="text-xs bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-900/50 px-2 py-1 rounded transition font-bold font-mono tracking-tight flex items-center cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 mr-1.5 animate-pulse" />
                        停止
                      </button>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-800/20 rounded-xl border border-slate-800 flex flex-col p-4 h-[350px]">
                    {/* Viewport */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                      {viewMode === 'log' ? (
                        <div
                          ref={logScrollRef}
                          className="absolute inset-0 overflow-y-auto space-y-1.5 bg-black/80 p-4 rounded border border-slate-900 font-mono text-[10px] text-left text-slate-400 select-all scrollbar-narrow leading-tight"
                        >
                          {simLogs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                              <Terminal className="w-8 h-8 mb-2" />
                              <span>等待指令... 点击左侧列表可查看任务详情。</span>
                            </div>
                          ) : (
                            simLogs.map((log, i) => {
                              let col = 'text-slate-300';
                              if (log.includes('INFO - HTTP')) col = 'text-slate-500';
                              else if (log.includes('LLM调用')) col = 'text-yellow-400';
                              else if (log.includes('--- loop=')) col = 'text-purple-400';
                              else if (log.includes('LLM: page=')) col = 'text-sky-400';

                              return (
                                <div key={i} className={`break-all ${col}`}>
                                  {log}
                                </div>
                              );
                            })
                          )}
                        </div>
                      ) : viewMode === 'screenshot' ? (
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
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8 relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                  
                  <div className="w-24 h-24 bg-slate-900 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-10">
                    <Zap className="w-10 h-10 text-emerald-400 animate-bounce" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight z-10">智能体守护中</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed z-10">
                    自动化执行引擎已就绪。<br />
                    系统将自动探测设备的空闲状态，并在指定的计划时间点，免干预下发并自动执行排队中的脚本。
                  </p>
                  
                  <div className="mt-8 flex gap-3 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800 z-10">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                      设备在线: {device.name}
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                      网络通畅: {device.ip}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Run dynamic progress bar hidden */}"""

content = right_panel_pattern.sub(right_panel_replacement, content)

with open('src/components/WarmupPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

