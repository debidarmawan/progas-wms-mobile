import type { CylindersStackParamList } from '@/app/navigation-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { ScreenContainer } from '@/components/templates/screen-container';
import {
  cylinderOwnershipLabel,
  cylinderStatusBadgeVariant,
  cylinderStatusLabel,
  formatCylinderDate,
  formatCylinderDateTime,
} from '@/packages/cylinders/domain/cylinders';
import { useCylinderDetail } from '@/packages/cylinders/presentation/cylinders.hook';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

type CylinderDetailRoute = RouteProp<CylindersStackParamList, 'CylinderDetail'>;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4 py-2">
      <Text variant="muted">{label}</Text>
      <Text className="flex-shrink text-right">{value || '-'}</Text>
    </View>
  );
}

export function CylinderDetailScreen() {
  const route = useRoute<CylinderDetailRoute>();
  const { id } = route.params;
  const { cylinder, history, loading, error, reload } = useCylinderDetail(id);

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator />
          <Text variant="muted">Memuat detail silinder...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error || !cylinder) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center gap-4">
          <Text accessibilityRole="alert" className="text-center text-destructive">
            {error || 'Silinder tidak ditemukan.'}
          </Text>
          <Button variant="outline" onPress={reload}>
            <Text>Coba lagi</Text>
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  const entries = history?.entries ?? [];

  return (
    <ScreenContainer scrollable>
      <Card>
        <CardHeader>
          <View className="flex-row items-center justify-between gap-3">
            <CardTitle numberOfLines={1}>{cylinder.barcode_sn}</CardTitle>
            <Badge variant={cylinderStatusBadgeVariant(cylinder.status)}>
              <Text>{cylinderStatusLabel(cylinder.status)}</Text>
            </Badge>
          </View>
        </CardHeader>
        <CardContent>
          <DetailRow label="Produk" value={cylinder.item_name} />
          <Separator />
          <DetailRow label="Jenis Gas" value={cylinder.gas_type} />
          <Separator />
          <DetailRow label="Kepemilikan" value={cylinderOwnershipLabel(cylinder.ownership_type)} />
          <Separator />
          <DetailRow label="Pemilik" value={cylinder.owner_name || '-'} />
          <Separator />
          <DetailRow
            label="Terakhir Hidrotest"
            value={formatCylinderDate(cylinder.last_hydrotest_date)}
          />
          {!!cylinder.remarks && (
            <>
              <Separator />
              <DetailRow label="Catatan" value={cylinder.remarks} />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Perubahan</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <Text variant="muted">Belum ada riwayat perubahan.</Text>
          ) : (
            entries.map((entry, index) => (
              <View key={entry.id || `${entry.action}-${index}`} className="gap-1 py-3">
                {index > 0 && <Separator className="mb-3" />}
                <View className="flex-row items-center justify-between gap-3">
                  <Text variant="large" className="flex-1" numberOfLines={1}>
                    {entry.action_label}
                  </Text>
                  <Text variant="muted">{formatCylinderDateTime(entry.created_at)}</Text>
                </View>
                {!!entry.user_name && <Text variant="muted">oleh {entry.user_name}</Text>}
                {(entry.changes ?? []).map((change) => (
                  <Text key={change.field} variant="small" className="text-muted-foreground">
                    {change.label}: {change.old || '-'} → {change.new || '-'}
                  </Text>
                ))}
              </View>
            ))
          )}
        </CardContent>
      </Card>
    </ScreenContainer>
  );
}
