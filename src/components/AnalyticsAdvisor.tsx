import React, { useState } from 'react';
import {
  BarChart, TrendingUp, Users, Play, Award, PieChart, Sparkles,
  HelpCircle, RefreshCw, AlertTriangle, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { CreatorStats, Device, VideoAsset } from '../types';
import SharedVideoList from './SharedVideoList';
import { MOCK_CREATOR_STATS } from '../constants';

interface AnalyticsAdvisorProps {
  videoAssets: VideoAsset[];
  device: Device;
}

export default function AnalyticsAdvisor({ device, videoAssets }: AnalyticsAdvisorProps) {
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

  const viewValues = stats.dailyViews.map(d => d.value);
  const maxView = Math.max(...viewValues, 100);
  const followerValues = stats.dailyFollowers.map(d => d.value);
  const maxFollower = Math.max(...followerValues, 10);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full text-slate-200 text-left min-h-0">
      {/* Left Panel: Videos (1/3 Width) */}
      <div className="xl:col-span-4 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full bento-glow-indigo min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2 shrink-0">
          <div className="flex items-center gap-4">
            <Play className="text-indigo-400 w-5 h-5" />
            <span className="text-xs font-bold text-slate-150">已发布视频列表 (Published Videos)</span>
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 scrollbar-narrow">
          {stats.topVideos.map((vd, i) => {
            const engRate = ((vd.likes + vd.comments + vd.shares) / vd.views * 100).toFixed(1);
            const retentionMin = Math.floor(vd.retentionRate * 60);
            const retentionSec = Math.round((vd.retentionRate * 60) % 60);
            return (
              <div
                key={i}
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
                    <img src={`/1 (${(i % 5) + 1}).png`} alt="cover" className="w-full h-full object-cover opacity-90" />
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
          })}
        </div>
      </div>

      {/* Right Panel: Charts and Diagnostics (2/3 Width) */}
      <div className="xl:col-span-8 flex flex-col gap-4 h-full min-h-0">
        
        {/* Top 4/5: 3 Charts Stacked */}
        <div className="flex-[4] grid grid-cols-2 gap-4 min-h-0 overflow-y-auto scrollbar-narrow pr-1 pb-2">
          
          {/* Chart 1: Views */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">播放量趋势 (Views)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q30,16 60,10 T100,2" : "M0,18 Q40,15 70,5 T100,5"} fill="none" stroke="#3b82f6" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>10k</span><span>5k</span><span>0</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Likes */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">点赞数趋势 (Likes)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,18 Q50,17 80,12 T100,2" : "M0,18 Q30,15 60,10 T100,5"} fill="none" stroke="#10b981" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>800</span><span>400</span><span>0</span>
              </div>
            </div>
          </div>

          {/* Chart 3: Followers */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">粉丝增长 (Followers)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,15 L30,15 L30,14 L60,14 L60,13 L90,13 L90,12 L100,12" : "M0,16 L20,16 L20,13 L50,13 L50,10 L80,10 L80,8 L100,8"} fill="none" stroke="#f59e0b" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>50</span><span>25</span><span>0</span>
              </div>
            </div>
          </div>
          
          {/* Chart 4: Comments/Engagement */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex flex-col min-h-[140px]">
            <span className="text-[10px] text-slate-400 block mb-2 shrink-0">评论互动趋势 (Comments)</span>
            <div className="flex-1 relative ml-6 mt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path d={selectedVideoIndex % 2 === 0 ? "M0,19 L20,15 L40,15 L60,12 L80,8 L100,5" : "M0,18 L25,18 L50,14 L75,12 L100,8"} fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
              </svg>
              <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-500 py-1">
                <span>120</span><span>60</span><span>0</span>
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
                    <div key={i} className="bg-slate-900 p-3 rounded border border-slate-850 border-l-2 border-l-emerald-450 text-left">
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

      </div>
    </div>
  );
}