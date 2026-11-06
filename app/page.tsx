'use client';
import { useState, useEffect } from 'react';
import { astrolabe } from 'iztro';

interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  solarDate: string;
  timeIndex: number;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: '自己', gender: 'male', solarDate: '1995-08-18', timeIndex: 4 }
  ]);
  const [currentId, setCurrentId] = useState<string>('1');
  const [targetDate, setTargetDate] = useState<string>('2026-11-05');

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2000-01-01');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newTimeIndex, setNewTimeIndex] = useState(0);

  // 确保只在客户端加载 localStorage 和 iztro
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('yizi_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setProfiles(parsed);
          setCurrentId(parsed[0].id);
        }
      } catch (e) {
        console.error("读取本地档案失败", e);
      }
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex items-center justify-center">加载中...</div>;
  }

  const saveProfilesToStorage = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('yizi_profiles', JSON.stringify(newProfiles));
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newName,
      gender: newGender,
      solarDate: newDate,
      timeIndex: Number(newTimeIndex),
    };
    const updated = [...profiles, newProfile];
    saveProfilesToStorage(updated);
    setCurrentId(newProfile.id);
    setNewName('');
  };

  const currentProfile = profiles.find(p => p.id === currentId) || profiles[0];

  // 安全调用 iztro 排盘
  let astrolabeData: any = null;
  let horoscope: any = null;
  try {
    if (astrolabe && typeof astrolabe.bySolar === 'function') {
      astrolabeData = astrolabe.bySolar(
        currentProfile.solarDate, 
        currentProfile.timeIndex, 
        currentProfile.gender, 
        true, 
        'zh-CN'
      );
      horoscope = astrolabeData.horoscope(targetDate);
    }
  } catch (error) {
    console.error("排盘计算出错:", error);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 顶部标题与档案切换区 */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-purple-400">Yiii · 易紫</h1>
            <p className="text-xs text-slate-400">多档案紫微斗数动态流盘系统</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">当前档案:</label>
            <select 
              value={currentId} 
              onChange={(e) => setCurrentId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-purple-500"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.solarDate})</option>
              ))}
            </select>
          </div>
        </header>

        {/* 控制面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md">
            <h2 className="text-md font-semibold mb-3 text-purple-300">⏳ 动态时空切换 (流年/流月/流日)</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">选择目标查询日期：</label>
                <input 
                  type="date" 
                  value={targetDate} 
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg text-white"
                />
              </div>
              {horoscope && (
                <div className="text-xs text-slate-300 flex justify-between bg-slate-900/50 p-3 rounded-lg">
                  <span>🐉 流年: <strong className="text-purple-400">{horoscope.year.heavenlyStem}{horoscope.year.earthlyBranch}年 ({horoscope.year.palaceName})</strong></span>
                  <span>🌙 流月: <strong className="text-blue-400">{horoscope.month.palaceName}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-md">
            <h2 className="text-md font-semibold mb-3 text-purple-300">➕ 添加新亲友档案</h2>
            <form onSubmit={handleAddProfile} className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="姓名" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
                />
                <select 
                  value={newGender} 
                  onChange={(e) => setNewGender(e.target.value as 'male' | 'female')}
                  className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
                />
                <select 
                  value={newTimeIndex}
                  onChange={(e) => setNewTimeIndex(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-sm text-white"
                >
                  {Array.from({ length: 13 }).map((_, i) => (
                    <option key={i} value={i}>时辰索引 {i}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-1.5 rounded-lg text-sm font-medium transition">
                保存档案
              </button>
            </form>
          </div>
        </div>

        {/* 十二宫格排盘主界面 */}
        {astrolabeData && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-lg font-bold mb-4 text-purple-300 flex items-center justify-between">
              <span>✨ 紫微斗数十二宫格盘面</span>
              <span className="text-xs font-normal text-slate-400">命主: {currentProfile.name} | 五行局: {astrolabeData.fiveElements局}</span>
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {astrolabeData.palaces.map((palace: any, index: number) => (
                <div 
                  key={index}
                  className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl min-h-[130px] flex flex-col justify-between hover:border-purple-500 transition"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                    <span className="font-bold text-sm text-purple-400">{palace.name}</span>
                    <span className="text-xs text-slate-500">{palace.earthlyBranch}</span>
                  </div>

                  <div className="py-1 space-y-1 flex-1">
                    <div className="text-xs text-amber-300 font-medium truncate">
                      {palace.majorStars.map((s: any) => s.name).join(' ')}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {palace.minorStars.map((s: any) => s.name).join(' ')}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/50">
                    <span>{palace.ages.join('-')}岁</span>
                    <span className="text-slate-400">{palace.heavenlyStem}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}