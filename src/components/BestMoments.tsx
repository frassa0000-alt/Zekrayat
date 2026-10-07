import React from 'react';
import {
  Sparkles,
  Smile,
  BookOpen,
  Moon,
  Heart,
  ArrowUpRight,
  Clock,
  User,
  Quote,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMoment } from '../types/chat';
import { FormattedMessageText } from './CustomEmoji';

interface BestMomentsProps {
  moments: ChatMoment[];
  onJumpToMessage: (index: number) => void;
}

const MOMENT_ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-[#00a884]" />,
  Smile: <Smile className="w-4 h-4 text-amber-400" />,
  BookOpen: <BookOpen className="w-4 h-4 text-blue-400" />,
  Moon: <Moon className="w-4 h-4 text-purple-400" />,
  Heart: <Heart className="w-4 h-4 text-rose-400" />
};

export const BestMoments: React.FC<BestMomentsProps> = ({
  moments,
  onJumpToMessage
}) => {
  if (!moments || moments.length === 0) return null;

  const handleCardClick = (messageIndex: number) => {
    onJumpToMessage(messageIndex);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-800/80 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ذكريات لا تُنسى من الشات</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            أحسن وأجمل لحظات في الشات
          </h2>
          <p className="text-xs text-slate-400">
            لحظات مميزة تم انتقاؤها تلقائياً من محادثتك (أول رسالة، أكثر موقف مضحك، وسهرات الفجر).
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
          <span>اضغط على أي لحظة للانتقال إليها مباشرة</span>
          <Smartphone className="w-3.5 h-3.5 text-[#00a884]" />
        </span>
      </div>

      {/* Moments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {moments.map((moment) => (
          <div
            key={moment.id}
            onClick={() => handleCardClick(moment.messageIndex)}
            className="p-4 rounded-3xl bg-[#111b21] hover:bg-[#182229] border border-slate-800 hover:border-[#00a884]/50 shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Card Top: Badge & Icon */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#1f2c34] flex items-center justify-center">
                    {MOMENT_ICONS[moment.icon] || <Sparkles className="w-4 h-4 text-[#00a884]" />}
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-[#00a884] transition-colors">
                    {moment.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1f2c34] text-slate-300 font-bold border border-slate-700/60">
                  {moment.badge}
                </span>
              </div>

              {/* Message Quote Bubble Preview */}
              <div className="p-3 rounded-2xl bg-[#1f2c34]/70 border border-slate-700/50 mb-3 relative">
                <Quote className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2.5 rtl:rotate-180" />
                <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  <FormattedMessageText text={moment.content} />
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-medium truncate max-w-[170px]">
                <User className="w-3 h-3 text-[#00a884] shrink-0" />
                <span className="truncate text-slate-300">{moment.sender}</span>
                <span>·</span>
                <span className="font-mono text-[10px]">{moment.timeStr}</span>
              </div>

              <div className="flex items-center gap-1 text-[#00a884] font-bold group-hover:text-emerald-300 text-[11px]">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform rtl:rotate-90" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
