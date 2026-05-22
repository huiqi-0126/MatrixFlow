import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, CheckCircle, Play, Sliders, ChevronRight, ChevronLeft, Terminal,
  Search, Shield, Heart, Eye, Bookmark, MessageSquare, AlertCircle, HelpCircle, X, Camera, Image as ImageIcon, Zap
} from 'lucide-react';
import { WarmupPlan, WarmupAction, Device } from '../types';
import { DEFAULT_WARMUP_PLANS } from '../constants';

const MOCK_RESULTS = Array.from({ length: 20 }).map((_, i) => {
  const isFailed = i === 3 || i === 12;
  return {
    name: i % 3 === 0 ? '日常活跃养号' : i % 3 === 1 ? '深度互动计划' : '竞品主页截流',
    time: `2026-05-${String(22 - Math.floor(i / 3)).padStart(2, '0')} ${String(8 + (i * 3) % 14).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}:00`,
    duration: isFailed ? `${(Math.random() * 5 + 1).toFixed(1)}m` : `${(Math.random() * 10 + 15).toFixed(1)}m`,
    v_likes: isFailed ? 0 : Math.floor(Math.random() * 5),
    open_comm: isFailed ? 0 : Math.floor(Math.random() * 8 + 2),
    scroll_comm: isFailed ? 0 : Math.floor(Math.random() * 20 + 5),
    c_likes: isFailed ? 0 : Math.floor(Math.random() * 4),
    c_replies: isFailed ? 0 : Math.floor(Math.random() * 2),
    c_news: isFailed ? 0 : (i % 5 === 0 ? 1 : 0),
    status: isFailed ? 'failed' : 'success'
  };
});

interface WarmupPlannerProps {
  device: Device;
  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number }) => void;
}

