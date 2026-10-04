import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEY = 'progas.auth.tokens';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

let webTokens: AuthTokens | null = null;

export async function getStoredTokens(): Promise<AuthTokens | null> {
  const value =
    Platform.OS === 'web' ? webTokens && JSON.stringify(webTokens) : await SecureStore.getItemAsync(SESSION_KEY);

  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'accessToken' in parsed &&
      typeof parsed.accessToken === 'string' &&
      'refreshToken' in parsed &&
      typeof parsed.refreshToken === 'string'
    ) {
      return {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
      };
    }
  } catch {
    await clearStoredTokens();
    return null;
  }

  await clearStoredTokens();
  return null;
}

export async function saveStoredTokens(tokens: AuthTokens): Promise<void> {
  const value = JSON.stringify(tokens);
  if (Platform.OS === 'web') {
    webTokens = tokens;
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, value);
}

export async function clearStoredTokens(): Promise<void> {
  if (Platform.OS === 'web') {
    webTokens = null;
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
