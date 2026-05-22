import React, { useState, useEffect } from 'react';
import {
  Search, Download, Play, CheckCircle, Clock, AlertTriangle,
  TrendingUp, Eye, Heart, MessageCircle, Share2, Loader2,
  Film, Database, Zap, Shield, RefreshCw, ChevronRight, ChevronLeft, BarChart2, Terminal
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
];

const MOCK_OWN_VIDEOS: VideoItem[] = [
  { id: 'o1', username: `@emma_kitchen_diaries`, caption: 'POV: Aesthetic kitchen morning routine 🌿', views: 1012, likes: 89, comments: 12, shares: 4, duration: '0:45', url: '', thumbnail: '', collected_at: '2026-05-20 14:10' },
  { id: 'o2', username: `@emma_kitchen_diaries`, caption: 'Slow pour-over on a rainy day ☕ #coffeeasmr', views: 812, likes: 61, comments: 8, shares: 3, duration: '0:38', url: '', thumbnail: '', collected_at: '2026-05-20 14:10' },
  { id: 'o3', username: `@emma_kitchen_diaries`, caption: 'Golden toast + runny egg = perfect morning 🍳', views: 612, likes: 52, comments: 6, shares: 2, duration: '0:31', url: '', thumbnail: '', collected_at: '2026-05-19 09:30' },
];

const PLANNED_SCRIPTS = [
  { time: '02:00', name: '同赛道爆款视频全量采集', dur: '45分钟' },
  { time: '08:30', name: '自有账号粉丝画像分析', dur: '15分钟' },
  { time: '14:00', name: '竞品对标账号监控抓取', dur: '30分钟' },
  { time: '20:15', name: '爆款评论区高赞线索提取', dur: '20分钟' },
];

const EXECUTED_SCRIPTS = [
  { name: '同赛道爆款视频采集', time: '02:00', status: 'success', count: 125, type: 'trending' },
  { name: '自有账号数据同步', time: '08:30', status: 'success', count: 42, type: 'own' },
  { name: '竞品对标数据抓取', time: '14:00', status: 'failed', count: 0, type: 'competitor' },
  { name: '评论区高赞线索提取', time: '20:15', status: 'success', count: 320, type: 'comments' },
];

