# progas-wms-mobile

Mobile app (Expo / React Native) for drivers and field staff in the Progas WMS ecosystem. See [AGENTS.md](./AGENTS.md) for architecture conventions and current progress.

## Stack

- Expo SDK 57 (React Native 0.86)
- NativeWind v4 + react-native-reusables (UI primitives in `src/components/ui/`)
- React Navigation (native-stack + bottom-tabs)
- Clean architecture feature packages under `src/packages/<name>/{domain,usecases,repository,presentation}`

## Getting started

```bash
npm install
npm run web      # or: npm run ios / npm run android
```

## Project structure

```
src/
  app/            # navigators + screens (root-navigator.tsx, app/screens/*)
  components/
    ui/           # react-native-reusables primitives (button, card, input, ...)
    molecules/
    organisms/    # e.g. brand-mark
    templates/    # e.g. screen-container
  packages/       # clean-architecture feature packages (domain/usecases/repository/presentation)
  shared/
    utils/        # cn(), theme tokens for React Navigation
    hooks/
  global.css      # Tailwind directives + design tokens
```
