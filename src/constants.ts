import { Device, Persona, WarmupPlan, VideoAsset, DailyPlan, CreatorStats } from './types';

export const NICHES = [
  { id: 'aesthetic-cooking', label: '美食 ASMR / Aesthetic Cooking', description: 'ASMR 风格烹饪、精致摆盘、咖啡拉花、美学厨房', tag: '#aestheticcooking #asmrcooking' },
  { id: 'fitness', label: '健身运动 / Fitness & Wellness', description: '健身房打卡、高效训练、身心活力、减脂餐制作', tag: '#fitnessgoals #workoutmotivation' },
  { id: 'streetwear', label: '街头穿搭 / Streetwear Fashion', description: 'OOTD 穿搭、小众潮流鞋履、欧美高街与复古美学', tag: '#streetwear #ootdinspo' },
  { id: 'tech-gadgets', label: '数码科技 / Tech & Gadgets', description: '科技新品开箱、极简桌面搭建、AI 工具、未来生活方式', tag: '#techunboxing #desksetup' },
  { id: 'luxury', label: '奢华生活 / Luxury Lifestyle', description: '豪车超跑、奢侈单品开箱、五星级酒店旅行体验、精英日常', tag: '#luxurylifestyle #billionairelife' },
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'device-1',
    name: 'iPhone 8 Plus #01',
    ip: '192.241.130.42',
    region: '美国纽约 (US-NY-Residential)',
    platform: 'TikTok',
    username: 'cook_with_kai',
    avatarColor: 'from-amber-400 to-orange-500',
    status: 'idle',
    niche: 'aesthetic-cooking',
    followerCount: 2430,
    videoCount: 12,
    totalViews: 45800,
  },
  {
    id: 'device-2',
    name: 'iPhone 8 #02',
    ip: '198.51.100.175',
    region: '美国洛杉矶 (US-LA-Residential)',
    platform: 'TikTok',
    username: 'fit_goddess_o',
    avatarColor: 'from-blue-400 to-indigo-500',
    status: 'warmup',
    niche: 'fitness',
    followerCount: 15800,
    videoCount: 28,
    totalViews: 324100,
  },
  {
    id: 'device-3',
    name: 'iPhone 8 Plus #03',
    ip: '64.233.160.78',
    region: '美国迈阿密 (US-MIA-Residential)',
    platform: 'Instagram',
    username: 'streetwear_kai',
    avatarColor: 'from-red-400 to-pink-500',
    status: 'idle',
    niche: 'streetwear',
    followerCount: 340,
    videoCount: 3,
    totalViews: 1250,
  },
  {
    id: 'device-4',
    name: 'iPhone 8 #04',
    ip: '104.244.42.1',
    region: '中国香港代理 (HK-Mobile-Static)',
    platform: 'YouTube',
    username: 'tech_unboxed_vibe',
    avatarColor: 'from-emerald-400 to-teal-500',
    status: 'posting',
    niche: 'tech-gadgets',
    followerCount: 8900,
    videoCount: 19,
    totalViews: 90420,
  },
];

