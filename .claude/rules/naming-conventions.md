# Naming Conventions

Follow these naming patterns for architectural elements:

- **Domain layer** (`src/packages/<package-name>/domain/**/*.ts`):
  - Entity files: `*<package-name>.ts`
  - Value objects: `*value-object.ts`
  - Interfaces: `*interface.ts`

- **Usecases layer** (`src/packages/<package-name>/usecases/**/*.ts`):
  - Use case files: `*<package-name>.usecase.ts`

- **Repository layer** (`src/packages/<package-name>/repository/**/*.ts`):
  - Repository files: `*<package-name>.repository.ts` (HTTP-client wrappers may use `*-api.ts`, e.g. `auth-api.ts`)

- **Presentation layer** (`src/packages/<package-name>/presentation/**/*`):
  - Context/provider: `*-context.tsx`
  - Schemas: `*<package-name>.schema.ts`
  - Hooks: `*<package-name>.hook.ts`

Files use kebab-case; components/types are PascalCase and functions camelCase.
Current example (`src/packages/auth`): `presentation/auth-context.tsx`,
`repository/auth-api.ts`, `repository/token-storage.ts`.

Consistent naming makes the architecture self-documenting.
