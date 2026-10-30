import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  auth,
  db,
} from "../src/services/firebase";

type Highlight = {
  id: string;
  verse?: string;
  reference?: string;
  book?: string;
  chapter?: number;
  verseNumber?: number;
  savedAt?: unknown;
};

export default function Highlights() {
  const [
    highlights,
    setHighlights,
  ] = useState<Highlight[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadHighlights =
    async () => {
      try {
        setLoading(true);

        const user =
          auth.currentUser;

        if (!user) {
          return;
        }

        const snapshot =
          await getDocs(
            collection(
              db,
              "users",
              user.uid,
              "highlights"
            )
          );

        const data: Highlight[] =
          snapshot.docs.map(
            (document) => ({
              id: document.id,

              ...(
                document.data() as
                  Omit<
                    Highlight,
                    "id"
                  >
              ),
            })
          );

        data.sort((first, second) => {
          return (
            getDateValue(
              second.savedAt
            ) -
            getDateValue(
              first.savedAt
            )
          );
        });

        setHighlights(data);
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Error",
          "Unable to load highlights."
        );
      } finally {
        setLoading(false);
      }
    };

  useFocusEffect(
    useCallback(() => {
      loadHighlights();
    }, [])
  );

  const deleteHighlight =
    async (
      highlightId: string
    ) => {
      try {
        const user =
          auth.currentUser;

        if (!user) {
          return;
        }

        await deleteDoc(
          doc(
            db,
            "users",
            user.uid,
            "highlights",
            highlightId
          )
        );

        setHighlights(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                highlightId
            )
        );
      } catch (error) {
        console.log(error);

        Alert.alert(
          "Error",
          "Unable to remove highlight."
        );
      }
    };

  const confirmDelete = (
    highlight: Highlight
  ) => {
    Alert.alert(
      "Remove Highlight",
      `Remove ${
        highlight.reference ||
        "this verse"
      } from your highlights?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            deleteHighlight(
              highlight.id
            ),
        },
      ]
    );
  };

  const openHighlight = (
    highlight: Highlight
  ) => {
    if (
      !highlight.book ||
      !highlight.chapter
    ) {
      Alert.alert(
        "Unavailable",
        "This highlight was created before chapter navigation was added."
      );

      return;
    }

    router.push({
      pathname:
        "/bible/chapter/[chapter]",

      params: {
        book: highlight.book,

        chapter:
          String(
            highlight.chapter
          ),

        targetVerse:
          highlight.verseNumber
            ? String(
                highlight.verseNumber
              )
            : "",
      },
    });
  };

  return (
  <SafeAreaView
    style={styles.container}
    edges={[
      "top",
      "left",
      "right",
      "bottom",
    ]}
  >
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.back()
        }
      >
        <Text
          style={styles.backText}
        >
          ‹
        </Text>
      </TouchableOpacity>

      <Text
        style={styles.headerTitle}
      >
        My Highlights
      </Text>

      <View
        style={styles.headerSpace}
      />
    </View>

    <View
      style={styles.reportSummary}
    >
      <Text
        style={styles.reportLabel}
      >
        Total Saved Highlights
      </Text>

      <Text
        style={styles.reportValue}
      >
        {loading
          ? "..."
          : highlights.length}
      </Text>
    </View>

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
          styles.highlightsContainer
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6e473b"
          />
        ) : highlights.length >
          0 ? (
          highlights.map(
            (item) => (
              <View
                key={item.id}
                style={
                  styles.highlightCard
                }
              >
                <View
                  style={
                    styles.cardHeader
                  }
                >
                  <Text
                    style={
                      styles.reference
                    }
                  >
                    {item.reference ||
                      "Saved Verse"}
                  </Text>

                  <Text
                    style={
                      styles.savedDate
                    }
                  >
                    {formatDate(
                      item.savedAt
                    )}
                  </Text>
                </View>

                <Text
                  style={styles.verse}
                >
                  “{item.verse}”
                </Text>

                <View
                  style={
                    styles.buttonRow
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.openButton
                    }
                    onPress={() =>
                      openHighlight(
                        item
                      )
                    }
                  >
                    <Text
                      style={
                        styles.openButtonText
                      }
                    >
                      Open Verse
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.deleteButton
                    }
                    onPress={() =>
                      confirmDelete(
                        item
                      )
                    }
                  >
                    <Text
                      style={
                        styles.deleteButtonText
                      }
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )
        ) : (
          <View
            style={styles.emptyCard}
          >
            <Text
              style={
                styles.emptyTitle
              }
            >
              No saved highlights yet.
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Save verses while reading
              the Bible and they will
              appear here.
            </Text>

            <TouchableOpacity
              style={
                styles.bibleButton
              }
              onPress={() =>
                router.push(
                  "/(tabs)/bible"
                )
              }
            >
              <Text
                style={
                  styles.bibleButtonText
                }
              >
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

const getDateValue = (
  value: unknown
): number => {
  if (!value) {
    return 0;
  }

  if (typeof value === "string") {
    const result =
      new Date(value).getTime();

    return Number.isNaN(result)
      ? 0
      : result;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate === "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    )
      .toDate()
      .getTime();
  }

  return 0;
};

const formatDate = (
  value: unknown
): string => {
  const milliseconds =
    getDateValue(value);

  if (!milliseconds) {
    return "Date unavailable";
  }

  return new Date(
    milliseconds
  ).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  content: {
    paddingTop: 15,
    paddingBottom: 60,
},

  header: {
    height: 70,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
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

  reportSummary: {
    width: "88%",
    alignSelf: "center",

    minHeight: 66,

    marginTop: 5,
    marginBottom: 5,

    paddingHorizontal: 18,

    backgroundColor: "#f8f4ef",

    borderWidth: 1,
    borderColor: "#beb5a9",

    borderRadius: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",
  },

  reportLabel: {
    color: "#6e473b",

    fontSize: 16,

    fontWeight: "600",
  },

  reportValue: {
    color: "#291c0e",

    fontSize: 25,

    fontWeight: "bold",
  },

  highlightsContainer: {
    width: "88%",

    alignSelf: "center",

    marginTop: 5,
  },

  highlightCard: {
    backgroundColor: "#f8f4ef",

    borderRadius: 18,

    padding: 20,

    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "flex-start",

    gap: 10,

    marginBottom: 14,
  },

  reference: {
    flex: 1,

    fontSize: 18,

    fontWeight: "bold",

    color: "#6e473b",
  },

  savedDate: {
    color: "#8c7665",

    fontSize: 13,

    textAlign: "right",
  },

  verse: {
    fontSize: 22,

    fontStyle: "italic",

    lineHeight: 34,

    color: "#291c0e",

    marginBottom: 15,
  },

  buttonRow: {
    flexDirection: "row",

    marginTop: 5,

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
    color: "#ffffff",

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

    textAlign: "center",
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
    color: "#ffffff",

    fontWeight: "bold",
  },
});