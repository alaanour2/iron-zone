# Product Requirements Document (PRD)
## IRON ZONE — Multi-Page Fitness Gym Website

**Document type:** Front-End Product Requirements  
**Version:** 1.0  
**Status:** Ready for implementation  
**Language:** English  
**Technology:** HTML5, CSS3, Vanilla JavaScript  
**Project type:** Responsive multi-page website  
**Backend:** Out of scope

---

## 1. Project Overview

IRON ZONE is a modern, premium fitness gym website designed to introduce the gym, present membership plans, showcase trainers and workout classes, and encourage visitors to submit a membership inquiry.

The website will use a bold black and neon-green visual identity. It should feel energetic, professional, athletic, and premium while remaining easy to navigate on desktop, tablet, and mobile devices.

The project is a front-end-only implementation. It must not imply that payments, real bookings, or server-side account creation are available. Forms and stored preferences are demonstrations handled in the browser.

## 2. Project Goals

1. Create a polished multi-page gym website suitable for a professional portfolio.
2. Communicate the gym's identity, services, membership options, and trainers clearly.
3. Help visitors navigate from the homepage to membership details and the join form.
4. Demonstrate practical HTML, CSS, and JavaScript skills.
5. Provide a responsive and accessible experience across common screen sizes.
6. Use reusable visual patterns and consistent design rules across pages.

## 3. Target Audience

- People exploring gym memberships.
- Beginners looking for a welcoming place to start training.
- Experienced gym members interested in strength and fitness programs.
- Visitors comparing trainers, classes, and membership options.

## 4. Scope

### 4.1 Included

- Six linked pages.
- Responsive navigation and footer.
- Membership plan cards and plan selection.
- Trainer directory with search/filter controls.
- Workout class listings with filter controls.
- Contact and membership inquiry forms.
- Client-side form validation and clear success/error messages.
- Local storage for a selected membership plan and optional demo preferences.
- Lightweight scroll-reveal effects and a back-to-top control.
- Responsive layouts and keyboard-accessible interactions.
- README documentation and static-site deployment preparation.

### 4.2 Out of Scope

- Backend or database.
- Real user accounts or authentication.
- Real payment processing.
- Confirmed class reservations.
- Sending emails or storing submitted form entries on a server.
- Admin dashboard or content management system.
- Live maps, live opening hours, or real-time availability.

## 5. Brand and Visual Direction

### 5.1 Brand

- **Name:** IRON ZONE
- **Tagline:** TRAIN HARD. LIVE STRONG.
- **Descriptor:** Premium Fitness & Personal Training

### 5.2 Color Palette

| Token | Value | Usage |
|---|---|---|
| Background | `#0A0A0A` | Main page background |
| Surface | `#171717` | Cards and sections |
| Surface Light | `#222222` | Hover states and elevated panels |
| Neon Green | `#B7FF2A` | Primary buttons, highlights, active states |
| Main Text | `#F5F5F5` | Headings and body text |
| Muted Text | `#A3A3A3` | Supporting text |
| Border | `#303030` | Card outlines and dividers |

Use neon green as an accent rather than a background for large areas. Maintain sufficient text contrast.

### 5.3 Typography

- Headings: Oswald or Bebas Neue.
- Body text: Inter.
- Use bold, uppercase display headings selectively.
- If fonts are loaded from an external provider, provide sensible sans-serif fallbacks.

### 5.4 Visual Style

- Dark, cinematic gym photography.
- Strong typography and clear content hierarchy.
- Simple card shapes and restrained borders.
- Subtle hover transitions, not excessive animation.
- Consistent spacing, button styles, border radii, and image treatment.
- Use real, licensed, or otherwise permitted images; provide descriptive alt text.

## 6. Information Architecture

### Global Navigation

- Home
- Membership
- Trainers
- Classes
- Contact
- Join Now (primary CTA)

The active page should be visually distinguished. On small screens, navigation should collapse into a keyboard-accessible mobile menu.

### Global Footer

- IRON ZONE wordmark and tagline.
- Links to all six pages.
- Placeholder contact details clearly marked for replacement.
- Social media links only when valid destinations are supplied.
- Copyright notice using a dynamically calculated current year, if desired.

## 7. Page Requirements

### 7.1 Home — `index.html`

**Purpose:** Introduce the gym and direct visitors to membership or contact actions.

**Sections:**
1. Global navigation.
2. Hero section with gym image, headline, supporting copy, and primary/secondary CTAs.
3. Short introduction to the gym.
4. Services or training benefits.
5. Sample gym statistics, clearly treated as placeholder content until verified.
6. Featured membership plans.
7. Featured trainers.
8. Call-to-action section.
9. Global footer.

