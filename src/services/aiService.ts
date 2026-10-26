const AI_API_URL =
  "https://lifeguide-backend.vercel.app/api/chat";

export const askBibleCompanion = async (
  question: string
): Promise<string> => {
  const cleanedQuestion =
    question.trim();

  if (!cleanedQuestion) {
    throw new Error(
      "Please enter a question."
    );
  }

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
      }),
    }
  );

  const data = await response.json();

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