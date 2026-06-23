# 🔍 Google Ads Strategy — Xenotif® (English-speaking markets)

> Marketing working document. GA4 `G-3H3JTM404V` live (gtag.js in the layout).
> ⚠️ **Google Ads conversions not yet configured** (see §10 before launching).
> Optimisation: sales (guides) + fitness subscriptions. Language: **English**, targeting **English-speaking**.

---

## 0. Google ≠ Meta — why this doc is different

| | Meta Ads | Google Ads |
|---|---|---|
| Logic | **Interruption** (pushed to people not searching) | **Intent** (answers an active search) |
| Creative lever | Video/UGC that stops the scroll | **Keyword** + relevant text ad |
| Purchase intent | Low → medium | **High** on Search |
| Cost | Low CPM, variable CPA | Higher CPC but **warm traffic** |
| Key format | 9:16 video | **RSA** (Responsive Search Ads) + **Performance Max** |

**Takeaway**: on Google, the make-or-break isn't the creative but the **keyword choice + negatives**. You capture people already typing "online personal trainer" or "muscle building program".

---

## 1. Offer analysis
- **AI-personalised** multi-discipline coaching (running, strength, HIIT, CrossFit, swimming, cycling).
- Subscriptions: **Pro €9.99/month** (€95.88/year) · **Elite €24.99/month** (€239.88/year) · **7-day free trial, no commitment**.
- **Store**: digital guides €14.90–29 (bulking, cutting, HIIT, running) + Amazon affiliate products.
- Promise: "Forge your body. Push your limits."
- Key angle: personal trainer (~€200/month) → AI at €9.99, at home, risk-free trial.

> Pricing note: prices stay in EUR (Stripe bills in EUR). Google/your store can display the local-currency equivalent (£/$/A$); €9.99 reads as ≈ £8.50 / $11 / A$16.

---

## 2. Campaign types to run (and in what order)

| Priority | Type | Objective | Why |
|---|---|---|---|
| 1 | **Search — Brand** | Protect "xenotif" | Stop competitors buying your name. Near-zero CPC, huge ROAS. |
| 2 | **Search — Generic** | Subscription + guide acquisition | Captures intent ("online personal trainer", "workout plan"). Core of the account. |
| 3 | **Performance Max** | Sales (subscription + store) | Google-automated: Search + Display + YouTube + Gmail + Discover. Launch after ~30 conv/month. |
| 4 | **YouTube / Demand Gen** | Awareness + retargeting | Reuse the 10 video scripts from the Meta doc. Skippable in-stream + Demand Gen. |
| 5 | **Display retargeting** | Recover visitors | Site visitors / cart abandons → responsive banners. |

> Do NOT launch Performance Max **first**: with no conversion data, PMax burns budget. Start with Search Brand + Generic to feed the algorithm, then open PMax.

---

## 3. Account architecture

```
Xenotif® account
├─ C1 · Search — Brand (EN)
│   └─ AG: Brand exact / Brand + competitors
├─ C2 · Search — Coaching/App (EN)
│   ├─ AG: Online personal trainer
│   ├─ AG: Fitness/coaching app
│   └─ AG: AI coach / personalised plan
├─ C3 · Search — Strength/Goals (EN)
│   ├─ AG: Muscle building / bulking
│   ├─ AG: Cutting / weight loss
│   └─ AG: Home / beginner workout
├─ C4 · Search — Running (EN)
│   ├─ AG: 10K / half-marathon plan
│   └─ AG: Marathon plan beginner
├─ C5 · Search — Store guides (EN)
│   └─ AG: Workout/training plan PDF
├─ C6 · Performance Max — Subscription
├─ C7 · Performance Max — Store
└─ C8 · YouTube/Demand Gen + Display retargeting
```

Rule: **one theme = one ad group**, 1 tight keyword set + 1 dedicated RSA per AG (keyword → ad → landing-page consistency = better Quality Score = lower CPC).

---

## 4. Keyword strategy (the core)

### Match types — where to start
- **Phrase** `"…"` and **Exact** `[…]` at launch (control + clean data).
- **Broad** only **after** Smart Bidding is running (with audience signals), never cold.

### C1 — Brand
`[xenotif]` · `"xenotif app"` · `"xenotif review"` · `"xenotif subscription"` · `"xenotif coach"`

### C2 — Coaching / App
`"online personal trainer"` · `"online fitness coach"` · `[ai fitness coach]` · `"personal training app"` · `"ai workout app"` · `"personalised workout plan"` · `"online fitness coaching"` · `"best fitness app"` · `"workout plan app"`

