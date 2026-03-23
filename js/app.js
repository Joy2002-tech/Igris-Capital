function esc(s){const d=document.createElement('div');d.appendChild(document.createTextNode(String(s)));return d.innerHTML;}

// MOBILE NAV
const hamBtn=document.getElementById('hamBtn'),mobNav=document.getElementById('mobNav');
function closeMob(){hamBtn.classList.remove('open');mobNav.style.display='none'}
hamBtn.addEventListener('click',()=>{const open=hamBtn.classList.toggle('open');mobNav.style.display=open?'flex':'none';});

// THEME
const root=document.documentElement,tBtn=document.getElementById('themeBtn');
function applyTheme(t){root.setAttribute('data-theme',t);tBtn.textContent=t==='dark'?'☀️':'🌙';localStorage.setItem('ic-theme',t);}
applyTheme(localStorage.getItem('ic-theme')||'light');
tBtn.addEventListener('click',()=>applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'));

// SERVICE TABS
function switchTab(idx){
  document.querySelectorAll('.tab-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
  document.querySelectorAll('.tab-panel').forEach((p,i)=>p.classList.toggle('on',i===idx));
}

// CALC TABS
function switchCalc(idx){
  document.querySelectorAll('.calc-tab-btn').forEach((b,i)=>b.classList.toggle('on',i===idx));
  document.querySelectorAll('.calc-panel').forEach((p,i)=>p.classList.toggle('on',i===idx));
}

// PAGE NAV
function go(name){
  closeMob();
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('page-'+name);
  if(pg){pg.classList.add('active');}
  document.querySelectorAll('.nav-pill a[data-p],.mob-nav a[data-p]').forEach(a=>a.classList.toggle('active',a.getAttribute('data-p')===name));
  window.scrollTo({top:0,behavior:'instant'});
  document.querySelectorAll('#page-'+name+' .fu').forEach(el=>{el.style.animation='none';el.offsetHeight;el.style.animation='';});
  setTimeout(revealAll,80);
}

// SCROLL NAV
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('scrolled',window.scrollY>50));

// SCROLL REVEAL
function revealAll(){
  const els=document.querySelectorAll('.page.active .rev:not(.vis)');
  const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('vis'),i*55);obs.unobserve(e.target);}});},{threshold:.08});
  els.forEach(el=>obs.observe(el));
}
revealAll();

// CONTACT FORM
async function submitForm(){
  const btn=document.getElementById('sbtn');
  if(document.getElementById('hp-contact').value){return;}
  const name=document.getElementById('fn').value.trim();
  const phone=document.getElementById('fp').value.trim();
  const email=document.getElementById('fe').value.trim();
  const service=document.getElementById('fs').value||'Not specified';
  const message=document.getElementById('fm').value.trim()||'No additional message';
  if(!name||!phone||!email){alert('Please fill in your name, phone number, and email.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Please enter a valid email address.');return;}
  btn.textContent='Opening WhatsApp…';btn.disabled=true;
  const text=
    `Hi Joy! I'd like to enquire about your services.\n\n`+
    `*Name:* ${name}\n`+
    `*Phone:* ${phone}\n`+
    `*Email:* ${email}\n`+
    `*Interested in:* ${service}\n`+
    `*Message:* ${message}`;
  const waUrl='https://wa.me/918928793627?text='+encodeURIComponent(text);
  window.open(waUrl,'_blank');
  document.getElementById('f-fields').style.display='none';
  document.getElementById('f-success').style.display='block';
}

// ── CALCULATORS ──
function fmt(n){return '₹'+Math.round(n).toLocaleString('en-IN');}
function fmtK(n){if(n>=10000000)return '₹'+(n/10000000).toFixed(2)+' Cr';if(n>=100000)return '₹'+(n/100000).toFixed(2)+' L';return fmt(n);}
function getVal(id){return parseFloat(document.getElementById(id).value)||0;}

function syncFromRange(rangeId,manualId){
  document.getElementById(manualId).value=document.getElementById(rangeId).value;
}
function syncFromManual(rangeId,manualId,minV,maxV){
  let v=parseFloat(document.getElementById(manualId).value)||minV;
  const slider=document.getElementById(rangeId);
  slider.value=Math.min(Math.max(v,parseFloat(slider.min)),parseFloat(slider.max));
}

function calcSIP(){
  const P=Math.max(100,getVal('sip-amt-manual'));
  const r=Math.max(0.01,getVal('sip-rate-manual'))/100/12;
  const n=Math.max(1,getVal('sip-yrs-manual'))*12;
  const inf=getVal('sip-inf-manual')||0;
  const fv=P*((Math.pow(1+r,n)-1)/r)*(1+r);
  const invested=P*n;
  const yrs=Math.max(1,getVal('sip-yrs-manual'));
  const realFV=fv/Math.pow(1+inf/100,yrs);
  document.getElementById('sip-invested').textContent=fmtK(invested);
  document.getElementById('sip-returns').textContent=fmtK(fv-invested);
  document.getElementById('sip-total').textContent=fmtK(fv);
  document.getElementById('sip-real').textContent=fmtK(realFV);
  drawSIPChart(P,getVal('sip-rate-manual'),getVal('sip-yrs-manual'));
}

