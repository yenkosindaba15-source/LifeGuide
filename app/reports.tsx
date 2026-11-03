import {
    router,
    useFocusEffect,
} from "expo-router";

import {
    collection,
    getDocs,
} from "firebase/firestore";

import * as Print from "expo-print";

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

import {
    getAIChats,
    SavedChat,
} from "../src/services/chatHistoryService";

import {
    getReadingHistory,
    ReadingHistoryItem,
} from "../src/services/readingHistoryService";

type HighlightReportItem = {
  id: string;
  reference: string;
  verse: string;
  savedAt?: Date;
};

export default function Reports() {
  const [
    chats,
    setChats,
  ] = useState<SavedChat[]>([]);

  const [
    highlights,
    setHighlights,
  ] = useState<
    HighlightReportItem[]
  >([]);

  const [
    readingHistory,
    setReadingHistory,
  ] = useState<
    ReadingHistoryItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    creatingPdf,
    setCreatingPdf,
  ] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports =
    async () => {
      try {
        setLoading(true);

        const user =
          auth.currentUser;

        if (!user) {
          Alert.alert(
            "Login Required",
            "Please log in before viewing your reports."
          );

          return;
        }

        const [
          savedChats,
          savedHighlights,
          savedReadingHistory,
        ] = await Promise.all([
          getAIChats(
            user.uid
          ),

          getHighlights(
            user.uid
          ),

          getReadingHistory(
            user.uid
          ),
        ]);

        setChats(savedChats);

        setHighlights(
          savedHighlights
        );

        setReadingHistory(
          savedReadingHistory
        );
      } catch (error) {
        console.log(
          "Unable to load reports:",
          error
        );

        Alert.alert(
          "Reports Error",
          "LifeGuide could not load your reports."
        );
      } finally {
        setLoading(false);
      }
    };

  const getHighlights = async (
    userId: string
  ): Promise<
    HighlightReportItem[]
  > => {
    const snapshot =
      await getDocs(
        collection(
          db,
          "users",
          userId,
          "highlights"
        )
      );

    const data =
      snapshot.docs.map(
        (highlightDocument) => {
          const highlight =
            highlightDocument.data();

          return {
            id:
              highlightDocument.id,

            reference:
              String(
                highlight.reference ??
                  "Saved Verse"
              ),

            verse:
              String(
                highlight.verse ?? ""
              ),

            savedAt:
              convertToDate(
                highlight.savedAt
              ),
          };
        }
      );

    data.sort(
      (first, second) =>
        getTimeValue(
          second.savedAt
        ) -
        getTimeValue(
          first.savedAt
        )
    );

    return data;
  };

  const createPdf = async () => {
  if (
    loading ||
    creatingPdf
  ) {
    return;
  }

  try {
    setCreatingPdf(true);

    const html =
      createReportHtml(
        chats,
        highlights,
        readingHistory
      );

    console.log(
      "Opening PDF save dialog..."
    );

    await Print.printAsync({
      html,
    });

    console.log(
      "PDF save dialog opened."
    );
  } catch (error) {
    console.log(
      "PDF report error:",
      error
    );

    Alert.alert(
      "Unable to Create PDF",
      "LifeGuide could not create the PDF report. Please try again."
    );
  } finally {
    setCreatingPdf(false);
  }
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
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹
          </Text>
        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Reports
        </Text>

        <View
          style={
            styles.headerSpace
          }
        />
      </View>

      <View
        style={
          styles.downloadArea
        }
      >
        <TouchableOpacity
          style={[
            styles.downloadButton,

            (loading ||
              creatingPdf) &&
              styles.disabledButton,
          ]}
          disabled={
            loading ||
            creatingPdf
          }
          activeOpacity={0.8}
          onPress={createPdf}
        >
          {creatingPdf ? (
            <ActivityIndicator
              size="small"
              color="#ffffff"
            />
          ) : (
            <Text
              style={
                styles.downloadButtonText
              }
            >
              Download PDF
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color="#6e473b"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading reports...
          </Text>
        </View>
      ) : (
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
              styles.reportSection
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              AI CONVERSATIONS
            </Text>

            <View
              style={
                styles.totalCard
              }
            >
              <Text
                style={
                  styles.totalLabel
                }
              >
                Total Conversations
              </Text>

              <Text
                style={
                  styles.totalValue
                }
              >
                {chats.length}
              </Text>
            </View>

            {chats.length > 0 ? (
              chats.map(
                (chat) => (
                  <View
                    key={chat.id}
                    style={
                      styles.itemCard
                    }
                  >
                    <Text
                      style={
                        styles.itemTitle
                      }
                    >
                      {chat.title}
                    </Text>

                    <Text
                      style={
                        styles.itemDate
                      }
                    >
                      {formatDate(
                        chat.createdAt ??
                          chat.updatedAt
                      )}
                    </Text>
                  </View>
                )
              )
            ) : (
              <EmptyMessage
                text="No AI conversations have been saved yet."
              />
            )}
          </View>

          <View
            style={
              styles.divider
            }
          />

          <View
            style={
              styles.reportSection
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              SAVED HIGHLIGHTS
            </Text>

            <View
              style={
                styles.totalCard
              }
            >
              <Text
                style={
                  styles.totalLabel
                }
              >
                Total Highlighted Verses
              </Text>

              <Text
                style={
                  styles.totalValue
                }
              >
                {highlights.length}
              </Text>
            </View>

            {highlights.length >
            0 ? (
              highlights.map(
                (highlight) => (
                  <View
                    key={
                      highlight.id
                    }
                    style={
                      styles.itemCard
                    }
                  >
                    <Text
                      style={
                        styles.highlightReference
                      }
                    >
                      {
                        highlight.reference
                      }
                    </Text>

                    <Text
                      style={
                        styles.highlightVerse
                      }
                    >
                      “
                      {
                        highlight.verse
                      }
                      ”
                    </Text>
                  </View>
                )
              )
            ) : (
              <EmptyMessage
                text="No Bible verses have been highlighted yet."
              />
            )}
          </View>

          <View
            style={
              styles.divider
            }
          />

          <View
            style={
              styles.reportSection
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              BIBLE READING ACTIVITY
            </Text>

            <View
              style={
                styles.totalCard
              }
            >
              <Text
                style={
                  styles.totalLabel
                }
              >
                Chapters Opened
              </Text>

              <Text
                style={
                  styles.totalValue
                }
              >
                {
                  readingHistory.length
                }
              </Text>
            </View>

            {readingHistory.length >
            0 ? (
              readingHistory.map(
                (readingItem) => (
                  <View
                    key={
                      readingItem.id
                    }
                    style={
                      styles.readingItem
                    }
                  >
                    <Text
                      style={
                        styles.readingDate
                      }
                    >
                      {formatDate(
                        readingItem.openedAt
                      )}
                    </Text>

                    <Text
                      style={
                        styles.readingReference
                      }
                    >
                      {
                        readingItem.reference
                      }
                    </Text>
                  </View>
                )
              )
            ) : (
              <EmptyMessage
                text="No Bible reading activity has been recorded yet."
              />
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

type EmptyMessageProps = {
  text: string;
};

function EmptyMessage({
  text,
}: EmptyMessageProps) {
  return (
    <View
      style={
        styles.emptyCard
      }
    >
      <Text
        style={
          styles.emptyText
        }
      >
        {text}
      </Text>
    </View>
  );
}

const convertToDate = (
  value: unknown
): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (
    value instanceof Date
  ) {
    return value;
  }

  if (
    typeof value ===
      "string" ||
    typeof value ===
      "number"
  ) {
    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? undefined
      : date;
  }

  if (
    typeof value ===
      "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate ===
      "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    ).toDate();
  }

  return undefined;
};

const getTimeValue = (
  date?: Date
): number => {
  return date?.getTime() ?? 0;
};

const formatDate = (
  date?: Date
): string => {
  if (
    !date ||
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const escapeHtml = (
  value: unknown
): string => {
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
};

const createReportHtml = (
  chats: SavedChat[],
  highlights:
    HighlightReportItem[],
  readingHistory:
    ReadingHistoryItem[]
): string => {
  const generatedDate =
    new Date()
      .toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

  const chatRows =
    chats.length > 0
      ? chats
          .map(
            (chat) => `
              <div class="item">
                <div class="item-title">
                  ${escapeHtml(
                    chat.title
                  )}
                </div>

                <div class="date">
                  ${escapeHtml(
                    formatDate(
                      chat.createdAt ??
                        chat.updatedAt
                    )
                  )}
                </div>
              </div>
            `
          )
          .join("")
      : `
        <div class="empty">
          No AI conversations have been saved yet.
        </div>
      `;

  const highlightRows =
    highlights.length > 0
      ? highlights
          .map(
            (
              highlight
            ) => `
              <div class="item">
                <div class="reference">
                  ${escapeHtml(
                    highlight.reference
                  )}
                </div>

                <div class="verse">
                  “${escapeHtml(
                    highlight.verse
                  )}”
                </div>
              </div>
            `
          )
          .join("")
      : `
        <div class="empty">
          No Bible verses have been highlighted yet.
        </div>
      `;

  const readingRows =
    readingHistory.length > 0
      ? readingHistory
          .map(
            (
              readingItem
            ) => `
              <div class="reading-row">
                <div class="date">
                  ${escapeHtml(
                    formatDate(
                      readingItem.openedAt
                    )
                  )}
                </div>

                <div class="reading-reference">
                  ${escapeHtml(
                    readingItem.reference
                  )}
                </div>
              </div>
            `
          )
          .join("")
      : `
        <div class="empty">
          No Bible reading activity has been recorded yet.
        </div>
      `;

  return `
    <!DOCTYPE html>

    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <style>
          @page {
            margin: 32px;
          }

          * {
            box-sizing:
              border-box;
          }

          body {
            margin: 0;
            padding: 0;
            color: #291c0e;
            background: #ffffff;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          .report-header {
            padding-bottom: 20px;
            margin-bottom: 24px;
            border-bottom:
              3px solid #6e473b;
          }

          h1 {
            margin: 0 0 8px 0;
            color: #291c0e;
            font-size: 30px;
          }

          .generated {
            color: #6e473b;
            font-size: 13px;
          }

          .section {
            margin-bottom: 28px;
            page-break-inside:
              auto;
          }

          h2 {
            margin:
              0 0 14px 0;
            color: #6e473b;
            font-size: 19px;
            letter-spacing: 1px;
          }

          .total {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            padding: 12px 14px;
            margin-bottom: 14px;
            background: #f8f4ef;
            border:
              1px solid #beb5a9;
            border-radius: 8px;
          }

          .total-label {
            color: #6e473b;
            font-weight: bold;
          }

          .total-value {
            color: #291c0e;
            font-size: 20px;
            font-weight: bold;
          }

          .item {
            padding: 12px 14px;
            margin-bottom: 10px;
            background: #faf8f5;
            border-left:
              4px solid #dac69b;
            page-break-inside:
              avoid;
          }

          .item-title {
            margin-bottom: 5px;
            color: #291c0e;
            font-size: 15px;
            font-weight: bold;
          }

          .reference {
            margin-bottom: 7px;
            color: #6e473b;
            font-size: 15px;
            font-weight: bold;
          }

          .verse {
            color: #291c0e;
            font-size: 14px;
            font-style: italic;
            line-height: 1.5;
          }

          .date {
            color: #8c7665;
            font-size: 12px;
          }

          .reading-row {
            display: flex;
            justify-content:
              space-between;
            align-items: center;
            padding: 11px 14px;
            margin-bottom: 8px;
            background: #faf8f5;
            border-bottom:
              1px solid #e1d4c2;
            page-break-inside:
              avoid;
          }

          .reading-reference {
            color: #291c0e;
            font-weight: bold;
          }

          .empty {
            padding: 15px;
            color: #6e473b;
            background: #f8f4ef;
            border-radius: 8px;
            text-align: center;
          }

          .separator {
            height: 1px;
            margin: 26px 0;
            background: #beb5a9;
          }

          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top:
              1px solid #beb5a9;
            color: #8c7665;
            font-size: 11px;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <div class="report-header">
          <h1>
            LifeGuide User Report
          </h1>

          <div class="generated">
            Generated:
            ${escapeHtml(
              generatedDate
            )}
          </div>
        </div>

        <div class="section">
          <h2>
            AI CONVERSATIONS
          </h2>

          <div class="total">
            <span class="total-label">
              Total Conversations
            </span>

            <span class="total-value">
              ${chats.length}
            </span>
          </div>

          ${chatRows}
        </div>

        <div class="separator"></div>

        <div class="section">
          <h2>
            SAVED HIGHLIGHTS
          </h2>

          <div class="total">
            <span class="total-label">
              Total Highlighted Verses
            </span>

            <span class="total-value">
              ${highlights.length}
            </span>
          </div>

          ${highlightRows}
        </div>

        <div class="separator"></div>

        <div class="section">
          <h2>
            BIBLE READING ACTIVITY
          </h2>

          <div class="total">
            <span class="total-label">
              Chapters Opened
            </span>

            <span class="total-value">
              ${readingHistory.length}
            </span>
          </div>

          ${readingRows}
        </div>

        <div class="footer">
          Generated by LifeGuide
        </div>
      </body>
    </html>
  `;
};

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#e1d4c2",
    },

    header: {
      minHeight: 80,

      paddingHorizontal: 20,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      backgroundColor:
        "#e1d4c2",
    },

    backButton: {
      width: 45,
      height: 50,

      justifyContent:
        "center",

      alignItems: "center",
    },

    backText: {
      fontSize: 55,

      color: "#6e473b",

      lineHeight: 45,
    },

    headerTitle: {
      flex: 1,

      color: "#291c0e",

      fontSize: 30,

      fontWeight: "bold",

      textAlign: "center",
    },

    headerSpace: {
      width: 45,
    },

    downloadArea: {
      width: "88%",

      alignSelf: "center",

      alignItems: "flex-end",

      paddingTop: 5,

      paddingBottom: 15,
    },

    downloadButton: {
      minHeight: 42,

      minWidth: 145,

      paddingHorizontal: 17,

      backgroundColor:
        "#6e473b",

      borderRadius: 12,

      justifyContent:
        "center",

      alignItems: "center",
    },

    downloadButtonText: {
      color: "#ffffff",

      fontSize: 15,

      fontWeight: "bold",
    },

    disabledButton: {
      opacity: 0.65,
    },

    loadingContainer: {
      flex: 1,

      justifyContent:
        "center",

      alignItems: "center",
    },

    loadingText: {
      color: "#6e473b",

      fontSize: 16,

      marginTop: 12,
    },

    content: {
      paddingBottom: 60,
    },

    reportSection: {
      width: "88%",

      alignSelf: "center",
    },

    sectionTitle: {
      color: "#6e473b",

      fontSize: 19,

      fontWeight: "700",

      letterSpacing: 1.5,

      marginBottom: 14,
    },

    totalCard: {
      minHeight: 64,

      paddingHorizontal: 18,

      backgroundColor:
        "#f8f4ef",

      borderWidth: 1,

      borderColor:
        "#beb5a9",

      borderRadius: 16,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 15,
    },

    totalLabel: {
      flex: 1,

      color: "#6e473b",

      fontSize: 16,

      fontWeight: "600",

      paddingRight: 10,
    },

    totalValue: {
      color: "#291c0e",

      fontSize: 25,

      fontWeight: "bold",
    },

    itemCard: {
      padding: 17,

      marginBottom: 12,

      backgroundColor:
        "#f8f4ef",

      borderRadius: 15,

      borderLeftWidth: 4,

      borderLeftColor:
        "#dac69b",
    },

    itemTitle: {
      color: "#291c0e",

      fontSize: 17,

      fontWeight: "600",

      lineHeight: 24,

      marginBottom: 7,
    },

    itemDate: {
      color: "#8c7665",

      fontSize: 13,
    },

    highlightReference: {
      color: "#6e473b",

      fontSize: 17,

      fontWeight: "bold",

      marginBottom: 9,
    },

    highlightVerse: {
      color: "#291c0e",

      fontSize: 17,

      fontStyle: "italic",

      lineHeight: 27,
    },

    readingItem: {
      minHeight: 55,

      paddingHorizontal: 17,

      paddingVertical: 12,

      marginBottom: 10,

      backgroundColor:
        "#f8f4ef",

      borderRadius: 14,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",
    },

    readingDate: {
      color: "#8c7665",

      fontSize: 13,

      maxWidth: "46%",
    },

    readingReference: {
      color: "#291c0e",

      fontSize: 16,

      fontWeight: "600",

      maxWidth: "52%",

      textAlign: "right",
    },

    emptyCard: {
      padding: 20,

      backgroundColor:
        "#f8f4ef",

      borderRadius: 15,

      alignItems: "center",
    },

    emptyText: {
      color: "#6e473b",

      fontSize: 15,

      textAlign: "center",

      lineHeight: 23,
    },

    divider: {
      width: "88%",

      height: 1,

      alignSelf: "center",

      backgroundColor:
        "#beb5a9",

      marginVertical: 30,
    },
  });