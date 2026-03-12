# Playbook: Content Publishing

**Trigger**: New blog post, landing page, or marketing content is ready
**Agents involved**: Content → Dev → Growth → Outreach

## Steps

### Step 1: Content Finalization (Content)
1. Write content in markdown format
2. Check Norwegian spelling and grammar
3. Verify brand voice compliance (see Content agent guidelines)
4. Add meta description and target keywords
5. Include internal links to relevant pages (kartlegging, pricing)
6. **Output**: `outputs/content/blog-[SLUG]-YYYY-MM-DD.md`
7. **Handoff to Dev**: Content file + where it should be published

### Step 2: Implementation (Dev)
1. Create or update page in Next.js (`app/blogg/[slug]/page.tsx`)
2. Add proper SEO metadata (title, description, OG tags)
3. Ensure responsive layout and mobile-friendly
4. Deploy to Vercel preview for review
5. **Handoff to Content**: Preview URL for final check

### Step 3: Review & Publish (Content + Dev)
1. Content reviews preview URL — approve or request changes
2. Dev promotes to production
3. Verify page loads correctly (no broken images, links)

### Step 4: Distribution (Growth + Outreach)
1. **Growth**: Submit URL to Google Search Console for indexing
2. **Growth**: Track keyword rankings for target terms
3. **Content**: Post summary on LinkedIn and other social channels
4. **Outreach**: If content is industry-specific, include in next outreach batch

## Success Criteria
- [ ] Page live and loading correctly
- [ ] SEO metadata present (title, description, OG image)
- [ ] Mobile responsive
- [ ] Internal links working
- [ ] Submitted to search console
- [ ] Shared on at least 1 social channel
