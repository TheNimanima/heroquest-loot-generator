// Catalog client. Loads JSON items bundled at build time via Vite's import.meta.glob.
// In dev, HMR picks up new/changed/deleted files automatically.
// Save/delete only work in dev (handled by the catalog-server Vite plugin).

const modules = import.meta.glob('../data/catalog/*.json', { eager: true, import: 'default' })

function buildIndex() {
  return Object.entries(modules).map(([file, item]) => ({
    ...item,
    _file: file,
  }))
}

export function loadCatalog() {
  return buildIndex()
}

export function filterCatalog({ tier, slot, hero } = {}) {
  return loadCatalog().filter(item => {
    if (tier && Number(item.tier) !== Number(tier)) return false
    if (slot && item.slot !== slot) return false
    if (hero && hero !== 'Any') {
      const restriction = String(item.heroRestriction || '').toLowerCase()
      if (restriction !== 'any' && !restriction.includes(hero.toLowerCase())) return false
    }
    return true
  })
}

const RECENT_DRAWS_KEY = 'hq-recent-draws'
const RECENT_DRAWS_LIMIT = 30

function getRecentDrawIds() {
  try {
    const raw = localStorage.getItem(RECENT_DRAWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function pushRecentDrawId(id) {
  try {
    const list = getRecentDrawIds().filter(x => x !== id)
    list.unshift(id)
    if (list.length > RECENT_DRAWS_LIMIT) list.length = RECENT_DRAWS_LIMIT
    localStorage.setItem(RECENT_DRAWS_KEY, JSON.stringify(list))
  } catch {}
}

export function randomPick(filters = {}) {
  const matches = filterCatalog(filters)
  if (matches.length === 0) return null

  const recent = new Set(getRecentDrawIds())
  // Prefer items not seen recently in this session/device
  const fresh = matches.filter(m => !recent.has(m.id))
  const pool = fresh.length > 0 ? fresh : matches

  const pick = pool[Math.floor(Math.random() * pool.length)]
  if (pick?.id) pushRecentDrawId(pick.id)
  return pick
}

export function clearRecentDraws() {
  try { localStorage.removeItem(RECENT_DRAWS_KEY) } catch {}
}

export async function saveItem(item) {
  const res = await fetch('/api/catalog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Save failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function deleteItem(id) {
  const res = await fetch(`/api/catalog/${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Delete failed (${res.status}): ${text}`)
  }
  return res.json()
}

// Slugify name + short timestamp suffix for unique, readable IDs.
export function makeItemId(name) {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const stamp = Date.now().toString(36).slice(-6)
  return `${slug || 'item'}-${stamp}`
}
