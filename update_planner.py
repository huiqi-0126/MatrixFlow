import re

with open('src/components/ContentPlanner.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert State variables
state_injection = '''
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setGenerationComplete(false);
    
    const messages = [
      "连接 PixVerse V6 模型节点...",
      "加载分镜帧与音频提示词...",
      "正在进行深度场景渲染...",
      "应用风格化光影滤镜...",
      "生成 1080P 高清视频流...",
      "合并 Lo-Fi Chill Hop 音频轨...",
      "最后校验视频质量..."
    ];
    
    let step = 0;
    setGenerationMsg(messages[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step >= messages.length) {
        clearInterval(interval);
        setGenerationComplete(true);
      } else {
        setGenerationMsg(messages[step]);
      }
    }, 25000); // about 3 mins total
  };
'''

content = content.replace('const handleAnalyzeVideo = () => {', state_injection + '\n  const handleAnalyzeVideo = () => {')

# 2. Replace Interactive buttons
buttons_regex = r'\{/\* Interactive buttons \*/\}.*?(?=</div\>\n          \) :\()'
buttons_replacement = '''{/* Interactive buttons */}
              <div className="flex flex-col xl:flex-row items-center gap-4 pt-4 mt-2 border-t border-slate-800/50">
                
                {/* 视频模型选择 & 生成视频按钮 */}
                <div className="flex items-center gap-3 w-full">
                  <div className="relative flex-1">
                    <select className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs py-2.5 pl-3 pr-8 rounded-lg transition-colors focus:outline-none focus:border-indigo-500 shadow-inner">
                      <option value="pixverse-v6">PixVerse V6</option>
                      <option value="pixverse-v5.6">PixVerse V5.6</option>
                      <option value="veo-3.1-standard">veo-3.1-standard</option>
                      <option value="grok-imagine">grok-imagine</option>
                      <option value="sora-2-pro">sora-2-pro</option>
                      <option value="seedance-2.0-standard">Seedance 2.0 standard</option>
                      <option value="seedance-2.0-fast">Seedance 2.0 fast</option>
                      <option value="pixverse-c1">PixVerse C1</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateVideo}
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 font-bold text-white text-xs rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 shrink-0 whitespace-nowrap"
                  >
                    <Film className="w-4 h-4" /> 生成视频
                  </button>
                </div>

              </div>
            </div>'''
content = re.sub(buttons_regex, buttons_replacement, content, flags=re.DOTALL)


# 3. Add Modal at the end
modal_html = '''
      {/* Video Generation Modal */}
      {isGeneratingVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            
            <button 
              onClick={() => setIsGeneratingVideo(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white z-10"
            >
              ✕
            </button>

            {!generationComplete ? (
              <div className="flex flex-col items-center justify-center text-center z-10">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                <h3 className="text-lg font-bold text-slate-200 mb-2">正在通过云端大模型渲染视频</h3>
                <p 
                  onClick={() => setGenerationComplete(true)} 
                  className="text-xs text-indigo-400 font-mono cursor-pointer hover:text-indigo-300 transition-colors"
                  title="点击文字可跳过3分钟等待直接查看结果"
                >
                  {generationMsg}
                </p>
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 left-0 bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 max-w-xs">
                  预计渲染时间: 约 3 分钟。您可以将其放入后台运行。
                </p>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center z-10 animate-fade-in">
                <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> 视频生成完毕
                </h3>
                <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-black aspect-[9/16]">
                  <video 
                    src="/tk2.mp4" 
                    controls 
                    autoPlay 
                    loop
                    className="w-full h-full object-cover"
                  ></video>
                </div>
                <button 
                  onClick={() => {
                    setIsGeneratingVideo(false);
                    onAddRecreatedVideo({
                      id: `V-REP-${Math.floor(Math.random() * 1000)}`,
                      title: 'Matcha Latte Aesthetic Vlog (Replicated)',
                      duration: 15,
                      tags: ['#matcha', '#aesthetic'],
                      niche: device.niche,
                      script: analysisReport?.recreateBlueprint?.captionSuggest || '',
                      thumbnailColor: 'bg-indigo-900',
                      tagline: 'Generated by PixVerse V6'
                    });
                    alert('已自动将视频保存至人设资源库！');
                  }}
                  className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition active:scale-95 flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  收录该视频至资源库
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
'''

content = content.replace('</div>\n    </div>\n  );\n}', '</div>\n' + modal_html + '\n    </div>\n  );\n}')

with open('src/components/ContentPlanner.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
