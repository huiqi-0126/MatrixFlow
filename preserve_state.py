import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace conditionally rendered components with hidden ones
# For each {activeTab === 'xxx' && ( <Component ... /> )} we will change it to
# <div className={activeTab === 'xxx' ? 'block h-full' : 'hidden'}> <Component ... /> </div>

replacements = [
    ("simulation", "DeviceSimulator", "device={activeDevice}\n                persona={activePersona}\n                onUpdateDeviceStats={handleUpdateDeviceStats}"),
    ("persona", "PersonaManager", "device={activeDevice}\n                persona={activePersona}\n                videoAssets={videoAssets}\n                onUpdatePersona={handleUpdatePersona}\n                onAddVideoAsset={handleAddVideoAsset}\n                onDeleteVideoAsset={handleDeleteVideoAsset}"),
    ("warmup", "WarmupPlanner", "device={activeDevice}\n                onUpdateDeviceStats={handleUpdateDeviceStats}"),
    ("content", "ContentPlanner", "device={activeDevice}\n                onAddRecreatedVideo={handleAddVideoAsset}"),
    ("assets", "AssetManager", "device={activeDevice}\n                videoAssets={videoAssets}\n                onAddVideoAsset={handleAddVideoAsset}\n                onDeleteVideoAsset={handleDeleteVideoAsset}"),
    ("scheduler", "PublisherScheduler", "device={activeDevice}\n                videoAssets={videoAssets}\n                tasks={tasks}\n                onAddTask={handleAddTask}\n                onDeleteTask={handleDeleteTask}\n                onUpdateTaskStatus={handleUpdateTaskStatus}\n                onUpdateDeviceStats={handleUpdateDeviceStats}"),
    ("analytics", "AnalyticsAdvisor", "device={activeDevice}")
]

old_block = """          {/* 4. Tab views dispatcher block */}
          <div className="flex-1 min-h-[500px]">
            {activeTab === 'simulation' && (
              <DeviceSimulator
                device={activeDevice}
                persona={activePersona}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'persona' && (
              <PersonaManager
                device={activeDevice}
                persona={activePersona}
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            )}
            {activeTab === 'warmup' && (
              <WarmupPlanner
                device={activeDevice}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'content' && (
              <ContentPlanner
                device={activeDevice}
                onAddRecreatedVideo={handleAddVideoAsset}
              />
            )}
            {activeTab === 'assets' && (
              <AssetManager
                device={activeDevice}
                videoAssets={videoAssets}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            )}
            {activeTab === 'scheduler' && (
              <PublisherScheduler
                device={activeDevice}
                videoAssets={videoAssets}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            )}
            {activeTab === 'analytics' && (
              <AnalyticsAdvisor
                device={activeDevice}
              />
            )}
          </div>"""

new_block = """          {/* 4. Tab views dispatcher block */}
          <div className="flex-1 min-h-[500px]">
            <div className={activeTab === 'simulation' ? 'block h-full' : 'hidden'}>
              <DeviceSimulator
                device={activeDevice}
                persona={activePersona}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'persona' ? 'block h-full' : 'hidden'}>
              <PersonaManager
                device={activeDevice}
                persona={activePersona}
                videoAssets={videoAssets}
                onUpdatePersona={handleUpdatePersona}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            </div>
            <div className={activeTab === 'warmup' ? 'block h-full' : 'hidden'}>
              <WarmupPlanner
                device={activeDevice}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'content' ? 'block h-full' : 'hidden'}>
              <ContentPlanner
                device={activeDevice}
                onAddRecreatedVideo={handleAddVideoAsset}
              />
            </div>
            <div className={activeTab === 'assets' ? 'block h-full' : 'hidden'}>
              <AssetManager
                device={activeDevice}
                videoAssets={videoAssets}
                onAddVideoAsset={handleAddVideoAsset}
                onDeleteVideoAsset={handleDeleteVideoAsset}
              />
            </div>
            <div className={activeTab === 'scheduler' ? 'block h-full' : 'hidden'}>
              <PublisherScheduler
                device={activeDevice}
                videoAssets={videoAssets}
                tasks={tasks}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />
            </div>
            <div className={activeTab === 'analytics' ? 'block h-full' : 'hidden'}>
              <AnalyticsAdvisor
                device={activeDevice}
              />
            </div>
          </div>"""

content = content.replace(old_block, new_block)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
