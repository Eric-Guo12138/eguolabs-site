"""Dependency-free checks for the buildless EGuo Labs site. Run from any directory."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, parse_qs, unquote
from xml.etree import ElementTree
import hashlib
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'privacy.html', 'quote-sprint/index.html']

class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.nodes = []
        self.feed((ROOT / filename).read_text())
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))
    @property
    def ids(self):
        return [attrs['id'] for _, attrs in self.nodes if 'id' in attrs]

class SiteChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages = {name: Page(name) for name in PAGES}

    def test_local_links_assets_and_anchors(self):
        for name, page in self.pages.items():
            for _, attrs in page.nodes:
                for key in ('href', 'src', 'poster'):
                    raw = attrs.get(key)
                    if not raw:
                        continue
                    url = urlsplit(raw)
                    if url.scheme or url.netloc:
                        continue
                    target = (ROOT / name).parent / unquote(url.path) if url.path else ROOT / name
                    target = target.resolve()
                    self.assertTrue(target.is_relative_to(ROOT), raw)
                    if target.is_dir():
                        target /= 'index.html'
                    self.assertTrue(target.is_file(), f'{name}: {raw}')
                    if url.fragment and target.suffix == '.html':
                        parsed = self.pages[str(target.relative_to(ROOT))]
                        self.assertIn(url.fragment, parsed.ids, raw)

    def test_accessible_page_structure(self):
        for name, page in self.pages.items():
            self.assertEqual(sum(tag == 'h1' for tag, _ in page.nodes), 1, name)
            self.assertEqual(len(page.ids), len(set(page.ids)), name)
            for tag, attrs in page.nodes:
                if tag == 'img':
                    self.assertTrue(attrs.get('alt'), name)
                    self.assertIn('width', attrs)
                    self.assertIn('height', attrs)
                for key in ('aria-controls', 'aria-labelledby', 'aria-describedby'):
                    for target in attrs.get(key, '').split():
                        self.assertIn(target, page.ids, name)

    def test_email_links(self):
        count = 0
        for page in self.pages.values():
            for tag, attrs in page.nodes:
                link = attrs.get('href', '')
                if not link.startswith('mailto:'):
                    continue
                count += 1
                url = urlsplit(link)
                self.assertEqual(url.path, 'eric@eguolabs.com')
                fields = parse_qs(url.query)
                self.assertTrue(set(fields) <= {'subject'})
                if fields:
                    self.assertIn(fields['subject'], [['EGuo Labs enquiry'], ['Quotation sprint']])
        self.assertGreaterEqual(count, 10)

    def test_metadata_and_sitemap(self):
        expected = {'index.html': ('EGuo Labs | Quotation Workflow Pilots', 'https://eguolabs.com/'),
                    'quote-sprint/index.html': ('Quotation Workflow Pilot | EGuo Labs', 'https://eguolabs.com/quote-sprint/'),
                    'privacy.html': ('Privacy | EGuo Labs', 'https://eguolabs.com/privacy.html')}
        for name, (title, canonical) in expected.items():
            html = (ROOT / name).read_text()
            self.assertIn('<title>' + title + '</title>', html)
            attrs = [a for _, a in self.pages[name].nodes]
            self.assertTrue(any(a.get('rel') == 'canonical' and a.get('href') == canonical for a in attrs))
            self.assertTrue(any(a.get('property') == 'og:url' and a.get('content') == canonical for a in attrs))
            self.assertTrue(any(a.get('name') == 'description' and a.get('content') for a in attrs))
        root = ElementTree.parse(ROOT / 'sitemap.xml')
        urls = {e.text for e in root.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
        self.assertEqual(urls, {v[1] for v in expected.values()})

    def test_existing_videos_and_posters(self):
        videos = {'battery-demo.mp4': 'cf7b067bc79de7748700c94fd00120cf71875a952a654646ee4471bfb3da50fd',
                  'charger-demo.mp4': '2ce36774bd001c9976174afb9f3bd41d614db287152662c79fc61af3b1ebdc12'}
        for name, digest in videos.items():
            self.assertEqual(hashlib.sha256((ROOT / 'assets/videos' / name).read_bytes()).hexdigest(), digest)
            self.assertTrue((ROOT / 'assets/images' / name.replace('.mp4', '-poster.webp')).is_file())
        videos = [a for tag, a in self.pages['index.html'].nodes if tag == 'video']
        self.assertEqual(len(videos), 1)
        self.assertNotIn('src', videos[0])
        self.assertNotIn('autoplay', videos[0])
        self.assertIn('controls', videos[0])
        self.assertEqual(videos[0]['preload'], 'none')

    def test_no_external_runtime_or_forms(self):
        for page in self.pages.values():
            for tag, attrs in page.nodes:
                self.assertNotIn(tag, ('form', 'iframe'))
                if tag in ('script', 'img', 'video', 'source'):
                    self.assertFalse(urlsplit(attrs.get('src', '')).scheme)
                if tag == 'link' and attrs.get('rel') == 'stylesheet':
                    self.assertFalse(urlsplit(attrs.get('href', '')).scheme)

    def test_commercial_scope_and_proof_labels(self):
        for name in ('index.html', 'quote-sprint/index.html'):
            text = (ROOT / name).read_text()
            for phrase in ('£300', '48 hours after complete pilot input is received',
                           'Quote-Ready Sprint', 'Quote Recovery Sprint',
                           'Illustrative example. No customer data used.', 'eric@eguolabs.com'):
                self.assertIn(phrase, text)
            for phrase in ('trusted by', 'guaranteed revenue', 'GDPR certified', 'SOC 2', '/internal/microproof'):
                self.assertNotIn(phrase.lower(), text.lower())
        for slug in ('quote-ready', 'quote-recovery'):
            pdf = ROOT / 'assets/proofs' / (slug + '-v5-illustrative.pdf')
            self.assertTrue(pdf.read_bytes().startswith(b'%PDF-'))

    def test_static_deployment(self):
        self.assertTrue((ROOT / '.nojekyll').exists())
        self.assertEqual((ROOT / 'CNAME').read_text().strip(), 'eguolabs.com')
        self.assertTrue((ROOT / 'quote-sprint/index.html').is_file())
        self.assertIn('https://eguolabs.com/sitemap.xml', (ROOT / 'robots.txt').read_text())

if __name__ == '__main__':
    unittest.main(verbosity=2)
