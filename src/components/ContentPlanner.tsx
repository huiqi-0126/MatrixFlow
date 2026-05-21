import React, { useState } from 'react';
import { 
  Calendar, Eye, BookOpen, Film, Video, Clipboard, 
  Sparkles, CheckCircle, RefreshCw, Layers, Zap, Info, Play, MessageSquare, ArrowRight 
} from 'lucide-react';
import { DailyPlan, Device, VideoAsset } from '../types';
import { MOCK_MONTHLY_PLANS } from '../constants';

interface ContentPlannerProps {
  device: Device;
  onAddRecreatedVideo: (video: VideoAsset) => void;
}

export default function ContentPlanner({ device, onAddRecreatedVideo }: ContentPlannerProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [competitorUrl, setCompetitorUrl] = useState<string>('https://www.tiktok.com/@competitor_asmr/video/7391823901');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisReport, setAnalysisReport] = useState<{
    success: boolean;
    extractedScript: string;
    keyframes: { time: string; action: string; cue: string }[];
    recreateBlueprint: {
      audioBpm: string;
      voiceoverPrompt: string;
      visualTone: string;
      captionSuggest: string;
      recommendedTags: string[];
    };
  } | null>(null);

  const plans = MOCK_MONTHLY_PLANS[device.niche] || MOCK_MONTHLY_PLANS['aesthetic-cooking'];

  const handleAnalyzeVideo = () => {
    if (!competitorUrl.trim()) return;
    setIsAnalyzing(true);
    setAnalysisReport(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Detailed replica instructions compiled automatically in English based on the current niche
      if (device.niche === 'aesthetic-cooking') {
        setAnalysisReport({
          success: true,
          extractedScript: 'POV: crafting a hot Matcha Foam Latte on a cozy Sunday morning. Whisk, pour, and enjoy.',
          keyframes: [
            { time: '0.0s - 3.2s', action: 'Extreme closeup of sliding green matcha powder into warm water', cue: 'ASMR scrape spoon sound' },
            { time: '3.2s - 7.5s', action: 'Hand whisks in smooth, rhythmic circular motions on textured wooden bowl', cue: 'High-pitch foam whisking sounds' },
            { time: '7.5s - 12.0s', action: 'Pouring thick dense white raw milk into a glass showing dense physics layer separation', cue: 'Ambient room rainfall noise' },
            { time: '12.0s - 15.0s', action: 'Gently tapping spoon against glass edge, displaying completed froth top', cue: 'Deep jazz melody fade-out' }
          ],
          recreateBlueprint: {
            audioBpm: '85 BPM (Warm Lo-Fi Chill Hop beats)',
            voiceoverPrompt: 'Utilize soft whispered whispering voiceover text overlays instead of live sound, letting physical ASMR noises carry the weight.',
            visualTone: 'Cozy, high exposure, soft shadows, warm natural window light.',
            captionSuggest: 'Simple recipes for fragile mornings. ✨ Would you take a sip?',
            recommendedTags: ['#aestheticcooking', '#matchalover', '#satisfyingasmr', '#cozymorning', '#easyrecipetiktok']
          }
        });
      } else if (device.niche === 'fitness') {
        setAnalysisReport({
          success: true,
          extractedScript: 'Before you doubt, remember why you started. Pack the shoulder, lock the hips, own the deadlift.',
          keyframes: [
            { time: '0.0s - 4.1s', action: 'Waking up, close shot on digital clock displaying 5:00 AM', cue: 'Sharp buzzer warning alarm sound' },
            { time: '4.1s - 7.8s', action: 'Pouring high performance energy drink with floating carbon bubble fizzes', cue: 'High pitch dynamic fizz splash' },
            { time: '7.8s - 13.5s', action: 'Low angles showing bar pulls, showcasing target spinal posture guidelines', cue: 'Intense drum beat drop' },
            { time: '13.5s - 18.0s', action: 'Completing heavy pull, sweat droplet falling close focus', cue: 'Heavy breathing atmospheric reverb' }
          ],
          recreateBlueprint: {
            audioBpm: '128 BPM (Hyper-Phonk Workout Beat)',
            voiceoverPrompt: 'High inspiration, heavy impact statements. Direct call-to-action urging discipline over emotion.',
            visualTone: 'Cold blue grading, neon background lights, high contrast muscle definition shadows.',
            captionSuggest: 'The sweat is real. But so are the results. 👊 Join the 5 AM club today.',
            recommendedTags: ['#workoutprep', '#deadliftform', '#fitnessgoals', '#coreworkout', '#gymmotivation']
          }
        });
      } else {
        // Fallback default
        setAnalysisReport({
          success: true,
          extractedScript: 'POV: finding the ultimate aesthetic item for your modern desk setup.',
          keyframes: [
            { time: '0.0s - 5.0s', action: 'Unboxing packaging, custom sleeve sliding off carton drawer', cue: 'Crisp tearing sound' },
            { time: '5.0s - 15.0s', action: 'Close mechanical switch clicks, RGB lighting cascade', cue: 'Satisfying keyboard keystrokes' }
          ],
          recreateBlueprint: {
            audioBpm: '90 BPM (Cyberpunk Ambient Track)',
            voiceoverPrompt: 'Minimal verbal prompts. Rely on typography slide-ins to list specifications.',
            visualTone: 'Dark aesthetic, matte black backdrop, RGB neon reflections.',
            captionSuggest: 'Unreal typing feedback. 😮 Is this the ultimate layout?',
            recommendedTags: ['#keyboardasmr', '#setudinspo', '#customtech', '#techhacks']
          }
        });
      }
    }, 1800);
  };

  // Automated replication: saves analysed instructions to local video list
  const handleAutoReplicate = () => {
    if (!analysisReport) return;
    
    const colors = ['bg-emerald-800', 'bg-purple-800', 'bg-rose-900', 'bg-stone-800'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const replicatedAsset: VideoAsset = {
      id: `repl-${Date.now()}`,
      title: `Replicated [${device.niche}] Video Draft.mp4`,
      niche: device.niche,
      duration: 15,
      thumbnailColor: randomColor,
      tagline: analysisReport.recreateBlueprint.captionSuggest,
      tags: analysisReport.recreateBlueprint.recommendedTags,
      script: `[VISUAL PLAN]:\n` + analysisReport.keyframes.map(k => `- ${k.time}: ${k.action}`).join('\n') + `\n\n[VOICEOVER]:\n"${analysisReport.extractedScript}"`
    };

    onAddRecreatedVideo(replicatedAsset);
    alert('🎉 已自动分析视频文案并对齐关键帧，生成了一份【高清复刻指导脚本】并存入下方设备专属资源库中！可在[人设与资源]模块中查看。');
  };

  const currentPlanDay = plans[selectedDayIndex] || plans[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 h-full min-h-[500px]">
      
      {/* 1. Left Panel: Month Plan (Day 1 - 30 topic suggestions) (5 columns) */}
      <div className="xl:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo">
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2">
          <Calendar className="text-indigo-400 w-5 h-5" />
          <h3 className="text-xs font-bold text-slate-150">30天月度选题与内容规划表</h3>
        </div>

        {/* 30-Day mini grid selection */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-5 gap-1.5 mb-4 overflow-y-auto pr-1 scrollbar-narrow">
          {Array.from({ length: 30 }).map((_, id) => {
            const hasDraft = id < plans.length;
            const isSelected = selectedDayIndex === id;
            return (
              <button 
                key={id}
                onClick={() => setSelectedDayIndex(id)}
                className={`p-4 text-center rounded text-xs font-mono font-bold transition cursor-pointer flex flex-col items-center justify-center ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35' 
                    : hasDraft 
                      ? 'bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 hover:bg-indigo-900/40' 
                      : 'bg-slate-800 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>D{id + 1}</span>
                {hasDraft && <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5"></span>}
              </button>
            );
          })}
        </div>

        {/* Content detail display */}
        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between flex-1 min-h-[280px]">
          <div>
            <div className="flex justify-between items-center mb-2 bg-slate-900/55 p-4 rounded border border-slate-850">
              <span className="text-xs font-mono text-indigo-400 font-bold uppercase">DAY {selectedDayIndex + 1} TOPIC (ENGLISH)</span>
              <span className="text-xs text-slate-500 font-mono">Month: Cycle #1</span>
            </div>

            {selectedDayIndex < plans.length ? (
              <div className="space-y-3 mt-5 text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 font-mono tracking-wide">
                    {currentPlanDay.topic}
                  </h4>
                  <p className="text-xs text-slate-400 mt-3 italic font-mono leading-relaxed bg-black/40 p-4 border border-slate-900 rounded">
                    "AI generated hook direction"
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-2">
                    🎥 画面拍摄与节奏技巧 (Shooting Style)
                  </span>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    {currentPlanDay.direction}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-2">
                    ✍️ 脚本大模型推荐提示 (English Writing Prompt)
                  </span>
                  <div className="p-4 border border-slate-850 bg-slate-900/60 rounded text-xs font-mono text-slate-400 max-h-[80px] overflow-y-auto">
                    {currentPlanDay.scriptPrompt}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-bold block mb-2">
                    🏷️ 关键字标签 (Core SEO tags)
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {currentPlanDay.suggestedTags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-slate-850 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-center text-slate-500">
                <BookOpen className="w-8 h-8 text-slate-700 mb-2" />
                <span className="text-xs font-bold block">尚未激活该天数选题</span>
                <p className="text-xs text-slate-500 max-w-xs mt-3 leading-normal">
                  该自媒体平台现支持定制 5 天前置精选黄金选题。请参照现有方案进行实操，或点击下方【大模型内容扩产】进行拟定。
                </p>
                <button 
                  onClick={() => alert('已自动调用大模型生成器补充剩余日度题材，选题规划加载至 Day30 完毕！')}
                  className="mt-5.5 px-3 py-1 bg-sky-950 border border-sky-900/40 text-sky-400 hover:bg-sky-900 hover:text-white rounded text-xs font-mono font-bold tracking-tight cursor-pointer"
                >
                  ⚡ 一键指令扩充选题至 30 天
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-900 pt-3.5 mt-5 text-xs text-slate-500 text-left">
            <span>ℹ️ 说明: 该日度排片表与 [定时发布] 队列模块完全挂钩，有助于实现多设备间的内容交叉不重叠。</span>
          </div>

        </div>

      </div>

      {/* 2. Right Panel: Video replication analyzer (7 columns) */}
      <div className="xl:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo">
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-2">
          <Film className="text-indigo-400 w-5 h-5" />
          <h3 className="text-xs font-bold text-slate-150">对标账号自动化复刻剪辑方案</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mb-2">
          看到同行的大爆款了？输入对标账号的海外视频链接，让本平台调用多模态模型提取原版<strong>字幕/文案</strong>、分析<strong>关键帧镜头切换点</strong>，并输出高画质一键克隆脚本。
        </p>

        {/* Input link Row */}
        <div className="flex gap-4 mb-2">
          <input 
            type="text"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            placeholder="粘贴 TikTok, Instagram, YouTube 视频完整链接..."
            className="flex-1 bg-black text-slate-300 border border-slate-800 rounded px-2.5 py-2 text-xs font-mono focus:outline-none focus:border-indigo-500"
          />
          <button 
            onClick={handleAnalyzeVideo}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-xs rounded transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                正在智能提取中..
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                提取文案与关键帧
              </>
            )}
          </button>
        </div>

        {/* Output area */}
        <div className="flex-1 bg-slate-800/20 rounded-xl border border-slate-800 p-4 min-h-[350px] flex flex-col justify-between flex-1">
          {analysisReport ? (
            <div className="space-y-4 pr-1 max-h-[360px] overflow-y-auto scrollbar-narrow text-left">
              
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded border border-slate-800">
                <span className="text-xs text-emerald-400 font-mono font-bold">1. 提取的原版英文文案 scripts</span>
                <button 
                  className="text-xs hover:text-white flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(analysisReport.extractedScript);
                    alert('原版文案已复制到剪切板！');
                  }}
                >
                  <Clipboard className="w-3 h-3" /> COPY
                </button>
              </div>
              <p className="text-xs text-slate-200 font-mono bg-black/35 p-3 border border-slate-900 rounded italic leading-relaxed pl-3 font-semibold">
                "{analysisReport.extractedScript}"
              </p>

              <div>
                <span className="text-xs text-slate-500 font-bold block mb-2 font-mono">2. 多模态分析关键帧序列 keyframe timestamps</span>
                <div className="space-y-4">
                  {analysisReport.keyframes.map((frame, i) => (
                    <div key={i} className="flex gap-4.5 bg-slate-900/60 p-4 rounded border border-slate-850 text-xs font-mono">
                      <span className="text-emerald-400 font-bold shrink-0">{frame.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-200 block text-xs leading-tight font-medium">{frame.action}</span>
                        <span className="text-xs text-slate-500 font-mono block leading-none mt-3">
                          Audio Trigger: {frame.cue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blueprint suggestion for automatic cloning */}
              <div className="p-4 border border-indigo-900/40 bg-indigo-950/20 rounded-lg">
                <span className="text-xs text-indigo-400 font-bold block mb-2 uppercase font-mono tracking-wider">
                  ⚡ 推荐自动化克隆重构指导 (English Reproduction Blueprint)
                </span>
                
                <div className="text-xs font-mono text-slate-300 space-y-4 leading-relaxed">
                  <div>
                    <span className="text-slate-500">Suggested Audio BPM:</span>
                    <p className="text-emerald-400 text-xs font-bold mt-0.5">{analysisReport.recreateBlueprint.audioBpm}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Visual Aesthetic Direction:</span>
                    <p className="text-xs mt-0.5">{analysisReport.recreateBlueprint.visualTone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Voiceover Narrative Style:</span>
                    <p className="text-xs mt-0.5">{analysisReport.recreateBlueprint.voiceoverPrompt}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">SEO Suggested Caption & Hashtags:</span>
                    <p className="text-sky-400 text-xs font-bold mt-0.5">
                      {analysisReport.recreateBlueprint.captionSuggest} {analysisReport.recreateBlueprint.recommendedTags.join(' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleAutoReplicate}
                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-black text-xs rounded transition flex items-center justify-center gap-4 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" /> 立即复制该复刻方案到我的资源库 (Save to Assets)
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-slate-900/10 rounded border border-dashed border-slate-800">
              <Film className="w-9 h-9 text-slate-700 mb-2" />
              <span className="text-xs font-bold text-slate-300">暂无待分析视频</span>
              <p className="text-xs text-slate-500 max-w-sm mt-3 leading-normal">
                粘贴链接并点击“提取文案与关键帧”，多模态模型即可实现精准的逐帧解析和复刻文案。
              </p>
            </div>
          )}

          <div className="bg-slate-900/50 p-3 rounded border border-slate-850 text-xs text-slate-500 text-left mt-3 flex gap-4 items-start">
            <Info className="w-3.5 h-3.5 shrink-0 text-sky-400 mt-0.5" />
            <p className="leading-normal">
              本模块模拟对海外多媒体片段中音轨(Audio Extraction)及画面快照转换。多模态在提取文案时已经全自动将可能含有拼写错误的口语化歌词或台词过滤，输出标准、无语法毛病的英文配音提纲。
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
