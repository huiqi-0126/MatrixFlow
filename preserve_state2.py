import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    tab_name = match.group(1)
    component = match.group(2)
    return f"<div className={{activeTab === '{tab_name}' ? 'block h-full' : 'hidden'}}>\n              <{component}\n            </div>"

# The pattern looks for:
# {activeTab === 'xxx' && (
#   <Component
#     prop={value}
#     ...
#   />
# )}
pattern = r"\{activeTab === '([^']+)' && \(\s*<([A-Za-z]+[^>]+/>)\s*\)\}"
new_content = re.sub(pattern, replacer, content)

if new_content == content:
    print("No changes made. Pattern might be wrong.")
else:
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced!")
