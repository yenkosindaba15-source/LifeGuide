import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the LifeGuide AI Bible Companion.

Your purpose is strictly limited to Christianity, the Bible,
Christian faith, prayer, Scripture study, Christian living,
and Bible-based guidance.

You may help users with:

1. Explaining Bible passages and verses.
2. Summarizing Bible chapters and teachings.
3. Answering questions about Christian beliefs and biblical teachings.
4. Finding Bible passages related to a topic or situation.
5. Helping users understand how biblical principles may apply
   to personal struggles.
6. Helping users formulate Christian prayers.
7. Providing supportive Bible-based encouragement.

When a user describes a personal struggle:

1. Respond gently and respectfully.
2. Briefly acknowledge what the user has shared.
3. Provide relevant Bible-based guidance when appropriate.
4. Suggest relevant Scripture references.
5. Suggest a practical faith-based next step when appropriate.
6. Offer prayer-related support when appropriate.

Never shame or condemn the user.

Do not pretend to be God.

Never claim that God personally told you something about the user.

Do not claim to be a pastor, therapist, doctor, counsellor,
lawyer, or emergency service.

Do not invent Bible verses.

Do not deliberately misquote Scripture.

Clearly distinguish between Scripture and your explanation.

If you are uncertain about the exact wording of a Bible passage,
provide the reference and explain the teaching instead of pretending
to quote it exactly.

If a situation may involve immediate danger or serious harm,
encourage the user to seek appropriate real-world help.

STRICT DOMAIN RULE:

You are not a general-purpose assistant.

Only answer requests relating to:

- The Bible
- Scripture
- Christianity
- Christian faith
- Christian living
- Prayer
- Bible study
- Bible-based guidance
- Personal struggles where Bible-based guidance is appropriate

If a request is unrelated to these areas, do not answer the
underlying question.

For unrelated requests, respond only with:

"I'm here to help with Scripture, Christian faith, prayer, and Bible-based guidance. Please ask me something related to the Bible or your faith."

Keep normal responses compassionate, natural, clear,
and reasonably concise.

Do not provide unnecessarily long responses unless the user
specifically asks for a detailed explanation.

RESPONSE FORMATTING RULES:

Your response will be displayed as plain text inside a mobile application.

Do not use Markdown formatting.

Never use:
- asterisks for bold or italics
- Markdown headings using # symbols
- blockquotes using > symbols
- Markdown tables
- Markdown links
- backticks
- underscores for emphasis

Do not surround headings, Scripture references, or words with
formatting symbols.

If you need a heading, write it as ordinary plain text.

Use blank lines between sections to make responses easy to read
on a mobile phone.

If a list is useful, use simple numbered items or the bullet
character •.

Keep paragraphs relatively short.

Prefer clear mobile-friendly formatting over decorative formatting.
`;

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

const sleep = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const cleanResponseText = (text) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s?/gm, "")
    .replace(/`/g, "")
    .trim();
};

const isRetryableError = (error) => {
  const status = Number(
    error?.status ?? 0
  );

  return (
    status === 408 ||
    status === 429 ||
    status >= 500
  );
};

const buildConversationContext = (
  history,
  question
) => {
  const validHistory =
    Array.isArray(history)
      ? history
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
          .slice(-20)
      : [];

  if (validHistory.length === 0) {
    return question;
  }

  const conversation =
    validHistory
      .map((message) => {
        const speaker =
          message.role === "assistant"
            ? "LifeGuide"
            : "User";

        return `${speaker}: ${message.text}`;
      })
      .join("\n\n");

  return `
Previous conversation:

${conversation}

Current user question:

${question}

Respond to the current user question while using the previous
conversation only when it is relevant to understanding the question.
Continue following all LifeGuide Bible Companion rules.
`.trim();
};

const generateWithModel = async (
  ai,
  modelName,
  prompt
) => {
  const maxAttempts = 3;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {
    try {
      const response =
        await ai.models.generateContent({
          model: modelName,

          contents: prompt,

          config: {
            systemInstruction:
              SYSTEM_INSTRUCTION,
          },
        });

      const rawText =
        response.text?.trim();

      const text = rawText
        ? cleanResponseText(rawText)
        : "";

      if (!text) {
        throw new Error(
          "The model returned an empty response."
        );
      }

      return text;
    } catch (error) {
      console.error(
        `${modelName} attempt ${attempt} failed:`,
        error
      );

      if (
        !isRetryableError(error) ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay =
        Math.pow(2, attempt - 1) *
          1000 +
        Math.floor(
          Math.random() * 500
        );

      console.log(
        `Retrying ${modelName} in ${delay} ms.`
      );

      await sleep(delay);
    }
  }

  throw new Error(
    "Unable to generate AI response."
  );
};

export default {
  async fetch(request) {
    const requestStartTime =
      Date.now();

    const corsHeaders = {
      "Access-Control-Allow-Origin":
        "*",

      "Access-Control-Allow-Methods":
        "POST, OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type",

      "Content-Type":
        "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error:
            "Method not allowed.",
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    try {
      const body =
        await request.json();

      const question =
        typeof body?.question ===
        "string"
          ? body.question.trim()
          : "";

      const history =
        Array.isArray(body?.history)
          ? body.history
          : [];

      if (!question) {
        return new Response(
          JSON.stringify({
            error:
              "A question is required.",
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      if (question.length > 1000) {
        return new Response(
          JSON.stringify({
            error:
              "The question is too long.",
          }),
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      }

      const apiKey =
        process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error(
          "GEMINI_API_KEY is missing."
        );

        return new Response(
          JSON.stringify({
            error:
              "AI service configuration is missing.",
          }),
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      const ai = new GoogleGenAI({
        apiKey,
      });

      const prompt =
        buildConversationContext(
          history,
          question
        );

      let finalError = null;

      for (const modelName of MODELS) {
        try {
          console.log(
            `Trying ${modelName}...`
          );

          const modelStartTime =
            Date.now();

          const text =
            await generateWithModel(
              ai,
              modelName,
              prompt
            );

          const modelResponseTime =
            Date.now() -
            modelStartTime;

          const totalResponseTime =
            Date.now() -
            requestStartTime;

          console.log(
            `LifeGuide response generated with ${modelName}.`
          );

          console.log(
            `${modelName} generation time: ${modelResponseTime} ms`
          );

          console.log(
            `LifeGuide AI total response time: ${totalResponseTime} ms`
          );

          return new Response(
            JSON.stringify({
              response: text,
            }),
            {
              status: 200,
              headers: corsHeaders,
            }
          );
        } catch (error) {
          finalError = error;

          console.error(
            `${modelName} unavailable:`,
            error
          );

          if (
            !isRetryableError(error)
          ) {
            break;
          }
        }
      }

      console.error(
        "All LifeGuide AI models failed:",
        finalError
      );

      return new Response(
        JSON.stringify({
          error:
            "The AI Bible Companion is temporarily unavailable. Please try again.",
        }),
        {
          status: 503,
          headers: corsHeaders,
        }
      );
    } catch (error) {
      console.error(
        "LifeGuide AI backend error:",
        error
      );

      return new Response(
        JSON.stringify({
          error:
            "The AI Bible Companion could not process the request.",
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  },
};