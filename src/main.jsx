import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Flower2, Heart, MapPin, Menu, Music2, Pause, Play, Send, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import './styles.css'
import './festival.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const events = [
  { id: 'abhishek-grahsatak', title: "Abhishek's Grahsatak", date: '26 February 2027', time: '10:00 AM', venue: 'Jhiniba Farm', address: 'Beside Ramji Residency, Jahangirpura, Surat, Gujarat, India', map: 'https://www.google.com/maps/search/?api=1&query=Jhiniba+Farm+Beside+Ramji+Residency+Jahangirpura+Surat+Gujarat+India', day: '26 FEB', category: 'Abhishek’s Day', icon: '✦' },
  { id: 'reception', title: 'Reception', date: '26 February 2027', time: '7:00 PM', venue: 'Jhiniba Farm', address: 'Beside Ramji Residency, Jahangirpura, Surat, Gujarat, India', map: 'https://www.google.com/maps/search/?api=1&query=Jhiniba+Farm+Beside+Ramji+Residency+Jahangirpura+Surat+Gujarat+India', day: '26 FEB', category: 'A celebration together', icon: '❋' },
  { id: 'anjali-grahsatak', title: "Anjali's Grahsatak", date: '27 February 2027', time: '10:00 AM', venue: 'Farohar Party B Plot', address: 'Opposite Pal RTO, Adajan, Surat, Gujarat, India', map: 'https://www.google.com/maps/search/?api=1&query=Farohar+Party+B+Plot+Opposite+Pal+RTO+Adajan+Surat+Gujarat+India', day: '27 FEB', category: 'Anjali’s Day', icon: '✿' },
  { id: 'marriage', title: 'Marriage', date: '27 February 2027', time: '7:00 PM', venue: 'Farohar Party B Plot', address: 'Opposite Pal RTO, Adajan, Surat, Gujarat, India', map: 'https://www.google.com/maps/search/?api=1&query=Farohar+Party+B+Plot+Opposite+Pal+RTO+Adajan+Surat+Gujarat+India', day: '27 FEB', category: 'The forever begins', icon: '♡' },
]
const inviteSets = {
  full: { label: 'The complete invitation', ids: events.map(e => e.id) },
  abhishek: { label: "Abhishek's invitation", ids: ['abhishek-grahsatak', 'reception', 'marriage'] },
  anjali: { label: "Anjali's invitation", ids: ['reception', 'anjali-grahsatak', 'marriage'] },
}
function getInviteType() {
  const path = window.location.pathname.toLowerCase()
  if (path.includes('/invite/abhishek')) return 'abhishek'
  if (path.includes('/invite/anjali')) return 'anjali'
  return 'full'
}
function makeCalendarFile(event) {
  const [day, month, year] = event.date.split(' ')
  const months = { January:'01', February:'02', March:'03', April:'04', May:'05', June:'06', July:'07', August:'08', September:'09', October:'10', November:'11', December:'12' }
  const [hourRaw, minute, meridiem] = event.time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1)
  let hour = Number(hourRaw) % 12
  if (meridiem === 'PM') hour += 12
  const start = `${year}${months[month]}${day.padStart(2,'0')}T${String(hour).padStart(2,'0')}${minute}00`
  const endHour = String((hour + 2) % 24).padStart(2,'0')
  const end = `${year}${months[month]}${day.padStart(2,'0')}T${endHour}${minute}00`
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Abhishek and Anjali//Wedding//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${event.id}@abhishek-anjali-wedding`,`DTSTAMP:20261123T000000Z`,`DTSTART;TZID=Asia/Kolkata:${start}`,`DTEND;TZID=Asia/Kolkata:${end}`,`SUMMARY:${event.title} — Abhishek & Anjali`,`LOCATION:${event.venue}, ${event.address}`,`DESCRIPTION:Join us to celebrate Abhishek & Anjali.`, 'END:VEVENT','END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a'); a.href = url; a.download = `${event.id}.ics`; a.click(); URL.revokeObjectURL(url)
}
function Palace() {
  return <div className="palace-art" aria-hidden="true"><div className="sun-glow"/><div className="palace-ground"/><div className="palace-main"><div className="main-dome"/><div className="main-spire"/><div className="main-arch"><div className="door"/></div><div className="balcony"/></div><div className="palace-wing wing-left"><div className="small-dome"/><div className="wing-window"/></div><div className="palace-wing wing-right"><div className="small-dome"/><div className="wing-window"/></div><div className="palace-tower tower-left"><div className="tower-cap"/></div><div className="palace-tower tower-right"><div className="tower-cap"/></div><div className="palace-steps"/></div>
}
function Petals() { return <div className="petal-field" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{'--i':i,'--delay':`${(i%7)*-1.4}s`,'--left':`${(i*17)%100}%`}}/>)}</div> }
function EventCard({ event, index }) {
  return <article className="event-card" style={{'--card-index': index}}><div className="event-topline"><span>{event.category}</span><span className="event-symbol">{event.icon}</span></div><div className="event-date">{event.day}</div><h3>{event.title}</h3><div className="event-detail"><CalendarDays size={16}/><span>{event.date}</span></div><div className="event-detail"><Clock3 size={16}/><span>{event.time} <small>IST</small></span></div><div className="event-venue"><MapPin size={17}/><div><strong>{event.venue}</strong><p>{event.address}</p></div></div><div className="event-actions"><a href={event.map} target="_blank" rel="noreferrer" className="text-link">Get directions <ArrowRight size={14}/></a><button className="calendar-btn" onClick={()=>makeCalendarFile(event)}><CalendarDays size={15}/> Add to calendar</button></div></article>
}
const story = [
  { n:'01', year:'THE BEGINNING', title:'Same place. Different departments.', place:'Torrent Power · Surat', text:'Same organisation. Different departments. Abhishek wanted to say hello, but somehow never found the right moment.', visual:'office', caption:'Operations × HR' },
  { n:'02', year:'2023 — 2025', title:'Life had its own plans.', place:'A little distance, a familiar connection', text:'Then he moved away for higher studies, while life took them on different journeys. Yet, one familiar connection remained.', visual:'calendar', caption:'Facebook friends, quietly' },
  { n:'03', year:'2025', title:'The request that took courage.', place:'Instagram · Request sent', text:"A new Instagram account, a few familiar connections... and one request that took a little extra courage. Anjali accepted within a day. But Abhishek's next challenge was much bigger: finding the perfect first message!", visual:'phone', caption:'Type. Delete. Overthink. Repeat.' },
  { n:'04', year:'2026', title:'One little birthday wish.', place:'A conversation begins', text:'For almost a year, Abhishek was preparing himself to start a conversation. Sometimes, all it takes is one little birthday wish to change the course of a story.', visual:'birthday', caption:'The first message that mattered' },
  { n:'05', year:'THE FIRST DATE', title:'A little spark.', place:'Coffee, conversations & more', text:'One meeting turned into many. Conversations became memories. And somewhere along the way, a little spark became something special.', visual:'cafe', caption:'One date became many memories' },
  { n:'06', year:'THE CONFESSION', title:'The feeling was mutual.', place:'Two hearts, one honest moment', text:'And one day, they finally said what their hearts already knew.', visual:'confession', caption:'The beginning of always' },
  { n:'07', year:'THE NEXT CHAPTER', title:'From a friend request to forever.', place:'Abhishek & Anjali · 2027', text:"Two journeys. One beautiful destination. And now, our next chapter begins. We'd be delighted to have you celebrate it with us!", visual:'wedding', caption:'Save the date · 26 & 27 February 2027' },
]
function StoryVisual({type}) {
  if(type==='office') return <div className="scene-visual office-scene"><div className="office-sign">TORRENT POWER</div><div className="desk desk-a"><span>⚙️</span><small>OPERATIONS</small></div><div className="desk desk-b"><span>📋</span><small>HUMAN RESOURCES</small></div><div className="mini-person boy"><i/><b/></div><div className="mini-person girl"><i/><b/></div><div className="thought">Should I say hello?</div></div>
  if(type==='calendar') return <div className="scene-visual calendar-scene"><div className="calendar-page"><span>2023</span><strong>NEW<br/>CHAPTER</strong><small>✦ &nbsp; 2025</small></div><div className="road-line"/><div className="tiny-figure">🚶🏻‍♂️</div><div className="social-note">Still friends <Heart size={13}/></div></div>
  if(type==='phone') return <div className="scene-visual phone-scene"><div className="phone"><div className="phone-top">9:41　● ● ●</div><div className="insta-head">◎ Instagram</div><div className="avatar">A</div><strong>anjali</strong><small>Suggested for you</small><div className="follow-pill">Requested ✓</div><div className="typing">Should I say hi?<br/><span>Hey Anjali... ✕</span><span>Hi! How are you? ✕</span><b>Happy birthday! ✓</b></div></div><div className="accept-note">Request accepted ✨</div></div>
  if(type==='birthday') return <div className="scene-visual birthday-scene"><div className="birthday-card"><span>🎂</span><strong>Happy Birthday!</strong><small>Hope you have a lovely day ✨</small><div className="message-heart">♥</div></div><div className="confetti">✦　✧　✦</div></div>
  if(type==='cafe') return <div className="scene-visual cafe-scene"><div className="cafe-window"><div className="window-glow"/><span>☕</span><i>♡</i></div><div className="cafe-table"/><div className="cafe-couple"><b>●</b><b>●</b></div><div className="cafe-caption">A table for two</div></div>
  if(type==='confession') return <div className="scene-visual confession-scene"><div className="moon"/><div className="heart-orbit">♡</div><div className="silhouette one">●<i/></div><div className="silhouette two">●<i/></div><div className="confession-caption">“I feel the same.”</div></div>
  return <div className="scene-visual wedding-scene"><div className="scene-arch"/><div className="wedding-couple"><span>🤵🏻</span><span>👰🏻</span></div><div className="wedding-lamps">✦　✧　✦</div></div>
}
function App() {
  const inviteType = getInviteType()
  const invite = inviteSets[inviteType]
  const visibleEvents = events.filter(e=>invite.ids.includes(e.id))
  const [introDone,setIntroDone] = useState(false)
  const [menuOpen,setMenuOpen] = useState(false)
  const [storyIndex,setStoryIndex] = useState(0)
  const [musicOn,setMusicOn] = useState(false)
  const [galleryIndex,setGalleryIndex] = useState(null)
  const [rsvpStatus,setRsvpStatus] = useState('')
  const [rsvpBusy,setRsvpBusy] = useState(false)
  const [form,setForm] = useState({name:'',phone:'',message:'',responses:{}})
  const musicContextRef = useRef(null)
  const musicTimerRef = useRef(null)
  const sectionEvents = useMemo(()=>visibleEvents,[inviteType])
  const weddingDate = new Date('2027-02-27T19:00:00+05:30').getTime()
  const [now,setNow] = useState(Date.now())
  useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t)},[])
  const remaining = Math.max(0,weddingDate-now)
  const countdown = {days:Math.floor(remaining/86400000),hours:Math.floor(remaining%86400000/3600000),minutes:Math.floor(remaining%3600000/60000),seconds:Math.floor(remaining%60000/1000)}
  useEffect(()=>{
    if(!musicOn){
      if(musicTimerRef.current) clearInterval(musicTimerRef.current)
      musicTimerRef.current = null
      if(musicContextRef.current) musicContextRef.current.suspend().catch(()=>{})
      return
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if(!AudioContextClass) { setMusicOn(false); return }
    const ctx = new AudioContextClass()
    musicContextRef.current = ctx
    const master = ctx.createGain(); master.gain.value = 0.045; master.connect(ctx.destination)
    const notes = [261.63,329.63,392.00,440.00,392.00,329.63,293.66,349.23,440.00,523.25,440.00,349.23]
    let step = 0
    const playNote = () => {
      const nowTime = ctx.currentTime
      const freq = notes[step % notes.length]
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, nowTime)
      gain.gain.setValueAtTime(0.0001, nowTime)
      gain.gain.exponentialRampToValueAtTime(0.32, nowTime + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, nowTime + 1.45)
      osc.connect(gain); gain.connect(master); osc.start(nowTime); osc.stop(nowTime + 1.5)
      if(step % 3 === 0){
        const drone = ctx.createOscillator(); const dg = ctx.createGain()
        drone.type='triangle'; drone.frequency.value=freq/2; dg.gain.setValueAtTime(0.0001,nowTime); dg.gain.exponentialRampToValueAtTime(0.055,nowTime+.2); dg.gain.exponentialRampToValueAtTime(.0001,nowTime+2.8); drone.connect(dg); dg.connect(master); drone.start(nowTime); drone.stop(nowTime+2.9)
      }
      step++
    }
    ctx.resume().then(playNote).catch(()=>setMusicOn(false))
    musicTimerRef.current = setInterval(playNote, 1550)
    return ()=>{ if(musicTimerRef.current) clearInterval(musicTimerRef.current); ctx.close().catch(()=>{}); musicContextRef.current=null }
  },[musicOn])
  useEffect(()=>{ if(introDone) document.body.classList.add('intro-finished'); return()=>document.body.classList.remove('intro-finished') },[introDone])
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMenuOpen(false) }
  const setResponse = (id,key,value)=>setForm(prev=>({...prev,responses:{...prev.responses,[id]:{...(prev.responses[id]||{}),[key]:value}}}))
  async function submitRsvp(e){
    e.preventDefault(); setRsvpStatus('')
    if(!form.name.trim()){setRsvpStatus('Please add your name so we know who is responding.');return}
    const answers = visibleEvents.map(ev=>({event_id:ev.id,attendance:form.responses[ev.id]?.attendance||'No response',attendees:Number(form.responses[ev.id]?.attendees||1),attendee_names:form.responses[ev.id]?.names||''}))
    if(answers.some(a=>a.attendance==='No response')){setRsvpStatus('Please choose attending or not attending for each function in your invitation.');return}
    if(!supabase){setRsvpStatus('RSVP is in preview mode. The organiser needs to connect Supabase before responses can be securely submitted.');return}
    setRsvpBusy(true)
    const {error}=await supabase.from('wedding_rsvps').insert([{guest_name:form.name.trim(),phone:form.phone.trim()||null,message:form.message.trim()||null,invitation_type:inviteType,responses:answers}])
    setRsvpBusy(false)
    if(error){setRsvpStatus('We could not submit your RSVP right now. Please try again in a moment.');return}
    setRsvpStatus('Thank you! Your response has been received. We look forward to celebrating with you.');
    setForm({name:'',phone:'',message:'',responses:{}})
  }
  const galleries=[{label:'A little forever',tone:'rose',symbol:'♡'},{label:'The engagement',tone:'gold',symbol:'✦'},{label:'Our favourite moments',tone:'blush',symbol:'❋'},{label:'The beginning of always',tone:'wine',symbol:'∞'}]
  const nav=[['story','Our story'],['events','Celebrations'],['venue','The venues'],['gallery','Memories'],['rsvp','RSVP']]
  return <>
    <div className={`intro-screen ${introDone?'intro-hidden':''}`}><Palace/><Petals/><div className="intro-vignette"/><div className="intro-copy"><div className="eyebrow"><span/> A LOVE STORY IN SEVEN CHAPTERS <span/></div><p className="intro-line">Some stories begin with a hello.<br/><em>Ours took a little longer...</em></p><div className="intro-names">ABHISHEK <i>&</i> ANJALI</div><div className="intro-subtitle">FROM A FRIEND REQUEST TO FOREVER</div><button className="begin-btn" onClick={()=>setIntroDone(true)}>Begin our story <ArrowRight size={16}/></button><button className="skip-btn" onClick={()=>{setIntroDone(true);setTimeout(()=>scrollTo('invitation'),80)}}>Skip intro <ArrowDown size={13}/></button></div><div className="intro-bottom">26 — 27 FEBRUARY 2027 <span>✦</span> SURAT, INDIA</div></div>
    <header className="site-header"><a className="brand" href="#top" onClick={e=>{e.preventDefault();scrollTo('top')}}><span>A <i>&</i> A</span><small>26 · 27 FEB 2027</small></a><nav className={menuOpen?'nav-open':''}>{nav.map(([id,label])=><a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();scrollTo(id)}}>{label}</a>)}</nav><div className="header-actions"><button className="music-toggle" onClick={()=>setMusicOn(v=>!v)} aria-label={musicOn?'Turn music off':'Turn music on'}>{musicOn?<Volume2 size={16}/>:<VolumeX size={16}/>}<span>{musicOn?'Music on':'Music off'}</span></button><button className="menu-toggle" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button></div></header>
    <main id="top">
      <section className="hero" id="invitation"><div className="hero-pattern"/><div className="hero-copy"><div className="eyebrow"><span/> THE NEXT CHAPTER BEGINS <span/></div><p className="hero-kicker">A little hesitation. A birthday wish. A lifetime together.</p><h1>Abhishek <i>&</i><br/>Anjali</h1><p className="hero-title">FROM A FRIEND REQUEST TO FOREVER</p><div className="hero-rule"><span>✦</span></div><p className="hero-invite">With the blessings of our families,<br/>we invite you to celebrate our wedding.</p><div className="hero-date">26 <small>&</small> 27 <em>February</em> 2027</div><p className="hero-place">SURAT · GUJARAT</p><button className="discover-btn" onClick={()=>scrollTo('story')}>Discover our story <ArrowDown size={15}/></button></div><div className="hero-side-note">TWO HEARTS · ONE DESTINATION</div><div className="hero-bottom-flower">✿</div></section>
      <section className="story-section section-pad" id="story"><div className="section-heading"><span className="eyebrow">A STORY WORTH THE WAIT</span><h2>It started with a <i>friend request.</i></h2><p>Seven little chapters. One very big yes.</p></div><div className="story-layout"><div className="story-progress"><span>THE STORY</span><div className="progress-track"><i style={{height:`${(storyIndex+1)/story.length*100}%`}}/></div><strong>0{storyIndex+1}</strong><small>OF 07</small></div><div className="story-card" key={storyIndex}><div className="story-card-top"><span>{story[storyIndex].year}</span><span>CHAPTER {story[storyIndex].n}</span></div><div className="story-content"><div className="story-copy"><p className="story-place">{story[storyIndex].place}</p><h3>{story[storyIndex].title}</h3><p>{story[storyIndex].text}</p><div className="story-caption"><Sparkles size={14}/>{story[storyIndex].caption}</div></div><StoryVisual type={story[storyIndex].visual}/></div><div className="story-controls"><button onClick={()=>setStoryIndex(i=>Math.max(0,i-1))} disabled={storyIndex===0} aria-label="Previous chapter"><ArrowLeft/></button><div className="story-dots">{story.map((s,i)=><button key={s.n} className={i===storyIndex?'active':''} onClick={()=>setStoryIndex(i)} aria-label={`Go to chapter ${i+1}`}/>)}</div><button onClick={()=>setStoryIndex(i=>Math.min(story.length-1,i+1))} disabled={storyIndex===story.length-1} aria-label="Next chapter"><ArrowRight/></button></div></div></div><div className="story-endline">And that, dear friends, is how a simple request became <i>forever.</i></div></section>
      <section className="announcement"><div className="announcement-inner"><span className="eyebrow">THE INVITATION</span><div className="ornament">✦　❋　✦</div><h2>Two journeys.<br/><i>One beautiful destination.</i></h2><p>And now, our next chapter begins.<br/>We'd be delighted to have you celebrate it with us!</p><div className="announcement-sign">Abhishek <i>&</i> Anjali</div><span className="announcement-date">26 — 27 FEBRUARY 2027 · SURAT</span></div></section>
      <section className="events-section section-pad" id="events"><div className="section-heading"><span className="eyebrow">SAVE THESE MOMENTS</span><h2>Two days. A lifetime <i>of memories.</i></h2><p>{invite.label} · All timings are Indian Standard Time (IST)</p></div><div className="day-divider"><span>26 FEBRUARY 2027</span><i/><span>ABHISHEK'S DAY</span></div><div className="event-grid">{sectionEvents.filter(e=>e.id==='abhishek-grahsatak'||e.id==='reception').map(e=><EventCard key={e.id} event={e} index={events.indexOf(e)}/>)}</div><div className="day-divider second"><span>27 FEBRUARY 2027</span><i/><span>ANJALI'S DAY</span></div><div className="event-grid">{sectionEvents.filter(e=>e.id==='anjali-grahsatak'||e.id==='marriage').map(e=><EventCard key={e.id} event={e} index={events.indexOf(e)}/>)}</div><p className="event-note"><Flower2 size={16}/> We can't wait to celebrate these special moments with you.</p></section>
      <section className="countdown-section"><div className="countdown-flower">✿</div><span className="eyebrow">THE BIG DAY IS APPROACHING</span><h2>Until <i>forever</i> begins...</h2><div className="countdown-grid">{Object.entries(countdown).map(([label,value])=><div className="count-unit" key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{label}</span></div>)}</div><p>27 February 2027 · 7:00 PM IST</p></section>
      <section className="venue-section section-pad" id="venue"><div className="section-heading"><span className="eyebrow">FIND YOUR WAY TO US</span><h2>Two venues. <i>One celebration.</i></h2><p>We look forward to welcoming you.</p></div><div className="venue-grid"><article className="venue-card"><div className="venue-art venue-art-one"><span>✦</span><div className="venue-arch"/><small>JHINIBA FARM</small></div><div className="venue-info"><span className="eyebrow">26 FEBRUARY 2027</span><h3>Jhiniba Farm</h3><p>Beside Ramji Residency, Jahangirpura, Surat, Gujarat, India.</p><a href={events[0].map} target="_blank" rel="noreferrer" className="venue-link">Open in Google Maps <ArrowRight size={15}/></a></div></article><article className="venue-card"><div className="venue-art venue-art-two"><span>✧</span><div className="venue-arch"/><small>FAROHAR PARTY B PLOT</small></div><div className="venue-info"><span className="eyebrow">27 FEBRUARY 2027</span><h3>Farohar Party B Plot</h3><p>Opposite Pal RTO, Adajan, Surat, Gujarat, India.</p><a href={events[2].map} target="_blank" rel="noreferrer" className="venue-link">Open in Google Maps <ArrowRight size={15}/></a></div></article></div></section>
      <section className="gallery-section section-pad" id="gallery"><div className="section-heading"><span className="eyebrow">LITTLE MOMENTS, BIG MEMORIES</span><h2>Our story, <i>in photographs.</i></h2><p>A few frames from our favourite chapters. More memories coming soon.</p></div><div className="gallery-grid">{galleries.map((g,i)=><button key={g.label} className={`gallery-tile ${g.tone}`} onClick={()=>setGalleryIndex(i)}><span className="gallery-placeholder-icon">{g.symbol}</span><span className="gallery-label">{g.label}</span><span className="gallery-add">PHOTO {String(i+1).padStart(2,'0')} · COMING SOON</span></button>)}</div></section>
      <section className="rsvp-section section-pad" id="rsvp"><div className="rsvp-intro"><span className="eyebrow">KINDLY REPLY</span><h2>Will you join us<br/>for <i>the celebrations?</i></h2><p>Your presence will make our moments even more special. Please let us know which celebrations you can attend.</p><div className="rsvp-seal">WITH LOVE <Heart size={18} fill="currentColor"/> A & A</div></div><form className="rsvp-form" onSubmit={submitRsvp}><div className="form-heading"><span>YOUR RSVP</span><small>{invite.label}</small></div><label className="field-label">Your name <b>*</b><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Enter your full name" required maxLength={100}/></label><label className="field-label">Mobile number <small>(optional)</small><input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="For any event-day updates" inputMode="tel" maxLength={20}/></label><div className="function-choices"><p className="field-label">Please respond for each function <b>*</b></p>{visibleEvents.map(ev=><div className="function-choice" key={ev.id}><div className="function-choice-title"><span>{ev.title}</span><small>{ev.date} · {ev.time}</small></div><div className="attendance-options"><label><input type="radio" name={`${ev.id}-attendance`} checked={form.responses[ev.id]?.attendance==='Attending'} onChange={()=>setResponse(ev.id,'attendance','Attending')}/> <span>Attending</span></label><label><input type="radio" name={`${ev.id}-attendance`} checked={form.responses[ev.id]?.attendance==='Not attending'} onChange={()=>setResponse(ev.id,'attendance','Not attending')}/> <span>Not attending</span></label></div>{form.responses[ev.id]?.attendance==='Attending'&&<div className="guest-fields"><label>Number of attendees<select value={form.responses[ev.id]?.attendees||1} onChange={e=>setResponse(ev.id,'attendees',e.target.value)}>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n}</option>)}</select></label><label>Accompanying names <small>(if applicable)</small><input value={form.responses[ev.id]?.names||''} onChange={e=>setResponse(ev.id,'names',e.target.value)} placeholder="Names of other attendees" maxLength={250}/></label></div>}</div>)}</div><label className="field-label">A note for us <small>(optional)</small><textarea value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Leave us a little message..." rows="3" maxLength={500}/></label><button className="submit-rsvp" disabled={rsvpBusy}>{rsvpBusy?'Sending your response...':'Send our RSVP'} <Send size={16}/></button>{rsvpStatus&&<p className={`rsvp-feedback ${rsvpStatus.startsWith('Thank')?'success':''}`} role="status">{rsvpStatus}</p>}<p className="privacy-note">Your response is shared privately with the wedding organisers.</p></form></section>
      <footer className="site-footer"><div className="footer-flower">❋</div><span className="eyebrow">THE BEGINNING OF ALWAYS</span><h2>We saved you <i>a place.</i></h2><p>With love, laughter and grateful hearts,<br/>we can't wait to celebrate with you.</p><div className="footer-names">Abhishek <i>&</i> Anjali</div><div className="footer-bottom"><span>26 — 27 FEBRUARY 2027 · SURAT</span><span>MADE WITH ♡</span></div></footer>
    </main>
    <button className="floating-music" onClick={()=>setMusicOn(v=>!v)} aria-label={musicOn?'Mute music':'Play music'}>{musicOn?<Volume2 size={18}/>:<Music2 size={18}/>}</button>
    {galleryIndex!==null&&<div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo gallery preview" onClick={()=>setGalleryIndex(null)}><button className="lightbox-close" onClick={()=>setGalleryIndex(null)} aria-label="Close gallery"><X/></button><button className="lightbox-arrow left" onClick={e=>{e.stopPropagation();setGalleryIndex(i=>(i+galleries.length-1)%galleries.length)}} aria-label="Previous photo"><ArrowLeft/></button><div className={`lightbox-card ${galleries[galleryIndex].tone}`} onClick={e=>e.stopPropagation()}><span>{galleries[galleryIndex].symbol}</span><h3>{galleries[galleryIndex].label}</h3><p>Our photographs will be added here soon.</p></div><button className="lightbox-arrow right" onClick={e=>{e.stopPropagation();setGalleryIndex(i=>(i+1)%galleries.length)}} aria-label="Next photo"><ArrowRight/></button></div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
