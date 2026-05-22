import os

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will rewrite PersonaManager completely to match the 3 modules requirement.
new_content = """import React, { useState } from 'react';
import {
  User, Check, Plus, Edit, Trash2, Video, Tag, MessageSquare,
  Sparkles, FileText, Info, HelpCircle, HardDrive, UploadCloud, Loader2,
  Flame, Play, Layers, Download, Smartphone, Monitor, Activity, Shield, X, Wifi
} from 'lucide-react';
import { Persona, VideoAsset, Device } from '../types';
import { NICHES } from '../constants';
import DeviceSimulator from './DeviceSimulator';

interface PersonaManagerProps {
  device: Device;
  persona: Persona;
  videoAssets: VideoAsset[];
  onUpdatePersona: (newPersona: Persona) => void;
  onAddVideoAsset: (asset: VideoAsset) => void;
  onDeleteVideoAsset: (assetId: string) => void;
  onUpdateDeviceStats?: (deviceId: string, stats: { viewsAdd: number; followersAdd: number }) => void;
}

export default function PersonaManager({
  device,
  persona,
  videoAssets,
  onUpdatePersona,
  onAddVideoAsset,
  onDeleteVideoAsset,
  onUpdateDeviceStats
}: PersonaManagerProps) {

  const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [editedPersona, setEditedPersona] = useState<Persona>({ ...persona });
  const [showRemoteControl, setShowRemoteControl] = useState(false);

  const handleSavePersona = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePersona(editedPersona);
    setIsEditingPersona(false);
  };

  return (
    <div className="relative h-full flex flex-col">
      {showRemoteControl && (
        <div className="absolute inset-0 z-50 bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="flex justify-between items-center bg-indigo-950/40 p-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-indigo-200 tracking-wider">SECURE REMOTE CONNECTION: {device.ip}</span>
            </div>
            <button 
              onClick={() => setShowRemoteControl(false)}
              className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <DeviceSimulator
              device={device}
              persona={persona}
              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}
            />
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 h-full text-slate-200 overflow-y-auto pr-2 scrollbar-narrow ${showRemoteControl ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        
        {/* Module 1: 账号信息 (Account Info) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
            <User className="text-indigo-400 w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-150">账号信息</h3>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] overflow-hidden bg-slate-800 mb-3 relative group">
              {(persona.avatarUrl.startsWith('http') || persona.avatarUrl.startsWith('/')) ? (
                <img
                  src={persona.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">${persona.avatarUrl}</div>`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {persona.avatarUrl}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                <Edit className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold font-mono tracking-tight">@{device.username}</h2>
            <span className="text-xs text-indigo-400 font-mono mt-1 px-2 py-0.5 bg-indigo-950/50 rounded-full border border-indigo-900">
              {device.niche}
            </span>
          </div>
          
          <div className="space-y-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block mb-1">主页链接 (Profile URL)</span>
              <div className="bg-black/40 p-2 rounded border border-slate-800 text-sky-400 truncate cursor-pointer hover:underline">
                https://tiktok.com/@{device.username}
              </div>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">英文简介 (Bio)</span>
              <div className="bg-black/40 p-3 rounded border border-slate-800 text-slate-300 leading-relaxed min-h-[80px]">
                {persona.bio}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="bg-black/30 p-3 rounded border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1 text-[10px]">FOLLOWERS</span>
                <span className="font-bold text-emerald-400 text-lg">{device.followerCount.toLocaleString()}</span>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1 text-[10px]">TOTAL VIEWS</span>
                <span className="font-bold text-sky-400 text-lg">{device.totalViews.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: 人设定义 (Persona Definition) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-150">人设定义</h3>
            </div>
            {!isEditingPersona && (
              <button
                onClick={() => {
                  setEditedPersona({ ...persona });
                  setIsEditingPersona(true);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Edit className="w-3.5 h-3.5" /> 修改
              </button>
            )}
          </div>

          {isEditingPersona ? (
            <form onSubmit={handleSavePersona} className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase">Target Race</label>
                  <input
                    type="text"
                    value={editedPersona.race}
                    onChange={(e) => setEditedPersona({ ...editedPersona, race: e.target.value })}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase">Gender</label>
                  <select
                    value={editedPersona.gender}
                    onChange={(e) => setEditedPersona({ ...editedPersona, gender: e.target.value })}
                    className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase">Core Values</label>
                <input
                  type="text"
                  value={editedPersona.values}
                  onChange={(e) => setEditedPersona({ ...editedPersona, values: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase">Interests (comma separated)</label>
                <input
                  type="text"
                  value={editedPersona.interests.join(', ')}
                  onChange={(e) => setEditedPersona({ ...editedPersona, interests: e.target.value.split(',').map(x => x.trim()) })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase">Commentary Tone</label>
                <input
                  type="text"
                  value={editedPersona.tone}
                  onChange={(e) => setEditedPersona({ ...editedPersona, tone: e.target.value })}
                  className="w-full bg-black text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 font-bold text-black text-xs rounded transition cursor-pointer text-center"
                >
                  保存
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPersona(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition cursor-pointer"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                  <span className="text-slate-500 block mb-1 text-[10px]">TARGET RACE</span>
                  <span className="text-slate-200 font-bold">{persona.race}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                  <span className="text-slate-500 block mb-1 text-[10px]">GENDER</span>
                  <span className="text-slate-200 font-bold">{persona.gender}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">CORE VALUES (价值观方向)</span>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-indigo-300 font-mono italic text-xs leading-relaxed">
                  "{persona.values}"
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">INTEREST MATRIX (兴趣标签)</span>
                <div className="flex flex-wrap gap-1.5">
                  {persona.interests.map((interest, idx) => (
                    <span key={idx} className="text-[10px] bg-indigo-950/30 border border-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">COMMENTARY TONE (互动文风)</span>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-slate-300 font-mono text-xs flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {persona.tone}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Module 3: 养殖环境 (Farming Environment) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <HardDrive className="text-emerald-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-150">养殖环境</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 px-2 py-1 rounded">
              <Wifi className="w-3 h-3" /> ONLINE
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono flex-1">
            <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-slate-800">
              <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-500 block mb-0.5 text-[10px]">NETWORK / IP ROUTING</span>
                <span className="text-sky-400 font-bold block">{device.ip}</span>
                <span className="text-slate-400 block mt-1">{device.region}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-slate-800">
              <Smartphone className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-500 block mb-0.5 text-[10px]">HARDWARE FINGERPRINT</span>
                <span className="text-slate-200 font-bold block">{device.name.replace(/#\d+/, '').trim()}</span>
                <span className="text-slate-400 block mt-1">iOS 16.7.12</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1 text-[10px]">RESOLUTION</span>
                <span className="text-slate-300">750 x 1334</span>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1 text-[10px]">CHANNEL ID</span>
                <span className="text-slate-300">exgk</span>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-500 block mb-1 text-[10px]">DEVICE ID</span>
              <span className="text-slate-300 font-mono">exgk-iphone-{device.id.split('-')[1] || '1'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1 text-[10px]">FIRST ONLINE</span>
                <span className="text-slate-400">2026/4/13 01:21:02</span>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1 text-[10px]">LAST ONLINE</span>
                <span className="text-emerald-400">2026/5/22 00:10:51</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowRemoteControl(true)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4" /> 远程操作该设备
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
"""

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Updated PersonaManager.tsx")
