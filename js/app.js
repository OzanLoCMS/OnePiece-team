(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement,RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
const K=innerWidth<600?.7:1;
const SOC={kick:["Kick","Kick"],instagram:["Instagram","Instagram"],youtube:["YouTube","YouTube"]};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const icon=(name)=>{const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 24 24");s.setAttribute("class","ic");s.setAttribute("aria-hidden","true");const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",(window.ICONS||{})[name]||"");s.appendChild(p);return s};
const loadImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error("skin: "+src));i.src=src});
const loadScript=src=>new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("script"));document.head.appendChild(s)});

async function loadTeam(){const emb=$("#team-data");if(emb)return JSON.parse(emb.textContent);const r=await fetch("team.json");if(!r.ok)throw new Error("team.json "+r.status);return r.json()}

/* flat 2D front view of a skin (fallback + member list) */
function sprite(img){const c=document.createElement("canvas");c.width=16;c.height=32;const x=c.getContext("2d");x.imageSmoothingEnabled=false;
const d=(sx,sy,w,h,dx,dy)=>x.drawImage(img,sx,sy,w,h,dx,dy,w,h);
d(8,8,8,8,4,0);d(20,20,8,12,4,8);d(44,20,4,12,0,8);d(36,52,4,12,12,8);d(4,20,4,12,4,20);d(20,52,4,12,8,20);
d(40,8,8,8,4,0);d(20,36,8,12,4,8);d(44,36,4,12,0,8);d(52,52,4,12,12,8);d(4,36,4,12,4,20);d(4,52,4,12,8,20);return c}

function render(T){
  document.title=T.teamName+" — "+T.tagline;
  $("#logo").src=T.logo;
  $("#lead").textContent=T.description;
  const dc=T.discordUrl;
  [["#dcHero"],["#dcMain"],["#dcFoot"]].forEach(([s])=>{const a=$(s);if(dc){a.href=dc}else{a.setAttribute("aria-disabled","true");a.removeAttribute("href")}});
  ["#dcHero","#dcMain"].forEach(s=>{const old=$(s+" .ic");if(old)old.replaceWith(icon("discord"))});
  $("#credit").textContent=T.credit;
  const ol=$("#members");
  T.members.forEach((m,i)=>{
    const li=el("li","member"+(m.featured?" f":""));li.dataset.b="rise";li.dataset.d=i*110;
    const ph=el("canvas");ph.setAttribute("aria-hidden","true");ph.dataset.slug=m.slug;li.append(ph);
    li.append(el("h3",null,m.username),el("p","role",m.role));
    const ul=el("ul","soc");
    Object.entries(m.socials||{}).forEach(([k,u])=>{if(!SOC[k]||!u)return;const a=el("a");a.href=u;a.target="_blank";a.rel="noopener noreferrer";a.setAttribute("aria-label",m.username+" — "+SOC[k][0]);a.append(icon(k),el("span",null,SOC[k][0]));const l=el("li");l.append(a);ul.append(l)});
    if(ul.children.length)li.append(ul);
    ol.append(li);
    const tag=el("div","tag"+(i===1?" c":""));tag.dataset.i=i;tag.append(el("em",null,String(i+1).padStart(2,"0")),el("b",null,m.username),el("span",null,m.role));$("#tags").append(tag);
  });
  $("#count").textContent=String(T.members.length).padStart(2,"0")+" OYUNCU";
  const g=$("#gal");
  if(!T.gallery||!T.gallery.length){
    const e=el("div","empty");e.setAttribute("aria-hidden","true");for(let i=0;i<4;i++)e.append(el("i"));
    g.append(e,el("p","note","Henüz fotoğraf eklenmedi. Ekip fotoğrafları eklendiğinde bu bölüm onlarla dolacak."));
  }else{
    const w=el("div","gal");
    T.gallery.forEach(p=>{const b=el("button");b.type="button";b.setAttribute("aria-label",(p.alt||"Fotoğraf")+" — büyüt");const im=el("img");im.src=p.src;im.alt=p.alt||"";im.loading="lazy";im.decoding="async";b.append(im);b.onclick=()=>{$("#lbi").src=p.src;$("#lbi").alt=p.alt||"";$("#lb").showModal()};w.append(b)});
    g.append(w);const lb=$("#lb");$("#lbx").onclick=()=>lb.close();lb.addEventListener("click",e=>{if(e.target===lb)lb.close()});
  }
}

