import { router } from "expo-router";

import {
  useEffect,
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
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../src/services/firebase";

export default function EditProfile() {
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

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

        setFirstName(
          data.firstName || ""
        );

        setLastName(
          data.lastName || ""
        );
      }
    } catch (error) {
      console.log(
        "Unable to load profile:",
        error
      );
    }
  };

  const saveProfile = async () => {
    const cleanedFirstName =
      firstName.trim();

    const cleanedLastName =
      lastName.trim();

    if (
      !cleanedFirstName ||
      !cleanedLastName
    ) {
      Alert.alert(
        "Missing Information",
        "Please enter both your first name and last name."
      );

      return;
    }

    if (saving) {
      return;
    }

    try {
      const user =
        auth.currentUser;

      if (!user) {
        return;
      }

      setSaving(true);

      await updateDoc(
        doc(
          db,
          "users",
          user.uid
        ),
        {
          firstName:
            cleanedFirstName,

          lastName:
            cleanedLastName,
        }
      );

      Alert.alert(
        "Success",
        "Profile updated."
      );

      router.back();
    } catch (error) {
      console.log(
        "Unable to update profile:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to update profile."
      );
    } finally {
      setSaving(false);
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
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <ScrollView
            contentContainerStyle={
              styles.content
            }
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={styles.header}
            >
              <TouchableOpacity
                style={
                  styles.backButton
                }
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
                style={styles.title}
              >
                Edit Profile
              </Text>

              <View
                style={
                  styles.headerSpace
                }
              />
            </View>

            <View
              style={
                styles.formContainer
              }
            >
              <Text
                style={styles.label}
              >
                First Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#8c7665"
                value={firstName}
                onChangeText={
                  setFirstName
                }
                editable={!saving}
                returnKeyType="next"
              />

              <Text
                style={styles.label}
              >
                Last Name
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#8c7665"
                value={lastName}
                onChangeText={
                  setLastName
                }
                editable={!saving}
                returnKeyType="done"
                onSubmitEditing={
                  Keyboard.dismiss
                }
              />

              <TouchableOpacity
                style={[
                  styles.button,

                  saving &&
                    styles.disabledButton,
                ]}
                disabled={saving}
                onPress={saveProfile}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 35,
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

    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 55,
    color: "#6e473b",
    lineHeight: 45,
  },

  title: {
    flex: 1,

    fontSize: 30,

    fontWeight: "bold",

    color: "#291c0e",

    textAlign: "center",
  },

  headerSpace: {
    width: 45,
  },

  formContainer: {
    marginTop: 25,
  },

  label: {
    color: "#6e473b",

    fontSize: 16,

    fontWeight: "600",

    marginBottom: 8,
  },

  input: {
    minHeight: 52,

    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#beb5a9",

    borderRadius: 12,

    paddingHorizontal: 15,

    fontSize: 16,

    color: "#291c0e",

    marginBottom: 18,
  },

  button: {
    marginTop: 8,

    minHeight: 52,

    backgroundColor: "#6e473b",

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#ffffff",

    fontWeight: "bold",

    fontSize: 18,
  },
});