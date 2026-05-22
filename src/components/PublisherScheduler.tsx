import React, { useState, useEffect } from 'react';
import {
  Calendar, CheckCircle, Clock, Plus, Trash2, Video,
  Send, AlertTriangle, Play, RefreshCw, HelpCircle, Laptop, Smartphone, Check, Zap, Shield, BarChart2, TrendingUp, Users, Eye,
  Sparkles, Award, PieChart, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { ScheduleTask, VideoAsset, Device, CreatorStats } from '../types';
import { MOCK_CREATOR_STATS } from '../constants';

interface PublisherSchedulerProps {
  device: Device;
  videoAssets: VideoAsset[];
  tasks: ScheduleTask[];
  onAddTask: (task: ScheduleTask) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: 'pending' | 'posting' | 'success' | 'failed') => void;
  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;
}

export default function PublisherScheduler({
  device,
  videoAssets,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onUpdateDeviceStats
}: PublisherSchedulerProps) {

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'posting' | 'success' | 'failed'>('all');
  const [viewMode, setViewMode] = useState<'schedule' | 'published'>('schedule');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const handleOpenScheduleModal = () => {
      setShowCreateModal(true);
    };
    window.addEventListener('trigger-create-task', handleOpenScheduleModal);
    return () => window.removeEventListener('trigger-create-task', handleOpenScheduleModal);
  }, []);
  const [showAutoPostVisualizer, setShowAutoPostVisualizer] = useState(false);
  const [activeVisualizerTask, setActiveVisualizerTask] = useState<ScheduleTask | null>(null);
  const [agentActivated, setAgentActivated] = useState<boolean>(false);
  const [agentMode, setAgentMode] = useState<'fullAuto' | 'userConfirm'>('fullAuto');

  // Trend Modal State (legacy)
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [activeTrendTask, setActiveTrendTask] = useState<ScheduleTask | null>(null);

  // New Published View States (AnalyticsAdvisor style)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  const stats: CreatorStats = MOCK_CREATOR_STATS[device.id] || MOCK_CREATOR_STATS['device-1'];

  const handleRunAiAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);

      if (device.niche === 'aesthetic-cooking') {
        setAiSuggestions([
          '📹 【黄金3秒停留优化】：检测到完播留存图在第2.5秒有明显瀑布式下跌。原视频开场略显拖沓，建议在前1.5秒直接插入【极高分贝的纯享切冰块或抹茶起泡】音效，用听觉顿挫感强行截断用户的下滑动作。',
          '🏷️ 【SEO标签扩充】：目前ForYou流量占比高达89%，但精准检索流量小于3%。建议在文案中引入海外高热检索长尾词如 "how to froth milk like a barista"，并在标签中加入 #asmrrecipes。',
          '🔥 【内容规划微调】：当前粉丝互动黏性保持优良。建议周五推出一期“微缩场景烹饪挑战”，以极端微小形态的高反差视效在海外主页激发高强度评论转发。'
        ]);
      } else if (device.niche === 'fitness') {
        setAiSuggestions([
          '📹 【前置字幕钩子 (Visual Hook)】：完播留存曲线在初段维持率偏低（54%）。建议视频第一帧不仅要展示早起时钟，更应直接使用大字重、高反差的字幕“Gym secrets you wish you knew earlier 🤫”。',
          '🏷️ 【标签交叉覆盖】：当前#gymmotivation 已经进入超级红海。建议组合【中高热度交叉标签】，例如组合 #5amclub #deadlifthacks 从而快速从精准细分流量池中脱颖而出。',
          '⏰ 【推送排班建议】：依据纽约受众的高活数据，北美清晨通勤时段（07:00-08:30 EST）对低能量长阻训练类内容的点赞转换极佳，建议微调发帖时间。'
        ]);
      } else {
        setAiSuggestions([
          '📹 【音频卡点对齐 (BPM Alignment)】：该作品剪辑卡点與背景音乐存在0.4秒以上的毫秒差。海外推流算法对高卡点率的作品有隐性推荐偏好，建议在后期剪辑时强制使场景切片对准音频BPM波峰。',
          '💬 【诱导性文案设定】：目前作品平均评论互动占比低于0.5%。可以通过首发置顶评论自问自答（如：“Rate this setup 1 to 10 in the replies 👇”）或文案中加入留白提问。',
          '📈 【设备矩阵错峰】：该中转代理IP下绑定了多台设备，应当至少错开1小时进行视频传输。避免同一网段、相近时间高频触发创作者网盾的安全规则，保证出单流推送安全无阻。'
        ]);
      }
    }, 1500);
  };

  // New task form state
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('05/21 18:00');

  // Interactive step visualizer simulation
  const [visualizerStep, setVisualizerStep] = useState<number>(0);
  const [visualizerLogs, setVisualizerLogs] = useState<string[]>([]);
  const [typewriterText, setTypewriterText] = useState<string>('');

  // Auto set fields when selecting video asset
  useEffect(() => {
    if (selectedAssetId) {
      const selectedAsset = videoAssets.find(a => a.id === selectedAssetId);
      if (selectedAsset) {
        setCaption(selectedAsset.script || selectedAsset.title);
        setTagsInput(selectedAsset.tags.join(', '));
      }
    }
  }, [selectedAssetId, videoAssets]);

  // Initial form values setup
  useEffect(() => {
    if (videoAssets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(videoAssets[0].id);
    }
  }, [device, videoAssets, selectedAssetId]);

  const getCover = (index: number) => {
    return `/1 (${(index % 5) + 1}).png`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;

    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const newTask: ScheduleTask = {
      id: `task-${Date.now()}`,
      deviceId: device.id,
      videoAssetId: selectedAssetId,
      description: caption || 'Morning vibe showcase.',
      tags: tagsArr,
      scheduleTime: scheduleTime || '05/21 11:00',
      status: 'pending'
    };

    onAddTask(newTask);
    setShowCreateModal(false);

    // reset
    setCaption('');
    setTagsInput('');
  };

  // Run letter-by-letter typing animation for mockup post
  const triggerVisualPostingSequence = (task: ScheduleTask) => {
    setActiveVisualizerTask(task);
    setShowAutoPostVisualizer(true);
    setVisualizerStep(0);
    setVisualizerLogs([]);
    setTypewriterText('');
    onUpdateTaskStatus(task.id, 'posting');

    const asset = videoAssets.find(a => a.id === task.videoAssetId);
    const logTimeline = [
      { log: `[SYSTEM] Launching MCP agent publishing wrapper...` },
      { log: `[IP ROUTING] Testing safety proxy line: ${device.ip}... Secure (0ms latency).` },
      { log: `[SIMULATION] Unlocking iOS smartphone remotely...` },
      { log: `[SIMULATION] Booting TikTok App client v35.4.1...` },
      { log: `[ADB COORD] Injecting press coordinate on [x=540, y=2100] (Bottom Plus Icon)` },
      { log: `[ASSET INJECT] Tunnelling virtual video "${asset?.title}" through device storage... Completed.` },
      { log: `[SIMULATION] Editing video details: preparing to type captions...` },
      { log: `[TYPEWRITER] Writing: "${task.description}"` },
      { log: `[SIMULATION] Injecting keywords: "${task.tags.join(' ')}"` },
      { log: `[ADB COORD] Clicking coordinates [x=920, y=140] ("Post" button) in dark frame...` },
      { log: `[SYSTEM] Publication successfully uploaded to social server! HTTP 201 Created` },
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logTimeline.length) {
        setVisualizerLogs(prev => [...prev, logTimeline[currentLog].log]);
        setVisualizerStep(currentLog);

        // Simulating typewriter
        if (logTimeline[currentLog].log.includes('[TYPEWRITER]')) {
          let charIndex = 0;
          const typingText = task.description;
          const typewriterTimer = setInterval(() => {
            if (charIndex < typingText.length) {
              setTypewriterText(prev => prev + typingText[charIndex]);
              charIndex++;
            } else {
              clearInterval(typewriterTimer);
            }
          }, 40);
        }

        currentLog++;
      } else {
        clearInterval(interval);

        // Final completion callback after 2 seconds
        setTimeout(() => {
          onUpdateTaskStatus(task.id, 'success');
          onUpdateDeviceStats(device.id, { viewsAdd: 1240, followersAdd: 15, videoAdd: true });
          setShowAutoPostVisualizer(false);
          alert(`🎉 任务发布成功！\n对标账号: @${device.username}\n作品: ${asset?.title}\n渠道流播放属性已建立，统计面板将在3秒内同步涨幅变动。`);
        }, 1200);
      }
    }, 1800);
  };

  const filteredTasks = tasks.filter(task => {
    if (task.deviceId !== device.id) return false;
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const aggregateCounts = {
    total: tasks.filter(t => t.deviceId === device.id).length,
    pending: tasks.filter(t => t.deviceId === device.id && t.status === 'pending').length,
    posting: tasks.filter(t => t.deviceId === device.id && t.status === 'posting').length,
    success: tasks.filter(t => t.deviceId === device.id && t.status === 'success').length,
    failed: tasks.filter(t => t.deviceId === device.id && t.status === 'failed').length,
  };

  return (
    <div className="flex flex-col h-full gap-4">

      <div className="flex flex-col text-left space-y-4 text-slate-200 flex-1 min-h-0">

        {/* Tab Selection */}
        <div className="flex items-center gap-6 border-b border-slate-800 pb-2 px-2 shrink-0">
          <button
            onClick={() => setViewMode('schedule')}
            className={`pb-2 font-bold text-sm transition border-b-2 ${viewMode === 'schedule' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            定时发布任务队列 (Schedule)
          </button>
          <button
            onClick={() => setViewMode('published')}
            className={`pb-2 font-bold text-sm transition border-b-2 ${viewMode === 'published' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
          >
            已发布视频与数据 (Published)
          </button>
        </div>

        {viewMode === 'schedule' ? (
          <>
            {/* 2. Headline filter counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { key: 'all', label: '全部排期任务', count: aggregateCounts.total, color: 'border-slate-800 text-slate-300 hover:border-indigo-500/30' },
            { key: 'pending', label: '等待发布', count: aggregateCounts.pending, color: 'border-amber-900/40 text-amber-400 hover:border-indigo-500/30' },
            { key: 'posting', label: '正在执行...', count: aggregateCounts.posting, color: 'border-blue-900/40 text-blue-400 hover:border-indigo-500/30' },
            { key: 'success', label: '自动发布成功', count: aggregateCounts.success, color: 'border-emerald-950 text-emerald-400 hover:border-indigo-500/30' },
            { key: 'failed', label: '自动发布失败', count: aggregateCounts.failed, color: 'border-red-950 text-red-400 hover:border-indigo-500/30' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setActiveFilter(item.key as any)}
              className={`bg-slate-800/40 border p-4 rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/60 transition truncate ${item.color} ${activeFilter === item.key ? 'ring-2 ring-indigo-500 bg-indigo-950/20 text-white' : ''
                }`}
            >
              <span>{item.label}</span>
              <span className="font-mono font-bold text-xs bg-black/40 px-2 py-0.5 rounded-md ml-2">{item.count}</span>
            </button>
          ))}
        </div>

        {/* Grid: Form and listing */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">

          {/* 3. Scheduler Lists block (8 columns) */}
          <div className="xl:col-span-12 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo h-full">

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
              <div className="flex items-center gap-4">
                <Clock className="text-indigo-400 w-5 h-5" />
                <h3 className="text-xs font-bold text-slate-150">自动定时发帖任务队列</h3>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all bento-glow-indigo shadow-md"
              >
                <Plus className="w-4 h-4" /> 制定新定时发布任务
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 antialiased font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold select-none uppercase">
                    <th className="py-2.5 px-3">视频元文件 info</th>
                    <th className="py-2.5 px-3">发布文案 Caption</th>
                    <th className="py-2.5 px-3">SEO 优化标签</th>
                    <th className="py-2.5 px-3">预定发布 IP / 国家</th>
                    <th className="py-2.5 px-3">排班定时 publish_time</th>
                    <th className="py-2.5 px-3">状态 state</th>
                    <th className="py-2.5 px-3 text-right">人工介入</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 font-bold">
                        <Calendar className="w-8 h-8 mx-auto text-slate-700 mb-2" />
                        本时间队列下，设备【@{device.username}】暂无定时发布任务。
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task, index) => {
                      const asset = videoAssets.find(a => a.id === task.videoAssetId);

                      let statusLabel = '等待中';
                      let statusClass = 'text-amber-400 bg-amber-950/20 border-amber-900/30';
                      if (task.status === 'posting') {
                        statusLabel = '执行中...';
                        statusClass = 'text-blue-400 bg-blue-950/20 border-blue-900/30 animate-pulse';
                      } else if (task.status === 'success') {
                        statusLabel = '已发布';
                        statusClass = 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
                      } else if (task.status === 'failed') {
                        statusLabel = '自动发布成功';
                        statusClass = 'text-red-400 bg-red-950/20 border-red-900/40';
                      }

                      return (
                        <tr key={task.id} className="hover:bg-slate-900/10 transition group">

                          {/* 1. Video file preview */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-14 h-14 rounded-lg shrink-0 overflow-hidden">
                                <img src={getCover(index)} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                <div className={`absolute inset-0 ${asset?.thumbnailColor || 'bg-slate-800'} opacity-30 mix-blend-multiply`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                                  </div>
                                </div>
                                <div className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-mono px-1 py-px rounded">
                                  0:{(asset?.duration || 15).toString().padStart(2, '0')}
                                </div>
                              </div>
                              <div className="overflow-hidden max-w-[140px]">
                                <span className="font-bold text-slate-200 block truncate">{asset?.title || 'Unknown.mp4'}</span>
                                <span className="text-[10px] text-slate-500 block truncate">Duration: {asset?.duration || 15}s</span>
                              </div>
                            </div>
                          </td>

                          {/* 2. Caption */}
                          <td className="py-3 px-3 max-w-[160px]">
                            <p className="line-clamp-2 text-slate-300 leading-snug font-sans py-0.5">
                              {task.description}
                            </p>
                          </td>

                          {/* 3. Tags */}
                          <td className="py-3 px-3 max-w-[120px]">
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((t, index) => (
                                <span key={index} className="text-xs bg-slate-800/80 border border-slate-800 text-indigo-400 px-1 py-0.5 rounded leading-none">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* 4. Target device binded IP */}
                          <td className="py-3 px-3">
                            <span className="text-slate-400 block">{device.name}</span>
                            <span className="text-xs text-slate-500 block">{device.ip}</span>
                          </td>

                          {/* 5. Publish plan time */}
                          <td className="py-3 px-3 font-semibold text-indigo-400">{task.scheduleTime}</td>

                          {/* 6. Status Badges */}
                          <td className="py-3 px-3">
                            <span className={`text-xs px-2 py-0.5 rounded border ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>

                          {/* 7. Manual button actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex justify-end gap-1 px-1.5">
                              {task.status === 'pending' && (
                                <button
                                  onClick={() => triggerVisualPostingSequence(task)}
                                  className="p-1 px-2.5 text-black bg-emerald-400 hover:bg-emerald-500 rounded font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow"
                                  title="手动强制现在执行发帖"
                                >
                                  <Play className="w-3 h-3 fill-currentScale" /> 立即发布
                                </button>
                              )}

                              {task.status === 'success' && (
                                <button
                                  onClick={() => {
                                    setActiveTrendTask(task);
                                    setShowTrendModal(true);
                                  }}
                                  className="p-1 px-2.5 text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-900/40 rounded font-bold text-xs transition cursor-pointer flex items-center gap-1"
                                  title="查看数据趋势"
                                >
                                  <BarChart2 className="w-3 h-3" /> 数据
                                </button>
                              )}

                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded cursor-pointer transition shrink-0"
                                title="取消并删除此排期"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          </>
        ) : (() => {
          const publishedTasks = tasks.filter(t => t.deviceId === device.id && t.status === 'success');
          return (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
            {/* Left Panel: Videos (1/3 Width) */}
            <div className="xl:col-span-4 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full bento-glow-indigo min-h-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2 shrink-0">
                <div className="flex items-center gap-4">
                  <Play className="text-indigo-400 w-5 h-5" />
                  <span className="text-xs font-bold text-slate-150">已发布视频列表 (Published Videos)</span>
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-narrow">
                {publishedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 font-bold p-4 text-center">
                    <Video className="w-8 h-8 text-slate-700 mb-2" />
                    暂无已发布的视频，请先制定发布计划。
                  </div>
                ) : (
                  publishedTasks.map((task, i) => {
                    const asset = videoAssets.find(a => a.id === task.videoAssetId);
                    const vd = {
                      title: asset?.title || 'Unknown.mp4',
                      views: 12000 - i * 1500 + Math.floor(Math.random() * 500),
                      likes: 1200 - i * 100 + Math.floor(Math.random() * 50),
                      comments: 80 - i * 5,
                      shares: 40 - i * 2,
                      retentionRate: 0.45 - i * 0.02,
                      fypFraction: 0.92 - i * 0.03
                    };
                    const retentionMin = Math.floor(vd.retentionRate * 60);
                    const retentionSec = Math.round((vd.retentionRate * 60) % 60);
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedVideoIndex(i)}
                        className={`bg-slate-800/30 rounded-xl border p-3 cursor-pointer transition ${selectedVideoIndex === i
                          ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/50'
                          : 'border-slate-800 hover:border-indigo-500/30'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-16 h-12 rounded-lg border shrink-0 transition-colors relative overflow-hidden ${selectedVideoIndex === i
                            ? 'border-indigo-500/50 ring-2 ring-indigo-500'
                            : 'border-slate-700'
                            }`}>
                            <img src={`/1 (${(i % 8) + 1}).png`} alt="cover" className="w-full h-full object-cover opacity-90" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Play className="w-4 h-4 text-white/80" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-bold text-slate-100 truncate leading-tight">{vd.title}</h4>
                            <p className="text-[10px] text-slate-500 mt-2 font-mono">
                              📅 05/{15 + i * 2} • 🎬 {vd.retentionRate > 0 ? `${retentionMin}:${retentionSec.toString().padStart(2, '0')} 完播` : 'N/A'}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] font-mono">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-500">播放</span>
                                <span className="text-sky-400 font-bold">{vd.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-500">点赞</span>
                                <span className="text-slate-200">{vd.likes.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Panel: Charts and Diagnostics (2/3 Width) */}
            <div className="xl:col-span-8 flex flex-col gap-4 h-full min-h-0">
              {publishedTasks.length === 0 ? (
                <div className="flex-1 bg-slate-800/40 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-sm font-bold">
                  需先发布视频才能查看数据报表
                </div>
              ) : (
                <>
                  {/* Top 4/5: 3 Charts Stacked */}
                  <div className="flex-[4] grid grid-cols-2 gap-4 min-h-0 overflow-y-auto scrollbar-narrow pr-1 pb-2">
                    {/* Chart 1: Views */}
                    <div className="bg-slate-900/40 p-4 pb-7 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
                      <span className="text-[10px] text-slate-400 block mb-2 shrink-0">播放量趋势 (Views)</span>
                      <div className="flex-1 relative ml-6 mt-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                          <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q30,16 60,10 T100,2" : "M0,18 Q40,15 70,5 T100,5"} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                          <span>10k</span><span>5k</span><span>0</span>
                        </div>
                        <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                          <span>05/{15 + selectedVideoIndex * 2}</span>
                          <span>05/{16 + selectedVideoIndex * 2}</span>
                          <span>05/{17 + selectedVideoIndex * 2}</span>
                          <span>05/{18 + selectedVideoIndex * 2}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 2: Likes */}
                    <div className="bg-slate-900/40 p-4 pb-7 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
                      <span className="text-[10px] text-slate-400 block mb-2 shrink-0">点赞数趋势 (Likes)</span>
                      <div className="flex-1 relative ml-6 mt-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                          <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q50,17 80,12 T100,2" : "M0,18 Q30,15 60,10 T100,5"} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                          <span>800</span><span>400</span><span>0</span>
                        </div>
                        <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                          <span>05/{15 + selectedVideoIndex * 2}</span>
                          <span>05/{16 + selectedVideoIndex * 2}</span>
                          <span>05/{17 + selectedVideoIndex * 2}</span>
                          <span>05/{18 + selectedVideoIndex * 2}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 3: Followers */}
                    <div className="bg-slate-900/40 p-4 pb-7 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
                      <span className="text-[10px] text-slate-400 block mb-2 shrink-0">粉丝增长 (Followers)</span>
                      <div className="flex-1 relative ml-6 mt-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                          <path d={selectedVideoIndex % 2 === 0 ? "M0,15 L30,15 L30,14 L60,14 L60,13 L90,13 L90,12 L100,12" : "M0,16 L20,16 L20,13 L50,13 L50,10 L80,10 L80,8 L100,8"} fill="none" stroke="#f59e0b" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                          <span>50</span><span>25</span><span>0</span>
                        </div>
                        <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                          <span>05/{15 + selectedVideoIndex * 2}</span>
                          <span>05/{16 + selectedVideoIndex * 2}</span>
                          <span>05/{17 + selectedVideoIndex * 2}</span>
                          <span>05/{18 + selectedVideoIndex * 2}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chart 4: Comments/Engagement */}
                    <div className="bg-slate-900/40 p-4 pb-7 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
                      <span className="text-[10px] text-slate-400 block mb-2 shrink-0">评论互动趋势 (Comments)</span>
                      <div className="flex-1 relative ml-6 mt-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                          <path d={selectedVideoIndex % 2 === 0 ? "M0,19 L20,15 L40,15 L60,12 L80,8 L100,5" : "M0,18 L25,18 L50,14 L75,12 L100,8"} fill="none" stroke="#8b5cf6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                        </svg>
                        <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                          <span>120</span><span>60</span><span>0</span>
                        </div>
                        <div className="absolute left-0 right-0 -bottom-5 flex justify-between text-[9px] text-slate-500/80 font-mono">
                          <span>05/{15 + selectedVideoIndex * 2}</span>
                          <span>05/{16 + selectedVideoIndex * 2}</span>
                          <span>05/{17 + selectedVideoIndex * 2}</span>
                          <span>05/{18 + selectedVideoIndex * 2}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom 1/5: AI Audit */}
                  <div className="flex-1 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col shrink-0 min-h-[200px]">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
                        <Sparkles className="text-indigo-400 w-5 h-5 animate-pulse" />
                        <h3 className="text-xs font-bold text-slate-150">智能诊断与调优建议</h3>
                      </div>
                      <button
                        onClick={handleRunAiAudit}
                        disabled={isRefreshing}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-[10px] rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
                      >
                        {isRefreshing ? (
                          <><RefreshCw className="w-3 h-3 animate-spin text-white" /> 审计中...</>
                        ) : (
                          <><Sparkles className="w-3 h-3" /> 一键诊断当前矩阵数据</>
                        )}
                      </button>
                    </div>

                    <div className="flex-1 flex gap-4 min-h-0">
                      <div className="w-1/4 flex flex-col gap-2 shrink-0">
                        <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col items-center justify-center flex-1">
                          <span className="text-[9px] text-slate-500 block uppercase mb-1">Account Health</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono leading-none">92<span className="text-[9px] text-emerald-500/50">/100</span></span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col items-center justify-center flex-1">
                          <span className="text-[9px] text-slate-500 block uppercase mb-1">Shadowban</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono leading-none">LOW</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col items-center justify-center flex-1">
                          <span className="text-[9px] text-slate-500 block uppercase mb-1">FYP Weight</span>
                          <span className="text-sm font-bold text-indigo-400 font-mono leading-none">T1</span>
                        </div>
                      </div>

                      <div className="flex-1 bg-slate-800/20 rounded border border-slate-800 p-3 text-xs font-mono flex flex-col overflow-y-auto scrollbar-narrow min-h-0">
                        {aiSuggestions ? (
                          <div className="space-y-3 pr-1">
                            {aiSuggestions.map((sug, i) => (
                              <div key={i} className="bg-slate-900 p-3 rounded border border-slate-800 border-l-2 border-l-emerald-450 text-left">
                                <p className="text-[10px] text-slate-200 leading-relaxed font-sans">{sug}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600">
                            <Sparkles className="w-6 h-6 text-slate-755 mb-2" />
                            <span className="text-[10px]">点击右上角生成诊断报告</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          );
        })()}

        {/* Modal: Create new post task overlay */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full max-w-lg text-left shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <span className="text-xs font-bold text-slate-150">创建定时自动化发帖任务 (New scheduled Task)</span>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">

                <div>
                  <label className="text-xs text-slate-400 block mb-2">选择当前设备库中的视频文件 (Pick Asset)</label>
                  <select
                    required
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full bg-black text-slate-205 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="">-- 请选择视频文件 --</option>
                    {videoAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.title} (Duration: {asset.duration}s)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-2">作品描述 (English Caption)</label>
                  <textarea
                    required
                    placeholder="请输入用于海外发布展示的英文说明，例如: Morning routine for healthy mind..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500 h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">SEO 英语标签 (英文逗号隔开)</label>
                    <input
                      type="text"
                      placeholder="matcha, workout, tutorial"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2">设定定时发布时间 (schedule_time)</label>
                    <input
                      type="text"
                      placeholder="例如: 05/21 18:00"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
                  <span className="font-bold text-slate-350 block mb-0.5">🚀 自动化推送原理:</span>
                  本定时任务一旦保存，系统将在指定的时间节点全自动使用 MCP 服务连接到 IP 为【{device.ip}】的 iPhone 设备。通过注入模拟原生手势点击把视频、标题及设定标签发布到账号【@{device.username}】，全程无需人工盯梢。
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={!selectedAssetId}
                    className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 font-bold text-black text-xs rounded transition text-center cursor-pointer"
                  >
                    创建定时排班
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition"
                  >
                    取消
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* Modal Viewport: Automator Screen Share Interactive Live Terminal (Typewriter sequence mockup) */}
        {showAutoPostVisualizer && activeVisualizerTask && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full max-w-xl text-left shadow-2xl">

              <div className="flex items-center gap-4 border-b border-slate-800 pb-3 mb-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-white leading-none">MCP 远程自动化：正在对齐 iPhone 执行发帖任务...</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Left: Terminal Output */}
                <div className="bg-black p-3 rounded-lg border border-slate-800 flex flex-col justify-between flex-1 h-[280px]">
                  <div className="overflow-y-auto space-y-4 pr-1 text-left scrollbar-narrow">
                    {visualizerLogs.map((lg, i) => {
                      let col = 'text-slate-400';
                      if (lg.includes('TYPEWRITER')) col = 'text-amber-400 font-bold animate-pulse';
                      else if (lg.includes('SUCCESS') || lg.includes('✓')) col = 'text-emerald-400';
                      else if (lg.includes('ADB') || lg.includes('CO')) col = 'text-indigo-400';
                      return (
                        <div key={i} className="text-xs break-all leading-relaxed">
                          {lg}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 text-xs flex items-center gap-1 text-slate-550 border-t border-slate-900 pt-2">
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-450" />
                    <span>Interactive Agent Connection (ADB shell)</span>
                  </div>
                </div>

                {/* Right: Phone Simulation Typewriter Frame */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-[280px] flex flex-col justify-between flex-1 text-left">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold font-mono tracking-wider block">Screen Output Monitor</span>
                    <div className="h-0.5 bg-slate-800/80 my-1"></div>

                    {/* Mock content loader on video form */}
                    <div className="space-y-4 mt-5 text-xs">
                      <div className="flex justify-between font-bold text-slate-350 bg-slate-900 p-4 rounded border border-slate-800">
                        <span>Video Asset Attached:</span>
                        <span className="text-emerald-400 truncate max-w-[80px]">Recreated.mp4</span>
                      </div>

                      <div>
                        <span className="text-slate-500">Caption typing simulation:</span>
                        <div className="bg-black/60 p-4 rounded border border-slate-900 min-h-[50px] text-sky-300 break-all leading-normal text-xs">
                          {typewriterText}
                          <span className="w-1.5 h-3.5 bg-sky-400 animate-ping inline-block align-middle ml-0.5"></span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500">Automatic Tags injected:</span>
                        <p className="text-slate-400 leading-relaxed font-bold break-all">
                          {activeVisualizerTask.tags.join(' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded border border-slate-800 text-center flex items-center justify-center gap-4 text-xs font-mono">
                    {visualizerStep === 10 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> PUBLISHED SUCCESS
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold animate-pulse">
                        Simulated ADB actions running...
                      </span>
                    )}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Modal: Data & Trends for Published Content */}
        {showTrendModal && activeTrendTask && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 font-mono">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl text-left shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <BarChart2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">内容数据与趋势 (Analytics)</h3>
                    <p className="text-[10px] text-slate-400 mt-1">发布时间: {activeTrendTask.scheduleTime}</p>
                  </div>
                </div>
                <button onClick={() => setShowTrendModal(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <Eye className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-white">{(Math.random() * 10 + 2).toFixed(1)}k</span>
                  <span className="text-[10px] text-slate-500">曝光浏览量 (Views)</span>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <CheckCircle className="w-5 h-5 text-sky-400" />
                  <span className="text-2xl font-bold text-white">{Math.floor(Math.random() * 500 + 100)}</span>
                  <span className="text-[10px] text-slate-500">点赞互动 (Engagements)</span>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-sky-500/10 rounded-full blur-xl"></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <span className="text-2xl font-bold text-white">+{Math.floor(Math.random() * 50 + 5)}</span>
                  <span className="text-[10px] text-slate-500">净增粉 (Followers)</span>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-300 block mb-3">AI 爆款潜质诊断 (AI Diagnostics)</span>
                <p className="text-xs text-slate-400 leading-relaxed bg-black/40 p-3 rounded border border-slate-800">
                  <strong className="text-emerald-400">系统点评：</strong>该视频的内容方向较好地契合了当前账号人设。前3秒的关键帧留存率达到了 68%，显著优于近期其他稿件的均值。建议在后续发布的视频中，保持相同的 BGM 节奏感和类似的视觉调性以持续吸引该垂直领域的受众。
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
