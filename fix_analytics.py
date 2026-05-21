import re

with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix line thickness
content = content.replace('strokeWidth="1.2"', 'strokeWidth="2" vectorEffect="non-scaling-stroke"')

# 2. Fix video list to use videoAssets and mock stats
# Replace stats.topVideos.map with videoAssets.map
content = content.replace('stats.topVideos.map((vd, i) => {', '''videoAssets.map((asset, i) => {
            const vd = {
              title: asset.title,
              views: 12000 - i * 1500 + Math.floor(Math.random() * 500),
              likes: 1200 - i * 100 + Math.floor(Math.random() * 50),
              comments: 80 - i * 5,
              shares: 40 - i * 2,
              retentionRate: 0.45 - i * 0.02,
              fypFraction: 0.92 - i * 0.03
            };''')

# We also need to fix `vd.title` because `asset.title` might not exist on `vd` if I didn't mock it, but I did.
# But wait, in the original code, the first arg of `map` was `vd`. Now it is `asset`.
# Let's make sure there are no other references to `vd` that break.
# In my replacement, I created a local `vd` object with all the required properties so the rest of the code works as is!

with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
