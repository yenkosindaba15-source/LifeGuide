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
  getDailyContentIndexForDate,
  getDailyDevotionalForDate,
} from "../data/dailySelector";

type DevotionalHistoryItem = {
  date: string;
  theme: string;
  title: string;
  reference: string;
  devotionalIndex: number;
};

export default function DevotionalHistory() {
  const buildHistory =
    (): DevotionalHistoryItem[] => {
      const history:
        DevotionalHistoryItem[] =
        [];

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
        const devotional =
          getDailyDevotionalForDate(
            currentDate
          );

        const devotionalIndex =
          getDailyContentIndexForDate(
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

          theme: devotional.theme,

          title: devotional.title,

          reference:
            devotional.reference,

          devotionalIndex,
        });

        currentDate.setDate(
          currentDate.getDate() - 1
        );
      }

      return history;
    };

  const history = buildHistory();

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
            Devotional History
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
              No previous devotionals yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Previous daily devotionals
              will appear here.
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
                  router.push({
                    pathname:
                      "/devotional-details",

                    params: {
                      index: String(
                        item.devotionalIndex
                      ),
                    },
                  })
                }
              >
                <View
                  style={
                    styles.cardTopRow
                  }
                >
                  <Text
                    style={styles.date}
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
                  style={
                    styles.cardTitle
                  }
                >
                  {item.title}
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

    fontSize: 28,

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

  cardTitle: {
    fontSize: 20,

    fontWeight: "bold",

    color: "#291c0e",

    marginBottom: 8,
  },

  reference: {
    fontSize: 16,

    color: "#6e473b",
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