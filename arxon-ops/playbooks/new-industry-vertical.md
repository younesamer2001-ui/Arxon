# Playbook: Launch New Industry Vertical

**Trigger**: Younes decides to target a new industry (e.g., "Let's go after rørleggere")
**Duration**: ~1 week
**Agents involved**: Research → Voice → Content → Outreach → Growth

## Steps

### Step 1: Market Research (Research) — Day 1–2
1. Size the market: how many businesses in Norway in this industry?
2. Identify pain points specific to this industry
3. Analyze competitors targeting this vertical
4. Find 3–5 example businesses to study (call their phone, check website)
5. **Output**: `outputs/research/vertical-[INDUSTRY]-analysis.md`
6. **Handoff to Voice + Content**: Industry insights, vocabulary, common scenarios

### Step 2: Voice Scripts (Voice) — Day 2–3
1. Create industry-specific greeting, FAQ, booking flow
2. Build scenario list: what do callers typically ask?
3. Write system prompt tailored to industry vocabulary
4. Test with 5 sample calls
5. **Output**: `outputs/content/voice-script-[INDUSTRY].md`

### Step 3: Website Content (Content) — Day 2–4
1. Write industry landing page (e.g., `/tannlege`, `/rorlegger`)
2. Create 2 blog posts targeting industry keywords
3. Write industry-specific email templates for outreach
4. Prepare 1 case study template (to be filled after first customer)
5. **Handoff to Dev**: Landing page content for implementation
6. **Handoff to Growth**: New pages for SEO tracking

### Step 4: Lead Generation (Outreach) — Day 3–5
1. Research and score 30–50 leads in this industry
2. Personalize 3-email outreach sequence for industry
3. Begin outreach campaign
4. **Output**: `outputs/research/leads-[INDUSTRY]-YYYY-MM-DD.md`

### Step 5: Launch & Track (Growth) — Day 5–7
1. Set up analytics tracking for new industry page
2. Monitor initial outreach metrics (open rate, reply rate)
3. Track first demo bookings
4. Report initial results in `shared/metrics.md`

## Success Criteria
- [ ] Industry page live on website
- [ ] Voice scripts tested and deployed
- [ ] 30+ qualified leads identified
- [ ] First outreach batch sent
- [ ] At least 1 demo booked within first week

## Escalation
If no demos booked after 50 outreach emails: revisit ICP and messaging with Younes.
