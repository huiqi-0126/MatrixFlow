import re

with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Persona for device-1
persona_pattern = r"'device-1': \{[\s\S]*?tone: '.*?',\s*\}"
new_persona = """'device-1': {
    id: 'device-1',
    avatarUrl: '/avatar_ai.png',
    interests: ['Aesthetic Cooking', 'Family Recipes', 'Coffee ASMR', 'Home Baking', 'Kitchen Restock'],
    race: 'Caucasian (Western Housewives)',
    gender: 'Female',
    values: 'Family first, cozy home vibes, aesthetic culinary journey, warm and clean kitchen.',
    niche: 'aesthetic-cooking',
    bio: 'Mom of 2 | Sharing my daily kitchen routines, easy family recipes, and aesthetic coffee rituals. Making home feel like magic. ✨',
    tone: 'Warm, aesthetic, calming, ASMR-focused, family-oriented.',
  }"""

if re.search(persona_pattern, content):
    content = re.sub(persona_pattern, new_persona, content, count=1)
    print("Replaced Persona")

# Replace Content Planner for 'aesthetic-cooking'
plan_pattern = r"'aesthetic-cooking': \[\s*\{\s*day: 1[\s\S]*?\}\s*\]"
new_plan = """'aesthetic-cooking': [
    { day: 1, topic: 'Easy Sunday Morning Pancakes 🥞', direction: 'Fluffy pancakes, pouring syrup in slow motion, warm morning light.', scriptPrompt: 'Create a 15s aesthetic cooking video for Sunday morning pancakes.', suggestedTags: ['#pancakerecipe', '#sundaymorning'] },
    { day: 2, topic: 'Meal Prep: Healthy Lunches', direction: 'Chopping fresh vegetables, organizing glass containers.', scriptPrompt: 'ASMR vegetable chopping and aesthetic lunch prep.', suggestedTags: ['#mealprep', '#healthylunch'] },
    { day: 3, topic: 'Aesthetic Coffee Pour Over', direction: 'Close up of coffee dripping, steam rising, pouring hot water over ground beans.', scriptPrompt: 'Morning coffee routine ASMR with relaxing lo-fi background.', suggestedTags: ['#coffeeroutine', '#asmr'] },
    { day: 4, topic: 'One-Pan Creamy Tuscan Chicken', direction: 'Sizzling chicken, adding cream and spinach, rich colors.', scriptPrompt: 'Quick 20 minute family dinner recipe.', suggestedTags: ['#onepandinner', '#familydinner'] },
    { day: 5, topic: 'Baking Chocolate Chip Cookies', direction: 'Mixing dough, pulling apart a warm gooey cookie.', scriptPrompt: 'Baking cookies on a rainy afternoon with kids.', suggestedTags: ['#baking', '#chocolatechip'] },
    { day: 6, topic: 'Kitchen Pantry Restock ASMR', direction: 'Pouring dry goods into aesthetic glass jars, organizing.', scriptPrompt: 'Satisfying kitchen pantry restock ASMR.', suggestedTags: ['#restock', '#kitchengoals'] }
  ]"""

if re.search(plan_pattern, content):
    content = re.sub(plan_pattern, new_plan, content, count=1)
    print("Replaced Content Planner")

# Replace VIDEO_RESOURCES
video_pattern = r'export const VIDEO_RESOURCES: VideoAsset\[\] = \[\s*\{[\s\S]*?\}\s*\];'
new_video = """export const VIDEO_RESOURCES: VideoAsset[] = [
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
];"""

if re.search(video_pattern, content):
    content = re.sub(video_pattern, new_video, content, count=1)
    print("Replaced Videos")

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
