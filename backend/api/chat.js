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
`;

export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
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
          error: "Method not allowed.",
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    }

    try {
      const body = await request.json();

      const question =
        typeof body?.question === "string"
          ? body.question.trim()
          : "";

      if (!question) {
        return new Response(
          JSON.stringify({
            error: "A question is required.",
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
            error: "The question is too long.",
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

      const response =
        await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: question,
          config: {
            systemInstruction:
              SYSTEM_INSTRUCTION,
          },
        });

      const text =
        response.text?.trim();

      if (!text) {
        return new Response(
          JSON.stringify({
            error:
              "The AI Bible Companion did not return a response.",
          }),
          {
            status: 502,
            headers: corsHeaders,
          }
        );
      }

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