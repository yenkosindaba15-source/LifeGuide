import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  NEW_TESTAMENT,
  OLD_TESTAMENT,
} from "../../src/data/bibleBooks";

export default function Bible() {
  const [searchText, setSearchText] =
    useState("");

  const normalizedSearch =
    searchText.trim().toLowerCase();

  const filteredOldTestament = useMemo(() => {
    if (!normalizedSearch) {
      return OLD_TESTAMENT;
    }

    return OLD_TESTAMENT.filter((book) =>
      book
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const filteredNewTestament = useMemo(() => {
    if (!normalizedSearch) {
      return NEW_TESTAMENT;
    }

    return NEW_TESTAMENT.filter((book) =>
      book
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [normalizedSearch]);

  const hasResults =
    filteredOldTestament.length > 0 ||
    filteredNewTestament.length > 0;

  const openBook = (book: string) => {
    router.push({
      pathname: "/bible/[book]",
      params: { book },
    });
  };

  const renderBook = (book: string) => (
    <TouchableOpacity
      key={book}
      style={styles.bookCard}
      onPress={() => openBook(book)}
    >
      <Text style={styles.bookText}>
        {book}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
          <Text style={styles.title}>
            Holy Bible
          </Text>

        {/* Search */}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Bible book..."
            placeholderTextColor="#a78d78"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />

          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchText("")}
            >
              <Text style={styles.clearText}>
                ×
              </Text>
            </TouchableOpacity>
          ):(
            <Ionicons name="search" size={22} color="#6e473b" />
          )}
        </View>

        {normalizedSearch ? (
          <>
            <Text style={styles.resultsText}>
              Results for "
              {searchText.trim()}
              "
            </Text>

            {!hasResults ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  No Bible book found
                </Text>

                <Text style={styles.emptyText}>
                  Try searching for
                  "John", "Isa", or
                  "Sam".
                </Text>
              </View>
            ) : (
              <>
                {filteredOldTestament.length >
                  0 && (
                  <>
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      OLD TESTAMENT
                    </Text>

                    {filteredOldTestament.map(
                      renderBook
                    )}
                  </>
                )}

                {filteredNewTestament.length >
                  0 && (
                  <>
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      NEW TESTAMENT
                    </Text>

                    {filteredNewTestament.map(
                      renderBook
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Text
              style={styles.sectionTitle}
            >
              OLD TESTAMENT
            </Text>

            {OLD_TESTAMENT.map(
              renderBook
            )}

            <Text
              style={styles.sectionTitle}
            >
              NEW TESTAMENT
            </Text>

            {NEW_TESTAMENT.map(
              renderBook
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  content: {
    paddingBottom: 120,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#291c0e",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
  },

  searchContainer: {
    marginBottom: 35,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#291c0e",
  },

  clearButton: {
    width: 40,
    height: 40,

    justifyContent: "center",

    alignItems: "center",
  },

  clearText: {
    fontSize: 26,
    color: "#6e473b",
  },

  resultsText: {
    color: "#6e473b",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    letterSpacing: 2,
    color: "#6e473b",
    marginBottom: 15,
    marginTop: 20,
    fontWeight: "600",
  },

  bookCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  bookText: {
    fontSize: 18,
    color: "#291c0e",
  },

  emptyCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#291c0e",
    marginBottom: 10,
  },

  emptyText: {
    color: "#6e473b",
    textAlign: "center",
  },
});