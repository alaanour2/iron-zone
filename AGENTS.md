# AGENTS.md - IRON ZONE

## Project Type
Front-end only: HTML5, CSS3, Vanilla JavaScript. No backend, database, auth, or payments. All forms are browser-demo only.

## Repo State
The site is implemented. Current tree:

`
index.html
membership.html
trainers.html
trainer.html
classes.html
workout.html
contact.html
join.html
css/style.css
css/components.css
css/responsive.css
js/main.js
js/i18n.js
js/storage.js
js/membership.js
js/plan-wizard.js
js/trainer-data.js
js/trainer.js
js/trainers.js
js/classes.js
js/schedule.js
js/workout-log.js
js/form-validation.js
i18n/en.json
i18n/ar.json
assets/images/
assets/icons/
assets/fonts/
docs/phases/
README.md
IRON_ZONE_PRD.md
`

## Pages
- index.html (Home: hero, benefits, stats, plans, trainers, testimonials)
- membership.html (Plans, comparison table, "Find your plan" wizard, FAQ accordion)
- trainers.html (Search + specialty filters, looping trainer marquee)
- trainer.html (Individual trainer profile, opened as trainer.html?id=<key>)
- classes.html (Class filters + reset, weekly timetable with demo spot requests)
- workout.html (Workout log, stats, SVG progress chart)
- contact.html (Contact form)
- join.html (Inquiry form; preselects plan from URL query + localStorage)

## Key Behaviors
- Navigation: shared nav/footer, current page indicated, keyboard-accessible mobile menu (expand/collapse with proper state). Every page links to the others, including workout.html.
- Membership: clicking "Choose Plan" stores plan id in localStorage and navigates to join.html with plan preselected. Missing/invalid plan id must fallback to neutral prompt. No payments.
- Plan wizard: 4 questions (goal, experience, frequency, support) score Starter/Pro/Elite and recommend one with a reason; choosing it stores the plan and redirects to join.html?plan=<id>.
- Workout log: entries (exercise, date, weight, reps, sets) are stored locally only, with stats + SVG chart. Invalid input is rejected inline and never stored. No PII, no upload.
- Weekly timetable: 6 day tabs (arrow-key navigable), capacity bars, demo "Request a Spot" toggle stored under ironzone:classRequests. Sample data only, no real bookings.
- Forms: client-side validation only. Show accessible inline errors. On valid submit, show explicit demo success message. Do not send to server or imply membership activated. Do not persist form PII in localStorage.
- Storage: only store chosen plan, self-entered workout entries, demo spot requests, and non-sensitive UI prefs in localStorage. Handle missing/malformed/unavailable storage gracefully.
- Filters: trainers (search + specialty, combined; empty state if none), classes (filter + reset).
- Accessibility: semantic HTML, keyboard accessible, visible focus, labels + meaningful errors, alt text (empty for decorative), no color-only state, respect prefers-reduced-motion. Ensure neon green (#B7FF2A) + dark background meet contrast.
- Performance: lazy-load below-fold images, compress/resize, avoid heavy libs.

## i18n
- Two languages: English + Arabic (RTL), translations in i18n/en.json and i18n/ar.json, applied by js/i18n.js through data-i18n, data-i18n-placeholder, data-i18n-aria-label, data-i18n-alt, data-i18n-content.
- Any new UI text needs a key in BOTH files with identical key sets. Dynamic strings use window.IronZoneI18n.t(key, vars) with {placeholder} interpolation.
- Translations load via fetch, so the site must be served over HTTP (python -m http.server 8000); file:// breaks the language toggle.

## Scripts
- main.js: shared nav/mobile menu + global interactions (scroll reveal/back-to-top, theme toggle).
- i18n.js: language loading/toggle + RTL switching.
- storage.js: safe localStorage helpers exposed as window.IronZoneStorage.
- Page-specific: membership.js, plan-wizard.js, trainers.js, trainer.js, classes.js, schedule.js, workout-log.js, form-validation.js. Include only where needed or guard by checking target elements exist.

## Theme (IRON ZONE)
- Background: #0A0A0A, Surface: #171717, Surface Light: #222222
- Accent: #B7FF2A (neon green)
- Text: #F5F5F5, Muted: #A3A3A3
- Border: #303030
- Fonts: Oswald/Bebas Neue (headings), Inter (body). Arabic: Cairo/Tajawal. Provide sensible fallbacks.
- Light theme overrides live under [data-theme='light']; RTL overrides under [dir='rtl'].

## Verification
No build or test tooling exists. Before finishing a change run:
- node --check on every file in js/
- JSON.parse on i18n/en.json and i18n/ar.json
- confirm EN/AR key parity and that every data-i18n* key in HTML resolves in both files
- confirm every src/href asset and every CSS url() exists
- confirm one h1, lang/dir, title, main, footer, and a skip link per page
