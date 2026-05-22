const fs = require('fs');

// ─── 1. Fix App.tsx header title wrapping ───────────────────────────────────
{
  let c = fs.readFileSync('src/App.tsx', 'utf-8');
  c = c.replace(
    '<h1 className="text-xs font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none">',
    '<h1 className="text-xs font-bold font-sans tracking-tight text-white flex items-center gap-1.5 leading-none whitespace-nowrap">'
  );
  fs.writeFileSync('src/App.tsx', c, 'utf-8');
  console.log('[1] Fixed App.tsx header title whitespace-nowrap');
}

// ─── Helper: Agent Header block ──────────────────────────────────────────────
function agentHeaderBlock(agentName, agentDesc, color) {
  // color: 'purple' | 'indigo' | 'emerald'
  const colorMap = {
    purple:  { from: 'from-purple-500', to: 'to-indigo-600', shadow: 'shadow-purple-500/20', badge_bg: 'bg-purple-950/50', badge_border: 'border-purple-500/30', badge_text: 'text-purple-400', active_btn: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500', mode_active: 'bg-purple-600' },
    indigo:  { from: 'from-indigo-500', to: 'to-blue-600',   shadow: 'shadow-indigo-500/20', badge_bg: 'bg-indigo-950/50', badge_border: 'border-indigo-500/30', badge_text: 'text-indigo-400', active_btn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500', mode_active: 'bg-indigo-600' },
    emerald: { from: 'from-emerald-500', to: 'to-teal-600',  shadow: 'shadow-emerald-500/20', badge_bg: 'bg-emerald-950/50', badge_border: 'border-emerald-500/30', badge_text: 'text-emerald-400', active_btn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500', mode_active: 'bg-emerald-600' },
  };
  const cl = colorMap[color];
  return `      {/* ─── Agent Control Header ─── */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br ${cl.from} ${cl.to} flex items-center justify-center shadow-lg ${cl.shadow}">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">${agentName}</span>
              {agentActivated
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">● 已激活</span>
                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-500">○ 未激活</span>
              }
            </div>
            <p className="text-xs text-slate-500 mt-0.5">${agentDesc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button onClick={() => setAgentMode('fullAuto')} className={\`px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer \${agentMode === 'fullAuto' ? '${cl.mode_active} text-white shadow' : 'text-slate-400 hover:text-white'}\`}>
              <Zap className="w-3 h-3 inline mr-1" />全权托管
            </button>
            <button onClick={() => setAgentMode('userConfirm')} className={\`px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer \${agentMode === 'userConfirm' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}\`}>
              <Shield className="w-3 h-3 inline mr-1" />用户确认
            </button>
          </div>
          {!agentActivated ? (
            <button onClick={() => { setAgentActivated(true); if (!hasPlanned && !isPlanning) handleSmartPlan(); }} className={\`px-4 py-2 ${cl.active_btn} text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer\`}>
              激活智能体
            </button>
          ) : (
            <button onClick={() => setAgentActivated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer">
              停用
            </button>
          )}
        </div>
      </div>`;
}

// ─── 2. Update WarmupPlanner.tsx ─────────────────────────────────────────────
{
  let c = fs.readFileSync('src/components/WarmupPlanner.tsx', 'utf-8');

  // Add new imports: Zap, Shield
  c = c.replace(
    "import {\n  Calendar, CheckCircle, Play, Sliders, ChevronRight, Terminal,\n  Search, Shield, Heart, Eye, Bookmark, MessageSquare, AlertCircle, HelpCircle, X, Camera, Image as ImageIcon\n} from 'lucide-react';",
    "import {\n  Calendar, CheckCircle, Play, Sliders, ChevronRight, Terminal,\n  Search, Shield, Heart, Eye, Bookmark, MessageSquare, AlertCircle, HelpCircle, X, Camera, Image as ImageIcon, Zap\n} from 'lucide-react';"
  );

  // Add agent state after existing state declarations
  c = c.replace(
    "  const timeoutRef = useRef<NodeJS.Timeout | null>(null);",
    "  const [agentActivated, setAgentActivated] = useState<boolean>(false);\n  const [agentMode, setAgentMode] = useState<'fullAuto' | 'userConfirm'>('fullAuto');\n\n  const timeoutRef = useRef<NodeJS.Timeout | null>(null);"
  );

  // Wrap main return in flex-col and add agent header before existing grid
  c = c.replace(
    "  return (\n    <div className=\"grid grid-cols-1 xl:grid-cols-12",
    `  return (\n    <div className="flex flex-col gap-4 h-full">\n${agentHeaderBlock('社交互动智能体', '激活后自动规划5天养号互动脚本，模拟真人浏览防封号', 'purple')}\n      <div className="grid grid-cols-1 xl:grid-cols-12`
  );

  // Close the extra wrapper div before the last closing div
  // Find the last return closing
  const lastReturnIdx = c.lastIndexOf('  );\n}');
  c = c.slice(0, lastReturnIdx) + '    </div>\n  );\n}';

  // Remove standalone "基于人设智能规划" button in warmup (replace the whole empty state button)
  c = c.replace(
    `                      <button
                        onClick={handleSmartPlan}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
                      >
                        ✨ 基于人设智能规划
                      </button>`,
    `                      <p className="text-xs text-slate-600 text-center">激活上方「社交互动智能体」后自动开始规划</p>`
  );

  fs.writeFileSync('src/components/WarmupPlanner.tsx', c, 'utf-8');
  console.log('[2] Updated WarmupPlanner.tsx');
}

// ─── 3. Update ContentPlanner.tsx ────────────────────────────────────────────
{
  let c = fs.readFileSync('src/components/ContentPlanner.tsx', 'utf-8');

  // Add Zap, Shield imports
  c = c.replace(
    "import {\n  Calendar, Eye, BookOpen, Film, Video, Clipboard,\n  Sparkles, CheckCircle, RefreshCw, Layers, Zap, Info, Play, MessageSquare, ArrowRight, Clock, Tag, Loader2, AlertCircle, List, MousePointer2\n} from 'lucide-react';",
    "import {\n  Calendar, Eye, BookOpen, Film, Video, Clipboard,\n  Sparkles, CheckCircle, RefreshCw, Layers, Zap, Info, Play, MessageSquare, ArrowRight, Clock, Tag, Loader2, AlertCircle, List, MousePointer2, Shield\n} from 'lucide-react';"
  );

  // Add agent state
  c = c.replace(
    "  const currentPlanDay = plans[selectedDayIndex] || plans[0];",
    "  const [agentActivated, setAgentActivated] = useState<boolean>(false);\n  const [agentMode, setAgentMode] = useState<'fullAuto' | 'userConfirm'>('fullAuto');\n\n  const currentPlanDay = plans[selectedDayIndex] || plans[0];"
  );

  // Wrap return
  c = c.replace(
    "  return (\n    <div className=\"grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 h-full min-h-[500px]\">",
    `  return (\n    <div className="flex flex-col gap-4 h-full">\n${agentHeaderBlock('内容生成智能体', '激活后自动规划30天选题内容表，智能分析视频关键帧', 'indigo')}\n      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 text-slate-200 flex-1 min-h-0">`
  );

  const lastReturnIdx = c.lastIndexOf('  );\n}');
  c = c.slice(0, lastReturnIdx) + '    </div>\n  );\n}';

  // Remove standalone button in content planner
  c = c.replace(
    `                <button 
                  onClick={handleSmartPlan}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition-all cursor-pointer"
                >
                  ✨ 基于人设智能规划
                </button>`,
    `                <p className="text-xs text-slate-600 text-center">激活上方「内容生成智能体」后自动开始规划</p>`
  );

  fs.writeFileSync('src/components/ContentPlanner.tsx', c, 'utf-8');
  console.log('[3] Updated ContentPlanner.tsx');
}

// ─── 4. Update PublisherScheduler.tsx ────────────────────────────────────────
{
  let c = fs.readFileSync('src/components/PublisherScheduler.tsx', 'utf-8');

  // Add Zap, Shield imports
  c = c.replace(
    "import { \n  Calendar, CheckCircle, Clock, Plus, Trash2, Video, \n  Send, AlertTriangle, Play, RefreshCw, HelpCircle, Laptop, Smartphone, Check\n} from 'lucide-react';",
    "import { \n  Calendar, CheckCircle, Clock, Plus, Trash2, Video, \n  Send, AlertTriangle, Play, RefreshCw, HelpCircle, Laptop, Smartphone, Check, Zap, Shield\n} from 'lucide-react';"
  );

  // Add agent state after showAutoPostVisualizer
  c = c.replace(
    "  const [showAutoPostVisualizer, setShowAutoPostVisualizer] = useState(false);",
    "  const [showAutoPostVisualizer, setShowAutoPostVisualizer] = useState(false);\n  const [agentActivated, setAgentActivated] = useState<boolean>(false);\n  const [agentMode, setAgentMode] = useState<'fullAuto' | 'userConfirm'>('fullAuto');"
  );

  // Find the return statement and wrap
  const returnIdx = c.indexOf('  return (\n    <div className="flex flex-col');
  if (returnIdx === -1) {
    // Find whatever the main return looks like
    const altIdx = c.indexOf('  return (');
    if (altIdx !== -1) {
      // Find the first div after return
      const divIdx = c.indexOf('<div', altIdx);
      const divEndIdx = c.indexOf('>', divIdx);
      const originalDiv = c.slice(divIdx, divEndIdx + 1);
      
      // Build publisher agent header (no handleSmartPlan in publisher)
      const pubHeader = `      {/* ─── Agent Control Header ─── */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">素材发布智能体</span>
              {agentActivated
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">● 已激活</span>
                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-500">○ 未激活</span>
              }
            </div>
            <p className="text-xs text-slate-500 mt-0.5">激活后自动按排期定时发布视频素材</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button onClick={() => setAgentMode('fullAuto')} className={\`px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer \${agentMode === 'fullAuto' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}\`}>
              <Zap className="w-3 h-3 inline mr-1" />全权托管
            </button>
            <button onClick={() => setAgentMode('userConfirm')} className={\`px-3 py-1 rounded text-[11px] font-bold transition cursor-pointer \${agentMode === 'userConfirm' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}\`}>
              <Shield className="w-3 h-3 inline mr-1" />用户确认
            </button>
          </div>
          {!agentActivated ? (
            <button onClick={() => setAgentActivated(true)} className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg transition shadow-lg cursor-pointer">
              激活智能体
            </button>
          ) : (
            <button onClick={() => setAgentActivated(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer">
              停用
            </button>
          )}
        </div>
      </div>`;

      // Wrap the return
      c = c.replace(
        '  return (\n',
        `  return (\n    <div className="flex flex-col gap-4 h-full">\n${pubHeader}\n      <div className="flex-1 min-h-0 overflow-y-auto">\n`
      );
      
      const lastReturnIdx2 = c.lastIndexOf('  );\n}');
      c = c.slice(0, lastReturnIdx2) + '      </div>\n    </div>\n  );\n}';
    }
  }

  fs.writeFileSync('src/components/PublisherScheduler.tsx', c, 'utf-8');
  console.log('[4] Updated PublisherScheduler.tsx');
}

console.log('\nAll done!');
