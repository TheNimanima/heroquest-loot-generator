import React, { useState } from 'react'
import { saveItem, makeItemId } from '../lib/catalog'

const btn = (variant) => ({
  padding: '10px 18px',
  borderRadius: 8,
  border: '2px solid',
  fontFamily: '"Cinzel", Georgia, serif',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.05em',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  ...(variant === 'save' && {
    borderColor: '#3a7a2a',
    background: 'linear-gradient(160deg, #2d5a1f 0%, #1f3d15 100%)',
    color: '#dff5cf',
  }),
  ...(variant === 'discard' && {
    borderColor: '#7a2a2a',
    background: 'linear-gradient(160deg, #5a1f1f 0%, #3d1515 100%)',
    color: '#f5cfcf',
  }),
  ...(variant === 'regen' && {
    borderColor: '#c9a227',
    background: 'linear-gradient(160deg, #5a2d00 0%, #3d1c00 100%)',
    color: '#f5e6c8',
  }),
})

const tagsFromHeroRestriction = (restriction) => {
  if (!restriction) return []
  const s = String(restriction).trim()
  if (s.toLowerCase() === 'any') return ['Any']
  return s.split(',').map(x => x.trim()).filter(Boolean)
}

const themesFromSeed = (seed) => {
  if (!seed) return []
  return seed.split(';').map(part => {
    const [, value] = part.split(':').map(s => s.trim())
    return value || part.trim()
  }).filter(Boolean)
}

export default function BuilderControls({ item, onDiscard, onRegenerate, isLoading }) {
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(null)
  const [error, setError] = useState(null)

  const handleSave = async () => {
    if (!item) return
    setSaving(true)
    setError(null)
    try {
      const id = makeItemId(item.name)
      const payload = {
        id,
        name: item.name,
        tier: item.tier,
        slot: item.slot,
        attackDice: item.attackDice,
        defenseDice: item.defenseDice,
        effect: item.effect,
        flavorText: item.flavorText,
        heroRestriction: item.heroRestriction,
        tags: {
          heroes: tagsFromHeroRestriction(item.heroRestriction),
          themes: themesFromSeed(item._seed),
        },
        model: 'claude-opus-4-7',
        createdAt: new Date().toISOString(),
        imageUrl: null,
      }
      const result = await saveItem(payload)
      setSavedId(result.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (savedId) {
    return (
      <div className="no-print" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: 16, borderRadius: 8, background: '#1a2a10', border: '1px solid #3a7a2a',
        color: '#dff5cf', fontSize: 13, maxWidth: 400, width: '100%',
      }}>
        <div style={{ fontWeight: 700, letterSpacing: '0.05em' }}>✓ Saved to catalog</div>
        <div style={{ fontSize: 11, color: '#9ac98a', fontFamily: 'monospace' }}>{savedId}</div>
        <button onClick={onDiscard} style={btn('regen')}>Generate Next</button>
      </div>
    )
  }

  return (
    <div className="no-print" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%',
    }}>
      {error && (
        <div style={{
          background: '#2a0a0a', border: '1px solid #8b1a1a', borderRadius: 6,
          padding: '8px 12px', color: '#ff6b6b', fontSize: 12, maxWidth: 400,
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleSave}
          disabled={saving || isLoading || !item}
          style={{ ...btn('save'), opacity: (saving || isLoading || !item) ? 0.5 : 1 }}
        >
          {saving ? '⏳ Saving…' : '✓ Save to Catalog'}
        </button>
        <button
          onClick={onDiscard}
          disabled={saving || isLoading}
          style={{ ...btn('discard'), opacity: (saving || isLoading) ? 0.5 : 1 }}
        >
          ✗ Discard
        </button>
        <button
          onClick={onRegenerate}
          disabled={saving || isLoading}
          style={{ ...btn('regen'), opacity: (saving || isLoading) ? 0.5 : 1 }}
        >
          ⟳ Regenerate
        </button>
      </div>
      <p style={{ fontSize: 11, color: '#7a5a2a', fontStyle: 'italic', margin: 0 }}>
        Builder Mode · Opus 4.7 · Items saved here ship in the public catalog.
      </p>
    </div>
  )
}
