export const CYLINDER_STATUSES = [
  'EMPTY',
  'READY_TO_FILL',
  'FILLED',
  'READY',
  'IN_TRANSIT',
  'OUTSTANDING',
  'MAINTENANCE',
  'LOST',
  'WRITE_OFF',
] as const;

export type CylinderStatus = (typeof CYLINDER_STATUSES)[number];

export type CylinderOwnershipType = 'COMPANY' | 'CUSTOMER' | 'VENDOR';

export type Cylinder = {
  id: string;
  barcode_sn: string;
  item_id: string;
  item_name: string;
  gas_type: string;
  ownership_type: CylinderOwnershipType;
  owner_id?: string;
  owner_name?: string;
  status: CylinderStatus;
  last_hydrotest_date: string;
  remarks?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

export type PaginatedCylinders = {
  items: Cylinder[];
  meta: PaginationMeta;
};

export type CylinderHistoryChange = {
  field: string;
  label: string;
  old: string;
  new: string;
};

export type CylinderHistoryEntry = {
  id: string;
  action: string;
  action_label: string;
  user_id?: string;
  user_name?: string;
  created_at: string;
  changes: CylinderHistoryChange[];
};

export type CylinderHistory = {
  cylinder_id: string;
  barcode_sn: string;
  entries: CylinderHistoryEntry[];
};

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/** Backend scan menus, in the order they appear in the cylinder lifecycle. */
export const CYLINDER_SCAN_MENUS = [
  { value: 'pre-fill', label: 'Terima Kosong' },
  { value: 'filling', label: 'Pengisian' },
  { value: 'post-fill', label: 'QC Pasca Isi' },
  { value: 'do', label: 'Muat Surat Jalan' },
  { value: 'exchange-out', label: 'Tukar Keluar' },
  { value: 'exchange-in', label: 'Tukar Masuk' },
  { value: 'hydrotest', label: 'Hydrotest' },
] as const;

export type CylinderScanMenu = (typeof CYLINDER_SCAN_MENUS)[number]['value'];

export type CylinderScan = {
  id: string;
  barcode_sn: string;
  item_id: string;
  item_name: string;
  gas_type: string;
  ownership_type: CylinderOwnershipType;
  status: CylinderStatus;
  menu: string;
  allowed: boolean;
  reason?: string;
  allowed_menus: string[];
};

/** Human-readable label for a scan menu value, falling back to the raw value. */
export function cylinderScanMenuLabel(menu: string): string {
  return CYLINDER_SCAN_MENUS.find((item) => item.value === menu)?.label ?? menu;
}

const STATUS_LABELS: Record<CylinderStatus, string> = {
  EMPTY: 'Kosong',
  READY_TO_FILL: 'Siap Isi',
  FILLED: 'Terisi',
  READY: 'Siap Pakai',
  IN_TRANSIT: 'Dalam Perjalanan',
  OUTSTANDING: 'Di Pelanggan',
  MAINTENANCE: 'Perawatan',
  LOST: 'Hilang',
  WRITE_OFF: 'Dihapus',
};

const OWNERSHIP_LABELS: Record<CylinderOwnershipType, string> = {
  COMPANY: 'Milik Perusahaan',
  CUSTOMER: 'Milik Pelanggan',
  VENDOR: 'Milik Vendor',
};

export function isCylinderStatus(value: string): value is CylinderStatus {
  return (CYLINDER_STATUSES as readonly string[]).includes(value);
}

/** Human-readable Indonesian label for a cylinder status, falling back to the raw value. */
export function cylinderStatusLabel(status: string): string {
  return isCylinderStatus(status) ? STATUS_LABELS[status] : status;
}

/** Badge colour intent for a cylinder status. */
export function cylinderStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'FILLED':
    case 'READY':
      return 'default';
    case 'EMPTY':
    case 'READY_TO_FILL':
      return 'secondary';
    case 'LOST':
    case 'WRITE_OFF':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function cylinderOwnershipLabel(ownershipType: string): string {
  return OWNERSHIP_LABELS[ownershipType as CylinderOwnershipType] ?? ownershipType;
}

/** ISO timestamp (RFC3339) from the API to a short local date, e.g. "12 Okt 2026". */
export function formatCylinderDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** ISO timestamp (RFC3339) to a short local date + time, e.g. "12 Okt 2026 14:30". */
export function formatCylinderDateTime(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
