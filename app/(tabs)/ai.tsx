import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Header from "../../components/Header";
import QuickPrompts from "../../components/QuickPrompts";

import {
  askBibleCompanion,
} from "../../src/services/aiService";

import {
  createAIChat,
  deleteAIChat,
  getAIChatMessages,
  getAIChats,
  saveAIChatMessage,
  SavedChat,
} from "../../src/services/chatHistoryService";

import {
  auth,
} from "../../src/services/firebase";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type AIChatParams = {
  homeQuestion?: string;
  requestId?: string;
};

type SendQuestionOptions = {
  forceNewChat?: boolean;
};

export default function AIChat() {
  const {
    homeQuestion,
    requestId,
  } = useLocalSearchParams<AIChatParams>();

  const insets =
    useSafeAreaInsets();

  const scrollViewRef =
    useRef<ScrollView>(null);

  const handledRequestRef =
    useRef<string | null>(null);

  const sendingRef =
    useRef(false);

  const currentChatIdRef =
    useRef<string | null>(null);

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    currentChatId,
    setCurrentChatId,
  ] = useState<string | null>(null);

  const [
    currentChatTitle,
    setCurrentChatTitle,
  ] = useState<string | null>(null);

  const [
    chatHistory,
    setChatHistory,
  ] = useState<SavedChat[]>([]);

  const [
    historyVisible,
    setHistoryVisible,
  ] = useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    openingChat,
    setOpeningChat,
  ] = useState(false);

  const [
    keyboardVisible,
    setKeyboardVisible,
  ] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  const setActiveChatId = (
    chatId: string | null
  ) => {
    currentChatIdRef.current =
      chatId;

    setCurrentChatId(chatId);
  };

  const createTitle = (
    text: string
  ): string => {
    const cleaned =
      text
        .replace(/\s+/g, " ")
        .trim();

    if (cleaned.length <= 45) {
      return cleaned;
    }

    return `${cleaned.slice(
      0,
      42
    )}...`;
  };

  const getFriendlyErrorMessage = (
    error: any
  ): string => {
    const message =
      String(
        error?.message ?? ""
      ).toLowerCase();

    if (
      message.includes("network") ||
      message.includes("offline") ||
      message.includes("fetch failed")
    ) {
      return "I couldn't connect to the AI Bible Companion. Please check your internet connection and try again.";
    }

    if (
      message.includes(
        "temporarily unavailable"
      )
    ) {
      return "The AI Bible Companion is temporarily unavailable. Please try again.";
    }

    if (
      message.includes(
        "quota exceeded"
      ) ||
      message.includes(
        "resource exhausted"
      ) ||
      message.includes(
        "too many requests"
      )
    ) {
      return "The AI Bible Companion has received too many requests. Please try again shortly.";
    }

    if (
      message.includes("permission") ||
      message.includes("unauthorized")
    ) {
      return "LifeGuide does not currently have permission to complete this request.";
    }

    return "I couldn't prepare a response right now. Please try asking your question again.";
  };

  const loadChatHistory =
    async () => {
      const user =
        auth.currentUser;

      if (!user) {
        return;
      }

      try {
        setHistoryLoading(true);

        const chats =
          await getAIChats(
            user.uid
          );

        setChatHistory(chats);
      } catch (error) {
        console.log(
          "Unable to load AI chat history:",
          error
        );

        Alert.alert(
          "History Error",
          "Unable to load your chat history."
        );
      } finally {
        setHistoryLoading(false);
      }
    };

  const openHistory =
    async () => {
      setHistoryVisible(true);

      await loadChatHistory();
    };

  const startNewChat = () => {
    if (
      isLoading ||
      sendingRef.current
    ) {
      Alert.alert(
        "Please Wait",
        "Please allow the current response to finish before starting a new chat."
      );

      return;
    }

    handledRequestRef.current =
      null;

    setMessages([]);
    setQuestion("");
    setActiveChatId(null);
    setCurrentChatTitle(null);
    setHistoryVisible(false);

    Keyboard.dismiss();
  };

  const openSavedChat =
    async (chat: SavedChat) => {
      const user =
        auth.currentUser;

      if (!user) {
        return;
      }

      if (
        isLoading ||
        sendingRef.current ||
        openingChat
      ) {
        return;
      }

      try {
        setOpeningChat(true);

        const savedMessages =
          await getAIChatMessages(
            user.uid,
            chat.id
          );

        const convertedMessages:
          ChatMessage[] =
          savedMessages.map(
            (message) => ({
              id: message.id,
              role: message.role,
              text: message.text,
            })
          );

        setMessages(
          convertedMessages
        );

        setActiveChatId(chat.id);

        setCurrentChatTitle(
          chat.title
        );

        setQuestion("");

        setHistoryVisible(false);

        handledRequestRef.current =
          null;

        scrollToBottom();
      } catch (error) {
        console.log(
          "Unable to open saved chat:",
          error
        );

        Alert.alert(
          "Unable to Open Chat",
          "LifeGuide could not open this conversation."
        );
      } finally {
        setOpeningChat(false);
      }
    };

  const confirmDeleteChat = (
    chat: SavedChat
  ) => {
    Alert.alert(
      "Delete Chat",
      `Delete "${chat.title}"? This cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            const user =
              auth.currentUser;

            if (!user) {
              return;
            }

            try {
              await deleteAIChat(
                user.uid,
                chat.id
              );

              if (
                currentChatIdRef.current ===
                chat.id
              ) {
                setMessages([]);
                setQuestion("");
                setActiveChatId(null);
                setCurrentChatTitle(null);
              }

              await loadChatHistory();
            } catch (error) {
              console.log(
                "Unable to delete chat:",
                error
              );

              Alert.alert(
                "Delete Failed",
                "LifeGuide could not delete this conversation."
              );
            }
          },
        },
      ]
    );
  };

  const sendQuestion = async (
    selectedQuestion?: string,
    options: SendQuestionOptions = {}
  ) => {
    const messageText = (
      selectedQuestion ??
      question
    ).trim();

    if (!messageText) {
      Alert.alert(
        "Enter a Question",
        "Ask the AI Bible Companion something about Scripture, Christian faith, prayer, or Bible-based guidance."
      );

      return;
    }

    if (
      isLoading ||
      sendingRef.current
    ) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      Alert.alert(
        "Login Required",
        "Please log in before using the AI Bible Companion."
      );

      return;
    }

    sendingRef.current = true;

    const shouldStartNewChat =
      options.forceNewChat === true;

    const previousMessages =
      shouldStartNewChat
        ? []
        : [...messages];

    const existingChatId =
      shouldStartNewChat
        ? null
        : currentChatIdRef.current;

    if (shouldStartNewChat) {
      setMessages([]);
      setActiveChatId(null);
      setCurrentChatTitle(null);
    }

    const timestamp =
      Date.now();

    const userMessage:
      ChatMessage = {
      id: `user-${timestamp}`,
      role: "user",
      text: messageText,
    };

    setMessages(
      shouldStartNewChat
        ? [userMessage]
        : (currentMessages) => [
            ...currentMessages,
            userMessage,
          ]
    );

    setQuestion("");
    setIsLoading(true);

    scrollToBottom();

    try {
      const historyForAI =
        previousMessages.map(
          (message) => ({
            role: message.role,
            text: message.text,
          })
        );

      const response =
        await askBibleCompanion(
          messageText,
          historyForAI
        );

      const assistantMessage:
        ChatMessage = {
        id:
          `assistant-${timestamp}`,
        role: "assistant",
        text: response,
      };

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]
      );

      let activeChatId =
        existingChatId;

      if (!activeChatId) {
        activeChatId =
          await createAIChat(
            user.uid,
            messageText
          );

        setActiveChatId(
          activeChatId
        );

        setCurrentChatTitle(
          createTitle(
            messageText
          )
        );
      }

      await saveAIChatMessage(
        user.uid,
        activeChatId,
        "user",
        messageText
      );

      await saveAIChatMessage(
        user.uid,
        activeChatId,
        "assistant",
        response
      );
    } catch (error: any) {
      console.log(
        "AI Bible Companion error:",
        error
      );

      const errorMessage =
        getFriendlyErrorMessage(
          error
        );

      const assistantErrorMessage:
        ChatMessage = {
        id:
          `assistant-error-${timestamp}`,
        role: "assistant",
        text: errorMessage,
      };

      setMessages(
        (currentMessages) => [
          ...currentMessages,
          assistantErrorMessage,
        ]
      );
    } finally {
      sendingRef.current = false;

      setIsLoading(false);

      scrollToBottom();
    }
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const showSubscription =
      Keyboard.addListener(
        showEvent,
        () => {
          setKeyboardVisible(true);
        }
      );

    const hideSubscription =
      Keyboard.addListener(
        hideEvent,
        () => {
          setKeyboardVisible(false);
        }
      );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const incomingQuestion =
      typeof homeQuestion ===
      "string"
        ? homeQuestion.trim()
        : "";

    const incomingRequestId =
      typeof requestId ===
      "string"
        ? requestId
        : "";

    if (!incomingQuestion) {
      return;
    }

    const requestKey =
      incomingRequestId ||
      incomingQuestion;

    if (
      handledRequestRef.current ===
      requestKey
    ) {
      return;
    }

    if (sendingRef.current) {
      return;
    }

    handledRequestRef.current =
      requestKey;

    sendQuestion(
      incomingQuestion,
      {
        forceNewChat: true,
      }
    );
  }, [
    homeQuestion,
    requestId,
  ]);

  const formatChatDate = (
    date?: Date
  ): string => {
    if (!date) {
      return "";
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

  const inputBottomPadding =
    keyboardVisible
      ? 8
      : 80 +
        Math.max(
          insets.bottom,
          8
        );

  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <Header
          title="AI Bible Companion"
        />

        <View
          style={styles.chatActions}
        >
          <TouchableOpacity
            style={
              styles.chatActionButton
            }
            onPress={openHistory}
            activeOpacity={0.75}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color="#6e473b"
            />

            <Text
              style={
                styles.chatActionText
              }
            >
              Chat History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.chatActionButton
            }
            onPress={startNewChat}
            activeOpacity={0.75}
          >
            <Ionicons
              name="add-outline"
              size={22}
              color="#6e473b"
            />

            <Text
              style={
                styles.chatActionText
              }
            >
              New Chat
            </Text>
          </TouchableOpacity>
        </View>

        {currentChatTitle && (
          <Text
            style={
              styles.currentChatTitle
            }
            numberOfLines={1}
          >
            {currentChatTitle}
          </Text>
        )}

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.content
          }
          onContentSizeChange={
            scrollToBottom
          }
        >
          {messages.length === 0 ? (
            <>
              <View
                style={styles.welcome}
              >
                <Text
                  style={styles.heading}
                >
                  How can I help you today?
                </Text>

                <Text
                  style={
                    styles.description
                  }
                >
                  Ask questions about
                  Scripture, Christian faith,
                  prayer, or Christian living.
                </Text>

                <Text
                  style={
                    styles.boundaryText
                  }
                >
                  LifeGuide answers only
                  Bible-related and Christian
                  faith-related questions.
                </Text>
              </View>

              <QuickPrompts
                onSelectPrompt={
                  sendQuestion
                }
                disabled={isLoading}
              />
            </>
          ) : (
            <View
              style={
                styles.messagesContainer
              }
            >
              {messages.map(
                (message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageRow,

                      message.role ===
                      "user"
                        ? styles.userMessageRow
                        : styles.assistantMessageRow,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,

                        message.role ===
                        "user"
                          ? styles.userBubble
                          : styles.assistantBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageLabel,

                          message.role ===
                          "user"
                            ? styles.userLabel
                            : styles.assistantLabel,
                        ]}
                      >
                        {message.role ===
                        "user"
                          ? "YOU"
                          : "LIFEGUIDE"}
                      </Text>

                      <Text
                        style={[
                          styles.messageText,

                          message.role ===
                          "user"
                            ? styles.userMessageText
                            : styles.assistantMessageText,
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>
                  </View>
                )
              )}

              {isLoading && (
                <View
                  style={[
                    styles.messageRow,
                    styles.assistantMessageRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      styles.assistantBubble,
                      styles.loadingBubble,
                    ]}
                  >
                    <ActivityIndicator
                      size="small"
                      color="#6e473b"
                    />

                    <Text
                      style={
                        styles.loadingText
                      }
                    >
                      Preparing a Bible-based
                      response...
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputArea,
            {
              paddingBottom:
                inputBottomPadding,
            },
          ]}
        >
          <View
            style={
              styles.inputContainer
            }
          >
            <TextInput
              placeholder="Ask about the Bible or your faith..."
              placeholderTextColor="#a78d78"
              style={styles.input}
              value={question}
              onChangeText={setQuestion}
              editable={!isLoading}
              multiline
              maxLength={1000}
              textAlignVertical="center"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,

                (!question.trim() ||
                  isLoading) &&
                  styles.disabledSendButton,
              ]}
              activeOpacity={0.75}
              disabled={
                !question.trim() ||
                isLoading
              }
              onPress={() =>
                sendQuestion()
              }
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                />
              ) : (
                <Text
                  style={styles.sendText}
                >
                  ➤
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={historyVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setHistoryVisible(false)
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.historyModal}
          >
            <View
              style={
                styles.historyHeader
              }
            >
              <Text
                style={
                  styles.historyTitle
                }
              >
                Chat History
              </Text>

              <TouchableOpacity
                style={
                  styles.closeButton
                }
                onPress={() =>
                  setHistoryVisible(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={26}
                  color="#291c0e"
                />
              </TouchableOpacity>
            </View>

            {!historyLoading && (
              <View
                style={
                  styles.historySummary
                }
              >
                <Text
                  style={
                    styles.historySummaryLabel
                  }
                >
                  Total Conversations
                </Text>

                <Text
                  style={
                    styles.historySummaryValue
                  }
                >
                  {chatHistory.length}
                </Text>
              </View>
            )}

            {historyLoading ? (
              <View
                style={
                  styles.historyLoading
                }
              >
                <ActivityIndicator
                  size="large"
                  color="#6e473b"
                />

                <Text
                  style={
                    styles.historyLoadingText
                  }
                >
                  Loading conversations...
                </Text>
              </View>
            ) : chatHistory.length ===
              0 ? (
              <View
                style={
                  styles.emptyHistory
                }
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={44}
                  color="#a78d78"
                />

                <Text
                  style={
                    styles.emptyHistoryTitle
                  }
                >
                  No chats yet
                </Text>

                <Text
                  style={
                    styles.emptyHistoryText
                  }
                >
                  Your Bible Companion
                  conversations will appear
                  here.
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.historyList
                }
              >
                {chatHistory.map(
                  (chat) => (
                    <View
                      key={chat.id}
                      style={
                        styles.historyItem
                      }
                    >
                      <TouchableOpacity
                        style={
                          styles.historyOpenArea
                        }
                        disabled={
                          openingChat
                        }
                        onPress={() =>
                          openSavedChat(
                            chat
                          )
                        }
                      >
                        <Text
                          style={
                            styles.historyItemTitle
                          }
                          numberOfLines={2}
                        >
                          {chat.title}
                        </Text>

                        <Text
                          style={
                            styles.historyDate
                          }
                        >
                          {formatChatDate(
                            chat.updatedAt
                          )}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          styles.deleteButton
                        }
                        onPress={() =>
                          confirmDeleteChat(
                            chat
                          )
                        }
                      >
                        <Ionicons
                          name="trash-outline"
                          size={21}
                          color="#b84a4a"
                        />
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  keyboardView: {
    flex: 1,
  },

  chatActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 12,
  },

  chatActionButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: "#f8f4ef",
    borderWidth: 1,
    borderColor: "#beb5a9",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  chatActionText: {
    color: "#6e473b",
    fontSize: 15,
    fontWeight: "600",
  },

  currentChatTitle: {
    color: "#6e473b",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 25,
    marginBottom: 5,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  welcome: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
    paddingHorizontal: 25,
  },

  heading: {
    fontSize: 32,
    color: "#291c0e",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 18,
    lineHeight: 28,
    color: "#6e473b",
    textAlign: "center",
  },

  boundaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#8c7665",
    textAlign: "center",
    marginTop: 14,
  },

  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  messageRow: {
    width: "100%",
    marginBottom: 14,
  },

  userMessageRow: {
    alignItems: "flex-end",
  },

  assistantMessageRow: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "86%",
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },

  userBubble: {
    backgroundColor: "#6e473b",
    borderBottomRightRadius: 5,
  },

  assistantBubble: {
    backgroundColor: "#f8f4ef",
    borderWidth: 1,
    borderColor: "#beb5a9",
    borderBottomLeftRadius: 5,
  },

  messageLabel: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 6,
  },

  userLabel: {
    color: "#e1d4c2",
  },

  assistantLabel: {
    color: "#6e473b",
  },

  messageText: {
    fontSize: 17,
    lineHeight: 26,
  },

  userMessageText: {
    color: "#ffffff",
  },

  assistantMessageText: {
    color: "#291c0e",
  },

  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
  },

  loadingText: {
    color: "#6e473b",
    fontSize: 15,
    marginLeft: 10,
  },

  inputArea: {
    backgroundColor: "#e1d4c2",
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  inputContainer: {
    minHeight: 58,
    maxHeight: 125,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 29,
    overflow: "hidden",
  },

  input: {
    flex: 1,
    minHeight: 54,
    maxHeight: 115,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 17,
    lineHeight: 23,
    color: "#291c0e",
  },

  sendButton: {
    width: 62,
    minHeight: 58,
    alignSelf: "stretch",
    backgroundColor: "#6e473b",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledSendButton: {
    backgroundColor: "#a78d78",
  },

  sendText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  historyModal: {
    height: "72%",
    backgroundColor: "#e1d4c2",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 12,
  },

  historyHeader: {
    minHeight: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#beb5a9",
  },

  historyTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#291c0e",
  },

  closeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  historySummary: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    minHeight: 58,
    paddingHorizontal: 16,
    backgroundColor: "#f8f4ef",
    borderWidth: 1,
    borderColor: "#beb5a9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  historySummaryLabel: {
    color: "#6e473b",
    fontSize: 16,
    fontWeight: "600",
  },

  historySummaryValue: {
    color: "#291c0e",
    fontSize: 24,
    fontWeight: "bold",
  },

  historyLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  historyLoadingText: {
    marginTop: 12,
    color: "#6e473b",
    fontSize: 16,
  },

  emptyHistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyHistoryTitle: {
    color: "#291c0e",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },

  emptyHistoryText: {
    color: "#6e473b",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },

  historyList: {
    padding: 16,
    paddingBottom: 35,
  },

  historyItem: {
    minHeight: 76,
    backgroundColor: "#f8f4ef",
    borderWidth: 1,
    borderColor: "#beb5a9",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  historyOpenArea: {
    flex: 1,
    minHeight: 76,
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 8,
  },

  historyItemTitle: {
    color: "#291c0e",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },

  historyDate: {
    color: "#8c7665",
    fontSize: 13,
  },

  deleteButton: {
    width: 54,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
  },
});