### C3 — Strength / Goals
`"muscle building program"` · `[bulking program]` · `"cutting program"` · `"home workout program"` · `"beginner workout plan"` · `"weight loss workout plan"` · `"fat loss program"` · `"nutrition plan bodybuilding"` · `"macro calculator"`

### C4 — Running
`"10k training plan"` · `"half marathon training plan"` · `"marathon training plan beginner"` · `"couch to 5k plan"` · `"running training plan"`

### C5 — Store guides
`"workout guide pdf"` · `"training program pdf"` · `"bulking program pdf"` · `"training plan pdf"` · `"cutting plan pdf"`

### Competitors (separate Search campaign, separate budget)
`"Freeletics alternative"` · `"Nike Training Club alternative"` · `"Fitbod alternative"` · `"Centr alternative"`
> ⚠️ You may **bid** on competitor brands but **must NOT put their name in the ad copy** (Google trademark policy). Keep isolated: different CPC and CTR.

### 🚫 Negative keywords (CRITICAL — add on day 0)
Account-level shared list:
`free` (ambiguous — test) · `jobs` · `salary` · `become a personal trainer` · `certification` · `course` · `qualification` · `career` · `near me` (local in-person intent) · `pdf free download` · `torrent` · `crack` · `wikipedia` · `definition` · `meaning`
> Without this, your budget bleeds into "become a personal trainer" / "PT certification" searches that never convert. **Check the search-terms report 2×/week** the first fortnight and add negatives as you go.

---

## 5. RSA (Responsive Search Ads)

> Google format: **up to 15 headlines (≤ 30 characters)** + **4 descriptions (≤ 90 characters)**. Google tests the combinations. **Pin** 1-2 key headlines to position 1 (brand + promise) and leave the rest free. Final URL `https://xenotif.com/en/...`, display paths `/coaching` `/free-trial`.

### RSA — Subscription (C2/C3/C4)
**15 headlines**
1. AI coach for €9.99/month
2. Your coach in your pocket
3. 7-day free trial
4. 100% personalised plan
5. All your sports, one app
6. Home fitness coaching
7. No commitment, cancel any time
8. Forge your body
9. Strength, running, HIIT…
10. Results in 30 days
11. Cheaper than a gym
12. Try 7 days free
13. AI coaching + nutrition
14. Your tailor-made plan
15. Personal training, accessible

**4 descriptions**
1. AI personal coach: strength, running, HIIT, CrossFit. Try 7 days, no commitment.
2. Plans built for your level & goal. HD videos + performance tracking. From €9.99/mo.
3. Your gym at home. Guided 20–45 min sessions. First results in 30 days.
4. Premium coaching without the price. Cancel in 2 clicks. Start your free trial.

### RSA — Store guides (C5)
**Headlines (extract)**
1. Premium training guides
2. Muscle building plan PDF
3. Instant download
4. From €14.90 — direct access
5. 12-week bulking plan
6. Cutting & HIIT programs
7. Week-by-week running plan
8. Forge your body today

**Descriptions**
1. Premium strength, cutting, HIIT, running guides. High-quality PDF, instant download.
2. Pro programs from €14.90. Secure payment, lifetime access. Start today.

---

## 6. Extensions / Assets (fill these — instant CTR gain)

- **Sitelinks**: *Free 7-day trial* → `/en/auth/signup?plan=pro` · *Disciplines* → `/en/disciplines` · *Store* → `/en/boutique` · *Pricing* → `/en/abonnement`.
- **Callouts**: No commitment · 7-day trial · AI coaching · HD videos · Cancel in 2 clicks · 3,200+ athletes.
- **Structured snippets**: header *Types* → Strength, Running, HIIT, CrossFit, Swimming, Cycling.
- **Image asset**: premium visuals (reuse the Meta doc concepts).
- **Call / Promotion asset**: "7 days free".
- **Price asset**: Pro €9.99/mo · Guides from €14.90.

---

## 7. Performance Max — asset groups (after ~30 conv/month)

Per **asset group** (1 for subscription, 1 for store), provide:
- **Headlines** (≤ 30 char): pull from the RSA above.
- **Long headlines** (≤ 90 char): "Your personalised AI fitness coach — strength, running, HIIT. 7-day free trial."
- **Descriptions** (≤ 90 char): same as RSA.
- **Images**: 1200×628 (landscape), 1200×1200 (square), 1200×1500 (portrait) + logo.
- **Videos**: reuse the **10 scripts** from the Meta doc (9:16 + 16:9). If no video provided, Google auto-generates one (poor → supply a real one).
- **Audience signals**: existing customers (subscriber email list), site visitors, fitness/strength/running interests. → speeds up learning.

