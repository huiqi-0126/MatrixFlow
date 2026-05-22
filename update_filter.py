import os

# 1. Update types.ts
with open('src/types.ts', 'r', encoding='utf-8') as f:
    content = f.read()
if "accountStatus:" not in content:
    content = content.replace("avatarColor: string;", "avatarColor: string;\n  accountStatus: 'active' | 'dormant' | 'banned';")
    with open('src/types.ts', 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update constants.ts
with open('src/constants.ts', 'r', encoding='utf-8') as f:
    constants_content = f.read()

# Add accountStatus to the items in INITIAL_DEVICES
lines = constants_content.split('\n')
new_lines = []
device_count = 0
for line in lines:
    new_lines.append(line)
    if "avatarColor:" in line:
        device_count += 1
        if device_count <= 6:
            new_lines.append("    accountStatus: 'active',")
        elif device_count <= 8:
            new_lines.append("    accountStatus: 'dormant',")
        else:
            new_lines.append("    accountStatus: 'banned',")

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

# 3. Update App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_content = f.read()

# Add state for filter
if "const [accountFilter, setAccountFilter]" not in app_content:
    app_content = app_content.replace(
        "const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);",
        "const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);\n  const [accountFilter, setAccountFilter] = useState<'all' | 'active' | 'dormant' | 'banned'>('all');"
    )

# Add filter UI
filter_ui = """          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs text-slate-450 leading-relaxed">
            <div className="flex gap-1.5 text-xs font-bold text-slate-300 items-center mb-1 leading-none">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>账号状态机机制 (State Mapping)</span>
            </div>
            点击任意账号，管理其特定的【人设画像、视频库、发布日程、账号中心数据】
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-800/50">
              <button 
                onClick={() => setAccountFilter('all')} 
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >全部</button>
              <button 
                onClick={() => setAccountFilter('active')} 
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >活跃</button>
              <button 
                onClick={() => setAccountFilter('dormant')} 
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'dormant' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >休眠</button>
              <button 
                onClick={() => setAccountFilter('banned')} 
                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${accountFilter === 'banned' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}`}
              >异常</button>
            </div>
          </div>"""

app_content = app_content.replace(
"""          <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs text-slate-450 leading-relaxed">
            <div className="flex gap-1.5 text-xs font-bold text-slate-300 items-center mb-1 leading-none">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>账号状态机机制 (State Mapping)</span>
            </div>
            点击任意账号，管理其特定的【人设画像、视频库、发布日程、账号中心数据】
          </div>""", filter_ui)

# Apply filter to mapping
app_content = app_content.replace(
    "{devices.map(dev => {",
    "{devices.filter(d => accountFilter === 'all' || d.accountStatus === accountFilter).map(dev => {"
)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_content)
print("Updated all files successfully.")
