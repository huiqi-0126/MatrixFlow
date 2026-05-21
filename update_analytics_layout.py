import re

with open('src/components/AnalyticsAdvisor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

panel1_match = re.search(r'(<div className="xl:col-span-7 .*?)(?=      \{\/\* 2\. Right Panel)', content, re.DOTALL)
panel1 = panel1_match.group(1) if panel1_match else ''

panel2_match = re.search(r'(      \{\/\* 2\. Right Panel.*?)(?=\n    <\/div>\n  \);\n\})', content, re.DOTALL)
panel2 = panel2_match.group(1) if panel2_match else ''

if not panel1 or not panel2:
    print('Failed to extract panels')
else:
    # Remove xl:col-span-* and flex-col h-full justify-between from panel2
    panel1_new = panel1.replace('xl:col-span-7 ', '')
    panel2_new = panel2.replace('xl:col-span-5 ', '').replace(' h-full justify-between', '')
    
    # We want panel2 on top, panel1 on bottom
    new_wrapper = '<div className="flex flex-col gap-6 text-slate-200 text-left">\n' + panel2_new + '\n' + panel1_new + '\n    </div>\n  );\n}'
    
    # Replace everything from the return statement down
    prefix = content[:content.find('<div className="grid grid-cols-1 xl:grid-cols-12')]
    
    with open('src/components/AnalyticsAdvisor.tsx', 'w', encoding='utf-8') as f:
        f.write(prefix + new_wrapper)
    print('Layout updated successfully')