export default function DataCollector({ device }: DataCollectorProps) {
  const [mode, setMode] = useState<TaskMode>('fullAuto');
  const [activated, setActivated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

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
  const [viewMode, setViewMode] = useState<'log' | 'results'>('log');

  const [logs, setLogs] = useState<string[]>([]);
  const [resultsData, setResultsData] = useState<VideoItem[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-80), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleRunSimulation = () => {
    if (!activated) return;
    setIsSimulating(true);
    setSimProgress(0);
    setLogs([]);
    setResultsData([]);
    setViewMode('log');

    addLog('[AGENT] Starting automated data collection sequence...');
    addLog('[AGENT] Injecting residential proxy headers...');
    addLog('[AGENT] Scraping TikTok For You Page (FYP)...');

    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 15 + 8;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setResultsData([...MOCK_TRENDING, ...MOCK_OWN_VIDEOS]);
        addLog(`[AGENT] ✅ Collected ${MOCK_TRENDING.length + MOCK_OWN_VIDEOS.length} items successfully.`);
        addLog('[AGENT] Data available for Content Planner → replication pipeline.');
        setIsSimulating(false);
      } else {
        addLog(`[AGENT] Scraping page ${Math.ceil(prog / 15)}... (${Math.floor(prog)}%)`);
      }
      setSimProgress(Math.min(prog, 100));
    }, 600);
  };

  const fmtNum = (n: number) => n >= 1000000 ? (n / 1000000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);

  return (
    <div className="flex flex-col gap-4 h-full text-slate-200">

      {/* Header: Agent Control Bar */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
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
            <p className="text-xs text-slate-500 mt-0.5">采集同赛道爆款 · 同步账号数据 · 抓取竞品评论线索</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!activated ? (
            <button
              onClick={() => { setActivated(true); addLog('[SYSTEM] Data Collector Agent activated.'); }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer"
            >
              激活智能体
            </button>
          ) : (
            <button
              onClick={() => { setActivated(false); addLog('[SYSTEM] Data Collector Agent deactivated.'); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              停用
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

        {/* Left Panel: Calendar & Script List */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-col h-full">
            {!activated ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-4 opacity-50">🤖</div>
                <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
                  当前暂无采集规划数据。<br />请激活上方「数据采集智能体」，系统将根据该账号维度自动生成每日采集排期。
                </p>
              </div>
            ) : (
              <>
                {/* Calendar Header */}
                <div className="flex items-center mb-4 bg-slate-900 border border-slate-700/50 rounded-xl p-1 shadow-inner relative shrink-0">
                  <button
                    onClick={() => setCalendarShift(s => s - 7)}
                    className="px-1 py-4 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition cursor-pointer"
                    title="上周"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="absolute inset-y-0 left-6 right-6 bg-cyan-500/20 rounded-xl pointer-events-none" style={{ width: `${simProgress}%`, transition: 'width 1s linear' }}></div>
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
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                            : 'bg-transparent hover:bg-slate-800 text-slate-400 disabled:opacity-40'
                            }`}
                        >
                          <span className={isSelected ? 'text-white' : isToday ? 'text-cyan-400' : 'text-slate-500'}>{p.dateStr}</span>
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

                {/* Script List based on selectedDayOffset */}
                <div className="flex-1 flex flex-col min-h-0">
                  {selectedDayOffset <= 0 ? (
                    <div className="bg-slate-800/20 rounded-xl border border-slate-700/50 flex-1 overflow-hidden relative flex flex-col mb-3">
                      <div className="flex items-center gap-4 p-4 border-b border-slate-700/50 shrink-0 bg-slate-900/50">
                        <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded font-mono">
                          EXECUTED TASKS
                        </span>
                        <span className="text-xs text-slate-300 font-bold truncate">已执行采集列表</span>
                        <span className="text-[10px] text-slate-500 ml-auto">共 {EXECUTED_SCRIPTS.length} 条记录</span>
                      </div>
                      <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-narrow">
                        <table className="w-full text-left text-xs text-slate-300 font-mono whitespace-nowrap min-w-[600px]">
                          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 shadow-sm border-b border-slate-700/50">
                            <tr className="text-slate-500 uppercase">
                              <th className="py-2.5 px-3 font-bold">采集脚本</th>
                              <th className="py-2.5 px-2 font-bold">执行时间</th>
                              <th className="py-2.5 px-2 font-bold text-center">操作</th>
                              <th className="py-2.5 px-2 font-bold">状态</th>
                              <th className="py-2.5 px-2 font-bold">采集数量</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {EXECUTED_SCRIPTS.map((res, i) => (
                              <tr key={i} className="hover:bg-slate-800/50 transition group">
                                <td className="py-2 px-3 font-bold text-slate-200">{res.name}</td>
                                <td className="py-2 px-2 text-slate-400">{res.time}</td>
                                <td className="py-2 px-2 text-center">
                                  <div className="flex items-center justify-center gap-1 transition">
                                    <button onClick={() => setViewMode('log')} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-950/40 text-sky-400 hover:bg-sky-900/60 transition cursor-pointer">日志</button>
                                    <button onClick={() => setViewMode('results')} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/60 transition cursor-pointer">结果</button>
                                  </div>
                                </td>
                                <td className="py-2 px-2">
                                  {res.status === 'success' ? (
                                    <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1 py-0.5 rounded border border-emerald-900/50">完成</span>
                                  ) : (
                                    <span className="text-[9px] bg-rose-950/40 text-rose-400 px-1 py-0.5 rounded border border-rose-900/50">异常</span>
                                  )}
                                </td>
                                <td className="py-2 px-2 text-cyan-400 font-bold">{res.count} 条</td>
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
                          <span className="text-xs bg-cyan-950 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
                            PLANNED TASKS
                          </span>
                          <span className="text-xs text-slate-300 font-bold">已规划采集队列</span>
                        </div>
                      </div>

                      {PLANNED_SCRIPTS.map((script, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition group">
                          <div className="flex items-center gap-4 overflow-hidden mr-2">
                            <span className="text-slate-400 font-bold font-mono text-sm">{script.time}</span>
                            <div className="truncate text-left">
                              <span className="font-bold text-slate-200 text-xs block">{script.name}</span>
                              <span className="text-slate-500 block text-[10px] mt-0.5">预计采集时长: {script.dur}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition">
                            <button
                              onClick={handleRunSimulation}
                              disabled={isSimulating}
                              className="text-[10px] font-bold bg-cyan-600/80 hover:bg-cyan-500 text-white px-2 py-1 rounded transition shadow-lg shadow-cyan-500/20 flex items-center gap-1 disabled:opacity-50"
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
                        + 添加自定义采集脚本
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel: Logs & Results */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex flex-col text-left h-full shadow-lg shadow-slate-900/50">
            {(selectedDayOffset <= 0 || isSimulating) ? (
              <>
                <div className="flex items-center gap-4 border-b border-slate-700/50 pb-4 mb-2 justify-between">
                  <div className="flex items-center gap-4">

                    <button
                      onClick={() => setViewMode('results')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${viewMode === 'results' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <Database className="w-4 h-4" />
                      <span className="text-xs">采集结果</span>
                    </button>
                    <button
                      onClick={() => setViewMode('log')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded transition ${viewMode === 'log' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <Terminal className="w-4 h-4" />
                      <span className="text-xs">采集日志</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {isSimulating && (
                      <span className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded border border-slate-700 text-slate-300">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        采集中...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 relative rounded overflow-hidden min-h-[300px]">
                  {viewMode === 'log' ? (
                    <div className="absolute inset-0 overflow-y-auto space-y-1.5 bg-black/80 p-4 rounded border border-slate-900 font-mono text-[10px] text-left text-slate-400 select-all scrollbar-narrow leading-tight">
                      {(logs.length === 0 && !isSimulating && activated) ? (
                        [
                          "2026-05-21 14:30:00,123 - INFO - [DataCollector] ========== 开始历史任务恢复 ==========",
                          "2026-05-21 14:30:01,456 - INFO - [DataCollector] 连接数据库成功",
                          "2026-05-21 14:30:05,123 - INFO - [DataCollector] 抓取同赛道内容: 电影/广告",
                          "2026-05-21 14:30:10,789 - INFO - [DataCollector] 共发现 125 条高潜爆款视频",
                          "2026-05-21 14:31:15,123 - INFO - HTTP Request: POST https://tiktok.com/api/search \"HTTP/1.1 200 OK\"",
                          "2026-05-21 14:35:00,456 - INFO - [DataCollector] 数据清洗与标签抽取完成",
                          "2026-05-21 14:45:00,789 - INFO - ✅ [SUCCESS] 采集脚本执行完成！"
                        ].map((log, i) => {
                          let col = 'text-slate-300';
                          if (log.includes('INFO - HTTP')) col = 'text-slate-500';
                          else if (log.includes('SUCCESS')) col = 'text-emerald-400 font-bold';
                          else if (log.includes('[DataCollector]')) col = 'text-cyan-400';

                          return (
                            <div key={i} className={`break-all ${col}`}>
                              {log}
                            </div>
                          );
                        })
                      ) : logs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
                          <Terminal className="w-8 h-8 mb-2" />
                          <span>{activated ? '等待采集指令...' : '等待指令... 请先激活数据采集智能体。'}</span>
                        </div>
                      ) : (
                        logs.map((log, i) => {
                          let col = 'text-slate-300';
                          if (log.includes('INFO - HTTP')) col = 'text-slate-500';
                          else if (log.includes('[AGENT]')) col = 'text-cyan-400';
                          return (
                            <div key={i} className={`break-all ${col}`}>
                              {log}
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : viewMode === 'results' ? (
                    <div className="absolute inset-0 overflow-y-auto bg-slate-900/50 p-4 rounded border border-slate-900 scrollbar-narrow flex flex-col gap-2">
                      {(!isSimulating && resultsData.length === 0) ? (
                        [...MOCK_TRENDING, ...MOCK_OWN_VIDEOS].map(v => (
                          <div key={v.id} className="group bg-black/30 border border-slate-700/50 rounded-xl p-3 hover:border-cyan-500/30 hover:bg-cyan-950/10 transition cursor-pointer">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-cyan-400 font-mono">{v.username}</span>
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
                            </div>
                          </div>
                        ))
                      ) : (
                        resultsData.map(v => (
                          <div key={v.id} className="group bg-black/30 border border-slate-700/50 rounded-xl p-3 hover:border-cyan-500/30 hover:bg-cyan-950/10 transition cursor-pointer">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-cyan-400 font-mono">{v.username}</span>
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
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-8 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

                <div className="w-24 h-24 bg-slate-900 border-2 border-cyan-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] relative z-10">
                  <Database className="w-10 h-10 text-cyan-400 animate-bounce" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight z-10">采集智能体守护中</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed z-10">
                  自动化采集引擎已就绪。<br />
                  系统将在规划的时间点自动运行爬虫和同步任务，并将最新的数据沉淀到云端库中。
                </p>

                <div className="mt-8 flex gap-3 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 z-10">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                    监测账号: {device.name}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                    代理池: 稳定
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
