import re

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_metrics = """            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="bg-black/30 p-3 rounded border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1 text-[10px]">FOLLOWERS</span>
                <span className="font-bold text-emerald-400 text-lg">{device.followerCount.toLocaleString()}</span>
              </div>
              <div className="bg-black/30 p-3 rounded border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1 text-[10px]">TOTAL VIEWS</span>
                <span className="font-bold text-sky-400 text-lg">{device.totalViews.toLocaleString()}</span>
              </div>
            </div>"""

new_metrics = """            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
              <div className="text-center">
                <span className="font-bold text-slate-200 text-lg block">{Math.floor(device.followerCount * 0.1).toLocaleString()}</span>
                <span className="text-slate-500 text-[10px]">Following</span>
              </div>
              <div className="text-center border-x border-slate-800">
                <span className="font-bold text-slate-200 text-lg block">{device.followerCount.toLocaleString()}</span>
                <span className="text-slate-500 text-[10px]">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold text-slate-200 text-lg block">{Math.floor(device.totalViews / 5).toLocaleString()}</span>
                <span className="text-slate-500 text-[10px]">Likes</span>
              </div>
            </div>

            {/* Video Grid */}
            <div className="mt-4 border-t border-slate-800 pt-4">
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-slate-800 relative group cursor-pointer overflow-hidden">
                    <img src={`/1 (${(i % 8) + 1}).png`} alt="Video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                      <Play className="w-3 h-3 text-white" />
                      <span className="text-white text-[10px] font-bold drop-shadow-md">
                        {Math.floor(device.followerCount * 0.5 + i * 200).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>"""

content = content.replace(old_metrics, new_metrics)

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
