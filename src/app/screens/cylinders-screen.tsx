import { useAuth } from '@/packages/auth/presentation/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { ScreenContainer } from '@/components/templates/screen-container';
import { Text } from '@/components/ui/text';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';

interface Cylinder {
  id: string;
  barcode: string;
  status: string;
}

const MOCK_CYLINDERS: Cylinder[] = [
  { id: '1', barcode: 'BAR001', status: 'FILLED' },
  { id: '2', barcode: 'BAR002', status: 'EMPTY' },
  { id: '3', barcode: 'BAR003', status: 'READY' },
];

export function CylindersScreen() {
  const { user } = useAuth();

  const renderItem = ({ item }: { item: Cylinder }) => (
    <TouchableOpacity
      onPress={() => Alert.alert('Silinder ' + item.barcode, 'Status: ' + item.status)}
      className='p-4 mb-2'
    >
      <Card>
        <CardContent className='flex-row items-center justify-between'>
          <View className='flex-1'>
            <Text variant='h4'>Barcode: {item.barcode}</Text>
            <Text className={item.status === 'FILLED' ? 'text-green-600' : item.status === 'EMPTY' ? 'text-gray-600' : 'text-yellow-600'}>
              {item.status}
            </Text>
          </View>
          <TouchableOpacity className='ml-4'>
            <Text>▶</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View className='flex-row justify-between items-center mb-4'>
        <View>
          <Text variant='h3'>Manajemen Silinder</Text>
          <Text variant='small' className='text-muted-foreground'>
            Login sebagai: {user?.name || user?.email}
          </Text>
        </View>
        <Text className='text-sm'>🔄</Text>
      </View>

      <FlatList
        data={MOCK_CYLINDERS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </ScreenContainer>
  );
}