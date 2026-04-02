import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ── DATA ─────────────────────────────────────────────────────────────
const PHASES = [
  { id:"menstrual",  label:"Menstrual",  days:"Day 1–5",   color:"#c97b7b", emoji:"🌑", tip:"Rest, warmth & iron-rich foods. Your body is doing sacred work." },
  { id:"follicular", label:"Follicular", days:"Day 6–13",  color:"#d4a96a", emoji:"🌒", tip:"Energy rises. Great time to start new projects & socialize." },
  { id:"ovulation",  label:"Ovulation",  days:"Day 14–16", color:"#e8c84a", emoji:"🌕", tip:"Peak confidence & magnetism. Lean into connection & creativity." },
  { id:"luteal",     label:"Luteal",     days:"Day 17–28", color:"#8b9ec7", emoji:"🌘", tip:"Turn inward. Honor your need for quiet & nourishment." },
];

const EMOTIONS = [
  { id:"joyful",      label:"Joyful",      emoji:"✨", color:"#e8c84a" },
  { id:"calm",        label:"Calm",        emoji:"🌿", color:"#8ec9a2" },
  { id:"anxious",     label:"Anxious",     emoji:"🌀", color:"#8b9ec7" },
  { id:"sad",         label:"Sad",         emoji:"🌧", color:"#7aa8c4" },
  { id:"angry",       label:"Angry",       emoji:"🔥", color:"#c97b7b" },
  { id:"tired",       label:"Tired",       emoji:"🌙", color:"#a48fc4" },
  { id:"grateful",    label:"Grateful",    emoji:"💛", color:"#d4c46a" },
  { id:"overwhelmed", label:"Overwhelmed", emoji:"🌊", color:"#6aadcc" },
  { id:"confident",   label:"Confident",   emoji:"👑", color:"#c9a05a" },
  { id:"romantic",    label:"Romantic",    emoji:"🌹", color:"#d47a9a" },
  { id:"creative",    label:"Creative",    emoji:"🎨", color:"#9a7ac4" },
  { id:"hopeful",     label:"Hopeful",     emoji:"🌤", color:"#7ab8c9" },
];

const TABS = [
  { id:"home",    label:"Home",    icon:"◈" },
  { id:"cycle",   label:"Cycle",   icon:"◎" },
  { id:"mood",    label:"Mood",    icon:"◇" },
  { id:"chat",    label:"Bloom",   icon:"◉" },
  { id:"care",    label:"Care",    icon:"✦" },
  { id:"explore", label:"Explore", icon:"❋" },
];

const AFFIRMATIONS = {
  menstrual: ["I honor my body's wisdom and give myself full permission to rest.", "My softness is not weakness — it is sacred power.", "I release what no longer serves me, with love and grace."],
  follicular: ["I am blooming into my fullest, most radiant self.", "New beginnings are my birthright. I step forward with joy.", "My mind is sharp, my heart is open, my path is clear."],
  ovulation: ["I radiate warmth, creativity, and magnetic energy.", "My voice carries power. I speak my truth with love.", "Connection flows to me effortlessly. I am magnetic."],
  luteal: ["My sensitivity is a gift. I nurture myself with deep compassion.", "I am allowed to slow down. Rest is productive.", "I trust the quiet wisdom that arises in stillness."],
};

const FUN_FACTS = [
  { emoji:"🧠", title:"Your Brain on Estrogen", fact:"Estrogen boosts serotonin, your 'feel-good' neurotransmitter. This is why the follicular phase often feels mentally clearer and more optimistic — your brain chemistry literally changes!", category:"mind" },
  { emoji:"💪", title:"Cycle Syncing Workouts", fact:"During ovulation, your pain tolerance is actually higher, meaning you can push harder in workouts. Many athletes unknowingly perform their personal bests during this phase!", category:"body" },
  { emoji:"🌸", title:"Skin & Your Cycle", fact:"Skin is oiliest just before your period due to progesterone, but plumpest and most hydrated around ovulation thanks to peak estrogen — that literal 'glow' is real!", category:"skin" },
  { emoji:"🌙", title:"The Moon Connection", fact:"The average menstrual cycle is 28–29 days — almost identical to the lunar cycle. Many ancient cultures considered menstruation and the moon deeply connected.", category:"spirit" },
  { emoji:"🍫", title:"Why You Crave Chocolate", fact:"Before your period, magnesium levels drop — and dark chocolate is rich in magnesium. Your body's cravings are often incredibly intelligent signals!", category:"nutrition" },
  { emoji:"💤", title:"Sleep & Progesterone", fact:"Progesterone in the luteal phase has sedative properties, which is why you feel sleepier before your period. Your body is asking for more rest — listen to it!", category:"mind" },
  { emoji:"🎭", title:"The Empathy Surge", fact:"Around ovulation, the brain's mirror neuron system becomes more active, making you naturally more empathetic, communicative, and socially tuned-in.", category:"mind" },
  { emoji:"🌺", title:"Your Uterus is Mighty", fact:"The uterus can expand to 500 times its normal size during pregnancy — and return to original size within weeks. It's one of the strongest muscles in the human body.", category:"body" },
  { emoji:"🔬", title:"Cycle & Immunity", fact:"Immunity fluctuates with your cycle. You're more immune-resilient around ovulation (to protect potential pregnancy) and more vulnerable just before menstruation.", category:"body" },
  { emoji:"🎵", title:"Your Voice Changes", fact:"Studies show women's voices shift subtly throughout the cycle — rated as more attractive by listeners during ovulation due to hormonal influences on vocal cords!", category:"mind" },
  { emoji:"🌿", title:"Gut & Hormones", fact:"Your gut microbiome directly affects estrogen metabolism. A healthy gut = better hormone balance. Eating fermented foods can genuinely help PMS symptoms.", category:"nutrition" },
  { emoji:"✨", title:"Intuition Peaks", fact:"During the luteal phase, your right brain (intuitive, emotional) becomes more dominant. The 'PMS irritability' you feel is often deep, accurate knowing — not irrationality.", category:"spirit" },
];

