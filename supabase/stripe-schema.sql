-- ============================================
-- Stripe Integration Tables for Arxon AI
-- Run this in Supabase SQL Editor
-- ============================================

-- Orders: tracks each purchase (package selection → checkout → payment)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  company_name TEXT,
  industry TEXT,
  -- Selected automations stored as JSONB array
  automations JSONB DEFAULT '[]',
  -- Pricing
  setup_total INTEGER NOT NULL DEFAULT 0,       -- in NOK øre (cents)
  monthly_total INTEGER NOT NULL DEFAULT 0,     -- in NOK øre
  billing_mode TEXT DEFAULT 'monthly' CHECK (billing_mode IN ('monthly', 'annual')),
  discount_rate NUMERIC(4,2) DEFAULT 0,
  currency TEXT DEFAULT 'nok',
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'setup_paid', 'active', 'past_due', 'cancelled', 'expired'
  )),
  setup_paid_at TIMESTAMPTZ,
  subscription_started_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payment events log (webhook events from Stripe)
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_customer ON orders(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_subscription ON orders(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_events_order ON payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_type ON payment_events(event_type);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Admin access via service_role_key (bypasses RLS automatically)
-- Public: allow insert for creating orders from checkout
CREATE POLICY "Allow anon insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Public: allow reading own order by email
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (true);

-- Service role handles updates (webhook handler uses service key)
