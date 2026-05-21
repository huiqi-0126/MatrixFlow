import re

with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Persona
persona_pattern = r"'device-1': \{[\s\S]*?targetAudience: \[.*?\]\s*\}"
new_persona = """'device-1': {
    name: 'Emma Kitchen Diaries',
    age: 32,
    gender: 'Female',
    location: 'New York, US',
    bio: 'Mom of 2 | Sharing my daily kitchen routines, easy family recipes, and aesthetic coffee rituals. Making home feel like magic. ✨',
    interests: ['Aesthetic Cooking', 'Family Recipes', 'Coffee ASMR', 'Home Baking'],
    contentStyle: 'Warm, aesthetic, calming, ASMR-focused, family-oriented',
    postingTimes: ['07:30', '11:30', '17:00'],
    targetAudience: ['Moms', 'Foodies', 'ASMR lovers', 'Home cooks']
  }"""

if re.search(persona_pattern, content):
    content = re.sub(persona_pattern, new_persona, content, count=1)
else:
    print('Failed to match persona')

# 2. Update Video Resources
video_resources_pattern = r'export const VIDEO_RESOURCES: VideoAsset\[\] = \[(.*?)\];'
new_videos = """
  {
    id: 'res-1',
    title: 'Easy Sunday Morning Pancakes 🥞✨',
    duration: 35,
    size: '15.2 MB',
    format: 'MP4',
    status: 'ready',
    thumbnailColor: 'bg-orange-900',
    tags: ['#pancakerecipe', '#sundaymorning', '#momlife', '#asmrcooking'],
    script: 'Sunday mornings are for fluffy pancakes and hot coffee. Here is my secret family recipe that never fails. Mix the dry ingredients, add vanilla extract...'
  },
  {
    id: 'res-2',
    title: 'Meal Prep: 5 Days of Healthy Lunches 🥗',
    duration: 45,
    size: '22.1 MB',
    format: 'MP4',
    status: 'ready',
    thumbnailColor: 'bg-emerald-900',
    tags: ['#mealprep', '#healthylunch', '#kitchenhacks', '#momhack'],
    script: 'Let us get ready for the week! Chopping veggies on Sunday saves me hours during busy weekdays. I love storing these in glass containers.'
  },
  {
    id: 'res-3',
    title: 'Aesthetic Coffee Pour Over ASMR ☕',
    duration: 25,
    size: '12.4 MB',
    format: 'MP4',
    status: 'processing',
    thumbnailColor: 'bg-amber-900',
    tags: ['#coffeeroutine', '#pourover', '#morningvibes', '#asmr'],
    script: '[Sound of beans grinding] The best part of my morning. Freshly ground beans, hot water, and 5 minutes of total silence before the kids wake up.'
  },
  {
    id: 'res-4',
    title: 'One-Pan Creamy Tuscan Chicken 🍗',
    duration: 55,
    size: '28.5 MB',
    format: 'MP4',
    status: 'ready',
    thumbnailColor: 'bg-red-900',
    tags: ['#onepandinner', '#familydinner', '#tuscanchicken', '#easyrecipe'],
    script: 'Busy weeknight? This one-pan Tuscan chicken takes only 20 minutes and tastes like a restaurant meal. Sun-dried tomatoes and spinach make the perfect sauce.'
  },
  {
    id: 'res-5',
    title: 'Baking Chocolate Chip Cookies with Kids 🍪',
    duration: 40,
    size: '18.9 MB',
    format: 'MP4',
    status: 'ready',
    thumbnailColor: 'bg-yellow-900',
    tags: ['#bakingwithkids', '#chocolatechip', '#baking', '#familytime'],
    script: 'Rainy days mean baking day! The secret to perfect chewy cookies is browning the butter first. Look at that dough!'
  },
  {
    id: 'res-6',
    title: 'Restocking My Kitchen Pantry ASMR 🥫',
    duration: 30,
    size: '16.7 MB',
    format: 'MP4',
    status: 'failed',
    thumbnailColor: 'bg-blue-900',
    tags: ['#restock', '#pantryorganization', '#asmrrestock', '#kitchengoals'],
    script: '[Tapping on glass jars] Time to refill the pasta and cereal. Organizing my pantry is my favorite kind of therapy.'
  }
"""
if re.search(video_resources_pattern, content, re.DOTALL):
    content = re.sub(video_resources_pattern, f'export const VIDEO_RESOURCES: VideoAsset[] = [{new_videos}];', content, flags=re.DOTALL, count=1)
else:
    print('Failed to match video resources')

# 3. Update Content Planner for device-1
plan_pattern = r"'device-1': \[\s*\{\s*date: '2024-05-01'[\s\S]*?\]"
new_plan = """'device-1': [
    {
      date: '2024-05-01',
      tasks: [
        { id: '1', title: 'Post: Easy Sunday Pancakes', type: 'post', time: '07:30', status: 'completed' },
        { id: '2', title: 'Engage with #momlife tag', type: 'engage', time: '11:00', status: 'completed' },
        { id: '3', title: 'Reply to comments (30m)', type: 'reply', time: '18:00', status: 'pending' }
      ]
    },
    {
      date: '2024-05-02',
      tasks: [
        { id: '4', title: 'Post: Meal Prep Monday', type: 'post', time: '11:30', status: 'completed' },
        { id: '5', title: 'Watch competitor cooking videos', type: 'watch', time: '14:00', status: 'pending' },
        { id: '6', title: 'Like comments from yesterday', type: 'engage', time: '20:00', status: 'pending' }
      ]
    },
    {
      date: '2024-05-03',
      tasks: [
        { id: '7', title: 'Post: Coffee Pour Over ASMR', type: 'post', time: '07:30', status: 'pending' },
        { id: '8', title: 'Engage with #asmrcooking', type: 'engage', time: '15:00', status: 'pending' }
      ]
    }
  ]"""
if re.search(plan_pattern, content):
    content = re.sub(plan_pattern, new_plan, content, count=1)
else:
    print('Failed to match plan')

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated constants.ts')
