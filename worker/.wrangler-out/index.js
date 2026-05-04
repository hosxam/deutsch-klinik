var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var index_default = {
  async fetch(request, env) {
    const contentType = request.headers.get("Content-Type") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders()
      });
    }
    try {
      if (contentType.includes("multipart/form-data")) {
        return await handleTranscription(request, env);
      }
      const body = await request.json();
      const { type } = body;
      if (type === "writing") {
        return await handleWriting(body, env);
      } else if (type === "speaking") {
        return await handleSpeaking(body, env);
      } else {
        return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
          status: 400,
          headers: corsHeaders()
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders()
      });
    }
  }
};
async function handleTranscription(request, env) {
  const formData = await request.formData();
  const audioFile = formData.get("audio");
  const language = formData.get("language") || "de";
  if (!audioFile) {
    return new Response(JSON.stringify({ error: "No audio file provided" }), {
      status: 400,
      headers: corsHeaders()
    });
  }
  const audioBuffer = await audioFile.arrayBuffer();
  try {
    const result = await env.AI.run("@cf/openai/whisper", {
      audio: [...new Uint8Array(audioBuffer)],
      language
    });
    const transcript = result?.text || "";
    return new Response(JSON.stringify({ transcript }), {
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Whisper transcription failed: " + err.message
    }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
__name(handleTranscription, "handleTranscription");
async function handleWriting(body, env) {
  const { level, task, userAnswer } = body;
  if (!userAnswer || userAnswer.trim().length < 2) {
    return new Response(JSON.stringify({ error: "Write an answer first." }), {
      status: 400,
      headers: corsHeaders()
    });
  }
  const prompt = createWritingPrompt(level, task, userAnswer);
  const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    messages: [{ role: "user", content: prompt }]
  });
  return parseAIResponse(result);
}
__name(handleWriting, "handleWriting");
async function handleSpeaking(body, env) {
  const { level, task, transcript } = body;
  if (!transcript || transcript.trim().length < 2) {
    return new Response(JSON.stringify({ error: "Provide a transcript first." }), {
      status: 400,
      headers: corsHeaders()
    });
  }
  const prompt = createSpeakingPrompt(level, task, transcript);
  const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    messages: [{ role: "user", content: prompt }]
  });
  return parseAIResponse(result);
}
__name(handleSpeaking, "handleSpeaking");
function createWritingPrompt(level, task, userAnswer) {
  return `You are a German language tutor. Review this writing submission at CEFR level ${level}.

TASK: ${task || "Writing task"}

STUDENT'S ANSWER:
${userAnswer}

Provide feedback in this exact JSON format:
{
  "score": <number 1-10>,
  "rubric": {
    "grammar": "<assessment>",
    "vocabulary": "<assessment>",
    "structure": "<assessment>",
    "taskCompletion": "<assessment>"
  },
  "mistakes": [
    { "original": "<as written>", "corrected": "<correction>", "explanation": "<why>" }
  ],
  "correctedVersion": "<full corrected version>",
  "improvedVersion": "<full improved version at CEFR ${level}>",
  "flashcards": [
    { "german": "<word/phrase>", "english": "<translation>" }
  ]
}

Return ONLY valid JSON. No markdown. No explanation outside the JSON.`;
}
__name(createWritingPrompt, "createWritingPrompt");
function createSpeakingPrompt(level, task, transcript) {
  return `You are a German language tutor. Review this speaking transcript at CEFR level ${level}.

TASK: ${task || "Speaking task"}

STUDENT'S TRANSCRIPT:
${transcript}

Provide feedback in this exact JSON format:
{
  "score": <number 1-10>,
  "rubric": {
    "fluency": "<assessment>",
    "grammar": "<assessment>",
    "vocabulary": "<assessment>",
    "pronunciation": "<assessment>"
  },
  "mistakes": [
    { "original": "<as said>", "corrected": "<correction>", "explanation": "<why>" }
  ],
  "betterPhrases": [
    { "original": "<original>", "better": "<more natural>", "explanation": "<why>" }
  ],
  "correctedTranscript": "<full corrected transcript>",
  "strongerAnswer": "<improved sample answer>",
  "phrasesToMemorize": [
    { "german": "<phrase>", "english": "<translation>" }
  ]
}

Return ONLY valid JSON. No markdown. No explanation outside the JSON.`;
}
__name(createSpeakingPrompt, "createSpeakingPrompt");
function parseAIResponse(result) {
  let text = "";
  if (typeof result === "object" && result.response) {
    text = result.response;
  } else if (typeof result === "object" && result.choices?.[0]?.message?.content) {
    text = result.choices[0].message.content;
  } else if (typeof result === "string") {
    text = result;
  } else if (result && typeof result === "object") {
    text = JSON.stringify(result);
  } else {
    text = String(result);
  }
  if (typeof text !== "string") {
    text = String(text);
  }
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  try {
    const parsed = JSON.parse(jsonStr);
    return new Response(JSON.stringify(parsed), {
      headers: corsHeaders()
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: text }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}
__name(parseAIResponse, "parseAIResponse");
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}
__name(corsHeaders, "corsHeaders");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
