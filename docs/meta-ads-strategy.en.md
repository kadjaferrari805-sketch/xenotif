# 📊 Meta Ads Strategy — Xenotif® (English-speaking markets)

> Marketing working document. Pixel `1260922799206843` + Conversions API live.
> Optimisation: sales (guides) + fitness subscriptions. Language: **English**, targeting **English-speaking**.

---

## 1. Offer analysis
- **AI-personalised** multi-discipline coaching (running, strength, HIIT, CrossFit, swimming, cycling).
- Subscriptions: **Pro €9.99/month** (€95.88/year) · **Elite €24.99/month** (€239.88/year) · **7-day free trial, no commitment**.
- **Store**: digital guides €14.90–29 (bulking, cutting, HIIT, running) + Amazon affiliate products.
- Promise: "Forge your body. Push your limits."
- Key angle: personal trainer (~€200/month) → AI at €9.99, at home, risk-free trial.

> Pricing note: keep prices in EUR (Stripe bills in EUR). Meta auto-displays the viewer's local-currency equivalent (£/$/A$/C$), so €9.99 reads as ≈ £8.50 / $11 / A$16 to each audience.

---

## 2. English-speaking market targeting

**Tier 1 — priority paid subscription (high purchasing power, card payment standard)**
- 🇬🇧 United Kingdom · 🇮🇪 Ireland · 🇺🇸 United States · 🇨🇦 Canada (English) · 🇦🇺 Australia · 🇳🇿 New Zealand.
- Currencies shown by Meta per country; your billing stays in EUR (Stripe handles card conversion).

**Tier 2 — volume test / digital guides (lower CPA, harder subscription conversion)**
- 🇮🇳 India · 🇵🇭 Philippines · 🇿🇦 South Africa · 🇳🇬 Nigeria · 🇵🇰 Pakistan.
- Recommendation: keep these countries in **dedicated ad sets** (do NOT mix them with Tier 1, or the budget flows to the cheapest CPM at the expense of value). Push the **€14.90 guides** here rather than the subscription.

**Language setting**: in the ad set → Languages → **English** (avoids serving non-English speakers in multilingual countries like Canada/India/South Africa).

---

## 3. Campaign structure

**Phase 1 — Test (W1-W2)**
| Campaign | Objective | Optimised event | Geo |
|---|---|---|---|
| C1 – Subscriber acquisition | Sales/Conversions | `CompleteRegistration` → `Subscribe` | Tier 1 |
| C2 – Store guides | Sales/Conversions | `Purchase` | Tier 1 (+ Tier 2 test) |
| C3 – Awareness/Traffic | Traffic/Engagement | click / ViewContent | Tier 1 |

**Phase 2 — Scaling**
| Campaign | Detail |
|---|---|
| C4 – Retargeting | site visitors 7/14/30 d + cart abandons → Subscribe/Purchase |
| C5 – Lookalike | LLA 1-3% (buyers/subscribers), country by country |
| C6 – Advantage+ Shopping (ASC) | Meta-automated to scale winners |

Rules: 1 campaign = 1 objective · 2-3 ad sets · 3-5 creatives/ad set · CBO after the test validates.

---

## 4. Budget

| Stage | Budget/day | Duration | Goal |
|---|---|---|---|
| Test | €20-30 (€12 C1 / €8 C2 / €5 C3) | 7-14 d | find winning creatives + audiences |
| Learning | aim for ≥ 50 conversions/week/ad set | — | exit the learning phase |
| Scaling | +20-30% every 3-4 d on winners | ongoing | scale without breaking the algo |

Cut a creative below **1% CTR** or **CPA > 2× target**. Don't judge before 3-4 days.

---

## 5. 10 audiences

**Cold**
1. Fitness beginners — *getting in shape, weight loss, healthy lifestyle* · 18-45.
2. Strength training — *bodybuilding, MyProtein, weightlifting, whey* · M 18-40.
3. Running — *running, marathon, Strava, half-marathon* · 20-50.
4. HIIT/CrossFit — *CrossFit, Freeletics, intervals* · 18-40.
5. Women's fitness — *yoga, pilates, women's fitness* · F 20-45.
6. Apps & coaching (competitors) — *Nike Training Club, Freeletics, Fitbit, PureGym, Gymshark* · 18-45.
7. Sports nutrition — *sports nutrition, cutting, supplements* · 20-45.
8. Comeback/resolutions — *gym, motivation* (boost Jan/Sept).

