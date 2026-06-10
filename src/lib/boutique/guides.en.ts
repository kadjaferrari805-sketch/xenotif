// Contenu des guides PDF — version anglaise (mirror EN de guides.ts).
// Structure identique ; seuls les textes sont traduits.

import { GUIDES, type Guide } from './guides'
import { GUIDES_DE } from './guides.de'

// ──────────────────────────────────────────────────────────────────────
// d1 — Mass Gain Program 12 weeks
// ──────────────────────────────────────────────────────────────────────
const masse: Guide = {
  id: 'd1',
  title: 'Mass Gain Program',
  subtitle: '12 weeks to build quality muscle',
  author: 'XENOTIF Coach — Certified strength & conditioning',
  blocks: [
    { type: 'h1', text: 'Welcome to your program' },
    { type: 'p', text: `Congratulations: you're holding a complete 12-week program designed to transform your physique for the long run. This guide isn't a simple list of exercises — it's a progressive method built to take you from point A to point B without injury and without plateauing.` },
    { type: 'p', text: `Whether you're a motivated beginner or an intermediate looking for structure, you'll find everything you need here: the session-by-session training plan, the technique of the key lifts, the nutrition strategy and the recovery protocols.` },
    { type: 'h2', text: "What you'll get in 12 weeks" },
    { type: 'list', items: [
      `Visible muscle gain (2 to 5 kg of muscle depending on your starting point).`,
      `Clearly higher strength on the basic lifts.`,
      `Better posture and a denser silhouette.`,
      `Training and eating habits you'll keep for life.`,
    ] },
    { type: 'note', text: `Golden rule: consistency beats intensity. Better to do 4 solid sessions a week for 12 weeks than one perfect week followed by quitting.` },

    { type: 'h1', text: 'The equipment you need' },
    { type: 'p', text: `This program is designed for a regular gym. Here's the equipment used.` },
    { type: 'list', items: [
      `An Olympic barbell + plates, an adjustable bench.`,
      `A squat rack or power cage.`,
      `Dumbbells (ideally a full range).`,
      `A few cable stations (lat pulldown and seated row).`,
      `Optional: pull-up bar, leg press, leg curl.`,
    ] },

    { type: 'h1', text: 'How to read the program' },
    { type: 'p', text: `Before you start, make sure you understand these concepts that come up in every session.` },
    { type: 'list', items: [
      `Sets × reps: "4 × 8" means 4 sets of 8 reps.`,
      `Tempo: execution speed. Aim for 2 seconds on the way down, 1 second on the way up.`,
      `Rest: time between sets. The heavier the load, the longer the rest.`,
      `RPE (perceived intensity out of 10): an RPE 8 means you had about 2 reps left in reserve.`,
      `Technical failure: the point where your form breaks down. Stop BEFORE, never after.`,
    ] },
    { type: 'note', text: `Keep a training log (paper or app). Recording your loads and reps is the only way to steer your progress and beat your numbers from the previous week.` },

    { type: 'h1', text: 'The 3 pillars of mass gain' },
    { type: 'p', text: `Muscle building rests on three levers. If one is missing, results stall. This program activates all three.` },
    { type: 'list', items: [
      `Progressive overload: regularly increase the load or the reps to force the muscle to adapt.`,
      `Controlled caloric surplus: eat 10 to 15% above your maintenance, with enough protein.`,
      `Recovery: muscle is built at rest, not during the session. 7 to 9h of sleep and 1 to 2 days off per week.`,
    ] },

    { type: 'h1', text: 'General structure & warm-up' },
    { type: 'p', text: `The program follows a 4-day-per-week split, organized into 3 four-week phases. Each phase raises the intensity for a strength peak at the end of the cycle.` },
    { type: 'list', items: [
      `Day 1 — Chest / Shoulders / Triceps (Push)`,
      `Day 2 — Back / Biceps (Pull)`,
      `Day 3 — Full legs (quads, hamstrings, calves, glutes)`,
      `Day 4 — Upper body strength (weak-point focus)`,
    ] },
    { type: 'h2', text: 'Warm-up — do this before EVERY session' },
    { type: 'list', items: [
      `5 min of light cardio (bike, rower or jump rope).`,
      `Joint mobility: shoulder, hip and ankle circles — 8 reps each.`,
      `Activation: 2 light sets on the first exercise (50% then 70% of the working load).`,
    ] },

    { type: 'h1', text: 'Phase 1 — Foundations (weeks 1 to 4)' },
    { type: 'p', text: `Goal: master the technique and build volume. 90-second rest between sets. Controlled tempo (2 seconds on the way down). Aim for an RPE of 7-8.` },
    { type: 'h2', text: 'Day 1 — Push' },
    { type: 'list', items: [
      `Barbell bench press — 4 × 8 to 10`,
      `Incline dumbbell press — 3 × 10`,
      `Overhead press — 4 × 8`,
      `Lateral raises — 3 × 15`,
      `Dips or cable triceps extensions — 3 × 12`,
    ] },
    { type: 'h2', text: 'Day 2 — Pull' },
    { type: 'list', items: [
      `Pull-ups or lat pulldown — 4 × 8 to 10`,
      `Barbell row — 4 × 10`,
      `Seated cable row — 3 × 12`,
      `Barbell curl — 3 × 10`,
      `Dumbbell hammer curl — 3 × 12`,
    ] },
    { type: 'h2', text: 'Day 3 — Legs' },
    { type: 'list', items: [
      `Barbell squat — 4 × 8 to 10`,
      `Leg press — 3 × 12`,
      `Romanian deadlift — 3 × 10`,
      `Lying leg curl — 3 × 12`,
      `Standing calf raise — 4 × 15`,
    ] },
    { type: 'h2', text: 'Day 4 — Upper body (strength)' },
    { type: 'list', items: [
      `Bench press — 5 × 5 (heavier load)`,
      `Single-arm dumbbell row — 4 × 8`,
      `Dumbbell overhead press — 3 × 10`,
      `Superset curl + triceps extension — 3 × 12 each`,
    ] },

    { type: 'h1', text: 'Phase 2 — Intensification (weeks 5 to 8)' },
    { type: 'p', text: `Increase the loads by 2.5 to 5 kg on the base exercises as soon as you hit the top of the range. 2-minute rest on the big lifts. Aim for an RPE of 8-9.` },
    { type: 'h2', text: 'Day 1 — Push (heavy)' },
    { type: 'list', items: [
      `Barbell bench press — 5 × 6`,
      `Incline dumbbell press — 4 × 8`,
      `Overhead press — 4 × 6`,
      `Lateral raises (drop set on the last) — 3 × 12`,
      `Weighted dips — 3 × 8 to 10`,
    ] },
    { type: 'h2', text: 'Day 2 — Pull (heavy)' },
    { type: 'list', items: [
      `Weighted pull-ups — 4 × 6`,
      `Barbell row — 5 × 6`,
      `Seated row — 4 × 10`,
      `Barbell curl — 4 × 8`,
      `Incline dumbbell curl — 3 × 10`,
    ] },
    { type: 'h2', text: 'Day 3 — Legs (heavy)' },
    { type: 'list', items: [
      `Barbell squat — 5 × 6`,
      `Leg press — 4 × 10`,
      `Romanian deadlift — 4 × 8`,
      `Dumbbell lunges — 3 × 10 per leg`,
      `Standing calf raise — 4 × 12`,
    ] },
    { type: 'note', text: `Double progression: stay on the same load until you reach the top of the range on ALL sets. Once you do, increase the load at the next session.` },

    { type: 'h1', text: 'Phase 3 — Strength & finishing (weeks 9 to 12)' },
    { type: 'p', text: `The most demanding phase: turning the accumulated volume into strength and density. 2 to 3 minutes of rest on the heavy lifts. Week 12 is a deload.` },
    { type: 'list', items: [
      `Base exercises: 4 to 6 reps with heavy load (around 85% of your max).`,
      `Isolation exercises: 12 to 15 reps for the pump and blood volume.`,
      `Add one intensity technique per session: drop sets, rest-pause or partial reps.`,
      `Week 12 (deload): cut the volume by 40% to recover and lock in the gains.`,
    ] },

    { type: 'h1', text: 'Technique of the key lifts' },
    { type: 'p', text: `Technique comes before load. Here are the key points for the 4 king lifts.` },
    { type: 'h2', text: 'The squat' },
    { type: 'list', items: [
      `Feet shoulder-width, toes slightly out.`,
      `Descend by pushing the hips back, neutral back, gaze forward.`,
      `Thighs at least parallel to the floor, knees tracking over the feet.`,
      `Push into the floor with the whole foot to come back up.`,
    ] },
    { type: 'h2', text: 'The bench press' },
    { type: 'list', items: [
      `Shoulder blades pinched and down, slight natural arch.`,
      `The bar comes down to the lower chest, elbows at about 45°.`,
      `Press while keeping the wrists straight above the elbows.`,
    ] },
    { type: 'h2', text: 'The deadlift' },
    { type: 'list', items: [
      `Bar against the shins, flat back, maximal bracing.`,
      `Push into the floor and extend the hips, keeping the bar close to the body.`,
      `Never round the lower back — reduce the load if needed.`,
    ] },
    { type: 'h2', text: 'Pull-ups / rows' },
    { type: 'list', items: [
      `Initiate the movement by depressing the shoulder blades, not with the arms.`,
      `Bring the chest toward the bar, elbows down and back.`,
      `Control the descent — don't just drop.`,
    ] },

    { type: 'h1', text: 'Mass-gain nutrition' },
    { type: 'p', text: `Without a caloric surplus, no muscle building. Here's how to calculate and organize your intake.` },
    { type: 'list', items: [
      `Calories: body weight (kg) × 35 to 40 = target daily intake.`,
      `Protein: 1.8 to 2.2 g per kg (e.g. 80 kg → 145 to 175 g/day).`,
      `Carbs: 4 to 6 g per kg, concentrated around training.`,
      `Fats: 0.8 to 1 g per kg for hormonal balance.`,
    ] },
    { type: 'h2', text: 'Tips by body type' },
    { type: 'list', items: [
      `Ectomorph (hard to gain): aim for the high end of calories, add a liquid snack (shake + oats).`,
      `Mesomorph (gains easily): moderate 10% surplus, watch your waist.`,
      `Endomorph (stores fat fast): light 5 to 8% surplus, carbs mainly around training.`,
    ] },
    { type: 'h2', text: 'Useful supplements (optional)' },
    { type: 'list', items: [
      `Whey: convenient to hit your protein.`,
      `Creatine monohydrate: 3 to 5 g per day, the best-proven supplement for strength.`,
      `Vitamin D and omega-3 if your diet is lacking.`,
    ] },

    { type: 'h1', text: 'Recovery & sleep' },
    { type: 'list', items: [
      `Sleep 7 to 9h: most of your growth hormone is released at night.`,
      `Hydrate: about 35 ml of water per kg of body weight per day.`,
      `Manage soreness with a cool-down, light stretching and walking.`,
      `The deload week (week 12) is part of the program: don't skip it.`,
    ] },

    { type: 'h1', text: 'Tracking your progress' },
    { type: 'list', items: [
      `Log your loads and reps at every session.`,
      `Weigh yourself 1 to 2 times a week, fasted, and track the monthly trend.`,
      `Take photos every 4 weeks, same lighting and same pose.`,
      `Measure your arm, chest, thighs and waist every 4 weeks.`,
    ] },

    { type: 'h1', text: 'Common mistakes to avoid' },
    { type: 'list', items: [
      `Changing program every week: progress requires consistency.`,
      `Neglecting legs: they release the most overall anabolism.`,
      `Sacrificing technique to lift heavier.`,
      `Under-eating to "stay lean": without a surplus, no muscle.`,
      `Skimping on sleep: it sabotages 100% of your gym efforts.`,
    ] },

    { type: 'h1', text: 'FAQ' },
    { type: 'p', text: `How long is a session? Between 60 and 75 minutes, warm-up included.` },
    { type: 'p', text: `Can I train 3 days instead of 4? Yes: merge days 1 and 4, and spread the rest over 3 sessions keeping the Push / Pull / Legs order.` },
    { type: 'p', text: `And after the 12 weeks? Start a new cycle from the loads you reached, or move on to a cutting phase with our dedicated nutrition plan.` },
    { type: 'note', text: `You have everything you need. Print this guide, log your loads, and come back to it every week. In 12 weeks, compare your starting numbers: the difference will motivate you for the next cycle. We're counting on you.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d2 — Cutting Nutrition Plan 8 weeks
// ──────────────────────────────────────────────────────────────────────
const seche: Guide = {
  id: 'd2',
  title: 'Cutting Nutrition Plan',
  subtitle: '8 weeks to lose fat without losing muscle',
  author: 'XENOTIF Coach — Sports nutrition',
  blocks: [
    { type: 'h1', text: 'Welcome to your cut' },
    { type: 'p', text: `This 8-week plan will help you reveal your muscle definition by losing body fat, without sacrificing the muscle you worked hard for. No extreme diet here, no absurd deprivation: a progressive, sustainable, science-based method.` },
    { type: 'p', text: `You'll find the calculation of your needs, a sample day structure, a week-by-week adjustment plan, over 20 recipes, a vegan version and all the strategies to never crack.` },
    { type: 'note', text: `A cut is a marathon, not a sprint. A steady loss of 0.5 to 0.8% of your body weight per week preserves muscle. Going faster = burning muscle and breaking your metabolism.` },

    { type: 'h1', text: 'The principle of cutting' },
    { type: 'p', text: `Cutting means losing body fat while preserving muscle. That requires three things at once.` },
    { type: 'list', items: [
      `A moderate caloric deficit: 15 to 20% below your maintenance, no more.`,
      `High protein: 2 to 2.4 g per kg to protect lean mass.`,
      `Keeping up strength training: it's the signal that tells the body to hold onto muscle.`,
    ] },

    { type: 'h1', text: 'Understanding your expenditure' },
    { type: 'p', text: `Your body burns calories in four ways. Knowing them helps you understand why moving more day-to-day matters as much as the gym.` },
    { type: 'list', items: [
      `Basal metabolism: the energy to live at rest (60 to 70% of the total).`,
      `NEAT: all non-exercise activity (walking, chores, stairs). Greatly underrated.`,
      `Exercise activity: your sessions.`,
      `Thermic effect of food: the energy to digest (protein demands the most).`,
    ] },

    { type: 'h1', text: 'Calculating your needs' },
    { type: 'p', text: `Step 1: estimate your maintenance. Step 2: subtract the deficit. Step 3: split the macros.` },
    { type: 'list', items: [
      `Rough maintenance: weight (kg) × 33 (sedentary) to 38 (active).`,
      `Cutting calories: maintenance − 20% (e.g. 2,500 → 2,000 kcal).`,
      `Protein: weight × 2.2 g. Fats: weight × 0.8 g. The rest of the calories as carbs.`,
    ] },
    { type: 'note', text: `Weigh yourself 3 times a week fasted and take the weekly average. If the weight doesn't move for 10 days, cut 100 to 150 kcal of carbs or add light cardio.` },

    { type: 'h1', text: 'Structure of a sample day' },
    { type: 'p', text: `Spread your protein across 4 meals to maximize satiety and muscle synthesis.` },
    { type: 'h2', text: 'Breakfast' },
    { type: 'list', items: [
      `3-egg omelet + 100 g of egg whites`,
      `40 g of oats`,
      `1 fruit (apple or a handful of berries)`,
    ] },
    { type: 'h2', text: 'Lunch' },
    { type: 'list', items: [
      `150 g of chicken or turkey (cooked weight)`,
      `60 g of basmati rice (raw weight) or 200 g of sweet potato`,
      `Green vegetables to taste + 1 tbsp of olive oil`,
    ] },
    { type: 'h2', text: 'Snack' },
    { type: 'list', items: [
      `1 scoop of whey or 200 g of 0% fromage blanc`,
      `20 g of almonds`,
    ] },
    { type: 'h2', text: 'Dinner' },
    { type: 'list', items: [
      `150 g of white fish or salmon`,
      `Large portion of vegetables (broccoli, zucchini, green beans)`,
      `1 tbsp of olive oil or 1/4 avocado`,
    ] },

    { type: 'h1', text: 'Progression over 8 weeks' },
    { type: 'list', items: [
      `Weeks 1-2: build the habits, light deficit (−15%). The body adapts gently.`,
      `Weeks 3-4: full deficit (−20%). Add 20 min of brisk walking on off days.`,
      `Weeks 5-6: if a plateau, cut 100 kcal of carbs and add 2 light cardio sessions.`,
      `Week 7: controlled refeed for one day (+300 kcal of carbs) to restart the metabolism.`,
      `Week 8: the final stretch, hold the course, hydrate well and photograph your progress.`,
    ] },

    { type: 'h1', text: 'Cardio & training during the cut' },
    { type: 'list', items: [
      `Keep lifting heavy: THAT is what preserves muscle during the deficit.`,
      `Gentle cardio (walking, cycling): excellent to deepen the deficit without exhausting yourself.`,
      `Aim for 8,000 to 10,000 steps a day: NEAT is your best ally.`,
      `Avoid extreme fasted cardio: it doesn't burn fat faster and tires you needlessly.`,
    ] },

    { type: 'h1', text: 'Recipes — breakfasts & snacks' },
    { type: 'list', items: [
      `Protein pancakes: 1 banana, 2 eggs, 1 scoop of whey, oats.`,
      `0% fromage blanc, berries and 15 g of almonds.`,
      `Light spinach-feta omelet: 3 eggs, a handful of spinach, 30 g of feta.`,
      `Wholegrain toast, poached egg and mashed avocado.`,
      `Skyr, cinnamon and a few oats.`,
    ] },

    { type: 'h1', text: 'Recipes — lunches & dinners' },
    { type: 'list', items: [
      `Chicken-rice-avocado bowl: 150 g chicken, 60 g rice, 1/4 avocado, lemon.`,
      `Baked salmon-sweet potato: 150 g salmon, 200 g sweet potato, herbs.`,
      `Tuna-veg wrap: wholegrain wrap, 1 can of tuna, raw veg, fromage blanc.`,
      `Light chicken curry: chicken, low-fat coconut milk, curry, vegetables.`,
      `5% beef-quinoa: 150 g beef, 60 g quinoa, ratatouille.`,
      `Lentil-egg salad: lentils, 2 hard-boiled eggs, tomatoes, light dressing.`,
      `Steamed cod, broccoli and brown rice.`,
      `Lean chili con carne: 5% beef, kidney beans, tomatoes, spices.`,
    ] },

    { type: 'h1', text: 'Vegan version' },
    { type: 'p', text: `Replace animal proteins with these sources and top up with a plant protein powder.` },
    { type: 'list', items: [
      `Firm tofu, tempeh, seitan (protein-rich).`,
      `Legumes: lentils, chickpeas, kidney beans.`,
      `Edamame, quinoa, pea or rice protein powder.`,
      `Mind your vitamin B12 and omega-3 (flaxseed, walnuts).`,
    ] },

    { type: 'h1', text: 'Managing cravings & plateaus' },
    { type: 'list', items: [
      `Drink a big glass of water before each meal: satiety goes up.`,
      `Favor high-volume, low-calorie foods (vegetables, soups).`,
      `Keep 1 or 2 "treat" foods within your macros rather than banning them.`,
      `Plateau over 10 days: apply a "diet break" of 5 to 7 days at maintenance.`,
      `Sleep enough: lack of sleep increases hunger and sugar cravings.`,
    ] },

    { type: 'h1', text: 'Supplements & hydration' },
    { type: 'list', items: [
      `Whey or plant protein: to hit your protein easily.`,
      `Caffeine: a mild appetite suppressant that boosts training energy.`,
      `Electrolytes and 35 ml of water per kg per day: hydration helps manage hunger.`,
      `No "fat burner" replaces the caloric deficit. Keep your money.`,
    ] },

    { type: 'h1', text: 'Weekly shopping list' },
    { type: 'list', items: [
      `Protein: chicken, turkey, white fish, salmon, eggs, whey, 0% fromage blanc, skyr.`,
      `Carbs: basmati rice, sweet potato, oats, quinoa, fruit, wholegrain bread.`,
      `Fats: olive oil, avocado, almonds, walnuts, seeds.`,
      `Vegetables: broccoli, spinach, zucchini, green beans, tomatoes, salad, peppers.`,
      `Extras: spices, lemon, balsamic vinegar, mustard, fresh herbs.`,
    ] },

    { type: 'h1', text: 'FAQ & after the cut' },
    { type: 'p', text: `Will I lose muscle? Not if you eat enough protein and keep lifting. That's the whole point of this plan.` },
    { type: 'p', text: `How much weight will I lose? About 0.5 to 0.8% of your weight per week, i.e. 3 to 5 kg over 8 weeks depending on your starting point.` },
    { type: 'p', text: `And afterward? Raise your calories gradually (+100 kcal per week) back to maintenance: that's the "reverse diet", which prevents regaining everything.` },
    { type: 'note', text: `Prep your meals ahead (batch cooking) twice a week. It's the #1 secret to sticking to a cut without cracking. You've got this.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d3 — HIIT Program 6 weeks
// ──────────────────────────────────────────────────────────────────────
const hiit: Guide = {
  id: 'd3',
  title: 'Fat-Burning HIIT Program',
  subtitle: '6 weeks, 100% bodyweight, no equipment',
  author: 'XENOTIF Coach — CrossFit Level 2 certified',
  blocks: [
    { type: 'h1', text: 'Welcome to your HIIT program' },
    { type: 'p', text: `In 6 weeks, this program will transform your fitness and melt fat — no gym, no equipment, wherever you are. Everything is bodyweight, in short but intense sessions of 20 to 30 minutes.` },
    { type: 'p', text: `You'll find each week's 4 sessions detailed, the technique of every movement, the warm-up and recovery protocols, and the nutrition tips to speed up your results.` },
    { type: 'note', text: `Intensity = key. During the work phases, you should be unable to hold a conversation. During recovery, you actively catch your breath (marching in place, deep breathing).` },

    { type: 'h1', text: 'Why HIIT works' },
    { type: 'p', text: `HIIT alternates intense efforts and short recoveries. The result: you burn calories during AND after the session thanks to the EPOC effect (excess post-exercise oxygen consumption).` },
    { type: 'list', items: [
      `A 20-min session can burn as much as a 45-min jog.`,
      `The body keeps burning calories for up to 24h after the effort.`,
      `HIIT preserves muscle better than long, monotonous cardio.`,
      `No equipment: you can train anywhere, anytime.`,
    ] },

    { type: 'h1', text: 'Understanding intensity' },
    { type: 'p', text: `For HIIT to work, you need to reach true high intensity. Here's how to spot it without a sensor.` },
    { type: 'list', items: [
      `Talk test: at full effort, you can only say 2 or 3 words at a time.`,
      `Feel out of 10: the work phases should be at 8-9/10.`,
      `If you can sing, it's not HIIT — push harder.`,
      `If you're on the edge of nausea, it's too much: ease off slightly.`,
    ] },

    { type: 'h1', text: 'The formats used' },
    { type: 'list', items: [
      `Tabata: 20 s max effort / 10 s rest, 8 rounds (4 min per exercise).`,
      `EMOM: "Every Minute On the Minute" — a number of reps to do at the start of each minute, the rest is rest.`,
      `AMRAP: "As Many Rounds As Possible" — maximum rounds in a set time.`,
      `30/30: 30 s effort / 30 s rest, ideal to get started.`,
    ] },

    { type: 'h1', text: 'Warm-up & cool-down' },
    { type: 'h2', text: 'Warm-up (5 min, before each session)' },
    { type: 'list', items: [
      `30 s of jumping jacks`,
      `30 s of arm rotations + hip circles`,
      `30 s of slow high knees`,
      `30 s of bodyweight squats`,
      `Repeat the circuit twice`,
    ] },
    { type: 'h2', text: 'Cool-down (5 min, after each session)' },
    { type: 'list', items: [
      `1 to 2 min of walking to bring the heart rate down.`,
      `Stretch the quads, hamstrings, calves and shoulders (20 s each).`,
      `Deep breathing: inhale 4 s, exhale 6 s, ×10.`,
    ] },

    { type: 'h1', text: 'Technique of the 8 base movements' },
    { type: 'h2', text: 'Burpees & jump squats' },
    { type: 'list', items: [
      `Burpee: drop into a squat, hands on the floor, jump to a plank, push-up, bring the feet back, jump. Keep the core braced.`,
      `Jump squat: lower into a controlled squat, explode upward, land by bending the knees softly.`,
    ] },
    { type: 'h2', text: 'Mountain climbers & high knees' },
    { type: 'list', items: [
      `Mountain climbers: in a plank, drive the knees toward the chest alternately, hips stable.`,
      `High knees: run in place, knees to hip height, arms in rhythm.`,
    ] },
    { type: 'h2', text: 'Push-ups, jumping lunges, plank, jumping jacks' },
    { type: 'list', items: [
      `Push-ups: body braced in a plank, lower elbows to 45°, push. On the knees if needed.`,
      `Jumping lunges: alternate legs by jumping, front knee tracking over the foot.`,
      `Plank: forearms on the floor, body straight, abs and glutes contracted.`,
      `Jumping jacks: spread arms and legs by jumping — perfect to warm up and recover.`,
    ] },
    { type: 'note', text: `Better 8 perfect burpees than 15 sloppy ones. Adjust the number of reps, never the quality of execution.` },

    { type: 'h1', text: 'Weeks 1 & 2 — Adaptation (30/30 format)' },
    { type: 'p', text: `4 sessions per week. For each exercise: 30 s effort / 30 s rest. 3 rounds of the circuit, 1 min recovery between rounds. Goal: learn the movements cleanly.` },
    { type: 'list', items: [
      `Session A: jumping jacks → squats → push-ups → mountain climbers → plank.`,
      `Session B: high knees → alternating lunges → knee push-ups → plank → squats.`,
      `Sessions C and D: repeat A and B aiming for cleaner execution.`,
      `Total time: about 20 min, warm-up included.`,
    ] },

    { type: 'h1', text: 'Weeks 3 & 4 — Intensification (EMOM + AMRAP)' },
    { type: 'p', text: `Increase the work density. 4 sessions per week, 25 min. Log your scores to measure your progress.` },
    { type: 'list', items: [
      `Session A — EMOM 16 min: min 1: 12 jump squats / min 2: 10 burpees / min 3: 14 high knees / min 4: 30 s plank. Repeat 4 times.`,
      `Session B — AMRAP 12 min: 8 burpees + 12 jumping lunges + 16 mountain climbers, max rounds.`,
      `Session C — EMOM 15 min: alternate push-ups, jump squats, mountain climbers.`,
      `Session D — AMRAP 10 min: 10 squats + 10 push-ups + 10 jumping jacks.`,
    ] },

    { type: 'h1', text: 'Weeks 5 & 6 — Performance (Tabata)' },
    { type: 'p', text: `The peak of the program. 4 sessions of 25 to 30 min, Tabata format on the explosive movements. 2 min recovery between blocks.` },
    { type: 'list', items: [
      `Block 1 — Tabata burpees: 20 s max / 10 s rest × 8.`,
      `Block 2 — Tabata jump squats: 20 s / 10 s × 8.`,
      `Block 3 — Tabata mountain climbers: 20 s / 10 s × 8.`,
      `Block 4 — Tabata dynamic plank: 20 s / 10 s × 8.`,
      `Following sessions: vary the order of the blocks and aim for more reps than the previous round.`,
    ] },

    { type: 'h1', text: 'Nutrition to speed up results' },
    { type: 'list', items: [
      `HIIT is an accelerator, not a substitute for good nutrition.`,
      `Eat a source of protein + carbs within the hour after the session.`,
      `Create a slight caloric deficit if your goal is fat loss.`,
      `Hydrate before, during and after each session.`,
    ] },

    { type: 'h1', text: 'Adapting the program & safety' },
    { type: 'list', items: [
      `Beginner: reduce the number of rounds and lengthen the recoveries.`,
      `Low-impact (sensitive joints): swap jumps for ground versions (regular squats, step-back instead of jumping burpees).`,
      `Keep at least 1 full rest day between two intense sessions.`,
      `Stop immediately if you feel sharp joint pain (different from muscle fatigue).`,
    ] },

    { type: 'h1', text: 'Tracking & FAQ' },
    { type: 'list', items: [
      `Log your scores (rounds, reps) at each session to see your progress.`,
      `Take a photo every 2 weeks.`,
      `How many times a week? 4 sessions, with at least 1 rest day between the hardest.`,
      `And after 6 weeks? Start a new cycle aiming for more reps, or combine with strength training.`,
    ] },
    { type: 'note', text: `Progress at your own pace: every session finished is a win. In 6 weeks you'll be faster, more enduring and leaner. Get to work.` },
  ],
}

// ──────────────────────────────────────────────────────────────────────
// d4 — Running Guide: From 5K to Marathon
// ──────────────────────────────────────────────────────────────────────
const running: Guide = {
  id: 'd4',
  title: 'Running Guide — From 5K to Marathon',
  subtitle: 'Plans, paces, nutrition and mental preparation',
  author: 'XENOTIF Coach — Certified athletics coach',
  blocks: [
    { type: 'h1', text: 'Welcome, runner' },
    { type: 'p', text: `Whether you want to run your first 5K or land a marathon, this guide takes you the whole way. It gathers plans for four distances, the science of paces, running technique, nutrition and mental preparation.` },
    { type: 'p', text: `Read the chapters on paces and technique first: they're the ones that will make the difference in your progress and your injury prevention.` },
    { type: 'note', text: `The 80/20 rule: 80% of your mileage at an easy aerobic pace, 20% at intensity. It's the foundation of any lasting progress.` },

    { type: 'h1', text: 'The essential gear' },
    { type: 'list', items: [
      `A good pair of shoes matched to your gait (get advice at a specialty store).`,
      `Breathable technical clothing suited to the weather.`,
      `Optional but useful: a GPS watch to track pace and distance.`,
      `For long runs: a bottle belt or a soft flask.`,
    ] },

    { type: 'h1', text: 'Understanding your paces' },
    { type: 'p', text: `Progressing in running is above all about running at the right paces. Too many runners go too fast in training and too slow in races. Here are the 3 fundamental paces.` },
    { type: 'list', items: [
      `Easy aerobic (EA): conversational pace, 65 to 75% of your max HR. 80% of your volume should be here.`,
      `Threshold pace: a sustained but controlled effort you could hold for about 1h. Builds resistance.`,
      `VO2max (maximal aerobic speed): short, fast intervals. Builds your engine.`,
    ] },
    { type: 'h2', text: 'Finding your zones simply' },
    { type: 'list', items: [
      `EA: you can talk in complete sentences.`,
      `Threshold: you can only say a few words at a time.`,
      `VO2max: you're almost all-out, talking is impossible.`,
    ] },

    { type: 'h1', text: 'Stride and cadence' },
    { type: 'list', items: [
      `Aim for a cadence of 170 to 180 steps per minute to limit impact.`,
      `Land the foot under your center of gravity, not ahead — reduces braking and injuries.`,
      `Keep the torso upright, the gaze far, the shoulders relaxed.`,
      `The arms set the rhythm: elbows at 90°, front-to-back movement, hands relaxed.`,
    ] },

    { type: 'h1', text: '5K plan — 6 weeks (beginner)' },
    { type: 'p', text: `3 sessions per week. Goal: run 5K without stopping, then improve the time.` },
    { type: 'list', items: [
      `Week 1: 1 min run / 1 min walk × 10, three times.`,
      `Week 2: 2 min run / 1 min walk × 8.`,
      `Week 3: 5 min run / 1 min walk × 4.`,
      `Week 4: 10 min run / 1 min walk × 3.`,
      `Week 5: 20 min of continuous easy aerobic running.`,
      `Week 6: 1 run of 25 min + 1 session of 5 × 1 min fast + 5K goal on the weekend.`,
    ] },

    { type: 'h1', text: '10K plan — 8 weeks' },
    { type: 'p', text: `4 sessions per week: 2 easy, 1 threshold, 1 long run. Increase the volume by 10% maximum per week.` },
    { type: 'list', items: [
      `Easy session: 30 to 45 min easy.`,
      `Threshold session: 2 × 10 min at 10K pace with 3 min recovery.`,
      `VO2max session: 8 to 10 × 400 m fast with 200 m recovery.`,
      `Long run: 50 to 70 min progressive, up to 12 km.`,
    ] },

    { type: 'h1', text: 'Half-marathon plan — 10 weeks' },
    { type: 'list', items: [
      `Volume: 4 to 5 sessions, gradual build to 18 km on the long run.`,
      `Key session: 3 × 2 km at half-marathon pace, 2 min recovery.`,
      `Include a hill session every 2 weeks for strength.`,
      `Keep a short VO2max session to maintain speed.`,
      `Weeks 9-10: taper — cut the volume by 40%, keep a little intensity.`,
    ] },

    { type: 'h1', text: 'Marathon plan — 12 weeks' },
    { type: 'list', items: [
      `Base: 5 sessions per week, gradual long run up to 30-32 km.`,
      `Marathon-pace specific sessions: 2 × 5 km, then 3 × 5 km as the weeks go by.`,
      `One long run per week, easy, is the pillar of the plan.`,
      `You must test your race nutrition on the long runs.`,
      `3-week taper before race day: the fatigue turns into freshness.`,
    ] },
    { type: 'note', text: `Never test anything new on race day: not shoes, not nutrition, not the starting pace. Everything must have been rehearsed in training.` },

    { type: 'h1', text: "The runner's strength work" },
    { type: 'p', text: `Two short sessions a week are enough to reduce injuries and improve running economy.` },
    { type: 'list', items: [
      `Core (plank, side plank): 3 × 30 to 45 s.`,
      `Bodyweight lunges and squats: 3 × 12.`,
      `Calf raises: 3 × 20.`,
      `Glute bridge: 3 × 15 to strengthen the posterior chain.`,
    ] },

    { type: 'h1', text: "The runner's nutrition" },
    { type: 'list', items: [
      `Before (3h): a meal rich in carbs, low in fats and fiber.`,
      `During (beyond 75 min): 30 to 60 g of carbs per hour (gels, drinks, dried fruit).`,
      `Hydration: sip regularly, don't wait until you're thirsty.`,
      `After: carbs + protein within 30 min to refuel and repair.`,
      `The marathon "wall" comes from a lack of carbs: train your fueling.`,
    ] },

    { type: 'h1', text: 'Injury prevention — 7 points' },
    { type: 'list', items: [
      `Increase your volume by 10% maximum per week.`,
      `Strengthen the glutes and calves twice a week.`,
      `Work on ankle and hip mobility.`,
      `Rotate your shoe pairs and replace them every 700 to 900 km.`,
      `Never skip the warm-up before intense sessions.`,
      `Respect at least 1 full rest day per week.`,
      `Listen to the signals: a pain that lasts 3 days means rest.`,
    ] },

    { type: 'h1', text: "The competitor's mindset" },
    { type: 'list', items: [
      `Break the race into short segments rather than thinking of the total distance.`,
      `Prepare 2 or 3 mantras to repeat when it gets hard.`,
      `Visualize your ideal race the day before, from start to finish.`,
      `Accept discomfort: it's temporary and part of the game.`,
      `Set 3 goals: an ambitious one, a realistic one, and a "no matter what" one.`,
    ] },

    { type: 'h1', text: 'FAQ & race day' },
    { type: 'p', text: `How often to run? 3 sessions to start, 4 to 5 for the long distances. Consistency beats volume.` },
    { type: 'p', text: `Should I stretch beforehand? Rather a progressive warm-up (walk then jog). Save the long stretches for after or rest days.` },
    { type: 'p', text: `How do I handle the start? Go out slower than your target pace: you don't win a race in the first kilometer, but you can lose it.` },
    { type: 'note', text: `Good race! The hardest part is already done: you committed. Follow the plan, respect your paces, and trust your preparation. See you at the finish line.` },
  ],
}

export const GUIDES_EN: Record<string, Guide> = {
  d1: masse,
  d2: seche,
  d3: hiit,
  d4: running,
}

// Guide localisé : repli FR si la langue n'a pas (encore) de variante.
export function getGuideLocalized(productId: string, locale: string): Guide | undefined {
  if (locale === 'en') return GUIDES_EN[productId] ?? GUIDES[productId]
  if (locale === 'de') return GUIDES_DE[productId] ?? GUIDES[productId]
  return GUIDES[productId]
}
