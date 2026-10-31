# Cogni Wealth: Antigravity step-by-step

# PART A: One-time setup (about 30-45 minutes)

Menu names in tools change over time, so follow the idea if a label differs slightly.

1. **GitHub:** create a free account and a new **public** repo named `cogni-wealth` (tick "Add README"). Clone it to your laptop, or create a local folder and `git init` it.
2. **Put the 3 files in the repo root:** `PROJECT.md`, `schema.sql`, `PROMPTS.md`. Commit and push.
3. **Supabase:** create a free account -> New project (choose a region near India, save the database password). Open **SQL Editor**, paste all of `schema.sql`, click Run. Then open **Project Settings -> API** and copy the **Project URL** and **anon public key**.
4. **Supabase auth setting:** Authentication -> Providers -> Email. For the hackathon, turn **off** "Confirm email" so sign-up works instantly in the demo.
5. **Gemini key:** create a free API key in Google AI Studio. Keep it private.
6. **Vercel:** create a free account and sign in with GitHub. Do not deploy yet.
7. **Antigravity:** install it, sign in with your Google account, and **open your repo folder as the workspace**.
8. **Check tools:** Node.js (LTS) and Git installed (`node -v`, `git -v`).
9. **Local secrets:** you will create `.env.local` in P0 and paste the three keys. Never commit this file.

# PART B: How to work (this protects your free quota)

- Paste **one prompt at a time**, in order. After each one: run `npm run dev`, click through the feature, fix problems, then `git add -A && git commit -m "P#"` and `git push`.
- **Models:** use a Thinking model (Sonnet/Opus) for prompts marked **[HEAVY]** and a Flash/fast model for **[LIGHT]**. If you hit a limit, switch model and say: "Continue from where the previous model stopped. Check `git status` and `git diff` first."
- If something breaks, paste the **exact error + file name**. Avoid "it's not working".
- Never ask for "everything". If a prompt produces too much, ask the model to finish only the unfinished part.
- Keep a deployed version alive from P0b onward so you always have a link.
- Ask the agent to **run the vitest tests** it writes. Logic bugs cost far more quota later.

---

# PART C: Prompts

## P0 [LIGHT] Scaffold
```
Read PROJECT.md first and follow it. Do only what this prompt asks.
Create a Next.js (App Router) + TypeScript + Tailwind project in this folder (do not create a nested folder). Install recharts, lucide-react, @supabase/supabase-js, vitest. Create the folder structure from PROJECT.md section 6 with empty placeholder files. Create the 8 route pages from section 5 with a simple heading each. Create .env.local.example listing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GEMINI_API_KEY and add .env.local to .gitignore. Ensure `npm run dev` and `npm run build` pass.
The folder name may contain capital letters or underscores, so set the package name in package.json to "cogni-wealth" and do not derive it from the folder name. The folder already has README.md, PROJECT.md, schema.sql and PROMPTS.md: keep them. If the scaffold tool refuses to run in a non-empty folder, scaffold in a temporary folder and move the generated files into this one.
```
Then create `.env.local` yourself from the example and paste your keys.

## P0b [LIGHT] First deploy
Push to GitHub, then in Vercel: **Add New -> Project -> import the repo -> add the 3 env vars -> Deploy.** From now on every `git push` redeploys automatically.

## P1 [HEAVY] Auth and onboarding
```
Read PROJECT.md. The database from schema.sql already exists in Supabase. Implement Supabase email/password sign-up, login, logout and route protection. After first login show a 3-step onboarding (name; monthly income; emergency fund saved and opening cash) saved to the profiles table. Create lib/supabase.ts. Friendly error messages. No other features.
```

## P2 [LIGHT] Design system and layout
```
Read PROJECT.md section 4. Build the app shell: collapsible left sidebar with the 8 pages and icons, compact top bar (search box, theme toggle, profile menu, alerts bell placeholder). Dark default with light mode toggle, Inter font. Create reusable components in components/ui: Card, StatCard (label, value, delta), Button, Badge, Modal, Skeleton, EmptyState, ProgressBar, Toggle, Tabs. Add lib/format.ts with an INR formatter and a persistent "Demo data / Simulated" banner component. Must work at 375px width.
```

