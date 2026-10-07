import React from 'react';
import {
  MessageSquare,
  FileText,
  Mic,
  Trash2,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  Smile,
  Hash,
  Users,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { ChatAnalysis } from '../types/chat';

interface ChatAnalyticsProps {
  analysis: ChatAnalysis;
}

export const ChatAnalytics: React.FC<ChatAnalyticsProps> = ({ analysis }) => {
  const participants = Object.values(analysis.participants);
  const totalMsgs = analysis.totalMessages || 1;

  // Find peak hour
  const maxHourlyCount = Math.max(...analysis.hourlyDistribution, 1);
  const peakHourIndex = analysis.hourlyDistribution.indexOf(Math.max(...analysis.hourlyDistribution));
  const formatHour = (hr: number) => {
    const period = hr >= 12 ? 'م' : 'ص';
    const h = hr % 12 || 12;
    return `${h}:00 ${period}`;
  };

  // Find peak day
  const maxDay = [...analysis.dayOfWeekDistribution].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">إجمالي الرسائل</span>
            <MessageSquare className="w-4 h-4 text-[#00a884]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalMessages.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            بين {participants.length} أطراف
          </span>
        </div>

        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">عدد الكلمات</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalWords.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            معدل {Math.round(analysis.totalWords / totalMsgs)} كلمة/رسالة
          </span>
        </div>

        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">وسائط وصور</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalMedia.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            صور وفيديوهات
          </span>
        </div>

        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">فويس نوت (صوت)</span>
            <Mic className="w-4 h-4 text-[#00a884]" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalVoiceNotes.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            تسجيلات صوتية
          </span>
        </div>

        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">رسائل محذوفة</span>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalDeleted.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            تم التراجع عنها
          </span>
        </div>

        <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">عمر المحادثة</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {analysis.totalDays.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1">
            يوماً من التواصل
          </span>
        </div>
      </div>

      {/* Head-to-Head Participant Comparison */}
      <div className="bg-[#111b21] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00a884]" />
            <span>المقارنة المباشرة بين الأطراف (من يتحدث أكثر؟)</span>
          </h3>
        </div>

        {/* Proportional Split Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800 mb-6">
          {participants.map((p) => {
            const pct = Math.round((p.totalMessages / totalMsgs) * 100);
            return (
              <div
                key={p.name}
                style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: p.color }}
                className="h-full transition-all relative group"
                title={`${p.name}: ${p.totalMessages} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Detailed Breakdown Cards for each participant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((p) => {
            const msgPct = Math.round((p.totalMessages / totalMsgs) * 100);
            return (
              <div
                key={p.name}
                className="rounded-xl p-4 bg-[#202c33] border border-slate-700/60 relative overflow-hidden"
              >
                <div
                  className="w-1.5 absolute top-0 bottom-0 right-0"
                  style={{ backgroundColor: p.color }}
                />

                <div className="flex items-center justify-between mb-3 pr-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-slate-950 text-sm"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {p.totalMessages.toLocaleString()} رسالة ({msgPct}%)
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#111b21] text-slate-200">
                    {p.totalWords.toLocaleString()} كلمة
                  </span>
                </div>

                {/* Sub metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-3 border-t border-slate-700/60 text-xs">
                  <div className="p-2 rounded-lg bg-[#111b21]">
                    <span className="text-slate-400 block text-[10px] mb-0.5">متوسط الطول</span>
                    <span className="font-bold font-mono text-slate-200">{p.avgMessageLength} كلمة</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111b21]">
                    <span className="text-slate-400 block text-[10px] mb-0.5">أسرع رد</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {p.avgResponseTimeSeconds > 0 ? `${Math.round(p.avgResponseTimeSeconds / 60)} دقيقة` : '—'}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111b21]">
                    <span className="text-slate-400 block text-[10px] mb-0.5">بدء المحادثات</span>
                    <span className="font-bold font-mono text-amber-400">{p.starterCount} مرة</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111b21]">
                    <span className="text-slate-400 block text-[10px] mb-0.5">إيموجي</span>
                    <span className="font-bold font-mono text-purple-400">{p.emojisCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time & Activity Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24-Hour Activity Clock */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>أوقات النشاط خلال الـ 24 ساعة</span>
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              الذروة: {formatHour(peakHourIndex)}
            </span>
          </div>

          <div className="h-44 flex items-end gap-1 pt-6 pb-2 px-1">
            {analysis.hourlyDistribution.map((count, hr) => {
              const heightPct = Math.round((count / maxHourlyCount) * 100);
              const isPeak = hr === peakHourIndex;
              const isNight = hr >= 0 && hr < 6;

              return (
                <div
                  key={hr}
                  className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 border border-slate-700 font-mono">
                    {formatHour(hr)}: {count} رسالة
                  </div>

                  <div
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      isPeak
                        ? 'bg-emerald-400 shadow-md shadow-emerald-500/30'
                        : isNight
                        ? 'bg-purple-600/70 group-hover:bg-purple-500'
                        : 'bg-slate-700 group-hover:bg-slate-500'
                    }`}
                  />
                  {hr % 4 === 0 && (
                    <span className="text-[9px] font-mono text-slate-500 mt-1 select-none">
                      {hr}h
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>ساعات الليل (12 ص - 6 ص)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>ساعة الذروة القصوى</span>
            </span>
          </div>
        </div>

        {/* Day of Week Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>أيام الأسبوع الأكثر نشاطاً</span>
            </h3>
            {maxDay && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                اليوم الأكثر دردشة: {maxDay.day}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {analysis.dayOfWeekDistribution.map((item) => {
              const maxDayCount = maxDay ? maxDay.count : 1;
              const pct = Math.round((item.count / (maxDayCount || 1)) * 100);
              const isTop = maxDay && maxDay.day === item.day;

              return (
                <div key={item.day} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-slate-300 font-medium truncate shrink-0">
                    {item.day}
                  </span>

                  <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(pct, 3)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isTop ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <span className="w-16 text-left font-mono tabular-nums text-slate-400 shrink-0">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vocabulary & Emoji Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Emojis */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-amber-400" />
              <span>أكثر الرموز التعبيرية (الإيموجي) استخداماً</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              إجمالي {analysis.totalEmojis.toLocaleString()} إيموجي
            </span>
          </div>

          {analysis.topEmojis.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              لم يتم العثور على رموز تعبيرية في المحادثة
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {analysis.topEmojis.map((e, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center hover:border-slate-700 transition-colors"
                >
                  <span className="text-2xl mb-1 select-none">{e.emoji}</span>
                  <span className="font-mono font-bold text-white text-xs tabular-nums">
                    {e.count} مرة
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {e.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Vocabulary Words */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-400" />
              <span>الكلمات الأكثر تكراراً (مفلترة من حروف الجر)</span>
            </h3>
          </div>

          {analysis.topWords.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              لا توجد كلمات كافية للتحليل
            </div>
          ) : (
            <div className="space-y-2">
              {analysis.topWords.map((w, idx) => {
                const maxWord = analysis.topWords[0]?.count || 1;
                const pct = Math.round((w.count / maxWord) * 100);

                return (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-6 text-slate-500 font-mono text-[11px]">
                      #{idx + 1}
                    </span>
                    <span className="w-24 text-slate-200 font-semibold truncate">
                      {w.word}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pct, 4)}%` }}
                        className="h-full bg-blue-400 rounded-full"
                      />
                    </div>
                    <span className="w-14 text-left font-mono tabular-nums text-slate-400">
                      {w.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
