import { ChatAnalysis, ChatMessage, ChatParticipant, EmojiStat, MessageType, WordStat, Award, ChatMoment } from '../types/chat';

// Participant avatar palette
const PARTICIPANT_COLORS = [
  '#00a884', // WhatsApp teal
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

// Clean zero-width characters and normalize Arabic numbers
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    // Remove zero-width spaces and LTR/RTL marks
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '')
    // Replace Arabic-Indic digits with standard digits
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
}

// Convert 12-hour or 24-hour time to standard hour/minute
function parseTime(timeStr: string): { hours: number; minutes: number; seconds: number } {
  const clean = normalizeText(timeStr).trim();
  const isPM = /[pP][mM]|م/.test(clean);
  const isAM = /[aA][mM]|ص/.test(clean);

  // Extract digits
  const parts = clean.replace(/[^0-9:]/g, '').split(':').map(Number);
  let hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  const seconds = parts[2] || 0;

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  return { hours, minutes, seconds };
}

// Parse date string with ambiguity heuristic
function parseDateParts(dateStr: string, time: { hours: number; minutes: number; seconds: number }): Date {
  const clean = normalizeText(dateStr).trim().replace(/[.]/g, '/').replace(/[-]/g, '/').replace(/،/g, '/');
  const parts = clean.split('/').map(p => parseInt(p, 10)).filter(n => !isNaN(n));

  if (parts.length < 3) {
    return new Date();
  }

  let day: number;
  let month: number;
  let year: number;

  if (parts[0] > 1000) {
    // YYYY/MM/DD
    year = parts[0];
    month = parts[1] - 1;
    day = parts[2];
  } else {
    // DD/MM/YY or MM/DD/YY
    if (parts[0] > 12) {
      // Must be DD/MM/YY
      day = parts[0];
      month = parts[1] - 1;
      year = parts[2];
    } else if (parts[1] > 12) {
      // Must be MM/DD/YY
      month = parts[0] - 1;
      day = parts[1];
      year = parts[2];
    } else {
      // Standard international preference: DD/MM/YYYY
      day = parts[0];
      month = parts[1] - 1;
      year = parts[2];
    }

    if (year < 100) {
      year += 2000;
    }
  }

  const d = new Date(year, month, day, time.hours, time.minutes, time.seconds);
  return isNaN(d.getTime()) ? new Date() : d;
}

// Detect message type and metadata
function detectMessageType(content: string): { type: MessageType; cleanContent: string; mediaFileName?: string } {
  const lower = content.toLowerCase();

  // Deleted messages
  if (
    lower.includes('this message was deleted') ||
    lower.includes('you deleted this message') ||
    content.includes('تم حذف هذه الرسالة') ||
    content.includes('مسحت هذه الرسالة') ||
    content.includes('حذف هذه الرسالة')
  ) {
    return { type: 'deleted', cleanContent: 'تم حذف هذه الرسالة' };
  }

  // Voice notes & audio
  if (
    lower.includes('audio omitted') ||
    lower.includes('.opus') ||
    lower.includes('voice call') ||
    content.includes('رسالة صوتية غير متاحة') ||
    content.includes('صوت مالي متاح') ||
    lower.includes('ptt-') ||
    lower.includes('audio file')
  ) {
    return { type: 'voice_note', cleanContent: 'رسالة صوتية (Voice Note)' };
  }

  // Images
  if (
    lower.includes('image omitted') ||
    lower.includes('.jpg') ||
    lower.includes('.jpeg') ||
    lower.includes('.png') ||
    content.includes('صورة غير متاحة') ||
    lower.includes('<media omitted>')
  ) {
    return { type: 'image', cleanContent: '<ملف صورة أو وسائط>' };
  }

  // Stickers
  if (lower.includes('sticker omitted') || content.includes('ملصق غير متاح')) {
    return { type: 'sticker', cleanContent: 'ملصق (Sticker)' };
  }

  // Videos
  if (lower.includes('video omitted') || lower.includes('.mp4') || content.includes('فيديو غير متاح')) {
    return { type: 'video', cleanContent: '<مقطع فيديو>' };
  }

  // Documents
  if (lower.includes('document omitted') || lower.includes('.pdf') || lower.includes('.docx')) {
    return { type: 'document', cleanContent: '<مستند / وثيقة>' };
  }

  // Links
  const urlRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+)/gi;
  if (urlRegex.test(content)) {
    return { type: 'link', cleanContent: content };
  }

  return { type: 'text', cleanContent: content };
}

