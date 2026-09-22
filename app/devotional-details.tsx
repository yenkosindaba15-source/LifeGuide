import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { dailyDevotionals } from "../data/dailyContent";

export default function DevotionalDetails() {
  const { index } =
    useLocalSearchParams<{
      index?: string;
    }>();

  const devotionalIndex = Number(
    index ?? -1
  );

  const devotional =
    dailyDevotionals[devotionalIndex];

  if (!devotional) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Devotional
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Devotional unavailable
          </Text>

          <Text style={styles.errorText}>
            This devotional could not be
            opened.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
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

          <Text style={styles.headerTitle}>
            Devotional
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Devotional */}

        <Text style={styles.title}>
          {devotional.title}
        </Text>

        <Text style={styles.verse}>
          “{devotional.verse}”
        </Text>

        <Text style={styles.reference}>
          {devotional.reference}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          Message
        </Text>

        <Text style={styles.message}>
          {devotional.message}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
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
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  header: {
    minHeight: 100,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "600",
    color: "#291c0e",
    textAlign: "center",
  },

  headerSpace: {
    width: 45,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#291c0e",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  verse: {
    fontSize: 21,
    fontStyle: "italic",
    lineHeight: 33,
    color: "#291c0e",
    textAlign: "center",
    marginBottom: 15,
  },

  reference: {
    color: "#6e473b",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  divider: {
    height: 2,
    backgroundColor: "#beb5a9",
    marginVertical: 35,
  },

  sectionTitle: {
    color: "#6e473b",
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 15,
  },

  message: {
    color: "#291c0e",
    fontSize: 18,
    lineHeight: 31,
  },

  prayer: {
    color: "#291c0e",
    fontSize: 18,
    lineHeight: 31,
  },

  errorCard: {
    width: "88%",
    alignSelf: "center",
    backgroundColor: "#f8f4ef",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginTop: 40,
  },

  errorTitle: {
    color: "#291c0e",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 10,
  },

  errorText: {
    color: "#6e473b",
    fontSize: 16,
    textAlign: "center",
  },
});