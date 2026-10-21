import { ScreenContainer } from '@/components/templates/screen-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import {
  CYLINDER_SCAN_MENUS,
  cylinderScanMenuLabel,
  cylinderStatusBadgeVariant,
  cylinderStatusLabel,
} from '@/packages/cylinders/domain/cylinders';
import { useCylinderScan } from '@/packages/cylinders/presentation/scan.hook';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { menu, setMenu, result, error, scanning, scan, reset } = useCylinderScan();

  return (
    <ScreenContainer>
      <View className="gap-1">
        <Text variant="h3">Scan Tabung</Text>
        <Text variant="small" className="text-muted-foreground">
          Pilih menu, lalu arahkan kamera ke QR/barcode label tabung.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        className="max-h-10 flex-grow-0">
        {CYLINDER_SCAN_MENUS.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={item.value === menu ? 'default' : 'outline'}
            onPress={() => setMenu(item.value)}>
            <Text>{item.label}</Text>
          </Button>
        ))}
      </ScrollView>

      {result ? (
        <ScrollView contentContainerClassName="gap-3 pb-4">
          <Card>
            <CardHeader>
              <View className="flex-row items-center justify-between gap-2">
                <CardTitle className="flex-1 font-mono">{result.barcode_sn}</CardTitle>
                <Badge variant={result.allowed ? 'default' : 'destructive'}>
                  <Text>{result.allowed ? 'BOLEH' : 'DITOLAK'}</Text>
                </Badge>
              </View>
              <CardDescription>
                {[result.item_name, result.gas_type].filter(Boolean).join(' • ') ||
                  'Tanpa produk'}
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <View className="flex-row flex-wrap items-center gap-2">
                <Badge variant={cylinderStatusBadgeVariant(result.status)}>
                  <Text>{cylinderStatusLabel(result.status)}</Text>
                </Badge>
                <Badge variant="outline">
                  <Text>{cylinderScanMenuLabel(result.menu)}</Text>
                </Badge>
              </View>

              {result.reason ? (
                <Text accessibilityRole="alert" className="text-destructive">
                  {result.reason}
                </Text>
              ) : null}

              <View className="gap-1">
                <Text variant="small" className="font-medium">
                  Menu yang diizinkan untuk status ini
                </Text>
                <Text variant="muted">
                  {result.allowed_menus.length > 0
                    ? result.allowed_menus.map(cylinderScanMenuLabel).join(', ')
                    : 'Tidak ada'}
                </Text>
              </View>

              <Button variant="outline" onPress={reset}>
                <Text>Scan lagi</Text>
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      ) : (
        <View className="flex-1 overflow-hidden rounded-2xl bg-black">
          {!permission ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : permission.granted ? (
            <>
              <CameraView
                className="flex-1"
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr', 'code128', 'code39'] }}
                onBarcodeScanned={scanning ? undefined : ({ data }) => scan(data)}
              />
              <View className="absolute bottom-4 left-0 right-0 items-center">
                <View className="rounded-full bg-black/60 px-4 py-2">
                  <Text className="text-white">
                    {scanning ? 'Memeriksa...' : 'Arahkan ke QR label'}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View className="flex-1 items-center justify-center gap-4 p-6">
              <Text className="text-center text-white">
                Izin kamera dibutuhkan untuk memindai label tabung.
              </Text>
              <Button onPress={() => void requestPermission()}>
                <Text>Izinkan Kamera</Text>
              </Button>
            </View>
          )}
        </View>
      )}

      {error ? (
        <Text accessibilityRole="alert" className="text-center text-destructive">
          {error}
        </Text>
      ) : null}
    </ScreenContainer>
  );
}
