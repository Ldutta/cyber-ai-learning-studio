const ALLOWED_ORIGINS = new Set([
  'https://ldutta.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
]);

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'authorization, content-type',
      'vary': 'Origin',
    },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.has(origin)) return Response.json({ error: 'Origin not allowed.' }, { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'authorization, content-type',
        'access-control-max-age': '86400',
        'vary': 'Origin',
      },
    });
    if (request.method !== 'POST') return json({ error: 'Use POST to ask the tutor.' }, 405, origin);
    const expected = env.TUTOR_ACCESS_TOKEN;
    const supplied = request.headers.get('Authorization') || '';
    if (!expected || supplied !== `Bearer ${expected}`) return json({ error: 'Tutor access token is missing or invalid.' }, 401, origin);
    if (!env.OPENAI_API_KEY) return json({ error: 'The tutor proxy is missing its OpenAI API key.' }, 503, origin);

    let body;
    try {
      const raw = await request.text();
      if (raw.length > 24000) return json({ error: 'This question and chat are too long. Start a new chat and try again.' }, 413, origin);
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Could not read the tutor request.' }, 400, origin);
    }
    const question = typeof body.question === 'string' ? body.question.trim().slice(0, 4000) : '';
    if (!question) return json({ error: 'Enter a question first.' }, 400, origin);
    const history = Array.isArray(body.history) ? body.history.slice(-12).filter(m =>
      m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string'
    ).map(m => ({ role: m.role, content: m.content.slice(0, 4000) })) : [];
    const context = body.context && typeof body.context === 'object'
      ? `\nCurrent learning topic: ${String(body.context.title || '').slice(0, 180)} (${String(body.context.track || '').slice(0, 100)} · ${String(body.context.module || '').slice(0, 150)}). ${String(body.context.description || '').slice(0, 600)}`
      : '';
    const model = typeof body.model === 'string' && /^[a-zA-Z0-9._-]{2,80}$/.test(body.model) ? body.model : 'gpt-6-astra';
    try {
      const upstream = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model,
          instructions: `You are a patient, practical tutor for a learner studying computer foundations, cybersecurity, AI, and AI security from beginner level onward. Adapt to the learner's question and skill level. Explain jargon, use a small example, and suggest a safe next step or a check-for-understanding when useful. For security topics, keep guidance within authorized defensive work, toy examples, and legal labs. Never request secrets. Be clear when uncertain. Keep answers focused and readable.${context}`,
          input: [...history, { role: 'user', content: question }],
          max_output_tokens: 1400,
          store: false,
        }),
      });
      const result = await upstream.json();
      if (!upstream.ok) {
        const message = result?.error?.message || 'The AI provider could not answer right now.';
        return json({ error: message.slice(0, 350) }, upstream.status === 429 ? 429 : 502, origin);
      }
      const answer = (result.output || []).flatMap(item => item.content || []).filter(item => item.type === 'output_text').map(item => item.text).join('\n').trim();
      if (!answer) return json({ error: 'The AI provider returned no text. Please try again.' }, 502, origin);
      return json({ answer }, 200, origin);
    } catch {
      return json({ error: 'Could not connect to the AI provider. Try again in a moment.' }, 502, origin);
    }
  },
};
