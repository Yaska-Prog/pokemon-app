import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/Context';
import { HomePage } from './src/page/HomePage';
import { DetailPage } from './src/page/DetailPage';
import { ComparePage } from './src/page/ComparePage';
import { BottomNavigation } from './src/components/BottomNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/store'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomePage"
      component={HomePage}
      options={{
        title: 'PokeApp - Christian Yaska'
      }}
    />
    <Stack.Screen
      name="DetailPage"
      component={DetailPage}
      options={{
        title: 'Pokémon Detail',
        headerBackTitle: 'Back', 
      }}
    />
  </Stack.Navigator>
);

export default function App() {
  return (
    <AppProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            tabBar={(props) => {
              const currentRoute = props.navigation.getState().routes[0].state?.routes.slice(-1)[0];
              if (currentRoute?.name === 'DetailPage') {
                return null; //hide bot navbar
              }
              return <BottomNavigation {...props} />;
            }}
            initialRouteName="Home"
          >
            <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
            <Tab.Screen name="Compare" component={ComparePage} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    </AppProvider>
  );
}