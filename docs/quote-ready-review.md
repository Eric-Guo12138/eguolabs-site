# Quote-Ready local review — 7 October 2026

Status: implemented and validated locally; not committed or deployed. Starting commit: `231f57f50873bd27556a9260255828c16703fe16`, branch `v5-site-refresh`.

## Files and routes

- `index.html`: primary Quote-Ready journey, problem and Before/After sections, worked RFQ, one-RFQ proof, updated FAQ and founder text; Recovery and prototypes moved lower.
- `quote-ready/index.html`: new dedicated sales page at `/quote-ready/`.
- `quote-sprint/index.html`: identical compatibility page with canonical `/quote-ready/`; existing anchors preserved. No client-side redirect.
- `privacy.html`: shared navigation links only; privacy notice unchanged.
- `styles.css`: scoped additions using existing colours, typography, cards and responsive conventions.
- `sitemap.xml`: canonical Quote-Ready route replaces legacy alias.
- `scripts/check_site.py`: checks new route, commercial constraints, mailto encoding, compatibility and preserved asset/script hashes.
- `README.md`: local route and review instructions.
- This review document.

Slashless directory URLs receive the local static server's normal trailing-slash redirect. GitHub Pages behaviour must be verified separately after an approved release. No routing infrastructure was changed.

## Exact major copy

Hero:
> Technical RFQs arrive incomplete. We make them quote-ready before your estimator touches them.

Subheadline:
> Lightweight quotation workflows for technical manufacturers — without replacing your ERP, CRM or estimating system.

Hero CTAs: **See a worked RFQ** / **Start with one RFQ**.

Reassurance:
> 48-hour fixed sprint · Redacted data accepted · No integration · Human-reviewed

> Full sprint: 10 RFQs · £300 fixed

Problem: **Where quotation time gets lost.**

Before/After: **Turn the first pass into a Quote-Ready Pack.**

Worked example: **Worked RFQ Example — Quote-Ready Review**; **Illustrative example — no customer data used.**; status **NOT QUOTE-READY**.

Risk reversal:
> Start with one RFQ first.
> Send one redacted RFQ and I’ll return the Quote-Ready output.
> If it isn’t useful, stop there — no need to continue with the £300 sprint.

**No charge / No obligation / No integration.**

Batch addition: **A short summary of recurring intake gaps.**

Recovery: **Already quoted? Review what needs a next action.** under **Also available**.

Prototype titles: **From RFQ to Quote-Ready Pack — Battery Example** and **From RFQ to Quote-Ready Pack — Power Example**.

Founder:
> EGuo Labs is an independent quotation-workflow practice focused on practical automation for technical B2B teams.
> I build small, testable workflows around real RFQ and quotation processes before proposing larger implementation work.

Final CTA: **Have one incomplete RFQ worth testing?** / **Test one RFQ** / **View worked example**.

One-RFQ mailto subject: **One RFQ test**, recipient `eric@eguolabs.com`.

```text
Hi Eric,

I have an RFQ I'd like to test.

Company:
RFQ type:

Thanks,
```

Normal header/footer email links retain their previous behaviour and have no prefilled body. The seven supplied FAQs are implemented. The process uses the permitted four-step arrangement, with the no-charge/no-obligation decision in step 2.

## Content integrity audit

All public sales sections were reviewed against the supplied brief.

| Category | Statements and basis |
| --- | --- |
| A — commercial offer facts | Up to 10 redacted RFQs, eight per-RFQ outputs, recurring-gap summary, £300 fixed, 48 hours after complete agreed input; one-RFQ proof at no charge/no obligation; Recovery 20–50 rows, £300, 48 hours. These are the user-supplied offer terms, not historical results. |
| B — illustrative example facts | Problem blocker cards explicitly labelled examples. Worked RFQ confirmed application/voltage/capacity/volume and missing current/dimensions/BMS/environment match the existing illustrative PDF. NOT QUOTE-READY is preserved. Recovery PDF and both videos remain labelled illustrative/demo material; no customer deployment is claimed. Industry tabs describe inputs to clarify, not customer case studies. |
| C — process/boundary statements | Extract/check/clarify, human-reviewed first pass, technical and commercial decisions remain with the customer, missing information stays visible, no integration/access needed, redaction and confidentiality caveat, optional later implementation. Founder text is the supplied description. |

No customer names presented as real customers, testimonials, performance metrics, ROI, certifications, employee counts, partnerships or deployment claims were added. Privacy notice is unchanged. No new tracking, forms, third-party scripts or dependencies.

## Reused assets

Both original V5 illustrative PDFs and both WebP previews; Battery and Charger MP4s and posters; inline EGuo logo, favicon and original `script.js`. PDFs, videos and JavaScript hash checks pass. No asset files changed. No MP4 re-encoding.

## Validation

- `python3 scripts/check_site.py`: 10 tests passed.
- `node --check script.js`: passed.
- `git diff --check`: passed.
- TypeScript, lint and production build: not applicable to this dependency-free static project; no corresponding configuration exists.
- Local HTTP audit: all 21 distinct pages/assets checked returned 200, including both PDFs, previews, MP4s, posters, CSS, JavaScript, favicon, sitemap and robots. Slashless routes resolved successfully.
- Browser: Home and Quote-Ready checked at 1440, 1024, 768 and 390px; no horizontal overflow. Legacy alias and privacy also checked at 390px without overflow.
- Visual review: desktop/mobile hero, three-column Before/After (stacked on mobile), worked PDF preview and one-RFQ CTA card; no clipping observed.
- Navigation: hero worked-example link reaches `#proofs`; mobile menu opens and Quote-Ready link navigates; legacy `/quote-sprint/#quote-recovery` resolves with the target present.
- Seven FAQs opened via Enter; existing accordion behaviour retained. Four industry tabs select and reveal their panels; both demo tabs work.
- Battery video loaded paused, then played through native controls (observed 24.15 seconds). Power loaded paused, then played to its 39.20-second end. Close button and Escape close modals.
- Console: no errors or warnings captured during the checked browser journey.
- Mailto recipient, subject and decoded body validated for every page; no email sent and no OS email-client configuration changed.
- Semantic checks: one H1 per page, unique IDs, valid ARIA references, image alt text/dimensions. Existing visible keyboard focus and reduced-motion CSS/JS guards retained; no new animation.

Screenshots (local, gitignored): `qa/quote-ready/desktop-home.jpg`, `qa/quote-ready/mobile-one-rfq.jpg`.

## Remaining actions

Review the local pages and separately approve any production release. No commit, push or deployment was performed. CNAME, .nojekyll, robots.txt, DNS and email infrastructure remain untouched. Actual email-client rendering and post-release live-domain checks remain outside this local verification.