**Suggested hero copy:**
- Eyebrow: `YOUR STRONGER SELF STARTS HERE`
- Headline: `PUSH YOUR LIMITS.`
- Supporting text: `Train with purpose, build strength, and make every session count.`
- Primary CTA: `JOIN NOW`
- Secondary CTA: `EXPLORE MEMBERSHIPS`

**Requirements:**
- CTAs navigate to the appropriate page or section.
- Hero text remains readable over the image.
- Avoid fabricated factual claims; placeholder statistics must be labeled or replaced before publication.

### 7.2 Membership — `membership.html`

**Purpose:** Present membership options and help visitors choose a plan.

**Sections:**
1. Page hero/title.
2. Membership plan cards.
3. Plan feature comparison.
4. Frequently asked questions accordion.
5. CTA to join.
6. Footer.

**Example demo plans** (replace with confirmed gym pricing before public launch):
- Starter
- Pro
- Elite

Each card may include a placeholder price, billing period, feature list, and `Choose Plan` button. Clearly mark prices as sample/demo content during development.

**Interactions:**
- Selecting a plan stores its identifier in `localStorage`.
- The visitor is sent to `join.html` with the chosen plan preselected.
- FAQ items open and close with accessible state attributes.
- No payment is collected.

### 7.3 Trainers — `trainers.html`

**Purpose:** Introduce the coaching team.

**Sections:**
1. Page title and short introduction.
2. Search field.
3. Specialty filters.
4. Trainer cards.
5. CTA to join or contact the gym.
6. Footer.

**Trainer card fields:**
- Image.
- Name (sample content until approved).
- Specialty.
- Experience (sample content until verified).
- Short biography.
- Optional social/profile link only if valid.

**Interactions:**
- Filter trainers by specialty.
- Search by trainer name or specialty.
- Show an informative empty state when no results match.
- Provide a `Clear filters` action.

### 7.4 Classes — `classes.html`

**Purpose:** Help visitors understand the available class types and schedule format.

**Sections:**
1. Page title.
2. Class type/level filters.
3. Class cards or schedule table.
4. CTA to inquire about joining.
5. Footer.

**Example class categories:**
- Strength Training
- HIIT
- Cardio
- Yoga & Mobility
- Functional Training

All class times and availability must be labeled as sample information until verified.

**Interactions:**
- Filter by class type or difficulty level.
- Show class name, level, duration, and sample schedule.
- Do not present a class as booked or available in real time.

### 7.5 Contact — `contact.html`

**Purpose:** Provide a simple way to send a demo inquiry and view gym contact information.

**Sections:**
1. Page title and short introduction.
2. Contact information block with replaceable placeholders.
3. Contact form.
4. Opening hours block with clearly identified sample values.
5. Footer.

**Form fields:**
- Full name (required).
- Email (required).
- Subject (optional).
- Message (required).

**Interactions:**
- Validate required fields and email format.
- Display accessible inline errors.
- Display a clear demo success message after valid submission.
- Do not claim that the message was actually sent or received by staff.

### 7.6 Join Us — `join.html`

**Purpose:** Collect a sample membership inquiry and demonstrate the conversion flow.

**Form fields:**
- Full name (required).
- Email (required).
- Phone number (required, with sensible input validation).
- Selected membership plan (required).
- Preferred training goal (optional).
- Additional notes (optional).
- Consent checkbox if personal data is being entered into the demo form.

**Interactions:**
- Read the selected plan from the URL query string and/or `localStorage`.
- Preselect the matching plan.
- Validate fields before submission.
- Display a clear demo confirmation state.
- Do not submit to a server or imply that membership has been activated.
- Avoid saving unnecessary personal information in local storage.

## 8. Functional Requirements

### FR-01: Navigation
- All pages share the same navigation structure.
- All navigation links point to valid local pages.
- The current page is indicated accessibly.
- Mobile menu opens and closes via button, supports keyboard interaction, and exposes its expanded state.

### FR-02: Responsive Layout
- Layout adapts to mobile, tablet, and desktop.
- No horizontal overflow at common viewport widths.
- Images preserve appropriate aspect ratios and crop gracefully.
- Cards reflow from multiple columns to one column on small screens.

### FR-03: Membership Selection
- Each membership card has a working selection button.
- The selected plan is passed to the Join Us page.
- Invalid or missing plan identifiers fall back to a neutral prompt.

### FR-04: Trainer Filtering
- Search and specialty filters can be used independently or together.
- Results update without reloading the page.
- An empty state appears when no trainers match.

### FR-05: Class Filtering
- Class filters update the visible cards or rows.
- A reset option restores all classes.
- Sample schedule data is clearly identified.

