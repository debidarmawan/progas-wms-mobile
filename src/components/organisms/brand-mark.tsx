import { Text } from '@/components/ui/text';
import { View } from 'react-native';

/** Brand lockup adapted from the web sidebar (components/layout/sidebar.tsx): solid badge, no gradient/blur on mobile. */
export function BrandMark() {
  return (
    <View className="flex-row items-center gap-3">
      <View className="bg-primary h-10 w-10 items-center justify-center rounded-xl">
        <Text className="text-primary-foreground text-sm font-bold">P</Text>
      </View>
      <View>
        <Text variant="small" className="text-primary font-semibold uppercase tracking-wider">
          Progas
        </Text>
        <Text className="font-semibold leading-tight">WMS Gas</Text>
      </View>
    </View>
  );
}
