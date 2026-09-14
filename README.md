# EGuo Labs

A static V1 website for EGuo Labs’ first-pass technical enquiry assistant. Semantic HTML, responsive CSS and vanilla JavaScript; no build, dependencies, server application, tracking or external services.

## Structure

```text
index.html                 Homepage
privacy.html               Privacy notice
styles.css                 Shared visual system and responsive layouts
script.js                  Navigation, tabs, video dialog and FAQ
favicon.svg
robots.txt
sitemap.xml
.nojekyll
assets/
  videos/
    battery-demo.mp4
    charger-demo.mp4
  images/
    battery-demo-poster.webp
    charger-demo-poster.webp
qa/                        Local QA notes and review assets (gitignored)
```

## Local preview

From this folder:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. No installation or build is needed. Static pages can also be opened directly; use the local server for reliable video testing.

## GitHub Pages

1. Commit the site files and `assets/` to the repository’s `main` branch.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Choose **main**, **/(root)** and save.
4. Test the generated GitHub Pages preview URL, including both videos and `privacy.html`.
5. Configure the custom domain manually only after preview validation. No `CNAME` is included. Canonical, Open Graph and sitemap URLs already target `https://eguolabs.com`.

All page and asset links are relative, supporting both project and domain hosting. There is no custom Actions workflow.

## Media

Original MP4 files are unchanged. Both contain H.264 video and AAC audio. Battery: 41.17 seconds, 1920 × 968 (240:121), 1,938,683 bytes. Power: 39.20 seconds, 1920 × 1080 (16:9), 6,373,234 bytes.

WebP posters are real source frames: battery at 26 seconds, power at 10 seconds. Videos are attached only when a demo is opened, load metadata then, and never autoplay. Native video controls support mobile and fullscreen; a direct link and text workflow summary are also provided.
