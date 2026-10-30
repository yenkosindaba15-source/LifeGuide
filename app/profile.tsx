import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  logout,
} from "../src/services/authService";

import {
  auth,
  db,
} from "../src/services/firebase";

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: unknown;
};

export default function Profile() {
  const [profile, setProfile] =
    useState<ProfileData>({
      firstName: "",
      lastName: "",
      email: "",
      createdAt: undefined,
    });

  const loadProfile = async () => {
    try {
      const user =
        auth.currentUser;

      if (!user) {
        return;
      }

      const snapshot =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );

      if (snapshot.exists()) {
        const data =
          snapshot.data();

        setProfile({
          firstName:
            data.firstName || "",

          lastName:
            data.lastName || "",

          email:
            data.email ||
            user.email ||
            "",

          createdAt:
            data.createdAt,
        });
      }
    } catch (error) {
      console.log(
        "Unable to load profile:",
        error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleLogout =
    async () => {
      try {
        await logout();

        router.replace("/login");
      } catch (error) {
        console.log(error);
      }
    };

  const formatDate = (
    value: unknown
  ): string => {
    if (!value) {
      return "Unavailable";
    }

    let date: Date | null = null;

    if (
      typeof value === "string"
    ) {
      date = new Date(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (
        value as {
          toDate?: unknown;
        }
      ).toDate === "function"
    ) {
      date = (
        value as {
          toDate: () => Date;
        }
      ).toDate();
    }

    if (
      !date ||
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Unavailable";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const profileInitial =
    profile.firstName
      ? profile.firstName
          .charAt(0)
          .toUpperCase()
      : "U";

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim();

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
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backText}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            Profile
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        <View
          style={
            styles.profileSection
          }
        >
          <View
            style={
              styles.profileCircle
            }
          >
            <Text
              style={
                styles.profileInitial
              }
            >
              {profileInitial}
            </Text>
          </View>

          <Text style={styles.name}>
            {fullName ||
              "LifeGuide User"}
          </Text>

          <Text style={styles.email}>
            {profile.email}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionTitle
            }
          >
            ACCOUNT SUMMARY
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>
                Name
              </Text>

              <Text style={styles.value}>
                {fullName ||
                  "Not set"}
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View style={styles.row}>
              <Text style={styles.label}>
                Email
              </Text>

              <Text
                style={styles.value}
                numberOfLines={2}
              >
                {profile.email}
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View style={styles.row}>
              <Text style={styles.label}>
                Account Created
              </Text>

              <Text style={styles.value}>
                {formatDate(
                  profile.createdAt
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={
              styles.sectionTitle
            }
          >
            SETTINGS
          </Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              router.push(
                "/edit-profile"
              )
            }
          >
            <Text
              style={
                styles.optionText
              }
            >
              Edit Profile
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              router.push(
                "/change-password"
              )
            }
          >
            <Text
              style={
                styles.optionText
              }
            >
              Change Password
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              router.push(
                "/delete-account"
              )
            }
          >
            <Text
              style={[
                styles.optionText,
                styles.deleteOptionText,
              ]}
            >
              Delete Account
            </Text>

            <Text
              style={[
                styles.arrow,
                styles.deleteOptionText,
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={
            styles.logoutButton
          }
          onPress={handleLogout}
        >
          <Text
            style={styles.logoutText}
          >
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
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",

    justifyContent:
      "space-between",
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
    marginTop: 20,
    marginBottom: 40,
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
    textAlign: "center",
  },

  email: {
    fontSize: 18,
    color: "#6e473b",
    textAlign: "center",
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
    justifyContent:
      "space-between",
  },

  label: {
    fontSize: 17,
    color: "#6e473b",
    maxWidth: "42%",
  },

  value: {
    fontSize: 17,
    color: "#291c0e",
    maxWidth: "56%",
    textAlign: "right",
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
    justifyContent:
      "space-between",
  },

  optionText: {
    fontSize: 19,
    color: "#291c0e",
  },

  arrow: {
    fontSize: 30,
    color: "#6e473b",
  },

  deleteOptionText: {
    color: "#c62828",
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