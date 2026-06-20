/* ── Catalogue produits — version anglaise ────────────────────── */
/* On réutilise PRODUCTS (FR) pour tout le structurel (id, slug, prix, images,
   category-clé, amazon, disciplines…) et on ne surcharge que les champs texte. */

import { PRODUCTS, amazonSearchUrl, AMAZON_TAG_DE, type Product } from './products'
import { PRODUCTS_DE } from './products.de'

type ProductText = Pick<Product, 'name' | 'description' | 'features' | 'tags'> & {
  badge?: string | null
  level?: string
  duration?: string
  longDescription?: string // optionnel : repli FR (non affiché sur les cartes affiliées)
}

const TEXT_EN: Record<string, ProductText> = {
  e1: {
    name: 'Cast Iron Kettlebell Pro 20 kg — CORENGTH',
    badge: '⭐ Bestseller',
    description: '20 kg cast-iron kettlebell with a non-slip rubber base and a sandblasted handle for CrossFit, HIIT and functional strength.',
    longDescription: 'Designed for demanding athletes, this 80% recycled cast-iron kettlebell offers a sandblasted grip for a perfect hold even when sweating. The rubber base protects the floor and ensures perfect stability. Ideal for swings, Turkish get-ups, clean & press and snatches.',
    features: ['20 kg — ideal for CrossFit & HIIT', '80% recycled cast iron', 'Non-slip rubber base', 'Sandblasted handle, optimal grip', '2-year warranty'],
    tags: ['kettlebell', 'crossfit', 'strength', 'training'],
  },
  e2: {
    name: 'Resistance Band Kit × 5 — PORTENTUM',
    badge: '🔥 Sale',
    description: 'Set of 5 resistance bands for strength and fitness. Progressive resistance from 25 to 125 lbs. Ideal for a complete home workout.',
    longDescription: 'The PORTENTUM kit includes 5 resistance bands in different colors (from 25–65 lbs to 50–125 lbs) for progressive, complete training. Perfect for strength, CrossFit, yoga, rehab and muscle strengthening at home or on the go. Durable, non-slip and easy to carry.',
    features: ['5 levels: 25 to 125 lbs', 'Complete strength & fitness', 'Durable non-slip', 'Ideal at home', 'Easy to carry'],
    tags: ['resistance bands', 'resistance', 'fitness', 'strength'],
  },
  e3: {
    name: 'Premium Non-Slip Yoga Mat 10mm',
    description: 'Double-sided 10mm eco-friendly TPE yoga mat. Perfectly non-slip, 183×61cm. Carry strap included.',
    longDescription: 'The Gaiam premium mat offers a 10mm thickness for perfect joint cushioning. Its textured double-sided surface guarantees maximum grip on any floor. The TPE material is free of PVC, latex and phthalates — ideal for environmentally conscious practitioners.',
    features: ['10mm premium comfort', 'Non-slip double-sided', 'TPE, PVC- and latex-free', '183×61 cm', 'Carry strap included'],
    tags: ['yoga mat', 'pilates', 'meditation', 'stretching'],
  },
  e4: {
    name: 'Speed CrossFit Jump Rope — Reebok',
    badge: '⚡ Pro',
    description: 'Coated steel cable jump rope, aluminum ball bearings. Adjustable 2.5—3.5m. Perfect for HIIT and boxing.',
    longDescription: 'The Reebok Speed jump rope is designed for CrossFit athletes and boxers. Ultra-light steel cable, precision ball bearings for smooth high-speed rotation. Ergonomic brushed-aluminum handles. Ideal for double-unders and intense HIIT.',
    features: ['Coated steel cable', 'Precision aluminum bearings', 'Adjustable 2.5—3.5m', 'Ergonomic handles', 'Carry bag'],
    tags: ['jump rope', 'cardio', 'crossfit', 'boxing'],
  },
  e5: {
    name: 'Adjustable Dumbbells 2—24 kg — Bowflex SelectTech',
    badge: '💪 Premium',
    description: 'Replaces 15 pairs of dumbbells. Select the weight in 2 seconds from 2 to 24 kg. Ergonomic design.',
    longDescription: 'The Bowflex SelectTech 552i dumbbells are the world reference in adjustable dumbbells. A simple turn of the dial replaces up to 15 pairs of classic dumbbells. Huge savings in space and budget. Chromed steel structure with a non-slip coating.',
    features: ['2 to 24 kg in 2 seconds', 'Replaces 15 pairs', 'Chromed steel build', 'Non-slip coating', '2-year warranty'],
    tags: ['dumbbells', 'strength', 'home gym', 'training'],
  },
  e6: {
    name: 'Connected Exercise Bike — DOMYOS VC500',
    badge: '🚴 Connected',
    description: 'Connected cardio bike with 24 levels of magnetic resistance. LCD screen. Adjustable seat and handlebars. Connects to fitness apps.',
    longDescription: 'The DOMYOS VC500 bike is ideal for indoor cycling. Ultra-quiet magnetic resistance, 24 progressive levels. Compatible with Decathlon Coach, Zwift and Kinomap via Bluetooth. Wide comfort seat adjustable in height and depth. LCD console showing speed, distance, calories and heart rate.',
    features: ['24 magnetic levels', 'Bluetooth connected', 'Zwift/Kinomap compatible', 'Adjustable comfort seat', 'Full LCD console'],
    tags: ['bike', 'cardio', 'indoor cycling', 'connected'],
  },
  e7: {
    name: 'Pro Ab Wheel Roller — Dual Wheel + Knee Mat',
    badge: '🔥 Sale',
    description: 'Dual-bearing ab wheel with a knee mat. Strengthens abs, core and back. Non-slip, assembles in a minute.',
    longDescription: 'The PROIRON ab wheel deeply works your entire core, back and shoulders in a single movement. Its wide dual wheel ensures perfect stability for controlled reps without wobble. Ergonomic non-slip handles give a secure grip even when sweating. Comes with a knee mat to protect your joints. Compact, it stores anywhere and assembles in under a minute — ideal for core training at home.',
    features: ['Ultra-stable dual wheel', 'Knee mat included', 'Strengthens abs, back & core', 'Non-slip handles', 'Compact — 1-min assembly'],
    tags: ['ab wheel', 'abs', 'core', 'strength'],
  },
  n1: {
    name: 'Impact Whey Protein Chocolate 1 kg — MyProtein',
    badge: '🏆 #1 in Europe',
    description: '#1 in Europe. 22g protein, 103 kcal, 5g BCAAs per serving. From grass-fed cows. Intense chocolate flavor.',
    longDescription: 'The best-selling whey in Europe for 15 years. Made from ultra-filtered whey from Irish grass-fed cows. Complete amino acid profile with 5g of BCAAs per serving. Mixes perfectly in water or milk. Ideal post-workout to maximize protein synthesis.',
    features: ['22g protein / serving', 'Only 103 kcal', '5g natural BCAAs', 'Made in Europe', 'No added sugar'],
    tags: ['whey', 'protein', 'strength', 'recovery'],
  },
  n2: {
    name: 'Pure Creatine Monohydrate 300g — MyProtein',
    description: '99.9% pure micronized creatine. 60 doses. Informed Sport certified. Strength and power in 4 weeks.',
    longDescription: 'Creatine monohydrate is the most studied supplement in sports science, with hundreds of studies confirming its effectiveness. MyProtein\'s micronized version dissolves instantly and is absorbed faster. Informed Sport certified — anti-doping tested. Unflavored to mix into any drink.',
    features: ['99.9% purity', '60 servings of 5g', 'Informed Sport certified', 'Unflavored', 'Results in 4 weeks'],
    tags: ['creatine', 'strength', 'power', 'training'],
  },
  n3: {
    name: 'BCAA Xplode 2:1:1 Fruit Punch 500g — Olimp',
    badge: '💊 Vegan',
    description: 'BCAAs in a 2:1:1 ratio. 7g per dose, 83 servings. Vegan certified. Recovery, anti-catabolism, endurance.',
    longDescription: 'BCAAs (branched-chain amino acids) in an optimized 2:1:1 ratio: Leucine, Isoleucine, Valine. Leucine directly stimulates protein synthesis, Isoleucine helps glucose utilization and Valine reduces central fatigue. Ideal during training to preserve muscle mass.',
    features: ['Optimal 2:1:1 ratio', '7g BCAAs/dose', '83 servings', 'Vegan certified', 'Anti-catabolism'],
    tags: ['bcaa', 'recovery', 'endurance', 'vegan'],
  },
  r1: {
    name: 'Pro Massage Foam Roller — TriggerPoint GRID',
    badge: '🔵 Pro',
    description: 'Multi-zone massage roller with a patented GRID surface. Simulates a masseur\'s hands. Optimal recovery.',
    longDescription: 'The TriggerPoint GRID is the foam roller of choice for professionals. Its 3-distinct-zone surface (hollow, tubular, flat) simulates a masseur\'s fingers, palms and thumbs. The hollow core ensures durability and supports weight up to 160kg. Includes access to the full video library.',
    features: ['3-zone GRID surface', 'Simulates a pro massage', 'Supports 160kg', 'Durable hollow core', 'Videos included'],
    tags: ['foam roller', 'recovery', 'massage', 'mobility'],
  },
  r2: {
    name: 'Percussion Massage Gun — Theragun Mini',
    badge: '🏅 Pro Athlete',
    description: 'Mini percussion gun 2400 RPM, 3 speeds, quiet. 150min battery. Compact and powerful for fast recovery.',
    longDescription: 'The Theragun Mini is the compact version of the professional massage gun favored by NBA, NFL and Olympic athletes. 2400 percussions/minute penetrating 16mm deep to boost circulation and release muscle tension. 3 adapted speeds. Ultra-quiet operation. 150-minute battery life.',
    features: ['Powerful 2400 RPM', '3 adapted speeds', '150min battery', 'Ultra-quiet 60dB', 'Compact & travel-friendly'],
    tags: ['massage gun', 'percussion', 'recovery', 'theragun'],
  },
  t1: {
    name: 'Multisport GPS Smartwatch',
    badge: '⌚ GPS',
    description: 'Multisport GPS watch with wrist heart rate, sleep tracking, VO2 max and 100+ sport modes. Long battery life.',
    longDescription: 'The ideal smartwatch for athletes: ultra-precise built-in GPS, wrist heart-rate sensor, sleep and stress tracking, VO2 max estimation and over 100 sport profiles (running, cycling, swimming, strength, HIIT). Compatible with Strava, Apple Health and Google Fit. Waterproof with several days of battery life.',
    features: ['Precise multisport GPS', 'Wrist heart rate', 'Sleep & VO2 max tracking', '100+ sport modes', 'Strava & Apple Health compatible'],
    tags: ['smartwatch', 'gps', 'cardio', 'running', 'multisport'],
  },
  t2: {
    name: 'Fitness Activity Tracker Band',
    badge: '🔥 Sale',
    description: 'Lightweight connected band: pedometer, calories, heart rate, sleep and notifications. AMOLED screen. 14-day battery.',
    longDescription: 'The perfect everyday fitness companion. This activity band automatically tracks your steps, calories burned, heart rate and sleep quality. Bright color AMOLED screen, waterproof for swimming, and up to 14 days of battery life. Get your notifications (calls, texts, apps) right on your wrist. Syncs with the Xenotif app via Apple Health / Google Fit.',
    features: ['Pedometer & calories', '24/7 heart rate', 'Sleep tracking', 'Color AMOLED screen', '14-day battery'],
    tags: ['fitness band', 'fitness tracker', 'pedometer', 'sleep'],
  },
  t3: {
    name: 'Touchscreen Running & Cardio Smartwatch',
    badge: '⌚ AMOLED',
    description: 'AMOLED touchscreen smartwatch, GPS, ECG, SpO2 and built-in running coach. Bluetooth calls, contactless payment, 100+ faces.',
    longDescription: 'A premium smartwatch to transform your training. Large AMOLED touchscreen, built-in GPS to track your routes, advanced sensors (ECG, blood oxygen SpO2, heart rate). Built-in running coach with personalized plans, heart-rate-zone alerts and recovery. Take Bluetooth calls, pay contactless, and customize from 100+ watch faces. Compatible with iOS & Android.',
    features: ['AMOLED touchscreen', 'GPS + ECG + SpO2', 'Built-in running coach', 'Bluetooth calls', 'iOS & Android compatible'],
    tags: ['smartwatch', 'apple watch', 'ecg', 'running', 'cardio'],
  },
  v1: {
    name: 'Men\'s Performance Training Shorts',
    description: '4-way stretch shorts, Dry-Fit moisture-wicking. Zip pocket. Sizes S-XXL. Black, gray, navy.',
    longDescription: 'Designed for athletes who make no compromise on performance. The 4-way stretch fabric hugs the body perfectly without restricting movement. Dry-Fit technology wicks sweat 3x faster than cotton. Secure side zip pocket for a smartphone. Reinforced seams that withstand intensive washing.',
    features: ['4-way stretch fabric', 'Dry-Fit moisture-wicking', 'Zip pocket', 'S to XXL', '3 colors available'],
    tags: ['shorts', 'training', 'running', 'men'],
  },
  v2: {
    name: 'Women\'s High-Waist Compression Leggings',
    badge: '❤️ Best Seller',
    description: 'Graduated compression, high waist, opaque anti-UV fabric. Phone pocket. XS-XL. 5 colors.',
    longDescription: 'The XENOTIF compression leggings offer optimal support for every discipline. The flat high waist holds the belly without compressing. The opaque fabric (280 GSM) is anti-UV certified and resists see-through even during squats. Graduated compression improves blood circulation and reduces soreness.',
    features: ['Graduated compression', 'Flat high waist', 'Opaque anti-UV', 'Phone pocket', 'XS to XL · 5 colors'],
    tags: ['leggings', 'compression', 'women', 'yoga'],
  },
  v3: {
    name: 'Men\'s Performance Compression Leggings',
    badge: '🆕 New',
    description: 'Men\'s compression leggings, breathable technical fabric. Muscle support, fast drying. Ideal for running, strength, CrossFit. S-XXL.',
    longDescription: 'The XENOTIF men\'s compression leggings offer optimal muscle support that reduces vibration and fatigue. The 4-way stretch technical fabric wicks sweat and dries fast. Flat anti-chafe seams, comfortable elastic waist and a side pocket. Perfect worn alone or under shorts for running, strength, CrossFit or as a base layer.',
    features: ['Muscle compression', '4-way stretch fabric', 'Fast drying', 'Anti-chafe seams', 'S to XXL'],
    tags: ['leggings', 'compression', 'men', 'running'],
  },
  d1: {
    name: 'Muscle Gain Program — Complete 12 Weeks',
    badge: '📥 Bestseller',
    description: '84 structured sessions, 4-day/week split, guided load progression. Nutrition plan + macros. PDF + videos.',
    longDescription: 'The most complete muscle-gain program on the market. 84 sessions over 12 weeks with week-by-week load progression. Includes: detailed muscle split, personalized macro calculation by body type, recovery guide, 40+ exercises illustrated in HD video. Built-in progress tracking in Excel.',
    features: ['84 sessions over 12 weeks', '4-day/week split', 'Guided load progression', 'Nutrition plan + macros', 'HD videos included'],
    tags: ['muscle gain', 'strength', 'program', 'PDF'],
    level: 'Intermediate', duration: '12 weeks',
  },
  d2: {
    name: 'Cutting Nutrition Plan — 8 Weeks',
    badge: '📥 Instant PDF',
    description: '56 days of detailed menus, 40+ fitness recipes, shopping list, macros. Vegan compatible.',
    longDescription: 'The most downloaded cutting nutrition plan on the platform. 56 days of varied menus calculated by our certified nutritionist. Each meal is optimized to maintain satiety while creating the necessary caloric deficit. Simple, fast recipes (under 15 min). Vegan-compatible with a single selection.',
    features: ['56 days of menus', '40+ fitness recipes', 'Weekly shopping list', 'Personalized macros', 'Vegan compatible'],
    tags: ['nutrition', 'cutting', 'diet', 'PDF'],
    level: 'All levels', duration: '8 weeks',
  },
  d3: {
    name: 'Fat-Burning HIIT Program — 6 Weeks',
    badge: '🔥 Popular',
    description: '24 sessions of 20–30 min, 100% bodyweight. No equipment. Beginner → advanced. Guaranteed results.',
    longDescription: 'The XENOTIF HIIT program is designed by our CrossFit Level 2 certified coach. 4 sessions per week of 20 to 30 minutes maximum, 100% bodyweight — no equipment required. The progressive build guarantees optimal adaptation without injury risk. Each session includes a built-in timer and demonstration videos.',
    features: ['24 sessions of 20–30 min', 'No equipment', 'Beginner → advanced', 'Built-in timer', 'HD demo videos'],
    tags: ['HIIT', 'fat-burning', 'bodyweight', 'cardio'],
    level: 'Beginner to advanced', duration: '6 weeks',
  },
  d4: {
    name: 'Running Guide — From 5K to Marathon',
    badge: '📥 120-page e-book',
    description: '120-page e-book. 5K/10K/half/marathon plans. Race nutrition, injury prevention, competitor mindset.',
    longDescription: 'The XENOTIF running guide covers the full spectrum of the modern runner. Written by a certified athletics coach, it includes personalized plans for 4 distances, nutrition advice before/during/after a race, a 7-point anti-injury protocol and a proven mental preparation. 120 richly illustrated pages.',
    features: ['120 expert pages', '5K/10K/half/marathon plans', 'Race nutrition', 'Injury prevention', 'Competitor mindset'],
    tags: ['running', 'marathon', 'running', 'e-book'],
    level: 'All levels', duration: '8 to 16 weeks',
  },
  c1: {
    name: 'Aerodynamic Road Bike Helmet',
    badge: '🚴 Safety',
    description: 'Lightweight, ventilated bike helmet with a reinforced shell and adjustment dial. Safety and comfort on road and trail.',
    longDescription: "A good helmet is a cyclist's first non-negotiable piece of gear. This aerodynamic model pairs a reinforced in-mold shell with an ultra-light build (~250 g) for optimal protection without discomfort. Wide vents keep your head cool on long rides, and the micro-adjustment dial ensures a perfect fit for any head shape. Water-repellent straps and a removable visor included.",
    features: ['Reinforced in-mold shell', 'Ultra-light (~250 g)', 'Multiple vents', 'Adjustment dial', 'Removable visor'],
    tags: ['bike helmet', 'safety', 'cycling', 'road'],
  },
  c2: {
    name: 'Wireless Bike GPS Computer',
    badge: '📡 GPS',
    description: 'Waterproof GPS computer: speed, distance, elevation, route. Large sunlight-readable screen, 25 h battery, quick mount.',
    longDescription: 'Track every ride accurately with this wireless GPS computer. It logs speed, distance, time, altitude, elevation gain and GPS route, and syncs with Strava and Komoot. Transflective screen perfectly readable in direct sunlight, 25-hour battery and IPX7 water resistance. The included handlebar mount installs in seconds without tools. Compatible with ANT+ sensors (heart rate, cadence, speed).',
    features: ['GPS speed/distance/elevation', 'Strava & Komoot sync', 'Sunlight-readable screen', '25 h battery · IPX7', 'ANT+ compatible'],
    tags: ['gps computer', 'cycling', 'strava', 'bike'],
  },
  c4: {
    name: '4D Padded Cycling Shorts',
    badge: '🩳 Comfort',
    description: 'Cycling shorts with a breathable 4D chamois pad. Compressive fabric, anti-slip grippers. Comfort over long distances.',
    longDescription: "Comfort on the bike starts on the saddle: these shorts feature a high-density 4D chamois pad that cushions impacts and prevents chafing, even after several hours. The compressive, breathable fabric wicks sweat and supports the muscles, while silicone leg grippers keep the shorts in place. Flat anti-friction seams. The foundation of any serious cyclist's kit.",
    features: ['4D chamois pad', 'Breathable compressive fabric', 'Anti-slip grippers', 'Flat seams', 'Long distances'],
    tags: ['cycling shorts', 'cycling', 'apparel', 'road'],
  },
  c5: {
    name: 'Half-Finger Anti-Shock Cycling Gloves',
    badge: '🧤 Grip',
    description: 'Half-finger cycling gloves with anti-shock gel, breathable palm and pull-off tabs. Better grip, less fatigue.',
    longDescription: 'Gloves protect your hands from vibration and falls while improving grip on the bars. This half-finger model has gel pads at pressure points to absorb shocks and reduce numbness on long rides. Breathable mesh back, non-slip suede palm, and handy pull-off tabs. A terry zone on the thumb to wipe your brow.',
    features: ['Anti-shock gel', 'Non-slip palm', 'Breathable back', 'Pull-off tabs', 'Half-finger'],
    tags: ['cycling gloves', 'cycling', 'anti-shock', 'grip'],
  },
  c7: {
    name: 'Bike Water Bottle 750 ml + Cage',
    badge: '💧 Hydration',
    description: '750 ml BPA-free bottle + lightweight aluminum cage. Easy one-handed drinking, mounts on the frame.',
    longDescription: 'Staying hydrated regularly is key on the bike. This set combines a 750 ml BPA-free squeeze bottle with a leak-proof, high-flow nozzle for one-handed drinking, and a lightweight aluminum cage that bolts to the frame inserts. The bottle is squeezable, easy to press and dishwasher-safe. The cage holds the bottle firmly even on rough terrain.',
    features: ['750 ml BPA-free bottle', 'Leak-proof nozzle', 'Aluminum cage', 'One-handed drinking', 'Dishwasher-safe'],
    tags: ['water bottle', 'bottle cage', 'hydration', 'cycling'],
  },
  s1: {
    name: 'Anti-Fog Swimming Goggles',
    badge: '🥽 Anti-fog',
    description: 'Watertight swimming goggles with anti-fog, anti-UV lenses and soft silicone seals. Clear vision and comfort, no leaks.',
    longDescription: 'Goggles that don\'t fog up or leak transform a swim session. This model combines a durable anti-fog coating with anti-UV protection for clear vision in the pool and open water. The soft silicone seals hug the contour of the eyes without leaving marks, and the interchangeable nose bridge (3 sizes included) fits any face. Double strap adjustable with one hand.',
    features: ['Durable anti-fog lenses', 'Anti-UV protection', 'Soft silicone seals', '3 nose bridges included', 'One-handed strap adjust'],
    tags: ['swimming goggles', 'anti-fog', 'swimming', 'pool'],
  },
  s2: {
    name: 'Silicone Swim Cap',
    badge: '🏊 Essential',
    description: '100% silicone swim cap, watertight and comfortable. Reduces drag, protects hair from chlorine. Unisex, one size.',
    longDescription: 'The silicone cap is every swimmer\'s basic accessory: it protects hair from chlorine, reduces drag in the water and keeps the head warm. This 100% silicone model is soft, durable and easy to put on without pulling hair. It stays firmly in place during laps and won\'t irritate the forehead. One size fits men, women and teens.',
    features: ['Soft 100% silicone', 'Watertight & comfortable', 'Reduces drag', 'Protects hair', 'Unisex one size'],
    tags: ['swim cap', 'silicone', 'swimming', 'pool'],
  },
  s3: {
    name: 'Swim Kickboard',
    badge: '🏊 Training',
    description: 'EVA foam board to strengthen your leg kick. Lightweight, ergonomic, high buoyancy. Ideal for training.',
    longDescription: 'The kickboard is the essential tool for working on your leg kick and body position. Made of high-density EVA foam, it offers high buoyancy while staying light and chlorine-resistant. Its ergonomic shape with hand cut-outs ensures a comfortable grip for any drill. Suitable for beginner and advanced swimmers alike for technique work and conditioning.',
    features: ['High-density EVA foam', 'High buoyancy', 'Ergonomic hand cut-outs', 'Chlorine-resistant', 'Beginner to advanced'],
    tags: ['kickboard', 'swim board', 'training', 'swimming'],
  },
  s4: {
    name: 'Chlorine-Resistant Swimsuit',
    badge: '🩱 Endurance',
    description: 'Chlorine-resistant training swimsuit, quick-drying, snug fit. Lasts hundreds of pool sessions.',
    longDescription: 'Built for intensive training, this chlorine-resistant fabric swimsuit keeps its shape and colors session after session — where a regular suit sags within weeks. The snug fit reduces drag in the water, it dries quickly and the flat seams prevent chafing. The durable choice for anyone clocking up the laps.',
    features: ['Chlorine-resistant fabric', 'Quick-drying', 'Snug low-drag fit', 'Flat seams', 'Long-lasting'],
    tags: ['swimsuit', 'swimming', 'chlorine-resistant', 'pool'],
  },
  a1: {
    name: 'Doorway Pull-Up Bar — No Screws',
    badge: '🔥 Best Seller',
    description: 'Multi-grip pull-up bar for door frames, no drilling. Up to 130 kg. Train back, biceps and core at home.',
    features: ['No screws or drilling', 'Multi-grip', 'Up to 130 kg', 'Non-slip foam', 'Reinforced steel'],
    tags: ['pull-up bar', 'back', 'strength', 'home'],
  },
  a2: {
    name: 'Adjustable Foldable Weight Bench',
    badge: '💪 Home Gym',
    description: '7-position incline bench, foldable and compact. Ideal for bench press, curls and dumbbell work at home.',
    features: ['7 incline positions', 'Foldable & compact', 'Up to 250 kg', 'High-density padding', 'Steel frame'],
    tags: ['weight bench', 'dumbbells', 'bench press', 'home'],
  },
  a3: {
    name: 'Wooden Gymnastic Rings + Straps',
    badge: '🆕 New',
    description: 'Pair of wooden rings with numbered adjustable straps. Dips, pull-ups, muscle-ups — calisthenics and CrossFit.',
    features: ['Natural-grip wood', '4.5 m numbered straps', 'Quick-lock buckles', 'Dips & pull-ups', 'Muscle-ups'],
    tags: ['gymnastic rings', 'calisthenics', 'crossfit', 'street workout'],
  },
  a4: {
    name: 'Rotating Push-Up Bars (pair)',
    badge: '🤲 Grip',
    description: 'Rotating push-up bars that ease strain on wrists and shoulders. Greater range for sharper chest gains.',
    features: ['Natural rotation', 'Wrist-friendly', 'Greater range', 'Non-slip base', 'Travel-friendly'],
    tags: ['push-ups', 'push-up bars', 'chest', 'bodyweight'],
  },
  a5: {
    name: '40L Gym Bag with Shoe Compartment',
    badge: '🎒 Bestseller',
    description: 'Durable 40L gym bag with vented shoe compartment and wet pocket. Ideal for the gym, travel and weekends.',
    features: ['40 L', 'Vented shoe compartment', 'Waterproof wet pocket', 'Water-repellent fabric', 'Padded strap'],
    tags: ['gym bag', 'duffel', 'travel', 'accessory'],
  },
  a6: {
    name: 'Insulated Sports Bottle 2L Stainless',
    badge: '💧 Hydration',
    description: '2L double-wall stainless bottle, cold for 24h. Graduated, leak-proof, wide mouth. For long sessions.',
    features: ['2 L double-wall', 'Cold for 24h', 'Graduated', 'Leak-proof', 'BPA-free'],
    tags: ['water bottle', 'hydration', 'stainless', 'sport'],
  },
  a7: {
    name: 'Protein Shaker 700ml Leak-Proof + Ball',
    badge: '🥤 Essential',
    description: '700ml shaker with stainless mixing ball, no clumps. Airtight leak-proof lid, graduations, BPA-free.',
    features: ['Stainless ball, no clumps', '700 ml', 'Airtight leak-proof', 'oz/ml graduations', 'BPA-free'],
    tags: ['shaker', 'protein', 'whey', 'nutrition'],
  },
  a8: {
    name: 'Waterproof Sport Bluetooth Earbuds IPX7',
    badge: '🎧 IPX7',
    description: 'Wireless ear-hook earbuds, secure fit, IPX7 waterproof. 40h battery, deep bass. Running and lifting.',
    features: ['Secure ear-hooks', 'IPX7 waterproof', '40h battery', 'Deep bass', 'Bluetooth 5.3'],
    tags: ['earbuds', 'bluetooth', 'sport', 'running'],
  },
  b1: { name: 'Boxing Gloves 12oz Synthetic Leather', badge: '🥊 Best Seller', description: '12oz boxing gloves, multi-layer padding, wrist support, breathable lining. Bag, sparring and fitness boxing.', features: ['12oz multi-layer', 'Wrist support', 'Breathable lining', 'Durable synthetic leather', 'Bag & sparring'], tags: ['boxing gloves', 'boxing', 'punching bag', 'sparring'] },
  b2: { name: 'Boxing Hand Wraps 4.5m (pair)', badge: '🥊 Essential', description: 'Semi-elastic 4.5m wraps, protect wrists and joints. Velcro and thumb loop. A must before the gloves.', features: ['4.5m per wrap', 'Protect wrists & knuckles', 'Thumb loop', 'Wide velcro', 'Washable'], tags: ['hand wraps', 'wraps', 'boxing', 'protection'] },
  b3: { name: 'Hanging Punching Bag 120cm + Chain', badge: '🥊 Pro', description: 'Filled 120cm punching bag, chain hanging and anti-twist swivel. Boxing, kickboxing and cardio.', features: ['120cm filled', 'Chain + swivel', 'Anti-twist', 'Strike-resistant', 'Boxing & cardio'], tags: ['punching bag', 'boxing', 'kickboxing', 'cardio'] },
  b4: { name: 'Curved Focus Mitts (pair)', badge: '🥊 Duo', description: 'Pair of curved focus mitts, padded strike target. Train speed, precision and combos with a partner.', features: ['Curved multi-layer', 'Impact-absorbing', 'Breathable glove', 'Speed & precision', 'Partner work'], tags: ['focus mitts', 'punch mitts', 'boxing', 'precision'] },
  b5: { name: 'Free-Standing Punching Bag', badge: '🥊 No Drilling', description: 'Free-standing punching bag, fillable base (water/sand), adjustable height. No drilling, ideal for flats.', features: ['Fillable water/sand base', 'Adjustable height', 'No drilling', 'Auto return', 'Ideal for flats'], tags: ['punching bag', 'free-standing', 'boxing', 'home'] },
  m1: { name: 'Cork Yoga Blocks (set of 2)', badge: '🧘 Natural', description: 'Pair of natural cork blocks, non-slip, support poses and improve alignment.', features: ['Natural cork', 'Non-slip', 'Pose support', 'Alignment', 'Set of 2'], tags: ['yoga block', 'cork', 'yoga', 'stretching'] },
  m2: { name: 'Yoga Stretching Strap 10 Loops', badge: '🧘 Flexibility', description: '10-loop stretching strap, gain flexibility safely. Ideal for yoga, mobility and rehab.', features: ['10 loops', 'Guided stretching', 'No partner', 'Non-stretch fabric', 'Yoga & mobility'], tags: ['stretching strap', 'yoga', 'mobility', 'flexibility'] },
  m3: { name: 'Back-Pain Yoga Wheel', badge: '🧘 Mobility', description: 'Yoga wheel to open the chest, stretch the back and relieve tension. Holds up to 150 kg.', features: ['Opens the chest', 'Stretches the back', 'Up to 150 kg', 'Non-slip', 'Anti-tension'], tags: ['yoga wheel', 'back', 'mobility', 'stretching'] },
  m4: { name: 'Mobility Loop Bands (set of 5)', badge: '🧘 Activation', description: 'Set of 5 mini loop bands, 5 resistances. Activation, hip/shoulder mobility, glutes and rehab.', features: ['5 resistances', 'No roll', 'Mobility & activation', 'Glutes', 'Pouch included'], tags: ['loop bands', 'mobility', 'glutes', 'activation'] },
  m5: { name: 'Trigger Massage Balls (set of 3)', badge: '🧘 Recovery', description: 'Set of 3 balls of varying density, target tension points. Self-massage, mobility and recovery.', features: ['3 densities', 'Targeted self-massage', 'Tension points', 'Pre/post workout', 'Compact'], tags: ['massage ball', 'trigger point', 'mobility', 'recovery'] },
  m6: { name: 'Pro Multi-Loop Stretching Band', badge: '🧘 Flexibility', description: 'Multi-loop stretching band for dance, gym and mobility. Guided, gentle flexibility progression.', features: ['Thick multi-loop', 'Guided stretching', 'Gentle progression', 'Dance & gym', 'Travel-friendly'], tags: ['stretching band', 'stretching', 'flexibility', 'mobility'] },
  u1: { name: 'Pre-Workout Energy & Focus', badge: '⚡ Energy', description: 'Pre-workout booster: caffeine, beta-alanine and citrulline for energy, pump and focus. Sugar-free.', features: ['Caffeine + beta-alanine', 'L-citrulline', 'Energy & focus', 'Sugar-free', 'Fast-dissolving'], tags: ['pre-workout', 'caffeine', 'energy', 'nutrition'] },
  u2: { name: 'Hydration Electrolytes (tablets)', badge: '💧 Endurance', description: 'Effervescent sodium/potassium/magnesium tablets. Rehydration and anti-cramp for endurance.', features: ['Sodium/potassium/magnesium', 'Anti-cramp', 'Rehydration', 'Effervescent', 'Low-calorie'], tags: ['electrolytes', 'hydration', 'endurance', 'nutrition'] },
  u3: { name: 'Protein Bars 20g (box of 12)', badge: '🍫 Snack', description: '20g protein bars, low sugar, indulgent coating. The perfect post-training or on-the-go snack.', features: ['20g protein', 'Low sugar', 'Indulgent coating', 'Box of 12', 'On-the-go'], tags: ['protein bars', 'protein', 'snack', 'nutrition'] },
  u4: { name: 'Omega-3 EPA/DHA (120 capsules)', badge: '🐟 Recovery', description: 'Concentrated EPA/DHA fish oil. Heart, joints and recovery. No aftertaste.', features: ['Concentrated EPA/DHA', 'Heart & joints', 'Recovery', 'No aftertaste', '120 capsules'], tags: ['omega-3', 'epa dha', 'recovery', 'nutrition'] },
  w1: { name: 'Swim Hand Paddles (pair)', badge: '🏊 Technique', description: 'Hand paddles to strengthen the upper body and refine the catch. Adjustable straps.', features: ['Strengthens upper body', 'Refines the catch', 'Adjustable straps', 'Multiple sizes', 'Pool training'], tags: ['hand paddles', 'swimming', 'technique', 'strength'] },
  w2: { name: 'Pull Buoy Leg Float', badge: '🏊 Core', description: 'Pull buoy between the thighs: isolates arm work and improves body position. Durable foam.', features: ['Isolates arm work', 'Improves position', 'Durable EVA foam', 'Core', 'Pool training'], tags: ['pull buoy', 'swimming', 'float', 'technique'] },
}

