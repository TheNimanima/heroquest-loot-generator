import React from 'react'

const TIER_LABELS = {
  1: 'Legendary Artifact',
  2: 'Ancient Relic',
  3: 'Epic Treasure',
  4: 'Base Treasure',
}

const TIER_COLORS = {
  1: { border: '#ff6b00', glow: 'rgba(255,107,0,0.5)', badge: '#ff6b00', header: '#2a0800' },
  2: { border: '#9b59b6', glow: 'rgba(155,89,182,0.5)', badge: '#9b59b6', header: '#1a0a2a' },
  3: { border: '#3498db', glow: 'rgba(52,152,219,0.4)', badge: '#3498db', header: '#0a1a2a' },
  4: { border: '#8a7a5a', glow: 'rgba(138,122,90,0.3)', badge: '#7f8c8d', header: '#2a200a' },
}

const DICE_STYLES = {
  white:  { bg: '#ffffff', color: '#1a0a00', border: '1px solid #aaa', label: 'W' },
  black:  { bg: '#2c2c2c', color: '#ffffff', border: 'none', label: 'B' },
  green:  { bg: '#2d6a2d', color: '#ffffff', border: 'none', label: 'G' },
  purple: { bg: '#6a2d9e', color: '#ffffff', border: 'none', label: 'P' },
  orange: { bg: '#c96a00', color: '#ffffff', border: 'none', label: 'O' },
}

function DiePip({ type }) {
  const style = DICE_STYLES[type] || DICE_STYLES.white
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: 5,
        background: style.bg,
        color: style.color,
        border: style.border,
        fontSize: 11,
        fontWeight: 700,
        margin: '0 2px',
        fontFamily: 'monospace',
      }}
      title={`${type} die`}
    >
      {style.label}
    </span>
  )
}

function DiceRow({ dice, label, icon }) {
  if (!dice || dice.length === 0) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '4px 0' }}>
      <span style={{ fontSize: 13, color: '#5a3a0a', width: 60, flexShrink: 0 }}>{icon} {label}:</span>
      <div>{dice.map((d, i) => <DiePip key={i} type={d} />)}</div>
    </div>
  )
}

export default function ItemCard({ item, style: extraStyle }) {
  if (!item) return null

  const { name, tier, slot, attackDice, defenseDice, effect, flavorText, heroRestriction } = item
  const colors = TIER_COLORS[tier] || TIER_COLORS[4]

  return (
    <div
      className="hq-card hq-card-front"
      style={{
        border: `3px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.glow}, 0 4px 20px rgba(0,0,0,0.6)`,
        display: 'flex',
        flexDirection: 'column',
        ...extraStyle,
      }}
    >
      {/* Card header */}
      <div style={{
        background: colors.header,
        padding: '10px 14px 8px',
        borderBottom: `2px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h2 style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontSize: 16,
            fontWeight: 700,
            color: '#f5e6c8',
            lineHeight: 1.2,
            margin: 0,
            flex: 1,
          }}>
            {name}
          </h2>
          <span style={{
            background: colors.badge,
            color: 'white',
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 3,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            T{tier}
          </span>
        </div>
        <div style={{ color: '#c9a227', fontSize: 12, marginTop: 3, letterSpacing: '0.05em' }}>
          {slot.toUpperCase()}
        </div>
      </div>

      {/* Card art area placeholder */}
      <div style={{
        height: 100,
        background: `linear-gradient(160deg, #2a1400 0%, #3d1c02 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          fontSize: 48,
          opacity: 0.3,
          userSelect: 'none',
        }}>
          {getSlotEmoji(slot)}
        </div>
        <div style={{
          position: 'absolute',
          bottom: 4,
          right: 8,
          fontSize: 10,
          color: '#c9a22780',
          fontStyle: 'italic',
        }}>
          {TIER_LABELS[tier]}
        </div>
      </div>

      {/* Dice stats */}
      {(attackDice?.length > 0 || defenseDice?.length > 0) && (
        <div style={{
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(201,162,39,0.2)',
        }}>
          <DiceRow dice={attackDice} label="Attack" icon="⚔" />
          <DiceRow dice={defenseDice} label="Defense" icon="🛡" />
        </div>
      )}

      {/* Effect text */}
      <div style={{ padding: '10px 14px', flex: 1 }}>
        <p style={{
          fontSize: 13,
          color: '#3d1c02',
          lineHeight: 1.5,
          margin: 0,
          fontFamily: '"Crimson Text", Georgia, serif',
        }}>
          {effect}
        </p>
      </div>

      {/* Flavor text */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid rgba(201,162,39,0.3)',
        background: 'rgba(0,0,0,0.04)',
      }}>
        <p style={{
          fontSize: 11,
          color: '#5a3a10',
          fontStyle: 'italic',
          lineHeight: 1.4,
          margin: 0,
          fontFamily: '"Crimson Text", Georgia, serif',
        }}>
          "{flavorText}"
        </p>
      </div>

      {/* Footer: hero restriction */}
      <div style={{
        padding: '6px 14px',
        background: colors.header,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <span style={{
          fontSize: 10,
          color: heroRestriction === 'Any' ? '#7a7a5a' : colors.badge,
          fontWeight: heroRestriction === 'Any' ? 400 : 600,
          letterSpacing: '0.04em',
        }}>
          {heroRestriction === 'Any' ? 'All Heroes' : `${heroRestriction} Only`}
        </span>
      </div>
    </div>
  )
}

function getSlotEmoji(slot) {
  const map = {
    Weapon: '⚔️', Helmet: '⛑️', Armor: '🥋', Shield: '🛡️',
    Boots: '👢', Ring: '💍', Amulet: '📿', 'Spell Scroll': '📜',
    Potion: '🧪', Artifact: '✨',
  }
  return map[slot] || '✨'
}
