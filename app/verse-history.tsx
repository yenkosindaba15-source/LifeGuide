import { router } from "expo-router";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  DAILY_CONTENT_START_DATE,
  getDailyHomeContentForDate,
} from "../data/dailySelector";

type VerseHistoryItem = {
  date: string;
  theme: string;
  verse: string;
  reference: string;
};

export default function VerseHistory() {
  const buildHistory = (): VerseHistoryItem[] => {
    const history: VerseHistoryItem[] = [];

    const today = new Date();

    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1
    );

    const startDate = new Date(
      DAILY_CONTENT_START_DATE.getFullYear(),
      DAILY_CONTENT_START_DATE.getMonth(),
      DAILY_CONTENT_START_DATE.getDate()
    );

    while (
      currentDate.getTime() >=
      startDate.getTime()
    ) {
      const content =
        getDailyHomeContentForDate(
          currentDate
        );

      history.push({
        date:
          currentDate.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),

        theme: content.theme,

        verse: content.verse,

        reference:
          content.reference,
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
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backText}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Verse History
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        {history.length === 0 ? (
          <View
            style={styles.emptyCard}
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              No previous verses yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Previous Verse of the Day
              entries will appear here.
            </Text>
          </View>
        ) : (
          history.map(
            (item, index) => (
              <TouchableOpacity
                key={`${item.date}-${index}`}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() =>
                  openVerse(
                    item.reference
                  )
                }
              >
                <View
                  style={
                    styles.cardTopRow
                  }
                >
                  <Text
                    style={
                      styles.date
                    }
                  >
                    {item.date}
                  </Text>

                  <View
                    style={
                      styles.themeBadge
                    }
                  >
                    <Text
                      style={
                        styles.themeText
                      }
                    >
                      {item.theme}
                    </Text>
                  </View>
                </View>

                <Text
                  style={styles.verse}
                >
                  “{item.verse}”
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
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  header: {
    minHeight: 105,
    paddingTop: 35,

    flexDirection: "row",
    alignItems: "center",

    justifyContent:
      "space-between",
  },

  backButton: {
    width: 45,
    height: 50,

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

    fontSize: 30,
    fontWeight: "bold",

    color: "#291c0e",

    textAlign: "center",
  },

  headerSpace: {
    width: 45,
  },

  card: {
    backgroundColor: "#f8f4ef",

    borderWidth: 1,
    borderColor: "#beb5a9",

    borderRadius: 16,

    padding: 18,

    marginBottom: 14,
  },

  cardTopRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 12,
  },

  date: {
    fontSize: 14,

    color: "#6e473b",

    fontWeight: "bold",
  },

  themeBadge: {
    backgroundColor: "#e1d4c2",

    paddingHorizontal: 11,
    paddingVertical: 5,

    borderRadius: 14,
  },

  themeText: {
    color: "#6e473b",

    fontSize: 12,

    fontWeight: "600",
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

  emptyCard: {
    marginTop: 40,

    backgroundColor: "#f8f4ef",

    borderRadius: 16,

    padding: 25,

    alignItems: "center",
  },

  emptyTitle: {
    color: "#291c0e",

    fontSize: 20,

    fontWeight: "bold",

    marginBottom: 8,
  },

  emptyText: {
    color: "#6e473b",

    fontSize: 16,

    textAlign: "center",

    lineHeight: 24,
  },
});