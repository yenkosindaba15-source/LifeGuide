const AI_API_URL =
  "https://lifeguide-backend.vercel.app/api/chat";

export type AIHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

type AIResponse = {
  response?: string;
  error?: string;
};

const wait = (
  milliseconds: number
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const sendRequest = async (
  question: string,
  history: AIHistoryMessage[]
): Promise<Response> => {
  return fetch(AI_API_URL, {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      question,
      history,
    }),
  });
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
        text: message.text.trim(),
      }))
      .filter(
        (message) =>
          message.text.length > 0
      )
      .slice(-20);

  let response = await sendRequest(
    cleanedQuestion,
    cleanedHistory
  );

  if (response.status === 503) {
    await wait(1200);

    response = await sendRequest(
      cleanedQuestion,
      cleanedHistory
    );
  }

  let data: AIResponse;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The AI Bible Companion returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
        "The AI Bible Companion could not respond."
    );
  }

  if (
    !data.response ||
    typeof data.response !== "string"
  ) {
    throw new Error(
      "The AI Bible Companion returned an invalid response."
    );
  }

  return data.response.trim();
};