### FR-06: Forms
- Required fields are validated.
- Errors are associated with their fields and are understandable.
- Submission is prevented when validation fails.
- Valid demo submissions show an explicit front-end-only confirmation.

### FR-07: Browser Storage
- `localStorage` may store the chosen plan and non-sensitive interface preferences.
- The app must handle missing, malformed, or unavailable storage gracefully.
- Do not persist form submissions containing personal information unless a future, explicit requirement justifies it.

### FR-08: Interaction Feedback
- Buttons, links, inputs, accordions, and filters have visible hover/focus/active states.
- Interactive controls provide clear feedback after an action.
- Motion respects `prefers-reduced-motion`.

## 9. Non-Functional Requirements

### Performance
- Compress and resize images for their display dimensions.
- Use lazy loading for below-the-fold images.
- Avoid unnecessary JavaScript and heavy animation libraries.
- Keep CSS and JavaScript organized and page-specific where appropriate.

### Accessibility
- Use semantic HTML landmarks and heading hierarchy.
- All controls must be keyboard accessible.
- Provide visible focus indicators.
- Use labels for form inputs and meaningful error messages.
- Add alt text to informative images; use empty alt text for purely decorative images.
- Do not rely on color alone to convey a state.
- Ensure neon accents and text maintain readable contrast.

### Maintainability
- Use CSS custom properties for colors, spacing, radii, and transitions.
- Keep shared styles separate from responsive overrides.
- Use consistent naming conventions.
- Avoid duplicate event handlers and inline JavaScript where practical.
- Comment only where the intent is not obvious.

### Compatibility
- Support current desktop and mobile versions of major browsers.
- Test Chrome and at least one additional browser when possible.

## 10. Recommended Project Structure

```text
iron-zone/
├── index.html
├── membership.html
├── trainers.html
├── classes.html
├── contact.html
├── join.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── membership.js
│   ├── trainers.js
│   ├── classes.js
│   ├── form-validation.js
│   └── storage.js
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── README.md
```

Use `main.js` for shared navigation and global interactions. Keep page-specific behavior in its relevant script. Include scripts only on pages that need them, or guard page-specific initialization by checking whether the relevant element exists.

## 11. Suggested Implementation Order

### Phase 1 — Setup
- Create the directory and file structure.
- Define color, typography, spacing, and layout tokens.
- Choose licensed/approved imagery.
- Establish shared button, card, form, navigation, and footer styles.

### Phase 2 — Homepage
- Build semantic HTML sections.
- Implement the desktop layout and visual hierarchy.
- Add responsive behavior.
- Add navigation and basic interactions.

### Phase 3 — Membership and Join Flow
- Create plan cards and comparison section.
- Implement plan selection.
- Pass selected plan to the join form.
- Validate the form and show demo confirmation.

### Phase 4 — Trainers and Classes
- Build data-driven cards from JavaScript arrays.
- Add search and filters.
- Implement empty and reset states.

### Phase 5 — Contact and Global Polish
- Complete the contact page and form.
- Add FAQ accordion, scroll effects, and back-to-top control where useful.
- Ensure reduced-motion support.

### Phase 6 — Testing and Deployment
- Check all links and scripts.
- Test forms and filtering.
- Test at mobile, tablet, and desktop widths.
- Check keyboard navigation and contrast.
- Fix console errors.
- Write a README with setup, features, limitations, and deployment instructions.
- Deploy as a static website, for example with GitHub Pages.

## 12. Acceptance Criteria

The project is ready for portfolio review when:

- All six pages load and link to one another correctly.
- Shared navigation and footer remain visually consistent.
- The website is usable at mobile, tablet, and desktop widths.
- There is no unintended horizontal scrolling at tested viewport sizes.
- Membership selection preselects the correct plan on the Join Us page.
- Trainer search and filters work together and show an empty state.
- Class filters and reset controls work.
- Contact and Join forms validate inputs and show clear demo feedback.
- No form claims to send data to a server.
- The UI includes visible keyboard focus and semantic labels.
- Images have appropriate alternative text and are optimized.
- No uncaught JavaScript errors appear during normal usage.
- Placeholder prices, contact details, trainer biographies, statistics, and schedules are identified and replaced before a real public launch.

## 13. Assumptions and Decisions

- The project is a front-end portfolio project, not a production gym management system.
- All prices, schedules, trainer details, statistics, and contact details are placeholder content until confirmed.
- No framework, build tool, backend, or database is required.
- External images and fonts must be used in accordance with their licenses and availability.
- Browser storage is for non-sensitive demo state only.
- Real bookings, payments, email delivery, and member accounts require a future backend/integration phase.

## 14. Definition of Done

The project is complete when the acceptance criteria are met, all six pages are responsive and navigable, the main interactions work, the code is organized, and the README explains how to run and publish the static website.
