# Asset requests for Astra

Every image slot on the site is currently a labelled development placeholder. Each request
below has a manifest id; delivering an asset means dropping the file at the listed path and
updating its entry in `assets/manifest.json` (bump `version`, set `approvalStatus`).

Nothing here specifies art direction, composition or copy. Descriptions are only what the
slot is for and what the layout needs geometrically.

## Website slots

| ID | Placement | Dimensions | Aspect | Format | Notes |
| --- | --- | --- | --- | --- | --- |
| `LOGO-01` | Header wordmark lockup | 512x128 | 4:1 | SVG | Needs a square-croppable mark for the favicon and social avatar. Legible at 120px wide. |
| `HERO-01` | Hero band under the headline | 1600x900 | 16:9 | WebP + PNG fallback | Rendered in a 16:9 box that is full width up to 768px. Must survive a 1:1 and a 4:5 centre crop on mobile. |
| `CHAIRMAN-CUTOUT-01` | Footer character cutout | 800x1000 | 4:5 | Transparent PNG | Sits on a dark background; needs a clean alpha edge, no baked-in shadow on white. |
| `SHARE-01` | `og:image` / `twitter:image` | 1200x630 | 1.91:1 | PNG or JPG | Link previews crop the outer edge; keep the subject inside a 60px inset. |
| `FAVICON-01` | Browser tab icon | 64x64 master | 1:1 | SVG | Must read at 16x16. |

## Non-image decisions blocked on Astra

| ID | What is needed |
| --- | --- |
| `BRAND-TOKENS-01` | Exact hex values for the six named palette colours. The site currently ships provisional values in `src/index.css`: navy `#0a1030`, deep navy `#060a1f`, black `#05050a`, ivory `#f5f1e6`, pink `#ff5fa2`, electric green `#22e07a`, purple `#7b5cd6`. Purple is used only for borders and labels because it does not clear text contrast on navy at body size. |
| `BRAND-TYPE-01` | Typefaces. The site uses the system sans and system mono until a licensed pair is chosen. Self-host the files; no third-party font CDN is in the CSP-free static build. |
| `COPY-FAQ-01` | Final wording for the four FAQ answers and the four disclosure lines in `src/site.config.ts`. They are written plainly and factually as placeholders; brand voice is Astra's call, but the factual content must not change. |

## Delivery format

For each asset: clean art with no baked captions, a transparent version where the slot
takes one, alt text, and the crops listed above. Third-party-referencing work needs its
reference recorded in the manifest `referenceNotes` field and flagged for review before
publication.
