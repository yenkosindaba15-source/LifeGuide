import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchBar() {
  const [searchText, setSearchText] =
    useState("");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search the Bible..."
        placeholderTextColor="#a78d78"
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
      />

      {searchText.length > 0 ? (
        <TouchableOpacity
          onPress={() => setSearchText("")}
        >
          <Text style={styles.clearText}>
            ×
          </Text>
        </TouchableOpacity>
      ) : (
        <Ionicons
          name="search"
          size={22}
          color="#6e473b"
        />
      )}
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

  clearText: {
    fontSize: 26,
    color: "#6e473b",
  },
});