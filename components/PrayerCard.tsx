import { StyleSheet, Text, View } from "react-native";
import { getDailyHomeContent } from "../data/dailySelector";

export default function PrayerCard() {
  const daily = getDailyHomeContent();
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        PRAYER OF THE DAY
      </Text>

      <View style={styles.line} />

      <Text style={styles.prayer}>
        {daily.prayer}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },

  title: {
    fontSize: 20,
    letterSpacing: 3,
    color: "#6e473b",
    marginBottom: 10,
  },

  line: {
    width: 220,
    height: 5,
    backgroundColor: "#a78d78",
    borderRadius: 5,
    marginBottom: 25,
  },

  prayer: {
    fontSize: 20,
    color: "#291c0e",
    lineHeight: 34,
  },

});