import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

import LoginScreen from './screens/Auth/LoginScreen';
import SignupScreen from './screens/Auth/SignupScreen';
import AllExpenses from './screens/Expenses/AllExpenses';
import ManageExpense from './screens/Expenses/ManageExpense';
import RecentExpenses from './screens/Expenses/RecentExpenses';
import { GlobalStyles } from './constants/styles';

import ExpensesContextProvider from './store/expenses-context';
import AuthContextProvider, { AuthContext } from './store/auth-context';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
        }}
      >
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Signup' component={SignupScreen} />
        <Stack.Screen name='ExpensesStack' component={ExpensesStack} options={{
          headerShown: false,
        }} />
      </Stack.Navigator>
    );
}

function ExpensesOverviewStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Tab.Navigator 
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerLeftLabelVisible: true,
        headerRight: ({tintColor}) => (
          <Ionicons 
            style={{ paddingRight: 15}} 
            name='add' 
            size={24} 
            color={tintColor} 
            onPress={() => {
              navigation.navigate('ManageExpense');
            }} 
          />
        ),
        headerLeft: ({tintColor}) => (
          <Ionicons 
            style={{ paddingLeft: 15}} 
            name='exit'
            size={24} 
            color={tintColor} 
            onPress={() => {
              authCtx.logout();
            }}
          />
        ),
      })}
    >
      <Tab.Screen 
        name='RecentExpenses' 
        component={RecentExpenses} 
        options={{
          title: 'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='hourglass' size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name='AllExpenses' 
        component={AllExpenses}
        options={{
          title: 'All Expenses',
          tabBarLabel: 'All Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='calendar' size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

function ExpensesStack() {
  return (
    <ExpensesContextProvider>
      <Stack.Navigator 
        screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
      }}
      >
        <Stack.Screen 
          name='ExpensesOverviewStack' 
          component={ExpensesOverviewStack} 
          options={{
            headerShown: false
        }} 
        />
        <Stack.Screen 
          name='ManageExpense' 
          component={ManageExpense} 
          options={{
            presentation: 'modal',
        }}
        />
      </Stack.Navigator>
    </ExpensesContextProvider>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <ExpensesStack />}
      </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('idToken');
      if (storedToken) {
        authCtx.authenticate(storedToken);
      }
      setIsTryingLogin(false);
    }
    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