// Mots-clés de recherche en allemand → liens affiliés amazon.de pour la locale EN
// (le tag xenotif-21 fonctionne sur tous les marketplaces EU).
const AMAZON_DE_KEYWORDS: Record<string, string> = {
  e1: 'kettlebell 20kg gusseisen',
  e2: 'widerstandsbänder fitness set',
  e3: 'yogamatte rutschfest 10mm',
  e4: 'springseil speed rope crossfit',
  e5: 'verstellbare hanteln set',
  e6: 'heimtrainer fahrrad ergometer',
  e7: 'ab roller bauchtrainer bauchroller',
  n1: 'whey protein schokolade 1kg',
  n2: 'kreatin monohydrat pulver',
  n3: 'bcaa pulver',
  r1: 'faszienrolle foam roller',
  r2: 'massagepistole muskel',
  t1: 'sportuhr gps pulsuhr multisport',
  t2: 'fitness tracker armband pulsmesser',
  t3: 'smartwatch fitness gps herzfrequenz',
  v1: 'sport shorts herren training fitness',
  v2: 'sport leggings damen high waist fitness',
  v3: 'kompression leggings herren sport tights',
  c1: 'fahrradhelm rennrad',
  c2: 'fahrradcomputer gps kabellos',
  c4: 'radhose herren gepolstert',
  c5: 'fahrradhandschuhe halbfinger',
  c7: 'fahrrad trinkflasche flaschenhalter',
  s1: 'schwimmbrille antibeschlag',
  s2: 'badekappe silikon',
  s3: 'schwimmbrett kickboard',
  s4: 'badeanzug schwimmen chlorresistent',
  a1: 'klimmzugstange türrahmen ohne bohren',
  a2: 'hantelbank verstellbar klappbar',
  a3: 'turnringe holz gymnastik',
  a4: 'liegestützgriffe drehbar',
  a5: 'sporttasche schuhfach',
  a6: 'isolierte trinkflasche 2l edelstahl',
  a7: 'protein shaker blender bottle',
  a8: 'sport kopfhörer bluetooth wasserdicht',
  b1: 'boxhandschuhe 12oz', b2: 'boxbandagen handbandagen', b3: 'boxsack hängend 120cm',
  b4: 'pratzen boxen handpratzen', b5: 'standboxsack freistehend',
  m1: 'yogablöcke kork', m2: 'yoga gurt stretching schlaufen', m3: 'yoga rad rücken',
  m4: 'mobility bänder loop', m5: 'massagebälle trigger point', m6: 'stretchband gymnastik schlaufen',
  u1: 'pre workout booster', u2: 'elektrolyte tabletten', u3: 'proteinriegel 20g', u4: 'omega 3 epa dha kapseln',
  w1: 'schwimm paddles handpaddles', w2: 'pull buoy schwimmen',
}

export const PRODUCTS_EN: Product[] = PRODUCTS.map((p) => {
  const merged: Product = { ...p, ...TEXT_EN[p.id] }
  const deKeywords = AMAZON_DE_KEYWORDS[p.id]
  if (p.amazon && deKeywords) {
    merged.amazon = { ...p.amazon, affiliateUrl: amazonSearchUrl('www.amazon.de', deKeywords, AMAZON_TAG_DE) }
  }
  return merged
})

// Catalogue localisé : repli FR si la langue n'a pas de variante.
export function getProductsLocalized(locale: string): Product[] {
  return locale === 'en' ? PRODUCTS_EN : locale === 'de' ? PRODUCTS_DE : PRODUCTS
}

export function getProductBySlugLocalized(slug: string, locale: string): Product | undefined {
  return getProductsLocalized(locale).find((p) => p.slug === slug)
}

export function getProductByIdLocalized(id: string, locale: string): Product | undefined {
  return getProductsLocalized(locale).find((p) => p.id === id)
}
