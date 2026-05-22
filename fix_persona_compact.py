import os

with open('src/components/PersonaManager.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "<DeviceSimulator\n              device={device}\n              persona={persona}\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\n            />",
    "<DeviceSimulator\n              device={device}\n              persona={persona}\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\n              compactMode={true}\n            />"
)

# Handle \r\n just in case
content = content.replace(
    "<DeviceSimulator\r\n              device={device}\r\n              persona={persona}\r\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\r\n            />",
    "<DeviceSimulator\r\n              device={device}\r\n              persona={persona}\r\n              onUpdateDeviceStats={onUpdateDeviceStats || (() => {})}\r\n              compactMode={true}\r\n            />"
)

with open('src/components/PersonaManager.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PersonaManager!")
