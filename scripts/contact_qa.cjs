const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.goto('http://127.0.0.1:8000/');await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.menu-toggle').tap();await page.locator('#main-nav a[href="#contact"]').tap();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
 for(let i=0;i<3;i++){await page.locator('#deliverable-'+i).tap();assert(await page.locator('#deliverable-panel-'+i).isVisible());}
 for(let i=0;i<5;i++){await page.locator('#dimension-'+i).tap();assert(await page.locator('#dimension-panel-'+i).isVisible());}
 await page.locator('#enquiry-submit').tap();assert(await page.locator('#enquiry-errors').isVisible());
 await page.locator('#enquiry-errors a').first().tap();assert.equal(await page.locator('#enquiry-name').evaluate(el=>el===document.activeElement),true);
 const bounds=await page.locator('#enquiry-name').boundingBox();assert(bounds.y>=72&&bounds.y<844);
 console.log('PASS mobile touch modules, menu, form validation and focus not obscured by sticky header');
 await page.locator('#enquiry-name').fill('Timeout test');await page.locator('#enquiry-email').fill('qa@example.com');await page.locator('#enquiry-topic').selectOption({label:'Other Estimating Workflow'});await page.locator('#enquiry-description').fill('Local intercepted timeout test with no external submission.');
 let held,requests=0;await page.route('https://formspree.io/f/xppdjdle',route=>{held=route;requests++;});
 await page.clock.install();await page.locator('#enquiry-submit').click();
 await page.waitForFunction(()=>document.querySelector('#enquiry-form').getAttribute('aria-busy')==='true');
 await page.clock.fastForward(21000);await page.waitForFunction(()=>document.querySelector('#enquiry-form').getAttribute('aria-busy')==='false');
 assert.match(await page.locator('#enquiry-errors').innerText(),/couldn't confirm receipt/);assert.equal(await page.locator('#enquiry-name').inputValue(),'Timeout test');
 if(held)await held.abort().catch(()=>{});assert.equal(requests,1);
 console.log('PASS timeout preserves input, avoids false success and does not automatically retry');
 await page.clock.resume();
 await page.locator('#enquiry-website').evaluate(el=>el.value='spam');await page.locator('#enquiry-submit').click();assert.equal(requests,1);
 console.log('PASS honeypot rejects locally without sending or showing success');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
