import React, { useState, useMemo } from 'react'
import SelectionPanel from './components/SelectionPanel'
import ItemCard from './components/ItemCard'
import CardBack from './components/CardBack'
import LoadingCard from './components/LoadingCard'
import SharePanel from './components/SharePanel'
import BuilderControls from './components/BuilderControls'
import { generateItem, isGenerationConfigured } from './lib/generateItem'
import { randomPick, loadCatalog } from './lib/catalog'

function isBuilderMode() {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return params.get('builder') === '1' && isGenerationConfigured()
}

export default function App() {
  const [tier, setTier] = useState('')
  const [slot, setSlot] = useState('')
  const [hero, setHero] = useState('')
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const builderMode = isBuilderMode()
  const catalogSize = useMemo(() => loadCatalog().length, [item])

  const filters = {
    tier: tier !== '' ? Number(tier) : null,
    slot: slot !== '' ? slot : null,
    hero: hero !== '' ? hero : null,
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setItem(null)

    try {
      if (builderMode) {
        const result = await generateItem(filters)
        setItem(result)
      } else {
        const pick = randomPick(filters)
        if (!pick) {
          setError(catalogSize === 0
            ? 'Catalog is still being built — no items yet. Check back soon.'
            : 'No items match those filters yet. Try different criteria.')
        } else {
          setItem(pick)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to generate item. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    setItem(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header
        className="no-print"
        style={{
          textAlign: 'center',
          padding: '32px 24px 20px',
          borderBottom: '1px solid #3d1c02',
          position: 'relative',
        }}
      >
        <h1 style={{
          fontFamily: '"Cinzel", Georgia, serif',
          fontSize: 'clamp(22px, 5vw, 36px)',
          fontWeight: 700,
          color: '#c9a227',
          textShadow: '0 0 30px rgba(201,162,39,0.4)',
          margin: '0 0 6px',
          letterSpacing: '0.05em',
        }}>
          HeroQuest Loot Generator
        </h1>
        <p style={{ color: '#7a5a2a', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
          {builderMode
            ? `Builder Mode · ${catalogSize} item${catalogSize === 1 ? '' : 's'} in catalog`
            : 'Drawn from the curated repository of treasures'}
        </p>
        {builderMode && (
          <div style={{
            position: 'absolute', top: 10, right: 14,
            fontSize: 10, color: '#c9a227',
            border: '1px solid #c9a227', borderRadius: 4,
            padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            BUILDER
          </div>
        )}
      </header>

      {/* Main layout */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        padding: '32px 24px 48px',
        maxWidth: 720,
        margin: '0 auto',
        width: '100%',
      }}>

        {/* Selection panel */}
        <section className="no-print" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SelectionPanel
            tier={tier}
            slot={slot}
            hero={hero}
            onTierChange={setTier}
            onSlotChange={setSlot}
            onHeroChange={setHero}
            onGenerate={handleGenerate}
            isLoading={loading}
            buttonLabel={builderMode ? '⚒ Forge New Item' : '⚔ Draw Loot'}
          />
        </section>

        {/* Error message */}
        {error && (
          <div
            className="no-print"
            style={{
              background: '#2a0a0a',
              border: '1px solid #8b1a1a',
              borderRadius: 8,
              padding: '12px 18px',
              color: '#ff6b6b',
              fontSize: 14,
              maxWidth: 340,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Card display */}
        {(loading || item) && (
          <section style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            width: '100%',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 24,
            }}>
              <div>
                <p className="no-print" style={{
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#5a3a0a',
                  letterSpacing: '0.08em',
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                }}>
                  Card Front
                </p>
                {loading ? <LoadingCard /> : <ItemCard item={item} />}
              </div>

              {item && (
                <div>
                  <p className="no-print" style={{
                    textAlign: 'center',
                    fontSize: 11,
                    color: '#5a3a0a',
                    letterSpacing: '0.08em',
                    margin: '0 0 8px',
                    textTransform: 'uppercase',
                  }}>
                    Card Back
                  </p>
                  <CardBack tier={item.tier} />
                </div>
              )}
            </div>

            {/* Builder controls or public share */}
            {item && builderMode && (
              <BuilderControls
                item={item}
                onDiscard={handleDiscard}
                onRegenerate={handleGenerate}
                isLoading={loading}
              />
            )}
            {item && !builderMode && <SharePanel item={item} />}
          </section>
        )}

        {/* Empty state */}
        {!loading && !item && !error && (
          <div className="no-print" style={{
            textAlign: 'center',
            color: '#3d1c02',
            fontSize: 14,
            fontStyle: 'italic',
            padding: '20px 0',
          }}>
            {builderMode
              ? 'Choose criteria above, then forge a candidate item to review and save.'
              : 'Choose your criteria above, then draw your loot.'}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer
        className="no-print"
        style={{
          textAlign: 'center',
          padding: '16px 24px',
          borderTop: '1px solid #3d1c02',
          color: '#3d1c02',
          fontSize: 11,
        }}
      >
        HeroQuest is a trademark of Hasbro. This is a fan tool not affiliated with or endorsed by Hasbro.
      </footer>

    </div>
  )
}