// Check if line is a system notice
function isSystemMessage(content: string, sender?: string): boolean {
  if (!sender) return true;
  const lower = content.toLowerCase();
  return (
    lower.includes('messages and calls are end-to-end encrypted') ||
    lower.includes('security code changed') ||
    lower.includes('created group') ||
    lower.includes('added') ||
    lower.includes('left') ||
    lower.includes('removed') ||
    lower.includes('changed the subject') ||
    lower.includes('changed this group\'s icon') ||
    content.includes('الرسائل والمكالمات مشفرة تماماً') ||
    content.includes('تم تشفير') ||
    content.includes('قام بإنشاء المجموعة') ||
    content.includes('تمت إضافة') ||
    content.includes('غادر المجموعة') ||
    content.includes('غيّر أيقونة المجموعة')
  );
}

// Extract emojis
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;
export function extractEmojis(text: string): string[] {
  const matches = text.match(EMOJI_REGEX);
  return matches || [];
}

// Arabic & English common stopwords
const STOP_WORDS = new Set([
  // Arabic
  'في', 'من', 'على', 'إلى', 'الى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي', 'هم', 'هن',
  'أنا', 'انا', 'أنت', 'انت', 'أنتم', 'نحن', 'كان', 'كانت', 'يكون', 'تكون', 'ما', 'لا', 'لم', 'لن',
  'إن', 'أن', 'ان', 'أن', 'إذا', 'اذا', 'لو', 'كل', 'بعض', 'غير', 'ثم', 'أو', 'او', 'بل', 'لكن',
  'يا', 'بس', 'يعني', 'شو', 'شنو', 'إيه', 'ايه', 'ليه', 'ليش', 'وين', 'فين', 'كيف', 'ازاي', 'شلون',
  'بعد', 'قبل', 'عند', 'فوق', 'تحت', 'بين', 'حتى', 'والله', 'تمام', 'خلاص', 'طيب', 'أوك', 'اوك',
  'ماشى', 'ماشي', 'عشان', 'عشانك', 'علشان', 'ده', 'دي', 'دول', 'كدة', 'كده', 'هيك', 'كتير', 'كتيرة',
  'كتير', 'جدا', 'جداً', 'أكيد', 'اكيد', 'ممكن', 'لازم', 'رح', 'راح', 'بدك', 'بدي', 'عندي', 'عندك',
  'له', 'لها', 'لهم', 'لنا', 'لي', 'لك', 'بها', 'به', 'بهم', 'بنا', 'بي', 'بك', 'فيك', 'فيه', 'فيها',
  'منه', 'منها', 'منهم', 'منا', 'مني', 'منك', 'عنه', 'عنها', 'عنهم', 'عنا', 'عني', 'عنك',
  // English
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'up', 'about', 'into', 'over', 'after', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his',
  'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'am', 'ok', 'okay', 'yes', 'no',
  'not', 'so', 'can', 'will', 'just', 'like', 'what', 'who', 'how', 'why', 'when', 'where', 'me', 'him',
  'them', 'us', 'if', 'as', 'out', 'up', 'down', 'all', 'any', 'get', 'got', 'go', 'going', 'know', 'see'
]);

