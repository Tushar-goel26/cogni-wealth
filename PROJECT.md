# Cogni Wealth: PROJECT.md (final scope)

> Every Antigravity prompt starts with: "Read PROJECT.md first and follow it. Do only what this prompt asks."

## 1. Product in one line
Tracks all money (UPI, card, bank, cash), cleans it, learns the user's normal behaviour (the **financial twin**), explains what is happening, plans savings, and guides investing with a **Self-Invest** or **Auto-Invest** mode that always explains its decisions.

Pipeline: **Data -> Transaction Intelligence -> Financial Twin -> Insights & Forecast -> Savings Plan -> Investment Guidance -> User-Controlled Action**

## 2. Hackathon rules (non-negotiable)
- All data is **demo data / simulated connections / paper portfolio**. Show a persistent "Demo data" banner and "Simulated" labels.
- **No real money movement.** Never ask for UPI PIN, passwords or OTP.
- Projections are **estimates, not guaranteed returns**. Investment output is **educational, not personalised advice**.
- Unusual spend is **"worth reviewing"**, never "fraud".
- **All numbers come from deterministic code.** The LLM only explains numbers it is given.
- Every insight, alert and investment decision has a **"Why?"** explanation showing inputs and rules used.
- The app **never changes its own baseline or moves money silently**: user confirms.

## 3. Stack
| Layer | Choice |
|---|---|
| App | Next.js (App Router) + TypeScript + Tailwind CSS |
| Charts / icons | Recharts, lucide-react |
| DB / Auth | Supabase (Postgres, Auth, Row Level Security) |
| Logic | Pure TypeScript modules in `lib/` with vitest tests |
| AI | Gemini API via `app/api/chat/route.ts` (key in env). **Fallback:** template answers filled with computed numbers if the call fails or quota ends |
| Hosting | Vercel + GitHub |

Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY` (server only).

## 4. Design rules
- Dark default + light mode. Inter font. Rounded-2xl cards, soft shadows, 8px grid.
- Layout: collapsible left sidebar, compact top bar (search, range switch, theme, profile).
- Colors: emerald = positive/savings, amber = review, rose = over/anomaly, indigo = primary.
- Every page has loading skeleton, empty state, error state. Works at 375px.
- INR format: `Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0})`.

## 5. Pages (8)
1. **Overview**  2. **Transactions & Payment Apps**  3. **Insights** (anomalies, leaks, twin)  4. **Coach** (AI chat)  5. **Budgets & Goals**  6. **Forecast & Simulator**  7. **Invest**  8. **Security & Audit**

## 6. Folder structure
```
app/            (routes per page, api/chat/route.ts)
components/     ui/, charts/, layout/
lib/            supabase.ts format.ts categorise.ts dedupe.ts twin.ts anomaly.ts
                surplus.ts leaks.ts forecast.ts simulate.ts invest.ts decision.ts coachFallback.ts
