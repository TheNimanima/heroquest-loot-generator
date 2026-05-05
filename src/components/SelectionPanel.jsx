import React from 'react'

const ITEM_TYPES = [
  { value: '', label: 'Any Type' },
  { value: 'Treasure Card', label: 'Treasure Card' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Spell Scroll', label: 'Spell Scroll' },
  { value: 'Potion', label: 'Potion' },
  { value: 'Artifact', label: 'Artifact' },
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

const HEROES = [
  { value: '', label: 'Any Hero' },
  { value: 'Barbarian', label: 'Barbarian' },
  { value: 'Dwarf', label: 'Dwarf' },
  { value: 'Elf', label: 'Elf' },
  { value: 'Wizard', label: 'Wizard' },
  { value: 'Knight', label: 'Knight' },
  { value: 'Rogue', label: 'Rogue' },
  { value: 'Monk', label: 'Monk' },
  { value: 'Warlock', label: 'Warlock' },
  { value: 'Bard', label: 'Bard' },
  { value: 'Druid', label: 'Druid' },
  { value: 'Berserker', label: 'Berserker' },
  { value: 'Explorer', label: 'Explorer' },
]

const EXPANSIONS = [
  { group: '', items: [{ value: '', label: 'Any Expansion' }] },
  { group: 'Core Set', items: [{ value: 'Base Game', label: 'Base Game' }] },
  { group: 'Classic Expansions', items: [
    { value: "Kellar's Keep", label: "Kellar's Keep" },
    { value: 'Return of the Witch Lord', label: 'Return of the Witch Lord' },
    { value: 'Against the Ogre Horde', label: 'Against the Ogre Horde' },
    { value: 'Wizards of Morcar', label: 'Wizards of Morcar' },
  ]},
  { group: 'Quest Packs (Avalon Hill)', items: [
    { value: 'Prophecy of Telor', label: 'Prophecy of Telor' },
    { value: "Spirit Queen's Torment", label: "Spirit Queen's Torment" },
    { value: 'Mage of the Mirror', label: 'Mage of the Mirror' },
    { value: 'Rise of the Dread Moon', label: 'Rise of the Dread Moon' },
    { value: 'Jungles of Delthrak', label: 'Jungles of Delthrak' },
    { value: 'Crypt of Perpetual Darkness', label: 'Crypt of Perpetual Darkness' },
  ]},
  { group: 'Hero Collections', items: [
    { value: 'Commander of the Guardian Knights', label: 'Commander of the Guardian Knights' },
    { value: 'Rogue Heir of Elethorn', label: 'Rogue Heir of Elethorn' },
    { value: 'Path of the Wandering Monk', label: 'Path of the Wandering Monk' },
  ]},
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

export default function SelectionPanel({ itemType, slot, hero, expansion, onItemTypeChange, onSlotChange, onHeroChange, onExpansionChange, onGenerate, isLoading, buttonLabel }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate()
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 340 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Item Type selector */}
        <div>
          <label style={labelStyle}>Item Type</label>
          <select
            value={itemType}
            onChange={e => onItemTypeChange(e.target.value)}
            style={selectStyle}
          >
            {ITEM_TYPES.map(t => (
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

        {/* Hero selector */}
        <div>
          <label style={labelStyle}>For Hero</label>
          <select
            value={hero || ''}
            onChange={e => onHeroChange(e.target.value)}
            style={selectStyle}
          >
            {HEROES.map(h => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </div>

        {/* Expansion selector */}
        <div>
          <label style={labelStyle}>From Expansion</label>
          <select
            value={expansion || ''}
            onChange={e => onExpansionChange(e.target.value)}
            style={selectStyle}
          >
            {EXPANSIONS.map((g, i) => (
              g.group ? (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </optgroup>
              ) : (
                g.items.map(opt => (
                  <option key={opt.value || `_blank-${i}`} value={opt.value}>{opt.label}</option>
                ))
              )
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
          {(!itemType && !slot && !hero && !expansion)
            ? 'Leave all blank for a fully random loot drop.'
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
          {isLoading ? '⚔ Forging...' : (buttonLabel || '⚔ Generate Loot')}
        </button>

      </div>
    </form>
  )
}
