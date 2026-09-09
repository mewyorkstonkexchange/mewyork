(() => {
  'use strict';
  const c = window.MYSE_CONFIG || {};
  const q = s => document.querySelector(s);
  const validURL = v => {try {const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}};
  let timer;
  const tell = text => {q('#notice').textContent=text;clearTimeout(timer);timer=setTimeout(()=>q('#notice').textContent='',5500);};
  const addressValid = /^0x[0-9a-fA-F]{40}$/.test(c.contract || '') && !/^0x0{40}$/i.test(c.contract || '');
  const chainNumber = Number(c.chainId);
  const chainHex = Number.isSafeInteger(chainNumber)&&chainNumber>0?'0x'+chainNumber.toString(16):'';
  const liveReady = c.launchStatus==='live' && c.verified===true && addressValid && chainHex!=='' && validURL(c.links?.trade);
  const preview = location.pathname.endsWith('live-preview.html');
  const live = liveReady || preview;

  q('#token').hidden=!live;
  if(preview && !liveReady){q('#launch-status').textContent='Token-live layout · awaiting verified launch configuration';}
  if(liveReady){
    q('#launch-status').textContent='Live on Robinhood Chain.';
    q('.preview-explanation').hidden=true;
    q('#launch-answer').textContent='The verified contract and official trading destinations are listed above. Always compare the full token address.';
    q('#contract-address').textContent=c.contract;
    q('#copy-address').disabled=false;
    for(const [id,value] of [['token-name',c.tokenName],['token-supply',c.supply],['token-pair',c.pairing],['token-venue',c.venue],['token-fees',c.fees],['founder-disclosure',c.founderDisclosure]]) if(value) q('#'+id).textContent=value;
    q('#network-name').textContent='Robinhood Chain';
  }
  document.querySelectorAll('[data-link]').forEach(el=>{
    const key=el.dataset.link;const url=c.links?.[key];const gated=['trade','explorer','chart'].includes(key);
    if(el.tagName==='A'){
      if(validURL(url)){el.href=url;el.target='_blank';el.rel='noopener noreferrer';}
      else{el.removeAttribute('href');el.setAttribute('aria-disabled','true');el.addEventListener('click',e=>{e.preventDefault();tell('This official link has not been announced yet.');});}
      return;
    }
    if(gated&&!liveReady){el.disabled=true;return;}
    el.addEventListener('click',()=>{if(validURL(url))window.open(url,'_blank','noopener,noreferrer');else tell('This official link has not been announced yet.');});
  });
  q('#copy-address').addEventListener('click',async()=>{if(!liveReady)return;try{await navigator.clipboard.writeText(c.contract);tell('Token address copied.');}catch{tell('Couldn’t copy. Select the full address shown above.');}});
  const WALLETCONNECT_MODULE='https://cdn.jsdelivr.net/npm/@walletconnect/ethereum-provider@2.24.0/+esm';
  const providers = new Map();let current=null;let account='';let chain='';
  const onAccounts = accounts => {account=accounts[0]||'';renderWallet();};
  const onChain = value => {chain=value;renderWallet();};
  const onDisconnect = () => clearSession();
  const clearSession=()=>{if(current?.removeListener){current.removeListener('accountsChanged',onAccounts);current.removeListener('chainChanged',onChain);current.removeListener('disconnect',onDisconnect);}current=null;account='';chain='';renderWallet();};
  function renderWallet(){q('#disconnect').hidden=!account;q('#wallet-open').textContent=account?account.slice(0,6)+'…'+account.slice(-4):'Connect wallet';q('#wallet-status').textContent=account?`Address: ${account}\nNetwork ID: ${chain}${chainHex&&chain.toLowerCase()!==chainHex?' — Unsupported launch network.':''}${!chainHex?' — Launch network details are pending verification.':''}`:'';}
  async function connect(p){try{clearSession();current=p;account=(await p.request({method:'eth_requestAccounts'}))[0]||'';chain=await p.request({method:'eth_chainId'});if(!account){clearSession();throw new Error('No account was returned.');}p.on?.('accountsChanged',onAccounts);p.on?.('chainChanged',onChain);p.on?.('disconnect',onDisconnect);renderWallet();}catch(e){clearSession();q('#wallet-status').textContent=e.code===4001?'Connection declined. You can try again.':'Could not connect the wallet. Please unlock it and try again.';}}
  const coinbaseEntry=e=>e.rdns==='com.coinbase.wallet'||/coinbase/i.test(e.name)||e.provider?.isCoinbaseWallet===true;
  const metaMaskEntry=e=>!coinbaseEntry(e)&&(e.rdns==='io.metamask'||/metamask/i.test(e.name)||e.provider?.isMetaMask===true);
  const projectId=()=>String(c.walletConnectProjectId||'').trim();
  const option=(label,onclick)=>{const b=document.createElement('button');b.className='secondary';b.textContent=label;if(onclick)b.onclick=onclick;else b.disabled=true;return b;};
  async function connectMobile(){const id=projectId();if(!id)return;const status=q('#wallet-status');status.textContent='Opening the mobile wallet connector…';try{const {EthereumProvider}=await import(WALLETCONNECT_MODULE);const p=await EthereumProvider.init({projectId:id,chains:[chainNumber],optionalChains:[chainNumber],showQrModal:true,methods:['eth_requestAccounts','eth_chainId'],events:['accountsChanged','chainChanged','disconnect']});await p.connect();await connect(p);}catch(e){status.textContent=e?.code===4001?'Connection declined. You can try again.':'Could not open the mobile wallet connector. Use a browser wallet, or open this site in your wallet’s browser.';}}
  function listProviders(){const box=q('#providers');box.replaceChildren();const entries=[...providers.values()];const metamask=entries.find(metaMaskEntry);const coinbase=entries.find(coinbaseEntry);
    box.appendChild(metamask?option('MetaMask',()=>connect(metamask.provider)):option('MetaMask: not detected'));
    if(!metamask){const a=document.createElement('a');a.className='small';a.href='https://metamask.io/download/';a.target='_blank';a.rel='noopener noreferrer';a.textContent='Install MetaMask at metamask.io';box.appendChild(a);}
    for(const e of entries)if(e!==metamask&&e!==coinbase)box.appendChild(option(e.name,()=>connect(e.provider)));
    if(coinbase)box.appendChild(option('Coinbase Wallet',()=>connect(coinbase.provider)));
    box.appendChild(projectId()?option('WalletConnect (mobile)',connectMobile):option('Mobile wallets: available soon'));
    if(!providers.size){const p=document.createElement('p');p.className='small';p.textContent='No browser wallet detected. Open this site in your wallet’s browser, or install an injected wallet extension.';box.appendChild(p);}}
  window.addEventListener('eip6963:announceProvider',e=>{const d=e.detail;if(d?.provider?.request&&d.info?.name){const name=String(d.info.name).slice(0,60);providers.set(name,{name,provider:d.provider,rdns:String(d.info?.rdns||'')});listProviders();}});
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  if(window.ethereum?.request&&![...providers.values()].some(e=>e.provider===window.ethereum)){const p=window.ethereum;const name=p.isCoinbaseWallet?'Coinbase Wallet':p.isMetaMask?'MetaMask':'Browser wallet';providers.set(name,{name,provider:p,rdns:''});}
  q('#wallet-open').onclick=()=>{listProviders();q('#wallet-dialog').showModal();};
  q('#wallet-close').onclick=()=>q('#wallet-dialog').close();
  q('#disconnect').onclick=()=>{clearSession();tell('Site session disconnected. Wallet permission can be removed in your wallet settings.');};
})();
