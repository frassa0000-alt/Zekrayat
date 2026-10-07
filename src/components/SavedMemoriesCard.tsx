import React, { useState } from 'react';
import {
  FolderHeart,
  Save,
  Trash2,
  Clock,
  LogIn,
  LogOut,
  User,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SavedChatRecord, ChatAnalysis } from '../types/chat';
import { FirebaseUser, signInWithGoogle, logoutUser, saveUserChat, deleteUserChat } from '../lib/firebase';

interface SavedMemoriesCardProps {
  user: FirebaseUser | null;
  isAuthLoading: boolean;
  savedChats: SavedChatRecord[];
  activeChatId: string | null;
  currentAnalysis: ChatAnalysis | null;
  currentRawContent: string;
  currentFileName: string;
  onLoadSavedChat: (chat: SavedChatRecord) => void;
}

export const SavedMemoriesCard: React.FC<SavedMemoriesCardProps> = ({
  user,
  isAuthLoading,
  savedChats,
  activeChatId,
  currentAnalysis,
  currentRawContent,
  currentFileName,
  onLoadSavedChat,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setActionError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setActionError('تعذر تسجيل الدخول، يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const handleLogout = async () => {
    setActionError(null);
    try {
      await logoutUser();
    } catch (err: any) {
      console.error(err);
      setActionError('حدث خطأ أثناء تسجيل الخروج.');
    }
  };

  const handleSaveCurrentChat = async () => {
    if (!user || !currentAnalysis || !currentRawContent) return;

    setActionError(null);
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const title = (customTitle.trim() || currentAnalysis.chatName || currentFileName || 'ذكريات واتساب').slice(0, 100);
      const participantNames = Object.keys(currentAnalysis.participants).join('، ');
      const dateRange = currentAnalysis.firstMessageDate && currentAnalysis.lastMessageDate
        ? `${currentAnalysis.firstMessageDate.toLocaleDateString('ar-EG')} - ${currentAnalysis.lastMessageDate.toLocaleDateString('ar-EG')}`
        : '';

      await saveUserChat(user.uid, {
        id: chatId,
        title,
        fileName: currentFileName || `${title}.txt`,
        fileSize: new Blob([currentRawContent]).size,
        rawContent: currentRawContent,
        messageCount: currentAnalysis.totalMessages,
        participantNames,
        dateRange,
      });

      setSaveSuccess(true);
      setShowTitleInput(false);
      setCustomTitle('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving chat:', err);
      setActionError('حدث خطأ أثناء حفظ الذكرى، تأكد من اتصال الإنترنت.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (!user) return;
    if (!window.confirm('هل أنت متأكد من حذف هذه الذكرى من حسابك؟')) return;

    setDeletingId(chatId);
    setActionError(null);
    try {
      await deleteUserChat(user.uid, chatId);
    } catch (err: any) {
      console.error('Error deleting chat:', err);
      setActionError('تعذر حذف الذكرى.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 rounded-3xl bg-[#111b21] border border-slate-800 shadow-xl text-white space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center gap-1.5">
          <FolderHeart className="w-4 h-4 text-[#00a884]" />
          <span>ذكرياتي وملفاتي المحفوظة</span>
        </span>

        {user && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a884]/15 text-[#00a884] font-bold font-mono">
            {savedChats.length} محفوظة
          </span>
        )}
      </div>

      {actionError && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Auth Status & Login / Logout */}
      {isAuthLoading ? (
        <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-[#00a884]" />
          <span>جاري التحقق من تسجيل الدخول...</span>
        </div>
      ) : !user ? (
        /* Not Logged In State */
        <div className="p-3.5 rounded-2xl bg-[#182229] border border-slate-800/90 text-center space-y-2.5">
          <div className="w-10 h-10 mx-auto rounded-2xl bg-[#00a884]/15 text-[#00a884] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-100">سجّل دخولك لحفظ ذكرياتك وملفاتك</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            عند تسجيل الدخول، ستحفظ كل ملفاتك ومحادثاتك في حسابك الخاص بشكل معزول ومستقل تماماً لتسترجعها في أي وقت دون إعادة رفعها.
          </p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>تسجيل الدخول باستخدام Google</span>
          </button>
        </div>
      ) : (
        /* Logged In State */
        <div className="space-y-3">
          {/* User Profile Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#182229] border border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-[#00a884]/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#00a884] text-slate-950 font-bold flex items-center justify-center text-xs">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="truncate">
                <span className="block text-xs font-bold text-white truncate">
                  {user.displayName || 'مستخدم Zekrayat'}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Save Current Chat Button */}
          {currentAnalysis && currentRawContent && (
            <div className="space-y-2">
              {showTitleInput ? (
                <div className="p-2.5 rounded-2xl bg-[#182229] border border-slate-700 space-y-2">
                  <label className="text-[10px] text-slate-300 block">
                    اسم الذكرى أو المحادثة:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    placeholder={currentAnalysis.chatName || currentFileName || 'أدخل اسماً للذكرى'}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    maxLength={100}
                    className="w-full bg-[#111b21] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00a884]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveCurrentChat}
                      disabled={isSaving}
                      className="flex-1 py-1.5 rounded-xl bg-[#00a884] hover:bg-[#029070] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>تأكيد الحفظ في حسابي</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowTitleInput(false)}
                      disabled={isSaving}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1f2c34] text-slate-300 text-xs hover:text-white"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowTitleInput(true)}
                  className="w-full py-2 px-3 rounded-2xl bg-[#00a884]/15 hover:bg-[#00a884]/25 text-[#00a884] border border-[#00a884]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ المحادثة الحالية في حسابي</span>
                </button>
              )}

              {saveSuccess && (
                <div className="p-2 rounded-xl bg-[#00a884]/15 border border-[#00a884]/40 text-[#00a884] text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>تم حفظ الذكرى في حسابك بنجاح!</span>
                </div>
              )}
            </div>
          )}

          {/* List of Saved Chats */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 block mb-1">
              ملفاتك ومحادثاتك المخزنة:
            </span>

            {savedChats.length === 0 ? (
              <div className="p-3 rounded-2xl bg-[#182229] border border-slate-800 text-center text-[11px] text-slate-400">
                لم تقم بحفظ أي ذكريات حتى الآن. ارفع أي ملف شات واضغط "حفظ المحادثة الحالية في حسابي" لحفظها هنا بشكل دائم.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-0.5">
                {savedChats.map((record) => {
                  const isActive = activeChatId === record.id;
                  const isDeleting = deletingId === record.id;

                  return (
                    <div
                      key={record.id}
                      onClick={() => onLoadSavedChat(record)}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-right group ${
                        isActive
                          ? 'bg-[#00a884]/10 border-[#00a884]/50 text-white'
                          : 'bg-[#182229] hover:bg-[#1f2c34] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#00a884]' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold truncate text-white block">
                            {record.title}
                          </span>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#00a884] text-slate-950 font-bold shrink-0">
                              الحالية
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          {record.messageCount !== undefined && (
                            <span className="font-mono">{record.messageCount.toLocaleString()} رسالة</span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(record.createdAt).toLocaleDateString('ar-EG', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteChat(e, record.id)}
                        disabled={isDeleting}
                        title="حذف الذكرى من الحساب"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 opacity-80 group-hover:opacity-100"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
