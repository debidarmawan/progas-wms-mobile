# Component Organization

Components are React Native (`.tsx`) organized into atomic layers under
`src/components/`. Dependencies only point downward — a layer may use simpler
layers, never more complex ones:

- **Primitives** (`src/components/ui/**/*`) — react-native-reusables + NativeWind
  base components (button, text, input, card, badge, ...). Must NOT import from
  `molecules/`, `organisms/`, `templates/`, or `src/packages/**`.
- **Molecules** (`src/components/molecules/**/*`) — small combinations of primitives.
  Must NOT import from `organisms/` or `templates/`.
- **Organisms** (`src/components/organisms/**/*`) — feature-agnostic composed blocks
  (e.g. `brand-mark.tsx`). Must NOT import from `templates/`.
- **Templates** (`src/components/templates/**/*`) — screen/page layouts
  (e.g. `screen-container.tsx`).

Current contents: `ui/` (avatar, badge, button, card, icon, input, label,
separator, text), `organisms/brand-mark.tsx`, `templates/screen-container.tsx`.
There is no `atoms/` directory — `ui/` fills that role; add `molecules/` only
when a shared primitive combination is genuinely reused.
