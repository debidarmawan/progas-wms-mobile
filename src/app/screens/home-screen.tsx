import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background p-6">
      <Text variant="h3">Progas WMS Mobile</Text>
      <Text variant="muted">Design system & navigation scaffold siap digunakan.</Text>
    </View>
  );
}
