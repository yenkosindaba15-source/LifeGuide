import { router } from "expo-router";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import {
    dailyDevotionals,
} from "../data/dailyContent";

export default function DevotionalHistory() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Devotional History
        </Text>

        {dailyDevotionals.map(
          (devotional, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname:
                    "/devotional-details",
                  params: {
                    index: String(index),
                  },
                })
              }
            >
              <Text style={styles.cardTitle}>
                {devotional.title}
              </Text>

              <Text style={styles.reference}>
                {devotional.reference}
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