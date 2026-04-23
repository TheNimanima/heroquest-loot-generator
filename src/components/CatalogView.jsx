import React, { useState, useMemo } from 'react'
import ItemCard from './ItemCard'
import { loadCatalog, saveItem, deleteItem } from '../lib/catalog'

const SLOTS = ['Weapon', 'Helmet', 'Armor', 'Shield', 'Boots', 'Ring', 'Amulet', 'Spell Scroll', 'Potion', 'Artifact']
const HEROES = ['Barbarian', 'Dwarf', 'Elf', 'Wizard', 'Knight', 'Rogue', 'Monk', 'Warlock', 'Bard', 'Druid', 'Berserker', 'Explorer']

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #5a3a0a',
  background: '#2a1400',
  color: '#f5e6c8',
  fontSize: 13,
  fontFamily: '"Crimson Text", Georgia, serif',
  outline: 'none',
}

const btn = (variant) => ({
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid',
  fontSize: 11,
  fontFamily: '"Cinzel", Georgia, serif',
  fontWeight: 700,
  letterSpacing: '0.05em',
  cursor: 'pointer',
  ...(variant === 'edit' && {
    borderColor: '#c9a227',
    background: '#3d1c00',
    color: '#f5e6c8',
  }),
  ...(variant === 'delete' && {
    borderColor: '#7a2a2a',
    background: '#3d1515',
    color: '#f5cfcf',
  }),
  ...(variant === 'save' && {
    borderColor: '#3a7a2a',
    background: '#1f3d15',
    color: '#dff5cf',
  }),
  ...(variant === 'cancel' && {
    borderColor: '#5a3a0a',
    background: '#1a0a00',
    color: '#7a5a2a',
  }),
})

function EditForm({ item, onSave, onCancel, isSaving }) {
  const [draft, setDraft] = useState({ ...item })
  const update = (field) => (e) => setDraft(d => ({ ...d, [field]: e.target.value }))
  const updateNum = (field) => (e) => setDraft(d => ({ ...d, [field]: Number(e.target.value) || 0 }))

  const labelStyle = { display: 'block', fontSize: 10, color: '#c9a227', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 3, textTransform: 'uppercase' }
  const fieldGap = { marginBottom: 10 }

  return (
    <div style={{ background: '#1a0a00', border: '1px solid #5a3a0a', borderRadius: 8, padding: 14, width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, ...fieldGap }}>
        <div>
          <label style={labelStyle}>Name</label>
          <input value={draft.name} onChange={update('name')} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Slot</label>
          <select value={draft.slot} onChange={update('slot')} style={{ ...inputStyle, width: '100%' }}>
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, ...fieldGap }}>
        <div>
          <label style={labelStyle}>Tier</label>
          <select value={draft.tier} onChange={updateNum('tier')} style={{ ...inputStyle, width: '100%' }}>
            <option value={1}>T1 — Legendary</option>
            <option value={2}>T2 — Ancient</option>
            <option value={3}>T3 — Enchanted</option>
            <option value={4}>T4 — Treasure</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Attack Dice</label>
          <input type="number" min={0} max={6} value={draft.attackDice} onChange={updateNum('attackDice')} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Defense Dice</label>
          <input type="number" min={0} max={4} value={draft.defenseDice} onChange={updateNum('defenseDice')} style={{ ...inputStyle, width: '100%' }} />
        </div>
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Effect</label>
        <textarea value={draft.effect} onChange={update('effect')} rows={3} style={{ ...inputStyle, width: '100%', resize: 'vertical' }} />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Flavor Text</label>
        <textarea value={draft.flavorText} onChange={update('flavorText')} rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical' }} />
      </div>

      <div style={fieldGap}>
        <label style={labelStyle}>Hero Restriction</label>
        <input value={draft.heroRestriction} onChange={update('heroRestriction')} style={{ ...inputStyle, width: '100%' }} placeholder='Any  OR  Barbarian, Dwarf' />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <button style={btn('cancel')} onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button style={btn('save')} onClick={() => onSave(draft)} disabled={isSaving}>
          {isSaving ? 'Saving…' : '✓ Save Changes'}
        </button>
      </div>
    </div>
  )
}

