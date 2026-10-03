# UK Outbound V5 — local review

Review date: 3 October 2026. Status: local QA passed; not committed, merged or pushed. Production remains unchanged.

## 1. Deployment architecture

Buildless HTML/CSS/vanilla JavaScript on GitHub Pages. No package.json, framework, client router, database or server application. The repository root is the publishable static output; `.nojekyll` is preserved.

Remote: `git@github.com:Eric-Guo12138/eguolabs-site.git`.

The live domain returned HTTP 200 with `server: GitHub.com`. The repository's built-in **pages build and deployment** run [34822226528](https://github.com/Eric-Guo12138/eguolabs-site/actions/runs/34822226528) successfully deployed main commit `82700e9a623b368fdc0a6f01f9b69a798affba32` (Create CNAME). There are no custom workflow files, Vercel, Netlify, Firebase or Cloudflare deployment configurations in the checkout. Provider settings were not changed. No separate preview-deployment configuration was found.

## 2. Branches and baseline

Production branch: `main`. Local review branch: `v5-site-refresh`, based on current `origin/main` at `82700e9`. The pre-existing remote CNAME commit was fetched before editing. The review branch has no upstream, avoiding an accidental default push to main.

Before editing: JavaScript syntax passed. The old gitignored `qa/check-static.py` failed on a stale mailto assertion that rejected the previously approved pilot email body; it also contained an outdated no-CNAME assumption. This was recorded as a test-baseline issue, not a site regression. The new documented verifier is `scripts/check_site.py`.

TypeScript, configured lint and production-build commands did not exist. Local baseline hashes and original results are recorded in gitignored `qa/v5/baseline.json`.

## 3. Changed files

Modified: `index.html`, `styles.css`, `privacy.html`, `sitemap.xml`, `README.md`.

Added: `quote-sprint/index.html`, `scripts/check_site.py`, this review report, and four proof assets under `assets/proofs/` (two PDFs and two WebP previews).

The existing JavaScript, videos, posters, favicon, robots.txt, .gitignore, .nojekyll and CNAME match the baseline. Privacy notice main content matches the baseline exactly; only its shared navigation and footer positioning were aligned.

## 4. Homepage

The hero now explains quotation workflow pilots and shows £300 fixed / 48-hour turnaround, no CRM or ERP integration and redacted input. Its primary CTA opens the quotation-sprint page.

Two outcome cards explain Quote-Ready (10 RFQs) and Quote Recovery (20–50 quotations). Four steps cover sample, reviewed proof, paid pilot and deciding whether further implementation is worthwhile. Added illustrative output previews, data-handling boundaries, human review, founder identity and a direct email CTA. Battery and Power prototypes remain lower on the page, with their existing interactions preserved.

## 5. Quotation-sprint page

`quote-sprint/index.html` implements `/quote-sprint/` using a native static directory route. `/quote-sprint` redirects to the directory URL without a client router or provider rewrite.

Both offers include input scope, deliverables, £300 fixed terms, 48 hours after complete pilot input is received, relevant access limits and technical/commercial review boundaries. The page also includes proof, data handling, human review, Eric Guo's identity and contact details.

## 6. Proof assets

Existing V5 client-facing illustrative exports were found locally and checked against the frozen V5 example documentation. Both one-page PDFs were visually inspected. They contain no internal builder interface, controls, provider information or commercial-context fields. PDFs were copied byte-for-byte; WebP previews are full-page renderings rather than fabricated screenshots.

| Asset | SHA-256 of original PDF and repository copy |
| --- | --- |
| `assets/proofs/quote-ready-v5-illustrative.pdf` | `2e80eea06e721a4421ddb6e51d848df8807407e5ddba7b743d31b4f52d5422b9` |
| `assets/proofs/quote-recovery-v5-illustrative.pdf` | `7a83cc608a451dedf591b099d9ec479958f227ff8b3128ce92142202ac10a5da` |

Source names: “EGuo Labs — Quote-Ready Review — Example Battery Systems Ltd.pdf” and “EGuo Labs — Quote Recovery Review — Example Battery Systems Ltd.pdf”. Both are dated 3 October 2026 and explicitly marked illustrative / no customer data used. The fictional example company is not represented as a customer or as EGuo Labs' legal identity. The Micro-proof Builder was not modified.

