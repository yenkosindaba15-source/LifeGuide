import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
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

import { signup } from "../src/services/authService";
import { db } from "../src/services/firebase";

export default function Signup() {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleSignup = async () => {
    try {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        Alert.alert(
          "Missing Information",
          "Please complete all fields."
        );

        return;
      }

      const userCredential =
        await signup(
          email.trim(),
          password
        );

      await setDoc(
        doc(
          db,
          "users",
          userCredential.user.uid
        ),
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          createdAt:
            new Date().toISOString(),
        }
      );

      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.message
      );
    }
  };

  return (
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
            <Text style={styles.heading}>
              Begin Your Journey.
            </Text>

            <Text style={styles.verse}>
              "They devoted themselves to
              the apostles' teaching and to
              fellowship, to the breaking
              of bread and to prayer."
            </Text>

            <Text style={styles.reference}>
              Acts 2:42
            </Text>
          </View>

          <View style={styles.wrapper}>
            <Text style={styles.title}>
              Sign Up
            </Text>

            <View style={styles.inputBox}>
              <Text style={styles.label}>
                First Name
              </Text>

              <TextInput
                placeholder="John"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>
                Last Name
              </Text>

              <TextInput
                placeholder="Doe"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>
                Email
              </Text>

              <TextInput
                placeholder="you@email.com"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputBox}>
              <Text style={styles.label}>
                Password
              </Text>

              <View
                style={
                  styles.passwordContainer
                }
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#ccc"
                  style={
                    styles.passwordInput
                  }
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={
                    !showPassword
                  }
                  returnKeyType="done"
                  onSubmitEditing={
                    Keyboard.dismiss
                  }
                />

                <TouchableOpacity
                  style={styles.eyeButton}
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
              style={styles.button}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text
                style={styles.buttonText}
              >
                Sign Up
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text
                style={styles.bottomText}
              >
                Already have an account?{" "}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/login")
                }
              >
                <Text style={styles.loginText}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    color: "#F5E6C5",
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

  button: {
    backgroundColor: "#e1d4c2",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 5,
  },

  buttonText: {
    color: "#6d5530",
    fontWeight: "bold",
    fontSize: 18,
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