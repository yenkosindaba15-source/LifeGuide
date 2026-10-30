import { FontAwesome6 } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useState } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import MoreMenu from "./MoreMenu";

export default function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [moreVisible, setMoreVisible] =
    useState(false);

  const toggleMore = () => {
    setMoreVisible(
      (current) => !current
    );
  };

  const bottomPadding =
    Math.max(insets.bottom, 8);

  return (
    <>
      <MoreMenu
        visible={moreVisible}
        onClose={() =>
          setMoreVisible(false)
        }
      />

      <View
        style={[
          styles.container,
          {
            paddingBottom:
              bottomPadding,

            height:
              64 + bottomPadding,
          },
        ]}
      >
        <NavButton
          icon="house"
          text="Home"
          active={
            pathname === "/(tabs)" ||
            pathname === "/"
          }
          onPress={() => {
            setMoreVisible(false);
            router.replace("/(tabs)");
          }}
        />

        <NavButton
          icon="robot"
          text="AI Chat"
          active={
            pathname.startsWith(
              "/ai"
            )
          }
          onPress={() => {
            setMoreVisible(false);
            router.replace("/ai");
          }}
        />

        <NavButton
          icon="book-bible"
          text="Bible"
          active={
            pathname.startsWith(
              "/(tabs)/bible"
            ) ||
            pathname.startsWith(
              "/bible"
            )
          }
          onPress={() => {
            setMoreVisible(false);

            router.replace(
              "/(tabs)/bible"
            );
          }}
        />

        <NavButton
          icon="book-open"
          text="Devotionals"
          active={
            pathname.startsWith(
              "/(tabs)/devotionals"
            ) ||
            pathname.startsWith(
              "/devotional"
            )
          }
          onPress={() => {
            setMoreVisible(false);

            router.replace(
              "/(tabs)/devotionals"
            );
          }}
        />

        <NavButton
          icon="bars"
          text="More"
          active={
            moreVisible ||
            pathname === "/profile" ||
            pathname ===
              "/highlights" ||
            pathname ===
              "/verse-history" ||
            pathname ===
              "/devotional-history" ||
            pathname ===
              "/edit-profile" ||
            pathname ===
              "/change-password" ||
            pathname ===
              "/delete-account"
          }
          onPress={toggleMore}
        />
      </View>
    </>
  );
}

type NavButtonProps = {
  icon: any;
  text: string;
  active: boolean;
  onPress: () => void;
};

function NavButton({
  icon,
  text,
  active,
  onPress,
}: NavButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <FontAwesome6
        name={icon}
        size={20}
        color={
          active
            ? "#291c0e"
            : "#6e473b"
        }
      />

      <Text
        style={[
          styles.text,
          active &&
            styles.activeText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,

    backgroundColor: "#e1d4c2",

    borderTopWidth: 1,
    borderTopColor: "#beb5a9",

    flexDirection: "row",

    justifyContent:
      "space-around",

    alignItems: "flex-start",

    paddingTop: 10,

    elevation: 8,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: -2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 4,
  },

  button: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    minHeight: 50,
  },

  text: {
    marginTop: 6,

    color: "#6e473b",

    fontSize: 12,
  },

  activeText: {
    color: "#291c0e",

    fontWeight: "bold",
  },
});