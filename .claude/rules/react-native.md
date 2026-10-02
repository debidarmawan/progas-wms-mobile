# This is React Native 0.83 (bare CLI)

This is **not** the web React you know. There is no DOM and there are no
Next.js APIs. Do not reach for `<div>`, `<span>`, `window`, `document`,
`next/navigation`, `next/link`, `next/image`, or any browser/server-only API.

## Core primitives

Build UI from React Native core components:

- `View` instead of `<div>`
- `Text` for all text (raw strings must live inside `<Text>`)
- `Pressable` / `TouchableOpacity` instead of `<button>`/`<a>`
- `TextInput` instead of `<input>`/`<textarea>`
- `FlatList` / `SectionList` for lists (not `.map()` over huge arrays)
- `ScrollView` for scrollable, non-virtualized content
- `Image` instead of `<img>`

## Navigation

Navigation is handled by **React Navigation** (native-stack + bottom-tabs),
not a file-system router:

- Use `useNavigation()` and `navigation.navigate('Route', params)` instead of
  `useRouter().push`.
- Use `navigation.reset(...)` instead of `window.location.href`.
- Screen params come from `route.params`, typed via the navigator param lists.

## Styling

Styling uses **NativeWind** — Tailwind classes via the `className` prop on RN
components. Use the semantic tokens defined in `tailwind.config.js`
(`bg-primary`, `text-muted-foreground`, `border-border`, etc.).

## Before writing code

Read the current **React Navigation** and **NativeWind v4** docs before
writing navigation or styling code — their APIs may differ from your training
data. Heed React Native **new-architecture** (Fabric/TurboModules) notes and
any deprecation warnings.
