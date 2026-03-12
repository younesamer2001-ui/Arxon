# Playbook: New Customer Onboarding

**Trigger**: Customer completes Stripe payment
**Duration**: ~24 hours from payment to live assistant
**Agents involved**: Dev → Voice → Ops → Content

## Steps

### Step 1: Account Setup (Dev)
1. Verify Stripe webhook received and payment confirmed
2. Create customer record in Supabase `customers` table
3. Provision Supabase auth account
4. Set up customer dashboard access
5. **Handoff to Voice**: Customer name, industry, phone, package tier

### Step 2: Voice Assistant Setup (Voice)
1. Gather business info (from kartlegging form data in Supabase)
2. Create Vapi assistant with industry-appropriate system prompt
3. Provision Twilio phone number
4. Connect webhooks to Arxon backend
5. Run 3 test calls
6. **Handoff to Ops**: Assistant ID, phone number, webhook URLs

### Step 3: Infrastructure Verification (Ops)
1. Verify webhooks are receiving data
2. Confirm call logs flowing to Supabase
3. Check Stripe subscription is active and billing correctly
4. Add customer to monitoring (Sentry context)
5. **Handoff to Content**: Customer name, industry (for welcome email)

### Step 4: Welcome Communication (Content)
1. Send welcome email with:
   - Their new phone number
   - How to forward calls
   - Quick setup guide
   - Support contact info
2. Schedule Day 3 check-in email
3. Schedule Day 7 "how's it going?" email

## Success Criteria
- [ ] Customer can make a test call to their new number
- [ ] Calls are logged in their dashboard
- [ ] Welcome email sent within 1 hour of setup
- [ ] No errors in Sentry for the new customer's calls

## Escalation
If any step fails or takes >4 hours: notify Younes via Slack.
