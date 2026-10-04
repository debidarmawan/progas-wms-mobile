import { BrandMark } from '@/components/organisms/brand-mark';
import { ScreenContainer } from '@/components/templates/screen-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/packages/auth/presentation/auth-context';
import { Alert } from 'react-native';

export function HomeScreen() {
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    const remoteLogoutError = await signOut();
    if (remoteLogoutError) {
      Alert.alert(
        'Sesi diakhiri',
        `Token lokal sudah dihapus, tetapi server tidak mengonfirmasi logout: ${remoteLogoutError}`,
      );
    }
  }

  return (
    <ScreenContainer>
      <BrandMark />
      <Card>
        <CardHeader>
          <CardTitle>Halo, {user?.name}</CardTitle>
          <CardDescription>Akun Driver Progas WMS</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Login berhasil. Fitur operasional driver akan tersedia setelah API Trip dan pengiriman disiapkan.
          </CardDescription>
          <Text className="mt-3">{user?.email}</Text>
          <Button className="mt-5" variant="outline" onPress={() => void handleSignOut()}>
            <Text>Keluar</Text>
          </Button>
        </CardContent>
      </Card>
    </ScreenContainer>
  );
}
