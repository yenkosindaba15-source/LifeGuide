const AI_API_URL =
  "https://lifeguide-backend.vercel.app/api/chat";

export type AIHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

export const askBibleCompanion = async (
  question: string,
  history: AIHistoryMessage[] = []
): Promise<string> => {
  const cleanedQuestion =
    question.trim();

  if (!cleanedQuestion) {
    throw new Error(
      "Please enter a question."
    );
  }

  const cleanedHistory =
    history
      .filter((message) => {
        return (
          message &&
          typeof message.text ===
            "string" &&
          (
            message.role === "user" ||
            message.role === "assistant"
          )
        );
      })
      .map((message) => ({
        role: message.role,
        text:
          message.text.trim(),
      }))
      .filter(
        (message) =>
          message.text.length > 0
      )
      .slice(-20);

  const response = await fetch(
    AI_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        question:
          cleanedQuestion,

        history:
          cleanedHistory,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "The AI Bible Companion could not respond."
    );
  }

  if (
    !data?.response ||
    typeof data.response !== "string"
  ) {
    throw new Error(
      "The AI Bible Companion returned an invalid response."
    );
  }

  return data.response.trim();
};