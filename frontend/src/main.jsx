import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { api } from './lib/api';
import './styles.css';

const NAV = [
  ['Dashboard','/','▦'], ['Researchers','/researchers','♙'], ['Projects','/projects','□'],
  ['Publications','/publications','✎'], ['Events','/events','□'], ['Opportunities','/grants','☆'],
];

// Each entry: [resource (matches the /api/<resource> route), path, icon, title, fields, columns, searchable]
const MANAGEMENT = [
  ['research-areas','/research-areas','•','Research Areas', () => researchAreaFields, () => researchAreaColumns, 'name'],
  ['research-groups','/research-groups','•','Research Groups', () => researchGroupFields, () => researchGroupColumns, 'name'],
  ['resources','/resources','•','Resources', () => resourceFields, () => resourceColumns, 'title'],
  ['announcements','/announcements','•','Announcements', () => announcementFields, () => announcementColumns, 'title'],
  ['partners','/partners','•','Partners', () => partnerFields, () => partnerColumns, 'name'],
  ['statistics','/statistics','•','Statistics', () => statisticFields, () => statisticColumns, 'label'],
];

function App(){
  const [session,setSession]=useState(null);
  useEffect(()=>{ if(!supabase) return; supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>data.subscription.unsubscribe(); },[]);
  if(!supabase) return <SetupScreen/>;
  if(!session) return <Login/>;
  return <Shell session={session}/>;
}

function SetupScreen(){ return <div className="center-screen"><div className="login-card"><div className="brand-mark">R&D</div><h1>Admin setup required</h1><p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code>. Never put the service-role key in React.</p></div></div> }

function Login(){
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
 const submit=async(e)=>{e.preventDefault();setLoading(true);setError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setError(error.message);setLoading(false)};
 return <div className="center-screen"><form className="login-card" onSubmit={submit}><div className="brand-mark">R&D</div><h1>Admin sign in</h1><p>Sign in with a Supabase user that has an <b>admin_profiles</b> record.</p><label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label><label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></label>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={loading}>{loading?'Signing in…':'Sign in'}</button></form></div>
}

