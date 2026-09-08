import type { FaqEntry } from '../config/types'

export function Faq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null
  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-4">
      <h2 id="faq-heading" className="font-mono text-xs uppercase tracking-widest text-ivory-dim">
        Questions
      </h2>
      <dl className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border-l-2 border-purple/60 pl-4">
            <dt className="text-base font-semibold text-ivory">{entry.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ivory-dim">{entry.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
