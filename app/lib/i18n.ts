/**
 * UI 文案词表。
 *
 * 两层语言要分清：
 * - **盘面术语**（宫位名、星曜名、五行局、干支）由 iztro 负责，把 language 传给
 *   astro.bySolar() 即可，iztro 内建 en-US / ja-JP / ko-KR / vi-VN / zh-CN / zh-TW。
 * - **界面文案**（本文件）是我们自己的，目前做三种。
 *
 * iztro 也有公开的 t() / setLanguage()，能把时辰名等直接翻成六种语言，但那是全局可变状态，
 * 在 render 里调用会与 bySolar 的显式 language 参数相互干扰，所以这里自带一份。
 * 以后要加 ja-JP / ko-KR / vi-VN，只需在下面补一个 Dict —— UI_LANGS 和 DICT 的类型会强制
 * 每个 key 都补齐，漏一个就是编译错误，不是运行时的 undefined。
 */

export const UI_LANGS = ['zh-CN', 'zh-TW', 'en-US'] as const;
export type UiLang = (typeof UI_LANGS)[number];

/** 时辰 0–12（含早子时与晚子时），顺序必须与 iztro 的 timeIndex 一致。 */
type Hours = readonly [
  string, string, string, string, string, string, string,
  string, string, string, string, string, string,
];

const zhCN = {
  // 顶部
  appSubtitle: '多档案紫微斗数动态流盘与 AI 洞察系统',
  loading: '加载中...',
  langLabel: '语言',

  // 档案面板
  profilesTitle: '👤 档案管理',
  profilesSubtitle: '切换或管理您的亲友紫微命盘档案',
  editCurrent: '修改当前',
  cancel: '取消',
  addNew: '➕ 添加新档案',
  editingProfile: '✏️ 修改当前档案',
  namePlaceholder: '姓名',
  genderMale: '男',
  genderFemale: '女',
  saveEdit: '保存修改',
  confirmAdd: '确认添加',
  delete: '删除',
  alertEditSuccess: '档案修改成功！',
  alertKeepOne: '至少需要保留一个档案！',
  confirmDelete: '确定要删除该档案吗？',
  loadProfilesFailed: '读取本地档案失败',
  calcFailed: '排盘计算出错:',

  // 流盘
  horoTitle: '⏳ 动态时空切换 (流年/流月/流日)',
  horoSubtitle: '选择任意日期，实时推算当下的流盘切片',
  pickDate: '选择目标查询日期：',
  yearlyStem: '🐉 流年干支：',
  monthlyPalace: '🌙 流月命宫：',
  dailyPalace: '☀️ 流日命宫：',
  decadal: '🧭 大限',
  nominalAge: '虚岁',
  yearSuffix: '年',

  // 盘面
  gridTitle: '✨ 紫微斗数十二宫格盘面',
  master: '命主',
  fiveElements: '五行局',
  ageSuffix: '岁',

  // AI
  aiTitle: '🤖 AI 洞察',
  aiSubtitle: '把当前盘面整理成上下文，复制到你用的模型里提问',
  notConnected: '未接入模型',
  questionPlaceholder: '想问什么？例如：今年流年走到哪一宫，适合换工作吗',
  copyContext: '复制盘面上下文',
  copied: '已复制 ✓',
  showPayload: '查看将要复制的内容',
  hidePayload: '收起',
  copyFailed: '复制失败',

  // AI 上下文里的字段名（会被一起复制出去，所以也跟随界面语言）
  ctxUnavailable: '（排盘未成功，无法生成上下文）',
  ctxMaster: '命主',
  ctxSolarDate: '阳历生日',
  ctxTimeIndex: '时辰',
  ctxLunarDate: '农历',
  ctxFiveElements: '五行局',
  ctxSoulBranch: '命宫地支',
  ctxBodyBranch: '身宫地支',
  ctxPalaces: '十二宫：',
  ctxMajorStars: '主星',
  ctxMinorStars: '辅星',
  ctxNone: '无',
  ctxTargetDate: '查询日期',
  ctxYearly: '流年',
  ctxMonthly: '流月',
  ctxDaily: '流日',
  ctxDecadal: '大限',
  ctxFallsIn: '落本命',
  ctxQuestion: '问题',

  hours: [
    '早子时 23:00–01:00',
    '丑时 01:00–03:00',
    '寅时 03:00–05:00',
    '卯时 05:00–07:00',
    '辰时 07:00–09:00',
    '巳时 09:00–11:00',
    '午时 11:00–13:00',
    '未时 13:00–15:00',
    '申时 15:00–17:00',
    '酉时 17:00–19:00',
    '戌时 19:00–21:00',
    '亥时 21:00–23:00',
    '晚子时 23:00–01:00',
  ] as Hours,
} as const;