**Warm**
9. Site visitors 7/14/30 d (Pixel), exclude buyers.
10. Lookalike 1-3% on `CompleteRegistration` + `Purchase` (from ~100 conv).

---

## 6. 20 ad texts (Primary text)

1. **What if your personal trainer fit in your pocket?** 100% AI-personalised programmes, tailored to your level and schedule. 🏋️ Try 7 days free.
2. **€200/month for a personal trainer? Not anymore.** Xenotif® coaches you with AI from €9.99/month. Running, strength, HIIT… your tailor-made plan. 7-day free trial.
3. No time for the gym? **Train wherever, whenever you want.** Guided 20–45 min sessions, at home. First results in 30 days. 💪
4. **Starting fitness again… one more time?** This time, an AI coach follows you day after day so you don't quit. 7 days free, no commitment.
5. Strength, running, HIIT, CrossFit, swimming, cycling… **one subscription, all your sports.** AI coaching + progress tracking. Try 7 days free.
6. **Your body can do it. It's your mind you need to convince.** Xenotif® motivates you every day with a clear plan and measurable results. 🔥 Start free.
7. Stop following random programmes. **A real plan, built for YOU**, that evolves with your progress. AI coaching from €9.99/month.
8. **7 days to transform your routine.** Try Xenotif® free: personalised programmes, HD videos, performance tracking. No commitment.
9. Motivation is built. **Xenotif® sends you your challenge of the day** and guides every session. Join thousands of athletes. 7 days free.
10. **Beginner? Perfect.** We take you by the hand: filmed exercises, gradual progression, zero injury risk. First programme free for 7 days.
11. **Bulking, cutting, endurance…** whatever your goal, Xenotif® calculates your plan and your macros. AI coaching + nutrition. Free trial.
12. The secret of fit people? **Consistency, not motivation.** Xenotif® makes training simple and addictive. 7 days free.
13. **Turn 20 minutes a day into visible results.** Ultra-efficient HIIT sessions, no equipment, at home. Start your free trial. ⚡
14. Your first 10K? Your marathon? **A personalised training plan, week by week.** Xenotif® gets you there. Try 7 days.
15. **Over 3,200 athletes trust us.** AI programmes, HD videos, full tracking. Join them with 7 days free. 💪
16. Tired of crowded gyms and overpriced memberships? **Your gym is your home.** Xenotif® from €9.99/month. 7-day free trial.
17. **Your nutrition + training plan, in one place.** Calculated macros, fitness recipes, guided sessions. Try it free.
18. Every day without a plan is a day lost. **Take back control of your fitness today** with AI coaching that adapts to you. 7 days free.
19. **Women: a programme built for you.** Strength, tone, confidence. Guided, progressive sessions, at your own pace. Try free.
20. **Premium training guides from €14.90.** 12-week bulking, cutting, HIIT, running… instant download. Forge your body, starting today.

---

## 7. 20 headlines

1. Your AI coach for €9.99/month
2. 7 days free, no commitment
3. Forge your body. Push your limits.
4. Personal training finally affordable
5. All your sports, one subscription
6. Transform yourself in 30 days
7. Your gym is your home
8. A programme just for you
9. Try 7 days free
10. Stop quitting. This time.
11. AI coaching + nutrition included
12. 20 min/day = results
13. Beginner? We've got you
14. Run your first 10K
15. Build muscle in 12 weeks
16. Cheaper than a coffee a day
17. Join 3,200+ athletes
18. Your plan, your rules, your results
19. Strength, running, HIIT… at home
20. Start your transformation today

---

## 8. 20 descriptions

