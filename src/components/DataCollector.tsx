import React, { useState } from 'react';
import {
  Search, Download, Play, CheckCircle, Clock, AlertTriangle,
  TrendingUp, Eye, Heart, MessageCircle, Share2, Loader2,
  Film, Database, Zap, Shield, RefreshCw, ChevronRight, BarChart2
} from 'lucide-react';
import { Device } from '../types';

interface DataCollectorProps {
  device: Device;
}

type TaskMode = 'fullAuto' | 'userConfirm';
type CollectorStatus = 'idle' | 'running' | 'done' | 'error';

interface VideoItem {
  id: string;
  username: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
  url: string;
  thumbnail: string;
  collected_at: string;
}

const MOCK_TRENDING: VideoItem[] = [
  { id: 't1', username: '@aesthetic_mornings', caption: 'Morning kitchen rituals that changed my life 🌿 #slowliving #aesthetic', views: 8920000, likes: 412000, comments: 9800, shares: 71200, duration: '0:47', url: 'https://tiktok.com/@aesthetic_mornings/video/1', thumbnail: '', collected_at: '2026-05-22 08:31' },
  { id: 't2', username: '@cozy_recipe_hub', caption: 'The most satisfying scrambled eggs you\'ll ever make #breakfast #asmr', views: 6540000, likes: 298000, comments: 6200, shares: 53100, duration: '0:32', url: 'https://tiktok.com/@cozy_recipe_hub/video/2', thumbnail: '', collected_at: '2026-05-22 08:31' },
  { id: 't3', username: '@kitchen_vibes_daily', caption: 'Cottage cheese toast is taking over my mornings 🍞 #healthyeats', views: 5210000, likes: 231000, comments: 4100, shares: 38400, duration: '0:58', url: 'https://tiktok.com/@kitchen_vibes_daily/video/3', thumbnail: '', collected_at: '2026-05-22 08:31' },
  { id: 't4', username: '@minimalist_chef', caption: 'Simple ramen upgrade that hits every time 🍜 #ramen #foodasmr', views: 4870000, likes: 189000, comments: 3800, shares: 29900, duration: '1:02', url: 'https://tiktok.com/@minimalist_chef/video/4', thumbnail: '', collected_at: '2026-05-22 08:31' },
  { id: 't5', username: '@linencountertop', caption: 'My latte art journey: Day 1 vs Day 30 ☕ #barista #coffeelover', views: 3910000, likes: 162000, comments: 2900, shares: 24500, duration: '0:41', url: 'https://tiktok.com/@linencountertop/video/5', thumbnail: '', collected_at: '2026-05-22 08:31' },
  { id: 't6', username: '@naturalmindkitchen', caption: 'This avocado pasta is so simple it hurts 🥑 #pasta #quickmeals', views: 2760000, likes: 114000, comments: 1700, shares: 18200, duration: '0:55', url: 'https://tiktok.com/@naturalmindkitchen/video/6', thumbnail: '', collected_at: '2026-05-22 08:31' },
];

const MOCK_OWN_VIDEOS: VideoItem[] = [
  { id: 'o1', username: `@${device_username()}`, caption: 'POV: Aesthetic kitchen morning routine 🌿', views: 1012, likes: 89, comments: 12, shares: 4, duration: '0:45', url: '', thumbnail: '', collected_at: '2026-05-20 14:10' },
  { id: 'o2', username: `@${device_username()}`, caption: 'Slow pour-over on a rainy day ☕ #coffeeasmr', views: 812, likes: 61, comments: 8, shares: 3, duration: '0:38', url: '', thumbnail: '', collected_at: '2026-05-20 14:10' },
  { id: 'o3', username: `@${device_username()}`, caption: 'Golden toast + runny egg = perfect morning 🍳', views: 612, likes: 52, comments: 6, shares: 2, duration: '0:31', url: '', thumbnail: '', collected_at: '2026-05-19 09:30' },
  { id: 'o4', username: `@${device_username()}`, caption: 'Making matcha from scratch 💚 #matcha #asmr', views: 412, likes: 38, comments: 5, shares: 1, duration: '0:52', url: '', thumbnail: '', collected_at: '2026-05-19 09:30' },
  { id: 'o5', username: `@${device_username()}`, caption: 'Vanilla ice cream satisfying scoop 🍦', views: 212, likes: 19, comments: 3, shares: 1, duration: '0:27', url: '', thumbnail: '', collected_at: '2026-05-18 11:20' },
];

function device_username() { return 'emma_kitchen_diaries'; }

