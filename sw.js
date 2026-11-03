const C="ledger-v4";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put("./index.html",cp));return r}).catch(()=>caches.match("./index.html")));
    return;
  }
  const cacheable=u.origin===location.origin||(u.host==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/"))||/^fonts\.(googleapis|gstatic)\.com$/.test(u.host);
  if(!cacheable)return; // Firebase 데이터 통신은 건드리지 않음
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r})));
});
