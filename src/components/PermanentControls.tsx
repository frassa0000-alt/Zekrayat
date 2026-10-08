import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  UserCheck,
  Sparkles,
  BarChart3,
  ChevronDown,
  Info
} from 'lucide-react';
import { ChatAnalysis, SavedChatRecord } from '../types/chat';
import { AppUser } from '../lib/firebase';
import { SavedMemoriesCard } from './SavedMemoriesCard';
import { PlatformGuideCard } from './PlatformGuideCard';

interface PermanentControlsProps {
  analysis: ChatAnalysis;
  currentUser: string;
  onSetCurrentUser: (user: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackIndex: number;
  totalMessages: number;
  onScrub: (index: number) => void;
  playbackSpeed: number;
  onSetPlaybackSpeed: (speed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onShowAll: () => void;
  onLoadChat?: (text: string, title?: string) => void;
  user: AppUser | null;
  isAuthLoading: boolean;
  savedChats: SavedChatRecord[];
  activeChatId: string | null;
  currentRawContent: string;
  currentFileName: string;
  onLoadSavedChat: (chat: SavedChatRecord) => void;
  onOpenAuthModal?: () => void;
}

export const PermanentControls: React.FC<PermanentControlsProps> = ({
  analysis,
  currentUser,
  onSetCurrentUser,
  isPlaying,
  onTogglePlay,
  playbackIndex,
  totalMessages,
  onScrub,
  playbackSpeed,
  onSetPlaybackSpeed,
  soundEnabled,
  onToggleSound,
  onRestart,
  onShowAll,
  user,
  isAuthLoading,
  savedChats,
  activeChatId,
  currentRawContent,
  currentFileName,
  onLoadSavedChat,
  onOpenAuthModal,
}) => {
  const participantNames = Object.keys(analysis.participants);

  return (
    <div className="w-full lg:w-[380px] flex flex-col gap-3.5 select-none shrink-0">
      {/* 1. PERMANENT CONTROL CARD (تشغيل، سرعة، وهوية) */}
      <div className="p-4 rounded-3xl bg-[#111b21] border border-slate-800 shadow-xl text-white space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00a884]" />
            <span>تشغيل الرسائل</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {playbackIndex} / {totalMessages} رسالة
          </span>
        </div>

        {/* Big Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-[#00a884] hover:bg-[#029070] text-slate-950 shadow-[#00a884]/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>إيقاف مؤقت</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>
                {playbackIndex === 0
                  ? 'بدء كتابة الرسائل'
                  : playbackIndex >= totalMessages
                  ? 'إعادة التشغيل'
                  : 'استئناف الكتابة'}
              </span>
            </>
          )}
        </button>

        {/* Message Scrubber Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={totalMessages}
            value={playbackIndex}
            onChange={(e) => onScrub(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00a884]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>البداية</span>
            <span>نهاية المحادثة ({totalMessages})</span>
          </div>
        </div>

        {/* Speed, Sound & Restart Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">سرعة الكتابة:</span>
            <div className="flex bg-[#1f2c34] rounded-xl p-0.5 border border-slate-700/60 text-xs">
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onSetPlaybackSpeed(s)}
                  className={`flex-1 py-1 rounded-lg text-center font-mono font-bold transition-colors ${
                    playbackSpeed === s
                      ? 'bg-[#00a884] text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">إجراءات سريعة:</span>
            <div className="flex gap-1">
              <button
                onClick={onRestart}
                title="إعادة من البداية"
                className="flex-1 py-1.5 rounded-xl bg-[#1f2c34] hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center justify-center transition-colors border border-slate-700/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onShowAll}
                title="عرض كل الرسائل دفعة واحدة"
                className="flex-1 py-1.5 rounded-xl bg-[#1f2c34] hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center justify-center transition-colors border border-slate-700/60"
              >
                الكل
              </button>
              <button
                onClick={onToggleSound}
                title={soundEnabled ? 'كتم صوت الرسائل' : 'تشغيل صوت الرسائل'}
                className={`px-2 py-1.5 rounded-xl text-xs flex items-center justify-center transition-colors ${
                  soundEnabled
                    ? 'bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40'
                    : 'bg-[#1f2c34] text-slate-500 border border-slate-700/60'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Identity Selector ("أنت هو") */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#00a884]" />
            <span>تحديد هويتك (صاحب الرسائل الخضراء على اليمين):</span>
          </label>
          <div className="relative">
            <select
              value={currentUser}
              onChange={(e) => onSetCurrentUser(e.target.value)}
              className="w-full appearance-none bg-[#1f2c34] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00a884] cursor-pointer"
            >
              {participantNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. SAVED MEMORIES & FILES CLOUD CARD (ذكرياتي وملفاتي المحفوظة لكل حساب بشكل مستقل) */}
      <SavedMemoriesCard
        user={user}
        isAuthLoading={isAuthLoading}
        savedChats={savedChats}
        activeChatId={activeChatId}
        currentAnalysis={analysis}
        currentRawContent={currentRawContent}
        currentFileName={currentFileName}
        onLoadSavedChat={onLoadSavedChat}
        onOpenAuthModal={onOpenAuthModal}
      />

      {/* 4. PERMANENT SUMMARY STATS CARD (إحصائيات فورية ثابتة أمام المستخدم) */}
      <div className="p-4 rounded-3xl bg-[#111b21] border border-slate-800 shadow-xl text-white space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#00a884]" />
            <span>إحصائيات المحادثة الثابتة</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {analysis.chatName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-[#1f2c34] border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">الكلمات</span>
            <span className="font-bold font-mono text-[#00a884]">{analysis.totalWords.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#1f2c34] border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">الوسائط والصور</span>
            <span className="font-bold font-mono text-purple-400">{analysis.totalMedia.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#1f2c34] border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">تسجيلات صوتية</span>
            <span className="font-bold font-mono text-teal-400">{analysis.totalVoiceNotes.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#1f2c34] border border-slate-700/60">
            <span className="text-slate-400 block text-[10px]">رسائل محذوفة</span>
            <span className="font-bold font-mono text-rose-400">{analysis.totalDeleted.toLocaleString()}</span>
          </div>
        </div>

        {/* Participant breakdown bars */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
          {Object.values(analysis.participants).map((p) => {
            const pct = Math.round((p.totalMessages / (analysis.totalMessages || 1)) * 100);
            return (
              <div key={p.name} className="flex items-center justify-between text-[11px]">
                <span className="truncate max-w-[120px] font-bold text-slate-200">{p.name}</span>
                <span className="font-mono text-slate-400">{p.totalMessages} رسالة ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PLATFORM GUIDE CARD (شرح المنصة وكيفية الاستخدام) */}
      <PlatformGuideCard />
    </div>
  );
};