const SLEEP_TIPS = [
  { phase:"menstrual",  tip:"Use a heating pad to ease cramps before bed. Magnesium glycinate can improve sleep quality. Sleep 8–9 hours if possible — this is your rest phase." },
  { phase:"follicular", tip:"Your sleep is lighter and more refreshing now. Try morning workouts to harness rising energy. Avoid late-night screens to preserve your natural rhythm." },
  { phase:"ovulation",  tip:"You may need slightly less sleep. Body temperature rises — keep your room cool. You're social and energized, but still protect your sleep window." },
  { phase:"luteal",     tip:"Progesterone makes you sleepier. Don't fight it — allow early bedtimes. Cut caffeine after noon. Consider a calming ritual: lavender, journaling, light stretching." },
];

const RECIPES = [
  { phase:"menstrual",  name:"Iron Moon Soup 🍲", ingredients:["Lentils","Spinach","Turmeric","Ginger","Bone broth","Coconut milk"], benefit:"Replenishes iron, reduces inflammation, soothes cramps." },
  { phase:"follicular", name:"Spring Renewal Bowl 🥗", ingredients:["Quinoa","Roasted beets","Avocado","Pumpkin seeds","Lemon tahini"], benefit:"Supports liver detox, boosts energy, feeds hormone production." },
  { phase:"ovulation",  name:"Golden Glow Smoothie ✨", ingredients:["Mango","Pineapple","Coconut water","Turmeric","Collagen powder","Chia seeds"], benefit:"Anti-inflammatory, glowing skin, hydration boost." },
  { phase:"luteal",     name:"Comfort Cacao Bowl 🍫", ingredients:["Oats","Dark cacao","Banana","Almond butter","Hemp seeds","Cinnamon"], benefit:"Magnesium-rich to ease PMS, stabilizes blood sugar, boosts serotonin." },
];

const MEDITATIONS = [
  { phase:"menstrual",  name:"Rest & Release", duration:"10 min", desc:"A guided body scan to honor your shedding and invite deep restoration." },
  { phase:"follicular", name:"New Moon Intentions", duration:"8 min", desc:"Visualization for planting seeds and welcoming new energy into your life." },
  { phase:"ovulation",  name:"Heart Opening", duration:"7 min", desc:"Open your heart chakra and radiate warmth. Perfect for connection and creativity." },
  { phase:"luteal",     name:"Inner Sanctuary", duration:"12 min", desc:"Turning inward with compassion. A meditation for the wise woman within." },
];

const CARE_DATA = [
  { id:"skin", icon:"✿", title:"Skincare", items:{
    menstrual:"Use gentle, fragrance-free cleansers. Skin is extra sensitive — add a hydrating sheet mask and skip active ingredients.",
    follicular:"Introduce exfoliation and Vitamin C serum. Your skin is renewing and ready to absorb brightening actives.",
    ovulation:"Keep pores clear with salicylic toner. You're glowing naturally — light coverage only.",
    luteal:"Watch for breakouts. Use niacinamide to balance oil. Avoid heavy, pore-clogging products."
  }},
  { id:"body", icon:"◈", title:"Movement", items:{
    menstrual:"Gentle yoga, walking, or rest. Honor your body's signal to slow down and restore.",
    follicular:"Perfect for strength training — estrogen supports muscle recovery. Try something new and challenging!",
    ovulation:"HIIT, dancing, group workouts. Your endurance and pain tolerance peak now.",
    luteal:"Pilates, swimming, or long walks. Avoid overtraining — progesterone raises body temperature."
  }},
  { id:"food", icon:"❁", title:"Nourishment", items:{
    menstrual:"Iron-rich foods: spinach, lentils, dark chocolate. Warm soups, herbal teas, avoid cold foods.",
    follicular:"Fermented foods for gut health. Lighter proteins like fish and eggs fuel your rising energy.",
    ovulation:"Raw veggies & fiber support estrogen metabolism. Stay hydrated — you're at your peak!",
    luteal:"Complex carbs stabilize mood. Magnesium (dark greens, seeds) reduces bloating and cravings."
  }},
  { id:"spirit", icon:"✦", title:"Spirit & Mind", items:{
    menstrual:"Journal, rest, dream. This phase is deeply intuitive — listen inward and honor solitude.",
    follicular:"Set intentions and visualize goals. Your mind is sharp, optimistic and ready for new chapters.",
    ovulation:"Express yourself — write, create, connect. Your voice carries deep power and magnetism.",
    luteal:"Practice boundary-setting and self-compassion. Meditation and breathwork are deeply healing now."
  }},
];

