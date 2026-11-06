'use client';
import { useState, useEffect } from 'react';
import { astrolabe } from 'iztro';
import ProfilePanel, { Profile } from './components/ProfilePanel';
import HoroscopeBar from './components/HoroscopeBar';
import AstrolabeGrid from './components/AstrolabeGrid';
import AiChatBox from './components/AiChatBox';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: '自己', gender: 'male', solarDate: '1995-08-18', timeIndex: 4 }
  ]);
  const [currentId, setCurrentId] = useState<string>('1');
  const [targetDate, setTargetDate] = useState<string>('2026-11-05');

  // 初始化加载本地档案
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

  const handleSaveProfile = (profile: Profile, isEditing: boolean) => {
    if (isEditing) {
      const updated = profiles.map(p => p.id === profile.id ? profile : p);
      saveProfilesToStorage(updated);
      alert('档案修改成功！');
    } else {
      const updated = [...profiles, profile];
      saveProfilesToStorage(updated);
      setCurrentId(profile.id);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert('至少需要保留一个档案！');
      return;
    }
    if (confirm('确定要删除该档案吗？')) {
      const updated = profiles.filter(p => p.id !== id);
      saveProfilesToStorage(updated);
      setCurrentId(updated[0].id);
    }
  };

  const currentProfile = profiles.find(p => p.id === currentId) || profiles[0];

  // 计算排盘与流盘
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
        
        {/* 顶部标题栏 */}
        <header className="bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-purple-400">Yiii · 易紫</h1>
            <p className="text-xs text-slate-400">多档案紫微斗数动态流盘与 AI 洞察系统</p>
          </div>
        </header>

        {/* 控制面板：档案管理 + 时空流盘切换 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfilePanel 
            profiles={profiles}
            currentId={currentId}
            onSelectProfile={setCurrentId}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
          />
          <HoroscopeBar 
            targetDate={targetDate}
            onDateChange={setTargetDate}
            horoscope={horoscope}
          />
        </div>

        {/* AI 智能问答组件 */}
        <AiChatBox 
          currentProfile={currentProfile}
          targetDate={targetDate}
          horoscope={horoscope}
          astrolabeData={astrolabeData}
        />

        {/* 十二宫格排盘主界面 */}
        <AstrolabeGrid 
          astrolabeData={astrolabeData}
          currentName={currentProfile.name}
        />

      </div>
    </div>
  );
}