1. Personalised AI coaching. Cancel anytime.
2. Programmes tailored to your level and goal.
3. HD videos, performance tracking, daily motivation.
4. Running, strength, HIIT, CrossFit, swimming, cycling.
5. No commitment. First results in 30 days.
6. Try 7 days, pay only if you continue.
7. Over 3,200 athletes trust us.
8. Your nutrition + training plan combined.
9. At home, no equipment, at your own pace.
10. From €9.99/month — less than a gym membership.
11. The AI that adapts to every session.
12. Calculated macros and fitness recipes included.
13. For beginners and the experienced alike.
14. Lasting results, not crash diets.
15. Join the Xenotif® community today.
16. Download your premium guide in 1 click.
17. Progress week after week.
18. Cancel in 2 clicks, zero commitment.
19. Premium coaching without the price.
20. Your goal, our method. Start free.

---

## 9. 10 video scripts (production-ready storyboards)

> Format **9:16**, 15-30 s, **burned-in subtitles**, hook < 3 s, logo + CTA at the end. Upbeat royalty-free music (CapCut/Epidemic). Colours: black + orange #FF4500.

### V1 — "€200 vs €9.99"
- **0-3 s**: split screen. Left "PERSONAL TRAINER" + "€200/month" (red). Right Xenotif app + "€9.99/month" (orange). Text: *The same coaching.*
- **3-10 s**: fast montage of sessions (strength, run, HIIT) on the right side. Text: *20× cheaper. In your pocket.*
- **10-15 s**: final screen logo + "7 DAYS FREE". Voice/text: *Try Xenotif® free.* CTA.

### V2 — POV first session
- **0-3 s**: hand opening the app (POV). Text: *Your 1st session starts here.*
- **3-12 s**: guided session sequence (first-person view), sweat, effort, timer. Text: *A plan just for you.*
- **12-18 s**: smile + rising stats screen. CTA *Start free.*

### V3 — Consistency (30 days)
- **0-3 s**: full-screen text *30 days. 1 plan. Results.*
- **3-15 s**: timelapse of a daily routine (app + sessions + ticking off the days). Show **performance progress** (graphs), not the body.
- **15-22 s**: *Consistency, not motivation.* + CTA free trial.

### V4 — "Starting again?" (emotional)
- **0-3 s**: text *Starting fitness again… one more time?* (dark background).
- **3-12 s**: hesitant person → opens Xenotif → gets their "challenge of the day" → trains. Text: *This time, you don't quit.*
- **12-18 s**: *An AI coach that follows you every day.* CTA *7 days free.*

### V5 — Multi-sport
- **0-3 s**: ultra-fast cut run → strength → HIIT → swimming → cycling. Text: *All your sports.*
- **3-10 s**: app showing the discipline picker. Text: *One subscription.*
- **10-15 s**: logo + *From €9.99/month. Free trial.* CTA.

### V6 — App demo (screencast)
- **0-3 s**: *How does it work?*
- **3-15 s**: screen capture: pick discipline → guided session → performance tracking (3 clear steps, zoom).
- **15-20 s**: *Simple. Personalised. Effective.* CTA *Try 7 days.*

### V7 — No equipment at home
- **0-3 s**: someone moves their living-room table. Text: *No gym? No excuse.*
- **3-12 s**: bodyweight session in the living room with the app in front.
- **12-18 s**: *Your gym is your home.* + CTA.

### V8 — UGC testimonial (authentic smartphone style)
- **0-5 s**: a person facing the camera (selfie): *I tested Xenotif® for 30 days, here's what changed…*
- **5-18 s**: they tell the story (consistency, enjoyment, results) + b-roll of their sessions.
- **18-25 s**: *Try the 7 free days, you'll see.* CTA. → **The top-performing format: redo with 2-3 different people.**

### V9 — "20 minutes flat"
- **0-3 s**: large timer **20:00** starting. Text: *That's all it takes.*
- **3-15 s**: intense HIIT montage, timer counting down, sweat.
- **15-20 s**: timer **00:00** + *Session done.* + CTA *Start your 1st free session.*

### V10 — AI coach explainer (simple animation)
- **0-3 s**: *How does the AI build YOUR programme?*
- **3-15 s**: 3 animated steps — 1) Your goals → 2) The AI calculates your plan → 3) You train, it adapts.
- **15-20 s**: logo + *Smart coaching from €9.99/month.* CTA.

---

## 10. 10 image concepts (+ AI prompts)