## P3 [LIGHT] Payment Apps with simulated phone scan
```
Read PROJECT.md section 7 item 2. On the Transactions & Payment Apps page add a "Payment Apps" tab: a "Scan my phone" button that shows a loading animation and then lists detected apps (simulate: Google Pay, PhonePe, one bank app; label clearly "Simulated detection"). Each app has an include/exclude toggle saved to payment_sources. Add "Add another app" for manual custom apps, and always include a "Cash" source. Show a small per-app spending split card (placeholder values until transactions exist). All reads of transactions elsewhere must respect the include toggles.
```

## P4 [HEAVY] Data in: demo data, CSV, manual add with cash
```
Read PROJECT.md sections 7 (items 3-4) and 9. Build:
1. data/sampleTransactions.ts generating ~200 realistic Indian transactions over the last 5 months across Google Pay, PhonePe, bank and Cash: salary Rs 40,000 monthly; rent; groceries; food orders (Rs 300-700 typical); travel; bills; subscriptions (Netflix, Spotify, gym); small daily chai/snack spends; shopping; SIP. Include these planted cases: (a) a Rs 500 payment to Rahul in BOTH PhonePe and the bank statement with the same ref_id; (b) a similar pair with different ref_ids; (c) two genuine separate Rs 500 payments to Rahul on different days; (d) one Rs 4,500 food order outlier this month; (e) an ATM withdrawal of Rs 3,000 (bank debit + cash credit, is_transfer true, transfer_kind atm_withdrawal) followed by several cash spends; (f) in the LAST 2 MONTHS only, income rises to Rs 48,000 and food spend rises about 35% (to test twin drift later).
2. "Load demo data" button inserting them for the current user (is_simulated true), and "Reset demo data".
3. CSV import (date, description, amount, type) with column mapping and a preview.
4. "Add transaction" modal with payment mode: Cash / UPI / Card / Bank transfer, amount, direction, counterparty, category, date, note, and an "ATM withdrawal (move bank to cash)" option that creates the paired transfer.
5. A Cash wallet card: opening cash + cash credits - cash debits.
Transfers must be excluded from income and expense totals everywhere.
```

## P5 [HEAVY] Categorisation
```
Read PROJECT.md section 7 item 6. Implement lib/categorise.ts as pure functions with data/merchants.ts and vitest tests covering at least 12 merchants (swiggy, zomato, bigbasket, blinkit, uber, irctc, netflix, airtel, apollo, amazon, salary, sip). Categories: Food & Groceries, Shopping, Travel, Education, Entertainment, Bills & Utilities, Healthcare, Income, Transfers, Investments. Apply on import. Add an inline category dropdown on transactions; when changed, save to merchant_rules and apply to the same merchant from then on.
```

## P6 [HEAVY] Duplicate detection
```
Read PROJECT.md section 7 item 7 and the earlier rules: same ref_id across different sources -> auto-merge; same amount + direction + similar counterparty (similarity >= 0.8) + within 24h + different source and no shared ref_id -> needs_review; same source or different ref_ids or gap > 24h -> keep separate. Implement lib/dedupe.ts with vitest tests for the planted cases (a), (b), (c). Run after imports, write dup_candidates and transactions.dup_status/canonical_id. Build a Review Duplicates screen (side-by-side, Merge / Keep separate) that writes to audit_log. All totals use canonical transactions only.
```

## P7 [LIGHT] Transactions page
```
Build the Transactions tab: table with search, filters (category, source, payment mode, date range), sort, pagination, a badge for duplicates/transfers, and an "Audit log" tab listing audit_log rows with time and action. Skeleton, empty and error states.
```

## P8 [HEAVY] Overview dashboard
```
Read PROJECT.md section 7 item 8. Build the Overview: StatCards for income, expenses, recorded surplus, cash wallet (with change vs previous period); category donut; a range switch Day / Week / Month / Quarter / Year. Day view: daily spend bars for the selected month, plus a line of cumulative spend vs budget pace, and clicking a day opens that day's transactions. Week/Month/Quarter/Year show income vs expense bars and a savings-rate line. Per-app split card. Use only canonical, included-source, non-transfer transactions. Write the aggregation helpers as pure functions in lib/ with a few vitest tests.
```

