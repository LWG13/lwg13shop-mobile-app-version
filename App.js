
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CustomHeader from "./component/customNavigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./component/home";
import Profile from "./component/profile";

import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react"
import { QueryClient, QueryClientProvider  } from "react-query"
import MyTabBar from "./component/myTabBar";
import ProductDetail from "./component/product"
const queryClient = new QueryClient()
const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // tắt header của tab
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={BottomTab}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} />,
          })}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetail} screenOptions={{
            headerShown: false, 
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  useEffect(() => {
    async function prepare() {
      // Giả lập load API
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Khi đã load xong → ẩn splash
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);
  return (
    <QueryClientProvider client={queryClient} >
      <Route />    
    </QueryClientProvider> 
  )
}
