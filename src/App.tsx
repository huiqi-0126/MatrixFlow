import React, { useState, useEffect } from 'react';
import {
  Smartphone, Shield, Activity, Users, Flame, Globe, Sliders,
  Calendar, Video, Clock, BarChart, RefreshCw, Layers, Award, Info,
  Instagram, Youtube, Send
} from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Import subcomponents
import DeviceSimulator from './components/DeviceSimulator';
import PersonaManager from './components/PersonaManager';
import WarmupPlanner from './components/WarmupPlanner';
import ContentPlanner from './components/ContentPlanner';
import PublisherScheduler from './components/PublisherScheduler';
import AnalyticsAdvisor from './components/AnalyticsAdvisor';
import AssetManager from './components/AssetManager';
import DataCollector from './components/DataCollector';

// Import Types and Constants
import { Device, Persona, VideoAsset, ScheduleTask } from './types';
import { INITIAL_DEVICES, INITIAL_PERSONAS, VIDEO_RESOURCES } from './constants';

export default function App() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'dormant' | 'banned'>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('device-1');
  const [personas, setPersonas] = useState<Record<string, Persona>>(INITIAL_PERSONAS);
  const [videoAssets, setVideoAssets] = useState<VideoAsset[]>(VIDEO_RESOURCES);

  // Preload mock publishing tasks to establish initial visual realism
  const [tasks, setTasks] = useState<ScheduleTask[]>([
    // Device-1: aesthetic-cooking (cook_with_kai)
    {
      id: 'task-preload-1',
      deviceId: 'device-1',
      videoAssetId: 'res-1',
      description: 'POV: craft high grade matcha with me. Whispering ASMR sounds on a cozy rainy morning.',
      tags: ['#matchalove', '#asmrcooking', '#lifestyle', '#aestheticcooking'],
      scheduleTime: '05/19 09:00',
      status: 'success',
    },
    {
      id: 'task-preload-2',
      deviceId: 'device-1',
      videoAssetId: 'res-5',
      description: 'Rain tapping on the window, slow pour over brewing. Let the water do the work.',
      tags: ['#pourover', '#coffeASMR', '#rainyday', '#slowliving'],
      scheduleTime: '05/19 15:00',
      status: 'success',
    },
    {
      id: 'task-preload-3',
      deviceId: 'device-1',
      videoAssetId: 'res-6',
      description: 'Golden toast meets perfectly runny egg. The simplest breakfast hits different at 7 AM.',
      tags: ['#eggtoast', '#breakfastasmr', '#crunchysounds', '#morningvibes'],
      scheduleTime: '05/20 07:30',
      status: 'success',
    },
    {
      id: 'task-preload-4',
      deviceId: 'device-1',
      videoAssetId: 'res-7',
      description: 'From raw clay to your morning cereal bowl. Every bowl has a soul. This one is calm.',
      tags: ['#pottery', '#ceramics', '#clayasmr', '#handmade'],
      scheduleTime: '05/21 11:00',
      status: 'failed',
      errorLog: 'Network timeout: residential proxy handshakes exceeded 15s limit.'
    },
    {
      id: 'task-preload-5',
      deviceId: 'device-1',
      videoAssetId: 'res-8',
      description: 'Satisfying vanilla ice cream scooping. Relieve your anxiety with cream textures.',
      tags: ['#matchalatte', '#asmrrecipes', '#peacefulrecipes'],
      scheduleTime: '05/21 18:00',
      status: 'pending'
    },
    {
      id: 'task-preload-6',
      deviceId: 'device-1',
      videoAssetId: 'res-1',
      description: 'Making a hot matcha latte on a rainy afternoon. No thoughts, just matcha foam.',
      tags: ['#matcha', '#asmrcooking', '#aestheticcoffee', '#satisfying'],
      scheduleTime: '05/22 10:00',
      status: 'pending'
    },
    // Device-2: fitness (fit_goddess_o)
    {
      id: 'task-preload-7',
      deviceId: 'device-2',
      videoAssetId: 'res-3',
      description: 'When everyone defaults, you stack bricks. Morning 5 AM consistency core workout.',
      tags: ['#coreworkout', '#gymmotivation', '#5amclub', '#fitness'],
      scheduleTime: '05/19 05:30',
      status: 'success',
    },
    {
      id: 'task-preload-8',
      deviceId: 'device-2',
      videoAssetId: 'res-9',
      description: 'Three rounds, zero excuses. Resistance band glute burn that actually works!',
      tags: ['#bootyband', '#gluteworkout', '#fitnesschallenge', '#gymbestie'],
      scheduleTime: '05/19 16:00',
      status: 'success',
    },
    {
      id: 'task-preload-9',
      deviceId: 'device-2',
      videoAssetId: 'res-10',
      description: 'Sweat session done, glow up begins. Post-gym skincare essentials for the glow.',
      tags: ['#skincareroutine', '#postworkoutglow', '#selfcare', '#gymglow'],
      scheduleTime: '05/20 07:00',
      status: 'success',
    },
    {
      id: 'task-preload-10',
      deviceId: 'device-2',
      videoAssetId: 'res-11',
      description: 'Sunday prep, weekday gains. Prep once, eat like a queen all week.',
      tags: ['#mealprep', '#highprotein', '#chickenrice', '#sundayprep'],
      scheduleTime: '05/21 08:00',
      status: 'posting',
    },
    {
      id: 'task-preload-11',
      deviceId: 'device-2',
      videoAssetId: 'res-12',
      description: '60 seconds to set your core on fire. Quick pilates burn challenge.',
      tags: ['#pilates', '#coreburn', '#quickworkout', '#60secondchallenge'],
      scheduleTime: '05/22 06:00',
      status: 'pending'
    },
    // Device-3: streetwear (streetwear_kai)
    {
      id: 'task-preload-12',
      deviceId: 'device-3',
      videoAssetId: 'res-4',
      description: 'Spent 5 hours digging, found this museum-grade vintage Prada piece.',
      tags: ['#pradathrift', '#streetwearinspo', '#vintageaesthetic', '#ootdinspo'],
      scheduleTime: '05/20 14:00',
      status: 'success',
    },
    {
      id: 'task-preload-13',
      deviceId: 'device-3',
      videoAssetId: 'res-13',
      description: 'Score of the decade. Found rare Nike Dunks at the thrift for $8. The universe knows.',
      tags: ['#nikedunk', '#thriftfind', '#vintagesneakers', '#rarekicks'],
      scheduleTime: '05/21 12:00',
      status: 'pending'
    },
    {
      id: 'task-preload-14',
      deviceId: 'device-3',
      videoAssetId: 'res-14',
      description: 'One pant, three completely different energies. Versatility is the real flex.',
      tags: ['#cargopants', '#streetwearfits', '#ootd', '#threeways'],
      scheduleTime: '05/22 15:00',
      status: 'pending'
    },
    // Device-4: tech-gadgets (tech_unboxed_vibe)
    {
      id: 'task-preload-15',
      deviceId: 'device-4',
      videoAssetId: 'res-2',
      description: 'Unboxing my dream cyberpunk mechanical keyboard. Rate this typing level 1-10.',
      tags: ['#mechanicalkeyboards', '#vaporwave', '#customtech', '#typingasmr'],
      scheduleTime: '05/19 11:00',
      status: 'success',
    },
    {
      id: 'task-preload-16',
      deviceId: 'device-4',
      videoAssetId: 'res-16',
      description: 'The art of the perfect switch lube. That sound is worth 4 hours of lubing.',
      tags: ['#keyboardbuild', '#lubingasmr', '#mechanicalkeyboard', '#techasmr'],
      scheduleTime: '05/20 10:00',
      status: 'success',
    },
    {
      id: 'task-preload-17',
      deviceId: 'device-4',
      videoAssetId: 'res-17',
      description: 'Welcome to my command center. Full cyberpunk desk setup tour 2025.',
      tags: ['#desksetup', '#rgbsetup', '#cyberpunkdesk', '#techtour'],
      scheduleTime: '05/21 14:00',
      status: 'pending'
    },
    {
      id: 'task-preload-18',
      deviceId: 'device-4',
      videoAssetId: 'res-18',
      description: '99% of iPhone users don\'t know these hidden features exist. The future is in your pocket.',
      tags: ['#iphone16pro', '#iosfeatures', '#techhacks', '#appletips'],
      scheduleTime: '05/22 09:00',
      status: 'pending'
    },
  ]);

  const [activeTab, setActiveTab] = useState<'simulation' | 'persona' | 'warmup' | 'content' | 'scheduler' | 'analytics' | 'assets' | 'datacollect'>('persona');
  // Agent activation states (each agent tab requires explicit activation)
  const [agentActivated, setAgentActivated] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const handleOpenScheduleModal = () => {
      setActiveTab('scheduler');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-create-task'));
      }, 150);
    };
    window.addEventListener('open-schedule-modal', handleOpenScheduleModal);
    return () => window.removeEventListener('open-schedule-modal', handleOpenScheduleModal);
  }, []);

  useEffect(() => {
    const handleReplicateVideo = (e: any) => {
      setActiveTab('assets');
      const url = e.detail?.url;
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('trigger-analyze-video', { detail: { url } }));
      }, 150);
    };
    window.addEventListener('replicate-video', handleReplicateVideo);
    return () => window.removeEventListener('replicate-video', handleReplicateVideo);
  }, []);

  // Find active selected items helper
  const activeDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const activePersona = personas[activeDevice.id] || {
    id: activeDevice.id,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    interests: [],
    race: 'Default',
    gender: 'None',
    values: 'Default',
    niche: activeDevice.niche,
    bio: '',
    tone: 'Neutral',
  };

  // 1. UPDATE DEVICE STATS CALLBACK
  const handleUpdateDeviceStats = (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          totalViews: d.totalViews + stats.viewsAdd,
          followerCount: d.followerCount + stats.followersAdd,
          videoCount: stats.videoAdd ? d.videoCount + 1 : d.videoCount
        };
      }
      return d;
    }));
  };

  // 2. PERSONA CHANGES CALLBACK
  const handleUpdatePersona = (newPersona: Persona) => {
    setPersonas(prev => ({
      ...prev,
      [newPersona.id]: newPersona
    }));
  };

  // 3. VIDEO RESOURCE LIST CALLBACKS
  const handleAddVideoAsset = (asset: VideoAsset) => {
    setVideoAssets(prev => [asset, ...prev]);
  };

  const handleDeleteVideoAsset = (assetId: string) => {
    setVideoAssets(prev => prev.filter(a => a.id !== assetId));
  };

  // 4. PUBLISHING SCHEDULE CALLBACKS
  const handleAddTask = (task: ScheduleTask) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleUpdateTaskStatus = (taskId: string, status: 'pending' | 'posting' | 'success' | 'failed') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status };
      }
      return t;
    }));
  };

  // Account-specific metrics
  const activeFollowersCount = activeDevice.followerCount;
  const activeViewsCount = activeDevice.totalViews;
  const activeVideoCount = activeDevice.videoCount;
  const activeAccountHealth = activeFollowersCount > 500 ? '🟢 极佳 (High)' : '🟢 正常 (Good)';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">

      {/* 1. Global Navigation Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 xl:px-6 py-3 xl:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 xl:gap-4 z-40 sticky top-0">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="w-5.5 h-5.5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xs font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none whitespace-nowrap">
              海外自媒体账号培育与内容发布系统
              <span className="text-xs bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
                MCN FARM PRO
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-none">
              每台设备独立住宅IP与专属人设 • OCR多模态视觉审计发帖 • 大模型自动克隆复刻
            </p>
          </div>
        </div>

        {/* Account-Specific Summary Statistics bar */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Users className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-500 block text-[9px] leading-none uppercase">Account Followers</span>
              <span className="text-xs font-bold font-mono text-white leading-tight">
                {activeFollowersCount >= 1000 ? (activeFollowersCount / 1000).toFixed(1) + 'k' : activeFollowersCount}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Video className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-slate-500 block text-[9px] leading-none uppercase">Posted Videos</span>
              <span className="text-xs font-bold font-mono text-sky-400 leading-tight">
                {activeVideoCount} 个
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Flame className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-slate-500 block text-[9px] leading-none uppercase">Total Views</span>
              <span className="text-xs font-bold font-mono text-orange-400 leading-tight">
                {activeViewsCount >= 1000000 ? (activeViewsCount / 1000000).toFixed(1) + 'M' : activeViewsCount >= 1000 ? (activeViewsCount / 1000).toFixed(1) + 'k' : activeViewsCount}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-500 block text-[9px] leading-none uppercase">Account Health</span>
              <span className="text-xs font-bold font-mono text-emerald-400 leading-tight">
                {activeAccountHealth}
              </span>
            </div>
          </div>
        </div>

      </header>

      {/* 2. Main content Layout with grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 p-4 xl:p-4 overflow-hidden relative">

        {/* 2.1 Sidebar Panel: Active iPhone devices listing (3 columns) */}
        <aside className="xl:col-span-3 2xl:col-span-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 xl:p-5 flex flex-col text-left overflow-y-auto h-[calc(100vh-80px)] scrollbar-narrow bento-glow-indigo">

          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold font-mono text-slate-400">
              账号矩阵 (Accounts Matrix)
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-900/30 font-mono tracking-tight font-bold">
              ROUTER OK
            </span>
          </div>

          {/* Quick instructions widget top of list */}
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs text-slate-450 leading-relaxed">
            <div className="flex gap-1.5 text-xs font-bold text-slate-300 items-center mb-1 leading-none">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>账号状态机机制 (State Mapping)---点击任意账号，进行管理</span>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/50">
              <button
                onClick={() => setAccountFilter('all')}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >全部</button>
              <button
                onClick={() => setAccountFilter('active')}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >活跃</button>
              <button
                onClick={() => setAccountFilter('dormant')}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'dormant' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >休眠</button>
              <button
                onClick={() => setAccountFilter('banned')}
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'banned' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >异常</button>
            </div>
          </div>

          <div className="space-y-2">
            {devices.filter(d => accountFilter === 'all' || d.accountStatus === accountFilter).map(dev => {
              const isActive = dev.id === selectedDeviceId;

              // Status Badge elements
              let statusText = '在线 / 空闲';
              let statusDot = 'bg-slate-550 border-slate-400';
              if (dev.status === 'warmup') {
                statusText = '正在自动养号';
                statusDot = 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]';
              } else if (dev.status === 'posting') {
                statusText = '正在发帖发布';
                statusDot = 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]';
              } else if (dev.status === 'idle') {
                statusText = '安全驻留 [Idle]';
                statusDot = 'bg-emerald-405 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
              } else if (dev.status === 'offline') {
                statusText = '线路离线 [Offline]';
                statusDot = 'bg-red-500';
              }

              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between relative overflow-hidden ${isActive
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg bento-glow-indigo'
                    : 'bg-slate-800/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                >
                  {/* Account Header line (Avatar + Info) */}
                  <div className="flex items-start gap-3">
                    <img src={personas[dev.id]?.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 bg-slate-800" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-slate-100 font-mono tracking-tight leading-none truncate pr-2">
                          {dev.username}
                        </h4>
                        {/* State dot */}
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 leading-tight">{personas[dev.id]?.bio || '暂无描述'}</p>
                    </div>
                  </div>

                  {/* Account metadata & badges */}
                  {/* Account metadata & badges */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                        {dev.platform}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${dev.followerCount >= 1000 ? 'bg-orange-950 text-orange-400' : dev.followerCount >= 100 ? 'bg-purple-950 text-purple-400' : 'bg-slate-800 text-slate-300'}`}>
                        {dev.followerCount >= 1000 ? '大V号' : dev.followerCount >= 100 ? '高级号' : '新号'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex gap-2.5">
                      <span>粉丝 <span className="text-slate-300 font-bold">{dev.followerCount >= 100000 ? (dev.followerCount / 1000).toFixed(1) + 'k' : dev.followerCount}</span></span>
                      <span>播放 <span className="text-slate-300 font-bold">{dev.totalViews >= 1000000 ? (dev.totalViews / 1000000).toFixed(1) + 'M' : (dev.totalViews / 1000).toFixed(1) + 'k'}</span></span>
                      <span>作品 <span className="text-slate-300 font-bold">{dev.videoCount}</span></span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 leading-normal">
            <span className="font-bold text-slate-450 block mb-0.5">ℹ️ MCN 控制台重要指引:</span>
            设备IP为固定独享干净美区机房代理，请勿同一时间内频繁重置连接网线以保障流量质量。
          </div>

        </aside>

        {/* 2.2 Main View Panel (9 columns) */}
        <main className="xl:col-span-9 flex flex-col space-y-4 xl:space-y-4 overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-narrow">

          {/* Active Device Indicator details */}


          {/* 3. Horizontal tabs selection designed as high-quality Bento Grid cards */}
          <div className="grid grid-cols-5 gap-2 pb-2 select-none">
            {[
              { id: 'persona', label: '🧠 基本信息', desc: '账号 · 人设 · 培育环境', isAgent: false },
              { id: 'warmup', label: '💬 社交互动智能体', desc: '仿真人浏览 · 防封号', isAgent: true },
              { id: 'datacollect', label: '🔍 数据采集智能体', desc: '爆款 · 账号数据同步', isAgent: true },
              { id: 'assets', label: '📊 素材生成及管理', desc: '素材管理 · 视频复刻', isAgent: false },
              { id: 'scheduler', label: '📤 内容发布管理', desc: '定时发布 · 视频分析', isAgent: true },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between relative ${isActive
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 bento-glow-indigo shadow-lg'
                    : 'bg-slate-800/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                >
                  <span className="font-bold text-xs tracking-tight">{tab.label}</span>
                  <span className="text-xs text-slate-500 pt-2 leading-tight font-mono block">{tab.desc}</span>
                  {tab.isAgent && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-900/40 text-cyan-500">AGENT</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 4. Tab views dispatcher block */}
          <div className="flex-1 min-h-[500px]">
            <div className={activeTab === 'simulation' ? 'block h-full' : 'hidden'}>
              <DeviceSimulator
                device={activeDevice}
                persona={activePersona}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'persona' ? 'block h-full' : 'hidden'}>
              <PersonaManager
                device={activeDevice}
                persona={activePersona}
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'warmup' ? 'block h-full' : 'hidden'}>
              <WarmupPlanner
                device={activeDevice}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'assets' ? 'block h-full' : 'hidden'}>
              <AssetManager
                device={activeDevice}
                videoAssets={videoAssets}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            </div>
            <div className={activeTab === 'scheduler' ? 'block h-full' : 'hidden'}>
              <PublisherScheduler
                device={activeDevice}
                videoAssets={videoAssets}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'datacollect' ? 'block h-full' : 'hidden'}>
              <DataCollector device={activeDevice} />
            </div>
          </div>

        </main>

      </div>

    </div>
  );
}
