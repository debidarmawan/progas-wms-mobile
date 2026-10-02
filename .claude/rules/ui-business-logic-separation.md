# UI and Business Logic Separation

Maintain separation between UI and business logic:

- **Components** (`src/components/**/*`) should NOT import from:
  - `src/packages/<package-name>/repository/**/*` (no direct data access)

- **App navigators/screens** (`src/app/**/*`) should:
  - Import from `src/packages/<package-name>/presentation/**/*` when importing from packages

This ensures UI remains independent of implementation details.
