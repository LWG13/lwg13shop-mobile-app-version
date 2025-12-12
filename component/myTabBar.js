import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useState } from "react"
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

export default function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = route.name;

        const onPress = () => {
          
          if(route.name === "Profile" ) navigation.navigate(route.name, { userId: "6768f2db3615369ace075e60"});
          else {
   navigation.navigate(route.name)
          }
          };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.activeTab]}
          >

            {label ==="Profile" ? <AntDesign name="user" size={40} color="#ffecec" /> :  
<Feather name="home" size={40} color="#ffffff" />}
            <Text style={{color: "white"}}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#BF77F6",
    color: "white",
    paddingVertical: 10,
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  tabButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center"
  },
  activeTab: {
    backgroundColor: "pink",
  },
});