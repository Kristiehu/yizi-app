'use client';
import { useState, useEffect } from 'react';
import { astrolabe } from 'iztro';

// 1. 定义档案数据结构
interface Profile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  solarDate: string; // 格式: YYYY-MM-DD
  timeIndex: number; // 时辰索引 (0-12)
}

export default function Home() {
  // 档案列表状态
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: '自己', gender: 'male', solarDate: '1995-08-18', timeIndex: 4 }
  ]);
  const [currentId, setCurrentId] = useState<string>('1');
  
  // 目标查询时间（用于看流年/流月/流日）
  const [targetDate, setTargetDate] = useState<string>('2026-11-05');

  // 新增档案表单状态
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('2000-01-01');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newTimeIndex, setNewTimeIndex] = useState(0);

  // 初始化：从浏览器的 localStorage 读取保存的档案
  useEffect(() => {
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

  // 保存档案到 localStorage
  const saveProfilesToStorage = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('yizi_profiles', JSON.stringify(newProfiles));
  };

  // 添加新档案
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

  // 获取当前选中的档案
  const currentProfile = profiles.find(p => p.id === currentId) || profiles[0];

  // 2. 调用 iztro 计算本命盘与流盘数据
  const astrolabeData = astrolabe.bySolar(
    currentProfile.solarDate, 
    currentProfile.timeIndex, 
    currentProfile.gender, 
    true, 
    'zh-CN'
  );
  const horoscope = astrolabeData.horoscope(targetDate);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 顶部标题与档案切换区 */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-purple-400">Yiii · 易紫</h1>
            <p className="text-xs text-slate-400">多档案紫微斗数动态流盘系统</p>
          </div>

          {/* 档案选择下拉框 */}
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

        {/* 控制面板：流盘时间切换 & 添加档案 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 流盘时间选择 */}
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
              <div className="text-xs text-slate-300 flex justify-between bg-slate-900/50 p-3 rounded-lg">
                <span>🐉 流年: <strong className="text-purple-400">{horoscope.year.heavenlyStem}{horoscope.year.earthlyBranch}年 ({horoscope.year.palaceName})</strong></span>
                <span>🌙 流月: <strong className="text-blue-400">{horoscope.month.palaceName}</strong></span>
              </div>
            </div>
          </div>

          {/* 添加新档案表单 */}
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

        {/* 3. 十二宫格排盘主界面 */}
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-purple-300 flex items-center justify-between">
            <span>✨ 紫微斗数十二宫格盘面</span>
            <span className="text-xs font-normal text-slate-400">命主: {currentProfile.name} | 五行局: {astrolabeData.fiveElements局}</span>
          </h2>

          {/* 经典宫位网格 (4x4 布局模拟十二宫) */}
          <div className="grid grid-cols-4 gap-2">
            {astrolabeData.palaces.map((palace, index) => (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl min-h-[130px] flex flex-col justify-between hover:border-purple-500 transition"
              >
                {/* 宫位头部：宫名与地支 */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                  <span className="font-bold text-sm text-purple-400">{palace.name}</span>
                  <span className="text-xs text-slate-500">{palace.earthlyBranch}</span>
                </div>

                {/* 宫内星曜显示 */}
                <div className="py-1 space-y-1 flex-1">
                  <div className="text-xs text-amber-300 font-medium truncate">
                    {palace.majorStars.map(s => s.name).join(' ')}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {palace.minorStars.map(s => s.name).join(' ')}
                  </div>
                </div>

                {/* 宫位底部：岁限信息 */}
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/50">
                  <span>{palace.ages.join('-')}岁</span>
                  <span className="text-slate-400">{palace.heavenlyStem}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}