export default function WarmupPlanner({ device, onUpdateDeviceStats }: WarmupPlannerProps) {
  const todayDate = new Date();
  const [calendarShift, setCalendarShift] = useState<number>(0);
  const CALENDAR_DAYS = Array.from({ length: 7 }).map((_, i) => {
    const offset = i - 3 + calendarShift;
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + offset);
    const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      offset,
      dateStr,
      label: offset === 0 ? '今日' : `周${['日', '一', '二', '三', '四', '五', '六'][d.getDay()]}`,
      type: offset <= 0 ? 'executed' : 'planned'
    };
  });
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [plans, setPlans] = useState<WarmupPlan[]>(DEFAULT_WARMUP_PLANS);
  const selectedDay = 1; // dummy for compatibility
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [activeActionIndex, setActiveActionIndex] = useState<number>(-1);
  const [currentCountdown, setCurrentCountdown] = useState<number>(0);

  // New States
  const [showParamsModal, setShowParamsModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'log' | 'screenshot' | 'results'>('log');
  const [hasPlanned, setHasPlanned] = useState<boolean>(false);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);

  // Agent activation
  const [agentActivated, setAgentActivated] = useState<boolean>(false);
  const [agentMode, setAgentMode] = useState<'fullAuto' | 'userConfirm'>('fullAuto');


  // Automation Slider Parameters
  const [concurrentDevices, setConcurrentDevices] = useState(2);
  const [totalMinutes, setTotalMinutes] = useState(20);
  const [likeProb, setLikeProb] = useState(15);
  const [maxLikes, setMaxLikes] = useState(8);
  const [bookmarkProb, setBookmarkProb] = useState(10);
  const [commentAreaProb, setCommentAreaProb] = useState(30);
  const [replyCreatorProb, setReplyCreatorProb] = useState(5);
  const [visitAuthorProb, setVisitAuthorProb] = useState(15);
  const [newCommentProb, setNewCommentProb] = useState(0);
  const [failLimit, setFailLimit] = useState(3);
  const [forwardProb, setForwardProb] = useState(5);
  const [maxComments, setMaxComments] = useState(3);
  const [likeCommentProb, setLikeCommentProb] = useState(40);

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

  const handleSmartPlan = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
      setHasPlanned(true);
    }, 10000);
  };

  const handleRunSimulation = () => {
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

    const dt = () => new Date().toISOString().replace('T', ' ').substring(0, 19) + ',' + Math.floor(Math.random() * 999).toString().padStart(3, '0');

    const initLogs = [
      `${dt()} - INFO - 并发度: ${concurrentDevices} 台设备同时操作`,
      `${dt()} - INFO - [${device.name}] ========== 开始养号 ==========`,
      `${dt()} - INFO - [${device.name}] MCP 连接已建立`,
      `${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`,
      `${dt()} - INFO - Received session ID: 4de51ff9-4271-45dd-9131-c74d269bf436`,
      `${dt()} - INFO - Negotiated protocol version: 2025-06-18`,
      `${dt()} - INFO - [${device.name}] MCP Session 已初始化`,
      `${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 202 Accepted"`,
      `${dt()} - INFO - HTTP Request: GET https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`,
      `${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`,
      `${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`,
      `${dt()} - INFO - [${device.name}] 唤醒 TikTok 到前台...`,
      `${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`,
      `${dt()} - INFO - [${device.name}] 开始养号循环，计划时长 ${totalMinutes} 分钟...`,
      ` `
    ];

    let delay = 0;
    initLogs.forEach(l => {
      setTimeout(() => pushSimLog(l), delay);
      delay += 120; // 快速顺序输出
    });

    setTimeout(() => {
      executeStep(0);
    }, delay + 400);
  };

  const executeStep = (actionIdx: number) => {
    if (actionIdx >= activePlan.actions.length) {
      // Completed plan
      setTimeout(() => {
        setIsSimulating(false);
        setSimProgress(100);
        setActiveActionIndex(-1);
        setCurrentCountdown(0);
        pushSimLog(`[${device.name}] --- loop#100 15.0min / 15min | v_likes=12 comm=5 ---`);
        pushSimLog(`2026-05-21 18:15:00,000 - INFO - ✅ [SUCCESS] Day ${selectedDay} Warmup schedule completed!`);
        // Credit statistics view
        onUpdateDeviceStats(device.id, { viewsAdd: 150, followersAdd: 2 });
      }, 1000);
      return;
    }

    setActiveActionIndex(actionIdx);
    const action = activePlan.actions[actionIdx];
    let actionDuration = Math.max(1, Math.round(action.duration / 2)); // 加快一倍
    setCurrentCountdown(actionDuration);

    const dt = () => new Date().toISOString().replace('T', ' ').substring(0, 19) + ',' + Math.floor(Math.random() * 999).toString().padStart(3, '0');

    let logsToPush: string[] = [];

    switch (action.type) {
      case 'search':
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - LLM: page={'page_type': 'search', 'action': 'input', 'param': '${action.param}'}`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ LLM 调用: 3.0s`);
        break;
      case 'scroll':
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - LLM: page={'page_type': 'feed', 'action': 'scroll', 'is_fashion': False, 'content_type': '电影广告/星球大战', 'has_liked': False, 'reason': '当前是Star Wars电影广告，不是AI工具/AI应用相关内容，直接下滑跳过继续刷视频'}, action=scroll, reason=当前是Star Wars电影广告，不是AI工具/AI应用相关内容，直接下滑跳过继续刷视频`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ LLM 调用: 3.4s`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] 📺 page=feed, action=scroll, AI=False, type=电影广告/星球大战, reason=当前是Star Wars电影广告，不是AI工具/AI应用相关内容，直接下滑跳过继续刷视频`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⬇️ 下滑: 0.47屏, 0.17s`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏸️ 停顿 4.8s`);
        break;
      case 'like':
        logsToPush.push(`${dt()} - INFO - [${device.name}] ❤️ 点赞: (0.91, 0.47)`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⬇️ 看完下滑`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        logsToPush.push(` `);
        logsToPush.push(`[${device.name}] --- loop#54 10.2min / 15min | v_likes=8 comm=3 ---`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ 截图: 0.1s`);
        break;
      case 'bookmark':
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - LLM: page={'page_type': 'feed', 'action': 'scroll', 'x': 0, 'y': 0, 'is_fashion': False, 'content_type': '宠物/日常', 'has_liked': False, 'reason': '当前视频是宠物相关内容（与狗狗约会/遛狗日常），不属于AI工具/AI应用相关内容，直接下滑跳过继续刷视频'}, action=scroll, reason=当前视频是宠物相关内容（与狗狗约会/遛狗日常），不属于AI工具/AI应用相关内容，直接下滑跳过继续刷视频`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] 📺 page=feed, action=scroll, AI=False, type=宠物/日常, reason=当前视频是宠物相关内容（与狗狗约会/遛狗日常），不属于AI工具/AI应用相关内容，直接下滑跳过继续刷视频`);
        break;
      case 'comment':
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - LLM: page={'page_type': 'feed', 'action': 'watch_like_and_comment', 'like_x': 0.912, 'like_y': 0.418, 'comment_x': 0.912, 'comment_y': 0.518, 'favorite_x': 0.912, 'favorite_y': 0.618, 'share_x': 0.912, 'share_y': 0.718, 'is_fashion': True, 'content_type': 'AI工具', 'has_liked': False, 'reason': '当前视频是关于Claude AI的MEMORY 2.0和DREAM功能更新，属于AI工具/AI应用相关内容。右侧心形按钮为白色轮廓，尚未点赞，需要点赞并互动。'}, action=watch_like_and_comment`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ LLM 调用: 5.4s`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] 📺 page=feed, action=watch_like_and_comment, AI=True, type=AI工具`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] 👀 AI视频(AI工具)，看 13.4s`);
        break;
      case 'profile':
        logsToPush.push(` `);
        logsToPush.push(`[${device.name}] --- loop#55 10.3min / 15min | v_likes=8 comm=3 ---`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ 截图: 0.1s`);
        logsToPush.push(`${dt()} - INFO - [${device.name}] 🚀 快速下滑（跳过 LLM，连续 2 次 scroll）`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        break;
      case 'share':
        logsToPush.push(`${dt()} - INFO - [${device.name}] ⏱️ LOOP#55 total=6.2s [ss=0.1 llm=0.0 mcp=0.0 sleep=0.0 guard=0.0 other=6.1] action=fast_scroll`);
        logsToPush.push(` `);
        logsToPush.push(`[${device.name}] --- loop#56 10.5min / 15min | v_likes=8 comm=3 ---`);
        logsToPush.push(`${dt()} - INFO - HTTP Request: POST https://rc.guokecs.com/mcp "HTTP/1.1 200 OK"`);
        break;
    }

    // Output logs sequentially
    let delay = 0;
    logsToPush.forEach(l => {
      setTimeout(() => pushSimLog(l), delay);
      if (l.includes('HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com')) {
        delay += 1200; // wait 1.2s to simulate LLM processing time
      } else {
        delay += 50; // output next logs much faster (50ms)
      }
    });

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
      pushSimLog(` `);
      pushSimLog(`[${device.name}] --- loop#${56 + actionIdx} 10.6min / 15min | v_likes=8 comm=3 ---`);
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
    <div className="flex flex-col h-full gap-4">
      {/* ─── Agent Control Header ─── */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">社交互动智能体</span>
              {agentActivated
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">● 已激活</span>
                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-500">○ 未激活</span>
              }
            </div>
            <p className="text-xs text-slate-500 mt-0.5">激活后自动规划养号互动技能，模拟真人浏览防封号</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!agentActivated ? (
            <button onClick={() => { setAgentActivated(true); if (!hasPlanned && !isPlanning) handleSmartPlan(); }} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer">
              激活智能体
            </button>
          ) : (
            <button onClick={() => setAgentActivated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer">
              停用
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 flex-1 min-h-0">

        {/* 2. Middle & Right panel: Plan List Planner Timeline + Virtual Simulator Output logs (8 columns) */}
        <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* 2.1 Timeline Selection (Left) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-col text-left shadow-lg shadow-slate-900/50 flex-1">
              <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4 mb-2">
                <Calendar className="text-indigo-400 w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-150">拟真梯度算法养号日历</h3>
              </div>

              {/* Days buttons row */}
              {!hasPlanned ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
                  {isPlanning ? (
                    <div className="w-full max-w-xs text-center">
                      <div className="text-slate-300 text-xs font-bold mb-3">大模型正在基于人设画像自动规划互动剧本...</div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden w-full">
                        <div className="h-full bg-purple-500 animate-pulse w-full origin-left" style={{ animation: 'progress 10s ease-in-out forwards' }}></div>
                      </div>
                      <style>{`@keyframes progress { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-4 opacity-50">🤖</div>
                      <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
                        当前暂无互动规划数据。<br />请点击下方按钮，由系统根据该账号的垂直领域自动生成5天阶梯式的养号剧本。
                      </p>
                      <p className="text-xs text-slate-600 text-center">激活上方「社交互动智能体」后自动开始规划</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* 2.1 Calendar Header (7-Day Agent Execution Planner) */}
                  <div className="flex items-center mb-4 bg-slate-900 border border-slate-700/50 rounded-xl p-1 shadow-inner relative">
                    <button 
                      onClick={() => setCalendarShift(s => s - 7)}
                      className="px-1 py-4 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="上周"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-y-0 left-6 right-6 bg-indigo-500/20 rounded-xl pointer-events-none" style={{ width: `${simProgress}%`, transition: 'width 1s linear' }}></div>
                    <div className="flex-1 flex justify-between items-center px-1">
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
                    </div>
                    <button 
                      onClick={() => setCalendarShift(s => s + 7)}
                      className="px-1 py-4 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="下周"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Panel Content based on Selection */}
                  {selectedDayOffset <= 0 ? (
                    <div className="bg-slate-800/20 rounded-xl border border-slate-700/50 flex-1 overflow-hidden relative flex flex-col mb-3">
                      <div className="flex items-center gap-4 p-4 border-b border-slate-700/50 shrink-0 bg-slate-900/50">
                        <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          EXECUTED TASKS
                        </span>
                        <span className="text-xs text-slate-300 font-bold truncate">已执行结果列表</span>
                        <span className="text-[10px] text-slate-500 ml-auto">共 {3 + ((Math.abs(selectedDayOffset) * 7 + 5) % 6)} 条记录</span>
                      </div>
                      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-narrow">
                        <table className="w-full text-left text-xs text-slate-300 font-mono whitespace-nowrap min-w-[600px]">
                          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-slate-700/50">
                            <tr className="text-slate-500 uppercase">
                              <th className="py-2.5 px-3 font-bold">技能名称</th>
                              <th className="py-2.5 px-2 font-bold">时间</th>
                              <th className="py-2.5 px-2 font-bold text-center">操作</th>
                              <th className="py-2.5 px-2 font-bold">状态</th>
                              <th className="py-2.5 px-2 font-bold">赞视</th>
                              <th className="py-2.5 px-2 font-bold">赞评</th>
                              <th className="py-2.5 px-2 font-bold">回评</th>
                              <th className="py-2.5 px-2 font-bold">新评</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {MOCK_RESULTS.slice(0, 3 + ((Math.abs(selectedDayOffset) * 7 + 5) % 6)).map((res, i) => (
                              <tr key={i} className="hover:bg-slate-800/50 transition group">
                                <td className="py-2 px-3 font-bold text-slate-200 truncate max-w-[120px]">{res.name}</td>
                                <td className="py-2 px-2 text-slate-400">{res.time.split(' ')[1]}</td>
                                <td className="py-2 px-2 text-center">
                                  <div className="flex items-center justify-center gap-1 transition">
                                    <button onClick={() => setViewMode('log')} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-950/40 text-sky-400 hover:bg-sky-900/60 transition cursor-pointer">日志</button>
                                    <button onClick={() => setViewMode('screenshot')} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 transition cursor-pointer">截图</button>
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
                    <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/50 flex-1 flex flex-col justify-start space-y-3 overflow-y-auto scrollbar-narrow mb-3">
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
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition group">
                          <div className="flex items-center gap-4 overflow-hidden mr-2">
                            <span className="text-slate-400 font-bold font-mono text-sm">{script.time}</span>
                            <div className="truncate text-left">
                              <span className="font-bold text-slate-200 text-xs block">{script.name}</span>
                              <span className="text-slate-500 block text-[10px] mt-0.5">预计执行时长: {script.dur}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition">
                            <button
                              onClick={handleRunSimulation}
                              disabled={isSimulating}
                              className="text-[10px] font-bold bg-indigo-600/80 hover:bg-indigo-500 text-white px-2 py-1 rounded transition shadow-lg shadow-indigo-500/20 flex items-center gap-1 disabled:opacity-50"
                            >
                              <Play className="w-3 h-3" /> 立即执行
                            </button>
                            <button className="text-[10px] font-bold bg-slate-800 border border-slate-700 hover:bg-red-900/60 text-slate-400 hover:text-red-400 px-2 py-1 rounded transition">
                              删除
                            </button>
                          </div>
                        </div>
                      ))}

                      <button className="w-full mt-2 border border-dashed border-slate-700 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-600 transition text-slate-400 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                        + 添加自动执行技能
                      </button>
                    </div>
                  )}


                </>
              )}

            </div>

          </div>
          {/* 2.2 Terminal Log Simulation display (Right) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-col text-left h-full shadow-lg shadow-slate-900/50">
              {(selectedDayOffset <= 0 || isSimulating) ? (
                <>
                  <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4 mb-2 justify-between">
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
                          pushSimLog(`${dt} - INFO - 🛑 技能已手动终止`);
                        }}
                        className="text-xs bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-900/50 px-2 py-1 rounded transition font-bold font-mono tracking-tight flex items-center cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 mr-1.5 animate-pulse" />
                        停止
                      </button>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-800/20 rounded-xl border border-slate-700/50 flex flex-col p-4 h-[350px]">
                    {/* Viewport */}
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                      {viewMode === 'log' ? (
                        <div
                          ref={logScrollRef}
                          className="absolute inset-0 overflow-y-auto space-y-1.5 bg-black/80 p-4 rounded border border-slate-900 font-mono text-[10px] text-left text-slate-400 select-all scrollbar-narrow leading-tight"
                        >
                          {(simLogs.length === 0 && !isSimulating && hasPlanned) ? (
                            [
                              "2026-05-21 14:30:00,123 - INFO - [iPhone 8 Plus #01] ========== 开始历史任务恢复 ==========",
                              "2026-05-21 14:30:01,456 - INFO - [iPhone 8 Plus #01] MCP 连接已建立",
                              "2026-05-21 14:30:02,789 - INFO - HTTP Request: POST https://rc.guokecs.com/mcp \"HTTP/1.1 200 OK\"",
                              "2026-05-21 14:30:05,123 - INFO - [iPhone 8 Plus #01] 唤醒 TikTok 到前台...",
                              "2026-05-21 14:30:08,456 - INFO - [iPhone 8 Plus #01] 📺 page=feed, action=scroll, AI=False, type=电影广告/星球大战, reason=当前是Star Wars电影广告，直接下滑跳过",
                              "2026-05-21 14:30:10,789 - INFO - [iPhone 8 Plus #01] ⬇️ 下滑: 0.47屏, 0.17s",
                              "2026-05-21 14:31:15,123 - INFO - HTTP Request: POST https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions \"HTTP/1.1 200 OK\"",
                              "2026-05-21 14:31:16,456 - INFO - LLM: page={'page_type': 'feed', 'action': 'watch_like_and_comment', 'content_type': 'AI工具'}",
                              "2026-05-21 14:31:18,789 - INFO - [iPhone 8 Plus #01] 👀 AI视频(AI工具)，看 13.4s",
                              "2026-05-21 14:31:32,123 - INFO - [iPhone 8 Plus #01] ❤️ 点赞: (0.91, 0.47)",
                              "2026-05-21 14:35:00,456 - INFO - [iPhone 8 Plus #01] --- loop#56 10.5min / 15min | v_likes=8 comm=3 ---",
                              "2026-05-21 14:45:00,789 - INFO - ✅ [SUCCESS] 历史养号技能执行完成！"
                            ].map((log, i) => {
                              let col = 'text-slate-300';
                              if (log.includes('INFO - HTTP')) col = 'text-slate-500';
                              else if (log.includes('LLM: page=')) col = 'text-sky-400';
                              else if (log.includes('--- loop=')) col = 'text-purple-400';
                              else if (log.includes('SUCCESS')) col = 'text-emerald-400 font-bold';

                              return (
                                <div key={i} className={`break-all ${col}`}>
                                  {log}
                                </div>
                              );
                            })
                          ) : simLogs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                              <Terminal className="w-8 h-8 mb-2" />
                              <span>{hasPlanned ? '等待指令... 正在启动技能。' : agentActivated ? '智能体正在规划任务中，请稍候...' : '等待指令... 请先激活社交互动智能体。'}</span>
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
                    系统将自动探测设备的空闲状态，并在指定的计划时间点，免干预下发并自动执行排队中的技能。
                  </p>

                  <div className="mt-8 flex gap-3 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 z-10">
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
          {/* Run dynamic progress bar hidden */}
        </div>
      </div>

      {showParamsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Sliders className="text-indigo-400 w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-150">技能运行参数配置</h3>
              </div>
              <button onClick={() => setShowParamsModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-narrow">
              {/* 1. Left controls panel: Simulation parameters (4 columns) */}
              <div className="w-full flex flex-col text-left">

                <div className="hidden">
                  <Sliders className="text-indigo-400 w-5 h-5" />
                  <h3 className="text-xs font-bold text-slate-150">养号自动化行为参数配置</h3>
                </div>

                <div className="space-y-4 text-xs font-mono">

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400">预估养号时长 (Total Minutes)</span>
                      <span className="text-purple-400 font-bold">{totalMinutes} 分钟/天</span>
                    </div>
                    <input
                      type="range" min="5" max="60" step="5"
                      value={totalMinutes}
                      onChange={(e) => setTotalMinutes(Number(e.target.value))}
                      className="w-full accent-purple-500 bg-slate-800/80 h-1 rounded"
                    />
                  </div>

                  <div className="border-t border-slate-700/50 pt-3">
                    <span className="text-xs text-slate-500 font-bold block mb-2 uppercase">互动概率参数控制 (Action Rates %)</span>

                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">双击点赞率</span>
                          <span className="text-slate-200">{likeProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={likeProb}
                          onChange={(e) => setLikeProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">单次养号点赞数上限</span>
                          <span className="text-slate-200">{maxLikes} 个</span>
                        </div>
                        <input
                          type="range" min="1" max="25"
                          value={maxLikes}
                          onChange={(e) => setMaxLikes(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">视频收藏率 (Bookmark)</span>
                          <span className="text-slate-200">{bookmarkProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="50" step="5"
                          value={bookmarkProb}
                          onChange={(e) => setBookmarkProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">进入评论区及停留</span>
                          <span className="text-slate-200">{commentAreaProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={commentAreaProb}
                          onChange={(e) => setCommentAreaProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">转发视频概率</span>
                          <span className="text-slate-200">{forwardProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="50" step="5"
                          value={forwardProb}
                          onChange={(e) => setForwardProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">最多评论数</span>
                          <span className="text-slate-200">{maxComments}</span>
                        </div>
                        <input
                          type="range" min="0" max="10"
                          value={maxComments}
                          onChange={(e) => setMaxComments(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">评论点赞概率</span>
                          <span className="text-slate-200">{likeCommentProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={likeCommentProb}
                          onChange={(e) => setLikeCommentProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">评论回复概率</span>
                          <span className="text-slate-200">{replyCreatorProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={replyCreatorProb}
                          onChange={(e) => setReplyCreatorProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">发新评论概率</span>
                          <span className="text-slate-200">{newCommentProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={newCommentProb}
                          onChange={(e) => setNewCommentProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">子流程连续失败上限</span>
                          <span className="text-slate-200">{failLimit}</span>
                        </div>
                        <input
                          type="range" min="1" max="10"
                          value={failLimit}
                          onChange={(e) => setFailLimit(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2 text-xs">
                          <span className="text-slate-400">查看作者主页可能性</span>
                          <span className="text-slate-200">{visitAuthorProb}%</span>
                        </div>
                        <input
                          type="range" min="0" max="50" step="5"
                          value={visitAuthorProb}
                          onChange={(e) => setVisitAuthorProb(Number(e.target.value))}
                          className="w-full accent-purple-400 bg-slate-800/80 h-1 rounded"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 mt-3 leading-normal text-xs text-slate-400">
                    <span className="font-bold text-slate-300 block mb-2">🛠️ 反反作弊防封设计 (Anti-Ban Design):</span>
                    使用基于特定概率的非固定动作时间（如浏览时长30-50s随机分布），有效模拟海外真实用户在手势滑动、停留聚焦上的不规则行为特征。
                  </div>

                </div>

              </div>


            </div>

            <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-end gap-3">
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
                确认并运行技能
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
