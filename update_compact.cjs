const fs = require('fs');

let content = fs.readFileSync('src/components/DeviceSimulator.tsx', 'utf-8');

// Update props interface
content = content.replace(
  '  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\n}',
  '  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\n  compactMode?: boolean;\n}'
);

// Update destructuring
content = content.replace(
  'export default function DeviceSimulator({ device, persona, onUpdateDeviceStats }: DeviceSimulatorProps) {',
  'export default function DeviceSimulator({ device, persona, onUpdateDeviceStats, compactMode = false }: DeviceSimulatorProps) {'
);

// Update grid container
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">',
  '<div className={compactMode ? "flex justify-center h-full w-full max-h-[85vh] overflow-y-auto" : "grid grid-cols-1 lg:grid-cols-12 gap-4"}>'
);

// Hide left panel
content = content.replace(
  '{/* ==================== 1. LEFT PANEL: Full Device Metadata (5 Columns) ==================== */}',
  '{/* ==================== 1. LEFT PANEL: Full Device Metadata (5 Columns) ==================== */}\n        {!compactMode && ('
);

content = content.replace(
  '        {/* ==================== 2. RIGHT PANEL: Interactive Screen Casting & Core Controls (7 Columns) ==================== */}',
  '        )}\n\n        {/* ==================== 2. RIGHT PANEL: Interactive Screen Casting & Core Controls (7 Columns) ==================== */}'
);

// Update right panel classes
content = content.replace(
  '<div className="lg:col-span-7 bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col items-center bento-glow-indigo">',
  '<div className={`${compactMode ? "w-full max-w-[600px] mx-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] border-slate-700/50" : "lg:col-span-7"} bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col items-center bento-glow-indigo`}>'
);

fs.writeFileSync('src/components/DeviceSimulator.tsx', content, 'utf-8');

// Update PersonaManager.tsx to pass compactMode={true}
let pmContent = fs.readFileSync('src/components/PersonaManager.tsx', 'utf-8');
pmContent = pmContent.replace(
  '<DeviceSimulator\n              device={device}\n              persona={persona}\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\n            />',
  '<DeviceSimulator\n              device={device}\n              persona={persona}\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\n              compactMode={true}\n            />'
);
fs.writeFileSync('src/components/PersonaManager.tsx', pmContent, 'utf-8');

console.log('Update complete!');
