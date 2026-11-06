'use client';
import { useState, useEffect } from 'react';
import { astro } from 'iztro';
import type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
import type { IFunctionalHoroscope } from 'iztro/lib/astro/FunctionalHoroscope';
import ProfilePanel, { type Profile } from './component/ProfilePanel';
import HoroscopeBar from './component/HoroscopeBar';
import AstrolabeGrid from './component/AstrolabeGrid';
import AiChatBox from './component/AiChatBox';
import LanguageSwitcher from './component/LanguageSwitcher';
import { getT, detectLang, readStoredLang, storeLang, type UiLang } from './lib/i18n';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<UiLang>('zh-CN');
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: '自己', gender: 'male', solarDate: '1995-08-18', timeIndex: 4 }
  ]);
  const [currentId, setCurrentId] = useState<string>('1');
  const [targetDate, setTargetDate] = useState<string>('2026-11-05');

  const t = getT(lang);

  // 初始化：语言与本地档案。两者都只存在于客户端。
  useEffect(() => {
    setMounted(true);
    setLang(readStoredLang() ?? detectLang());
    const saved = localStorage.getItem('yizi_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setProfiles(parsed);
          setCurrentId(parsed[0].id);
        }
      } catch (e) {
        console.error(t('loadProfilesFailed'), e);
      }
    }
  }, []);

  // 语言是客户端状态，服务端渲染时并不知道，所以在这里同步 <html lang>。
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleChangeLang = (next: UiLang) => {
    setLang(next);
    storeLang(next);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex items-center justify-center">{t('loading')}</div>;
  }

  const saveProfilesToStorage = (newProfiles: Profile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem('yizi_profiles', JSON.stringify(newProfiles));
  };

  const handleSaveProfile = (profile: Profile, isEditing: boolean) => {
    if (isEditing) {
      const updated = profiles.map(p => p.id === profile.id ? profile : p);
      saveProfilesToStorage(updated);
      alert(t('alertEditSuccess'));
    } else {
      const updated = [...profiles, profile];
      saveProfilesToStorage(updated);
      setCurrentId(profile.id);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert(t('alertKeepOne'));
      return;
    }
    if (confirm(t('confirmDelete'))) {
      const updated = profiles.filter(p => p.id !== id);
      saveProfilesToStorage(updated);
      setCurrentId(updated[0].id);
    }
  };

  const currentProfile = profiles.find(p => p.id === currentId) || profiles[0];

  // 计算排盘与流盘。类型来自 iztro，不要退回 any —
  // 本文件此前的 horoscope.year / fiveElements局 之类的字段错误正是 any 掩盖掉的。
  //
  // 语言显式传给 bySolar：iztro 的已生成星盘会保留生成时的语言，所以切语言必须重新排盘，
  // 而这里每次渲染都重算，lang 变了盘面术语就跟着变。
  let astrolabeData: IFunctionalAstrolabe | null = null;
  let horoscope: IFunctionalHoroscope | null = null;
  try {
    astrolabeData = astro.bySolar(
      currentProfile.solarDate,
      currentProfile.timeIndex,
      currentProfile.gender,
      true,
      lang
    );
    horoscope = astrolabeData.horoscope(targetDate);
  } catch (error) {
    console.error(t('calcFailed'), error);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 顶部标题栏 */}
        <header className="bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-700 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wider text-purple-400">Yiii · 易紫</h1>
            <p className="text-xs text-slate-400">{t('appSubtitle')}</p>
          </div>
          <LanguageSwitcher lang={lang} onChange={handleChangeLang} t={t} />
        </header>

        {/* 控制面板：档案管理 + 时空流盘切换 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfilePanel
            profiles={profiles}
            currentId={currentId}
            onSelectProfile={setCurrentId}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
            t={t}
          />
          <HoroscopeBar
            targetDate={targetDate}
            onDateChange={setTargetDate}
            horoscope={horoscope}
            astrolabeData={astrolabeData}
            t={t}
          />
        </div>

        {/* AI 智能问答组件 */}
        <AiChatBox
          currentProfile={currentProfile}
          targetDate={targetDate}
          horoscope={horoscope}
          astrolabeData={astrolabeData}
          t={t}
        />

        {/* 十二宫格排盘主界面 */}
        <AstrolabeGrid
          astrolabeData={astrolabeData}
          currentName={currentProfile.name}
          t={t}
        />

      </div>
    </div>
  );
}
