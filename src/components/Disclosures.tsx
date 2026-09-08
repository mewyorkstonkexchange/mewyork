export function Disclosures({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="disclosures-heading" className="flex flex-col gap-3">
      <h2 id="disclosures-heading" className="font-mono text-xs uppercase tracking-widest text-ivory-dim">
        Disclosures
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-xs leading-relaxed text-ivory-dim">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
