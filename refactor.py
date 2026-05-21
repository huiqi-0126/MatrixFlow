import re

def update_app():
    with open('src/App.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    # Replace '账号效能' with '数据分析'
    content = content.replace('账号效能', '数据分析')
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def update_asset_manager():
    with open('src/components/AssetManager.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Import SharedVideoList
    if 'SharedVideoList' not in content:
        content = content.replace("import { VideoAsset, Device } from '../types';", "import { VideoAsset, Device } from '../types';\nimport SharedVideoList from './SharedVideoList';")
    
    # Replace the left panel with SharedVideoList
    regex = r'<!-- Left Panel: Asset List -->.*?(?=<!-- Right Panel)'
    # Actually we don't have HTML comments like that, but we have:
    # {/* Left Panel: Asset List */} ... {/* Right Panel: API Generation Playground */}
    regex = r'\{\/\* Left Panel: Asset List \*\/\}.*?(?=\{\/\* Right Panel: API Generation Playground \*\/\})'
    
    replacement = '''{/* Left Panel: Asset List */}
      <SharedVideoList videoAssets={videoAssets} onDeleteVideoAsset={onDeleteVideoAsset} />\n\n      '''
    
    content = re.sub(regex, replacement, content, flags=re.DOTALL)
    
    with open('src/components/AssetManager.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def update_scheduler():
    with open('src/components/PublisherScheduler.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'SharedVideoList' not in content:
        content = content.replace("import { ScheduleTask, VideoAsset, Device } from '../types';", "import { ScheduleTask, VideoAsset, Device } from '../types';\nimport SharedVideoList from './SharedVideoList';")
    
    # Wrap the content in a flex container to show SharedVideoList on the left
    # In PublisherScheduler:
    # return (
    #   <div className="flex flex-col text-left space-y-4 text-slate-200 h-full min-h-[500px]">
    regex = r'return \(\n    <div className="flex flex-col text-left space-y-4 text-slate-200 h-full min-h-\[500px\]">'
    replacement = '''return (
    <div className="flex gap-6 h-full min-h-[500px]">
      {/* Left panel */}
      <SharedVideoList videoAssets={videoAssets} />
      
      {/* Right panel */}
      <div className="flex-1 flex flex-col text-left space-y-4 text-slate-200 min-w-0">'''
    
    content = re.sub(regex, replacement, content)
    
    # Add closing div before the last closing tag
    # The last 4 lines are usually:
    #     </div>
    #   );
    # }
    content = content.replace('    </div>\n  );\n}', '      </div>\n    </div>\n  );\n}')
    
    with open('src/components/PublisherScheduler.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def update_analytics():
    with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'SharedVideoList' not in content:
        # Analytics doesn't have videoAssets prop... 
        pass
    
update_app()
update_asset_manager()
update_scheduler()
print('Refactored app, asset manager, and scheduler!')
