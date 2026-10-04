import { BrandMark } from '@/components/organisms/brand-mark';
import { ScreenContainer } from '@/components/templates/screen-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/packages/auth/presentation/auth-context';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';

export function LoginScreen() {
  const { signIn, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSignIn() {
    setFormError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (signInError) {
      setFormError(
        signInError instanceof Error ? signInError.message : 'Login gagal.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="flex-1 justify-center gap-6"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BrandMark />
        <Card>
          <CardHeader>
            <CardTitle>Masuk</CardTitle>
            <CardDescription>Gunakan akun Driver Progas WMS Anda.</CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <Text variant="small">Email</Text>
              <Input
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="nama@perusahaan.com"
                returnKeyType="next"
                textContentType="emailAddress"
                value={email}
              />
            </View>
            <View className="gap-2">
              <Text variant="small">Password</Text>
              <Input
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPassword}
                onSubmitEditing={() => void handleSignIn()}
                placeholder="Masukkan password"
                returnKeyType="done"
                secureTextEntry
                textContentType="password"
                value={password}
              />
            </View>
            {formError || error ? (
              <Text accessibilityRole="alert" className="text-destructive text-sm">
                {formError || error}
              </Text>
            ) : null}
            <Button
              accessibilityLabel="Masuk"
              disabled={loading || !email.trim() || !password}
              onPress={() => void handleSignIn()}>
              {loading ? <ActivityIndicator color="white" /> : <Text>Masuk</Text>}
            </Button>
          </CardContent>
        </Card>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
