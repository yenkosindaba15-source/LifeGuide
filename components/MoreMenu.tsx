import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../src/services/authService";

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

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      router.replace("/login");
    } catch (error){
      console.log(error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/profile");
          }}
        >
          <Text style={styles.text}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/highlights");
          }}
        >
          <Text style={styles.text}>
            My Highlights
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/verse-history");
          }}
        >
          <Text style={styles.text}>
            Verse History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onClose();
            router.push("/devotional-history");
          }}
        >
          <Text style={styles.text}>
            Devotional History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item,
            styles.logoutItem,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            LOG OUT
          </Text>
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