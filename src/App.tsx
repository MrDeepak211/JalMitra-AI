import { useEffect, useMemo, useState } from 'react'
import {
  Activity, Bell, CalendarDays, ChevronDown, CloudSun, Droplets, Gauge,
  Leaf, MapPin, Menu, Settings2, ShieldCheck, Sprout, Wifi, Languages,
  CircleHelp, ArrowUpRight, AlertTriangle, Clock3, ThermometerSun
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Language = 'EN' | 'मराठी'
type Tab = 'Overview' | 'My Fields' | 'Water Schedule' | 'Device Health'
type ApiHealth = { ok: boolean; service?: string; mode?: string }

const demoMoisture = [
  { time: '06 AM', moisture: 42 }, { time: '08 AM', moisture: 39 },
  { time: '10 AM', moisture: 36 }, { time: '12 PM', moisture: 33 },
  { time: '02 PM', moisture: 31 }, { time: '04 PM', moisture: 34 },
  { time: '06 PM', moisture: 35 },
]
const demoSchedule = [
  { time: '06:00–07:00', farmer: 'Farmer A', plot: 'North field', status: 'Completed' },
  { time: '07:00–08:00', farmer: 'Farmer B', plot: 'Well-side plot', status: 'Completed' },
  { time: '08:00–09:00', farmer: 'Your turn', plot: 'Plot JM-01', status: 'Upcoming' },
  { time: '09:00–10:00', farmer: 'Farmer C', plot: 'East field', status: 'Planned' },
]
const copy = {
  EN: {
    eyebrow: 'COMMUNITY WATER INTELLIGENCE', title: 'Good morning, Deepak',
    subtitle: 'A clearer view of your field. A smarter way to plan water.',
    overview: 'Overview', fields: 'My Fields', schedule: 'Water Schedule', devices: 'Device Health',
    moisture: 'Soil moisture', temperature: 'Air temperature', rainfall: 'Rainfall forecast',
    advisory: 'Today’s field advisory', review: 'Illustrative demo reading',
    recommendation: 'Recheck before irrigating',
    recommendationText: 'The demo moisture reading is near the configured watch band. Check the root zone and local conditions before deciding. This is not a live sensor reading.',
    reason: 'WHY THIS ADVISORY', reasonText: 'Moisture trend + no verified live rainfall feed + crop-stage threshold not yet configured.',
    water: 'Shared water schedule', today: 'Today · Community group A',
    view: 'View full schedule', trend: 'Moisture trend',
    demo: 'DEMO DATA — NOT CONNECTED TO LIVE SENSORS',
    active: 'Sensor node status', connected: 'Simulation mode',
    location: 'Parbhani, Maharashtra', help: 'Need help?', profile: 'Farmer workspace',
  },
  'मराठी': {
    eyebrow: 'समुदाय जल व्यवस्थापन', title: 'शुभ सकाळ, दीपक',
    subtitle: 'शेताची स्पष्ट माहिती. पाण्याचे नियोजन अधिक समजूतदारपणे.',
    overview: 'आढावा', fields: 'माझी शेते', schedule: 'पाणी वेळापत्रक', devices: 'उपकरण स्थिती',
    moisture: 'जमिनीतील ओलावा', temperature: 'हवेचे तापमान', rainfall: 'पावसाचा अंदाज',
    advisory: 'आजचा शेती सल्ला', review: 'प्रात्यक्षिकातील नमुना माहिती',
    recommendation: 'पाणी देण्यापूर्वी पुन्हा तपासा',
    recommendationText: 'नमुना ओलावा मोजमाप लक्ष देण्याच्या मर्यादेजवळ आहे. निर्णय घेण्यापूर्वी मुळांच्या भागातील ओलावा आणि स्थानिक परिस्थिती तपासा. हे प्रत्यक्ष सेन्सर मोजमाप नाही.',
    reason: 'या सल्ल्याचे कारण', reasonText: 'ओलाव्याचा कल + प्रत्यक्ष पावसाची माहिती जोडलेली नाही + पिकाच्या अवस्थेची मर्यादा अजून निश्चित नाही.',
    water: 'सामायिक पाणी वेळापत्रक', today: 'आज · समुदाय गट अ',
    view: 'पूर्ण वेळापत्रक पहा', trend: 'ओलाव्यातील बदल',
    demo: 'प्रात्यक्षिक माहिती — प्रत्यक्ष सेन्सर जोडलेले नाहीत',
    active: 'सेन्सर नोड स्थिती', connected: 'सिम्युलेशन मोड',
    location: 'परभणी, महाराष्ट्र', help: 'मदत हवी आहे?', profile: 'शेतकरी कार्यक्षेत्र',
  },
}

export default function App() {
  const [language, setLanguage] = useState<Language>('EN')
  const [tab, setTab] = useState<Tab>('Overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null)
  const [readingCount, setReadingCount] = useState<number | null>(null)
  const [apiError, setApiError] = useState('')
  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')
  useEffect(() => {
    let active = true
    const checkApi = async () => {
      try {
        const results = await Promise.all([fetch(apiBase + '/api/health'), fetch(apiBase + '/api/readings')])
        if (!results[0].ok || !results[1].ok) throw new Error('API error')
        const health = await results[0].json() as ApiHealth
        const readings = await results[1].json() as { count?: number }
        if (active) {
          setApiHealth(health)
          setReadingCount(typeof readings.count === 'number' ? readings.count : 0)
          setApiError('')
        }
      } catch {
        if (active) { setApiHealth(null); setReadingCount(null); setApiError('API unavailable — start backend with npm run api') }
      }
    }
    void checkApi()
    const timer = window.setInterval(checkApi, 30000)
    return () => { active = false; window.clearInterval(timer) }
  }, [apiBase])
  const t = copy[language]
  const nav: Tab[] = ['Overview', 'My Fields', 'Water Schedule', 'Device Health']
  const chartData = useMemo(() => demoMoisture, [])

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Droplets size={23}/></div><div><strong>jalmitra<span>AI</span></strong><small>FIELD INTELLIGENCE</small></div></div>
      <div className="workspace-label">PILOT WORKSPACE</div>
      <div className="location-chip"><MapPin size={14}/>{t.location}<ChevronDown size={14}/></div>
      <nav>{nav.map((item,i)=>{const Icon=[Gauge,Sprout,CalendarDays,Activity][i];const label=item==='Overview'?t.overview:item==='My Fields'?t.fields:item==='Water Schedule'?t.schedule:t.devices;return <button key={item} className={`nav-item ${tab===item?'active':''}`} onClick={()=>{setTab(item);setMenuOpen(false)}}><Icon size={18}/><span>{label}</span>{item==='Water Schedule'&&<i className="nav-dot"/>}</button>})}</nav>
      <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={18}/><div><b>{t.help}</b><small>JalMitra support</small></div><ArrowUpRight size={15}/></div><div className="user-row"><div className="avatar">DT</div><div><b>Deepak Tandale</b><small>{t.profile}</small></div><Settings2 size={17}/></div></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <button className="mobile-menu icon-btn" onClick={()=>setMenuOpen(!menuOpen)}><Menu size={20}/></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{tab}</b></div>
        <div className="top-actions"><div className="live-pill"><span/> DEMO ENVIRONMENT</div><button className="language-btn" onClick={()=>setLanguage(language==='EN'?'मराठी':'EN')}><Languages size={16}/>{language}</button><button className="icon-btn" aria-label="Notifications"><Bell size={18}/></button></div>
      </header>
      <section className="page">
        <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</div><h1>{t.title}<span className="sun">✳</span></h1><p>{t.subtitle}</p></div><div className="date-card"><CalendarDays size={17}/><div><small>FIELD REPORT</small><b>Prototype preview</b></div></div></div>
        <div className="demo-banner"><AlertTriangle size={16}/><span>{t.demo}</span><b>Prototype preview</b></div>
        {tab==='Overview'&&<>
          <div className="metric-grid">
            <Metric icon={<Droplets/>} label={t.moisture} value="34" unit="%" note="Illustrative only" tone="green"/>
            <Metric icon={<ThermometerSun/>} label={t.temperature} value="29" unit="°C" note="Demo value" tone="orange"/>
            <Metric icon={<CloudSun/>} label={t.rainfall} value="—" unit="" note="Weather API not connected" tone="blue"/>
            <Metric icon={<Wifi/>} label={t.active} value="SIM" unit="" note={t.connected} tone="violet"/>
          </div>
          <div className="content-grid">
            <section className="panel chart-panel"><div className="panel-head"><div><div className="section-kicker">FIELD JM-01 · DEMO SERIES</div><h2>{t.trend}</h2></div><button className="period-btn">Today <ChevronDown size={14}/></button></div><div className="chart-legend"><span/><b>{t.moisture}</b><small>Illustrative percentage</small></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:8,left:-20,bottom:0}}><defs><linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a9b72" stopOpacity={.25}/><stop offset="100%" stopColor="#4a9b72" stopOpacity={.015}/></linearGradient></defs><CartesianGrid stroke="#edf1ed" vertical={false}/><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill:'#8b978f',fontSize:11}}/><YAxis domain={[0,60]} axisLine={false} tickLine={false} tick={{fill:'#8b978f',fontSize:11}}/><Tooltip contentStyle={{borderRadius:12,border:'1px solid #e5ebe5',fontSize:12}}/><Area type="monotone" dataKey="moisture" stroke="#36845d" strokeWidth={2.5} fill="url(#moistureFill)"/></AreaChart></ResponsiveContainer></div><div className="chart-foot"><span><i/> Demo samples only</span><span>Sensor calibration pending</span></div></section>
            <section className="advisory-card"><div className="advisory-top"><div className="advisory-icon"><Leaf size={20}/></div><span>Illustrative demo reading</span></div><div className="advisory-label">{t.advisory}</div><h2>{t.recommendation}</h2><p>{t.recommendationText}</p><div className="reason-box"><b>{t.reason}</b><span>{t.reasonText}</span></div><div className="advisory-bottom"><ShieldCheck size={15}/> Farmer makes the final decision</div></section>
          </div>
          <section className="panel schedule-panel"><div className="panel-head"><div><div className="section-kicker">COMMUNITY COORDINATION</div><h2>{t.water}</h2><p>{t.today}</p></div><button className="text-link" onClick={()=>setTab('Water Schedule')}>{t.view}<ArrowUpRight size={15}/></button></div><div className="schedule-list">{demoSchedule.slice(0,3).map((slot,i)=><div className="schedule-row" key={slot.time}><div className="time-col"><Clock3 size={15}/>{slot.time}</div><div className={`schedule-dot dot-${i}`}/><div className="schedule-person"><b>{slot.farmer}</b><small>{slot.plot}</small></div><span className={`status status-${slot.status.toLowerCase().replace(' ','-')}`}>{slot.status}</span></div>)}</div></section>
        </>}
        {tab==='My Fields'&&<section className="panel inner-panel"><div className="section-kicker">FIELD REGISTER · DEMO</div><h2>My fields</h2><div className="field-card"><div className="field-icon"><Sprout/></div><div><b>Plot JM-01 · North field</b><p>Crop and soil profile not yet configured</p><small>Sensor: demo series only · Installation pending</small></div><span className="status status-planned">Setup pending</span></div><div className="notice"><AlertTriangle size={16}/> Add verified crop, soil type, sowing date and sensor installation details before enabling recommendations.</div></section>}
        {tab==='Water Schedule'&&<section className="panel inner-panel"><div className="section-kicker">COMMUNITY COORDINATION · DEMO</div><h2>Shared water schedule</h2><p className="muted">Illustrative schedule only. It is not a confirmed village allocation.</p><div className="schedule-list full">{demoSchedule.map((slot,i)=><div className="schedule-row" key={slot.time}><div className="time-col"><Clock3 size={15}/>{slot.time}</div><div className={`schedule-dot dot-${i%3}`}/><div className="schedule-person"><b>{slot.farmer}</b><small>{slot.plot}</small></div><span className={`status status-${slot.status.toLowerCase().replace(' ','-')}`}>{slot.status}</span></div>)}</div></section>}
        {tab==='Device Health'&&<section className="panel inner-panel"><div className="section-kicker">DEVICE CONNECTIVITY</div><h2>Sensor node health</h2><div className="device-state"><div className="device-icon"><Activity/></div><div><b>JalMitra API</b><p>{apiHealth ? 'Reachable · ' + (apiHealth.mode || 'prototype') + ' mode' : apiError || 'Checking API connection…'}</p></div><span className={`status ${apiHealth ? '' : 'status-planned'}`}>{apiHealth ? 'Online' : 'Offline'}</span></div><div className="device-grid"><div><small>API service</small><b>{apiHealth?.service || 'Not detected'}</b></div><div><small>Stored readings</small><b>{readingCount === null ? '—' : readingCount}</b></div><div><small>ESP32 hardware</small><b>Not connected</b></div></div><div className="notice"><AlertTriangle size={16}/> API readings are held in temporary memory. No physical sensor is connected yet; raw ADC values must be calibrated for the actual soil before use.</div></section>}
        <footer className="footer"><span>JALMITRA AI <i/> SEVA FIRST INNOVATION CHALLENGE 2026</span><span>Prototype v0.1.0 · Demo data is not live field information</span></footer>
      </section>
    </main>
  </div>
}
function Metric({icon,label,value,unit,note,tone}:{icon:React.ReactNode,label:string,value:string,unit:string,note:string,tone:string}){return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}<small>{unit}</small></div><div className="metric-note">{note}</div></div>}
