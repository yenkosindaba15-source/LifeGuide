import { router } from "expo-router";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { dailyDevotionals } from "../data/dailyContent";

export default function DevotionalHistory() {
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

      const devotional =
        dailyDevotionals[
          dayNumber %
            dailyDevotionals.length
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
        devotional,
      });

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    return history;
  };

  const history = buildHistory();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Devotional History
        </Text>

        {history.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname:
                    "/devotional-details",
                  params: {
                    index: String(
                      dailyDevotionals.findIndex(
                        (devotional) =>
                          devotional.title ===
                          item.devotional.title
                      )
                    ),
                  },
                })
              }
            >
              <Text style={styles.date}>
                {item.date}
              </Text>

              <Text style={styles.cardTitle}>
                {item.devotional.title}
              </Text>

              <Text style={styles.reference}>
                {
                  item.devotional.reference
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
});
