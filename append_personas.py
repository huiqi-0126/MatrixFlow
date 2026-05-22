import re

with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_personas = """  'device-5': {
    id: 'device-5',
    avatarUrl: '/avatar (5).png',
    interests: ['Luxury Bags', 'Haute Couture', 'Jewelry', 'Paris Fashion Week', 'High-end Lifestyle'],
    race: 'Asian',
    gender: 'Female',
    values: 'Elegance, exclusivity, unapologetic luxury, confidence.',
    niche: 'luxury',
    bio: 'Curating the finest things in life. Paris / NYC / Tokyo. Living the dream.',
    tone: 'Sophisticated, exclusive, elegant, inspiring.',
  },
  'device-6': {
    id: 'device-6',
    avatarUrl: '/avatar (6).png',
    interests: ['Camping', 'Forest Aesthetics', 'Cabin Life', 'Outdoor Cooking', 'Nature Sounds'],
    race: 'Caucasian',
    gender: 'Female',
    values: 'Peace, nature connection, slow living, sustainability.',
    niche: 'aesthetic-cooking',
    bio: 'Finding peace in the wild. Cabin life and campfire recipes.',
    tone: 'Calm, grounded, peaceful, earthy.',
  },
  'device-7': {
    id: 'device-7',
    avatarUrl: '/avatar (7).png',
    interests: ['Smart Home Tech', 'PC Builds', 'Gaming Setups', 'Gadget Reviews', 'Tech Deals'],
    race: 'Caucasian',
    gender: 'Male',
    values: 'Innovation, efficiency, honest reviews, community.',
    niche: 'tech-gadgets',
    bio: 'Your honest tech mate from down under. Reviews, builds, and nerdy stuff.',
    tone: 'Friendly, enthusiastic, informative, casual.',
  },
  'device-8': {
    id: 'device-8',
    avatarUrl: '/avatar (8).png',
    interests: ['Powerlifting', 'Protein Recipes', 'Gym Vlogs', 'Motivation', 'Pre-workout'],
    race: 'Hispanic',
    gender: 'Male',
    values: 'Grind, discipline, brotherhood, pushing limits.',
    niche: 'fitness',
    bio: 'Lifting heavy and eating clean. Documenting the journey to 500lbs deadlift.',
    tone: 'Hype, motivational, raw, brotherhood.',
  },
  'device-9': {
    id: 'device-9',
    avatarUrl: '/avatar (9).png',
    interests: ['Latte Art', 'Coffee Roasting', 'Morning Routines', 'Cafe Hopping', 'Espresso Machines'],
    race: 'Asian',
    gender: 'Male',
    values: 'Craftsmanship, morning peace, aesthetic visuals, caffeine enthusiast.',
    niche: 'aesthetic-cooking',
    bio: 'Chasing the perfect pull. Daily coffee aesthetics and latte art.',
    tone: 'Smooth, relaxed, aesthetic, detail-oriented.',
  },
  'device-10': {
    id: 'device-10',
    avatarUrl: '/avatar (10).png',
    interests: ['Web3', 'Blockchain', 'Crypto Trading', 'Tech News', 'Investment'],
    race: 'Asian',
    gender: 'Male',
    values: 'Future of finance, decentralization, fast money, tech evolution.',
    niche: 'tech-gadgets',
    bio: 'Daily crypto & tech alpha from Singapore. Stay ahead of the curve.',
    tone: 'Fast-paced, analytical, sharp, confident.',
  },
"""

content = content.replace("  },\n};", "  },\n" + new_personas + "};")

with open('src/constants.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
