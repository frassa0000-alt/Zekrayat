import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  CheckCheck,
  Phone,
  Video,
  ChevronRight,
  Mic,
  Camera,
  Plus,
  Trash2,
  ExternalLink,
  Play,
  Pause,
  ShieldCheck
} from 'lucide-react';
import { ChatAnalysis, ChatMessage } from '../types/chat';
import { FormattedMessageText } from './CustomEmoji';

interface ChatSimulatorProps {
  messages: ChatMessage[];
  analysis: ChatAnalysis;
  isDarkMode: boolean;
  currentUser: string;
  playbackIndex: number;
  isTyping: boolean;
  typingSender: string;
  activeVoicePlaying: string | null;
  onToggleVoice: (id: string) => void;
  searchQuery: string;
  onSetSearchQuery: (query: string) => void;
  showSearch: boolean;
  onToggleShowSearch: () => void;
  onLoadChat?: (content: string, title?: string) => void;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  messages,
  analysis,
  isDarkMode,
  currentUser,
  playbackIndex,
  isTyping,
  typingSender,
  activeVoicePlaying,
  onToggleVoice,
  searchQuery,
  onSetSearchQuery,
  showSearch,
  onToggleShowSearch,
  onLoadChat,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      setUploadError('يرجى اختيار ملف شات نصي بصيغة .txt');
      setTimeout(() => setUploadError(null), 3500);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('حجم الملف يتجاوز الحد المسموح (10MB)');
      setTimeout(() => setUploadError(null), 3500);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content || !content.trim()) {
        setUploadError('الملف فارغ، يرجى اختيار ملف محادثة صحيح');
        setTimeout(() => setUploadError(null), 3500);
        return;
      }
      if (onLoadChat) {
        onLoadChat(content, file.name.replace(/\.txt$/i, ''));
      }
      if (chatFileInputRef.current) chatFileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة الملف');
      setTimeout(() => setUploadError(null), 3500);
    };
    reader.readAsText(file);
  };

  // Default avatars and backgrounds
  const avatarFriendOne = '/src/assets/images/avatar_friend_one_1791244196061.jpg';
  const doodleBg = '/src/assets/images/whatsapp_doodle_bg_1791244184873.jpg';

  // Partner name
  const participantNames = Object.keys(analysis.participants);
  const otherParticipants = participantNames.filter((n) => n !== currentUser);
  const chatPartnerName =
    otherParticipants.length === 1
      ? otherParticipants[0]
      : otherParticipants.length > 1
      ? `${otherParticipants.slice(0, 2).join('، ')} و+${otherParticipants.length - 2}`
      : 'طرف المحادثة';

  // Visible messages according to playback
  const displayedMessages = messages.slice(0, playbackIndex);

  // Search filter
  const visibleMessages = searchQuery.trim()
    ? displayedMessages.filter(
        (m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.sender.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displayedMessages;

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [playbackIndex, isTyping]);

  let lastRenderedDate = '';

  return (
    <div className="relative shrink-0 select-none flex items-center justify-center py-1">
      {/* 
        Authentic iPhone 16 Pro Titanium Chassis - Compact Proportions
        With real hardware buttons, titanium edges, ultra-narrow uniform bezels, and Dynamic Island
      */}
      <div className="relative w-[270px] sm:w-[290px] h-[535px] sm:h-[560px] rounded-[46px] p-[8px] bg-gradient-to-b from-[#3e4249] via-[#26282d] to-[#161719] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.16),inset_0_1px_2px_rgba(255,255,255,0.25)] flex flex-col justify-between">
        {/* Hardware Titanium Buttons (Left: Action, Volume Up, Volume Down) */}
        <div className="w-[3px] h-[14px] bg-[#3a3c42] rounded-l-[2px] absolute -left-[3px] top-[85px] border-l border-white/20 shadow-xs" />
        <div className="w-[3px] h-[32px] bg-[#3a3c42] rounded-l-[2px] absolute -left-[3px] top-[112px] border-l border-white/20 shadow-xs" />
        <div className="w-[3px] h-[32px] bg-[#3a3c42] rounded-l-[2px] absolute -left-[3px] top-[152px] border-l border-white/20 shadow-xs" />

        {/* Hardware Titanium Button (Right: Side/Power Button) */}
        <div className="w-[3px] h-[46px] bg-[#3a3c42] rounded-r-[2px] absolute -right-[3px] top-[125px] border-r border-white/20 shadow-xs" />

        {/* Inner OLED Display Panel */}
        <div className="w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col relative border border-white/10 shadow-inner">
          {/* iOS Status Bar Area with Centered Dynamic Island */}
          <div
            dir="ltr"
            className={`w-full h-[40px] px-5 flex items-center justify-between relative z-20 shrink-0 select-none transition-colors ${
              isDarkMode ? 'bg-[#1f2c34] text-white' : 'bg-[#f6f6f6] text-slate-900'
            }`}
          >
            {/* Left: Time (9:41) */}
            <span className="font-semibold text-[12px] tracking-tight leading-none z-10 pl-0.5 font-['SF_Pro_Text',_-apple-system,_sans-serif]">
              9:41
            </span>

            {/* Center: Dynamic Island (Floating pill in center) */}
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-30 flex items-center justify-between px-2 w-[78px] h-[22px] bg-black rounded-full shadow-md border border-white/10 pointer-events-none">
              {/* TrueDepth camera lens with AR coating shimmer */}
              <div className="w-[8px] h-[8px] rounded-full bg-[#080b12] ring-1 ring-[#1a233a] flex items-center justify-center mr-auto">
                <div className="w-[2.5px] h-[2.5px] rounded-full bg-[#1b355e]/80" />
              </div>
              {/* Face ID / proximity sensor */}
              <div className="w-[6px] h-[6px] rounded-full bg-[#040404]" />
            </div>

            {/* Right: Cellular + Wi-Fi + Battery */}
            <div className="flex items-center gap-1.5 z-10 pr-0.5">
              {/* Cellular Signal - 4 Rounded Bars */}
              <svg className="w-[14px] h-[9px]" viewBox="0 0 17 11" fill="none">
                <rect x="0.5" y="8" width="2.8" height="3" rx="0.9" fill="currentColor" />
                <rect x="4.8" y="5.5" width="2.8" height="5.5" rx="0.9" fill="currentColor" />
                <rect x="9.1" y="3" width="2.8" height="8" rx="0.9" fill="currentColor" />
                <rect x="13.4" y="0.5" width="2.8" height="10.5" rx="0.9" fill="currentColor" />
              </svg>

              {/* Wi-Fi Symbol */}
              <svg className="w-[13px] h-[9px]" viewBox="0 0 16 12" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 2.6c2.4 0 4.6.9 6.2 2.5.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4C13.6 1.7 10.9.6 8 .6 5.1.6 2.4 1.7.4 3.7c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0C3.4 3.5 5.6 2.6 8 2.6zm0 3.8c1.5 0 2.9.6 4 1.7.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4-1.5-1.5-3.4-2.3-5.4-2.3-2 0-3.9.8-5.4 2.3-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0 1.1-1.1 2.5-1.7 4-1.7zm0 3.8c-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4s1.4-.6 1.4-1.4c0-.8-.6-1.4-1.4-1.4z"
                  fill="currentColor"
                />
              </svg>

              {/* Battery Indicator (Pill + Nub + Level) */}
              <div className="flex items-center gap-[1px]">
                <div
                  className={`w-[20px] h-[10.5px] rounded-[3.8px] border-[1.2px] p-[1.5px] flex items-center ${
                    isDarkMode ? 'border-white/90' : 'border-slate-800'
                  }`}
                >
                  <div
                    className={`w-[13px] h-full rounded-[1.8px] ${
                      isDarkMode ? 'bg-white' : 'bg-slate-900'
                    }`}
                  />
                </div>
                <div
                  className={`w-[1.2px] h-[3.8px] rounded-r-[0.8px] ${
                    isDarkMode ? 'bg-white/80' : 'bg-slate-800'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* iOS WhatsApp Navigation Header */}
          <div
            className={`px-3 py-2 flex items-center justify-between z-10 border-b select-none shrink-0 ${
              isDarkMode
                ? 'bg-[#1f2c34] text-white border-white/10 shadow-xs'
                : 'bg-[#f6f6f6] text-slate-900 border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex items-center text-[#007aff] font-normal text-xs cursor-pointer -mr-1">
                <ChevronRight className="w-5 h-5 rtl:rotate-0 rotate-180 -ml-1 shrink-0" />
                <span className="text-[12px] font-medium hidden sm:inline">99+</span>
              </div>

              <div className="relative shrink-0">
                <img
                  src={avatarFriendOne}
                  alt="Contact"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] ring-2 ring-[#1f2c34] absolute bottom-0 right-0" />
              </div>

              <div className="min-w-0 pr-1">
                <h3 className="font-bold text-[13px] truncate leading-tight">
                  {chatPartnerName}
                </h3>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {isTyping && typingSender !== currentUser ? (
                    <span className="text-[#34c759] font-medium flex items-center gap-1">
                      <span>يكتب الآن</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-[#34c759] typing-dot-1" />
                        <span className="w-1 h-1 rounded-full bg-[#34c759] typing-dot-2" />
                        <span className="w-1 h-1 rounded-full bg-[#34c759] typing-dot-3" />
                      </span>
                    </span>
                  ) : (
                    <span>متصل الآن</span>
                  )}
                </p>
              </div>
            </div>

            {/* Video Call, Audio Call & Search */}
            <div className="flex items-center gap-2.5 text-[#007aff]">
              <button
                onClick={onToggleShowSearch}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
              <Video className="w-4 h-4 cursor-pointer" />
              <Phone className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Search Bar if active */}
          {showSearch && (
            <div className="px-3 py-1.5 bg-[#121b22] border-b border-white/10 shrink-0">
              <input
                type="text"
                placeholder="ابحث في نص الرسائل..."
                value={searchQuery}
                onChange={(e) => onSetSearchQuery(e.target.value)}
                className="w-full bg-[#1f2c34] text-white text-xs px-2.5 py-1 rounded-lg focus:outline-none placeholder-slate-400"
              />
            </div>
          )}

          {/* iOS WhatsApp Chat Stream (SF Pro Arabic Font) */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-2.5 py-2 space-y-2 whatsapp-scrollbar relative text-[12px]"
            style={{
              backgroundImage: `url(${doodleBg})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '320px',
              backgroundColor: isDarkMode ? '#0b141a' : '#efeae2',
              backgroundBlendMode: isDarkMode ? 'multiply' : 'soft-light'
            }}
          >
            {/* iOS Encryption Notice */}
            <div className="flex justify-center my-1">
              <div
                className={`max-w-[92%] text-center text-[10px] px-2.5 py-1 rounded-lg shadow-xs leading-relaxed flex items-center justify-center gap-1 ${
                  isDarkMode
                    ? 'bg-[#182229]/90 text-[#ffd279] border border-[#ffd279]/20'
                    : 'bg-[#ffeecd]/90 text-[#54656f]'
                }`}
              >
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>الرسائل مشفرة تماماً بتقنية آبل وواتساب.</span>
              </div>
            </div>

            {/* Empty state before start */}
            {visibleMessages.length === 0 && (
              <div className="h-44 flex flex-col items-center justify-center text-center p-3">
                <p className="text-xs text-slate-400 mb-1 font-medium">
                  شاشة الآيفون جاهزة للمحاكاة
                </p>
                <span className="text-[11px] text-[#00a884]">
                  اضغط على زر &quot;تشغيل&quot; لبدء كتابة الرسائل
                </span>
              </div>
            )}

            {/* Messages Loop */}
            {visibleMessages.map((msg) => {
              const isCurrentUser = msg.sender === currentUser;
              const dateStr = msg.dateStr;
              let showDate = false;

              if (dateStr && dateStr !== lastRenderedDate) {
                showDate = true;
                lastRenderedDate = dateStr;
              }

              if (msg.isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#182229]/80 text-slate-400">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <React.Fragment key={msg.id}>
                  {/* iOS Date Separator Pill */}
                  {showDate && (
                    <div className="flex justify-center my-1.5 select-none">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 font-medium">
                        {msg.dateStr}
                      </span>
                    </div>
                  )}

                  {/* iOS Speech Bubble */}
                  <div className={`w-full flex ${isCurrentUser ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`relative max-w-[84%] rounded-[15px] px-2.5 py-1.5 shadow-sm leading-relaxed break-words ${
                        isCurrentUser
                          ? isDarkMode
                            ? 'bg-[#005c4b] text-white rounded-tr-[3px]'
                            : 'bg-[#dcf8c6] text-slate-950 rounded-tr-[3px]'
                          : isDarkMode
                          ? 'bg-[#202c33] text-white rounded-tl-[3px]'
                          : 'bg-white text-slate-950 rounded-tl-[3px]'
                      }`}
                    >
                      {/* Group Sender Name */}
                      {analysis.isGroup && !isCurrentUser && (
                        <span
                          className="font-bold text-[10px] block mb-0.5 truncate"
                          style={{ color: analysis.participants[msg.sender]?.color || '#00a884' }}
                        >
                          {msg.sender}
                        </span>
                      )}

                      {/* Content Types */}
                      {msg.type === 'voice_note' ? (
                        <div className="flex items-center gap-1.5 py-0.5 min-w-[170px]">
                          <button
                            onClick={() => onToggleVoice(msg.id)}
                            className="w-6 h-6 rounded-full bg-[#00a884] text-slate-950 flex items-center justify-center shrink-0"
                          >
                            {activeVoicePlaying === msg.id ? (
                              <Pause className="w-3 h-3 fill-current" />
                            ) : (
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-0.5 h-4">
                              {[10, 16, 8, 18, 12, 8, 20, 14, 10, 16, 8, 14].map((h, i) => (
                                <span
                                  key={i}
                                  className={`w-0.5 rounded-full ${
                                    activeVoicePlaying === msg.id ? 'bg-[#00a884] animate-pulse' : 'bg-slate-400'
                                  }`}
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-[9px] opacity-75 font-mono">
                              <span>0:14</span>
                              <Mic className="w-2.5 h-2.5 text-[#00a884]" />
                            </div>
                          </div>
                        </div>
                      ) : msg.type === 'deleted' ? (
                        <div className="flex items-center gap-1 italic text-slate-400 text-[11px] py-0.5">
                          <Trash2 className="w-3 h-3 shrink-0" />
                          <span>تم حذف هذه الرسالة</span>
                        </div>
                      ) : (
                        <div>
                          <p className="whitespace-pre-wrap">
                            <FormattedMessageText text={msg.content} />
                          </p>
                          {msg.detectedLinks?.map((url, i) => (
                            <a
                              key={i}
                              href={url.startsWith('http') ? url : `https://${url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#007aff] underline text-[10px] mt-0.5 font-mono break-all"
                            >
                              <span>{url}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Time & Double Blue Tick */}
                      <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] opacity-70 select-none">
                        <span className="font-mono">{msg.timeStr}</span>
                        {isCurrentUser && (
                          <CheckCheck className="w-3 h-3 text-[#34b7f1]" />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* iOS Live Typing Bubble */}
            {isTyping && typingSender && (
              <div className={`w-full flex ${typingSender === currentUser ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`rounded-[14px] px-2.5 py-1.5 shadow-xs flex items-center gap-1.5 ${
                    typingSender === currentUser
                      ? isDarkMode ? 'bg-[#005c4b]' : 'bg-[#dcf8c6]'
                      : isDarkMode ? 'bg-[#202c33]' : 'bg-white'
                  }`}
                >
                  <span className="text-[10px] text-slate-300 font-medium">
                    {typingSender}
                  </span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] typing-dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] typing-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] typing-dot-3" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hidden File Input for Plus (+) Attachment */}
          <input
            ref={chatFileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={handleChatFileChange}
          />

          {/* iOS Upload Error Notification */}
          {uploadError && (
            <div className="absolute top-14 left-4 right-4 z-40 bg-rose-600/95 text-white text-[11px] px-3 py-2 rounded-2xl shadow-xl border border-rose-400 flex items-center justify-between">
              <span>{uploadError}</span>
              <button
                onClick={() => setUploadError(null)}
                className="text-white hover:text-slate-200 text-xs font-bold mr-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* iOS WhatsApp Bottom Input Bar */}
          <div
            className={`px-3 py-2 flex items-center gap-2 select-none border-t shrink-0 ${
              isDarkMode ? 'bg-[#1f2c34] border-white/10' : 'bg-[#f6f6f6] border-slate-200'
            }`}
          >
            <button
              onClick={() => chatFileInputRef.current?.click()}
              title="رفع ملف محادثة واتساب (.txt حتى 10MB)"
              className="text-[#007aff] hover:text-[#005bb5] p-1.5 hover:bg-black/10 rounded-full shrink-0 transition-transform active:scale-90 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>

            <div
              className={`flex-1 flex items-center px-3.5 py-1.5 rounded-full text-[12px] ${
                isDarkMode ? 'bg-[#121b22] text-slate-400 border border-white/5' : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              <span className="truncate">اكتب رسالة أو اضغط + لرفع محادثة...</span>
            </div>

            <button className="text-[#007aff] p-1 shrink-0">
              <Camera className="w-5 h-5" />
            </button>
            <button className="text-[#007aff] p-1 shrink-0">
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className={`w-full flex justify-center pb-2 pt-1 shrink-0 ${isDarkMode ? 'bg-[#1f2c34]' : 'bg-[#f6f6f6]'}`}>
            <div className="w-28 h-[4px] bg-white/70 rounded-full shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
