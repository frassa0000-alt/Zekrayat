import React from 'react';

interface CustomEmojiProps {
  emoji?: string;
  name?: string;
  size?: number | string;
  className?: string;
}

// Handcrafted, custom-made vector SVG emojis designed specifically for Zekrayat
export const CustomEmoji: React.FC<CustomEmojiProps> = ({
  emoji,
  name,
  size = 20,
  className = '',
}) => {
  const s = typeof size === 'number' ? `${size}px` : size;

  // Map emoji character or name to our custom artwork
  const key = name || (emoji ? EMOJI_MAP[emoji] : '') || 'smile';

  return (
    <span
      className={`inline-flex items-center justify-center align-middle select-none shrink-0 ${className}`}
      style={{ width: s, height: s, minWidth: s, minHeight: s, lineHeight: 1 }}
      aria-label={emoji || name}
    >
      {CUSTOM_EMOJI_SVGS[key] || CUSTOM_EMOJI_SVGS.smile}
    </span>
  );
};

const EMOJI_MAP: Record<string, string> = {
  '😂': 'joy',
  '🤣': 'rofl',
  '❤️': 'heart',
  '🔥': 'fire',
  '👍': 'thumbsup',
  '😍': 'heart_eyes',
  '🥺': 'pleading',
  '😭': 'crying',
  '😎': 'cool',
  '🥳': 'party',
  '👏': 'clap',
  '✨': 'sparkles',
  '💯': 'hundred',
  '☕': 'coffee',
  '💀': 'skull',
  '🙏': 'pray',
  '💔': 'broken_heart',
  '🎂': 'cake',
  '👀': 'eyes',
  '🤩': 'star_struck',
  '😉': 'wink',
  '😊': 'blush',
  '🤔': 'thinking',
  '😴': 'sleeping',
  '🎉': 'party',
  '🤝': 'handshake',
  '💪': 'muscle',
  '🌹': 'rose',
  '🌙': 'moon',
  '⭐': 'star',
};

