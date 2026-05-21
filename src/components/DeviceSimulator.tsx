import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone, Shield, Power, Play, RefreshCw, Send,
  Camera, Cpu, Terminal, ArrowUp, ArrowDown, Award,
  CheckCircle, AlertTriangle, HelpCircle, Flame, Heart, MessageCircle, Bookmark, Share2, Search,
  X, Keyboard, Home, Box, Skull, Lock, Globe, Check
} from 'lucide-react';
import { Device, Persona } from '../types';

interface DeviceSimulatorProps {
  device: Device;
  persona: Persona;
  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;
}

export default function DeviceSimulator({ device, persona, onUpdateDeviceStats }: DeviceSimulatorProps) {
  // Navigation: Springboard 'home' or internal screens
  const [phoneScreen, setPhoneScreen] = useState<'home' | 'feed' | 'creator' | 'posting' | 'warmup_running' | 'weather' | 'safari' | 'instagram' | 'troll' | 'troll2' | 'generic_app'>('home');
  const [genericAppName, setGenericAppName] = useState<string>('');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  // Toggles & Controls based on the image
  const [isSavingFlow, setIsSavingFlow] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [orientationLocked, setOrientationLocked] = useState<boolean>(true);

  // Modals / Overlays
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [inputTextVal, setInputTextVal] = useState<string>('');
  const [showAiVisionModal, setShowAiVisionModal] = useState<boolean>(false);
  const [appSelecting, setAppSelecting] = useState<boolean>(false);

  // Shell & AI States (integrated & kept as background logic + modal feedback)
  const [shellLogs, setShellLogs] = useState<string[]>([
    `[SYSTEM] Connected to MCP proxy daemon at ${device.ip}:8821`,
    `[SYSTEM] Residential IP verified (${device.region}).`,
    `[SYSTEM] Device status: IDLE.`
  ]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null);

  const [aiAnalysis, setAiAnalysis] = useState({
    prompt: '',
    result: '',
    score: 0,
    tags: [] as string[],
    actionSuggested: '',
    analyzing: false
  });

  // Simulated TikTok Feed State
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [videoLiked, setVideoLiked] = useState<Record<number, boolean>>({});
  const [videoBookmarked, setVideoBookmarked] = useState<Record<number, boolean>>({});
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [currentWarmupActionText, setCurrentWarmupActionText] = useState<string>('');

  const mockFeedVideos = [
    {
      id: 1,
      creator: '@aesthetic_creations',
      description: 'Satisfying Matcha Whisking tutorial for slow meditation afternoons. Pouring hot almond milk.',
      hashtags: '#matchalove #asmrcooking #morningrelax #lifestyle',
      likes: '45.2K',
      comments: '348',
      type: 'aesthetic-cooking'
    },
    {
      id: 2,
      creator: '@alpha_shred',
      description: '5:00 AM motivation. This deadlift form correction will save your lower back immediately.',
      hashtags: '#fitnesshacks #weightlifting #deadliftform #gymtok',
      likes: '128.4K',
      comments: '1.2K',
      type: 'fitness'
    },
    {
      id: 3,
      creator: '@hypebeast_nyc',
      description: 'Thrifting rare vintage OOTD pieces in Tokyo streetwear alleyway. How is this combo?',
      hashtags: '#streetwearideas #tokyothrift #vintageprada #ootdinspo',
      likes: '94.1K',
      comments: '891',
      type: 'streetwear'
    },
    {
      id: 4,
      creator: '@clean_gadgets',
      description: 'The most satisfying mechanical keyboard clicking sound of 2026. Custom keycaps review.',
      hashtags: '#keyboardasmr #desksetup #unboxingtech #mechanicalkeyboards',
      likes: '254.1K',
      comments: '3.4K',
      type: 'tech-gadgets'
    }
  ];

  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    setShellLogs(prev => [...prev.slice(-30), `[${timestamp}] ${text}`]);
  };

  // Automated Warmup Timeline Simulation
  const startWarmupSimulation = () => {
    if (phoneScreen === 'warmup_running') return;
    setPhoneScreen('warmup_running');
    setSimulationProgress(5);
    addLog(`🚀 [AGENT] Launching AI-guided Warmup Automation...`);
    addLog(`🚀 [AGENT] Target Niche: ${device.niche} (${persona.tone} style)`);

    const states = [
      { p: 15, text: `Opening TikTok application client...`, statusText: '正在开启App客户端...' },
      { p: 40, text: `Bypassing CAPTCHA via residential proxy IP ${device.ip}`, statusText: '成功锁定安全通道，载入首页Feed...' },
      { p: 70, text: `Automated search query for keywords: "${persona.interests[0]}"`, statusText: '智能搜索垂类关键词: ' + persona.interests[0] },
      { p: 90, text: `Precision watch-rate simulator running (42s)`, statusText: '安全驻留浏览，执行行为拟真算法...' },
      { p: 100, text: `Smart comment and double-tap bookmark injected`, statusText: '完成点赞和收藏。本日养号任务结束。' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < states.length) {
        setSimulationProgress(states[currentStep].p);
        setCurrentWarmupActionText(states[currentStep].statusText);
        addLog(`📦 [WARMUP] ${states[currentStep].text}`);

        if (currentStep === 4) {
          onUpdateDeviceStats(device.id, { viewsAdd: 120, followersAdd: 2 });
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setPhoneScreen('feed');
        addLog(`✅ [AGENT] Warmup run finished successfully.`);
      }
    }, 2000);
  };

  // Vision AI Diagnostics for the current screen
  const triggerScreenshotAnalysis = () => {
    setIsCapturing(true);
    addLog(`📸 Taking iOS device screen frame screenshot remotely via safe channel...`);

    setTimeout(() => {
      setIsCapturing(false);
      setShowAiVisionModal(true);

      const current_active_video = mockFeedVideos[activeFeedIndex];
      let screenDescription = '';
      if (phoneScreen === 'feed') {
        screenDescription = `TikTok active video player. Creator: ${current_active_video.creator}, Description: "${current_active_video.description}", hashtags: ${current_active_video.hashtags}. Niche match for ${device.niche}.`;
      } else if (phoneScreen === 'home') {
        screenDescription = `iOS Springboard home screen displaying custom grid of 24 applications. IP status: SECURE, Residential node healthy.`;
      } else if (phoneScreen === 'weather') {
        screenDescription = `iOS Stock Weather application. Active weather diagnostic for node region: ${device.region}.`;
      } else if (phoneScreen === 'creator') {
        screenDescription = `TikTok Creator Analytics. Account views post count stands at ${device.totalViews}.`;
      } else {
        screenDescription = `Active App screen mock view for ${genericAppName || 'Springboard'}. Security check cleared.`;
      }

      setCapturedScreenshot(screenDescription);
      setAiAnalysis(prev => ({ ...prev, analyzing: true }));

      setTimeout(() => {
        const isMatchingNiche = current_active_video.type === device.niche;
        const scoreValue = phoneScreen === 'feed' ? (isMatchingNiche ? 95 : 45) : 88;

        setAiAnalysis({
          prompt: `Analyze active mockup frame: "${screenDescription}" inside device niche "${device.niche}".`,
          result: `[GEMINI VISION ASSISTANT v1.5]
Screen type: ${phoneScreen.toUpperCase()} Remote Cast
Ip Routing Channel: ${device.ip} (${device.region})
- Visual diagnosis confirms perfect render flow.
- Active niche classification has a confidence factor of ${scoreValue}%.
- Interface signals consistent touch focus. Residential tunnel delay benchmark: 48ms. Always lock orientation during active tasks.`,
          score: scoreValue,
          tags: phoneScreen === 'feed' ? current_active_video.hashtags.split(' ') : ['#remote_test', '#residential_node', `#${device.niche}`],
          actionSuggested: phoneScreen === 'feed'
            ? (isMatchingNiche ? "Keep feeding like triggers to lock algorithms." : "Quick swipe to drop non-niche weights.")
            : "Platform status remains robust. Post scheduler recommended.",
          analyzing: false
        });
        addLog(`✨ Gemini Vision diagnostic report compiled successfully.`);
      }, 1500);

    }, 800);
  };

  // Simulated Text Injection Trigger
  const handleInjectedTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTextVal.trim()) return;
    addLog(`⌨️ [INPUT EVENT] Injected text to active view: "${inputTextVal}"`);
    setShowInputModal(false);
    setInputTextVal('');
  };

  // Handlers for Springboard actions
  const killActiveApp = () => {
    setPhoneScreen('home');
    setGenericAppName('');
    addLog(`💀 [PROCESS CONTROL] Terminating active tasks... Process killed. Code: 0`);
  };

  // Complete List of Springboard Apps from reference image
  const appsList = [
    { id: 'weather', name: '天气', color: 'bg-gradient-to-br from-indigo-400 to-sky-300', icon: '☀️' },
    { id: 'stocks', name: '股市', color: 'bg-zinc-950 border border-slate-800', icon: '📈' },
    { id: 'targets', name: '健康健康', color: 'bg-gradient-to-br from-green-400 to-teal-500', icon: '🟢' },
    { id: 'home_app', name: '家庭', color: 'bg-gradient-to-b from-orange-400 to-yellow-300', icon: '🏠' },
    { id: 'books', name: '图书', color: 'bg-gradient-to-tr from-orange-500 to-yellow-500', icon: '📖' },
    { id: 'appstore', name: 'App Store', color: 'bg-indigo-650', icon: '⭐' },
    { id: 'fitness', name: '健身', color: 'bg-black border border-stone-800', icon: '⭕' },
    { id: 'watch', name: 'Watch', color: 'bg-zinc-900', icon: '⌚' },
    { id: 'contacts', name: '通讯录', color: 'bg-amber-100 text-stone-900', icon: '👤' },
    { id: 'translate', name: '翻译', color: 'bg-zinc-800', icon: '🌐' },
    { id: 'files', name: '文件', color: 'bg-slate-50 text-blue-500', icon: '📂' },
    { id: 'shortcuts', name: '快捷指令', color: 'bg-zinc-900', icon: '⚡' },
    { id: 'folder', name: '实用工具', color: 'bg-slate-800/40 border border-slate-700/40', icon: '📁' },
    { id: 'wave', name: '录音机', color: 'bg-cyan-950', icon: '〰️' },
    { id: 'bulb', name: '提醒事项', color: 'bg-amber-400 text-slate-900', icon: '💡' },
    { id: 'hourglass', name: '沙漏早知道', color: 'bg-gradient-to-tr from-rose-500 to-orange-500', icon: '⏳' },
    { id: 'sync', name: '智能同步', color: 'bg-blue-900', icon: '🔄' },
    { id: 'mcn_hub', name: 'MCN中心', color: 'bg-gradient-to-br from-indigo-600 to-purple-800', icon: '📦', badge: 7 },
    { id: 'feed', name: 'TikTok', color: 'bg-black border border-zinc-800', icon: '🎵', badge: 7 },
    { id: 'troll', name: 'Troll LOL', color: 'bg-orange-100 text-slate-800', icon: '😜' },
    { id: 'troll2', name: 'Troll Blue', color: 'bg-sky-100 text-slate-800', icon: '🥶' },
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600', icon: '📸' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-650', icon: '📺', badge: 7 },
    { id: 'reddit', name: 'Reddit', color: 'bg-orange-550', icon: '👽', badge: 7 }
  ];

  return (
    <div className="flex flex-col text-left space-y-4 text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ==================== 1. LEFT PANEL: Full Device Metadata (5 Columns) ==================== */}
        <div className="lg:col-span-5 flex flex-col gap-4 text-left">

          {/* Main User Card with Phone Status Badge */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-705 transition bento-glow-indigo">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shadow-inner">
              <Smartphone className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-white tracking-tight">{device.name}</span>
                <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
                  使用中
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-3 block">iOS 16.7.12</span>
            </div>
          </div>

          {/* Core Info Keys */}
          <div className="space-y-5">
            {[
              { key: '设备ID', val: `exgk-iphone-1` },
              { key: '分辨率', val: '750 × 1334' },
              { key: '通道号', val: 'exgk' },
              { key: '首次上线', val: '2026/4/13 01:21:02' },
              { key: '最后在线', val: '2026/5/22 00:10:51' },
              { key: '使用人', val: `admin (${device.ip})` }
            ].map(item => (
              <div key={item.key} className="bg-slate-905/30 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-start">
                <span className="text-xs text-slate-400 font-bold tracking-wider mb-0.5">{item.key}</span>
                <span className="text-xs font-mono font-bold text-slate-100">{item.val}</span>
              </div>
            ))}
          </div>

          {/* Capabilities Badges list exactly matching reference photo */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 text-left">
            <span className="text-xs text-slate-400 font-bold block mb-2 uppercase tracking-wide">支持能力</span>
            <div className="flex flex-wrap gap-4 max-h-[140px] overflow-y-auto pr-1 scrollbar-narrow">
              {[
                'screenshot', 'tap', 'swipe', 'longPress', 'input', 'home', 'updateSelf',
                'installApp', 'installSystemApps', 'launchApp', 'killApp', 'saveMedia',
                'start_stream', 'lockOrientation', 'unlockOrientation', 'setLanguage',
                'setLocale', 'setLanguageAndLocale', 'startCapture', 'stopCapture', 'uploadCapture'
              ].map(badge => (
                <span key={badge} className="text-xs bg-slate-900 text-indigo-400 border border-indigo-950/40 font-mono px-2 py-0.5 rounded-md leading-none">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Hard Release & Delete Buttons */}
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => addLog("[SYSTEM] Process requested: Device released back to cloud node.")}
              className="flex-1 py-3 text-center bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white rounded-xl shadow-lg cursor-pointer transition active:scale-95"
            >
              释放设备
            </button>
            <button
              onClick={() => addLog("[SYSTEM] Access denied: Deletion restricted during running workflows.")}
              className="flex-1 py-3 text-center bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition active:scale-95"
            >
              删除设备
            </button>
          </div>

        </div>


        {/* ==================== 2. RIGHT PANEL: Interactive Screen Casting & Core Controls (7 Columns) ==================== */}
        <div className="lg:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col items-center bento-glow-indigo">

          {/* Card Header matching screen simulation banner perfectly */}
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-100">屏幕模拟</span>
              <span className="flex items-center gap-4 text-xs text-emerald-400 font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ● 实时 (流畅)
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* "省流" Checkbox */}
              <label className="flex items-center gap-4 text-xs text-slate-300 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isSavingFlow}
                  onChange={(e) => {
                    setIsSavingFlow(e.target.checked);
                    addLog(`[SYSTEM] Save-flow mode configured: ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                  }}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 w-3.5 h-3.5 bg-black"
                />
                <span>省流</span>
              </label>

              {/* "● 录制" Button */}
              <button
                onClick={() => {
                  const state = !isRecording;
                  setIsRecording(state);
                  addLog(state ? `[SYSTEM] Started screen transaction capture recorder.` : `[SYSTEM] Screen capture recording packed successfully.`);
                }}
                className={`text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-4 transition ${isRecording ? 'bg-red-950 border border-red-800 text-red-500' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-red-500 ${isRecording ? 'animate-pulse' : ''}`}></span>
                录制
              </button>

              {/* "📷 截图" Button */}
              <button
                onClick={triggerScreenshotAnalysis}
                className="px-3.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-lg shadow bento-glow-indigo hover:opacity-90 active:scale-95 transition"
              >
                📷 截图
              </button>
            </div>
          </div>

          {/* Interactive Phone Frame wrapper */}
          <div className={`relative w-[280px] h-[520px] rounded-[42px] border-8 border-slate-950 bg-black shadow-2xl ring-4 ring-slate-800/55 flex flex-col overflow-hidden transition-all ${isSavingFlow ? 'filter saturate-50 contrast-125' : ''
            }`}>

            {/* iPhone Dynamic Island */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-900 rounded-full ml-auto mr-3"></div>
            </div>

            {isPowerOn ? (
              <div className="flex-1 flex flex-col relative text-white bg-slate-950 font-sans select-none overflow-hidden h-full">

                {/* Status Bar */}
                <div className="h-6 px-5 pt-1.5 flex justify-between items-center text-xs font-mono font-medium z-2 z-20 text-white bg-transparent">
                  <span>05:44</span>
                  <span className="truncate max-w-[80px] text-indigo-400">@{device.username}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs bg-emerald-505/20 text-emerald-400 border border-emerald-500/20 px-1 rounded-sm leading-none">LTE</span>
                    <span>95%</span>
                  </div>
                </div>

                {/* Sub App Screens Dispatcher */}
                <div className="flex-1 flex flex-col overflow-hidden relative">

                  {/* APP STATE: Home Springboard with 24 apps list */}
                  {phoneScreen === 'home' && (
                    <div className="flex-1 relative bg-black select-none overflow-hidden h-full">
                      {/* Image representation of iOS screen exactly matching user uploaded screenshot */}
                      <img
                        src="/images/ios_springboard_mockup.png"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        alt="iOS Screen Mock"
                        referrerPolicy="no-referrer"
                      />

                      {/* Absolute overlaid translucent grid for interactive feedback mapping exactly to the 4x6 grid */}
                      <div className="absolute inset-x-0 top-3 bottom-14 grid grid-cols-4 grid-rows-6 gap-x-1 gap-y-2.5 pt-4 pb-2 px-2 z-10">
                        {appsList.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => {
                              addLog(`[SYSTEM] Touch event resolved on icon: ${app.name}`);
                              if (app.id === 'feed') {
                                setPhoneScreen('feed');
                              } else if (app.id === 'weather') {
                                setPhoneScreen('weather');
                              } else if (app.id === 'instagram') {
                                setPhoneScreen('instagram');
                              } else if (app.id === 'troll') {
                                setPhoneScreen('troll');
                              } else if (app.id === 'troll2') {
                                setPhoneScreen('troll2');
                              } else if (app.id === 'mcn_hub') {
                                setPhoneScreen('creator');
                              } else {
                                setGenericAppName(app.name);
                                setPhoneScreen('generic_app');
                              }
                            }}
                            className="flex flex-col items-center justify-start cursor-pointer relative h-full rounded-xl hover:bg-white/10 active:bg-white/25 transition-all duration-150"
                            title={app.name}
                          >
                            {/* Hover/Tap indicator dot to guide user interaction */}
                            <span className="absolute bottom-1 w-1 h-1 bg-indigo-400/80 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>

                      {/* Dock icons interactive regions at the bottom (4 columns mapped to Phone, Safari, Message, Music) */}
                      <div className="absolute bottom-[2px] left-0 right-0 h-11 px-3 flex justify-between gap-1 items-center z-15">
                        {[
                          { id: 'phone', name: '电话' },
                          { id: 'safari', name: 'Safari 浏览器' },
                          { id: 'message', name: '短信' },
                          { id: 'music', name: '音乐' }
                        ].map((dockApp) => (
                          <div
                            key={dockApp.id}
                            onClick={() => {
                              addLog(`[SYSTEM] Clicked Dock launcher icon: ${dockApp.name}`);
                              if (dockApp.id === 'safari') {
                                addLog(`[SYSTEM] Launching stock Safari web browser...`);
                                setGenericAppName('Safari 浏览器');
                                setPhoneScreen('generic_app');
                              } else {
                                setGenericAppName(dockApp.name);
                                setPhoneScreen('generic_app');
                              }
                            }}
                            className="flex-1 h-10 rounded-xl cursor-pointer hover:bg-white/15 active:bg-white/30 transition-all duration-150"
                            title={dockApp.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APP STATE: simulated TikTok stream player */}
                  {phoneScreen === 'feed' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
                      <div className="absolute top-2 left-0 right-0 z-10 flex justify-center gap-4 text-xs font-bold text-white/65">
                        <span>Following</span>
                        <span className="text-white border-b-1.5 border-white pb-0.5">For You</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-end p-4 pb-12 relative bg-gradient-to-t from-black via-transparent to-neutral-900">
                        {/* Stream graphic placeholder */}
                        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4 opacity-60">
                          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow animate-pulse mb-3 ${mockFeedVideos[activeFeedIndex].type === 'aesthetic-cooking' ? 'bg-emerald-900/50 border border-emerald-500/20' : 'bg-indigo-950/60 border border-indigo-550/20'
                            }`}>
                            <Flame className="w-8 h-8 text-indigo-400" />
                          </div>
                          <span className="text-xs text-slate-400 tracking-widest font-mono uppercase bg-black/40 px-2 py-0.5 rounded">
                            {mockFeedVideos[activeFeedIndex].type.toUpperCase()} Feed
                          </span>
                        </div>

                        {/* Stream Right Panel buttons */}
                        <div className="absolute right-2 bottom-12 z-10 flex flex-col gap-4.5 items-center">
                          <div className="w-8 h-8 rounded-full border border-white/30 bg-indigo-950 text-indigo-300 text-xs shadow flex items-center justify-center font-bold overflow-hidden">
                            {persona.avatarUrl.startsWith('http') ? (
                              <img src={persona.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              persona.avatarUrl
                            )}
                          </div>

                          <button onClick={() => {
                            const activeKey = activeFeedIndex;
                            setVideoLiked(prev => ({ ...prev, [activeKey]: !prev[activeKey] }));
                            addLog(`❤️ SIMULATE TOUCH: LIKED video by ${mockFeedVideos[activeFeedIndex].creator}`);
                            onUpdateDeviceStats(device.id, { viewsAdd: 10, followersAdd: 0 });
                          }} className="flex flex-col items-center text-white cursor-pointer hover:scale-110 transition">
                            <Heart className={`w-6 h-6 ${videoLiked[activeFeedIndex] ? 'text-red-500 fill-current' : ''}`} />
                            <span className="text-xs">{mockFeedVideos[activeFeedIndex].likes}</span>
                          </button>

                          <button onClick={() => {
                            const activeKey = activeFeedIndex;
                            setVideoBookmarked(prev => ({ ...prev, [activeKey]: !prev[activeKey] }));
                            addLog(`⭐ SIMULATE TOUCH: BOOKMARKED video by ${mockFeedVideos[activeFeedIndex].creator}`);
                          }} className="flex flex-col items-center text-white cursor-pointer hover:scale-110 transition">
                            <Bookmark className={`w-6 h-6 ${videoBookmarked[activeFeedIndex] ? 'text-amber-400 fill-current' : ''}`} />
                            <span className="text-xs">{mockFeedVideos[activeFeedIndex].comments}</span>
                          </button>

                          <div className="flex flex-col items-center text-white/70">
                            <Share2 className="w-6 h-6" />
                            <span className="text-xs">Share</span>
                          </div>
                        </div>

                        {/* Title Overlay */}
                        <div className="relative z-10 text-white text-left">
                          <span className="font-bold text-xs block">{mockFeedVideos[activeFeedIndex].creator}</span>
                          <p className="text-xs text-slate-200 mt-3 line-clamp-2 pr-10 leading-relaxed">
                            {mockFeedVideos[activeFeedIndex].description}
                          </p>
                          <span className="text-indigo-400 text-xs mt-0.5 block font-mono">
                            {mockFeedVideos[activeFeedIndex].hashtags}
                          </span>
                        </div>
                      </div>

                      {/* TikTok mini navbar */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black border-t border-zinc-900 flex justify-around items-center text-xs text-zinc-500">
                        <span className="text-white font-bold flex flex-col items-center cursor-pointer" onClick={() => setPhoneScreen('feed')}>
                          <Home className="w-3.5 h-3.5 mb-0.5 text-white" />首页
                        </span>
                        <span className="flex flex-col items-center cursor-pointer hover:text-white" onClick={() => setPhoneScreen('creator')}>
                          <Award className="w-3.5 h-3.5 mb-0.5" />创作者中心
                        </span>
                        <div className="w-7 h-5 bg-white rounded flex items-center justify-center font-bold text-black text-xs pb-0.5">+</div>
                        <span className="flex flex-col items-center cursor-pointer hover:text-white" onClick={() => setPhoneScreen('posting')}>
                          <Send className="w-3.5 h-3.5 mb-0.5" />自动发帖
                        </span>
                      </div>
                    </div>
                  )}

                  {/* APP STATE: Creator Center Analytics */}
                  {phoneScreen === 'creator' && (
                    <div className="flex-1 flex flex-col bg-slate-950 p-4 text-left overflow-y-auto pb-12">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-2">
                        <span className="text-xs font-bold tracking-tight text-white">TikTok Creator Hub</span>
                        <button className="text-xs bg-slate-800 text-slate-300 px-1 rounded" onClick={() => setPhoneScreen('feed')}>返回 feed</button>
                      </div>

                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-left mb-2">
                        <span className="text-xs text-slate-400 block">7日播放量累积 (7d Video Views)</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {device.totalViews.toLocaleString()}
                        </span>
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-1.5 border-t border-slate-800 text-xs">
                          <div>
                            <span className="text-slate-400 block">粉丝数</span>
                            <span className="font-mono text-white font-bold">{device.followerCount}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">作品数</span>
                            <span className="font-mono text-white font-bold">{device.videoCount}</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-slate-500 font-bold block mb-2">流量拆分</span>
                      <div className="space-y-4.5 bg-slate-900/60 p-3 border border-slate-800/60 rounded">
                        <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-400 h-full" style={{ width: '89%' }}></div>
                          <div className="bg-indigo-400 h-full" style={{ width: '11%' }}></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                          <span className="text-emerald-400 leading-none">ForYou FYP: 89%</span>
                          <span className="text-indigo-400 leading-none font-bold">Search: 11%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APP STATE: Publishing Center */}
                  {phoneScreen === 'posting' && (
                    <div className="flex-1 flex flex-col bg-slate-950 p-3 text-left overflow-y-auto pb-12">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-2">
                        <span className="text-xs font-bold text-amber-500">模拟自动发帖中心</span>
                        <button className="text-xs bg-slate-800 text-slate-300 px-1.5 rounded" onClick={() => setPhoneScreen('feed')}>取消</button>
                      </div>

                      <div className="space-y-4.5 text-slate-300">
                        <div>
                          <span className="text-xs text-slate-400 block mb-0.5">1. 视频文件</span>
                          <div className="bg-zinc-900 border border-slate-800 p-4 rounded flex items-center gap-4">
                            <span className="text-xs">📹</span>
                            <div className="truncate flex-1 leading-none">
                              <span className="text-xs font-bold text-slate-200 block truncate">ASMR_Cozy_Matcha_Latte.mp4</span>
                              <span className="text-[7px] text-slate-500 font-mono">Size: 4.8MB • 15s</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-slate-400 block mb-0.5">2. 描述文案</span>
                          <textarea
                            readOnly
                            value={`POV: Whisking perfect Japanese matcha. Sensory whisper sounds on rainy day. #${device.niche} #asmr`}
                            className="w-full text-xs p-4 bg-zinc-900 border border-slate-800 rounded font-mono text-slate-350 h-11 resize-none focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            addLog(`🚀 [MCP] video_publish_sequence auto initiated...`);
                            setPhoneScreen('warmup_running');
                            setCurrentWarmupActionText('正在发布视频剪辑资源...');
                            setSimulationProgress(35);
                            setTimeout(() => {
                              setPhoneScreen('feed');
                              onUpdateDeviceStats(device.id, { viewsAdd: 0, followersAdd: 0, videoAdd: true });
                              addLog(`✅ [MCP] Video successfully uploaded and tagged under niche #${device.niche}!`);
                            }, 1800);
                          }}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs rounded text-black flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" /> 远程驱动发布
                        </button>
                      </div>
                    </div>
                  )}

                  {/* APP STATE: Warmup animation spinner */}
                  {phoneScreen === 'warmup_running' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950">
                      <div className="relative w-12 h-12 mb-3.5 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-400 animate-spin"></div>
                        <Cpu className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-white text-center mb-2">{currentWarmupActionText}</span>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden max-w-[120px] mb-2">
                        <div className="bg-indigo-400 h-full transition-all duration-300" style={{ width: `${simulationProgress}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{simulationProgress}% completed</span>
                    </div>
                  )}

                  {/* APP STATE: simulated Weather */}
                  {phoneScreen === 'weather' && (
                    <div className="flex-1 bg-gradient-to-b from-sky-400 to-blue-600 p-4 font-sans text-white text-center flex flex-col justify-between flex-1">
                      <div className="pt-2">
                        <div className="text-xs font-bold block">{device.region}</div>
                        <div className="text-4xl font-extrabold font-mono mt-3">24°</div>
                        <div className="text-xs mt-3 text-sky-100 font-medium tracking-wide">Cloudy / Overcast</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-left space-y-4.5 text-xs mb-2">
                        <div className="font-bold border-b border-white/10 pb-1 mb-2 text-sky-100">7-Day Forecast</div>
                        <div className="flex justify-between">
                          <span>Today</span>
                          <span className="font-mono">🌧️ 24°/16°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Friday</span>
                          <span className="font-mono">☀️ 26°/17°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday</span>
                          <span className="font-mono">⛅ 28°/19°</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* APP STATE: Generic customized apps running */}
                  {phoneScreen === 'generic_app' && (
                    <div className="flex-1 bg-slate-950 p-4 text-center flex flex-col justify-center items-center">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-805 text-indigo-400 text-xs flex items-center justify-center mb-3">
                        📱
                      </div>
                      <span className="text-xs font-bold text-white block">{genericAppName || 'Springboard App'}</span>
                      <span className="text-xs text-emerald-400 font-mono mt-3 bg-emerald-950/30 border border-emerald-900/40 px-2 py-1 rounded">
                        ✓ Connected through proxy port OK
                      </span>
                      <button
                        onClick={() => setPhoneScreen('home')}
                        className="mt-3 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded"
                      >
                        返回主屏幕
                      </button>
                    </div>
                  )}

                  {/* APP STATE: Instagram Feed simulated screen */}
                  {phoneScreen === 'instagram' && (
                    <div className="flex-1 bg-slate-950 text-left overflow-y-auto flex flex-col justify-start">
                      <div className="border-b border-slate-900 p-4 flex justify-between items-center bg-black/40">
                        <span className="text-xs font-bold text-white tracking-widest font-serif italic">Instagram</span>
                        <button className="text-xs bg-slate-800 px-1 text-slate-300 rounded" onClick={() => setPhoneScreen('home')}>Exit</button>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-500" />
                          <span className="text-xs font-bold text-white">@{device.username}</span>
                        </div>
                        <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 text-xs mb-2 border border-slate-800 text-center p-4">
                          [REELS SIMULATION FRAME IN PROGRESS for #{device.niche}]
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">
                          <strong>@{device.username}</strong> Cozy studio vlog coming tonight. Subscribing to node index...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* APP STATE: Troll LOL custom screen */}
                  {phoneScreen === 'troll' && (
                    <div className="flex-1 bg-stone-950 flex flex-col items-center justify-center p-4 text-center">
                      <div className="text-red-500 text-xs mb-2">😜</div>
                      <span className="text-xs font-bold text-white block">TrollOS Host Control</span>
                      <p className="text-xs text-slate-400 leading-relaxed mt-3 max-w-[180px]">
                        Residential proxy tunnel is healthy. System security is robust. Click home to exit trolling sandbox!
                      </p>
                    </div>
                  )}

                  {phoneScreen === 'troll2' && (
                    <div className="flex-1 bg-indigo-950/20 flex flex-col items-center justify-center p-4 text-center">
                      <div className="text-sky-500 text-xs mb-2">🥶</div>
                      <span className="text-xs font-bold text-white block">Blue Troll Node</span>
                      <p className="text-xs text-slate-400 leading-relaxed mt-3 max-w-[180px]">
                        Node tunnel cleared. Safe click on bottom HOME button.
                      </p>
                    </div>
                  )}

                </div>

                {/* iPhone Home Indicator swipe bar */}
                <div className="h-4 flex justify-center items-center bg-transparent relative z-20">
                  <div
                    onClick={() => {
                      setPhoneScreen('home');
                      setGenericAppName('');
                      addLog(`[SYSTEM] Home button clicked inside canvas indicator.`);
                    }}
                    className="w-24 h-1 bg-white/50 rounded-full hover:bg-white cursor-pointer active:scale-90 transition-transform"
                    title="双击或点击返回主页"
                  ></div>
                </div>

              </div>
            ) : (
              <div className="flex-1 bg-black flex flex-col items-center justify-center text-slate-700 font-mono">
                <Power className="w-10 h-10 text-slate-900 animate-pulse mb-2" />
                <span className="text-xs uppercase tracking-wider">Powered off</span>
              </div>
            )}
          </div>

          {/* Core Hardware Actions underneath the Phone exactly as requested */}
          <div className="w-full max-w-[280px] flex flex-col gap-4 mt-3">

            {/* Row 1: "输入" & "Home" Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  if (!isPowerOn) return;
                  setShowInputModal(true);
                }}
                disabled={!isPowerOn}
                className="flex items-center justify-center gap-4 py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-200 border border-slate-800 text-xs font-bold rounded-xl cursor-pointer transition active:scale-95 shadow"
              >
                <Keyboard className="w-3.5 h-3.5 text-indigo-400" /> 输入
              </button>

              <button
                onClick={() => {
                  if (!isPowerOn) return;
                  setPhoneScreen('home');
                  setGenericAppName('');
                  addLog(`[SYSTEM] Home button pressed. Springboard springboard active.`);
                }}
                disabled={!isPowerOn}
                className="flex items-center justify-center gap-4 py-2 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-200 border border-slate-800 text-xs font-bold rounded-xl cursor-pointer transition active:scale-95 shadow"
              >
                <Home className="w-3.5 h-3.5 text-indigo-400" /> Home
              </button>
            </div>

            {/* Row 2: "启动应用", "杀掉应用", "竖屏锁定", "语言与区域" */}
            <div className="grid grid-cols-4 gap-4">
              <button
                onClick={() => {
                  if (!isPowerOn) return;
                  setAppSelecting(true);
                  addLog("[SYSTEM] Initiating remote application selector panel...");
                }}
                disabled={!isPowerOn}
                className="flex flex-col items-center justify-center py-2 px-1 hover:bg-slate-800 bg-slate-900 border border-slate-805 font-bold rounded-xl text-xs text-slate-300 gap-1 cursor-pointer transition active:scale-95"
                title="启动应用"
              >
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span>启动应用</span>
              </button>

              <button
                onClick={killActiveApp}
                disabled={!isPowerOn}
                className="flex flex-col items-center justify-center py-2 px-1 hover:bg-slate-850 bg-slate-900 border border-slate-805 font-bold rounded-xl text-xs text-slate-300 gap-1 cursor-pointer transition active:scale-95"
                title="杀掉应用"
              >
                <Skull className="w-3.5 h-3.5 text-rose-400" />
                <span>杀掉应用</span>
              </button>

              <button
                onClick={() => {
                  if (!isPowerOn) return;
                  const target = !orientationLocked;
                  setOrientationLocked(target);
                  addLog(`[SYSTEM] Screen lock toggled: ${target ? 'PORTRAIT LOCKED' : 'FREE ROTATION'}`);
                }}
                disabled={!isPowerOn}
                className={`flex flex-col items-center justify-center py-2 px-1 bg-slate-900 border border-slate-805 font-bold rounded-xl text-xs gap-1 cursor-pointer transition active:scale-95 ${orientationLocked ? 'text-indigo-405 border-indigo-900/30' : 'text-slate-400'
                  }`}
                title="竖屏锁定"
              >
                <Lock className={`w-3.5 h-3.5 ${orientationLocked ? 'text-indigo-405' : 'text-slate-500'}`} />
                <span>竖屏锁定</span>
              </button>

              <button
                onClick={() => {
                  if (!isPowerOn) return;
                  addLog("[SYSTEM] Dispatching system localization config. Default locale: en_US.");
                }}
                disabled={!isPowerOn}
                className="flex flex-col items-center justify-center py-2 px-1 hover:bg-slate-850 bg-slate-900 border border-slate-805 font-bold rounded-xl text-xs text-slate-300 gap-1 cursor-pointer transition active:scale-95"
                title="语言与区域"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>语言与区域</span>
              </button>
            </div>

            {/* Power switch button on sidebar block */}
            <div className="flex items-center justify-center border-t border-slate-800/60 pt-2 text-center">
              <button
                onClick={() => {
                  const target = !isPowerOn;
                  setIsPowerOn(target);
                  addLog(`[SYSTEM] Client screen power switched: ${target ? 'ON' : 'OFF'}`);
                }}
                className={`text-xs py-1 px-3 rounded-full flex items-center gap-1 cursor-pointer font-bold ${isPowerOn
                    ? 'bg-rose-950/40 border border-rose-900/40 text-rose-400 hover:bg-rose-900/30'
                    : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/30'
                  }`}
              >
                <Power className="w-3 h-3" />
                <span>{isPowerOn ? '远程强制断电' : '远程开机引导'}</span>
              </button>
            </div>
          </div>

          {/* Operational instructions matching picture detail */}
          <div className="w-full border-t border-slate-800/70 pt-4 mt-5 space-y-4.5 text-xs text-slate-500 leading-normal text-left">
            <p className="font-medium text-slate-400">
              操作说明：轻触 = 点击 • 拖拽 = 滑动 • 按住不动 = 长按。指令成功后会自动刷新截图。
            </p>
            <p className="text-xs text-slate-600">
              若点击/滑动无效，请先在真机上手动触摸一次屏幕（唤醒触控焦点）再重试。热键：[T] 强制下次点击 / [I] 文本输入 / [Ctrl+V/Cmd+V] 快捷粘贴 / [1-3] 调整长按时间
            </p>
          </div>

        </div>

      </div>

      {/* ==================== 3. FLOATING OVERLAYS & MODALS ==================== */}

      {/* 3.1 Input Overlay Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-4">
                <Keyboard className="w-4 h-4 text-indigo-400" />
                远程注入文本输入
              </span>
              <button
                onClick={() => setShowInputModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInjectedTextSubmit} className="space-y-4">
              <textarea
                placeholder="在此输入文本并发送到远程宿主设备中..."
                value={inputTextVal}
                onChange={(e) => setInputTextVal(e.target.value)}
                className="w-full h-24 bg-black text-slate-200 border border-slate-805 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-indigo-505"
                rows={3}
              />
              <div className="flex justify-end gap-4.5">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs rounded-lg shadow bento-glow-indigo active:scale-95"
                >
                  注入文本
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3.2 Dynamic App Selector panel */}
      {appSelecting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-3">
              <span className="text-xs font-bold text-white">📦 部署启动远程App应用</span>
              <button onClick={() => setAppSelecting(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 scrollbar-narrow py-2">
              {[
                { id: 'feed', name: '🎵 TikTok Client' },
                { id: 'instagram', name: '📸 Instagram Reels' },
                { id: 'creator', name: '📊 MCN Creator Center' },
                { id: 'weather', name: '☀️ Weather Forecast' }
              ].map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    if (app.id === 'creator') {
                      setPhoneScreen('creator');
                    } else {
                      setPhoneScreen(app.id as any);
                    }
                    setAppSelecting(false);
                    addLog(`[SYSTEM] Dispatched execution launching command for payload: ${app.name}`);
                  }}
                  className="w-full text-left p-4 rounded-xl bg-slate-950/40 hover:bg-indigo-950/30 border border-slate-805 text-xs text-slate-200 hover:text-indigo-300 font-bold transition flex justify-between items-center cursor-pointer"
                >
                  <span>{app.name}</span>
                  <span className="text-xs text-slate-500 font-mono">Launch</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3.3 Gemini vision consultation report modal */}
      {showAiVisionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-narrow text-left">

            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
              <div className="flex items-center gap-4">
                <Cpu className="text-indigo-400 w-5 h-5 animate-pulse" />
                <span className="text-xs font-bold text-white">Gemini 视觉大模型截图顾问诊断</span>
              </div>
              <button
                onClick={() => setShowAiVisionModal(false)}
                className="text-slate-400 hover:text-white w-7 h-7 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Thumbnail snapshot */}
              <div className="bg-slate-955/65 rounded-xl border border-slate-800 p-4 flex gap-4.5 items-center">
                <div className="w-12 h-16 rounded bg-slate-950 border border-neutral-800 flex flex-col items-center justify-center shrink-0">
                  <Camera className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono mt-3">PNG Active</span>
                </div>
                <div className="leading-tight">
                  <span className="text-xs text-slate-400 block font-mono">PROMPT SENT IN NY TIMEZONE:</span>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{aiAnalysis.prompt || 'Analyzing active viewport context...'}"
                  </p>
                </div>
              </div>

              {/* Status Scores */}
              <div className="grid grid-cols-2 gap-4.5">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                  <Award className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">ALGORITHM MATCH</span>
                    <span className="text-xs font-mono font-bold text-indigo-40s">{aiAnalysis.score}/100</span>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-805 flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400 animate-bounce" />
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">PROXY HEALTH</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">SECURE REGION</span>
                  </div>
                </div>
              </div>

              {/* Core Output Box */}
              {aiAnalysis.analyzing ? (
                <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-950/40 border border-dashed border-slate-850 rounded-xl">
                  <div className="w-8 h-8 rounded-full border-3 border-t-indigo-550 border-r-slate-800 border-b-slate-800 border-l-slate-800 animate-spin mb-2" />
                  <span className="text-xs font-bold text-slate-300">Gemini-1.5-Flash generating advice report...</span>
                </div>
              ) : (
                <div className="bg-black/60 p-4 rounded-xl border border-slate-950 text-left">
                  <span className="text-xs text-slate-400 font-bold block mb-2 font-mono">GEMINI CORE AUDIT REPORT</span>
                  <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap break-all">
                    {aiAnalysis.result}
                  </pre>
                </div>
              )}

              {/* Tags and suggestions */}
              {!aiAnalysis.analyzing && (
                <>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block mb-2">Extracted Tags:</span>
                    <div className="flex flex-wrap gap-4">
                      {aiAnalysis.tags.map((tg, idx) => (
                        <span key={idx} className="text-xs font-mono text-indigo-400 bg-indigo-950/45 border border-indigo-900/30 px-2 py-0.5 rounded-md">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/30">
                    <span className="text-xs text-indigo-400 font-bold block mb-2">Suggested Agent Automation Step:</span>
                    <p className="text-xs text-slate-300 leading-snug font-mono">
                      {aiAnalysis.actionSuggested}
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowAiVisionModal(false)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  OK, Close Report
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
