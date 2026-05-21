import React from 'react';
import { VideoAsset } from '../types';
import { Film, Trash2, Download, Upload, FileVideo, Settings2 } from 'lucide-react';

interface SharedVideoListProps {
  videoAssets: VideoAsset[];
  onDeleteVideoAsset?: (id: string) => void;
}

const getCover = (id: string, index: number) => {
  const COVER_IMAGES = [
    'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1526506114642-12f5a6534e70?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1498837167922-41cfa6f310f1?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1507133750070-4cb7b1f50a11?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=300&h=400'
  ];
  return COVER_IMAGES[index % COVER_IMAGES.length];
};

export default function SharedVideoList({ videoAssets, onDeleteVideoAsset }: SharedVideoListProps) {
  return (
    <div className="w-[380px] xl:w-[450px] shrink-0 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl min-h-0 h-full">
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
                <img src={getCover(asset.id, index)} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay" />
                <div className={`absolute inset-0 ${asset.thumbnailColor} opacity-40 mix-blend-multiply`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                <div className="absolute top-1.5 right-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono text-white font-bold">
                  00:{asset.duration.toString().padStart(2, '0')}
                </div>
                <Film className="w-6 h-6 text-white/30 relative z-10" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 flex items-center justify-between">
                  <span className="text-[9px] text-white/70 font-mono">1080P</span>
                  <span className="text-[9px] text-white/70 font-mono">30FPS</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1 pr-6">{asset.title}</h4>
                    {onDeleteVideoAsset && (
                      <button 
                        onClick={() => onDeleteVideoAsset(asset.id)}
                        className="text-slate-500 hover:text-rose-400 transition absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                        title="删除视频"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
  );
}
