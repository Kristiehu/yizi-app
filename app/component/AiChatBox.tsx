'use client';
import { useState } from 'react';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalHoroscope } from 'iztro/lib/astro/FunctionalHoroscope';
import type { Profile } from './ProfilePanel';
import type { T } from '../lib/i18n';

interface AiChatBoxProps {
  currentProfile: Profile;
  targetDate: string;
  horoscope: IFunctionalHoroscope | null;
  astrolabeData: IFunctionalAstrolabe | null;
  t: T;
}

/**
 * 盘面上下文 -> 可复制的提问。
 *
 * 这里**没有接任何模型**：这个项目里没有 API route，也没有任何 key。
 * 所以本组件做的是把盘面事实整理成一段上下文，让你贴到外部模型里去问，
 * 而不是在前端编一段“AI 解读”出来。要真正接模型，加一个 app/api/chat/route.ts。
 *
 * 上下文的字段名跟随界面语言：用英文界面的人要的是英文上下文。
 * 盘面术语本身（宫位名、星曜名）由 iztro 按 bySolar 的 language 参数输出。
 */
function buildContext(
  profile: Profile,
  targetDate: string,
  astrolabeData: IFunctionalAstrolabe | null,
  horoscope: IFunctionalHoroscope | null,
  t: T,
): string {
  if (!astrolabeData) return t('ctxUnavailable');

  const natalPalaceAt = (index?: number) =>
    typeof index === 'number' ? astrolabeData.palaces[index]?.name ?? '—' : '—';

  const lines: string[] = [
    `${t('ctxMaster')}：${profile.name}（${profile.gender === 'male' ? t('genderMale') : t('genderFemale')}）`,
    `${t('ctxSolarDate')}：${profile.solarDate}，${t('ctxTimeIndex')}：${t.hours[profile.timeIndex] ?? profile.timeIndex}`,
    `${t('ctxLunarDate')}：${astrolabeData.lunarDate}`,
    `${t('ctxFiveElements')}：${astrolabeData.fiveElementsClass}`,
    `${t('ctxSoulBranch')}：${astrolabeData.earthlyBranchOfSoulPalace}，${t('ctxBodyBranch')}：${astrolabeData.earthlyBranchOfBodyPalace}`,
    '',
    t('ctxPalaces'),
    ...astrolabeData.palaces.map(
      (p) =>
        `  ${p.name}（${p.heavenlyStem}${p.earthlyBranch}）${t('ctxMajorStars')}：${
          p.majorStars.map((s) => s.name).join('、') || t('ctxNone')
        }；${t('ctxMinorStars')}：${p.minorStars.map((s) => s.name).join('、') || t('ctxNone')}`,
    ),
  ];

  if (horoscope) {
    lines.push(
      '',
      `${t('ctxTargetDate')}：${targetDate}`,
      `${t('ctxYearly')}：${horoscope.yearly.heavenlyStem}${horoscope.yearly.earthlyBranch}${t('yearSuffix')}，${t('ctxFallsIn')}${natalPalaceAt(horoscope.yearly.index)}`,
      `${t('ctxMonthly')}：${t('ctxFallsIn')}${natalPalaceAt(horoscope.monthly.index)}`,
      `${t('ctxDaily')}：${t('ctxFallsIn')}${natalPalaceAt(horoscope.daily.index)}`,
      `${t('ctxDecadal')}：${t('ctxFallsIn')}${natalPalaceAt(horoscope.decadal.index)}（${t('nominalAge')} ${horoscope.age.nominalAge}）`,
    );
  }

  return lines.join('\n');
}

export default function AiChatBox({
  currentProfile,
  targetDate,
  horoscope,
  astrolabeData,
  t,
}: AiChatBoxProps) {
  const [question, setQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const context = buildContext(currentProfile, targetDate, astrolabeData, horoscope, t);
  const payload = question.trim()
    ? `${context}\n\n${t('ctxQuestion')}：${question.trim()}`
    : context;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error(t('copyFailed'), e);
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md space-y-3">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-md font-semibold text-purple-300">{t('aiTitle')}</h2>
          <p className="text-xs text-slate-400">{t('aiSubtitle')}</p>
        </div>
        <span className="text-[10px] text-amber-400/90 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-lg whitespace-nowrap">
          {t('notConnected')}
        </span>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={t('questionPlaceholder')}
        rows={2}
        className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white placeholder:text-slate-600 resize-none focus:outline-none focus:border-purple-500"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!astrolabeData}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
        >
          {copied ? t('copied') : t('copyContext')}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          {open ? t('hidePayload') : t('showPayload')}
        </button>
      </div>

      {open && (
        <pre className="text-[10px] leading-relaxed text-slate-400 bg-slate-900/70 border border-slate-700/60 p-3 rounded-lg max-h-64 overflow-auto whitespace-pre-wrap">
          {payload}
        </pre>
      )}
    </div>
  );
}
