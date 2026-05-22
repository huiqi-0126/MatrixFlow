import re
with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

count = 1
def replace_avatar(match):
    global count
    res = f"avatarUrl: '/avatar ({count}).png',"
    count = count + 1
    if count > 10:
        count = 1
    return res

content = re.sub(r"avatarUrl:\s*'[^']+',", replace_avatar, content)

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
