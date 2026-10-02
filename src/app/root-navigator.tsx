import { HomeScreen } from '@/app/screens/home-screen';
import { THEME } from '@/shared/utils/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: THEME.card },
        headerTintColor: THEME.foreground,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.mutedForeground,
        tabBarStyle: { backgroundColor: THEME.card, borderTopColor: THEME.border },
      }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
    </Tab.Navigator>
  );
}
