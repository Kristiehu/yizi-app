'use client';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { T } from '../lib/i18n';

interface AstrolabeGridProps {
  astrolabeData: IFunctionalAstrolabe | null;
  currentName: string;
  t: T;
}

export default function AstrolabeGrid({ astrolabeData, currentName, t }: AstrolabeGridProps) {
  if (!astrolabeData) return null;

  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-purple-300">{t('gridTitle')}</h2>
        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
          {t('master')}: {currentName} | {t('fiveElements')}: {astrolabeData.fiveElementsClass}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {astrolabeData.palaces.map((palace, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl min-h-[140px] flex flex-col justify-between hover:border-purple-500 transition shadow-inner"
          >
            {/* 宫位头部 */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="font-bold text-sm text-purple-400">{palace.name}</span>
              <span className="text-xs text-slate-500">{palace.earthlyBranch}</span>
            </div>

            {/* 星曜内容 */}
            <div className="py-1.5 space-y-1 flex-1">
              <div className="text-xs text-amber-300 font-medium leading-relaxed">
                {palace.majorStars.map((s) => s.name).join(' ')}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {palace.minorStars.map((s) => s.name).join(' ')}
              </div>
            </div>

            {/* 宫位底部 */}
            <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/50">
              <span>{palace.ages.join('-')}{t('ageSuffix')}</span>
              <span className="text-slate-400">{palace.heavenlyStem}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
