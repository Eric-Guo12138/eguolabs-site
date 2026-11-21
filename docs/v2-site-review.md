# EGuo Labs Website V2 — local review

Date: 21 November 2026. Baseline: `4a62d1dfa635a2a8d293bac2300698a05be6c0a3` on `v5-site-refresh`. The working tree was clean before implementation. No commit, push or production publication was performed.

## A. Summary

Repositioned the existing static site as a focused independent practice developing bespoke automation for sprinkler estimating and related technical workflows. Replaced the previous RFQ sales journey with the requested ten-section homepage, original engineering illustration, interactive workflow, direct email contact and updated privacy presentation.

## B. File set

Modified: `index.html`, `styles.css`, `privacy.html`, `quote-ready/index.html`, `quote-sprint/index.html`, `sitemap.xml`, `scripts/check_site.py`, `README.md`.

Created: `v2.js`, `assets/v2/social.svg`, `assets/v2/social.jpg`, `docs/v2-site-review.md`.

No files were deleted. Local screenshots are in ignored `qa/`. Legacy source scripts and media remain in the repository, unlinked from the current primary site.

## C. Design

Navy and teal engineering hero, light solution sections, restrained technical grids, original SVG linework, distinct drawing/schedule/review visual motifs and system sans-serif typography with monospaced data labels. No remote fonts or animation libraries. The mobile hero stacks the illustration and enlarges record text rather than scaling an entire desktop screenshot.

Pipe selection and record-row selection synchronise their states and the explanatory review text. Four workflow stages use labelled tab panels with keyboard support. Native details elements provide eight FAQ disclosures. The menu supports anchor navigation and Escape. Motion is progressive enhancement and disabled by the reduced-motion media query.

## D. Verification

Baseline: the previous 10 static tests and `node --check script.js` passed before editing.

Final automated checks:

- `python3 scripts/check_site.py`: 10/10 passed, covering local paths/anchors, semantics and ARIA references, contact addresses and subjects, old offer removal, migration pages, interactive element relationships, runtime dependencies, preserved infrastructure/media and metadata/accessibility guards.
- `node --check v2.js`: passed.
- `node --check script.js`: passed.
- `git diff --check`: passed after removing a trailing blank line.
- Local HTTP requests: 200 for homepage, privacy, both legacy routes, CSS, V2 JavaScript, favicon, both social illustration formats, sitemap and robots.

Browser checks performed: SVG keyboard selection, row-to-diagram selection, all four workflow tabs, ArrowRight wrap and End navigation, all eight FAQ disclosures, mobile menu open/navigation/Escape, both legacy redirects reaching `/#solutions`, privacy rendering, all visible mailto destinations and selected panel states. The copy-email button reported success; the browser automation clipboard readback was empty, so cross-application clipboard transfer is not independently confirmed. Email-client launching/sending was not performed.

A console entry appeared when the original SVG was opened directly in the browser image viewer (`Cannot use 'in' operator to search for 'animation' in undefined`). Its timestamp corresponds to that asset view, not a site interaction; a clean-tab console confirmation must be distinguished from this viewer event. Creating a clean tab and reconnecting to the existing tab both timed out in the browser tool. Consequently the final clean-console check remains unconfirmed; this report does not claim a fully clean console result.

## E. Responsive review

Checked 360, 390, 768, 1024 and 1440 CSS pixel widths. Document scroll width equalled viewport width at every size. Desktop and mobile screenshots were reviewed; no horizontal overflow or major overlapping/clipped content was found. Fixed missing word spacing when heading line breaks disappear on mobile. Increased mobile pipe labels, record text and explanations. Privacy at 390px also has no horizontal overflow.

## F. Content

Removed visible Quote-Ready/Recovery offers, fixed-price RFQ claims and old Battery/Power demonstrations from the primary website. Both old sales URLs remain usable as migration pages. Scope, validation, human engineering responsibility and agreed project deliverables are explicit. No invented customer logos, testimonials, certifications, guaranteed accuracy, savings metrics, integration promises or mature SaaS claims were introduced.

## G. Original assets

All new technical graphics were authored as SVG/HTML/CSS using synthetic sample data. No third-party drawing, planning-archive image, source-PDF crop, external software screenshot or third-party logo was introduced. The four named research PDFs are not embedded or linked. Existing unrelated legacy assets were not deleted or modified.

## H. Limits

This is a static service website with an illustrative interface, not an operational extraction product. No form backend or upload feature was added. No production deployment or live-domain QA was performed. Lighthouse scoring, a full assistive-technology audit, reduced-motion device emulation and a multi-browser/device matrix were not run. Reduced-motion rules and keyboard behaviour were checked in source and browser respectively. Migration uses HTML refresh and a fallback link because no server redirect facility is configured. Social-card ingestion by third-party platforms is not independently verified.

CNAME, .nojekyll, robots.txt, original favicon, script.js and legacy videos/proofs/posters remain unchanged. No DNS, MX, SPF, DKIM, DMARC, hosting or email settings were changed.

## I. Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. The current preview uses this address. Stop an existing local server before starting a second process on port 8000. Approval is required before publishing this redesign.
