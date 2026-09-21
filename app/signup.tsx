import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";
import { signup } from "../src/services/authService";
import { db } from "../src/services/firebase";

import { Link, router } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
  try {
    const userCredential = await signup(email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      firstName, lastName, email, createdAt: new Date().toISOString(),}
    );
    
    Alert.alert("Success", "Account created successfully!");
    router.replace("/(tabs)");
  } catch (error: any) {
    Alert.alert("Signup Failed", error.message);
  }
};
  return (
    <View style={styles.container}>

      {/* Verse Section */}
      <View style={styles.side}>
        <Text style={styles.heading}>Let's walk into The Light.</Text>

        <Text style={styles.verse}>
          "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer."
        </Text>

        <Text style={styles.reference}>
          Acts 2:42
        </Text>
      </View>

      {/* Signup Card */}
      <View style={styles.wrapper}>

        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder="John"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Doe"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@email.com"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>
            Already have an account?{" "}
          </Text>

          <Link href="/login" style={styles.link}>
            Login
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
    fontSize: 38,
    fontWeight: "bold",
    color: "#dac69b",
    marginBottom: 10,
  },

  verse: {
    fontSize: 18,
    color: "white",
    lineHeight: 30,
  },

  reference: {
    marginTop: 15,
    color: "#F5E6C5",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 17,
  },

  wrapper: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 25,
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
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 15,
    color: "white",
  },

  button: {
    backgroundColor: "#e1d4c2",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#6d5530",
    fontWeight: "bold",
    fontSize: 18,
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