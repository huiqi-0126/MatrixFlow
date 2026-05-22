import React, { useState } from 'react';
import {
  User, Check, Plus, Edit, Trash2, Video, Tag, MessageSquare,
  Sparkles, FileText, Info, HelpCircle, HardDrive, UploadCloud, Loader2,
  Flame, Play, Layers, Download
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
  const [isFetchingCompetitors, setIsFetchingCompetitors] = useState(false);
  const [showCompetitors, setShowCompetitors] = useState(false);

  const handleFetchCompetitors = () => {
    setIsFetchingCompetitors(true);
    setTimeout(() => {
      setIsFetchingCompetitors(false);
      setShowCompetitors(true);
    }, 3000);
  };
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200">

      {/* 1. Left Panel: Standard User Persona Editor (5 columns) */}
      <div className="xl:col-span-5 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo">

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
          <div className="flex items-center gap-4">
            <User className="text-indigo-400 w-5 h-5" />
            <h3 className="text-xs font-bold text-slate-150">稳定海外账号人设 (Stable AI Persona)</h3>
          </div>

          {!isEditingPersona && (
            <div className="flex gap-2">
              <button
                onClick={() => alert('大模型正在重新生成人设框架...')}
                className="px-3 py-1 bg-indigo-950/40 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> 重新生成
              </button>
              <button
                onClick={() => {
                  setEditedPersona({ ...persona });
                  setIsEditingPersona(true);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Edit className="w-3.5 h-3.5" /> 修改人设
              </button>
            </div>
          )}
        </div>

        {isEditingPersona ? (
          <form onSubmit={handleSavePersona} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2">形象 Emoji 标识</label>
                <input
                  type="text"
                  value={editedPersona.avatarUrl}
                  onChange={(e) => setEditedPersona({ ...editedPersona, avatarUrl: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-2">目标族裔/细分受众</label>
                <input
                  type="text"
                  value={editedPersona.race}
                  onChange={(e) => setEditedPersona({ ...editedPersona, race: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-2">性别设定</label>
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
                <label className="text-xs text-slate-400 block mb-2">内容垂类</label>
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
              <label className="text-xs text-slate-400 block mb-2">核心价值观 (Values Model - English)</label>
              <input
                type="text"
                value={editedPersona.values}
                onChange={(e) => setEditedPersona({ ...editedPersona, values: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">个性标签与兴趣域 (英文逗号隔开)</label>
              <input
                type="text"
                value={editedPersona.interests.join(', ')}
                onChange={(e) => setEditedPersona({ ...editedPersona, interests: e.target.value.split(',').map(x => x.trim()) })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">英文独家简介 (TikTok Bio - English)</label>
              <textarea
                value={editedPersona.bio}
                onChange={(e) => setEditedPersona({ ...editedPersona, bio: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none h-16 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">评论互动风格 (Interaction Language Tone)</label>
              <input
                type="text"
                value={editedPersona.tone}
                onChange={(e) => setEditedPersona({ ...editedPersona, tone: e.target.value })}
                className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
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
              <div className="w-20 h-20 rounded-full border-2 border-white/20 shadow-inner shrink-0 overflow-hidden bg-slate-200">
                {(persona.avatarUrl.startsWith('http') || persona.avatarUrl.startsWith('/')) ? (
                  <img
                    src={persona.avatarUrl}
                    alt="Persona Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">' + persona.avatarUrl + '</div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                    {persona.avatarUrl}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs text-slate-400 block font-bold">IP绑定的 TikTok 账号:</span>
                <span className="text-xs font-bold font-mono text-white tracking-wide">@{device.username}</span>
                <span className="text-xs text-indigo-400 block font-mono mt-0.5 uppercase tracking-wide">
                  Niche: {persona.niche}
                </span>
              </div>
            </div>

            {/* Persona Attributes */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono leading-relaxed">
              <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                <span className="text-slate-500 block mb-0.5">TARGET RACE:</span>
                <span className="text-slate-200 font-bold">{persona.race}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                <span className="text-slate-500 block mb-0.5">GENDER SETTING:</span>
                <span className="text-slate-200 font-bold">{persona.gender}</span>
              </div>
            </div>

            <div className="bg-slate-800/20 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 font-bold block mb-2 tracking-wider uppercase">CORE VALUES (价值观方向)</span>
              <p className="text-xs text-indigo-300 font-mono italic leading-relaxed text-left">
                "{persona.values}"
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-bold block mb-2 tracking-wider">MAPPED INTEREST MATRIX (账号算法兴趣群)</span>
              <div className="flex flex-wrap gap-1">
                {persona.interests.map((interest, idx) => (
                  <span key={idx} className="text-xs bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono transition">
                    # {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 text-left">
              <span className="text-xs text-slate-500 font-bold block mb-2 tracking-wider">TIKTOK BIO DRAFT (英文主页简介)</span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{persona.bio}</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-850 text-left">
              <span className="text-xs text-slate-500 font-bold block mb-2 tracking-wider">AUTO COMMENTARY TONE (评论互动文风)</span>
              <div className="flex items-center gap-4">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs text-slate-200 font-bold font-mono">{persona.tone}</span>
              </div>
            </div>

            <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-900/30 text-xs text-amber-300 leading-normal flex gap-4">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">平台拟人权重保证:</span>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                  当脚本启动自动养号时，我们将随机在上述【兴趣矩阵】标签下的视频，使用【英文互动文风】生成评论，以最高真实度通过各大社媒的反作弊算法。
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 2. Right Panel: Trending Competitor Content (7 columns) */}
      <div className="xl:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col text-left bento-glow-indigo">

        {/* Hub Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
          <div className="flex items-center gap-4">
            <Flame className="text-rose-500 w-5 h-5" />
            <h3 className="text-xs font-bold text-slate-150">近期对标账号爆款视频抓取 (Trending Competitor Content)</h3>
          </div>

          <div className="flex items-center gap-3">
            {showCompetitors && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono tracking-wider">
                  AUTO-SYNCED: JUST NOW
                </span>
                <button
                  onClick={() => alert('正在抓取对标账号近期爆款视频...')}
                  className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-black rounded font-bold text-xs flex items-center gap-1.5 transition shadow-[0_0_12px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  立刻抓取
                </button>
              </div>
            )}
            <button
              onClick={handleFetchCompetitors}
              disabled={isFetchingCompetitors || showCompetitors}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold transition-all ${showCompetitors
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]'
                }`}
            >
              {isFetchingCompetitors ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  抓取中...
                </>
              ) : showCompetitors ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已抓取
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  立刻抓取
                </>
              )}
            </button>
          </div>
        </div>

        {/* Assets List Grid */}
        <div className="flex-1 overflow-y-auto h-full min-h-[460px] pr-1 space-y-3 scrollbar-narrow relative">

          {!showCompetitors && !isFetchingCompetitors && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Flame className="w-8 h-8 text-slate-500" />
              </div>
              <h4 className="text-slate-200 font-bold mb-2">等待抓取对标爆款</h4>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                系统将根据当前人设赛道（{device.niche}）和标签特征，自动抓取全网最新高互动量爆款视频作为参考。
              </p>
            </div>
          )}

          {isFetchingCompetitors && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-800/40 rounded-xl backdrop-blur-sm z-10">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <h4 className="text-indigo-400 font-bold mb-2 animate-pulse">正在全网扫描爆款视频...</h4>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Matching tags: {persona.interests.slice(0, 2).join(', ')}...
              </p>
            </div>
          )}

          {showCompetitors && (
            [
              {
                title: "15s Matcha Latte ASMR for sleepy mornings 🍵",
                creator: "@matcha_muse",
                views: "1.2M",
                likes: "345K",
                date: "2 hours ago",
                tags: ["#matcha", "#asmrcooking", "#aesthetic"],
                imgSrc: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=200&h=200",
                imgColor: "bg-emerald-900/50"
              },
              {
                title: "POV: Sunday reset routine in my minimal kitchen",
                creator: "@cozy_corner_ny",
                views: "890K",
                likes: "120K",
                date: "5 hours ago",
                tags: ["#sundayreset", "#minimalist", "#kitchen"],
                imgSrc: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200&h=200",
                imgColor: "bg-amber-900/50"
              },
              {
                title: "Making espresso without a machine! ☕️🤯",
                creator: "@coffee_hacks_daily",
                views: "2.4M",
                likes: "580K",
                date: "1 day ago",
                tags: ["#espresso", "#coffeehacks", "#morningroutine"],
                imgSrc: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=200&h=200",
                imgColor: "bg-amber-800/50"
              },
              {
                title: "Testing the viral glass cup aesthetic",
                creator: "@glassware_finds",
                views: "450K",
                likes: "80K",
                date: "2 days ago",
                tags: ["#amazonfinds", "#aesthetic", "#unboxing"],
                imgSrc: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=200&h=200",
                imgColor: "bg-sky-900/50"
              },
              {
                title: "Late night study session with lofi beats 📚",
                creator: "@study_aesthetic",
                views: "720K",
                likes: "95K",
                date: "3 days ago",
                tags: ["#studywithme", "#lofi", "#aesthetic"],
                imgSrc: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&q=80&w=200&h=200",
                imgColor: "bg-indigo-900/50"
              }
            ].map((vid, i) => (
              <div
                key={i}
                className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 hover:border-rose-500/30 transition-all"
              >
                {/* Visual Placeholder thumbnail */}
                <div className={`w-full md:w-32 h-20 rounded-lg ${vid.imgColor} border border-white/10 shrink-0 relative flex flex-col items-center justify-center overflow-hidden`}>
                  <img src={vid.imgSrc} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Play className="w-5 h-5 text-white z-10 mb-1 drop-shadow-md" />
                  <span className="text-[10px] text-white font-mono font-bold z-10 drop-shadow-md">{vid.views} Views</span>
                </div>

                {/* Details info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-200 truncate pr-4">{vid.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                        <span className="text-rose-400 font-bold">{vid.creator}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{vid.date}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{vid.likes} Likes</span>
                      </div>
                    </div>

                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('replicate-video', { detail: { url: `https://tiktok.com/${vid.creator.replace('@', '')}/video/${Math.floor(Math.random() * 100000000)}` } }))}
                      className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-black rounded font-bold text-xs flex items-center gap-1.5 transition shrink-0 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      一键复刻
                    </button>
                  </div>

                  {/* Metadata labels */}
                  <div className="flex items-center mt-3 flex-wrap gap-2">
                    {vid.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}