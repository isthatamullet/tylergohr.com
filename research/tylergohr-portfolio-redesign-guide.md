# Tyler Gohr Portfolio Redesign Guide
## Research-Backed Step-by-Step Plan for tylergohr.com

**Purpose:** Transform tylergohr.com from a consulting-focused site to a job-seeker portfolio that provides hiring managers detailed insight into your career, experience, skills, business impact, and achievements.

**Current State:** Next.js 15 site with Hero, About, Results, Case Studies, How I Work, Technical Expertise, Contact, Footer. Positioned as "Enterprise Solutions Architect" with consulting CTAs.

**Target State:** A compelling resume-extension portfolio that makes hiring managers want to interview you.

---

## PROJECT STATUS (Updated Jan 24, 2026)

| Phase | Status | Output |
|-------|--------|--------|
| Phase 1: Research | COMPLETE | `PHASE_1_RESEARCH_REPORT.md`, 19 portfolios analyzed |
| Phase 2: Decisions | COMPLETE | `PHASE_2_DECISIONS.md` |
| Phase 3: Content | COMPLETE | 5 content draft files |
| Phase 4: Design | COMPLETE | `STYLE_GUIDELINES.md` (Jaquier-inspired) |
| Phase 5: Assets | PARTIAL | 7 backgrounds generated, favicon/headshot pending |
| Phase 6: Implementation | **COMPLETE** | Site live at tylergohr.com |

**Design Direction:** Jaquier (cyprien.io) style - painterly backgrounds with bold typography
**Quick Reference:** See `PROJECT_STATUS.md` for complete overview

---

## CURRENT STATE (Jan 24, 2026)

### ✅ Completed
- **Homepage**: Hero, About, Skills preview, Experience timeline, Work preview, Footer
- **Skills page** (`/skills`): Full detailed skills with categories and evidence
- **Case Studies page** (`/case-studies`): 5 case studies with Editorial layout
- **Resume page** (`/resume`): Premium elegant style with expandable sections
- **Navigation**: Dark glassmorphism nav, links to pages (About/Skills/Work/Resume)
- **Footer**: Centered columns, appears on all pages, "View Resume" button
- **SEO**: JSON-LD structured data, meta tags, sitemap with all pages
- **Google Search Console**: Sitemap submitted

### ⚠️ Outstanding Items (Polish/Enhancement)

| Item | Priority | Notes |
|------|----------|-------|
| **OG Image** | Medium | 1200x630 image for LinkedIn/Twitter previews. Create after design is finalized. |
| **Professional headshot** | Low | For About section. Currently no headshot displayed. |
| **Animated metric counters** | Low | Style guide mentions metrics should count up on scroll. Not implemented. |
| **PDF Resume download** | Optional | Resume is on /resume page. PDF version would be for offline sharing. |
| **Favicon update** | Low | Check if current favicon matches new design aesthetic. |

### 📝 Meta Content Status
- ✅ Homepage meta tags (in layout.tsx)
- ⚠️ Individual page meta tags - verify /skills, /case-studies, /resume have proper titles/descriptions
- ✅ JSON-LD Person schema (comprehensive, includes Emmy, work history)
- ✅ Sitemap includes all 4 pages
- ⚠️ OG image placeholder exists but needs actual image created

---

## Phase 1: Research & Inspiration (Days 1-3) ✓ COMPLETE

### Step 1.1: Browse Award-Winning Portfolio Sites

**Goal:** Understand what "great" looks like across different styles.

