import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getChapter } from "../../../src/services/bibleService";
import { auth, db } from "../../../src/services/firebase";

type BibleVerse = {
  book_id?: string;
  book_name?: string;
  chapter: number;
  verse: number;
  text: string;
};

export default function ChapterReader() {
  const params = useLocalSearchParams<{
    book?: string;
    chapter?: string;
    targetVerse?: string;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);

  const book = String(params.book ?? "");
  const chapter = String(params.chapter ?? "");

  const targetVerse = params.targetVerse
    ? Number(params.targetVerse)
    : null;

  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [selectedVerse, setSelectedVerse] =
    useState<BibleVerse | null>(null);
  const [savedVerseNumbers, setSavedVerseNumbers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!book || !chapter) {
      setErrorMessage("Book or chapter information is missing.");
      setLoading(false);
      return;
    }

    loadScreen();
  }, [book, chapter]);

  const loadScreen = async () => {
    setSelectedVerse(null);

    await Promise.all([
      loadChapter(),
      loadSavedVerses(),
      saveReadingProgress(),
    ]);
  };

  const loadChapter = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getChapter(book, chapter);

      if (data?.verses && Array.isArray(data.verses)) {
        setVerses(data.verses);

        if (targetVerse) {
          const openedVerse = data.verses.find(
            (verse: BibleVerse) =>
              Number(verse.verse) === targetVerse
          );

          if (openedVerse) {
            setSelectedVerse(openedVerse);
          }
        }
      } else {
        setVerses([]);
        setErrorMessage("This chapter could not be loaded.");
      }
    } catch (error) {
      console.log("Chapter loading error:", error);

      setErrorMessage(
        "This chapter could not be loaded. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSavedVerses = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      const snapshot = await getDocs(
        collection(db, "users", user.uid, "highlights")
      );

      const numbers = snapshot.docs
        .map((highlightDocument) => {
          const highlight = highlightDocument.data();

          const sameBook = highlight.book === book;
          const sameChapter =
            Number(highlight.chapter) === Number(chapter);

          if (
            sameBook &&
            sameChapter &&
            highlight.verseNumber
          ) {
            return Number(highlight.verseNumber);
          }

          return null;
        })
        .filter(
          (number): number is number => number !== null
        );

      setSavedVerseNumbers(numbers);
    } catch (error) {
      console.log("Saved verse loading error:", error);
    }
  };

  const saveReadingProgress = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "readingProgress",
          "current"
        ),
        {
          book,
          chapter: Number(chapter),
          reference: `${book} ${chapter}`,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );
    } catch (error) {
      console.log("Reading progress error:", error);
    }
  };

  const selectVerse = (verse: BibleVerse) => {
    const selectedNumber = Number(selectedVerse?.verse);
    const pressedNumber = Number(verse.verse);

    if (
      selectedVerse &&
      selectedNumber === pressedNumber
    ) {
      setSelectedVerse(null);
      return;
    }

    setSelectedVerse(verse);
  };

  const saveSelectedVerse = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert(
          "Not Logged In",
          "Please log in before saving a verse."
        );

        return;
      }

      if (!selectedVerse) {
        return;
      }

      const verseNumber = Number(selectedVerse.verse);

      if (savedVerseNumbers.includes(verseNumber)) {
        Alert.alert(
          "Already Saved",
          `${book} ${chapter}:${verseNumber} is already in your highlights.`
        );

        return;
      }

      setSaving(true);

      const highlightId = createHighlightId(
        book,
        chapter,
        verseNumber
      );

      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "highlights",
          highlightId
        ),
        {
          book,
          chapter: Number(chapter),
          verseNumber,
          verse: selectedVerse.text.trim(),
          reference: `${book} ${chapter}:${verseNumber}`,
          savedAt: serverTimestamp(),
        }
      );

      setSavedVerseNumbers((currentNumbers) => [
        ...currentNumbers,
        verseNumber,
      ]);

      Alert.alert(
        "Verse Saved",
        `${book} ${chapter}:${verseNumber} was added to your highlights.`
      );

      setSelectedVerse(null);
    } catch (error) {
      console.log("Save verse error:", error);

      Alert.alert(
        "Unable to Save",
        "The verse could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const createHighlightId = (
    bookName: string,
    chapterNumber: string,
    verseNumber: number
  ) => {
    return `${bookName}-${chapterNumber}-${verseNumber}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const openPreviousChapter = () => {
    const currentChapter = Number(chapter);

    if (currentChapter <= 1) {
      Alert.alert(
        "First Chapter",
        `You are already at the first chapter of ${book}.`
      );

      return;
    }

    router.replace({
      pathname: "/bible/chapter/[chapter]",
      params: {
        book,
        chapter: String(currentChapter - 1),
      },
    });
  };

  const openNextChapter = () => {
    router.replace({
      pathname: "/bible/chapter/[chapter]",
      params: {
        book,
        chapter: String(Number(chapter) + 1),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#6e473b"
        />

        <Text style={styles.loadingText}>
          Loading {book} {chapter}...
        </Text>
      </View>
    );
  }

  const selectedVerseNumber = selectedVerse
    ? Number(selectedVerse.verse)
    : null;

  const selectedVerseIsSaved =
    selectedVerseNumber !== null &&
    savedVerseNumbers.includes(selectedVerseNumber);

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          selectedVerse && styles.contentWithActionBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {book} {chapter}
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {!errorMessage && (
          <Text style={styles.instruction}>
            Tap a verse to select it
          </Text>
        )}

        {/* Error */}
        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadChapter}
            >
              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.scripture}>
            {verses.map((verse) => {
              const verseNumber = Number(verse.verse);

              const isSelected =
                selectedVerseNumber === verseNumber;

              const isSaved =
                savedVerseNumbers.includes(verseNumber);

              return (
                <TouchableOpacity
                  key={`${chapter}-${verseNumber}`}
                  activeOpacity={0.75}
                  style={[
                    styles.verseRow,
                    isSelected && styles.selectedVerseRow,
                  ]}
                  onPress={() => selectVerse(verse)}
                >
                  <Text style={styles.verseText}>
                    <Text
                      style={[
                        styles.verseNumber,
                        isSelected &&
                          styles.selectedVerseNumber,
                      ]}
                    >
                      {verseNumber}{" "}
                    </Text>

                    {verse.text.trim()}
                  </Text>

                  {isSaved && (
                    <Text style={styles.savedIndicator}>
                      SAVED
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Chapter Navigation */}
        {!errorMessage && verses.length > 0 && (
          <View style={styles.chapterNavigation}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={openPreviousChapter}
            >
              <Text style={styles.navigationButtonText}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navigationButton}
              onPress={openNextChapter}
            >
              <Text style={styles.navigationButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Save Action Bar */}
      {selectedVerse && (
        <View style={styles.actionBar}>
          <View style={styles.selectedReferenceArea}>
            <Text style={styles.selectedReference}>
              {book} {chapter}:{selectedVerse.verse}
            </Text>

            <Text style={styles.selectedInstruction}>
              Tap the verse again to deselect it
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              selectedVerseIsSaved && styles.savedButton,
            ]}
            onPress={saveSelectedVerse}
            disabled={saving || selectedVerseIsSaved}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? "Saving..."
                : selectedVerseIsSaved
                  ? "Saved"
                  : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  contentWithActionBar: {
    paddingBottom: 170,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#e1d4c2",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#6e473b",
    fontSize: 17,
    marginTop: 15,
  },

  header: {
    minHeight: 90,
    paddingTop: 25,
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

  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#291c0e",
  },

  headerSpace: {
    width: 45,
  },

  instruction: {
    textAlign: "center",
    fontSize: 14,
    color: "#6e473b",
    marginBottom: 25,
  },

  scripture: {
    backgroundColor: "#f8f4ef",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  verseRow: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },

  selectedVerseRow: {
    backgroundColor: "#dac69b",
  },

  verseText: {
    fontSize: 19,
    lineHeight: 32,
    color: "#291c0e",
  },

  verseNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6e473b",
  },

  selectedVerseNumber: {
    color: "#291c0e",
  },

  savedIndicator: {
    alignSelf: "flex-end",
    color: "#6e473b",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 4,
  },

  errorCard: {
    backgroundColor: "#f8f4ef",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginTop: 20,
  },

  errorText: {
    color: "#6e473b",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: "#6e473b",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginTop: 20,
  },

  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  chapterNavigation: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },

  navigationButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6e473b",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  navigationButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 92,
    backgroundColor: "#f8f4ef",
    borderTopWidth: 1,
    borderTopColor: "#beb5a9",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedReferenceArea: {
    flex: 1,
    paddingRight: 15,
  },

  selectedReference: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#291c0e",
  },

  selectedInstruction: {
    fontSize: 12,
    color: "#6e473b",
    marginTop: 3,
  },

  saveButton: {
    minWidth: 100,
    height: 48,
    backgroundColor: "#6e473b",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  savedButton: {
    backgroundColor: "#8c7665",
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },
});