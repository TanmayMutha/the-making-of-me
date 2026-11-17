const DATA_URL = './data.json';
const $ = (s,root=document)=>root.querySelector(s);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = s => /^https?:\/\//i.test(s||'') ? s : '';
async function loadData(){
  const r=await fetch(DATA_URL+'?v='+Date.now()); if(!r.ok) throw new Error('Could not load portfolio data'); return r.json();
}
function render(){
 loadData().then(d=>{
  const p=d.profile||{};
  $('#name').textContent=p.name||'Your Name'; $('#headline').textContent=p.headline||'Personal Portfolio';
  $('#summary').textContent=p.summary||'A living record of my learning, work and experiences.';
  $('#location').textContent=p.location||'';
  const links=[['Email',p.email?`mailto:${p.email}`:''],['LinkedIn',safeUrl(p.linkedin)],['GitHub',safeUrl(p.github)],['Website',safeUrl(p.website)]].filter(x=>x[1]);
  $('#contact').innerHTML=links.map(([n,u])=>`<a class="btn ghost" href="${esc(u)}" target="_blank" rel="noreferrer">${esc(n)} ↗</a>`).join('');
  const all=(d.sections||[]).flatMap(s=>s.items||[]);
  $('#stat-items').textContent=all.length; $('#stat-sections').textContent=(d.sections||[]).filter(s=>(s.items||[]).length).length; $('#stat-projects').textContent=((d.sections||[]).find(s=>s.id==='projects')?.items||[]).length;
  $('#content').innerHTML=(d.sections||[]).filter(s=>(s.items||[]).length).map(s=>`
   <section class="section" id="${esc(s.id)}"><div class="section-head"><div><h2>${esc(s.title)}</h2><p>${esc(s.description||'')}</p></div></div>
   <div class="grid">${s.items.map(i=>`<article class="entry"><h3>${esc(i.title||'Untitled')}</h3><div class="meta">${[i.organization,i.date].filter(Boolean).map(esc).join(' · ')}</div>${i.description?`<p>${esc(i.description).replace(/\n/g,'<br>')}</p>`:''}${i.skills?`<div class="tags">${i.skills.split(',').map(t=>`<span class="tag">${esc(t.trim())}</span>`).join('')}</div>`:''}${safeUrl(i.link)?`<p><a href="${esc(i.link)}" target="_blank" rel="noreferrer">View details ↗</a></p>`:''}</article>`).join('')}</div></section>`).join('') || '<div class="empty">Your story starts here. Add your first entry from the private input page.</div>';
 }).catch(e=>{$('#content').innerHTML=`<div class="empty">${esc(e.message)}. Run this site through GitHub Pages or a local web server to load data.json.</div>`});
}
render();