export function parseWhatsAppChat(rawText: string, fileName?: string): { messages: ChatMessage[]; analysis: ChatAnalysis } {
  const lines = rawText.split(/\r?\n/);
  const messages: ChatMessage[] = [];

  // Regex patterns for different WhatsApp export variations
  // Pattern 1: iOS format [DD/MM/YY, HH:MM:SS] Sender: Message
  const iosRegex = /^\[(\d{1,4}[-/.،]\d{1,2}[-/.،]\d{1,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm]|\s*[صم])?)\]\s*([^:]+?):\s*([\s\S]*)$/;
  // Pattern 2: iOS system format [DD/MM/YY, HH:MM:SS] Message
  const iosSystemRegex = /^\[(\d{1,4}[-/.،]\d{1,2}[-/.،]\d{1,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm]|\s*[صم])?)\]\s*([^:]+)$/;

  // Pattern 3: Android format DD/MM/YYYY, HH:MM - Sender: Message
  const androidRegex = /^(\d{1,4}[-/.،]\d{1,2}[-/.،]\d{1,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm]|\s*[صم])?)\s*-\s*([^:]+?):\s*([\s\S]*)$/;
  // Pattern 4: Android system format DD/MM/YYYY, HH:MM - Message
  const androidSystemRegex = /^(\d{1,4}[-/.،]\d{1,2}[-/.،]\d{1,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[APap][Mm]|\s*[صم])?)\s*-\s*([^:]+)$/;

  let currentMessage: ChatMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const cleanLine = normalizeText(rawLine).trim();
    if (!cleanLine && !currentMessage) continue;

    let match = cleanLine.match(iosRegex) || cleanLine.match(androidRegex);

    if (match) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const dateStr = match[1];
      const timeStr = match[2];
      const sender = match[3].trim();
      const textContent = match[4];

      const timeParts = parseTime(timeStr);
      const timestamp = parseDateParts(dateStr, timeParts);
      const { type, cleanContent, mediaFileName } = detectMessageType(textContent);
      const isSystem = isSystemMessage(cleanContent, sender);

      const urlMatches = cleanContent.match(/(https?:\/\/[^\s]+|wa\.me\/[^\s]+)/gi);

      currentMessage = {
        id: `msg-${messages.length + 1}-${i}`,
        sender,
        timestamp,
        dateStr,
        timeStr,
        content: cleanContent,
        type: isSystem ? 'system' : type,
        isSystem,
        mediaFileName,
        detectedLinks: urlMatches || undefined
      };
      continue;
    }

    // Check system format matches
    const sysMatch = cleanLine.match(iosSystemRegex) || cleanLine.match(androidSystemRegex);
    if (sysMatch) {
      if (currentMessage) {
        messages.push(currentMessage);
      }

      const dateStr = sysMatch[1];
      const timeStr = sysMatch[2];
      const content = sysMatch[3].trim();
      const timeParts = parseTime(timeStr);
      const timestamp = parseDateParts(dateStr, timeParts);

      currentMessage = {
        id: `msg-${messages.length + 1}-${i}`,
        sender: 'System',
        timestamp,
        dateStr,
        timeStr,
        content,
        type: 'system',
        isSystem: true
      };
      continue;
    }

    // Multi-line continuation of current message
    if (currentMessage) {
      currentMessage.content += '\n' + rawLine;
    }
  }

  if (currentMessage) {
    messages.push(currentMessage);
  }

  const analysis = generateAnalysis(messages, fileName);
  return { messages, analysis };
}

