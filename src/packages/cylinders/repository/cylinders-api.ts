import {
  type Cylinder,
  type CylinderHistory,
  type CylinderScan,
  type CylinderScanMenu,
  type PaginatedCylinders,
} from '@/packages/cylinders/domain/cylinders';
import { apiRequest } from '@/packages/auth/repository/auth-api';

export type FetchCylindersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

/** Builds a query string, skipping empty/undefined values. */
function buildQuery(params: Record<string, string | number | undefined>): string {
  const parts = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

/** GET /cylinders — paginated list with optional search. */
export async function fetchCylinders(params: FetchCylindersParams = {}): Promise<PaginatedCylinders> {
  const query = buildQuery({ page: params.page, limit: params.limit, search: params.search });
  return apiRequest<PaginatedCylinders>(`/cylinders${query}`);
}

/** GET /cylinders/:id — cylinder detail. */
export async function fetchCylinderById(id: string): Promise<Cylinder> {
  return apiRequest<Cylinder>(`/cylinders/${encodeURIComponent(id)}`);
}

/** GET /cylinders/by-barcode/:sn — lookup for scan validation. */
export async function fetchCylinderByBarcode(barcode: string): Promise<Cylinder> {
  return apiRequest<Cylinder>(`/cylinders/by-barcode/${encodeURIComponent(barcode)}`);
}

/** GET /cylinders/:id/history — master-data and status change history. */
export async function fetchCylinderHistory(id: string): Promise<CylinderHistory> {
  return apiRequest<CylinderHistory>(`/cylinders/${encodeURIComponent(id)}/history`);
}

/** GET /cylinders/scan/:sn?menu= — resolves a scanned SN against one menu. */
export async function fetchCylinderScan(
  barcode: string,
  menu: CylinderScanMenu
): Promise<CylinderScan> {
  const query = buildQuery({ menu });
  return apiRequest<CylinderScan>(`/cylinders/scan/${encodeURIComponent(barcode)}${query}`);
}
