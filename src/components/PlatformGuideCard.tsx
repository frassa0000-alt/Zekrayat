import React, { useState } from 'react';
import {
  HelpCircle,
  Smartphone,
  PlusCircle,
  Sliders,
  Cloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const PlatformGuideCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-4 rounded-3xl bg-[#111b21] border border-slate-800 shadow-xl text-white space-y-3.5">
      {/* Header with expand toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#00a884]/20 text-[#00a884] flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-[#00a884] transition-colors">
              دليل الاستخدام · كيف تستخدم Zekrayat؟
            </h3>
            <p className="text-[10px] text-slate-400">
              خطوات تصدير ومحاكاة محادثاتك وحفظها
            </p>
          </div>
        </div>

        <button className="text-slate-400 group-hover:text-white transition-colors p-1">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-1 text-[11px] leading-relaxed">
          {/* Overview Banner */}
          <div className="p-3 rounded-2xl bg-[#182229] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#00a884]" />
              <span>ما هي منصة Zekrayat؟</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              منصة <strong>Zekrayat</strong> تحوّل ملفات محادثات واتساب المصدّرة إلى محاكاة حية وتفاعلية داخل شاشة آيفون واقعية، مع إحصائيات متقدمة واستخراج كامل الكلمات وأحسن اللحظات، مع إمكانية حفظ كل محادثة في حسابك الخاص.
            </p>
          </div>

          {/* Step 1: Export Chat from WhatsApp - Two Distinct Separated Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-xs px-1">
              <span className="w-5 h-5 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                1
              </span>
              <span>تصدير ملف الشات من هاتفك (بدون وسائط):</span>
            </div>

            {/* SEPARATE CARD A: iPhone (آيفون) */}
            <div className="p-3.5 rounded-2xl bg-[#182229] border border-slate-700/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/10 text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.1-9.37-10.9-20.26-14.39-32.68-3.48-12.42-5.23-24.3-5.23-35.63 0-14.48 3.7-26.6 11.09-36.35 7.4-9.75 16.92-14.75 28.56-15 4.35 0 9.4 1.13 15.15 3.39 5.75 2.26 9.53 3.39 11.34 3.39 1.62 0 5.48-1.19 11.58-3.57 6.1-2.38 11.19-3.45 15.27-3.2 13.06.87 23.49 5.66 31.3 14.37-11.64 7.07-17.31 16.94-17.01 29.62.24 10.1 4.15 18.52 11.72 25.26 7.57 6.74 16.59 10.51 27.06 11.31-2.45 7.5-5.59 15.22-9.41 23.16zM119.22 31.84c0-7.39 2.65-14.28 7.95-20.67 5.3-6.39 11.77-10.45 19.41-12.17.65 1.74.98 3.48.98 5.22 0 7.28-2.73 14.22-8.19 20.81-5.46 6.59-12.18 10.45-20.15 11.58-.2-1.63-.3-3.22-.3-4.77z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">طريقة هواتف الآيفون (iPhone / iOS)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-bold font-mono">
                  Apple
                </span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[10.5px]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span>
                  <span>افتح تطبيق واتساب وادخل إلى المحادثة التي تريدها.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
                  <span>اضغط على <strong>اسم الشخص أو المجموعة</strong> في أعلى الشاشة.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span>
                  <span>انزل لأسفل الشاشة واضغط على <strong>&quot;تصدير الدردشة&quot; (Export Chat)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">4</span>
                  <span>اختر <strong>&quot;إرفاق بلا وسائط&quot; (Without Media)</strong> واحفظ ملف الـ <strong>.txt</strong>.</span>
                </div>
              </div>
            </div>

            {/* SEPARATE CARD B: Android (أندرويد) */}
            <div className="p-3.5 rounded-2xl bg-[#182229] border border-slate-700/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#3ddc84]/20 text-[#3ddc84] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5896 8.3585 13.8566 8 12 8s-3.5896.3585-5.1368.9507L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">طريقة هواتف الأندرويد (Android)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3ddc84]/15 text-[#3ddc84] font-bold font-mono">
                  Android
                </span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[10.5px]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">1</span>
                  <span>افتح المحادثة المطلوبة في تطبيق واتساب.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">2</span>
                  <span>اضغط على <strong>أيقونة النقاط الثلاث (⋮)</strong> في الزاوية العلوية.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">3</span>
                  <span>اختر <strong>المزيد (More)</strong> ثم اضغط <strong>&quot;نقل الدردشة&quot; (Export Chat)</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">4</span>
                  <span>اختر <strong>&quot;بلا وسائط&quot; (Without Media)</strong> واحفظ ملف الـ <strong>.txt</strong>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Upload via Plus Button */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#141d22] border border-slate-800/80">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                2
              </span>
              <span>رفع الملف من زر الزائد (+) في الآيفون:</span>
            </div>
            <p className="text-slate-300 text-[10.5px] leading-relaxed">
              داخل شاشة الآيفون، اضغط على زر الزائد الأزرق <strong>(+)</strong> في أسفل شريط الكتابة، واختر ملف الـ <strong>.txt</strong> (يدعم حتى 10MB). سيبدأ استخراج كافة الرسائل والكلمات فوراً.
            </p>
          </div>

          {/* Step 3: Play & Customize */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#141d22] border border-slate-800/80">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                3
              </span>
              <span>التحكم بالمحاكاة وتحديد الهوية:</span>
            </div>
            <p className="text-slate-300 text-[10.5px] leading-relaxed">
              استخدم زر <strong>&quot;تشغيل / إيقاف&quot;</strong> لمشاهدة كتابة الرسائل تباعاً، واختر سرعة الكتابة (1x أو 2x أو 4x)، وحدد هويتك بالاسم في قائمة <strong>&quot;تحديد هويتك&quot;</strong> لتظهر رسائلك باللون الأخضر على اليمين.
            </p>
          </div>

          {/* Step 4: Save to Cloud */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#141d22] border border-slate-800/80">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center text-[10px] font-extrabold shrink-0">
                4
              </span>
              <span>حفظ الذكريات في حسابك السحابي:</span>
            </div>
            <p className="text-slate-300 text-[10.5px] leading-relaxed">
              سجّل دخولك بحساب Google في الأعلى، واضغط <strong>&quot;حفظ المحادثة الحالية في حسابي&quot;</strong> لحفظ ملفاتك في سحابتك الخاصة المعزولة لتسترجعها بضغطة زر في أي وقت.
            </p>
          </div>

          {/* Security & Privacy Badge */}
          <div className="p-2.5 rounded-2xl bg-[#00a884]/10 border border-[#00a884]/30 flex items-center gap-2 text-[10px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#00a884] shrink-0" />
            <span>
              <strong>أمان وخصوصية 100%:</strong> تحليل النصوص يتم بالكامل محلياً داخل متصفحك، وكل حساب له ذكرياته الخاصة.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
