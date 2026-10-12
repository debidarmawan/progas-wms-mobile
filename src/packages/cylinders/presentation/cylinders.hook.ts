import {
  type Cylinder,
  type CylinderHistory,
  type PaginationMeta,
} from '@/packages/cylinders/domain/cylinders';
import {
  getCylinder,
  getCylinderHistory,
  listCylinders,
} from '@/packages/cylinders/usecases/cylinders.usecase';
import { parseCylindersFilter } from '@/packages/cylinders/presentation/cylinders.schema';
import * as React from 'react';

const SEARCH_DEBOUNCE_MS = 300;

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export type CylindersState = {
  items: Cylinder[];
  meta: PaginationMeta | null;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  search: string;
  setSearch: (value: string) => void;
  refresh: () => void;
  loadMore: () => void;
  reload: () => void;
};

/** Loads the paginated cylinder list with debounced search, refresh and infinite scroll. */
export function useCylinders(): CylindersState {
  const [items, setItems] = React.useState<Cylinder[]>([]);
  const [meta, setMeta] = React.useState<PaginationMeta | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Guards against out-of-order responses overwriting newer state.
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(parseCylindersFilter({ search }).search);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  // Initial load and reload on search change. State is applied in the async
  // continuation so nothing runs synchronously inside the effect.
  React.useEffect(() => {
    let active = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    (async () => {
      try {
        const data = await listCylinders({ page: 1, search: debouncedSearch });
        if (!active || requestId !== requestIdRef.current) return;
        setMeta(data.meta);
        setItems(data.items);
        setError(null);
      } catch (loadError) {
        if (!active || requestId !== requestIdRef.current) return;
        setError(messageFrom(loadError, 'Gagal memuat data silinder.'));
      } finally {
        if (active && requestId === requestIdRef.current) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  // UI-driven loads (pull-to-refresh, infinite scroll, retry).
  const load = React.useCallback(
    async (page: number, mode: 'refresh' | 'more' | 'initial') => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (mode === 'refresh') setRefreshing(true);
      else if (mode === 'more') setLoadingMore(true);
      else setLoading(true);

      try {
        const data = await listCylinders({ page, search: debouncedSearch });
        if (requestId !== requestIdRef.current) return;
        setMeta(data.meta);
        setItems((previous) => (page <= 1 ? data.items : [...previous, ...data.items]));
        setError(null);
      } catch (loadError) {
        if (requestId !== requestIdRef.current) return;
        setError(messageFrom(loadError, 'Gagal memuat data silinder.'));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearch],
  );

  const refresh = React.useCallback(() => {
    void load(1, 'refresh');
  }, [load]);

  const reload = React.useCallback(() => {
    void load(1, 'initial');
  }, [load]);

  const hasMore = meta ? meta.page < meta.total_pages : false;

  const loadMore = React.useCallback(() => {
    if (loading || loadingMore || refreshing || !meta || meta.page >= meta.total_pages) return;
    void load(meta.page + 1, 'more');
  }, [load, loading, loadingMore, refreshing, meta]);

  return {
    items,
    meta,
    hasMore,
    loading,
    refreshing,
    loadingMore,
    error,
    search,
    setSearch,
    refresh,
    loadMore,
    reload,
  };
}

export type CylinderDetailState = {
  cylinder: Cylinder | null;
  history: CylinderHistory | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

/** Loads a single cylinder plus its change history. */
export function useCylinderDetail(id: string): CylinderDetailState {
  const [cylinder, setCylinder] = React.useState<Cylinder | null>(null);
  const [history, setHistory] = React.useState<CylinderHistory | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const requestIdRef = React.useRef(0);

  React.useEffect(() => {
    let active = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    (async () => {
      try {
        const [detail, detailHistory] = await Promise.all([
          getCylinder(id),
          getCylinderHistory(id),
        ]);
        if (!active || requestId !== requestIdRef.current) return;
        setCylinder(detail);
        setHistory(detailHistory);
        setError(null);
      } catch (loadError) {
        if (!active || requestId !== requestIdRef.current) return;
        setError(messageFrom(loadError, 'Gagal memuat detail silinder.'));
      } finally {
        if (active && requestId === requestIdRef.current) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const reload = React.useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { cylinder, history, loading, error, reload };
}
