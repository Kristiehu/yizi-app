'use client';
import { UI_LANGS, LANG_LABELS, type T, type UiLang } from '../lib/i18n';

interface LanguageSwitcherProps {
  lang: UiLang;
  onChange: (lang: UiLang) => void;
  t: T;
}

export default function LanguageSwitcher({ lang, onChange, t }: LanguageSwitcherProps) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-400">
      <span className="sr-only">{t('langLabel')}</span>
      <span aria-hidden="true">🌐</span>
      <select
        value={lang}
        onChange={(e) => onChange(e.target.value as UiLang)}
        aria-label={t('langLabel')}
        className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1.5 rounded-lg text-xs focus:outline-none focus:border-purple-500"
      >
        {UI_LANGS.map((code) => (
          <option key={code} value={code}>
            {LANG_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
