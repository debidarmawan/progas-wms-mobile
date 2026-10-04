import {
  clearStoredTokens,
  getStoredTokens,
  saveStoredTokens,
} from '@/packages/auth/repository/token-storage';

type ApiEnvelope<T> = {
  status?: string;
  message?: string;
  data: T;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  driver_id?: string;
  permissions?: string[];
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expired_at: string;
  user: AuthUser;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');

function getApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new ApiError('EXPO_PUBLIC_API_BASE_URL belum dikonfigurasi.', 0);
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function isSuccessStatus(status?: string): boolean {
  const normalizedStatus = (status || '').toUpperCase();
  return normalizedStatus === 'OK' || normalizedStatus === 'SUCCESS';
}

async function requestEnvelope<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string,
): Promise<{ response: Response; envelope: ApiEnvelope<T> }> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(getApiUrl(path), { ...init, headers });
  } catch {
    throw new ApiError(
      'Tidak dapat terhubung ke server API. Periksa koneksi internet.',
      0,
    );
  }

  let envelope: ApiEnvelope<T>;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError('Respons server tidak valid.', response.status);
  }

  return { response, envelope };
}

function assertSuccess<T>(
  response: Response,
  envelope: ApiEnvelope<T>,
): T {
  if (!response.ok || !isSuccessStatus(envelope.status)) {
    throw new ApiError(
      envelope.message || 'Permintaan ke server gagal.',
      response.status,
    );
  }
  return envelope.data;
}

function assertDriverUser(user: AuthUser): AuthUser {
  if (user.role_name !== 'Driver' || !user.driver_id) {
    throw new ApiError('Akun ini tidak terhubung ke role Driver.', 403);
  }
  return user;
}

async function refreshTokens(): Promise<AuthResponse | null> {
  const currentTokens = await getStoredTokens();
  if (!currentTokens?.refreshToken) return null;

  let result: Awaited<ReturnType<typeof requestEnvelope<AuthResponse>>>;
  try {
    result = await requestEnvelope<AuthResponse>('/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: currentTokens.refreshToken }),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 0) throw error;
    if (error instanceof ApiError && error.status >= 500) throw error;
    await clearStoredTokens();
    return null;
  }

  if (!result.response.ok || !isSuccessStatus(result.envelope.status)) {
    if (result.response.status >= 500) {
      throw new ApiError(
        result.envelope.message || 'Server sedang mengalami gangguan.',
        result.response.status,
      );
    }
    await clearStoredTokens();
    return null;
  }

  const refreshed = assertSuccess(result.response, result.envelope);
  try {
    assertDriverUser(refreshed.user);
  } catch (error) {
    await clearStoredTokens();
    throw error;
  }

  await saveStoredTokens({
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token,
  });
  return refreshed;
}

let refreshInProgress: Promise<AuthResponse | null> | null = null;

async function refreshTokensOnce(): Promise<AuthResponse | null> {
  if (!refreshInProgress) {
    refreshInProgress = refreshTokens().finally(() => {
      refreshInProgress = null;
    });
  }
  return refreshInProgress;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { response, envelope } = await requestEnvelope<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const result = assertSuccess(response, envelope);
  assertDriverUser(result.user);
  await saveStoredTokens({
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
  });
  return result;
}

export async function getProfile(): Promise<AuthUser> {
  const tokens = await getStoredTokens();
  if (!tokens) throw new ApiError('Sesi login tidak ditemukan.', 401);

  const { response, envelope } = await requestEnvelope<AuthUser>(
    '/profile',
    {},
    tokens.accessToken,
  );

  if (response.status === 401) {
    const refreshed = await refreshTokensOnce();
    if (!refreshed) {
      throw new ApiError('Sesi berakhir. Silakan login kembali.', 401);
    }
    return assertDriverUser(refreshed.user);
  }

  return assertDriverUser(assertSuccess(response, envelope));
}

export async function restoreSession(): Promise<AuthUser | null> {
  const tokens = await getStoredTokens();
  if (!tokens) return null;

  const refreshed = await refreshTokensOnce();
  if (!refreshed) return null;

  return getProfile();
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const tokens = await getStoredTokens();
  const { response, envelope } = await requestEnvelope<T>(
    path,
    init,
    tokens?.accessToken,
  );

  if (response.status === 401 && path !== '/login' && path !== '/refresh-token') {
    const refreshed = await refreshTokensOnce();
    if (!refreshed) {
      throw new ApiError('Sesi berakhir. Silakan login kembali.', 401);
    }

    const retry = await requestEnvelope<T>(path, init, refreshed.access_token);
    return assertSuccess(retry.response, retry.envelope);
  }

  return assertSuccess(response, envelope);
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    await clearStoredTokens();
  }
}