## 7. Metadata

Homepage title: **EGuo Labs | Quotation Workflow Pilots**.

Landing title: **Quotation Workflow Pilot | EGuo Labs**.

Descriptions, OpenGraph titles/descriptions/URLs and canonical URLs align with the requested positioning. The existing sitemap now includes `/quote-sprint/`. Favicon and robots.txt remain unchanged.

## 8. Responsive and accessibility verification

| Page | 1440px | 1024px | 768px | 390px |
| --- | --- | --- | --- | --- |
| Homepage | Pass | Pass | Pass | Pass |
| Quotation sprint | Pass | Pass | Pass | Pass |

Document scroll width equalled viewport width at all eight page/size combinations. Headings and buttons were not clipped; proof images retain their aspect ratios; offers and detail cards stack on mobile. The existing industry selector intentionally scrolls within its own mobile tab strip without causing page overflow.

Verified one H1 per page, unique IDs, matching ARIA references, meaningful proof alt text, visible focus, mobile menu/Escape, keyboard demo and industry tabs, native FAQ keyboard activation, modal focus containment and focus return. Offers have HTML explanations in addition to proof images. Existing visual tokens are retained. Core contrast ratios: ink/paper 13.80:1, muted/paper 5.29:1, blue/white 5.69:1, human-review text/dark 7.72:1. These are targeted checks, not a claim of a complete accessibility certification.

## 9. Existing demos and other interactions

- Battery and Power/Charger tabs select their corresponding panels; keyboard switching works.
- Battery video loads, decodes and plays to its 41.17-second end. Power/Charger playback advanced to 18.36 seconds of 39.20 seconds with readyState 4.
- Both dialogs fit on desktop/mobile, start without autoplay, retain native controls and display the correct supporting copy.
- Close button, Escape and backdrop dismissal work; source cleanup and focus restoration were checked. Tab/Shift+Tab focus stays inside the modal.
- All four industry tabs and five FAQ entries work. FAQ keeps one answer open; keyboard activation can close it.
- Existing direct MP4 URLs and demo section/panel anchors remain valid.
- Privacy page renders at desktop/mobile, retains its notice text and links back to the site and new landing page.
- All 18 mailto links resolve to eric@eguolabs.com. Pilot CTAs use subject “Quotation sprint”; ordinary header links retain “EGuo Labs enquiry”; ordinary footer/contact links have no body. Email applications were not launched and no message was sent.

## 10. Tests and resources

`python3 scripts/check_site.py`: **8/8 passed** (links/assets/anchors, semantic references, mailto, metadata/sitemap, original video hashes, no new external runtime/forms, offer/proof labels, static deployment files).

`node --check script.js`: **passed**.

`git diff --check`: **passed**.

HTTP verification: **19/19 page and asset URLs returned 200**, including the trailing-slash route destination, privacy, both PDFs, both WebP previews, both videos, both posters, favicon, CSS, JS, robots and sitemap. Local HTTP results are in gitignored `qa/v5/http-results.json`. Browser error/warning log was empty after interaction checks. Proof images loaded with nonzero natural dimensions.

## 11. TypeScript

Not applicable: no TypeScript source/configuration or package script. No TypeScript build was claimed.

## 12. Lint

No configured lint tool. JavaScript syntax and Git whitespace checks passed; no new lint dependency was added.

## 13. Production build

Not applicable: production serves the checked-in static files directly. Local static serving and route/asset verification passed. The provider's deployment run and public-domain smoke test can only be repeated after release approval and publication.

## 14. Publication command — only after approval

Review locally at `http://127.0.0.1:8000/` and `http://127.0.0.1:8000/quote-sprint/`.

After explicit approval, stage and commit the reviewed file set, fetch origin and inspect any newer main changes. Do not force-push. If main has advanced, reconcile and rerun checks first. Once the approved commit is ready on this branch, the exact production push is:

```sh
git push origin HEAD:main
```

This command has **not** been run. DNS, MX, domain and provider settings are unchanged.

## 15. Auto-deployment

Yes. Updating main triggers GitHub Pages' built-in deployment and updates **eguolabs.com** after that deployment succeeds. There is no configured branch preview; the current review is local. After release, verify the Pages run, homepage, quotation-sprint route, privacy page, proofs and both videos on the live domain.
