import re

with open('src/components/PublisherScheduler.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

get_cover_func = '''
  const getCover = (id: string, index: number) => {
    const COVER_IMAGES = [
      'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1526506114642-12f5a6534e70?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=300&h=400',
      'https://images.unsplash.com/photo-1498837167922-41cfa6f310f1?auto=format&fit=crop&q=80&w=300&h=400'
    ];
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COVER_IMAGES[(hash + index) % COVER_IMAGES.length];
  };
'''

content = content.replace('const handleCreateTask = () => {', get_cover_func + '\n  const handleCreateTask = () => {')

content = content.replace('tasks.map(task => {', 'tasks.map((task, index) => {')

# The exact lines to replace
old_thumb = '''<div className={`absolute inset-0 ${asset?.thumbnailColor || 'bg-slate-800'}`} />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30" />'''

new_thumb = '''<img src={getCover(asset?.id || task.id, index)} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <div className={`absolute inset-0 ${asset?.thumbnailColor || 'bg-slate-800'} opacity-30 mix-blend-multiply`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />'''

content = content.replace(old_thumb, new_thumb)

with open('src/components/PublisherScheduler.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done PublisherScheduler')
