import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import BottomNavigation from "../../components/BottomNavigation";
import Header from "../../components/Header";

import {
  getDailyDevotional,
} from "../../data/dailySelector";

export default function Devotionals() {
  const daily =
    getDailyDevotional();

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      <Header title="Devotion." />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={
            styles.devotionContainer
          }
        >
          <Text
            style={
              styles.devotionTitle
            }
          >
            {daily.title}
          </Text>

          <Text
            style={
              styles.devotionVerse
            }
          >
            "{daily.verse}"
          </Text>

          <Text
            style={
              styles.devotionReference
            }
          >
            {daily.reference}
          </Text>

          <View
            style={styles.divider}
          />

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Today's Message
            </Text>

            <Text
              style={styles.message}
            >
              {daily.message}
            </Text>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.section}>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Prayer
            </Text>

            <Text
              style={styles.prayer}
            >
              {daily.prayer}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  content: {
    paddingBottom: 120,
  },

  devotionContainer: {
    width: "85%",
    maxWidth: 750,
    alignSelf: "center",
  },

  devotionTitle: {
    textAlign: "center",
    fontSize: 42,
    color: "#291c0e",
    marginBottom: 20,
  },

  devotionVerse: {
    textAlign: "center",
    fontSize: 28,
    fontStyle: "italic",
    color: "#291c0e",
    lineHeight: 45,
    marginBottom: 15,
  },

  devotionReference: {
    textAlign: "center",
    color: "#6e473b",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 45,
  },

  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#beb5a9",
    marginVertical: 45,
  },

  section: {
    width: "100%",
  },

  sectionTitle: {
    color: "#6e473b",
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "600",
  },

  message: {
    fontSize: 20,
    color: "#291c0e",
    lineHeight: 36,
    marginBottom: 35,
  },

  prayer: {
    fontSize: 20,
    color: "#291c0e",
    lineHeight: 36,
    marginBottom: 35,
  },
});