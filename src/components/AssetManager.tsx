import React, { useState } from 'react';
import { VideoAsset, Device } from '../types';
import { Film, Trash2, Download, Upload, Info, FileVideo, Plus, Settings2, Image as ImageIcon, CheckCircle, Copy } from 'lucide-react';

interface AssetManagerProps {
  device: Device;
  videoAssets: VideoAsset[];
  onAddVideoAsset: (video: VideoAsset) => void;
  onDeleteVideoAsset: (id: string) => void;
}

export default function AssetManager({ device, videoAssets, onAddVideoAsset, onDeleteVideoAsset }: AssetManagerProps) {
  const [apiKey, setApiKey] = useState('dp_sk_e42386a68d347df7a988bdead43fb5584ab98b4223748782ff06f');
  const [taskType, setTaskType] = useState<'image'|'video'>('video');
  const [prompt, setPrompt] = useState('');

  const getCover = (id: string, index: number) => {
    const COVER_IMAGES = [
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1526506114642-12f5a6534e70?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1498837167922-41cfa6f310f1?auto=format&fit=crop&q=80&w=300&h=400'
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COVER_IMAGES[(hash + index) % COVER_IMAGES.length];
  };
  
  return (
    <div className="flex-1 flex gap-6 min-h-0 relative">
      
      {/* Left Panel: Asset List */}
      <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-100">我的视频资源库 (Asset Library)</h2>
          </div>
          <button 
            className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> 导入本地视频
          </button>
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
                  <img src={getCover(asset.id, index)} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
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
                        className="text-slate-500 hover:text-rose-400 transition absolute top-4 right-4 opacity-0 group-hover:opacity-100"
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
                    <button className="flex-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded transition flex justify-center items-center gap-1 border border-slate-800">
                      <Settings2 className="w-3 h-3" /> 二次剪辑
                    </button>
                    <button className="flex-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 py-1.5 rounded transition flex justify-center items-center gap-1 border border-slate-800">
                      <Download className="w-3 h-3" /> 导出到本地
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: API Generation Playground */}
      <div className="w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-0 text-slate-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <span className="text-sm text-slate-400 font-medium">在下方填写参数发起测试调用</span>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition">
            <Download className="w-4 h-4 rotate-180" /> 调用说明文档
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-narrow bg-transparent space-y-5">
          
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
                className={`px-4 py-1.5 rounded text-xs transition ${taskType === 'image' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}
              >
                图片生成
              </button>
              <button 
                onClick={() => setTaskType('video')}
                className={`px-4 py-1.5 rounded text-xs transition ${taskType === 'video' ? 'bg-indigo-600 text-white' : 'bg-slate-950/50 border border-slate-700 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}
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

          {/* Reference Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              参考图片 <span className="text-slate-400 font-normal">(可选 · 图生图/图生视频)</span>
            </label>
            <input 
              type="text" 
              placeholder="粘贴图片URL或base64编码，也可点击下方按钮选择本地图片"
              className="w-full text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none focus:border-indigo-500 text-slate-400 placeholder-slate-400"
            />
            <div className="pt-1">
              <button className="px-3 py-1.5 bg-slate-950/50 border border-slate-700 hover:bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded transition">
                选择本地图片
              </button>
            </div>
            <p className="text-[10px] text-slate-400 pt-1">支持图片URL (http/https) 或base64编码 (data:image/xxx;base64,...)</p>
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
                <option value="seedance-2.0-standard">Seedance 2.0 standard</option>
                <option value="seedance-2.0-fast">Seedance 2.0 fast</option>
                <option value="pixverse-c1">PixVerse C1</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">分辨率</label>
              <select className="w-full text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none text-slate-200 appearance-none">
                <option>720p</option>
                <option>1080p</option>
                <option>4k</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                比例 <span className="text-slate-400 font-normal">(可选)</span>
              </label>
              <select className="w-full text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none text-slate-200 appearance-none">
                <option>默认</option>
                <option>16:9</option>
                <option>9:16</option>
                <option>1:1</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                持续时间 <span className="text-slate-400 font-normal">(秒)</span>
              </label>
              <select className="w-full text-xs bg-slate-950/50 border border-slate-700 rounded p-2 focus:outline-none text-slate-200 appearance-none">
                <option>1s</option>
                <option>5s</option>
                <option>10s</option>
              </select>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="audio-cb" className="w-3.5 h-3.5 rounded border-slate-700 text-indigo-400 focus:ring-indigo-500" />
            <label htmlFor="audio-cb" className="text-xs text-slate-300">带声音</label>
          </div>

          {/* Submit */}
          <div className="pt-2 pb-4">
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded shadow transition">
              生成
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
