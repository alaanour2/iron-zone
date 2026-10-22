# Phase 04: Optimization, Polish & Testing
## Overview
Finalize quality, accessibility, performance, testing, and documentation per PRD 9, 11.6.

## Objectives
- Performance: lazy-load below-fold images, compress/resize images to display size, avoid heavy libs/animations
- Accessibility: full keyboard nav, focus visible, semantic landmarks, labels+errors associated, alt text, no color-only, reduced-motion
- Quality: no duplicate handlers, page-specific scripts only or guarded, CSS vars used, shared styles separate from responsive
- Testing: all links/scripts, forms+filters, mobile/tablet/desktop, keyboard/contrast, console errors
- Docs: README with setup/features/limitations/deployment (static)

## Detailed Tasks
- Audit images (dimensions, compression); mark decorative as empty alt
- Ensure mobile menu keyboard accessible (Tab/Shift+Tab/Enter/Space/Escape if desired)
- FAQ accordion accessible (aria-expanded, keyboard)
- Scroll reveal/back-to-top: respect prefers-reduced-motion; no layout shift
- Test localStorage edge cases (blocked, malformed)
- README: project name, description, structure, how to run (open index.html or serve), features, limitations (no backend/payments), deployment (GitHub Pages), tech stack
- Verify no form claims server-side; demo-only messaging everywhere

## Acceptance Criteria (from PRD 12)
- All 6 pages load/link correctly; nav/footer consistent
- Usable at mobile/tablet/desktop; no unintended horizontal scroll at tested widths
- Membership preselect works; trainer search+filters+empty state; class filters+reset
- Forms validate with inline errors and demo feedback; no server claims
- Visible keyboard focus, semantic HTML
- README complete; console clean

## References
- IRON_ZONE_PRD.md sections 9, 11.6, 12
