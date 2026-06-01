/* ── Contenu riche par discipline — version anglaise ──────────── */
/* Mirror EN de disciplines.ts. Structure identique ; seuls les textes
   diffèrent. Les youtubeIds, emojis et icônes restent communs.        */

import type { DisciplineContent, DisciplineMeta } from './disciplines'

/* ── Running & Cardio ──────────────────────────────────────────── */
const runningContent: DisciplineContent = {
  tagline: 'Run faster, run longer, without getting injured.',
  heroStat: '4,200+ active runners',
  guide: {
    technique: {
      emoji: '👟',
      title: 'Running technique',
      items: [
        'Land midfoot rather than heel-first — cuts injury risk by 30%',
        'Target cadence: 170–180 steps/min to maximize efficiency',
        'Arms at 90° with relaxed hands — saves energy over long distances',
        'Gaze fixed 10–15 m ahead to keep an upright posture',
        'Breathe on a 3:2 rhythm (3 steps inhale / 2 steps exhale) at easy paces',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Recommended gear',
      items: [
        'Running shoes matched to your gait (get a gait analysis at a specialty store)',
        'GPS watch to track pace, distance and heart rate',
        'Breathable technical clothing (avoid cotton)',
        'Heart-rate chest strap for precise training zones',
        'Tracking app: Xenotif® + Garmin / Apple Watch integration',
      ],
    },
    nutrition: {
      emoji: '🥑',
      title: 'Nutrition & Hydration',
      items: [
        'Meal rich in complex carbs 3h before a long run (rice, pasta, quinoa)',
        'Energy gel or banana every 40–45 min beyond 1h30 of running',
        'Hydration: 500 ml of water 2h before, then 150–200 ml every 20 min',
        'Recovery: 20–30 g of protein within 30 min after the effort',
        'Caffeine (3–5 mg/kg) 60 min before a race for performance',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Optimal recovery',
      items: [
        'Static stretching 10–15 min post-run (hamstrings, calves, quads)',
        'Foam roller on the muscle chains 3× /week',
        'Cold bath (12–15 °C, 10 min) after intense sessions to reduce inflammation',
        'At least 8h of sleep — muscle rebuilding happens at night',
        'One full rest day per week is mandatory to prevent overtraining',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'The 10% rule', body: 'Never increase your weekly volume by more than 10% — the golden rule for avoiding overuse injuries.' },
    { icon: '🎯', title: 'Train by zones', body: '80% of your volume at low intensity (Zone 2), 20% at high intensity — that\'s the formula of endurance champions.' },
    { icon: '🧠', title: 'Pre-run visualization', body: '5 min of mental visualization before each hard run improves performance by 15% according to sports studies.' },
    { icon: '🌡️', title: 'Monthly FTP check', body: 'Test your speed at lactate threshold every month (12-min Cooper test) to fine-tune your training zones.' },
  ],
  videos: [
    {
      youtubeIds: ['Byjy-LzSNc0', 'BmJbKsV2r9o'],
      title: '9 Minutes to fix your running form',
      description: 'Fix your running technique in 9 min — posture, foot strike and cadence broken down step by step.',
      duration: '9 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['sScNDZu2MWk', 'UrHOGy6jQ1g'],
      title: 'Perfect stride — 5 tips',
      description: 'The 5 secrets to running faster and pain-free — technique validated by elite coaches.',
      duration: '12 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['_kGESn8ArrU', 'Xpg2JXiNwcY'],
      title: 'Running technique explained',
      description: 'Complete guide to running technique — cadence, foot strike, breathing and injury prevention.',
      duration: '15 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['KxKJEIqS1HQ', 'SU3DqokJnjo'],
      title: '20-min interval run session',
      description: 'A complete 20-minute interval workout — alternating sprints and recovery to progress quickly.',
      duration: '20 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['HFUz5qazxn0', 'UdBR85D8e8g'],
      title: 'Tips for intervals',
      description: 'How to structure your intervals well to maximize progress in running.',
      duration: '11 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['fbATY-sbqA8', '9rX9m_bemB0'],
      title: 'Why do interval training?',
      description: 'The science behind intervals — how and why interval work boosts your performance.',
      duration: '13 min',
      level: 'Beginner',
    },
  ],
  exercises: [
    { name: 'Walking lunges', muscles: 'Quads, glutes, hamstrings', sets: '3×12/leg', difficulty: 'Beginner', description: 'Take a big step forward, lower your back knee close to the floor, then push off the front foot to bring the other leg through. Keep your back straight.' },
    { name: 'Jump squat', muscles: 'Quads, glutes, cardio', sets: '3×15', difficulty: 'Intermediate', description: 'Lower into a parallel squat then explode upward. Land softly by bending the knees to absorb. Builds propulsive power.' },
    { name: 'Box step-up', muscles: 'Quads, glutes, stabilizers', sets: '3×10/leg', difficulty: 'Beginner', description: 'Place one foot on a box or step, push up, then lower slowly. Mimics running uphill.' },
    { name: 'Jumping lunges', muscles: 'Quads, glutes, explosiveness', sets: '3×10/leg', difficulty: 'Intermediate', description: 'From the lunge position, jump and swap legs in the air. Excellent for developing lower-body power and endurance.' },
    { name: 'Single-leg deadlift', muscles: 'Hamstrings, glutes, balance', sets: '3×8/leg', difficulty: 'Advanced', description: 'Hinge forward on one leg keeping a flat back, the other leg extending behind. Return to standing without putting the foot down. Builds proprioception.' },
    { name: 'Box jumps', muscles: 'Quads, calves, explosiveness', sets: '4×8', difficulty: 'Advanced', description: 'Jump onto a box with both feet, absorb the landing in a half-squat. Step down on the outside. Improves explosive lower-body power.' },
    { name: 'Running A-drills', muscles: 'Hip flexors, cadence', sets: '3×20 m', difficulty: 'Beginner', description: 'Walk while driving the knees high each step, arms in rhythm. Improves running mechanics and cadence by training hip activation.' },
    { name: 'Side plank', muscles: 'Obliques, lateral stability', sets: '3×30 s/side', difficulty: 'Beginner', description: 'Support on the elbow and the side of the foot, body in a straight line. Strengthens the lateral trunk muscles essential for posture while running.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Aerobic foundation',
      sessions: [
        { name: 'Z2 easy run 30 min', detail: 'Conversational pace (heart rate 65–75% HRmax)' },
        { name: 'Hills 8× 30 s', detail: 'Uphill sprint, recover on the way down — improves power and stride' },
        { name: 'Long run 50 min', detail: 'Very slow pace, goal is duration and base endurance' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Threshold development',
      sessions: [
        { name: 'Intervals 5×5 min', detail: '10K pace, 90 s recovery between each — work at lactate threshold' },
        { name: 'Fartlek 35 min', detail: 'Alternate free accelerations / easy jog based on feel' },
        { name: 'Long run 65 min', detail: 'With 15 min at marathon pace in the second half' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Speed & specific',
      sessions: [
        { name: 'Tempo run 45 min', detail: 'Half-marathon pace held continuously — controlled effort' },
        { name: 'Track session 12×400 m', detail: '5K target pace, 200 m jog recovery between each rep' },
        { name: '12-min Cooper test', detail: 'Max run over 12 min to assess VO2max progress' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Sharpening & racing',
      sessions: [
        { name: 'Volume reduction −30%', detail: 'Lower the mileage but keep the paces — active recovery' },
        { name: 'Strides 8×100 m', detail: 'Progressive accelerations to stay sharp before the race' },
        { name: 'Race day simulation', detail: 'Warm-up + 20 min at target pace + cool-down' },
      ],
    },
  ],
  faq: [
    { q: 'How often should I run per week?', a: 'Beginner: 3 sessions. Intermediate: 4–5 sessions. Advanced: 5–6 sessions with one full rest day. Quality beats quantity.' },
    { q: 'How do I avoid knee pain?', a: 'Strengthen your glutes and hamstrings (squats, lunges), work on your cadence (aim for 175 steps/min) and favor soft surfaces at first.' },
    { q: 'Should I run fasted to burn more fat?', a: 'Fasted running improves fat usage but reduces performance. Recommended only for easy runs (< 45 min) in Zone 2.' },
    { q: 'How long until I can run my first 5K?', a: 'With our beginner program, 8 weeks are enough to run 5K without stopping, whatever your starting fitness.' },
    { q: 'Which shoe should I choose to start?', a: 'Go to a specialty store for a free gait analysis. Favor a well-cushioned shoe if you run on pavement — budget €100–150 minimum.' },
  ],
}

/* ── Strength training ─────────────────────────────────────────── */
const musculationContent: DisciplineContent = {
  tagline: 'Build your physique with surgical precision.',
  heroStat: '3,800+ active members',
  guide: {
    technique: {
      emoji: '💪',
      title: 'Technique & Execution',
      items: [
        'Full range of motion — a parallel squat recruits 40% more muscle fibers',
        'Controlled tempo: 2 s down / 1 s pause / 1 s up to maximize the hypertrophic stimulus',
        'Mind-muscle connection — focus on the target muscle during the exercise',
        'Breathing: exhale on the concentric effort, inhale on the eccentric',
        'Specific warm-up is mandatory: 2–3 light sets before loading heavy',
      ],
    },
    equipment: {
      emoji: '🏋️',
      title: 'Key equipment',
      items: [
        'A lifting belt for heavy loads (squat / deadlift > 80% 1RM)',
        'Weightlifting shoes (flat sole) or low-drop running shoes',
        'Wrist straps for pulling and rowing — protects the tendons long term',
        'Chalk for a better grip on bars and kettlebells',
        'A logbook or the Xenotif® app to track loads and progress',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Nutrition for performance',
      items: [
        'Protein intake: 1.8–2.2 g of protein per kg of body weight per day',
        'Caloric surplus of 200–300 kcal/day for clean, slow muscle gain',
        '4–5 meals/day to keep protein synthesis continuous',
        'Creatine monohydrate: 3–5 g/day — the most scientifically documented supplement',
        'Anabolic window: 40 g of protein within 60 min post-session',
      ],
    },
    recovery: {
      emoji: '😴',
      title: 'Muscle recovery',
      items: [
        'At least 48h of rest per muscle group before training it again',
        '8–9h of sleep — growth hormone is released mainly at night',
        'Deload every 4–6 weeks: cut volume by 40–50% for supercompensation',
        'Massage / roller 15 min post-session on the worked muscles',
        'Cold bath or hot/cold contrast to speed up metabolic waste clearance',
      ],
    },
  },
  tips: [
    { icon: '📊', title: 'Progressive overload', body: 'Add load or reps every week — even 500 g more on the bar over a year is 26 kg gained on your squat.' },
    { icon: '🔬', title: 'Hypertrophy vs strength', body: 'Strength: 1–5 reps at 85–100% 1RM. Hypertrophy: 6–12 reps at 65–80% 1RM. Vary the protocols every month.' },
    { icon: '⏱️', title: 'Optimal rest time', body: 'Hypertrophy: 60–90 s. Max strength: 3–5 min. Shortening rest is not more effective — it\'s less effective.' },
    { icon: '🎯', title: 'Prioritize compound lifts', body: 'Squat, deadlift, bench press, overhead press and rowing give 80% of the results. Isolation work is the bonus.' },
  ],
  videos: [
    {
      youtubeIds: ['DUuh5wrkLIY', 'tunVzHcch-w'],
      title: 'The ultimate Deadlift tutorial',
      description: 'The perfect deadlift with Martins Licis (2019 World\'s Strongest Man) — complete technique.',
      duration: '18 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['c5tXZfw0nCU', 'LSKZhPM5cDY'],
      title: 'Squat, Deadlift, Bench — Enough?',
      description: 'Are the 3 basic lifts enough to build muscle? The truth about compound exercises.',
      duration: '14 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['gNdZuaYZz7E'],
      title: 'Deadlift — complete tutorial',
      description: 'A full deadlift guide: starting position, flat back, lockout and variations depending on the goal.',
      duration: '16 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['KzBvZ0KZ27k'],
      title: 'Best bench press program',
      description: 'How to build an effective bench press program — progression, variations and mistakes to avoid.',
      duration: '17 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['pxls2vBxFVs'],
      title: 'Perfect bench press technique',
      description: 'Master bench press technique from A to Z — grip, arch, bar path and explosiveness.',
      duration: '14 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['h--woXuXXmk'],
      title: 'SBD for beginners — Squat, Bench, Deadlift',
      description: 'Introduction to the three fundamental strength lifts — everything a beginner needs to know.',
      duration: '20 min',
      level: 'Beginner',
    },
  ],
  exercises: [
    { name: 'Barbell squat', muscles: 'Quads, glutes, hamstrings, back', sets: '4×8', difficulty: 'All levels', description: 'Bar in high-bar position, feet shoulder-width. Descend to parallel keeping the knees tracking over the feet. The king of strength exercises.' },
    { name: 'Deadlift', muscles: 'Whole back, glutes, hamstrings, traps', sets: '4×5', difficulty: 'Intermediate', description: 'Grip the bar overhand, flat back, hips low. Push through the floor and pull to full extension. A fundamental movement for total-body strength.' },
    { name: 'Bench press', muscles: 'Pecs, triceps, front delts', sets: '4×8', difficulty: 'All levels', description: 'Lying on the bench, bar at chest level. Press vertically without bouncing. The reference exercise for building the chest and triceps.' },
    { name: 'Pull-ups', muscles: 'Lats, biceps, rhomboids', sets: '4×AMRAP', difficulty: 'Intermediate', description: 'Hanging from the bar, overhand grip. Pull until your chin is above the bar. The best exercise for back thickness and width.' },
    { name: 'Overhead press', muscles: 'Shoulders, triceps, traps', sets: '4×8', difficulty: 'Intermediate', description: 'Bar at collarbone level, press vertically to full extension. Push your head through at the top for a safe lockout.' },
    { name: 'Romanian deadlift', muscles: 'Hamstrings, glutes, lower back', sets: '3×10', difficulty: 'Intermediate', description: 'Bar held in front of the thighs, hinge forward keeping a flat back and slightly bent knees. Excellent for hamstring hypertrophy.' },
    { name: 'Dips', muscles: 'Pecs, triceps, front delts', sets: '3×12', difficulty: 'Intermediate', description: 'Support on parallel bars, lower until the arms reach 90°, press up without hyperextending the elbows. Add weight when it gets too easy.' },
    { name: 'Barbell row', muscles: 'Lats, rhomboids, biceps, traps', sets: '4×8', difficulty: 'Advanced', description: 'Hinged at 45°, bar from the floor, pull to the lower chest. Back volume is essential for a thick back and balanced musculature.' },
    { name: 'Leg press', muscles: 'Quads, glutes, calves', sets: '3×12', difficulty: 'Beginner', description: 'On the leg press machine: feet shoulder-width, lower to 90° then press. Ideal to add leg volume without loading the spine.' },
    { name: 'Face pull', muscles: 'Rear delts, rotator cuff, rhomboids', sets: '3×20', difficulty: 'All levels', description: 'High pulley, pull the rope toward the face while spreading the hands. Essential for shoulder health and to balance bench-press volume.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Learning technique',
      sessions: [
        { name: 'Push A: Chest + Shoulders', detail: 'Bench press 4×8, OHP 3×10, Dips 3×12, Lateral raises 3×15' },
        { name: 'Pull A: Back + Biceps', detail: 'Deadlift 4×5, Pull-ups 4×AMRAP, Barbell row 3×10, Curls 3×12' },
        { name: 'Legs: Quads + Hamstrings', detail: 'Squat 4×8, Romanian DL 3×10, Leg press 3×12, Calves 4×15' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Hypertrophy — Progressive overload',
      sessions: [
        { name: 'Push B: High volume', detail: 'Incline 4×10, Weighted dips 3×8, Cable fly 3×15, Overhead DB 4×12' },
        { name: 'Pull B: Back width focus', detail: 'Weighted pull-ups 4×6, Seated row 4×12, Face pull 3×20, Hammer curl 3×15' },
        { name: 'Legs B: Strength + Volume', detail: 'Heavy squat 5×5, Hack squat 3×12, Leg extension 3×15, GHR 3×10' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Intensification — Strength test',
      sessions: [
        { name: 'Full body strength', detail: 'Squat 5×3, Bench 5×3, Deadlift 5×3 — maximal loads with full rest' },
        { name: 'Full body hypertrophy', detail: 'Antagonist supersets, 4×12, 60 s rest — high total volume' },
        { name: 'AMRAP check', detail: 'Max-reps test at 75% 1RM on squat / bench / deadlift — measure progress' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Deload & Rebuild',
      sessions: [
        { name: 'Volume reduced −40%', detail: 'Same exercises, light loads — recovery of tendons and nervous system' },
        { name: 'Mobility + core', detail: 'Yoga-strength, scapular work, plank and anti-rotation' },
        { name: '1RM test day', detail: '1-rep-max assessment on squat, bench and deadlift to set the next cycle' },
      ],
    },
  ],
  faq: [
    { q: 'How many times per week should I train?', a: '3–4 sessions/week are enough for 90% of strength goals. More is not always better — recovery is as important as the stimulus.' },
    { q: 'Do I need supplements?', a: 'Not mandatory. Creatine and whey protein are the only supplements scientifically validated for performance. Prioritize nutrition first.' },
    { q: 'How long before I see results?', a: 'The first neurological changes (strength) appear in 2–3 weeks. Visible muscle changes take 6–12 weeks depending on genetics and nutrition.' },
    { q: 'How do I avoid plateaus?', a: 'Vary the exercises, volume, intensity and rest times. Our Xenotif® AI automatically adjusts your program to prevent adaptation.' },
    { q: 'Can you build muscle and lose fat at the same time?', a: 'Yes, when you\'re a beginner or after a long break (body recomposition). It requires high protein intake and a slight caloric deficit of 100–200 kcal.' },
  ],
}

/* ── HIIT ──────────────────────────────────────────────────────── */
const hiitContent: DisciplineContent = {
  tagline: 'Burn 500 kcal in 25 minutes. Scientifically proven.',
  heroStat: '2,100+ active members',
  guide: {
    technique: {
      emoji: '⚡',
      title: 'HIIT principles',
      items: [
        'Work/rest ratio: 1:1 for beginners (20 s work / 20 s rest), 2:1 for advanced',
        'Target intensity: 85–95% HRmax during the work phases — otherwise it isn\'t HIIT',
        'Prioritize compound exercises: burpees, squat jumps, mountain climbers, sprints',
        'Recommended total time: 15–25 min — longer sessions are not more effective',
        'EPOC (afterburn) keeps burning calories 24–48h after a good HIIT session',
      ],
    },
    equipment: {
      emoji: '🏃',
      title: 'Required gear',
      items: [
        'Zero equipment needed — bodyweight HIIT is as effective as the gym',
        'Gym option: rower, assault bike, TRX to vary the stimuli',
        'A heart-rate monitor to make sure you stay in the right intensity zone',
        'A floor mat for ground exercises (burpees, mountain climbers)',
        'A timer app (Interval Timer) — Xenotif® includes preset HIIT timers',
      ],
    },
    nutrition: {
      emoji: '🍌',
      title: 'HIIT nutrition',
      items: [
        'Light snack 30–60 min before: banana, toast with almond butter',
        'Avoid heavy meals within 2h before a session — risk of nausea',
        'Hydration is critical: 500 ml of water before, drink during if the session is > 20 min',
        'Post-HIIT: carbs + protein combo within 30 min (whey shake + fruit)',
        'Caffeine (black coffee, pre-workout) improves HIIT performance by 10–15%',
      ],
    },
    recovery: {
      emoji: '🧘',
      title: 'Recovery between sessions',
      items: [
        'Maximum 3–4 HIIT sessions / week — alternate with easy days',
        'Cool-down 5–10 min of walking + dynamic stretching post-session',
        'Daily HIIT leads to overtraining in 2–3 weeks — respect your off days',
        'Sleep quality is essential: late HIIT (< 3h before bed) disrupts sleep',
        'Cold bath 10 min or cold shower right after the session — reduces inflammation',
      ],
    },
  },
  tips: [
    { icon: '🔥', title: 'The EPOC effect', body: 'A 20-min HIIT session burns as many calories as a 45-min run — and keeps burning 24h later thanks to the EPOC afterburn.' },
    { icon: '📈', title: 'Progression is mandatory', body: 'Start at 30 s/30 s × 8 rounds. Increase the rounds before increasing the intensity. Too fast = injury or burnout.' },
    { icon: '🎵', title: 'Music boosts you by 15%', body: 'A rhythmic playlist at 140–160 BPM significantly improves HIIT performance. Preload your playlist before each session.' },
    { icon: '🧪', title: 'Vary the protocols', body: 'Tabata (20/10), EMOM, Pyramid, AMRAPs — alternating formats prevents adaptation and breaks plateaus.' },
  ],
  videos: [
    {
      youtubeIds: ['5C8Ew76sxVY'],
      title: '20-min HIIT — Total fat burner',
      description: 'A beginner HIIT session with no equipment — burn fat, build endurance, improve fitness.',
      duration: '20 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['J8EeluUr4ak'],
      title: 'Low-impact HIIT — Full body',
      description: 'A 20-min low-intensity HIIT, no jumping — ideal to get started or protect your joints.',
      duration: '20 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['fIuACtB2ZZs'],
      title: '20-min HIIT — No equipment',
      description: 'A complete HIIT workout for beginners — bodyweight, full body, fast results.',
      duration: '20 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['V4MqB6q3w44'],
      title: 'Tabata 24 min — Advanced level',
      description: 'An intense Tabata session for seasoned athletes — 24 minutes of high-intensity work.',
      duration: '24 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['1u5eO7AvPjk'],
      title: 'Full Body Tabata 24 min',
      description: 'A complete Tabata circuit: full body, 24 minutes, no equipment — burns calories and boosts cardio.',
      duration: '24 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['aoKrGARP634'],
      title: 'Tabata + Strength 42 min',
      description: 'A combination of Tabata and strength training in 42 minutes — the best of both worlds for fitness.',
      duration: '42 min',
      level: 'Advanced',
    },
  ],
  exercises: [
    { name: 'Burpees', muscles: 'Full body, cardio', sets: '3×15', difficulty: 'Intermediate', description: 'From standing, drop into a squat, place the hands, kick the legs back to a push-up position, do a push-up, bring the feet back, jump. The ultimate HIIT exercise.' },
    { name: 'Mountain climbers', muscles: 'Abs, hip flexors, cardio', sets: '3×30 s', difficulty: 'Beginner', description: 'High plank position, drive the knees toward the chest alternately at maximum speed. Keep the hips stable and low.' },
    { name: 'Squat jumps', muscles: 'Quads, glutes, explosive cardio', sets: '3×15', difficulty: 'Intermediate', description: 'Squat to 90° then explode upward jumping, arms driving up. Land softly with bent knees. Builds power and cardio at the same time.' },
    { name: 'High knees', muscles: 'Hip flexors, cardio', sets: '3×30 s', difficulty: 'Beginner', description: 'Run in place driving the knees to hip height. Arms in rhythm at 90°. A great HIIT warm-up or cardio intensifier.' },
    { name: 'Ice skaters', muscles: 'Glutes, abductors, cardio coordination', sets: '3×20/side', difficulty: 'Intermediate', description: 'Jump laterally from one foot to the other mimicking a skater. Touch the floor with the hand opposite the supporting foot. Works lateral movement and cardio.' },
    { name: 'Clapping push-ups', muscles: 'Pecs, triceps, explosiveness', sets: '3×10', difficulty: 'Advanced', description: 'Explosive push-up with a hand clap in the air before landing. Requires a solid base of regular push-ups. Builds upper-body power.' },
    { name: 'Box jumps', muscles: 'Quads, calves, explosive cardio', sets: '4×10', difficulty: 'Intermediate', description: 'Jump onto a box, absorb in a half-squat. Step down on the outside. Progressive height: 40, 50, 60, 70 cm depending on level.' },
    { name: 'Dynamic plank', muscles: 'Abs, shoulders, core', sets: '3×30 s', difficulty: 'Intermediate', description: 'From a high plank, lower onto the forearms and back up alternating arms. Keep the hips stable and avoid rotating the pelvis.' },
    { name: '30 m sprint', muscles: 'Max cardio, quads, calves', sets: '10×30 m', difficulty: 'Advanced', description: 'Sprint at 100% of max speed over 30 meters. Full recovery (90 s) between each. Builds anaerobic power and top speed.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Initiation — Discovering intensity',
      sessions: [
        { name: 'Tabata intro 4×4 min', detail: 'Squat, mountain climber, jumping jack, plank — 20 s active / 10 s rest' },
        { name: 'AMRAP circuit 15 min', detail: '5 burpees + 10 squat jumps + 15 mountain climbers — as many rounds as possible' },
        { name: 'Active recovery', detail: 'Brisk walk 30 min + mobility yoga 15 min' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Progression — Intensity 85% HRmax',
      sessions: [
        { name: 'EMOM 20 min', detail: 'Every minute: 10 burpees + 15 squat jumps — finish before the minute is up' },
        { name: 'Pyramid HIIT', detail: '30/30 → 40/20 → 50/10 → 40/20 → 30/30 — 3 full cycles' },
        { name: 'Sprint pyramid', detail: '10-20-30-40-30-20-10 m sprints with full recovery between each' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Performance — Pushing limits',
      sessions: [
        { name: 'Death by burpees', detail: 'Minute 1: 1 burpee. Minute 2: 2 burpees. Continue until you can\'t keep the pace' },
        { name: 'Partner WOD', detail: '3 rounds: 50 squat jumps + 40 push-ups + 30 sit-ups + 20 burpees — in pairs' },
        { name: 'HIIT VO2max test', detail: 'Yo-Yo level 1 protocol — cardio assessment to fine-tune your work zones' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Maintenance & Consolidation',
      sessions: [
        { name: '"Best of" circuit', detail: 'Your 3 favorite exercises from previous weeks — 5 rounds at max intensity' },
        { name: 'Active recovery week', detail: 'Volume reduced by 50% — maintain fitness without overload' },
        { name: 'Performance check', detail: 'Cooper test + Tabata test + body measurements — overall assessment' },
      ],
    },
  ],
  faq: [
    { q: 'Is HIIT effective for losing weight?', a: 'Yes — the combination of high caloric expenditure + EPOC afterburn makes it one of the best tools for losing body fat, especially abdominal fat.' },
    { q: 'Can you do HIIT every day?', a: 'No — the body needs 48h to recover from a true HIIT session. 3–4 sessions/week with active rest days is the recommended maximum.' },
    { q: 'Is HIIT suitable for beginners?', a: 'Yes, as long as you start with gentle protocols (30 s/30 s) and low-impact exercises (no jumping). Our beginner program is progressive over 4 weeks.' },
    { q: 'How many calories does a HIIT session burn?', a: 'Between 300 and 600 kcal for 20–30 min depending on weight and intensity — more than 45 min of running thanks to EPOC.' },
  ],
}

/* ── Cycling ───────────────────────────────────────────────────── */
const cyclismeContent: DisciplineContent = {
  tagline: 'From road racer to mountain climber — a plan for every wheel.',
  heroStat: '1,500+ active cyclists',
  guide: {
    technique: {
      emoji: '🚴',
      title: 'Pedaling technique',
      items: [
        'Optimal cadence: 85–95 RPM on the flats, 70–80 RPM uphill',
        'Bike position: have your fit checked by a professional every few years',
        'Push AND pull — think of "scraping" at the bottom of the pedal stroke to maximize power',
        'Aero position: lower the torso gradually — every 5 cm saves 20–30 W of drag',
        'Shift gears before the hill — never while pushing hard in the gear',
      ],
    },
    equipment: {
      emoji: '⚙️',
      title: 'Performance equipment',
      items: [
        'A power meter — the most accurate tool to quantify training (from €400)',
        'A heart-rate monitor (chest strap more accurate than the wrist)',
        'A certified aero helmet + UV-protection glasses',
        'SPD-SL shoes with aligned cleats — avoids knee pain',
        'A connected indoor trainer (Tacx, Wahoo) for winter indoor training',
      ],
    },
    nutrition: {
      emoji: '🍝',
      title: 'Long-distance nutrition',
      items: [
        'Carb loading D-2 and D-1 before a race: pasta, rice, bread',
        'On the bike: 60–90 g of carbs/hour on efforts > 90 min (gel + drink + bars)',
        'Homemade isotonic drink: 500 ml water + 30 g maltodextrin + 1 g salt + lemon juice',
        'Bottles of 750 ml minimum — 2% dehydration cuts power by 10%',
        'Recovery: rice + chicken or pasta + tuna within 30 min after a long effort',
      ],
    },
    recovery: {
      emoji: '🔧',
      title: 'Recovery and maintenance',
      items: [
        'Easy spin 20–30 min the day after an intense effort — active circulation',
        'Leg massage: focus on the quads, hamstrings, calves and glutes',
        'Elevate the legs 15 min after a long ride to reduce swelling',
        'Cyclist recovery nutrition: 4:1 carb/protein ratio in the first hour',
        'Service the bike after every rainy ride: chain, brakes, rims',
      ],
    },
  },
  tips: [
    { icon: '📡', title: 'Train by zones', body: 'Zone 2 (65–75% FTP) for 80% of the volume — the zone pros call "the path to performance." Underrated by 95% of amateurs.' },
    { icon: '🧱', title: 'FTP is your compass', body: 'Test your FTP (functional threshold power) every 4–6 weeks with an all-out 20-min test. All your zones flow from it.' },
    { icon: '🌬️', title: 'Aerodynamics rule', body: 'On the flat at 35 km/h, 80% of the resistance is aerodynamic. Lower your torso before buying a carbon wheel.' },
    { icon: '🏔️', title: 'Climb in watts', body: 'On a climb, aim for a constant W/kg ratio — avoid surges that drain your reserves. A steady effort is always more economical.' },
  ],
  videos: [
    {
      youtubeIds: ['NnFGvxDoutY', 'oTZh4uyfxQA'],
      title: 'FTP and cycling training zones',
      description: 'The basics of structured cycling — FTP, power zones and how to use them to progress.',
      duration: '18 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['TTGkXtfzUxk', 'IvhYkLSm_pQ'],
      title: 'Zones 1 to 7 — Setup & full guide',
      description: 'Setting up and using your power zones with a meter — a complete practical guide.',
      duration: '22 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['IKhK5RQ2RXI', 'D0rZ1ecC8c0'],
      title: 'Training zones — Understand it all',
      description: 'What zones are, why to use them and how they transform amateur cycling.',
      duration: '20 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['5e5qS3t17gg', '2BQD-khdL1Y'],
      title: 'HIIT Indoor Cycling — Zwift workout',
      description: 'An indoor HIIT session on the trainer — interval training structure with Zwift.',
      duration: '30 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['_NQE6XbcTcA', 'tX_b-hkCEAA'],
      title: 'Getting started with indoor cycling',
      description: 'A complete guide to starting indoor cycling — gear, setup, first structured sessions.',
      duration: '16 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['17HZsFrbZLs', 'Z5tTDRfbs50'],
      title: 'Indoor cycling — 30-min intervals',
      description: 'A 30-minute session with progressive intervals on the indoor bike — perfect to progress quickly.',
      duration: '30 min',
      level: 'Intermediate',
    },
  ],
  exercises: [
    { name: 'Single-leg pedaling', muscles: 'Quads, glutes, pedaling technique', sets: '3×2 min/leg', difficulty: 'All levels', description: 'Pedal with one leg only for 2 minutes, the other resting on the frame. Reveals weak points in the pedal stroke and corrects power asymmetries.' },
    { name: '30 s bike sprints', muscles: 'Anaerobic power, quads, calves', sets: '8×30 s', difficulty: 'Intermediate', description: 'Maximal sprint for 30 seconds, 4 min easy-spin recovery. Builds top-end power and the ability to accelerate in the finale.' },
    { name: 'Sweet spot 2×20 min', muscles: 'Threshold endurance, cardio-respiratory', sets: '2×20 min', difficulty: 'Intermediate', description: 'Pedal at 88–95% of your FTP for 20 minutes with 5 min rest between. The best benefit/fatigue ratio for cycling progress.' },
    { name: 'Cadence drills 100+ RPM', muscles: 'Technique, muscular efficiency', sets: '5×3 min', difficulty: 'Beginner', description: 'Pedal at high cadence (100+ RPM) in a light gear for 3 min. Improves pedal-stroke smoothness and reduces knee load.' },
    { name: 'Bulgarian squat (cross-training)', muscles: 'Quads, glutes, stability', sets: '3×10/leg', difficulty: 'Intermediate', description: 'Back foot on a bench, descend into a deep lunge. Strengthens the legs asymmetrically and corrects the left/right imbalances common in cycling.' },
    { name: 'Plank core', muscles: 'Core, lumbar stability', sets: '3×45 s', difficulty: 'Beginner', description: 'Support on the forearms and toes, body in a straight line. A strong core lets you transfer leg power efficiently on the bike.' },
    { name: 'Hip-flexor stretch', muscles: 'Psoas, hip flexors', sets: '3×60 s/side', difficulty: 'All levels', description: 'In a low lunge, hold the position while lengthening the psoas. Shortened hip flexors from cycling reduce power and increase low-back pain risk.' },
    { name: 'Climbing intervals 5 min', muscles: 'Power-to-weight, threshold cardio', sets: '5×5 min', difficulty: 'Advanced', description: 'On a real or simulated climb (gradient > 5%), hold a cadence of 70–75 RPM at 95–100% FTP. Builds the power-to-weight ratio essential for climbing.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Aerobic base',
      sessions: [
        { name: 'Z2 endurance 90 min', detail: '90 RPM cadence, HR 65–75% HRmax — don\'t exceed the zone' },
        { name: 'VO2max intervals 4×8 min', detail: 'At 106–120% FTP, 4 min recovery between each — VO2max development' },
        { name: 'Active recovery 60 min', detail: 'Very easy Z1 spin to boost circulation without fatigue' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Threshold & Sweet spot',
      sessions: [
        { name: 'Sweet spot 2×20 min', detail: 'At 88–95% FTP with 5 min rest — the optimal benefit/fatigue ratio' },
        { name: 'Cadence drills', detail: 'Alternate 100+ RPM / 60 RPM every 3 min over 60 min total' },
        { name: 'Simulated gran fondo 3h', detail: 'Long ride with 40 min of sweet spot built in — race-specific endurance' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'High intensification',
      sessions: [
        { name: 'VO2max 5×5 min', detail: '110–120% FTP, 5 min recovery — raises the aerobic ceiling' },
        { name: 'Neuromuscular sprints 10×10 s', detail: 'Maximal power, full 5 min recovery — sprint-power development' },
        { name: 'FTP test 20 min', detail: 'Maximal sustained 20-min effort — recalibration of all zones' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Tapering & Performance',
      sessions: [
        { name: 'Volume −30%, intensity kept', detail: 'Reduce volume but not intensity — supercompensation' },
        { name: 'Race-pace intervals 3×10 min', detail: 'Race-speed simulation — mentally and physically ready' },
        { name: 'Easy ride 2h', detail: 'Scenery, fun, free legs — arrive fresh on race day' },
      ],
    },
  ],
  faq: [
    { q: 'Indoor or outdoor — which is more effective?', a: 'Indoor (trainer) is more effective per training hour because there\'s no dead time (lights, descents). Outdoor is better for technique and motivation. Combining both is ideal.' },
    { q: 'What power do I need to start racing?', a: 'A W/kg of 2.5–3 is enough to start sportives. With 6 months of structured training, reaching 3–3.5 W/kg is achievable.' },
    { q: 'How many hours per week to progress?', a: 'A minimum of 8h/week for meaningful progress. Pros do 20–25h. In between, 12–15h is the competitive-amateur sweet spot.' },
    { q: 'Do I need an indoor trainer in winter?', a: 'Highly recommended — winter is the ideal time to build the aerobic base (Z2) without the dangers of the road. Zwift or RGT make indoor riding motivating.' },
  ],
}

/* ── Swimming ──────────────────────────────────────────────────── */
const natationContent: DisciplineContent = {
  tagline: 'Technique, efficiency, performance — the water never lies.',
  heroStat: '900+ active swimmers',
  guide: {
    technique: {
      emoji: '🏊',
      title: 'Swimming technique',
      items: [
        'Hydrodynamic position: head in line with the body, gaze toward the bottom of the pool',
        'Hip rotation of 45° on each arm stroke — the main source of power',
        'Maximum arm extension before the hand enters the water — "reach the wall with your fingertips"',
        'Legs: small fast kicks from the hips, knees slightly bent',
        'Flip-turn: touch the wall at 1 m, somersault, explosive push-off — saves 2–3 s / 100 m',
      ],
    },
    equipment: {
      emoji: '🥽',
      title: 'Swimming gear',
      items: [
        'Anti-fog goggles fitted to your face shape',
        'A silicone cap to reduce drag and protect the hair',
        'A pull-buoy between the thighs for arm-only sets',
        'Hand paddles to strengthen the catch and improve arm technique',
        'A swim watch (Garmin Swim) to track laps, SWOLF and times',
      ],
    },
    nutrition: {
      emoji: '💧',
      title: 'Hydration and nutrition',
      items: [
        'Water dulls the sensation of thirst — drink actively even without feeling thirsty',
        'Main meal 2h before the session: slow carbs + light protein',
        'Water bottle or isotonic drink at the poolside for sessions > 60 min',
        'Fasted sessions are not recommended for swimming — stable blood sugar is essential',
        'Post-swim: fast protein (whey) + simple carbs within 30 min',
      ],
    },
    recovery: {
      emoji: '♨️',
      title: 'Aquatic recovery',
      items: [
        'Slow swim 200–400 m cool-down at the end of the session — venous-muscular return',
        'Stretch the shoulders and pecs — the areas most used in freestyle',
        'Jacuzzi or hot bath post-session to relax the back and shoulder muscles',
        'Massage the shoulders and neck 2× /week — rotator-cuff tendinitis prevention',
        'At least 24h between two intense sessions — the breathing muscles need recovery too',
      ],
    },
  },
  tips: [
    { icon: '📐', title: 'SWOLF is your ally', body: 'SWOLF = time (seconds) + number of strokes per length. Lowering your SWOLF score means you\'re more efficient — better than watching the clock.' },
    { icon: '🌊', title: 'Resistance changes everything', body: 'Water is 800× denser than air. A minor technical improvement (entry angle, rotation) can save 5–10 s per 100 m without any fitness gain.' },
    { icon: '🎯', title: 'Targeted drills', body: 'Spend 20–30% of each session on technical drills (catch-up, finger drag, high elbow) — more effective than swimming hard for an hour.' },
    { icon: '🤿', title: 'Underwater video', body: 'Film yourself (or get filmed) underwater once a month. Self-analysis reveals flaws invisible on a stopwatch.' },
  ],
  videos: [
    {
      youtubeIds: ['6_vXycbD2TM', 'WciCYtnGbkM'],
      title: 'Learn freestyle — Step by step',
      description: 'A complete freestyle guide for beginners: body position, arm movement, breathing and legs.',
      duration: '22 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['OAvy6-XiYng', 'AQy_c30lNjI'],
      title: 'Freestyle technique — Masterclass',
      description: 'A detailed analysis of front-crawl technique by a federally certified coach.',
      duration: '18 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['DUpfLigoWEc', '0BELcjhKOlc'],
      title: 'Beginner freestyle — Learn fast',
      description: 'A fast method to master freestyle — the most common mistakes corrected in one video.',
      duration: '16 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['K5RMFjHBPHE'],
      title: 'The 4 best backstroke drills',
      description: 'Four targeted exercises to improve your backstroke technique — rotation, arm entry, position.',
      duration: '12 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['WiMMuE7P7P4'],
      title: '3 essential breaststroke drills',
      description: 'Three key exercises to perfect your breaststroke — arm-leg coordination, glide and timing.',
      duration: '10 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['aU7sdctpxck'],
      title: 'Master the backstroke — 6 drills',
      description: 'Six progressive exercises to master the backstroke from the basics to advanced levels.',
      duration: '18 min',
      level: 'Advanced',
    },
  ],
  exercises: [
    { name: 'Catch-up freestyle drill', muscles: 'Shoulders, lats, arm technique', sets: '6×50 m', difficulty: 'All levels', description: 'Swim waiting for the lead hand to touch the other before starting the next arm. Improves arm extension and hip rotation.' },
    { name: 'Kickboard legs', muscles: 'Ankle flexors, quads, kick technique', sets: '4×25 m', difficulty: 'Beginner', description: 'Hold the kickboard in front of you at arm\'s length and work the legs only. Small fast kicks from the hips, knees slightly bent.' },
    { name: 'Pull-buoy arms', muscles: 'Shoulders, lats, pecs', sets: '4×50 m', difficulty: 'Beginner', description: 'Pull-buoy between the thighs, work the arms only. Maximum focus on the pull in the water and the catch at the top of the stroke.' },
    { name: 'Isolated flip-turn', muscles: 'Turn technique, abs', sets: '3×10 turns', difficulty: 'Intermediate', description: 'Approach the wall at 1 m, perform the full somersault and push hard off the wall. Practice the turns out of the water first. Can save 2–3 s per 100 m.' },
    { name: 'Intervals 10×100 m', muscles: 'Aerobic endurance, cardio-respiratory', sets: '10×100 m', difficulty: 'Intermediate', description: 'Swim 100 m at 85% of your max speed, leaving every 2 min. Count your laps and time each 100 m to track consistency.' },
    { name: '50 m sprints', muscles: 'Max speed, arm power', sets: '8×50 m', difficulty: 'Advanced', description: 'Dive or push-off start, sprint at 100% over 50 m. Full 2 min recovery between each. Builds top speed and explosiveness in the water.' },
    { name: 'Swim with paddles', muscles: 'Water-catch strength, shoulders, back', sets: '4×50 m', difficulty: 'Intermediate', description: 'Paddles on the hands to increase the catch surface. Improves strength and feel for the water. Don\'t use for more than 20% of total volume.' },
    { name: 'Slow technical breaststroke', muscles: 'Whole-body coordination, hips, knees', sets: '6×50 m', difficulty: 'All levels', description: 'Very slow breaststroke with emphasis on the glide: after each pull, the arms extend forward and the legs come together — hold the glide at least 2 s.' },
    { name: 'Backstroke', muscles: 'Traps, lats, shoulders, coordination', sets: '4×50 m', difficulty: 'Beginner', description: 'On your back, arm entry in line with the shoulder, hip rotation at 45°. Gaze toward the ceiling, ears in the water. Works back/arm coordination.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Freestyle technique',
      sessions: [
        { name: 'Drills session 1,500 m', detail: 'Warm-up 400 m + 6×100 m drills (catch-up, 6-3-6, finger drag) + 400 m cool-down' },
        { name: 'Backstroke technique', detail: 'Amplitude + hip rotation + arm entry work — 1,200 m total' },
        { name: 'Freestyle endurance 2,000 m', detail: 'Continuous at a comfortable pace — focus on stroke consistency' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Speed and intervals',
      sessions: [
        { name: 'Intervals 10×100 m', detail: 'At 85% max speed, leaving every 2 min — aerobic-threshold work' },
        { name: 'Breaststroke technique', detail: 'Undulation + arm-leg-glide coordination — 1,000 m technique + 500 m free' },
        { name: 'Open-water simulation', detail: 'Swim in the pool without touching the lanes: sighting + simulated mass start' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Performance',
      sessions: [
        { name: '50 m sprints × 20', detail: 'Leaving every 90 s — power and swim speed over short distance' },
        { name: 'Triathlon set 3 × 750 m', detail: 'With simulated poolside transitions — triathlon preparation' },
        { name: '1,500 m time trial', detail: 'Continuous all-out swim — compare with week 1 to measure progress' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Tapering & Open water',
      sessions: [
        { name: 'Volume −25% + short sprints', detail: 'Keep the sharpness without accumulating fatigue — freshness for race day' },
        { name: 'Real open-water session', detail: 'Lake or sea: sighting, cold water, buoys — real-condition simulation' },
        { name: '400 m benchmark test', detail: 'All-out 400 m freestyle time trial — final performance reference of the cycle' },
      ],
    },
  ],
  faq: [
    { q: 'My legs sink — how do I fix it?', a: 'Sinking legs often come from a head held too high or a kick that\'s too powerful. Work the "torpedo" drill (arms by your sides, head in the water) to correct the position.' },
    { q: 'How often should I swim to progress?', a: '3 sessions/week minimum for visible technical progress. Swimming is a very technical activity — repetition is key.' },
    { q: 'I get tired after 50 m — is that normal?', a: 'Yes for a beginner — it\'s a technical problem, not a physical one. Work first on bilateral breathing and relaxing in the water. Fitness comes after.' },
    { q: 'Does swimming help for other sports?', a: 'Yes — it develops lung capacity, shoulder mobility and body awareness. An excellent complement for running, cycling and active recovery.' },
  ],
}

/* ── CrossFit ──────────────────────────────────────────────────── */
const crossfitContent: DisciplineContent = {
  tagline: 'Forged in fire. Tested every day.',
  heroStat: '1,800+ active athletes',
  guide: {
    technique: {
      emoji: '🏋️',
      title: 'Fundamental movements',
      items: [
        'The 9 fundamental CrossFit movements must be mastered before loading heavy',
        'Snatch and Clean & Jerk: technical work alone for at least 4–6 weeks before adding weight',
        'Gymnastic skills: strict pull-ups before, kipping after — strength precedes the kip',
        'Box jumps: land on the box, step down on the outside (knee safety)',
        'Double-unders: be patient — 3–6 months to master, but worth every missed attempt',
      ],
    },
    equipment: {
      emoji: '🔗',
      title: 'CrossFit equipment',
      items: [
        'Versatile shoes (Nike Metcon, Reebok Nano) — a compromise between stability and running',
        'An Olympic belt for deadlifts and heavy overhead movements',
        'Grip pads or hand guards for kipping bars — blister prevention',
        'A speed jump rope (steel cable) for double-unders',
        'Loose chalk — essential for barbell workouts and loaded pull-ups',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Fuel for CrossFit',
      items: [
        'CrossFit is anaerobic-aerobic: fast carbs before the WOD (banana, rice)',
        'Protein 2 g/kg/day — post-WOD muscle rebuilding is intense',
        'Creatine 5 g/day — measurable improvements on power movements',
        'Beta-alanine for long WODs (> 10 min) — reduces muscle acidosis',
        'Hydration: weigh before/after — each kg lost = 1L of water to replace',
      ],
    },
    recovery: {
      emoji: '🏥',
      title: 'CrossFit recovery',
      items: [
        'Cool-down is mandatory: 10 min mobility + 5 min breathing after every intense WOD',
        'Ice on sensitive joints (wrists, shoulders, knees) post-workout',
        'Foam rolling on the muscle-guarding areas: chest, hips, hamstrings',
        'Maximum 2 consecutive days without rest — CrossFit breaks down as much as it builds',
        'Sleep: IGF-1 (insulin-like growth factor) requires at least 7.5h of restorative sleep',
      ],
    },
  },
  tips: [
    { icon: '🎯', title: 'Scale smartly', body: 'There\'s no shame in scaling a WOD. Doing "Fran" in 12 min with adapted loads is more beneficial than suffering 25 min with too much weight.' },
    { icon: '⏱️', title: 'Strategy beats fitness', body: 'Breaking up a WOD (sets of 10 → 7-3, 21s → 12-9) before you fatigue is always faster than going all-out and falling apart.' },
    { icon: '📓', title: 'Log every WOD', body: 'Note your time, loads and notes. Redoing a benchmark WOD knowing the target to beat is the number-one driver of progress.' },
    { icon: '🤝', title: 'The community is the program', body: 'The box effect — training with others — improves performance by 20% on average. Friendly competition is the best pre-workout.' },
  ],
  videos: [
    {
      youtubeIds: ['mLDxJTk6xj8'],
      title: '9 fundamental CrossFit exercises',
      description: 'Master the 9 basic movements before diving into WODs — a guide for complete beginners.',
      duration: '20 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['nJWMnyTaU0Y'],
      title: 'Top 5 beginner benchmark WODs',
      description: 'The 5 reference WODs to know when starting CrossFit — strategy and scaling explained.',
      duration: '15 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['XwmDh9qQtTc'],
      title: '3 no-equipment CrossFit WODs',
      description: 'Three bodyweight CrossFit sessions to do at home — effective, no gear required.',
      duration: '25 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['tCbRldfx7jk'],
      title: 'I tried the Murph WOD',
      description: 'A complete experience report on the Murph WOD — preparation, strategy and how it felt afterward.',
      duration: '18 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['M_ry-0rLRoc'],
      title: 'Murph Hero WOD — Full demonstration',
      description: 'A complete run-through of the Murph WOD with strategy tips, pacing and partitioning to finish it.',
      duration: '22 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['j77_rHevrm4'],
      title: 'Live tips for the Murph',
      description: 'Detailed strategy for the Murph WOD — optimal partitioning, energy management and tips to push through.',
      duration: '20 min',
      level: 'Intermediate',
    },
  ],
  exercises: [
    { name: 'Thrusters', muscles: 'Quads, glutes, shoulders, triceps', sets: '5×5', difficulty: 'Intermediate', description: 'Front-rack squat then overhead press in one continuous movement. The "king" CrossFit exercise — a squat and shoulder press combined.' },
    { name: 'Kipping pull-ups', muscles: 'Lats, biceps, abs', sets: '5×10', difficulty: 'Intermediate', description: 'Pull-up with a body swing to maximize efficiency on long WODs. Master strict pull-ups first before switching to kipping to protect the shoulders.' },
    { name: 'Box jumps', muscles: 'Quads, calves, core, explosiveness', sets: '5×10', difficulty: 'All levels', description: 'Jump onto the box with both feet, absorb in a half-squat, step down on the outside. Start at 40 cm and build up. A CrossFit WOD staple.' },
    { name: 'Snatch technique', muscles: 'Full body, coordination, power', sets: '4×3', difficulty: 'Advanced', description: 'The Olympic snatch — from the bar on the floor to the overhead lockout in one explosive movement. Technical work is essential before loading. Start with the empty bar.' },
    { name: 'Double-unders', muscles: 'Calves, coordination, cardio', sets: '5×50', difficulty: 'Intermediate', description: 'The rope passes twice under the feet on each jump. Jumps slightly higher than singles, very fast wrists. 3–6 months of practice to master.' },
    { name: 'Wall balls', muscles: 'Quads, glutes, shoulders, coordination', sets: '5×15', difficulty: 'Beginner', description: 'Deep squat then throw the medball (9/6 kg) at the target 3 m up. Catch the ball on the way down and chain directly. Builds overall muscular endurance.' },
    { name: 'GHD sit-ups', muscles: 'Abs, hip flexors, back extensors', sets: '3×15', difficulty: 'Advanced', description: 'On the GHD machine, lower to horizontal and come back up using the abs. Start with a small range of motion — intense DOMS for beginners.' },
    { name: 'Muscle-ups', muscles: 'Back, triceps, pecs, coordination', sets: '3×3', difficulty: 'Advanced', description: 'From a hang, combine a pull-up and a dip in one movement to get above the bar. Requires a solid base of pull-ups and dips before progressing toward this goal.' },
    { name: 'Clean & Jerk', muscles: 'Full body, power, Olympic technique', sets: '4×3', difficulty: 'Advanced', description: 'The Olympic clean and jerk in two phases — clean (floor to rack) then jerk (bar overhead). The movement that defines high-level CrossFit. Technique before load.' },
    { name: 'Burpee box jumps', muscles: 'Full body, cardio, explosiveness', sets: '4×10', difficulty: 'Intermediate', description: 'A classic burpee then jump onto the box instead of jumping in the air. Combines burpee endurance and box-jump power. Common in competition WODs.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Technique & Fundamentals',
      sessions: [
        { name: 'Skills: Progressive Snatch', detail: 'Bar only → 40 kg → 60% 1RM — technique first, 45 min + light WOD 10 min' },
        { name: 'WOD: Scaled Fran', detail: '21-15-9: Thrusters (35/25 kg) + Pull-ups — target < 10 min' },
        { name: 'Gymnastic: HSPU drills', detail: 'Wall walk + negative HSPU + pike push-up — 4×5 progressive' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Volume & Intensity',
      sessions: [
        { name: 'WOD: Murph 50%', detail: '50 pull-ups, 100 push-ups, 150 squats + 1 mile run — free partitioning, with vest if possible' },
        { name: 'Barbell cycling 20 min', detail: 'Clean & Jerk: EMOM 3 reps at 70% 1RM — technique under fatigue' },
        { name: 'WOD: Death by pull-ups', detail: 'Minute 1: 1 pull-up. Continue to failure — tests gymnastic endurance' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Benchmarks & Records',
      sessions: [
        { name: 'Benchmark: Grace', detail: '30 Clean & Jerks (60/40 kg) for time — target < 5 min for RX' },
        { name: 'Open WOD simulation', detail: 'Open-style WOD with a 20-min AMRAP structure — competition training' },
        { name: 'Test: Chest-to-bar max unbroken', detail: 'Assess C2B pull-ups, bar muscle-up and TTB — gymnastic baseline' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Peaking & Competition',
      sessions: [
        { name: 'Reduced volume + skills', detail: 'Focus on identified weaknesses — double-unders, pistol squats, snatch balance' },
        { name: 'WOD PR test', detail: 'Redo a WOD from week 1–2 to measure progress — mandatory benchmark' },
        { name: 'Fun community WOD', detail: 'Group WOD, light weight, fun — finish the cycle on good energy' },
      ],
    },
  ],
  faq: [
    { q: 'Is CrossFit dangerous?', a: 'No when well coached. The injury risk in CrossFit is comparable to traditional gym training. Technique always comes before load or speed — scaling is always the right call.' },
    { q: 'Do I need to be fit already to start?', a: 'No — everyone starts CrossFit by scaling. The programming is universal; only the loads and modifications vary by level.' },
    { q: 'How many WODs per week?', a: '3 WODs/week is ideal for beginners. 4–5 for intermediate with a mobility day. Competition-level athletes do 5–6 sessions + active recovery.' },
    { q: 'Does CrossFit help you lose weight?', a: 'Yes — the combination of strength, cardio and variable intensity burns 500–800 kcal/session and generates significant EPOC. Paired with proper nutrition, it\'s very effective.' },
  ],
}

/* ── Yoga ──────────────────────────────────────────────────────── */
const yogaContent: DisciplineContent = {
  tagline: 'Flexibility, inner strength and serenity — on and off the mat.',
  heroStat: '2,900+ active practitioners',
  guide: {
    technique: {
      emoji: '🧘',
      title: 'Technique & Alignment',
      items: [
        'Body alignment: ears, shoulders, hips and ankles in the same axis in standing poses',
        'Ujjayi breathing — slow breath through the nose, throat slightly contracted, synced with each movement',
        'Engage the abdominal bandha (uddiyana) to protect the lower back in flexions and extensions',
        'Postural progression: never force a pose — use blocks and straps to adapt the range',
        'Hold each pose for 5 to 10 breaths — holding over time is more beneficial than depth',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Recommended gear',
      items: [
        'A non-slip mat 4–6 mm (TPE or natural rubber) — essential for stability and joint comfort',
        'Two yoga blocks (cork or foam) to adapt poses to your current flexibility',
        'A yoga strap for forward bends and hip-opening poses',
        'A cylindrical bolster for restorative yoga and passive recovery poses',
        'Fitted, breathable clothing (no baggy clothes that hide your alignment)',
      ],
    },
    nutrition: {
      emoji: '🥗',
      title: 'Nutrition & Hydration',
      items: [
        'Practice fasted or at least 2h after a meal — a full stomach hinders twists and inversions',
        'Gentle hydration: drink 300–400 ml of water before the session, not during active poses',
        'Green tea or ginger-lemon infusion 30 min before practice to aid digestion',
        'Post-session: a light meal rich in plant protein (lentils, quinoa, tofu) for recovery',
        'Avoid refined sugar and alcohol on intensive practice days — they amplify inflammation',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Recovery & Well-being',
      items: [
        'Savasana is mandatory 5–10 min at the end of each session — that\'s when the body integrates the work',
        'Yoga nidra (sleep yoga) 20 min replaces 1h of conventional sleep according to studies',
        'Self-massage the feet and calves with a tennis ball after standing sessions',
        'A warm shower post-practice to release deep muscle tension',
        'A practice journal: note how you feel after each session to track your subtle progress',
      ],
    },
  },
  tips: [
    { icon: '🌬️', title: 'The breath is king', body: 'If you lose control of your breath, you\'ve gone past your limit. The breath guides the pose — never the other way around.' },
    { icon: '📅', title: 'Consistency > Duration', body: '20 minutes every day transform the body in 4 weeks. One hour once a week produces little lasting change.' },
    { icon: '🧠', title: 'Yoga = brain training', body: 'MRI studies show that 8 weeks of regular practice increase the volume of the prefrontal cortex, reducing anxiety by 40%.' },
    { icon: '🔄', title: 'Alternate yin and yang', body: 'Alternate dynamic yoga (vinyasa, ashtanga) and passive yoga (yin, restorative) during the week to balance strengthening and recovery.' },
  ],
  videos: [
    {
      youtubeIds: ['v7AYKMP6rOE', 'e_OolrYHidY'],
      title: 'Beginner yoga — 30 min flow',
      description: 'A complete yoga sequence for beginners — fundamental poses, alignment and breathing guided step by step.',
      duration: '30 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['2zCYsv4f4z0', 'AXcdWvE3GsA'],
      title: 'Vinyasa flow 45 min',
      description: 'An intermediate vinyasa flow — breath-movement link, hip opening and core strengthening.',
      duration: '45 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['4pKly2JojMw', '5bNLz6nlkIo'],
      title: 'Morning yoga — Gentle wake-up',
      description: 'A 20-minute morning sequence to wake the body, activate energy and prepare for the day.',
      duration: '20 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['VaoV1PrYft4', '0Uoe4v1wsjc'],
      title: 'Yin Yoga — Deep opening',
      description: 'A 40-minute yin yoga focused on the hips and lower back — poses held long for the fascia and ligaments.',
      duration: '40 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['pJHRhk7ozlQ'],
      title: 'Power yoga — Advanced level',
      description: 'An advanced yoga sequence with inversions, hand balances and demanding strength poses.',
      duration: '50 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['UEP4HQ7_Eo0', 'x0to9WbMxrg', 'BCfzvOZ7rI4', 'vdMdqZ6slpM'],
      title: 'Evening yoga — Relax & sleep',
      description: 'A 30-minute restorative yoga to decompress, release the tension of the day and promote deep sleep.',
      duration: '30 min',
      level: 'Beginner',
    },
  ],
  exercises: [
    { name: 'Downward dog (Adho Mukha)', muscles: 'Hamstrings, calves, shoulders, back', sets: '5 breaths', difficulty: 'Beginner', description: 'From the plank, push the hips toward the ceiling forming an inverted V. Heels toward the floor, back lengthened. A reference pose that stretches and strengthens at once.' },
    { name: 'Warrior I (Virabhadrasana I)', muscles: 'Quads, glutes, hip flexors', sets: '5–8 breaths/side', difficulty: 'Beginner', description: 'Front foot at 90°, back foot at 45°, front knee over the ankle. Arms raised, shoulders relaxed. Strengthens the legs and opens the chest.' },
    { name: 'Warrior II (Virabhadrasana II)', muscles: 'Quads, glutes, abductors, shoulders', sets: '5–8 breaths/side', difficulty: 'Beginner', description: 'Feet on one line, front knee in line with the foot. Arms horizontal, gaze over the front hand. Builds leg strength and focus.' },
    { name: 'Triangle (Trikonasana)', muscles: 'Hamstrings, obliques, hip flexors', sets: '5 breaths/side', difficulty: 'Intermediate', description: 'Legs wide, torso tilted laterally, lower hand on the shin or floor. A twist that opens the chest. Improves lateral flexibility and balance.' },
    { name: 'Plank (Phalakasana)', muscles: 'Abs, shoulders, glutes, full core', sets: '3×30–60 s', difficulty: 'Beginner', description: 'Body in a straight line, wrists under the shoulders. Engage the abs, glutes and legs. The yoga plank strengthens without compressing the lower back.' },
    { name: 'Crow (Bakasana)', muscles: 'Abs, triceps, forearms, balance', sets: '3×5 breaths', difficulty: 'Advanced', description: 'Squatting, place the knees on the bent arms, tilt the torso forward and lift the feet. Deeply strengthens the core and arms. An iconic balance pose.' },
    { name: 'Child\'s pose (Balasana)', muscles: 'Lower back, glutes, shoulders (stretch)', sets: '1–3 min', difficulty: 'All levels', description: 'Sitting on the heels, extend the arms forward or alongside the body. Fully release the back and shoulders. A rest and recovery pose between sequences.' },
    { name: 'Bridge (Setu Bandha)', muscles: 'Glutes, hamstrings, spine', sets: '3×10 breaths', difficulty: 'Beginner', description: 'Lying on your back, knees bent, push the hips toward the ceiling. Press the feet into the floor. Opens the chest, strengthens the glutes and stretches the spine.' },
    { name: 'Seated twist (Ardha Matsyendrasana)', muscles: 'Obliques, paraspinal muscles, hip', sets: '5 breaths/side', difficulty: 'Intermediate', description: 'Sitting on the floor, one foot placed outside the opposite knee, twist the torso. Detoxifies the abdominal organs and improves thoracic mobility.' },
    { name: 'Tree pose (Vrksasana)', muscles: 'Ankle stabilizers, glutes', sets: '5 breaths/side', difficulty: 'Beginner', description: 'Standing on one leg, the other foot placed on the shin or thigh. Hands in prayer or arms raised. Builds proprioception and mental focus.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Foundations — Basic poses',
      sessions: [
        { name: 'Beginner flow 30 min', detail: 'Sun salutation A × 5, Warriors I & II, downward dog, child\'s pose' },
        { name: 'Yin yoga 40 min', detail: 'Butterfly, half-frog, reclined twist — poses held 3–5 min each' },
        { name: 'Morning yoga 20 min', detail: 'Wake-up sequence: cat-cow, downward dog, low lunges, bridge' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Strengthening & Balance',
      sessions: [
        { name: 'Vinyasa flow 45 min', detail: 'Sun salutation B, Warrior III, triangle, side plank, chaturanga' },
        { name: 'Core yoga 30 min', detail: 'Plank, boat, half-boat, side plank, boat crunches — deep strengthening' },
        { name: 'Restorative yoga 40 min', detail: 'Poses supported by bolster/blocks — release the hips and lower back' },
        { name: 'Seated meditation 15 min', detail: 'Pranayama (5/5 heart coherence) + body scan — mental grounding' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Inversions & Deepening',
      sessions: [
        { name: 'Advanced yoga — inversions 50 min', detail: 'Shoulderstand prep, half-headstand against the wall, crow, shoulder opening on the floor' },
        { name: 'Partial Ashtanga primary series 60 min', detail: 'Standing + seated through navasana — dynamic, rigorous practice' },
        { name: 'Yin & restorative 45 min', detail: 'Long passive yin poses to balance the intensity of the vinyasa' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Integration & Autonomy',
      sessions: [
        { name: 'Self-led practice 45 min', detail: 'Create your own sequence with the poses learned — cultivate your intuitive sense of movement' },
        { name: 'Key-pose workshop', detail: 'Focus on an advanced pose of your choice: hip opening, inversion or arm balance' },
        { name: 'Yoga nidra 30 min', detail: 'Deep guided relaxation — full integration of the 8-week cycle' },
        { name: 'Flexibility & strength check', detail: 'Forward-bend test, single-leg balance, max chaturanga — measure progress' },
      ],
    },
  ],
  faq: [
    { q: 'Do I need to be flexible to do yoga?', a: 'No — stiffness is precisely the reason to start yoga, not an obstacle. Every pose is adaptable with props (blocks, strap). Flexibility will come with practice.' },
    { q: 'What\'s the difference between vinyasa, ashtanga and yin yoga?', a: 'Vinyasa is dynamic and creative (breath-movement link). Ashtanga follows a fixed, very structured sequence. Yin is passive and slow (poses held 3–5 min). Start with vinyasa or hatha for a good balance.' },
    { q: 'How often should I practice to see results?', a: 'At least 3 sessions/week of 30–45 min. Flexibility changes appear in 3–4 weeks. Benefits on stress and sleep quality often from the first week.' },
    { q: 'Can yoga replace strength training?', a: 'Yoga develops functional strength, mobility and muscular endurance — complementary but different. Styles like ashtanga or rocket yoga offer serious strengthening. The ideal is to combine both.' },
  ],
}

/* ── Boxing ────────────────────────────────────────────────────── */
const boxingContent: DisciplineContent = {
  tagline: 'Power, explosiveness and self-control — forged in the ring.',
  heroStat: '1,800+ active boxers',
  guide: {
    technique: {
      emoji: '🥊',
      title: 'Technique & Guard',
      items: [
        'Orthodox stance (left foot forward) or southpaw (right foot forward) — your dominant foot determines the natural stance',
        'Base position: feet shoulder-width + 45°, 55% of the weight on the back leg for mobility',
        'Jab — straight punch with the lead hand, arm extended, shoulder raised to protect the chin',
        'Cross — rear-hand punch with full hip rotation — 70% of the power comes from the hip turn',
        'Head movement (slip, roll) is as important as punching — it protects and creates openings',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Essential equipment',
      items: [
        'Boxing gloves (10–12 oz for general training, 16 oz for sparring) — protects the wrists and your partners',
        'Hand wraps 4.5 m — mandatory under the gloves for wrist and joint support',
        'A custom-molded mouthguard — the #1 protection against concussions and dental fractures',
        'A punching bag (heavy 40–60 kg for power, light 20 kg for speed and technique)',
        'A jump rope — the most effective cardio and coordination tool in boxing',
      ],
    },
    nutrition: {
      emoji: '🥩',
      title: 'Boxer\'s nutrition',
      items: [
        'Pre-training meal 2h before: rice + lean protein + vegetables — stable energy without heaviness',
        'Hydration: at least 600 ml of water per hour of training — dehydration slows the reflexes',
        'Protein: 2–2.2 g/kg/day to maintain muscle mass during a training block',
        'Weight management: max 500 kcal/day deficit — sharp weight cuts reduce power by 15%',
        'Recovery: collagen + vitamin C post-session for the health of wrists, elbows and shoulders',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Boxer\'s recovery',
      items: [
        'Ice the wrists and joints 10–15 min after every intense session — tendinitis prevention',
        'Active stretching of the shoulders, pecs and hip flexors post-session (10 min)',
        'Agonist/antagonist rotation: punch day / legs + core day to spread the load',
        'Massage the forearms and the back of the neck — the most contracted areas in boxing',
        'Restorative sleep: reflexes and coordination consolidate during deep-sleep phases',
      ],
    },
  },
  tips: [
    { icon: '⚡', title: 'Power comes from the hips', body: 'A cross generated by the arm alone is 30% of maximum power. Add hip and trunk rotation to reach 100% of your potential.' },
    { icon: '🧠', title: 'Think in combinations', body: 'A single punch is easily avoided. Combinations (1-2, 1-1-2, 1-2-3b) create openings. Master 3 combinations before learning new ones.' },
    { icon: '🦶', title: 'Footwork is the key', body: 'A boxer with poor footwork can\'t attack or defend effectively. Spend 30% of your time on the rope and on movement.' },
    { icon: '🎯', title: 'Quality > Quantity on the bag', body: 'Landing 100 clean punches beats 500 sloppy ones. Every strike on the bag must be precise, well-anchored, with a fast hand return.' },
  ],
  videos: [
    {
      youtubeIds: ['kKDHdsVN0b8', 'jhcIjFgz2bI', 'N0U5RPGpjSg'],
      title: 'Beginner boxing — Technical basics',
      description: 'A complete intro to boxing — guard, jab, cross, hook and uppercut explained for absolute beginners.',
      duration: '25 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['93r6lz1pbcw', 'NWEThzMnLq8'],
      title: 'Boxing combinations — Intermediate',
      description: 'Learn 10 essential combinations with bag and pad work — guaranteed progress.',
      duration: '30 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['4hYDno0aaAI', 'bcupGtFmv7k'],
      title: '20-min shadow boxing session',
      description: 'A complete shadow boxing workout — footwork, combinations, slips and visualizing the opponent.',
      duration: '20 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['l6Kvp6OZhEA', 'cpRoLtQaCu0'],
      title: 'Boxing cardio — Intense fat burner',
      description: 'A 35-minute boxing cardio circuit — combinations, footwork and athletic drills for optimal fitness.',
      duration: '35 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['F7dRCzMDgXA', 'moQUBT4QUWs'],
      title: 'Head movement and slips',
      description: 'Master the slip, the roll and the bob & weave — the defensive moves that separate good boxers from great ones.',
      duration: '22 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['bb1yVrGe3VU', 'D8DouKeOkfI'],
      title: 'Punching power — Advanced level',
      description: 'Develop your maximum power with plyometric, rotational and heavy-bag striking drills.',
      duration: '40 min',
      level: 'Advanced',
    },
  ],
  exercises: [
    { name: 'Jump rope', muscles: 'Cardio, calves, coordination, rhythm', sets: '10×1 min / 30 s rest', difficulty: 'All levels', description: 'Single jumps at a steady rhythm, progressing to double-unders and crossovers. The fundamental tool of every boxer to improve foot-hand-eye coordination and cardio.' },
    { name: 'Shadow boxing', muscles: 'Shoulders, cardio, technique, coordination', sets: '5×3 min / 1 min rest', difficulty: 'Beginner', description: 'Box in the air visualizing an opponent. Work combinations, footwork, slips and fluidity. The technical session par excellence.' },
    { name: 'Heavy bag — combinations', muscles: 'Shoulders, pecs, triceps, core, cardio', sets: '6×3 min / 1 min rest', difficulty: 'Intermediate', description: 'Chain preset combinations (1-2, 1-2-3b, 1-2-lb) on the heavy bag. Focus on strike quality, fast hand return and hip rotation.' },
    { name: 'Boxer push-ups', muscles: 'Pecs, triceps, shoulders, core', sets: '4×15', difficulty: 'Intermediate', description: 'A classic push-up with a torso rotation and arm extension into an uppercut at the end. Strengthens the striking muscles while training coordination.' },
    { name: 'Ladder footwork', muscles: 'Calves, coordination, reaction speed', sets: '3×4 runs', difficulty: 'Beginner', description: 'Use an agility ladder on the floor to work boxing steps (in-out, lateral, pivot). Improves movement speed and dynamic balance in your guard.' },
    { name: 'Jump squat with hook', muscles: 'Quads, glutes, shoulders, explosiveness', sets: '4×10', difficulty: 'Intermediate', description: 'Drop into a squat, explode upward and throw an imaginary hook on the way up. Combines leg power and striking — like coming out of a clinch and countering.' },
    { name: 'Russian twist', muscles: 'Obliques, abs, trunk rotation', sets: '3×20', difficulty: 'Beginner', description: 'Seated in a V, feet lifted, rotate the torso right to left touching the floor on each side. Trunk rotation is the power source of every lateral punch.' },
    { name: 'Medicine ball slam', muscles: 'Shoulders, back, abs, explosiveness', sets: '4×12', difficulty: 'Intermediate', description: 'Lift the medicine ball overhead then slam it violently to the floor. Mimics the power of an overhand. Excellent for upper-body explosiveness.' },
    { name: 'Pad defense', muscles: 'Reflexes, coordination, cardio', sets: '4×3 min', difficulty: 'Advanced', description: 'Facing a partner holding the pads, work alternating strike-slip. Develops peripheral vision, reaction speed and real-time tactical adaptation.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Foundations — Guard and basic punches',
      sessions: [
        { name: 'Beginner technique 45 min', detail: 'Guard, jab, cross, lateral movement + 10 min basic jump rope' },
        { name: 'Boxing cardio 30 min', detail: 'Shadow boxing 3×3 min + light bag simple combos (1-2) 4×2 min' },
        { name: 'Athletic conditioning 40 min', detail: 'Rope 5 min + push-ups 4×15 + squat 4×15 + core 3×45 s + stretching' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Combinations & Boxing cardio',
      sessions: [
        { name: 'Pads / bag — combinations', detail: '10 different combinations rotating on the heavy bag — 6×3 min with 1 min rest' },
        { name: 'Light sparring (if partner)', detail: '4×2 min of technical sparring at 50% — focus on footwork and jab only' },
        { name: 'Boxing HIIT 25 min', detail: 'Shadow boxing 30 s / 15 s rest × 10, then boxer burpees 20 s / 10 s × 10' },
        { name: 'Functional strengthening', detail: 'Medicine ball slam 4×12 + Russian twist 3×20 + boxer push-ups 4×15' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Power & Defense',
      sessions: [
        { name: 'Heavy-bag power session', detail: 'Maximal power work: 5×3 min focusing on cross and uppercut at max intensity' },
        { name: 'Slips and counters', detail: 'Slip/roll in response to the partner\'s jabs + immediate 1-2 counter — 6×2 min' },
        { name: 'Endurance cardio 40 min', detail: 'Rope 15 min + shadow boxing 15 min + bag 10 min — moderate continuous intensity' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Sparring & Consolidation',
      sessions: [
        { name: 'Full sparring 4×3 min', detail: 'Full tactical application — all punches and slips learned in a real situation' },
        { name: 'Technical sharpening 45 min', detail: 'Back to the fundamentals: guard, jab, footwork — refine precision and fluidity' },
        { name: 'Performance check', detail: 'Max 3-min jump-rope test + punching-power test with a sensor + technical assessment' },
        { name: 'Active recovery', detail: 'Yoga 30 min + deep shoulder and wrist stretching + arm self-massage' },
      ],
    },
  ],
  faq: [
    { q: 'Is boxing dangerous for beginners?', a: 'Fitness boxing training (bag, shadow, pads) is very safe and contactless. Sparring requires full gear and a competent coach. Boxing builds self-defense and self-confidence.' },
    { q: 'How long to learn the basics?', a: 'In 4 weeks of regular practice (3 sessions/week), you master the guard, jab, cross and basic footwork. Combinations and defense take 3–6 months.' },
    { q: 'Does boxing burn fat effectively?', a: 'Yes — a 45-min boxing session burns between 500 and 800 kcal depending on intensity. It\'s one of the most effective sports for total caloric expenditure thanks to full-body involvement.' },
    { q: 'Do I need a partner to train boxing?', a: 'No — a punching bag, shadow boxing and jump rope allow a complete solo workout. A partner is a plus (pads, sparring) but not a necessity, especially at the start.' },
  ],
}

/* ── Stretching ────────────────────────────────────────────────── */
const stretchingContent: DisciplineContent = {
  tagline: 'Free your body, recover better and move without pain.',
  heroStat: '3,200+ active practitioners',
  guide: {
    technique: {
      emoji: '🤸',
      title: 'Stretching technique',
      items: [
        'Static stretch: hold 30–60 seconds, breathe deeply, release 20% of the tension on the exhale',
        'PNF (Proprioceptive Neuromuscular Facilitation): contract 6 s → release → deepen — a 30% range gain',
        'Never stretch a cold muscle — wait for 5 min of light warm-up (walking, rotation) before any deep stretching',
        'Comfort threshold: a tolerable feeling of tension, never sharp pain — pain triggers the stretch reflex',
        'Dynamic stretching before the effort, static stretching after — don\'t mix the two in your routine',
      ],
    },
    equipment: {
      emoji: '🛒',
      title: 'Recommended gear',
      items: [
        'A thick floor mat (6–8 mm) for the joint comfort of the knees and hips',
        'A stretching strap (or belt) for the hamstring and hip-flexor stretches',
        'A foam roller for myofascial release before stretching',
        'A lacrosse ball or tennis ball to massage trigger points on the calves and arch of the foot',
        'A timer / app to respect stretch durations — never estimate by eye',
      ],
    },
    nutrition: {
      emoji: '🍊',
      title: 'Nutrition for flexibility',
      items: [
        'Collagen (10–15 g) + vitamin C 30–60 min before intensive stretching sessions for collagen synthesis',
        'Optimal hydration: fascia and tendons are 70% water — drink 2L minimum per day',
        'Magnesium (300–400 mg/day): reduces cramps and promotes deep muscle relaxation',
        'Curcumin + black pepper post-session: a powerful natural anti-inflammatory for soreness',
        'Avoid excess coffee on intensive stretching days — caffeine raises baseline muscle tone',
      ],
    },
    recovery: {
      emoji: '💆',
      title: 'Integration & Recovery',
      items: [
        'Foam rolling 5–10 min before stretching releases fascial restrictions and amplifies mobility gains',
        'A hot bath 20 min (38–40 °C) pre-session — heat increases collagen elasticity by 15%',
        'Evening stretching → better sleep: parasympathetic stretches lower the heart rate',
        'Maintain the gains: 10 min of daily stretching beats one intensive weekly session',
        'Progressive overload in flexibility: increase the range by 5% per week — progress is linear if regular',
      ],
    },
  },
  tips: [
    { icon: '🌡️', title: 'Warm = more flexible', body: 'Muscle temperature improves elasticity. Stretch after exercise or after a hot bath for gains 2× faster.' },
    { icon: '📐', title: 'Breathing is the tool', body: 'On each exhale, the muscles relax naturally. Exhale slowly to "go deeper" into the stretch without forcing.' },
    { icon: '🔄', title: 'Mobility ≠ Flexibility', body: 'Flexibility is passive (how far you can go). Mobility is active (how far you control). Work both for functional flexibility.' },
    { icon: '⏰', title: 'Consistency rules', body: '10 minutes every day produce results in 3 weeks. Without consistency, connective tissue returns to its original length in 72h.' },
  ],
  videos: [
    {
      youtubeIds: ['g_tea8ZNk5A', 'X4yWT6yqCJ8'],
      title: 'Full body stretching 30 min',
      description: 'A complete full-body stretching program in 30 minutes — ideal after training or in the evening to recover.',
      duration: '30 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['BYsfUroaCcw', '4JQ_oLV8c6Q'],
      title: 'Hamstring & back stretches',
      description: 'A targeted 25-minute routine to relieve tight hamstrings and lower-back pain — results from the first session.',
      duration: '25 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['L_xrDAtykMI', 'Ou2XvUtRCto'],
      title: 'Hip mobility — Complete routine',
      description: 'A 35-minute hip-mobility program — opening, internal/external rotation and psoas release.',
      duration: '35 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['T5OEbqLZS5c', 'SsgGV0llXjQ'],
      title: 'Shoulder & neck stretches',
      description: 'Release neck tension and stiff shoulders in 20 minutes — perfect for people who work seated.',
      duration: '20 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['maBhWtvsUeE'],
      title: 'PNF Stretching — Advanced techniques',
      description: 'The PNF method explained and applied to 6 major muscle groups — fast, lasting mobility gains.',
      duration: '40 min',
      level: 'Advanced',
    },
    {
      youtubeIds: ['UItWltVZZmE'],
      title: 'Foam rolling + Recovery stretching',
      description: 'A complete recovery protocol: foam-roller self-massage followed by targeted stretches to speed up muscle recovery.',
      duration: '35 min',
      level: 'All levels',
    },
  ],
  exercises: [
    { name: 'Standing forward fold', muscles: 'Hamstrings, lower back, calves', sets: '3×45 s', difficulty: 'Beginner', description: 'Standing, legs together and straight, slowly lower the hands toward the floor. Bend the knees slightly if you feel low-back pain. Hold the position breathing deeply.' },
    { name: 'Low lunge psoas (lizard)', muscles: 'Psoas, hip flexors, quads', sets: '3×45 s/side', difficulty: 'Beginner', description: 'In a deep lunge, back knee on the floor, pelvis pushed forward. Optional: raise the arms to deepen. Releases the psoas shortened by prolonged sitting.' },
    { name: 'Seated butterfly', muscles: 'Adductors, hip flexors, groin', sets: '3×60 s', difficulty: 'Beginner', description: 'Seated, soles of the feet together, knees toward the floor. Gently lean the torso forward keeping the back straight. A fundamental stretch for runners and cyclists.' },
    { name: 'Pigeon (preparatory)', muscles: 'Glutes, external hip rotators, psoas', sets: '2 min/side', difficulty: 'Intermediate', description: 'On all fours, bring one knee between the hands, extend the back leg. Gradually lean the torso forward. One of the most effective hip stretches there is.' },
    { name: 'Doorway pec stretch', muscles: 'Pecs, biceps, rotator cuff', sets: '3×30 s/side', difficulty: 'Beginner', description: 'Arm at 90° against the door frame, take a step forward. Feel the stretch across the whole front of the shoulder. Counterbalances bench-press volume.' },
    { name: 'Cobra (Bhujangasana)', muscles: 'Abs, hip flexors, pecs', sets: '3×30 s', difficulty: 'Beginner', description: 'Lying face down, hands under the shoulders, push the torso up keeping the pelvis on the floor. Stretches the whole front of the body and strengthens the spinal erectors.' },
    { name: 'Kneeling thoracic rotation', muscles: 'Thoracic paraspinals, obliques', sets: '3×10/side', difficulty: 'Intermediate', description: 'On all fours, hand behind the head, open the elbow toward the ceiling while rotating the torso. Improves thoracic mobility essential for running, swimming and boxing.' },
    { name: 'Calf stretch at the wall', muscles: 'Gastrocnemius, soleus, Achilles tendon', sets: '3×45 s/side', difficulty: 'Beginner', description: 'Hands on the wall, back leg straight, heel anchored to the floor. Bent-knee variation to target the soleus. A must for runners and racquet-sport players.' },
    { name: 'Figure 4', muscles: 'Glutes, piriformis, deep hip rotators', sets: '2 min/side', difficulty: 'All levels', description: 'Lying on your back, cross the ankle over the opposite knee, pull the thigh toward the chest. Excellent for relieving piriformis syndrome and glute-related sciatica.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Discovery — Essential stretches',
      sessions: [
        { name: 'Full body stretching 30 min', detail: 'Hamstrings, psoas, pecs, calves, glutes — 40 s per pose' },
        { name: 'Morning mobility 15 min', detail: 'Dynamic joint rotations (neck, shoulders, hips, ankles) + 3 key poses' },
        { name: 'Foam rolling recovery', detail: 'Quads, IT band, thoracic back, calves — 60 s per area' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Targeted — Priority areas',
      sessions: [
        { name: 'Hips & lower back 35 min', detail: 'Pigeon, low lunge, butterfly, seated twist — 60–90 s per pose' },
        { name: 'Posterior chain 30 min', detail: 'Forward fold, calves, standing and lying hamstrings, figure 4' },
        { name: 'Shoulders & chest 25 min', detail: 'Pec opening, biceps stretch, thoracic rotation, cobra' },
        { name: 'Deep relaxation 20 min', detail: 'Restorative yoga: poses supported with a bolster — total release' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'PNF & Range gains',
      sessions: [
        { name: 'PNF hamstrings 30 min', detail: 'Contract 6 s — release — deepen × 4 cycles per leg' },
        { name: 'PNF hips & adductors', detail: 'PNF protocol on butterfly, pigeon and lateral flexion — 3 cycles per area' },
        { name: 'Active-passive stretching 40 min', detail: 'Alternate concentric contraction and deep passive stretch on the large groups' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Integration & Autonomy',
      sessions: [
        { name: 'Personalized sequence 40 min', detail: 'Build your routine with the most beneficial stretches identified over 6 weeks' },
        { name: 'Range-of-motion check', detail: 'Fingers-to-floor distance, shoulder rotation, lateral flexion, Thomas test for the psoas' },
        { name: 'Sport-specific stretching', detail: 'Adapt your routine to your main sport — running, strength, boxing or yoga' },
        { name: 'Maintenance program 10 min/day', detail: 'A daily mini-routine of the 5 priority areas to keep your gains' },
      ],
    },
  ],
  faq: [
    { q: 'When should I stretch: before or after training?', a: 'Before: favor dynamic stretches (swings, rotations) to prepare the joints. After: static stretches (held 30–60 s) to recover and increase flexibility on cool muscles.' },
    { q: 'How long before I see an improvement in flexibility?', a: 'With 3–4 sessions per week of 20–30 min, the first measurable gains appear in 3–4 weeks. Significant flexibility builds over 3–6 months of regular practice.' },
    { q: 'Does stretching really hurt at first?', a: 'A feeling of intense tension is normal and necessary. Sharp or joint pain is an immediate stop signal. Work at 70–80% of your maximum range to progress safely.' },
    { q: 'Can stretching reduce chronic pain?', a: 'Yes — many lower-back, neck and hip pains are caused by shortened muscles. A regular program of targeted stretching significantly reduces these pains in 4–8 weeks according to studies.' },
  ],
}

/* ── Nutrition ─────────────────────────────────────────────────── */
const nutritionContent: DisciplineContent = {
  tagline: 'Eat smart — performance starts on the plate.',
  heroStat: '4,100+ active members',
  guide: {
    technique: {
      emoji: '🥗',
      title: 'Nutrition principles',
      items: [
        'Caloric deficit to lose weight: 300–500 kcal/day below TDEE — never below 1,200 kcal (women) or 1,500 kcal (men)',
        'Caloric surplus for muscle gain: 200–300 kcal/day above TDEE for a lean gain',
        'Athletic macronutrients: 30–35% protein / 40–50% carbs / 20–25% fat for performance',
        'Glycemic index (GI): favor low-GI carbs (quinoa, sweet potato, legumes) for stable energy',
        'Chrononutrition: carbs primarily in the morning and around workouts, fats in the evening',
      ],
    },
    equipment: {
      emoji: '⚖️',
      title: 'Essential tools',
      items: [
        'A precision food scale (to the gram) — essential to understand real portions',
        'A nutrition-tracking app (MyFitnessPal, Cronometer) to track macros and micronutrients',
        'Airtight meal-prep containers for weekly planning',
        'A high-power blender for protein smoothies and nutritious homemade sauces',
        'A cooking thermometer to control the temperature and preserve the nutrients in foods',
      ],
    },
    nutrition: {
      emoji: '🍽️',
      title: 'Planning & Distribution',
      items: [
        'Protein timing: 20–40 g of protein every 3–4 h to maximize muscle protein synthesis',
        'Anabolic window: a meal rich in protein and carbs within 60–90 min post-workout',
        'Pre-workout meal: complex carbs + light protein 2–3h before (rice + chicken + vegetables)',
        '5 servings of vegetables/fruit per day minimum — vitamins, minerals and fiber for overall health',
        'Hydration: 35 ml/kg of body weight per day + an extra 500 ml per hour of exercise',
      ],
    },
    recovery: {
      emoji: '🔄',
      title: 'Recovery nutrition',
      items: [
        'The first 30 minutes post-effort are the window of maximum response: carbs + protein 4:1',
        'Casein (slow-digesting protein) at bedtime to fuel overnight protein synthesis',
        'Omega-3 (2–4 g/day EPA+DHA): reduce muscle inflammation and speed up recovery',
        'Tart cherry or beet juice after an intense effort: scientifically validated natural anti-inflammatories',
        'Alcohol post-effort: reduces protein synthesis by 37% — avoid in the 6h after an intensive session',
      ],
    },
  },
  tips: [
    { icon: '🍳', title: 'Meal prep = success', body: 'Prep your meals on Sunday for the week. Studies show that people who plan their nutrition reach their goals 2.5× more often than those who improvise.' },
    { icon: '🥦', title: 'The plate rule', body: 'Each main meal: 1/2 plate vegetables, 1/4 protein, 1/4 complex carbs. Simple, effective, no calorie counting every time.' },
    { icon: '💧', title: 'Thirst = already dehydrated', body: 'When you feel thirsty, you\'ve already lost 1–2% of your body weight in water. Drink regularly throughout the day — not in sporadic large amounts.' },
    { icon: '📊', title: 'Base calories first', body: 'Master the quantity (total calories) first, then optimize the quality (macros), finally the timing (chrononutrition). Don\'t skip steps.' },
  ],
  videos: [
    {
      youtubeIds: ['EXuaTsr43eQ', 'hRVU04jMowo'],
      title: 'Sports nutrition — Essential basics',
      description: 'Understand macronutrients, TDEE, protein and carbs to optimize your sports nutrition starting today.',
      duration: '22 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['3Xw69xfbIuE', 'GiIPh3pkR6U'],
      title: 'Protein — Everything you need to know',
      description: 'Sources, amounts, timing and protein supplements — a complete, scientifically validated guide to protein for sport.',
      duration: '28 min',
      level: 'All levels',
    },
    {
      youtubeIds: ['ZualDnEH00M', 'nFua_QH9_ME'],
      title: 'Meal prep — Planning your sports meals',
      description: 'How to prep a week of balanced meals in 2 hours on Sunday — a complete method with recipes for athletes.',
      duration: '35 min',
      level: 'Beginner',
    },
    {
      youtubeIds: ['qPhJJOm3Lfc', 'oOXe0KZLLSE'],
      title: 'Weight loss — The science behind it',
      description: 'Understand the caloric deficit, basal metabolism and the nutrition strategies that actually work to lose fat.',
      duration: '30 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['i3AyCq2o5pk', 'q-hdHMhuJww'],
      title: 'Muscle gain — Optimized nutrition',
      description: 'The complete nutrition guide to muscle gain: caloric surplus, macros, timing and supplements for a clean bulk.',
      duration: '32 min',
      level: 'Intermediate',
    },
    {
      youtubeIds: ['A_GIpkGMIAU', 'NYHzJGKCKDM'],
      title: 'Supplements — Which ones actually work?',
      description: 'An objective analysis of the most popular supplements — creatine, whey, BCAA, omega-3: the scientific truth.',
      duration: '38 min',
      level: 'Advanced',
    },
  ],
  exercises: [
    { name: 'Weekly meal planning', muscles: 'Habit, nutritional organization', sets: '1× /week — 20 min', difficulty: 'Beginner', description: 'Every Sunday, plan your 5 main meals for the week. Calculate the target macros, list the ingredients, prep the proteins and grains ahead. The foundation of nutritional success.' },
    { name: 'Calculating your TDEE', muscles: 'Metabolic knowledge', sets: '1× at the start then each month', difficulty: 'Beginner', description: 'Calculate your Total Daily Energy Expenditure (TDEE) with the Mifflin-St Jeor formula × activity factor. Adjust by ±300 kcal depending on the goal (loss or gain). Recalculate every -5 kg.' },
    { name: '7-day macro tracking', muscles: 'Food awareness', sets: '7 consecutive days', difficulty: 'Beginner', description: 'Log every food in an app (Cronometer recommended) for 7 consecutive days without changing your habits. Reveals the real gap between what you think you eat and what you actually eat.' },
    { name: 'Batch cooking protein', muscles: 'Athletic meal prep', sets: '1× /week — 45 min', difficulty: 'Beginner', description: 'Cook 600–800 g of lean protein (chicken, hard-boiled eggs, tuna, lentils) in one session. Split into 150–200 g portions. Guarantees your protein intake effortlessly during the week.' },
    { name: 'Plate audit', muscles: 'Nutritional balance', sets: 'At every meal', difficulty: 'All levels', description: 'Before each meal, check visually: 50% vegetables, 25% protein, 25% complex carbs on the plate. A simple method that replaces calorie counting for most goals.' },
    { name: 'Structured hydration', muscles: 'Metabolism, physical performance', sets: '8 glasses spread over the day', difficulty: 'Beginner', description: 'Plan your fluid intake: a glass on waking, before each meal, during and after exercise. Use a graduated 1.5L bottle as a reference. 2% dehydration cuts performance by 20%.' },
    { name: 'Post-effort anabolic window', muscles: 'Recovery, protein synthesis', sets: 'After every workout', difficulty: 'Intermediate', description: 'Within 30–60 min after each session, consume 30–40 g of protein + 50–80 g of carbs (rice, banana, wholegrain bread). Maximizes recovery and muscle adaptation.' },
    { name: 'Chrononutrition — 4-week test', muscles: 'Circadian timing', sets: '4 weeks', difficulty: 'Intermediate', description: 'Week 1: normal meals (baseline). Weeks 2–4: carbs concentrated at breakfast and lunch, protein/fat in the evening. Compare energy levels, recovery and body composition.' },
    { name: 'Creatine supplement — Protocol', muscles: 'Strength, recovery, performance', sets: '3–5 g/day ongoing', difficulty: 'Intermediate', description: 'Take 3–5 g of creatine monohydrate per day at any time (saturation takes 4 weeks). No loading phase needed. The most scientifically validated supplement for athletic performance.' },
  ],
  program: [
    {
      week: 'Week 1–2',
      theme: 'Diagnosis — Know your starting point',
      sessions: [
        { name: 'TDEE & target macros', detail: 'Mifflin-St Jeor formula + activity factor → 300 kcal deficit or surplus depending on goal' },
        { name: 'Food tracking 7 days', detail: 'Log everything without changing your habits — reveals the real gaps (protein in general)' },
        { name: 'Fridge and pantry audit', detail: 'Identify the ultra-processed foods to gradually replace with healthy alternatives' },
      ],
    },
    {
      week: 'Week 3–4',
      theme: 'Structure — Putting the basics in place',
      sessions: [
        { name: 'First complete meal prep', detail: 'Prep 5 lunches + 5 dinners on Sunday — rice, roasted vegetables, varied proteins' },
        { name: 'Breakfast optimization', detail: 'Transition to a protein breakfast of 25–30 g: eggs + oats + fruit + nuts' },
        { name: 'Structured hydration', detail: 'A 1.5L bottle to finish before 6 PM + 500 ml around each workout' },
        { name: 'Week-4 macro check', detail: 'Check that you\'re hitting the protein/carbs/fat targets over 7 days with the app — adjust if needed' },
      ],
    },
    {
      week: 'Week 5–6',
      theme: 'Optimization — Timing and quality',
      sessions: [
        { name: 'Applied chrononutrition', detail: 'Carbs in the morning and around workouts, fats at dinner — test over 2 weeks' },
        { name: 'Systematic anabolic window', detail: 'Whey shake + banana or rice + tuna within 30 min post-effort at every session' },
        { name: 'Supplement integration', detail: 'Creatine 5 g/day + omega-3 2 g/day + vitamin D3 2,000 IU/day — a proven base protocol' },
      ],
    },
    {
      week: 'Week 7–8',
      theme: 'Autonomy & Sustainability',
      sessions: [
        { name: 'Nutritional flexibility', detail: 'Apply the 80/20 rule — 80% rigorous nutrition, 20% free meals without guilt' },
        { name: 'High-protein home recipes', detail: 'Master 5 quick recipes (< 15 min) that reach 40 g of protein/serving' },
        { name: 'Body-composition check', detail: 'Waist circumference, weight, comparison photos D1/D56 — assess the impact on composition' },
        { name: 'Personalized maintenance plan', detail: 'Adapt the target macros to your new composition — recalculate TDEE after progress' },
      ],
    },
  ],
  faq: [
    { q: 'Do I need to count calories to progress?', a: 'Not necessarily every day, but doing it at least once for 2–4 weeks is very revealing. It calibrates your food intuition permanently. After that, the plate method (50/25/25) is enough for most goals.' },
    { q: 'Are supplements essential?', a: 'No — your diet should cover 90% of your needs. Whey is convenient (not magic), creatine measurably improves performance, omega-3 and vitamin D are relevant if your dietary intake is insufficient. Everything else is marketing.' },
    { q: 'Can you lose fat and build muscle at the same time?', a: 'Yes, when you\'re a beginner or after a long break (body recomposition). It requires high protein intake (2–2.2 g/kg), resistance training and a slight caloric deficit (−200 kcal max). Results are slower but durable.' },
    { q: 'How many meals per day should I eat?', a: 'Meal frequency has little impact on metabolism. What matters: hitting your total daily caloric and protein targets. 3 meals or 5 meals: choose the one that fits your lifestyle best and helps you meet your goals.' },
  ],
}

/* ── Master maps ───────────────────────────────────────────────── */
export const DISCIPLINE_CONTENT_EN: Record<string, DisciplineContent> = {
  'running-cardio': runningContent,
  musculation: musculationContent,
  hiit: hiitContent,
  cyclisme: cyclismeContent,
  natation: natationContent,
  crossfit: crossfitContent,
  yoga: yogaContent,
  boxing: boxingContent,
  stretching: stretchingContent,
  nutrition: nutritionContent,
}

// Méta EN par slug (titres/tags/descriptions/stats alignés sur les cartes
// d'accueil, niveaux traduits).
export const DISCIPLINE_META_EN: Record<string, DisciplineMeta> = {
  'running-cardio': {
    title: 'Running & Cardio',
    tag: 'Cardio',
    description: 'Running programs for every level — from 5K to marathon. Personalized plans with GPS coaching and heart-rate tracking.',
    stats: ['+4,200 runners', '120+ plans', '12 weeks avg.'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
  },
  musculation: {
    title: 'Strength training',
    tag: 'Strength',
    description: 'Bulking, cutting or toning — our certified coaches build a custom program tailored to your body type.',
    stats: ['+3,800 members', '90+ programs', '8 weeks avg.'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
  },
  hiit: {
    title: 'HIIT',
    tag: 'Fat Burn',
    description: 'Short, intense sessions to burn maximum calories and boost your metabolism for the long run in 20 to 30 min.',
    stats: ['+2,100 members', '60+ circuits', '20-30 min / session'],
    levels: ['Beginner', 'Intermediate', 'Advanced'],
  },
  cyclisme: {
    title: 'Cycling',
    tag: 'Endurance',
    description: 'Indoor and outdoor training with a power meter. From road racer to climber, a plan tailored to every profile.',
    stats: ['+1,500 cyclists', '45+ plans', '16 weeks avg.'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Competition'],
  },
  natation: {
    title: 'Swimming',
    tag: 'Aquatic',
    description: 'Stroke technique, triathlon prep, open water — progress in every style with HD video drills.',
    stats: ['+900 swimmers', '30+ programs', '10 weeks avg.'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Triathlon'],
  },
  crossfit: {
    title: 'CrossFit',
    tag: 'Functional',
    description: 'Daily WODs, functional movements and community challenges to push your limits every week.',
    stats: ['+1,800 athletes', '365 WODs/yr', '5× / week'],
    levels: ['Beginner', 'Intermediate', 'RX', 'Competition'],
  },
  yoga: {
    title: 'Yoga',
    tag: 'Wellness',
    description: 'Flexibility, inner strength and mindfulness — from beginner flows to advanced yoga for a balanced body and mind.',
    stats: ['+2,000 practitioners', '40+ sequences', '20-60 min / session'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'All levels'],
  },
  boxing: {
    title: 'Boxing',
    tag: 'Combat',
    description: 'Technique, cardio and power — from the basics to advanced combinations to transform you physically and mentally.',
    stats: ['+1,200 boxers', '35+ programs', '8 weeks avg.'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Competition'],
  },
  stretching: {
    title: 'Stretching',
    tag: 'Mobility',
    description: 'Mobility, flexibility and optimal recovery — guided stretching routines to prevent injuries and perform.',
    stats: ['+1,600 members', '30+ routines', '10-30 min / session'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'All levels'],
  },
  nutrition: {
    title: 'Nutrition',
    tag: 'Diet',
    description: 'Personalized meal plans, macro tracking and nutrition strategies to reach your athletic goals.',
    stats: ['+3,000 members', '50+ plans', 'Daily tracking'],
    levels: ['Beginner', 'Intermediate', 'Advanced', 'Athlete'],
  },
}
