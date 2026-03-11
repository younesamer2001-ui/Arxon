-- =============================================
-- Arxon Phase 1 Migration
-- Kunderegistrering → Kjøp → Automatiseringslevering
-- Kjør i Supabase SQL Editor
-- =============================================

-- 1. Utvid customers-tabellen med manglende felt
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS contact_person TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'pending'
    CHECK (onboarding_status IN ('pending', 'intake_sent', 'intake_completed', 'setup_in_progress', 'active', 'paused')),
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id);

CREATE INDEX IF NOT EXISTS idx_customers_stripe ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_onboarding ON customers(onboarding_status);

-- 2. customer_automations — kobler kunder til kjøpte automatiseringer
CREATE TABLE IF NOT EXISTS customer_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  automation_key TEXT NOT NULL,          -- f.eks. 'fakturering', 'booking', 'leadgenerering'
  automation_name TEXT NOT NULL,         -- f.eks. 'AI Fakturering', 'Smart Booking'
  status TEXT DEFAULT 'purchased'
    CHECK (status IN ('purchased', 'setup_pending', 'configuring', 'active', 'paused', 'error')),
  n8n_workflow_id TEXT,                  -- ID fra n8n etter deploy
  config JSONB DEFAULT '{}',            -- kundespesifikk konfigurasjon
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, automation_key)
);

CREATE INDEX IF NOT EXISTS idx_ca_customer ON customer_automations(customer_id);
CREATE INDEX IF NOT EXISTS idx_ca_status ON customer_automations(status);
CREATE INDEX IF NOT EXISTS idx_ca_order ON customer_automations(order_id);

-- 3. onboarding_tracking — sporer hvert steg i onboarding-prosessen
CREATE TABLE IF NOT EXISTS onboarding_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  step_key TEXT NOT NULL,                -- 'payment', 'intake_form', 'integration_setup', 'workflow_deploy', 'testing', 'go_live'
  step_name TEXT NOT NULL,               -- Norsk visningsnavn
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'error')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',           -- ekstra data per steg
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_customer ON onboarding_tracking(customer_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON onboarding_tracking(status);

-- 4. RLS for nye tabeller
ALTER TABLE customer_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tracking ENABLE ROW LEVEL SECURITY;

-- Kunder kan se sine egne automatiseringer
CREATE POLICY "Users can view own automations" ON customer_automations
  FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Kunder kan se sin egen onboarding-status
CREATE POLICY "Users can view own onboarding" ON onboarding_tracking
  FOR SELECT
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Service role (n8n / backend) bruker service_role_key som bypass RLS automatisk
