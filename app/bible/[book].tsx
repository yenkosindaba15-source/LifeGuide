import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { BIBLE_CHAPTERS } from "../../src/data/bibleChapters";

export default function BookScreen() {
  const { book } = useLocalSearchParams();

  console.log("Book:", book);
  console.log(
    "CHAPTERS:",
    BIBLE_CHAPTERS[book as string]
  );

  const chapterCount =
    BIBLE_CHAPTERS[book as string] || 1;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {book}
      </Text>

      {Array.from(
        { length: chapterCount },
        (_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chapterCard}
            onPress={() =>
              router.push({
                pathname:
                  "/bible/chapter/[chapter]",
                params: {
                  book,
                  chapter: String(index + 1),
                },
              })
            }
          >
            <Text style={styles.chapterText}>
              Chapter {index + 1}
            </Text>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
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
    marginVertical: 30,
  },

  chapterCard: {
    backgroundColor: "#f8f4ef",
    padding: 18,
    marginBottom: 10,
    borderRadius: 14,
  },

  chapterText: {
    fontSize: 18,
    color: "#291c0e",
  },
});