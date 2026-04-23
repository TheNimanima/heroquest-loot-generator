import React from 'react'

// Placeholder card backs until Nima provides real HeroQuest card back images.
// tier 1-2 → Artifact back (dark/ornate); tier 3-4 → Treasure back (brown/parchment)

const TREASURE_BACK_PATTERN = `
  repeating-linear-gradient(
    45deg,
    #5a2d0a 0px, #5a2d0a 2px,
    transparent 2px, transparent 12px
  ),
  repeating-linear-gradient(
    -45deg,
    #5a2d0a 0px, #5a2d0a 2px,
    transparent 2px, transparent 12px
  ),
  linear-gradient(160deg, #7a3a0a 0%, #4a1a00 100%)
`

const ARTIFACT_BACK_PATTERN = `
  repeating-linear-gradient(
    0deg,
    #1a0040 0px, #1a0040 2px,
    transparent 2px, transparent 10px
  ),
  repeating-linear-gradient(
    90deg,
    #1a0040 0px, #1a0040 2px,
    transparent 2px, transparent 10px
  ),
  linear-gradient(160deg, #2a0a40 0%, #0a0020 100%)
`

export default function CardBack({ tier, style: extraStyle }) {
  const isArtifact = tier <= 2
  const borderColor = isArtifact ? '#9b59b6' : '#c9a227'
  const pattern = isArtifact ? ARTIFACT_BACK_PATTERN : TREASURE_BACK_PATTERN
  const label = isArtifact ? 'ARTIFACT' : 'TREASURE'
  const labelColor = isArtifact ? '#c9a2ff' : '#c9a227'
  const centerSymbol = isArtifact ? '✦' : '⚜'

  return (
    <div
      style={{
        width: 300,
        minHeight: 420,
        borderRadius: 12,
        border: `3px solid ${borderColor}`,
        background: pattern,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        boxShadow: `0 4px 20px rgba(0,0,0,0.7)`,
        position: 'relative',
        overflow: 'hidden',
        ...extraStyle,
      }}
    >
      {/* Corner ornaments */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
        <span
          key={pos}
          style={{
            position: 'absolute',
            ...(pos.includes('top') ? { top: 10 } : { bottom: 10 }),
            ...(pos.includes('left') ? { left: 12 } : { right: 12 }),
            color: borderColor,
            fontSize: 16,
            opacity: 0.7,
          }}
        >
          ✦
        </span>
      ))}

      {/* Center ornament */}
      <div style={{
        fontSize: 64,
        color: borderColor,
        opacity: 0.6,
        lineHeight: 1,
        textShadow: `0 0 30px ${borderColor}`,
      }}>
        {centerSymbol}
      </div>

      {/* Label */}
      <div style={{
        fontFamily: '"Cinzel", Georgia, serif',
        fontSize: 13,
        fontWeight: 700,
        color: labelColor,
        letterSpacing: '0.15em',
        opacity: 0.9,
      }}>
        {label}
      </div>

      {/* Placeholder notice — remove when real images provided */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        fontSize: 9,
        color: borderColor,
        opacity: 0.4,
        letterSpacing: '0.05em',
      }}>
        PLACEHOLDER BACK
      </div>
    </div>
  )
}
