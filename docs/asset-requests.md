# Assets

Every image slot on the site is filled with delivered, signed-off artwork. There is no
placeholder left in the build. `assets/manifest.json` is the record: one entry per file,
with its source, dimensions, alt text, allowed use and approval status.

## Delivered

| ID | Placement | Served file | Approval |
| --- | --- | --- | --- |
| `HERO-01` | Hero backdrop and the Chairman section | `public/hero-chairman.webp`, PNG fallback | approved-by-founder |
| `HERO-PORTRAIT-01` | Hero on viewports under 720px, above the copy | `public/chairman-portrait.webp`, PNG fallback | approved-by-founder |
| `SHARE-01` | `og:image` / `twitter:image` | `public/share-chairman.png`, WebP alongside | approved-by-founder |
| `FAVICON-01` | Browser tab icon | `public/favicon.svg` | approved-by-founder |

Masters and the off-site set — profile photos, the X banner, the reveal post, the source
crop — are in `assets/source/` and registered in the manifest. They are not served by the
site.

## Rules that hold for any re-delivery

- Nothing the page loads may exceed 400 KB. `src/test/manifest.test.ts` enforces it.
- Web derivatives are deterministic resizes, crops and re-encodes of a delivered master.
  Anything repainted is a new master with a new manifest entry, not a new version of a
  derivative.
- Every manifest path must point at a file that exists; the same test enforces that too.
- The wide hero puts the Chairman on the right, so a narrow viewport needs the separate
  portrait crop rather than a `cover` crop of the wide file.
- Third-party-referencing work needs its reference recorded in `referenceNotes` and flagged
  for review before commercial publication.

## Still open

`BRAND-TYPE-01` — typefaces. The site uses Georgia for display and the system sans and mono
elsewhere, which is what the delivered design specifies. If a licensed pair is chosen later,
self-host the files; the static build loads no third-party font CDN.
