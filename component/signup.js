import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./ReduxToolkit/authSlice";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (auth._id) {
      navigation.replace("Home");
    }
  }, [auth._id]);

  const onSubmit = () => {
    dispatch(registerUser(user));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Sign Up</Text>

        {/* USERNAME */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            render={({ field: { onChange } }) => (
              <TextInput
                placeholder="Username"
                style={styles.input}
                onChangeText={(text) => {
                  onChange(text);
                  setUser({ ...user, username: text });
                }}
              />
            )}
          />
        </View>
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

        {/* EMAIL */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                onChangeText={(text) => {
                  onChange(text);
                  setUser({ ...user, email: text });
                }}
              />
            )}
          />
        </View>
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        {/* PASSWORD */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                onChangeText={(text) => {
                  onChange(text);
                  setUser({ ...user, password: text });
                }}
              />
            )}
          />
        </View>
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        {/* PHONE */}
        <View style={styles.inputBox}>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "Phone number is required",
              minLength: {
                value: 10,
                message: "Phone number must be 10 digits",
              },
              pattern: {
                value: /^[0-9]+$/,
                message: "Invalid phone number",
              },
            }}
            render={({ field: { onChange } }) => (
              <TextInput
                placeholder="Phone number"
                style={styles.input}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  onChange(text);
                  setUser({ ...user, phoneNumber: text });
                }}
              />
            )}
          />
        </View>
        {errors.phoneNumber && (
          <Text style={styles.error}>{errors.phoneNumber.message}</Text>
        )}

        {auth.registerStatus === "reject" && (
          <Text style={styles.error}>{auth.registerError}</Text>
        )}

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={auth.registerStatus === "pending"}
        >
          <Text style={styles.buttonText}>
            {auth.registerStatus === "pending" ? "Sending..." : "Send"}
          </Text>
        </TouchableOpacity>

        {/* LOGIN LINK */}
        <View style={styles.footer}>
          <Text style={{color: "black"}}>
            Already have account?{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("Login")}
            >
              Log In
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
    paddingVertical: 40,
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
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "black"
  },
  inputBox: {
    marginTop: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 10,
    color: "black"
  },
  button: {
    backgroundColor: "#BF77F6",
    height: 45,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontWeight: "bold",
    color: "#000",
  },
});