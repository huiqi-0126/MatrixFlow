import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, CheckCircle, Play, Sliders, ChevronRight, Terminal,
  Search, Shield, Heart, Eye, Bookmark, MessageSquare, AlertCircle, HelpCircle, X, Camera, Image as ImageIcon
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

  // New States
  const [showParamsModal, setShowParamsModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'log' | 'screenshot'>('log');


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

    const dt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ',123';
    pushSimLog(`${dt} - INFO - HTTP Request: POST https://rc.guokers.com/mcp "HTTP/1.1 200 OK"`);
    pushSimLog(`${dt} - INFO - [${device.name}] 📸 截图: 0.1s`);
    pushSimLog(`${dt} - INFO - [${device.name}] LLM: page='feed', action='scroll', 'x': 0, 'y': 0, 'is_fashion': False, 'content_type': '宠物/日常', 'has_liked': False`);

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
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 h-full min-h-[500px]">

        {/* 2. Middle & Right panel: Plan List Planner Timeline + Virtual Simulator Output logs (8 columns) */}
        <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* 2.1 Timeline Selection (Left) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo flex-1">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2">
                <Calendar className="text-indigo-400 w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-150">5天拟真梯度算法养号计划</h3>
              </div>

              {/* Days buttons row */}
              <div className="grid grid-cols-5 gap-4 mb-2">
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
              </div>

              {/* Day detail preview */}
              <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex-1 min-h-[310px] flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs bg-purple-950 border border-purple-800 text-purple-400 px-2 py-0.5 rounded font-mono">
                      WARMUP SCRIPT
                    </span>
                    <span className="text-xs text-slate-300 font-bold truncate">养号脚本选择</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 text-left leading-relaxed">
                    选择养号脚本类型，系统将自动执行相应的模拟操作流程。
                  </p>

                  <span className="text-xs text-slate-500 font-bold block mb-2">养号脚本选择:</span>

                  <div className="space-y-4">
                    {/* Script Option 1 */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border text-xs font-mono transition cursor-pointer ${selectedDay === 1
                        ? 'border-purple-500 bg-purple-950/20 text-white'
                        : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                        }`}
                      onClick={() => setSelectedDay(1)}
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-2">
                        <span className="text-xs">🎵</span>
                        <div className="truncate text-left">
                          <span className="font-bold text-slate-200 text-xs">TikTok浏览养号+评论</span>
                          <span className="text-slate-500 block text-xs">自动浏览推荐页视频并随机评论互动</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${selectedDay === 1 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {selectedDay === 1 ? '已选择' : '选择'}
                        </span>
                      </div>
                    </div>

                    {/* Script Option 2 */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border text-xs font-mono transition cursor-pointer ${selectedDay === 2
                        ? 'border-purple-500 bg-purple-950/20 text-white'
                        : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                        }`}
                      onClick={() => setSelectedDay(2)}
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-2">
                        <span className="text-xs">🔍</span>
                        <div className="truncate text-left">
                          <span className="font-bold text-slate-200 text-xs">TikTok搜索养号</span>
                          <span className="text-slate-500 block text-xs">根据人设兴趣关键词搜索并浏览视频</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${selectedDay === 2 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {selectedDay === 2 ? '已选择' : '选择'}
                        </span>
                      </div>
                    </div>

                    {/* Script Option 3 */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border text-xs font-mono transition cursor-pointer ${selectedDay === 3
                        ? 'border-purple-500 bg-purple-950/20 text-white'
                        : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                        }`}
                      onClick={() => setSelectedDay(3)}
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-2">
                        <span className="text-xs">❤️</span>
                        <div className="truncate text-left">
                          <span className="font-bold text-slate-200 text-xs">TikTok点赞+访问感兴趣主页</span>
                          <span className="text-slate-500 block text-xs">对目标视频点赞并访问创作者主页</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${selectedDay === 3 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {selectedDay === 3 ? '已选择' : '选择'}
                        </span>
                      </div>
                    </div>
                    {/* Script Option 4 */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border text-xs font-mono transition cursor-pointer ${selectedDay === 4
                        ? 'border-purple-500 bg-purple-950/20 text-white'
                        : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                        }`}
                      onClick={() => setSelectedDay(4)}
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-2">
                        <span className="text-xs">📺</span>
                        <div className="truncate text-left">
                          <span className="font-bold text-slate-200 text-xs">直播间挂机+随机互动</span>
                          <span className="text-slate-500 block text-xs">自动进入热门直播间停留并发送暖场弹幕</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${selectedDay === 4 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {selectedDay === 4 ? '已选择' : '选择'}
                        </span>
                      </div>
                    </div>

                    {/* Script Option 5 */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border text-xs font-mono transition cursor-pointer ${selectedDay === 5
                        ? 'border-purple-500 bg-purple-950/20 text-white'
                        : 'border-slate-850 bg-slate-900/50 text-slate-400 hover:border-purple-500/30'
                        }`}
                      onClick={() => setSelectedDay(5)}
                    >
                      <div className="flex items-center gap-4 overflow-hidden mr-2">
                        <span className="text-xs">🎯</span>
                        <div className="truncate text-left">
                          <span className="font-bold text-slate-200 text-xs">垂直领域创作者回关</span>
                          <span className="text-slate-500 block text-xs">访问标签同赛道作者并执行"关注+留评"策略</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded ${selectedDay === 5 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {selectedDay === 5 ? '已选择' : '选择'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Upload custom script button */}
                  <div className="pt-2 border-t border-slate-800 mt-4">
                    <button className="w-full border border-dashed border-slate-700 hover:border-purple-500 hover:text-purple-400 text-slate-400 py-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-purple-900/10">
                      <span className="text-lg leading-none">+</span> 上传自定义执行脚本 (.json / .js)
                    </button>
                  </div>
                </div>

                {/* Click run button */}
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className={`w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-50 hover:opacity-90 font-bold text-white text-xs rounded transition shadow-lg flex items-center justify-center gap-4 cursor-pointer mt-3`}
                >
                  <Play className="w-3.5 h-3.5 fill-currentScale" />
                  {isSimulating ? `正在远程代运营养号中...` : `一键运行养号脚本`}
                </button>

              </div>

            </div>

          </div>
          {/* 2.2 Terminal Log Simulation display (Right) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left h-full bento-glow-indigo">
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
                </div>

                {/* Run dynamic progress bar hidden */}
              </div>

            </div>

          </div>
        </div>

      </div>

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
              {/* 1. Left controls panel: Simulation parameters (4 columns) */}
              <div className="w-full flex flex-col text-left">

                <div className="hidden">
                  <Sliders className="text-indigo-400 w-5 h-5" />
                  <h3 className="text-xs font-bold text-slate-150">养号自动化行为参数配置</h3>
                </div>

                <div className="space-y-4 text-xs font-mono">

                  <div>
                    <div className="flex justify-between items-center mb-2">
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
                    <div className="flex justify-between items-center mb-2">
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
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
                          className="w-full accent-purple-400 bg-slate-850 h-1 rounded"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 mt-3 leading-normal text-xs text-slate-400">
                    <span className="font-bold text-slate-300 block mb-2">🛠️ 反反作弊防封设计 (Anti-Ban Design):</span>
                    使用基于特定概率的非固定动作时间（如浏览时长30-50s随机分布），有效模拟海外真实用户在手势滑动、停留聚焦上的不规则行为特征。
                  </div>

                </div>

              </div>


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
    </>
  );
}
