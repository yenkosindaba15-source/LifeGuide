import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getDailyContent,
} from "../data/dailySelector";

type QuickPromptsProps = {
  onSelectPrompt: (
    prompt: string
  ) => void;

  disabled?: boolean;
};

type ThemePrompts = {
  [key: string]: string[];
};

const promptsByTheme: ThemePrompts = {
  Trust: [
    "Explain Proverbs 3:5",
    "How can I trust God when I feel uncertain?",
    "Help me pray about trusting God",
    "Which Bible passages teach about trusting God?",
  ],

  Peace: [
    "Explain Isaiah 26:3",
    "What does the Bible teach about finding peace?",
    "Help me pray when my mind feels overwhelmed",
    "Which Bible verses can help me when I feel anxious?",
  ],

  Courage: [
    "Explain Joshua 1:9",
    "What does the Bible teach about courage?",
    "Help me pray when I feel afraid",
    "Which Bible characters showed courage?",
  ],

  Surrender: [
    "Explain 1 Peter 5:7",
    "What does it mean to give my worries to God?",
    "Help me pray about surrendering my worries",
    "Which Bible verses teach about giving our burdens to God?",
  ],

  Strength: [
    "Explain Philippians 4:13",
    "Where should I turn when I feel spiritually weak?",
    "Help me pray for strength today",
    "Which Bible verses encourage us when we feel tired?",
  ],

  Hope: [
    "Explain Romans 15:13",
    "What does biblical hope mean?",
    "Help me pray when I feel discouraged",
    "Which Bible verses can help me hold on to hope?",
  ],

  Patience: [
    "Explain Romans 12:12",
    "What does the Bible teach about patience?",
    "Help me pray while I am waiting for an answer",
    "Which Bible stories teach us about waiting on God?",
  ],

  Wisdom: [
    "Explain James 1:5",
    "How can I seek God's wisdom when making decisions?",
    "Help me pray for wisdom",
    "Which Bible passages teach about making wise choices?",
  ],

  Gratitude: [
    "Explain 1 Thessalonians 5:18",
    "What does the Bible teach about gratitude?",
    "Help me write a prayer of thanksgiving",
    "Which Bible verses encourage a grateful heart?",
  ],

  Forgiveness: [
    "Explain Ephesians 4:32",
    "What does the Bible teach about forgiveness?",
    "How can I forgive someone who hurt me?",
    "Help me pray about forgiveness",
  ],

  Grace: [
    "Explain 2 Corinthians 12:9",
    "What does God's grace mean?",
    "How does the Bible describe grace?",
    "Help me pray when I feel like I am not good enough",
  ],

  Perseverance: [
    "Explain Galatians 6:9",
    "What does the Bible say about not giving up?",
    "Help me pray when I feel like quitting",
    "Which Bible characters showed perseverance?",
  ],

  Rest: [
    "Explain Matthew 11:28",
    "What does the Bible teach about rest?",
    "Help me pray when I feel exhausted",
    "How can I give my burdens to God?",
  ],

  Love: [
    "Explain 1 Corinthians 13:13",
    "What does the Bible teach about love?",
    "How can I show biblical love to others?",
    "Help me pray for a more loving heart",
  ],
};

const fallbackPrompts = [
  "Explain John 3:16",
  "Help me write a prayer",
  "Recommend Bible verses for encouragement",
  "What does the Bible teach about faith?",
];

export default function QuickPrompts({
  onSelectPrompt,
  disabled = false,
}: QuickPromptsProps) {
  const dailyContent =
    getDailyContent();

  const theme =
    dailyContent.theme;

  const prompts =
    promptsByTheme[theme] ??
    fallbackPrompts;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Suggested questions
      </Text>

      <View
        style={styles.promptContainer}
      >
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
    minHeight: 88,
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
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },

  disabledText: {
    color: "#8c7665",
  },
});