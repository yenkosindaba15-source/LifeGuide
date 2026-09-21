import { router } from "expo-router";
import { addDoc, collection, getDocs, query, where, } from "firebase/firestore";
import { Alert, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { getDailyHomeContent } from "../data/dailySelector";
import { auth, db } from "../src/services/firebase";

export default function VerseCard() {
  const daily = getDailyHomeContent();

  const continueReading = () => {
    const reference = daily.reference;
    const match = reference.match(/^(.*?)\s+(\d+):(\d+)$/);

    if (!match) {
      Alert.alert("Error", "Unable to open today's chapter.");
      return;
    }

    const book = match[1];
    const chapter = match[2];
    const verse = match[3];

    router.push({pathname: "/bible/chapter/[chapter]", params: {book, chapter, targetVerse: verse,},});
  };

  const saveVerse = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Not Logged In", "Please login first.");
        return;
      }

      const highlightsRef = collection(db,"users",user.uid,"highlights");

      const duplicateCheck = query(highlightsRef,
        where("reference","==",daily.reference));

      const existing = await getDocs(duplicateCheck);

      if (!existing.empty) {
        Alert.alert("Already Saved","This verse is already in your highlights.");
        return;
      }

      await addDoc(highlightsRef, {
        verse: daily.verse,
        reference: daily.reference,
        savedAt: new Date().toISOString(),
      });

      Alert.alert("Saved","Verse added to your highlights.");
    } catch (error) {
      console.log(error);

      Alert.alert("Error","Could not save verse.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        VERSE OF THE DAY
      </Text>

      <View style={styles.line} />

      <Text style={styles.verse}>
        "{daily.verse}"
      </Text>

      <Text style={styles.reference}>
        {daily.reference}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={continueReading}
      >
        <Text style={styles.buttonText}>
          Continue Reading
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveVerse}
      >
        <Text style={styles.saveButtonText}>
          Save Verse
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    maxWidth: 650,
    alignSelf: "center",
    alignItems: "center",
  },

  title: {
    color: "#6e473b",
    fontSize: 20,
    letterSpacing: 3,
    textAlign: "center",
  },

  line: {
    width: 250,
    height: 5,
    backgroundColor: "#a78d78",
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 5,
  },

  verse: {
    fontSize: 30,
    lineHeight: 45,
    color: "#291c0e",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },

  reference: {
    fontSize: 20,
    color: "#6e473b",
    fontWeight: "bold",
    marginBottom: 25,
  },

  button: {
    width: "60%",
    paddingVertical: 8,
    backgroundColor: "#6e473b",
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
  },

  saveButton: {
    width: "60%",
    paddingVertical: 8,
    backgroundColor: "#a78d78",
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 30,
  },

  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});