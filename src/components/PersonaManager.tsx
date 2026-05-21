import React, { useState } from 'react';
import { 
  User, Check, Plus, Edit, Trash2, Video, Tag, MessageSquare, 
  Sparkles, FileText, Info, HelpCircle, HardDrive, UploadCloud 
} from 'lucide-react';
import { Persona, VideoAsset, Device } from '../types';
import { NICHES } from '../constants';

interface PersonaManagerProps {
  device: Device;
  persona: Persona;
  videoAssets: VideoAsset[];
  onUpdatePersona: (newPersona: Persona) => void;
  onAddVideoAsset: (asset: VideoAsset) => void;
  onDeleteVideoAsset: (assetId: string) => void;
}

export default function PersonaManager({ 
  device, 
  persona, 
  videoAssets, 
  onUpdatePersona, 
  onAddVideoAsset, 
  onDeleteVideoAsset 
}: PersonaManagerProps) {
  
  const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Persona>({ ...persona });
  
  // Video uploading modal/form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    tagline: '',
    duration: 15,
    tagsString: '',
    script: '',
    niche: device.niche
  });

  const handleSavePersona = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePersona(editedPersona);
    setIsEditingPersona(false);
  };

  const handleTriggerUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title) return;
    
    const tags = newVideo.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const colors = ['bg-emerald-800', 'bg-purple-800', 'bg-rose-900', 'bg-stone-800', 'bg-amber-900', 'bg-blue-900'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const createdAsset: VideoAsset = {
      id: `res-${Date.now()}`,
      title: newVideo.title,
      niche: newVideo.niche,
      duration: Number(newVideo.duration) || 15,
      thumbnailColor: randomColor,
      tagline: newVideo.tagline || 'Simulated generated reels compilation',
      tags: tags.length > 0 ? tags : [`#${device.niche}`, '#viral'],
      script: newVideo.script || 'POV: Simulated narrative script overlay text...'
    };

    onAddVideoAsset(createdAsset);
    setShowUploadModal(false);
    
    // Reset form
    setNewVideo({
      title: '',
      tagline: '',
      duration: 15,
      tagsString: '',
      script: '',
      niche: device.niche
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-slate-200">
      
      {/* 1. Left Panel: Standard User Persona Editor (5 columns) */}
      <div className="xl:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="text-indigo-400 w-5 h-5" />
            <h3 className="text-base font-bold text-slate-150">稳定海外账号人设 (Stable AI Persona)</h3>
          </div>
          
          {!isEditingPersona && (
            <button 
              onClick={() => {
                setEditedPersona({ ...persona });
                setIsEditingPersona(true);
              }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
            >
              <Edit className="w-3.5 h-3.5" /> 修改人设
            </button>
          )}
        </div>

        {isEditingPersona ? (
          <form onSubmit={handleSavePersona} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">形象 Emoji 标识</label>
                <input 
                  type="text" 
                  value={editedPersona.avatarUrl} 
                  onChange={(e) => setEditedPersona({ ...editedPersona, avatarUrl: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">目标族裔/细分受众</label>
                <input 
                  type="text" 
                  value={editedPersona.race} 
                  onChange={(e) => setEditedPersona({ ...editedPersona, race: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">性别设定</label>
                <select 
                  value={editedPersona.gender} 
                  onChange={(e) => setEditedPersona({ ...editedPersona, gender: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                >
                  <option value="Male">Male (男)</option>
                  <option value="Female">Female (女)</option>
                  <option value="Non-binary">Non-binary (非二元性别)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">内容垂类</label>
                <select 
                  value={editedPersona.niche} 
                  onChange={(e) => setEditedPersona({ ...editedPersona, niche: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                >
                  {NICHES.map(n => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">核心价值观 (Values Model - English)</label>
              <input 
                type="text" 
                value={editedPersona.values} 
                onChange={(e) => setEditedPersona({ ...editedPersona, values: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">个性标签与兴趣域 (英文逗号隔开)</label>
              <input 
                type="text" 
                value={editedPersona.interests.join(', ')} 
                onChange={(e) => setEditedPersona({ ...editedPersona, interests: e.target.value.split(',').map(x => x.trim()) })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">英文独家简介 (TikTok Bio - English)</label>
              <textarea 
                value={editedPersona.bio} 
                onChange={(e) => setEditedPersona({ ...editedPersona, bio: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none h-16 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">评论互动风格 (Interaction Language Tone)</label>
              <input 
                type="text" 
                value={editedPersona.tone} 
                onChange={(e) => setEditedPersona({ ...editedPersona, tone: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="submit"
                className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-black text-xs rounded transition cursor-pointer text-center"
              >
                保存人设参数
              </button>
              <button 
                type="button"
                onClick={() => setIsEditingPersona(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition cursor-pointer"
              >
                取消
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            
            {/* Visual Persona Header Summary */}
            <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {persona.avatarUrl}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs text-slate-400 block font-bold">IP绑定的 TikTok 账号:</span>
                <span className="text-base font-bold font-mono text-white tracking-wide">@{device.username}</span>
                <span className="text-xxs text-indigo-400 block font-mono mt-0.5 uppercase tracking-wide">
                  Niche: {persona.niche}
                </span>
              </div>
            </div>

            {/* Persona Attributes */}
            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono leading-relaxed">
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                <span className="text-slate-500 block mb-0.5">TARGET RACE:</span>
                <span className="text-slate-200 font-bold">{persona.race}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded border border-slate-850">
                <span className="text-slate-500 block mb-0.5">GENDER SETTING:</span>
                <span className="text-slate-200 font-bold">{persona.gender}</span>
              </div>
            </div>

            <div className="bg-slate-800/20 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 tracking-wider uppercase">CORE VALUES (价值观方向)</span>
              <p className="text-xs text-indigo-300 font-mono italic leading-relaxed text-left">
                "{persona.values}"
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold block mb-1.5 tracking-wider">MAPPED INTEREST MATRIX (账号算法兴趣群)</span>
              <div className="flex flex-wrap gap-1">
                {persona.interests.map((interest, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono transition">
                    # {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 text-left">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 tracking-wider">TIKTOK BIO DRAFT (英文主页简介)</span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{persona.bio}</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 text-left">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 tracking-wider">AUTO COMMENTARY TONE (评论互动文风)</span>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-slate-200 font-bold font-mono">{persona.tone}</span>
              </div>
            </div>

            <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30 text-xs text-amber-300 leading-normal flex gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">平台拟人权重保证:</span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                  当脚本启动自动养号时，我们将随机在上述【兴趣矩阵】标签下的视频，使用【英文互动文风】生成评论，以最高真实度通过各大社媒的反作弊算法。
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 2. Right Panel: Video Asset Manager (7 columns) */}
      <div className="xl:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
        
        {/* Hub Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Video className="text-emerald-400 w-5 h-5" />
            <h3 className="text-base font-bold text-slate-150">创作资源库及视频文件管理 (Media Asset Hub)</h3>
          </div>
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-md"
          >
            <Plus className="w-4 h-4" /> 导入/新增视频资源
          </button>
        </div>

        {/* Assets List Grid */}
        <div className="flex-1 overflow-y-auto max-h-[460px] pr-1 space-y-3.5 scrollbar-narrow">
          {videoAssets.filter(asset => asset.niche === device.niche || asset.niche === 'all').length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
              <HardDrive className="w-8 h-8 text-slate-650 mb-2" />
              <span className="text-xs text-slate-400 font-bold">该垂类暂无储备视频文件</span>
              <p className="text-[10px] text-slate-500 mt-1 max-w-sm">
                点击右上角按钮手工导入。
              </p>
            </div>
          ) : (
            videoAssets.map(asset => (
              <div 
                key={asset.id}
                className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/85 flex flex-col md:flex-row gap-4 hover:border-indigo-500/40 transition-all"
              >
                {/* Visual Placeholder thumbnail */}
                <div className={`w-full md:w-32 h-20 rounded-lg ${asset.thumbnailColor} border border-white/10 shrink-0 relative flex flex-col items-center justify-center`}>
                  <HardDrive className="w-5 h-5 text-white/40 mb-1" />
                  <span className="text-[10px] text-white/70 font-mono font-bold">MP4 DRAFT HD</span>
                  <div className="absolute bottom-1 right-1.5 bg-black/70 px-1 py-0.5 rounded text-[8px] font-mono text-emerald-400">
                    00:{asset.duration < 10 ? `0${asset.duration}` : asset.duration}
                  </div>
                </div>

                {/* Details info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="overflow-hidden">
                      <span className="text-xxs uppercase tracking-wider text-slate-500 block font-mono">FILE: {asset.id}</span>
                      <h4 className="text-xs font-bold text-slate-200 truncate">{asset.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-snug line-clamp-1 italic mt-0.5">
                        "{asset.tagline}"
                      </p>
                    </div>

                    <button 
                      onClick={() => onDeleteVideoAsset(asset.id)}
                      className="p-1.5 text-slate-550 hover:text-red-400 rounded hover:bg-red-950/25 cursor-pointer transition shrink-0"
                      title="删除资产"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Script overlay preview */}
                  <div className="bg-black/40 p-2 border border-slate-900/60 rounded mt-2.5">
                    <span className="text-[8px] text-slate-500 font-bold font-mono tracking-wider block uppercase mb-1">AUTOMATED SUBTILE SCRIPTEXT (ENG):</span>
                    <p className="text-[10px] text-slate-300 font-mono leading-relaxed whitespace-pre-wrap line-clamp-2 text-left">
                      {asset.script}
                    </p>
                  </div>

                  {/* Metadata labels */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {asset.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/20 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">
                      Format: H.264 MP4
                    </span>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>

        {/* Custom video asset upload mockup form modal overlay */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-lg text-left shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-sm font-bold text-slate-150">导入新视频资源 (Import Media Segment)</span>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleTriggerUpload} className="space-y-3">
                
                {/* Drag and drop mock view */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
                    dragOver 
                      ? 'border-emerald-400 bg-emerald-950/20 text-emerald-300' 
                      : 'border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    setNewVideo(prev => ({ ...prev, title: 'Prada_Vintage_Lookbook_HighRes_Recreated.mp4', tagline: 'Dropped from local disk storage' }));
                  }}
                  onClick={() => {
                    setNewVideo(prev => ({ 
                      ...prev, 
                      title: 'OOTD_TokyoStyle_Vintage_Summer.mp4', 
                      tagline: 'Simulated file selected from explorer' 
                    }));
                  }}
                >
                  <UploadCloud className="w-8 h-8 text-emerald-450 mx-auto mb-2" />
                  <span className="text-xs font-bold block text-slate-300">拖拽 MP4 格式视频至此，或者点击选择</span>
                  <span className="text-[10px] text-slate-500 block mt-1">支持 H.264 AAC编码，比例推荐 9:16 贴片竖屏剪辑</span>
                </div >

                <div>
                  <label className="text-xs text-slate-400 block mb-1">文件标题 filename</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例如: Matcha_Latte_ASMR_Clean_Cut.mp4"
                    value={newVideo.title} 
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">视频长短 (秒 - duration)</label>
                    <input 
                      type="number" 
                      value={newVideo.duration} 
                      onChange={(e) => setNewVideo({ ...newVideo, duration: Number(e.target.value) || 15 })}
                      className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">目标内容垂类</label>
                    <select 
                      value={newVideo.niche} 
                      onChange={(e) => setNewVideo({ ...newVideo, niche: e.target.value })}
                      className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      {NICHES.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">宣传导引句 (English Tagline)</label>
                  <input 
                    type="text" 
                    placeholder="POV: satisfy your matcha foam cravings tonight."
                    value={newVideo.tagline} 
                    onChange={(e) => setNewVideo({ ...newVideo, tagline: e.target.value })}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">推荐SEO 英文标签 tags (英文逗号隔开)</label>
                  <input 
                    type="text" 
                    placeholder="matcha, aesthetic, satisfying, asmr"
                    value={newVideo.tagsString} 
                    onChange={(e) => setNewVideo({ ...newVideo, tagsString: e.target.value })}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">自动化配音及字母台本 (English Script)</label>
                  <textarea 
                    value={newVideo.script} 
                    onChange={(e) => setNewVideo({ ...newVideo, script: e.target.value })}
                    placeholder="POV: boiling organic green tea powder. Whisking slowly. Hot oat foam cascading."
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-emerald-500 focus:outline-none h-16 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold text-black text-xs rounded transition cursor-pointer text-center"
                  >
                    确认录入资源库
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition"
                  >
                    取消
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
