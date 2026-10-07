import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, HelpCircle, FileText, Share2 } from 'lucide-react';

interface ExportGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportGuideModal: React.FC<ExportGuideModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              كيف تصدّر ملف المحادثة من واتساب؟
            </h3>
            <p className="text-xs text-slate-400">
              خطوات سريعة بالصور لاستخراج ملف .txt في أقل من دقيقة
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              platform === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            هواتف أندرويد (Android)
          </button>
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              platform === 'ios'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            هواتف آيفون (iOS / iPhone)
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5 text-xs text-slate-300">
          {platform === 'android' ? (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">افتح المحادثة المطلوبة</h4>
                  <p className="text-slate-400 leading-relaxed">
                    ادخل إلى شات الشخص أو المجموعة التي تريد تحليلها على واتساب.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">انقر على الثلاث نقاط (المزيد)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    اضغط على أيقونة الثلاث نقاط في أعلى زاوية الشاشة ⠇ ثم اختر <strong>المزيد (More)</strong> ثم <strong>نقل الدردشة (Export Chat)</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">اختر &quot;بلا وسائط (Without Media)&quot;</h4>
                  <p className="text-slate-400 leading-relaxed">
                    هام جداً: اختر <strong>بلا وسائط</strong> ليتم استخراج ملف نصي خفيف وسريع بصيغة <code className="text-emerald-400 font-mono">.txt</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">احفظ الملف وارفعه هنا</h4>
                  <p className="text-slate-400 leading-relaxed">
                    احفظ الملف في جهازك أو أرسله لنفسك عبر البريد/التيليجرام ثم ارفعه مباشرة في الموقع.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">اضغط على اسم الشخص أو المجموعة بالأعلى</h4>
                  <p className="text-slate-400 leading-relaxed">
                    افتح الشات في آيفون واضغط على شريط الاسم في أعلى الشاشة لفتح معلومات جهة الاتصال (Contact Info).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">انزل لأسفل واختر &quot;تصدير الدردشة (Export Chat)&quot;</h4>
                  <p className="text-slate-400 leading-relaxed">
                    مرر لأسفل القائمة حتى تجد خيار <strong>تصدير الدردشة</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">اختر &quot;بدون وسائط (Without Media)&quot;</h4>
                  <p className="text-slate-400 leading-relaxed">
                    ستظهر لك نافذة تسألك عن إرفاق الوسائط، اختر <strong>بدون وسائط</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-white mb-0.5">احفظ الملف في تطبيق Files (الملفات)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    اختر <strong>حفظ في الملفات (Save to Files)</strong>، ثم يمكنك رفعه هنا مباشرة من متصفح سفاري أو كروم.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md"
          >
            فهمت، شكراً لك
          </button>
        </div>
      </div>
    </div>
  );
};
