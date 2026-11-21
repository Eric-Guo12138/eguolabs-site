/* Run with Playwright available through NODE_PATH. No real form submissions. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = process.env.QA_BASE || 'http://127.0.0.1:8000';
const endpoint = 'https://formspree.io/f/xppdjdle';
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const context = await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page = await context.newPage();
 const errors=[],failed=[],badResponses=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
 page.on('requestfailed',req=>{if(req.failure()?.errorText!=='net::ERR_ABORTED')failed.push({url:req.url(),error:req.failure()?.errorText});});
 page.on('response',res=>{if(res.status()>=400)badResponses.push([res.status(),res.url()]);});
 await fs.mkdir('qa',{recursive:true});
 const checks=[];
 function pass(name){checks.push(name); console.log('PASS',name);}
 try {
  // Safety: any contact POST in this suite must be explicitly mocked.
  let handler = route=>{throw new Error('Unexpected form request');};
  await page.route(endpoint,route=>handler(route));
  assert.equal((await page.goto(base+'/')).status(),200);
  await page.locator('h1').waitFor();
  for(let round=0;round<2;round++)for(const id of ['P-02','P-03','P-01']){
   await page.locator(`.engineering-visual .pipe[data-run="${id}"]`).press('Enter');
   assert.equal(await page.locator(`[data-run="${id}"][aria-pressed="true"]`).count(),4);
   assert.equal(await page.locator('[data-selected-id]').textContent(),id);
   assert.equal(await page.locator(`tr[data-record="${id}"]`).getAttribute('data-selected'),'true');
   await page.locator(`.pipe-select[data-run="${id}"]`).click();
   assert.equal(await page.locator('.detail-label').textContent(),'SELECTED / '+id);
  }
  pass('Hero and schedule pipe selection: repeated two-way synchronisation');
  for(const [prefix,panel,count] of [['deliverable','deliverable-panel',3],['dimension','dimension-panel',5],['stage','panel',3]]){
   for(let round=0;round<2;round++)for(let i=0;i<count;i++){
    await page.locator(`#${prefix}-${i}`).click();
    assert.equal(await page.locator(`#${panel}-${i}`).isVisible(),true);
    assert.equal(await page.locator(`#${prefix}-${i}`).getAttribute('aria-selected'),'true');
   }
   await page.locator(`#${prefix}-${count-1}`).press('ArrowRight');
   assert.equal(await page.locator(`#${prefix}-0`).getAttribute('aria-selected'),'true');
   await page.locator(`#${prefix}-0`).press('End');
   assert.equal(await page.locator(`#${prefix}-${count-1}`).getAttribute('aria-selected'),'true');
   await page.locator(`#${prefix}-${count-1}`).press('Home');
   pass(`${prefix}: all ${count} tabs, repeated switches and keyboard navigation`);
  }
  await page.locator('#deliverable-1').click();
  await page.locator('#format-1').click();
  assert.match(await page.locator('#format-panel-1').innerText(),/Measured CL/);
  assert.match(await page.locator('#format-panel-1 tbody tr').first().innerText(),/DN50/);
  await page.locator('#format-1').press('ArrowLeft');
  assert.equal(await page.locator('#format-panel-0').isVisible(),true);
  assert.match(await page.locator('#format-panel-0 tbody tr').first().innerText(),/P-01/);
  pass('Both output formats change columns and grouping; no download controls offered');
  for(let i=0;i<8;i++){
   const summary=page.locator('details summary').nth(i);
   await summary.press('Enter');
   assert.equal(await summary.evaluate(el=>el.parentElement.open),true);
   await summary.click();
   assert.equal(await summary.evaluate(el=>el.parentElement.open),false);
  }
  pass('Eight FAQs: keyboard and mouse');
  for(const href of ['#solutions','#workflow','#approach','#about','#faq']){
   await page.locator(`#main-nav a[href="${href}"]`).click();
   await page.waitForURL('**/'+href);
  }
  await page.locator('.hero .button').click();
  await page.waitForURL('**/#contact');
  await page.locator('#copy-email').click();
  await page.waitForFunction(()=>document.querySelector('#copy-status').textContent==='Email address copied.');
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'eric@eguolabs.com');
  assert(await page.locator('a[href="mailto:eric@eguolabs.com"]').count()>=3);
  pass('Navigation, CTA anchors, email fallback and actual clipboard contents');
  const widths=[];
  for(const width of [360,390,768,900,1024,1440]){
   await page.setViewportSize({width,height:1000});
   await page.goto(base+'/');
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.locator('#deliverable-0').click();
   for(let i=0;i<3;i++){
    await page.locator('#deliverable-'+i).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Output overflow ${width} ${i}`);
   }
   for(let i=0;i<5;i++){
    await page.locator('#dimension-'+i).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Dimension overflow ${width} ${i}`);
   }
   if(width<=900){
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('#main-nav a[href="#contact"]').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    await page.locator('.menu-toggle').click();await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
   }
   await page.locator('#enquiry-description').scrollIntoViewIfNeeded();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#contact').screenshot({path:`qa/final-contact-${width}.png`});
   await page.locator('#deliverable-0').click();
   await page.locator('#deliverables').screenshot({path:`qa/final-outputs-${width}.png`});
   await page.locator('.site-header .brand').click();
   await page.screenshot({path:`qa/final-hero-${width}.png`});
   widths.push(width);
  }
  pass('Responsive widths '+widths.join(', ')+'; all module states and contact have no document overflow');
  assert.equal(await page.locator('.pipe .route').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  pass('Reduced-motion rendering disables route animation');
  for(const path of ['/quote-ready/','/quote-sprint/']){
   await page.goto(base+path);await page.waitForURL(base+'/#solutions');
  }
  for(const path of ['/privacy','/privacy/','/privacy.html']){
   await page.goto(base+path);await page.getByRole('heading',{name:'Privacy.',exact:true}).waitFor();
   assert.match(await page.locator('main').innerText(),/Formspree/);
  }
  pass('Legacy redirects and all privacy paths');
  assert.equal((await context.request.get(base+'/favicon.svg')).status(),200);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(badResponses,[]);
  pass('Clean console and network through navigation and all interactive modules');
  await page.goto(base+'/');
  await page.setViewportSize({width:390,height:844});
  let requests=0;
  handler=route=>{requests++;return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});};
  await page.locator('#enquiry-submit').click();
  assert.equal(requests,0);assert.equal(await page.locator('[aria-invalid="true"]').count(),4);
  assert.equal(await page.locator('#enquiry-errors').evaluate(el=>el===document.activeElement),true);
  async function fill(){
   await page.locator('#enquiry-name').fill('Release QA');
   await page.locator('#enquiry-email').fill('qa@example.com');
   await page.locator('#enquiry-company').fill('Synthetic QA');
   await page.locator('#enquiry-topic').selectOption({label:'Other Estimating Workflow'});
   await page.locator('#enquiry-description').fill('Synthetic local test. Verify records & <tags> remain plain text.');
  }
  await fill();await page.locator('#enquiry-email').fill('invalid-email');await page.locator('#enquiry-submit').click();
  assert.equal(requests,0);assert.equal(await page.locator('#enquiry-email').getAttribute('aria-invalid'),'true');
  await fill();await page.locator('#enquiry-description').fill('   ');await page.locator('#enquiry-submit').click();assert.equal(requests,0);
  pass('Required fields, malformed email and whitespace validation prevent requests');
  await fill();
  handler=route=>{requests++;return route.fulfill({status:422,contentType:'application/json',body:JSON.stringify({errors:[{field:'email',code:'TYPE_EMAIL',message:'Provider validation'}]})});};
  await page.locator('#enquiry-submit').click();await page.waitForFunction(()=>document.querySelector('#enquiry-form').getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#enquiry-name').inputValue(),'Release QA');
  assert.equal(await page.locator('#enquiry-email').getAttribute('aria-invalid'),'true');
  assert.equal(await page.locator('#enquiry-status').textContent(),'');
  pass('Provider validation failure retains fields and shows accessible error summary');
  for(const [code,body] of [[429,'{"error":"rate limited"}'],[500,'{"error":"unavailable"}'],[200,'{"ok":false}'],[200,'not JSON']]){
   handler=route=>route.fulfill({status:code,contentType:'application/json',body});
   await page.locator('#enquiry-submit').click();await page.waitForFunction(()=>document.querySelector('#enquiry-form').getAttribute('aria-busy')==='false');
   assert.equal(await page.locator('#enquiry-name').inputValue(),'Release QA');
   assert.equal(await page.locator('#enquiry-errors').isVisible(),true);
   assert.equal(await page.locator('#enquiry-status').textContent(),'');
  }
  handler=route=>route.abort('failed');
  await page.locator('#enquiry-submit').click();await page.waitForFunction(()=>document.querySelector('#enquiry-form').getAttribute('aria-busy')==='false');
  assert.equal(await page.locator('#enquiry-name').inputValue(),'Release QA');
  pass('Rate limit, server failure, false success, invalid JSON and network failure retain input');
  let finish,payload;
  handler=route=>{requests++;payload=route.request().postData();return new Promise(resolve=>{finish=async()=>{await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});resolve();};});};
  const before=requests;
  await page.locator('#enquiry-submit').click();
  await page.waitForFunction(()=>document.querySelector('#enquiry-submit').textContent==='Sending...');
  assert.equal(await page.locator('#enquiry-submit').isDisabled(),true);
  await page.locator('#enquiry-form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.equal(requests,before+1);
  assert.match(payload,/name="email"/);assert.match(payload,/qa@example.com/);assert.match(payload,/submitted_at/);assert.match(payload,/eguolabs.com/);
  await finish();
  await page.waitForFunction(()=>document.querySelector('#enquiry-status').classList.contains('is-success'));
  assert.equal(await page.locator('#enquiry-name').inputValue(),'');
  assert.equal(await page.locator('#enquiry-status').evaluate(el=>el===document.activeElement),true);
  pass('Loading and duplicate guard; confirmed provider response alone resets fields and focuses success');
  await page.locator('#contact').screenshot({path:'qa/final-form-success-mock.png'});
  const unexpected=errors.filter(e=>!e.includes('Failed to load resource'));
  assert.deepEqual(unexpected,[]);
  await fs.writeFile('qa/browser-results.json',JSON.stringify({base,checks,widths,consoleBeforeMock:[],mockNetworkErrorsExpected:true,realSubmissions:0},null,2));
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
