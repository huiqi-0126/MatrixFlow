import os

content_planner_path = 'src/components/ContentPlanner.tsx'
asset_manager_path = 'src/components/AssetManager.tsx'

with open(content_planner_path, 'r', encoding='utf-8') as f:
    cp_content = f.read()

with open(asset_manager_path, 'r', encoding='utf-8') as f:
    am_content = f.read()

# Extract replication states and functions from ContentPlanner
states_start = cp_content.find('const [competitorUrl')
states_end = cp_content.find('const handleAnalyzeVideo')
states_block = cp_content[states_start:states_end]

funcs_start = cp_content.find('const handleAnalyzeVideo')
funcs_end = cp_content.find('return (', funcs_start)
funcs_block = cp_content[funcs_start:funcs_end]

# Extract replication JSX
jsx_start = cp_content.find('{/* 2. Right Panel: Video replication analyzer')
jsx_end = cp_content.find('{/* Video Generation Modal */}')
jsx_block = cp_content[jsx_start:jsx_end]

modal_start = cp_content.find('{/* Video Generation Modal */}')
modal_end = cp_content.find('</>', modal_start)
modal_block = cp_content[modal_start:modal_end]

new_am = f"""import React, {{ useState }} from 'react';
import {{ VideoAsset, Device }} from '../types';
import {{ 
  Film, Trash2, Download, Upload, Info, FileVideo, Plus, Settings2, Image as ImageIcon, CheckCircle, Copy,
  Sparkles, RefreshCw, Clipboard, Play
}} from 'lucide-react';

interface AssetManagerProps {{
  device: Device;
  videoAssets: VideoAsset[];
  onAddVideoAsset: (video: VideoAsset) => void;
  onDeleteVideoAsset: (id: string) => void;
}}

export default function AssetManager({{ device, videoAssets, onAddVideoAsset, onDeleteVideoAsset }}: AssetManagerProps) {{
  const [apiKey, setApiKey] = useState('dp_sk_e42386a68d347df7a988bdead43fb5584ab98b4223748782ff06f');
  const [taskType, setTaskType] = useState<'image'|'video'>('video');
  const [prompt, setPrompt] = useState('');
  const [showAIGenModal, setShowAIGenModal] = useState(false);

  // Replication Tool States
{states_block}
  const handleGenerateVideo = () => {{
    setIsGeneratingVideo(true);
    setGenerationComplete(false);

    const messages = [
      `连接 ${{selectedModel}} 模型节点...`,
      "加载分镜帧与音频提示词...",
      "正在进行深度场景渲染...",
      "应用风格化光影滤镜...",
      "生成 1080P 高清视频流...",
      "合并 Lo-Fi Chill Hop 音频轨...",
      "最后校验视频质量..."
    ];

    let step = 0;
    setGenerationMsg(messages[0]);

    const interval = setInterval(() => {{
      step++;
      if (step >= messages.length) {{
        clearInterval(interval);
        setGenerationComplete(true);
      }} else {{
        setGenerationMsg(messages[step]);
      }}
    }}, 4000); // about 30 secs total
  }};

{funcs_block}

  const getCover = (index: number) => {{
    return `/1 (${{(index % 5) + 1}}).png`;
  }};
  
  return (
    <div className="flex-1 flex gap-6 min-h-0 relative">
      
      {{/* Left Panel: Asset List */}}
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
              onClick={{() => setShowAIGenModal(true)}}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI生成
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-narrow">
          {{videoAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <FileVideo className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-bold">资源库空空如也</p>
              <p className="text-xs mt-1">请从克隆选题生成或导入视频文件</p>
            </div>
          ) : (
            videoAssets.map((asset, index) => (
              <div key={{asset.id}} className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 flex gap-4 hover:border-slate-600 transition group relative">
                <div className={{`w-24 h-32 rounded-lg bg-slate-900 border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center`}}>
                  <img src={{getCover(index)}} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className={{`absolute inset-0 ${{asset.thumbnailColor}} opacity-30 mix-blend-multiply`}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                  <div className="absolute top-1.5 right-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono text-white font-bold">
                    00:{{asset.duration.toString().padStart(2, '0')}}
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
                      <h4 className="text-sm font-bold text-slate-200 line-clamp-1 pr-6">{{asset.title}}</h4>
                      <button 
                        onClick={{() => onDeleteVideoAsset(asset.id)}}
                        className="text-slate-500 hover:text-rose-400 transition absolute top-4 right-4 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="删除视频"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {{asset.script || "自动生成的视频素材文件，等待排期分发。"}}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {{asset.tags.map(tag => (
                        <span key={{tag}} className="text-[10px] bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded border border-slate-800">
                          {{tag}}
                        </span>
                      ))}}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded transition flex justify-center items-center gap-1 border border-slate-800 cursor-pointer">
                      <Settings2 className="w-3 h-3" /> 二次剪辑
                    </button>
                    <button className="flex-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded transition flex justify-center items-center gap-1 border border-slate-800 cursor-pointer">
                      <Download className="w-3 h-3" /> 导出到本地
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}}
        </div>
      </div>

      {{/* Right Panel: Video Replication Tool */}}
      <div className="w-1/2 flex flex-col min-h-0 bg-slate-800/40 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
{jsx_block.replace('xl:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo', 'p-4 flex flex-col h-full overflow-y-auto scrollbar-narrow').replace('handleGenerateVideo', 'handleGenerateVideo')}
      </div>

      {{/* AI Generation Settings Modal */}}
      {{showAIGenModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <span className="text-sm font-bold text-slate-200">AI 智能素材生成 (API Configuration)</span>
              <button onClick={{() => setShowAIGenModal(false)}} className="text-slate-500 hover:text-white transition cursor-pointer">✕</button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto p-5 scrollbar-narrow space-y-5 text-left">
              {{/* API Key */}}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">API Key</label>
                <input 
                  type="text" 
                  value={{apiKey}}
                  onChange={{(e) => setApiKey(e.target.value)}}
                  className="w-full text-xs font-mono bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500 text-slate-400"
                />
              </div>

              <hr className="border-slate-800" />

              {{/* Task Type */}}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">任务类型</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={{() => setTaskType('image')}}
                    className={{`px-4 py-1.5 rounded text-xs transition cursor-pointer ${{taskType === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}}`}}
                  >
                    图片生成
                  </button>
                  <button 
                    onClick={{() => setTaskType('video')}}
                    className={{`px-4 py-1.5 rounded text-xs transition cursor-pointer ${{taskType === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}}`}}
                  >
                    视频生成
                  </button>
                </div>
              </div>

              {{/* Prompt */}}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Prompt</label>
                <textarea 
                  placeholder="请输入生成提示词..."
                  value={{prompt}}
                  onChange={{(e) => setPrompt(e.target.value)}}
                  className="w-full h-24 text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-400 resize-none"
                />
              </div>

              {{/* Dropdowns */}}
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
              
              {{/* Submit */}}
              <div className="pt-2">
                <button 
                  onClick={{() => {{
                    setShowAIGenModal(false);
                    alert('生成任务已投递至云端队列');
                  }}}}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  确认生成
                </button>
              </div>

            </div>
          </div>
        </div>
      )}}

{modal_block.replace("onAddRecreatedVideo", "onAddVideoAsset")}

    </div>
  );
}}
"""

with open(asset_manager_path, 'w', encoding='utf-8') as f:
    f.write(new_am)

