import { FontAwesome6 } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MoreMenu from "./MoreMenu";

export default function BottomNavigation() {
  const pathname = usePathname();
  const [moreVisible, setMoreVisible] = useState(false);

  const toggleMore = () => {
    setMoreVisible((current) => !current);
  };

  return (
    <>
      <MoreMenu
        visible={moreVisible}
        onClose={() => setMoreVisible(false)}
      />

      <View style={styles.container}>

        <NavButton
          icon="house"
          text="Home"
          active={pathname === "/(tabs)" || pathname === "/"}
          onPress={() => {
            setMoreVisible(false);
            router.replace("/(tabs)");
          }}
        />

        <NavButton
          icon="robot"
          text="AI Chat"
          active={pathname === "/(tabs)/ai"}
          onPress={() => {
            setMoreVisible(false);
            router.replace("/(tabs)/ai");
          }}
        />

        <NavButton
          icon="book-bible"
          text="Bible"
          active={pathname === "/(tabs)/bible"}
          onPress={() => {
            setMoreVisible(false);
            router.replace("/(tabs)/bible");
          }}
        />

        <NavButton
          icon="book-open"
          text="Devotionals"
          active={pathname === "/(tabs)/devotionals"}
          onPress={() => {
            setMoreVisible(false);
            router.replace("/(tabs)/devotionals");
          }}
        />

        <NavButton
          icon="bars"
          text="More"
          active={moreVisible}
          onPress={toggleMore}
        />

      </View>
    </>
  );
}

function NavButton({
  icon,
  text,
  active,
  onPress,
}: {
  icon: any;
  text: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <FontAwesome6
        name={icon}
        size={20}
        color={active ? "#291c0e" : "#6e473b"}
      />

      <Text
        style={[
          styles.text,
          active && styles.activeText,
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
    height: 80,
    backgroundColor: "#e1d4c2",
    borderTopWidth: 1,
    borderTopColor: "#beb5a9",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
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