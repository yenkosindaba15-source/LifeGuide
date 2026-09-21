import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const prompts = [
  "Explain John 3:16",
  "Help me pray",
  "Explain Revelation",
  "Recommend verses for anxiety",
];

export default function QuickPrompts() {
  return (
    <View style={styles.container}>
      {prompts.map((prompt) => (
        <TouchableOpacity
          key={prompt}
          style={styles.button}
        >
          <Text style={styles.text}>
            {prompt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
  },

  button: {
    width: 250,
    paddingVertical: 15,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 15,
    alignItems: "center",
  },

  text: {
    color: "#291c0e",
    fontSize: 18,
    textAlign: "center",
  },
});