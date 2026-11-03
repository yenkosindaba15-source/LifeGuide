import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

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
  auth,
  db,
} from "../src/services/firebase";

import {
  validateEmail,
} from "../src/utils/emailValidation";

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
    email,
    setEmail,
  ] = useState("");

  const [
    originalEmail,
    setOriginalEmail,
  ] = useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const cleanedEmail =
    email.trim().toLowerCase();

  const emailHasChanged =
    cleanedEmail !==
    originalEmail
      .trim()
      .toLowerCase();

  const emailValidation =
    validateEmail(email);

  const showEmailError =
    email.length > 0 &&
    !emailValidation.isValid;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const user =
        auth.currentUser;

      if (!user) {
        Alert.alert(
          "User Not Found",
          "LifeGuide could not find the current user account."
        );

        return;
      }

      await user.reload();

      const authenticationEmail = user.email ?.trim().toLowerCase() ?? "";

      const userReference = doc(db, "users", user.uid);

      const snapshot = await getDoc(userReference);

      if (snapshot.exists()) {
        const data = snapshot.data();

        const firestoreEmail = String(data.email ?? "").trim().toLowerCase();

        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");

        if(authenticationEmail  && authenticationEmail !== firestoreEmail){
          await updateDoc(userReference,{
            email: authenticationEmail,
          });
        }

        const acctiveEmail = authenticationEmail  || firestoreEmail;

        setEmail(acctiveEmail);
        setOriginalEmail(acctiveEmail);
      } else{
        setEmail(authenticationEmail);
        setOriginalEmail(authenticationEmail);
      }
    } catch (error) {
      console.log("Unable to load profile:", error);

      Alert.alert("Unable to Load Profile", "LifeGuide could not load your profile information.");
    } finally{
      setLoading(false);
    }
  };

  const getFriendlyErrorMessage = (
    error: any
  ): string => {
    const code =
      String(
        error?.code ?? ""
      );

    if (
      code.includes(
        "invalid-credential"
      ) ||
      code.includes(
        "wrong-password"
      )
    ) {
      return "The current password you entered is incorrect.";
    }

    if (
      code.includes(
        "email-already-in-use"
      )
    ) {
      return "Another account already uses this email address.";
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
        "requires-recent-login"
      )
    ) {
      return "Please enter your current password and try again.";
    }

    if (
      code.includes(
        "too-many-requests"
      )
    ) {
      return "Too many attempts were made. Please try again later.";
    }

    if (
      code.includes(
        "network-request-failed"
      )
    ) {
      return "Please check your internet connection and try again.";
    }

    return "LifeGuide could not update your profile. Please try again.";
  };

  const saveProfile = async () => {
  const cleanedFirstName =
    firstName.trim();

  const cleanedLastName =
    lastName.trim();

  if (
    !cleanedFirstName ||
    !cleanedLastName ||
    !cleanedEmail
  ) {
    Alert.alert(
      "Missing Information",
      "Please enter your first name, last name and email address."
    );

    return;
  }

  const finalEmailValidation =
    validateEmail(cleanedEmail);

  if (
    !finalEmailValidation.isValid
  ) {
    Alert.alert(
      "Invalid Email",
      finalEmailValidation.message
    );

    return;
  }

  if (
    emailHasChanged &&
    !currentPassword
  ) {
    Alert.alert(
      "Current Password Required",
      "Enter your current password before changing your login email."
    );

    return;
  }

  if (saving) {
    return;
  }

  try {
    const user =
      auth.currentUser;

    if (
      !user ||
      !user.email
    ) {
      Alert.alert(
        "User Not Found",
        "LifeGuide could not find the current user account."
      );

      return;
    }

    setSaving(true);

    Keyboard.dismiss();

    if (emailHasChanged) {
      const credential =
        EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

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

          email:
            user.email,
        }
      );

      await verifyBeforeUpdateEmail(
        user,
        cleanedEmail
      );

      Alert.alert(
        "Verify Your New Email",
        `A verification link was sent to ${cleanedEmail}. Open the link to complete the email change. Continue using ${user.email} to log in until the new email has been verified.`,
        [
          {
            text: "OK",

            onPress: () =>
              router.back(),
          },
        ]
      );

      return;
    }

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

        email:
          user.email,
      }
    );

    Alert.alert(
      "Profile Updated",
      "Your profile was updated successfully.",
      [
        {
          text: "OK",

          onPress: () =>
            router.back(),
        },
      ]
    );
  } catch (error: any) {
    console.log(
      "Unable to update profile:",
      error
    );

    Alert.alert(
      "Unable to Update Profile",
      getFriendlyErrorMessage(
        error
      )
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
            <View style={styles.header}>
              <TouchableOpacity
                style={
                  styles.backButton
                }
                disabled={saving}
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
              <Text style={styles.label}>
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
                editable={
                  !saving &&
                  !loading
                }
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={styles.label}>
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
                editable={
                  !saving &&
                  !loading
                }
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={styles.label}>
                Email
              </Text>

              <TextInput
                style={[
                  styles.input,

                  showEmailError &&
                    styles.invalidInput,
                ]}
                placeholder="you@email.com"
                placeholderTextColor="#8c7665"
                value={email}
                onChangeText={setEmail}
                editable={
                  !saving &&
                  !loading
                }
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType={
                  emailHasChanged
                    ? "next"
                    : "done"
                }
                onSubmitEditing={
                  emailHasChanged
                    ? undefined
                    : Keyboard.dismiss
                }
              />

              {showEmailError && (
                <Text
                  style={
                    styles.validationText
                  }
                >
                  {
                    emailValidation.message
                  }
                </Text>
              )}

              <Text
                style={
                  styles.emailNotice
                }
              >
                Changing this email will
                also change the email
                address you use to sign in.
              </Text>

              {emailHasChanged && (
                <>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Current Password
                  </Text>

                  <View
                    style={
                      styles.passwordContainer
                    }
                  >
                    <TextInput
                      style={
                        styles.passwordInput
                      }
                      placeholder="Enter current password"
                      placeholderTextColor="#8c7665"
                      value={
                        currentPassword
                      }
                      onChangeText={
                        setCurrentPassword
                      }
                      secureTextEntry={
                        !showCurrentPassword
                      }
                      editable={!saving}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={
                        Keyboard.dismiss
                      }
                    />

                    <TouchableOpacity
                      style={
                        styles.eyeButton
                      }
                      disabled={saving}
                      onPress={() =>
                        setShowCurrentPassword(
                          (current) =>
                            !current
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

                  <Text
                    style={
                      styles.passwordNotice
                    }
                  >
                    Your current password
                    is required to protect
                    your account before the
                    login email is changed.
                  </Text>
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.button,

                  (saving ||
                    loading) &&
                    styles.disabledButton,
                ]}
                disabled={
                  saving ||
                  loading
                }
                onPress={saveProfile}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {loading
                    ? "Loading..."
                    : saving
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

      backgroundColor:
        "#ffffff",

      borderWidth: 1,

      borderColor:
        "#beb5a9",

      borderRadius: 12,

      paddingHorizontal: 15,

      fontSize: 16,

      color: "#291c0e",

      marginBottom: 18,
    },

    invalidInput: {
      borderColor: "#c62828",

      marginBottom: 6,
    },

    validationText: {
      color: "#c62828",

      fontSize: 13,

      lineHeight: 19,

      marginBottom: 14,

      paddingHorizontal: 4,
    },

    emailNotice: {
      color: "#6e473b",

      fontSize: 13,

      lineHeight: 20,

      marginTop: -8,

      marginBottom: 18,

      paddingHorizontal: 4,
    },

    passwordContainer: {
      height: 52,

      backgroundColor:
        "#ffffff",

      borderWidth: 1,

      borderColor:
        "#beb5a9",

      borderRadius: 12,

      flexDirection: "row",

      alignItems: "center",
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

    passwordNotice: {
      color: "#6e473b",

      fontSize: 13,

      lineHeight: 20,

      marginTop: 8,

      marginBottom: 18,

      paddingHorizontal: 4,
    },

    button: {
      marginTop: 8,

      minHeight: 52,

      backgroundColor:
        "#6e473b",

      borderRadius: 14,

      justifyContent: "center",

      alignItems: "center",

      paddingHorizontal: 15,
    },

    disabledButton: {
      opacity: 0.65,
    },

    buttonText: {
      color: "#ffffff",

      fontWeight: "bold",

      fontSize: 18,

      textAlign: "center",
    },
  });