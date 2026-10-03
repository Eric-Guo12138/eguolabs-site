# EGuo Labs

A buildless website for quotation workflow pilots for technical B2B teams: Quote-Ready and Quote Recovery. Semantic HTML, responsive CSS and vanilla JavaScript. No package installation, server application, forms, tracking or runtime services.

## Structure

```text
index.html                  Homepage and existing Battery / Power demos
quote-sprint/index.html      Quotation workflow pilot landing page
privacy.html                Privacy notice
styles.css                  Shared visual system
script.js                   Existing navigation, tabs, video dialog and FAQ
assets/videos/              Unmodified Battery and Power recordings
assets/images/              Original video-frame posters
assets/proofs/              V5 illustrative PDFs and rendered WebP previews
favicon.svg
robots.txt
sitemap.xml
.nojekyll
CNAME                       Existing production domain; do not change
scripts/check_site.py        Dependency-free static verification
qa/                         Local review evidence (gitignored)
```

## Local review

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000/` and `http://127.0.0.1:8000/quote-sprint/`. The directory route also accepts `/quote-sprint` with a trailing-slash redirect. All internal links and assets use relative paths. No router or rewrite configuration is required.

```sh
python3 scripts/check_site.py
node --check script.js
```

There is no TypeScript configuration, lint script or production build. The checked-in static files are the production output. Review both pages at 1440, 1024, 768 and 390px, plus the existing video dialogs, tabs, FAQ, email links and privacy page. Local tests do not replace post-release checks of the live domain.

## Deployment — approval required

Remote: `git@github.com:Eric-Guo12138/eguolabs-site.git`.
Production: GitHub Pages, `main`, repository root, existing `eguolabs.com` domain. GitHub's built-in **pages build and deployment** workflow is visible in the repository Actions history; there is no custom workflow in this checkout. Updating production `main` triggers deployment to the live domain. No separate preview-deployment configuration was found; use the local preview for this review.

V5 work is on the local `v5-site-refresh` branch. Do not publish until Eric approves the reviewed changes. After approval, commit the reviewed files, fetch the latest `origin/main` and reconcile any new upstream changes before release. The production publication command, from the approved review branch, is:

```sh
git push origin HEAD:main
```

Do not force-push. If the push is rejected, stop and inspect the upstream changes. After the Pages workflow succeeds, check `/`, `/quote-sprint/`, `/privacy.html`, the proof PDFs and both recordings on the live domain. Preserve `CNAME`, DNS, MX and the existing provider settings.

## Proofs and media

The two single-page V5 PDFs were copied unchanged from the existing client-facing illustrative exports, dated 3 October 2026. WebP previews are full-page renderings of those PDFs. Both are explicitly labelled illustrative, with no customer data. The internal Micro-proof Builder and its controls are not shipped.

Original videos are unchanged: Battery 41.17s, 1920×968, 1,938,683 bytes; Power 39.20s, 1920×1080, 6,373,234 bytes. Posters are actual frames at 26s and 10s respectively. Video sources are attached only when a demo is opened, use native controls and never autoplay.