function generateAnalysis(messages: ChatMessage[], fileName?: string): ChatAnalysis {
  const participantsMap: Record<string, ChatParticipant> = {};
  const hourly = new Array(24).fill(0);
  const dayOfWeekCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const dateMap: Record<string, { total: number; bySender: Record<string, number> }> = {};
  const emojiMap: Record<string, number> = {};
  const wordMap: Record<string, number> = {};

  let totalWords = 0;
  let totalChars = 0;
  let totalMedia = 0;
  let totalVoiceNotes = 0;
  let totalDeleted = 0;
  let totalLinks = 0;
  let totalEmojis = 0;

  const validMessages = messages.filter(m => !m.isSystem);

  // Initialize participants
  let colorIndex = 0;
  for (const msg of validMessages) {
    if (!participantsMap[msg.sender]) {
      participantsMap[msg.sender] = {
        name: msg.sender,
        color: PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length],
        totalMessages: 0,
        totalWords: 0,
        avgMessageLength: 0,
        mediaCount: 0,
        voiceNotesCount: 0,
        deletedCount: 0,
        emojisCount: 0,
        linksCount: 0,
        starterCount: 0,
        avgResponseTimeSeconds: 0,
        responseCount: 0,
        longestMessageLength: 0,
        longestMessageText: ''
      };
      colorIndex++;
    }
  }

  // Response time and starter calculations
  let prevMsg: ChatMessage | null = null;
  const GAP_FOR_NEW_CONVERSATION_HOURS = 4; // 4 hours gap counts as a new starter

  for (let i = 0; i < validMessages.length; i++) {
    const msg = validMessages[i];
    const p = participantsMap[msg.sender];
    if (!p) continue;

    p.totalMessages++;

    // Timeline by date
    const dateKey = `${msg.timestamp.getFullYear()}-${String(msg.timestamp.getMonth() + 1).padStart(2, '0')}-${String(msg.timestamp.getDate()).padStart(2, '0')}`;
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { total: 0, bySender: {} };
    }
    dateMap[dateKey].total++;
    dateMap[dateKey].bySender[msg.sender] = (dateMap[dateKey].bySender[msg.sender] || 0) + 1;

    // Time distributions
    const hr = msg.timestamp.getHours();
    hourly[hr]++;
    const dayOfWeek = msg.timestamp.getDay();
    dayOfWeekCounts[dayOfWeek]++;

    // Message type metrics
    if (msg.type === 'voice_note') {
      p.voiceNotesCount++;
      totalVoiceNotes++;
      totalMedia++;
    } else if (msg.type === 'deleted') {
      p.deletedCount++;
      totalDeleted++;
    } else if (['image', 'video', 'sticker', 'document'].includes(msg.type)) {
      p.mediaCount++;
      totalMedia++;
    }

    if (msg.detectedLinks && msg.detectedLinks.length > 0) {
      p.linksCount += msg.detectedLinks.length;
      totalLinks += msg.detectedLinks.length;
    }

    // Text & words
    if (msg.type === 'text' || msg.type === 'link') {
      const words = msg.content.trim().split(/\s+/).filter(w => w.length > 0);
      const wordCount = words.length;
      const charCount = msg.content.length;

      p.totalWords += wordCount;
      totalWords += wordCount;
      totalChars += charCount;

      if (charCount > p.longestMessageLength) {
        p.longestMessageLength = charCount;
        p.longestMessageText = msg.content;
      }

      // Word frequency count
      for (const rawWord of words) {
        // Strip common punctuation
        const cleanWord = rawWord.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
        if (cleanWord.length > 2 && !STOP_WORDS.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
          wordMap[cleanWord] = (wordMap[cleanWord] || 0) + 1;
        }
      }
    }

    // Emojis
    const emojis = extractEmojis(msg.content);
    if (emojis.length > 0) {
      p.emojisCount += emojis.length;
      totalEmojis += emojis.length;
      for (const e of emojis) {
        emojiMap[e] = (emojiMap[e] || 0) + 1;
      }
    }

    // Starter & response time
    if (!prevMsg) {
      p.starterCount++;
    } else {
      const diffMs = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours >= GAP_FOR_NEW_CONVERSATION_HOURS) {
        p.starterCount++;
      } else if (prevMsg.sender !== msg.sender && diffMs > 0 && diffHours < 2) {
        // Valid response within 2 hours
        const diffSeconds = diffMs / 1000;
        p.avgResponseTimeSeconds = (p.avgResponseTimeSeconds * p.responseCount + diffSeconds) / (p.responseCount + 1);
        p.responseCount++;
      }
    }

    prevMsg = msg;
  }

  // Calculate averages
  for (const sender in participantsMap) {
    const p = participantsMap[sender];
    p.avgMessageLength = p.totalMessages > 0 ? Math.round(p.totalWords / p.totalMessages) : 0;
    p.avgResponseTimeSeconds = Math.round(p.avgResponseTimeSeconds);
  }

  // Top emojis
  const topEmojis: EmojiStat[] = Object.entries(emojiMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emoji, count]) => ({
      emoji,
      count,
      percentage: totalEmojis > 0 ? Math.round((count / totalEmojis) * 100) : 0
    }));

  // Top words
  const topWords: WordStat[] = Object.entries(wordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Day of week
  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeekDistribution = dayNamesAr.map((day, idx) => ({
    day,
    dayEn: dayNamesEn[idx],
    count: dayOfWeekCounts[idx] || 0
  }));

  // Timeline
  const sortedDateKeys = Object.keys(dateMap).sort();
  const timelineData = sortedDateKeys.map(key => ({
    dateKey: key,
    total: dateMap[key].total,
    bySender: dateMap[key].bySender
  }));

  const firstDate = validMessages.length > 0 ? validMessages[0].timestamp : null;
  const lastDate = validMessages.length > 0 ? validMessages[validMessages.length - 1].timestamp : null;
  const totalDays = firstDate && lastDate
    ? Math.max(1, Math.round((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  // Determine chat name
  const participantNames = Object.keys(participantsMap);
  let chatName = fileName ? fileName.replace(/\.txt$/i, '').replace(/WhatsApp Chat - /i, '') : 'محادثة واتساب';
  if (participantNames.length === 2) {
    chatName = `${participantNames[0]} & ${participantNames[1]}`;
  } else if (participantNames.length > 2) {
    chatName = `مجموعة: ${participantNames.slice(0, 3).join(', ')}...`;
  }

  // Awards / Superlatives
  const awards = generateAwards(participantsMap, validMessages);
  const bestMoments = extractBestMoments(validMessages);

  return {
    totalMessages: validMessages.length,
    totalWords,
    totalChars,
    totalMedia,
    totalVoiceNotes,
    totalDeleted,
    totalLinks,
    totalEmojis,
    firstMessageDate: firstDate,
    lastMessageDate: lastDate,
    totalDays,
    isGroup: participantNames.length > 2,
    participants: participantsMap,
    hourlyDistribution: hourly,
    dayOfWeekDistribution,
    timelineData,
    topEmojis,
    topWords,
    awards,
    bestMoments,
    chatName
  };
}

function formatResponseTime(seconds: number): string {
  if (seconds < 60) return `${seconds} ثانية`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} دقيقة`;
  return `${(seconds / 3600).toFixed(1)} ساعة`;
}

function generateAwards(participants: Record<string, ChatParticipant>, messages: ChatMessage[]): Award[] {
  const pList = Object.values(participants);
  if (pList.length === 0) return [];

  const awards: Award[] = [];

  // 1. Emoji King/Queen
  const emojiLeader = [...pList].sort((a, b) => b.emojisCount - a.emojisCount)[0];
  if (emojiLeader && emojiLeader.emojisCount > 0) {
    awards.push({
      id: 'emoji_king',
      title: 'ملك الإيموجي والتعبيرات',
      titleEn: 'Emoji Master',
      recipient: emojiLeader.name,
      value: `${emojiLeader.emojisCount} إيموجي`,
      description: 'أكثر شخص يستخدم الرموز التعبيرية لإيصال مشاعره في الشات',
      descriptionEn: 'Sent the highest number of emojis throughout the conversation',
      icon: 'Crown',
      badgeColor: 'amber'
    });
  }

  // 2. Chat Initiator / Ice Breaker
  const starterLeader = [...pList].sort((a, b) => b.starterCount - a.starterCount)[0];
  if (starterLeader && starterLeader.starterCount > 0) {
    awards.push({
      id: 'starter',
      title: 'مفتاح السوالف (مفتتح المحادثات)',
      titleEn: 'The Ice Breaker',
      recipient: starterLeader.name,
      value: `${starterLeader.starterCount} مرة`,
      description: 'الشخص الذي يبادر بفتح السوالف وكسر الصمت دائماً',
      descriptionEn: 'Always took the initiative to start conversations after silence',
      icon: 'MessageSquarePlus',
      badgeColor: 'emerald'
    });
  }

  // 3. Fastest Responder
  const eligibleResponders = pList.filter(p => p.responseCount >= 3 && p.avgResponseTimeSeconds > 0);
  if (eligibleResponders.length > 0) {
    const fastest = [...eligibleResponders].sort((a, b) => a.avgResponseTimeSeconds - b.avgResponseTimeSeconds)[0];
    awards.push({
      id: 'fastest_replier',
      title: 'أسرع من البرق في الرد',
      titleEn: 'Flash Responder',
      recipient: fastest.name,
      value: `معدل ${formatResponseTime(fastest.avgResponseTimeSeconds)}`,
      description: 'الهاتف دائماً في يده، لا يدع رسالتك تنتظر طويلاً',
      descriptionEn: 'Has the fastest average reply speed when a message arrives',
      icon: 'Zap',
      badgeColor: 'blue'
    });
  }

  // 4. Night Owl (Chatting between 12 AM and 5 AM)
  const nightCountBySender: Record<string, number> = {};
  for (const m of messages) {
    const hr = m.timestamp.getHours();
    if (hr >= 0 && hr < 5) {
      nightCountBySender[m.sender] = (nightCountBySender[m.sender] || 0) + 1;
    }
  }
  const nightLeaderEntry = Object.entries(nightCountBySender).sort((a, b) => b[1] - a[1])[0];
  if (nightLeaderEntry && nightLeaderEntry[1] > 2) {
    awards.push({
      id: 'night_owl',
      title: 'بومة الليل (سهران الفجر)',
      titleEn: 'The Night Owl',
      recipient: nightLeaderEntry[0],
      value: `${nightLeaderEntry[1]} رسالة فجراً`,
      description: 'أوقات نشاطه الذهبية بعد منتصف الليل وحتى الفجر',
      descriptionEn: 'Most active late at night between 12:00 AM and 5:00 AM',
      icon: 'Moon',
      badgeColor: 'purple'
    });
  }

  // 5. The Novelist (Longest Message)
  const longestLeader = [...pList].sort((a, b) => b.longestMessageLength - a.longestMessageLength)[0];
  if (longestLeader && longestLeader.longestMessageLength > 100) {
    awards.push({
      id: 'novelist',
      title: 'كاتب المقالات والجرائد',
      titleEn: 'The Novelist',
      recipient: longestLeader.name,
      value: `${longestLeader.longestMessageLength} حرف`,
      description: 'صاحب أطول رسالة متصلة بدون تقطيع أو اختصار',
      descriptionEn: 'Wrote the single longest continuous message in one go',
      icon: 'BookOpen',
      badgeColor: 'rose'
    });
  }

  // 6. Voice Note King (If voice notes exist)
  const vnLeader = [...pList].sort((a, b) => b.voiceNotesCount - a.voiceNotesCount)[0];
  if (vnLeader && vnLeader.voiceNotesCount > 0) {
    awards.push({
      id: 'voice_note_king',
      title: 'عاشق الفويس نوت (مذيع الراديو)',
      titleEn: 'Podcast Host',
      recipient: vnLeader.name,
      value: `${vnLeader.voiceNotesCount} ريكورد صوتي`,
      description: 'يفضل التحدث بصوته بدلاً من الكتابة بلوحة المفاتيح',
      descriptionEn: 'Sent the most voice notes, turning the chat into a podcast',
      icon: 'Mic',
      badgeColor: 'teal'
    });
  }

  return awards;
}

function extractBestMoments(messages: ChatMessage[]): ChatMoment[] {
  const validMessages = messages.filter(m => !m.isSystem);
  if (validMessages.length === 0) return [];

  const moments: ChatMoment[] = [];

  // 1. أول رسالة بدأت الحكاية
  const first = validMessages[0];
  if (first) {
    moments.push({
      id: 'first_message',
      badge: 'بداية القصة',
      title: 'أول رسالة بدأت الحكاية',
      sender: first.sender,
      dateStr: first.dateStr,
      timeStr: first.timeStr,
      content: first.content,
      icon: 'Sparkles',
      messageIndex: 1
    });
  }

  // 2. أكثر لحظة مرح وضحك
  let funniestMsg: ChatMessage | null = null;
  let maxLaughScore = 0;
  let funnyIdx = 0;

  for (let i = 0; i < validMessages.length; i++) {
    const m = validMessages[i];
    const laughs = (m.content.match(/ه{2,}|😂|🤣|lol|rofl|هههه/gi) || []).length;
    if (laughs > maxLaughScore) {
      maxLaughScore = laughs;
      funniestMsg = m;
      funnyIdx = i + 1;
    }
  }

  if (funniestMsg && maxLaughScore > 0) {
    moments.push({
      id: 'funniest',
      badge: 'قمة الضحك والمرح',
      title: 'أكثر لحظة ضحك وسعادة في الشات',
      sender: funniestMsg.sender,
      dateStr: funniestMsg.dateStr,
      timeStr: funniestMsg.timeStr,
      content: funniestMsg.content,
      icon: 'Smile',
      messageIndex: funnyIdx
    });
  }

  // 3. أطول رسالة معبّرة / جريدة
  let longestMsg: ChatMessage | null = null;
  let maxLen = 0;
  let longIdx = 0;

  for (let i = 0; i < validMessages.length; i++) {
    const m = validMessages[i];
    if (m.type === 'text' && m.content.length > maxLen) {
      maxLen = m.content.length;
      longestMsg = m;
      longIdx = i + 1;
    }
  }

  if (longestMsg && maxLen > 40) {
    moments.push({
      id: 'longest',
      badge: 'أطول رسالة',
      title: 'أطول رسالة متصلة بدون اختصار',
      sender: longestMsg.sender,
      dateStr: longestMsg.dateStr,
      timeStr: longestMsg.timeStr,
      content: longestMsg.content,
      icon: 'BookOpen',
      messageIndex: longIdx
    });
  }

  // 4. سهرة الفجر (بين 12:00 ص و 5:00 ص)
  let lateNightMsg: ChatMessage | null = null;
  let lateIdx = 0;

  for (let i = 0; i < validMessages.length; i++) {
    const m = validMessages[i];
    const hr = m.timestamp.getHours();
    if (hr >= 0 && hr <= 5 && m.type === 'text') {
      lateNightMsg = m;
      lateIdx = i + 1;
      break;
    }
  }

  if (lateNightMsg) {
    moments.push({
      id: 'late_night',
      badge: 'سهرة الفجر',
      title: 'ذكريات السهر في ساعات الفجر الهادئة',
      sender: lateNightMsg.sender,
      dateStr: lateNightMsg.dateStr,
      timeStr: lateNightMsg.timeStr,
      content: lateNightMsg.content,
      icon: 'Moon',
      messageIndex: lateIdx
    });
  }

  // 5. أجمل رسالة احتفال أو مودة
  let warmMsg: ChatMessage | null = null;
  let warmIdx = 0;

  for (let i = validMessages.length - 1; i >= 0; i--) {
    const m = validMessages[i];
    if (/(مبروك|الحمد لله|شكرا|حبيبي|تسلم|ألف خير|🎉|❤️|✨|🙏|كفو)/.test(m.content)) {
      warmMsg = m;
      warmIdx = i + 1;
      break;
    }
  }

  if (warmMsg && warmMsg !== first && warmMsg !== funniestMsg) {
    moments.push({
      id: 'warm_closing',
      badge: 'لحظة دافئة',
      title: 'أجمل رسالة مودة وتقدير متبادل',
      sender: warmMsg.sender,
      dateStr: warmMsg.dateStr,
      timeStr: warmMsg.timeStr,
      content: warmMsg.content,
      icon: 'Heart',
      messageIndex: warmIdx
    });
  }

  return moments;
}
