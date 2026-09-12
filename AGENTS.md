# progas-wms-mobile — Agent Notes

This repo is currently an **empty skeleton** (no app code yet). It is the planned mobile app for drivers/field staff in the Progas WMS ecosystem.

**Read `../progas-docs/` first** — do not assume any implementation exists here; check the roadmap before writing code:

- `../progas-docs/04-roadmap.md` (Fase 3) — the mobile app's planned scope: scanning cylinder barcodes at load time and at customer drop-off, linking scans to Delivery Orders
- `../progas-docs/03-business-flow.md` — current backend business flow this app will eventually integrate with
- `../progas-docs/02-modules-api.md` — existing backend API this app will call (`progas-wms-be`)

## Critical facts

- No tech stack decision has been made yet (React Native vs Flutter vs other) — do not assume one.
- No auth flow, screens, or API integration exist in this repo yet.
- The mobile scan-at-delivery flow depends on backend features (Trip/reservation) that are also not yet implemented — see roadmap Fase 2 before Fase 3.

## Business flow changes

Any implementation decision here that affects the sales/delivery flow MUST be reflected in `../progas-docs/03-business-flow.md` and `../progas-docs/04-roadmap.md`, and logged in `../progas-docs/CHANGELOG.md`.
