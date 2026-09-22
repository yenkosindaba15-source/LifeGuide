import { router } from "expo-router";
import { useState } from "react";

import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from "firebase/auth";

import { auth } from "../src/services/firebase";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        Alert.alert(
          "Error",
          "User not found."
        );
        return;
      }

      if (newPassword !== confirmPassword) {
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

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={
          setCurrentPassword
        }
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={
          setConfirmPassword
        }
      />

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

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#6e473b",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});