# Component Organization

Follow atomic design hierarchy for components:

- **Atoms** (`src/components/atoms/**/*`) should NOT import from:
  - `src/components/molecules/**/*`
  - `src/components/organisms/**/*`
  - `src/components/templates/**/*`

- **Molecules** (`src/components/molecules/**/*`) should NOT import from:
  - `src/components/organisms/**/*`
  - `src/components/templates/**/*`

- **Organisms** (`src/components/organisms/**/*`) should NOT import from:
  - `src/components/templates/**/*`

- **UI** (`src/components/ui/**/*`) react-native-reusables + NativeWind primitives

Components are React Native (`.tsx`) organized under the same atomic
directories (`ui/`, `molecules/`, `organisms/`, `templates/`). This ensures
components can only depend on simpler components, not more complex ones.
