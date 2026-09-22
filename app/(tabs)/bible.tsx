import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  NEW_TESTAMENT,
  OLD_TESTAMENT,
} from "../../src/data/bibleBooks";

export default function Bible() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Holy Bible</Text>

      <Text style={styles.sectionTitle}>OLD TESTAMENT</Text>

      {OLD_TESTAMENT.map((book) => (
        <TouchableOpacity
          key={book}
          style={styles.bookCard}
          onPress={() =>
            router.push({
              pathname: "/bible/[book]",
              params: { book },
            })
          }
        >
          <Text style={styles.bookText}>{book}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>NEW TESTAMENT</Text>

      {NEW_TESTAMENT.map((book) => (
        <TouchableOpacity
          key={book}
          style={styles.bookCard}
          onPress={() =>
            router.push({
              pathname: "/bible/[book]",
              params: { book },
            })
          }
        >
          <Text style={styles.bookText}>{book}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#291c0e",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 20,
    letterSpacing: 2,
    color: "#6e473b",
    marginBottom: 15,
    marginTop: 20,
    fontWeight: "600",
  },

  bookCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  bookText: {
    fontSize: 18,
    color: "#291c0e",
  },
});