export default function DataCollector({ device }: DataCollectorProps) {
  const [mode, setMode] = useState<TaskMode>('fullAuto');
  const [activated, setActivated] = useState(false);
  const [trendingStatus, setTrendingStatus] = useState<CollectorStatus>('idle');
  const [ownStatus, setOwnStatus] = useState<CollectorStatus>('idle');
  const [trendingProgress, setTrendingProgress] = useState(0);
  const [ownProgress, setOwnProgress] = useState(0);
  const [trendingData, setTrendingData] = useState<VideoItem[]>([]);
  const [ownData, setOwnData] = useState<VideoItem[]>([]);
  const [activePanel, setActivePanel] = useState<'trending' | 'own'>('trending');
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] DataCollector Agent initialized.`,
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Awaiting activation...`,
  ]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-80), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runTrending = () => {
    if (!activated) return;
    setTrendingStatus('running');
    setTrendingProgress(0);
    setTrendingData([]);
    addLog('[AGENT] Starting trending video crawl for niche: ' + device.niche);
    addLog('[AGENT] Injecting residential proxy headers...');
    addLog('[AGENT] Scraping TikTok For You Page (FYP)...');
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 12 + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setTrendingData(MOCK_TRENDING);
        setTrendingStatus('done');
        addLog(`[AGENT] ✅ Collected ${MOCK_TRENDING.length} trending videos.`);
        addLog('[AGENT] Data available for Content Planner → replication pipeline.');
      } else {
        addLog(`[AGENT] Scraping page ${Math.ceil(prog / 15)}... (${Math.floor(prog)}%)`);
      }
      setTrendingProgress(Math.min(prog, 100));
    }, 600);
  };

  const runOwn = () => {
    if (!activated) return;
    setOwnStatus('running');
    setOwnProgress(0);
    setOwnData([]);
    addLog('[AGENT] Starting own account data pull for @' + device.username);
    addLog('[AGENT] Authenticating session token...');
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 15 + 8;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setOwnData(MOCK_OWN_VIDEOS);
        setOwnStatus('done');
        addLog(`[AGENT] ✅ Synced ${MOCK_OWN_VIDEOS.length} own videos from @${device.username}.`);
        addLog('[AGENT] Data ready for Analytics pipeline.');
      } else {
        addLog(`[AGENT] Fetching video ${Math.ceil(prog / 20)} data...`);
      }
      setOwnProgress(Math.min(prog, 100));
    }, 500);
  };

  const fmtNum = (n: number) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);

  return (
    <div className="flex flex-col gap-4 h-full text-slate-200">

      {/* Header: Agent Control Bar */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Database className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">数据采集智能体</span>
              {activated
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">● 已激活</span>
                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-500">○ 未激活</span>
              }
            </div>
            <p className="text-xs text-slate-500 mt-0.5">采集同赛道爆款 · 同步账号数据</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode toggle */}

          {/* Activate button */}
          {!activated ? (
            <button
              onClick={() => { setActivated(true); addLog('[SYSTEM] Agent activated. Mode: ' + (mode === 'fullAuto' ? '全权托管' : '用户确认')); }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer"
            >
              激活智能体
            </button>
          ) : (
            <button
              onClick={() => { setActivated(false); addLog('[SYSTEM] Agent deactivated.'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              停用
            </button>
          )}
        </div>
      </div>

      {/* Main two-column layout: Left = Script/Plan, Right = Logs/Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* LEFT: Script & Collection Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Sub-tab switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setActivePanel('trending')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${activePanel === 'trending' ? 'bg-rose-950/40 border-rose-500/40 text-rose-400 shadow' : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> 同赛道爆款视频采集
              {trendingStatus === 'done' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              {trendingStatus === 'running' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </button>
            <button
              onClick={() => setActivePanel('own')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${activePanel === 'own' ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-400 shadow' : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> 自有账号数据同步
              {ownStatus === 'done' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              {ownStatus === 'running' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </button>
          </div>

          {/* Panel: Trending */}
          {activePanel === 'trending' && (
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-white">同赛道爆款视频</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">用于内容复刻 · 采集当前账号赛道 ({device.niche}) 热门视频</p>
                </div>
                <button
                  onClick={runTrending}
                  disabled={!activated || trendingStatus === 'running'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${!activated ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed' : trendingStatus === 'running' ? 'bg-rose-950/40 text-rose-400 border border-rose-900 cursor-wait' : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-lg'}`}
                >
                  {trendingStatus === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  {trendingStatus === 'running' ? '采集中...' : '立即采集'}
                </button>
              </div>

              {trendingStatus === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                    <span>采集进度</span><span>{Math.floor(trendingProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-300" style={{ width: `${trendingProgress}%` }} />
                  </div>
                </div>
              )}

              {trendingData.length === 0 && trendingStatus !== 'running' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 gap-2">
                  <TrendingUp className="w-10 h-10 opacity-20" />
                  <p className="text-sm font-bold text-slate-500">{activated ? '点击「立即采集」开始' : '请先激活智能体'}</p>
                  <p className="text-xs text-slate-600">采集完成后将显示同赛道爆款视频列表，可一键进入复刻流程</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto scrollbar-narrow space-y-2">
                  {trendingData.map(v => (
                    <div key={v.id} className="group bg-black/30 border border-slate-800 rounded-xl p-3 hover:border-rose-500/30 hover:bg-rose-950/10 transition cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-rose-400 font-mono">{v.username}</span>
                            <span className="text-[10px] text-slate-600">{v.duration}</span>
                            <span className="text-[10px] text-slate-600">{v.collected_at}</span>
                          </div>
                          <p className="text-xs text-slate-300 truncate">{v.caption}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono">
                            <span className="flex items-center gap-1 text-slate-400"><Eye className="w-3 h-3" />{fmtNum(v.views)}</span>
                            <span className="flex items-center gap-1 text-rose-400"><Heart className="w-3 h-3" />{fmtNum(v.likes)}</span>
                            <span className="flex items-center gap-1 text-sky-400"><MessageCircle className="w-3 h-3" />{fmtNum(v.comments)}</span>
                            <span className="flex items-center gap-1 text-emerald-400"><Share2 className="w-3 h-3" />{fmtNum(v.shares)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { addLog(`[AGENT] Queueing video for replication: ${v.caption.slice(0, 30)}...`); window.dispatchEvent(new CustomEvent('replicate-video', { detail: { url: v.url } })); }}
                          className="shrink-0 flex items-center gap-1 px-2 py-1 bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Film className="w-3 h-3" /> 复刻
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Panel: Own account */}
          {activePanel === 'own' && (
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold text-white">自有账号数据同步</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">同步 @{device.username} 的视频数据 · 用于数据分析</p>
                </div>
                <button
                  onClick={runOwn}
                  disabled={!activated || ownStatus === 'running'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${!activated ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed' : ownStatus === 'running' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg'}`}
                >
                  {ownStatus === 'running' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {ownStatus === 'running' ? '同步中...' : '立即同步'}
                </button>
              </div>

              {ownStatus === 'running' && (
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                    <span>同步进度</span><span>{Math.floor(ownProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300" style={{ width: `${ownProgress}%` }} />
                  </div>
                </div>
              )}

              {ownData.length === 0 && ownStatus !== 'running' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600 gap-2">
                  <BarChart2 className="w-10 h-10 opacity-20" />
                  <p className="text-sm font-bold text-slate-500">{activated ? '点击「立即同步」开始' : '请先激活智能体'}</p>
                  <p className="text-xs text-slate-600">同步完成后将显示账号历史视频数据，用于数据分析与诊断</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto scrollbar-narrow space-y-2">
                  {ownData.map(v => (
                    <div key={v.id} className="bg-black/30 border border-slate-800 rounded-xl p-3 hover:border-indigo-500/30 hover:bg-indigo-950/10 transition cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-indigo-400 font-mono">{v.collected_at}</span>
                        <span className="text-[10px] text-slate-600">{v.duration}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate">{v.caption}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] font-mono">
                        <span className="flex items-center gap-1 text-slate-400"><Eye className="w-3 h-3" />{fmtNum(v.views)}</span>
                        <span className="flex items-center gap-1 text-rose-400"><Heart className="w-3 h-3" />{fmtNum(v.likes)}</span>
                        <span className="flex items-center gap-1 text-sky-400"><MessageCircle className="w-3 h-3" />{fmtNum(v.comments)}</span>
                        <span className="flex items-center gap-1 text-emerald-400"><Share2 className="w-3 h-3" />{fmtNum(v.shares)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Logs + Status */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> 执行日志
              </span>
              <button onClick={() => setLogs([])} className="text-[10px] text-slate-600 hover:text-slate-400 cursor-pointer transition">清空</button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-narrow space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-[10px] font-mono leading-relaxed">
                  <span className={`${log.includes('✅') ? 'text-emerald-400' : log.includes('[AGENT]') ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status summary card */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">采集状态</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-rose-400" />爆款采集</span>
              <span className={`font-bold font-mono ${trendingStatus === 'done' ? 'text-emerald-400' : trendingStatus === 'running' ? 'text-amber-400' : 'text-slate-600'}`}>
                {trendingStatus === 'done' ? `${trendingData.length} 条` : trendingStatus === 'running' ? '进行中...' : '待采集'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5"><BarChart2 className="w-3 h-3 text-indigo-400" />账号同步</span>
              <span className={`font-bold font-mono ${ownStatus === 'done' ? 'text-emerald-400' : ownStatus === 'running' ? 'text-amber-400' : 'text-slate-600'}`}>
                {ownStatus === 'done' ? `${ownData.length} 条` : ownStatus === 'running' ? '进行中...' : '待同步'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-500">运行模式</span>
              <span className={`font-bold text-[11px] ${mode === 'fullAuto' ? 'text-indigo-400' : 'text-amber-400'}`}>
                {mode === 'fullAuto' ? '⚡ 全权托管' : '🛡 用户确认'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
