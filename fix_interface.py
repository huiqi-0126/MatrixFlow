import os

with open('src/components/DeviceSimulator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = "interface DeviceSimulatorProps {\n  device: Device;\n  persona: Persona;\n  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\n}"
replacement = "interface DeviceSimulatorProps {\n  device: Device;\n  persona: Persona;\n  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\n  compactMode?: boolean;\n}"

target_crlf = "interface DeviceSimulatorProps {\r\n  device: Device;\r\n  persona: Persona;\r\n  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\r\n}"
replacement_crlf = "interface DeviceSimulatorProps {\r\n  device: Device;\r\n  persona: Persona;\r\n  onUpdateDeviceStats: (deviceId: string, stats: { viewsAdd: number; followersAdd: number; videoAdd?: boolean }) => void;\r\n  compactMode?: boolean;\r\n}"

content = content.replace(target, replacement)
content = content.replace(target_crlf, replacement_crlf)

with open('src/components/DeviceSimulator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added compactMode to DeviceSimulatorProps!")
