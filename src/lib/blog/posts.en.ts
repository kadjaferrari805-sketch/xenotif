/* ── Articles de blog — version anglaise ──────────────────────── */
/* Réutilise BLOG_POSTS (FR) pour le structurel (slug, coverImage, author,
   publishedAt, readingMinutes, productSlugs, category-clé) et ne surcharge que
   les champs texte (title, excerpt, méta, keywords, content). */

import { BLOG_POSTS_SOURCE, type BlogPost } from './posts'

type PostText = Pick<BlogPost, 'title' | 'excerpt' | 'metaTitle' | 'metaDescription' | 'keywords' | 'content'>

const TEXT_EN: Record<string, PostText> = {
  'meilleurs-halteres-musculation-maison-2026': {
    title: 'The 5 Best Dumbbells for Home Strength Training in 2026',
    excerpt:
      'Home gym or full setup at home? Discover our pick of the best dumbbells to build muscle at home effectively, with a complete comparison and expert advice.',
    metaTitle: 'Best Home Dumbbells 2026 — Comparison & Buying Guide',
    metaDescription:
      'Comparison of the 5 best dumbbells for home strength training in 2026. Adjustable, fixed, kettlebells: our expert guide to choose based on your budget and goals.',
    keywords: ['best dumbbells', 'home dumbbells 2026', 'adjustable dumbbells', 'home gym equipment', 'kettlebell training', 'beginner dumbbells'],
    content: [
      { type: 'paragraph', text: "Building an effective home gym has never been more accessible. But faced with the market's overwhelming offer — fixed dumbbells, adjustable, kettlebells, bars — it's hard to know what to buy. Too light: you plateau in 3 months. Too heavy and unsuitable: injury guaranteed. This guide helps you make the right choice in 2026." },
      { type: 'heading', text: 'Why Invest in Dumbbells for Home?' },
      { type: 'paragraph', text: "The economic argument is undeniable: a gym membership costs on average €40 per month, or €480 per year. A good set of adjustable dumbbells, amortized over 5 years, comes to less than €60 a year. But the advantage goes far beyond your wallet. At home, you train whenever you want, with no queue for machines, no commute. Studies show that training consistency — the number-one factor in progress — is significantly better among people training at home." },
      { type: 'subheading', text: 'What Goals Can You Reach with Dumbbells?' },
      { type: 'list', items: [
        'Muscle hypertrophy (mass gain): sets of 8 to 12 reps with progressive overload',
        'Maximal strength: sets of 3 to 5 reps with heavy loads',
        'Muscular endurance and resistance: sets of 15 to 20 reps',
        'Weight loss and cardio: HIIT circuits with short rest times',
        'Rehab and injury prevention: postural correction movements',
      ] },
      { type: 'heading', text: 'The 5 Essential Criteria for Choosing Your Dumbbells' },
      { type: 'subheading', text: '1. The Weight Range: Anticipate Your Progress' },
      { type: 'paragraph', text: "This is the most common mistake: buying too light. A male beginner will typically start with 8-10 kg curls, but will easily reach 16-20 kg within 6 months of regular training. For a woman, the progression goes from 4-6 kg to 10-14 kg over the same period. Always go for a range covering at least double your starting weight. Adjustable dumbbells like the Bowflex (2-24 kg) are unbeatable here: they grow with you." },
      { type: 'subheading', text: '2. The Build Type: Durability and Safety' },
      { type: 'paragraph', text: "Cast iron is the king material for heavy loads: indestructible, high density, reasonable price. The rubber or neoprene coating protects your floors and reduces noise when setting them down. Avoid cheap chromed dumbbells for loads above 15 kg: metal burrs can injure, and the welds give out. For intensive use, demand hex dumbbells — they don't roll." },
      { type: 'subheading', text: '3. Ergonomics: The Handle That Changes Everything' },
      { type: 'paragraph', text: "A handle 28-29 mm in diameter suits most hands. The knurling must be enough to ensure grip without tearing the skin. Too smooth and you'll drop the dumbbell at the end of a set; too aggressive and you'll hurt your palms. The best models offer medium knurling in the center and softer at the ends." },
      { type: 'productCta', productSlug: 'halteres-reglables-bowflex', reason: "The Bowflex SelectTech are our number-one pick: 2 to 24 kg by turning a dial, they replace 15 pairs, with a premium steel build. The ideal investment for a complete home gym." },
      { type: 'heading', text: 'Adjustable vs Fixed Dumbbells: Which to Choose?' },
      { type: 'paragraph', text: "Fixed dumbbells have one advantage: they're ready to use instantly, with no handling. But for a home gym, they take up considerable space and require a massive investment to cover the full useful range (from 5 to 30 kg, easily €500-800). Adjustable dumbbells are the rational solution: same price, far more weight, minimal storage." },
      { type: 'subheading', text: 'Kettlebells: An Essential Complement' },
      { type: 'paragraph', text: "Kettlebells don't replace dumbbells but complement them perfectly. Their offset center of gravity makes them ideal for ballistic movements (swings, snatches, cleans) that work the posterior chain — glutes, hamstrings, back — in a way impossible with classic dumbbells. A 16 kg kettlebell (for women) or 20-24 kg (for men) is the ideal entry point." },
      { type: 'productCta', productSlug: 'kettlebell-20kg-fonte-pro', reason: "The CORENGTH 20 kg Cast Iron Pro Kettlebell offers unbeatable value. Recycled cast iron, rubber base, sandblasted handle: everything a demanding athlete expects." },
      { type: 'heading', text: 'Sample Training Program with Dumbbells at Home' },
      { type: 'subheading', text: 'Full Body Session 3 Times a Week (Beginner to Intermediate)' },
      { type: 'list', items: [
        'A1 — Goblet Squat: 4 sets × 12 reps (kettlebell or single dumbbell)',
        'A2 — Floor Bench Press: 4 sets × 10 reps (dumbbells)',
        'B1 — Romanian Deadlift: 3 sets × 12 reps (dumbbells)',
        'B2 — Single-Arm Row: 3 sets × 10 reps each side',
        'C1 — Biceps Curl: 3 sets × 12 reps',
        'C2 — Triceps Extension: 3 sets × 12 reps',
        'D1 — Kettlebell Swing: 3 sets × 15 reps',
      ] },
      { type: 'paragraph', text: "Rest between sets: 60-90 seconds for supersets A and B, 45 seconds for C and D. Increase the weight as soon as you complete all reps with 2 reps in reserve (RIR 2). That's progressive overload — the fundamental principle of all muscle progress." },
      { type: 'quote', text: "The most effective gym is the one you actually go to. Investing in a good home gym means investing in your consistency." },
      { type: 'heading', text: 'Resistance Bands: The Smart Complement' },
      { type: 'paragraph', text: "To round out your arsenal without blowing your budget, resistance bands are a remarkable investment. They let you add variable resistance — maximal at full stretch, zero at the starting point — which is impossible with free weights. Perfect for back exercises (face pulls, pull-aparts) and for assisting movements like pull-ups. A set of 5 resistances covers all your needs." },
    ],
  },
  'whey-proteine-guide-complet-debutant': {
    title: 'Whey Protein: The Complete Guide for Beginners (When, How Much, How)',
    excerpt:
      'Whey concentrate, isolate, hydrolysate... which protein should you choose? Our complete nutrition guide answers all your questions about protein supplementation.',
    metaTitle: 'Whey Protein Complete Beginner Guide — Dosage, Timing & Tips',
    metaDescription:
      'Everything you need to know about whey protein: which whey to choose, when to take it, how many grams per day. Expert nutrition guide for beginners and advanced.',
    keywords: ['whey protein beginner', 'whey protein guide', 'when to take whey', 'protein dosage strength', 'whey concentrate vs isolate', 'best protein for mass gain'],
    content: [
      { type: 'paragraph', text: "Whey protein is the most studied and most used supplement in the fitness world. But behind this generic term hide very different products, specific uses and persistent misunderstandings. This guide will give you all the keys to use it intelligently." },
      { type: 'heading', text: 'What Exactly Is Whey Protein?' },
      { type: 'paragraph', text: "Whey is a by-product of cheese making. When milk is coagulated, it separates into two phases: the curd (cheese) and the liquid whey. The latter is filtered, concentrated and dried to produce the protein powder you know. Its essential amino acid composition is exceptional: it contains all the essential amino acids, with a particularly high concentration of leucine — the amino acid that triggers muscle protein synthesis." },
      { type: 'subheading', text: 'The 3 Types of Whey: Which One to Choose?' },
      { type: 'list', items: [
        'Whey Concentrate (WPC): 70-80% protein, contains lactose and fats. The most affordable, ideal to start.',
        'Whey Isolate (WPI): 90-95% protein, virtually no lactose or fats. Purer, faster digestion.',
        'Whey Hydrolysate: pre-digested protein, ultra-fast absorption. More expensive, marginal benefit except after an intense effort.',
      ] },
      { type: 'paragraph', text: "Our recommendation: whey concentrate is more than enough for 90% of trainees. If you're lactose intolerant or looking to minimize carbs during a cut, switch to isolate. Hydrolysate shows no proven performance benefit for the average trainee." },
      { type: 'productCta', productSlug: 'whey-proteine-chocolat-1kg', reason: "Our MyProtein Impact chocolate whey is a premium-quality concentrate: 21g of protein per serving, 4.5g of natural BCAAs, unbeatable price. The benchmark for value on the market." },
      { type: 'heading', text: 'How Much Protein Per Day? The Real Recommendations' },
      { type: 'paragraph', text: "The official recommendations (0.8g/kg of body weight) are calibrated for a sedentary population. For a strength trainee looking to build muscle, the most recent studies converge on a range of 1.6 to 2.2 g/kg of body weight per day. For an 80 kg man: between 128 and 176 g of protein daily." },
      { type: 'subheading', text: 'How to Calculate Your Personal Needs' },
      { type: 'list', items: [
        'Beginner level (0-6 months): 1.6 g/kg — high protein synthesis, fast progress',
        'Intermediate level (6-24 months): 1.8 g/kg — slower progress, stable needs',
        'Advanced level (2+ years): 2.0-2.2 g/kg — muscle is hard to build, maximal needs',
        'Cutting phases (caloric deficit): go up to 2.2-2.5 g/kg to preserve muscle mass',
      ] },
      { type: 'paragraph', text: "This protein should come primarily from food: meat, fish, eggs, legumes, dairy. Whey is a complement to easily reach your daily targets, especially around training." },
      { type: 'heading', text: 'When to Take Whey? The Optimal Timing' },
      { type: 'subheading', text: 'The Anabolic Window: Myth or Reality?' },
      { type: 'paragraph', text: "For years, the fitness community preached the 30-minute post-workout rule. Recent meta-analyses considerably qualify this dogma. If your last meal was less than 3 hours before the session, the post-workout urgency is much lower. What matters more: total daily protein intake, spread over 3 to 4 meals of 30 to 40g." },
      { type: 'subheading', text: 'The 3 Best Times to Use Whey' },
      { type: 'list', items: [
        'Post-workout (30-60 min): fast digestion, ideal if more than 4h since the last protein meal',
        'On waking: after the overnight fast, a 30g serving quickly restarts protein synthesis',
        'Between meals: a protein shake to reach your daily targets without excess calories',
      ] },
      { type: 'quote', text: "Whey isn't magic. It only helps you reach your daily protein intake more easily. It's your overall diet that makes the difference." },
      { type: 'heading', text: 'Creatine: The Supplement to Pair with Whey' },
      { type: 'paragraph', text: "If you were to take only one supplement besides whey, it would be creatine monohydrate. It's the most studied supplement in sports history, with hundreds of studies confirming its effectiveness in increasing strength (+5-15% on the basic lifts) and speeding up recovery. Dose: 3-5g per day, regardless of timing." },
      { type: 'productCta', productSlug: 'creatine-monohydrate-myprotein-300g', reason: "MyProtein's creatine monohydrate is the reference: micronized for better dissolution, no additives, precise 3g dosing. The whey + creatine combo is the foundation of any smart supplementation." },
      { type: 'heading', text: 'BCAAs: Necessary or Superfluous?' },
      { type: 'paragraph', text: "Branched-chain amino acids (Leucine, Isoleucine, Valine) are the key amino acids for muscle synthesis. If you already consume enough complete protein (whey + food), BCAA supplements add little extra benefit. Their value is real in a specific context: prolonged fasted training (morning cardio without eating), or a strict cutting phase to protect muscle mass." },
      { type: 'heading', text: 'How to Make a Perfect Protein Shake' },
      { type: 'list', items: [
        '300-350 ml of skim milk or plant milk for a creamy texture',
        '30g of whey powder (about 1 scoop)',
        'Optional: 1 banana for post-workout carbs',
        'Optional: 1 tablespoon of peanut butter for fats',
        'Blend 20-30 seconds or shake vigorously for 30 seconds',
      ] },
      { type: 'paragraph', text: "This shake provides about 35-40g of protein, 50-60g of carbs (with banana), 10-15g of fats — a complete post-workout meal for less than 5 minutes of prep and under €2 a serving." },
    ],
  },
  'programme-hiit-maison-perdre-graisse': {
    title: 'Home HIIT Program: Burn Maximum Fat in 20 Minutes',
    excerpt:
      'HIIT (High Intensity Interval Training) is the most effective method to burn fat in little time. Discover our complete program to do at home.',
    metaTitle: 'Home HIIT Program — Lose Fat in 20 Minutes | Complete Guide',
    metaDescription:
      'Complete home HIIT program to burn maximum fat in 20 minutes. Structured sessions, expert advice, optimal recovery. Guaranteed results in 6 weeks.',
    keywords: ['home HIIT program', 'HIIT lose fat', 'interval training', 'burn calories at home', 'beginner interval training', 'HIIT 20 minutes'],
    content: [
      { type: 'paragraph', text: "HIIT — High Intensity Interval Training — has revolutionized the way we approach fat loss. Where traditional cardio asks for 45-60 minutes of moderate jogging, HIIT gets superior results in 20-25 minutes. This isn't a marketing promise: it's what dozens of randomized scientific studies show." },
      { type: 'heading', text: 'Why HIIT Burns More Fat Than Classic Cardio' },
      { type: 'paragraph', text: "The secret of HIIT is called EPOC — Excess Post-exercise Oxygen Consumption, or the \"afterburn effect\". After a moderate cardio session, your metabolism returns to normal in 30 to 60 minutes. After an intense HIIT, your body keeps burning extra calories for 24 to 48 hours to repay the accumulated oxygen debt. This effect can represent up to 10-15% additional caloric expenditure over 24h." },
      { type: 'subheading', text: 'The Physiological Mechanisms at Work' },
      { type: 'list', items: [
        'Maximal activation of fast-twitch muscle fibers (type II), which consume more energy',
        'Increased insulin sensitivity — muscle cells take up glucose better',
        'Stimulation of growth hormone (GH) up to 450% above the baseline level',
        'Preservation and development of muscle mass, unlike long-duration cardio',
        'EPOC of 24-48h versus 30-60 min for classic cardio',
      ] },
      { type: 'heading', text: 'Structure of an Effective HIIT Session' },
      { type: 'paragraph', text: "An effective HIIT protocol alternates phases of maximal effort (85-95% of HRmax) and active recovery phases (50-60% of HRmax). The two most studied protocols: Tabata (20s work / 10s rest × 8 rounds = 4 minutes) and the 30/30 protocol (30 seconds of work / 30 seconds of recovery × 10-12 rounds). For beginners, start with 20/40 (20 seconds of work, 40 seconds of recovery)." },
      { type: 'subheading', text: 'Mandatory Warm-Up: 5 Minutes' },
      { type: 'list', items: [
        '1 min — Light jumping jacks to gradually raise the heart rate',
        '1 min — Hip circles and arm circles to mobilize the joints',
        '1 min — High knees at 40% intensity',
        '1 min — Dynamic alternating lunges',
        '1 min — Light burpees at 50% intensity',
      ] },
      { type: 'productCta', productSlug: 'tapis-yoga-premium-10mm', reason: "A premium mat is essential for HIIT at home: it cushions the joints during jumps, stays non-slip even when sweating, and protects your floors. The 10mm Gaiam mat is our recommendation for any serious trainee." },
      { type: 'heading', text: '20-Minute HIIT Program: 3 Levels' },
      { type: 'subheading', text: 'Beginner Level — 20/40 Protocol' },
      { type: 'list', items: [
        'Round 1: Jumping jacks 20s / rest 40s',
        'Round 2: Jump squats 20s / rest 40s',
        'Round 3: Mountain climbers 20s / rest 40s',
        'Round 4: Modified burpees (no jump) 20s / rest 40s',
        'Repeat 3 times = 12 minutes of HIIT + 5 min warm-up + 3 min cool-down',
      ] },
      { type: 'subheading', text: 'Intermediate Level — 30/30 Protocol' },
      { type: 'list', items: [
        'Round 1: Full burpees 30s / walk 30s',
        'Round 2: Fast jump rope 30s / rest 30s',
        'Round 3: Box jumps or powerful jump squats 30s / rest 30s',
        'Round 4: Sprint in place (100%) 30s / walk 30s',
        'Round 5: Fast mountain climbers 30s / rest 30s',
        'Repeat 2 times = 10 minutes + 5 min warm-up + 5 min cool-down',
      ] },
      { type: 'productCta', productSlug: 'corde-sauter-crossfit-reebok', reason: "The jump rope is the ultimate HIIT tool: 10 minutes of intense skipping burns 130-150 calories. The Reebok Speed CrossFit rope with ball bearings lets you reach maximum cadence." },
      { type: 'subheading', text: 'Advanced Level — Complex Tabata' },
      { type: 'list', items: [
        'Block 1 (4 min Tabata): Tuck-jump burpees — 20s/10s × 8',
        'Rest 1 minute',
        'Block 2 (4 min Tabata): Jump-rope double-unders — 20s/10s × 8',
        'Rest 1 minute',
        "Block 3 (4 min Tabata): Devil's press (burpee + dumbbells) — 20s/10s × 8",
        'Total: 15 minutes of work for a 20-minute session',
      ] },
      { type: 'heading', text: 'Frequency and Recovery: Avoiding Overtraining' },
      { type: 'paragraph', text: "HIIT is demanding on the central nervous system (CNS). Unlike moderate cardio that can be done daily, HIIT requires 48h of recovery between two sessions. The optimal frequency is 3 sessions per week for a beginner/intermediate, 4 maximum for an advanced athlete. Signs of overtraining: performance that stalls or regresses, persistent fatigue, sleep disturbances, irritability." },
      { type: 'quote', text: "20 minutes of intense HIIT beats 60 minutes of moderate cardio. But only if you recover properly between sessions." },
      { type: 'heading', text: 'Nutrition Around HIIT' },
      { type: 'paragraph', text: "To maximize fat burning, some trainees do their HIIT fasted (in the morning). This approach can work but increases the risk of muscle loss if not managed properly. If you opt for fasted HIIT: take BCAAs before the session (5g) to protect your muscles. Post-HIIT, a meal rich in protein (30-40g) and medium-glycemic carbs within 60 minutes maximizes recovery." },
      { type: 'paragraph', text: "For optimal results and a progressive program structured over 6 weeks with controlled load increase, our complete HIIT program is the most effective solution. Designed by certified coaches, it includes video sessions, the associated nutrition plan and progress tracking." },
    ],
  },
  'recuperation-musculaire-techniques-optimales': {
    title: 'Muscle Recovery: 7 Proven Techniques to Progress Faster',
    excerpt:
      "Recovery is as important as training. Discover the 7 scientifically validated methods to reduce soreness and progress faster.",
    metaTitle: 'Muscle Recovery: 7 Proven Techniques — Expert Guide 2026',
    metaDescription:
      'Reduce soreness and progress faster with these 7 scientifically proven muscle-recovery techniques: sleep, massage, cryotherapy, BCAAs and more.',
    keywords: ['muscle recovery', 'reduce soreness', 'muscle foam roller', 'massage gun recovery', 'DOMS treatment', 'optimize sports recovery'],
    content: [
      { type: 'paragraph', text: "In the fitness world, we celebrate effort, sweat, personal records. But muscle progress happens during recovery, not during training. Training is the stimulus; recovery is the response. Neglecting one cancels the benefits of the other. Here are the 7 best scientifically documented techniques." },
      { type: 'heading', text: 'Understanding the Mechanisms of Muscle Recovery' },
      { type: 'paragraph', text: "DOMS (Delayed Onset Muscle Soreness) — the soreness that appears 24 to 72 hours after effort — is due to micro-tears in the muscle fibers. It's a normal and necessary inflammatory response: it's this repair process that makes your muscles stronger. The goal isn't to eliminate this inflammation (that would be counterproductive) but to optimize and speed up the repair process." },
      { type: 'heading', text: 'Technique #1: Sleep, the King of Recovery' },
      { type: 'paragraph', text: "It's the most powerful and least expensive lever. During deep sleep phases (phases 3 and 4), the pituitary gland releases 80% of the daily production of growth hormone (GH). This hormone is directly responsible for muscle protein synthesis, tissue repair and fat metabolism. 7 to 9 hours of sleep per night isn't a luxury for an athlete: it's a physiological necessity. Below 6h, studies show a 20% drop in performance and an increase in cortisol (a catabolic hormone)." },
      { type: 'heading', text: 'Technique #2: Foam Rolling — Releasing Tension Points' },
      { type: 'paragraph', text: "The foam roller applies direct pressure on the myofascial tissue. The exact mechanism is still debated, but studies confirm it: 10-15 minutes of foam rolling post-workout reduces DOMS by 40% at 72 hours, and improves joint mobility without loss of strength. Protocol: work each muscle group for 60-90 seconds in continuous pressure, focusing on the painful points (trigger points)." },
      { type: 'productCta', productSlug: 'foam-roller-trigger-point', reason: "The TriggerPoint GRID foam roller is the professional reference. Its multi-density textured surface simulates a masseur's fingers to effectively treat the fascia. Essential in any serious recovery program." },
      { type: 'heading', text: 'Technique #3: Percussion Therapy — The Massage Gun' },
      { type: 'paragraph', text: "Massage guns (percussion devices) represent the technological evolution of foam rolling. Their high-frequency vibrations (1400-3200 percussions/minute) penetrate deeper into the muscle tissue, stimulate local blood circulation and activate the nerve receptors to reduce perceived pain. A 2021 study in the Journal of Clinical Medicine shows a 30% reduction in inflammatory markers (CK, LDH) after 5 days of post-exercise use." },
      { type: 'productCta', productSlug: 'pistolet-massage-theragun', reason: "The Theragun is the recovery tool of choice for professional athletes. Its QuietForce DeepTissue motor treats up to 16mm deep. 2 minutes on the quads after a run is enough to considerably reduce next-day soreness." },
      { type: 'heading', text: 'Technique #4: Recovery Nutrition' },
      { type: 'subheading', text: 'The Post-Effort Anabolic Window' },
      { type: 'paragraph', text: "In the 30 to 60 minutes following effort, your muscles are particularly receptive to nutrients. The priority: protein + carbs. Protein (30-40g) provides the amino acids to rebuild the damaged fibers. Carbs (60-80g) refill muscle glycogen and stimulate insulin, an anabolic hormone. A 3:1 carb/protein ratio is optimal in endurance, 2:1 in strength training." },
      { type: 'subheading', text: 'The Role of BCAAs in Recovery' },
      { type: 'paragraph', text: "Branched-chain amino acids — Leucine, Isoleucine, Valine — are catabolized directly in the muscle, unlike other amino acids processed by the liver. Leucine in particular directly activates the mTOR complex, the main trigger of protein synthesis. 5-10g of BCAAs around training reduces muscle damage markers (creatine kinase) by 15 to 25%." },
      { type: 'heading', text: 'Technique #5: Hydrotherapy — Hot/Cold' },
      { type: 'list', items: [
        'Cold bath (10-15°C for 10-15 min): vasoconstriction, reduction of acute inflammation',
        'Contrast shower (30s cold / 30s hot × 5-10 reps): vascular pumping, draining of metabolic waste',
        'Post-workout sauna (20-30 min at 80°C): GH × 200-300%, neuromuscular relaxation',
        'Contrast bath (alternating immersions 2 min cold / 2 min hot × 5): favored by pro athletes',
      ] },
      { type: 'heading', text: 'Technique #6: Stretching — Passive vs Active' },
      { type: 'paragraph', text: "Contrary to a stubborn misconception, static stretching right after training does not reduce soreness (studies confirm this). Its value lies elsewhere: maintaining joint mobility, preventing postural imbalances, psychological relaxation. The most effective method for flexibility: PNF (Proprioceptive Neuromuscular Facilitation) — 6-second contraction + release + 30-second stretch. To be done 3-4 hours after the session, never immediately after." },
      { type: 'heading', text: 'Technique #7: Active Recovery' },
      { type: 'paragraph', text: "A light walk, very low-resistance cycling or 20-30 minutes of easy swimming the day after an intense session speed up recovery by 15-20% compared to total rest. The slightly elevated blood flow promotes the delivery of nutrients to the damaged muscles and the removal of metabolic waste (lactate, H+). At low intensity (50-60% HRmax max), it adds no extra stress." },
      { type: 'quote', text: "Training hard without recovering intelligently is like building a house without letting the concrete dry. Progress is decided between the sessions." },
      { type: 'heading', text: 'Optimal Weekly Recovery Plan' },
      { type: 'list', items: [
        'Immediately post-session: protein shake + BCAAs + massage gun 5 min',
        'Evening: complete protein meal, PNF stretching 20 min, 8h of sleep minimum',
        'Next morning: foam roller 15 min, active recovery 20-30 min',
        '48h later: return to training if soreness is gone or very light',
      ] },
    ],
  },
  'debuter-running-plan-5km-debutant': {
    title: 'Getting Started with Running: The Complete Plan to Run 5K Without Stopping',
    excerpt:
      'From zero to 5K of continuous running: our progressive 8-week training plan, the mistakes to avoid and all the advice to start running in the best conditions.',
    metaTitle: 'Beginner Running Plan: Run 5K in 8 Weeks — Complete Program',
    metaDescription:
      'Beginner running training plan to run 5K without stopping in 8 weeks. Week-by-week program, equipment advice, injury prevention. Start today.',
    keywords: ['beginner running', 'beginner 5K plan', 'beginner running program', 'run 5K without stopping', 'start running', '8-week running plan'],
    content: [
      { type: 'paragraph', text: "\"I want to run but I'm out of breath after 200 meters.\" If that sentence sounds like you, know that you're not alone — and above all, that it's perfectly normal and entirely surmountable. In 8 weeks of progressive, intelligent training, any healthy person can run 5K without stopping. This guide shows you exactly how." },
      { type: 'heading', text: 'Why Are You Out of Breath After 200m? The Physiology Explained' },
      { type: 'paragraph', text: "When you start running, your cardio-respiratory system isn't yet adapted to sustained effort. Your heart (a muscle!) isn't trained to maintain a high output, your lungs haven't optimized their oxygen diffusion capacity, and your muscles don't yet know how to use oxygen efficiently (low VO2max). Good news: these three systems adapt remarkably fast with regular training. The first cardiovascular improvements appear as early as 2-3 weeks." },
      { type: 'heading', text: 'The Golden Rule: Run Slowly to Run Longer' },
      { type: 'paragraph', text: "The #1 beginner mistake: starting too fast. If you can hold a conversation while running (the \"talk test\"), your pace is right. If you're panting and can't form complete sentences, you're running too fast and you'll have to stop. The majority of your runs (80%) should be in zone 2 (50-70% of HRmax), a pace that feels almost too easy. That's where the aerobic foundations are built." },
      { type: 'subheading', text: 'How to Calculate Your Maximum Heart Rate' },
      { type: 'list', items: [
        'Classic formula: HRmax = 220 - age (approximate but enough to start)',
        'Zone 1 (recovery): 50-60% HRmax — brisk walking',
        'Zone 2 (base endurance): 60-70% HRmax — ideal for beginner running',
        'Zone 3 (tempo): 70-80% HRmax — moderate to high perceived effort',
        'Zone 4 (lactate threshold): 80-90% HRmax — uncomfortable, hard to talk',
      ] },
      { type: 'heading', text: 'The 8-Week Plan: From Zero to 5K' },
      { type: 'subheading', text: 'Weeks 1-2: Walk/Run (Alternating)' },
      { type: 'list', items: [
        'Session 1: 5 min walk + [1 min run / 2 min walk] × 6 + 5 min walk = 25 min',
        'Session 2: same as S1',
        'Session 3: 5 min walk + [1.5 min run / 2 min walk] × 5 + 5 min walk',
        'Frequency: 3 times a week, never two days in a row',
      ] },
      { type: 'subheading', text: 'Weeks 3-4: Longer Running Blocks' },
      { type: 'list', items: [
        'Session 1: [3 min run / 90s walk] × 6 = 27 min',
        'Session 2: [5 min run / 2 min walk] × 4 = 28 min',
        'Session 3: [8 min run / 2 min walk] × 3 = 30 min',
      ] },
      { type: 'subheading', text: 'Weeks 5-6: Toward Continuous Running' },
      { type: 'list', items: [
        'Session 1: 10 min run + 2 min walk + 10 min run',
        'Session 2: 15 min continuous run',
        'Session 3: 20 min continuous run (INTERMEDIATE GOAL)',
      ] },
      { type: 'subheading', text: 'Weeks 7-8: Reaching 5K' },
      { type: 'list', items: [
        'Session 1: 25 min continuous run',
        'Session 2: 28-30 min continuous run',
        'Session 3 of week 8: A FULL 5K — your first 5K!',
      ] },
      { type: 'quote', text: "There's no bad pace in running, only a pace that doesn't suit you yet. Run slowly to run for a long time." },
      { type: 'heading', text: 'The 5 Mistakes That Injure Beginners' },
      { type: 'list', items: [
        "1. Too much volume too fast — the 10% rule: never increase weekly distance by more than 10%",
        '2. Poor running form — heel-striking on hard roads: increases impact (3× body weight per stride)',
        '3. Unsuitable underwear and socks — blisters and chafing ruin sessions',
        '4. Running on the same stiff muscles — stretching and preventive strengthening are non-negotiable',
        '5. Ignoring pain — sharp pain is an immediate stop signal',
      ] },
      { type: 'heading', text: 'Running Gear: What Really Matters' },
      { type: 'paragraph', text: "Shoes are your number-one investment. A good pair of running shoes (€100-150) lasts 500-800 km depending on your build and the terrain. Get a gait analysis at a specialty store to choose between pronator, supinator and neutral. For the rest: lightweight anti-chafe shorts, a breathable t-shirt, running socks (no seam at the toe). A heart-rate watch is a plus, but not a priority at the start." },
      { type: 'productCta', productSlug: 'short-training-gymshark-homme', reason: "The Gymshark Training shorts are designed for running and cardio: ultra-breathable Dry-Tech fabric, aerodynamic cut, built-in pockets. No more thigh chafing that ruins long runs." },
      { type: 'heading', text: 'Strength Training: The Runner\'s Overlooked Ally' },
      { type: 'paragraph', text: "Runners who add 2 strength sessions per week improve their running economy by 2 to 8% and reduce their injury risk by 30-50%. Focus on runners' weak points: calves (single-leg raises), quads and hamstrings (Bulgarian squats), glutes (hip thrusts), core. These exercises create the stability that lets you run for a long time without painful postural compensation." },
      { type: 'productCta', productSlug: 'guide-running-marathon-complet', reason: "Once you've mastered your 5K, our complete running guide takes you all the way to the marathon. 10K, half-marathon and marathon plans, race nutrition advice and managing the wall. The runner's complete reference." },
      { type: 'heading', text: 'Nutrition for the Beginner Runner' },
      { type: 'paragraph', text: "For runs of less than 45-60 minutes, you don't need to worry about specific nutrition during the run. Just make sure you're properly hydrated beforehand (500 ml in the preceding 2 hours) and that you haven't run on an empty stomach for more than 3-4 hours. After the run: a mixed protein+carb snack within 30-60 minutes speeds up recovery. From 60-90 minutes of running, gels or sports drinks become useful." },
      { type: 'list', items: [
        'Before (1-2h): oats + banana, or rice pudding',
        'During (if +60 min): carb gels or dates, 30-45g of carbs/hour',
        'After: protein 20-30g + carbs 40-60g within 60 minutes',
        'Hydration: 400-600 ml/hour depending on temperature, clear urine = good hydration',
      ] },
    ],
  },
}

export const BLOG_POSTS_EN: BlogPost[] = BLOG_POSTS_SOURCE.map((p) => ({ ...p, ...TEXT_EN[p.slug] }))

function postsFor(locale: string): BlogPost[] {
  return locale === 'en' ? BLOG_POSTS_EN : BLOG_POSTS_SOURCE
}

export function getAllPostsLocalized(locale: string): BlogPost[] {
  return [...postsFor(locale)].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export function getPostBySlugLocalized(slug: string, locale: string): BlogPost | undefined {
  return postsFor(locale).find((p) => p.slug === slug)
}

export function getPostsByCategoryLocalized(category: BlogPost['category'], locale: string): BlogPost[] {
  return postsFor(locale)
    .filter((p) => p.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getRelatedPostsLocalized(slug: string, locale: string, limit = 3): BlogPost[] {
  const posts = postsFor(locale)
  const current = posts.find((p) => p.slug === slug)
  if (!current) return getAllPostsLocalized(locale).slice(0, limit)
  return posts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(posts.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit)
}
