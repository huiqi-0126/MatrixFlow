import React, { useState } from 'react';
import { VideoAsset, Device } from '../types';
import {
  Film, Trash2, Download, Upload, Info, FileVideo, Plus, Settings2, Image as ImageIcon, CheckCircle, Copy,
  Sparkles, RefreshCw, Clipboard, Play
} from 'lucide-react';

interface AssetManagerProps {
  device: Device;
  videoAssets: VideoAsset[];
  onAddVideoAsset: (video: VideoAsset) => void;
  onDeleteVideoAsset: (id: string) => void;
}

export default function AssetManager({ device, videoAssets, onAddVideoAsset, onDeleteVideoAsset }: AssetManagerProps) {
  const [apiKey, setApiKey] = useState('dp_sk_e42386a68d347df7a988bdead43fb5584ab98b4223748782ff06f');
  const [taskType, setTaskType] = useState<'image' | 'video'>('video');
  const [prompt, setPrompt] = useState('');
  const [showAIGenModal, setShowAIGenModal] = useState(false);

  // Replication Tool States
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

  React.useEffect(() => {
    const handleReplicateVideo = (e: any) => {
      if (e.detail && e.detail.url) {
        setCompetitorUrl(e.detail.url);
        // Automatically start extraction
        setTimeout(() => {
          const btn = document.getElementById('btn-analyze-video');
          if (btn) btn.click();
        }, 150);
      }
    };
    window.addEventListener('trigger-analyze-video', handleReplicateVideo);
    return () => window.removeEventListener('trigger-analyze-video', handleReplicateVideo);
  }, []);


  const [selectedModel, setSelectedModel] = useState('PixVerse V6');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [hasPlanned, setHasPlanned] = useState<boolean>(false);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [generationMsg, setGenerationMsg] = useState('');
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setGenerationComplete(false);

    const messages = [
      `连接 ${selectedModel} 模型节点...`,
      "加载分镜帧与音频提示词...",
      "正在进行深度场景渲染...",
      "应用风格化光影滤镜...",
      "生成 1080P 高清视频流...",
      "合并 Lo-Fi Chill Hop 音频轨...",
      "最后校验视频质量..."
    ];

    let step = 0;
    setGenerationMsg(messages[0]);

    const interval = setInterval(() => {
      step++;
      if (step >= messages.length) {
        clearInterval(interval);
        setGenerationComplete(true);
      } else {
        setGenerationMsg(messages[step]);
      }
    }, 4000); // about 30 secs total
  };

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


  const getCover = (index: number) => {
    return `/1 (${(index % 5) + 1}).png`;
  };

  return (
    <div className="flex-1 flex gap-6 min-h-0 relative">

      {/* Left Panel: Asset List */}
      <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">素材库 (Asset Library)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> 导入
            </button>
            <button
              onClick={() => setShowAIGenModal(true)}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI生成
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-narrow">
          {videoAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <FileVideo className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-bold">资源库空空如也</p>
              <p className="text-xs mt-1">请从克隆选题生成或导入视频文件</p>
            </div>
          ) : (
            videoAssets.map((asset, index) => (
              <div key={asset.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex gap-4 hover:border-slate-600 transition group relative">
                <div className={`w-24 h-32 rounded-lg bg-slate-900 border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center`}>
                  <img src={getCover(index)} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className={`absolute inset-0 ${asset.thumbnailColor} opacity-30 mix-blend-multiply`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                  <div className="absolute top-1.5 right-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono text-white font-bold">
                    00:{asset.duration.toString().padStart(2, '0')}
                  </div>
                  <Film className="w-6 h-6 text-white/30" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 flex items-center justify-between">
                    <span className="text-[9px] text-white/70 font-mono">1080P</span>
                    <span className="text-[9px] text-white/70 font-mono">30FPS</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-1 pr-6">{asset.title}</h4>
                      <button
                        onClick={() => onDeleteVideoAsset(asset.id)}
                        className="text-slate-500 hover:text-rose-400 transition absolute top-4 right-4 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="删除视频"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {asset.script || "自动生成的视频素材文件，等待排期分发。"}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {asset.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">

                    <button className="flex-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded transition flex justify-center items-center gap-1 border border-slate-800 cursor-pointer">
                      <Download className="w-3 h-3" /> 导出到本地
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Video Replication Tool */}
      <div className="w-1/2 flex flex-col min-h-0 bg-slate-800/40 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* 2. Right Panel: Video replication analyzer (7 columns) */}
        <div className="p-4 flex flex-col h-full overflow-y-auto scrollbar-narrow">

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
              id="btn-analyze-video"
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
          <div className="flex-1 bg-slate-800/20 rounded-xl border border-slate-800 p-4 flex flex-col min-h-0">
            {analysisReport ? (
              <div className="space-y-4 pr-1 flex-1 overflow-y-auto scrollbar-narrow text-left">

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
                      <div key={i} className="flex gap-4.5 bg-slate-900/60 p-4 rounded border border-slate-800 text-xs font-mono">
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
                <div className="flex flex-col xl:flex-row items-center gap-4 pt-4 mt-2 border-t border-slate-800/50">

                  {/* 视频模型选择 & 生成视频按钮 */}
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative flex-1">
                      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs py-2.5 pl-3 pr-8 rounded-lg transition-colors focus:outline-none focus:border-indigo-500 shadow-inner">
                        <option value="PixVerse V6">PixVerse V6</option>
                        <option value="PixVerse V5.6">PixVerse V5.6</option>
                        <option value="veo-3.1-standard">veo-3.1-standard</option>
                        <option value="grok-imagine">grok-imagine</option>
                        <option value="sora-2-pro">sora-2-pro</option>
                        <option value="Seedance 2.0 standard">Seedance 2.0 standard</option>
                        <option value="Seedance 2.0 fast">Seedance 2.0 fast</option>
                        <option value="PixVerse C1">PixVerse C1</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerateVideo}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 font-bold text-white text-xs rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 shrink-0 whitespace-nowrap"
                    >
                      <Film className="w-4 h-4" /> 生成视频
                    </button>
                  </div>

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

            <div className="bg-slate-900/50 p-3 rounded border border-slate-800 text-xs text-slate-500 text-left mt-3 flex gap-4 items-start shrink-0">
              <Info className="w-3.5 h-3.5 shrink-0 text-sky-400 mt-0.5" />
              <p className="leading-normal">
                本模块模拟对海外多媒体片段中音轨(Audio Extraction)及画面快照转换。多模态在提取文案时已经全自动将可能含有拼写错误的口语化歌词或台词过滤，输出标准、无语法毛病的英文配音提纲。
              </p>
            </div>

          </div>

        </div>


      </div>

      {/* AI Generation Settings Modal */}
      {showAIGenModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <span className="text-sm font-bold text-slate-200">AI 智能素材生成 (API Configuration)</span>
              <button onClick={() => setShowAIGenModal(false)} className="text-slate-500 hover:text-white transition cursor-pointer">✕</button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 scrollbar-narrow space-y-5 text-left">
              {/* API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500 text-slate-400"
                />
              </div>

              <hr className="border-slate-800" />

              {/* Task Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">任务类型</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTaskType('image')}
                    className={`px-4 py-1.5 rounded text-xs transition cursor-pointer ${taskType === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}
                  >
                    图片生成
                  </button>
                  <button
                    onClick={() => setTaskType('video')}
                    className={`px-4 py-1.5 rounded text-xs transition cursor-pointer ${taskType === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}
                  >
                    视频生成
                  </button>
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Prompt</label>
                <textarea
                  placeholder="请输入生成提示词..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Dropdowns */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">模型</label>
                  <select className="w-full text-xs bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 p-2.5 rounded-lg transition-colors focus:outline-none focus:border-indigo-500 shadow-inner appearance-none">
                    <option value="pixverse-v6">PixVerse V6</option>
                    <option value="pixverse-v5.6">PixVerse V5.6</option>
                    <option value="veo-3.1-standard">veo-3.1-standard</option>
                    <option value="grok-imagine">grok-imagine</option>
                    <option value="sora-2-pro">sora-2-pro</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowAIGenModal(false);
                    alert('生成任务已投递至云端队列');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  确认生成
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Video Generation Modal */}
      {isGeneratingVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">

            <button
              onClick={() => setIsGeneratingVideo(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white z-10"
            >
              ✕
            </button>

            {!generationComplete ? (
              <div className="flex flex-col items-center justify-center text-center z-10">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-bold text-slate-200 mb-2">正在通过云端大模型渲染视频</h3>
                <p
                  onClick={() => setGenerationComplete(true)}
                  className="text-xs text-indigo-400 font-mono cursor-pointer hover:text-indigo-300 transition-colors"
                  title="点击文字可跳过等待"
                >
                  {generationMsg}
                </p>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 max-w-xs">
                  预计渲染时间: 约 3 分钟。您可以将其放入后台运行。
                </p>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center z-10 animate-fade-in">
                <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-bold">✓</span> 视频生成完毕
                </h3>
                <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-black aspect-[9/16]">
                  <video
                    src="/tk2.mp4"
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  ></video>
                </div>
                <button
                  onClick={() => {
                    setIsGeneratingVideo(false);
                    onAddVideoAsset({
                      id: 'V-REP-' + Math.floor(Math.random() * 1000),
                      title: 'Matcha Latte Aesthetic Vlog (Replicated)',
                      duration: 15,
                      tags: ['#matcha', '#aesthetic'],
                      niche: device.niche,
                      script: analysisReport?.recreateBlueprint?.captionSuggest || '',
                      thumbnailColor: 'bg-indigo-900',
                      tagline: 'Generated by PixVerse V6'
                    });
                    alert('已自动将视频保存至人设资源库！');
                  }}
                  className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition active:scale-95 flex items-center gap-2"
                >
                  收录该视频至资源库
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

