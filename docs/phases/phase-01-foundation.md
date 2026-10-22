# Phase 01: Foundation
## Frontend Tech Lead Plan

### Overview
This phase establishes the project scaffold, design tokens, and shared base styles per PRD sections 5, 10, and 11 (Phase 1). All work is front-end only; forms are demo-only.

### Objectives
- Create directory/file structure exactly as specified
- Define design tokens (colors, typography, spacing, radius, transitions)
- Prepare assets folder structure and licensing guidance
- Establish base styles (reset, typography, global)

### Directory Structure (Required)
Create at repo root:


index.html, membership.html, trainers.html, classes.html, contact.html, join.html
css/style.css, css/components.css, css/responsive.css
js/main.js, js/membership.js, js/trainers.js, js/classes.js, js/form-validation.js, js/storage.js
assets/images/, assets/icons/, assets/fonts/, README.md


### Design Tokens
Must match PRD 5.2-5.3:
- Colors (CSS custom properties): --bg: #0A0A0A, --surface: #171717, --surface-light: #222222, --accent: #B7FF2A, --text: #F5F5F5, --muted: #A3A3A3, --border: #303030
- Typography: Headings Oswald/Bebas Neue; Body Inter; sensible fallbacks
- Spacing, border radius, transitions; use CSS vars throughout

### Base Implementation Details
- Semantic HTML base (doctype, lang, viewport, meta)
- Reset/normalize with minimal footprint
- Focus-visible styles for keyboard accessibility
- Respect prefers-reduced-motion globally
- No heavy libs; vanilla only

### Acceptance Criteria
- All directories and empty files exist per structure
- style.css defines tokens + base + utilities
- components.css has shared primitives (buttons, cards, nav, footer, forms)
- responsive.css skeleton with breakpoints
- No console errors on initial load
- Meets accessibility basics (focus visible, semantic)

### References
- IRON_ZONE_PRD.md sections 5, 10, 11.1
