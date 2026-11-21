# EGuo Labs

Buildless marketing website for bespoke sprinkler estimating automation. Semantic HTML, shared responsive CSS and small vanilla JavaScript interactions. No build installation, server application, analytics or third-party JavaScript dependencies. Enquiries are submitted to the existing Formspree endpoint over HTTPS.

## Structure

- `index.html`: positioning, solutions, synthetic pipework explorer, example deliverables, five customisation dimensions, three contact stages, FAQ and an asynchronous enquiry form.
- `styles.css`: shared design tokens, layouts, responsive rules and reduced-motion support.
- `v2.js`: mobile navigation, pipe/record association, independent accessible tab groups and copy-email action.
- `contact.js`: validation, asynchronous Formspree submission, loading, success and error handling.
- `privacy.html`: Formspree and email-processing privacy notice; `/privacy/` redirects here.
- `quote-ready/index.html`, `quote-sprint/index.html`: legacy migration pages, with immediate HTML refresh to the homepage solutions section and a manual fallback link. These are not HTTP 301 responses.
- `assets/v2/social.svg`, `assets/v2/social.jpg`: original social illustration and browser-rendered JPEG.
- `scripts/check_site.py`: dependency-free static verification.
- `docs/v2-site-review.md`: original V2 implementation and QA handoff.
- `docs/v2.1-site-review.md`: historical V2.1 handoff.
- `docs/v2.1-final-release.md`: final release gates and production verification.
- `qa/`: local screenshots, ignored by Git.

Original `script.js`, videos, posters and proof files are retained unchanged but are not loaded or linked by the new primary website. No source research PDFs or extracted third-party drawings were added.

## Local preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit http://127.0.0.1:8000/ and http://127.0.0.1:8000/privacy.html.

```sh
python3 scripts/check_site.py
node --check v2.js
node --check contact.js
node --check script.js
git diff --check
```

There is no package manager, TypeScript configuration, lint command or production build step. The static files are the deployment output. Review at 360, 390, 768, 1024 and 1440 CSS pixels. Test keyboard selection, mobile navigation, FAQs and contact controls. Diagrams are explicitly illustrative; no extraction engine, spreadsheet export backend or customer portal is implemented.

## Deployment

Existing production hosting: GitHub Pages, `main`, repository root, domain `eguolabs.com`. Keep `CNAME`, `.nojekyll`, `robots.txt`, domain records and email infrastructure unchanged. V2.1 Final publication is authorised after release gates pass. Stage only reviewed website files, fetch origin/main, stop on unexpected upstream changes and never force-push. Confirm the Pages run and live domain after publication.

## Maintaining the design

Edit page copy in the semantic HTML sections. Colour and typography tokens live at the top of `styles.css`; responsive rules follow the shared styles. Hero record descriptions and selection behaviour are in `v2.js`. Keep matching `data-run` values on each pipe and record row, and preserve tab/panel ARIA relationships. All synthetic records must remain labelled and must not become customer-result claims.

## V2.1 interaction notes

Primary discovery CTAs lead to `#contact`. The form posts to the existing public endpoint `https://formspree.io/f/xppdjdle` using FormData and JSON responses. Name, work email, category and workflow description are required; company is optional. The `email` field supplies Formspree's Reply-To value; `subject` is generated from a controlled category. No credentials are present in source. Only a successful HTTP response with `ok: true` produces success and resets the form. Failures retain content. A honeypot, length limits and duplicate-submit guard complement provider spam controls. Direct email remains available.

Pipe records in the hero and deliverables explorer share selection state. The nested export-format tabs operate independently of the deliverable tabs, customisation dimensions and three-stage working-together component. Synthetic P-03 keeps diameter and centreline length unresolved consistently across views. No sample download is advertised.

## Browser acceptance

The test tools are development-only and do not ship as runtime dependencies. With Playwright installed in an isolated directory and local Chrome available:

```sh
NODE_PATH=/tmp/eguolabs-release-qa/node_modules node scripts/browser_qa.cjs
NODE_PATH=/tmp/eguolabs-release-qa/node_modules node scripts/contact_qa.cjs
```

The browser suite intercepts all form POSTs; it never creates real enquiries. `QA_BASE` can select the deployed origin for the main suite. The contact edge-case suite uses localhost. Actual provider acceptance and mailbox delivery must be checked separately, with a controlled test and no automatic resubmission.