function drawSIPChart(P,rate,yrs){
  const chart=document.getElementById('sip-chart');
  if(!chart)return;
  chart.innerHTML='';
  const r=rate/100/12;
  const steps=Math.min(Math.max(1,Math.round(yrs)),10);
  let maxVal=0;const data=[];
  for(let i=1;i<=steps;i++){
    const n=Math.round(i*(yrs/steps)*12);
    const fv=P*((Math.pow(1+r,n)-1)/r)*(1+r);
    const inv=P*n;
    data.push({y:Math.round(i*(yrs/steps)),fv,inv});
    if(fv>maxVal)maxVal=fv;
  }
  const H=110;
  data.forEach(d=>{
    const wrap=document.createElement('div');wrap.className='bar-wrap';
    const iH=Math.max(2,Math.round((d.inv/maxVal)*H));
    const rH=Math.max(2,Math.round(((d.fv-d.inv)/maxVal)*H));
    wrap.innerHTML=`<div class="bar-returns" style="height:${rH}px"></div><div class="bar-invested" style="height:${iH}px"></div><div class="bar-yr">${d.y}y</div>`;
    chart.appendChild(wrap);
  });
}

function calcLS(){
  const P=Math.max(100,getVal('ls-amt-manual'));
  const r=Math.max(0.01,getVal('ls-rate-manual'))/100;
  const n=Math.max(1,getVal('ls-yrs-manual'));
  const inf=getVal('ls-inf-manual')||0;
  const fv=P*Math.pow(1+r,n);
  const realFV=fv/Math.pow(1+inf/100,n);
  document.getElementById('ls-invested').textContent=fmtK(P);
  document.getElementById('ls-returns').textContent=fmtK(fv-P);
  document.getElementById('ls-total').textContent=fmtK(fv);
  document.getElementById('ls-mult').textContent=(fv/P).toFixed(1)+'x';
  document.getElementById('ls-real').textContent=fmtK(realFV);
}

function calcGoal(){
  const targetNominal=Math.max(1000,getVal('goal-target-manual'));
  const inf=getVal('goal-inf-manual')||0;
  const yrs=Math.max(1,getVal('goal-yrs-manual'));
  // Inflate the target to future value in nominal terms
  const inflatedTarget=targetNominal*Math.pow(1+inf/100,yrs);
  const r=Math.max(0.01,getVal('goal-rate-manual'))/100/12;
  const n=yrs*12;
  const sip=inflatedTarget*r/((Math.pow(1+r,n)-1)*(1+r));
  const invested=sip*n;
  document.getElementById('goal-corpus').textContent=fmtK(targetNominal);
  document.getElementById('goal-inf-target').textContent=fmtK(inflatedTarget);
  document.getElementById('goal-sip').textContent=fmt(sip);
  document.getElementById('goal-invested').textContent=fmtK(invested);
  document.getElementById('goal-returns').textContent=fmtK(inflatedTarget-invested);
}

function calcEMI(){
  const P=Math.max(1000,getVal('emi-amt-manual'));
  const r=Math.max(0.01,getVal('emi-rate-manual'))/100/12;
  const n=Math.max(1,getVal('emi-yrs-manual'))*12;
  const emi=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  const total=emi*n;
  document.getElementById('emi-monthly').textContent=fmt(emi);
  document.getElementById('emi-principal').textContent=fmtK(P);
  document.getElementById('emi-interest').textContent=fmtK(total-P);
  document.getElementById('emi-total').textContent=fmtK(total);
}

// Init calculators on load
calcSIP();calcLS();calcGoal();calcEMI();


// FEEDBACK FORM
function submitFeedback(){
  const name=document.getElementById('fb-name')?.value?.trim()||'';
  const rating=document.querySelector('.star-btn.active')?.dataset?.val||'5';
  const text=document.getElementById('fb-text')?.value?.trim()||'';
  if(!name||!text){alert('Please fill in your name and feedback.');return;}
  const card=document.createElement('div');
  card.className='fb-card';
  const stars='★'.repeat(parseInt(rating))+'☆'.repeat(5-parseInt(rating));
  card.innerHTML=`<div class="fb-stars">${stars}</div><div class="fb-text">${esc(text)}</div><div class="fb-meta"><span class="fb-name">${esc(name)}</span><span class="fb-date">${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>`;
  const wall=document.getElementById('fb-wall');
  const empty=wall?.querySelector('.fb-empty');
  if(empty)empty.remove();
  wall?.prepend(card);
  // Reset form
  const nameEl=document.getElementById('fb-name');
  const textEl=document.getElementById('fb-text');
  if(nameEl)nameEl.value='';
  if(textEl)textEl.value='';
  document.querySelectorAll('.star-btn').forEach(b=>b.classList.remove('active'));
  const lastStar=document.querySelector('.star-btn[data-val="5"]');
  if(lastStar)lastStar.classList.add('active');
}

// Star rating buttons
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.star-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const val=parseInt(btn.dataset.val);
      document.querySelectorAll('.star-btn').forEach((b,i)=>{
        b.classList.toggle('active',parseInt(b.dataset.val)<=val);
      });
    });
  });
});
