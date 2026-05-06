/**
 * Deutsch Klinik AI Backend Worker
 *
 * Routes:
 * - JSON POST (type: "writing")  -> Writing correction prompt
 * - JSON POST (type: "speaking") -> Speaking feedback prompt
 * - Multipart POST (type: "transcription") -> Whisper audio transcription
 *
 * Required bindings:
 * - AI (Cloudflare Workers AI): for @cf/openai/whisper
 * - OPENAI_API_KEY (Optional fallback if Workers AI unavailable)
 */

export default {
  async fetch(request, env) {
    const contentType = request.headers.get('Content-Type') || '';

    // Handle preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders(),
      });
    }

    try {
      // Multipart form data = audio transcription
      if (contentType.includes('multipart/form-data')) {
        return await handleTranscription(request, env);
      }

      // JSON = writing or speaking correction
      const body = await request.json();
      const { type } = body;

      if (type === 'writing') {
        return await handleWriting(body, env);
      } else if (type === 'speaking') {
        return await handleSpeaking(body, env);
      } else {
        return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
          status: 400,
          headers: corsHeaders(),
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders(),
      });
    }
  },
};

async function handleTranscription(request, env) {
  const formData = await request.formData();
  const audioFile = formData.get('audio');
  const language = formData.get('language') || 'de';

  if (!audioFile) {
    return new Response(JSON.stringify({ error: 'No audio file provided' }), {
      status: 400,
      headers: corsHeaders(),
    });
  }

  const audioBuffer = await audioFile.arrayBuffer();

  try {
    // Use Cloudflare Workers AI Whisper
    const result = await env.AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(audioBuffer)],
      language,
    });

    const transcript = result?.text || '';

    return new Response(JSON.stringify({ transcript }), {
      headers: corsHeaders(),
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Whisper transcription failed: ' + err.message,
    }), {
      status: 500,
      headers: corsHeaders(),
    });
  }
}

async function handleWriting(body, env) {
  const { level, task, userAnswer } = body;

  if (!userAnswer || userAnswer.trim().length < 2) {
    return new Response(JSON.stringify({ error: 'Write an answer first.' }), {
      status: 400,
      headers: corsHeaders(),
    });
  }

  const prompt = createWritingPrompt(level, task, userAnswer);

  const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
  });

  return parseAIResponse(result);
}

async function handleSpeaking(body, env) {
  const { level, task, transcript } = body;

  if (!transcript || transcript.trim().length < 2) {
    return new Response(JSON.stringify({ error: 'Provide a transcript first.' }), {
      status: 400,
      headers: corsHeaders(),
    });
  }

  const prompt = createSpeakingPrompt(level, task, transcript);

  const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2048,
  });

  return parseAIResponse(result);
}

function createWritingPrompt(level, task, userAnswer) {
  return `You are a German language tutor. Review this writing submission at CEFR level ${level}.

TASK: ${task || 'Writing task'}

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

function createSpeakingPrompt(level, task, transcript) {
  return `You are a German language tutor. Review this speaking transcript at CEFR level ${level}.

TASK: ${task || 'Speaking task'}

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

function parseAIResponse(result) {
  // Workers AI @cf/meta/llama-3.3-70b-instruct-fp8-fast returns:
  // { response: <parsed JSON object>, tool_calls: [], usage: {...} }
  // When the model outputs valid JSON, Workers AI auto-parses it.
  // When the model outputs text with markdown, response is a string.

  if (result && typeof result === 'object') {
    // If response is already a parsed object (Workers AI auto-parsed JSON)
    if (typeof result.response === 'object' && result.response !== null && !Array.isArray(result.response)) {
      return new Response(JSON.stringify(result.response), { headers: corsHeaders() });
    }
    // If response is a string (text with possible embedded JSON)
    if (typeof result.response === 'string') {
      const text = result.response;
      try {
        return new Response(JSON.stringify(JSON.parse(text.trim())), { headers: corsHeaders() });
      } catch { /* empty */ }
      // Try extracting from markdown fences
      const fenceMatch = text.match(/```(?:json)?\n?([\s\S]*?)(?:\n?```|$)/);
      if (fenceMatch) {
        try {
          const parsed = JSON.parse(fenceMatch[1].trim());
          return new Response(JSON.stringify(parsed), { headers: corsHeaders() });
        } catch { /* empty */ }
      }
      // Try finding a JSON object in the text
      const braceMatch = text.match(/{[\s\S]*?"[a-zA-Z]+\"[\s\S]*?}/);
      if (braceMatch) {
        try {
          return new Response(JSON.stringify(JSON.parse(braceMatch[0])), { headers: corsHeaders() });
        } catch { /* empty */ }
      }
      return new Response(JSON.stringify({ error: 'Could not extract JSON from response', raw: text }), {
        status: 500, headers: corsHeaders(),
      });
    }
    // OpenAI-compatible format
    if (result.choices?.[0]?.message?.content) {
      const text = result.choices[0].message.content;
      try {
        return new Response(JSON.stringify(JSON.parse(text.trim())), { headers: corsHeaders() });
      } catch {
        return new Response(JSON.stringify({ error: 'Could not parse OpenAI response as JSON', raw: text }), {
          status: 500, headers: corsHeaders(),
        });
      }
    }
  }

  return new Response(JSON.stringify({ error: 'Unexpected AI response format', raw: JSON.stringify(result) }), {
    status: 500, headers: corsHeaders(),
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}
