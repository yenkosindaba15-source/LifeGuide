import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search the Bible..."
        placeholderTextColor="#a78d78"
        style={styles.input}
      />

      <Ionicons
        name="search"
        size={22}
        color="#6e473b"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 35,

    height: 48,

    backgroundColor: "#f8f4ef",

    borderWidth: 2,
    borderColor: "#beb5a9",

    borderRadius: 25,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#291c0e",
  },
});