import { buildUserPrompt } from './prompt.js'

// Set VITE_WORKER_URL in .env.local to your Cloudflare Worker URL
// For local dev without a worker, set VITE_API_KEY directly (never commit this)
const WORKER_URL = import.meta.env.VITE_WORKER_URL || null
const DEV_API_KEY = import.meta.env.VITE_API_KEY || null

export async function generateItem({ tier, slot }) {
  const userPrompt = buildUserPrompt({ tier, slot })

  if (WORKER_URL) {
    return callWorker(userPrompt)
  } else if (DEV_API_KEY) {
    return callClaudeDirect(userPrompt, DEV_API_KEY)
  } else {
    throw new Error('No API configured. Set VITE_WORKER_URL or VITE_API_KEY in .env.local')
  }
}

async function callWorker(userPrompt) {
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userPrompt }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Worker error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return parseItem(data.content)
}

async function callClaudeDirect(userPrompt, apiKey) {
  const { SYSTEM_PROMPT } = await import('./prompt.js')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
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

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Claude API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return parseItem(data.content[0].text)
}

function parseItem(raw) {
  // Strip markdown code blocks if present
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
  const item = JSON.parse(cleaned)

  // Validate required fields
  const required = ['name', 'tier', 'slot', 'effect', 'flavorText', 'heroRestriction']
  for (const field of required) {
    if (item[field] === undefined || item[field] === null) {
      throw new Error(`Missing field: ${field}`)
    }
  }

  return {
    name: String(item.name),
    tier: Number(item.tier),
    slot: String(item.slot),
    attackDice: Array.isArray(item.attackDice) ? item.attackDice : [],
    defenseDice: Array.isArray(item.defenseDice) ? item.defenseDice : [],
    effect: String(item.effect),
    flavorText: String(item.flavorText),
    heroRestriction: String(item.heroRestriction),
  }
}
