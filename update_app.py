import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the simulation tab
content = content.replace("{ id: 'simulation', label: '🖥️ 远程控制', desc: '截图及视觉AI诊断' },", "")

# Add onUpdateDeviceStats to PersonaManager
content = content.replace(
"""              <PersonaManager
                device={activeDevice}
                persona={activePersona}
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />""",
"""              <PersonaManager
                device={activeDevice}
                persona={activePersona}
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />""")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.tsx")
