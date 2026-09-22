import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

import {
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

import { auth, db } from "../src/services/firebase";

export default function EditProfile() {
  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const snapshot = await getDoc(
        doc(db, "users", user.uid)
      );

      if (snapshot.exists()) {
        const data = snapshot.data();

        setFirstName(
          data.firstName || ""
        );

        setLastName(
          data.lastName || ""
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      await updateDoc(
        doc(db, "users", user.uid),
        {
          firstName,
          lastName,
        }
      );

      Alert.alert(
        "Success",
        "Profile updated."
      );

      router.back();

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Unable to update profile."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Edit Profile
      </Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveProfile}
      >
        <Text style={styles.buttonText}>
          Save Changes
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
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});