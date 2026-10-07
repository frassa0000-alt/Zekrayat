import React from 'react';
import { MessageSquare, Settings, Upload, Sun, Moon, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: (tab?: 'upload' | 'controls' | 'analytics' | 'awards' | 'guide') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  chatName: string;
  totalMessages: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  isDarkMode,
  setIsDarkMode,
  chatName,
  totalMessages
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0c1317]/90 backdrop-blur-md text-white select-none">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00a884] flex items-center justify-center text-slate-950 font-bold shadow-md shadow-[#00a884]/20">
            <MessageSquare className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>مُحاكي واتساب آيفون</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-pulse" />
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">
              {chatName ? `${chatName} (${totalMessages} رسالة)` : 'WhatsApp iPhone Simulator'}
            </p>
          </div>
        </div>

        {/* Unified Settings & Upload Button */}
        <div className="flex items-center gap-2">
          {/* Quick Upload Button */}
          <button
            onClick={() => onOpenSettings('upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00a884] hover:bg-[#029070] shadow-sm transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف (10MB)</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => onOpenSettings('controls')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1f2c34] hover:bg-slate-700 border border-slate-700/80 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#00a884]" />
            <span>الإعدادات</span>
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#111b21] border border-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
