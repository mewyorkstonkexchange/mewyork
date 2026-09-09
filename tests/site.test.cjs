const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../app.js','utf8');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const X='https://x.com/MewYorkExchange',TG='https://t.me/MewYorkExchange';
class El{constructor(tag='BUTTON'){this.tagName=tag;this.disabled=false;this.hidden=false;this.textContent='';this.children=[];this.events={};this.dataset={};}addEventListener(k,f){this.events[k]=f;}setAttribute(k,v){this[k]=v;}removeAttribute(k){delete this[k];}replaceChildren(...v){this.children=v;}appendChild(e){this.children.push(e);}showModal(){this.open=true;}close(){this.open=false;}}
const anchor=key=>Object.assign(new El('A'),{dataset:{link:key}});
const gate=key=>Object.assign(new El('BUTTON'),{dataset:{link:key}});
function run(overrides={},provider=null,fail=false,pathname='/index.html'){
  const ctx={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/../config.js','utf8'),ctx);
  const c={...ctx.window.MYSE_CONFIG,...overrides};
  const map=new Map();const q=s=>{if(!map.has(s)){const el=new El();if(s==='#copy-address')el.disabled=true;map.set(s,el);}return map.get(s);};
  const links=[anchor('x'),anchor('telegram'),anchor('telegram'),anchor('x'),anchor('x'),anchor('telegram'),anchor('x'),anchor('telegram'),gate('trade'),gate('explorer'),gate('chart')];
  const copied=[];
  vm.runInNewContext(source,{window:{MYSE_CONFIG:c,ethereum:provider,addEventListener(){},dispatchEvent(){}},document:{querySelector:q,querySelectorAll:s=>s==='[data-link]'?links:[],createElement:t=>new El(String(t).toUpperCase())},location:{pathname},URL,Map,Event:class{},setTimeout:()=>1,clearTimeout(){},navigator:{clipboard:{writeText:async v=>{if(fail)throw Error();copied.push(v);}}}});
  return {c,q,links,copied};
}
(async()=>{
// Delivered markup: the original design, with the announced destinations and no revision sections.
assert(!/The thesis/.test(html),'index.html must not carry the revision thesis section.');
assert(html.includes('THE OFFICIAL RECORD'),'index.html must keep the original record section.');
assert(!html.includes('Official community links will appear here'),'The placeholder social line must be gone now the destinations are announced.');
assert.equal((html.match(/class="social-icons"/g)||[]).length,2,'Header and footer each need one icon nav.');
assert.equal((html.match(new RegExp(X.replace(/\//g,'\\/'),'g'))||[]).length,4,'X is linked from the header, hero, Chairman section and footer.');
assert.equal((html.match(new RegExp(TG.replace(/\//g,'\\/'),'g'))||[]).length,4,'Telegram is linked from the header, hero, closing section and footer.');
for(const attr of ['target="_blank"','rel="noopener noreferrer"'])assert(html.includes(attr),`External links must carry ${attr}.`);
for(const file of ['assets/myse-hero.webp','assets/myse-hero.png','assets/myse-pfp.webp','assets/myse-pfp.png','assets/favicon.svg']){
  assert(html.includes(file),`index.html must reference ${file}.`);
  const size=fs.statSync(__dirname+'/../'+file).size;
  assert(size<400*1024,`${file} is ${size} bytes; served art must stay under 400 KB.`);
}

// Prelaunch: nothing is claimed, the announced links work, the unannounced ones stay inert.
let h=run();
assert.equal(h.q('#token').hidden,true,'The record section stays hidden before launch.');
assert.equal(h.q('#contract-address').textContent,'','No address is written before launch.');
assert(h.q('#copy-address').disabled,'The copy control stays disabled before launch.');
assert(html.includes('<button id="copy-address" disabled>'),'The delivered markup ships the copy control disabled.');
for(const el of h.links.filter(e=>e.tagName==='A'))assert.equal(el.href,el.dataset.link==='x'?X:TG);
for(const el of h.links.filter(e=>e.tagName==='BUTTON'))assert(el.disabled,`${el.dataset.link} must stay disabled before launch.`);

// Token-live layout preview shows the record section without claiming a launch.
h=run({},null,false,'/live-preview.html');
assert.equal(h.q('#token').hidden,false);
assert.match(h.q('#launch-status').textContent,/awaiting verified launch configuration/);

// A verified launch fills the record from config only.
const address='0x'+'1'.repeat(40);
const liveConfig={launchStatus:'live',verified:true,contract:address,tokenName:'MYSE',supply:'1,000,000,000',links:{telegram:TG,x:X,trade:'https://example.com/trade',explorer:'https://example.com/token',chart:''}};
h=run(liveConfig);
assert.equal(h.q('#token').hidden,false);
assert.equal(h.q('#contract-address').textContent,address);
assert.equal(h.q('#copy-address').disabled,false);
assert.equal(h.q('#network-name').textContent,'Robinhood Chain');
assert.equal(h.q('#token-name').textContent,'MYSE');
await h.q('#copy-address').events.click();assert.deepEqual(h.copied,[address]);
h=run(liveConfig,null,true);await h.q('#copy-address').events.click();assert.match(h.q('#notice').textContent,/Couldn’t copy/);

// Verification and chain gates.
h=run({...liveConfig,verified:false});assert.equal(h.q('#token').hidden,true);assert(h.q('#copy-address').disabled);
h=run({...liveConfig,contract:'0x'+'0'.repeat(40)});assert.equal(h.q('#token').hidden,true);
h=run({...liveConfig,chainId:null});assert.equal(h.q('#token').hidden,true);

// Unsafe destinations are never rendered as links.
h=run({links:{x:'javascript:alert(1)',telegram:'https://user:secret@example.com'}});
for(const el of h.links.filter(e=>e.tagName==='A')){assert.equal(el.href,undefined);assert.equal(el['aria-disabled'],'true');el.events.click({preventDefault(){}});}
assert.match(h.q('#notice').textContent,/has not been announced yet/);

// Wallet: read-only session, MetaMask first, chain 4663 compared as 0x1237.
const requested=[],listeners={};
const metamask={isMetaMask:true,request:async({method})=>{requested.push(method);return method==='eth_requestAccounts'?[address]:'0x1237';},on:(k,v)=>listeners[k]=v,removeListener:k=>delete listeners[k]};
h=run({},metamask);h.q('#wallet-open').onclick();
const options=()=>h.q('#providers').children;
assert.equal(options()[0].textContent,'MetaMask');
assert.equal(options()[options().length-1].textContent,h.c.walletConnectProjectId?'WalletConnect (mobile)':'Mobile wallets: available soon');
await options()[0].onclick();
assert.deepEqual(requested,['eth_requestAccounts','eth_chainId']);
assert(!h.q('#wallet-status').textContent.includes('Unsupported'));
listeners.chainChanged('0x1');assert.match(h.q('#wallet-status').textContent,/Unsupported/);
h.q('#disconnect').onclick();assert.equal(Object.keys(listeners).length,0);
assert.equal(h.q('#wallet-open').textContent,'Connect wallet');

// A declined request explains itself and leaves no session.
const declining={request:async()=>{throw Object.assign(Error(),{code:4001});}};
h=run({},declining);h.q('#wallet-open').onclick();
assert.equal(h.q('#providers').children[0].textContent,'MetaMask: not detected');
await h.q('#providers').children.find(e=>e.textContent==='Browser wallet').onclick();
assert.match(h.q('#wallet-status').textContent,/declined/);

// No wallet at all: MetaMask is offered with an install link, nothing pretends to be connected.
h=run();h.q('#wallet-open').onclick();
assert(h.q('#providers').children[0].disabled);
assert(h.q('#providers').children.some(e=>e.href==='https://metamask.io/download/'));
assert(h.q('#providers').children.some(e=>/No browser wallet/.test(e.textContent)));

// The mobile connector appears only with a configured project id.
h=run({walletConnectProjectId:'test-project-id'});h.q('#wallet-open').onclick();
const mobile=h.q('#providers').children.find(e=>e.textContent==='WalletConnect (mobile)');
assert(mobile&&!mobile.disabled&&typeof mobile.onclick==='function');
h=run({walletConnectProjectId:''});h.q('#wallet-open').onclick();
const pending=h.q('#providers').children.find(e=>e.textContent==='Mobile wallets: available soon');
assert(pending&&pending.disabled&&!pending.onclick);

console.log('PASS: original markup without revision sections, announced destinations on header/hero/Chairman/footer links, served art under 400 KB, prelaunch record hidden, live-preview layout, verification and chain gates, address copy and failure, unsafe URLs, wallet ordering with MetaMask first, chain comparison, disconnect, rejection, missing wallet and the WalletConnect project-id gate.');
})();
