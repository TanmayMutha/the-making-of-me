const STARTER_DATA = {"profile":{"name":"Your Name","headline":"Engineering Student \u00b7 Builder \u00b7 Lifelong Learner","location":"","email":"","phone":"","summary":"Write a short introduction about who you are, what you build, and what you are working towards.","linkedin":"","github":"","website":"","photo":""},"sections":[{"id":"education","title":"Education","description":"Schools, degrees, academic distinctions and coursework","items":[]},{"id":"experience","title":"Work Experience","description":"Jobs, internships, apprenticeships, freelance and industrial training","items":[]},{"id":"projects","title":"Projects","description":"Academic, personal, hardware, software, research and open-source projects","items":[]},{"id":"skills","title":"Technical Skills","description":"Tools, programming languages, engineering software and methods","items":[]},{"id":"certifications","title":"Certifications & Courses","description":"Credentials, online courses and structured training","items":[]},{"id":"achievements","title":"Achievements & Awards","description":"Awards, scholarships, recognition and milestones","items":[]},{"id":"leadership","title":"Leadership & Responsibility","description":"Leadership roles, student committees and organising responsibilities","items":[]},{"id":"extracurricular","title":"Extracurricular Activities","description":"Creative pursuits, clubs, hobbies and cultural activities","items":[]},{"id":"volunteering","title":"Volunteering & Social Impact","description":"Community service, NGO work and social initiatives","items":[]},{"id":"competitions","title":"Competitions & Participation","description":"Hackathons, contests, fests, tournaments and presentations","items":[]},{"id":"research","title":"Research & Publications","description":"Papers, publications, patents, articles and independent research","items":[]},{"id":"entrepreneurship","title":"Entrepreneurship & Initiatives","description":"Startups, businesses, side projects and independent ventures","items":[]},{"id":"soft-skills","title":"Communication & Interpersonal Skills","description":"Communication, teamwork, public speaking and problem-solving","items":[]},{"id":"languages","title":"Languages","description":"Languages and your reading, writing and speaking proficiency","items":[]},{"id":"memberships","title":"Memberships & Affiliations","description":"Professional societies, student chapters and communities","items":[]},{"id":"events","title":"Events, Conferences & Workshops","description":"Seminars, industrial visits, workshops and conferences","items":[]},{"id":"sports","title":"Sports & Physical Activities","description":"Sports, teams, tournaments, coaching and fitness activities","items":[]},{"id":"other","title":"Other Experiences","description":"Mentoring, tutoring, content creation and meaningful contributions","items":[]}]};
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORE='lifePortfolioDraftV1', CONFIG='lifePortfolioConfigV1';
let data=null, editing=null;
const blank=()=>({title:'',organization:'',date:'',description:'',skills:'',link:'',evidence:''});
function status(msg,warn=false){$('#status').className='notice'+(warn?' warn':'');$('#status').textContent=msg;}
function saveLocal(){localStorage.setItem(STORE,JSON.stringify(data));}
function renderSections(){
 $('#section').innerHTML=data.sections.map(s=>`<option value="${esc(s.id)}">${esc(s.title)}</option>`).join('');
 renderItems();
}
function renderItems(){
 const sec=data.sections.find(s=>s.id===$('#section').value)||data.sections[0];
 $('#items').innerHTML=(sec.items||[]).map((it,n)=>`<div class="item-row"><div><b>${esc(it.title||'Untitled')}</b><div class="small">${esc([it.organization,it.date].filter(Boolean).join(' · '))}</div></div><div><button class="btn" data-edit="${n}">Edit</button> <button class="btn danger" data-delete="${n}">Delete</button></div></div>`).join('')||'<p class="small">No entries in this section yet.</p>';
 $('#items').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>loadEntry(Number(b.dataset.edit)));
 $('#items').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Delete this entry?')){sec.items.splice(Number(b.dataset.delete),1);saveLocal();renderItems();status('Deleted locally. Sync to GitHub when ready.');}});
}
function loadEntry(n){
 const sec=data.sections.find(s=>s.id===$('#section').value); editing=n;
 const item=n===null?blank():{...blank(),...sec.items[n]};
 for(const k of Object.keys(blank())) $('#'+k).value=item[k]||'';
 $('#entry-title').textContent=n===null?'Add an entry':'Edit entry'; $('#cancel-edit').classList.toggle('hidden',n===null);
}
function autoSync(){ if($('#token').value.trim()) githubPush(); }
function collect(){
 const sec=data.sections.find(s=>s.id===$('#section').value);
 const item={}; for(const k of Object.keys(blank())) item[k]=$('#'+k).value.trim();
 if(!item.title){status('Please enter a title before saving.',true);return;}
 if(!Array.isArray(sec.items))sec.items=[];
 if(editing===null)sec.items.unshift(item); else sec.items[editing]=item;
 editing=null; saveLocal(); loadEntry(null); renderItems(); status('Saved locally. Syncing to GitHub…'); autoSync();
}
function loadProfile(){
 const p=data.profile||{};
 for(const k of ['name','headline','location','email','phone','summary','linkedin','github','website','photo']) $('#p-'+k).value=p[k]||'';
}
function collectProfile(){
 data.profile={}; for(const k of ['name','headline','location','email','phone','summary','linkedin','github','website','photo']) data.profile[k]=$('#p-'+k).value.trim();
 saveLocal(); status('Profile saved locally. Syncing to GitHub…'); autoSync();
}
function getConfig(){try{return JSON.parse(localStorage.getItem(CONFIG)||'{}')}catch{return {}}}
function setConfig(){const c={owner:$('#owner').value.trim(),repo:$('#repo').value.trim(),branch:$('#branch').value.trim()||'main',path:$('#path').value.trim()||'data.json'};localStorage.setItem(CONFIG,JSON.stringify(c));return c;}
async function githubPush(){
 const c=setConfig(), token=$('#token').value.trim();
 if(!c.owner||!c.repo||!token){status('Enter repository owner, repository name and a fine-grained GitHub token.',true);return;}
 const api=`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${c.path.split('/').map(encodeURIComponent).join('/')}`;
 try{
  status('Connecting to GitHub…');
  const headers={'Authorization':`Bearer ${token}`,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  let sha;
  const existing=await fetch(api+`?ref=${encodeURIComponent(c.branch)}`,{headers});
  if(existing.ok){const j=await existing.json();sha=j.sha;} else if(existing.status!==404){throw new Error(`GitHub read failed (${existing.status}). Check repository, branch and token permissions.`);}
  const content=btoa(unescape(encodeURIComponent(JSON.stringify(data,null,2))));
  const body={message:'Update life portfolio data',content,branch:c.branch}; if(sha)body.sha=sha;
  const res=await fetch(api,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const result=await res.json(); if(!res.ok)throw new Error(result.message||`GitHub returned ${res.status}`);
  status('Successfully pushed data.json to GitHub. Your GitHub Pages site will update after its next deployment.');
 }catch(e){status(e.message+' Your local draft is safe in this browser.',true);}
}
async function init(){
 const c=getConfig(); for(const [k,v] of Object.entries({owner:c.owner,repo:c.repo,branch:c.branch||'main',path:c.path||'data.json'}))$('#'+k).value=v||'';
 try{
  const draft=localStorage.getItem(STORE);
  if(draft)data=JSON.parse(draft);
  else {const r=await fetch('./data.json');if(!r.ok)throw Error();data=await r.json();}
 }catch{data=JSON.parse(JSON.stringify(STARTER_DATA));saveLocal();status('Started with the built-in portfolio template. Local editing works without a server; GitHub sync needs internet.',false);}
 if(!data.sections?.length){status('Portfolio data is missing. Restore the starter data.json file.',true);return;}
 renderSections();loadProfile();loadEntry(null);
 $('#section').onchange=()=>{editing=null;renderItems();loadEntry(null)};
 $('#save-entry').onclick=collect;$('#cancel-edit').onclick=()=>loadEntry(null);
 $('#save-profile').onclick=collectProfile;$('#push').onclick=githubPush;
 $('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='data.json';a.click();URL.revokeObjectURL(a.href);};
 $('#import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{data=JSON.parse(await f.text());saveLocal();renderSections();loadProfile();loadEntry(null);status('Imported JSON successfully.');}catch{status('That file is not valid portfolio JSON.',true);}};
}
init();