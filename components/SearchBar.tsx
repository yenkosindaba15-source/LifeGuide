import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchBar() {
  const [searchText, setSearchText] =
    useState("");

  const openAICompanion = () => {
    const cleanedQuestion =
      searchText.trim();

    if (!cleanedQuestion) {
      return;
    }

    Keyboard.dismiss();

    router.push({
      pathname: "/ai",
      params: {
        homeQuestion:
          cleanedQuestion,

        requestId:
          String(Date.now()),
      },
    });

    setSearchText("");
  };

  const hasText =
    searchText.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ask the Bible Companion..."
        placeholderTextColor="#a78d78"
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        autoCorrect
        onSubmitEditing={
          openAICompanion
        }
      />

      <TouchableOpacity
        style={styles.searchButton}
        disabled={!hasText}
        onPress={openAICompanion}
        activeOpacity={0.7}
      >
        <Ionicons
          name="search"
          size={22}
          color={
            hasText
              ? "#6e473b"
              : "#a78d78"
          }
        />
      </TouchableOpacity>
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

    paddingLeft: 15,
    paddingRight: 5,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#291c0e",
  },

  searchButton: {
    width: 42,
    height: 44,

    justifyContent: "center",
    alignItems: "center",
  },
});