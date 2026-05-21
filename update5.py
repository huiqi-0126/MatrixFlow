with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("username: 'cook_with_kai',", "username: 'emma_kitchen_diaries',")
with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated username')
