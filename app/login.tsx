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
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isLoggingIn,
    setIsLoggingIn,
  ] = useState(false);

  const getFriendlyErrorMessage = (
    error: any
  ): string => {
    const code =
      String(
        error?.code ?? ""
      );

    if (
      code.includes(
        "invalid-credential"
      ) ||
      code.includes(
        "wrong-password"
      ) ||
      code.includes(
        "user-not-found"
      )
    ) {
      return "The email or password is incorrect.";
    }

    if (
      code.includes(
        "invalid-email"
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      code.includes(
        "too-many-requests"
      )
    ) {
      return "Too many login attempts were made. Please try again later.";
    }

    if (
      code.includes(
        "network-request-failed"
      )
    ) {
      return "Unable to connect. Please check your internet connection and try again.";
    }

    return "LifeGuide could not log you in. Please try again.";
  };

  const handleLogin =
    async () => {
      const cleanedEmail =
        email
          .trim()
          .toLowerCase();

      if (
        !cleanedEmail ||
        !password
      ) {
        Alert.alert(
          "Missing Information",
          "Please enter your email and password."
        );

        return;
      }

      if (isLoggingIn) {
        return;
      }

      try {
        setIsLoggingIn(true);

        Keyboard.dismiss();

        await login(
          cleanedEmail,
          password
        );

        router.replace(
          "/(tabs)"
        );
      } catch (error: any) {
        console.log(
          "Login error:",
          error
        );

        Alert.alert(
          "Login Failed",
          getFriendlyErrorMessage(
            error
          )
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
          onPress={
            Keyboard.dismiss
          }
          accessible={false}
        >
          <ScrollView
            style={
              styles.container
            }
            contentContainerStyle={
              styles.content
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={styles.side}
            >
              <Text
                style={
                  styles.heading
                }
              >
                Welcome Back.
              </Text>

              <Text
                style={styles.verse}
              >
                "Your word is a lamp for
                my feet, a light on my
                path."
              </Text>

              <Text
                style={
                  styles.reference
                }
              >
                Psalm 119:105
              </Text>
            </View>

            <View
              style={
                styles.wrapper
              }
            >
              <Text
                style={styles.title}
              >
                Login
              </Text>

              <View
                style={
                  styles.inputBox
                }
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
                  onChangeText={
                    setEmail
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  editable={
                    !isLoggingIn
                  }
                />
              </View>

              <View
                style={
                  styles.inputBox
                }
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    editable={
                      !isLoggingIn
                    }
                    onSubmitEditing={
                      handleLogin
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
                activeOpacity={0.8}
                disabled={
                  isLoggingIn
                }
                onPress={
                  handleLogin
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {isLoggingIn
                    ? "Logging In..."
                    : "Login"}
                </Text>
              </TouchableOpacity>

              <View
                style={
                  styles.loginLinksContainer
                }
              >
                <View
                  style={
                    styles.bottomRow
                  }
                >
                  <Text
                    style={
                      styles.bottomText
                    }
                  >
                    Don't have an
                    account?{" "}
                  </Text>

                  <TouchableOpacity
                    disabled={
                      isLoggingIn
                    }
                    onPress={() =>
                      router.push(
                        "/signup"
                      )
                    }
                  >
                    <Text
                      style={
                        styles.signupText
                      }
                    >
                      Create one
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={
                    styles.forgotPasswordButton
                  }
                  disabled={
                    isLoggingIn
                  }
                  onPress={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                >
                  <Text
                    style={
                      styles.forgotPasswordText
                    }
                  >
                    Forgot Password?
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

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,

      backgroundColor:
        "#6e473b",
    },

    keyboardView: {
      flex: 1,

      backgroundColor:
        "#6e473b",
    },

    container: {
      flex: 1,

      backgroundColor:
        "#6e473b",
    },

    content: {
      flexGrow: 1,

      paddingHorizontal: 25,

      paddingTop: 35,

      paddingBottom: 40,

      justifyContent: "center",
    },

    side: {
      marginBottom: 30,
    },

    heading: {
      fontSize: 34,

      fontWeight: "bold",

      color: "#dac69b",

      marginBottom: 12,
    },

    verse: {
      fontSize: 18,

      color: "#ffffff",

      lineHeight: 28,
    },

    reference: {
      marginTop: 10,

      color: "#f5e6c5",

      fontWeight: "bold",

      fontStyle: "italic",

      fontSize: 16,
    },

    wrapper: {
      backgroundColor:
        "rgba(255,255,255,0.08)",

      paddingHorizontal: 22,

      paddingVertical: 26,

      borderRadius: 20,
    },

    title: {
      textAlign: "center",

      fontSize: 32,

      color: "#e1d4c2",

      fontWeight: "bold",

      marginBottom: 22,
    },

    inputBox: {
      marginBottom: 16,
    },

    label: {
      color: "#e1d4c2",

      marginBottom: 7,

      fontSize: 15,
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
      width: 48,

      height: 50,

      justifyContent:
        "center",

      alignItems: "center",
    },

    button: {
      backgroundColor:
        "#e1d4c2",

      minHeight: 50,

      justifyContent:
        "center",

      alignItems: "center",

      borderRadius: 12,

      marginTop: 5,

      paddingHorizontal: 10,
    },

    disabledButton: {
      opacity: 0.65,
    },

    buttonText: {
      color: "#6d5530",

      fontWeight: "bold",

      fontSize: 18,
    },

    loginLinksContainer: {
      width: "100%",

      alignItems: "center",

      marginTop: 20,
    },

    bottomRow: {
      width: "100%",

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      flexWrap: "wrap",
    },

    bottomText: {
      color: "#e1d4c2",

      textAlign: "center",
    },

    signupText: {
      color: "#e1d4c2",

      fontWeight: "bold",
    },

    forgotPasswordButton: {
      marginTop: 12,

      paddingVertical: 8,

      paddingHorizontal: 12,

      alignItems: "center",

      justifyContent:
        "center",
    },

    forgotPasswordText: {
      color: "#e1d4c2",

      fontSize: 15,

      fontWeight: "600",

      textAlign: "center",

      textDecorationLine:
        "underline",
    },
  });