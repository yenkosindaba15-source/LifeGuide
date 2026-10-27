import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { useState } from "react";

import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../src/services/firebase";

export default function ChangePassword() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const handleChangePassword =
    async () => {
      try {
        const user =
          auth.currentUser;

        if (!user || !user.email) {
          Alert.alert(
            "Error",
            "User not found."
          );

          return;
        }

        if (
          newPassword !==
          confirmPassword
        ) {
          Alert.alert(
            "Password Mismatch",
            "New passwords do not match."
          );

          return;
        }

        if (newPassword.length < 6) {
          Alert.alert(
            "Weak Password",
            "Password must be at least 6 characters."
          );

          return;
        }

        const credential =
          EmailAuthProvider.credential(
            user.email,
            currentPassword
          );

        await reauthenticateWithCredential(
          user,
          credential
        );

        await updatePassword(
          user,
          newPassword
        );

        Alert.alert(
          "Success",
          "Password changed successfully."
        );

        router.back();
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Error",
          "Unable to change password. Check your current password."
        );
      }
    };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Change Password
      </Text>

      <View
        style={styles.passwordContainer}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Current Password"
          placeholderTextColor="#8c7665"
          secureTextEntry={
            !showCurrentPassword
          }
          value={currentPassword}
          onChangeText={
            setCurrentPassword
          }
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            setShowCurrentPassword(
              (current) => !current
            )
          }
        >
          <Ionicons
            name={
              showCurrentPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={23}
            color="#6e473b"
          />
        </TouchableOpacity>
      </View>

      <View
        style={styles.passwordContainer}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="New Password"
          placeholderTextColor="#8c7665"
          secureTextEntry={
            !showNewPassword
          }
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            setShowNewPassword(
              (current) => !current
            )
          }
        >
          <Ionicons
            name={
              showNewPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={23}
            color="#6e473b"
          />
        </TouchableOpacity>
      </View>

      <View
        style={styles.passwordContainer}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#8c7665"
          secureTextEntry={
            !showConfirmPassword
          }
          value={confirmPassword}
          onChangeText={
            setConfirmPassword
          }
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            setShowConfirmPassword(
              (current) => !current
            )
          }
        >
          <Ionicons
            name={
              showConfirmPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={23}
            color="#6e473b"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={
          handleChangePassword
        }
      >
        <Text style={styles.buttonText}>
          Update Password
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 25,
    color: "#291c0e",
    textAlign: "center",
  },

  passwordContainer: {
    height: 52,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 15,
    paddingRight: 5,
    color: "#291c0e",
    fontSize: 16,
  },

  eyeButton: {
    width: 50,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#6e473b",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});