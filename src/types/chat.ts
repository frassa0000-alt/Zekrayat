export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'voice_note'
  | 'sticker'
  | 'document'
  | 'deleted'
  | 'system'
  | 'link';

export interface ChatMessage {
  id: string;
  sender: string;
  timestamp: Date;
  dateStr: string;
  timeStr: string;
  content: string;
  type: MessageType;
  isSystem: boolean;
  mediaFileName?: string;
  detectedLinks?: string[];
  replyTo?: string;
}

export interface ChatParticipant {
  name: string;
  avatar?: string;
  color: string;
  totalMessages: number;
  totalWords: number;
  avgMessageLength: number;
  mediaCount: number;
  voiceNotesCount: number;
  deletedCount: number;
  emojisCount: number;
  linksCount: number;
  starterCount: number;
  avgResponseTimeSeconds: number; // in seconds
  responseCount: number;
  longestMessageLength: number;
  longestMessageText: string;
}

export interface EmojiStat {
  emoji: string;
  count: number;
  percentage: number;
}

export interface WordStat {
  word: string;
  count: number;
}

export interface Award {
  id: string;
  title: string;
  titleEn: string;
  recipient: string;
  value: string;
  description: string;
  descriptionEn: string;
  icon: string;
  badgeColor: string;
}

export interface ChatMoment {
  id: string;
  badge: string;
  title: string;
  sender: string;
  dateStr: string;
  timeStr: string;
  content: string;
  icon: string;
  messageIndex: number;
}

export interface ChatAnalysis {
  totalMessages: number;
  totalWords: number;
  totalChars: number;
  totalMedia: number;
  totalVoiceNotes: number;
  totalDeleted: number;
  totalLinks: number;
  totalEmojis: number;
  firstMessageDate: Date | null;
  lastMessageDate: Date | null;
  totalDays: number;
  isGroup: boolean;
  participants: Record<string, ChatParticipant>;
  hourlyDistribution: number[]; // 24 entries
  dayOfWeekDistribution: { day: string; dayEn: string; count: number }[];
  timelineData: {
    dateKey: string;
    total: number;
    bySender: Record<string, number>;
  }[];
  topEmojis: EmojiStat[];
  topWords: WordStat[];
  awards: Award[];
  bestMoments: ChatMoment[];
  chatName: string;
}

export interface SavedChatRecord {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize?: number;
  rawContent: string;
  messageCount?: number;
  participantNames?: string;
  dateRange?: string;
  createdAt: string;
  updatedAt: string;
}
