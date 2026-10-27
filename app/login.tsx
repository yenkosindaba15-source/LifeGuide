import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { login } from "../src/services/authService";

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);

      Alert.alert(
        "Success",
        "Logged in successfully!"
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <Text style={styles.heading}>
          Welcome Back.
        </Text>

        <Text style={styles.verse}>
          "In the beginning was the Word,
          and the Word was with God, and
          the Word was God."
        </Text>

        <Text style={styles.reference}>
          John 1:1
        </Text>
      </View>

      <View style={styles.wrapper}>
        <Text style={styles.title}>
          Login
        </Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            placeholder="you@email.com"
            placeholderTextColor="#cccccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>
            Password
          </Text>

          <View
            style={styles.passwordContainer}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="#cccccc"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={
                !showPassword
              }
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword(
                  (current) => !current
                )
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={23}
                color="#e1d4c2"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>
            Don't have an account?{" "}
          </Text>

          <Link
            href="/signup"
            style={styles.link}
          >
            Create one
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#6e473b",
  },

  side: {
    marginBottom: 40,
  },

  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#dac69b",
    marginBottom: 10,
  },

  verse: {
    fontSize: 20,
    color: "white",
    lineHeight: 32,
  },

  reference: {
    marginTop: 15,
    color: "#F5E6C5",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 18,
  },

  wrapper: {
    backgroundColor:
      "rgba(255,255,255,0.08)",
    padding: 25,
    borderRadius: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 36,
    color: "#e1d4c2",
    fontWeight: "bold",
    marginBottom: 20,
  },

  inputBox: {
    marginBottom: 18,
  },

  label: {
    color: "#e1d4c2",
    marginBottom: 8,
    fontSize: 16,
  },

  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    paddingHorizontal: 15,
    color: "white",
  },

  passwordContainer: {
    height: 50,
    borderRadius: 12,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 15,
    paddingRight: 5,
    color: "white",
  },

  eyeButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#e1d4c2",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#6d5530",
    fontSize: 18,
    fontWeight: "bold",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  bottomText: {
    color: "#e1d4c2",
  },

  link: {
    color: "#e1d4c2",
    fontWeight: "bold",
  },
});