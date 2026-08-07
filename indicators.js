// 指标主数据定义（参考范围内置）
// status 判定: value < min → low(↓), value > max → high(↑), 其余 normal
// type: 'num' 数值型 | 'enum' 定性型 | 'text' 文本 | 'special' 特殊(如乙肝五项阴阳性)
// 参考范围来源: 报告图片实测值（大连HR / 全国HR 互认标准）

const INDICATOR_CATEGORIES = [
  {
    id: 'biochem',
    name: '肝功・生化',
    nameShort: '生化',
    icon: 'flask',
    indicators: [
      { key: 'TP',    name: '总蛋白',            unit: 'g/L',        min: 65,   max: 85,    decimals: 1 },
      { key: 'ALB',   name: '白蛋白',            unit: 'g/L',        min: 40,   max: 55,    decimals: 1 },
      { key: 'GLB',   name: '球蛋白',            unit: 'g/L',        min: 20,   max: 40,    decimals: 1 },
      { key: 'AG',    name: '白球比例 A/G',      unit: '',           min: 1.2,  max: 2.4,   decimals: 2 },
      { key: 'PA',    name: '前白蛋白',          unit: 'mg/L',       min: 250,  max: 400,   decimals: 0 },
      { key: 'ALT',   name: '谷丙转氨酶',        unit: 'U/L',        min: 9,    max: 50,    decimals: 1, focus: true },
      { key: 'AST',   name: '谷草转氨酶',        unit: 'U/L',        min: 15,   max: 40,    decimals: 1, focus: true },
      { key: 'SL',    name: '谷草/谷丙 S/L',     unit: '',           min: null, max: 1.5,   decimals: 2 },
      { key: 'ALP',   name: '碱性磷酸酶',        unit: 'U/L',        min: 45,   max: 125,   decimals: 1 },
      { key: 'GGT',   name: '谷氨酰转肽酶',      unit: 'U/L',        min: 10,   max: 60,    decimals: 1, focus: true },
      { key: 'LDH',   name: '乳酸脱氢酶',        unit: 'U/L',        min: 120,  max: 250,   decimals: 1 },
      { key: 'CHE',   name: '胆碱酯酶',          unit: 'U/L',        min: 4000, max: 13000, decimals: 0 },
      { key: 'CK',    name: '肌酸激酶',          unit: 'U/L',        min: 50,   max: 310,   decimals: 1 },
      { key: 'LAP',   name: '亮氨酸氨基肽酶',    unit: 'U/L',        min: 20,   max: 60,    decimals: 1 },
      { key: 'HAPT',  name: '触珠蛋白',          unit: 'g/L',        min: 0.3,  max: 2,     decimals: 2 },
      { key: 'TBA',   name: '总胆汁酸',          unit: 'umol/L',     min: 0,    max: 10,    decimals: 1 },
      { key: 'CG',    name: '甘胆酸',            unit: 'ug/mL',      min: 0,    max: 2.7,   decimals: 1 },
      { key: 'SAA',   name: '血清淀粉样蛋白A',   unit: 'mg/L',       min: 0,    max: 10,    decimals: 1 },
      { key: 'TBIL',  name: '总胆红素',          unit: 'umol/L',     min: 0,    max: 26,    decimals: 1, focus: true },
      { key: 'DBIL',  name: '直接胆红素',        unit: 'umol/L',     min: 0,    max: 6.8,   decimals: 1 },
      { key: 'IBIL',  name: '间接胆红素',        unit: 'umol/L',     min: 1.7,  max: 13.2,  decimals: 1 },
      { key: 'CHO',   name: '总胆固醇',          unit: 'mmol/L',     min: 3.23, max: 6.46,  decimals: 2 },
      { key: 'TG',    name: '甘油三酯',          unit: 'mmol/L',     min: 0,    max: 2.3,   decimals: 2, focus: true },
      { key: 'HDLC',  name: '高密度脂蛋白胆固醇', unit: 'mmol/L',    min: 0.9,  max: 1.68,  decimals: 2 },
      { key: 'LDLC',  name: '低密度脂蛋白胆固醇', unit: 'mmol/L',    min: 2.07, max: 3.1,   decimals: 2, focus: true },
      { key: 'APOA1', name: '载脂蛋白A1',        unit: 'g/L',        min: 1,    max: 1.6,   decimals: 2 },
      { key: 'APOB',  name: '载脂蛋白B',         unit: 'g/L',        min: 0.6,  max: 1.1,   decimals: 2 },
      { key: 'GLU',   name: '血糖',              unit: 'mmol/L',     min: 3.89, max: 6.11,  decimals: 2, focus: true },
      { key: 'UREA',  name: '尿素氮',            unit: 'mmol/L',     min: 3.1,  max: 8,     decimals: 1 },
      { key: 'CREA',  name: '肌酐',              unit: 'umol/L',     min: 57,   max: 97,    decimals: 0 },
      { key: 'B2MG',  name: 'β2-微球蛋白',       unit: 'mg/L',       min: 0.97, max: 2.64,  decimals: 2 },
      { key: 'eGFR',  name: '肾小球滤过率',      unit: 'mL/min/L',   min: 90,   max: null,  decimals: 1 },
      { key: 'UA',    name: '尿酸',              unit: 'umol/L',     min: 208,  max: 428,   decimals: 0, focus: true },
      { key: 'INR',   name: '国际标准化比值',    unit: '',           min: 0.8,  max: 1.3,   decimals: 2 },
      { key: 'Na',    name: '血钠',              unit: 'mmol/L',     min: 137,  max: 147,   decimals: 1 },
      { key: 'K',     name: '血钾',              unit: 'mmol/L',     min: 3.5,  max: 5.5,   decimals: 2 },
      { key: 'Ca',    name: '血钙',              unit: 'mmol/L',     min: 2.11, max: 2.52,  decimals: 2 }
    ]
  },
  {
    id: 'cbc',
    name: '血细胞分析（五分类）',
    nameShort: '血常规',
    icon: 'droplet',
    indicators: [
      { key: 'WBC',   name: '白细胞',                unit: '10⁹/L',   min: 3.5,  max: 9.5,   decimals: 2, focus: true },
      { key: 'RBC',   name: '红细胞',                unit: '10¹²/L',  min: 4.3,  max: 5.8,   decimals: 2 },
      { key: 'HGB',   name: '血红蛋白',              unit: 'g/L',     min: 130,  max: 175,   decimals: 0, focus: true },
      { key: 'HCT',   name: '红细胞压积',            unit: 'L/L',     min: 0.4,  max: 0.5,   decimals: 3 },
      { key: 'MCV',   name: '平均红细胞体积',        unit: 'fL',      min: 82,   max: 100,   decimals: 1 },
      { key: 'MCH',   name: '平均红细胞血红蛋白含量', unit: 'Pg',     min: 27,   max: 34,    decimals: 1 },
      { key: 'MCHC',  name: '平均红细胞血红蛋白浓度', unit: 'g/L',    min: 316,  max: 354,   decimals: 0 },
      { key: 'PLT',   name: '血小板',                unit: '10⁹/L',   min: 125,  max: 350,   decimals: 0, focus: true },
      { key: 'NEU_P', name: '中性粒细胞百分比',      unit: '%',       min: 40,   max: 75,    decimals: 1 },
      { key: 'LYM_P', name: '淋巴细胞百分比',        unit: '%',       min: 20,   max: 50,    decimals: 1 },
      { key: 'MON_P', name: '单核细胞百分比',        unit: '%',       min: 3,    max: 10,    decimals: 1 },
      { key: 'EO_P',  name: '嗜酸性粒细胞百分比',    unit: '%',       min: 0.4,  max: 8.0,   decimals: 1 },
      { key: 'BAS_P', name: '嗜碱性粒细胞百分比',    unit: '%',       min: 0,    max: 1,     decimals: 1 },
      { key: 'NEU_A', name: '中性粒细胞绝对值',      unit: '10⁹/L',   min: 1.8,  max: 6.3,   decimals: 2 },
      { key: 'LYM_A', name: '淋巴细胞绝对值',        unit: '10⁹/L',   min: 1.1,  max: 3.2,   decimals: 2 },
      { key: 'MON_A', name: '单核细胞绝对值',        unit: '10⁹/L',   min: 0.1,  max: 0.6,   decimals: 2 },
      { key: 'EO_A',  name: '嗜酸性粒细胞绝对值',    unit: '10⁹/L',   min: 0.02, max: 0.52,  decimals: 2 },
      { key: 'BAS_A', name: '嗜碱性粒细胞绝对值',    unit: '10⁹/L',   min: 0,    max: 0.06,  decimals: 2 },
      { key: 'RDW_CV',name: '红细胞分布宽度变异系数', unit: '%',      min: 10.9, max: 15.4,  decimals: 1 },
      { key: 'RDW_SD',name: '红细胞分布宽度标准差',  unit: 'fL',      min: 39,   max: 46,    decimals: 1 },
      { key: 'PDW',   name: '血小板分布宽度',        unit: 'fL',      min: 15.5, max: 17.1,  decimals: 1 },
      { key: 'MPV',   name: '平均血小板体积',        unit: 'fL',      min: 9.4,  max: 12.5,  decimals: 1 },
      { key: 'PCT',   name: '血小板压积',            unit: '%',       min: 0.13, max: 0.43,  decimals: 2 },
      { key: 'NRBC_P',name: '有核红细胞百分比',      unit: '/100WBC', min: 0,    max: 0,     decimals: 0 },
      { key: 'NRBC_A',name: '有核红细胞绝对值',      unit: '10⁹/L',   min: 0,    max: 0,     decimals: 0 },
      { key: 'P_LCR', name: '大血小板比率',          unit: '%',       min: 13,   max: 43,    decimals: 1 }
    ]
  },
  {
    id: 'hbv_panel',
    name: '乙肝五项',
    nameShort: '乙肝五项',
    icon: 'shield',
    indicators: [
      { key: 'AntiHBs', name: '乙肝表面抗体',        unit: 'mIU/mL', min: 0, max: 10,   decimals: 2, posHigh: true, focus: true },
      { key: 'HBeAg',   name: '乙肝e抗原',           unit: 'S/CO',   min: 0, max: 1,    decimals: 3, focus: true },
      { key: 'AntiHBe', name: '乙肝e抗体',           unit: 'S/CO',   min: 1, max: null, decimals: 2, inverted: true, focus: true },
      { key: 'AntiHBc', name: '乙肝核心抗体IgG',     unit: 'S/CO',   min: 0, max: 1,    decimals: 2, focus: true },
      { key: 'HBsAg',   name: '乙肝表面抗原(稀释)',  unit: 'IU/mL',  min: 0, max: 0.05, decimals: 2, focus: true }
    ]
  },
  {
    id: 'hbv_rna',
    name: 'HBV-DNA / RNA',
    nameShort: '病毒载量',
    icon: 'activity',
    indicators: [
      { key: 'HBV_DNA',      name: '乙肝病毒DNA',     unit: 'IU/mL',    min: 0, max: 20, decimals: 0, sci: true, focus: true },
      { key: 'HBV_DNA_LOAD', name: '乙肝病毒DNA载量', unit: 'IU/mL',    min: 0, max: 0,  decimals: 0, sci: true, focus: true, standardText: '未检测到' },
      { key: 'HBV_RNA',      name: '乙肝病毒RNA',     unit: 'Copies/mL', min: 0, max: 0,  decimals: 0, sci: true, focus: true, standardText: '未检测到' }
    ]
  },
  {
    id: 'fibroscan',
    name: 'FibroScan 肝弹',
    nameShort: '肝弹',
    icon: 'gauge',
    indicators: [
      { key: 'CAP',   name: 'CAP 脂肪衰减',   unit: 'dB/m', min: null, max: 259, decimals: 0, focus: true,
        stages: [ {label:'脂肪变≤10%', v:238}, {label:'脂肪变≥11%', v:259}, {label:'脂肪变≥34%', v:292}, {label:'脂肪变≥67%', v:313} ] },
      { key: 'E_KPA', name: 'E 肝硬度',       unit: 'kPa',  min: null, max: 7.3, decimals: 1, focus: true,
        stages: [ {label:'F0F1', v:7.3}, {label:'F2', v:9.7}, {label:'F2F3', v:12.4}, {label:'F3F4', v:17.5} ] }
    ]
  },
  {
    id: 'ultrasound',
    name: '腹部超声',
    nameShort: '超声',
    icon: 'scan',
    indicators: [
      { key: 'LIV_L_T',  name: '肝左叶厚径',       unit: 'mm', min: null, max: 60,  decimals: 0 },
      { key: 'LIV_L_LS', name: '肝左叶上下径',     unit: 'mm', min: null, max: 90,  decimals: 0 },
      { key: 'LIV_R_OB',  name: '肝右叶斜径',     unit: 'mm', min: null, max: 140, decimals: 0 },
      { key: 'SP_SUP_L', name: '平卧位脾脏长径', unit: 'mm', min: null, max: 110, decimals: 0 },
      { key: 'SP_SUP_T', name: '平卧位脾脏厚径', unit: 'mm', min: null, max: 40,  decimals: 0 },
      { key: 'SP_RIB_L', name: '脾肋缘长径',     unit: 'mm', min: null, max: 120, decimals: 0 },
      { key: 'SP_RIB_T', name: '脾肋缘厚径',     unit: 'mm', min: null, max: 45,  decimals: 0 },
      { key: 'BILE_IN',  name: '肝内胆管',       unit: 'mm', min: null, max: 2,   decimals: 1 },
      { key: 'BILE_OUT', name: '肝外胆管',       unit: 'mm', min: null, max: 6,   decimals: 1 },
      { key: 'GB_L',     name: '空腹胆囊长径',   unit: 'mm', min: null, max: 80,  decimals: 0 },
      { key: 'GB_W',     name: '空腹胆囊横径',   unit: 'mm', min: null, max: 35,  decimals: 0 },
      { key: 'GB_WALL',  name: '胆囊壁厚',       unit: 'mm', min: null, max: 3,   decimals: 1, focus: true }
    ]
  },
  {
    id: 'tumor_markers',
    name: '肿瘤标志物',
    nameShort: '肿标',
    icon: 'activity',
    indicators: [
      { key: 'AFP',     name: '甲胎蛋白',              unit: 'ng/mL',   min: 0, max: 7,   decimals: 1, focus: true },
      { key: 'AFP_L3',  name: 'AFP-L3 比率',           unit: '%',       min: 0, max: 10,  decimals: 1, focus: true },
      { key: 'DCP',     name: '异常凝血酶原 PIVKA-II', unit: 'mAU/mL', min: 0, max: 40,  decimals: 1, focus: true }
    ]
  }
];

