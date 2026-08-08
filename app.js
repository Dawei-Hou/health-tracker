// ===== Health Tracker 核心逻辑 =====
const STORE_KEY = 'health_tracker_cache_v2';
const EXPORT_KEY = 'health_tracker_last_export';
// 分类主题色（与 CSS 变量对应）
const CAT_COLOR = { biochem:'#2563EB', cbc:'#E11D48', hbv_panel:'#7C3AED', hbv_rna:'#EA580C', fibroscan:'#0891B2', ultrasound:'#059669', hcc_triple:'#B45309', estradiol:'#DB2777', phosphorus:'#0D9488', hbc_igm:'#9333EA' };

// 现代线性图标（Lucide 风格，stroke）
const ICONS = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  trend:'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  folder:'<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  sun:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  close:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  chevrons:'<polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/>',
  sheet:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'
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
  // 肝癌三联检
  AFP:'AFP', AFP_L3:'AFP-L3', AFP_L3_R:'AFP-L3%', DCP:'DCP',
  // 雌二醇
  E2:'E2',
};
function displayAbbr(key){ return ABBR_MAP[key]||null; }

const App = {
  data: null,
  currentView: 'dashboard',
  trendChart: null,
  editingId: null,
  editingMedId: null,
  editingCustomInd: null,
  settingsTab: 'personal',
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
    // 应用设置（重点指标覆盖 / 概览页模块显隐 / 备份提醒周期）
    d.settings = d.settings || {};
    d.settings.focusOverrides = d.settings.focusOverrides || {};
    d.settings.show = Object.assign({ score:true, consec:true, hbv:true, focus:true }, d.settings.show || {});
    if (!('backupDays' in d.settings)) d.settings.backupDays = 30;
    d.profile = d.profile || {};
    ['name','gender','birthYear','height','weight','bloodType','note'].forEach(k => { if (!(k in d.profile)) d.profile[k]=''; });
    if (!d.profile.recheckMonths) d.profile.recheckMonths = 6;
    if (!Array.isArray(d.facilities)) d.facilities = [];
    // 机构迁移：字符串 → {name, doctor}，并按名去重（有医生的优先保留）
    const _facByName = {};
    d.facilities.forEach(f0 => {
      const f = typeof f0 === 'string' ? { name:f0, doctor:'' } : { name:f0.name||'', doctor:f0.doctor||'' };
      if (!f.name) return;
      if (!_facByName[f.name]) _facByName[f.name] = f;
      else if (f.doctor && !_facByName[f.name].doctor) _facByName[f.name].doctor = f.doctor;
    });
    d.facilities = Object.values(_facByName);
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
      // 迁移旧版脾厚字段
      if ('SPLEEN_T' in e.values && !('SP_SUP_T' in e.values)) {
        e.values['SP_SUP_T'] = e.values['SPLEEN_T'];
        delete e.values['SPLEEN_T'];
      }
    });
    // 样本报告机构自动收录
    (d.examinations||[]).forEach(e => { if (e.facility && !d.facilities.some(f=>f.name===e.facility)) d.facilities.push({ name:e.facility, doctor:'' }); });
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
  // 轻量 Toast 提示（success / error / info），数秒后自动关闭
  toast(msg, type='success', ms=2600) {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    const ic = type==='error' ? '✕' : type==='info' ? 'i' : '✓';
    el.innerHTML = `<span class="tc-ic">${ic}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    const remove = () => { el.classList.add('out'); setTimeout(()=>el.remove(), 260); };
    const timer = setTimeout(remove, ms);
    el.addEventListener('click', () => { clearTimeout(timer); remove(); });
  },

  sortedExams() {
    return [...this.data.examinations].sort((a,b) => a.date.localeCompare(b.date));
  },
  latestExam() {
    const s = this.sortedExams();
    return s.length ? s[s.length-1] : null;
  },
  facilityNames() { return (this.data.facilities||[]).map(f => f.name); },
  facilityDoctor(name) {
    const f = (this.data.facilities||[]).find(x => x.name === name);
    return f && f.doctor ? f.doctor : '';
  },
  // 重点指标：用户覆盖优先，否则用指标内置 focus
  isFocus(key) {
    const ov = this.data.settings && this.data.settings.focusOverrides;
    if (ov && key in ov) return !!ov[key];
    const def = INDICATOR_MAP[key];
    return !!(def && def.focus);
  },
  toggleFocus(key) {
    this.data.settings.focusOverrides[key] = !this.isFocus(key);
    this.save(); this.renderSettings(); this.renderDashboard();
  },
  toggleShow(key, val) {
    this.data.settings.show[key] = !!val;
    this.save(); this.renderSettings(); this.renderDashboard();
  },
  setBackupDays(v) {
    this.data.settings.backupDays = parseInt(v) || 0;
    this.save(); this.checkExportWarn();
  },
  resetAllData() {
    if (!confirm('确定清空所有数据？此操作不可撤销！\n\n强烈建议先「导出 JSON」备份。')) return;
    if (!confirm('再次确认：真的要删除全部报告和设置吗？')) return;
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(EXPORT_KEY);
    this.data = { examinations:[], facilities:[], medications:[], customCategories:[] };
    this.ensureDefaults();
    this.save();
    this.settingsTab = 'data';
    this.renderAll(); this.renderSettings(); this.checkExportWarn();
    this.go('dashboard');
    this.toast('已清空所有数据', 'info', 3000);
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

  // ---------- 乙肝五项自动判读 ----------
  interpretHBV(exam) {
    if (!exam) return null;
    const mk = ['HBsAg','HBeAg','AntiHBs','AntiHBe','AntiHBc'];
    const pos = {}; let have = 0;
    mk.forEach(k => {
      const v = exam.values[k];
      if (v == null) { pos[k] = null; return; }
      have++;
      const def = INDICATOR_MAP[k];
      const st = evalIndicator(k, v).status;
      // 常规标志物：高于上限=阳性；e抗体等 inverted 标志物：达到下限(status normal)=阳性
      pos[k] = def && def.inverted ? (st === 'normal') : (st === 'high');
    });
    if (have < 3) return null; // 数据不足，不判读
    const { HBsAg, HBeAg, AntiHBs, AntiHBe, AntiHBc } = pos;
    if (HBsAg) {
      if (HBeAg) return { label:'大三阳', level:'danger',
        desc:'表面抗原、e抗原、核心抗体阳性。提示病毒复制活跃、传染性较强，应定期监测 HBV-DNA、肝功能与影像，遵医嘱抗病毒治疗。' };
      // 表面抗原阳性、e抗原阴性 → 小三阳（含 e抗体阴性的变异型）
      return { label:'小三阳', level:'warn',
        desc: AntiHBe
          ? '表面抗原、e抗体、核心抗体阳性。通常病毒复制减弱，仍需定期随访 HBV-DNA 与肝功能，警惕病情活动。'
          : '表面抗原、核心抗体阳性，e抗原及e抗体阴性。提示现症感染、e系统转换中，需定期随访 HBV-DNA 与肝功能。' };
    }
    if (AntiHBs) {
      if (AntiHBc) return { label:'既往感染康复', level:'ok',
        desc:'表面抗体与核心抗体阳性、表面抗原阴性。提示曾感染乙肝并已恢复，目前具有免疫力。' };
      return { label:'已获免疫', level:'ok',
        desc:'仅表面抗体阳性，通常为疫苗接种后产生保护性抗体，具有免疫力。' };
    }
    if (AntiHBc) return { label:'核心抗体阳性', level:'info',
      desc:'核心抗体阳性、表面抗原与表面抗体阴性。可能为既往感染或窗口期，建议复查 HBV-DNA 明确。' };
    return { label:'五项阴性', level:'info',
      desc:'乙肝五项均为阴性，未感染且无保护性抗体，建议接种乙肝疫苗以获得免疫。' };
  },
  _renderHbvInterpret() {
    const box = document.getElementById('hbvInterpret');
    if (!box) return;
    const exam = this.latestExam();
    const res = exam ? this.interpretHBV(exam) : null;
    if (!res) { box.innerHTML = ''; return; }
    const order = [['HBsAg','表面抗原'],['AntiHBs','表面抗体'],['HBeAg','e抗原'],['AntiHBe','e抗体'],['AntiHBc','核心抗体']];
    const chips = order.map(([k,nm]) => {
      const v = exam.values[k];
      if (v == null) return '';
      const p = evalIndicator(k, v).status === 'high';
      return `<span class="hi-mk ${p?'pos':'neg'}">${nm} ${p?'＋':'－'}</span>`;
    }).filter(Boolean).join('');
    box.innerHTML = `<div class="hbv-interp">
      <div class="hi-head"><span class="hi-badge ${res.level}">${res.label}</span><span class="hi-title">乙肝五项判读 · ${exam.date}</span></div>
      <div class="hi-desc">${res.desc}</div>
      <div class="hi-pattern">${chips}</div>
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
      const _hb=document.getElementById('hbvInterpret'); if(_hb) _hb.innerHTML='';
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
      ? `<div class="tips-title">关注指标（偏高/偏低）</div><ul class="tips-list">${abn5.map(a=>{const def=INDICATOR_MAP[a.k];return `<li class="${a.r.status}">${this.indName(a.k)} <b>${a.v} ${def.unit}</b> <span class="ts-flag">${a.r.arrow} ${a.r.label}</span></li>`;}).join('')}</ul>`
      : `<div class="tips-ok">全部重点指标处于正常范围</div>`;

    const show = this.data.settings.show;
    const scoreCard = show.score ? `
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
      </div>` : '';
    hero.innerHTML = `
      <div class="hero">
        <div class="date-line">最新报告：${exam.date}　·　距今 ${days} 天${exam.type?'　· '+exam.type:''}</div>
        <div class="stat-row">
          <div class="stat"><div class="n">${normal}</div><div class="l">✓ 正常</div></div>
          <div class="stat"><div class="n" style="color:#FCA5A5">${c.high}</div><div class="l">↑ 偏高</div></div>
          <div class="stat"><div class="n" style="color:#BFDBFE">${c.low}</div><div class="l">↓ 偏低</div></div>
        </div>
        <div class="abn-list">${chips}</div>
      </div>${scoreCard}`;

    // Small multiples: 重点指标（按检查类别分组）
    const exams = this.sortedExams();
    const grid = document.getElementById('smGrid');
    let totalFocus = 0, cardsHtml = '';
    const drawKeys = [];
    // 打散成一张密集网格：所有重点指标按类别顺序流式排布，单指标类别不再独占整行
    this.allCategories().forEach(cat => {
      const fk = cat.indicators.filter(i => this.isFocus(i.key) && exam.values[i.key]!==undefined && exam.values[i.key]!==null);
      if (!fk.length) return;
      const col = this.catColor(cat.id);
      totalFocus += fk.length;
      cardsHtml += fk.map(def => {
        const k=def.key, v=exam.values[k], r=evalIndicator(k,v);
        drawKeys.push(k);
        return `<div class="sm-card ${r.status}" onclick="App.showDetail('${k}')">
          <div class="sm-tag" style="color:${col}"><span class="dot" style="background:${col}"></span>${cat.nameShort}</div>
          <div class="k" title="${this.indName(k,true)}">${this.indName(k)}</div>
          <div class="v">${this.fmt(v,def)}<span class="arw">${r.arrow}</span><span class="u">${def.unit}</span></div>
          <div class="spark-box"><canvas id="spark_${k}"></canvas></div>
        </div>`;
      }).join('');
    });
    grid.innerHTML = cardsHtml ? `<div class="sm-grid">${cardsHtml}</div>` : '<div class="empty" style="padding:24px">最新报告暂无重点指标数据</div>';
    document.getElementById('smCount').textContent = totalFocus + '项';
    const _ca=document.getElementById('consecAlert'); if(_ca) _ca.innerHTML = show.consec ? this._renderConsecAlert() : '';
    if (show.hbv) { this._renderHbvInterpret(); } else { const _hb=document.getElementById('hbvInterpret'); if(_hb) _hb.innerHTML=''; }
    const _fc=document.getElementById('focusCard'); if(_fc) _fc.style.display = show.focus ? '' : 'none';
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
      <div style="text-align:right;margin-top:14px"><button class="btn btn-ghost btn-sm" onclick="App.closeModal()">${svgIcon('close')}关闭</button></div>`;
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
    // 病毒载量类（sci 标记）用对数轴；0 视为「未检出」，绘制在检出下限位置
    const isLog = !!d.sci;
    const FLOOR = 1;
    const plotVals = vals.map(v => (isLog && v<=0) ? FLOOR : v);
    const dispVals = vals.map(v => (isLog && v<=0) ? '未检出' : this.fmt(v, d));
    const pointCols = exams.map(e => {
      const r = evalIndicator(key, e.values[key]);
      return r.status==='high'?'#DC2626':r.status==='low'?'#2563EB':'#16A34A';
    });
    const bandPlugin = {
      id:'refband',
      beforeDatasetsDraw(chart){
        if (isLog) return;                       // 对数轴不画参考带
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
        dispVals.forEach((txt, i) => {
          const pt = meta.data[i]; if (!pt) return;
          ctx.save();
          ctx.font = 'bold 11px system-ui,sans-serif';
          ctx.fillStyle = pointCols[i] || '#374151';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(txt, pt.x, pt.y - 8);
          ctx.restore();
        });
      }
    };
    const yScale = isLog
      ? { type:'logarithmic', min:FLOOR,
          ticks:{ callback:(v)=>{ if(v===FLOOR) return '未检出'; const lg=Math.log10(v);
            return Number.isInteger(lg) ? (v>=1000 ? v.toExponential(0) : v) : ''; } } }
      : { grace:'10%' };
    const chart = new Chart(cv, {
      type:'line',
      data:{ labels, datasets:[{
        label:d.name, data:plotVals, borderColor:'#2563EB', backgroundColor:'rgba(37,99,235,.06)',
        borderWidth:2.5, fill:!isLog, tension:.25,
        pointRadius:5, pointBackgroundColor:pointCols, pointBorderColor:'#fff', pointBorderWidth:2
      }]},
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{display:false},
          tooltip:{callbacks:{
            label:(c)=>`${d.name}: ${dispVals[c.dataIndex]} ${d.unit}`,
            afterLabel:(c)=>{const r=evalIndicator(key,vals[c.dataIndex]);return r.status!=='normal'?`⚠ ${r.label}`:'✓ 正常';}}}},
        scales:{ y:yScale }
      },
      plugins:[bandPlugin, labelsPlugin]
    });
    return chart;
  },

  // ---------- Records ----------
  _recFilterBounds() {
    const f = this.recFilter;
    const now = new Date();
    const iso = d => d.toISOString().slice(0,10);
    if (f.preset==='year') return { from:`${now.getFullYear()}-01-01`, to:'' };
    if (f.preset==='1y')   { const d=new Date(now); d.setFullYear(d.getFullYear()-1); return { from:iso(d), to:'' }; }
    if (f.preset==='3y')   { const d=new Date(now); d.setFullYear(d.getFullYear()-3); return { from:iso(d), to:'' }; }
    if (f.preset==='custom') return { from:f.from||'', to:f.to||'' };
    return { from:'', to:'' }; // all
  },
  renderRecords() {
    if (!this.recFilter) this.recFilter = { preset:'all', from:'', to:'', facility:'', type:'', abnOnly:false, sortDesc:true };
    const f = this.recFilter;
    const filterBox = document.getElementById('recFilter');
    const list = document.getElementById('recList');
    const total = this.data.examinations.length;
    if (!total){ if(filterBox) filterBox.innerHTML=''; list.innerHTML=`<div class="empty"><div class="ic">🗂</div>暂无报告记录</div>`; return; }

    // 选项来源
    const facs  = [...new Set(this.data.examinations.map(e=>e.facility).filter(Boolean))];
    const types = [...new Set(this.data.examinations.map(e=>e.type).filter(Boolean))];
    // 期间筛选
    const { from, to } = this._recFilterBounds();
    let exams = this.sortedExams().filter(e => {
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (f.facility && e.facility!==f.facility) return false;
      if (f.type && e.type!==f.type) return false;
      if (f.abnOnly && this.countAbnormal(e).total===0) return false;
      return true;
    });
    // 排序（默认新→旧）
    exams = f.sortDesc ? exams.slice().reverse() : exams;

    // ==== 筛选栏 ====
    const presets = [['all','全部'],['year','今年'],['1y','近1年'],['3y','近3年'],['custom','自定义']];
    const span = exams.length ? `${exams[f.sortDesc?exams.length-1:0].date} ~ ${exams[f.sortDesc?0:exams.length-1].date}` : '—';
    if (filterBox) filterBox.innerHTML = `<div class="rec-filter">
      <div class="rf-row">
        <span class="rf-lb">${svgIcon('filter')}期间</span>
        <div class="rf-chips">${presets.map(([k,l])=>`<button class="rf-chip ${f.preset===k?'active':''}" onclick="App.setRecPreset('${k}')">${l}</button>`).join('')}</div>
        ${f.preset==='custom' ? `<div class="rf-dates">
          <input type="date" class="inp rf-date" value="${f.from||''}" onchange="App.setRecDate('from',this.value)">
          <span style="color:var(--text-3)">~</span>
          <input type="date" class="inp rf-date" value="${f.to||''}" onchange="App.setRecDate('to',this.value)">
        </div>` : ''}
      </div>
      <div class="rf-row">
        <select class="inp rf-sel" onchange="App.setRecField('facility',this.value)">
          <option value="">全部机构</option>${facs.map(x=>`<option value="${x}" ${f.facility===x?'selected':''}>${x}</option>`).join('')}
        </select>
        <select class="inp rf-sel" onchange="App.setRecField('type',this.value)">
          <option value="">全部类型</option>${types.map(x=>`<option value="${x}" ${f.type===x?'selected':''}>${x}</option>`).join('')}
        </select>
        <label class="rf-toggle ${f.abnOnly?'on':''}"><input type="checkbox" ${f.abnOnly?'checked':''} onchange="App.setRecField('abnOnly',this.checked)"> 仅看异常</label>
        <button class="btn btn-ghost btn-sm" onclick="App.toggleRecSort()">${svgIcon('chevrons')}${f.sortDesc?'新→旧':'旧→新'}</button>
        <button class="btn btn-ghost btn-sm" onclick="App.resetRecFilter()">${svgIcon('close')}重置</button>
      </div>
      <div class="rf-summary">共 <b>${exams.length}</b> / ${total} 份${exams.length?` · 时间跨度 ${span}`:''}</div>
    </div>`;

    // ==== 结果列表 ====
    if (!exams.length){ list.innerHTML=`<div class="empty" style="padding:28px"><div class="ic">🔍</div>没有符合条件的报告，试试放宽筛选</div>`; return; }
    list.innerHTML = exams.map(e => {
      const c = this.countAbnormal(e);
      return `<div class="rec-card">
        <div>
          <div class="rec-date">${e.date}</div>
          <div class="rec-meta">${e.type||'健康报告'}${e.facility?' · '+e.facility:''}${this.facilityDoctor(e.facility)?' · '+this.facilityDoctor(e.facility)+'医生':''}${e.note?' · '+e.note:''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          ${c.total?`<span class="rec-abn">异常 ${c.total} 项</span>`:`<span style="color:var(--normal);font-size:12px;font-weight:600">全部正常</span>`}
          <button class="btn btn-ghost btn-sm" onclick="App.viewRecord('${e.id}')">${svgIcon('eye')}查看</button>
          <button class="btn btn-ghost btn-sm" onclick="App.editRecord('${e.id}')">${svgIcon('edit')}编辑</button>
          <button class="btn btn-danger btn-sm" onclick="App.deleteRecord('${e.id}')">${svgIcon('trash')}删除</button>
        </div>
      </div>`;
    }).join('');
  },
  setRecPreset(p){ this.recFilter.preset=p; this.renderRecords(); },
  setRecDate(which,val){ this.recFilter[which]=val; this.recFilter.preset='custom'; this.renderRecords(); },
  setRecField(field,val){ this.recFilter[field]=val; this.renderRecords(); },
  toggleRecSort(){ this.recFilter.sortDesc=!this.recFilter.sortDesc; this.renderRecords(); },
  resetRecFilter(){ this.recFilter={ preset:'all', from:'', to:'', facility:'', type:'', abnOnly:false, sortDesc:true }; this.renderRecords(); },

  viewRecord(id) {
    const e = this.data.examinations.find(x=>x.id===id);
    if (!e) return;
    let html = `<h3>${e.date} · ${e.type||'健康报告'}</h3>`;
    const _doc = this.facilityDoctor(e.facility);
    if (e.facility || _doc) html += `<div style="font-size:12.5px;color:var(--text-2);margin-bottom:6px">${e.facility||''}${_doc?`　·　主治医生：${_doc}`:''}</div>`;
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
    html += `<div style="text-align:right;margin-top:16px"><button class="btn btn-ghost btn-sm" onclick="App.closeModal()">${svgIcon('close')}关闭</button></div>`;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalMask').classList.add('show');
  },

  deleteRecord(id) {
    if (!confirm('确定删除这份报告？此操作不可撤销。')) return;
    this.data.examinations = this.data.examinations.filter(x=>x.id!==id);
    this.save(); this.renderRecords(); this.renderDashboard();
    this.toast('报告已删除','info');
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
                   note:'', usNote:'', meds:[], medNote:'', values:{} };
    document.getElementById('inputTitle').textContent = '录入新报告';
    this.renderInputForm();
  },
  cancelInput() {
    this.draft = null; this.editingId = null;
    this.go('records');
    this.toast('已取消编辑','info');
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
      <button class="btn btn-ghost btn-sm" id="toggleAllBtn" onclick="App.toggleAllSecs()">${svgIcon('chevrons')}<span class="lbl">全部展开</span></button>
      <button class="btn btn-ghost btn-sm" onclick="App.cancelInput()">${svgIcon('close')}取消</button>
      <button class="btn btn-primary btn-sm" onclick="App.saveDraft()">${svgIcon('save')}保存报告</button>
    </div>`;
    // 基本信息
    html += `<div class="sec" id="sec-basic">
      <div class="sec-head" style="border-left-color:#64748B" onclick="App.toggleSec('sec-basic')">
        <span>📋 基本信息</span><span class="chev">▾</span></div>
      <div class="sec-body"><div class="form-grid">
        <div class="fld"><label>检查日期 <span class="req">*</span></label>
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
        <div class="fld"><label>报告类型 <span class="req">*</span> <span class="ref">可新增</span></label>
          <select class="inp" id="f_type" onchange="App.onPickType(this)">
            <option value="">— 选择 —</option>
            ${commonTypes.map(t=>`<option value="${t}" ${d.type===t?'selected':''}>${t}</option>`).join('')}
            ${d.type && !commonTypes.includes(d.type) ? `<option value="${d.type}" selected>${d.type}</option>` : ''}
            <option value="__new__">＋ 新报告类型…</option>
          </select></div>
        <div class="fld"><label>检查机构 <span class="req">*</span> <span class="ref">可新增</span></label>
          <select class="inp" id="f_facility" onchange="App.onPickFacility(this)">
            <option value="">— 选择 —</option>
            ${this.facilityNames().map(n=>`<option value="${n}" ${d.facility===n?'selected':''}>${n}</option>`).join('')}
            ${d.facility && !this.facilityNames().includes(d.facility) ? `<option value="${d.facility}" selected>${d.facility}</option>` : ''}
            <option value="__new__">＋ 新机构…</option>
          </select></div>
        <div class="fld" style="grid-column:1/-1"><label>备注</label><textarea id="f_note" rows="2" placeholder="本次报告的整体说明（可选）">${d.note||''}</textarea></div>
      </div></div></div>`;
    // 服药信息（紧跟基本信息之后）
    const meds = this.data.medications;
    html += `<div class="sec" id="sec-meds">
      <div class="sec-head" style="border-left-color:#0EA5E9" onclick="App.toggleSec('sec-meds')">
        <span style="color:#0284C7">💊 服药信息</span><span class="chev">▾</span></div>
      <div class="sec-body">
        <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">勾选本次报告期间正在服用的药物：${meds.length?'<span class="req">*</span>':''}</div>
        <div class="med-checks" id="medChecks">${
          meds.length ? meds.map(m=>{
            const info=[m.doseAmt,m.freqTimes?`每日${m.freqTimes}次`:'',m.freqPills?`每次${m.freqPills}粒`:''].filter(Boolean).join(' ');
            return `<label class="medchk ${d.meds.includes(m.id)?'on':''}"><input type="checkbox" data-med="${m.id}" ${d.meds.includes(m.id)?'checked':''} onchange="this.parentElement.classList.toggle('on',this.checked);document.getElementById('medChecks').classList.remove('field-err')"> ${m.name}${info?` <span class="dose">${info}</span>`:''}</label>`;
          }).join('')
            : `<span style="font-size:12.5px;color:var(--text-3)">尚未添加药物，可到「设定 › 药物管理」中添加。</span>`
        }</div>
        <div class="fld" style="margin-top:14px"><label>服药备注</label><textarea id="f_medNote" rows="2" placeholder="如：漏服、剂量调整、副作用等">${d.medNote||''}</textarea></div>
      </div></div>`;
    // 各检查类别（内置 + 自定义，全部显示）
    cats.forEach(cid => {
      const cat = this.catById(cid);
      const col = this.catColor(cat.id);
      // 有数据的类别默认展开，空类别默认折叠（编辑旧报告时自动展开已填项）
      const hasData = cat.indicators.some(i => d.values[i.key]!=null && d.values[i.key]!=='');
      html += `<div class="sec catsec${hasData?'':' collapsed'}" id="sec-${cat.id}">
        <div class="sec-head" style="border-left-color:${col}" onclick="App.toggleSec('sec-${cat.id}')">
          <span style="color:${col}">${cat.name}</span>
          <span class="cnt" id="cnt-${cat.id}"></span><span class="chev">▾</span></div>
        <div class="sec-body">
          <div class="form-grid">${
            cat.indicators.map(i => {
              const v = d.values[i.key];
              return `<div class="fld">
                <label><span class="nm">${this.indName(i.key)}</span><span class="ref">${refRangeText(i.key)} ${i.unit}</span></label>
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
    this._syncToggleAllBtn();
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
    el.classList.remove('field-err');
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
  toggleSec(id){ document.getElementById(id).classList.toggle('collapsed'); this._syncToggleAllBtn(); },
  scrollToSec(id){
    const el=document.getElementById(id);
    if(!el) return;
    el.classList.remove('collapsed');
    this._syncToggleAllBtn();
    // sticky 输入栏会盖住分区顶部，滚动时动态扣除其高度（折行成多行也适用）
    const bar=document.querySelector('#view-input .input-bar');
    const offset=(bar?bar.offsetHeight:0)+14;
    const top=el.getBoundingClientRect().top+window.pageYOffset-offset;
    window.scrollTo({top:top<0?0:top, behavior:'smooth'});
  },
  toggleAllSecs(){
    const secs = document.querySelectorAll('#inputForm .sec.catsec');
    // 任一检查类别展开则全部折叠，否则全部展开
    const anyOpen = [...secs].some(s => !s.classList.contains('collapsed'));
    secs.forEach(s => s.classList.toggle('collapsed', anyOpen));
    this._syncToggleAllBtn();
  },
  _syncToggleAllBtn(){
    const btn = document.getElementById('toggleAllBtn');
    if (!btn) return;
    const secs = document.querySelectorAll('#inputForm .sec.catsec');
    const anyOpen = [...secs].some(s => !s.classList.contains('collapsed'));
    const lbl = btn.querySelector('.lbl');
    if (lbl) lbl.textContent = anyOpen ? '全部折叠' : '全部展开';
  },
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
      const f = this.secFilledCount(cat.id);
      const col = this.catColor(cat.id);
      return `<button class="jbtn${f?' filled':''}" onclick="App.scrollToSec('sec-${cat.id}')"><span class="jdot" style="background:${f?col:'transparent'};border-color:${col}"></span>${cat.nameShort}${f?`<span class="f">${f}</span>`:''}${n?`<span class="n">${n}</span>`:''}</button>`;
    }).join('');
    cats.forEach(cid => {
      const el = document.getElementById('cnt-'+cid);
      if (el){ const f=this.secFilledCount(cid), n=this.secAbnCount(cid);
        el.innerHTML = `${f} 项已填${n?` · <span style="color:var(--alert)">异常 ${n}</span>`:''}`; }
    });
  },
  onPickType(sel) {
    sel.classList.remove('field-err');
    if (sel.value !== '__new__') return;
    const prev = this.draft.type;             // 记住原选择，取消时恢复
    this.collectForm();                       // 先保留其他已填字段
    const v = (prompt('输入新的报告类型')||'').trim();
    if (v) {
      if (!this.data.reportTypes.includes(v)) this.data.reportTypes.push(v);
      this.draft.type = v; this.save();
    } else { this.draft.type = prev; }        // 取消：恢复原选择
    this.renderInputForm();
  },
  onPickFacility(sel) {
    sel.classList.remove('field-err');
    if (sel.value !== '__new__') return;
    const prev = this.draft.facility;
    this.collectForm();
    const v = (prompt('输入新的检查机构')||'').trim();
    if (v) {
      if (!this.facilityNames().includes(v)) this.data.facilities.push({ name:v, doctor:'' });
      this.draft.facility = v; this.save();
    } else { this.draft.facility = prev; }    // 取消：恢复原选择
    this.renderInputForm();
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
    // 必填项校验
    document.querySelectorAll('#inputForm .field-err').forEach(el => el.classList.remove('field-err'));
    const miss = [];
    if (!this.draft.date)     miss.push({ id:'f_date',     label:'检查日期', sec:'sec-basic' });
    if (!this.draft.type)     miss.push({ id:'f_type',     label:'报告类型', sec:'sec-basic' });
    if (!this.draft.facility) miss.push({ id:'f_facility', label:'检查机构', sec:'sec-basic' });
    // 服药信息：已配置药物时，至少勾选一项
    if (this.data.medications.length && (!this.draft.meds || !this.draft.meds.length)) {
      miss.push({ id:'medChecks', label:'服药信息', sec:'sec-meds' });
    }
    if (miss.length) {
      this.scrollToSec(miss[0].sec);
      miss.forEach(m => { const el=document.getElementById(m.id); if(el) el.classList.add('field-err'); });
      const first=document.getElementById(miss[0].id); if(first && first.focus) first.focus();
      this.toast('请填写必填项：'+miss.map(m=>m.label).join('、'), 'error', 3200);
      return;
    }
    const _editing = !!this.editingId;
    // 新机构自动收录
    if (this.draft.facility && !this.facilityNames().includes(this.draft.facility)) {
      this.data.facilities.push({ name:this.draft.facility, doctor:'' });
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
    this.toast(_editing ? '报告已更新' : '报告已保存');
  },

  // ========== 趋势分析页 ==========
  initTrend() {
    const catSel = document.getElementById('trendCat');
    catSel.innerHTML = this.allCategories().map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
    // 「仅异常指标」默认选中，与复选框保持一致
    this.trendAbnOnly = document.getElementById('trendAbnOnly')?.checked !== false;
    // 默认落在含异常指标的类别上，避免打开即空白
    if (this.trendAbnOnly) {
      const firstAbnCat = this.allCategories().find(c => c.indicators.some(i => this._trendAbn(i.key)));
      if (firstAbnCat) { catSel.value = firstAbnCat.id; this.trendKey = null; }
    }
    this.onTrendCatChange();
  },
  _trendAbn(k) {
    // 用该指标自身最近一次有值的测量判定（与下方摘要栏口径一致），
    // 而非全局最新报告——旧指标可能只在早期报告里出现
    const withVal = this.sortedExams().filter(e => e.values[k]!=null);
    if (!withVal.length) return false;
    const r = evalIndicator(k, withVal[withVal.length-1].values[k]);
    return (r.status==='high' || r.status==='low');
  },
  _trendKeys(cat) {
    // 仅异常开启时只保留最新报告异常的指标
    return this.trendAbnOnly ? cat.indicators.filter(i => this._trendAbn(i.key)) : cat.indicators;
  },
  onTrendCatChange() {
    const cat = this.catById(document.getElementById('trendCat').value);
    const avail = this._trendKeys(cat);
    const keys = avail.map(i=>i.key);
    // 当前指标不在可选集合里，默认选第一个有数据的（否则第一个）
    if (!this.trendKey || !keys.includes(this.trendKey)) {
      const withData = avail.find(i => this.sortedExams().some(e=>e.values[i.key]!=null));
      this.trendKey = withData ? withData.key : (keys[0] || null);
    }
    this.renderTrendChips(cat);
    this.renderTrend();
  },
  onTrendAbnToggle() {
    this.trendAbnOnly = document.getElementById('trendAbnOnly').checked;
    this.onTrendCatChange();
  },
  renderTrendChips(cat) {
    const box = document.getElementById('trendChips');
    if (!box) return;
    const exams = this.sortedExams();
    const list = this._trendKeys(cat);
    if (!list.length) {
      box.innerHTML = `<span style="font-size:12.5px;color:var(--text-3)">该类别最新报告无异常指标</span>`;
      return;
    }
    box.innerHTML = list.map(i => {
      const k = i.key;
      const has = exams.some(e => e.values[k]!=null);
      const abn = this._trendAbn(k);
      return `<button class="tchip ${this.trendKey===k?'active':''}" ${has?'':'style="opacity:.42"'} onclick="App.selectTrendKey('${k}')">${this.indName(k,true)}${abn?'<span class="tdot"></span>':''}</button>`;
    }).join('');
  },
  selectTrendKey(k) {
    this.trendKey = k;
    this.renderTrendChips(this.catById(document.getElementById('trendCat').value));
    this.renderTrend();
  },
  renderTrend() {
    const key = this.trendKey;
    if (this.trendChart) { this.trendChart.destroy(); this.trendChart=null; }
    if (!key) {
      const sb = document.getElementById('trendSummary');
      if (sb) sb.innerHTML = '<div class="ts-empty">当前筛选下没有可显示的指标</div>';
      return;
    }
    const years = parseInt(document.getElementById('trendRange')?.value || '0');
    const showVals = document.getElementById('trendLabels')?.checked !== false;
    this.trendChart = this.drawTrendChart('trendChart', key, years, showVals);
    this.renderTrendSummary(key, years);
  },
  renderTrendSummary(key, years) {
    const box = document.getElementById('trendSummary');
    if (!box) return;
    const d = INDICATOR_MAP[key];
    let exams = this.sortedExams().filter(e => e.values[key]!=null);
    if (years > 0) {
      const s = new Date(); s.setFullYear(s.getFullYear()-years);
      const ss = s.toISOString().slice(0,10);
      exams = exams.filter(e => e.date >= ss);
    }
    if (!exams.length) { box.innerHTML = '<div class="ts-empty">该指标在所选时间段暂无数据</div>'; return; }
    const vals = exams.map(e => Number(e.values[key]));
    const latest = exams[exams.length-1], prev = exams[exams.length-2];
    const lv = Number(latest.values[key]);
    const r = evalIndicator(key, lv);
    const min = Math.min(...vals), max = Math.max(...vals);
    const dec = d.decimals!=null ? d.decimals : 1;
    let delta = '';
    if (prev) {
      const dv = lv - Number(prev.values[key]);
      const arrow = dv>0?'↑':dv<0?'↓':'—';
      const col = dv>0?'var(--alert)':dv<0?'var(--primary)':'var(--text-3)';
      delta = `<div class="ts-item"><div class="ts-l">环比上次</div><div class="ts-v" style="color:${col}">${arrow} ${Math.abs(dv).toFixed(dec).replace(/\.?0+$/,'')||0}</div></div>`;
    }
    box.innerHTML = `
      <div class="ts-item"><div class="ts-l">最新值</div><div class="ts-v ${r.status}">${this.fmt(lv,d)} ${r.arrow}<span class="ts-u">${d.unit}</span></div></div>
      <div class="ts-item"><div class="ts-l">状态</div><div class="ts-v"><span class="st-pill ${r.status}">${r.label}</span></div></div>
      ${delta}
      <div class="ts-item"><div class="ts-l">期间最高</div><div class="ts-v">${this.fmt(max,d)}</div></div>
      <div class="ts-item"><div class="ts-l">期间最低</div><div class="ts-v">${this.fmt(min,d)}</div></div>
      <div class="ts-item"><div class="ts-l">参考范围</div><div class="ts-v ts-ref">${refRangeText(key)} ${d.unit}</div></div>
      <div class="ts-item"><div class="ts-l">数据点</div><div class="ts-v">${exams.length} 次</div></div>`;
  },

  // ========== import / export ==========
  exportJSON() {
    this.data.meta = this.data.meta || {};
    this.data.meta.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(this.data,null,2)], {type:'application/json'});
    this.download(blob, `health_report_${new Date().toISOString().slice(0,10)}.json`);
    localStorage.setItem(EXPORT_KEY, Date.now().toString());
    this.checkExportWarn();
    this.toast('已导出 JSON 备份');
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
        this.toast('导入成功，数据已恢复', 'success', 3200);
      } catch(err){ this.toast('导入失败：'+err.message, 'error', 4000); }
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
  exportExcel() {
    if (typeof XLSX==='undefined'){ this.toast('Excel 库未加载，请检查网络','error',3600); return; }
    const rows = this.buildMatrix();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = rows[0].map((_,i)=>({wch: i<4?14:12}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '健康报告');
    XLSX.writeFile(wb, `health_report_${new Date().toISOString().slice(0,10)}.xlsx`);
    this.toast('已导出 Excel');
  },

  // ========== 导出提醒（周期可设，0=关闭） ==========
  checkExportWarn() {
    const box = document.getElementById('exportWarn');
    if (!box) return;
    const interval = this.data.settings ? this.data.settings.backupDays : 30;
    if (!interval) { box.innerHTML=''; return; } // 0 = 关闭提醒
    const last = localStorage.getItem(EXPORT_KEY);
    const days = last ? Math.floor((Date.now()-parseInt(last))/86400000) : null;
    if (days === null) {
      box.innerHTML = `<div class="warn-banner"><span>⚠️ 尚未备份过数据。所有记录仅保存在本浏览器中，一旦清除缓存或更换设备就会丢失，建议现在就导出一份 JSON 备份。</span><button class="btn btn-primary btn-sm" onclick="App.exportJSON()">${svgIcon('download')}立即备份</button></div>`;
    } else if (days >= interval) {
      box.innerHTML = `<div class="warn-banner"><span>⚠️ 距上次备份已过去 ${days} 天。为防止数据意外丢失，建议重新导出一份 JSON 备份。</span><button class="btn btn-primary btn-sm" onclick="App.exportJSON()">${svgIcon('download')}立即备份</button></div>`;
    } else { box.innerHTML=''; }
  },

  // ========== 设定页 ==========
  renderSettings() {
    const d = this.data, p = d.profile;
    const genders = { male:'男', female:'女', other:'其他' };
    const bmiVal = (p.height && p.weight) ? (p.weight/Math.pow(p.height/100,2)).toFixed(1) : '';

    const tab = this.settingsTab || 'personal';
    // ==== 各卡片构建（后按标签组装）====
    const cardProfile = `<div class="card">
      <div class="card-title"><span class="dot"></span>患者基础信息</div>
      <div class="form-grid profile-grid">
        <div class="fld"><label>姓名</label><input class="inp" id="p_name" value="${p.name||''}"></div>
        <div class="fld"><label>性别</label><select id="p_gender">${Object.entries(genders).map(([k,v])=>`<option value="${k}" ${p.gender===k?'selected':''}>${v}</option>`).join('')}</select></div>
        <div class="fld"><label>出生年</label><input class="inp" type="number" id="p_birthYear" value="${p.birthYear||''}" placeholder="如 1985"></div>
        <div class="fld"><label>身高 (cm)</label><input class="inp" type="number" step="any" id="p_height" value="${p.height||''}" oninput="App._updateBmi()"></div>
        <div class="fld"><label>体重 (kg)</label><input class="inp" type="number" step="any" id="p_weight" value="${p.weight||''}" oninput="App._updateBmi()"></div>
        <div class="fld"><label>BMI <span class="ref">自动计算</span></label><input class="inp" id="p_bmi" value="${bmiVal}" readonly placeholder="填身高体重后自动算" style="font-weight:700;color:var(--primary)"><span class="live" id="bmiLive"></span></div>
        <div class="fld"><label>血型</label><input class="inp" id="p_bloodType" value="${p.bloodType||''}" placeholder="如 A / O / Rh+"></div>
        <div class="fld"><label>复查间隔 (月)</label><input class="inp" type="number" id="p_recheckMonths" value="${p.recheckMonths||6}" placeholder="6"></div>
        <div class="fld" style="grid-column:1/-1"><label>健康备注</label><textarea id="p_note" rows="2" placeholder="既往病史、过敏、家族史等">${p.note||''}</textarea></div>
      </div>
      <div style="display:flex;align-items:center;justify-content:flex-end;margin-top:12px">
        <button class="btn btn-primary btn-sm" onclick="App.saveProfile()">${svgIcon('save')}保存信息</button>
      </div>
    </div>`;

    // 机构管理
    const cardFacility = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#059669"></span>检查机构管理 <span class="badge">可登记主治医生</span></div>
      <div id="facTags" class="tag-list">${
        d.facilities.length ? d.facilities.map((f,i)=>`<span class="tag">${f.name}${f.doctor?`<span class="tag-doc">${f.doctor}医生</span>`:''}<button onclick="App.delFacility(${i})">×</button></span>`).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无机构，录入报告填写后会自动收录</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <input class="inp" id="newFac" placeholder="机构名" style="flex:2;min-width:150px" onkeydown="if(event.key==='Enter')App.addFacility()">
        <input class="inp" id="newFacDoc" placeholder="主治医生（可选）" style="flex:1;min-width:120px" onkeydown="if(event.key==='Enter')App.addFacility()">
        <button class="btn btn-ghost btn-sm" onclick="App.addFacility()">${svgIcon('plus')}添加</button>
      </div>
      <div style="font-size:11.5px;color:var(--text-3);margin-top:8px">输入相同机构名可更新其主治医生。</div>
    </div>`;

    // 报告类型管理
    const cardReportType = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0D9488"></span>报告类型管理 <span class="badge">录入报告时的下拉选项</span></div>
      <div id="rtTags" class="tag-list">${
        (d.reportTypes||[]).length
          ? d.reportTypes.map((t,i)=>`<span class="tag">${t}<button onclick="App.delReportType(${i})">×</button></span>`).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无类型</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="inp" id="newRT" placeholder="添加报告类型名称" style="flex:1" onkeydown="if(event.key==='Enter')App.addReportType()">
        <button class="btn btn-ghost btn-sm" onclick="App.addReportType()">${svgIcon('plus')}添加</button>
      </div>
    </div>`;

    // 药物管理
    const cardMed = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0EA5E9"></span>药物管理 <span class="badge">录入报告时可勾选</span></div>
      <div id="medList">${
        d.medications.length ? d.medications.map(m=>{
          const dispDose = m.doseAmt||'';
          const dispUsage = (m.freqTimes||m.freqPills) ? `每日${m.freqTimes||1}次 每次${m.freqPills||1}粒` : '';
          if (this.editingMedId===m.id) {
            return `<div class="med-row editing">
              <div style="flex:1"><div class="form-grid" style="gap:8px">
                <div class="fld wide"><label>药物名称</label><input class="inp" id="medit_name" value="${m.name}"></div>
                <div class="fld"><label>每粒剂量</label><input class="inp" id="medit_doseAmt" value="${m.doseAmt||''}" placeholder="如 0.5mg"></div>
                <div class="fld"><label>每日次数</label><input class="inp" type="number" id="medit_freqTimes" value="${m.freqTimes||1}" min="1"></div>
                <div class="fld"><label>每次粒数</label><input class="inp" type="number" id="medit_freqPills" value="${m.freqPills||1}" min="1"></div>
                <div class="fld"><label>备注</label><input class="inp" id="medit_note" value="${m.note||''}" placeholder="可选"></div>
              </div></div>
              <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
                <button class="btn btn-primary btn-sm" onclick="App.saveMedication('${m.id}')">${svgIcon('save')}保存</button>
                <button class="btn btn-ghost btn-sm" onclick="App.cancelEditMedication()">${svgIcon('close')}取消</button>
              </div>
            </div>`;
          }
          return `<div class="med-row">
            <div><b>${m.name}</b>${dispDose?` <span class="dose">${dispDose}</span>`:''}${dispUsage?` <span class="usage">${dispUsage}</span>`:''}${m.note?`<div style="font-size:12px;color:var(--text-2);margin-top:2px">${m.note}</div>`:''}</div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" onclick="App.editMedication('${m.id}')">${svgIcon('edit')}编辑</button>
              <button class="btn btn-danger btn-sm" onclick="App.delMedication('${m.id}')">${svgIcon('trash')}删除</button>
            </div>
          </div>`;
        }).join('')
          : '<span style="color:var(--text-3);font-size:13px">暂无药物</span>'
      }</div>
      <div class="form-grid" style="margin-top:14px">
        <div class="fld wide"><label>药物名称</label><input class="inp" id="med_name" placeholder="如 恩替卡韦"></div>
        <div class="fld"><label>每粒剂量</label><input class="inp" id="med_doseAmt" placeholder="如 0.5mg"></div>
        <div class="fld"><label>每日次数</label><input class="inp" type="number" id="med_freqTimes" value="1" min="1"></div>
        <div class="fld"><label>每次粒数</label><input class="inp" type="number" id="med_freqPills" value="1" min="1"></div>
        <div class="fld"><label>备注</label><input class="inp" id="med_note" placeholder="可选"></div>
      </div>
      <div style="text-align:right;margin-top:10px"><button class="btn btn-primary btn-sm" onclick="App.addMedication()">${svgIcon('plus')}添加药物</button></div>
    </div>`;

    // 自定义检查类别
    const cardCustom = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#6366F1"></span>自定义检查类别 <span class="badge">新增系统没有的检查（如电解质：血磷、血钙…）</span></div>
      <div id="ccList">${
        d.customCategories.length ? d.customCategories.map(cat=>{
          const col = cat.color || '#6366F1';
          return `<div class="tpl-box" style="border-left:4px solid ${col}">
            <div class="tpl-head">
              <input class="inp tpl-name" value="${cat.name}" style="color:${col}" onchange="App.renameCustomCategory('${cat.id}',this.value)">
              <button class="btn btn-danger btn-sm" onclick="App.delCustomCategory('${cat.id}')">${svgIcon('trash')}删除类别</button>
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
                    <button class="btn btn-primary btn-sm" style="padding:4px 10px" onclick="App.saveCustomIndicator('${cat.id}','${i.key}')">${svgIcon('save')}保存</button>
                    <button class="btn btn-ghost btn-sm" style="padding:4px 8px" onclick="App.cancelEditCustomInd()">${svgIcon('close')}取消</button>
                  </td></tr>`;
                return `<tr>
                  <td>${i.name}</td><td>${i.unit||'—'}</td><td>${i.min!=null?i.min:'—'}</td><td>${i.max!=null?i.max:'—'}</td><td>${i.decimals!=null?i.decimals:1}</td>
                  <td style="text-align:right;white-space:nowrap">
                    <button class="btn btn-ghost btn-sm" style="padding:3px 9px" onclick="App.editCustomInd('${cat.id}','${i.key}')">${svgIcon('edit')}编辑</button>
                    <button class="btn btn-danger btn-sm" style="padding:3px 9px" onclick="App.delCustomIndicator('${cat.id}','${i.key}')">${svgIcon('trash')}删除</button>
                  </td></tr>`;
              }).join('') : '<tr><td colspan="6" style="color:var(--text-3);text-align:center">暂无项目，在下方添加</td></tr>'}
            </tbody></table></div>
            <div class="cc-add">
              <input class="inp" placeholder="项目名 *" data-f="name">
              <input class="inp" placeholder="单位" data-f="unit">
              <input class="inp" type="number" step="any" placeholder="下限" data-f="min">
              <input class="inp" type="number" step="any" placeholder="上限" data-f="max">
              <input class="inp" type="number" placeholder="小数" data-f="decimals" value="1">
              <button class="btn btn-ghost btn-sm" onclick="App.addCustomIndicator('${cat.id}',this)">${svgIcon('plus')}加项目</button>
            </div>
          </div>`;
        }).join('') : '<span style="color:var(--text-3);font-size:13px">还没有自定义类别。例如新建「电解质」类别，再往里加「血磷」「血钙」等项目（含单位和参考范围），录入报告时就会自动出现该分区。</span>'
      }</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <input class="inp" id="newCC" placeholder="新类别名称（如 电解质）" style="flex:1" onkeydown="if(event.key==='Enter')App.addCustomCategory()">
        <button class="btn btn-primary btn-sm" onclick="App.addCustomCategory()">${svgIcon('plus')}新建类别</button>
      </div>
    </div>`;

    // 检查类别显示顺序
    const cardOrder = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#0EA5E9"></span>检查类别显示顺序 <span class="badge">拖拽调整 · 影响所有页面</span></div>
      <div class="cat-chip-grid" ondragover="App.catDragOver(event)" ondrop="App.catDrop(event)">${
        this.allCategories().map((cat) => {
          const col = this.catColor(cat.id);
          return `<div class="cat-chip" draggable="true" data-cat="${cat.id}"
            ondragstart="App.catDragStart(event,'${cat.id}')"
            ondragend="App.catDragEnd(event)"
            ondragover="App.catChipOver(event,'${cat.id}')"
            ontouchstart="App.catTouchStart(event,'${cat.id}')"
            ontouchmove="App.catTouchMove(event)"
            ontouchend="App.catTouchEnd(event)">
            <span class="cat-chip-grip">⠿</span>
            <span class="cat-chip-dot" style="background:${col}"></span>
            <span class="cat-chip-name">${cat.name}</span>
          </div>`;
        }).join('')
      }</div>
    </div>`;

    // 数据管理
    const lastExp = localStorage.getItem(EXPORT_KEY);
    const lastExpText = lastExp
      ? `上次导出：${new Date(parseInt(lastExp)).toLocaleDateString('zh-CN')}`
      : '尚未导出过备份';
    const cardData = `<div class="card">
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
      <div style="margin-top:18px;padding-top:16px;border-top:1px dashed var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:600;color:var(--text-2)">备份提醒周期</span>
        <select class="inp rf-sel" onchange="App.setBackupDays(this.value)">
          ${[[7,'每 7 天'],[30,'每 30 天'],[90,'每 90 天'],[0,'关闭提醒']].map(([v,l])=>`<option value="${v}" ${(d.settings.backupDays||0)==v?'selected':''}>${l}</option>`).join('')}
        </select>
        <span style="font-size:12px;color:var(--text-3)">超过周期未导出会在概览页提醒</span>
      </div>
    </div>
    <div class="card" style="border-color:#FECACA">
      <div class="card-title"><span class="dot" style="background:var(--alert)"></span>危险操作 <span class="badge" style="background:var(--alert-bg);color:var(--alert)">不可撤销</span></div>
      <div style="font-size:13px;color:var(--text-2);margin-bottom:14px;line-height:1.7">
        清空后<b>全部报告、患者信息、药物、机构、自定义类别与设置</b>都会被删除，恢复到初始状态。<br>
        <span style="color:var(--alert);font-weight:600">操作前请务必先导出 JSON 备份。</span>
      </div>
      <button class="btn btn-danger" onclick="App.resetAllData()">${svgIcon('trash')}清空所有数据</button>
    </div>`;

    // 重点指标设置
    const cardFocus = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#F59E0B"></span>重点指标设置 <span class="badge">决定概览页「重点指标」区显示哪些</span></div>
      ${this.allCategories().map(cat => {
        if (!cat.indicators.length) return '';
        const col = this.catColor(cat.id);
        return `<div class="focus-cat">
          <div class="focus-cat-t" style="color:${col}"><span class="dot" style="background:${col}"></span>${cat.name}</div>
          <div class="focus-chips">${cat.indicators.map(i => {
            const on = this.isFocus(i.key);
            return `<button class="focus-chip ${on?'on':''}" onclick="App.toggleFocus('${i.key}')">${on?'★':'☆'} ${this.indName(i.key,true)}</button>`;
          }).join('')}</div>
        </div>`;
      }).join('')}
    </div>`;

    // 概览页模块显隐
    const show = d.settings.show;
    const showItems = [
      ['score','健康评分','评分环 + 复查提醒 + 关注指标'],
      ['consec','连续异常预警','某指标连续 3 次异常时的红色横幅'],
      ['hbv','乙肝五项判读','大三阳 / 小三阳 等自动判读'],
      ['focus','重点指标趋势','重点指标卡片 + 迷你趋势线'],
    ];
    const cardShow = `<div class="card">
      <div class="card-title"><span class="dot" style="background:#8B5CF6"></span>概览页模块 <span class="badge">自由显隐首页各区块</span></div>
      <div class="show-list">${showItems.map(([k,t,desc]) => `
        <label class="show-row ${show[k]?'on':''}">
          <div><div class="show-t">${t}</div><div class="show-d">${desc}</div></div>
          <input type="checkbox" ${show[k]?'checked':''} onchange="App.toggleShow('${k}',this.checked)">
        </label>`).join('')}</div>
    </div>`;

    // ==== 标签栏 + 按当前标签组装内容 ====
    const tabs = [
      { id:'personal', icon:'👤', label:'个人' },
      { id:'exams',    icon:'🧪', label:'检查项目' },
      { id:'meds',     icon:'💊', label:'用药' },
      { id:'display',  icon:'🎨', label:'显示' },
      { id:'data',     icon:'💾', label:'数据' },
    ];
    const tabBar = `<div class="settings-tabs">${
      tabs.map(t=>`<button class="st-tab ${tab===t.id?'active':''}" onclick="App.switchSettingsTab('${t.id}')"><span class="st-ic">${t.icon}</span><span class="st-lb">${t.label}</span></button>`).join('')
    }</div>`;
    const panels = {
      personal: cardProfile,
      exams:    cardReportType + cardFacility + cardCustom + cardOrder + cardFocus,
      meds:     cardMed,
      display:  cardShow,
      data:     cardData,
    };
    document.getElementById('settingsBody').innerHTML = tabBar + `<div class="settings-panel">${panels[tab]||panels.personal}</div>`;
    if (tab==='personal') this._updateBmi();
  },
  switchSettingsTab(tabId) {
    this.settingsTab = tabId;
    this.renderSettings();
    const body = document.getElementById('settingsBody');
    if (body) body.scrollIntoView({ block:'start', behavior:'smooth' });
  },
  saveProfile() {
    const g = id => document.getElementById(id).value;
    const p = this.data.profile;
    p.name=g('p_name'); p.gender=g('p_gender'); p.birthYear=g('p_birthYear');
    p.height=g('p_height'); p.weight=g('p_weight'); p.bloodType=g('p_bloodType'); p.note=g('p_note');
    p.recheckMonths=g('p_recheckMonths')||6;
    this.save(); this.renderSettings(); this.renderDashboard();
    this.toast('基础信息已保存');
  },
  _bmiStatus(bmi) {
    // 中国成人 BMI 标准：偏瘦 <18.5，正常 18.5–23.9，超重 24–27.9，肥胖 ≥28
    if (!(bmi>0)) return null;
    if (bmi<18.5) return { status:'low', label:'↓ 偏瘦' };
    if (bmi<24)   return { status:'normal', label:'✓ 正常' };
    if (bmi<28)   return { status:'high', label:'↑ 超重' };
    return { status:'high', label:'↑ 肥胖' };
  },
  _updateBmi() {
    const h=parseFloat(document.getElementById('p_height')?.value);
    const w=parseFloat(document.getElementById('p_weight')?.value);
    const el=document.getElementById('p_bmi');
    const live=document.getElementById('bmiLive');
    const bmi = (h>0 && w>0) ? w/Math.pow(h/100,2) : null;
    if (el) el.value = bmi!=null ? bmi.toFixed(1) : '';
    if (live) {
      const s = this._bmiStatus(bmi);
      live.className = 'live' + (s?' '+s.status:'');
      live.textContent = s ? s.label : '';
    }
  },
  addReportType() {
    const el=document.getElementById('newRT'), v=el.value.trim();
    if (!v) return;
    const exists = this.data.reportTypes.includes(v);
    if (!exists) this.data.reportTypes.push(v);
    el.value='';
    this.save(); this.renderSettings();
    this.toast(exists ? '该类型已存在' : '报告类型已添加', exists?'info':'success');
  },
  delReportType(i) {
    this.data.reportTypes.splice(i,1);
    this.save(); this.renderSettings();
    this.toast('报告类型已删除','info');
  },
  addFacility() {
    const el=document.getElementById('newFac'), v=el.value.trim();
    if (!v) return;
    const doc=(document.getElementById('newFacDoc')?.value||'').trim();
    const ex=this.data.facilities.find(f=>f.name===v);
    if (ex) { if (doc) ex.doctor=doc; }            // 同名机构则更新主治医生
    else this.data.facilities.push({ name:v, doctor:doc });
    this.save(); this.renderSettings();
    this.toast(ex ? '机构信息已更新' : '机构已添加');
  },
  delFacility(i) {
    this.data.facilities.splice(i,1); this.save(); this.renderSettings();
    this.toast('机构已删除','info');
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
    if (!name){ this.toast('请输入药物名称','error'); return; }
    this.data.medications.push({
      id:'med_'+Date.now(), name,
      doseAmt: document.getElementById('med_doseAmt')?.value.trim()||'',
      freqTimes: parseInt(document.getElementById('med_freqTimes')?.value)||1,
      freqPills: parseInt(document.getElementById('med_freqPills')?.value)||1,
      note: document.getElementById('med_note').value.trim()
    });
    this.save(); this.renderSettings(); this._refreshMedChecks();
    this.toast('药物已添加');
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
    this.toast('药物已更新');
  },
  delMedication(id) {
    if (!confirm('删除该药物？')) return;
    this.data.medications = this.data.medications.filter(m=>m.id!==id);
    this.save(); this.renderSettings(); this._refreshMedChecks();
    this.toast('药物已删除','info');
  },
  _catDragSrc: null,
  catDragStart(e, id) {
    this._catDragSrc = id;
    e.dataTransfer.effectAllowed = 'move';
    const chip = e.target.closest('.cat-chip');
    if (chip) setTimeout(() => chip.classList.add('dragging'), 0);
  },
  catDragEnd(e) {
    this._catDragSrc = null;
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('dragging','drop-target'));
  },
  catDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; },
  catChipOver(e, targetId) {
    e.preventDefault();
    if (!this._catDragSrc || this._catDragSrc === targetId) return;
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('drop-target'));
    e.target.closest('.cat-chip')?.classList.add('drop-target');
  },
  catDrop(e) {
    e.preventDefault();
    const src = this._catDragSrc;
    if (!src) return;
    const targetChip = e.target.closest('.cat-chip');
    const order = this.data.catOrder;
    const from = order.indexOf(src);
    if (from < 0) return;
    order.splice(from, 1);
    if (targetChip) {
      const targetId = targetChip.dataset.cat;
      let to = order.indexOf(targetId);
      if (to < 0) to = order.length;
      order.splice(to, 0, src);
    } else {
      order.push(src);
    }
    this._catDragSrc = null;
    this.save(); this.renderSettings();
  },
  _reorderCat(src, targetId) {
    const order = this.data.catOrder;
    const from = order.indexOf(src);
    if (from < 0) return;
    order.splice(from, 1);
    if (targetId && targetId !== src) {
      let to = order.indexOf(targetId);
      if (to < 0) to = order.length;
      order.splice(to, 0, src);
    } else {
      order.splice(from, 0, src); // 无有效目标，放回原处
    }
  },
  catTouchStart(e, id) {
    this._catDragSrc = id;
    e.currentTarget.classList.add('dragging');
  },
  catTouchMove(e) {
    if (!this._catDragSrc) return;
    e.preventDefault(); // chip 上 touch-action:none 已阻止滚动，这里确保拖动流畅
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const chip = el && el.closest ? el.closest('.cat-chip') : null;
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('drop-target'));
    if (chip && chip.dataset.cat !== this._catDragSrc) chip.classList.add('drop-target');
  },
  catTouchEnd(e) {
    const src = this._catDragSrc;
    if (!src) return;
    const t = e.changedTouches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const chip = el && el.closest ? el.closest('.cat-chip') : null;
    this._catDragSrc = null;
    if (chip) {
      this._reorderCat(src, chip.dataset.cat);
      this.save(); this.renderSettings();
    } else {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('dragging','drop-target'));
    }
  },
  addCustomCategory() {
    const name=document.getElementById('newCC').value.trim();
    if (!name){ this.toast('请输入类别名称','error'); return; }
    const palette=['#6366F1','#DB2777','#0D9488','#CA8A04','#9333EA','#0EA5E9','#DC2626'];
    const color=palette[this.data.customCategories.length % palette.length];
    const newCat = { id:'cc_'+Date.now(), name, nameShort:name, color, custom:true, indicators:[] };
    this.data.customCategories.push(newCat);
    if (this.data.catOrder) this.data.catOrder.push(newCat.id);
    this.save(); this.renderSettings();
    this.toast('类别已创建');
  },
  delCustomCategory(id) {
    if (!confirm('删除该类别及其项目定义？（已录入的历史数值不会被删除，但将不再显示）')) return;
    const cat=this.data.customCategories.find(c=>c.id===id);
    if (cat) cat.indicators.forEach(i=>{ delete INDICATOR_MAP[i.key]; });
    this.data.customCategories=this.data.customCategories.filter(c=>c.id!==id);
    if (this.data.catOrder) this.data.catOrder=this.data.catOrder.filter(x=>x!==id);
    this.save(); this.renderSettings();
    this.toast('类别已删除','info');
  },
  renameCustomCategory(id, val) {
    const c=this.data.customCategories.find(x=>x.id===id);
    if (c){ c.name=val.trim()||c.name; c.nameShort=c.name; this.registerCustom(); this.save(); this.renderDashboard(); }
  },
  addCustomIndicator(catId, btn) {
    const box=btn.closest('.cc-add');
    const g=f=>box.querySelector(`[data-f="${f}"]`).value.trim();
    const name=g('name');
    if (!name){ this.toast('请输入项目名','error'); return; }
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
    this.toast('项目已添加');
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
    this.toast('项目已更新');
  },
  delCustomIndicator(catId, key) {
    const cat=this.data.customCategories.find(c=>c.id===catId);
    if (cat) cat.indicators=cat.indicators.filter(i=>i.key!==key);
    delete INDICATOR_MAP[key];
    this.save(); this.renderSettings();
    this.toast('项目已删除','info');
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
