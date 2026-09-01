import fs from 'fs';
const pw = await import('file:///C:/Users/16416/.workbuddy/binaries/node/workspace/node_modules/playwright/index.js');
const { chromium } = pw.chromium ? pw : pw.default;

const OUT = 'C:/Users/16416/Desktop/test/ai-agents-for-beginners/agentic-rag-notes';
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{ width:1080, height:1920, deviceScaleFactor:1 } });

for (let i=1;i<=6;i++){
  const no = String(i).padStart(2,'0');
  const html = fs.readFileSync(`${OUT}/${no}.html`,'utf8');
  await page.setContent(html,{waitUntil:'networkidle'});
  await page.waitForTimeout(120);
  const r = await page.evaluate(() => {
    const W=1080,H=1920;
    const out={ overflow:false, offcanvas:[], tinyText:[], bigText:[], counts:{}, emptyMain:false };
    const all=[...document.querySelectorAll('*')];
    // overflow of .page
    const pg=document.querySelector('.page');
    out.pageScrollH = pg.scrollHeight;
    out.pageScrollW = pg.scrollWidth;
    out.overflow = pg.scrollHeight>H+2 || pg.scrollWidth>W+2;
    // off-canvas elements (visible boxes)
    for(const el of all){
      const b=el.getBoundingClientRect();
      if(b.width===0||b.height===0) continue;
      const t=el.textContent.trim();
      // text size
      const c=parseFloat(getComputedStyle(el).fontSize);
      if(t && t.length<=30){
        if(c<15) out.tinyText.push({t:t.slice(0,16),c:Math.round(c)});
        if(c>64) out.bigText.push({t:t.slice(0,16),c:Math.round(c)});
      }
      if(b.bottom>H+2 || b.right>W+2 || b.left<-2) {
        out.offcanvas.push({t:t.slice(0,20), b:{l:Math.round(b.left),t:Math.round(b.top),r:Math.round(b.right),bt:Math.round(b.bottom)}});
      }
    }
    // main emptiness
    const main=document.querySelector('.main');
    if(main){
      const mb=main.getBoundingClientRect();
      const kids=[...main.children].reduce((s,e)=>s+e.getBoundingClientRect().height,0);
      out.mainFill = Math.round(kids/mb.height*100);
    }
    out.cardCount = document.querySelectorAll('.card-mini,.node,.mod,.cap,.compare,.pill').length;
    return out;
  });
  console.log(`\n===== ${no}.png =====`);
  console.log('overflow(溢出1920):', r.overflow, 'pageScrollH:', r.pageScrollH);
  console.log('main填充率:', r.mainFill+'%', ' 元素数:', r.cardCount);
  console.log('tinyText(<15px):', r.tinyText.length, JSON.stringify(r.tinyText.slice(0,8)));
  console.log('bigText(>64px):', r.bigText.length, JSON.stringify(r.bigText.slice(0,5)));
  console.log('offcanvas(超出画布):', r.offcanvas.length, JSON.stringify(r.offcanvas.slice(0,6)));
}
await browser.close();
