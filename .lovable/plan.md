# Goal

Make DOSSIER X end-to-end playable:
1. Every case (including DX-001) is bought on Gumroad as a `.casepack` file.
2. User imports the `.casepack` inside the app to unlock and play.
3. Playing exposes real data: Crime Scene, Evidence, Documents (aged-paper style), Suspects, Witnesses, Timeline, Notebook.
4. When user submits the Final Report with correct answers, they get a personalized certificate (name + case + rank + date, PDF download).
5. Full audit of every route/button so nothing is dead.

# Scope

## 1. Casepack format & import
- Define `.casepack` = ZIP with `manifest.json`, `case.json`, `documents.json`, `witnesses.json`, `suspects.json`, `evidence.json`, `timeline.json`, `solution.json`, `certificate.json`, and `assets/` folder (images/audio).
- `src/lib/casepack.ts`: unzip via `jszip`, validate manifest, persist parsed data + object-URL assets into IndexedDB (via `idb-keyval`) under key `case:<id>`.
- `src/lib/catalog.ts`: merge static catalog (locked previews + Gumroad URL per case) with imported cases from storage → `status: "owned"`.
- Archive page: add **Import Investigation** button (file picker → parse → toast → refresh).
- Every case gets a Gumroad URL field. `DX-001` becomes locked-by-default until imported (matches user request).

## 2. Purchase dialog
- Replace `alert()` with `window.open(entry.gumroadUrl, "_blank")` + inline hint "After purchase, download the `.casepack` file and click Import Investigation".

## 3. Case sections (replace stubs in `_app.case.$caseId.$section.tsx`)
Split into real components reading from imported casepack:
- **Crime Scene**: photo grid + zoom viewer + numbered evidence markers (image-4 style).
- **Evidence Locker**: card grid, detail panel with description/report/notes.
- **Documents**: **aged bilingual paper** renderer (image-8 style) — cover, TOC, police report, autopsy, DNA, fingerprints, call logs — one component `PaperDocument` with tabs.
- **Suspects**: dossier cards with photo, motive, alibi, timeline.
- **Witnesses**: list + detail sidebar (image-2 style).
- **Timeline**: vertical rail with icons + polaroid pin (image-3 style).
- **Notebook**: textarea auto-saved to localStorage per case.

## 4. Final Report + Certificate
- `_app.case.$caseId.submit.tsx`: form with the case's questions (killer / motive / weapon / entry / cover-up). Compare against `solution.json` (case-insensitive, accepts alt answers array).
- Score = correct/total. Rank: 100% "Master Detective", 80% "Senior Detective", 60% "Detective", <60% "Trainee".
- On submit: store certificate result in localStorage, redirect to `/case/:id/certificate`.
- `_app.case.$caseId.certificate.tsx`: rendered certificate (gold border, seal, detective name, case, rank, %, date). "Download PDF" via `html2canvas` + `jspdf`.
- Certificates page lists earned + locked certificates.

## 5. Audit pass
- Verify all sidebar links route correctly.
- Verify splash → archive → case → section → submit → certificate works.
- Verify achievements/settings render (settings gets working theme + name edit).
- Fix any broken imports.

## 6. Sample casepack for DX-001
- Ship a bundled `DX001.casepack` in `/public/` so users can test the import flow without buying, and a "Load Demo Case" button on the archive when empty.

# Technical notes

Deps to add: `jszip`, `idb-keyval`, `jspdf`, `html2canvas`.

Files created:
- `src/lib/casepack.ts`, `src/lib/store.ts`, `src/lib/certificate.ts`
- `src/components/PaperDocument.tsx`, `src/components/CertificateCard.tsx`, `src/components/ImportButton.tsx`
- `src/routes/_app.case.$caseId.crime-scene.tsx`, `.evidence.tsx`, `.documents.tsx`, `.suspects.tsx`, `.witnesses.tsx`, `.timeline.tsx`, `.notebook.tsx`, `.submit.tsx`, `.certificate.tsx` (replaces `$section.tsx`).
- `public/DX001.casepack` (built from `/tmp/dx003` data, retitled to Room 308).

Files edited:
- `src/lib/catalog.ts` — add `gumroadUrl`, mark DX-001 locked.
- `src/components/PurchaseDialog.tsx` — real Gumroad link + import hint.
- `src/routes/_app.archive.tsx` — Import button.
- `src/routes/_app.certificates.tsx` — real gallery.
- `src/routes/_app.settings.tsx` — working profile edit.

# Out of scope

- Actual Gumroad merchant integration (URLs are placeholders you can swap).
- Server-side license/DRM (casepacks are portable files, per your design).
- Casepack Generator admin panel.

Approve and I'll build it in one pass.