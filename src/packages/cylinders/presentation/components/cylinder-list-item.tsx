import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  cylinderStatusBadgeVariant,
  cylinderStatusLabel,
  type Cylinder,
} from '@/packages/cylinders/domain/cylinders';
import { ChevronRight } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

type CylinderListItemProps = {
  cylinder: Cylinder;
  onPress: (cylinder: Cylinder) => void;
};

/** A single cylinder row in the list, showing barcode, product, and status. */
export function CylinderListItem({ cylinder, onPress }: CylinderListItemProps) {
  const subtitle = [cylinder.item_name, cylinder.gas_type].filter(Boolean).join(' • ');

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(cylinder)}>
      <Card>
        <CardContent className="flex-row items-center justify-between gap-3 p-4">
          <View className="flex-1 gap-1">
            <Text variant="large" numberOfLines={1}>
              {cylinder.barcode_sn}
            </Text>
            <Text variant="muted" numberOfLines={1}>
              {subtitle || 'Tanpa produk'}
            </Text>
            <Badge variant={cylinderStatusBadgeVariant(cylinder.status)} className="mt-1 self-start">
              <Text>{cylinderStatusLabel(cylinder.status)}</Text>
            </Badge>
          </View>
          <Icon as={ChevronRight} className="text-muted-foreground" size={20} />
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
}
