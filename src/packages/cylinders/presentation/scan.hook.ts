import {
  type CylinderScan,
  type CylinderScanMenu,
} from '@/packages/cylinders/domain/cylinders';
import { scanCylinder } from '@/packages/cylinders/usecases/cylinders.usecase';
import * as React from 'react';

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export type CylinderScanState = {
  menu: CylinderScanMenu;
  setMenu: (menu: CylinderScanMenu) => void;
  result: CylinderScan | null;
  error: string | null;
  scanning: boolean;
  scan: (barcode: string) => void;
  reset: () => void;
};

/** Resolves scanned barcodes against the backend; one request in flight at a time. */
export function useCylinderScan(initialMenu: CylinderScanMenu = 'pre-fill'): CylinderScanState {
  const [menu, setMenuState] = React.useState<CylinderScanMenu>(initialMenu);
  const [result, setResult] = React.useState<CylinderScan | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const busyRef = React.useRef(false);

  const scan = React.useCallback(
    (barcode: string) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setScanning(true);
      setError(null);

      scanCylinder(barcode, menu)
        .then(setResult)
        .catch((scanError: unknown) =>
          setError(messageFrom(scanError, 'Gagal memindai tabung.'))
        )
        .finally(() => {
          busyRef.current = false;
          setScanning(false);
        });
    },
    [menu]
  );

  const reset = React.useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const setMenu = React.useCallback((next: CylinderScanMenu) => {
    setMenuState(next);
    setResult(null);
    setError(null);
  }, []);

  return { menu, setMenu, result, error, scanning, scan, reset };
}
