import React, { useState } from 'react';
import { 
  Smartphone, Shield, Activity, Users, Flame, Globe, Sliders, 
  Calendar, Video, Clock, BarChart, RefreshCw, Layers, Award, Info,
  Instagram, Youtube
} from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Import subcomponents
import DeviceSimulator from './components/DeviceSimulator';
import PersonaManager from './components/PersonaManager';
import WarmupPlanner from './components/WarmupPlanner';
import ContentPlanner from './components/ContentPlanner';
import PublisherScheduler from './components/PublisherScheduler';
import AnalyticsAdvisor from './components/AnalyticsAdvisor';

// Import Types and Constants
import { Device, Persona, VideoAsset, ScheduleTask } from './types';
import { INITIAL_DEVICES, INITIAL_PERSONAS, VIDEO_RESOURCES } from './constants';

export default function App() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('device-1');
  const [personas, setPersonas] = useState<Record<string, Persona>>(INITIAL_PERSONAS);
  const [videoAssets, setVideoAssets] = useState<VideoAsset[]>(VIDEO_RESOURCES);
  
  // Preload a few mock publishing tasks to establish initial visual realism (failed / pending)
  const [tasks, setTasks] = useState<ScheduleTask[]>([
    {
      id: 'task-preload-1',
      deviceId: 'device-1',
      videoAssetId: 'res-1',
      description: 'POV: craft high grade matcha with me. Whispering ASMR sounds on a cozy rainy morning.',
      tags: ['#matchalove', '#asmrcooking', '#lifestyle', '#aestheticcooking'],
      scheduleTime: '05/20 11:00',
      status: 'failed',
      errorLog: 'Network timeout: residential proxy handshakes exceeded 15s limit.'
    },
    {
      id: 'task-preload-2',
      deviceId: 'device-1',
      videoAssetId: 'res-1',
      description: 'Satisfying matcha green powder whisking. Relieve your anxiety with foam bubbles.',
      tags: ['#matchalatte', '#asmrrecipes', '#peacefulrecipes'],
      scheduleTime: '05/21 18:00',
      status: 'pending'
    },
    {
      id: 'task-preload-3',
      deviceId: 'device-2',
      videoAssetId: 'res-3',
      description: 'When everyone defaults, you stack bricks. Morning 5 AM consistency core workout.',
      tags: ['#coreworkout', '#gymmotivation', '#5amclub', '#fitness'],
      scheduleTime: '05/21 11:00',
      status: 'pending'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'simulation' | 'persona' | 'warmup' | 'content' | 'scheduler' | 'analytics'>('simulation');

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

  // Aggregate metrics
  const totalFollowersCount = devices.reduce((sum, d) => sum + d.followerCount, 0);
  const totalViewsCalculated = devices.reduce((sum, d) => sum + d.totalViews, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Global Navigation Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 xl:px-6 py-3 xl:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 xl:gap-4 z-40 sticky top-0">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="w-5.5 h-5.5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xs font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none">
              海外自媒体模拟培育与代运营控制系统
              <span className="text-xs bg-indigo-950/60 border border-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
                MCN FARM PRO
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-none">
              每台设备独立住宅IP与专属人设 • OCR多模态视觉审计发帖 • 大模型自动克隆复刻
            </p>
          </div>
        </div>

        {/* Global Summary Statistics bar */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-500 block text-xs leading-none">ONLINE DEVICES</span>
              <span className="text-xs font-bold font-mono text-white leading-tight">
                {devices.length} 台
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Users className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-500 block text-xs leading-none">ACCUMULATED FOLLOWERS</span>
              <span className="text-xs font-bold font-mono text-emerald-400 leading-tight">
                {totalFollowersCount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg text-left flex items-center gap-2 transition hover:bg-slate-800/60">
            <Flame className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-slate-500 block text-xs leading-none">TOTAL VIDEO VIEWS</span>
              <span className="text-xs font-bold font-mono text-orange-400 leading-tight">
                {totalViewsCalculated.toLocaleString()}
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
              设备农场 (Device Matrix)
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-900/30 font-mono tracking-tight font-bold">
              ROUTER OK
            </span>
          </div>

          {/* Quick instructions widget top of list */}
          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs text-slate-450 leading-relaxed">
            <div className="flex gap-1.5 text-xs font-bold text-slate-300 items-center mb-1 leading-none">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>设备状态机机制 (State Mapping)</span>
            </div>
            点击任意设备切换受控核心，管理其特定的【人设画像、视频库、发布日程、账号中心数据】
          </div>

          <div className="space-y-2">
            {devices.map(dev => {
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
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between relative overflow-hidden ${
                    isActive 
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg bento-glow-indigo' 
                      : 'bg-slate-800/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  {/* Subtle active border light indicator */}
                  {isActive && (
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                  )}

                  {/* Device Header line */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-slate-500 block leading-none font-bold uppercase uppercase-wide mb-1">
                        PROXY IP BOUND
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 font-mono tracking-tight leading-none">
                        {dev.name}
                      </h4>
                    </div>
                    
                    {/* State dot */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
                      <span className="text-xs font-mono text-slate-400">{dev.platform}</span>
                    </div>
                  </div>

                  {/* Device mid metadata */}
                  <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3.5 border-t border-slate-800/80 text-xs font-mono text-slate-400 leading-tight">
                    <div>
                      <span className="text-slate-500 block text-xs leading-none mb-0.5">BOUND ID</span>
                      <span className="text-slate-200 font-semibold truncate block">@{dev.username}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs leading-none mb-0.5">PROXY ROUTE</span>
                      <span className="text-slate-300 truncate block">{dev.ip}</span>
                    </div>
                  </div>

                  {/* Bottom channel statistics snapshot */}
                  <div className="flex justify-between items-center mt-3 pt-2 text-xs font-mono border-t border-dashed border-slate-800/80">
                    <span className="text-xs text-indigo-400 uppercase font-bold tracking-tight bg-indigo-950/60 px-1 rounded-sm">
                      {dev.niche}
                    </span>
                    <div className="flex gap-2">
                      <span><strong className="text-white font-bold">{dev.followerCount.toLocaleString()}</strong> fans</span>
                      <span><strong className="text-white font-bold">{dev.videoCount}</strong> vids</span>
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
          <div className="bg-slate-800/40 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-left bento-glow-indigo">
            <div>
              <span className="text-xs text-indigo-455 uppercase font-mono font-bold tracking-wider">
                ACTIVE CONTROL TARGET (当前选中操控设备)
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xs font-bold font-mono text-white leading-none tracking-tight">
                  {activeDevice.name}
                </h2>
                <span className="text-xs text-slate-400 font-mono ml-1">
                  (IP: {activeDevice.ip} — {activeDevice.region})
                </span>
              </div>
            </div>

            {/* Platform Selection Buttons - Tiktok, Instagram, youtube */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 text-xs mr-1">PLATFORM:</span>
              {(['TikTok', 'Instagram', 'YouTube'] as const).map(platform => (
                <button
                  key={platform}
                  onClick={() => {
                    setDevices(prev => prev.map(d => 
                      d.id === activeDevice.id ? { ...d, platform } : d
                    ));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer font-bold text-xs ${
                    activeDevice.platform === platform
                      ? platform === 'TikTok' 
                        ? 'bg-black border-zinc-700 text-white shadow-lg'
                        : platform === 'Instagram'
                        ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 border-rose-500/50 text-white'
                        : 'bg-red-600 border-red-700 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {platform === 'TikTok' ? <TikTokIcon className="w-3.5 h-3.5" /> : platform === 'Instagram' ? <Instagram className="w-3.5 h-3.5" /> : <Youtube className="w-4 h-4" />}
                  {platform}
                </button>
              ))}
            </div>

            {/* Quick status attributes badges */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-xs leading-tight mb-0.5">NICHE RANGE</span>
                <span className="font-bold text-indigo-400 uppercase">{activeDevice.niche}</span>
              </div>
              <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-xs leading-tight mb-0.5">TOTAL SCRIPT FLOWS</span>
                <span className="font-bold text-emerald-400">
                  {videoAssets.filter(a => a.niche === activeDevice.niche || a.niche === 'all').length} 个 MP4
                </span>
              </div>
            </div>
          </div>

          {/* 3. Horizontal tabs selection designed as high-quality Bento Grid cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-2 select-none">
            {[
              { id: 'simulation', label: '🖥️ 远程控制', desc: '截图及视觉AI诊断' },
              { id: 'persona', label: '👤 人设仓库', desc: '肖像兴趣与视频大纲' },
              { id: 'warmup', label: '📅 养号规划', desc: '模拟浏览防反作弊' },
              { id: 'content', label: '📝 克隆选题', desc: '内容表与关键帧分析' },
              { id: 'scheduler', label: '🕒 调度队列', desc: '自动定时挂钩排期' },
              { id: 'analytics', label: '📊 账号效能', desc: 'SVG成长与诊断建议' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                    isActive 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 bento-glow-indigo shadow-lg' 
                      : 'bg-slate-800/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs tracking-tight">{tab.label}</span>
                  <span className="text-xs text-slate-500 pt-2 leading-tight font-mono block">
                    {tab.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 4. Tab views dispatcher block */}
          <div className="flex-1 min-h-[500px]">
            {activeTab === 'simulation' && (
              <DeviceSimulator 
                device={activeDevice} 
                persona={activePersona} 
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'persona' && (
              <PersonaManager 
                device={activeDevice} 
                persona={activePersona} 
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            )}
            {activeTab === 'warmup' && (
              <WarmupPlanner 
                device={activeDevice} 
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'content' && (
              <ContentPlanner 
                device={activeDevice} 
                onAddRecreatedVideo={handleAddVideoAsset}
              />
            )}
            {activeTab === 'scheduler' && (
              <PublisherScheduler 
                device={activeDevice}
                videoAssets={videoAssets}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsAdvisor 
                device={activeDevice}
              />
            )}
          </div>

        </main>

      </div>

    </div>
  );
}
