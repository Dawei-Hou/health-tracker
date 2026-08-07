// ===== Health Tracker 核心逻辑 =====
const STORE_KEY = 'health_tracker_cache_v2';
const EXPORT_KEY = 'health_tracker_last_export';
// 分类主题色（与 CSS 变量对应）
const CAT_COLOR = { biochem:'#2563EB', cbc:'#E11D48', hbv_panel:'#7C3AED', hbv_rna:'#EA580C', fibroscan:'#0891B2', ultrasound:'#059669', tumor_markers:'#B45309' };

// 现代线性图标（Lucide 风格，stroke）
const ICONS = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  trend:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  folder:'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
};
function svgIcon(name){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`; }

// 英文缩写对照表（指标 key → 显示缩写）
const ABBR_MAP = {
  // 肝功・生化
  TP:'TP', ALB:'Alb', GLB:'Glb', AG:'A/G', PA:'PA',
  ALT:'ALT', AST:'AST', SL:'AST/ALT', ALP:'ALP', GGT:'γ-GT',
  LDH:'LDH', CHE:'ChE', CK:'CK', LAP:'LAP', HAPT:'Hp',
  TBA:'TBA', CG:'CG', SAA:'SAA',
  TBIL:'T-Bil', DBIL:'D-Bil', IBIL:'I-Bil',
  CHO:'CHO', TG:'TG', HDLC:'HDL-C', LDLC:'LDL-C',
  APOA1:'ApoA1', APOB:'ApoB', GLU:'Glu', UREA:'URE', CREA:'Cr',
  B2MG:'β2-MG', eGFR:'eGFR', UA:'UA',
  // 血常规
  WBC:'WBC', RBC:'RBC', HGB:'Hb', HCT:'Hct',
  MCV:'MCV', MCH:'MCH', MCHC:'MCHC', PLT:'PLT',
  NEU_P:'NEU%', LYM_P:'LYM%', MON_P:'MON%', EO_P:'EO%', BAS_P:'BAS%',
  NEU_A:'NEU#', LYM_A:'LYM#', MON_A:'MON#', EO_A:'EO#', BAS_A:'BAS#',
  RDW_CV:'RDW-CV', RDW_SD:'RDW-SD', PDW:'PDW', MPV:'MPV', PCT:'PCT',
  NRBC_P:'NRBC%', NRBC_A:'NRBC#', P_LCR:'P-LCR',
  // 乙肝五项
  AntiHBs:'Anti-HBs', HBeAg:'HBeAg', AntiHBe:'Anti-HBe',
  AntiHBc:'Anti-HBc', HBsAg:'HBsAg',
  // HBV-DNA/RNA
  HBV_DNA:'HBV-DNA', HBV_DNA_LOAD:'HBV-DNA定量', HBV_RNA:'HBV-RNA',
  // FibroScan
  CAP:'CAP', E_KPA:'E[kPa]',
  // 电解质・凝血
  INR:'INR', Na:'Na', K:'K', Ca:'Ca',
  // 肿瘤标志物
  AFP:'AFP', AFP_L3:'AFP-L3', DCP:'PIVKA-II',
};
function displayAbbr(key){ return ABBR_MAP[key]||null; }

const App = {
  data: null,
  currentView: 'dashboard',
  trendChart: null,
  editingId: null,
  editingMedId: null,
  editingCustomInd: null,
  draft: null,
  _dseg: 0, _dbuf: '',
  _dateSEG: [{s:0,len:4},{s:5,len:2},{s:8,len:2}],

  // ---------- 初始化 ----------
  init() {
    const cached = localStorage.getItem(STORE_KEY);
    if (cached) {
      try { this.data = JSON.parse(cached); } catch(e){ this.data = null; }
    }
    if (!this.data || !this.data.examinations) {
      this.data = { examinations: [], facilities: [], medications: [], customCategories: [] };
    }
    this.ensureDefaults();
    this.save();
    this.bindNav();
    this.renderIcons();
    if (localStorage.getItem('navCollapsed')==='1') document.getElementById('app').classList.add('nav-collapsed');
    if (localStorage.getItem('darkMode')==='1') document.documentElement.setAttribute('data-theme','dark');
    this._updateDarkBtn();
    document.getElementById('fileInput').addEventListener('change', e => this.handleFile(e));
    this.renderAll();
    this.checkExportWarn();
    window.scrollTo(0,0);   // 修复 F5 刷新后自动下滑
  },

  // 补全新增字段（对旧数据/样本数据均适用）
  ensureDefaults() {
    const d = this.data;
    d.meta = d.meta || {};
    d.profile = d.profile || {};
    ['name','gender','birthYear','height','weight','bloodType','note'].forEach(k => { if (!(k in d.profile)) d.profile[k]=''; });
    if (!d.profile.recheckMonths) d.profile.recheckMonths = 6;
    if (!Array.isArray(d.facilities)) d.facilities = [];
    if (!Array.isArray(d.medications)) d.medications = [];
    if (!Array.isArray(d.customCategories)) d.customCategories = [];
    if (!Array.isArray(d.reportTypes)) d.reportTypes = ['乙肝专项监测','常规体检','血液检查','肝功能复查','入职体检','复诊随访'];
    // 迁移旧版药物数据
    (d.medications||[]).forEach(m => {
      if ('dose' in m && !('doseAmt' in m)) { m.doseAmt = m.dose||''; delete m.dose; }
      if (!('freqTimes' in m)) m.freqTimes = 1;
      if (!('freqPills' in m)) m.freqPills = 1;
      if (!m.doseAmt) m.doseAmt = '';
    });
    this.registerCustom();
    // 同步类别顺序表
    const _allCatIds = INDICATOR_CATEGORIES.map(c=>c.id).concat((d.customCategories||[]).map(c=>c.id));
    if (!Array.isArray(d.catOrder)) d.catOrder = [..._allCatIds];
    _allCatIds.forEach(id => { if (!d.catOrder.includes(id)) d.catOrder.push(id); });
    d.catOrder = d.catOrder.filter(id => _allCatIds.includes(id));
    (d.examinations||[]).forEach(e => {
      if (!Array.isArray(e.meds)) e.meds = [];
      if (!('medNote' in e)) e.medNote = '';
      if (!('usNote' in e)) e.usNote = '';
      if (!('cpAscites' in e)) e.cpAscites = null;
      if (!('cpEnceph' in e))  e.cpEnceph  = null;
      // 迁移旧版脾厚字段
      if ('SPLEEN_T' in e.values && !('SP_SUP_T' in e.values)) {
        e.values['SP_SUP_T'] = e.values['SPLEEN_T'];
        delete e.values['SPLEEN_T'];
      }
    });
    // 样本报告机构自动收录
    (d.examinations||[]).forEach(e => { if (e.facility && !d.facilities.includes(e.facility)) d.facilities.push(e.facility); });
  },
  // 把自定义类别的指标注册进 INDICATOR_MAP，使 evalIndicator / refRangeText 生效
  registerCustom() {
    (this.data.customCategories||[]).forEach(cat => {
      (cat.indicators||[]).forEach(ind => {
        ind.categoryId = cat.id;
        ind.categoryName = cat.nameShort || cat.name;
        INDICATOR_MAP[ind.key] = ind;
      });
    });
  },
  allCategories() {
    const all = INDICATOR_CATEGORIES.concat(this.data.customCategories||[]);
    const order = this.data.catOrder;
    if (!order || !order.length) return all;
    return order.map(id => all.find(c => c.id===id)).filter(Boolean);
  },
  catById(id) { return this.allCategories().find(c=>c.id===id); },
  catColor(id) {
    if (CAT_COLOR[id]) return CAT_COLOR[id];
    const c=(this.data.customCategories||[]).find(x=>x.id===id);
    return (c&&c.color)?c.color:'#6366F1';
  },

  indName(key, plain=false) {
    const d = INDICATOR_MAP[key]; if (!d) return key;
    const a = displayAbbr(key);
    if (!a) return d.name;
    return plain ? `${d.name}（${a}）` : `${d.name}<span style="white-space:nowrap">（${a}）</span>`;
  },
  renderIcons() {
    document.querySelectorAll('[data-ic]').forEach(el => {
      el.innerHTML = svgIcon(el.dataset.ic);
    });
  },
  toggleSidebar() {
    const collapsed = document.getElementById('app').classList.toggle('nav-collapsed');
    localStorage.setItem('navCollapsed', collapsed ? '1' : '0');
  },
  toggleDark() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('darkMode', dark ? '0' : '1');
    this._updateDarkBtn();
  },
  _updateDarkBtn() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const ic = document.getElementById('darkToggleIc');
    const lbl = document.getElementById('darkToggleLbl');
    if (ic) { ic.dataset.ic = dark ? 'sun' : 'moon'; ic.innerHTML = svgIcon(dark ? 'sun' : 'moon'); }
    if (lbl) lbl.textContent = dark ? ' 亮色模式' : ' 暗色模式';
  },
  bindNav() {
    document.querySelectorAll('[data-view]').forEach(b => {
      b.addEventListener('click', () => this.go(b.dataset.view));
    });
  },

  go(view) {
    this.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    document.querySelectorAll('[data-view]').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
    window.scrollTo(0, 0);
    if (view === 'input' && !this.draft) this.startInput();
    if (view === 'trend') this.initTrend();
    if (view === 'records') this.renderRecords();
    if (view === 'dashboard') this.renderDashboard();
    if (view === 'settings') this.renderSettings();
  },

  save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.data));
  },

  sortedExams() {
    return [...this.data.examinations].sort((a,b) => a.date.localeCompare(b.date));
  },
  latestExam() {
    const s = this.sortedExams();
    return s.length ? s[s.length-1] : null;
  },

  renderAll() {
    this.renderDashboard();
  },

  // ---------- B2: 连续异常检测 ----------
  detectConsecutiveAbnormal(n=3) {
    const exams = this.sortedExams();
    if (exams.length < n) return [];
    const last = exams.slice(-n);
    const allKeys = new Set(last.flatMap(e => Object.keys(e.values)));
    const alerts = [];
    allKeys.forEach(k => {
      if (!INDICATOR_MAP[k]) return;
      const statuses = last.map(e => {
        const v = e.values[k];
        if (v === undefined || v === null) return null;
        return evalIndicator(k, v).status;
      });
      if (statuses.some(s => s === null)) return;
      const allHigh = statuses.every(s => s === 'high');
      const allLow  = statuses.every(s => s === 'low');
      if (allHigh || allLow) {
        alerts.push({ key:k, status:allHigh?'high':'low', arrow:allHigh?'↑':'↓',
          count:n, latestVal:last[last.length-1].values[k] });
      }
    });
    return alerts;
  },

  // ---------- C3: MELD 评分 ----------
  computeMELD(exam) {
    if (!exam) return null;
    const tbil = exam.values['TBIL'], inr = exam.values['INR'], crea = exam.values['CREA'];
    if (tbil == null || inr == null || crea == null) return null;
    const tB = Math.max(1.0, tbil / 17.1);           // umol/L → mg/dL
    const tC = Math.max(1.0, Math.min(4.0, crea / 88.4)); // umol/L → mg/dL, cap 4
    const tI = Math.max(1.0, inr);
    const meld = Math.round(3.78 * Math.log(tB) + 11.2 * Math.log(tI) + 9.57 * Math.log(tC) + 6.43);
    const na = exam.values['Na'];
    if (na != null) {
      const naSafe = Math.max(125, Math.min(137, na));
      const meldNa = Math.round(meld + 1.32 * (137 - naSafe) - 0.033 * meld * (137 - naSafe));
      return { meld, meldNa, hasNa:true };
    }
    return { meld, meldNa:null, hasNa:false };
  },

  // ---------- C3: Child-Pugh 评分 ----------
  computeChildPugh(exam) {
    if (!exam) return null;
    const tbil = exam.values['TBIL'], alb = exam.values['ALB'], inr = exam.values['INR'];
    if (tbil == null && alb == null && inr == null) return null;
    let score = 0, labItems = 0;
    if (tbil != null) { labItems++; score += tbil < 34 ? 1 : tbil <= 51 ? 2 : 3; }
    if (alb  != null) { labItems++; score += alb  > 35 ? 1 : alb  >= 28 ? 2 : 3; }
    if (inr  != null) { labItems++; score += inr  < 1.7 ? 1 : inr  <= 2.3 ? 2 : 3; }
    // 临床项（腹水/肝性脑病）：有录入值则用，否则默认最优（1分）
    const asc = exam.cpAscites != null ? exam.cpAscites : 0; // 0=无/1=轻度/2=中重度
    const enc = exam.cpEnceph  != null ? exam.cpEnceph  : 0; // 0=无/1=I-II级/2=III-IV级
    score += (asc === 0 ? 1 : asc === 1 ? 2 : 3) + (enc === 0 ? 1 : enc === 1 ? 2 : 3);
    const hasClinical = exam.cpAscites != null || exam.cpEnceph != null;
    let grade = labItems >= 2 ? (score <= 6 ? 'A' : score <= 9 ? 'B' : 'C') : '';
    return { score, grade, labItems, hasClinical, hasINR: inr != null };
  },

  _renderConsecAlert() {
    const alerts = this.detectConsecutiveAbnormal(3);
    if (!alerts.length) return '';
    const items = alerts.map(a => {
      const def = INDICATOR_MAP[a.key];
      return `<span class="ca-chip ${a.status}">${this.indName(a.key)} ${a.arrow} <b>${this.fmt(a.latestVal,def)}</b></span>`;
    }).join('');
    return `<div class="consec-banner">
      <div class="cb-head">⚠ 连续 3 次异常指标　<span style="font-weight:500;font-size:12px">建议就医咨询</span></div>
      <div class="cb-items">${items}</div>
    </div>`;
  },

  _renderClinicalScores(exam) {
    const meld = this.computeMELD(exam);
    const cp   = this.computeChildPugh(exam);
    if (!meld && !cp) return '';
    let items = '';
    if (meld) {
      const mc = meld.meld < 10 ? {l:'代偿期',c:'#16A34A'} : meld.meld < 20 ? {l:'中等',c:'#D97706'} : {l:'失代偿',c:'#DC2626'};
      items += `<div class="cs-item"><div class="cs-n" style="color:${mc.c}">${meld.meld}</div><div class="cs-l">MELD</div><div class="cs-d" style="color:${mc.c}">${mc.l}</div></div>`;
      if (meld.meldNa) items += `<div class="cs-item"><div class="cs-n" style="color:${mc.c}">${meld.meldNa}</div><div class="cs-l">MELD-Na</div><div class="cs-d">含Na修正</div></div>`;
    }
    if (cp) {
      const gc = cp.grade==='A'?'#16A34A':cp.grade==='B'?'#D97706':cp.grade==='C'?'#DC2626':'#94A3B8';
      items += `<div class="cs-item"><div class="cs-n" style="color:${gc}">${cp.score}</div><div class="cs-l">Child-Pugh</div><div class="cs-d" style="color:${gc};font-weight:700">${cp.grade?'Child-'+cp.grade:'数据不足'}</div></div>`;
    }
    const notes = [];
    if (!meld) notes.push('录入 INR 可计算 MELD');
    else if (!meld.hasNa) notes.push('录入血钠可得 MELD-Na');
    if (cp && !cp.hasINR) notes.push('录入 INR 完善 Child-Pugh');
    if (cp && !cp.hasClinical) notes.push('腹水/肝性脑病分级录入后可精确 Child-Pugh');
    return `<div class="card" style="margin-bottom:18px">
      <div class="card-title"><span class="dot" style="background:#B45309"></span>临床评分 <span class="badge">仅供参考，以临床诊断为准</span></div>
      <div class="cs-row">${items}</div>
      ${notes.length?`<div class="cs-note">💡 ${notes.join('　·　')}</div>`:''}
    </div>`;
  },

  // ---------- 异常汇总 ----------
  countAbnormal(exam) {
    let high=0, low=0, abn=[];
    if (!exam) return {high,low,abn,total:0};
    Object.entries(exam.values).forEach(([k,v]) => {
      const r = evalIndicator(k, v);
      if (r.status === 'high'){ high++; abn.push({k,v,r}); }
      else if (r.status === 'low'){ low++; abn.push({k,v,r}); }
    });
    return {high, low, abn, total:high+low};
  },

  // ---------- Dashboard ----------
  renderDashboard() {
    const exam = this.latestExam();
    const hero = document.getElementById('heroBox');
    if (!exam) {
      hero.innerHTML = `<div class="empty"><div class="ic">📋</div>还没有报告，点击"新报告"开始录入</div>`;
      document.getElementById('smGrid').innerHTML = '';
      const _ca=document.getElementById('consecAlert'); if(_ca) _ca.innerHTML='';
      const _cl=document.getElementById('clinicalScores'); if(_cl) _cl.innerHTML='';
      return;
    }
    const c = this.countAbnormal(exam);
    const totalInd = Object.keys(exam.values).filter(k => INDICATOR_MAP[k]).length;
    const normal = totalInd - c.total;
    const days = Math.floor((Date.now() - new Date(exam.date).getTime())/86400000);

    let chips = c.abn.slice(0,12).map(a => {
      const d = INDICATOR_MAP[a.k];
      return `<span class="chip ${a.r.status}"><span class="arw">${a.r.arrow}</span>${this.indName(a.k)} ${a.v}</span>`;
    }).join('');
    if (c.abn.length > 12) chips += `<span class="chip low">+${c.abn.length-12}项</span>`;
    if (c.total === 0) chips = `<span class="chip" style="background:var(--normal-bg);color:var(--normal)">✓ 全部指标正常</span>`;

    const sc = this.computeScore(exam);
    const prf = this.data.profile;
    let recheckLine = '';
    if (prf.recheckMonths) {
      const next = new Date(exam.date);
      next.setMonth(next.getMonth() + parseInt(prf.recheckMonths));
      const dtr = Math.ceil((next - Date.now()) / 86400000);
      const nextStr = next.toISOString().slice(0,10);
      if (dtr <= 0) recheckLine = `<span style="color:var(--alert);font-weight:700">⚠ 已逾期复查（应于 ${nextStr} 复查）</span>`;
      else if (dtr <= 30) recheckLine = `<span style="color:var(--caution);font-weight:700">⏰ 距复查还剩 ${dtr} 天（${nextStr}）</span>`;
      else recheckLine = `<span>下次复查：${nextStr}（还剩 ${dtr} 天）</span>`;
    }
    const abn5 = c.abn.slice(0,5);
    const tipsHtml = abn5.length
      ? `<div class="tips-title">关注指标（偏高/偏低）</div><ul class="tips-list">${abn5.map(a=>{const def=INDICATOR_MAP[a.k];return `<li>${this.indName(a.k)} <b>${a.v} ${def.unit}</b> ${a.r.arrow} ${a.r.label}</li>`;}).join('')}</ul>`
      : `<div class="tips-ok">全部重点指标处于正常范围</div>`;

    hero.innerHTML = `
      <div class="hero">
        <div class="date-line">最新报告：${exam.date}　·　距今 ${days} 天${exam.type?'　· '+exam.type:''}</div>
        <div class="stat-row">
          <div class="stat"><div class="n">${normal}</div><div class="l">✓ 正常</div></div>
          <div class="stat"><div class="n" style="color:#FCA5A5">${c.high}</div><div class="l">↑ 偏高</div></div>
          <div class="stat"><div class="n" style="color:#BFDBFE">${c.low}</div><div class="l">↓ 偏低</div></div>
        </div>
        <div class="abn-list">${chips}</div>
      </div>
      <div class="card" style="margin-top:18px">
        <div class="assess-card">
          <div class="score-box">
            <div class="score-ring" style="--p:${sc.p};--col:${sc.col}">
              <div class="score-inner">
                <div class="score-n" style="color:${sc.col}">${sc.score}</div>
                <div class="score-lv" style="color:${sc.col}">${sc.level}</div>
              </div>
            </div>
            <div class="score-cap">健康评分</div>
          </div>
          <div class="assess-right">
            <div class="recheck-line">${recheckLine}</div>
            <div class="recheck-cfg">复查间隔：${prf.recheckMonths||6} 个月　<span style="cursor:pointer;color:var(--primary)" onclick="App.go('settings')">修改设定 ›</span></div>
            <div style="margin-top:10px">${tipsHtml}</div>
          </div>
        </div>
      </div>`;

    // Small multiples: 重点指标（按检查类别分组）
    const exams = this.sortedExams();
    const grid = document.getElementById('smGrid');
    let totalFocus = 0, groupsHtml = '';
    const drawKeys = [];
    this.allCategories().forEach(cat => {
      const fk = cat.indicators.filter(i => i.focus && exam.values[i.key]!==undefined && exam.values[i.key]!==null);
      if (!fk.length) return;
      const col = this.catColor(cat.id);
      totalFocus += fk.length;
      groupsHtml += `<div class="sm-group">
        <div class="sm-group-title" style="color:${col}"><span class="dot" style="background:${col}"></span>${cat.name}</div>
        <div class="sm-grid">${
          fk.map(def => {
            const k=def.key, v=exam.values[k], r=evalIndicator(k,v);
            drawKeys.push(k);
            return `<div class="sm-card ${r.status}" onclick="App.showDetail('${k}')">
              <div class="k" title="${this.indName(k,true)}">${this.indName(k)}</div>
              <div class="v">${this.fmt(v,def)}<span class="arw">${r.arrow}</span><span class="u">${def.unit}</span></div>
              <div class="spark-box"><canvas id="spark_${k}"></canvas></div>
            </div>`;
          }).join('')
        }</div></div>`;
    });
    grid.innerHTML = groupsHtml || '<div class="empty" style="padding:24px">最新报告暂无重点指标数据</div>';
    document.getElementById('smCount').textContent = totalFocus + '项';
    const _ca=document.getElementById('consecAlert'); if(_ca) _ca.innerHTML=this._renderConsecAlert();
    const _cl=document.getElementById('clinicalScores'); if(_cl) _cl.innerHTML=this._renderClinicalScores(exam);
    // 绘制迷你火花线
    setTimeout(() => {
      drawKeys.forEach(k => {
        const cv = document.getElementById('spark_'+k);
        if (!cv) return;
        const series = exams.map(e => ({x:e.date, y:e.values[k]})).filter(p => p.y!==undefined && p.y!==null);
        if (series.length < 1) return;
        const r = evalIndicator(k, exam.values[k]);
        const col = r.status==='high'?'#DC2626':r.status==='low'?'#2563EB':'#16A34A';
        new Chart(cv, {
          type:'line',
          data:{ labels:series.map(p=>p.x), datasets:[{data:series.map(p=>p.y),borderColor:col,backgroundColor:'transparent',borderWidth:2,pointRadius:series.length>1?2:3,pointBackgroundColor:col,tension:.3}]},
          options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{enabled:false}},scales:{x:{display:false},y:{display:false}}}
        });
      });
    }, 30);
  },

  computeScore(exam) {
    if (!exam) return { score:0, level:'暂无数据', col:'#94A3B8', p:0 };
    let total=0, normal=0;
    Object.entries(exam.values).forEach(([k,v]) => {
      if (INDICATOR_MAP[k]){ total++; if(evalIndicator(k,v).status==='normal') normal++; }
    });
    if (!total) return { score:0, level:'暂无数据', col:'#94A3B8', p:0 };
    const score = Math.round(normal/total*100);
    let level, col;
    if (score>=90){ level='优秀'; col='#16A34A'; }
    else if (score>=75){ level='良好'; col='#65A30D'; }
    else if (score>=60){ level='注意'; col='#D97706'; }
    else { level='偏低'; col='#DC2626'; }
    return {score, level, col, p:score};
  },
  fmt(v, d) {
    if (v === null || v === undefined || v === '') return '—';
    const n = Number(v);
    if (isNaN(n)) return v;
    if (d && d.standardText && n === 0) return d.standardText;
    if (d && d.sci && Math.abs(n) >= 1000) return n.toExponential(2);
    return d && d.decimals!=null ? n.toFixed(d.decimals).replace(/\.0+$/,'') || n.toString() : n.toString();
  },

  // ---------- 指标详情弹窗 ----------
  showDetail(key) {
    const d = INDICATOR_MAP[key];
    const exams = this.sortedExams();
    const rows = exams.filter(e => e.values[key]!==undefined && e.values[key]!==null).map(e => {
      const r = evalIndicator(key, e.values[key]);
      return `<tr><td>${e.date}</td><td class="val ${r.status}">${this.fmt(e.values[key],d)} ${r.arrow}</td><td><span class="st-pill ${r.status}">${r.label}</span></td></tr>`;
    }).reverse().join('');
    document.getElementById('modalBody').innerHTML = `
      <h3>${this.indName(key)} <span style="font-size:13px;color:var(--text-3);font-weight:500">${d.unit}</span></h3>
      <div style="font-size:12.5px;color:var(--text-2);margin-bottom:12px">参考范围：${refRangeText(key)} ${d.unit}　·　类别：${d.categoryName}</div>
      <canvas id="detailChart" style="max-height:220px;margin-bottom:14px"></canvas>
      <div class="tbl-wrap"><table class="data"><thead><tr><th>日期</th><th style="text-align:right">数值</th><th>状态</th></tr></thead><tbody>${rows||'<tr><td colspan=3 style="text-align:center;color:var(--text-3)">暂无数据</td></tr>'}</tbody></table></div>
      <div style="text-align:right;margin-top:14px"><button class="btn btn-ghost btn-sm" onclick="App.closeModal()">关闭</button></div>`;
    document.getElementById('modalMask').classList.add('show');
    setTimeout(() => this.drawTrendChart('detailChart', key), 40);
  },
  closeModal(){ document.getElementById('modalMask').classList.remove('show'); },

  // ---------- 通用趋势图绘制（带参考范围带） ----------
  drawTrendChart(canvasId, key, years=0, showVals=false) {
    const d = INDICATOR_MAP[key];
    let exams = this.sortedExams().filter(e => e.values[key]!==undefined && e.values[key]!==null);
    if (years > 0) {
      const since = new Date();
      since.setFullYear(since.getFullYear() - years);
      const sinceStr = since.toISOString().slice(0,10);
      exams = exams.filter(e => e.date >= sinceStr);
    }
    const labels = exams.map(e => e.date);
    const vals = exams.map(e => Number(e.values[key]));
    const cv = document.getElementById(canvasId);
    if (!cv) return null;
    const pointCols = exams.map(e => {
      const r = evalIndicator(key, e.values[key]);
      return r.status==='high'?'#DC2626':r.status==='low'?'#2563EB':'#16A34A';
    });
    const bandPlugin = {
      id:'refband',
      beforeDatasetsDraw(chart){
        if (d.min===null && d.max===null) return;
        const {ctx,chartArea:{left,right},scales:{y}} = chart;
        const top = d.max!==null ? y.getPixelForValue(d.max) : y.top;
        const bot = d.min!==null ? y.getPixelForValue(d.min) : y.bottom;
        ctx.save(); ctx.fillStyle='rgba(22,163,74,.09)';
        ctx.fillRect(left, top, right-left, bot-top); ctx.restore();
      }
    };
    const labelsPlugin = {
      id:'customLabels',
      afterDatasetsDraw(chart) {
        if (!showVals) return;
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        vals.forEach((v, i) => {
          const pt = meta.data[i]; if (!pt) return;
          ctx.save();
          ctx.font = 'bold 11px system-ui,sans-serif';
          ctx.fillStyle = pointCols[i] || '#374151';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(v, pt.x, pt.y - 8);
          ctx.restore();
        });
      }
    };
    const chart = new Chart(cv, {
      type:'line',
      data:{ labels, datasets:[{
        label:d.name, data:vals, borderColor:'#2563EB', backgroundColor:'rgba(37,99,235,.06)',
        borderWidth:2.5, fill:true, tension:.25,
        pointRadius:5, pointBackgroundColor:pointCols, pointBorderColor:'#fff', pointBorderWidth:2
      }]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false},
          tooltip:{callbacks:{afterLabel:(c)=>{const r=evalIndicator(key,c.parsed.y);return r.status!=='normal'?`⚠ ${r.label}`:'✓ 正常';}}}},
        scales:{ y:{grace:'10%'} }
      },
      plugins:[bandPlugin, labelsPlugin]
    });
    return chart;
  },

  // ---------- Records ----------
  renderRecords() {
    const exams = this.sortedExams().reverse();
    const list = document.getElementById('recList');
    if (!exams.length){ list.innerHTML=`<div class="empty"><div class="ic">🗂</div>暂无报告记录</div>`; return; }
    list.innerHTML = exams.map(e => {
      const c = this.countAbnormal(e);
      return `<div class="rec-card">
        <div>
          <div class="rec-date">${e.date}</div>
          <div class="rec-meta">${e.type||'健康报告'}${e.facility?' · '+e.facility:''}${e.note?' · '+e.note:''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          ${c.total?`<span class="rec-abn">异常 ${c.total} 项</span>`:`<span style="color:var(--normal);font-size:12px;font-weight:600">全部正常</span>`}
          <button class="btn btn-ghost btn-sm" onclick="App.viewRecord('${e.id}')">查看</button>
          <button class="btn btn-ghost btn-sm" onclick="App.editRecord('${e.id}')">编辑</button>
          <button class="btn btn-ghost btn-sm" onclick="App.deleteRecord('${e.id}')" style="color:var(--alert)">删除</button>
        </div>
      </div>`;
    }).join('');
  },

  viewRecord(id) {
    const e = this.data.examinations.find(x=>x.id===id);
    if (!e) return;
    let html = `<h3>${e.date} · ${e.type||'健康报告'}</h3>`;
    if (e.note) html += `<div style="font-size:12.5px;color:var(--text-2);margin-bottom:12px">${e.note}</div>`;
    this.allCategories().forEach(cat => {
      const rows = cat.indicators.filter(i => e.values[i.key]!==undefined && e.values[i.key]!==null).map(i => {
        const r = evalIndicator(i.key, e.values[i.key]);
        return `<tr><td>${this.indName(i.key)}</td><td class="val ${r.status}">${this.fmt(e.values[i.key],i)} ${r.arrow}</td><td class="ref">${refRangeText(i.key)}</td><td><span class="st-pill ${r.status}">${r.label}</span></td></tr>`;
      }).join('');
      if (rows) {
        const col = this.catColor(cat.id);
        html += `<div class="cat-head"><span class="dot" style="background:${col}"></span><span style="color:${col}">${cat.name}</span></div><div class="tbl-wrap"><table class="data"><thead><tr><th>项目</th><th style="text-align:right">结果</th><th>参考范围</th><th>状态</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      if (cat.id==='ultrasound' && e.usNote) {
        html += `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:11px 14px;margin-top:8px;font-size:13px;color:#166534"><b>超声提示：</b>${e.usNote}</div>`;
      }
    });
    // 服药信息
    if ((e.meds && e.meds.length) || e.medNote) {
      const names = (e.meds||[]).map(mid => {
        const m=this.data.medications.find(x=>x.id===mid); if(!m)return null;
        const dose=m.doseAmt||(m.dose||'');
        const usage=(m.freqTimes&&m.freqPills)?` 每日${m.freqTimes}次 每次${m.freqPills}粒`:'';
        return m.name+(dose?' '+dose:'')+usage;
      }).filter(Boolean);
      html += `<div class="cat-head"><span class="dot" style="background:#0EA5E9"></span><span style="color:#0284C7">💊 服药信息</span></div>
        <div style="padding:0 4px">${names.map(n=>`<span class="chip" style="background:#E0F2FE;color:#0369A1;margin:2px 4px 2px 0">${n}</span>`).join('')}${e.medNote?`<div style="margin-top:8px;font-size:13px;color:var(--text-2)">${e.medNote}</div>`:''}</div>`;
    }
    html += `<div style="text-align:right;margin-top:16px"><button class="btn btn-ghost btn-sm" onclick="window.print()">打印</button> <button class="btn btn-ghost btn-sm" onclick="App.closeModal()">关闭</button></div>`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalMask').classList.add('show');
  },

  deleteRecord(id) {
    if (!confirm('确定删除这份报告？此操作不可撤销。')) return;
    this.data.examinations = this.data.examinations.filter(x=>x.id!==id);
    this.save(); this.renderRecords(); this.renderDashboard();
  },

  editRecord(id) {
    const e = this.data.examinations.find(x=>x.id===id);
    if (!e) return;
    this.editingId = id;
    this.draft = JSON.parse(JSON.stringify(e));
    if (!this.draft.usNote) this.draft.usNote = '';
    if (!this.draft.medNote) this.draft.medNote = '';
    if (!Array.isArray(this.draft.meds)) this.draft.meds = [];
    this.go('input');
    this.renderInputForm();
    document.getElementById('inputTitle').textContent = '编辑报告 · ' + e.date;
  },

  // ========== 录入（单页分区 · 模板驱动） ==========
  startInput() {
    this.editingId = null;
    this.draft = { id:'exam_'+Date.now(), date:new Date().toISOString().slice(0,10), facility:'', type:'',
                   note:'', usNote:'', meds:[], medNote:'', values:{}, cpAscites:null, cpEnceph:null };
    document.getElementById('inputTitle').textContent = '录入新报告';
    this.renderInputForm();
  },
  cancelInput() {
    this.draft = null; this.editingId = null;
    this.go('records');
  },
  // 录入显示所有检查类别（内置 + 自定义），填哪个算哪个
  activeCatIds() {
    return this.allCategories().map(c=>c.id);
  },
  renderInputForm() {
    const d = this.draft;
    const commonTypes = this.data.reportTypes || [];
    const cats = this.activeCatIds();
    let html = `<div class="input-bar">
      <div class="jump" id="jumpBar"></div>
      <button class="btn btn-ghost btn-sm" onclick="App.cancelInput()">取消</button>
      <button class="btn btn-primary btn-sm" onclick="App.saveDraft()">💾 保存报告</button>
    </div>`;
    // 基本信息
    html += `<div class="sec" id="sec-basic">
      <div class="sec-head" style="border-left-color:#64748B" onclick="App.toggleSec('sec-basic')">
        <span>📋 基本信息</span><span class="chev">▾</span></div>
      <div class="sec-body"><div class="form-grid">
        <div class="fld"><label>检查日期</label>
          <div class="date-cal-wrap">
            <input type="text" inputmode="numeric" id="f_date" maxlength="10" placeholder="yyyy/mm/dd"
              value="${d.date?d.date.replace(/-/g,'/'):''}"
              onfocus="App.onDateFocus(this)" onclick="App.onDateClick(this)"
              onkeydown="App.onDateKeydown(this,event)" oninput="App.onDateInput(this)">
            <button type="button" class="date-cal-btn" onclick="App.showDatePicker()" title="日历选择">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="17" height="17"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>
            <input type="date" id="f_date_picker" style="position:absolute;opacity:0;pointer-events:none;width:0;height:0" onchange="App.onDatePickerChange(this)">
          </div></div>
        <div class="fld"><label>报告类型 <span class="ref">可自定义</span></label>
          <input list="typeList" id="f_type" value="${d.type||''}" placeholder="输入或选择">
          <datalist id="typeList">${commonTypes.map(t=>`<option value="${t}">`).join('')}</datalist></div>
        <div class="fld"><label>检查机构</label>
          <input list="facList" id="f_facility" value="${d.facility||''}" placeholder="输入或选择">
          <datalist id="facList">${this.data.facilities.map(f=>`<option value="${f}">`).join('')}</datalist></div>
        <div class="fld" style="grid-column:1/-1"><label>备注</label><textarea id="f_note" rows="2" placeholder="本次报告的整体说明（可选）">${d.note||''}</textarea></div>
      </div></div></div>`;
    // 服药信息（紧跟基本信息之后）
    const meds = this.data.medications;
    html += `<div class="sec" id="sec-meds">
      <div class="sec-head" style="border-left-color:#0EA5E9" onclick="App.toggleSec('sec-meds')">
        <span style="color:#0284C7">💊 服药信息</span><span class="chev">▾</span></div>
      <div class="sec-body">
        <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">勾选本次报告期间正在服用的药物：</div>
        <div class="med-checks" id="medChecks">${
          meds.length ? meds.map(m=>{
            const info=[m.doseAmt,m.freqTimes?`每日${m.freqTimes}次`:'',m.freqPills?`每次${m.freqPills}粒`:''].filter(Boolean).join(' ');
            return `<label class="medchk ${d.meds.includes(m.id)?'on':''}"><input type="checkbox" data-med="${m.id}" ${d.meds.includes(m.id)?'checked':''} onchange="this.parentElement.classList.toggle('on',this.checked)"> ${m.name}${info?` <span class="dose">${info}</span>`:''}</label>`;
          }).join('')
            : `<span style="font-size:12.5px;color:var(--text-3)">尚未添加药物，可到「设定 › 药物管理」中添加。</span>`
        }</div>
        <div class="fld" style="margin-top:14px"><label>服药备注</label><textarea id="f_medNote" rows="2" placeholder="如：漏服、剂量调整、副作用等">${d.medNote||''}</textarea></div>
      </div></div>`;
    // 各检查类别（内置 + 自定义，全部显示）
    cats.forEach(cid => {
      const cat = this.catById(cid);
      const col = this.catColor(cat.id);
      html += `<div class="sec" id="sec-${cat.id}">
        <div class="sec-head" style="border-left-color:${col}" onclick="App.toggleSec('sec-${cat.id}')">
          <span style="color:${col}">${cat.name}</span>
          <span class="cnt" id="cnt-${cat.id}"></span><span class="chev">▾</span></div>
        <div class="sec-body">
          <div class="form-grid">${
            cat.indicators.map(i => {
              const v = d.values[i.key];
              return `<div class="fld">
                <label>${this.indName(i.key)}<span class="ref">${refRangeText(i.key)} ${i.unit}</span></label>
                <input type="number" inputmode="decimal" step="any" data-key="${i.key}" value="${v!=null?v:''}" oninput="App.liveCheck(this)" placeholder="${i.unit}">
                <span class="live" id="live_${i.key}"></span></div>`;
            }).join('')
          }</div>
          ${cat.id==='ultrasound' ? `<div class="fld" style="margin-top:16px"><label>超声提示 / 影像所见</label><textarea id="f_usNote" rows="2" placeholder="如：慢性肝损害、脂肪肝、胆囊壁增厚 胆囊壁间结石">${d.usNote||''}</textarea></div>` : ''}
        </div></div>`;
    });

    document.getElementById('inputForm').innerHTML = html;
    // 初始 live 状态
    document.querySelectorAll('#inputForm input[data-key]').forEach(inp => { if (inp.value!=='') this.liveCheck(inp, true); });
    this.updateJumpBar();
  },
  _dateShow(el) {
    const parts = el.value.split('/');
    while (parts.length < 3) parts.push('');
    // 年：右补零（"20" → "2000"）；月/日：左补零（"8" → "08"）
    parts[this._dseg] = this._dseg === 0
      ? this._dbuf.padEnd(4,'0')
      : this._dbuf.padStart(2,'0');
    el.value = parts[0].padEnd(4,'0') + '/' + parts[1].padStart(2,'0') + '/' + parts[2].padStart(2,'0');
  },
  onDateFocus(el) {
    this._dseg = 0; this._dbuf = '';
    setTimeout(() => el.setSelectionRange(0, Math.min(4, el.value.length)), 0);
  },
  onDateClick(el) {
    const p = el.selectionStart;
    const seg = p < 5 ? 0 : p < 8 ? 1 : 2;
    if (seg !== this._dseg) this._dbuf = '';
    this._dseg = seg;
    const si = this._dateSEG[seg];
    setTimeout(() => el.setSelectionRange(si.s, Math.min(si.s + si.len, el.value.length)), 0);
  },
  onDateKeydown(el, ev) {
    const si = this._dateSEG[this._dseg];
    if (/^\d$/.test(ev.key)) {
      ev.preventDefault();
      this._dbuf += ev.key;
      if (this._dbuf.length > si.len) this._dbuf = this._dbuf.slice(-si.len);
      this._dateShow(el);
      if (this._dbuf.length >= si.len) {
        if (this._dseg < 2) {
          this._dseg++; this._dbuf = '';
          const ns = this._dateSEG[this._dseg];
          el.setSelectionRange(ns.s, ns.s + ns.len);
        } else { el.setSelectionRange(si.s + si.len, si.s + si.len); }
      } else { el.setSelectionRange(si.s + this._dbuf.length, si.s + this._dbuf.length); }
    } else if (ev.key === 'Backspace') {
      ev.preventDefault();
      if (this._dbuf.length > 0) {
        this._dbuf = this._dbuf.slice(0,-1);
        this._dateShow(el);
        el.setSelectionRange(si.s + this._dbuf.length, si.s + this._dbuf.length);
      } else if (this._dseg > 0) {
        this._dseg--; this._dbuf = '';
        const ns = this._dateSEG[this._dseg];
        el.setSelectionRange(ns.s, ns.s + ns.len);
      }
    } else if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      if (this._dseg > 0) { this._dseg--; this._dbuf=''; const ns=this._dateSEG[this._dseg]; el.setSelectionRange(ns.s, Math.min(ns.s+ns.len, el.value.length)); }
    } else if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      if (this._dseg<2) { this._dseg++; this._dbuf=''; const ns=this._dateSEG[this._dseg]; el.setSelectionRange(ns.s, Math.min(ns.s+ns.len, el.value.length)); }
    }
  },
  onDateInput(el) {
    // paste 处理
    const digits = el.value.replace(/\D/g,'').slice(0,8);
    let v = digits;
    if (digits.length > 4) v = digits.slice(0,4)+'/'+digits.slice(4);
    if (digits.length > 6) v = digits.slice(0,4)+'/'+digits.slice(4,6)+'/'+digits.slice(6);
    el.value = v; this._dbuf = '';
  },
  showDatePicker() {
    const picker = document.getElementById('f_date_picker');
    if (!picker) return;
    const cur = document.getElementById('f_date')?.value||'';
    const parts = cur.split('/');
    if (parts.length===3 && parts[0].length===4) picker.value = `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
    try { picker.showPicker(); } catch(e) { picker.click(); }
  },
  onDatePickerChange(picker) {
    const el = document.getElementById('f_date');
    if (el && picker.value) { el.value = picker.value.replace(/-/g,'/'); this._dbuf = ''; }
  },
  toggleSec(id){ document.getElementById(id).classList.toggle('collapsed'); },
  scrollToSec(id){ const el=document.getElementById(id); if(el){ el.classList.remove('collapsed'); el.scrollIntoView({behavior:'smooth',block:'start'}); } },
  liveCheck(inp, silent) {
    const key = inp.dataset.key;
    const live = document.getElementById('live_'+key);
    inp.classList.remove('high','low');
    if (inp.value===''){ if(live){live.textContent='';live.className='live';} }
    else {
      const r = evalIndicator(key, inp.value);
      if (r.status==='high'||r.status==='low') inp.classList.add(r.status);
      if (live){ live.className='live '+r.status; live.textContent = r.status==='normal'?'✓ 正常':`${r.arrow} ${r.label}`; }
    }
    if (!silent) this.updateJumpBar();
  },
  secAbnCount(catId) {
    let n=0;
    document.querySelectorAll(`#sec-${catId} input[data-key]`).forEach(inp => {
      if (inp.value==='') return;
      const r = evalIndicator(inp.dataset.key, inp.value);
      if (r.status==='high'||r.status==='low') n++;
    });
    return n;
  },
  secFilledCount(catId) {
    let n=0;
    document.querySelectorAll(`#sec-${catId} input[data-key]`).forEach(inp => { if(inp.value!=='')n++; });
    return n;
  },
  updateJumpBar() {
    const bar = document.getElementById('jumpBar');
    if (!bar) return;
    const cats = this.activeCatIds();
    bar.innerHTML = cats.map(cid => {
      const cat = this.catById(cid);
      const n = this.secAbnCount(cat.id);
      const col = this.catColor(cat.id);
      return `<button class="jbtn" onclick="App.scrollToSec('sec-${cat.id}')"><span style="color:${col}">●</span> ${cat.nameShort}${n?`<span class="n">${n}</span>`:''}</button>`;
    }).join('');
    cats.forEach(cid => {
      const el = document.getElementById('cnt-'+cid);
      if (el){ const f=this.secFilledCount(cid), n=this.secAbnCount(cid);
        el.innerHTML = `${f} 项已填${n?` · <span style="color:var(--alert)">异常 ${n}</span>`:''}`; }
    });
  },
  collectForm() {
    const _dv = (document.getElementById('f_date')?.value||'').trim();
    const _dp = _dv.split('/');
    const _valid = _dp.length===3 && _dp[0].length===4 && parseInt(_dp[1])>=1 && parseInt(_dp[2])>=1;
    this.draft.date = _valid ? `${_dp[0]}-${_dp[1].padStart(2,'0')}-${_dp[2].padStart(2,'0')}` : '';
    this.draft.type = document.getElementById('f_type').value;
    this.draft.facility = document.getElementById('f_facility').value;
    this.draft.note = document.getElementById('f_note').value;
    const us = document.getElementById('f_usNote');
    if (us) this.draft.usNote = us.value;
    const mn = document.getElementById('f_medNote');
    if (mn) this.draft.medNote = mn.value;
    const medChecks = document.querySelectorAll('#medChecks input[data-med]');
    if (medChecks.length) this.draft.meds = [...medChecks].filter(c=>c.checked).map(c=>c.dataset.med);
    // 只更新当前显示的字段，保留未显示分类的已录入值
    document.querySelectorAll('#inputForm input[data-key]').forEach(inp => {
      const k = inp.dataset.key;
      if (inp.value==='') delete this.draft.values[k];
      else this.draft.values[k] = parseFloat(inp.value);
    });
  },
  saveDraft() {
    this.collectForm();
    if (!this.draft.date){ alert('请填写检查日期'); this.scrollToSec('sec-basic'); return; }
    // 新机构自动收录
    if (this.draft.facility && !this.data.facilities.includes(this.draft.facility)) {
      this.data.facilities.push(this.draft.facility);
    }
    if (this.editingId) {
      const idx = this.data.examinations.findIndex(x=>x.id===this.editingId);
      if (idx>=0) this.data.examinations[idx] = this.draft;
    } else {
      this.data.examinations.push(this.draft);
    }
    this.save();
    this.draft=null; this.editingId=null;
    this.go('dashboard');
  },

  // ========== 趋势分析页 ==========
  initTrend() {
    const catSel = document.getElementById('trendCat');
    catSel.innerHTML = this.allCategories().map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
    this.onTrendCatChange();
  },
  onTrendCatChange() {
    const catId = document.getElementById('trendCat').value;
    const cat = this.catById(catId);
    const indSel = document.getElementById('trendInd');
    indSel.innerHTML = cat.indicators.map(i=>`<option value="${i.key}">${this.indName(i.key, true)}</option>`).join('');
    this.renderTrend();
  },
  renderTrend() {
    const key = document.getElementById('trendInd').value;
    if (!key) return;
    document.getElementById('trendRef').textContent = '参考范围 ' + refRangeText(key) + ' ' + INDICATOR_MAP[key].unit;
    if (this.trendChart) { this.trendChart.destroy(); this.trendChart=null; }
    const years = parseInt(document.getElementById('trendRange')?.value || '0');
    const showVals = document.getElementById('trendLabels')?.checked !== false;
    this.trendChart = this.drawTrendChart('trendChart', key, years, showVals);
  },

  // ========== import / export ==========
  exportJSON() {
    this.data.meta = this.data.meta || {};
    this.data.meta.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(this.data,null,2)], {type:'application/json'});
    this.download(blob, `health_report_${new Date().toISOString().slice(0,10)}.json`);
    localStorage.setItem(EXPORT_KEY, Date.now().toString());
    this.checkExportWarn();
  },
  importJSON(){ document.getElementById('fileInput').click(); },
  handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    const rd = new FileReader();
    rd.onload = ev => {
      try {
        const obj = JSON.parse(ev.target.result);
        if (!obj.examinations) throw new Error('格式不符');
        const meds = (obj.medications||[]).length;
        const facs = (obj.facilities||[]).length;
        const ccs  = (obj.customCategories||[]).length;
        const p    = obj.profile?.name ? `（${obj.profile.name}）` : '';
        if (!confirm(
          `即将导入以下数据${p}：\n` +
          `· 检查报告：${obj.examinations.length} 份\n` +
          `· 药物：${meds} 种 ／ 机构：${facs} 个 ／ 自定义类别：${ccs} 个\n\n` +
          `⚠️ 将覆盖当前所有数据（包含设定）。建议先导出备份。`
        )) return;
        this.data = obj;
        this.ensureDefaults();
        this.save();
        this.renderDashboard();
        if (this.currentView === 'settings') this.renderSettings();
        this.go('dashboard');
        alert('导入成功！报告记录和所有设定数据均已恢复。');
      } catch(err){ alert('导入失败：'+err.message); }
    };
    rd.readAsText(file);
    e.target.value='';
  },
  download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=name; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  },
  // 宽表: 每行=指标, 每列=检查日期
  buildMatrix() {
    const exams = this.sortedExams();
    const header = ['分类','项目','单位','参考范围', ...exams.map(e=>e.date)];
    const rows = [header];
    this.allCategories().forEach(cat => {
      cat.indicators.forEach(i => {
        const hasData = exams.some(e => e.values[i.key]!==undefined && e.values[i.key]!==null);
        if (!hasData) return;
        const row = [cat.nameShort, this.indName(i.key, true), i.unit, refRangeText(i.key)];
        exams.forEach(e => {
          const v = e.values[i.key];
          if (v===undefined||v===null){ row.push(''); }
          else { const r=evalIndicator(i.key,v); row.push(r.arrow?`${v} ${r.arrow}`:v); }
        });
        rows.push(row);
      });
    });
    return rows;
  },
  exportCSV() {
    const rows = this.buildMatrix();
    const csv = '﻿' + rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    this.download(new Blob([csv],{type:'text/csv'}), `health_report_${new Date().toISOString().slice(0,10)}.csv`);
  },
  exportExcel() {
    if (typeof XLSX==='undefined'){ alert('Excel库未加载，请检查网络或改用CSV导出'); return; }
    const rows = this.buildMatrix();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = rows[0].map((_,i)=>({wch: i<4?14:12}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '健康报告');
    XLSX.writeFile(wb, `health_report_${new Date().toISOString().slice(0,10)}.xlsx`);
  },

  // ========== 导出提醒（30天） ==========
  checkExportWarn() {
    const box = document.getElementById('exportWarn');
    if (!box) return;
    const last = localStorage.getItem(EXPORT_KEY);
    const days = last ? Math.floor((Date.now()-parseInt(last))/86400000) : null;
    if (days === null) {
      box.innerHTML = `<div class="warn-banner"><span>⚠️ 尚未备份过数据。所有记录仅保存在本浏览器中，一旦清除缓存或更换设备就会丢失，建议现在就导出一份 JSON 备份。</span><button class="btn btn-primary btn-sm" onclick="App.exportJSON()">立即备份</button></div>`;
    } else if (days >= 30) {
      box.innerHTML = `<div class="warn-banner"><span>⚠️ 距上次备份已过去 ${days} 天。为防止数据意外丢失，建议重新导出一份 JSON 备份。</span><button class="btn btn-primary btn-sm" onclick="App.exportJSON()">立即备份</button></div>`;
    } else { box.innerHTML=''; }
  },

  // ========== 设定页 ==========
  renderSettings() {
    const d = this.data, p = d.profile;
    const genders = { male:'男', female:'女', other:'其他' };
    let bmiText = '';
    if (p.height && p.weight) bmiText = `BMI ≈ ${(p.weight/Math.pow(p.height/100,2)).toFixed(1)}`;

    let html = '';
    // 1. 患者基础信息
    html += `<div class="card">
      <div class="card-title"><span class="dot"></span>患者基础信息</div>
      <div class="form-grid">
        <div class="fld"><label>姓名</label><input class="inp" id="p_name" value="${p.name||''}"></div>
        <div class="fld"><label>性别</label><select id="p_gender">${Object.entries(genders).map(([k,v])=>`<option value="${k}" ${p.gender===k?'selected':''}>${v}</option>`).join('')}</select></div>
        <div class="fld"><label>出生年</label><input class="inp" type="number" id="p_birthYear" value="${p.birthYear||''}" placeholder="如 1985"></div>
        <div class="fld"><label>身高 (cm)</label><input class="inp" type="number" step="any" id="p_height" value="${p.height||''}"></div>
        <div class="fld"><label>体重 (kg)</label><input class="inp" type="number" step="any" id="p_weight" value="${p.weight||''}"></div>
        <div class="fld"><label>血型</label><input class="inp" id="p_bloodType" value="${p.bloodType||''}" placeholder="如 A / O / Rh+"></div>
        <div class="fld"><label>复查间隔 (月)</label><input class="inp" type="number" id="p_recheckMonths" value="${p.recheckMonths||6}" placeholder="6"></div>
        <div class="fld" style="grid-column:1/-1"><label>健康备注</label><textarea id="p_note" rows="2" placeholder="既往病史、过敏、家族史等">${p.note||''}</textarea></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
        <span style="font-size:13px;color:var(--primary);font-weight:700">${bmiText}</span>
        <button class="btn btn-primary btn-sm" onclick="App.saveProfile()">保存信息</button>
      </div>
    </div>`;

    // 2. 机构管理
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#059669"></span>检查机构管理</div>
      <div id="facTags" class="tag-list">${
        d.facilities.length ? d.facilities.map((f,i)=>`<span class="tag">${f}<button onclick="App.delFacility(${i})">×</button></span>`).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无机构，录入报告填写后会自动收录</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="inp" id="newFac" placeholder="添加机构名" style="flex:1" onkeydown="if(event.key==='Enter')App.addFacility()">
        <button class="btn btn-ghost btn-sm" onclick="App.addFacility()">添加</button>
      </div>
    </div>`;

    // 3. 报告类型管理
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0D9488"></span>报告类型管理 <span class="badge">录入报告时的下拉选项</span></div>
      <div id="rtTags" class="tag-list">${
        (d.reportTypes||[]).length
          ? d.reportTypes.map((t,i)=>`<span class="tag">${t}<button onclick="App.delReportType(${i})">×</button></span>`).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无类型</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="inp" id="newRT" placeholder="添加报告类型名称" style="flex:1" onkeydown="if(event.key==='Enter')App.addReportType()">
        <button class="btn btn-ghost btn-sm" onclick="App.addReportType()">添加</button>
      </div>
    </div>`;

    // 4. 药物管理
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0EA5E9"></span>药物管理 <span class="badge">录入报告时可勾选</span></div>
      <div id="medList">${
        d.medications.length ? d.medications.map(m=>{
          const dispDose = m.doseAmt||'';
          const dispUsage = (m.freqTimes||m.freqPills) ? `每日${m.freqTimes||1}次 每次${m.freqPills||1}粒` : '';
          if (this.editingMedId===m.id) {
            return `<div class="med-row editing">
              <div style="flex:1"><div class="form-grid" style="gap:8px">
                <div class="fld"><label>药物名称</label><input class="inp" id="medit_name" value="${m.name}"></div>
                <div class="fld"><label>每粒剂量</label><input class="inp" id="medit_doseAmt" value="${m.doseAmt||''}" placeholder="如 0.5mg"></div>
                <div class="fld"><label>每日次数</label><input class="inp" type="number" id="medit_freqTimes" value="${m.freqTimes||1}" min="1"></div>
                <div class="fld"><label>每次粒数</label><input class="inp" type="number" id="medit_freqPills" value="${m.freqPills||1}" min="1"></div>
                <div class="fld"><label>备注</label><input class="inp" id="medit_note" value="${m.note||''}" placeholder="可选"></div>
              </div></div>
              <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
                <button class="btn btn-primary btn-sm" onclick="App.saveMedication('${m.id}')">保存</button>
                <button class="btn btn-ghost btn-sm" onclick="App.cancelEditMedication()">取消</button>
              </div>
            </div>`;
          }
          return `<div class="med-row">
            <div><b>${m.name}</b>${dispDose?` <span class="dose">${dispDose}</span>`:''}${dispUsage?` <span class="usage">${dispUsage}</span>`:''}${m.note?`<div style="font-size:12px;color:var(--text-2);margin-top:2px">${m.note}</div>`:''}</div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" onclick="App.editMedication('${m.id}')">编辑</button>
              <button class="btn btn-ghost btn-sm" style="color:var(--alert)" onclick="App.delMedication('${m.id}')">删除</button>
            </div>
          </div>`;
        }).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无药物</span>'
      }</div>
      <div class="form-grid" style="margin-top:14px">
        <div class="fld"><label>药物名称</label><input class="inp" id="med_name" placeholder="如 恩替卡韦"></div>
        <div class="fld"><label>每粒剂量</label><input class="inp" id="med_doseAmt" placeholder="如 0.5mg"></div>
        <div class="fld"><label>每日次数</label><input class="inp" type="number" id="med_freqTimes" value="1" min="1"></div>
        <div class="fld"><label>每次粒数</label><input class="inp" type="number" id="med_freqPills" value="1" min="1"></div>
        <div class="fld"><label>备注</label><input class="inp" id="med_note" placeholder="可选"></div>
      </div>
      <div style="text-align:right;margin-top:10px"><button class="btn btn-ghost btn-sm" onclick="App.addMedication()">＋ 添加药物</button></div>
    </div>`;

    // 4. 自定义检查类别
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#6366F1"></span>自定义检查类别 <span class="badge">新增系统没有的检查（如电解质：血磷、血钙…）</span></div>
      <div id="ccList">${
        d.customCategories.length ? d.customCategories.map(cat=>{
          const col = cat.color || '#6366F1';
          return `<div class="tpl-box" style="border-left:4px solid ${col}">
            <div class="tpl-head">
              <input class="inp tpl-name" value="${cat.name}" style="color:${col}" onchange="App.renameCustomCategory('${cat.id}',this.value)">
              <button class="btn btn-ghost btn-sm" style="color:var(--alert)" onclick="App.delCustomCategory('${cat.id}')">删除类别</button>
            </div>
            <div class="tbl-wrap"><table class="data"><thead><tr><th>项目名</th><th>单位</th><th>下限</th><th>上限</th><th>小数</th><th></th></tr></thead><tbody>
              ${cat.indicators.length ? cat.indicators.map(i=>{
                const isEdit = this.editingCustomInd && this.editingCustomInd.catId===cat.id && this.editingCustomInd.key===i.key;
                if (isEdit) return `<tr style="background:#EFF6FF">
                  <td><input class="inp" id="ciedit_name" value="${i.name}" style="width:100%;min-width:80px;padding:4px 7px;font-size:13px"></td>
                  <td><input class="inp" id="ciedit_unit" value="${i.unit||''}" style="width:70px;padding:4px 7px;font-size:13px"></td>
                  <td><input class="inp" type="number" id="ciedit_min" value="${i.min!=null?i.min:''}" step="any" style="width:70px;padding:4px 7px;font-size:13px"></td>
                  <td><input class="inp" type="number" id="ciedit_max" value="${i.max!=null?i.max:''}" step="any" style="width:70px;padding:4px 7px;font-size:13px"></td>
                  <td><input class="inp" type="number" id="ciedit_dec" value="${i.decimals!=null?i.decimals:1}" style="width:50px;padding:4px 7px;font-size:13px"></td>
                  <td style="text-align:right;white-space:nowrap">
                    <button class="btn btn-primary btn-sm" style="padding:4px 10px" onclick="App.saveCustomIndicator('${cat.id}','${i.key}')">保存</button>
                    <button class="btn btn-ghost btn-sm" style="padding:4px 8px" onclick="App.cancelEditCustomInd()">取消</button>
                  </td></tr>`;
                return `<tr>
                  <td>${i.name}</td><td>${i.unit||'—'}</td><td>${i.min!=null?i.min:'—'}</td><td>${i.max!=null?i.max:'—'}</td><td>${i.decimals!=null?i.decimals:1}</td>
                  <td style="text-align:right;white-space:nowrap">
                    <button class="btn btn-ghost btn-sm" style="padding:3px 9px" onclick="App.editCustomInd('${cat.id}','${i.key}')">编辑</button>
                    <button class="btn btn-ghost btn-sm" style="color:var(--alert);padding:3px 9px" onclick="App.delCustomIndicator('${cat.id}','${i.key}')">×</button>
                  </td></tr>`;
              }).join('') : '<tr><td colspan="6" style="color:var(--text-3);text-align:center">暂无项目，在下方添加</td></tr>'}
            </tbody></table></div>
            <div class="cc-add">
              <input class="inp" placeholder="项目名 *" data-f="name">
              <input class="inp" placeholder="单位" data-f="unit">
              <input class="inp" type="number" step="any" placeholder="下限" data-f="min">
              <input class="inp" type="number" step="any" placeholder="上限" data-f="max">
              <input class="inp" type="number" placeholder="小数" data-f="decimals" value="1">
              <button class="btn btn-ghost btn-sm" onclick="App.addCustomIndicator('${cat.id}',this)">＋ 加项目</button>
            </div>
          </div>`;
        }).join('') : '<span style="color:var(--text-3);font-size:13px">还没有自定义类别。例如新建「电解质」类别，再往里加「血磷」「血钙」等项目（含单位和参考范围），录入报告时就会自动出现该分区。</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="inp" id="newCC" placeholder="新类别名称（如 电解质）" style="flex:1" onkeydown="if(event.key==='Enter')App.addCustomCategory()">
        <button class="btn btn-primary btn-sm" onclick="App.addCustomCategory()">＋ 新建类别</button>
      </div>
    </div>`;

    // 5. 检查类别显示顺序
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0EA5E9"></span>检查类别显示顺序 <span class="badge">影响录入、概览、趋势等所有页面</span></div>
      <div class="cat-order-list">${
        this.allCategories().map((cat, i, arr) => {
          const col = this.catColor(cat.id);
          return `<div class="cat-order-row">
            <span class="cat-order-dot" style="background:${col}"></span>
            <span class="cat-order-name">${cat.name}</span>
            <div class="cat-order-btns">
              <button class="co-btn" ${i===0?'disabled':''} onclick="App.moveCat('${cat.id}',-1)">↑</button>
              <button class="co-btn" ${i===arr.length-1?'disabled':''} onclick="App.moveCat('${cat.id}',1)">↓</button>
            </div>
          </div>`;
        }).join('')
      }</div>
    </div>`;

    // 6. 数据管理
    const lastExp = localStorage.getItem(EXPORT_KEY);
    const lastExpText = lastExp
      ? `上次导出：${new Date(parseInt(lastExp)).toLocaleDateString('zh-CN')}`
      : '尚未导出过备份';
    html += `<div class="card">
      <div class="card-title"><span class="dot" style="background:#6366F1"></span>数据管理 <span class="badge">JSON 包含所有报告 + 设定数据</span></div>
      <div style="font-size:13px;color:var(--text-2);margin-bottom:16px;line-height:1.7">
        导出的 JSON 文件包含：<b>全部检查报告、患者信息、药物设定、机构列表、自定义检查类别</b>。<br>
        建议定期导出备份，更换设备时导入即可完整恢复。<br>
        <span style="font-size:12px;color:var(--text-3)">${lastExpText}</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="App.exportJSON()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          导出 JSON
        </button>
        <button class="btn btn-ghost" onclick="App.importJSON()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          导入 JSON
        </button>
      </div>
    </div>`;

    document.getElementById('settingsBody').innerHTML = html;
  },
  saveProfile() {
    const g = id => document.getElementById(id).value;
    const p = this.data.profile;
    p.name=g('p_name'); p.gender=g('p_gender'); p.birthYear=g('p_birthYear');
    p.height=g('p_height'); p.weight=g('p_weight'); p.bloodType=g('p_bloodType'); p.note=g('p_note');
    p.recheckMonths=g('p_recheckMonths')||6;
    this.save(); this.renderSettings(); this.renderDashboard();
  },
  addReportType() {
    const el=document.getElementById('newRT'), v=el.value.trim();
    if (!v) return;
    if (!this.data.reportTypes.includes(v)) this.data.reportTypes.push(v);
    el.value='';
    this.save(); this.renderSettings();
  },
  delReportType(i) {
    this.data.reportTypes.splice(i,1);
    this.save(); this.renderSettings();
  },
  addFacility() {
    const el=document.getElementById('newFac'), v=el.value.trim();
    if (!v) return;
    if (!this.data.facilities.includes(v)) this.data.facilities.push(v);
    this.save(); this.renderSettings();
    const fl=document.getElementById('facList');
    if (fl) fl.innerHTML=this.data.facilities.map(f=>`<option value="${f}">`).join('');
  },
  delFacility(i) {
    this.data.facilities.splice(i,1); this.save(); this.renderSettings();
    const fl=document.getElementById('facList');
    if (fl) fl.innerHTML=this.data.facilities.map(f=>`<option value="${f}">`).join('');
  },
  _refreshMedChecks() {
    const mc=document.getElementById('medChecks');
    if (!mc||!this.draft) return;
    const d=this.draft;
    mc.innerHTML = this.data.medications.length ? this.data.medications.map(m=>{
      const info=[m.doseAmt,m.freqTimes?`每日${m.freqTimes}次`:'',[m.freqPills?`每次${m.freqPills}粒`:'']].flat().filter(Boolean).join(' ');
      return `<label class="medchk ${d.meds.includes(m.id)?'on':''}"><input type="checkbox" data-med="${m.id}" ${d.meds.includes(m.id)?'checked':''} onchange="this.parentElement.classList.toggle('on',this.checked)"> ${m.name}${info?` <span class="dose">${info}</span>`:''}</label>`;
    }).join('') : '<span style="font-size:12.5px;color:var(--text-3)">尚未添加药物，可到「设定 › 药物管理」中添加。</span>';
  },
  addMedication() {
    const name=document.getElementById('med_name').value.trim();
    if (!name){ alert('请输入药物名称'); return; }
    this.data.medications.push({
      id:'med_'+Date.now(), name,
      doseAmt: document.getElementById('med_doseAmt')?.value.trim()||'',
      freqTimes: parseInt(document.getElementById('med_freqTimes')?.value)||1,
      freqPills: parseInt(document.getElementById('med_freqPills')?.value)||1,
      note: document.getElementById('med_note').value.trim()
    });
    this.save(); this.renderSettings(); this._refreshMedChecks();
  },
  editMedication(id) { this.editingMedId=id; this.renderSettings(); },
  cancelEditMedication() { this.editingMedId=null; this.renderSettings(); },
  saveMedication(id) {
    const m=this.data.medications.find(x=>x.id===id);
    if (!m) return;
    const g=eid=>document.getElementById(eid)?.value?.trim()||'';
    m.name=g('medit_name')||m.name;
    m.doseAmt=g('medit_doseAmt');
    m.freqTimes=parseInt(document.getElementById('medit_freqTimes')?.value)||1;
    m.freqPills=parseInt(document.getElementById('medit_freqPills')?.value)||1;
    m.note=g('medit_note');
    this.editingMedId=null;
    this.save(); this.renderSettings(); this._refreshMedChecks();
  },
  delMedication(id) {
    if (!confirm('删除该药物？')) return;
    this.data.medications = this.data.medications.filter(m=>m.id!==id);
    this.save(); this.renderSettings(); this._refreshMedChecks();
  },
  moveCat(id, dir) {
    const order = this.data.catOrder;
    const i = order.indexOf(id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    this.save(); this.renderSettings();
  },
  addCustomCategory() {
    const name=document.getElementById('newCC').value.trim();
    if (!name){ alert('请输入类别名称'); return; }
    const palette=['#6366F1','#DB2777','#0D9488','#CA8A04','#9333EA','#0EA5E9','#DC2626'];
    const color=palette[this.data.customCategories.length % palette.length];
    const newCat = { id:'cc_'+Date.now(), name, nameShort:name, color, custom:true, indicators:[] };
    this.data.customCategories.push(newCat);
    if (this.data.catOrder) this.data.catOrder.push(newCat.id);
    this.save(); this.renderSettings();
  },
  delCustomCategory(id) {
    if (!confirm('删除该类别及其项目定义？（已录入的历史数值不会被删除，但将不再显示）')) return;
    const cat=this.data.customCategories.find(c=>c.id===id);
    if (cat) cat.indicators.forEach(i=>{ delete INDICATOR_MAP[i.key]; });
    this.data.customCategories=this.data.customCategories.filter(c=>c.id!==id);
    if (this.data.catOrder) this.data.catOrder=this.data.catOrder.filter(x=>x!==id);
    this.save(); this.renderSettings();
  },
  renameCustomCategory(id, val) {
    const c=this.data.customCategories.find(x=>x.id===id);
    if (c){ c.name=val.trim()||c.name; c.nameShort=c.name; this.registerCustom(); this.save(); this.renderDashboard(); }
  },
  addCustomIndicator(catId, btn) {
    const box=btn.closest('.cc-add');
    const g=f=>box.querySelector(`[data-f="${f}"]`).value.trim();
    const name=g('name');
    if (!name){ alert('请输入项目名'); return; }
    const min=g('min'), max=g('max'), dec=g('decimals');
    const cat=this.data.customCategories.find(c=>c.id===catId);
    if (!cat) return;
    cat.indicators.push({
      key:'ck_'+Date.now(), name, unit:g('unit'),
      min: min===''?null:parseFloat(min), max: max===''?null:parseFloat(max),
      decimals: dec===''?1:parseInt(dec)
    });
    this.registerCustom();
    this.save(); this.renderSettings();
  },
  editCustomInd(catId, key) { this.editingCustomInd={catId,key}; this.renderSettings(); },
  cancelEditCustomInd() { this.editingCustomInd=null; this.renderSettings(); },
  saveCustomIndicator(catId, key) {
    const cat=this.data.customCategories.find(c=>c.id===catId);
    if (!cat) return;
    const ind=cat.indicators.find(i=>i.key===key);
    if (!ind) return;
    const g=id=>document.getElementById(id)?.value?.trim();
    ind.name = g('ciedit_name')||ind.name;
    ind.unit = g('ciedit_unit');
    const mn=g('ciedit_min'), mx=g('ciedit_max'), dc=g('ciedit_dec');
    ind.min = mn===''||mn==null ? null : parseFloat(mn);
    ind.max = mx===''||mx==null ? null : parseFloat(mx);
    ind.decimals = dc===''||dc==null ? 1 : parseInt(dc);
    this.editingCustomInd=null;
    this.registerCustom();
    this.save(); this.renderSettings();
  },
  delCustomIndicator(catId, key) {
    const cat=this.data.customCategories.find(c=>c.id===catId);
    if (cat) cat.indicators=cat.indicators.filter(i=>i.key!==key);
    delete INDICATOR_MAP[key];
    this.save(); this.renderSettings();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
