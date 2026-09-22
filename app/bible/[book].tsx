import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BIBLE_CHAPTERS } from "../../src/data/bibleChapters";

export default function BookScreen() {
  const { book } =
    useLocalSearchParams<{
      book: string;
    }>();

  const chapterCount =
    BIBLE_CHAPTERS[book] ?? 0;

  const chapters = Array.from(
    { length: chapterCount },
    (_, index) => index + 1
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {book}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <Text style={styles.subtitle}>
          Select a Chapter
        </Text>

        <View style={styles.grid}>
          {chapters.map(
            (chapterNumber) => (
              <TouchableOpacity
                key={chapterNumber}
                style={styles.chapterBlock}
                onPress={() =>
                  router.push({
                    pathname:
                      "/bible/chapter/[chapter]",
                    params: {
                      book,
                      chapter: String(
                        chapterNumber
                      ),
                    },
                  })
                }
              >
                <Text
                  style={
                    styles.chapterText
                  }
                >
                  {chapterNumber}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
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

  header: {
    minHeight: 100,
    paddingTop: 35,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 55,
    color: "#6e473b",
    lineHeight: 45,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    color: "#291c0e",
  },

  headerSpace: {
    width: 45,
  },

  subtitle: {
    textAlign: "center",
    color: "#6e473b",
    fontSize: 18,
    marginBottom: 25,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:
      "space-between",
  },

  chapterBlock: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  chapterText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#291c0e",
  },
});