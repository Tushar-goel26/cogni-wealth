-- Cogni Wealth: run once in Supabase SQL Editor (new project). Final scope.
create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  monthly_income numeric default 0,
  emergency_fund_saved numeric default 0,
  opening_cash numeric default 0,
  risk_score int,
  risk_label text check (risk_label in ('Conservative','Balanced','Aggressive')),
  use_demo_data boolean default true,
  created_at timestamptz default now()
);

create table payment_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,                   -- 'Google Pay','PhonePe','Paytm','Bank Statement','Cash', custom...
  kind text not null default 'upi',     -- 'upi' | 'bank' | 'cash' | 'card' | 'other'
  is_included boolean not null default true,
  is_detected boolean default false,    -- found by simulated phone scan
  is_custom boolean default false,      -- added manually by user
  is_simulated boolean not null default true,
  connected_at timestamptz default now(),
  unique (user_id, name)
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid references payment_sources on delete set null,
  ref_id text,
  txn_at timestamptz not null,
  amount numeric not null check (amount >= 0),
  direction text not null check (direction in ('debit','credit')),
  payment_mode text not null default 'upi' check (payment_mode in ('cash','upi','card','bank_transfer')),
  counterparty text,
  note text,
  category text default 'Uncategorised',
  category_source text default 'rule' check (category_source in ('rule','user')),
  status text default 'success' check (status in ('success','pending','failed')),
  is_transfer boolean default false,    -- e.g. ATM withdrawal bank->cash; excluded from income/expense
  transfer_kind text,                   -- 'atm_withdrawal' | 'own_account' | null
  is_one_time boolean default false,    -- excluded from twin baseline
  canonical_id uuid,
  dup_status text default 'unique' check (dup_status in ('unique','merged','needs_review')),
  is_simulated boolean default true,
  created_at timestamptz default now()
);
create index on transactions (user_id, txn_at desc);
create index on transactions (user_id, ref_id);

create table dup_candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  txn_a uuid not null references transactions on delete cascade,
  txn_b uuid not null references transactions on delete cascade,
  confidence text not null check (confidence in ('high','medium')),
  reason text,
  resolution text default 'pending' check (resolution in ('pending','merged','kept_separate'))
);

create table merchant_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  merchant_key text not null,
  category text not null,
  unique (user_id, merchant_key)
);

-- Financial twin (versioned, never overwritten)
create table twin_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  effective_from date not null default current_date,
  stats jsonb not null,                 -- per-category stats, income level, recurring, typical month-end balance
  reason text not null check (reason in ('initial','auto_refresh','user_confirmed_drift','life_event')),
  grace_until date,                     -- widened anomaly thresholds until this date
  is_active boolean default true,
  created_at timestamptz default now()
);

create table twin_proposals (          -- "Is this your new normal?"
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('category_drift','txn_size_drift','income_shift','life_event')),
  detail jsonb not null,                -- category, old vs new level, months observed, savings-rate impact
  status text default 'pending' check (status in ('pending','accepted','temporary','snoozed')),
  snooze_until date,
  created_at timestamptz default now()
);

create table life_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  event_type text not null check (event_type in ('promotion','raise','job_change','new_emi','moved','big_purchase','other')),
  note text,
  effective_date date not null default current_date
);

create table anomaly_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  txn_id uuid references transactions on delete cascade,
  twin_version_id uuid references twin_versions,
  severity text check (severity in ('low','medium','high')),
  reason text not null,
  user_response text default 'pending' check (user_response in ('pending','expected','not_expected'))
);

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  category text not null,
  monthly_limit numeric not null,
  alert_at_pct int default 80,
  unique (user_id, category)
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  kind text not null,                   -- 'budget','forecast','twin','investment','leak'
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  target_amount numeric not null,
  saved_amount numeric default 0,
  monthly_contribution numeric default 0,
  target_date date
);

create table obligations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  amount numeric not null,
  due_date date not null,
  kind text default 'bill' check (kind in ('bill','emi','other'))
);

-- Investments (PAPER portfolio only)
create table investment_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  goal_name text not null,
  goal_date date,
  horizon_months int not null,
  risk_label text not null check (risk_label in ('Conservative','Balanced','Aggressive')),
  monthly_amount numeric not null,
  constraints jsonb default '{}'::jsonb,           -- e.g. {"no_equity":true,"easy_withdrawal":true}
  mode text not null default 'self' check (mode in ('self','auto')),
  approval_mode text not null default 'ask_every_time' check (approval_mode in ('ask_every_time','auto_within_limits')),
  max_monthly numeric,
  min_cash_reserve numeric not null default 0,
  status text default 'active' check (status in ('active','paused','revoked')),
  created_at timestamptz default now()
);

create table holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_id uuid not null references investment_plans on delete cascade,
  option_key text not null,             -- 'liquid','fd','debt','gold','hybrid','index'
  invested_amount numeric not null default 0,
  current_value numeric not null default 0,
  target_weight numeric not null default 0,
  unique (plan_id, option_key)
);

create table investment_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_id uuid not null references investment_plans on delete cascade,
  scheduled_for date not null,
  amount numeric not null,
  allocation jsonb,
  status text default 'awaiting_approval'
    check (status in ('awaiting_approval','approved','executed_simulated','skipped','cancelled','failed'))
);

create table decision_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan_id uuid references investment_plans on delete cascade,
  cycle_date date not null,
  outcome text not null check (outcome in ('invested_simulated','skipped','needs_approval','rebalanced','paused')),
  checks jsonb not null,                -- [{name, passed, values}]
  explanation text not null,
  created_at timestamptz default now()
);

-- Stretch
create table user_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plain_text text not null,
  rule_json jsonb not null,
  is_active boolean default true
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  action text not null,
  detail jsonb,
  created_at timestamptz default now()
);

-- Row Level Security
do $$
declare t text;
begin
  foreach t in array array['payment_sources','transactions','dup_candidates','merchant_rules','twin_versions',
    'twin_proposals','life_events','anomaly_flags','budgets','alerts','goals','obligations',
    'investment_plans','holdings','investment_actions','decision_log','user_rules','audit_log']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "own rows" on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

alter table profiles enable row level security;
create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