// 展开为 key → 定义 的快速查找表
const INDICATOR_MAP = {};
INDICATOR_CATEGORIES.forEach(cat => {
  cat.indicators.forEach(ind => {
    ind.categoryId = cat.id;
    ind.categoryName = cat.nameShort;
    INDICATOR_MAP[ind.key] = ind;
  });
});

// 异常判定: 返回 { status:'normal|high|low', arrow:'↑|↓|', color }
function evalIndicator(key, value) {
  const def = INDICATOR_MAP[key];
  if (!def || value === null || value === undefined || value === '') {
    return { status: 'empty', arrow: '', label: '—' };
  }
  const v = parseFloat(value);
  if (isNaN(v)) return { status: 'empty', arrow: '', label: '—' };

  // 乙肝e抗体等 inverted: 低于min才异常(需转阳但未转)
  if (def.inverted) {
    if (def.min !== null && v < def.min) return { status: 'low', arrow: '↓', label: '低' };
    return { status: 'normal', arrow: '', label: '正常' };
  }
  if (def.max !== null && v > def.max) return { status: 'high', arrow: '↑', label: '偏高' };
  if (def.min !== null && v < def.min) return { status: 'low', arrow: '↓', label: '偏低' };
  return { status: 'normal', arrow: '', label: '正常' };
}

// 参考范围显示文本
function refRangeText(key) {
  const d = INDICATOR_MAP[key];
  if (!d) return '';
  if (d.standardText) return d.standardText;
  if (d.min !== null && d.max !== null) return `${d.min} ~ ${d.max}`;
  if (d.min !== null) return `≥ ${d.min}`;
  if (d.max !== null) return `≤ ${d.max}`;
  return '—';
}

if (typeof module !== 'undefined') module.exports = { INDICATOR_CATEGORIES, INDICATOR_MAP, evalIndicator, refRangeText };
