import type { CylindersStackParamList } from '@/app/navigation-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { ScreenContainer } from '@/components/templates/screen-container';
import { useAuth } from '@/packages/auth/presentation/auth-context';
import { CylinderListItem } from '@/packages/cylinders/presentation/components/cylinder-list-item';
import { useCylinders } from '@/packages/cylinders/presentation/cylinders.hook';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';

type CylindersNavigation = NativeStackNavigationProp<CylindersStackParamList, 'CylindersList'>;

export function CylindersScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<CylindersNavigation>();
  const {
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
  } = useCylinders();

  const showInitialLoading = loading && items.length === 0;
  const showBlockingError = !!error && items.length === 0;

  return (
    <ScreenContainer>
      <View className="gap-1">
        <Text variant="h3">Manajemen Silinder</Text>
        <Text variant="small" className="text-muted-foreground">
          Login sebagai: {user?.name || user?.email}
          {meta ? ` • ${meta.total_items} tabung` : ''}
        </Text>
      </View>

      <Input
        value={search}
        onChangeText={setSearch}
        placeholder="Cari barcode, produk, atau status"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {showInitialLoading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator />
          <Text variant="muted">Memuat silinder...</Text>
        </View>
      ) : showBlockingError ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text accessibilityRole="alert" className="text-center text-destructive">
            {error}
          </Text>
          <Button variant="outline" onPress={reload}>
            <Text>Coba lagi</Text>
          </Button>
        </View>
      ) : (
        <FlatList
          className="flex-1"
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CylinderListItem
              cylinder={item}
              onPress={(cylinder) =>
                navigation.navigate('CylinderDetail', {
                  id: cylinder.id,
                  barcode: cylinder.barcode_sn,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerClassName={items.length === 0 ? 'flex-grow justify-center' : 'pb-4'}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View className="items-center gap-2 px-6">
              <Text variant="muted" className="text-center">
                Tidak ada silinder ditemukan.
              </Text>
              {!!error && (
                <Text accessibilityRole="alert" className="text-center text-destructive">
                  {error}
                </Text>
              )}
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : !hasMore && items.length > 0 ? (
              <Text variant="muted" className="py-4 text-center">
                Semua data sudah dimuat.
              </Text>
            ) : null
          }
        />
      )}
    </ScreenContainer>
  );
}