function Shell({session}){
 const [mobile,setMobile]=useState(false);
 const signOut=()=>supabase.auth.signOut();
 return <div className="app"><aside className={mobile?'sidebar open':'sidebar'}><div className="brand"><div className="brand-logo">R</div><div><strong>Islington College</strong><span>Research & Development</span></div></div><div className="divider"/>{NAV.map(([label,to,icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setMobile(false)} className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="nav-icon">{icon}</span>{label}</NavLink>)}<div className="nav-section">Management</div>{MANAGEMENT.map(([resource,to,icon,title])=><NavLink key={resource} to={to} onClick={()=>setMobile(false)} className={({isActive})=>isActive?'nav-item active':'nav-item'}><span className="nav-icon">{icon}</span>{title}</NavLink>)}<button className="signout" onClick={signOut}>↪ Sign out</button></aside><main className="main"><header className="topbar"><button className="menu" onClick={()=>setMobile(!mobile)}>☰</button><div className="top-search">⌕ <input placeholder="Search..." /></div><div className="user-chip">{session.user.email}</div></header><Routes><Route path="/" element={<Dashboard/>}/><Route path="/researchers" element={<CrudPage resource="researchers" title="Researchers" fields={researcherFields} columns={researcherColumns} searchable="name"/>}/><Route path="/projects" element={<CrudPage resource="projects" title="Projects" fields={projectFields} columns={projectColumns} searchable="title"/>}/><Route path="/publications" element={<CrudPage resource="publications" title="Publications" fields={publicationFields} columns={publicationColumns} searchable="title"/>}/><Route path="/events" element={<CrudPage resource="events" title="Events" fields={eventFields} columns={eventColumns} searchable="title"/>}/><Route path="/grants" element={<CrudPage resource="grants" title="Opportunities / Grants" fields={grantFields} columns={grantColumns} searchable="title"/>}/>{MANAGEMENT.map(([resource,to,,title,getFields,getColumns,searchable])=><Route key={resource} path={to} element={<CrudPage resource={resource} title={title} fields={getFields()} columns={getColumns()} searchable={searchable}/>}/>)}</Routes></main></div>
}

const researcherFields=[['name','Name','text',true],['position','Position','text'],['department_id','Department ID','number'],['email','Email','email'],['bio','Bio','textarea'],['orcid_url','ORCID URL','url'],['google_scholar_url','Google Scholar URL','url'],['profile_url','Profile URL','url'],['status','Status','select',['active','inactive']],['content_status','Content status','select',['draft','published','archived']]];
const projectFields=[['title','Title','text',true],['description','Description','textarea'],['objectives','Objectives','textarea'],['outputs_summary','Outputs summary','textarea'],['status','Status','select',['proposed','started','ongoing','under_data_collection','completed','archived']],['start_date','Start date','date'],['end_date','End date','date'],['recruitment_status','Recruitment status','select',['accepting_researchers','selection_closed','not_applicable']],['lead_researcher_id','Lead researcher ID','number'],['external_url','External URL','url'],['content_status','Publish status','select',['draft','preview','published','archived']]];
const publicationFields=[['title','Title','text',true],['abstract','Abstract','textarea'],['summary','Summary','textarea'],['publication_year','Publication year','number'],['publication_type','Publication type','text'],['venue','Venue','text'],['doi','DOI','text'],['external_url','External URL','url'],['content_status','Publish status','select',['draft','preview','published','archived']]];
const eventFields=[['title','Title','text',true],['description','Description','textarea'],['event_type','Event type','text'],['start_at','Start at','datetime-local'],['end_at','End at','datetime-local'],['location','Location','text'],['registration_url','Registration URL','url'],['action_url','Action URL','url'],['external_url','External URL','url'],['status','Status','select',['draft','upcoming','ongoing','completed','cancelled','archived']],['content_status','Content status','select',['draft','published','archived']]];
const grantFields=[['title','Title','text',true],['provider','Provider','text'],['funding_type','Funding type','text'],['description','Description','textarea'],['eligibility','Eligibility','textarea'],['amount','Amount','text'],['deadline','Deadline','date'],['requirements','Requirements','textarea'],['application_process','Application process','textarea'],['guidelines_url','Guidelines URL','url'],['contact','Contact','text'],['external_url','External URL','url'],['status','Status','select',['draft','open','closed','archived']],['content_status','Content status','select',['draft','published','archived']]];
const researcherColumns=[['name','Name'],['position','Position'],['department_id','Department'],['status','Status']];
const projectColumns=[['title','Title'],['status','Status'],['content_status','Publish status'],['start_date','Start date'],['end_date','End date'],['lead_researcher_id','Lead researcher']];
const publicationColumns=[['title','Title'],['publication_year','Year'],['publication_type','Type'],['venue','Venue'],['content_status','Publish status']];
const eventColumns=[['title','Title'],['event_type','Type'],['start_at','Start'],['location','Location'],['status','Status']];
const grantColumns=[['title','Title'],['provider','Provider'],['funding_type','Funding type'],['deadline','Deadline'],['status','Status']];

// NOTE: these six field/column sets are best-guess schemas based on the
// brief and naming conventions used elsewhere in this file (snake_case
// columns, *_id foreign keys, content_status for draft/published/archived).
// They haven't been confirmed against the actual Supabase tables — if a
// save fails with a column-not-found error, adjust the field `key` (the
// first item in each tuple) to match your real column name; nothing else
// needs to change.
const researchAreaFields=[['name','Name','text',true],['description','Description','textarea'],['parent_area_id','Parent area ID','number']];
const researchAreaColumns=[['name','Name'],['description','Description'],['parent_area_id','Parent area']];
const researchGroupFields=[['name','Name','text',true],['description','Description','textarea'],['research_area_id','Research area ID','number'],['lead_researcher_id','Lead researcher ID','number']];
const researchGroupColumns=[['name','Name'],['research_area_id','Research area'],['lead_researcher_id','Lead researcher']];
const resourceFields=[['title','Title','text',true],['description','Description','textarea'],['category','Category','text'],['url','URL','url'],['content_status','Content status','select',['draft','published','archived']]];
const resourceColumns=[['title','Title'],['category','Category'],['content_status','Status']];
const announcementFields=[['title','Title','text',true],['body','Body','textarea'],['published_at','Published at','datetime-local'],['content_status','Content status','select',['draft','published','archived']]];
const announcementColumns=[['title','Title'],['published_at','Published'],['content_status','Status']];
const partnerFields=[['name','Name','text',true],['partner_type','Partner type','text'],['description','Description','textarea'],['url','URL','url']];
const partnerColumns=[['name','Name'],['partner_type','Type'],['url','URL']];
const statisticFields=[['label','Label','text',true],['value','Value','text'],['category','Category','text']];
const statisticColumns=[['label','Label'],['value','Value'],['category','Category']];

function Dashboard(){
 const [data,setData]=useState({}); const [error,setError]=useState('');
 useEffect(()=>{Promise.all(['researchers','projects','publications','events','grants'].map(async r=>{try{return [r,await api.list(r)]}catch(e){setError(e.message);return [r,[]]}})).then(entries=>setData(Object.fromEntries(entries)))},[]);
 const cards=[['Researchers','researchers'],['Projects','projects'],['Publications','publications'],['Events','events'],['Opportunities','grants']];
 const attention=[]; (data.projects||[]).filter(x=>x.status==='archived').forEach(x=>attention.push({type:'warning',title:'Archived project',text:x.title})); (data.grants||[]).filter(x=>x.status==='closed').forEach(x=>attention.push({type:'warning',title:'Closed opportunity',text:x.title}));
 const recent=[...Object.entries(data).flatMap(([resource,rows])=>rows.map(r=>({resource,row:r})))].slice(0,6);
 return <Page title="Dashboard"><div className="stats">{cards.map(([label,key])=><div className="stat" key={key}><b>{data[key]?.length??'—'}</b><span>{label}</span></div>)}</div><div className="dashboard-grid"><section className="panel"><div className="panel-title"><h2>Needs attention</h2><span className="muted">Live database checks</span></div>{error&&<div className="error">{error}</div>}{attention.length===0?<Empty text="No attention items found."/>:attention.map((x,i)=><div className="attention" key={i}><span className="dot yellow"/><div><b>{x.title}</b><p>{x.text}</p></div><span className="badge warning">WARNING</span></div>)}</section><section className="panel"><div className="panel-title"><h2>Recent records</h2></div>{recent.length===0?<Empty text="No records found."/>:recent.map((x,i)=><div className="activity" key={i}><span className="activity-dot"/><span><b>{x.row.title||x.row.name}</b><small>{x.resource}</small></span></div>)}</section></div></Page>
}

function CrudPage({resource,title,fields,columns,searchable}){
 const [rows,setRows]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [query,setQuery]=useState(''); const [modal,setModal]=useState(null); const [saving,setSaving]=useState(false);
 const load=async()=>{setLoading(true);setError('');try{setRows(await api.list(resource))}catch(e){setError(e.message)}finally{setLoading(false)}};
 useEffect(()=>{load()},[resource]);
 const filtered=useMemo(()=>rows.filter(r=>String(r[searchable]??'').toLowerCase().includes(query.toLowerCase())),[rows,query,searchable]);
 const save=async(values)=>{setSaving(true);try{const token=(await supabase.auth.getSession()).data.session?.access_token;if(modal?.id) await api.update(resource,modal.id,values,token); else await api.create(resource,values,token);setModal(null);await load()}catch(e){setError(e.message)}finally{setSaving(false)}};
 const remove=async(id)=>{if(!confirm('Delete this record? This cannot be undone.'))return;try{const token=(await supabase.auth.getSession()).data.session?.access_token;await api.remove(resource,id,token);setRows(r=>r.filter(x=>x.id!==id))}catch(e){setError(e.message)}};
 return <Page title={title}><div className="manage-head"><div className="search-box">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search by ${searchable}...`}/></div><button className="primary" onClick={()=>setModal({})}>＋ New {title.replace(/s$/,'')}</button></div>{error&&<div className="error page-error">{error}</div>}<section className="table-panel"><div className="table-wrap"><table><thead><tr>{columns.map(([,label])=><th key={label}>{label}</th>)}<th>Actions</th></tr></thead><tbody>{loading?<tr><td colSpan={columns.length+1} className="empty">Loading…</td></tr>:filtered.length===0?<tr><td colSpan={columns.length+1} className="empty">No records found.</td></tr>:filtered.map(row=><tr key={row.id}>{columns.map(([key])=><td key={key}>{key.includes('status')?<Status value={row[key]}/>:formatValue(row[key])}</td>)}<td className="actions"><button onClick={()=>setModal(row)} aria-label="Edit">✎</button><button onClick={()=>remove(row.id)} aria-label="Delete">⌫</button></td></tr>)}</tbody></table></div></section>{modal&&<Modal title={modal.id?`Edit ${title.replace(/s$/,'')}`:`New ${title.replace(/s$/,'')}`} fields={fields} initial={modal} onClose={()=>setModal(null)} onSave={save} saving={saving}/>}</Page>
}

function Modal({title,fields,initial,onClose,onSave,saving}){
  const isPublishFlow=fields.some(([k,,type,opts])=>k==='content_status'&&type==='select'&&Array.isArray(opts)&&opts.includes('preview'));
  const [values,setValues]=useState(()=>Object.fromEntries(fields.map(([k])=>[k,initial[k]??''])));
  const [step,setStep]=useState('edit'); // 'edit' | 'preview'
  const change=(k,v)=>setValues(x=>({...x,[k]:v}));
  const editFields=isPublishFlow?fields.filter(([k])=>k!=='content_status'):fields;
  const renderControl=(key,label,type,requiredOrOptions)=>{
    const options=type==='select'?requiredOrOptions:[];
    if(type==='select') return <select value={values[key]??''} onChange={e=>change(key,e.target.value)}><option value="">Select…</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
    if(type==='textarea') return <textarea value={values[key]??''} required={requiredOrOptions===true} onChange={e=>change(key,e.target.value)}/>;
    return <input type={type} value={values[key]??''} required={requiredOrOptions===true} onChange={e=>change(key,e.target.value)}/>;
  };
  const saveWithStatus=(status)=>onSave(clean({...values,...(isPublishFlow?{content_status:status}:{})}));
  return <div className="overlay"><div className="modal">
    <div className="modal-head"><h2>{title}</h2><button onClick={onClose}>×</button></div>
    {isPublishFlow&&<div className="flow-steps">
      <span className={`flow-step${step==='edit'?' active':' done'}`}>1. Draft</span>
      <span className="flow-arrow">→</span>
      <span className={`flow-step${step==='preview'?' active':''}`}>2. Preview</span>
      <span className="flow-arrow">→</span>
      <span className="flow-step">3. Publish</span>
    </div>}
    {step==='edit'&&<div className="form-grid">{editFields.map(([key,label,type,requiredOrOptions])=>
      <label key={key} className={type==='textarea'?'wide':''}>{label}{renderControl(key,label,type,requiredOrOptions)}</label>
    )}</div>}
    {step==='preview'&&isPublishFlow&&<div className="preview-panel">
      <div className="preview-banner">Previewing how this record will look. It will not be visible publicly until you publish it.</div>
      {editFields.map(([key,label])=>values[key]?<div className="preview-row" key={key}><b>{label}</b><span>{String(values[key])}</span></div>:null)}
    </div>}
    <div className="modal-actions">
      {isPublishFlow?(step==='edit'?<>
        <button className="secondary" onClick={onClose}>Cancel</button>
        <button className="secondary" onClick={()=>saveWithStatus('draft')} disabled={saving}>{saving?'Saving…':'Save as draft'}</button>
        <button className="primary" onClick={()=>setStep('preview')}>Preview →</button>
      </>:<>
        <button className="secondary" onClick={()=>setStep('edit')}>← Back to edit</button>
        <button className="secondary" onClick={()=>saveWithStatus('preview')} disabled={saving}>{saving?'Saving…':'Save as preview'}</button>
        <button className="primary" onClick={()=>saveWithStatus('published')} disabled={saving}>{saving?'Publishing…':'Publish'}</button>
      </>):<>
        <button className="secondary" onClick={onClose}>Cancel</button>
        <button className="primary" onClick={()=>onSave(clean(values))} disabled={saving}>{saving?'Saving…':'Save changes'}</button>
      </>}
    </div>
  </div></div>;
}

function clean(obj){const out={...obj};Object.keys(out).forEach(k=>{if(out[k]==='')out[k]=null; if(['department_id','lead_researcher_id','publication_year','parent_area_id','research_area_id'].includes(k)&&out[k]!==null)out[k]=Number(out[k])});return out}
function formatValue(v){if(v===null||v===undefined||v==='')return '—';const s=String(v);return s.length>70?s.slice(0,70)+'…':s}
function Status({value}){return <span className={`badge ${['active','published','upcoming','ongoing','open','started','completed'].includes(value)?'success':(['draft','preview','proposed','under_data_collection'].includes(value)?'warning':'neutral')}`}>{value||'—'}</span>}
function Page({title,children}){return <div className="page"><div className="page-title"><h1>{title}</h1></div>{children}</div>}
function Empty({text}){return <div className="empty">{text}</div>}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
