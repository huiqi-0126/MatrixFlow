with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("avatarUrl: '/avatar_ai.png',", "avatarUrl: '/a001.jpg',")

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