## P9 [HEAVY] Financial twin (with adaptation)
```
Read PROJECT.md section 8 fully. Implement lib/twin.ts as pure functions with vitest tests: (1) buildTwin(transactions): 180-day window, recency weighting with 60-day half-life, exclude is_one_time, winsorise at 95th percentile, per-category stats, income level, recurring payments, low-confidence marking; (2) detectDrift(twin, recentTransactions): category drift (>1.25x for 2 months), txn-size drift (>25% over 6 weeks), income shift (>10% for 2 months); (3) savings-rate guard (<10% shows the creep warning). Save versions to twin_versions (never overwrite; keep old versions). On the Insights page show the twin summary card ("what's normal for you") and a "New normal?" proposal card with buttons [Yes, update my baseline] [No, it's temporary] [Remind me in 30 days] wired to twin_proposals and twin_versions, with a 60-day grace_until on accepted income/life-event changes. Add a "Life event" button (promotion, raise, job change, new EMI, moved, big purchase) that creates a proposal. Every accept/decline writes to audit_log. The planted demo data (income and food rise in the last 2 months) must trigger both an income_shift and a category_drift proposal.
```

## P10 [HEAVY] Anomaly detection
```
Read PROJECT.md section 9.5. Implement lib/anomaly.ts using the ACTIVE twin version at each transaction date and the grace-period threshold. Vitest tests: the Rs 4,500 food order is flagged; normal Rs 300-700 orders are not; thresholds widen inside a grace period. Show flags on Insights with severity, plain-English reason, "Why am I seeing this?" detail, and Expected / Not expected buttons (anomaly_flags). Use "worth reviewing", never "fraud". Add an anomaly badge on Overview.
```

## P11 [LIGHT] Budgets, alerts, goals, bills
```
Read PROJECT.md section 7 item 13. Build Budgets & Goals: per-category monthly limits with progress bars (amber at the alert %, rose over 100%), an alerts table row and bell dropdown when a budget hits its alert %, goals with target/saved/monthly contribution/estimated completion date, and an Upcoming bills & EMIs list (obligations). When a twin proposal is accepted, suggest scaling budgets proportionally (do not apply automatically).
```

## P12 [HEAVY] Safe-to-invest and leak detector
```
Read PROJECT.md sections 9.1 and 9.2. Implement lib/surplus.ts and lib/leaks.ts with vitest tests (income 40,000, expenses 27,000 -> surplus 13,000 but safe-to-invest must be lower after obligations and emergency top-up). Show a waterfall chart: surplus -> reserved -> emergency top-up -> safe-to-invest, with a one-line explanation. Show a Money Leaks card on Insights listing subscriptions, small frequent spends and creeping categories with the estimated yearly cost of each.
```

## P13 [HEAVY] Forecast and simulator
```
Read PROJECT.md sections 9.3 and 9.4. Implement lib/forecast.ts and lib/simulate.ts with vitest tests. On Forecast & Simulator: (a) month-end forecast chart with a shortfall warning and expected date ("At this pace you'll be Rs X short by the 28th"); (b) simulator with sliders (monthly savings, monthly investment, annual return, duration, monthly expense reduction) comparing current vs hypothetical plan, contributions vs growth, and the assumptions printed under the chart.
```

## P14 [HEAVY] AI Coach with fallback
```
Read PROJECT.md section 11. Create app/api/chat/route.ts calling the Gemini API with process.env.GEMINI_API_KEY and the system prompt from the spec. The client builds a compact JSON summary (totals, category changes, anomalies, budgets, forecast, twin, safe-to-invest) from canonical data and sends {question, summary}. Build lib/coachFallback.ts that answers common questions from templates filled with real computed numbers when the API errors or quota ends (the UI should not reveal a failure, only a small "offline mode" tag). Build the Coach page: chat with suggested questions ("Where did most of my money go?", "Why are my expenses higher than last month?", "How much can I safely invest?"), and a "Based on" list under each answer. Limit 20 requests per session.
```