/** 所有语言必须覆盖 zhCN 的全部 key —— 漏一个就是编译错误。 */
type Dict = { readonly [K in keyof typeof zhCN]: (typeof zhCN)[K] extends Hours ? Hours : string };

const zhTW: Dict = {
  appSubtitle: '多檔案紫微斗數動態流盤與 AI 洞察系統',
  loading: '載入中...',
  langLabel: '語言',

  profilesTitle: '👤 檔案管理',
  profilesSubtitle: '切換或管理您的親友紫微命盤檔案',
  editCurrent: '修改目前',
  cancel: '取消',
  addNew: '➕ 新增檔案',
  editingProfile: '✏️ 修改目前檔案',
  namePlaceholder: '姓名',
  genderMale: '男',
  genderFemale: '女',
  saveEdit: '儲存修改',
  confirmAdd: '確認新增',
  delete: '刪除',
  alertEditSuccess: '檔案修改成功！',
  alertKeepOne: '至少需要保留一個檔案！',
  confirmDelete: '確定要刪除該檔案嗎？',
  loadProfilesFailed: '讀取本機檔案失敗',
  calcFailed: '排盤計算出錯:',

  horoTitle: '⏳ 動態時空切換 (流年/流月/流日)',
  horoSubtitle: '選擇任意日期，即時推算當下的流盤切片',
  pickDate: '選擇目標查詢日期：',
  yearlyStem: '🐉 流年干支：',
  monthlyPalace: '🌙 流月命宮：',
  dailyPalace: '☀️ 流日命宮：',
  decadal: '🧭 大限',
  nominalAge: '虛歲',
  yearSuffix: '年',

  gridTitle: '✨ 紫微斗數十二宮格盤面',
  master: '命主',
  fiveElements: '五行局',
  ageSuffix: '歲',

  aiTitle: '🤖 AI 洞察',
  aiSubtitle: '把目前盤面整理成上下文，複製到你使用的模型裡提問',
  notConnected: '未接入模型',
  questionPlaceholder: '想問什麼？例如：今年流年走到哪一宮，適合換工作嗎',
  copyContext: '複製盤面上下文',
  copied: '已複製 ✓',
  showPayload: '檢視將要複製的內容',
  hidePayload: '收起',
  copyFailed: '複製失敗',

  ctxUnavailable: '（排盤未成功，無法產生上下文）',
  ctxMaster: '命主',
  ctxSolarDate: '陽曆生日',
  ctxTimeIndex: '時辰',
  ctxLunarDate: '農曆',
  ctxFiveElements: '五行局',
  ctxSoulBranch: '命宮地支',
  ctxBodyBranch: '身宮地支',
  ctxPalaces: '十二宮：',
  ctxMajorStars: '主星',
  ctxMinorStars: '輔星',
  ctxNone: '無',
  ctxTargetDate: '查詢日期',
  ctxYearly: '流年',
  ctxMonthly: '流月',
  ctxDaily: '流日',
  ctxDecadal: '大限',
  ctxFallsIn: '落本命',
  ctxQuestion: '問題',

  hours: [
    '早子時 23:00–01:00',
    '丑時 01:00–03:00',
    '寅時 03:00–05:00',
    '卯時 05:00–07:00',
    '辰時 07:00–09:00',
    '巳時 09:00–11:00',
    '午時 11:00–13:00',
    '未時 13:00–15:00',
    '申時 15:00–17:00',
    '酉時 17:00–19:00',
    '戌時 19:00–21:00',
    '亥時 21:00–23:00',
    '晚子時 23:00–01:00',
  ] as Hours,
};

