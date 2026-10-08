import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  LogIn,
  LogOut,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FolderHeart,
  Sparkles,
  KeyRound
} from 'lucide-react';
import {
  AppUser,
  registerWithUsernamePassword,
  loginWithUsernamePassword,
  logoutUser,
  getRegisteredAccounts,
  formatAuthErrorMessage
} from '../lib/firebase';
import { ChatAnalysis } from '../types/chat';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  savedChatsCount: number;
  currentAnalysis?: ChatAnalysis | null;
  currentRawContent?: string;
  currentFileName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedChatsCount,
  currentAnalysis,
  currentRawContent,
  currentFileName,
}) => {
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const existingAccounts = getRegisteredAccounts();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMessage('يرجى كتابة اسم المستخدم.');
      return;
    }
    if (trimmedUser.length < 2) {
      setErrorMessage('اسم المستخدم يجب أن يكون حرفين على الأقل.');
      return;
    }
    if (!trimmedPass) {
      setErrorMessage('يرجى كتابة كلمة المرور.');
      return;
    }
    if (trimmedPass.length < 3) {
      setErrorMessage('كلمة المرور يجب ألا تقل عن 3 خانات.');
      return;
    }

    setIsLoading(true);
    try {
      const dateRangeStr =
        currentAnalysis?.firstMessageDate && currentAnalysis?.lastMessageDate
          ? `${currentAnalysis.firstMessageDate.toLocaleDateString('ar-EG')} - ${currentAnalysis.lastMessageDate.toLocaleDateString('ar-EG')}`
          : 'الآن';

      const initialChat =
        currentRawContent && currentAnalysis
          ? {
              id: 'chat_' + Date.now().toString(36),
              title: currentFileName || 'محادثة الواتساب النشطة',
              fileName: currentFileName || 'chat.txt',
              rawContent: currentRawContent,
              messageCount: currentAnalysis.totalMessages,
              participantNames: Object.keys(currentAnalysis.participants).join('، '),
              dateRange: dateRangeStr,
            }
          : undefined;

      await registerWithUsernamePassword(trimmedUser, trimmedPass, initialChat);

      setSuccessNotice(`تم إنشاء حسابك بنجاح! مرحباً بك يا ${trimmedUser}. تم تفعيل الحساب بكافة ميزاته.`);
      setTimeout(() => {
        onClose();
        setSuccessNotice(null);
        setUsername('');
        setPassword('');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMessage('يرجى إدخال اسم المستخدم.');
      return;
    }
    if (!trimmedPass) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithUsernamePassword(trimmedUser, trimmedPass);
      setSuccessNotice(`تم تسجيل الدخول بنجاح! مرحباً بك مجدداً يا ${trimmedUser}.`);
      setTimeout(() => {
        onClose();
        setSuccessNotice(null);
        setUsername('');
        setPassword('');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setErrorMessage(null);
    try {
      await logoutUser();
      setSuccessNotice('تم تسجيل الخروج بنجاح.');
      setTimeout(() => {
        setSuccessNotice(null);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء تسجيل الخروج.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-md bg-[#111b21] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#182229]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a884]/20 text-[#00a884] flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">حساب المستخدم وكلمة السر</h2>
              <p className="text-[10px] text-slate-400">حفظ الشاتات والذكريات لحسابك الخاص</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold mb-0.5">تنبيه:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{successNotice}</span>
            </div>
          )}

          {currentUser ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#182229] border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00a884] to-emerald-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
                  {(currentUser.username || currentUser.displayName || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">
                      {currentUser.username || currentUser.displayName}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] font-bold">
                      حساب نشط 🔒
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                    {currentUser.email || 'حساب محلي خاص ومستقل'}
                  </p>
                </div>
              </div>

              {/* Account Features Summary */}
              <div className="p-3.5 rounded-2xl bg-[#141e24] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FolderHeart className="w-4 h-4 text-[#00a884]" />
                    <span>الشاتات والذكريات في حسابك:</span>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-[#00a884]">
                    {savedChatsCount} شات
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-[#00a884] shrink-0" />
                  <span>جميع الميزات مفعلة: حفظ، استرجاع، بحث، إحصائيات، وتشغيل الصوتيات.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setTab('login');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <UserPlus className="w-4 h-4 text-[#00a884]" />
                  <span>تسجيل الدخول بحساب مستخدم آخر</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من الحساب الحالي</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Logged In: Tabs for Register & Login */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex rounded-2xl bg-[#182229] p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    tab === 'register'
                      ? 'bg-[#00a884] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>إنشاء حساب جديد</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    tab === 'login'
                      ? 'bg-[#00a884] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول</span>
                </button>
              </div>

              {/* Form Tab 1: Create Account */}
              {tab === 'register' ? (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="p-3 rounded-2xl bg-[#182229]/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00a884]" />
                      <span>أنشئ حسابك وافتحه فوراً:</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      بمجرد كتابة اسم المستخدم وكلمة السر، ستدخل مباشرة لحسابك الشامل مع كافة محادثاتك وتحليلاتك وذكرياتك المحفوظة.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#00a884]" />
                        <span>اسم المستخدم:</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="مثال: أحمد أو ahmed"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#182229] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] transition-colors"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#00a884]" />
                        <span>كلمة السر:</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="اكتب كلمة السر (3 خانات فأكثر)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#182229] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] transition-colors pl-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                          title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#00a884] hover:bg-[#029070] active:scale-98 disabled:opacity-70 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00a884]/20 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>جاري إنشاء الحساب ودخوله...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>إنشاء الحساب والدخول فوراً</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Form Tab 2: Sign In */
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div className="p-3 rounded-2xl bg-[#182229]/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p className="text-[11px] text-slate-400">
                      أدخل اسم المستخدم وكلمة السر للدخول إلى حسابك واسترجاع كافة ملفاتك ومحادثاتك المحفوظة.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#00a884]" />
                        <span>اسم المستخدم:</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#182229] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] transition-colors"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#00a884]" />
                        <span>كلمة السر:</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="أدخل كلمة السر"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#182229] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00a884] transition-colors pl-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                          title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#00a884] hover:bg-[#029070] active:scale-98 disabled:opacity-70 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00a884]/20 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>جاري تسجيل الدخول...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>تسجيل الدخول</span>
                      </>
                    )}
                  </button>

                  {/* Registered Accounts list for quick pick */}
                  {existingAccounts.length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[10px] text-slate-400 mb-1.5">الحسابات المسجلة على هذا الجهاز:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {existingAccounts.map((acc) => (
                          <button
                            key={acc.uid}
                            type="button"
                            onClick={() => {
                              setUsername(acc.username);
                            }}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-[#00a884]/20 hover:text-[#00a884] border border-slate-700/80 text-slate-300 font-medium transition-colors"
                          >
                            👤 {acc.username}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#141e24] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00a884]" />
            <span>حفظ مشفر ومستقل لكل حساب</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