// ── HELPERS ───────────────────────────────────────────────────────────
const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function BloomApp() {
  // Auth state
  const [screen, setScreen] = useState("splash"); // splash | login | register | app
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // App state
  const [tab, setTab] = useState("home");
  const [phase, setPhase] = useState("follicular");
  const [cycleDay, setCycleDay] = useState(8);
  const [todayMood, setTodayMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodLog, setMoodLog] = useState([]);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hi beautiful 🌸 I'm Bloom — your personal wellness companion. I'm here for all of it: the hard days, the good ones, your questions, your feelings. What's on your heart today?" }
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [sleepRating, setSleepRating] = useState(0);
  const [sleepLog, setSleepLog] = useState([]);
  const [waterCount, setWaterCount] = useState(0);
  const [gratList, setGratList] = useState(["","",""]);
  const [gratSaved, setGratSaved] = useState([]);
  const [showAffirm, setShowAffirm] = useState(0);
  const chatEndRef = useRef(null);

  const ph = PHASES.find(p => p.id === phase);

  useEffect(() => {
    setTimeout(() => setScreen("login"), 1800);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  useEffect(() => {
    const d = storage.get("bloom_user");
    if (d?.loggedIn) {
      setUserName(d.name || "");
      loadUserData(d.email);
      setScreen("app");
    }
  }, []);

  const loadUserData = (email) => {
    const d = storage.get(`bloom_data_${email}`);
    if (!d) return;
    if (d.phase) setPhase(d.phase);
    if (d.cycleDay) setCycleDay(d.cycleDay);
    if (d.moodLog) setMoodLog(d.moodLog);
    if (d.sleepLog) setSleepLog(d.sleepLog);
    if (d.gratSaved) setGratSaved(d.gratSaved);
  };

  const saveData = (updates) => {
    const u = storage.get("bloom_user");
    if (!u?.email) return;
    const existing = storage.get(`bloom_data_${u.email}`) || {};
    storage.set(`bloom_data_${u.email}`, { ...existing, ...updates });
  };

  const handleAuth = () => {
    setAuthError("");
    if (!authEmail || !authPass) { setAuthError("Please fill in all fields."); return; }
    if (authMode === "register") {
      if (!authName) { setAuthError("Please enter your name."); return; }
      const existing = storage.get(`bloom_acct_${authEmail}`);
      if (existing) { setAuthError("An account with this email already exists."); return; }
      storage.set(`bloom_acct_${authEmail}`, { name: authName, password: authPass, email: authEmail });
      storage.set("bloom_user", { loggedIn: true, email: authEmail, name: authName });
      setUserName(authName);
      setScreen("app");
    } else {
      const acct = storage.get(`bloom_acct_${authEmail}`);
      if (!acct || acct.password !== authPass) { setAuthError("Incorrect email or password."); return; }
      storage.set("bloom_user", { loggedIn: true, email: authEmail, name: acct.name });
      setUserName(acct.name);
      loadUserData(authEmail);
      setScreen("app");
    }
  };

  const logout = () => {
    storage.set("bloom_user", { loggedIn: false });
    setScreen("login");
    setAuthEmail(""); setAuthPass(""); setAuthName("");
    setMoodLog([]); setGratSaved([]); setSleepLog([]);
  };

  const logMood = () => {
    if (!todayMood) return;
    const entry = { mood:todayMood, note:moodNote, date:new Date().toLocaleDateString(), phase };
    const updated = [entry, ...moodLog.slice(0, 49)];
    setMoodLog(updated); saveData({ moodLog: updated });
    setMoodNote(""); setTodayMood(null);
  };

  const logSleep = () => {
    if (!sleepRating) return;
    const entry = { rating:sleepRating, date:new Date().toLocaleDateString(), phase };
    const updated = [entry, ...sleepLog.slice(0, 29)];
    setSleepLog(updated); saveData({ sleepLog: updated });
    setSleepRating(0);
  };

  const saveGrat = () => {
    const items = gratList.filter(g => g.trim());
    if (!items.length) return;
    const entry = { items, date:new Date().toLocaleDateString() };
    const updated = [entry, ...gratSaved.slice(0, 19)];
    setGratSaved(updated); saveData({ gratSaved: updated });
    setGratList(["","",""]);
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = { role:"user", content:input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(""); setChatLoading(true);
    const systemPrompt = `You are Bloom, a warm, wise, deeply caring wellness companion for women. You combine the warmth of a best friend, the wisdom of a holistic health coach, the gentleness of a therapist, and the grounded insight of a spiritual guide.
The user's name is ${userName || "darling"}. They are currently in their ${phase} phase (${ph?.days}). Their last logged mood was ${moodLog[0]?.mood || "unknown"}.
Your role: Offer emotional support with genuine empathy and no judgment. Give practical cycle-aware wellness advice (skincare, nutrition, movement, rest). Share spiritual and mindfulness insights. Affirm her worth and inner knowing. Keep responses warm, personal, and concise (3–5 sentences unless she needs more). Never be clinical or cold.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:systemPrompt, messages:newMsgs }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text||"").join("") || "I'm here with you. 💛";
      setMessages([...newMsgs, { role:"assistant", content:reply }]);
    } catch { setMessages([...newMsgs, { role:"assistant", content:"Something interrupted us — but I'm still here. Try again? 💛" }]); }
    setChatLoading(false);
  };

  // ── SCREENS ───────────────────────────────────────────────────────
  if (screen === "splash") return <SplashScreen />;
  if (screen === "login") return (
    <AuthScreen
      mode={authMode} setMode={setAuthMode}
      email={authEmail} setEmail={setAuthEmail}
      pass={authPass} setPass={setAuthPass}
      name={authName} setName={setAuthName}
      error={authError} onSubmit={handleAuth}
    />
  );

  const affirmations = AFFIRMATIONS[phase] || [];

  return (
    <div style={{ minHeight:"100vh", background:"#faf7f4", fontFamily:"'DM Sans', sans-serif", color:"#2d2420", maxWidth:480, margin:"0 auto", position:"relative", paddingBottom:90 }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#d4b8a8; border-radius:2px; }
        .serif { font-family:'Cormorant Garamond', serif; }
        .tab-bar { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:rgba(250,247,244,0.97); backdrop-filter:blur(16px); border-top:1px solid #ede8e3; display:flex; justify-content:space-around; padding:10px 0 16px; z-index:100; }
        .tab-btn { background:none; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:3px; font-family:'DM Sans',sans-serif; font-size:0.6rem; color:#b0a090; transition:color 0.2s; padding:4px 6px; letter-spacing:0.06em; text-transform:uppercase; }
        .tab-btn.active { color:#c97b7b; }
        .card { background:white; border-radius:16px; padding:20px; margin-bottom:14px; box-shadow:0 2px 14px rgba(0,0,0,0.04); }
        .pill { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; font-size:0.75rem; font-weight:500; letter-spacing:0.04em; }
        .btn-rose { background:#c97b7b; color:white; border:none; border-radius:10px; padding:12px; font-family:'DM Sans',sans-serif; font-size:0.88rem; cursor:pointer; font-weight:500; transition:all 0.2s; width:100%; }
        .btn-rose:hover { background:#b86868; transform:translateY(-1px); }
        .emotion-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .emotion-btn { background:none; border:1.5px solid #ede8e3; border-radius:12px; padding:10px 4px; cursor:pointer; transition:all 0.2s; display:flex; flex-direction:column; align-items:center; gap:4px; font-family:'DM Sans',sans-serif; font-size:0.68rem; color:#7a6a60; }
        .emotion-btn:hover { transform:translateY(-2px); border-color:#d4b8a8; }
        .emotion-btn.sel { border-color:currentColor; background:rgba(0,0,0,0.02); }
        .chat-bubble { max-width:82%; padding:12px 16px; border-radius:18px; font-size:0.88rem; line-height:1.65; margin-bottom:10px; }
        .chat-bubble.user { background:#c97b7b; color:white; border-bottom-right-radius:4px; margin-left:auto; }
        .chat-bubble.assistant { background:white; color:#2d2420; border-bottom-left-radius:4px; margin-right:auto; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .fact-card { background:linear-gradient(135deg,#fdf0ed,#f8f0fb); border-radius:16px; padding:22px; margin-bottom:14px; border:1px solid #f0e0e8; }
        .sleep-star { font-size:1.6rem; cursor:pointer; transition:transform 0.15s; }
        .sleep-star:hover { transform:scale(1.2); }
        .water-btn { width:44px; height:44px; border-radius:50%; border:2px solid #7ab8c9; background:none; font-size:1.1rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
        .water-btn.filled { background:#7ab8c9; border-color:#7ab8c9; }
        .grat-input { width:100%; border:1.5px solid #ede8e3; border-radius:10px; padding:10px 14px; font-family:'DM Sans',sans-serif; font-size:0.88rem; color:#2d2420; outline:none; background:#faf7f4; transition:border-color 0.2s; }
        .grat-input:focus { border-color:#c97b7b; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation:fadeIn 0.45s ease forwards; }
        .dot-loader span { display:inline-block; width:6px; height:6px; background:#c97b7b; border-radius:50%; margin:0 2px; animation:dotB 1s ease-in-out infinite; }
        .dot-loader span:nth-child(2){animation-delay:.15s}.dot-loader span:nth-child(3){animation-delay:.3s}
        @keyframes dotB { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        .section-title { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:300; margin-bottom:4px; }
        .section-sub { font-size:0.78rem; color:#b0a090; margin-bottom:20px; }
        .phase-block { border-radius:12px; padding:12px 8px; cursor:pointer; border:2px solid transparent; transition:all 0.2s; text-align:center; background:#faf7f4; }
        .phase-block.active { border-color:currentColor; background:white; }
        .recipe-card { background:linear-gradient(135deg,#fffaf5,#fff5f8); border-radius:14px; padding:18px; margin-bottom:12px; border:1px solid #f0e8e0; }
        .med-card { background:linear-gradient(135deg,#f5f0ff,#fff5f8); border-radius:14px; padding:18px; margin-bottom:12px; border:1px solid #e8e0f0; display:flex; gap:14px; align-items:center; }
        .affirmation-dot { width:8px; height:8px; border-radius:50%; background:#c97b7b; cursor:pointer; transition:all 0.2s; }
        .affirmation-dot.active { width:20px; border-radius:4px; }
      `}</style>

      {/* ── HOME ── */}
      {tab==="home" && (
        <div className="fade-in" style={{padding:"28px 16px 0"}}>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
            <div>
              <p style={{fontSize:"0.72rem",color:"#b0a090",letterSpacing:"0.12em",textTransform:"uppercase"}}>Welcome back,</p>
              <h1 className="serif" style={{fontSize:"2.1rem",fontWeight:300,marginTop:2}}>{userName} 🌸</h1>
            </div>
            <button onClick={logout} style={{background:"none",border:"1px solid #ede8e3",borderRadius:8,padding:"6px 12px",fontSize:"0.72rem",color:"#b0a090",cursor:"pointer",marginTop:4}}>Sign out</button>
          </div>

          {/* Phase banner */}
          <div className="card" style={{background:`linear-gradient(135deg,${ph.color}20,${ph.color}08)`,border:`1px solid ${ph.color}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <span className="pill" style={{background:`${ph.color}22`,color:ph.color}}>{ph.emoji} {ph.label} Phase</span>
                <p style={{fontSize:"0.75rem",color:"#9a8a80",marginTop:5}}>{ph.days}</p>
              </div>
              <span style={{fontSize:"2.2rem"}}>{ph.emoji}</span>
            </div>
            <p style={{marginTop:14,fontSize:"0.87rem",color:"#5a4a42",lineHeight:1.7,fontStyle:"italic"}}>"{ph.tip}"</p>
          </div>

          {/* Affirmation carousel */}
          <div className="card" style={{background:"linear-gradient(135deg,#fdf0ed,#f8f0fb)",textAlign:"center"}}>
            <p style={{fontSize:"0.68rem",color:"#c97b7b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Today's Affirmation</p>
            <p className="serif" style={{fontSize:"1.1rem",fontStyle:"italic",color:"#4a3a34",lineHeight:1.8,minHeight:64}}>
              "{affirmations[showAffirm % affirmations.length]}"
            </p>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14}}>
              {affirmations.map((_,i)=>(
                <div key={i} className={`affirmation-dot ${i===showAffirm%affirmations.length?"active":""}`} onClick={()=>setShowAffirm(i)} />
              ))}
            </div>
          </div>

          {/* Quick mood */}
          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:4}}>How are you feeling today?</p>
            <p style={{fontSize:"0.75rem",color:"#b0a090",marginBottom:14}}>Quick check-in</p>
            <div className="emotion-grid">
              {EMOTIONS.slice(0,8).map(e=>(
                <button key={e.id} className={`emotion-btn ${todayMood===e.id?"sel":""}`}
                  style={{color:todayMood===e.id?e.color:undefined,borderColor:todayMood===e.id?e.color:undefined}}
                  onClick={()=>setTodayMood(e.id)}>
                  <span style={{fontSize:"1.3rem"}}>{e.emoji}</span><span>{e.label}</span>
                </button>
              ))}
            </div>
            {todayMood && (
              <div style={{marginTop:12}}>
                <textarea style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:10,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",color:"#2d2420",resize:"none",outline:"none",background:"#faf7f4",minHeight:56}} placeholder="Add a note... (optional)" value={moodNote} onChange={e=>setMoodNote(e.target.value)} />
                <button className="btn-rose" style={{marginTop:8}} onClick={logMood}>Save to Journal ✦</button>
              </div>
            )}
          </div>

          {/* Water tracker */}
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div><p style={{fontWeight:500,fontSize:"0.9rem"}}>Hydration Today 💧</p><p style={{fontSize:"0.72rem",color:"#b0a090"}}>Goal: 8 glasses</p></div>
              <p className="serif" style={{fontSize:"1.6rem",color:"#7ab8c9"}}>{waterCount}/8</p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {Array.from({length:8},(_,i)=>(
                <button key={i} className={`water-btn ${i<waterCount?"filled":""}`} onClick={()=>setWaterCount(i<waterCount?i:i+1)}>
                  {i<waterCount?"💧":"○"}
                </button>
              ))}
            </div>
          </div>

          {/* Daily fun fact */}
          <div className="fact-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <p style={{fontSize:"0.68rem",color:"#c97b7b",letterSpacing:"0.15em",textTransform:"uppercase"}}>Daily Fun Fact ✨</p>
              <button onClick={()=>setFactIdx(f=>(f+1)%FUN_FACTS.length)} style={{background:"none",border:"none",fontSize:"0.75rem",color:"#b0a090",cursor:"pointer"}}>Next →</button>
            </div>
            <p style={{fontSize:"1.2rem",marginBottom:6}}>{FUN_FACTS[factIdx].emoji}</p>
            <p style={{fontWeight:600,fontSize:"0.88rem",color:"#2d2420",marginBottom:6}}>{FUN_FACTS[factIdx].title}</p>
            <p style={{fontSize:"0.83rem",color:"#5a4a42",lineHeight:1.7}}>{FUN_FACTS[factIdx].fact}</p>
          </div>

          {/* Recent mood log */}
          {moodLog.length>0 && (
            <div className="card">
              <p className="serif" style={{fontSize:"1.1rem",fontWeight:400,marginBottom:12}}>Recent Journal</p>
              {moodLog.slice(0,3).map((entry,i)=>{
                const e=EMOTIONS.find(em=>em.id===entry.mood);
                return (
                  <div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<2?"1px solid #f5f0eb":"none"}}>
                    <span style={{fontSize:"1.2rem"}}>{e?.emoji}</span>
                    <div>
                      <p style={{fontSize:"0.82rem",fontWeight:500,color:e?.color}}>{e?.label}</p>
                      <p style={{fontSize:"0.72rem",color:"#9a8a80"}}>{entry.date} · {entry.phase}</p>
                      {entry.note && <p style={{fontSize:"0.8rem",color:"#5a4a42",marginTop:2}}>{entry.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CYCLE ── */}
      {tab==="cycle" && (
        <div className="fade-in" style={{padding:"28px 16px 0"}}>
          <h1 className="section-title">My Cycle</h1>
          <p className="section-sub">Track your phase & understand your rhythm</p>

          <div className="card">
            <p style={{fontSize:"0.72rem",color:"#b0a090",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Current Phase</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {PHASES.map(p=>(
                <div key={p.id} className={`phase-block ${phase===p.id?"active":""}`} style={{color:p.color,borderColor:phase===p.id?p.color:"transparent"}}
                  onClick={()=>{setPhase(p.id);saveData({phase:p.id});}}>
                  <div style={{fontSize:"1.5rem",marginBottom:4}}>{p.emoji}</div>
                  <div style={{fontSize:"0.7rem",fontWeight:500,color:"#2d2420"}}>{p.label}</div>
                  <div style={{fontSize:"0.62rem",color:"#b0a090",marginTop:2}}>{p.days}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p style={{fontSize:"0.72rem",color:"#b0a090",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Cycle Day</p>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <input type="range" min="1" max="28" value={cycleDay} style={{flex:1,accentColor:"#c97b7b"}} onChange={e=>{setCycleDay(+e.target.value);saveData({cycleDay:+e.target.value});}} />
              <span className="serif" style={{fontSize:"1.8rem",color:"#c97b7b",minWidth:42}}>{cycleDay}</span>
            </div>
            <p style={{fontSize:"0.78rem",color:"#9a8a80",marginTop:4}}>Day {cycleDay} of your cycle</p>
          </div>

          {/* Phase details */}
          {PHASES.map(p=>(
            <div key={p.id} className="card" style={{borderLeft:`3px solid ${p.color}`,paddingLeft:16,opacity:phase===p.id?1:0.65}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:"1.3rem"}}>{p.emoji}</span>
                <div>
                  <p style={{fontWeight:500,fontSize:"0.9rem",color:p.color}}>{p.label} Phase</p>
                  <p style={{fontSize:"0.72rem",color:"#b0a090"}}>{p.days}</p>
                </div>
              </div>
              <p style={{fontSize:"0.83rem",color:"#5a4a42",lineHeight:1.7}}>{p.tip}</p>
            </div>
          ))}

          {/* Phase recipe */}
          {(() => {
            const r = RECIPES.find(r=>r.phase===phase);
            return r ? (
              <div className="recipe-card">
                <p style={{fontSize:"0.68rem",color:"#c97b7b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Phase Recipe 🍽</p>
                <p style={{fontWeight:600,fontSize:"1rem",marginBottom:6}}>{r.name}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {r.ingredients.map(ing=>(
                    <span key={ing} style={{background:"#fff0eb",color:"#c97b7b",borderRadius:20,padding:"3px 10px",fontSize:"0.72rem"}}>{ing}</span>
                  ))}
                </div>
                <p style={{fontSize:"0.8rem",color:"#7a6a60",fontStyle:"italic"}}>{r.benefit}</p>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* ── MOOD ── */}
      {tab==="mood" && (
        <div className="fade-in" style={{padding:"28px 16px 0"}}>
          <h1 className="section-title">Mood Journal</h1>
          <p className="section-sub">Track how you feel, day by day</p>

          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:14}}>How are you feeling right now?</p>
            <div className="emotion-grid">
              {EMOTIONS.map(e=>(
                <button key={e.id} className={`emotion-btn ${todayMood===e.id?"sel":""}`}
                  style={{color:todayMood===e.id?e.color:undefined,borderColor:todayMood===e.id?e.color:undefined}}
                  onClick={()=>setTodayMood(e.id)}>
                  <span style={{fontSize:"1.3rem"}}>{e.emoji}</span><span>{e.label}</span>
                </button>
              ))}
            </div>
            {todayMood && (
              <div style={{marginTop:14}}>
                <textarea style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:10,padding:"10px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem",color:"#2d2420",resize:"none",outline:"none",background:"#faf7f4",minHeight:80}} placeholder="Write freely — what's on your mind and in your heart?" value={moodNote} onChange={e=>setMoodNote(e.target.value)} />
                <button className="btn-rose" style={{marginTop:8}} onClick={logMood}>Save Entry ✦</button>
              </div>
            )}
          </div>

          {/* Sleep tracker */}
          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:4}}>Sleep Quality 🌙</p>
            <p style={{fontSize:"0.75rem",color:"#b0a090",marginBottom:14}}>How did you sleep last night?</p>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:14}}>
              {[1,2,3,4,5].map(s=>(
                <span key={s} className="sleep-star" onClick={()=>setSleepRating(s)} style={{opacity:s<=sleepRating?1:0.3}}>⭐</span>
              ))}
            </div>
            {sleepRating>0 && <button className="btn-rose" onClick={logSleep}>Log Sleep</button>}
            {sleepLog.length>0 && (
              <div style={{marginTop:14}}>
                <p style={{fontSize:"0.72rem",color:"#b0a090",marginBottom:8}}>Recent nights</p>
                {sleepLog.slice(0,5).map((s,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f5f0eb"}}>
                    <span style={{fontSize:"0.8rem",color:"#5a4a42"}}>{s.date}</span>
                    <span style={{fontSize:"0.8rem"}}>{Array.from({length:s.rating},()=>"⭐").join("")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gratitude */}
          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:4}}>Gratitude Practice 💛</p>
            <p style={{fontSize:"0.75rem",color:"#b0a090",marginBottom:14}}>Name 3 things you're grateful for today</p>
            {gratList.map((g,i)=>(
              <input key={i} className="grat-input" placeholder={`I'm grateful for...`} value={g} onChange={e=>{const u=[...gratList];u[i]=e.target.value;setGratList(u);}} style={{marginBottom:8}} />
            ))}
            <button className="btn-rose" style={{marginTop:4}} onClick={saveGrat}>Save Gratitude ✦</button>
            {gratSaved.length>0 && (
              <div style={{marginTop:16,borderTop:"1px solid #f5f0eb",paddingTop:14}}>
                <p style={{fontSize:"0.72rem",color:"#b0a090",marginBottom:10}}>Past entries</p>
                {gratSaved.slice(0,3).map((entry,i)=>(
                  <div key={i} style={{marginBottom:10}}>
                    <p style={{fontSize:"0.7rem",color:"#c9a07a",marginBottom:4}}>{entry.date}</p>
                    {entry.items.map((item,j)=><p key={j} style={{fontSize:"0.82rem",color:"#5a4a42"}}>✦ {item}</p>)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {moodLog.length>0 && (
            <div className="card">
              <p className="serif" style={{fontSize:"1.1rem",fontWeight:400,marginBottom:14}}>Your Journal</p>
              {moodLog.map((entry,i)=>{
                const e=EMOTIONS.find(em=>em.id===entry.mood);
                return (
                  <div key={i} style={{paddingBottom:12,marginBottom:12,borderBottom:i<moodLog.length-1?"1px solid #f5f0eb":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        <span>{e?.emoji}</span><span style={{fontSize:"0.85rem",fontWeight:500,color:e?.color}}>{e?.label}</span>
                      </span>
                      <span style={{fontSize:"0.7rem",color:"#b0a090"}}>{entry.date}</span>
                    </div>
                    {entry.note && <p style={{fontSize:"0.82rem",color:"#5a4a42",lineHeight:1.6}}>{entry.note}</p>}
                    <p style={{fontSize:"0.68rem",color:"#c0b0a0",marginTop:3}}>{entry.phase} phase</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── CHAT ── */}
      {tab==="chat" && (
        <div className="fade-in" style={{display:"flex",flexDirection:"column",height:"100vh"}}>
          <div style={{padding:"20px 16px 14px",borderBottom:"1px solid #ede8e3",background:"white"}}>
            <h1 className="serif" style={{fontSize:"1.4rem",fontWeight:400}}>Talk to Bloom 🌸</h1>
            <p style={{fontSize:"0.75rem",color:"#b0a090"}}>Your wellness companion — always here for you</p>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px",paddingBottom:8}}>
            {messages.map((m,i)=>(
              <div key={i} className={`chat-bubble ${m.role}`}>{m.content}</div>
            ))}
            {chatLoading && (
              <div className="chat-bubble assistant"><div className="dot-loader"><span/><span/><span/></div></div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",padding:"12px 16px",background:"white",borderTop:"1px solid #ede8e3",position:"sticky",bottom:80}}>
            <textarea style={{flex:1,border:"1.5px solid #ede8e3",borderRadius:20,padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.88rem",color:"#2d2420",resize:"none",outline:"none",minHeight:42,maxHeight:100,background:"#faf7f4",transition:"border-color 0.2s"}}
              placeholder="Share what's on your heart..."
              value={input} rows={1}
              onChange={e=>setInput(e.target.value)}
              onFocus={e=>e.target.style.borderColor="#c97b7b"}
              onBlur={e=>e.target.style.borderColor="#ede8e3"}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
            />
            <button disabled={!input.trim()||chatLoading} onClick={sendMessage}
              style={{width:42,height:42,background:input.trim()&&!chatLoading?"#c97b7b":"#d4b8a8",border:"none",borderRadius:"50%",cursor:input.trim()&&!chatLoading?"pointer":"not-allowed",color:"white",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>→</button>
          </div>
        </div>
      )}

      {/* ── CARE ── */}
      {tab==="care" && (
        <div className="fade-in" style={{padding:"28px 16px 0"}}>
          <h1 className="section-title">Self-Care Guide</h1>
          <p className="section-sub">Tailored to your {ph.label} phase</p>
          <span className="pill" style={{background:`${ph.color}22`,color:ph.color,marginBottom:20,display:"inline-flex"}}>{ph.emoji} {ph.label} · {ph.days}</span>

          {CARE_DATA.map(cat=>(
            <div key={cat.id} style={{background:"white",borderRadius:14,overflow:"hidden",marginBottom:12,boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
              <div style={{padding:"14px 18px 10px",borderBottom:"1px solid #f5f0eb",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:10,background:"#fdf0ed",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",color:"#c97b7b"}}>{cat.icon}</div>
                <p style={{fontWeight:500,fontSize:"0.9rem"}}>{cat.title}</p>
              </div>
              <div style={{padding:"14px 18px"}}>
                <p style={{fontSize:"0.85rem",color:"#5a4a42",lineHeight:1.7}}>{cat.items[phase]}</p>
              </div>
            </div>
          ))}

          {/* Sleep tip */}
          {(() => {
            const s = SLEEP_TIPS.find(s=>s.phase===phase);
            return s ? (
              <div style={{background:"linear-gradient(135deg,#f0eaff,#faf0fb)",borderRadius:14,padding:18,marginBottom:12,border:"1px solid #e8e0f0"}}>
                <p style={{fontSize:"0.68rem",color:"#9a7ac4",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Sleep Guidance 🌙</p>
                <p style={{fontSize:"0.85rem",color:"#5a4a42",lineHeight:1.7}}>{s.tip}</p>
              </div>
            ) : null;
          })()}

          {/* Meditation */}
          {(() => {
            const m = MEDITATIONS.find(m=>m.phase===phase);
            return m ? (
              <div className="med-card">
                <div style={{width:44,height:44,borderRadius:12,background:"#f0eaff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>🧘</div>
                <div>
                  <p style={{fontWeight:500,fontSize:"0.9rem"}}>{m.name}</p>
                  <p style={{fontSize:"0.72rem",color:"#9a7ac4",marginBottom:4}}>{m.duration}</p>
                  <p style={{fontSize:"0.82rem",color:"#5a4a42",lineHeight:1.6}}>{m.desc}</p>
                </div>
              </div>
            ) : null;
          })()}

          <div style={{background:"linear-gradient(135deg,#fdf0ed,#f8f0fb)",borderRadius:16,padding:22,textAlign:"center",marginBottom:14}}>
            <p style={{fontSize:"0.68rem",color:"#c97b7b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>A Gentle Reminder</p>
            <p className="serif" style={{fontSize:"1.05rem",fontStyle:"italic",color:"#4a3a34",lineHeight:1.85}}>
              You are not behind. You are not too much. You are exactly where you need to be, becoming who you are meant to be. 🌸
            </p>
          </div>
        </div>
      )}

      {/* ── EXPLORE ── */}
      {tab==="explore" && (
        <div className="fade-in" style={{padding:"28px 16px 0"}}>
          <h1 className="section-title">Explore & Learn</h1>
          <p className="section-sub">Fun facts, wisdom & wellness knowledge</p>

          {/* All fun facts */}
          <div style={{marginBottom:8}}>
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:14}}>✨ Did You Know?</p>
            {FUN_FACTS.map((f,i)=>(
              <div key={i} className="fact-card" style={{marginBottom:12}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                  <span style={{fontSize:"1.8rem",flexShrink:0}}>{f.emoji}</span>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <p style={{fontWeight:600,fontSize:"0.88rem",color:"#2d2420"}}>{f.title}</p>
                      <span style={{background:"#fde8e0",color:"#c97b7b",borderRadius:20,padding:"2px 8px",fontSize:"0.65rem",letterSpacing:"0.08em",textTransform:"uppercase"}}>{f.category}</span>
                    </div>
                    <p style={{fontSize:"0.82rem",color:"#5a4a42",lineHeight:1.7}}>{f.fact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hormone guide */}
          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:14}}>🔬 Your Hormones Explained</p>
            {[
              { name:"Estrogen", color:"#e8a4b8", desc:"The 'feminine' hormone that rises in the first half of your cycle. Boosts mood, memory, energy, skin glow and libido. Too little = fatigue & fog. Too much = bloating & mood swings." },
              { name:"Progesterone", color:"#8b9ec7", desc:"Rises after ovulation. Calming and sleep-promoting, but can cause fatigue, food cravings and emotional sensitivity when it drops sharply before menstruation." },
              { name:"Testosterone", color:"#d4a96a", desc:"Yes, women have testosterone too! Peaks at ovulation, boosting confidence, drive, and libido. Supports muscle building and assertiveness throughout the cycle." },
              { name:"FSH & LH", color:"#8ec9a2", desc:"Follicle-stimulating hormone (FSH) and luteinizing hormone (LH) are the conductors of your cycle — triggering follicle growth and ovulation respectively." },
            ].map(h=>(
              <div key={h.name} style={{display:"flex",gap:12,marginBottom:14,paddingBottom:14,borderBottom:"1px solid #f5f0eb",alignItems:"flex-start"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:h.color,marginTop:5,flexShrink:0}}/>
                <div>
                  <p style={{fontWeight:600,fontSize:"0.88rem",color:h.color,marginBottom:4}}>{h.name}</p>
                  <p style={{fontSize:"0.82rem",color:"#5a4a42",lineHeight:1.65}}>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cycle syncing tips */}
          <div className="card">
            <p style={{fontWeight:500,fontSize:"0.9rem",marginBottom:14}}>🌀 Cycle Syncing Tips</p>
            {[
              { phase:"🌑 Menstrual", tip:"Schedule fewer obligations. Say no freely. Slow mornings, candles, warm baths. This is your hermit season — honor it." },
              { phase:"🌒 Follicular", tip:"Plan, brainstorm, pitch ideas, start new habits. Your brain is at its most creative and receptive. Best time for first dates and social events!" },
              { phase:"🌕 Ovulation", tip:"Big presentations, important conversations, job interviews — schedule these now. You're at peak charisma and articulation." },
              { phase:"🌘 Luteal", tip:"Wrap up projects, do admin tasks, clean and organize. Your analytical brain is sharp. Practice boundaries — your 'no' is most needed now." },
            ].map(t=>(
              <div key={t.phase} style={{marginBottom:12,paddingBottom:12,borderBottom:"1px solid #f5f0eb"}}>
                <p style={{fontWeight:500,fontSize:"0.85rem",marginBottom:4}}>{t.phase}</p>
                <p style={{fontSize:"0.82rem",color:"#5a4a42",lineHeight:1.65}}>{t.tip}</p>
              </div>
            ))}
          </div>

          {/* Body positivity */}
          <div style={{background:"linear-gradient(135deg,#ffeef0,#fff0fa)",borderRadius:16,padding:22,marginBottom:14,border:"1px solid #f0d8e8"}}>
            <p style={{fontSize:"0.68rem",color:"#c97b7b",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Body Love Corner 💕</p>
            {[
              "Your body is not a problem to be solved. It is a home to be loved.",
              "Cellulite, stretch marks, and curves are not flaws — they are proof you are alive and human.",
              "The number on the scale is not a measure of your worth, your beauty, or your health.",
              "Nourishment is an act of love, not punishment. Eat what makes you feel alive.",
            ].map((q,i)=>(
              <p key={i} className="serif" style={{fontSize:"0.95rem",fontStyle:"italic",color:"#4a3a34",marginBottom:10,lineHeight:1.7}}>"{q}"</p>
            ))}
          </div>
        </div>
      )}

      {/* Tab bar */}
      <div className="tab-bar">
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
            <span style={{fontSize:"1rem"}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── SPLASH ────────────────────────────────────────────────────────────
function SplashScreen() {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fff5f0 0%,#faf0f8 50%,#f0f5ff 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{textAlign:"center",animation:"fadeIn 1s ease forwards"}}>
        <div style={{fontSize:"4rem",marginBottom:16,animation:"pulse 2s ease-in-out infinite"}}>🌸</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"3rem",fontWeight:300,color:"#2d2420",letterSpacing:"-0.5px"}}>Bloom</h1>
        <p style={{fontSize:"0.8rem",color:"#b0a090",letterSpacing:"0.2em",textTransform:"uppercase",marginTop:6}}>Your Wellness Sanctuary</p>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────
function AuthScreen({ mode, setMode, email, setEmail, pass, setPass, name, setName, error, onSubmit }) {
  const isReg = mode === "register";
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fff5f0 0%,#faf0f8 50%,#f0f5ff 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:"40px 24px"}}>
      <style>{FONTS}</style>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:"2.8rem",marginBottom:10}}>🌸</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.4rem",fontWeight:300,color:"#2d2420"}}>Bloom</h1>
          <p style={{fontSize:"0.8rem",color:"#b0a090",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:4}}>{isReg?"Create your sanctuary":"Welcome back"}</p>
        </div>

        <div style={{background:"white",borderRadius:20,padding:28,boxShadow:"0 4px 30px rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex",borderRadius:10,background:"#faf7f4",padding:4,marginBottom:24}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px",border:"none",borderRadius:8,background:mode===m?"white":"transparent",color:mode===m?"#c97b7b":"#b0a090",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",fontWeight:mode===m?500:400,cursor:"pointer",transition:"all 0.2s",boxShadow:mode===m?"0 2px 8px rgba(0,0,0,0.06)":"none"}}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          {isReg && (
            <div style={{marginBottom:14}}>
              <p style={{fontSize:"0.72rem",color:"#b0a090",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase"}}>Your Name</p>
              <input style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:10,padding:"12px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:"#2d2420",outline:"none",transition:"border-color 0.2s"}}
                placeholder="What shall we call you?" value={name} onChange={e=>setName(e.target.value)}
                onFocus={e=>e.target.style.borderColor="#c97b7b"} onBlur={e=>e.target.style.borderColor="#ede8e3"} />
            </div>
          )}

          <div style={{marginBottom:14}}>
            <p style={{fontSize:"0.72rem",color:"#b0a090",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase"}}>Email</p>
            <input type="email" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:10,padding:"12px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:"#2d2420",outline:"none",transition:"border-color 0.2s"}}
              placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
              onFocus={e=>e.target.style.borderColor="#c97b7b"} onBlur={e=>e.target.style.borderColor="#ede8e3"} />
          </div>

          <div style={{marginBottom:20}}>
            <p style={{fontSize:"0.72rem",color:"#b0a090",marginBottom:6,letterSpacing:"0.08em",textTransform:"uppercase"}}>Password</p>
            <input type="password" style={{width:"100%",border:"1.5px solid #ede8e3",borderRadius:10,padding:"12px 14px",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",color:"#2d2420",outline:"none",transition:"border-color 0.2s"}}
              placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)}
              onFocus={e=>e.target.style.borderColor="#c97b7b"} onBlur={e=>e.target.style.borderColor="#ede8e3"}
              onKeyDown={e=>e.key==="Enter"&&onSubmit()} />
          </div>

          {error && <p style={{fontSize:"0.8rem",color:"#c97b7b",marginBottom:14,textAlign:"center"}}>{error}</p>}

          <button onClick={onSubmit} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#c97b7b,#d4849a)",color:"white",border:"none",borderRadius:12,fontFamily:"'DM Sans',sans-serif",fontSize:"0.95rem",fontWeight:600,cursor:"pointer",letterSpacing:"0.04em",boxShadow:"0 4px 16px rgba(201,123,123,0.35)",transition:"all 0.2s"}}>
            {isReg?"Begin My Journey 🌸":"Welcome Back →"}
          </button>
        </div>

        <p style={{textAlign:"center",fontSize:"0.75rem",color:"#b0a090",marginTop:20}}>
          Your data stays private & only on your device 🔒
        </p>
      </div>
    </div>
  );
}
