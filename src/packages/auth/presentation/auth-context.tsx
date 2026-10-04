import {
  ApiError,
  login,
  logout,
  restoreSession,
  type AuthUser,
} from '@/packages/auth/repository/auth-api';
import { clearStoredTokens } from '@/packages/auth/repository/token-storage';
import * as React from 'react';

type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated' | 'restore-error';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<string | null>;
  retryRestore: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [status, setStatus] = React.useState<AuthStatus>('restoring');
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadSession = React.useCallback(async () => {
    try {
      const restoredUser = await restoreSession();
      setUser(restoredUser);
      setStatus(restoredUser ? 'authenticated' : 'unauthenticated');
    } catch (restoreError) {
      if (restoreError instanceof ApiError && restoreError.status > 0 && restoreError.status < 500) {
        await clearStoredTokens();
        setUser(null);
        setStatus('unauthenticated');
        setError(restoreError.message);
        return;
      }
      setStatus('restore-error');
      setError(errorMessage(restoreError));
    }
  }, []);

  const retryRestore = React.useCallback(async () => {
    setStatus('restoring');
    setError(null);
    await loadSession();
  }, [loadSession]);

  React.useEffect(() => {
    let cancelled = false;
    async function restoreOnMount() {
      try {
        const restoredUser = await restoreSession();
        if (cancelled) return;
        setUser(restoredUser);
        setStatus(restoredUser ? 'authenticated' : 'unauthenticated');
      } catch (restoreError) {
        if (cancelled) return;
        if (restoreError instanceof ApiError && restoreError.status > 0 && restoreError.status < 500) {
          await clearStoredTokens();
          if (cancelled) return;
          setUser(null);
          setStatus('unauthenticated');
          setError(restoreError.message);
          return;
        }
        setStatus('restore-error');
        setError(errorMessage(restoreError));
      }
    }
    void restoreOnMount();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await login(email, password);
      setUser(response.user);
      setStatus('authenticated');
    } catch (loginError) {
      setError(errorMessage(loginError));
      throw loginError;
    }
  }, []);

  const signOut = React.useCallback(async () => {
    let remoteLogoutError: string | null = null;
    try {
      await logout();
    } catch (logoutError) {
      remoteLogoutError = errorMessage(logoutError);
      await clearStoredTokens();
    }
    setUser(null);
    setStatus('unauthenticated');
    setError(null);
    return remoteLogoutError;
  }, []);

  const value = React.useMemo(
    () => ({ status, user, error, signIn, signOut, retryRestore }),
    [status, user, error, signIn, signOut, retryRestore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return context;
}
