import { router } from "expo-router";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import { dailyHomeContent } from "../data/dailyContent";

export default function VerseHistory() {
  const buildHistory = () => {
    const today = new Date();

    const startOfYear = new Date(
      today.getFullYear(),
      0,
      1
    );

    const history = [];

    let currentDate = new Date(today);

    while (currentDate >= startOfYear) {
      const dayNumber = Math.floor(
        (
          currentDate.getTime() -
          startOfYear.getTime()
        ) /
          (1000 * 60 * 60 * 24)
      );

      const content =
        dailyHomeContent[
          dayNumber %
            dailyHomeContent.length
        ];

      history.push({
        date: currentDate.toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
        content,
      });

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    return history;
  };

  const history = buildHistory();

  const openVerse = (
    reference: string
  ) => {
    const match = reference.match(
      /^(.*?)\s+(\d+):(\d+)$/
    );

    if (!match) {
      return;
    }

    router.push({
      pathname:
        "/bible/chapter/[chapter]",
      params: {
        book: match[1],
        chapter: match[2],
        targetVerse: match[3],
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.title}>
          Verse History
        </Text>

        {history.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                openVerse(
                  item.content.reference
                )
              }
            >
              <Text style={styles.date}>
                {item.date}
              </Text>

              <Text style={styles.verse}>
                "{item.content.verse}"
              </Text>

              <Text
                style={
                  styles.reference
                }
              >
                {
                  item.content
                    .reference
                }
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

  date: {
    fontSize: 14,
    color: "#6e473b",
    fontWeight: "bold",
    marginBottom: 10,
  },

  verse: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#291c0e",
    lineHeight: 28,
    marginBottom: 12,
  },

  reference: {
    fontSize: 16,
    color: "#6e473b",
    fontWeight: "bold",
  },
});