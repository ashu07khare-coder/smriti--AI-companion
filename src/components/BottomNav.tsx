import React from 'react';
import { Home, Gamepad2, BookOpen, Heart } from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';

export type NavTab = 'today' | 'games' | 'story' | 'care_circle';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  currentLanguage?: LanguageCode;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, currentLanguage = 'as' }) => {
  const t = getTranslation(currentLanguage);

  const tabs = [
    { id: 'today', label: t.nav.today, icon: Home },
    { id: 'games', label: t.nav.games, icon: Gamepad2 },
    { id: 'story', label: t.nav.story, icon: BookOpen },
    { id: 'care_circle', label: t.nav.careCircle, icon: Heart },
  ] as const;

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-40 max-w-sm mx-auto px-3 pointer-events-none">
      <div className="bg-[#FFFDF6]/95 backdrop-blur-md rounded-full border border-[#173C36]/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-2.5 py-1.5 flex items-center justify-around pointer-events-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center py-1 px-3.5 transition-all group focus:outline-none"
              aria-label={tab.label}
            >
              <div
                className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F5C244] text-[#173C36] shadow-xs scale-105'
                    : 'text-[#173C36]/60 group-hover:text-[#173C36]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-[#173C36] font-bold' : 'text-[#173C36]/60'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
