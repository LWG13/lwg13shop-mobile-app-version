import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./ReduxToolkit/authSlice";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { control, handleSubmit } = useForm();

  useEffect(() => {
    if (auth._id) {
      navigation.replace("Home");
    }
  }, [auth._id]);

  const onSubmit = () => {
    dispatch(loginUser(user));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Login</Text>

        {/* EMAIL */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    onChange(text);
                    setUser({ ...user, email: text });
                  }}
                />
                <Feather name="user" size={18} style={styles.icon} />
              </>
            )}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <>
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  onChangeText={(text) => {
                    onChange(text);
                    setUser({ ...user, password: text });
                  }}
                />
                <Feather name="lock" size={18} style={styles.icon} />
              </>
            )}
          />
        </View>

        {/* ERROR */}
        {auth.loginStatus === "reject" && (
          <Text style={styles.error}>{auth.loginError}</Text>
        )}

        {/* FORGOT PASSWORD */}
        <Text
          style={styles.forgot}
          onPress={() => navigation.navigate("Email")}
        >
          Forgot password?
        </Text>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={auth.loginStatus === "pending"}
        >
          <Text style={styles.buttonText}>
            {auth.loginStatus === "pending" ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* REGISTER */}
        <View style={styles.register}>
          <Text style={{color: "black"}}>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Signup")}
            >
              Register
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
    const styles = StyleSheet.create({
      container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      },
      wrapper: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 30,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
      title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "black"
      },
      inputBox: {
        position: "relative",
        marginVertical: 10,
      },
      input: {
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 5,
        height: 45,
        paddingLeft: 12,
        paddingRight: 40,
        color: "black"
      },
      icon: {
        position: "absolute",
        right: 12,
        top: 12,
      },
      error: {
        color: "red",
        marginTop: 5,
        fontSize: 13,
      },
      forgot: {
        textAlign: "right",
        marginVertical: 10,
        fontSize: 14,
        color: "black"
      },
      button: {
        backgroundColor: "#BF77F6",
        height: 45,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
      },
      register: {
        marginTop: 20,
        alignItems: "center",
      },
      link: {
        fontWeight: "bold",
        color: "#000",
      },
    });