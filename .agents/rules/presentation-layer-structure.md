---
description: Detailed rules for presentation layer organization
paths:
  - 'src/packages/<package-name>/presentation/**/*'
---

# Presentation Layer Structure

Organize the presentation layer into clear subdirectories:

## Directory Structure

The presentation layer should be organized into:

- `src/packages/<package-name>/presentation/table/**/*.tsx` - Table (FlatList) components
- `src/packages/<package-name>/presentation/<package-name>.schema.ts` - Zod validation schemas
- `src/packages/<package-name>/presentation/<package-name>.hook.ts` - Custom React hooks
- `src/packages/<package-name>/presentation/<package-name>.config.ts` - Configuration files
- `src/packages/<package-name>/presentation/components` - Reusable feature-specific components

## Component Guidelines

- **Components** (`src/packages/<package-name>/presentation/components/**/*`): Should contain reusable components specific to the feature
- **Schemas** (`src/packages/<package-name>/presentation/<package-name>.schema.ts`): Should contain Zod schemas for validation
- **Menus** (`src/shared/constants/routes.ts` and `src/shared/utils/menus.ts`): Should contain menu and route definition files

## Import Rules

- Presentation layer should NOT directly access repositories
- Presentation layer should import from `src/packages/<package-name>/usecases/**/*` for business logic like calling apis or performing actions
- Presentation layer may import from `src/components/*` for shared UI components
