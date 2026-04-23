import React from 'react'

function SkeletonLine({ width = '100%', height = 14, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 4, ...style }}
    />
  )
}

export default function LoadingCard() {
  return (
    <div
      style={{
        width: 300,
        minHeight: 420,
        borderRadius: 12,
        border: '3px solid #5a3a0a',
        background: 'linear-gradient(160deg, #f5e6c8 0%, #e8d4a0 60%, #d4b87a 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header skeleton */}
      <div style={{ background: '#2a200a', padding: '10px 14px 8px' }}>
        <SkeletonLine width="70%" height={18} style={{ marginBottom: 6 }} />
        <SkeletonLine width="35%" height={11} />
      </div>

      {/* Art area */}
      <div style={{
        height: 100,
        background: 'linear-gradient(160deg, #2a1400 0%, #3d1c02 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid #5a3a0a',
          borderTopColor: '#c9a227',
          animation: 'spin 1s linear infinite',
        }} />
      </div>

      {/* Dice row */}
      <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)' }}>
        <SkeletonLine width="60%" height={26} />
      </div>

      {/* Effect text */}
      <div style={{ padding: '10px 14px', flex: 1 }}>
        <SkeletonLine width="100%" style={{ marginBottom: 6 }} />
        <SkeletonLine width="85%" style={{ marginBottom: 6 }} />
        <SkeletonLine width="70%" />
      </div>

      {/* Flavor */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
        <SkeletonLine width="90%" height={11} style={{ marginBottom: 4 }} />
        <SkeletonLine width="65%" height={11} />
      </div>

      {/* Footer */}
      <div style={{ padding: '6px 14px', background: '#2a200a', display: 'flex', justifyContent: 'flex-end' }}>
        <SkeletonLine width={60} height={10} />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
