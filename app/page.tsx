'use client';
import { useState } from 'react';
import { astrolabe } from 'iztro';

export default function Home() {
  // 假数据：用户出生信息
  const [birthDate] = useState('1995-08-18');
  const [birthTimeIndex] = useState(4); // 卯时
  const [gender] = useState<'male' | 'female'>('male');

  // 动态选择的目标查询日期（默认今天）
  const [targetDate, setTargetDate] = useState('2026-11-05');

  // 1. 调用 iztro 生成本命盘
  const astrolabeData = astrolabe.bySolar(birthDate, birthTimeIndex, gender, true, 'zh-CN');

  // 2. 动态调取目标日期的流盘数据（包含流年、流月、流日）
  const horoscope = astrolabeData.horoscope(targetDate);

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">紫微斗数动态流盘测试</h1>
      
      {/* 日期选择器：测试切换流年流月流日 */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <label className="block text-sm font-medium mb-2">切换查询日期 (流盘)：</label>
        <input 
          type="date" 
          value={targetDate} 
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* 显示计算结果 */}
      <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
        <h2 className="font-semibold text-indigo-600">当前流盘切片信息：</h2>
        <p>🗓️ 目标日期：{targetDate}</p>
        <p>🐉 流年干支：{horoscope.year.heavenlyStem}{horoscope.year.earthlyBranch}</p>
        <p>🏠 流年命宫位置：{horoscope.year.palaceName}</p>
        <p>🌙 流月命宫位置：{horoscope.month.palaceName}</p>
        <p>☀️ 流日命宫位置：{horoscope.day.palaceName}</p>
      </div>
    </div>
  );
}