import { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "../../components/Header";
import QuickPrompts from "../../components/QuickPrompts";
import { askBibleCompanion } from "../../src/services/aiService";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function AIChat() {
  const scrollViewRef =
    useRef<ScrollView>(null);

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);
  };

  const getFriendlyErrorMessage = (
    error: any
  ) => {
    const message = String(
      error?.message ?? ""
    ).toLowerCase();

    if (
      message.includes("app check") ||
      message.includes("appcheck")
    ) {
      return "LifeGuide could not verify this app installation. Please try again shortly.";
    }

    if (
      message.includes("network") ||
      message.includes("offline")
    ) {
      return "I couldn't connect to the AI Bible Companion. Please check your internet connection and try again.";
    }

    if (message.includes("fetch request has been canceled")) {
      return "The AI Bible Companion could not complete the request. Please try again.";
    }

    if (
      message.includes("quota exceeded") ||
      message.includes("resource exhausted") ||
      message.includes("too many requests")
    ) {
      return "The AI Bible Companion has received too many requests. Please try again shortly.";
    }

    if (
      message.includes("permission") ||
      message.includes("unauthorized")
    ) {
      return "LifeGuide does not currently have permission to use the AI Bible Companion.";
    }

    if (
      message.includes("model") &&
      message.includes("not")
    ) {
      return "The AI Bible Companion is temporarily unavailable because its AI model could not be accessed.";
    }

    return "I couldn't prepare a response right now. Please try asking your question again.";
  };

  const sendQuestion = async (
    selectedQuestion?: string
  ) => {
    const messageText = (
      selectedQuestion ?? question
    ).trim();

    if (!messageText) {
      Alert.alert(
        "Enter a Question",
        "Ask the AI Bible Companion something about Scripture, Christian faith, prayer, or Bible-based guidance."
      );

      return;
    }

    if (isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: messageText,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setQuestion("");
    setIsLoading(true);

    scrollToBottom();

    try {
      const response =
        await askBibleCompanion(
          messageText
        );

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: response,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (error: any) {
      console.log(
        "AI Bible Companion error:",
        error
      );

      const errorMessage =
        getFriendlyErrorMessage(error);

      const assistantErrorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        text: errorMessage,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantErrorMessage,
      ]);
    } finally {
      setIsLoading(false);

      scrollToBottom();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView}
      behavior={
        Platform.OS === "ios"
        ? "padding"
        : "height"
      }
      >
        <Header
          title="AI Bible Companion"
        />

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
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
              <View style={styles.welcome}>
                <Text style={styles.heading}>
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
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    message.role === "user"
                      ? styles.userMessageRow
                      : styles.assistantMessageRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      message.role === "user"
                        ? styles.userBubble
                        : styles.assistantBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageLabel,
                        message.role === "user"
                          ? styles.userLabel
                          : styles.assistantLabel,
                      ]}
                    >
                      {message.role === "user"
                        ? "YOU"
                        : "LIFEGUIDE"}
                    </Text>

                    <Text
                      style={[
                        styles.messageText,
                        message.role === "user"
                          ? styles.userMessageText
                          : styles.assistantMessageText,
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}

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

        <View style={styles.inputArea}>
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
                  style={
                    styles.sendText
                  }
                >
                  ➤
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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

  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  welcome: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
    paddingHorizontal: 25,
  },

  heading: {
    fontSize: 34,
    color: "#291c0e",
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 19,
    lineHeight: 29,
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
    paddingTop: 10,
    paddingBottom: 90,
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
});