export const INITIAL_PERSONAS: Record<string, Persona> = {
  'device-1': {
    id: 'device-1',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    interests: ['ASMR Sounds', 'Matcha Recipes', 'Minimalist Kitchenware', 'Baking Slimes', 'Specialty Coffee'],
    race: 'Asian-American (亚裔偏好)',
    gender: 'Male',
    values: 'Eco-friendly, aesthetic design, slow living, meditative culinary journey.',
    niche: 'aesthetic-cooking',
    bio: 'Finding peace in boiling tea and grinding beans. Simple recipes for complex souls.',
    tone: 'Soft, whispering, cozy, serene.',
  },
  'device-2': {
    id: 'device-2',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    interests: ['HIIT Routines', 'Aesthetic Gym Outfits', 'Healthy Meal Prep', 'Gym Humor', 'Self-care Journaling'],
    race: 'Latina (拉丁裔偏好)',
    gender: 'Female',
    values: 'Body positivity, consistent discipline, high energy workout aesthetics, empowerment.',
    niche: 'fitness',
    bio: 'Your gym bestie. 🧘‍♀️ Sweat now, glow later. Daily wellness & high-impact aesthetics.',
    tone: 'Energetic, motivational, authentic, direct.',
  },
  'device-3': {
    id: 'device-3',
    avatarUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face',
    interests: ['Vintage Sneakers', 'OOTD Transition clips', 'Hip Hop Underground', 'Tokyo Street Culture'],
    race: 'African-American (非裔潮流偏好)',
    gender: 'Male',
    values: 'Originality, rebellion, thrift shop sustainability, raw city beats.',
    niche: 'streetwear',
    bio: 'Archiving street couture and rare sneakers. Vintage is the future.',
    tone: 'Chill, effortless, slang-casual, underground.',
  },
  'device-4': {
    id: 'device-4',
    avatarUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100&h=100&fit=crop&crop=face',
    interests: ['Mechanical Keyboards', 'Desk Tour Reils', 'Indie Hacking', 'Futuristic Tech', 'Cyberpunk Aesthetics'],
    race: 'Caucasian (欧美极客偏好)',
    gender: 'Male',
    values: 'Productivity hacking, clean hardware configurations, minimalist future tech.',
    niche: 'tech-gadgets',
    bio: 'Unboxing the future. Clean setups & satisfying tech clicking sounds. Let\'s automate.',
    tone: 'Crisp, structured, high-tech, informational.',
  },
};

export const DEFAULT_WARMUP_PLANS: WarmupPlan[] = [
  {
    day: 1,
    title: '第一天：细分领域探索与基础贴标',
    actions: [
      { type: 'search', param: 'Aesthetic Coffee Making', duration: 40 },
      { type: 'scroll', param: 'For You Page (Niche Relevant)', duration: 180 },
      { type: 'bookmark', param: 'High action rate cooking video', duration: 10 },
      { type: 'scroll', param: 'Competitor Feed', duration: 120 },
    ],
  },
  {
    day: 2,
    title: '第二天：互动习惯培养 (双击点赞流)',
    actions: [
      { type: 'scroll', param: 'For You Page', duration: 240 },
      { type: 'like', param: 'Like 3 target videos matching niche', duration: 15 },
      { type: 'profile', param: 'Visit creator account @asmr_baking', duration: 80 },
      { type: 'bookmark', param: 'Bookmark a 1M+ views video', duration: 10 },
    ],
  },
  {
    day: 3,
    title: '第三天：深度社交建立 (阅读与编写评论)',
    actions: [
      { type: 'search', param: 'Healthy breakfast preps', duration: 60 },
      { type: 'scroll', param: 'For You Page', duration: 300 },
      { type: 'comment', param: 'Genuine 5-word English comment matching scenario', duration: 30 },
      { type: 'share', param: 'Share video link via simulated DM clipboard', duration: 15 },
    ],
  },
  {
    day: 4,
    title: '第四天：垂类长视频驻留 (完播率拉升)',
    actions: [
      { type: 'scroll', param: 'Explore Tab / Searches', duration: 200 },
      { type: 'scroll', param: 'Watch full 2-min ASMR setup video', duration: 120 },
      { type: 'like', param: 'Double tap following user upload', duration: 10 },
    ],
  },
  {
    day: 5,
    title: '第五天：算法归类触发 (主动出击)',
    actions: [
      { type: 'search', param: 'Desktop build accessories', duration: 90 },
      { type: 'scroll', param: 'Interactive comment replying', duration: 150 },
      { type: 'bookmark', param: 'Collect 2 niche hashtag videos', duration: 20 },
    ],
  },
];

