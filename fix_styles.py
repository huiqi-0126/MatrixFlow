import glob

files = glob.glob('src/components/*.tsx') + ['src/App.tsx']
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('text-base', 'text-xs')
    content = content.replace('mb-6.5', 'mb-2')
    content = content.replace('mb-6', 'mb-2')
    content = content.replace('mt-6.5', 'mt-3')
    content = content.replace('mt-6', 'mt-3')
    content = content.replace('p-6.5', 'p-3')
    content = content.replace('p-6 ', 'p-4 ')
    content = content.replace('p-6"', 'p-4"')
    content = content.replace('gap-8', 'gap-4')
    content = content.replace('space-y-6', 'space-y-4')
    content = content.replace('space-y-5.5', 'space-y-3')
    
    content = content.replace('p-4 text-slate-550', 'p-2 text-slate-550')
    content = content.replace('w-14 h-14', 'w-10 h-10')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
