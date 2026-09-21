import { router } from "expo-router";
import { collection, deleteDoc, doc, getDocs, } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { auth, db } from "../src/services/firebase";

type Highlight = {
  id: string;
  verse?: string;
  reference?: string;
  book?: string;
  chapter?: number;
  verseNumber?: number;
};

export default function Highlights() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {loadHighlights();}, []);

  const loadHighlights = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(
        collection(db,"users",user.uid,"highlights"));

      const data: Highlight[] = snapshot.docs.map(
        (document) => ({id: document.id,...(document.data() as Omit<Highlight, "id">),}));
      setHighlights(data);
    } catch (error) {
      console.log(error);

      Alert.alert("Error","Unable to load highlights.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHighlight = async (highlightId: string) => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      await deleteDoc(
        doc(db,"users",user.uid,"highlights",highlightId));

      setHighlights((current) =>current.filter((item) => item.id !== highlightId));
    } catch (error) {
      console.log(error);

      Alert.alert("Error","Unable to remove highlight.");
    }
  };

  const openHighlight = (highlight: Highlight) => {

    if (!highlight.book || !highlight.chapter) {
      Alert.alert("Unavailable","This highlight was created before chapter navigation was added.");
      return;
    }

    router.push({pathname:"/bible/chapter/[chapter]",params: {
        book: highlight.book,
        chapter: String( highlight.chapter),
        targetVerse: highlight.verseNumber ? String(highlight.verseNumber) : "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            My Highlights
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* HIGHLIGHTS */}

        <View style={styles.highlightsContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6e473b"
            />
          ) : highlights.length > 0 ? (
            highlights.map((item) => (
              <View
                key={item.id}
                style={styles.highlightCard}
              >
                <Text style={styles.verse}>
                  "{item.verse}"
                </Text>

                <Text style={styles.reference}>
                  {item.reference}
                </Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => openHighlight(item)}
                  >
                    <Text style={styles.openButtonText}>
                      Open Verse
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteHighlight(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No saved highlights yet.
              </Text>

              <Text style={styles.emptyText}>
                Save verses while reading the
                Bible and they will appear here.
              </Text>

              <TouchableOpacity
                style={styles.bibleButton}
                onPress={() =>
                  router.push(
                    "/(tabs)/bible"
                  )
                }
              >
                <Text style={styles.bibleButtonText}>
                  Open Bible
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    paddingBottom: 80,
  },

  header: {
    height: 70,
    marginTop: 35,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 60,
    color: "#6e473b",
    lineHeight: 42,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#291c0e",
  },

  headerSpace: {
    width: 45,
  },

  highlightsContainer: {
    width: "88%",
    alignSelf: "center",
    marginTop: 40,
  },

  highlightCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  verse: {
    fontSize: 22,
    fontStyle: "italic",
    lineHeight: 34,
    color: "#291c0e",
    marginBottom: 15,
  },

  reference: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6e473b",
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },

  openButton: {
    flex: 1,
    backgroundColor: "#6e473b",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  openButtonText: {
    color: "white",
    fontWeight: "600",
  },

  deleteButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#c62828",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#c62828",
    fontWeight: "600",
  },

  emptyCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#291c0e",
  },

  emptyText: {
    textAlign: "center",
    color: "#6e473b",
    marginTop: 10,
    lineHeight: 24,
  },

  bibleButton: {
    backgroundColor: "#6e473b",
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  bibleButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});