export const VIDEO_RESOURCES: VideoAsset[] = [
  {
    id: 'res-1',
    title: 'Matcha Latte Brewing Serene ASMR',
    niche: 'aesthetic-cooking',
    duration: 15,
    thumbnailColor: 'bg-emerald-800',
    tagline: 'ASMR aesthetic matcha preparation in single take',
    tags: ['#matcha', '#asmrcooking', '#aestheticcoffee', '#satisfying'],
    script: 'POV: making a hot matcha latte on a rainy afternoon.\n[Visual of pouring high grade green powder]\n[Whisking in circles gently with wooden brush - ASMR sound intense]\n[Pouring textured warm oat milk forming elegant patterns]\n"No thoughts, just matcha foam. Have a nice day!"',
  },
  {
    id: 'res-2',
    title: 'Unboxing Vaporwave Custom Keyboard',
    niche: 'tech-gadgets',
    duration: 22,
    thumbnailColor: 'bg-purple-800',
    tagline: 'Satisfying mechanical typing test and keycaps showoff',
    tags: ['#mechanicalkeyboards', '#vaporwave', '#customtech', '#typingasmr'],
    script: 'Unboxing my dream cyberpunk mechanical keyboard. ✨\n[Sliding off carton sleeve with crunch noise]\n[Keycap colors glow magenta & cyan under neon lights]\n[Satisfying clack typing sound test]\n"Rate this typing level from 1 to 10 in the comments below!"',
  },
  {
    id: 'res-3',
    title: '5 AM Gym Core Consistency Routine',
    niche: 'fitness',
    duration: 18,
    thumbnailColor: 'bg-rose-900',
    tagline: 'Inspirational morning prep & short core moves',
    tags: ['#5amclub', '#coreworkout', '#gymbestie', '#morningmotivation'],
    script: 'When everyone defaults, you stack bricks.\n[Visual of alarm ringing at 5:00 AM in the dark]\n[Drinking sparkling pre-workout fuel]\n[Fast transition of hanging leg raises & planks]\n"The hardest rep is walking out of your bed. Let’s conquer today!"',
  },
  {
    id: 'res-4',
    title: 'Vintage Prada Leather Jacket Thrifts',
    niche: 'streetwear',
    duration: 30,
    thumbnailColor: 'bg-stone-800',
    tagline: 'Aesthetic street fashion styling vintage jackets',
    tags: ['#pradathrift', '#streetwearinspo', '#vintageaesthetic', '#ootdinspo'],
    script: 'Spent 5 hours digging, found this museum-grade piece.\n[Flipping through vintage hangers on busy rack]\n[Close up on authentic weathered Prada hardware buckles]\n[Smooth mirror fit-transiton with Lo-Fi background beats]\n"Should I style it with cream denim or baggy utility cargo?"',
  },
];

export const MOCK_MONTHLY_PLANS: Record<string, DailyPlan[]> = {
  'aesthetic-cooking': [
    { day: 1, topic: 'Oat Strawberry Parfait Bowl', direction: 'Slow motions, intense fruit slicing sounds, pastel pink background.', scriptPrompt: 'Create a 15s ASMR recipe for strawberry parfait showing layer building.', suggestedTags: ['#parfait', '#strawberry', '#asmrrecipes'] },
    { day: 2, topic: 'Ice Matcha Tea Latte Layer', direction: 'Transparent cup pouring transitions, highlighting white over bright green look.', scriptPrompt: 'Matcha floating recipe focusing on visual density separation.', suggestedTags: ['#matchatea', '#aestheticdrink'] },
    { day: 3, topic: 'Japanese Fluffy Souffle Pancake', direction: 'Shaking high-rise pancake on clean plate, powdered sugar pouring in slow-mo.', scriptPrompt: 'Textbook fliggle flap pancake ASMR with syrup drizzle closeups.', suggestedTags: ['#pancakes', '#souffle', '#tokyorecipes'] },
    { day: 4, topic: 'Whiskey Glass Ice sphere Espresso', direction: 'Ice crystal cracking sound, double espresso pouring mirroring, cozy jazz music.', scriptPrompt: 'Morning desk coffee splash showing liquid physics.', suggestedTags: ['#icedespresso', '#deskcoffee'] },
    { day: 5, topic: 'Mini Custard Crème Brûlée Torching', direction: 'Darkening background, blowtorch fire crackling, caramel top tapping with metal spoon.', scriptPrompt: 'First-person creme brulee cracking sounds.', suggestedTags: ['#cremebrulee', '#dessertasmr'] },
  ],
  'fitness': [
    { day: 1, topic: 'Ultimate Morning Core Routine', direction: 'High tempo sync beats, low-angle phone filming active leg holds.', scriptPrompt: 'Motivate viewers with intense 3 steps core exercises.', suggestedTags: ['#absroutine', '#morningworkout'] },
    { day: 2, topic: 'Gym Outfit Color Coordination', direction: 'Kick-off clothes transition, posing under clean neon gym lights showing fabric quality.', scriptPrompt: 'Showcase black/slate athletic fitness gear combo.', suggestedTags: ['#gymootd', '#fitgoddess'] },
    { day: 3, topic: 'Meal Prep: 40g Protein Garlic Chicken', direction: 'Flipping seasoned golden chicken breasts on grill pan, calorie text overlays.', scriptPrompt: 'Healthy recipes for high-protein lean bulking.', suggestedTags: ['#mealprep', '#highprotein'] },
    { day: 4, topic: 'Stretching Routine for Back Pain', direction: 'Serene yoga mat setup, focus on relaxing breathing circles.', scriptPrompt: '5 stretching positions for office posture correction.', suggestedTags: ['#backhealth', '#mindfulmovement'] },
    { day: 5, topic: 'Deadlift Form Hack: Lat Activation', direction: 'Red marker draw-overs, demonstrating scapula packing mistake vs proper pull.', scriptPrompt: 'Instructional guide to lift heavier without back injury.', suggestedTags: ['#deadlifthacks', '#weightlifting'] },
  ]
};

