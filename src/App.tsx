import '@/global.css';

import { RootNavigator } from '@/app/root-navigator';
import { LoginScreen } from '@/app/screens/login-screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { AuthProvider, useAuth } from '@/packages/auth/presentation/auth-context';
import { NAV_THEME } from '@/shared/utils/theme';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  const { status, error, retryRestore } = useAuth();

  if (status === 'restoring') {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background">
        <ActivityIndicator />
        <Text variant="muted">Memulihkan sesi...</Text>
      </View>
    );
  }

  if (status === 'restore-error') {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <Text variant="h4" className="text-center">Tidak dapat memeriksa sesi</Text>
        <Text accessibilityRole="alert" className="text-center text-destructive">
          {error}
        </Text>
        <Button onPress={() => void retryRestore()}>
          <Text>Coba lagi</Text>
        </Button>
      </View>
    );
  }

  return (
    <NavigationContainer theme={NAV_THEME}>
      {status === 'authenticated' ? <RootNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppContent />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
