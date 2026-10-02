# Naming Conventions

Follow these naming patterns for architectural elements:

- **Domain layer** (`src/packages/<package-name>/domain/**/*.ts`):
  - Entity files: `*<package-name>.ts`
  - Value objects: `*value-object.ts`
  - Interfaces: `*interface.ts`

- **Usecases layer** (`src/packages/<package-name>/usecases/**/*.ts`):
  - Use case files: `*<package-name>.usecase.ts`

- **Repository layer** (`src/packages/<package-name>/repository/**/*.ts`):
  - Repository files: `*<package-name>.repository.ts`

Consistent naming makes the architecture self-documenting.
