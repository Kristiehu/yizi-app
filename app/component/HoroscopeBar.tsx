'use client';

interface HoroscopeBarProps {
  targetDate: string;
  onDateChange: (date: string) => void;
  horoscope: any;
}

export default function HoroscopeBar({ targetDate, onDateChange, horoscope }: HoroscopeBarProps) {
  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md space-y-3 flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold text-purple-300">⏳ 动态时空切换 (流年/流月/流日)</h2>
        <p className="text-xs text-slate-400">选择任意日期，实时推算当下的流盘切片</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-400 block mb-1">选择目标查询日期：</label>
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
              <span className="text-slate-400 block">🐉 流年干支：</span>
              <strong className="text-purple-400 text-sm">{horoscope.year.heavenlyStem}{horoscope.year.earthlyBranch}年 ({horoscope.year.palaceName})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">🌙 流月命宫：</span>
              <strong className="text-blue-400 text-sm">{horoscope.month.palaceName}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}