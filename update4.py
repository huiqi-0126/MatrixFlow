import re
with open('src/constants.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Since parsing nested brackets with regex is hard, I will find the exact indices
start_idx = content.find("'aesthetic-cooking': [")
if start_idx != -1:
    end_idx = content.find("],\n  'fitness': [", start_idx)
    if end_idx != -1:
        new_plan = """'aesthetic-cooking': [
    { day: 1, topic: 'Easy Sunday Morning Pancakes 🥞', direction: 'Fluffy pancakes, pouring syrup in slow motion, warm morning light.', scriptPrompt: 'Create a 15s aesthetic cooking video for Sunday morning pancakes.', suggestedTags: ['#pancakerecipe', '#sundaymorning'] },
    { day: 2, topic: 'Meal Prep: Healthy Lunches', direction: 'Chopping fresh vegetables, organizing glass containers.', scriptPrompt: 'ASMR vegetable chopping and aesthetic lunch prep.', suggestedTags: ['#mealprep', '#healthylunch'] },
    { day: 3, topic: 'Aesthetic Coffee Pour Over', direction: 'Close up of coffee dripping, steam rising, pouring hot water over ground beans.', scriptPrompt: 'Morning coffee routine ASMR with relaxing lo-fi background.', suggestedTags: ['#coffeeroutine', '#asmr'] },
    { day: 4, topic: 'One-Pan Creamy Tuscan Chicken', direction: 'Sizzling chicken, adding cream and spinach, rich colors.', scriptPrompt: 'Quick 20 minute family dinner recipe.', suggestedTags: ['#onepandinner', '#familydinner'] },
    { day: 5, topic: 'Baking Chocolate Chip Cookies', direction: 'Mixing dough, pulling apart a warm gooey cookie.', scriptPrompt: 'Baking cookies on a rainy afternoon with kids.', suggestedTags: ['#baking', '#chocolatechip'] },
    { day: 6, topic: 'Kitchen Pantry Restock ASMR', direction: 'Pouring dry goods into aesthetic glass jars, organizing.', scriptPrompt: 'Satisfying kitchen pantry restock ASMR.', suggestedTags: ['#restock', '#kitchengoals'] }
  """
        content = content[:start_idx] + new_plan + content[end_idx:]
        with open('src/constants.ts', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Replaced plan")
