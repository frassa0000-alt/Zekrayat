import React, { useState } from 'react';
import {
  X,
  Upload,
  Settings as SettingsIcon,
  BarChart3,
  Trophy,
  HelpCircle,
  FileText,
  UserCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { ChatAnalysis } from '../types/chat';
import { FileUploader } from './FileUploader';
import { ChatAnalytics } from './ChatAnalytics';
import { ChatAwards } from './ChatAwards';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ChatAnalysis | null;
  currentUser: string;
  onSetCurrentUser: (user: string) => void;
  playbackSpeed: number;
  onSetPlaybackSpeed: (speed: number) => void;
  soundEnabled: boolean;
  onSetSoundEnabled: (enabled: boolean) => void;
  onRestartPlayback: () => void;
  onShowAllMessages: () => void;
  onLoadChat: (text: string, title?: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialTab?: 'upload' | 'controls' | 'analytics' | 'awards' | 'guide';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  analysis,
  currentUser,
  onSetCurrentUser,
  playbackSpeed,
  onSetPlaybackSpeed,
  soundEnabled,
  onSetSoundEnabled,
  onRestartPlayback,
  onShowAllMessages,
  onLoadChat,
  isDarkMode,
  onToggleDarkMode,
  initialTab = 'controls'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'controls' | 'analytics' | 'awards' | 'guide'>(initialTab);
  const [guidePlatform, setGuidePlatform] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  const participantNames = analysis ? Object.keys(analysis.participants) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-[#111b21] border border-slate-800 rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#1f2c34]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a884]/15 text-[#00a884] flex items-center justify-center">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">
                الإعدادات والخيارات
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {analysis?.chatName || 'WhatsApp Settings'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#111b21] border border-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#182229] border-b border-slate-800 overflow-x-auto whatsapp-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'controls'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>ضبط المحاكاة والهوية</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'upload'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف جديد (10MB)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>الإحصائيات والتحليل</span>
          </button>

          <button
            onClick={() => setActiveTab('awards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'awards'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>الجوائز والتقرير</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'guide'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>طريقة التصدير</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 whatsapp-scrollbar">
          {/* TAB 1: CONTROLS & IDENTITY */}
          {activeTab === 'controls' && (
            <div className="space-y-5 max-w-xl mx-auto">
              {/* Identity Picker */}
              <div className="p-4 rounded-2xl bg-[#1f2c34] border border-slate-700/60 shadow-md">
                <label className="text-xs font-bold text-white block mb-1.5 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#00a884]" />
                  <span>تحديد هويتك في المحادثة (صاحب الرسائل الخضراء):</span>
                </label>
                <p className="text-[11px] text-slate-400 mb-3">
                  اختر اسمك ليتم عرض رسائلك على اليمين باللون الأخضر المميز، ورسائل الطرف الآخر على اليسار.
                </p>

                <div className="relative">
                  <select
                    value={currentUser}
                    onChange={(e) => onSetCurrentUser(e.target.value)}
                    className="w-full appearance-none bg-[#111b21] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#00a884] focus:outline-none focus:border-[#00a884] cursor-pointer"
                  >
                    {participantNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Speed & Sound Settings */}
              <div className="p-4 rounded-2xl bg-[#1f2c34] border border-slate-700/60 shadow-md space-y-4">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00a884]" />
                  <span>سرعة كتابة الرسائل في الآيفون:</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSetPlaybackSpeed(s)}
                      className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                        playbackSpeed === s
                          ? 'bg-[#00a884] text-slate-950 shadow-md'
                          : 'bg-[#111b21] text-slate-300 hover:text-white'
                      }`}
                    >
                      {s}x {s === 1 ? '(عادي)' : s === 2 ? '(سريع)' : '(فائق)'}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">صوت رسائل واتساب:</span>
                    <span className="text-[11px] text-slate-400">نغمة صوتية واقعية عند وصول أو إرسال الرسالة</span>
                  </div>

                  <button
                    onClick={() => onSetSoundEnabled(!soundEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      soundEnabled
                        ? 'bg-[#00a884] text-slate-950'
                        : 'bg-[#111b21] text-slate-400'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'مفعل' : 'مكتوم'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onRestartPlayback();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1f2c34] hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4 text-[#00a884]" />
                  <span>إعادة المحاكاة من البداية</span>
                </button>

                <button
                  onClick={() => {
                    onShowAllMessages();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#029070] text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#00a884]/20"
                >
                  <span>عرض كافة الرسائل فوراً</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD (UP TO 10MB) */}
          {activeTab === 'upload' && (
            <FileUploader
              onLoadChat={(content, title) => {
                onLoadChat(content, title);
                onClose();
              }}
              onOpenGuide={() => setActiveTab('guide')}
            />
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && analysis && (
            <ChatAnalytics analysis={analysis} />
          )}

          {/* TAB 4: AWARDS */}
          {activeTab === 'awards' && analysis && (
            <ChatAwards analysis={analysis} />
          )}

          {/* TAB 5: GUIDE */}
          {activeTab === 'guide' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex items-center gap-2 p-1 bg-[#1f2c34] rounded-xl border border-slate-700 mb-4">
                <button
                  onClick={() => setGuidePlatform('android')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    guidePlatform === 'android'
                      ? 'bg-[#00a884] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أجهزة أندرويد (Android)
                </button>
                <button
                  onClick={() => setGuidePlatform('ios')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    guidePlatform === 'ios'
                      ? 'bg-[#00a884] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  أجهزة آيفون (iPhone)
                </button>
              </div>

              {guidePlatform === 'android' ? (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">1. افتح الشات في واتساب</strong>
                    <span className="text-slate-400">انتقل للمحادثة التي ترغب في تحليلها.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">2. اضغط على الثلاث نقاط ⠇</strong>
                    <span className="text-slate-400">اختر المزيد (More) ثم نقل الدردشة (Export Chat).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">3. اختر بلا وسائط (Without Media)</strong>
                    <span className="text-slate-400">هام جداً لتصدير ملف نصي خفيف وسريع بصيغة .txt.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">4. ارفع الملف هنا</strong>
                    <span className="text-slate-400">يدعم الموقع حتى 10 ميجابايت ويقرأ كل الكلمات والأسطر.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">1. اضغط على اسم الشخص بأعلى الشات</strong>
                    <span className="text-slate-400">افتح صفحة معلومات جهة الاتصال (Contact Info).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">2. مرر لأسفل واختر تصدير الدردشة</strong>
                    <span className="text-slate-400">اضغط على (Export Chat).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">3. اختر بدون وسائط (Without Media)</strong>
                    <span className="text-slate-400">لاستخراج ملف .txt النصي.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#1f2c34] border border-slate-700/60">
                    <strong className="text-white block mb-1">4. احفظه في الملفات وارفع الملف هنا</strong>
                    <span className="text-slate-400">اختر Save to Files ثم ارفعه مباشرة في الموقع.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex justify-end bg-[#182229]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00a884] hover:bg-[#029070] text-slate-950 transition-colors shadow-md"
          >
            إغلاق الإعدادات والعودة للآيفون
          </button>
        </div>
      </div>
    </div>
  );
};
