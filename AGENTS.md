# progas-wms-mobile — Agent Notes

Mobile app for drivers/field staff in the Progas WMS ecosystem. Stack decided and scaffolding in progress: **Expo SDK 57 (React Native) + NativeWind v4 + react-native-reusables + React Navigation**, with clean-architecture packages under `src/packages/<name>/{domain,usecases,repository,presentation}` mirroring `progas-wms` (web)'s layering conventions. See `.claude/rules/*.md` for the enforced conventions (layer separation, naming, component organization, UI approach).

**Read `../progas-docs/` first** — check the roadmap and business flow before writing code:

- `../progas-docs/04-roadmap.md` (Fase 3) — the mobile app's planned scope: scanning cylinder barcodes at load time and at customer drop-off, linking scans to Delivery Orders
- `../progas-docs/03-business-flow.md` — current backend business flow this app will eventually integrate with
- `../progas-docs/02-modules-api.md` — existing backend API this app will call (`progas-wms-be`)

## Critical facts

- **Design system is in place** (Phase A/B done, 2026-10-02): NativeWind tokens adapted from `progas-wms/app/globals.css` (slate neutrals + indigo-600/rose-700 brand, light-only for v1, reduced blur/glass vs. web), UI primitives in `src/components/ui/` (button, text, icon, card, input, badge, separator, label, avatar), atomic layers `ui/molecules/organisms/templates` per `.claude/rules/component-organization.md`.
- **Navigation is React Navigation** (native-stack + bottom-tabs), NOT expo-router — the starter's file-based routing was removed; entry point is `/index.ts` → `src/App.tsx` → `src/app/root-navigator.tsx`. Currently a single placeholder "Home" tab.
- **Mobile auth flow implemented (2026-10-04)**: `src/packages/auth/` calls the backend login, refresh, profile, and logout endpoints. Native access/refresh tokens are stored with `expo-secure-store`; web preview keeps tokens in memory only. Startup refreshes the session and profile, and API requests retry once after a 401. Only users with role `Driver` and a linked `driver_id` can enter the app.
- **Backend driver auth foundation exists (2026-10-04)**: create a user with the `Driver` role and `driver_id` linked to one active master driver. The backend rejects login/refresh if either account is inactive and includes `driver_id` in the auth/profile user payload. The role currently has logout and authenticated profile access only; do not add operational screens until driver-scoped mobile APIs exist.
- The authenticated home screen is still a placeholder; Trip, Delivery Order, scan, offline queue, and driver-scoped API access are not implemented.
- The mobile scan-at-delivery flow depends on backend features (Trip/reservation) that are also not yet implemented — see roadmap Fase 2 before Fase 3.
- Environment note: on this machine, `npm`/`npx` against the public registry needs `NODE_OPTIONS="--use-system-ca"` or it hangs on a TLS verification error.

## Business flow changes

Any implementation decision here that affects the sales/delivery flow MUST be reflected in `../progas-docs/03-business-flow.md` and `../progas-docs/04-roadmap.md`, and logged in `../progas-docs/CHANGELOG.md`.
