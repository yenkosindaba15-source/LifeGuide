import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const prompts = [
  "Explain John 3:16",
  "Help me write a prayer",
  "Explain the book of Revelation",
  "Recommend Bible verses for anxiety",
];

type QuickPromptsProps = {
  onSelectPrompt: (
    prompt: string
  ) => void;
  disabled?: boolean;
};

export default function QuickPrompts({
  onSelectPrompt,
  disabled = false,
}: QuickPromptsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Suggested questions
      </Text>

      <View style={styles.promptContainer}>
        {prompts.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={[
              styles.button,
              disabled &&
                styles.disabledButton,
            ]}
            activeOpacity={0.75}
            disabled={disabled}
            onPress={() =>
              onSelectPrompt(prompt)
            }
          >
            <Text
              style={[
                styles.text,
                disabled &&
                  styles.disabledText,
              ]}
            >
              {prompt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    color: "#6e473b",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
  },

  promptContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  button: {
    width: "47%",
    minHeight: 78,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f8f4ef",
    borderWidth: 2,
    borderColor: "#beb5a9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.55,
  },

  text: {
    color: "#291c0e",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },

  disabledText: {
    color: "#8c7665",
  },
});