import React, { useState } from 'react';
import { 
  BarChart, TrendingUp, Users, Play, Award, PieChart, Sparkles, 
  HelpCircle, RefreshCw, AlertTriangle, ArrowUpRight, MessageSquare 
} from 'lucide-react';
import { CreatorStats, Device } from '../types';
import { MOCK_CREATOR_STATS } from '../constants';

interface AnalyticsAdvisorProps {
  device: Device;
}

export default function AnalyticsAdvisor({ device }: AnalyticsAdvisorProps) {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);

  const stats: CreatorStats = MOCK_CREATOR_STATS[device.id] || MOCK_CREATOR_STATS['device-1'];

  const handleRunAiAudit = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      
      // Customize recommendations in Chinese based on the selected device's niche
      if (device.niche === 'aesthetic-cooking') {
        setAiSuggestions([
          '📹 【黄金3秒停留优化】：检测到完播留存图在第2.5秒有明显瀑布式下跌。原视频开场略显拖沓，建议在前1.5秒直接插入【极高分贝的纯享切冰块或抹茶起泡】音效，用听觉顿挫感强行截断用户的下滑动作。',
          '🏷️ 【SEO标签扩充】：目前ForYou流量占比高达89%，但精准检索流量小于3%。建议在文案中引入海外高热检索长尾词如 "how to froth milk like a barista" / "minimalist kitchen aesthetic"，并在标签中加入 #asmrrecipes #viralcooking。',
          '🔥 【内容规划微调】：当前粉丝互动黏性保持优良。建议周五推出一期“微缩场景烹饪挑战 (Miniature Baking Challenge)”，以极端微小形态的高反差视效在海外主页激发高强度评论转发。'
        ]);
      } else if (device.niche === 'fitness') {
        setAiSuggestions([
          '📹 【前置字幕钩子 (Visual Hook)】：完播留存曲线在初段维持率偏低（54%）。建议视频第一帧不仅要展示早起时钟，更应直接使用大字重、高反差的字幕“Gym secrets you wish you knew earlier 🤫”，营造猎奇探秘感。',
          '🏷️ 【标签交叉覆盖】：当前#gymmotivation 已经进入超级红海。建议组合【中高热度交叉标签】，例如组合 #5amclub #deadlifthacks 以及特定女性健身标签 #fitgoddess，从而快速从精准细分流量池中脱颖而出。',
          '⏰ 【推送排班建议】：依据纽约受众的高活数据，北美清晨通勤时段（07:00-08:30 EST）及深夜释压睡眠时段（21:00-22:30 EST）对低能量长阻训练、早起习惯类内容的点赞转换极佳，建议微调发帖时间。'
        ]);
      } else {
        setAiSuggestions([
          '📹 【音频卡点对齐 (BPM Alignment)】：该作品剪辑卡点與背景音乐(Lo-Fi drum hits)存在0.4秒以上的毫秒差。海外推流算法对高卡点率的作品有隐性推荐偏好，建议在后期剪辑时强制使场景切片对准音频BPM波峰。',
          '💬 【诱导性文案设定】：目前作品平均评论互动占比低于0.5%。可以通过首发置顶评论自问自答（如：“Rate this setup 1 to 10 in the replies 👇”）或文案中加入留白提问，直接激起老外吐槽和辩论欲望。',
          '📈 【设备矩阵错峰】：该香港中转代理IP下绑定了4台设备，应当至少错开1小时进行视频传输。避免同一网段、相近时间高频触发创作者网盾的安全规则，保证出单流推送安全无阻。'
        ]);
      }
    }, 1500);
  };

  // Safe chart helper coordinates
  const viewValues = stats.dailyViews.map(d => d.value);
  const maxView = Math.max(...viewValues, 100);
  const followerValues = stats.dailyFollowers.map(d => d.value);
  const maxFollower = Math.max(...followerValues, 10);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 text-left">
      
      {/* 1. Left Panel: Published Videos List (7 columns) */}
      <div className="xl:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col bento-glow-indigo">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
          <div className="flex items-center gap-4">
            <Play className="text-indigo-400 w-5 h-5" />
            <span className="text-xs font-bold text-slate-150">已发布视频列表 (Published Videos)</span>
          </div>
          
          <span className="text-xs font-mono text-slate-500 block uppercase">
            @{device.username}
          </span>
        </div>

        {/* Video List */}
        <div className="space-y-5 overflow-y-auto h-full min-h-[520px] pr-1 scrollbar-narrow">
          {stats.topVideos.map((vd, i) => {
            const engRate = ((vd.likes + vd.comments + vd.shares) / vd.views * 100).toFixed(1);
            const retentionMin = Math.floor(vd.retentionRate * 60);
            const retentionSec = Math.round((vd.retentionRate * 60) % 60);
            
            return (
              <div key={i} className="bg-slate-800/30 rounded-xl border border-slate-800 p-4 hover:border-indigo-500/30 transition">
                <div className="flex items-start gap-4">
                  {/* Video Thumbnail Placeholder */}
                  <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    <Play className="w-6 h-6 text-slate-600" />
                  </div>
                  
                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate leading-tight">{vd.title}</h4>
                    <p className="text-xs text-slate-500 mt-3 font-mono">
                      📅 05/{15 + i * 2} 18:00 • 🎬 {vd.retentionRate > 0 ? `${retentionMin}:${retentionSec.toString().padStart(2, '0')} 完播` : 'N/A'}
                    </p>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">播放</span>
                        <span className="text-sky-400 font-bold">{vd.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">点赞</span>
                        <span className="text-slate-200">{vd.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">评论</span>
                        <span className="text-slate-200">{vd.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">分享</span>
                        <span className="text-slate-200">{vd.shares.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side Metrics */}
                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {(vd.fypFraction * 100).toFixed(0)}% FYP
                      </span>
                      <div className={`w-2 h-2 rounded-full ${vd.fypFraction > 0.9 ? 'bg-emerald-400' : vd.fypFraction > 0.8 ? 'bg-sky-400' : 'bg-slate-500'}`}></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      <span className={parseFloat(engRate) > 5 ? 'text-emerald-400' : 'text-slate-400'}>
                        {engRate}%
                      </span> 互动率
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 2. Right Panel: AI MCN diagnosis Advisor system (5 columns) */}
      <div className="xl:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full justify-between bento-glow-indigo">
        
        <div>
          <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2">
            <Sparkles className="text-indigo-400 w-5 h-5 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-150">MCN 黄金运营大模型审计顾问</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            针对设备绑定的 TikTok 账号，智能抽取完播率、交互率以及 IP 指数多维数据。一键通过大模型给出精细的中文本地化策略优化方案。
          </p>

          <button 
            onClick={handleRunAiAudit}
            disabled={isRefreshing}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-4 cursor-pointer shadow-lg mb-2 bento-glow-indigo active:scale-95"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                正在智能审计流量矩阵数据中...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                诊断当前流量趋势并给出调整建议
              </>
            )}
          </button>

          {/* AI Auditor Output box */}
          <div className="bg-slate-800/20 rounded-xl border border-slate-800 p-4 text-xs font-mono min-h-[290px] flex flex-col justify-start">
            {aiSuggestions ? (
              <div className="space-y-5 pr-1 max-h-[310px] overflow-y-auto scrollbar-narrow">
                {aiSuggestions.map((sug, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-lg border border-slate-850 border-l-4 border-l-emerald-450 text-left">
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{sug}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-600">
                <Sparkles className="w-8 h-8 text-slate-755 mb-2" />
                <span>暂无诊断报告</span>
                <p className="text-xs text-slate-550 max-w-xs mt-3">
                  点击上方按钮，系统将分析当前 iPhone 的 ForYou 底层权重、首发推荐率并加载大模型运营调整优化方案。
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 mt-3 leading-normal text-xs text-slate-400 text-left">
          <span className="font-bold text-slate-300 block mb-0.5">🔥 算法权重递增法则:</span>
          社媒的推流公式是基于：完播率(30%) + 5s驻留率(25%) + 评论率(20%) + 点赞(15%) + 转发(10%)。根据本平台的审计建议调节下一批视频的卡点音效与字幕设置，可实现指数级跃升。
        </div>

      </div>

    </div>
  );
}