const enUS: Dict = {
  appSubtitle: 'Multi-profile Zi Wei Dou Shu with dynamic transits and AI insight',
  loading: 'Loading...',
  langLabel: 'Language',

  profilesTitle: '👤 Profiles',
  profilesSubtitle: 'Switch between or manage the charts you have saved',
  editCurrent: 'Edit current',
  cancel: 'Cancel',
  addNew: '➕ Add a profile',
  editingProfile: '✏️ Editing',
  namePlaceholder: 'Name',
  genderMale: 'Male',
  genderFemale: 'Female',
  saveEdit: 'Save changes',
  confirmAdd: 'Add profile',
  delete: 'Delete',
  alertEditSuccess: 'Profile updated.',
  alertKeepOne: 'At least one profile must remain.',
  confirmDelete: 'Delete this profile?',
  loadProfilesFailed: 'Failed to read saved profiles',
  calcFailed: 'Chart calculation failed:',

  horoTitle: '⏳ Transits (yearly / monthly / daily)',
  horoSubtitle: 'Pick any date to recompute the transit slice for that moment',
  pickDate: 'Target date:',
  yearlyStem: '🐉 Year stem & branch:',
  monthlyPalace: '🌙 Monthly life palace:',
  dailyPalace: '☀️ Daily life palace:',
  decadal: '🧭 Decadal',
  nominalAge: 'nominal age',
  yearSuffix: '',

  gridTitle: '✨ Twelve-palace chart',
  master: 'Chart',
  fiveElements: 'Five Elements class',
  ageSuffix: '',

  aiTitle: '🤖 AI insight',
  aiSubtitle: 'Turn the current chart into context you can paste into your own model',
  notConnected: 'No model connected',
  questionPlaceholder: 'What do you want to ask? e.g. which palace is this year transiting, is it a good year to change jobs',
  copyContext: 'Copy chart context',
  copied: 'Copied ✓',
  showPayload: 'Show what will be copied',
  hidePayload: 'Hide',
  copyFailed: 'Copy failed',

  ctxUnavailable: '(Chart calculation failed, no context available)',
  ctxMaster: 'Subject',
  ctxSolarDate: 'Solar birth date',
  ctxTimeIndex: 'Hour',
  ctxLunarDate: 'Lunar date',
  ctxFiveElements: 'Five Elements class',
  ctxSoulBranch: 'Branch of Life palace',
  ctxBodyBranch: 'Branch of Body palace',
  ctxPalaces: 'Twelve palaces:',
  ctxMajorStars: 'major stars',
  ctxMinorStars: 'minor stars',
  ctxNone: 'none',
  ctxTargetDate: 'Target date',
  ctxYearly: 'Yearly',
  ctxMonthly: 'Monthly',
  ctxDaily: 'Daily',
  ctxDecadal: 'Decadal',
  ctxFallsIn: 'falls in natal',
  ctxQuestion: 'Question',

  hours: [
    'Early Rat 23:00–01:00',
    'Ox 01:00–03:00',
    'Tiger 03:00–05:00',
    'Rabbit 05:00–07:00',
    'Dragon 07:00–09:00',
    'Snake 09:00–11:00',
    'Horse 11:00–13:00',
    'Goat 13:00–15:00',
    'Monkey 15:00–17:00',
    'Rooster 17:00–19:00',
    'Dog 19:00–21:00',
    'Pig 21:00–23:00',
    'Late Rat 23:00–01:00',
  ] as Hours,
};

const DICT: Record<UiLang, Dict> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
};

export type MsgKey = keyof typeof zhCN;

/** 切换器里显示的语言名，用各自的母语写。 */
export const LANG_LABELS: Record<UiLang, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
};

export type T = {
  (key: Exclude<MsgKey, 'hours'>): string;
  hours: Hours;
  lang: UiLang;
};

export function getT(lang: UiLang): T {
  const d = DICT[lang];
  const fn = ((key: Exclude<MsgKey, 'hours'>) => d[key] as string) as T;
  fn.hours = d.hours;
  fn.lang = lang;
  return fn;
}

const STORAGE_KEY = 'yizi_lang';

export function isUiLang(value: unknown): value is UiLang {
  return typeof value === 'string' && (UI_LANGS as readonly string[]).includes(value);
}

export function readStoredLang(): UiLang | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isUiLang(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function storeLang(lang: UiLang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* 隐身模式或禁用了存储时忽略 */
  }
}

/** 浏览器语言 -> 我们支持的三种之一。zh-HK / zh-Hant 归到繁中。 */
export function detectLang(): UiLang {
  try {
    for (const raw of navigator.languages ?? [navigator.language]) {
      const tag = raw.toLowerCase();
      if (tag.startsWith('zh')) {
        return /hant|tw|hk|mo/.test(tag) ? 'zh-TW' : 'zh-CN';
      }
      if (tag.startsWith('en')) return 'en-US';
    }
  } catch {
    /* 拿不到就用默认 */
  }
  return 'zh-CN';
}
