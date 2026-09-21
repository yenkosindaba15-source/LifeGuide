import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { doc, getDoc } from "firebase/firestore";

import { logout } from "../src/services/authService";
import { auth, db } from "../src/services/firebase";

export default function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

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
        setProfile(snapshot.data() as any);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Profile
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
              {profile.firstName
                ? profile.firstName
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {profile.firstName}{profile.lastName}
          </Text>

          <Text style={styles.email}>
            {profile.email}
          </Text>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ACCOUNT
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Name
              </Text>

              <Text style={styles.value}>
                {profile.firstName}{""}
                {profile.lastName}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>
                Email
              </Text>

              <Text style={styles.value}>
                {profile.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            SETTINGS
          </Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              Edit Profile
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              Change Password
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            LOG OUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  content: {
    paddingBottom: 50,
  },

  header: {
    height: 70,
    marginTop: 35,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 60,
    color: "#291c0e",
    lineHeight: 42,
    marginTop: -2,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#291c0e",
  },

  headerSpace: {
    width: 45,
  },

  profileSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 45,
  },

  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#6e473b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  profileInitial: {
    fontSize: 48,
    color: "#f8f4ef",
    fontWeight: "bold",
  },

  name: {
    fontSize: 30,
    color: "#291c0e",
    fontWeight: "600",
    marginBottom: 5,
  },

  email: {
    fontSize: 18,
    color: "#6e473b",
  },

  section: {
    width: "88%",
    alignSelf: "center",
    marginBottom: 35,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#6e473b",
    letterSpacing: 3,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 18,
    paddingHorizontal: 20,
  },

  row: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 18,
    color: "#6e473b",
  },

  value: {
    fontSize: 18,
    color: "#291c0e",
    maxWidth: "60%",
  },

  divider: {
    height: 1,
    backgroundColor: "#beb5a9",
  },

  option: {
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 18,
    minHeight: 60,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionText: {
    fontSize: 19,
    color: "#291c0e",
  },

  arrow: {
    fontSize: 30,
    color: "#6e473b",
  },

  logoutButton: {
    width: "70%",
    height: 50,
    alignSelf: "center",
    borderRadius: 18,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#c62828",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  logoutText: {
    color: "#c62828",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});