/* menu */
function menu(){const nav=$("#nav"),mb=$("#mb");
  const tog=o=>{nav.classList.toggle("open",o);(o||matchMedia("(min-width:768px)").matches)?nav.removeAttribute("inert"):nav.setAttribute("inert","");mb.setAttribute("aria-expanded",o);mb.setAttribute("aria-label",o?"Menüyü kapat":"Menüyü aç")};
  const mq=matchMedia("(min-width:768px)"),sync=()=>{if(mq.matches)nav.removeAttribute("inert");else if(!nav.classList.contains("open"))nav.setAttribute("inert","")};sync();mq.addEventListener("change",sync);
  mb.onclick=()=>tog(!nav.classList.contains("open"));$$("a",nav).forEach(a=>a.onclick=()=>tog(false));
  addEventListener("keydown",e=>{if(e.key==="Escape")tog(false)})}

/* build animation: plays once per page load; nothing is stored, refresh restarts it */
function split(host){const w=host.dataset.b==="words",s=(+host.dataset.s||30)*K,d=(+host.dataset.d||0)*K;let i=0;
  host.setAttribute("aria-label",host.textContent);
  (function sp(n){[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();
      (w?c.data.split(/(\s+)/):[...c.data]).forEach(p=>{if(!p)return;const x=document.createElement("span");x.setAttribute("aria-hidden","true");x.textContent=p;if(/\S/.test(p)){x.className="ch";x.style.setProperty("--i",i++)}f.appendChild(x)});
      n.replaceChild(f,c)}else if(c.nodeType===1)sp(c)})})(host);
  host.style.setProperty("--s",s+"ms");host.style.setProperty("--d",d+"ms")}
function build(){
  if(RM||!("IntersectionObserver" in window)){root.classList.add("all");return}
  const all=$$("[data-b]");
  all.forEach(e=>{if(e.dataset.b==="type"||e.dataset.b==="words")split(e);else e.style.setProperty("--d",(+e.dataset.d||0)*K+"ms")});
  const hero=all.filter(e=>e.closest(".hero")),rest=all.filter(e=>!e.closest(".hero"));
  const go=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>hero.forEach(e=>e.classList.add("on"))));
  Promise.race([document.fonts?document.fonts.ready:Promise.resolve(),new Promise(r=>setTimeout(r,700))]).then(go);
  let pending=rest.length;
  const io=new IntersectionObserver(es=>es.forEach(en=>{
    const t=en.target,top=en.boundingClientRect.top;
    if(!en.isIntersecting&&top>=0)return;
    io.unobserve(t);if(!en.isIntersecting)t.classList.add("now");t.classList.add("on");
    if(--pending<=0)io.disconnect();
  }),{threshold:.15,rootMargin:"0px 0px -6% 0px"});
  rest.forEach(e=>io.observe(e));
}

