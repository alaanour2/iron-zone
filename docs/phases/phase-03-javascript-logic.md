# Phase 03: JavaScript Logic - Core Features
## Overview
Implement all functional behavior per PRD 7-8: membership selection+join prefill, trainers+classes filters, forms, storage, interactions.

## Objectives
- Membership: Choose Plan stores plan id in localStorage, navigates to join.html with plan preselected; invalid/missing falls back to neutral prompt (no payments)
- Join form: prefill from URL query + localStorage; client-side validation; accessible inline errors; explicit demo success; do not send server; do not persist PII
- Contact form: same demo-only validation + success
- Trainers: search + specialty filters combined; empty state
- Classes: filter + reset; sample data clearly identified
- Storage (js/storage.js): store only chosen plan and non-sensitive UI prefs; handle missing/malformed/unavailable storage gracefully
- Guard page-specific init: check for target elements before running

## Scripts & Responsibilities
- main.js: shared nav/menu, global interactions (scroll reveal/back-to-top if added), respects prefers-reduced-motion
- membership.js: handle Choose Plan clicks
- trainers.js: filtering logic + rendering
- classes.js: filtering + reset
- form-validation.js: reusable validation for contact/join
- storage.js: safe get/set/remove helpers

## Critical Constraints
- No backend; never claim membership activated or email sent
- Do not persist form submissions with PII in localStorage
- Neon accent/text contrast must remain valid
- Keyboard accessible controls; visible focus

## Acceptance Criteria
- Join preselects correct plan from query/localStorage; fallback works
- Trainer filters independent+combined; empty state shown
- Class filters + reset work
- Forms show inline errors and demo confirmation; no network calls
- Storage fails gracefully when unavailable
- No console errors on any page

## References
- IRON_ZONE_PRD.md sections 7.2-7.6, 8 (FR-01 through FR-08)
