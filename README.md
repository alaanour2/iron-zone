# IRON ZONE

**Premium Fitness & Personal Training** — a responsive, multi-page gym website built with HTML5, CSS3, and vanilla JavaScript.

> Front-end only. There is no backend, database, authentication, or payment processing. All forms are browser demos and do not transmit data.

## Tech Stack
- HTML5 (semantic markup)
- CSS3 (custom properties, Flexbox, Grid)
- Vanilla JavaScript (no frameworks or build step)
- Google Fonts: Oswald, Bebas Neue, Inter (English) and Cairo, Tajawal (Arabic)

## Structure
```
index.html          Home (hero, benefits, plans, trainers, testimonials)
membership.html     Membership plans, comparison table, plan wizard, FAQ
trainers.html       Trainer directory (search + specialty filter)
trainer.html        Individual trainer profile (opened as trainer.html?id=<key>)
classes.html        Class schedule (filters + reset) + weekly timetable
workout.html        Workout log with progress charts
contact.html        Contact form
join.html           Membership inquiry form (preselects plan)
css/
  style.css         Tokens, reset, base, hero
  components.css     Buttons, cards, nav, footer, forms, faq, workout/wizard/schedule/testimonials
  responsive.css    Layout grids and breakpoints
js/
  main.js           Shared nav/mobile menu, theme toggle, back-to-top, scroll reveal
  i18n.js           Language loader/toggle (English + Arabic), RTL switching
  storage.js        Safe localStorage helpers
  membership.js     "Choose Plan" handling
  plan-wizard.js    "Find your plan" recommendation quiz
  trainer-data.js   Shared trainer records (age, experience, languages, image)
  trainer.js        Trainer profile renderer (accessible tabs, stats, prev/next)
  trainers.js       Trainer filtering + empty state + looping marquee + profile links
  classes.js        Class filtering + reset
  schedule.js       Weekly timetable tabs, capacity bars, demo spot requests
  workout-log.js    Workout entries, stats, SVG progress chart
  form-validation.js  Client-side validation + join plan prefill
i18n/
  en.json           English translations
  ar.json           Arabic translations
assets/             images / icons / fonts
docs/phases/        Implementation phase plans
```

## Running Locally
Serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

> Language switching loads the translation JSON files (i18n/en.json, i18n/ar.json) via `fetch`, which browsers block on the `file://` protocol. Always serve the site over HTTP to use the English/Arabic toggle.

## Features
- Shared, consistent navigation and footer across all pages with the active page indicated.
- Keyboard-accessible mobile menu (toggle with `aria-expanded`, closes on `Escape`).
- Membership plan selection stored in `localStorage` and passed to `join.html` (via query string + storage); invalid/missing plan falls back to a neutral notice.
- Trainer directory: combined name/specialty search and specialty filter with an empty state.
- Trainer directory marquee: cards scroll in a seamless, infinitely looping row with a soft fade at both edges. The loop stops automatically while the pointer or keyboard focus is inside the row, and the duplicated copy is `aria-hidden` and removed from the tab order. Under `prefers-reduced-motion: reduce` the animation is removed and the row becomes a static, horizontally scrollable strip.
- Trainer profiles: each card opens `trainer.html?id=<key>` with a hero (photo, age, years of experience, languages), animated stats, and keyboard-accessible tabs for About, Experience timeline, Achievements/Certifications, and training locations. Invalid or missing IDs show a friendly not-found state; previous/next links cycle through coaches.
- Class listing: day + level filters with a reset control.
- Workout log (`workout.html`): log a session (exercise, date, weight, reps, sets) and watch an SVG progress chart, session count, best lift, and total volume update. Entries live in `localStorage` under `ironzone:workoutLog` only — never uploaded. Invalid input is rejected with an inline `role="alert"` message, and the page shows a notice if browser storage is unavailable.
- Plan wizard (`membership.html`): four questions (goal, experience, frequency, support) score the Starter / Pro / Elite plans and recommend one with a short reason. Choosing the recommendation stores the plan and carries the visitor to `join.html?plan=<id>`.
- Weekly timetable (`classes.html`): six day tabs with arrow-key navigation, per-session capacity bars, and a demo "Request a Spot" toggle stored under `ironzone:classRequests`. It is a sample timetable — no real booking is made.
- Testimonials (`index.html`): three sample success stories, clearly marked as demonstration content.
- Contact and Join forms: client-side validation, accessible inline errors, and an explicit demo confirmation message.
- Bilingual English/Arabic UI with a segmented header switcher (EN | ع, active language highlighted); translations live in JSON files and switching sets `dir="rtl"` with Arabic typefaces. Preference is stored under `ironzone:lang`. The switcher and the theme toggle sit at the far edge of the header - right in English, left in Arabic.
- Skip-to-content link, visible focus states, `prefers-reduced-motion` support.
- Fully responsive from 320 px to 1920 px: no horizontal scrolling on any page (English or Arabic), mobile-first layout, and touch targets of at least 24x24 px (44 px for header controls).

## Responsive Behaviour
| Range | Layout |
| --- | --- |
| <= 400 px | Compact header (reduced wordmark, icon-only menu button), tighter spacing and typography, full-width hero buttons |
| <= 480 px | One-column grids, smaller section padding, icon-only menu button, 2.25 rem language switcher |
| <= 767 px | Hamburger menu (opens as a full-width list, closes on `Escape`), stacked content, 44 px header controls |
| 768-1100 px | Desktop navigation with a reduced wordmark and progressively tighter link spacing; 2-3 column grids and split layouts |
| >= 1100 px | Full desktop layout, max-width 1200 px container |

Verified with headless Chrome at 320, 360, 375, 390, 412, 430, 540, 640, 768, 820, 834, 1024, 1180, 1280, 1440 and 1920 px, in both English (LTR) and Arabic (RTL), with the mobile menu open and closed.

## Limitations
- Demo only: no real submissions, bookings, reservations, or payments.
- The weekly timetable, its capacity figures, the testimonials, and the trainer statistics are sample/placeholder content.
- Forms never send data to a server and do not imply membership activation.
- Form PII is not persisted; only the chosen plan, the workout entries you type yourself, the demo spot requests, and non-sensitive UI preferences are stored in `localStorage`.
- Prices, trainer profiles, and statistics are sample/placeholder content.

## Deployment
Static site — no build step required. To publish with GitHub Pages:

1. Push the repository to GitHub.
2. In **Settings → Pages**, set the source branch to `main` and the folder to `/ (root)`.
3. Open the generated `https://<user>.github.io/<repo>/` URL.

## Accessibility
- Semantic landmarks (`header`, `nav`, `main`, `footer`) and heading hierarchy.
- Form inputs have associated labels; errors use `role="alert"` and `aria-invalid`.
- State is never conveyed by color alone; focus indicators are always visible.
- The looping trainer row stops while hovered or focused; the duplicated copy is `aria-hidden` and excluded from the tab order.