export const MOCK_CREATOR_STATS: Record<string, CreatorStats> = {
  'device-1': {
    dailyViews: [
      { date: '05/15', value: 1200 },
      { date: '05/16', value: 1800 },
      { date: '05/17', value: 4500 },
      { date: '05/18', value: 3900 },
      { date: '05/19', value: 8900 },
      { date: '05/20', value: 12500 },
      { date: '05/21', value: 13000 },
    ],
    dailyFollowers: [
      { date: '05/15', value: 8 },
      { date: '05/16', value: 12 },
      { date: '05/17', value: 45 },
      { date: '05/18', value: 32 },
      { date: '05/19', value: 121 },
      { date: '05/20', value: 240 },
      { date: '05/21', value: 290 },
    ],
    trafficSources: [
      { source: 'For You Page (推荐流量)', percentage: 89 },
      { source: 'Hashtag Search (标签检索)', percentage: 6 },
      { source: 'Personal Profile (个人主页)', percentage: 3 },
      { source: 'Followers Feed (粉丝关注)', percentage: 2 },
    ],
    topVideos: [
      { title: 'Ice Matcha Latte ASMR Float', views: 18400, likes: 2100, comments: 45, shares: 120, fypFraction: 0.94, retentionRate: 0.52 },
      { title: 'Custard Bun Steam Splitting Close', views: 8200, likes: 920, comments: 18, shares: 42, fypFraction: 0.88, retentionRate: 0.41 },
      { title: 'Pour Over Alchemy Filter Coffee', views: 5400, likes: 410, comments: 9, shares: 12, fypFraction: 0.82, retentionRate: 0.35 },
    ]
  },
  'device-2': {
    dailyViews: [
      { date: '05/15', value: 45000 },
      { date: '05/16', value: 52000 },
      { date: '05/17', value: 68000 },
      { date: '05/18', value: 71000 },
      { date: '05/19', value: 92000 },
      { date: '05/20', value: 110000 },
      { date: '05/21', value: 125000 },
    ],
    dailyFollowers: [
      { date: '05/15', value: 340 },
      { date: '05/16', value: 410 },
      { date: '05/17', value: 680 },
      { date: '05/18', value: 590 },
      { date: '05/19', value: 1200 },
      { date: '05/20', value: 1540 },
      { date: '05/21', value: 1980 },
    ],
    trafficSources: [
      { source: 'For You Page (推荐流量)', percentage: 92 },
      { source: 'Personal Profile (个人主页)', percentage: 4 },
      { source: 'Followers Feed (粉丝关注)', percentage: 3 },
      { source: 'Hashtag Search (标签检索)', percentage: 1 },
    ],
    topVideos: [
      { title: 'High-waist Gym Coordinate Transition', views: 142000, likes: 22400, comments: 195, shares: 1100, fypFraction: 0.96, retentionRate: 0.61 },
      { title: 'My 5:00 AM Routine: Stacking Gym Bricks', views: 98000, likes: 11800, comments: 112, shares: 740, fypFraction: 0.91, retentionRate: 0.54 },
      { title: 'Strict Glute Press Dumbbell Form Correction', views: 42000, likes: 3200, comments: 85, shares: 130, fypFraction: 0.84, retentionRate: 0.48 },
    ]
  }
};
