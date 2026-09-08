type PlaceholderProps = {
  /** Manifest id from assets/manifest.json. */
  id: string
  /** What the finished asset shows, in the words used in docs/asset-requests.md. */
  description: string
  dimensions: string
  className?: string
}

export function Placeholder({ id, description, dimensions, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Development placeholder for ${description}. Awaiting asset ${id}.`}
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-purple/70 bg-navy-deep/60 p-4 text-center ${className ?? ''}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-widest text-purple-soft">Placeholder</span>
      <span className="text-sm text-ivory-dim">
        {description}, awaiting Astra asset <span className="font-mono text-ivory">{id}</span>
      </span>
      <span className="font-mono text-[11px] text-ivory-dim/70">{dimensions}</span>
    </div>
  )
}
