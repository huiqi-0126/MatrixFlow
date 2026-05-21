import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, CheckCircle, Play, Sliders, ChevronRight, Terminal, 
  Search, Shield, Heart, Eye, Bookmark, MessageSquare, AlertCircle, HelpCircle
} from 'lucide-react';
import { WarmupPlan, WarmupAction, Device } from '../types';
import { DEFAULT_WARMUP_PLANS } from '../constants';

interface WarmupPlannerProps {
  device: Device;
  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number }) => void;
}

export default function WarmupPlanner({ device, onUpdateDeviceStats }: WarmupPlannerProps) {
  const [plans, setPlans] = useState<WarmupPlan[]>(DEFAULT_WARMUP_PLANS);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [activeActionIndex, setActiveActionIndex] = useState<number>(-1);
  const [currentCountdown, setCurrentCountdown] = useState<number>(0);

  // Automation Slider Parameters
  const [concurrentDevices, setConcurrentDevices] = useState(2);
  const [totalMinutes, setTotalMinutes] = useState(20);
  const [likeProb, setLikeProb] = useState(15);
  const [maxLikes, setMaxLikes] = useState(8);
  const [bookmarkProb, setBookmarkProb] = useState(10);
  const [forwardProb, setForwardProb] = useState(5);
  const [commentAreaProb, setCommentAreaProb] = useState(30);
  const [maxComments, setMaxComments] = useState(3);
  const [likeCommentProb, setLikeCommentProb] = useState(40);
  const [replyCreatorProb, setReplyCreatorProb] = useState(5);
  const [visitAuthorProb, setVisitAuthorProb] = useState(15);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logScrollRef = useRef<HTMLDivElement | null>(null);

  const activePlan = plans.find(p => p.day === selectedDay) || plans[0];

  const pushSimLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setSimLogs(prev => [...prev, `[${timestamp}] ${text}`]);
    
    // Auto scroll trace logs
    setTimeout(() => {
      if (logScrollRef.current) {
        logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
      }
    }, 10);
  };

  const handleRunSimulation = () => {
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
  };

  const executeStep = (actionIdx: number) => {
    if (actionIdx >= activePlan.actions.length) {
      // Completed plan
      setTimeout(() => {
        setIsSimulating(false);
        setSimProgress(100);
        setActiveActionIndex(-1);
        setCurrentCountdown(0);
        pushSimLog(`✅ [SUCCESS] Day ${selectedDay} Warmup schedule completed on account @${device.username}!`);
        pushSimLog(`👑 [ALGORITHM SECURED] Device successfully mapped into the "${device.niche}" index weight category.`);
        // Credit statistics view
        onUpdateDeviceStats(device.id, { viewsAdd: 150, followersAdd: 2 });
      }, 1000);
      return;
    }

    setActiveActionIndex(actionIdx);
    const action = activePlan.actions[actionIdx];
    let actionDuration = Math.min(action.duration, 5); // accelerate simulation for testing
    setCurrentCountdown(actionDuration);

    let logMessage = '';
    switch (action.type) {
      case 'search':
        logMessage = `🔍 Executing Search: typing query string "${action.param}" into search bar...`;
        break;
      case 'scroll':
        logMessage = `📱 Simulating infinite scroll on Feed matching query tag. Scrolling speed: normal...`;
        break;
      case 'like':
        logMessage = `❤️ Double-tapping screen coordinate on target video to trigger organic like...`;
        break;
      case 'bookmark':
        logMessage = `⭐ Pressing visual bookmark overlay. Added clip to collection: "${action.param}"`;
        break;
      case 'comment':
        logMessage = `💬 Clicking comment stream. Injecting conversational response: "${action.param}"`;
        break;
      case 'profile':
        logMessage = `👤 Navigating into competitor home profile page: ${action.param}. Evaluating grid...`;
        break;
      case 'share':
        logMessage = `🔗 Simulating organic share. Clipboard link exported: "${action.param}"`;
        break;
    }

    pushSimLog(`▶️ [STEP ${actionIdx + 1}/${activePlan.actions.length}] ${logMessage}`);

    // Progress bar calculations
    const stepWeight = 100 / activePlan.actions.length;
    const initialProgress = actionIdx * stepWeight;

    let countdownVar = actionDuration;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    progressIntervalRef.current = setInterval(() => {
      countdownVar--;
      if (countdownVar >= 0) {
        setCurrentCountdown(countdownVar);
        const subProgress = ((actionDuration - countdownVar) / actionDuration) * stepWeight;
        setSimProgress(Math.min(initialProgress + subProgress, 99));
      } else {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 1000);

    // Timeout trigger next
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pushSimLog(`✓ Done step ${actionIdx + 1}. Engagement weight criteria: Approved.`);
      executeStep(actionIdx + 1);
    }, actionDuration * 1000 + 400);

  };

  // Safe unmount cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-slate-200">
      
      {/* 1. Left controls panel: Simulation parameters (4 columns) */}
      <div className="xl:col-span-4 bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
        
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
          <Sliders className="text-indigo-400 w-5 h-5" />
          <h3 className="text-xs font-bold text-slate-150">养号自动化行为参数配置</h3>
        </div>

        <div className="space-y-4 text-xs font-mono">
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">并发运行设备数 (Concurrency)</span>
              <span className="text-purple-400 font-bold">{concurrentDevices} 台</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={concurrentDevices} 
              onChange={(e) => setConcurrentDevices(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-850 h-1 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">预估养号时长 (Total Minutes)</span>
              <span className="text-purple-400 font-bold">{totalMinutes} 分钟/天</span>
            </div>
            <input 
              type="range" min="5" max="60" step="5"
              value={totalMinutes} 
              onChange={(e) => setTotalMinutes(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-850 h-1 rounded"
            />
          </div>

          <div className="border-t border-slate-800 pt-3">
            <span className="text-xs text-slate-500 font-bold block mb-2 uppercase">互动概率参数控制 (Action Rates %)</span>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">双击点赞率</span>
                  <span className="text-slate-200">{likeProb}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={likeProb} 
                  onChange={(e) => setLikeProb(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">单次养号点赞数上限</span>
                  <span className="text-slate-200">{maxLikes} 个</span>
                </div>
                <input 
                  type="range" min="1" max="25" 
                  value={maxLikes} 
                  onChange={(e) => setMaxLikes(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">视频收藏率 (Bookmark)</span>
                  <span className="text-slate-200">{bookmarkProb}%</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="5"
                  value={bookmarkProb} 
                  onChange={(e) => setBookmarkProb(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">进入评论区及停留</span>
                  <span className="text-slate-200">{commentAreaProb}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5"
                  value={commentAreaProb} 
                  onChange={(e) => setCommentAreaProb(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-400">查看作者主页可能性</span>
                  <span className="text-slate-200">{visitAuthorProb}%</span>
                </div>
                <input 
                  type="range" min="0" max="50" step="5"
                  value={visitAuthorProb} 
                  onChange={(e) => setVisitAuthorProb(Number(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                />
              </div>
            </div>

          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 mt-4 leading-normal text-xs text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">🛠️ 反反作弊防封设计 (Anti-Ban Design):</span>
            使用基于特定概率的非固定动作时间（如浏览时长30-50s随机分布），有效模拟海外真实用户在手势滑动、停留聚焦上的不规则行为特征。
          </div>

        </div>

      </div>

      {/* 2. Middle & Right panel: Plan List Planner Timeline + Virtual Simulator Output logs (8 columns) */}
      <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2.1 Timeline Selection (Left) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
            <Calendar className="text-indigo-400 w-5 h-5" />
            <h3 className="text-xs font-bold text-slate-150">5天拟真梯度算法养号计划</h3>
          </div>

          {/* Days buttons row */}
          <div className="grid grid-cols-5 gap-1.5 mb-4">
            {plans.map(p => (
              <button 
                key={p.day}
                onClick={() => {
                  if (!isSimulating) setSelectedDay(p.day);
                }}
                disabled={isSimulating}
                className={`py-2 text-center rounded text-xs font-bold font-mono transition cursor-pointer ${
                  selectedDay === p.day 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' 
                    : 'bg-slate-800 hover:bg-slate-705 text-slate-300 disabled:opacity-40'
                }`}
              >
                DAY {p.day}
              </button>
            ))}
          </div>

          {/* Day detail preview */}
          <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex-1 min-h-[310px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-950 border border-purple-800 text-purple-400 px-2 py-0.5 rounded font-mono">
                  WARMUP SCRIPT
                </span>
                <span className="text-xs text-slate-300 font-bold truncate">养号脚本选择</span>
              </div>
              
              <p className="text-xs text-slate-400 mb-4 text-left leading-relaxed">
                选择养号脚本类型，系统将自动执行相应的模拟操作流程。
              </p>

              <span className="text-xs text-slate-500 font-bold block mb-2">养号脚本选择:</span>
              
              <div className="space-y-2">
                {/* Script Option 1 */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition cursor-pointer ${
                    selectedDay === 1 
                      ? 'border-purple-500 bg-purple-950/20 text-white' 
                      : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                  }`}
                  onClick={() => setSelectedDay(1)}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="text-xs">🎵</span>
                    <div className="truncate text-left">
                      <span className="font-bold text-slate-200 text-xs">TikTok浏览养号+评论</span>
                      <span className="text-slate-500 block text-xs">自动浏览推荐页视频并随机评论互动</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedDay === 1 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {selectedDay === 1 ? '已选择' : '选择'}
                    </span>
                  </div>
                </div>

                {/* Script Option 2 */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition cursor-pointer ${
                    selectedDay === 2 
                      ? 'border-purple-500 bg-purple-950/20 text-white' 
                      : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                  }`}
                  onClick={() => setSelectedDay(2)}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="text-xs">🔍</span>
                    <div className="truncate text-left">
                      <span className="font-bold text-slate-200 text-xs">TikTok搜索养号</span>
                      <span className="text-slate-500 block text-xs">根据人设兴趣关键词搜索并浏览视频</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedDay === 2 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {selectedDay === 2 ? '已选择' : '选择'}
                    </span>
                  </div>
                </div>

                {/* Script Option 3 */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono transition cursor-pointer ${
                    selectedDay === 3 
                      ? 'border-purple-500 bg-purple-950/20 text-white' 
                      : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                  }`}
                  onClick={() => setSelectedDay(3)}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="text-xs">❤️</span>
                    <div className="truncate text-left">
                      <span className="font-bold text-slate-200 text-xs">TikTok点赞+访问感兴趣主页</span>
                      <span className="text-slate-500 block text-xs">对目标视频点赞并访问创作者主页</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedDay === 3 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {selectedDay === 3 ? '已选择' : '选择'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Click run button */}
            <button 
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 hover:opacity-90 font-bold text-white text-xs rounded transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mt-4`}
            >
              <Play className="w-3.5 h-3.5 fill-currentScale" />
              {isSimulating ? `正在远程代运营养号中...` : `一键运行养号脚本`}
            </button>

          </div>

        </div>

        {/* 2.2 Terminal Log Simulation display (Right) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left h-full bento-glow-indigo">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4 justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="text-emerald-400 w-5 h-5" />
              <h3 className="text-xs font-bold text-slate-150">脚本执行控制台日志 (Console Logs)</h3>
            </div>
            
            {isSimulating && (
              <span className="text-xs bg-red-950 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded animate-pulse font-mono tracking-tight">
                EXECUTING...
              </span>
            )}
          </div>

          <div className="flex-1 bg-slate-800/20 rounded-xl border border-slate-800 flex flex-col p-4 h-[350px]">
            {/* Logs viewport */}
            <div 
              ref={logScrollRef}
              className="flex-1 overflow-y-auto space-y-1 bg-black/40 p-3 rounded border border-slate-900 font-mono text-xs text-left text-slate-400 select-all scrollbar-narrow"
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
            </div>

            {/* Run dynamic progress bar */}
            {isSimulating && (
              <div className="mt-3.5 pt-3.5 border-t border-slate-900">
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono mb-1.5">
                  <span>总计进度 (Accumulated progress):</span>
                  <span>{Math.round(simProgress)}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300" style={{ width: `${simProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
