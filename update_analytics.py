import re
with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add VideoAsset prop
content = content.replace('import { Device } from \'../types\';', 'import { Device, VideoAsset } from \'../types\';\nimport SharedVideoList from \'./SharedVideoList\';')
content = content.replace('interface AnalyticsAdvisorProps {', 'interface AnalyticsAdvisorProps {\n  videoAssets: VideoAsset[];')
content = content.replace('export default function AnalyticsAdvisor({ device }: AnalyticsAdvisorProps) {', 'export default function AnalyticsAdvisor({ device, videoAssets }: AnalyticsAdvisorProps) {')

# Wrap return with Flex layout
regex = r'return \(\n    <div className="flex flex-col h-full">'
replacement = '''return (
    <div className="flex gap-6 h-full min-h-[500px]">
      <SharedVideoList videoAssets={videoAssets} />
      <div className="flex-1 flex flex-col h-full min-w-0">'''
content = re.sub(regex, replacement, content)

# Add closing div
content = content.replace('    </div>\n  );\n}', '      </div>\n    </div>\n  );\n}')

with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('AnalyticsAdvisor updated')
