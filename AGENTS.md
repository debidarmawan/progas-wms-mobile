# progas-wms-mobile — Agent Notes

Mobile app for drivers/field staff in the Progas WMS ecosystem. Stack decided and scaffolding in progress: **Expo SDK 57 (React Native) + NativeWind v4 + react-native-reusables + React Navigation**, with clean-architecture packages under `src/packages/<name>/{domain,usecases,repository,presentation}` mirroring `progas-wms` (web)'s layering conventions. See `.claude/rules/*.md` for the enforced conventions (layer separation, naming, component organization, UI approach).

## Rules & skills (for AI agents)

The canonical rules are `.agents/rules/*.md` (layer separation, package boundaries, naming, component organization, React Native, NativeWind UI approach, UI/business separation, form & validation, presentation structure) and the skills are in `.agents/skills/*`. Claude Code uses the identical mirrors under `.claude/`.

Cline reads rules from `.clinerules/` and skills from `.cline/skills/`, so those directories contain **symlinks** back to the `.agents/` files — no duplicated content:

- `.clinerules/*.md` → `.agents/rules/*.md`
- `.cline/skills/*` → `.agents/skills/*`

Edit rules/skills in `.agents/` (or `.claude/`); Cline picks them up automatically. `AGENTS.md` is the cross-tool entry point.

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
- **The app runs on a development build, so its native modules are frozen at build time (2026-10-13).** The dev client pulls JS from Metro, but a native dependency that was added *after* the installed binary was built exists only in JS: the app then dies at startup with `[runtime not ready]: Error: Cannot find native module 'ExpoSecureStore'` even though Metro serves the bundle perfectly. After adding or changing a native dependency, rebuild (`npx eas build --profile development --platform android|ios`) **and reinstall the artifact**, then reload.
- **Verify which build is actually on the device before debugging JS.** `adb shell dumpsys package com.darmawantechnologies.progaswmsmobile | grep -E 'versionCode|lastUpdateTime'` is not enough — every EAS dev build is `versionCode 1`, so a stale binary looks current. Compare bytes instead: pull the installed APK (`adb shell pm path <pkg>` → `adb pull`) and `md5` it against the APK from the EAS build page (`npx eas build:list`); all EAS builds share one managed keystore, so `adb install -r <apk>` upgrades in place and keeps app data.
- **Keyboard handling on Android is manual (2026-10-13).** The app targets Android SDK 36 with edge-to-edge enabled, so `windowSoftInputMode=resize` no longer lifts the window. The pattern Expo's keyboard guide shows for Android — `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : undefined}` — therefore does nothing and the keyboard covers the inputs. Pass `keyboardAvoiding` to `ScreenContainer` on every screen with a text input; it wraps the content in a `KeyboardAvoidingView` with an explicit `behavior="padding"`, and the `scrollable` variant sets `keyboardShouldPersistTaps="handled"` so buttons inside the scroll view stay tappable while the keyboard is open.
- **Never rely on `placeholderClassName` (2026-10-13).** `react-native-css-interop` declares it in `types.d.ts` (so `tsc` accepts it happily) but never registers it for `TextInput` — the only mapping is `cssInterop(TextInput, { className: { target: "style", nativeStyleToProp: { textAlign: true } } })`. The prop is **silently dropped**, so the placeholder falls back to the Android theme hint colour, which is white under the DayNight + edge-to-edge theme and therefore invisible on the white `bg-background` input. Style placeholders with the plain `placeholder:text-*` variant inside `className` — NativeWind rewrites `placeholder:` into the native `placeholderTextColor` prop — and keep that class on the shared path, never inside `Platform.select({ web: ... })`.
- Environment note: on this machine, `npm`/`npx` against the public registry needs `NODE_OPTIONS="--use-system-ca"` or it hangs on a TLS verification error. Android tooling is not on `PATH` — use `~/Library/Android/sdk/platform-tools/adb`; the test device is a Samsung Galaxy A54 5G (`SM-A546E`, Android API 36) reachable over USB. When Wi-Fi routing is unreliable, `adb reverse tcp:8081 tcp:8081` plus the deep link `progaswmsmobile://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081` loads the app through the USB tunnel. Layout can be verified without touching the phone: `adb shell uiautomator dump` + `adb shell dumpsys input_method | grep mInputShown`.

## Business flow changes

Any implementation decision here that affects the sales/delivery flow MUST be reflected in `../progas-docs/03-business-flow.md` and `../progas-docs/04-roadmap.md`, and logged in `../progas-docs/CHANGELOG.md`.