const CUSTOM_EMOJI_SVGS: Record<string, React.ReactNode> = {
  // 1. 😂 Joy / Laughing with Tears
  joy: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradJoy" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
        <linearGradient id="tearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64b5f6" />
          <stop offset="100%" stopColor="#1976d2" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradJoy)" stroke="#e65100" strokeWidth="0.8" />
      {/* Closed squinting laughing eyes */}
      <path d="M7 14c1.5-2.2 4-2.5 5.5-1.5" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M29 14c-1.5-2.2-4-2.5-5.5-1.5" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Big open laughing mouth with white teeth and pink tongue */}
      <path d="M9 19c0 6.5 4 10.5 9 10.5s9-4 9-10.5z" fill="#b71c1c" />
      <path d="M10.5 19c1.5 2 4.2 3 7.5 3s6-1 7.5-3z" fill="#ffffff" />
      <path d="M14 26c1.2 1.5 2.5 2 4 2s2.8-.5 4-2c-1.5-1-6.5-1-8 0z" fill="#ff5252" />
      {/* Splashing glossy teardrops */}
      <path d="M4 14c-1.5 2-2 4 0 5 1.5 1 3-1 2.5-3-.3-1-1.5-2-2.5-2z" fill="url(#tearGrad)" />
      <path d="M32 14c1.5 2 2 4 0 5-1.5 1-3-1-2.5-3 .3-1 1.5-2 2.5-2z" fill="url(#tearGrad)" />
    </svg>
  ),

  // 2. 🤣 ROFL / Rolling Laughing
  rofl: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs rotate-[-15deg]">
      <defs>
        <radialGradient id="faceGradRofl" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradRofl)" stroke="#e65100" strokeWidth="0.8" />
      <path d="M8 13l4 3-4 3" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M28 13l-4 3 4 3" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 20c0 6.5 4 10 9 10s9-3.5 9-10z" fill="#b71c1c" />
      <path d="M10 20c1.5 2 4.2 2.5 8 2.5s6.5-.5 8-2.5z" fill="#ffffff" />
      <ellipse cx="6" cy="16" rx="2" ry="3" fill="#42a5f5" />
      <ellipse cx="30" cy="16" rx="2" ry="3" fill="#42a5f5" />
    </svg>
  ),

  // 3. ❤️ Heart
  heart: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff1744" />
          <stop offset="50%" stopColor="#d50000" />
          <stop offset="100%" stopColor="#9a0007" />
        </linearGradient>
      </defs>
      <path
        d="M18 31.5s-13-8.2-15-16.5C1 8.5 6 3 12 4.5c3.5 1 5.5 4 6 5.5.5-1.5 2.5-4.5 6-5.5 6-1.5 11 4 9 10.5-2 8.3-15 16.5-15 16.5z"
        fill="url(#heartGrad)"
        stroke="#b71c1c"
        strokeWidth="0.8"
      />
      {/* Glossy specular highlight */}
      <path d="M9 7.5c-3 1.2-4.5 4.5-4 7.5 1-2.5 3-4.5 6-5.5l-2-2z" fill="#ffffff" opacity="0.45" />
    </svg>
  ),

  // 4. 🔥 Fire
  fire: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="fireOuter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9100" />
          <stop offset="40%" stopColor="#ff3d00" />
          <stop offset="100%" stopColor="#dd2c00" />
        </linearGradient>
        <linearGradient id="fireInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#ff9800" />
        </linearGradient>
      </defs>
      <path
        d="M19 2.5C18 7 13 10 11 15c-2.5 6.5.5 13 6 15 1 0 2-.2 2.5-.5-1-1.5-1.5-3.5-1-5 1-3 4-4.5 5.5-7.5 3 4 3 8.5 1.5 12 5-3 7-8.5 5-14-1.5 3-4 5-6 5 0-3-1-6.5 2-9.5-3.5 1-6 4-6 7.5 0-4 1-7.5-1-11z"
        fill="url(#fireOuter)"
      />
      <path
        d="M18 16c-1.5 2.5-3 4.5-2 7.5 1 3 3.5 4.5 5.5 3.5 1.5-1 2-2.5 1.5-4-.5-1.5-2-2.5-2.5-4.5-.5 1-1.5 1.5-1.5 2.5 0-1.5 0-3-1-5z"
        fill="url(#fireInner)"
      />
    </svg>
  ),

  // 5. 👍 Thumbs Up
  thumbsup: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="goldHand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffca28" />
          <stop offset="100%" stopColor="#ff8f00" />
        </linearGradient>
      </defs>
      <path
        d="M13 14v17H7a3 3 0 01-3-3V17a3 3 0 013-3h6zm3 17h11a4 4 0 004-3.5l1-5a4 4 0 00-4-4.5h-5s1-4 1-7c0-4-3-6-5-6-1.5 0-2 1-2.5 2.5L14 16v15h2z"
        fill="url(#goldHand)"
        stroke="#e65100"
        strokeWidth="0.8"
      />
      <path d="M13 14v17" stroke="#e65100" strokeWidth="1.2" />
    </svg>
  ),

  // 6. 😍 Heart Eyes
  heart_eyes: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradHE" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradHE)" stroke="#e65100" strokeWidth="0.8" />
      {/* Heart Eyes */}
      <path d="M12 10c-2-2-4 0-4 2 0 3 4 6 4 6s4-3 4-6c0-2-2-4-4-2z" fill="#d50000" />
      <path d="M24 10c-2-2-4 0-4 2 0 3 4 6 4 6s4-3 4-6c0-2-2-4-4-2z" fill="#d50000" />
      {/* Big smile */}
      <path d="M10 20c0 5 3.5 8 8 8s8-3 8-8z" fill="#b71c1c" />
      <path d="M11 20c1.5 1.5 3.8 2 7 2s5.5-.5 7-2z" fill="#ffffff" />
    </svg>
  ),

  // 7. 🥺 Pleading Face
  pleading: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradPlead" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradPlead)" stroke="#e65100" strokeWidth="0.8" />
      {/* Worried eyebrows */}
      <path d="M7 11c2 1.5 4 1 5-1" stroke="#4e342e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M29 11c-2 1.5-4 1-5-1" stroke="#4e342e" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Huge glossy puppy dog eyes */}
      <ellipse cx="11.5" cy="16.5" rx="5" ry="5.5" fill="#212121" />
      <circle cx="10" cy="14" r="2.5" fill="#ffffff" />
      <circle cx="13.5" cy="18" r="1.2" fill="#ffffff" />
      <ellipse cx="24.5" cy="16.5" rx="5" ry="5.5" fill="#212121" />
      <circle cx="23" cy="14" r="2.5" fill="#ffffff" />
      <circle cx="26.5" cy="18" r="1.2" fill="#ffffff" />
      {/* Small sad pout */}
      <path d="M15 26c1-1 2-1.5 3-1.5s2 .5 3 1.5" stroke="#3e2723" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // 8. 😭 Crying / Loudly Crying
  crying: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradCry" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradCry)" stroke="#e65100" strokeWidth="0.8" />
      {/* Closed crying arches */}
      <path d="M7 15c2-2.5 5-2.5 7 0" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M29 15c-2-2.5-5-2.5-7 0" stroke="#37474f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Waterfall streams */}
      <rect x="8.5" y="15" width="4" height="19" rx="2" fill="#42a5f5" />
      <rect x="23.5" y="15" width="4" height="19" rx="2" fill="#42a5f5" />
      {/* Open crying mouth */}
      <ellipse cx="18" cy="25" rx="5" ry="4" fill="#3e2723" />
      <ellipse cx="18" cy="26" rx="3.5" ry="2" fill="#ff5252" />
    </svg>
  ),

  // 9. 😎 Cool with Sunglasses
  cool: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradCool" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradCool)" stroke="#e65100" strokeWidth="0.8" />
      {/* Black sunglasses with glossy reflection */}
      <path
        d="M4 14h28s-1 8-5 8-4-3-5-3-1 3-5 3-4-8-4-8z"
        fill="#212121"
      />
      <path d="M7 16l4 4" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
      <path d="M21 16l4 4" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
      {/* Confident smirk */}
      <path d="M14 26c2 1.5 5 1.5 7 0" stroke="#bf360c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // 10. 🥳 Party
  party: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradParty" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="19" r="16" fill="url(#faceGradParty)" stroke="#e65100" strokeWidth="0.8" />
      {/* Party Hat */}
      <path d="M8 8L20 1l2 12z" fill="#ec407a" stroke="#ad1457" strokeWidth="0.8" />
      <circle cx="21" cy="1" r="2" fill="#ffd54f" />
      <path d="M12 7l6 5" stroke="#ffd54f" strokeWidth="1.5" />
      {/* Winking eye & smiling eye */}
      <path d="M10 18c1.5-2 3.5-2 5 0" stroke="#37474f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="17" r="2" fill="#37474f" />
      {/* Horn blower */}
      <path d="M14 24h10l3 2-3 2H14z" fill="#00e676" />
      {/* Confetti specks */}
      <circle cx="5" cy="18" r="1" fill="#29b6f6" />
      <circle cx="31" cy="12" r="1.2" fill="#ab47bc" />
      <circle cx="28" cy="26" r="1" fill="#ff7043" />
    </svg>
  ),

  // 11. ✨ Sparkles
  sparkles: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#fbc02d" />
        </linearGradient>
      </defs>
      {/* Main Star */}
      <path d="M18 2s2 8 8 10c-6 2-8 10-8 10s-2-8-8-10c6-2 8-10 8-10z" fill="url(#sparkleGrad)" />
      {/* Smaller Top Star */}
      <path d="M28 18s1 4 4 5c-3 1-4 5-4 5s-1-4-4-5c3-1 4-5 4-5z" fill="#ffca28" />
      {/* Bottom Star */}
      <path d="M7 23s1 3 3 4c-2 1-3 4-3 4s-1-3-3-4c2-1 3-4 3-4z" fill="#fff176" />
    </svg>
  ),

  // 12. 💯 Hundred
  hundred: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <text
        x="18"
        y="23"
        fill="#d50000"
        fontSize="17"
        fontWeight="900"
        fontFamily="sans-serif"
        textAnchor="middle"
        letterSpacing="-1"
      >
        100
      </text>
      <line x1="4" y1="28" x2="32" y2="28" stroke="#d50000" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="32" x2="30" y2="32" stroke="#d50000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // 13. ☕ Coffee
  coffee: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <path d="M7 13h18v9a6 6 0 01-6 6h-6a6 6 0 01-6-6v-9z" fill="#795548" />
      <path d="M25 15h3a4 4 0 010 8h-3v-8z" stroke="#795548" strokeWidth="2.5" fill="none" />
      <ellipse cx="16" cy="13" rx="9" ry="2.5" fill="#4e342e" />
      {/* Steaming vapors */}
      <path d="M12 9c-1-2 1-3 0-5" stroke="#bcaaa4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M16 8c-1-2 1-3 0-5" stroke="#bcaaa4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M20 9c-1-2 1-3 0-5" stroke="#bcaaa4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="16" cy="31" rx="14" ry="2" fill="#a1887f" />
    </svg>
  ),

  // 14. 💀 Skull
  skull: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <path
        d="M6 16c0-7 5-13 12-13s12 6 12 13c0 4-2 7-4 9v5h-4v-2h-2v2h-2v-2h-2v2H10v-5c-2-2-4-5-4-9z"
        fill="#eceff1"
        stroke="#78909c"
        strokeWidth="1"
      />
      <circle cx="12" cy="16" r="3.5" fill="#263238" />
      <circle cx="24" cy="16" r="3.5" fill="#263238" />
      <path d="M18 20l-1.5 3h3z" fill="#37474f" />
    </svg>
  ),

  // 15. 🙏 Pray
  pray: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <linearGradient id="prayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffca28" />
          <stop offset="100%" stopColor="#f57f17" />
        </linearGradient>
      </defs>
      {/* Left Hand */}
      <path d="M17 5c-1 0-2 1-2 3v18c0 3-2 5-4 5h-1v-6l4-15c1-3 3-5 3-5z" fill="url(#prayGrad)" />
      {/* Right Hand */}
      <path d="M19 5c1 0 2 1 2 3v18c0 3 2 5 4 5h1v-6l-4-15c-1-3-3-5-3-5z" fill="url(#prayGrad)" />
      {/* Palms Together */}
      <path d="M15 10h6v17h-6z" fill="#ffb300" opacity="0.3" />
      <line x1="18" y1="5" x2="18" y2="28" stroke="#e65100" strokeWidth="1" />
    </svg>
  ),

  // 16. Default Friendly Smile
  smile: (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
      <defs>
        <radialGradient id="faceGradSmile" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="70%" stopColor="#fbc02d" />
          <stop offset="100%" stopColor="#f57f17" />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="17" fill="url(#faceGradSmile)" stroke="#e65100" strokeWidth="0.8" />
      <circle cx="12" cy="14" r="2" fill="#37474f" />
      <circle cx="24" cy="14" r="2" fill="#37474f" />
      <path d="M11 21c1.5 4 4.5 6 7 6s5.5-2 7-6" stroke="#bf360c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
};

// Formatter component that finds emojis in text and replaces them with our custom SVGs
export const FormattedMessageText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Regex matching common emojis
  const emojiRegex = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}])/gu;
  const parts = text.split(emojiRegex);

  return (
    <span>
      {parts.map((part, index) => {
        if (EMOJI_MAP[part]) {
          return <CustomEmoji key={index} emoji={part} size={17} className="mx-0.5" />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
