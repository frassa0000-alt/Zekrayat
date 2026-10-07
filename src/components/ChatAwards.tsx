import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Zap,
  Moon,
  BookOpen,
  Mic,
  MessageSquarePlus,
  Share2,
  Copy,
  Check,
  Sparkles,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Award, ChatAnalysis } from '../types/chat';

interface ChatAwardsProps {
  analysis: ChatAnalysis;
}

const AWARD_ICONS: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-6 h-6 text-amber-400" />,
  MessageSquarePlus: <MessageSquarePlus className="w-6 h-6 text-emerald-400" />,
  Zap: <Zap className="w-6 h-6 text-blue-400" />,
  Moon: <Moon className="w-6 h-6 text-purple-400" />,
  BookOpen: <BookOpen className="w-6 h-6 text-rose-400" />,
  Mic: <Mic className="w-6 h-6 text-teal-400" />
};

export const ChatAwards: React.FC<ChatAwardsProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopySummary = () => {
    const summaryText = `📊 تقرير ملخص شات واتساب: [${analysis.chatName}]
💬 إجمالي الرسائل: ${analysis.totalMessages.toLocaleString()}
📝 إجمالي الكلمات: ${analysis.totalWords.toLocaleString()}
🎙️ فويس نوت: ${analysis.totalVoiceNotes}
✨ وسائط وصور: ${analysis.totalMedia}
👑 ملك الإيموجي: ${analysis.awards.find(a => a.id === 'emoji_king')?.recipient || '—'}
⚡ أسرع رد: ${analysis.awards.find(a => a.id === 'fastest_replier')?.recipient || '—'}
🌙 بومة الليل: ${analysis.awards.find(a => a.id === 'night_owl')?.recipient || '—'}
تم تحليله عبر مُحلل ومحاكي واتساب ✨`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>جوائز وألقاب الشات الممتعة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            من هو ملك الشات؟ كشف شخصيات المشاركين
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بناءً على سلوك الدردشة الحقيقي، سرعة الرد، أوقات السهر، واستخدام الفويس نوت.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>تم نسخ الملخص!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>نسخ بطاقة الملخص للواتساب</span>
            </>
          )}
        </button>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysis.awards.map((award) => (
          <div
            key={award.id}
            className="group relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                  {AWARD_ICONS[award.icon] || <Sparkles className="w-6 h-6 text-emerald-400" />}
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-400 block">
                    {award.value}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-base text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {award.title}
              </h3>

              <div className="inline-block px-2.5 py-1 rounded-md bg-slate-950 text-slate-200 text-xs font-semibold border border-slate-800 mb-2">
                الفائز: <span className="text-amber-400">{award.recipient}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {award.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{award.titleEn}</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Shareable Summary Visual Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-[#07241d] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 tracking-wider">
                WHATSAPP CHAT REPORT · كشف حساب المحادثة
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {analysis.chatName}
              </h3>
            </div>

            <button
              onClick={() => {
                triggerConfetti();
                handleCopySummary();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-colors self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>احتفل بالنتائج 🎉</span>
            </button>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-xs mb-1">الرسائل</span>
              <span className="text-xl font-bold font-mono text-white">
                {analysis.totalMessages.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-xs mb-1">الكلمات</span>
              <span className="text-xl font-bold font-mono text-blue-400">
                {analysis.totalWords.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-xs mb-1">الوسائط والصوت</span>
              <span className="text-xl font-bold font-mono text-teal-400">
                {analysis.totalMedia + analysis.totalVoiceNotes}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-slate-400 block text-xs mb-1">مدة التواصل</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {analysis.totalDays} يوم
              </span>
            </div>
          </div>

          {/* Participant Highlights */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300">
              الملخص الفوري للأطراف:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(analysis.participants).map(p => {
                const pct = Math.round((p.totalMessages / (analysis.totalMessages || 1)) * 100);
                return (
                  <div
                    key={p.name}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-bold text-white">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-slate-400">
                      <span>{p.totalMessages} رسالة</span>
                      <span>({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
