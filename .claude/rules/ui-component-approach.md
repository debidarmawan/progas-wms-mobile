---
description: Enforce react-native-reusables and NativeWind usage patterns
paths:
  - 'src/components/**/*.tsx'
---

# UI Component Approach

Use **react-native-reusables** and **NativeWind** for all UI components:

- **Import primitives** from `@/components/ui`:

  ```tsx
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Text } from '@/components/ui/text'
  ```

- **Use NativeWind classes** with the `className` prop and semantic tokens
  (`bg-primary`, `text-muted-foreground`, `border-border`) — never raw hex
  values:

  ```tsx
  import { View } from 'react-native'

  import { Button } from '@/components/ui/button'
  import { Text } from '@/components/ui/text'

  export function SavePanel() {
    return (
      <View className="flex-row items-center gap-4 p-4 bg-card rounded-lg">
        <Text className="text-foreground">Ready to save</Text>
        <Button onPress={handleSave}>
          <Text className="text-primary-foreground">Save</Text>
        </Button>
      </View>
    )
  }
  ```

- **UI components** (`src/components/ui/**/*`) should NOT import from:
  - `src/packages/<package-name>/**/*` (keep UI library independent of business logic)

This ensures consistent styling and component usage across the application.
