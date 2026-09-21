import { useLocalSearchParams } from "expo-router";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

import {
    dailyDevotionals,
} from "../data/dailyContent";

export default function DevotionalDetails() {
  const { index } =
    useLocalSearchParams();

  const devotional =
    dailyDevotionals[
      Number(index)
    ];

  if (!devotional) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
          {devotional.title}
        </Text>

        <Text style={styles.reference}>
          {devotional.reference}
        </Text>

        <Text style={styles.verse}>
          {devotional.verse}
        </Text>

        <Text style={styles.message}>
          {devotional.message}
        </Text>

        <Text style={styles.prayerTitle}>
          Prayer
        </Text>

        <Text style={styles.prayer}>
          {devotional.prayer}
        </Text>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#291c0e",
    marginTop: 30,
    marginBottom: 15,
  },

  reference: {
    fontSize: 18,
    color: "#6e473b",
    fontWeight: "bold",
    marginBottom: 15,
  },

  verse: {
    fontSize: 20,
    fontStyle: "italic",
    lineHeight: 32,
    color: "#291c0e",
    marginBottom: 25,
  },

  message: {
    fontSize: 18,
    lineHeight: 30,
    color: "#291c0e",
    marginBottom: 30,
  },

  prayerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#291c0e",
    marginBottom: 10,
  },

  prayer: {
    fontSize: 18,
    lineHeight: 30,
    color: "#291c0e",
  },
});