/* 3D: tek WebGL context, üç skin, her karakter ayrı animasyon + hover parlaması */
async function scene(T){
  const vp=$(".vp"),cv=$("#scene"),tags=$$(".tag"),gl=$("#glows");
  const GC=["rgba(61,139,255,.5)","rgba(255,236,200,.3)","rgba(57,255,136,.42)"];
  const glows=T.members.map((m,i)=>{const g=el("i","glow");g.style.setProperty("--gc",GC[i%3]);gl.append(g);return g});
  const showTags=()=>tags.forEach((t,i)=>setTimeout(()=>t.classList.add("on"),RM?0:[500,1200,850][i]*K));
  const fallback=why=>{console.warn("3D yok:",why);cv.hidden=true;const fb=$("#fallback");fb.hidden=false;
    Promise.all(T.members.map(m=>loadImg(m.skin).then(sprite).catch(()=>null))).then(cs=>{cs.forEach(c=>{if(c)fb.append(c)});$$(".member canvas").forEach((c,i)=>{if(cs[i]){c.width=16;c.height=32;c.getContext("2d").drawImage(cs[i],0,0)}});});
    tags.forEach((t,i)=>{t.classList.add("on");const x=[18,50,82][i];t.style.left=x+"%";glows[i].style.left=x+"%"})};
  let imgs;
  try{imgs=await Promise.all(T.members.map(m=>loadImg(m.skin)))}catch(e){return fallback(e.message)}
  $$(".member canvas").forEach((c,i)=>{const s=sprite(imgs[i]);c.width=16;c.height=32;c.getContext("2d").drawImage(s,0,0)});
  let v;
  try{
    await loadScript(window.SV_SRC);
    v=new skinview3d.SkinViewer({canvas:cv,width:vp.clientWidth||300,height:vp.clientHeight||400,renderPaused:true});
  }catch(e){return fallback(e.message)}
  v.controls.dispose();cv.style.touchAction="pan-y";
  v.globalLight.intensity=3;v.cameraLight.intensity=0;v.pixelRatio=Math.min(devicePixelRatio||1,innerWidth<600?1.5:2);
  v.loadSkin(imgs[1]);const ref=v.playerObject.skin.map,TexC=ref.constructor;v.playerObject.visible=false;
  const mk=(img,model)=>{const c=document.createElement("canvas");c.width=c.height=64;c.getContext("2d").drawImage(img,0,0);
    const t=new TexC(c);t.flipY=ref.flipY;t.colorSpace=ref.colorSpace;t.magFilter=ref.magFilter;t.minFilter=ref.minFilter;t.generateMipmaps=ref.generateMipmaps;t.needsUpdate=true;
    const p=new skinview3d.PlayerObject();p.skin.map=t;p.skin.modelType=model==="slim"?"slim":"default";p.skin.visible=true;["cape","elytra","ears"].forEach(k=>{if(p[k])p[k].visible=false});p.visible=false;v.scene.add(p);
    /* parlama için emissive: doku ile aynı haritayı kullanır, ilk başta siyah */
    const ms=[];["layer1Material","layer2Material","layer1MaterialBiased","layer2MaterialBiased"].forEach(k=>{const m=p.skin[k];if(m&&m.emissive){m.emissiveMap=t;m.emissive.setRGB(0,0,0);m.needsUpdate=true;ms.push(m)}});
    return {p,ms}};
  /* soldan sağa: members[0], [1], [2] */
  const P=T.members.map((m,i)=>{const {p,ms}=mk(imgs[i],m.model);return{o:p,ms,x:[-1,0,1][i],s:i===1?1.2:.95,z:i===1?2:-3,t0:[300,1000,650][i]*K,at:0,off:0,vel:0,h:0,hov:0,base:-1.5}});
  /* her karakterin kendi hareketi: dönüş açısı (rad) ve zıplama (birim) */
  const ease=t=>1-Math.pow(1-Math.min(Math.max(t,0),1),4),io=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const PER=[1900,null,2300];
  const ANIM=[
    (t,h)=>({r:io((t%PER[0])/PER[0])*Math.PI*2,y:0}),                              // Ozan: hızlı tam tur (döngü)
    (t,h)=>({r:Math.sin(t/430)*.8*h,y:Math.abs(Math.sin(t/330))*.3*h}),           // croxy: hızlı salınım + zıplama
    (t,h)=>{const u=(t%PER[2])/PER[2];return{r:-io(u)*Math.PI*2,y:Math.sin(u*Math.PI)*1.7}} // Tuna: zıpla + ters tur
  ];
  let sp=17,W=0,H=0;
  const place=()=>P.forEach(p=>p.o.position.set(p.x*sp,p.base,p.z));
  const layout=()=>{W=vp.clientWidth;H=vp.clientHeight;if(!W||!H)return;v.width=W;v.height=H;const a=W/H;
    sp=a<1.2?20:Math.min(a*15.5,46);const tn=Math.tan(v.fov/2*Math.PI/180);
    const D=Math.max(25/tn,(sp+11)/(a*tn));v.camera.position.set(0,2,D);v.camera.lookAt(0,1,0);v.camera.updateMatrixWorld();
    place();P.forEach((p,i)=>{const pr=p.o.position.clone();pr.y=-18;pr.project(v.camera);const px=((pr.x*.5+.5)*W)+"px";tags[i].style.left=px;glows[i].style.left=px});wake()};
  /* imleç hangi karakterin üstünde? ekrana yansıtılmış kutu ile */
  const hit=(cx,cy)=>{const r=cv.getBoundingClientRect(),X=cx-r.left,Y=cy-r.top;let best=-1;
    P.forEach((p,i)=>{const s=p.s,q=p.o.position,A=q.clone(),B=q.clone();A.x-=9*s;A.y+=16*s;B.x+=9*s;B.y-=16*s;A.project(v.camera);B.project(v.camera);
      const x0=(A.x*.5+.5)*W,x1=(B.x*.5+.5)*W,y0=(-A.y*.5+.5)*H,y1=(-B.y*.5+.5)*H;if(X>=x0&&X<=x1&&Y>=y0&&Y<=y1)best=i});return best};
  const setHot=i=>{P.forEach((p,k)=>{p.hov=k===i?1:0;glows[k].classList.toggle("hot",k===i);tags[k].classList.toggle("hot",k===i)});cv.classList.toggle("hit",i>=0)};
  let tt=0,drag=-1,lx=0,raf=0,vis=true,t00=0,prev=0,idleAt=0,lastMove=0;
  function frame(now){raf=0;const dt=Math.min(now-(prev||now),50);prev=now;if(!t00)t00=now;let busy=false;
    P.forEach((p,i)=>{const k=RM?1:ease((now-t00-p.t0)/850);if((now-t00>=p.t0||RM)&&!p.o.visible)p.o.visible=true;if(k<1)busy=true;
      const per=PER[i%3];let act=false;
      if(!RM){act=!!p.hov||(per?p.at>0:p.h>.01);
        if(act){const n=p.at+dt;if(per&&!p.hov&&Math.floor(n/per)>Math.floor(p.at/per)){p.at=0;act=false}else p.at=n}
        if(!per&&!p.hov&&p.h<=.01)p.at=0}
      const a=RM||(!p.at&&!p.hov)?{r:0,y:0}:ANIM[i%3](p.at,p.h);
      if(act)busy=true;
      if(drag!==i){if(Math.abs(p.vel)>.0004){p.off+=p.vel;p.vel*=.9;busy=true}else if(now-lastMove>900&&Math.abs(p.off)>.002){p.off=RM?0:p.off*Math.exp(-dt/140);busy=true}}
      p.h+=(p.hov-p.h)*Math.min(1,dt/110);if(Math.abs(p.hov-p.h)>.01)busy=true;else p.h=p.hov;
      const g=p.h*.25;p.ms.forEach(m=>m.emissive.setRGB(g,g,g));
      p.o.position.y=p.base-(1-k)*6+a.y;p.o.rotation.y=(1-k)*.9+a.r+p.off;const s=p.s*(.96+.04*k)*(1+.035*p.h);p.o.scale.set(s,s,s)});
    if(drag>=0)busy=true;
    if(!busy){if(!idleAt)idleAt=now;if(now-idleAt>200){v.renderPaused=true;prev=0;return}}else idleAt=0;
    raf=requestAnimationFrame(frame)}
  function wake(){if(!vis||document.hidden)return;idleAt=0;v.renderPaused=false;if(!raf)raf=requestAnimationFrame(frame)}
  cv.addEventListener("pointerdown",e=>{const i=hit(e.clientX,e.clientY);if(i<0)return;clearTimeout(tt);drag=i;lx=e.clientX;P[i].vel=0;setHot(i);cv.setPointerCapture(e.pointerId);wake()});
  cv.addEventListener("pointermove",e=>{if(drag>=0){const dx=e.clientX-lx;lx=e.clientX;const p=P[drag];p.off+=dx*.012;p.vel=dx*.006;lastMove=performance.now();return}
    if(e.pointerType==="touch")return;setHot(hit(e.clientX,e.clientY));wake()});
  cv.addEventListener("pointerleave",e=>{if(drag<0&&e.pointerType!=="touch"){setHot(-1);wake()}});
  ["pointerup","pointercancel"].forEach(t=>cv.addEventListener(t,e=>{drag=-1;lastMove=performance.now();if(e.pointerType==="touch"){clearTimeout(tt);tt=setTimeout(()=>{setHot(-1);wake()},1500)}wake()}));
  cv.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();P.forEach(p=>p.vel+=e.key==="ArrowLeft"?-.07:.07);lastMove=performance.now();wake()}});
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;vis?wake():(v.renderPaused=true)}).observe(vp);
  document.addEventListener("visibilitychange",()=>{document.hidden?(v.renderPaused=true):wake()});
  new ResizeObserver(layout).observe(vp);
  layout();showTags();
  window.__scene={v,P,hit,setHot};
}

(async()=>{
  try{const T=await loadTeam();render(T);menu();build();scene(T)}
  catch(e){console.error(e);const m=el("p",null,"Ekip verisi yüklenemedi. Sayfayı yenilemeyi dene.");m.style.cssText="padding:120px 20px";document.body.prepend(m)}
})();
})();
