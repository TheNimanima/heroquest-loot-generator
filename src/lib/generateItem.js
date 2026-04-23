import { buildUserPrompt, SYSTEM_BLOCKS } from './prompt.js'
import { generateVarietySeed } from './seed.js'

// Set VITE_WORKER_URL in .env.local to your Cloudflare Worker URL
// For local dev without a worker, set VITE_API_KEY directly (never commit this)
const WORKER_URL = import.meta.env.VITE_WORKER_URL || null
const DEV_API_KEY = import.meta.env.VITE_API_KEY || null

const RECENT_KEY = 'hq-recent-items'
const RECENT_LIMIT = 20

function getRecentNames() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function pushRecentName(name) {
  try {
    const list = getRecentNames()
    list.unshift(name)
    if (list.length > RECENT_LIMIT) list.length = RECENT_LIMIT
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function clearRecentNames() {
  try { localStorage.removeItem(RECENT_KEY) } catch {}
}

export async function generateItem({ tier, slot, hero }) {
  const varietySeed = generateVarietySeed()
  const recentNames = getRecentNames()
  const userPrompt = buildUserPrompt({ tier, slot, hero, varietySeed, recentNames })

  const item = WORKER_URL
    ? await callWorker(userPrompt)
    : DEV_API_KEY
      ? await callClaudeDirect(userPrompt, DEV_API_KEY)
      : (() => { throw new Error('No API configured. Set VITE_WORKER_URL or VITE_API_KEY in .env.local') })()

  if (item?.name) pushRecentName(item.name)
  return item
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
  // In dev: Vite proxies /api/claude → https://api.anthropic.com/v1/messages (avoids CORS)
  // In production: use VITE_WORKER_URL instead (key never exposed in browser)
  const url = import.meta.env.DEV ? '/api/claude' : 'https://api.anthropic.com/v1/messages'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_BLOCKS,
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
    attackDice: Number(item.attackDice) || 0,
    defenseDice: Number(item.defenseDice) || 0,
    effect: String(item.effect),
    flavorText: String(item.flavorText),
    heroRestriction: String(item.heroRestriction),
  }
}
