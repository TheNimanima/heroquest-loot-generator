import React from 'react'

const TIERS = [
  { value: '', label: 'Any Tier' },
  { value: 1, label: 'T1 — Legendary Artifact' },
  { value: 2, label: 'T2 — Ancient Relic' },
  { value: 3, label: 'T3 — Epic Treasure' },
  { value: 4, label: 'T4 — Base Treasure' },
]

const SLOTS = [
  { value: '', label: 'Any Slot' },
  { value: 'Weapon', label: 'Weapon' },
  { value: 'Helmet', label: 'Helmet' },
  { value: 'Armor', label: 'Armor' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Boots', label: 'Boots' },
  { value: 'Ring', label: 'Ring' },
  { value: 'Amulet', label: 'Amulet' },
  { value: 'Spell Scroll', label: 'Spell Scroll' },
  { value: 'Potion', label: 'Potion' },
  { value: 'Artifact', label: 'Artifact' },
]

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #5a3a0a',
  background: '#2a1400',
  color: '#f5e6c8',
  fontSize: 14,
  fontFamily: '"Crimson Text", Georgia, serif',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23c9a227' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: '#c9a227',
  marginBottom: 6,
  textTransform: 'uppercase',
}

export default function SelectionPanel({ tier, slot, onTierChange, onSlotChange, onGenerate, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate()
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 340 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Tier selector */}
        <div>
          <label style={labelStyle}>Tier</label>
          <select
            value={tier}
            onChange={e => onTierChange(e.target.value ? Number(e.target.value) : '')}
            style={selectStyle}
          >
            {TIERS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Slot selector */}
        <div>
          <label style={labelStyle}>Item Slot</label>
          <select
            value={slot}
            onChange={e => onSlotChange(e.target.value)}
            style={selectStyle}
          >
            {SLOTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Hint text */}
        <p style={{
          fontSize: 12,
          color: '#7a5a2a',
          fontStyle: 'italic',
          margin: '0 0 4px',
          lineHeight: 1.4,
        }}>
          {(!tier && !slot)
            ? 'Leave both blank for a completely random loot drop.'
            : 'Unset fields will be chosen freely by the generator.'}
        </p>

        {/* Generate button */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '14px 24px',
            borderRadius: 8,
            border: '2px solid #c9a227',
            background: isLoading
              ? '#2a1400'
              : 'linear-gradient(160deg, #5a2d00 0%, #3d1c00 100%)',
            color: isLoading ? '#5a3a10' : '#f5e6c8',
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.05em',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={e => {
            if (!isLoading) e.target.style.background = 'linear-gradient(160deg, #7a4000 0%, #5a2d00 100%)'
          }}
          onMouseLeave={e => {
            if (!isLoading) e.target.style.background = 'linear-gradient(160deg, #5a2d00 0%, #3d1c00 100%)'
          }}
        >
          {isLoading ? '⚔ Forging...' : '⚔ Generate Loot'}
        </button>

      </div>
    </form>
  )
}
