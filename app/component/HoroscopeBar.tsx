'use client';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalHoroscope } from 'iztro/lib/astro/FunctionalHoroscope';
import type { T } from '../lib/i18n';

interface HoroscopeBarProps {
  targetDate: string;
  onDateChange: (date: string) => void;
  horoscope: IFunctionalHoroscope | null;
  astrolabeData: IFunctionalAstrolabe | null;
  t: T;
}

export default function HoroscopeBar({
  targetDate,
  onDateChange,
  horoscope,
  astrolabeData,
  t,
}: HoroscopeBarProps) {
  // iztro 的运限对象只带 index（落在本命第几宫）和 palaceNames（该运限的十二宫），
  // 没有 palaceName。本命宫位名要用 index 回查 palaces。
  const natalPalaceAt = (index?: number) =>
    typeof index === 'number' ? astrolabeData?.palaces[index]?.name ?? '—' : '—';

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md space-y-3 flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold text-purple-300">{t('horoTitle')}</h2>
        <p className="text-xs text-slate-400">{t('horoSubtitle')}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">{t('pickDate')}</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white text-sm"
          />
        </div>

        {horoscope && (
          <div className="text-xs text-slate-300 grid grid-cols-2 gap-2 bg-slate-900/50 p-3 rounded-lg">
            <div>
              <span className="text-slate-400 block">{t('yearlyStem')}</span>
              <strong className="text-purple-400 text-sm">
                {horoscope.yearly.heavenlyStem}{horoscope.yearly.earthlyBranch}{t('yearSuffix')}
                （{natalPalaceAt(horoscope.yearly.index)}）
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t('monthlyPalace')}</span>
              <strong className="text-blue-400 text-sm">
                {natalPalaceAt(horoscope.monthly.index)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t('dailyPalace')}</span>
              <strong className="text-emerald-400 text-sm">
                {natalPalaceAt(horoscope.daily.index)}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">
                {t('decadal')}（{t('nominalAge')} {horoscope.age.nominalAge}）：
              </span>
              <strong className="text-amber-400 text-sm">
                {natalPalaceAt(horoscope.decadal.index)}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
