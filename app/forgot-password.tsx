import {
    router,
} from "expo-router";

import {
    sendPasswordResetEmail,
} from "firebase/auth";

import {
    useState,
} from "react";

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
    auth,
} from "../src/services/firebase";

export default function ForgotPassword() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    sending,
    setSending,
  ] = useState(false);

  const handleResetPassword =
    async () => {
      const cleanedEmail =
        email.trim().toLowerCase();

      if (!cleanedEmail) {
        Alert.alert(
          "Email Required",
          "Enter the email address associated with your LifeGuide account."
        );

        return;
      }

      if (sending) {
        return;
      }

      try {
        setSending(true);

        Keyboard.dismiss();

        await sendPasswordResetEmail(
          auth,
          cleanedEmail
        );

        Alert.alert(
          "Check Your Email",
          "If a LifeGuide account exists for this email address, password reset instructions have been sent.",
          [
            {
              text: "OK",

              onPress: () =>
                router.replace(
                  "/login"
                ),
            },
          ]
        );
      } catch (error: any) {
        console.log(
          "Password reset error:",
          error
        );

        const code =
          String(
            error?.code ?? ""
          );

        if (
          code.includes(
            "invalid-email"
          )
        ) {
          Alert.alert(
            "Invalid Email",
            "Enter a valid email address."
          );

          return;
        }

        if (
          code.includes(
            "too-many-requests"
          )
        ) {
          Alert.alert(
            "Too Many Attempts",
            "Too many password reset requests were made. Please try again later."
          );

          return;
        }

        if (
          code.includes(
            "network-request-failed"
          )
        ) {
          Alert.alert(
            "Connection Error",
            "Check your internet connection and try again."
          );

          return;
        }

        Alert.alert(
          "Unable to Send Reset Email",
          "LifeGuide could not send the password reset request. Please try again."
        );
      } finally {
        setSending(false);
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "left",
        "right",
        "bottom",
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
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
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.content
            }
          >
            <View
              style={styles.header}
            >
              <TouchableOpacity
                style={
                  styles.backButton
                }
                disabled={sending}
                onPress={() =>
                  router.back()
                }
              >
                <Text
                  style={
                    styles.backText
                  }
                >
                  ‹
                </Text>
              </TouchableOpacity>

              <Text
                style={
                  styles.headerTitle
                }
              >
                Forgot Password
              </Text>

              <View
                style={
                  styles.headerSpace
                }
              />
            </View>

            <View
              style={
                styles.mainContent
              }
            >
              <View
                style={
                  styles.iconCircle
                }
              >
                <Text
                  style={
                    styles.iconText
                  }
                >
                  ?
                </Text>
              </View>

              <Text
                style={styles.title}
              >
                Reset your password
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                Enter the email address
                associated with your
                LifeGuide account. We'll
                send password reset
                instructions to that email
                address.
              </Text>

              <View
                style={
                  styles.formContainer
                }
              >
                <Text
                  style={
                    styles.label
                  }
                >
                  Email
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="you@email.com"
                  placeholderTextColor="#8c7665"
                  value={email}
                  onChangeText={
                    setEmail
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="done"
                  editable={!sending}
                  onSubmitEditing={
                    handleResetPassword
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.button,

                    sending &&
                      styles.disabledButton,
                  ]}
                  disabled={sending}
                  activeOpacity={0.8}
                  onPress={
                    handleResetPassword
                  }
                >
                  <Text
                    style={
                      styles.buttonText
                    }
                  >
                    {sending
                      ? "Sending..."
                      : "Send Reset Email"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.returnButton
                  }
                  disabled={sending}
                  onPress={() =>
                    router.replace(
                      "/login"
                    )
                  }
                >
                  <Text
                    style={
                      styles.returnText
                    }
                  >
                    Return to Login
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
    container: {
      flex: 1,

      backgroundColor:
        "#e1d4c2",
    },

    keyboardView: {
      flex: 1,
    },

    content: {
      flexGrow: 1,

      paddingHorizontal: 20,

      paddingBottom: 40,
    },

    header: {
      minHeight: 80,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    backButton: {
      width: 45,
      height: 50,

      justifyContent:
        "center",

      alignItems: "center",
    },

    backText: {
      fontSize: 55,

      color: "#6e473b",

      lineHeight: 45,
    },

    headerTitle: {
      flex: 1,

      fontSize: 27,

      fontWeight: "600",

      color: "#291c0e",

      textAlign: "center",
    },

    headerSpace: {
      width: 45,
    },

    mainContent: {
      flex: 1,

      justifyContent:
        "center",

      paddingBottom: 70,
    },

    iconCircle: {
      width: 82,
      height: 82,

      borderRadius: 41,

      backgroundColor:
        "#f8f4ef",

      borderWidth: 2,

      borderColor:
        "#6e473b",

      justifyContent:
        "center",

      alignItems: "center",

      alignSelf: "center",

      marginBottom: 22,
    },

    iconText: {
      color: "#6e473b",

      fontSize: 42,

      fontWeight: "bold",
    },

    title: {
      color: "#291c0e",

      fontSize: 28,

      fontWeight: "bold",

      textAlign: "center",

      marginBottom: 14,
    },

    description: {
      color: "#6e473b",

      fontSize: 17,

      lineHeight: 27,

      textAlign: "center",

      marginBottom: 30,

      paddingHorizontal: 10,
    },

    formContainer: {
      width: "100%",
    },

    label: {
      color: "#291c0e",

      fontSize: 16,

      fontWeight: "600",

      marginBottom: 8,
    },

    input: {
      minHeight: 54,

      backgroundColor:
        "#ffffff",

      borderWidth: 1,

      borderColor:
        "#beb5a9",

      borderRadius: 12,

      paddingHorizontal: 15,

      color: "#291c0e",

      fontSize: 16,

      marginBottom: 20,
    },

    button: {
      minHeight: 52,

      backgroundColor:
        "#6e473b",

      borderRadius: 14,

      justifyContent:
        "center",

      alignItems: "center",

      paddingHorizontal: 15,
    },

    disabledButton: {
      opacity: 0.65,
    },

    buttonText: {
      color: "#ffffff",

      fontSize: 17,

      fontWeight: "bold",

      textAlign: "center",
    },

    returnButton: {
      minHeight: 48,

      justifyContent:
        "center",

      alignItems: "center",

      marginTop: 10,
    },

    returnText: {
      color: "#6e473b",

      fontSize: 16,

      fontWeight: "600",
    },
  });