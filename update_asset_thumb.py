import re

with open('src/components/AssetManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the map wrapper so index is available
content = content.replace('videoAssets.map(asset => (', 'videoAssets.map((asset, index) => (')

# The exact lines to replace
old_thumb = '''<div className={`w-24 h-32 rounded-lg ${asset.thumbnailColor} border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center`}>'''

new_thumb = '''<div className={`w-24 h-32 rounded-lg bg-slate-900 border border-white/10 shrink-0 relative overflow-hidden flex items-center justify-center`}>
                  <img src={getCover(asset.id, index)} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className={`absolute inset-0 ${asset.thumbnailColor} opacity-30 mix-blend-multiply`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>'''

content = content.replace(old_thumb, new_thumb)

with open('src/components/AssetManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done AssetManager thumbnails')
