import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

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
  auth,
} from "../src/services/firebase";

import {
  validatePassword,
} from "../src/utils/passwordValidation";

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

  const [
    updating,
    setUpdating,
  ] = useState(false);

  const passwordValidation =
    validatePassword(newPassword);

  const showPasswordRequirements =
    newPassword.length > 0 &&
    !passwordValidation.isValid;

  const handleChangePassword =
    async () => {
      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        Alert.alert(
          "Missing Information",
          "Please complete all password fields."
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        Alert.alert(
          "Choose a New Password",
          "Your new password cannot be the same as your current password."
        );

        return;
      }

      if (
        !passwordValidation.isValid
      ) {
        Alert.alert(
          "Password Requirements",
          "Please make sure your new password meets all the required security rules."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        Alert.alert(
          "Password Mismatch",
          "The new password and confirmation password do not match."
        );

        return;
      }

      if (updating) {
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

        setUpdating(true);

        Keyboard.dismiss();

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
          "Password Updated",
          "Your password was changed successfully.",
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
          "Password update error:",
          error
        );

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
          Alert.alert(
            "Incorrect Password",
            "The current password you entered is incorrect."
          );

          return;
        }

        if (
          code.includes(
            "too-many-requests"
          )
        ) {
          Alert.alert(
            "Too Many Attempts",
            "Access has been temporarily limited because of repeated attempts. Please try again later."
          );

          return;
        }

        if (
          code.includes(
            "network-request-failed"
          )
        ) {
          Alert.alert(
            "Connection Error",
            "Please check your internet connection and try again."
          );

          return;
        }

        Alert.alert(
          "Unable to Change Password",
          "LifeGuide could not update your password. Please try again."
        );
      } finally {
        setUpdating(false);
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
        style={
          styles.keyboardView
        }
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
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.content
            }
          >
            <View
              style={styles.header}
            >
              <TouchableOpacity
                style={
                  styles.backButton
                }
                disabled={updating}
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
                Change Password
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
                Current Password
              </Text>

              <PasswordField
                placeholder=
                  "Current Password"
                value={
                  currentPassword
                }
                onChangeText={
                  setCurrentPassword
                }
                visible={
                  showCurrentPassword
                }
                onToggle={() =>
                  setShowCurrentPassword(
                    (current) =>
                      !current
                  )
                }
                editable={!updating}
              />

              <Text
                style={styles.label}
              >
                New Password
              </Text>

              <PasswordField
                placeholder=
                  "New Password"
                value={newPassword}
                onChangeText={
                  setNewPassword
                }
                visible={
                  showNewPassword
                }
                onToggle={() =>
                  setShowNewPassword(
                    (current) =>
                      !current
                  )
                }
                editable={!updating}
              />

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

              {newPassword.length >
                0 &&
                currentPassword.length >
                  0 &&
                newPassword ===
                  currentPassword && (
                  <Text
                    style={
                      styles.samePasswordText
                    }
                  >
                    • The new password must
                    be different from your
                    current password
                  </Text>
                )}

              <Text
                style={styles.label}
              >
                Confirm New Password
              </Text>

              <PasswordField
                placeholder=
                  "Confirm Password"
                value={
                  confirmPassword
                }
                onChangeText={
                  setConfirmPassword
                }
                visible={
                  showConfirmPassword
                }
                onToggle={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                editable={!updating}
                onSubmitEditing={
                  handleChangePassword
                }
              />

              {confirmPassword.length >
                0 &&
                newPassword !==
                  confirmPassword && (
                  <Text
                    style={
                      styles.mismatchText
                    }
                  >
                    The passwords do not
                    match.
                  </Text>
                )}

              <TouchableOpacity
                style={[
                  styles.button,

                  updating &&
                    styles.disabledButton,
                ]}
                disabled={updating}
                onPress={
                  handleChangePassword
                }
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {updating
                    ? "Updating..."
                    : "Update Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type PasswordFieldProps = {
  placeholder: string;
  value: string;

  onChangeText: (
    text: string
  ) => void;

  visible: boolean;
  onToggle: () => void;
  editable: boolean;

  onSubmitEditing?:
    () => void;
};

function PasswordField({
  placeholder,
  value,
  onChangeText,
  visible,
  onToggle,
  editable,
  onSubmitEditing,
}: PasswordFieldProps) {
  return (
    <View
      style={
        styles.passwordContainer
      }
    >
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor="#8c7665"
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={
          onSubmitEditing
            ? "done"
            : "next"
        }
        onSubmitEditing={
          onSubmitEditing
        }
      />

      <TouchableOpacity
        style={styles.eyeButton}
        onPress={onToggle}
        disabled={!editable}
      >
        <Ionicons
          name={
            visible
              ? "eye-off-outline"
              : "eye-outline"
          }
          size={23}
          color="#6e473b"
        />
      </TouchableOpacity>
    </View>
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

    fontSize: 29,

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

  passwordContainer: {
    height: 52,

    backgroundColor: "#ffffff",

    borderWidth: 1,

    borderColor: "#beb5a9",

    borderRadius: 12,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 18,
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

  passwordRequirements: {
    marginTop: -8,

    marginBottom: 18,

    paddingHorizontal: 4,
  },

  requirementsTitle: {
    color: "#8b3a3a",

    fontSize: 13,

    fontWeight: "600",

    marginBottom: 4,
  },

  requirementText: {
    color: "#8b3a3a",

    fontSize: 13,

    lineHeight: 19,
  },

  samePasswordText: {
    color: "#8b3a3a",

    fontSize: 13,

    lineHeight: 19,

    marginTop: -8,

    marginBottom: 18,

    paddingHorizontal: 4,
  },

  mismatchText: {
    color: "#8b3a3a",

    fontSize: 13,

    marginTop: -8,

    marginBottom: 18,

    paddingHorizontal: 4,
  },

  button: {
    minHeight: 52,

    marginTop: 8,

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