> 1:1 (feed) and 9:16 (stories). Text < 20% of the image. Black/charcoal + orange #FF4500. Paste the prompts into Midjourney / DALL·E / Ideogram, then add the text in Canva.

1. **Athlete mid-effort** — overlay "7 DAYS FREE".
   `athletic person training hard in a dark modern gym, dramatic orange rim lighting, cinematic motivational fitness photography, empty copy space at top, ultra detailed, 1:1`
2. **App in hand** — overlay "Your coach in your pocket".
   `close-up of a hand holding a smartphone showing a sleek dark fitness app with orange accents, blurred gym background, modern, 1:1`
3. **Price split** — Canva montage: "Personal trainer €200" (struck through) / "Xenotif €9.99" (orange).
4. **Home workout flat-lay** — overlay "Your gym is your home".
   `top-down flat lay of home workout gear: dumbbells, yoga mat, smartphone with fitness app, water bottle, dark moody background, orange accents, 1:1`
5. **Woman strength** — overlay "A programme built for you".
   `fit woman doing a strength workout at home, bright natural light, motivational, authentic, copy space, 1:1`
6. **Runner at sunrise** — overlay "Run your first 10K".
   `runner on an empty road at sunrise, dynamic motion, warm orange tones, cinematic, 9:16`
7. **Bold typography** — Canva: black background, "FORGE YOUR BODY." white + orange accent + logo + CTA.
8. **3-sport grid** — Canva: run / strength / HIIT, overlay "All your sports, one subscription".
9. **Trial badge** — Canva: orange background, "7 DAYS FREE · NO COMMITMENT" + logo.
10. **Store guides** — Canva: PDF covers (bulking, cutting, HIIT, running), overlay "Premium guides from €14.90".

---

## 11. Conversion tracking (already in place)

| Campaign | Optimisation event |
|---|---|
| Subscriber acquisition | `CompleteRegistration` → `Subscribe` |
| Store | `Purchase` (with € value) |
| Retargeting | `InitiateCheckout` → `Subscribe`/`Purchase` |
| Awareness/Traffic | `ViewContent` / click |

Pixel + Conversions API live, deduplication OK. Start on `CompleteRegistration` (volume) then switch to `Subscribe`/`Purchase` at ≥ 50 conv/week.

---

## 12. Step-by-step — first campaign (Subscriber acquisition)

1. **Ads Manager** → **Create**.
2. **Objective**: *Sales*.
3. **Campaign**: name it `C1 – Subscriber acquisition EN` · leave Advantage Campaign Budget **off** at the start (budget at the ad set for cleaner testing).
4. **Ad set**:
   - **Conversion**: Website → event **`CompleteRegistration`**.
   - **Budget**: €12/day.
   - **Audience**: start with 1 broad interest (e.g. *getting in shape*) OR **Advantage+ Audience** (Meta-recommended) with suggestion.
   - **Locations**: United Kingdom, Ireland, United States, Canada, Australia, New Zealand (Tier 1).
   - **Language**: English.
   - **Age**: 18-45.
   - **Placements**: **Advantage+ (automatic)**.
5. **Ad**:
   - Format: *Single image or video* (test 1 video + 1 image per ad).
   - **Primary text**: one of the 20 · **Headline**: one of the 20 · **Description**: one of the 20.
   - **Destination**: `https://xenotif.com/en/auth/signup?plan=pro` (or the home page).
   - **CTA**: *Sign up* or *Start free*.
6. Build **3-4 ads** (different angles) in the same ad set.
7. **Publish** → let it run **3-4 days without touching it**.

> Then duplicate the winning ad set for C2 (Store, objective `Purchase`, destination `/en/boutique`).

---

## 13. Optimisation & compliance

- Learning: aim for 50 conv/week/ad set, touch nothing for 3-4 d.
- Scaling: +20% budget every 3-4 d on winners; or duplicate into CBO.
- **Creative drives 80% of the result**: test 4-5 angles, refresh every 2 weeks (creative fatigue). **UGC > polished production** in fitness.
- ⚠️ **Meta compliance**: no guilt-tripping "before/after", no close-ups on body flaws, no unrealistic numeric promises. Stay positive and factual to avoid rejections.

---

*Last updated: June 2026.*
