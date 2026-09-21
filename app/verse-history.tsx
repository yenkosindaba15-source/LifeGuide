import { router } from "expo-router";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

import {
    dailyHomeContent,
} from "../data/dailyContent";

export default function VerseHistory() {
  const openVerse = (
    reference: string
  ) => {
    const match = reference.match(
      /^(.*?)\s+(\d+):(\d+)$/
    );

    if (!match) {
      return;
    }

    const book = match[1];
    const chapter = match[2];
    const verse = match[3];

    router.push({
      pathname:
        "/bible/chapter/[chapter]",
      params: {
        book,
        chapter,
        targetVerse: verse,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Verse History
        </Text>

        {dailyHomeContent.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                openVerse(
                  item.reference
                )
              }
            >
              <Text style={styles.verse}>
                "{item.verse}"
              </Text>

              <Text
                style={
                  styles.reference
                }
              >
                {item.reference}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#291c0e",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#f8f4ef",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  verse: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#291c0e",
    marginBottom: 12,
    lineHeight: 28,
  },

  reference: {
    fontSize: 16,
    color: "#6e473b",
    fontWeight: "bold",
  },
});