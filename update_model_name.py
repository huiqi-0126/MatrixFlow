import re

with open('src/components/ContentPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
state_regex = r'const \[isGeneratingVideo, setIsGeneratingVideo\] = useState\(false\);'
state_replacement = '''const [selectedModel, setSelectedModel] = useState('PixVerse V6');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);'''
content = re.sub(state_regex, state_replacement, content)

# Change handleGenerateVideo message
msg_regex = r'"连接 PixVerse V6 模型节点\.\.\.",'
msg_replacement = '`连接 ${selectedModel} 模型节点...`,'
content = re.sub(msg_regex, msg_replacement, content)

# Change select element
select_regex = r'<select className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs py-2\.5 pl-3 pr-8 rounded-lg transition-colors focus:outline-none focus:border-indigo-500 shadow-inner">'
select_replacement = '<select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs py-2.5 pl-3 pr-8 rounded-lg transition-colors focus:outline-none focus:border-indigo-500 shadow-inner">'
content = re.sub(select_regex, select_replacement, content)

# Update options to use string labels as values instead of dashed ids so that the UI string prints nicely:
content = content.replace('<option value="pixverse-v6">PixVerse V6</option>', '<option value="PixVerse V6">PixVerse V6</option>')
content = content.replace('<option value="pixverse-v5.6">PixVerse V5.6</option>', '<option value="PixVerse V5.6">PixVerse V5.6</option>')
content = content.replace('<option value="veo-3.1-standard">veo-3.1-standard</option>', '<option value="veo-3.1-standard">veo-3.1-standard</option>')
content = content.replace('<option value="grok-imagine">grok-imagine</option>', '<option value="grok-imagine">grok-imagine</option>')
content = content.replace('<option value="sora-2-pro">sora-2-pro</option>', '<option value="sora-2-pro">sora-2-pro</option>')
content = content.replace('<option value="seedance-2.0-standard">Seedance 2.0 standard</option>', '<option value="Seedance 2.0 standard">Seedance 2.0 standard</option>')
content = content.replace('<option value="seedance-2.0-fast">Seedance 2.0 fast</option>', '<option value="Seedance 2.0 fast">Seedance 2.0 fast</option>')
content = content.replace('<option value="pixverse-c1">PixVerse C1</option>', '<option value="PixVerse C1">PixVerse C1</option>')

with open('src/components/ContentPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated ContentPlanner.tsx modal dynamic model name')
