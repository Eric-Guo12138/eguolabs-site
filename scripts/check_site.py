"""Dependency-free release checks for the static sprinkler automation website."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, parse_qs
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'privacy.html', 'quote-ready/index.html', 'quote-sprint/index.html', 'privacy/index.html']
class Page(HTMLParser):
    def __init__(self, name):
        super().__init__(); self.nodes=[]; self.feed((ROOT/name).read_text())
    def handle_starttag(self, tag, attrs): self.nodes.append((tag,dict(attrs)))
    @property
    def ids(self): return [a['id'] for _,a in self.nodes if 'id' in a]
class SiteChecks(unittest.TestCase):
    def test_links_and_anchors(self):
        for name in PAGES:
            for _,a in Page(name).nodes:
                for key in ['href','src']:
                    u=urlsplit(a.get(key,''))
                    if not a.get(key) or u.scheme or u.netloc: continue
                    p=((ROOT/name).parent/unquote(u.path)).resolve() if u.path else ROOT/name
                    if p.is_dir(): p/='index.html'
                    self.assertTrue(p.is_file(),(name,a[key]))
                    if u.fragment and p.suffix=='.html': self.assertIn(u.fragment,Page(str(p.relative_to(ROOT))).ids)
    def test_semantics(self):
        for name in PAGES:
            p=Page(name)
            self.assertEqual(len(p.ids),len(set(p.ids)))
            self.assertEqual(sum(t=='h1' for t,_ in p.nodes),1)
            for t,a in p.nodes:
                for k in ['aria-controls','aria-labelledby']:
                    for id in a.get(k,'').split(): self.assertIn(id,p.ids)
    def test_contact(self):
        links=[a['href'] for _,a in Page('index.html').nodes if a.get('href','').startswith('mailto:')]
        self.assertGreater(len(links),3)
        for link in links:
            u=urlsplit(link);self.assertEqual(u.path,'eric@eguolabs.com')
            if u.query: self.assertEqual(parse_qs(u.query)['subject'],['Sprinkler Workflow Automation Enquiry'])
    def test_old_offers_removed(self):
        for name in PAGES:
            s=(ROOT/name).read_text()
            for phrase in ['Quote-Ready Sprint','Quote Recovery Sprint','£300','48-hour','battery-demo','charger-demo']:
                self.assertNotIn(phrase,s)
    def test_legacy_migration(self):
        for name in PAGES[2:4]:
            s=(ROOT/name).read_text();self.assertIn('noindex,follow',s);self.assertIn('0;url=../#solutions',s)
    def test_interactive_contract(self):
        p=Page('index.html');controls=[a for _,a in p.nodes if 'data-run' in a]
        self.assertEqual(len(controls),12)
        for id in ['P-01','P-02','P-03']: self.assertEqual(sum(a['data-run']==id for a in controls),4)
        self.assertEqual(sum(a.get('role')=='tab' for _,a in p.nodes),13)
        self.assertEqual(sum(t=='details' for t,_ in p.nodes),8)
        self.assertIn('Illustrative workflow using sample data.',(ROOT/'index.html').read_text())
    def test_tab_groups_have_one_active_panel(self):
        nodes=Page('index.html').nodes
        for prefix,count in [('deliverable-',3),('format-',2),('dimension-',5),('stage-',3)]:
            tabs=[a for _,a in nodes if a.get('role')=='tab' and a.get('id','').startswith(prefix)]
            self.assertEqual(len(tabs),count)
            self.assertEqual(sum(a.get('aria-selected')=='true' for a in tabs),1)
            for tab in tabs:
                panel=next(a for _,a in nodes if a.get('id')==tab['aria-controls'])
                self.assertEqual('hidden' not in panel,tab['aria-selected']=='true')
                self.assertEqual(panel['aria-labelledby'],tab['id'])
    def test_real_enquiry_form(self):
        nodes=Page('index.html').nodes
        forms=[a for t,a in nodes if t=='form']
        self.assertEqual(len(forms),1)
        self.assertEqual(forms[0]['action'],'https://formspree.io/f/xppdjdle')
        self.assertEqual(forms[0]['method'],'post')
        fields={a.get('name'):a for t,a in nodes if t in ['input','select','textarea']}
        for name in ['name','email','category','message']: self.assertIn('required',fields[name])
        self.assertNotIn('required',fields['company'])
        self.assertIn('_gotcha',fields)
        self.assertEqual(fields['email']['type'],'email')
        self.assertTrue(all(a.get('type')!='file' for a in fields.values()))
        self.assertIn('https://formspree.io/legal/privacy-policy/',(ROOT/'privacy.html').read_text())
        self.assertIn('privacy.html',(ROOT/'privacy/index.html').read_text())
    def test_no_external_runtime_or_research_assets(self):
        for name in PAGES:
            for t,a in Page(name).nodes:
                self.assertNotIn(t,['iframe','video'])
                if t=='script': self.assertFalse(urlsplit(a.get('src','')).scheme)
                self.assertFalse(a.get('src','').endswith('.pdf'))
    def test_preserved_infrastructure_and_media(self):
        for name in ['CNAME','.nojekyll','robots.txt','favicon.svg','script.js']:
            self.assertEqual((ROOT/name).read_bytes(),subprocess.check_output(['git','show','HEAD:'+name],cwd=ROOT))
        self.assertEqual(subprocess.check_output(['git','diff','--name-only','--','assets/proofs','assets/videos','assets/images'],cwd=ROOT),b'')
    def test_metadata(self):
        s=(ROOT/'index.html').read_text()
        self.assertIn('EGuo Labs | Bespoke Sprinkler Estimating Automation',s)
        self.assertIn('property="og:image"',s)
        self.assertNotIn('/quote-ready/',(ROOT/'sitemap.xml').read_text())
    def test_accessibility_guards(self):
        self.assertIn('prefers-reduced-motion',(ROOT/'styles.css').read_text())
        self.assertIn('focus-visible',(ROOT/'styles.css').read_text())
        self.assertIn('ArrowRight',(ROOT/'v2.js').read_text())
if __name__=='__main__': unittest.main(verbosity=2)
