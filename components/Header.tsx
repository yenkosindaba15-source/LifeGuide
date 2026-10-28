import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import {
  auth,
  db,
} from "../src/services/firebase";

type HeaderProps = {
  title?: string;
};

export default function Header({
  title,
}: HeaderProps) {
  const [firstName, setFirstName] =
    useState("");

  const loadFirstName = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const snapshot = await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

      if (snapshot.exists()) {
        const data = snapshot.data();

        setFirstName(
          data.firstName || ""
        );
      }
    } catch (error) {
      console.log(
        "Unable to load header name:",
        error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!title) {
        loadFirstName();
      }
    }, [title])
  );

  const getGreeting = () => {
    const hour =
      new Date().getHours();

    let greeting = "Morning";

    if (hour < 12) {
      greeting = "Morning";
    } else if (hour < 18) {
      greeting = "Afternoon";
    } else {
      greeting = "Evening";
    }

    if (firstName.trim()) {
      return `${greeting}, ${firstName.trim()}.`;
    }

    return `${greeting}.`;
  };

  const headerTitle =
    title ?? getGreeting();

  return (
    <View style={styles.container}>
      <Text
        style={styles.greeting}
        numberOfLines={2}
      >
        {headerTitle}
      </Text>

      <TouchableOpacity
        style={styles.logoButton}
        onPress={() =>
          router.push("/profile")
        }
        activeOpacity={0.8}
      >
        <Image
          source={require(
            "../assets/images/YHWH-post-e1655321856590.png"
          )}
          style={styles.logo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    marginBottom: 30,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  greeting: {
    flex: 1,
    fontSize: 28,
    fontWeight: "600",
    color: "#291c0e",
    marginRight: 15,
  },

  logoButton: {
    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: "#f8f4ef",

    borderWidth: 2,
    borderColor: "#beb5a9",

    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});