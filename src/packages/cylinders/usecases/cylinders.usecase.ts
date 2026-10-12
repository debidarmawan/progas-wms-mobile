import { ApiError } from '@/packages/auth/repository/auth-api';
import type {
  Cylinder,
  CylinderHistory,
  PaginatedCylinders,
} from '@/packages/cylinders/domain/cylinders';
import {
  fetchCylinderByBarcode,
  fetchCylinderById,
  fetchCylinderHistory,
  fetchCylinders,
} from '@/packages/cylinders/repository/cylinders-api';

export const DEFAULT_CYLINDER_PAGE_SIZE = 20;

export type ListCylindersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

/** Loads one page of cylinders, normalising the search term and paging defaults. */
export async function listCylinders(params: ListCylindersParams = {}): Promise<PaginatedCylinders> {
  const search = params.search?.trim() ?? '';
  return fetchCylinders({
    page: params.page && params.page > 0 ? params.page : 1,
    limit: params.limit && params.limit > 0 ? params.limit : DEFAULT_CYLINDER_PAGE_SIZE,
    search,
  });
}

/** Loads a single cylinder by id, guarding against an empty id. */
export async function getCylinder(id: string): Promise<Cylinder> {
  if (!id) throw new ApiError('ID silinder tidak valid.', 400);
  return fetchCylinderById(id);
}

/** Looks up a cylinder by scanned barcode. */
export async function getCylinderByBarcode(barcode: string): Promise<Cylinder> {
  const sn = barcode.trim();
  if (!sn) throw new ApiError('Barcode tidak boleh kosong.', 400);
  return fetchCylinderByBarcode(sn);
}

/** Loads the change/status history for a cylinder. */
export async function getCylinderHistory(id: string): Promise<CylinderHistory> {
  if (!id) throw new ApiError('ID silinder tidak valid.', 400);
  return fetchCylinderHistory(id);
}