**Sources to explore:**
- [Awwwards Portfolio Collection](https://www.awwwards.com/websites/portfolio/) - Award-winning live sites with technical breakdowns
- [Dribbble Portfolio Designs](https://dribbble.com/tags/portfolio) - 74,000+ portfolio design concepts
- [Muzli Top 100 Creative Portfolios 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/) - Creative boundary-pushers
- [Bestfolios](https://www.bestfolios.com/) - Curated design portfolios by discipline
- [Wall of Portfolios](https://www.wallofportfolios.com/) - Interactive previews without leaving the site

**What to document for each site you like:**
- [ ] Screenshot the hero section
- [ ] Note the navigation structure (single-page vs multi-page)
- [ ] Count the sections on the landing page
- [ ] Note typography choices (serif vs sans-serif, how many fonts)
- [ ] Document color palette (neutral vs bold)
- [ ] Note any scroll effects or animations
- [ ] Record how they present work experience (timeline? cards? list?)
- [ ] Note the CTA language (job-seeker vs consulting)

**Create a folder:** `/home/user/tylergohr.com/research/inspiration/` with subfolders: `hero-sections/`, `typography/`, `layouts/`, `effects/`

---

### Step 1.2: Study Resume-Specific Portfolio Sites

**Goal:** Find examples specifically designed for job seekers (not freelancers).

**Sources:**
- [Colorlib Resume Website Examples 2026](https://colorlib.com/wp/resume-websites/) - 20 resume-focused sites
- [Site Builder Report Resume Websites](https://www.sitebuilderreport.com/inspiration/resume-websites) - 25+ inspiring examples
- [Figma Portfolio Examples](https://www.figma.com/resource-library/portfolio-website-examples/) - 15 examples with tips
- [Hostinger Resume Website Examples](https://www.hostinger.com/tutorials/resume-website-examples) - 10 best examples

**Key Takeaways from Hostinger Guide:**
- **Branded PDF Resume:** Offer a downloadable PDF that visually matches the website's design (fonts, colors) to reinforce personal brand offline.
- **Story-Driven Narrative:** The "About" section should be a compelling professional story connecting past experience to future goals, not just a bio.
- **Interactive Evidence:** Use interactive elements (slideshows, galleries) to showcase achievements instead of static text.

**Key questions to answer:**
- [ ] How do job-seeker sites differ from freelancer/consultant sites?
- [ ] What CTAs do they use? ("Download Resume", "Contact Me", "See My Work")
- [ ] How prominent is contact information?
- [ ] Do they include a downloadable PDF resume?

---

### Step 1.3: Analyze Content Operations / Product Manager Portfolios

**Goal:** Find portfolios from people with similar career backgrounds.

Your profile: Emmy Award-winning content operations leader with 16+ years at Fox/WB/SDI. You're not a designer or developer by trade - you're a content/operations/product person who also codes.

**Key insight from research:** "A product manager's portfolio isn't about visuals or code - it's about your approach to solving problems." ([HelloPM Guide](https://hellopm.co/product-manager-portfolio-guide/))

**Sources:**
- [Content Manager Portfolio Examples](https://authory.com/examples/content-manager-portfolio-examples) - 20 examples showing "strategic oversight beyond individual pieces"
- [Product Manager Portfolio Guide](https://hellopm.co/product-manager-portfolio-guide/) - How to showcase problem-solving
- [CareerFoundry PM Portfolio Examples](https://careerfoundry.com/en/blog/product-management/product-manager-portfolio/) - 9 great examples

**What to look for:**
- [ ] How do they present non-visual work (process improvements, cost savings)?
- [ ] How do they quantify impact?
- [ ] Do they use case study format?
- [ ] How much detail do they provide?

---

### Step 1.4: Gather Typography Inspiration

**Goal:** Select 2-3 font candidates for your redesign.

**Recommendations from research:**
- **Modern/Clean:** Inter, Montserrat, Open Sans, Nunito
- **Professional/Corporate:** Proxima Nova, Helvetica Neue, Avenir Next
- **Elegant/Editorial:** Playfair Display, Georgia (serif headers)
- **Portfolio favorites:** Roboto, Lato, Poppins, Raleway

**Sources:**
- [Figma Best Fonts 2026](https://www.figma.com/resource-library/best-fonts-for-websites/) - 24 web fonts
- [Awwwards Free Fonts](https://www.awwwards.com/best-free-fonts.html) - 100 designer-approved fonts
- [Typewolf Portfolio Sites](https://www.typewolf.com/portfolio-sites) - See fonts in action
- [Typ.io Portfolio Font Pairings](https://typ.io/tags/portfolio) - Pre-made combinations

**Decision to make:**

For a Content Ops/PM role, **Clarity > Personality**. Don't overthink it. Pick one of these "Safe Bets" that aligns with your desired vibe:

**Option 1: The "Systems Architect" (Recommended)**
-   **Font:** **Inter** (for everything)
-   **Vibe:** Efficient, clean, modern, tech-forward. Used by Notion, GitHub, Figma.
-   **Why:** Says "I build structured, scalable systems."
-   **Implementation:** Use different weights (Bold for headers, Regular for body).

**Option 2: The "Modern Executive"**
-   **Headers:** **Montserrat** (Bold, uppercase)
-   **Body:** **Open Sans** or **Roboto**
-   **Vibe:** Authoritative, established, corporate but fresh.
-   **Why:** Says "I am a leader who drives business results."

**Option 3: The "Award-Winning Strategist"**
-   **Headers:** **Playfair Display** (Serif)
-   **Body:** **Lato** (Sans-serif)
-   **Vibe:** Editorial, premium, sophisticated.
-   **Why:** The serif header adds a touch of "Emmy Award" prestige/class.

**Your Choice:**
- [x] Option 1 (Inter)
- [ ] Option 2 (Montserrat/Open Sans)
- [ ] Option 3 (Playfair/Lato)

---

### Step 1.5: Template & Style Inspiration

**Goal:** See what's possible without starting from scratch.

**Canva (for visual style inspiration, not implementation):**
- [Canva Portfolio Website Templates](https://www.canva.com/website-builder/templates/portfolio/)
- [Canva Resume Templates](https://www.canva.com/resumes/templates/) - See modern resume layouts

**Other template sources:**
- [Wix Portfolio Templates](https://www.wix.com/website/templates/html/portfolio-cv)
- [Lapa Ninja Portfolio Landing Pages](https://www.lapa.ninja/category/portfolio/) - 1,059 creative examples

**What to capture:**
- [ ] Color schemes that feel professional but not boring
- [ ] Section layouts that present dense information clearly
- [ ] Card designs for skills/projects/experience

---

## Phase 2: Strategic Decisions (Days 4-5) ✓ COMPLETE

**Output:** `PHASE_2_DECISIONS.md` - All decisions documented

### Step 2.1: Single-Page vs Multi-Page Decision

**Research findings:**

| Aspect | Single-Page | Multi-Page |
|--------|-------------|------------|
| **Best for** | Quick overview, mobile users | Detailed content, SEO |
| **Recruiter experience** | Fast scan, no navigation needed | Can dive deep if interested |
| **Maintenance** | Easier to update | More pages to maintain |
| **Content depth** | Overview only | Can have detailed case studies |
| **SEO** | Limited keyword targeting | Multiple pages = multiple keywords |

**Your situation:** You have LOTS of content (16+ years, Emmy, major companies, quantified achievements).

**Recommendation:** **Hybrid approach**
- Single scrolling landing page with section previews
- Deep-dive subpages for: Case Studies, Full Resume/Experience, Skills Detail
- This gives recruiters the quick scan AND the option to go deep

**Decision:**
- [ ] Single-page only
- [ ] Multi-page (traditional navigation)
- [ ] Hybrid (landing page + subpages) **(recommended)**

---

### Step 2.2: Content Depth - Landing Page vs Subpages

**Research insight:** "Lead with a minimal, scannable summary, but provide detailed evidence that viewers can explore if interested." ([Indeed](https://www.indeed.com/career-advice/resumes-cover-letters/career-portfolio))

**Recommended landing page structure (above-the-fold to footer):**

1. **Hero (30 seconds):** Name, title, one-liner value prop, primary CTA
2. **Quick Stats (10 seconds):** 3-4 impressive numbers (Emmy, 16+ years, $1.5M saved, 96% delivery)
3. **About (1 minute):** 2-3 paragraph career narrative with headshot
4. **Highlight Reel (2 minutes):** 3-4 achievement cards with metrics (link to case studies)
5. **Skills Overview (30 seconds):** Visual skills grid or categories (link to detail page)
6. **Experience Timeline (1 minute):** Compact timeline of companies/roles (link to full resume)
7. **Contact (immediate):** Clear contact info + form

**Decision - What goes on landing page vs subpages:**

| Content | Landing Page | Subpage |
|---------|--------------|---------|
| Professional summary | Full | N/A |
| Key metrics (4-6) | Full | N/A |
| Featured achievements (3-4) | Preview cards | Full case studies |
| Skills | Visual grid/icons | Detailed descriptions |
| Work history | Timeline overview | Full details per company |
| Project screenshots | Thumbnails | Full galleries |

---

### Step 2.3: Scrollytelling - Yes or No?

**Research definition:** "Scrollytelling is where content unfolds dynamically as users scroll. Each scroll movement triggers animations, transitions, or media elements - turning scrolling into a guided, narrative experience." ([Skya Designs](https://www.skyadesigns.co.uk/web-design-insights/web-design-trend-2026-scroll-storytelling/))

**Pros:**
- Memorable and engaging
- Guides the story you want to tell
- Modern and impressive

**Cons:**
- Can be slow if heavy (needs optimization)
- Some recruiters just want info fast
- Risk of feeling gimmicky for non-creative roles

**Your situation:** You're applying for content ops/product roles - not design roles. The site should feel professional and polished, not like a design portfolio.

**Recommendation:** **Subtle scrollytelling**
- Gentle fade-in animations as sections enter viewport
- Parallax on hero graphic (you already have this with cloud layers)
- Animated counters for metrics
- NO heavy 3D, NO complex scroll hijacking, NO video-as-hero

**Scrollytelling decision:**
- [ ] None (static page)
- [ ] Subtle (fade-ins, counters, light parallax) **(recommended)**
- [ ] Heavy (full scrollytelling narrative)

---

### Step 2.4: Skills Presentation Style

**Research options:**
1. **Progress bars** - Show proficiency percentages (controversial - percentages are arbitrary)
2. **Icon grid** - Clean visual with tool logos
3. **Categorized lists** - Text-based, grouped by type
4. **Skill cards** - Cards with icon + short description
5. **Proficiency tags** - "Expert", "Proficient", "Familiar"

**Best practices from research:**
- "Group skills under distinct categories" ([Arizona Career Center](https://career.arizona.edu/blog/2025/05/05/how-to-list-functional-skills-on-your-website/))
- "Badges or icons next to each skill, only if clean and professional"
- Avoid progress bars unless you can justify the percentages

**Recommendation for your profile:**
Use **categorized icon grids** - clean, professional, scannable:

```
CONTENT & OPERATIONS          PLATFORMS & TOOLS
[icon] CMS/DAM Architecture   [icon] Brightcove, MPX
[icon] Quality Assurance      [icon] iTunes Store
[icon] Process Optimization   [icon] SharePoint, AEM

LEADERSHIP & STRATEGY         TECHNICAL
[icon] Global Team Lead       [icon] AI/ML Integration
[icon] Vendor Management      [icon] Data Analysis
[icon] Training/LMS           [icon] HTML/XML
```

**Decision:**
- [ ] Progress bars with percentages
- [ ] Icon grid (categorized) **(recommended)**
- [ ] Text lists
- [ ] Skill cards with descriptions
- [ ] Combination: _______________

---

### Step 2.5: Career Experience Presentation

**Options:**
1. **Vertical timeline** - Classic, shows progression
2. **Horizontal timeline** - Modern, compact
3. **Company cards** - One card per employer with key achievements
4. **Expandable sections** - Company name visible, click to expand

**Research insight:** "A timeline format highlights career progression and key milestones. Include the most critical accomplishments from each stage." ([SlideTeam](https://www.slideteam.net/blog/top-10-work-experience-timeline-templates-with-examples-and-samples))

**Recommendation:** **Compact cards on landing page + detailed timeline on subpage**

Landing page version:
```
┌─────────────────────────────────────────────────────────────┐
│ FOX CORPORATION (2017-2022)     │ WARNER BROS (2012-2014)  │
│ Lead Content Operator           │ Metadata SME              │
│ "Built Emmy-winning CMS..."     │ "32% → 96% delivery..."   │
│ [View Details →]                │ [View Details →]          │
└─────────────────────────────────────────────────────────────┘
```

**Decision:**
- [ ] Vertical timeline
- [ ] Horizontal timeline
- [ ] Company cards **(recommended for landing)**
- [ ] Expandable accordion

---

### Step 2.6: CTA Language - Job Seeker vs Consultant

**Current site:** "Start Your Project" / "View My Work" (consultant language)

**For job-seeker portfolio:**
- Primary: "Get in Touch" / "Let's Connect" / "Contact Me"
- Secondary: "Download Resume" / "View Full Resume"
- Tertiary: "See Case Studies" / "View My Work"

**Hero CTA recommendation:**
```
[Get in Touch]  [Download Resume]
```

**Decision - Primary CTA:**
- [ ] "Get in Touch" **(recommended)**
- [ ] "Contact Me"
- [ ] "Let's Connect"
- [ ] "Hire Me"
- [ ] Other: _______________

---

## Phase 3: Content Preparation (Days 6-10) ✓ COMPLETE

**Outputs:**
- `CASE_STUDIES_DRAFT.md` - 5 case studies
- `SKILLS_SECTION_DRAFT.md` - 8 skill categories
- `EXPERIENCE_SECTION_DRAFT.md` - 5 roles (vertical timeline)
- `META_CONTENT_DRAFT.md` - SEO for 8 pages

### Step 3.1: Write Your New Hero Content

**Current hero:**
> "Enterprise Solutions Architect - Creating powerful digital solutions that solve real business problems"

**Rewrite options based on your resume variants:**

**Option A (Senior/Manager):**
> Tyler Gohr
> Emmy Award-Winning Content Operations Leader
>
> 16+ years bridging the gap between what organizations have and what they need. From transforming delivery rates to building Emmy-winning platforms, I create systems that outlast my tenure.

**Option B (Specialist/IC):**
> Tyler Gohr
> Content Operations & Digital Distribution Expert
>
> I master platforms fast and fix what's broken. SME in first month at Warner Bros, QC transformation in first month at SDI. Deep expertise in DAM/CMS, metadata, and multilingual distribution.

**Option C (Transformation focus):**
> Tyler Gohr
> Digital Operations Leader
>
> From 32% to 96% delivery in 3 months. $1.5M+ saved in 6 months. Emmy Award for FIFA World Cup streaming. I turn chaotic content operations into repeatable systems.

**Task:**
- [ ] Choose your headline approach
- [ ] Write 2-3 sentence value prop
- [ ] Define primary and secondary CTAs

---

### Step 3.2: Select Your 4-6 Hero Metrics

Choose from your resume highlights:

**Transformation:**
- [ ] 32% → 96% delivery transformation (WB)
- [ ] 50% redelivery reduction (SDI)
- [ ] 50% efficiency improvement (Fox)

**Scale:**
- [ ] 70,000+ titles managed
- [ ] 250,000+ digital assets
- [ ] 20+ languages
- [ ] 10+ countries

**Recognition:**
- [ ] Emmy Award 2018
- [ ] 16+ years experience
- [ ] Fox, Warner Bros, SDI

**Financial:**
- [ ] $1.5M+ saved (Fox)
- [ ] Millions in cost optimization

**AI/Tech:**
- [ ] 95% manual review reduction
- [ ] 78% error reduction (FactSpark)
- [ ] <200ms query performance

**Recommended hero metrics (pick 4):**
1. Emmy Award Winner
2. 16+ Years Experience
3. 32% → 96% Delivery Transformation
4. $1.5M+ Cost Savings

---

### Step 3.3: Select 3-4 Featured Case Studies

Based on your resume, best candidates:

1. **Warner Bros iTunes Transformation** (flagship)
   - Problem: 32% delivery acceptance, daily rejection emails
   - Solution: Root cause analysis, systematic fixes, methodology
   - Result: 96% acceptance, 3x volume, eliminated rejections
   - Impact: TV teams adopted methodology, Exceptional Performance Award

2. **Fox FIFA World Cup CMS** (Emmy story)
   - Problem: Needed streaming platform for global event
   - Solution: Built complete CMS for live/VOD/transcoding/metadata
   - Result: Emmy Award, millions of viewers served
   - Impact: Platform served entire World Cup streaming operation

3. **Fox CC Sync-Fix Cost Savings** (initiative story)
   - Problem: CC files out of sync after transcoding, $100-200/file vendor cost
   - Solution: Pitched Mac Caption software, trained team in-house
   - Result: $1.5M+ saved over 6 months during 15K-title library QC
   - Impact: Proactive initiative leadership didn't request

4. **SDI CVAA Compliance** (compliance story)
   - Problem: Federal accessibility gap affecting hundreds of titles
   - Solution: Designed end-to-end CC remediation workflow
   - Result: Compliance achieved, workflow documented
   - Impact: Influenced leadership prioritization

**Task:**
- [ ] Write 2-3 paragraph summaries for each case study
- [ ] Identify any screenshots/visuals you can include (NDA permitting)
- [ ] Note the metrics for each

---

### Step 3.4: Create Skills Categories

From your resume, organize into categories:

**Core Operations:**
- CMS/DAM Administration & Architecture
- Content Quality Assurance
- Process Optimization
- Metadata Management
- Multilingual Content Delivery

**Leadership:**
- Cross-functional Team Leadership
- Global Operations (10+ countries)
- Training & LMS Administration
- Vendor/Partner Management
- Executive Stakeholder Relations

**Technical:**
- AI/ML Integration
- Data Analysis & Analytics
- HTML/XML/EPUB
- Video Technical Specs
- Platform Integration (iTunes, streaming)

**Tools & Platforms:**
- Brightcove, MPX, AEM, SharePoint
- JIRA, Confluence, Trainual
- PowerBI, Google Analytics
- Adobe Suite

---

### Step 3.5: Prepare Career Timeline Content

Condense each role to:
- Company name
- Title
- Date range
- 1 headline achievement
- 2-3 supporting bullets (for expanded view)

Example:
```
FOX CORPORATION | Lead Content Operator | 2017-2022
"Built Emmy-winning FIFA World Cup CMS; saved $1.5M+ through in-house CC initiative"
• Managed 10+ content specialists across 4 continents
• Launched Fox Nation and Fox Weather platforms
• 50% efficiency improvement across 250K+ assets
```

---

## Phase 4: Design Implementation (Days 11-15) ✓ COMPLETE

**Output:** `STYLE_GUIDELINES.md` - Complete design system

### Design Direction: Jaquier Style (cyprien.io)

**Decision:** Painterly/artistic backgrounds with bold typographic overlays

After exploring multiple portfolio styles (Benjamin Jochims, Spencer Gabor, Anthony Wiktor, Daniel Sun, Jaquier), the **Jaquier style** was selected for its distinctive artistic approach that stands out from typical tech portfolios.

### Step 4.1: Color Palette ✓

**Chosen approach:** NOT solid colors - full-bleed painted backgrounds
- **Primary text:** White (#FFFFFF)
- **Accent:** Red (#C41E3A) for highlight words
- **UI elements:** Frosted glass (rgba(255,255,255,0.15))
- **Backgrounds:** Oil painting style images (bright + dark sections)

### Step 4.2: Layout Decisions ✓

**Hero layout:** [x] Full-width background image with text overlay
**Section widths:** [x] Full width (full-bleed painted backgrounds)
**Card style:** [x] Glassmorphism (frosted glass)

### Step 4.3: Animation Decisions ✓

**Scroll animations:** [x] Fade in on scroll (subtle) + stagger
**Interactive elements:**
- [x] Hover effects on cards (lift + shadow)
- [x] Animated counters for metrics
- [x] Subtle parallax on backgrounds

**Full specifications:** See `STYLE_GUIDELINES.md` for complete typography, colors, components, and animation details.

---

## Phase 5: Asset Gathering (Days 16-20) - PARTIAL

### Background Images ✓ COMPLETE

All 7 painted backgrounds generated using Imagen 4 Ultra:

| Asset | Status |
|-------|--------|
| hero-bg.png | Generated |
| about-bg.png | Generated |
| skills-bg.png | Generated |
| experience-bg.png | Generated |
| casestudies-bg.png | Generated |
| footer-bg.png | Generated |
| hero-mobile-bg.png | Generated |

**Prompts used:** See `IMAGE_GENERATION_PROMPTS.md`

### Step 5.1: Photography & Headshot - PENDING

**Requirements:**
- [ ] Professional headshot (existing or new?)
- [ ] Ensure high resolution (at least 800x800px)
- [ ] Consistent with professional image
- [ ] Consider both light/dark background options

**Location:** `/home/user/tylergohr.com/public/images/`

---

### Step 5.2: Graphics & Icons

**Needed:**
- [ ] Hero graphic (keep current or redesign?)
- [ ] Skill/tool icons (use icon library)
- [ ] Company logos (if allowed)
- [ ] Section dividers or decorative elements

**Icon libraries:**
- [Lucide Icons](https://lucide.dev/) (already in your project)
- [Heroicons](https://heroicons.com/)
- [Simple Icons](https://simpleicons.org/) (brand/tool logos)
- [Devicon](https://devicon.dev/) (developer tool icons)

---

### Step 5.3: Resume PDF

**Create a downloadable PDF version:**
- [ ] Use same visual style as website
- [ ] Include QR code linking to website
- [ ] Keep to 1-2 pages for quick scan
- [ ] Store at `/public/tyler-gohr-resume.pdf`

---

## Phase 6: Implementation Checklist

### Technical Tasks:
- [ ] Update Hero component content
- [ ] Update About section with new narrative
- [ ] Create/update metrics display component
- [ ] Build case study preview cards
- [ ] Create skills grid component
- [ ] Build career timeline component
- [ ] Update Contact section CTAs
- [ ] Create subpage routes (if going multi-page)
- [ ] Implement scroll animations
- [ ] Add PDF download functionality
- [ ] Mobile responsiveness testing
- [ ] Performance optimization (Lighthouse 90+)

### Content Tasks:
- [ ] Write final hero copy
- [ ] Write about section narrative
- [ ] Complete 4 case study write-ups
- [ ] Finalize skills categorization
- [ ] Write career timeline entries
- [ ] Update meta tags for SEO
- [ ] Create OG image for social sharing

---

## Quick Reference: Key Research Sources

**Portfolio Inspiration:**
- [Awwwards Portfolio Sites](https://www.awwwards.com/websites/portfolio/)
- [Dribbble Portfolio Designs](https://dribbble.com/tags/portfolio)
- [Bestfolios](https://www.bestfolios.com/)

**Resume Website Examples:**
- [Colorlib Resume Websites 2026](https://colorlib.com/wp/resume-websites/)
- [Site Builder Report Resume Websites](https://www.sitebuilderreport.com/inspiration/resume-websites)
- [Figma Portfolio Examples](https://www.figma.com/resource-library/portfolio-website-examples/)

**Design Trends 2026:**
- [Wix Web Design Trends 2026](https://www.wix.com/blog/web-design-trends)
- [Webflow Trends 2026](https://webflow.com/blog/web-design-trends-2026)
- [Skya Designs Scrollytelling](https://www.skyadesigns.co.uk/web-design-insights/web-design-trend-2026-scroll-storytelling/)

**Typography:**
- [Figma Best Fonts 2026](https://www.figma.com/resource-library/best-fonts-for-websites/)
- [Typewolf Portfolio Sites](https://www.typewolf.com/portfolio-sites)
- [Creative Boom 50 Fonts 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/)

**Skills Presentation:**
- [Arizona Career Skills Guide](https://career.arizona.edu/blog/2025/05/05/how-to-list-functional-skills-on-your-website/)
- [W3Schools Skill Bars](https://www.w3schools.com/howto/howto_css_skill_bar.asp)

**Career Portfolio Best Practices:**
- [Indeed Career Portfolio Guide](https://www.indeed.com/career-advice/resumes-cover-letters/career-portfolio)
- [Virginia Tech Portfolio Guide](https://career.vt.edu/blog/2025/05/15/beyond-the-resume-using-a-portfolio-to-showcase-your-skills-and-experience/)

**Single vs Multi-Page:**
- [UXPin Single vs Multi-Page](https://www.uxpin.com/studio/blog/single-page-vs-multi-page-ui-design-pros-cons/)
- [Slickplan Website Structure](https://slickplan.com/blog/one-page-website-vs-multiple-pages)

---

## Next Steps

1. **Start Phase 1** - Spend 2-3 days browsing inspiration sites and saving what you like
2. **Make Phase 2 decisions** - Use this guide to make key strategic choices
3. **Prepare content** - Write your new copy before touching code
4. **Then implement** - Only code after content is ready

Would you like me to help with any specific phase in detail?
