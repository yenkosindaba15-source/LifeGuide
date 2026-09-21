import {
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

export default function AIChat() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="AI Bible Companion" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.welcome}>
          <Text style={styles.heading}>How can I help you today?</Text>

          <Text style={styles.description}>
            Ask questions about Scripture, devotion, prayer, or Christian
            living.
          </Text>
        </View>

        <QuickPrompts />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask anything about the Bible..."
          placeholderTextColor="#a78d78"
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1d4c2",
  },

  content: {
    paddingBottom: 170,
  },

  welcome: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 35,
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 34,
    color: "#291c0e",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 20,
    color: "#6e473b",
    textAlign: "center",
  },

  inputContainer: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    height: 60,
    flexDirection: "row",
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 35,
    overflow: "hidden",
  },

  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#291c0e",
  },

  sendButton: {
    width: 70,
    backgroundColor: "#6e473b",
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});