import type { FaqEntry } from '../config/types'

export function Faq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null
  return (
    <section id="questions" className="faq" aria-labelledby="faq-heading">
      <div>
        <p className="section-label">BEFORE YOU ASK</p>
        <h2 id="faq-heading">
          A few matters
          <br />
          for the <em>record.</em>
        </h2>
      </div>
      <div>
        {entries.map((entry) => (
          <details key={entry.id}>
            <summary>{entry.question}</summary>
            <p>{entry.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
