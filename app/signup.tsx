import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  doc,
  setDoc,
} from "firebase/firestore";

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
  signup,
} from "../src/services/authService";

import {
  db,
} from "../src/services/firebase";

import {
  validatePassword,
} from "../src/utils/passwordValidation";

export default function Signup() {
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

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
    isCreatingAccount,
    setIsCreatingAccount,
  ] = useState(false);

  const passwordValidation =
    validatePassword(password);

  const showPasswordRequirements =
    password.length > 0 &&
    !passwordValidation.isValid;

  const getFriendlyErrorMessage = (
    error: any
  ): string => {
    const code =
      String(
        error?.code ?? ""
      );

    if (
      code.includes(
        "email-already-in-use"
      )
    ) {
      return "An account already exists with this email address.";
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
        "weak-password"
      )
    ) {
      return "The password does not meet the required security rules.";
    }

    if (
      code.includes(
        "network-request-failed"
      )
    ) {
      return "Unable to connect. Please check your internet connection and try again.";
    }

    return "LifeGuide could not create your account. Please try again.";
  };

  const handleSignup = async () => {
    const cleanedFirstName =
      firstName.trim();

    const cleanedLastName =
      lastName.trim();

    const cleanedEmail =
      email.trim().toLowerCase();

    if (
      !cleanedFirstName ||
      !cleanedLastName ||
      !cleanedEmail ||
      !password
    ) {
      Alert.alert(
        "Missing Information",
        "Please complete all fields."
      );

      return;
    }

    if (
      !passwordValidation.isValid
    ) {
      Alert.alert(
        "Password Requirements",
        "Please make sure your password meets all the required security rules."
      );

      return;
    }

    if (isCreatingAccount) {
      return;
    }

    try {
      setIsCreatingAccount(true);

      Keyboard.dismiss();

      const userCredential =
        await signup(
          cleanedEmail,
          password
        );

      await setDoc(
        doc(
          db,
          "users",
          userCredential.user.uid
        ),
        {
          firstName:
            cleanedFirstName,

          lastName:
            cleanedLastName,

          email:
            cleanedEmail,

          createdAt:
            new Date().toISOString(),
        }
      );

      router.replace("/(tabs)");

      setTimeout(() => {
        Alert.alert(
          "Success",
          "Account created successfully!"
        );
      }, 300);
    } catch (error: any) {
      console.log(
        "Signup error:",
        error
      );

      Alert.alert(
        "Signup Failed",
        getFriendlyErrorMessage(
          error
        )
      );
    } finally {
      setIsCreatingAccount(false);
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
        style={styles.keyboardView}
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
                Begin Your Journey.
              </Text>

              <Text style={styles.verse}>
                "They devoted themselves to
                the apostles' teaching and to
                fellowship, to the breaking
                of bread and to prayer."
              </Text>

              <Text
                style={styles.reference}
              >
                Acts 2:42
              </Text>
            </View>

            <View style={styles.wrapper}>
              <Text style={styles.title}>
                Sign Up
              </Text>

              <View
                style={styles.inputBox}
              >
                <Text
                  style={styles.label}
                >
                  First Name
                </Text>

                <TextInput
                  placeholder="John"
                  placeholderTextColor="#cccccc"
                  style={styles.input}
                  value={firstName}
                  onChangeText={
                    setFirstName
                  }
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={
                    !isCreatingAccount
                  }
                />
              </View>

              <View
                style={styles.inputBox}
              >
                <Text
                  style={styles.label}
                >
                  Last Name
                </Text>

                <TextInput
                  placeholder="Doe"
                  placeholderTextColor="#cccccc"
                  style={styles.input}
                  value={lastName}
                  onChangeText={
                    setLastName
                  }
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={
                    !isCreatingAccount
                  }
                />
              </View>

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
                  editable={
                    !isCreatingAccount
                  }
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    editable={
                      !isCreatingAccount
                    }
                    onSubmitEditing={
                      Keyboard.dismiss
                    }
                  />

                  <TouchableOpacity
                    style={
                      styles.eyeButton
                    }
                    disabled={
                      isCreatingAccount
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

                {showPasswordRequirements && (
                  <View
                    style={
                      styles.passwordRequirements
                    }
                  >
                    <Text
                      style={
                        styles.requirementsTitle
                      }
                    >
                      Password still needs:
                    </Text>

                    {passwordValidation
                      .missingRequirements
                      .map(
                        (
                          requirement
                        ) => (
                          <Text
                            key={
                              requirement
                            }
                            style={
                              styles.requirementText
                            }
                          >
                            •{" "}
                            {requirement}
                          </Text>
                        )
                      )}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.button,

                  isCreatingAccount &&
                    styles.disabledButton,
                ]}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={
                  isCreatingAccount
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {isCreatingAccount
                    ? "Creating Account..."
                    : "Sign Up"}
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
                  Already have an
                  account?{" "}
                </Text>

                <TouchableOpacity
                  disabled={
                    isCreatingAccount
                  }
                  onPress={() =>
                    router.push("/login")
                  }
                >
                  <Text
                    style={
                      styles.loginText
                    }
                  >
                    Login
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
    backgroundColor: "#6e473b",
  },

  container: {
    flex: 1,
    backgroundColor: "#6e473b",
  },

  content: {
    flexGrow: 1,

    paddingHorizontal: 25,

    paddingTop: 35,

    paddingBottom: 40,

    justifyContent: "center",
  },

  side: {
    marginBottom: 25,
  },

  heading: {
    fontSize: 32,

    fontWeight: "bold",

    color: "#dac69b",

    marginBottom: 12,
  },

  verse: {
    fontSize: 17,

    color: "#ffffff",

    lineHeight: 27,
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

    paddingVertical: 24,

    borderRadius: 20,
  },

  title: {
    textAlign: "center",

    fontSize: 32,

    color: "#e1d4c2",

    fontWeight: "bold",

    marginBottom: 18,
  },

  inputBox: {
    marginBottom: 14,
  },

  label: {
    color: "#e1d4c2",

    marginBottom: 7,

    fontSize: 15,
  },

  input: {
    height: 48,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,255,255,0.12)",

    paddingHorizontal: 15,

    color: "#ffffff",

    fontSize: 16,
  },

  passwordContainer: {
    height: 48,

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

    height: 48,

    justifyContent: "center",

    alignItems: "center",
  },

  passwordRequirements: {
    marginTop: 8,

    paddingHorizontal: 4,
  },

  requirementsTitle: {
    color: "#f5d7ce",

    fontSize: 13,

    fontWeight: "600",

    marginBottom: 4,
  },

  requirementText: {
    color: "#f5d7ce",

    fontSize: 13,

    lineHeight: 19,
  },

  button: {
    backgroundColor: "#e1d4c2",

    minHeight: 48,

    justifyContent: "center",

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

    textAlign: "center",
  },

  bottomRow: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    flexWrap: "wrap",

    marginTop: 20,
  },

  bottomText: {
    color: "#e1d4c2",
  },

  loginText: {
    color: "#e1d4c2",

    fontWeight: "bold",
  },
});