import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, ShieldCheck, ArrowRight, Sparkles, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { SAMPLE_CHATS, SampleChatOption } from '../utils/sampleChats';

interface FileUploaderProps {
  onLoadChat: (text: string, title?: string) => void;
  onOpenGuide: () => void;
  isInitialScreen?: boolean;
  onClose?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onLoadChat,
  onOpenGuide,
  isInitialScreen = false,
  onClose
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ fileName: string; sizeMb: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maximum allowed size: 10 Megabytes (10MB)
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    setUploadStats(null);

    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setErrorMessage('يرجى اختيار ملف نصي بصيغة .txt المصدر من واتساب');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`حجم الملف (${actualMb} ميجابايت) يتجاوز الحد الأقصى المسموح وهو 10 ميجابايت.`);
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setIsReading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content || content.trim().length === 0) {
        setIsReading(false);
        setErrorMessage('الملف فارغ، يرجى التأكد من اختيار ملف محادثة واتساب صحيح.');
        return;
      }

      setUploadStats({
        fileName: file.name,
        sizeMb: Number(sizeMb) < 0.01 ? '< 0.01 MB' : `${sizeMb} MB`
      });

      // Small tick so user sees reading status
      setTimeout(() => {
        setIsReading(false);
        onLoadChat(content, file.name.replace(/\.txt$/i, ''));
        if (onClose) onClose();
      }, 150);
    };

    reader.onerror = () => {
      setIsReading(false);
      setErrorMessage('حدث خطأ أثناء قراءة الملف، يرجى المحاولة مرة أخرى.');
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMessage('يرجى لصق نص المحادثة أولاً');
      return;
    }
    onLoadChat(pastedText, 'محادثة ملصوقة');
    if (onClose) onClose();
  };

  const handleSelectSample = (sample: SampleChatOption) => {
    onLoadChat(sample.content, sample.title);
    if (onClose) onClose();
  };

  return (
    <div className={`w-full ${isInitialScreen ? 'max-w-3xl mx-auto py-6 px-4' : 'p-6'}`}>
      {/* Header text */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>محاكاة آيفون حقيقية + قراءة كل كلمات الملف حتى 10MB</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          رفع وتحليل محادثة واتساب
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          ارفع ملف المحادثة المصدّر من واتساب (.txt) ليتم عرضها بالكامل داخل هاتف آيفون مع خط آبل الأصلي وبكافة الكلمات.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveMode('upload'); setErrorMessage(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeMode === 'upload'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            رفع ملف حتى 10 ميجا (.txt)
          </button>
          <button
            onClick={() => { setActiveMode('paste'); setErrorMessage(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeMode === 'paste'
                ? 'bg-[#00a884] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            لصق النص مباشرة
          </button>
        </div>

        <button
          onClick={onOpenGuide}
          className="text-xs text-[#00a884] hover:underline underline-offset-4 flex items-center gap-1 font-medium"
        >
          <span>طريقة استخراج الملف من واتساب</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Upload Drag & Drop Area */}
      {activeMode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isReading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#00a884] bg-[#00a884]/10'
              : 'border-slate-700 hover:border-slate-500 bg-[#111b21]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {isReading ? (
            <div className="py-6 flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-[#00a884] animate-spin mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">
                جاري قراءة واستخراج كافة كلمات الملف...
              </h4>
              <p className="text-xs text-slate-400">
                قد يستغرق بضع ثوانٍ للملفات الكبيرة (حتى 10MB)
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-[#00a884]/15 border border-[#00a884]/30 text-[#00a884] flex items-center justify-center mx-auto mb-3 shadow-lg">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                اسحب وأفلت ملف المحادثة (.txt) هنا
              </h3>
              <p className="text-slate-400 text-xs mb-3">
                يدعم الملفات الكبيرة حتى <strong>10 ميجابايت (10MB)</strong> مع قراءة كل كلمة ورسالة
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#202c33] hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#00a884]" />
                <span>اختر الملف من جهازك</span>
              </button>
            </>
          )}
        </div>
      ) : (
        /* Paste Text Area */
        <div className="space-y-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="الصق نص محادثة واتساب هنا... يتم تحليل واستعراض كل الكلمات والأسطر بالكامل"
            className="w-full h-44 bg-[#111b21] border border-slate-700 rounded-2xl p-3.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#00a884]"
            dir="auto"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePasteSubmit}
              disabled={!pastedText.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00a884] hover:bg-[#029070] disabled:opacity-50 text-slate-950 transition-all shadow-md shadow-[#00a884]/20"
            >
              تحليل واستعراض المحادثة
            </button>
          </div>
        </div>
      )}

      {/* Security and Privacy Notice */}
      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-[#00a884] shrink-0" />
        <span>معالجة محلية وسرية 100% داخل المتصفح: ملفك لا يغادر جهازك إطلاقاً.</span>
      </div>

      {/* One-click Sample Chats */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 mb-3">
          أو اختر محادثة تجريبية جاهزة للمعاينة الفورية:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_CHATS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3 rounded-xl bg-[#111b21] hover:bg-[#202c33] border border-slate-800 hover:border-[#00a884]/40 transition-all text-right flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-[#00a884] transition-colors truncate">
                    {sample.title}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00a884]/15 text-[#00a884] shrink-0 font-medium">
                    {sample.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-[#00a884] font-bold">
                <span>معاينة وتحليل فوري</span>
                <ArrowRight className="w-3 h-3 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
