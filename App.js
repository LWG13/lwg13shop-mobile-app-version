import Toast from "react-native-toast-message"
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CustomHeader from "./component/customNavigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./component/home";
import Profile from "./component/profile";
import { useDispatch, useSelector, Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./component/ReduxToolkit/authSlice"
import cartReducer from "./component/ReduxToolkit/cartSlice"
import { setCartFromStorage } from "./component/ReduxToolkit/cartSlice";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react"
import { QueryClient, QueryClientProvider  } from "react-query"
import { loadUserFromStorage } from "./component/ReduxToolkit/authSlice"
import MyTabBar from "./component/myTabBar";
import ProductDetail from "./component/product"
import LoginScreen from "./component/login";
import SignupScreen from "./component/signup";
import Cart from "./component/cart"
const queryClient = new QueryClient()
const Tab = createBottomTabNavigator();
const store = configureStore({
  reducer: {
    cart: cartReducer,
  
    auth: authReducer
  }
})
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
      <Tab.Screen name="Cart" component={Cart} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator  >
        <Stack.Screen
          name="home"
          component={BottomTab}
          options={({ navigation }) => ({
            header: () => <CustomHeader navigation={navigation} />,
          })}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{
            headerShown: false, 
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function AuthRoute() {
  const auth = useSelector(state => state.auth)
  return auth._id ? <Route /> : (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{
        headerShown: false,
      }} >
        <Stack.Screen name="Login" component={LoginScreen}/>  
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

 }
function Splash() {
 const dispatch = useDispatch();
const auth = useSelector((state) => state.auth);

useEffect(() => {
  SplashScreen.preventAutoHideAsync();

  const bootstrap = async () => {
    try {
      // Load auth
      dispatch(loadUserFromStorage());

      // Load cart
      const cart = await SecureStore.getItemAsync("cartItem");
      if (cart) {
        dispatch(setCartFromStorage(JSON.parse(cart)));
      }
    } catch (error) {
      console.log("Bootstrap error:", error);
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  bootstrap();
}, []);
  return <AuthRoute />   
  
}

export default function App() {
  return (
     <QueryClientProvider client={queryClient} >
         <Provider store={store}>
      <Splash   />   
           <Toast />
         </Provider>
    </QueryClientProvider> 
 
  )
}