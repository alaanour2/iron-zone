# Phase 02: UI Styling & Homepage
## Overview
Implement responsive layouts, shared UI, and homepage (index.html) with shared nav/footer. Per PRD 6-7.1, 11.2.

## Objectives
- Shared navigation: current page indication, keyboard-accessible mobile menu (expand/collapse with proper aria-expanded/state)
- Shared footer: IRON ZONE wordmark/tagline, links to all 6 pages, placeholder contact details, optional social links only if valid, dynamic year if desired
- Homepage sections: hero, intro, services/benefits, placeholder stats (labeled), featured plans, featured trainers, CTA, footer
- Responsive design (mobile/tablet/desktop), no horizontal overflow, cards reflow
- Images: descriptive alt text; empty alt for decorative; lazy-load below-fold
- Accessibility: semantic landmarks (header/nav/main/footer/section), heading hierarchy, visible focus, no color-only states
- Contrast: neon green (#B7FF2A) on dark backgrounds readable

## Files
- index.html
- css/components.css, css/responsive.css, css/style.css updates
- js/main.js (shared nav/mobile menu + global interactions like scroll reveal/back-to-top if added)

## Detailed Tasks
1. Build nav/footer as reusable partials in each HTML or shared template structure (vanilla HTML only)
2. Implement mobile menu: button toggles menu, supports keyboard (Enter/Space/Tab), aria-expanded reflects state
3. Hero: readable text over image; CTAs link to join.html/membership.html
4. Featured sections render minimal demo data clearly marked as placeholder if needed
5. Lazy loading for below-fold images

## Acceptance Criteria
- index.html passes basic semantics
- Mobile menu accessible and collapsible
- No horizontal overflow at common viewports
- Focus indicators visible
- Below-fold images use loading='lazy'

## References
- IRON_ZONE_PRD.md sections 6, 7.1, 9 (Performance/Accessibility)