## P15 [HEAVY] Investment planning
```
Read PROJECT.md sections 10.1-10.3. Implement data/options.ts and lib/invest.ts with vitest tests (a 6-month goal must give 100% liquid/FD regardless of risk; constraints like no_equity filter options and re-normalise; glide path reduces equity within 24 months of goal date). Build the Invest page: (1) profile form (goal name, goal date, horizon, monthly amount, constraints), (2) 5-question risk questionnaire saved to profiles, (3) recommendation cards with risk, liquidity, fees, a "why this fits you" sentence and an illustrative projection labelled "assumption for illustration only", (4) a safe-to-invest banner showing the maximum sensible monthly amount, (5) a mode choice: Self-Invest or Auto-Invest. Add the disclaimer: educational, not personalised investment advice.
```

## P16 [HEAVY] Auto-Invest engine, portfolio, decision log
```
Read PROJECT.md sections 10.4-10.6. Implement lib/decision.ts as pure functions with vitest tests for each of the 8 checks (skip when safeToInvest is 0; reduce when a large bill is due within 7 days; never breach min cash reserve; rebalance when drift > 5 points; glide path; suggest increase when surplus grew > 15% for 2 months). Build: Auto-Invest settings (monthly amount, min reserve, max per month, approval mode, constraints), a "Run this month's cycle" button that creates investment_actions and a decision_log entry with every check's inputs and pass/fail plus a plain-language explanation, an approval inbox (Approve / Skip) for ask_every_time mode, simulated execution updating holdings with a seeded monthly return (assumption/12 plus small seeded noise), a portfolio view (invested, current value, gain/loss, allocation vs target, goal progress), a "What changed and why" card, and Pause / Resume / Revoke buttons that always work. Show a visible "Simulation: no real money moves" banner. The AI may rephrase explanations but must not decide outcomes.
```

## P17 [LIGHT] Security and Audit page
```
Build the Security & Audit page: plain-language data/consent explanation (what is collected, why, no PINs/passwords/OTPs ever), disconnect a payment source, "Delete my demo data", "Reset demo", and the full audit log with filters.
```

## P18 [HEAVY] Stretch (do these as separate prompts, only if time remains)
```
(a) Health score 0-100 on Overview from savings rate, budget adherence, emergency fund coverage and anomaly count, with a breakdown. 
(b) Rule Builder: user types a rule in plain English (e.g. "alert me if food spending crosses 5000"); the AI parses it into a strict JSON rule schema stored in user_rules; code (not the AI) evaluates rules and creates alerts. Reject anything not matching the schema. 
(c) Weekly action plan card on Coach using computed insights. 
(d) Time Machine: "what if I had saved/invested X since N months ago" using real historical months and the simulator maths. 
(e) Printable monthly report page.
```

## P19 [LIGHT] Polish
```
Review every page for: 375px responsiveness, loading/empty/error states, consistent spacing, keyboard focus, contrast in dark and light themes, INR formatting, no console errors. Make sure the Demo data and Simulation banners show where needed. Do not add features.
```

## P20 [LIGHT] README and final deploy
```
Write README.md with: problem, solution, features, architecture and pipeline, tech stack, setup steps with env var names, how the financial twin adapts, how Auto-Invest decisions work, security and limitations (simulated data and paper portfolio, real-money path needs regulated partners), and screenshot placeholders. Confirm `npm run build` and `npm test` pass and no secrets are committed.
```

---

# PART D: Before you submit
- [ ] Live Vercel link works in incognito and on a phone with a **brand-new account** (sign up -> onboarding -> load demo data)
- [ ] Demo story works end to end: duplicate merged, cash + ATM transfer, anomaly flagged, "new normal?" card appears, forecast warning, safe-to-invest waterfall, Auto-Invest cycle with decision log
- [ ] Turn the Gemini key off once and confirm the Coach still answers (fallback)
- [ ] GitHub repo public, README done, no keys in the repo
- [ ] Demo video recorded with OBS (about 3 minutes, script in PROJECT.md section 13) and uploaded with a link that opens without login
- [ ] Give your teammate: team name, project name, repo link, prototype link, video link
