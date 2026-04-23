/**
 * Cloudflare Worker — HeroQuest Loot Generator API proxy
 * Hides the Claude API key from the browser.
 *
 * Deploy: wrangler deploy
 * Env vars to set in Cloudflare dashboard (or wrangler secret):
 *   CLAUDE_API_KEY — your Anthropic API key
 */

import { SYSTEM_PROMPT } from '../src/lib/prompt.js'

const ALLOWED_ORIGIN = '*' // tighten to your GitHub Pages URL in production

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }

    const { userPrompt } = body
    if (!userPrompt || typeof userPrompt !== 'string') {
      return json({ error: 'Missing userPrompt' }, 400)
    }

    const apiKey = env.CLAUDE_API_KEY
    if (!apiKey) {
      return json({ error: 'Server misconfigured: missing API key' }, 500)
    }

    let claudeRes
    try {
      claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })
    } catch (err) {
      return json({ error: `Upstream fetch failed: ${err.message}` }, 502)
    }

    if (!claudeRes.ok) {
      const text = await claudeRes.text()
      return json({ error: `Claude API error ${claudeRes.status}`, detail: text }, 502)
    }

    const data = await claudeRes.json()
    const content = data?.content?.[0]?.text ?? ''

    return json({ content }, 200)
  },
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
