'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-6"></div>
      <button
        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
        className="relative bg-[#0a0e27] border-4 border-white px-4 py-2 transform -skew-x-6 hover:skew-x-6 transition-all group-hover:scale-105"
      >
        <div className="flex items-center gap-2 skew-x-6">
          {language === 'en' ? (
            <>
              <span className="text-2xl">🇺🇸</span>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-xs leading-none">EN</span>
                <span className="text-[#f2a900] font-bold text-xs leading-none">中文</span>
              </div>
            </>
          ) : (
            <>
              <span className="text-2xl">🇨🇳</span>
              <div className="flex flex-col items-start">
                <span className="text-white font-bold text-xs leading-none">中文</span>
                <span className="text-[#f2a900] font-bold text-xs leading-none">EN</span>
              </div>
            </>
          )}
        </div>
      </button>
    </div>
  );
}



