---
name: react-native-reusables
description: Manages react-native-reusables (rnr) components and NativeWind styling — adding, composing, and styling React Native UI. The RN equivalent of shadcn/ui. Applies when working with react-native-reusables, NativeWind, a components.json file, or any React Native primitive UI. Also triggers for "rnr add", "add a native button/card/dialog", or "style with NativeWind".
user-invocable: false
allowed-tools: Bash(npx @react-native-reusables/cli@latest *), Bash(pnpm dlx @react-native-reusables/cli@latest *), Bash(bunx --bun @react-native-reusables/cli@latest *)
---

# react-native-reusables (rnr) + NativeWind

react-native-reusables is a set of accessible, composable React Native primitives you copy into your project as source (`src/components/ui/`). It is the React Native counterpart of shadcn/ui, styled with **NativeWind** (Tailwind for React Native). Components are added via the CLI and owned by the project.

> **IMPORTANT:** Run CLI commands with the project's package runner: `npx @react-native-reusables/cli@latest`, `pnpm dlx @react-native-reusables/cli@latest`, or `bunx --bun @react-native-reusables/cli@latest` — based on `packageManager`. Examples use `npx`.

## Current Project Context

- `components.json` holds aliases (`components` → `@/components`, `ui` → `@/components/ui`, `lib` → `@/shared/utils`, `hooks` → `@/shared/hooks`).
- UI primitives live in `src/components/ui/`. Check that directory before adding — don't re-add or duplicate.
- Styling is **NativeWind** `className` on RN core components (`View`, `Text`, `Pressable`, `TextInput`, `Image`, `ScrollView`, `FlatList`, `Modal`). There is **no DOM** — never use `div`, `span`, `<button>`, `<img>`, or web-only Tailwind (`hover:`, `space-x-*` semantics differ; grid is limited).

## Principles

1. **Use existing primitives first.** Check `src/components/ui/` before writing custom UI. Compose primitives, don't reinvent.
2. **Compose, don't reinvent.** A form = `Field` + `Label` + `Input` + `Button`. A list = `FlatList` + `DataTable` + `Card`.
3. **Use built-in variants before custom styles.** `variant="outline"`, `size="sm"` on `Button`.
4. **Use semantic color tokens.** `bg-primary`, `text-muted-foreground`, `border-border` — never raw values like `bg-blue-500` or hex. Tokens come from `tailwind.config.js`.

## Critical Rules

- **RN core components only.** `View` for layout, `Text` for all text (RN requires text inside `<Text>`), `Pressable`/`TouchableOpacity` for taps, `TextInput` for inputs.
- **`className` for layout and spacing.** Use `flex`, `flex-row`, `gap-*`, `p-*`, `m-*`. NativeWind supports flexbox; default flex-direction in RN is `column`.
- **Equal dimensions:** `size-10` when width == height.
- **Conditional classes via `cn()`** from `@/utils` (clsx + tailwind-merge). No manual template-literal ternaries.
- **No web APIs.** No `window`, `document`, `localStorage` (use AsyncStorage), no `next/*`, no service workers.
- **UI layer independence:** `src/components/ui/**` must NOT import from `src/packages/**`.
- **Dark mode** via NativeWind `useColorScheme()` + `dark:` variants and semantic tokens — not manual color overrides.
- **Icons** from `lucide-react-native` (backed by `react-native-svg`), sized with `size` prop or className.

## Key Patterns

```tsx
// Text must be wrapped — RN throws on bare strings in View.
<View className="flex-col gap-2">
  <Text className="text-lg font-bold text-foreground">Title</Text>
  <Text className="text-sm text-muted-foreground">Subtitle</Text>
</View>

// Button: variants + size, children are Text/icon.
<Button variant="outline" size="sm" onPress={onPress}>
  <Text>Save</Text>
</Button>

// Conditional classes.
<View className={cn('rounded-md p-4', isActive && 'bg-primary')} />

// Spacing: gap-* with flex, not space-x-*.
<View className="flex-row gap-4 items-center">…</View>
```

## Component Selection (RN)

| Need                    | Use                                                                    |
| ----------------------- | ---------------------------------------------------------------------- |
| Button / action         | `Button` with variant                                                  |
| Text                    | `Text` (variant default/muted/destructive)                             |
| Form inputs             | `Input` (TextInput), `PasswordInput`, `Label`                          |
| Data display            | `Card`, `Badge`, `Avatar`, `Separator`                                 |
| Lists / tables          | `DataTable` (FlatList wrapper) + `DataTableRow`                        |
| Overlays                | `Dialog` (RN `Modal`), `ConfirmModal`; bottom sheet → gorhom sheet     |
| Feedback                | `react-native-toast-message` (`Toast.show`), `Alert`, `Spinner`        |
| Navigation              | React Navigation (`native-stack`, `bottom-tabs`) — not a UI primitive  |
| Loading                 | `Spinner` (ActivityIndicator), full-screen `Loading` overlay           |
| Layout wrappers         | `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView`, templates        |

## Workflow

1. **Check installed primitives** — list `src/components/ui/` before `add`.
2. **Add a component** — `npx @react-native-reusables/cli@latest add <name>`.
3. **Verify after adding** — read the file, fix import aliases to match `components.json` (`@/components/ui/...`), swap any web icon imports for `lucide-react-native`, confirm it uses RN core components and semantic tokens.
4. **Style with NativeWind** — semantic tokens + variants; `cn()` for conditionals.

## Quick Reference

```bash
# Add primitives
npx @react-native-reusables/cli@latest add button card input dialog

# Initialize (new project)
npx @react-native-reusables/cli@latest init
```

## Detailed References

- NativeWind docs — https://www.nativewind.dev
- react-native-reusables — https://reactnativereusables.com
- React Navigation — https://reactnavigation.org
