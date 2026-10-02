# Clean Architecture Layer Separation

Maintain strict layer separation in the clean architecture:

- **Domain layer** should NOT import from:
  - `src/packages/<package-name>/presentation/**/*`
  - `src/packages/<package-name>/repository/**/*`
  - `src/packages/<package-name>/usecases/**/*`

- **Usecases layer** should NOT import from:
  - `src/packages/<package-name>/presentation/**/*`

- **Repository layer** should NOT import from:
  - `src/packages/<package-name>/presentation/**/*`
  - `src/packages/<package-name>/usecases/**/*`

- **Presentation layer** should:
  - `src/packages/<package-name>/presentation/**/*`