---

## 8. YouTube / Demand Gen

- **Videos**: V1 ("€200 vs €9.99"), V8 (UGC testimonial) and V9 ("20 minutes flat") from the Meta doc are best for YouTube.
- **Formats**: skippable in-stream (CPV) for awareness + **Demand Gen** (ex-Discovery) for conversion, fitness audiences + lookalikes of subscribers.
- **Hook < 5 s** mandatory (before the "Skip" button).

---

## 9. Bidding & budget

| Stage | Bid strategy | Budget/day | Note |
|---|---|---|---|
| Launch (W1-W2) | **Maximise conversions** (no tCPA) | €15-25 | Let Google learn, don't cap it. |
| Stabilisation | **tCPA** once ~30 conv | — | Set tCPA slightly above the observed CPA. |
| Store | **Maximise conv. value / tROAS** | included | When purchases carry a € value. |

Starting split: **Brand 15%** · **Generic subscription 55%** · **Store 20%** · **Competitors 10%**.
Rule: don't change bids during the learning phase (1-2 weeks). Scale budget **+20-30%** every 4-5 days on profitable campaigns.

---

## 10. ⚠️ Conversion tracking — CONFIGURE before launching

**Current state**: GA4 `G-3H3JTM404V` is in place (gtag.js + `select_item` / `affiliate_click` events). **There is NO Google Ads conversion yet** (no `AW-…` tag, no `send_to`).

**To do (recommended order)**:
1. **Link GA4 ↔ Google Ads** (GA4 Admin → Product links → Google Ads).
2. In GA4, mark as **key events**: `sign_up` (registration → `CompleteRegistration` proxy), `purchase` (guide purchase), and a subscription event (`subscribe`/`begin_checkout`).
   - ⚠️ Confirm GA4 **actually fires** these events: today the code only pushes `select_item`/`affiliate_click`. You'll need to add `sign_up` on registration and `purchase` after payment (confirmation page / Stripe webhook → gtag).
3. **Import** these key events as **conversions** in Google Ads.
4. Enable **Enhanced Conversions** — hashed email at conversion time → better attribution (the equivalent of Meta's CAPI).
5. Set the **primary** conversion = subscription (Subscribe); secondary = registration + guide purchase.

> Until §10 is done, Search campaigns can run on "clicks" but Smart Bidding (Max conv / tCPA / PMax) is **unusable**. This is prerequisite #1.

---

## 11. Step-by-step launch (first campaign)

1. **Google Ads** → New campaign → Objective **Sales** (or *Without a goal → Search* to keep control).
2. Type **Search**. Uncheck the Display Network (otherwise budget leaks to low-grade Display).
3. **Locations**: United Kingdom (then Ireland, US, Canada, Australia, New Zealand). **Language**: English. *Presence: people in your targeted locations* (not "interested in").
4. **Bidding**: Maximise conversions (or "Clicks" with a CPC cap if §10 isn't ready).
5. **Budget**: €15/day.
6. **Ad group**: 1 theme (e.g. *Online personal trainer*) + 8-12 keywords in **phrase/exact**.
7. **Negatives**: import the §4 list right away.
8. **RSA**: 15 headlines + 4 descriptions (§5), 1-2 pinned headlines.
9. **Extensions**: sitelinks + callouts + snippets + call (§6).
10. **Final URL**: `https://xenotif.com/en/auth/signup?plan=pro` (subscription) or `/en/boutique` (guides).
11. Publish → **let it run 1-2 weeks** untouched (learning phase).

> Start with **C1 Brand + C2 Generic subscription**. Add C5 Store, then PMax (C6/C7) once conversions come in.

---

## 12. Optimisation & compliance

- **Quality Score**: align keyword → RSA headline → landing page. High QS = lower CPC for the same position.
- **Search terms**: 2×/week early on → add negatives + harvest new winning keywords.
- **Don't micro-optimise** during learning (1-2 weeks). Judge after ≥ 30 conversions.
- Scaling: +20-30% budget every 4-5 d on the profitable; open PMax once data is stable.
- ⚠️ **Google policy**: no unrealistic health/weight-loss claims ("lose 10 kg in 1 week" = rejection), no misleading "before/after", no unproven superlatives ("world's #1"). Stay factual.
- **GDPR / Consent Mode**: no consent banner today (consistent with current GA4/Meta) — to decide if you want Consent Mode v2 for the EU/UK.

---

*Last updated: June 2026.*
