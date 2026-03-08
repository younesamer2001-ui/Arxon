import Stripe from 'stripe'

// Use lazy initialization so Next.js build doesn't fail when env vars aren't set
let _stripe: Stripe | undefined

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
      typescript: true,
    })
  }
  return _stripe
}
