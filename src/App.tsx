import React, { useState, useEffect } from 'react';
import { ChatSimulator } from './components/ChatSimulator';
import { PermanentControls } from './components/PermanentControls';
import { BestMoments } from './components/BestMoments';
import { parseWhatsAppChat } from './utils/whatsappParser';
import { SAMPLE_CHATS } from './utils/sampleChats';
import { ChatAnalysis, ChatMessage, SavedChatRecord } from './types/chat';
import { playMessageSound, playSentSound } from './utils/soundEffects';
import { MessageSquare, Sun, Moon, LogOut } from 'lucide-react';
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  logoutUser,
  subscribeToUserChats,
  FirebaseUser,
} from './lib/firebase';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('أنت');
  const [playbackIndex, setPlaybackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingSender, setTypingSender] = useState<string>('');
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Authentication & Per-User Cloud Saved Chats State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [savedChats, setSavedChats] = useState<SavedChatRecord[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentRawContent, setCurrentRawContent] = useState<string>('');
  const [currentFileName, setCurrentFileName] = useState<string>('');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to user's saved chats from Firestore when authenticated
  useEffect(() => {
    if (!user) {
      setSavedChats([]);
      return;
    }

    const unsubscribe = subscribeToUserChats(
      user.uid,
      (chats) => {
        setSavedChats(chats);
      },
      (err) => {
        console.error('Failed to subscribe to user chats:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Initialize with realistic default Arabic sample
  useEffect(() => {
    const defaultSample = SAMPLE_CHATS[0];
    setCurrentRawContent(defaultSample.content);
    setCurrentFileName(defaultSample.title);
    const { messages: parsedMsgs, analysis: parsedAnalysis } = parseWhatsAppChat(
      defaultSample.content,
      defaultSample.title
    );
    setMessages(parsedMsgs);
    setAnalysis(parsedAnalysis);
    const participantNames = Object.keys(parsedAnalysis.participants);
    if (participantNames.length > 0) {
      setCurrentUser(participantNames[0]);
    }
  }, []);

  // Simulation playback engine
  useEffect(() => {
    if (!isPlaying) {
      setIsTyping(false);
      return;
    }

    if (playbackIndex >= messages.length) {
      setIsPlaying(false);
      setIsTyping(false);
      return;
    }

    const nextMsg = messages[playbackIndex];
    if (!nextMsg) return;

    const isNextFromCurrentUser = nextMsg.sender === currentUser;
    setTypingSender(nextMsg.sender);
    setIsTyping(true);

    const baseDuration = Math.min(1500, Math.max(350, nextMsg.content.length * 16));
    const typingDuration = Math.max(220, baseDuration / playbackSpeed);

    const timer = setTimeout(() => {
      setIsTyping(false);
      setPlaybackIndex((prev) => {
        const nextIdx = prev + 1;
        if (soundEnabled) {
          if (isNextFromCurrentUser) {
            playSentSound();
          } else {
            playMessageSound();
          }
        }
        return nextIdx;
      });
    }, typingDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, playbackIndex, messages, playbackSpeed, currentUser, soundEnabled]);

  const handleLoadChat = (rawContent: string, title?: string) => {
    setCurrentRawContent(rawContent);
    setCurrentFileName(title || '');
    setActiveChatId(null);
    const { messages: parsedMsgs, analysis: parsedAnalysis } = parseWhatsAppChat(rawContent, title);
    setMessages(parsedMsgs);
    setAnalysis(parsedAnalysis);
    const participantNames = Object.keys(parsedAnalysis.participants);
    if (participantNames.length > 0) {
      setCurrentUser(participantNames[0]);
    }
    setPlaybackIndex(0);
    setIsPlaying(true);
  };

  const handleLoadSavedChat = (record: SavedChatRecord) => {
    setActiveChatId(record.id);
    setCurrentRawContent(record.rawContent);
    setCurrentFileName(record.fileName);
    const { messages: parsedMsgs, analysis: parsedAnalysis } = parseWhatsAppChat(
      record.rawContent,
      record.title
    );
    setMessages(parsedMsgs);
    setAnalysis(parsedAnalysis);
    const participantNames = Object.keys(parsedAnalysis.participants);
    if (participantNames.length > 0) {
      setCurrentUser(participantNames[0]);
    }
    setPlaybackIndex(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setIsTyping(false);
    setPlaybackIndex(0);
    setTimeout(() => {
      setIsPlaying(true);
    }, 150);
  };

  const handleShowAll = () => {
    setIsPlaying(false);
    setIsTyping(false);
    setPlaybackIndex(messages.length);
  };

  const handleToggleVoice = (id: string) => {
    if (activeVoicePlaying === id) {
      setActiveVoicePlaying(null);
    } else {
      setActiveVoicePlaying(id);
      if (soundEnabled) playMessageSound();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-[#00a884] selection:text-slate-950 ${
        isDarkMode ? 'bg-[#0c1317] text-slate-100' : 'bg-[#f0f2f5] text-slate-900'
      }`}
      dir="rtl"
    >
      {/* 1. Header Bar: Minimal, Steady & Fixed */}
      <header className="w-full border-b border-slate-800/80 bg-[#0c1317] text-white select-none shrink-0">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00a884] flex items-center justify-center text-slate-950 font-bold shadow-md shadow-[#00a884]/20">
              <MessageSquare className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-wide leading-none">
                Zekrayat
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Header User Auth Status / Login */}
            {isAuthLoading ? (
              <div className="w-7 h-7 rounded-full bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2 bg-[#111b21] border border-slate-800 rounded-xl px-2.5 py-1">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#00a884] text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200 hidden sm:inline max-w-[120px] truncate">
                  {user.displayName?.split(' ')[0] || 'حسابي'}
                </span>
                <button
                  onClick={() => logoutUser()}
                  title="تسجيل الخروج"
                  className="text-slate-400 hover:text-rose-400 transition-colors p-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>تسجيل الدخول</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-[#111b21] border border-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Steady Unified View: iPhone & Permanent Controls Together */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 flex flex-col">
        {analysis && messages.length > 0 && (
          <>
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
              {/* The Solid, Stationary iPhone */}
              <ChatSimulator
                messages={messages}
                analysis={analysis}
                isDarkMode={isDarkMode}
                currentUser={currentUser}
                playbackIndex={playbackIndex}
                isTyping={isTyping}
                typingSender={typingSender}
                activeVoicePlaying={activeVoicePlaying}
                onToggleVoice={handleToggleVoice}
                searchQuery={searchQuery}
                onSetSearchQuery={setSearchQuery}
                showSearch={showSearch}
                onToggleShowSearch={() => setShowSearch(!showSearch)}
                onLoadChat={handleLoadChat}
              />

              {/* Permanent Controls & Settings Card Beside the iPhone */}
              <PermanentControls
                analysis={analysis}
                currentUser={currentUser}
                onSetCurrentUser={setCurrentUser}
                isPlaying={isPlaying}
                onTogglePlay={() => {
                  if (playbackIndex >= messages.length) {
                    setPlaybackIndex(0);
                  }
                  setIsPlaying(!isPlaying);
                }}
                playbackIndex={playbackIndex}
                totalMessages={messages.length}
                onScrub={(index) => {
                  setIsPlaying(false);
                  setPlaybackIndex(index);
                }}
                playbackSpeed={playbackSpeed}
                onSetPlaybackSpeed={setPlaybackSpeed}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                onRestart={handleRestart}
                onShowAll={handleShowAll}
                onLoadChat={handleLoadChat}
                user={user}
                isAuthLoading={isAuthLoading}
                savedChats={savedChats}
                activeChatId={activeChatId}
                currentRawContent={currentRawContent}
                currentFileName={currentFileName}
                onLoadSavedChat={handleLoadSavedChat}
              />
            </div>

            {/* 3. أحسن لحظات في الشات (تحت) */}
            <BestMoments
              moments={analysis.bestMoments}
              onJumpToMessage={(idx) => {
                setPlaybackIndex(idx);
                setIsPlaying(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
