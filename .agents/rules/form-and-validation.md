---
description: Enforce Zod schema usage for forms and tables
paths:
  - 'src/packages/<package-name>/presentation/**/*'
---

# Form and Validation

Use Zod for all form and table validation:

## Schema Files

- **Location**: `src/packages/<package-name>/presentation/<package-name>.schema.ts`
- **Naming**: Must match pattern `*<package-name>.schema.ts`
- **Import**: Must import from `zod`

Example:

```typescript
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})
```

## Tables

- **Location**: `src/packages/<package-name>/presentation/table/*.tsx`
- **Naming**: Must match pattern:
  - `*<package-name>.table.tsx`
  - `*<package-name>.table-columns.tsx`
  - `*<package-name>.table-actions.tsx`
- **Imports**:
  - Must import components from `@/components/organisms/data-table/*.tsx`
