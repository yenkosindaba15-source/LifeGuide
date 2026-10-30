import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  login,
} from "../src/services/authService";

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isLoggingIn,
    setIsLoggingIn,
  ] = useState(false);

  const handleLogin = async () => {
    const cleanedEmail =
      email.trim();

    if (
      !cleanedEmail ||
      !password.trim()
    ) {
      Alert.alert(
        "Missing Information",
        "Enter your email address and password."
      );

      return;
    }

    if (isLoggingIn) {
      return;
    }

    try {
      setIsLoggingIn(true);

      await login(
        cleanedEmail,
        password
      );

      Alert.alert(
        "Success",
        "Logged in successfully!"
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.message ||
          "Unable to log in."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={[
        "top",
        "left",
        "right",
        "bottom",
      ]}
    >
      <KeyboardAvoidingView
        style={
          styles.keyboardView
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={
              styles.content
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.side}>
              <Text
                style={styles.heading}
              >
                Welcome Back.
              </Text>

              <Text
                style={styles.verse}
              >
                "In the beginning was the
                Word, and the Word was with
                God, and the Word was God."
              </Text>

              <Text
                style={
                  styles.reference
                }
              >
                John 1:1
              </Text>
            </View>

            <View style={styles.wrapper}>
              <Text style={styles.title}>
                Login
              </Text>

              <View
                style={styles.inputBox}
              >
                <Text
                  style={styles.label}
                >
                  Email
                </Text>

                <TextInput
                  placeholder="you@email.com"
                  placeholderTextColor="#cccccc"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  editable={!isLoggingIn}
                />
              </View>

              <View
                style={styles.inputBox}
              >
                <Text
                  style={styles.label}
                >
                  Password
                </Text>

                <View
                  style={
                    styles.passwordContainer
                  }
                >
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#cccccc"
                    style={
                      styles.passwordInput
                    }
                    value={password}
                    onChangeText={
                      setPassword
                    }
                    secureTextEntry={
                      !showPassword
                    }
                    returnKeyType="done"
                    onSubmitEditing={
                      handleLogin
                    }
                    editable={
                      !isLoggingIn
                    }
                  />

                  <TouchableOpacity
                    style={
                      styles.eyeButton
                    }
                    disabled={
                      isLoggingIn
                    }
                    onPress={() =>
                      setShowPassword(
                        (current) =>
                          !current
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
                style={[
                  styles.button,

                  isLoggingIn &&
                    styles.disabledButton,
                ]}
                disabled={isLoggingIn}
                onPress={handleLogin}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {isLoggingIn
                    ? "Logging in..."
                    : "Login"}
                </Text>
              </TouchableOpacity>

              <View
                style={styles.bottomRow}
              >
                <Text
                  style={
                    styles.bottomText
                  }
                >
                  Don't have an account?{" "}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      "/signup"
                    )
                  }
                >
                  <Text
                    style={styles.link}
                  >
                    Create one
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#6e473b",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#6e473b",
  },

  content: {
    flexGrow: 1,

    justifyContent: "center",

    paddingHorizontal: 25,

    paddingTop: 25,

    paddingBottom: 35,
  },

  side: {
    marginBottom: 30,
  },

  heading: {
    fontSize: 36,

    fontWeight: "bold",

    color: "#dac69b",

    marginBottom: 10,
  },

  verse: {
    fontSize: 18,

    color: "#ffffff",

    lineHeight: 29,
  },

  reference: {
    marginTop: 12,

    color: "#F5E6C5",

    fontWeight: "bold",

    fontStyle: "italic",

    fontSize: 17,
  },

  wrapper: {
    backgroundColor:
      "rgba(255,255,255,0.08)",

    padding: 24,

    borderRadius: 20,
  },

  title: {
    textAlign: "center",

    fontSize: 34,

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

    color: "#ffffff",

    fontSize: 16,
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

    color: "#ffffff",

    fontSize: 16,
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

  disabledButton: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#6d5530",

    fontSize: 18,

    fontWeight: "bold",
  },

  bottomRow: {
    flexDirection: "row",

    justifyContent: "center",

    flexWrap: "wrap",

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