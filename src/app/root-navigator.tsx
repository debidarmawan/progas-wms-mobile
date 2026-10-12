import type { CylindersStackParamList } from '@/app/navigation-types';
import { CylinderDetailScreen } from '@/app/screens/cylinder-detail-screen';
import { CylindersScreen } from '@/app/screens/cylinders-screen';
import { HomeScreen } from '@/app/screens/home-screen';
import { THEME } from '@/shared/utils/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const CylindersStack = createNativeStackNavigator<CylindersStackParamList>();

function CylindersNavigator() {
  return (
    <CylindersStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: THEME.card },
        headerTintColor: THEME.foreground,
      }}>
      <CylindersStack.Screen
        name="CylindersList"
        component={CylindersScreen}
        options={{ title: 'Silinder' }}
      />
      <CylindersStack.Screen
        name="CylinderDetail"
        component={CylinderDetailScreen}
        options={({ route }) => ({ title: route.params.barcode })}
      />
    </CylindersStack.Navigator>
  );
}

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
      <Tab.Screen
        name="Cylinders"
        component={CylindersNavigator}
        options={{ title: 'Silinder', headerShown: false }}
      />
    </Tab.Navigator>
  );
}