data/           sampleTransactions.ts merchants.ts options.ts
supabase/       schema.sql
```

## 7. Features

### Tier 1 (build first)
1. Auth, onboarding (name, income, emergency fund, opening cash), private data per user.
2. **Payment Apps:** "Scan my phone" (SIMULATED detection) lists apps found on the phone; user toggles include/exclude and can add any other app manually. Dashboard respects toggles. Per-app spending split.
3. Data in: demo data loader, CSV import with preview, **manual add with payment mode: Cash / UPI / Card / Bank transfer**.
4. **Cash wallet:** balance from opening cash + cash credits - cash spends. **ATM withdrawal = transfer (bank -> cash), not an expense.** Transfers are excluded from income/expense totals.
5. Transactions page: search, filters (category, source, mode, date), history + audit log tab.
6. Auto-categorisation (10 categories) with remembered manual corrections.
7. Duplicate detection (auto-merge on same ref id, review screen, genuine repeats stay separate).
8. **Overview:** income, expenses, surplus, category donut, trend with range switch **Day / Week / Month / Quarter / Year**. Day view: daily spend bars for the month + cumulative-spend vs budget-pace line, tap a day to list its transactions.
9. **Financial twin** (section 8) and **anomaly detection** using it.

### Tier 2 (what wins)
10. AI Coach chat with "Based on" figures and the template fallback.
11. **Safe-to-invest** waterfall (section 9.1).
12. **Money leak detector** (section 9.2).
13. Budgets with alerts (notification when spend hits chosen % of limit), goals with ETA, upcoming bills/EMIs.
14. **Month-end forecast** with shortfall warning (section 9.3).
15. **Simulator** (current plan vs hypothetical).
16. **Invest:** profile, risk questionnaire, recommendations with "why this fits you", Self-Invest / Auto-Invest (section 10).
17. **Auto-Invest engine** (paper portfolio): monthly cycle, checks, decision log, approvals, pause/revoke.

### Tier 3 (stretch)
18. Rule Builder (plain English -> structured rule -> code evaluates; AI only parses).
19. Health score (0-100). 20. Weekly action plan. 21. Time Machine ("what if I had saved/invested X since N months ago"). 22. Printable monthly report.

### Cut on purpose (put in PPT as future scope)
Real UPI/bank connections, real trade execution, Android companion app for true installed-app detection, split expenses, language toggle, voice input.

## 8. Financial twin (the model of "normal for this user")

### 8.1 What it stores (`twin_versions.stats`)
- Per category: weighted mean and std of transaction amount, typical monthly total, typical weekly total, transaction frequency.
- Income level: median of last 3 monthly income totals; salary day.
- Recurring payments (same merchant + similar amount monthly).
- Typical month-end balance.

### 8.2 How it is built (`lib/twin.ts`)
- Use last 180 days of canonical, non-transfer transactions.
- **Recency weighting:** exponential decay, half-life 60 days, so recent behaviour counts more.
- Exclude transactions marked `is_one_time` and anomalies the user marked "expected one-off".
- Winsorise amounts at the 95th percentile so one outlier does not distort the baseline.
- Need >= 5 data points per category, otherwise use the overall median and mark "low confidence".

### 8.3 How it adapts (the promotion / lifestyle-change problem)
The twin is **versioned** (`twin_versions`, never overwritten). Run drift checks after every import and monthly:

| Signal | Rule | Result |
|---|---|---|
| Category drift | Monthly category total > 1.25x twin expectation for 2 consecutive months (or 3 consecutive weeks) | Proposal: "Is this your new normal?" |
| Transaction-size drift | Median txn size in a category up > 25% over 6 weeks | Proposal |
| Income shift | Monthly income differs > 10% from twin income for 2 consecutive months | Proposal + suggest scaling budgets/goals |
| Life event logged | User logs Promotion / Raise / Job change / New EMI / Moved / Big purchase | Immediate proposal |

Proposal card buttons: **[Yes, update my baseline] [No, it's temporary] [Remind me in 30 days]**.
- Yes -> create a new `twin_versions` row (`reason='user_confirmed_drift'` or `'life_event'`), effective today; old version kept for history.
- No -> baseline unchanged; those months tagged temporary; alerts continue.
- **Grace period:** after a confirmed income shift or life event, widen anomaly thresholds (2.5 sigma -> 3.5 sigma) for 60 days so the user is not spammed while spending settles.
- **Lifestyle-creep guard:** if the proposed new baseline drops the savings rate below 10%, show: "Your new normal leaves less to save. Want to adjust your budget or goal?" This stops a bad habit being silently accepted as normal.
- Anomalies are always judged against the twin version active on the transaction date.

## 9. Intelligence specs (pure functions + tests)

### 9.1 Safe-to-invest (`surplus.ts`)
```
recordedSurplus = income - expenses                     (canonical, non-transfer, this month)
reserved        = obligations due in next 30 days + pending transactions
emergencyTopUp  = max(0, (3 * twinMonthlyExpenses - emergencyFundSaved) / 12)
safeToInvest    = max(0, recordedSurplus - reserved - emergencyTopUp)
```
Show all four numbers as a waterfall. Example: income 40,000, expenses 27,000 -> surplus 13,000 but safe amount is lower after bills and emergency top-up.

### 9.2 Leak detector (`leaks.ts`)
- Recurring: same merchant, similar amount, 3+ months -> "subscription"; flag ones not used/changed (price increase) as review candidates.
- Small frequent spends: category with > 12 transactions/month under Rs 200 and monthly total above Rs 1,000.
- Category creep: category total rising 3 months in a row.
- Show estimated yearly cost of each leak.

### 9.3 Forecast (`forecast.ts`)
`projectedMonthEnd = balanceNow + remainingExpectedIncome - (spentToDate/dayOfMonth * daysInMonth - spentToDate) - upcomingObligations`, using twin weekly pattern for weekday weighting. If projected < 0 or below the minimum reserve, show a shortfall warning with the date it is expected to cross.

### 9.4 Simulator (`simulate.ts`)
`FV = P * (((1+r)^n - 1) / r)` with `r = annualReturn/12`; if `r = 0`, `FV = P * n`. Compare plan A vs plan B, show contributions vs growth, print assumptions.

### 9.5 Anomaly (`anomaly.ts`)
Per category against the active twin: flag `amount > mean + 2.5*std` (3.5 in grace period) or `> 3 * median`; also category month-to-date > 1.5x typical, new category, daily txn count > 3x usual. Return `{txnId, severity, reason}` in plain English. User responds Expected / Not expected.

## 10. Investment design

### 10.1 Flow
Profile (goal, horizon, risk comfort, monthly amount, constraints) -> Recommendations ("why this fits you", risk, liquidity, fees) -> Mode choice -> Portfolio view -> "What changed and why".

### 10.2 Options catalogue (`data/options.ts`, illustrative, editable assumptions)
Liquid fund (risk 1, ~6%), FD/RD (1, ~6.5%), Short-term debt fund (2, ~7%), Gold (3, ~8%), Hybrid fund (3, ~10%), Index fund (4, ~12%). Each has: risk 1-5, liquidity (days to withdraw), minimum sensible horizon, fee note. Label all returns "assumption for illustration only".

### 10.3 Allocation (`invest.ts`)
| Horizon | Conservative | Balanced | Aggressive |
|---|---|---|---|
| < 12 months | 100% liquid/FD | 100% liquid/FD | 100% liquid/FD |
| 1-3 years | 70% debt/FD, 30% liquid | 50% debt, 30% hybrid, 20% liquid | 40% debt, 40% hybrid, 20% liquid |
| 3-7 years | 50% debt, 30% hybrid, 20% gold | 20% debt, 40% hybrid, 30% index, 10% gold | 10% debt, 30% hybrid, 50% index, 10% gold |
| 7+ years | 40% debt, 30% hybrid, 20% index, 10% gold | 20% debt, 20% hybrid, 50% index, 10% gold | 10% hybrid, 80% index, 10% gold |

User constraints (e.g. "no equity", "keep easy to withdraw") filter the options and re-normalise weights. **Glide path:** within 24 months of the goal date, move equity weight towards safer options a little each month, reaching ~0 equity 6 months before the goal.

### 10.4 Self-Invest vs Auto-Invest
- **Self-Invest:** app recommends, user decides and records their own (paper) investments.
- **Auto-Invest:** user sets monthly amount, minimum cash reserve, max per month, approval mode (**ask every time** or **auto-approve within limits**), constraints. App runs a **monthly cycle**.

### 10.5 Monthly decision cycle (`decision.ts`, deterministic, no AI)
Checks, in order:
1. Plan active and not paused? 2. `safeToInvest > 0`? 3. Cash reserve stays >= minimum after investing? 4. Large bill due within 7 days (skip or reduce)? 5. Amount = min(monthly amount, safeToInvest, max per month). 6. Portfolio drift > 5 percentage points from target -> rebalance with the new money first. 7. Goal within 24 months -> apply glide path. 8. Surplus grew > 15% for 2 months -> **suggest** raising the amount (needs approval).
Outcome: `invested_simulated | skipped | needs_approval | rebalanced | paused`.
Every cycle writes a `decision_log` row with `checks` (each: name, passed, values) and `explanation`. The AI may rephrase the explanation but cannot change the outcome.

### 10.6 Trust features
Pause/revoke always works. Max-per-month and reserve are hard limits. Every action shows inputs, checks and result. Audit log entry for each change. Paper portfolio values move with a **seeded** monthly return (assumption/12 + small noise) so the demo is repeatable.

## 11. AI Coach contract (`app/api/chat/route.ts`)
1. Client builds a compact JSON summary (totals, category changes, anomalies, budgets, forecast, twin, safe-to-invest) from canonical data.
2. POST `{question, summary}`.
3. Route calls Gemini with: "Answer only from this JSON. Do not compute new numbers. Say when data is missing. Not financial advice."
4. On error or quota: `coachFallback.ts` answers common questions from templates filled with real numbers.
5. Response includes `basedOn` (list of figures used). Rate limit 20 requests per session.

## 12. Security checklist
RLS on every table (`user_id = auth.uid()`). Secrets only in Vercel env vars. `is_simulated` flags. Audit log on merges, twin updates, rule/plan changes, approvals, pause/revoke. Consent text and disconnect/delete controls on Security page.

## 13. Demo script (3 minutes)
1. Problem (20s). 2. Scan phone + toggle apps, load data (30s). 3. Rahul Rs 500 counted once; cash wallet + ATM transfer (30s). 4. Overview Day view; anomaly flagged with reason (30s). 5. Twin: "your income rose 20%, update baseline?" (20s). 6. Coach question (20s). 7. Safe-to-invest waterfall + forecast warning (20s). 8. Invest: profile -> recommendation -> Auto-Invest cycle with decision log; pause (30s). 9. Close with pipeline line (10s).