function CatalogRow({ item, onUpdated, onDeleted }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm(`Delete "${item.name}" from the catalog? This cannot be undone.`)) return
    setBusy(true)
    setError(null)
    try {
      await deleteItem(item.id)
      onDeleted(item.id)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  const handleSave = async (draft) => {
    setBusy(true)
    setError(null)
    try {
      const payload = {
        ...item,
        ...draft,
        updatedAt: new Date().toISOString(),
      }
      await saveItem(payload)
      onUpdated(payload)
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const heroes = (item.tags?.heroes || []).join(', ') || item.heroRestriction || 'Any'
  const themes = (item.tags?.themes || []).join(' · ')

  return (
    <div style={{
      border: '1px solid #3d1c02',
      borderRadius: 8,
      background: '#1a0a00',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(x => !x)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          cursor: 'pointer',
          background: expanded ? '#241200' : 'transparent',
        }}
      >
        <span style={{
          fontSize: 10, fontWeight: 700, color: '#c9a227',
          border: '1px solid #c9a227', borderRadius: 3,
          padding: '1px 6px', minWidth: 26, textAlign: 'center',
        }}>T{item.tier}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: 14, fontWeight: 700, color: '#f5e6c8',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.name}
          </div>
          <div style={{ fontSize: 11, color: '#7a5a2a', marginTop: 2 }}>
            {item.slot} · {heroes}{themes ? ` · ${themes}` : ''}
          </div>
        </div>
        <button style={btn('edit')} onClick={(e) => { e.stopPropagation(); setExpanded(true); setEditing(true) }} disabled={busy}>Edit</button>
        <button style={btn('delete')} onClick={handleDelete} disabled={busy}>Delete</button>
      </div>

      {expanded && (
        <div style={{ padding: 14, borderTop: '1px solid #3d1c02', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <ItemCard item={item} />
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            {error && (
              <div style={{
                background: '#2a0a0a', border: '1px solid #8b1a1a', borderRadius: 6,
                padding: '8px 12px', color: '#ff6b6b', fontSize: 12, marginBottom: 10,
              }}>{error}</div>
            )}
            {editing ? (
              <EditForm
                item={item}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
                isSaving={busy}
              />
            ) : (
              <div style={{ fontSize: 12, color: '#7a5a2a', lineHeight: 1.6 }}>
                <div><strong style={{ color: '#c9a227' }}>ID:</strong> <code>{item.id}</code></div>
                <div><strong style={{ color: '#c9a227' }}>Created:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</div>
                {item.updatedAt && <div><strong style={{ color: '#c9a227' }}>Updated:</strong> {new Date(item.updatedAt).toLocaleString()}</div>}
                <div><strong style={{ color: '#c9a227' }}>Model:</strong> {item.model || '—'}</div>
                <div><strong style={{ color: '#c9a227' }}>Image:</strong> {item.imageUrl || '— (none yet)'}</div>
                {item.tags?.themes?.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    <strong style={{ color: '#c9a227' }}>Themes:</strong>{' '}
                    {item.tags.themes.map(t => (
                      <span key={t} style={{
                        display: 'inline-block', fontSize: 10, padding: '2px 8px',
                        margin: '2px 4px 2px 0', borderRadius: 10,
                        background: '#2a1400', border: '1px solid #5a3a0a', color: '#c9a227',
                      }}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <button style={btn('edit')} onClick={() => setEditing(true)}>Edit Item</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CatalogView() {
  const [items, setItems] = useState(() => loadCatalog())
  const [tier, setTier] = useState('')
  const [slot, setSlot] = useState('')
  const [hero, setHero] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return items
      .filter(i => !tier || Number(i.tier) === Number(tier))
      .filter(i => !slot || i.slot === slot)
      .filter(i => {
        if (!hero) return true
        const r = String(i.heroRestriction || '').toLowerCase()
        return r === 'any' || r.includes(hero.toLowerCase())
      })
      .filter(i => !s || i.name.toLowerCase().includes(s) || (i.effect || '').toLowerCase().includes(s))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  }, [items, tier, slot, hero, search])

  const handleUpdated = (updated) => {
    setItems(prev => prev.map(i => i.id === updated.id ? { ...i, ...updated } : i))
  }
  const handleDeleted = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div style={{ width: '100%', maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10,
        padding: 14,
        background: '#1a0a00',
        border: '1px solid #3d1c02',
        borderRadius: 8,
      }}>
        <select value={tier} onChange={e => setTier(e.target.value)} style={inputStyle}>
          <option value="">All Tiers</option>
          <option value={1}>T1 — Legendary</option>
          <option value={2}>T2 — Ancient</option>
          <option value={3}>T3 — Enchanted</option>
          <option value={4}>T4 — Treasure</option>
        </select>
        <select value={slot} onChange={e => setSlot(e.target.value)} style={inputStyle}>
          <option value="">All Slots</option>
          {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={hero} onChange={e => setHero(e.target.value)} style={inputStyle}>
          <option value="">All Heroes</option>
          {HEROES.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name or effect…"
          style={inputStyle}
        />
      </div>

      <div style={{ fontSize: 12, color: '#7a5a2a', textAlign: 'center' }}>
        Showing <strong style={{ color: '#c9a227' }}>{filtered.length}</strong> of {items.length} item{items.length === 1 ? '' : 's'}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          color: '#5a3a0a', fontStyle: 'italic', fontSize: 13,
          border: '1px dashed #3d1c02', borderRadius: 8,
        }}>
          {items.length === 0
            ? 'No items in the catalog yet. Switch to Forge to create some.'
            : 'No items match these filters.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(item => (
            <CatalogRow
              key={item.id}
              item={item}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
