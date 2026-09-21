import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MoreMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export default function MoreMenu({
  visible,
  onClose,
}: MoreMenuProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.menu}>

        <TouchableOpacity style={styles.item} onPress={() => router.push("/profile")}>
          <Text>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push("/highlights")}>
          <Text style={styles.text}>My Highlights</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={onClose}>
          <Text style={styles.text}>Verse of the Day</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={onClose}>
          <Text style={styles.text}>Devotions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, styles.logoutItem]}
          onPress={onClose}
        >
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 90,
    right: 15,
    zIndex: 100,
  },

  menu: {
    width: 220,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 15,
    overflow: "hidden",

    shadowColor: "#291c0e",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 8,
  },

  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#beb5a9",
  },

  text: {
    color: "#291c0e",
    fontSize: 16,
  },

  logoutItem: {
    borderBottomWidth: 0,
  },

  logoutText: {
    color: "#c62828",
    fontSize: 16,
    fontWeight: "bold",
  },
});