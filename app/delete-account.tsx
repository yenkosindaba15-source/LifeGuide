import {
    Ionicons,
} from "@expo/vector-icons";

import { router } from "expo-router";

import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    deleteCurrentAuthUser,
    reauthenticateUser,
} from "../src/services/authService";

import {
    deleteCurrentUserData,
} from "../src/services/accountDeletionService";

export default function DeleteAccount() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const startDeletion = () => {
    const cleanedPassword =
      password.trim();

    if (!cleanedPassword) {
      Alert.alert(
        "Password Required",
        "Enter your current password before deleting your account."
      );

      return;
    }

    Alert.alert(
      "Delete Account?",
      "This will permanently delete your LifeGuide account, profile information, saved highlights, and AI chat history. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete Account",
          style: "destructive",
          onPress:
            handleDeleteAccount,
        },
      ]
    );
  };

  const handleDeleteAccount =
    async () => {
      if (isDeleting) {
        return;
      }

      try {
        setIsDeleting(true);

        await reauthenticateUser(
          password
        );

        await deleteCurrentUserData();

        await deleteCurrentAuthUser();

        router.replace(
          "/login"
        );

        setTimeout(() => {
          Alert.alert(
            "Account Deleted",
            "Your LifeGuide account has been permanently deleted."
          );
        }, 300);
      } catch (error: any) {
        console.log(
          "Account deletion error:",
          error
        );

        const errorCode =
          String(
            error?.code ?? ""
          );

        if (
          errorCode.includes(
            "invalid-credential"
          ) ||
          errorCode.includes(
            "wrong-password"
          )
        ) {
          Alert.alert(
            "Incorrect Password",
            "The password you entered is incorrect."
          );

          return;
        }

        Alert.alert(
          "Unable to Delete Account",
          "LifeGuide could not completely delete the account. Please check your connection and password, then try again."
        );
      } finally {
        setIsDeleting(false);
      }
    };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={
              styles.backButton
            }
            disabled={isDeleting}
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
            style={
              styles.headerTitle
            }
          >
            Delete Account
          </Text>

          <View
            style={
              styles.headerSpace
            }
          />
        </View>

        <View
          style={
            styles.warningIcon
          }
        >
          <Ionicons
            name="warning-outline"
            size={42}
            color="#c62828"
          />
        </View>

        <Text
          style={
            styles.warningTitle
          }
        >
          Permanently delete your
          LifeGuide account
        </Text>

        <Text
          style={
            styles.description
          }
        >
          Deleting your account removes
          your profile information,
          saved Bible highlights, and
          AI Bible Companion chat
          history.
        </Text>

        <View
          style={styles.warningCard}
        >
          <Text
            style={
              styles.warningCardTitle
            }
          >
            This cannot be undone.
          </Text>

          <Text
            style={
              styles.warningCardText
            }
          >
            You will lose access to the
            account and its saved
            LifeGuide data permanently.
          </Text>
        </View>

        <Text
          style={
            styles.passwordLabel
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
            secureTextEntry={
              !showPassword
            }
            value={password}
            onChangeText={
              setPassword
            }
            editable={!isDeleting}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={
              styles.eyeButton
            }
            disabled={isDeleting}
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
              color="#6e473b"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.deleteButton,

            isDeleting &&
              styles.disabledButton,
          ]}
          disabled={isDeleting}
          onPress={startDeletion}
        >
          {isDeleting ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
            />
          ) : (
            <Text
              style={
                styles.deleteButtonText
              }
            >
              DELETE ACCOUNT
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          disabled={isDeleting}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.cancelText
            }
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

    content: {
      paddingHorizontal: 24,

      paddingBottom: 45,
    },

    header: {
      minHeight: 100,

      paddingTop: 30,

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

    headerTitle: {
      flex: 1,

      fontSize: 27,

      fontWeight: "600",

      color: "#291c0e",

      textAlign: "center",
    },

    headerSpace: {
      width: 45,
    },

    warningIcon: {
      width: 78,
      height: 78,

      borderRadius: 39,

      backgroundColor:
        "#f8f4ef",

      borderWidth: 2,

      borderColor:
        "#c62828",

      justifyContent: "center",

      alignItems: "center",

      alignSelf: "center",

      marginTop: 20,

      marginBottom: 22,
    },

    warningTitle: {
      color: "#291c0e",

      fontSize: 27,

      fontWeight: "bold",

      textAlign: "center",

      lineHeight: 35,

      marginBottom: 16,
    },

    description: {
      color: "#6e473b",

      fontSize: 17,

      lineHeight: 27,

      textAlign: "center",

      marginBottom: 25,
    },

    warningCard: {
      backgroundColor:
        "#f8f4ef",

      borderWidth: 1,

      borderColor:
        "#d79a9a",

      borderRadius: 16,

      padding: 18,

      marginBottom: 30,
    },

    warningCardTitle: {
      color: "#c62828",

      fontSize: 17,

      fontWeight: "bold",

      marginBottom: 6,
    },

    warningCardText: {
      color: "#6e473b",

      fontSize: 15,

      lineHeight: 23,
    },

    passwordLabel: {
      color: "#291c0e",

      fontSize: 16,

      fontWeight: "600",

      marginBottom: 8,
    },

    passwordContainer: {
      height: 54,

      backgroundColor:
        "#ffffff",

      borderWidth: 1,

      borderColor:
        "#beb5a9",

      borderRadius: 12,

      flexDirection: "row",

      alignItems: "center",

      marginBottom: 25,
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
      width: 52,
      height: 54,

      justifyContent: "center",

      alignItems: "center",
    },

    deleteButton: {
      minHeight: 52,

      backgroundColor:
        "#c62828",

      borderRadius: 14,

      justifyContent: "center",

      alignItems: "center",
    },

    disabledButton: {
      opacity: 0.6,
    },

    deleteButtonText: {
      color: "#ffffff",

      fontSize: 17,

      fontWeight: "bold",

      letterSpacing: 1,
    },

    cancelButton: {
      minHeight: 50,

      justifyContent: "center",

      alignItems: "center",

      marginTop: 10,
    },

    cancelText: {
      color: "#6e473b",

      fontSize: 17,

      fontWeight: "600",
    },
  });