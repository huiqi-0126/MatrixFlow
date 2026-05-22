import re

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Remote Control Button
old_remote_btn = """          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowRemoteControl(true)}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4" /> 远程操作该设备
            </button>
          </div>"""

new_remote_btn = """          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowRemoteControl(true)}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> 锁定操控
            </button>
          </div>"""

content = content.replace(old_remote_btn, new_remote_btn)

# 2. Add AI Optimize button to Persona Header
old_persona_header = """        {/* Module 2: 人设定义 (Persona Definition) */}
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
          </div>"""

new_persona_header = """        {/* Module 2: 人设定义 (Persona Definition) */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col text-left bento-glow-indigo">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-400 w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-150">人设定义</h3>
            </div>
            {!isEditingPersona && (
              <div className="flex gap-2">
                <button
                  onClick={() => alert('正在通过AI优化人设参数...')}
                  className="px-3 py-1 bg-indigo-950/50 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI优化
                </button>
                <button
                  onClick={() => {
                    setEditedPersona({ ...persona });
                    setIsEditingPersona(true);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit className="w-3.5 h-3.5" /> 修改
                </button>
              </div>
            )}
          </div>"""
content = content.replace(old_persona_header, new_persona_header)

# 3. Add more fields to Persona display
old_persona_display = """              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">COMMENTARY TONE (互动文风)</span>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-slate-300 font-mono text-xs flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {persona.tone}
                </div>
              </div>
            </div>
          )}"""

new_persona_display = """              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1.5 uppercase">COMMENTARY TONE (互动文风)</span>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850 text-slate-300 font-mono text-xs flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  {persona.tone}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                  <span className="text-slate-500 block mb-1 text-[10px]">CONTENT STYLE</span>
                  <span className="text-slate-200 font-bold text-[11px] truncate block">{persona.niche === 'aesthetic-cooking' ? 'POV, ASMR, Vlog' : 'Trend, Info, Promo'}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                  <span className="text-slate-500 block mb-1 text-[10px]">TIMEZONE / POSTING</span>
                  <span className="text-slate-200 font-bold text-[11px]">UTC-5 (EST) Prime</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded border border-slate-850">
                <span className="text-slate-500 block mb-1 text-[10px] uppercase">Avoidance / Anti-ban Strategy</span>
                <span className="text-emerald-400 font-bold text-[11px] block">No excessive tagging, native browsing enabled.</span>
              </div>
            </div>
          )}"""
content = content.replace(old_persona_display, new_persona_display)

# Add Lock icon import
if 'Lock' not in content:
    content = content.replace("Shield, X, Wifi, Globe", "Shield, X, Wifi, Globe, Lock")

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
