import re

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

new_button = """<div className="mt-auto pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowRemoteControl(true)}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-lg transition shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> 锁定操控
            </button>
          </div>"""

# Replace the block
content = re.sub(r'<div className="mt-auto pt-4 border-t border-slate-800">.*?</div>', new_button, content, flags=re.DOTALL)

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced!")
