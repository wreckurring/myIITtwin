import './Skeleton.css'

export function SkeletonLine({ width = '100%', height = '14px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: '6px', ...style }}
    />
  )
}

export function SkeletonBubble({ align = 'left' }) {
  return (
    <div className={`skeleton-bubble-wrap skeleton-bubble-wrap--${align}`}>
      {align === 'left' && <div className="skeleton skeleton-avatar" />}
      <div className="skeleton-bubble-lines">
        <div className="skeleton" style={{ height: '13px', width: '80%', borderRadius: '6px' }} />
        <div className="skeleton" style={{ height: '13px', width: '60%', borderRadius: '6px', marginTop: '6px' }} />
      </div>
    </div>
  )
}

export function SkeletonLogItem() {
  return (
    <div className="skeleton-log-item">
      <div className="skeleton" style={{ height: '11px', width: '52px', borderRadius: '4px' }} />
      <div className="skeleton" style={{ height: '13px', width: '55%', borderRadius: '6px' }} />
      <div className="skeleton" style={{ height: '11px', width: '40px', borderRadius: '4px' }} />
    </div>
  )
}
