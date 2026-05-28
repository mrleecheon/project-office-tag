import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────
// WORLD (story constants)
// ─────────────────────────────────────────
const COMPANY = { legal: 'GROOMY OFFICE', product: 'GroomyTalk', intranet: 'GroomyTalk INTERNAL' };
const PREDECESSOR_NAME = '박준혁 선임';
const SESSION_EMP_ID = 'EMP-2024-0041';

/** `text` may be string or (item, ctx) => string */
function resolveScriptText(item, ctx) {
  if (item.text == null) return '';
  return typeof item.text === 'function' ? item.text(item, ctx) : item.text;
}

// ─────────────────────────────────────────
// DATA · Characters
// ─────────────────────────────────────────
const CHARS = {
  groomy: {
    name: '그루미',
    dept: 'AI 비서',
    initial: 'G',
    accentColor: '#7a5fcf',
    bubbleColor: '#1a1535',
    bubbleBorder: '#2e2060',
    textColor: '#c8b8f0',
  },
  lee: {
    name: '강이솔 선임',
    dept: '기획팀',
    initial: '이',
    accentColor: '#5b9bd5',
    bubbleColor: '#1a2f45',
    bubbleBorder: '#2a4560',
    textColor: '#c0d8f0',
  },
};

// ─────────────────────────────────────────
// DATA · Emotions → portrait style
// ─────────────────────────────────────────
const EMOTIONS = {
  neutral:  { ring: '#4a6a88', glow: 'rgba(74,106,136,0.25)',  hairColor: '#3a5060', faceColor: '#6a8898' },
  friendly: { ring: '#3a9a70', glow: 'rgba(58,154,112,0.30)',  hairColor: '#2a5040', faceColor: '#5a9878' },
  nervous:  { ring: '#c8a030', glow: 'rgba(200,160,48,0.30)',  hairColor: '#605020', faceColor: '#a08838' },
  warning:  { ring: '#c05030', glow: 'rgba(192,80,48,0.40)',   hairColor: '#501818', faceColor: '#904030' },
  unknown:  { ring: '#404868', glow: 'rgba(64,72,104,0.20)',   hairColor: '#303040', faceColor: '#505868' },
};

// ─────────────────────────────────────────
// DATA · Conversation script
// type: 'recv' | 'sent' | 'sys' | 'vn' | 'image'
// vn lines are batched and entered one-by-one
// ─────────────────────────────────────────
const SCRIPT = [
  { type: 'sys', delay: 500,
    text: `세션 활성화 · ${SESSION_EMP_ID}` },
  { type: 'sys', delay: 400,
    text: 'TEMP_CARD_BINDING · PRED_ID → 활성 사용자 (재사용)' },
  { type: 'sys', delay: 600,
    text: '그루미가 채널에 입장했습니다.' },

  { type: 'vn', char: 'groomy', emotion: 'nervous',
    text: '…삑-', delay: 800 },
  { type: 'vn', char: 'groomy', emotion: 'nervous',
    text: '저기 당신 혹시.', delay: 0 },
  { type: 'vn', char: 'groomy', emotion: 'neutral',
    text: '처음 오셨군요.', delay: 0 },

  { type: 'recv', char: 'groomy', emotion: 'neutral', delay: 900,
    text: (item, ctx) =>
      `${PREDECESSOR_NAME}님 카드로 접속이 됐는데… 처음 보는 분이네요.` },

  { type: 'choice', delay: 400, options: [
    { label: '네, 처음입니다.',        score: 1,  next: 'choice1_a' },
    { label: '전임자 아세요?',         score: 0,  next: 'choice1_b' },
    { label: '여기가 어디죠?',         score: -1, next: 'choice1_c' },
  ]},

  { type: 'branch', id: 'choice1_a',
    items: [
      { type: 'sent', text: '네, 처음입니다.' },
      { type: 'recv', char: 'groomy', emotion: 'friendly', delay: 800,
        text: '…그렇군요. 뭐, 반갑습니다.' },
    ]},
  { type: 'branch', id: 'choice1_b',
    items: [
      { type: 'sent', text: '전임자 아세요?' },
      { type: 'recv', char: 'groomy', emotion: 'warning', delay: 1000,
        text: '…그 질문은 지금 안 받아요.' },
    ]},
  { type: 'branch', id: 'choice1_c',
    items: [
      { type: 'sent', text: '여기가 어디죠?' },
      { type: 'recv', char: 'groomy', emotion: 'neutral', delay: 900,
        text: '(작게 웃음) 회사요. 로비예요. 아직 카드 태그 전이라 머리가 좀 멍할 수 있어요.' },
    ]},

  { type: 'gate_nickname', delay: 400 },

  { type: 'recv', char: 'groomy', emotion: 'neutral', delay: 1200,
    text: (item, ctx) =>
      `${ctx.nickname}씨. 사원증은 아직 발급 전이라서요. 일단 전임자 분 카드로 매핑해 뒀어요. 시스템 로그에 이름이 섞여 보일 수 있는데 신경 쓰지 마세요.` },

  { type: 'recv', char: 'groomy', emotion: 'friendly', delay: 1800,
    text: (item, ctx) =>
      `카드키 찾아야 진짜 사무실 들어갈 수 있어요. 아마 책상 아래나 어딘가 떨어져 있을 텐데—` },

  { type: 'choice', delay: 400, options: [
    { label: '알겠어요.',                  score: 0,  next: 'choice2_a' },
    { label: '왜 그렇게 퉁명스럽게 말해요?', score: 2,  next: 'choice2_b' },
    { label: '전임자 얘기 좀 해줘요.',       score: -1, next: 'choice2_c' },
  ]},

  { type: 'branch', id: 'choice2_a',
    items: [
      { type: 'sent', text: '알겠어요.' },
      { type: 'recv', char: 'groomy', emotion: 'neutral', delay: 700,
        text: '찾고 나서 다시 말 걸어줄래요.' },
    ]},
  { type: 'branch', id: 'choice2_b',
    items: [
      { type: 'sent', text: '왜 그렇게 퉁명스럽게 말해요?' },
      { type: 'recv', char: 'groomy', emotion: 'nervous', delay: 1100,
        text: '…퉁명? 이게 제 기본값인데요.' },
      { type: 'recv', char: 'groomy', emotion: 'friendly', delay: 1400,
        text: '(잠깐 멈춤) …뭐, 빨리 찾아요. 제가 옆에 있을게요.' },
    ]},
  { type: 'branch', id: 'choice2_c',
    items: [
      { type: 'sent', text: '전임자 얘기 좀 해줘요.' },
      { type: 'recv', char: 'groomy', emotion: 'warning', delay: 1200,
        text: '카드키 먼저요.' },
      { type: 'sys', text: '[단서 획득: 그루미가 전임자 언급을 회피함]', delay: 800 },
    ]},

  { type: 'sys', delay: 2000, text: '강이솔 선임님이 채널에 입장했습니다.' },
  { type: 'recv', char: 'lee', emotion: 'friendly', delay: 1200,
    text: (item, ctx) => `${ctx.nickname}씨 맞죠? 저 강이솔이에요. 오늘 사수 맡았어요. 카드키는 찾았어요?` },

  { type: 'vn', char: 'lee', emotion: 'nervous',
    text: '참, 한 가지만 부탁드려도 될까요?', delay: 2600 },
  { type: 'vn', char: 'lee', emotion: 'warning',
    text: '3층에는 가지 마세요.', important: true, delay: 2200 },
  { type: 'vn', char: 'lee', emotion: 'nervous',
    text: '이유는 묻지 마세요. 그냥… 오늘은요.', delay: 2400 },

  { type: 'recv', char: 'lee', emotion: 'neutral', delay: 1600,
    text: '3층은 지금 보안 감사 중이라서요! ^^' },
  { type: 'sys', text: '메시지 1건이 정책에 의해 숨김 처리되었습니다.', delay: 3200 },
  { type: 'recv', char: 'lee', emotion: 'warning', delay: 3800,
    text: '혹시… 이 사번 쓰시던 분 아세요?' },
];

// ─────────────────────────────────────────
// COMPONENT · Character Portrait (SVG)
// ─────────────────────────────────────────
function Portrait({ emotion, size = 72 }) {
  const em = EMOTIONS[emotion] || EMOTIONS.neutral;
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    setGlowing(true);
    const t = setTimeout(() => setGlowing(false), 700);
    return () => clearTimeout(t);
  }, [emotion]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Glow ring */}
      <div style={{
        position: 'absolute', inset: -4,
        borderRadius: '50%',
        boxShadow: `0 0 ${glowing ? 24 : 10}px ${em.glow}`,
        border: `1.5px solid ${em.ring}`,
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
        pointerEvents: 'none',
      }} />
      {/* SVG face */}
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ borderRadius: '50%', display: 'block' }}>
        <defs>
          <radialGradient id="bg" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#182a38" />
            <stop offset="100%" stopColor="#0c1820" />
          </radialGradient>
          <clipPath id="circle">
            <circle cx="36" cy="36" r="36" />
          </clipPath>
        </defs>
        <circle cx="36" cy="36" r="36" fill="url(#bg)" />
        <g clipPath="url(#circle)">
          {/* Hair */}
          <ellipse cx="36" cy="24" rx="17" ry="18" fill={em.hairColor} opacity="0.9" />
          <path d="M 19 28 Q 18 20 36 18 Q 54 20 53 28 Q 48 22 36 22 Q 24 22 19 28 Z"
            fill={em.hairColor} opacity="0.7" />
          {/* Face */}
          <ellipse cx="36" cy="31" rx="12" ry="13" fill={em.faceColor} opacity="0.75" />
          {/* Neck */}
          <rect x="32" y="43" width="8" height="8" rx="2" fill={em.faceColor} opacity="0.5" />
          {/* Shoulders / suit */}
          <path d="M 5 72 Q 8 52 36 50 Q 64 52 67 72 Z"
            fill={em.hairColor} opacity="0.6" />
          {/* Collar */}
          <path d="M 30 50 L 36 56 L 42 50" stroke={em.ring} strokeWidth="1.5" fill="none" opacity="0.7" />
          {/* Subtle eye suggestion */}
          <ellipse cx="30" cy="30" rx="2.5" ry="1.5" fill={em.hairColor} opacity="0.6" />
          <ellipse cx="42" cy="30" rx="2.5" ry="1.5" fill={em.hairColor} opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENT · Character Zone (top panel)
// ─────────────────────────────────────────
function CharacterZone({ charKey, emotion }) {
  const char = CHARS[charKey];
  const em = EMOTIONS[emotion] || EMOTIONS.neutral;

  return (
    <div style={{
      flexShrink: 0,
      height: 152,
      background: 'linear-gradient(180deg, #0b1520 0%, #0f1d2c 70%, #111b28 100%)',
      borderBottom: `1px solid #1c2d3e`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 10, position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage:
          'linear-gradient(#7aaccc 1px, transparent 1px), linear-gradient(90deg, #7aaccc 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />
      {/* Emotion glow blob */}
      <div style={{
        position: 'absolute',
        width: 110, height: 110,
        borderRadius: '50%',
        background: em.glow,
        filter: 'blur(28px)',
        transition: 'background 0.6s ease',
        pointerEvents: 'none',
      }} />
      <Portrait emotion={emotion} size={72} />
      {char ? (
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: '#c8ddf0',
            fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
            letterSpacing: '0.02em',
          }}>{char.name}</div>
          <div style={{
            fontSize: 11, color: '#4a6880',
            fontFamily: 'system-ui, sans-serif',
            marginTop: 2, letterSpacing: '0.04em',
          }}>{char.dept}</div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#2a3a4a', fontFamily: 'monospace' }}>——</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENT · Chat Bubble
// ─────────────────────────────────────────
function Bubble({ msg, fresh }) {
  const char = msg.char ? CHARS[msg.char] : null;

  /* System notice */
  if (msg.type === 'sys') return (
    <div style={{
      textAlign: 'center', margin: '10px 0',
      fontSize: 11.5, color: '#4a6880',
      fontFamily: 'system-ui, sans-serif',
      letterSpacing: '0.01em',
      animation: fresh ? 'fadeUp 0.35s ease-out' : 'none',
    }}>
      <span style={{
        background: '#131f2d', border: '1px solid #1e3048',
        padding: '3px 12px', borderRadius: 20,
      }}>{msg.text}</span>
    </div>
  );

  /* Received */
  if (msg.type === 'recv') return (
    <div style={{
      display: 'flex', gap: 9, marginBottom: 14, alignItems: 'flex-end',
      animation: fresh ? 'fadeUp 0.3s ease-out' : 'none',
    }}>
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: char ? char.accentColor + '20' : '#1e2d3e',
        border: `1.5px solid ${char ? char.accentColor + '55' : '#2a3a4a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700,
        color: char ? char.accentColor : '#5a7a9a',
        fontFamily: 'system-ui, sans-serif',
      }}>{char ? char.initial : '?'}</div>

      <div style={{ maxWidth: '72%' }}>
        <div style={{
          fontSize: 11, color: '#4a6880', marginBottom: 4,
          fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em',
        }}>{char ? char.name : '——'}</div>
        <div style={{
          background: char ? char.bubbleColor : '#1a2d3e',
          border: `1px solid ${char ? char.bubbleBorder : '#2a3d52'}`,
          borderRadius: '4px 18px 18px 18px',
          padding: '11px 15px',
          fontSize: 14.5,
          color: char ? char.textColor : '#9ab8d0',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        }}>{msg.text}</div>
        <div style={{
          fontSize: 10, color: '#2a4055', marginTop: 3,
          fontFamily: 'monospace', letterSpacing: '0.04em',
        }}>{msg.read ? '읽음' : ''}</div>
      </div>
    </div>
  );

  /* Sent */
  if (msg.type === 'sent') return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      marginBottom: 14,
      animation: fresh ? 'fadeUpRight 0.3s ease-out' : 'none',
    }}>
      <div style={{ maxWidth: '72%' }}>
        <div style={{
          background: '#183550',
          border: '1px solid #254870',
          borderRadius: '18px 4px 18px 18px',
          padding: '11px 15px',
          fontSize: 14.5,
          color: '#d8eeff',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        }}>{msg.text}</div>
        <div style={{
          fontSize: 10, color: '#2a5070', marginTop: 3,
          textAlign: 'right', fontFamily: 'monospace',
        }}>읽음</div>
      </div>
    </div>
  );

  return null;
}

// ─────────────────────────────────────────
// COMPONENT · Typing indicator
// ─────────────────────────────────────────
function Typing({ charKey }) {
  const char = CHARS[charKey];
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-end', marginBottom: 12 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        background: char ? char.accentColor + '18' : '#1a2a3a',
        border: `1.5px solid ${char ? char.accentColor + '40' : '#2a3a4a'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700,
        color: char ? char.accentColor : '#5a7a9a',
        fontFamily: 'system-ui, sans-serif',
      }}>{char ? char.initial : '?'}</div>
      <div style={{
        background: char ? char.bubbleColor : '#1a2d3e',
        border: `1px solid ${char ? char.bubbleBorder : '#2a3d52'}`,
        borderRadius: '4px 18px 18px 18px',
        padding: '13px 18px',
        display: 'flex', gap: 5, alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: char ? char.accentColor : '#5a8ab0',
            opacity: 0.7,
            animation: `typingDot 1.1s ease-in-out infinite`,
            animationDelay: `${i * 0.18}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// COMPONENT · VN Dialogue Box
// ─────────────────────────────────────────
function VNBox({ line, onNext }) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const char = line.char ? CHARS[line.char] : null;
  const imp = line.important;

  useEffect(() => {
    setShown('');
    setDone(false);
    let i = 0;
    const spd = imp ? 38 : 28;
    const iv = setInterval(() => {
      i++;
      setShown(line.text.slice(0, i));
      if (i >= line.text.length) { setDone(true); clearInterval(iv); }
    }, spd);
    return () => clearInterval(iv);
  }, [line]);

  const handleClick = () => {
    if (!done) {
      setShown(line.text);
      setDone(true);
    } else {
      onNext();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent 0%, rgba(8,14,22,0.92) 18%)',
        padding: '48px 14px 14px',
        animation: 'vnUp 0.32s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        background: imp
          ? 'linear-gradient(135deg, #141008, #0f1820)'
          : 'linear-gradient(135deg, #0d1825, #0a1420)',
        border: `1px solid ${imp ? '#6a3a18' : '#1e3a58'}`,
        borderLeft: `3px solid ${imp ? '#d0782a' : '#3a7ac0'}`,
        borderRadius: 10,
        padding: '14px 16px 12px',
        boxShadow: imp
          ? '0 4px 24px rgba(200,100,40,0.18), inset 0 1px 0 rgba(255,255,255,0.03)'
          : '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}>
        {char && (
          <div style={{
            fontSize: 12, fontWeight: 700,
            color: imp ? '#d0902a' : (char.accentColor),
            marginBottom: 9,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>{char.name}</span>
            <span style={{ fontSize: 10, opacity: 0.5, fontWeight: 400 }}>{char.dept}</span>
          </div>
        )}
        <div style={{
          fontSize: 16, lineHeight: 1.7,
          color: imp ? '#f0d0a0' : '#c8ddf2',
          fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif",
          minHeight: 28, letterSpacing: '0.01em',
        }}>
          {shown}
          {!done && (
            <span style={{ animation: 'blink 0.55s step-end infinite', borderRight: `2px solid ${imp ? '#d0782a' : '#5a9ad0'}` }}>&nbsp;</span>
          )}
        </div>
        {done && (
          <div style={{
            textAlign: 'right', marginTop: 10,
            fontSize: 11, color: imp ? '#a06020' : '#3a6a90',
            fontFamily: 'monospace', letterSpacing: '0.12em',
            animation: 'blink 1.3s ease-in-out infinite',
          }}>▶ 탭하여 계속</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SCREEN · Messenger (main)
// ─────────────────────────────────────────
function MessengerScreen() {
  const [messages, setMessages]     = useState([]);
  const [scriptIdx, setScriptIdx]   = useState(0);
  const [resumeTick, setResumeTick] = useState(0);
  const [relationScore, setRelationScore] = useState(0);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [nickname, setNickname]       = useState(null);
  const [awaitingNickname, setAwaitingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [typingChar, setTypingChar] = useState(null);
  const [emotion, setEmotion]       = useState('neutral');
  const [activeChar, setActiveChar] = useState('groomy');
  const [vnQueue, setVnQueue]       = useState([]);
  const [vnIdx, setVnIdx]           = useState(0);
  const [vnOpen, setVnOpen]         = useState(false);
  const [freshId, setFreshId]       = useState(null);
  const scrollRef = useRef(null);
  const timerRef  = useRef(null);
  const branchTimerRef = useRef(null);
  const paused    = useRef(false);
  const inputRef  = useRef(null);

  const buildCtx = () => ({
    nickname: nickname ?? '플레이어',
    predecessorName: PREDECESSOR_NAME,
  });

  const scrollDown = () => {
    setTimeout(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  };

  const addMsg = (item, ctx) => {
    const text = resolveScriptText(item, ctx);
    const msg = { ...item, text, id: Date.now() + Math.random() };
    setMessages(p => [...p, msg]);
    setFreshId(msg.id);
    scrollDown();
    return msg;
  };

  const submitNickname = () => {
    let nick = nicknameDraft.trim().replace(/\s+/g, ' ').slice(0, 14);
    if (nick.length < 2) return;
    const finalNick = nick;
    const ctxNick = { ...buildCtx(), nickname: finalNick };
    setNickname(finalNick);
    setAwaitingNickname(false);
    paused.current = false;
    addMsg({ type: 'sent', text: `${finalNick}(이)라고 불러 주세요.` }, ctxNick);
    setScriptIdx(i => i + 1);
    setResumeTick(t => t + 1);
  };

  const skipPastBranches = (fromIdx) => {
    let nextIdx = fromIdx + 1;
    while (nextIdx < SCRIPT.length && SCRIPT[nextIdx].type === 'branch') {
      nextIdx++;
    }
    return nextIdx;
  };

  const runBranchItem = (bi, ctxNow, idx, items, onComplete) => {
    if (bi.emotion) setEmotion(bi.emotion);
    if (bi.char) setActiveChar(bi.char);

    if (bi.type === 'sent') {
      addMsg(bi, ctxNow);
      branchTimerRef.current = setTimeout(() => {
        if (idx + 1 < items.length) {
          runBranchItem(items[idx + 1], ctxNow, idx + 1, items, onComplete);
        } else {
          onComplete();
        }
      }, 280);
      return;
    }

    if (bi.type === 'sys') {
      branchTimerRef.current = setTimeout(() => {
        addMsg(bi, ctxNow);
        if (idx + 1 < items.length) {
          runBranchItem(items[idx + 1], ctxNow, idx + 1, items, onComplete);
        } else {
          onComplete();
        }
      }, bi.delay ?? 400);
      return;
    }

    if (bi.type === 'recv') {
      const textLen = resolveScriptText(bi, ctxNow).length;
      setIsTyping(true);
      setTypingChar(bi.char || null);
      scrollDown();
      branchTimerRef.current = setTimeout(() => {
        setIsTyping(false);
        addMsg(bi, ctxNow);
        if (idx + 1 < items.length) {
          runBranchItem(items[idx + 1], ctxNow, idx + 1, items, onComplete);
        } else {
          onComplete();
        }
      }, (bi.delay ?? 800) + textLen * 22);
    }
  };

  const handleChoice = (option) => {
    setRelationScore(s => s + (option.score ?? 0));
    setPendingChoice(null);
    const branch = SCRIPT.find(s => s.type === 'branch' && s.id === option.next);
    const nextIdx = skipPastBranches(scriptIdx);
    const resume = () => {
      paused.current = false;
      setScriptIdx(nextIdx);
      setResumeTick(t => t + 1);
    };
    if (!branch?.items?.length) {
      resume();
      return;
    }
    paused.current = true;
    runBranchItem(branch.items[0], buildCtx(), 0, branch.items, resume);
  };

  useEffect(() => {
    if (awaitingNickname && inputRef.current) {
      inputRef.current.focus();
    }
  }, [awaitingNickname]);

  // Main script runner
  useEffect(() => {
    if (paused.current || scriptIdx >= SCRIPT.length) return;
    const item = SCRIPT[scriptIdx];

    if (item.type === 'branch') {
      timerRef.current = setTimeout(() => setScriptIdx(p => p + 1), 0);
      return () => clearTimeout(timerRef.current);
    }

    if (item.type === 'choice') {
      timerRef.current = setTimeout(() => {
        paused.current = true;
        setPendingChoice(item.options);
        scrollDown();
      }, item.delay ?? 400);
      return () => clearTimeout(timerRef.current);
    }

    if (item.type === 'gate_nickname') {
      timerRef.current = setTimeout(() => {
        paused.current = true;
        setAwaitingNickname(true);
        setNicknameDraft('');
      }, item.delay ?? 400);
      return () => clearTimeout(timerRef.current);
    }

    const run = () => {
      const ctxNow = buildCtx();

      if (item.emotion) setEmotion(item.emotion);
      if (item.char)    setActiveChar(item.char);

      // Collect a contiguous block of VN lines starting here
      if (item.type === 'vn') {
        let batch = [], i = scriptIdx;
        while (i < SCRIPT.length && SCRIPT[i].type === 'vn') {
          batch.push({
            ...SCRIPT[i],
            text: resolveScriptText(SCRIPT[i], ctxNow),
          });
          i++;
        }
        setVnQueue(batch);
        setVnIdx(0);
        setVnOpen(true);
        paused.current = true;
        setScriptIdx(i);
        return;
      }

      if (item.type === 'recv') {
        const textLen = resolveScriptText(item, ctxNow).length;
        setIsTyping(true);
        setTypingChar(item.char || null);
        scrollDown();
        timerRef.current = setTimeout(() => {
          setIsTyping(false);
          addMsg(item, ctxNow);
          setScriptIdx(p => p + 1);
        }, 900 + textLen * 22);
      } else if (item.type === 'sys') {
        timerRef.current = setTimeout(() => {
          addMsg(item, ctxNow);
          setScriptIdx(p => p + 1);
        }, 300);
      } else {
        timerRef.current = setTimeout(() => {
          setScriptIdx(p => p + 1);
        }, 300);
      }
    };

    timerRef.current = setTimeout(run, item.delay ?? 800);
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(branchTimerRef.current);
    };
  }, [scriptIdx, resumeTick]);

  const handleVnNext = () => {
    const next = vnIdx + 1;
    if (next < vnQueue.length) {
      const ln = vnQueue[next];
      if (ln.emotion) setEmotion(ln.emotion);
      setVnIdx(next);
    } else {
      setVnOpen(false);
      setVnQueue([]);
      setVnIdx(0);
      setEmotion('neutral');
      paused.current = false;
      // Resume script runner even when scriptIdx itself did not change.
      setResumeTick(t => t + 1);
    }
  };

  const currentVnLine = vnQueue[vnIdx];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0e1822', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        flexShrink: 0,
        background: '#0b1520',
        borderBottom: '1px solid #182840',
        padding: '10px max(16px, env(safe-area-inset-right)) 10px max(16px, env(safe-area-inset-left))',
        paddingTop: 'max(10px, env(safe-area-inset-top))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: '#3a6080', fontFamily: 'monospace', letterSpacing: '0.18em' }}>
            TalkLine · {COMPANY.intranet}
          </div>
          {nickname && (
            <div style={{ fontSize: 9, color: '#2a4860', fontFamily: 'monospace', letterSpacing: '0.06em', marginTop: 3 }}>
              표시명 {nickname} · {SESSION_EMP_ID}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', marginRight: 10 }}>
          <div style={{ fontSize: 10, color: '#284060', fontFamily: 'monospace', letterSpacing: '0.08em', lineHeight: 1.3 }}>
            {SESSION_EMP_ID}
          </div>
          <div style={{ fontSize: 8, color: '#1e3850', fontFamily: 'monospace' }}>
            TEMP BIND
          </div>
        </div>
        <div style={{ width: 20, height: 14, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', cursor: 'pointer' }} aria-hidden>
          {[0,1,2].map(i => <div key={i} style={{ height: 1.5, background: '#2a4060', borderRadius: 1 }} />)}
        </div>
      </div>

      {/* Character zone */}
      <CharacterZone charKey={activeChar} emotion={emotion} />

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto',
          padding: (pendingChoice || awaitingNickname)
            ? `14px max(14px, env(safe-area-inset-right)) calc(${pendingChoice ? 200 : 132}px + env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left))`
            : '14px max(14px, env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left))',
          background: '#0e1822',
          scrollbarWidth: 'thin', scrollbarColor: '#182840 transparent',
          position: 'relative',
        }}
      >
        {messages.map(msg => (
          <Bubble key={msg.id} msg={msg} fresh={msg.id === freshId} />
        ))}
        {isTyping && <Typing charKey={typingChar} />}
        {/* Spacer so VN box doesn't cover last msg */}
        {vnOpen && <div style={{ height: 160 }} />}
      </div>

      {/* VN dialogue overlay */}
      {vnOpen && currentVnLine && (
        <VNBox line={currentVnLine} onNext={handleVnNext} />
      )}

      {/* 선택지 · 닉네임 입력 하단 오버레이 */}
      {(pendingChoice || awaitingNickname) && (
        <div
          style={{
            position: 'absolute', left: 0, right: 0,
            bottom: 0,
            padding: 'max(12px, env(safe-area-inset-bottom)) 14px 14px',
            background: 'linear-gradient(transparent 0%, rgba(8,14,22,0.94) 25%)',
            borderTop: '1px solid #1e3048',
            zIndex: 20,
          }}
          role="dialog"
          aria-labelledby={pendingChoice ? 'choice-hint' : 'nickname-hint'}
        >
          {pendingChoice && (
            <div style={{ marginBottom: awaitingNickname ? 14 : 0 }}>
              <div id="choice-hint" style={{
                fontSize: 11, color: '#4a6880',
                marginBottom: 10,
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.03em',
              }}>
                답변을 선택하세요
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingChoice.map(opt => (
                  <button
                    key={opt.next}
                    type="button"
                    onClick={() => handleChoice(opt)}
                    style={{
                      width: '100%',
                      minHeight: 44,
                      borderRadius: 8,
                      border: '1px solid #2e2060',
                      background: '#1a1535',
                      color: '#c8b8f0',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontFamily: "'Noto Sans KR', system-ui, sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {awaitingNickname && (
          <>
          <div id="nickname-hint" style={{
            fontSize: 11, color: '#4a6880',
            marginBottom: 8,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.03em',
            lineHeight: 1.5,
          }}>
            다른 이름으로 호명되었습니다. TalkLine 표시 이름을 입력하고 전송해 주세요. (전임자 사번 라인이 잠시 귀속됩니다.)
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <input
              ref={inputRef}
              type="text"
              maxLength={14}
              value={nicknameDraft}
              onChange={e => setNicknameDraft(e.target.value.replace(/\s+/g, ' '))}
              onKeyDown={e => e.key === 'Enter' && submitNickname()}
              placeholder="표시 이름 (2자 이상)"
              aria-label="TalkLine 표시 이름"
              style={{
                flex: 1,
                minHeight: 44,
                borderRadius: 8,
                border: '1px solid #253a54',
                background: '#0f1a26',
                color: '#c8ddf0',
                padding: '0 14px',
                fontSize: 15,
                fontFamily: "'Noto Sans KR', system-ui, sans-serif",
              }}
            />
            <button
              type="button"
              onClick={submitNickname}
              style={{
                minWidth: 72,
                minHeight: 44,
                borderRadius: 8,
                border: '1px solid #2a5690',
                background: '#183554',
                color: '#bfd8f0',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              전송
            </button>
          </div>
          </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeUpRight {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes vnUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        ::-webkit-scrollbar       { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #182840; border-radius: 2px; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// SCREEN · NFC simulation (폴백: 탭하여 스캔)
// ─────────────────────────────────────────
function NfcScanScreen({ onDone }) {
  const [pulse, setPulse] = useState(false);

  const handleTap = () => {
    if (pulse) return;
    setPulse(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate)
        navigator.vibrate(28);
    } catch { /* ignore */ }
    setTimeout(onDone, 720);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #050a10 0%, #081420 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'max(24px, env(safe-area-inset-top)) 24px max(32px, env(safe-area-inset-bottom))',
    }}>
      <div style={{
        width: 'min(260px, 88vw)', textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'monospace',
          fontSize: 11, letterSpacing: '0.2em',
          color: '#2a5068', marginBottom: 20,
        }}>
          ACCESS · NFC UPLINK
        </div>
        <button
          type="button"
          onClick={handleTap}
          style={{
            width: '100%', aspectRatio: '1',
            maxWidth: 168,
            margin: '0 auto',
            borderRadius: '24px',
            border: pulse ? '1px solid rgba(90,154,208,0.45)' : '1px dashed #284058',
            background: pulse ? 'radial-gradient(circle at 50% 40%, rgba(90,154,208,0.12), transparent 55%)' : '#081018',
            boxShadow: pulse ? '0 0 0 16px rgba(90,154,208,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
            cursor: pulse ? 'default' : 'pointer',
            transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            width: '42%', height: '42%', borderRadius: 12,
            background: pulse ? '#2a5690' : '#152030',
            opacity: pulse ? 0.95 : 0.85,
          }} />
        </button>
        <p style={{
          marginTop: 26,
          fontSize: 14,
          color: '#4a6890',
          lineHeight: 1.65,
          fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        }}>
          사원 카드를 리더에 태그하세요.<br />
          <span style={{ fontSize: 11.5, color: '#2c4058' }}>(브라우저 데모: 영역 탭하면 스캔됩니다)</span>
        </p>
        <div style={{
          marginTop: 16, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.06em',
          color: '#1e3850',
        }}>
          {SESSION_EMP_ID} · 카드 레인지 활성화됨
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SCREEN · Boot
// ─────────────────────────────────────────
const BOOT = [
  { t: '', s: `${COMPANY.legal} · ${COMPANY.product} v2.1` },
  { t: '', s: '' },
  { t: 'ok',   s: '[  OK  ] Network UP · TLS 1.3' },
  { t: 'ok',   s: '[  OK  ] Auth service … OK' },
  { t: 'warn', s: `[ WARN ] Session restore · ${SESSION_EMP_ID}` },
  { t: 'warn', s: `[ WARN ] TEMP_CARD_BINDING / PRED_ID → ACTIVE SESSION` },
  { t: 'ok',   s: '[  OK  ] Access granted · INTERN CONTRACT' },
  { t: '', s: '' },
  { t: '', s: 'Launching messenger UI… TalkLine INTERNAL' },
];

function BootScreen({ onDone }) {
  const [lines, setLines]     = useState([]);
  const [progress, setProgress] = useState(0);
  const timers = useRef([]);
  const idx    = useRef(0);

  useEffect(() => {
    const run = () => {
      if (idx.current >= BOOT.length) {
        setProgress(100);
        timers.current.push(setTimeout(onDone, 500));
        return;
      }
      const l = BOOT[idx.current];
      setLines(p => [...p, l]);
      setProgress(Math.round((idx.current / BOOT.length) * 100));
      idx.current++;
      timers.current.push(setTimeout(run, l.t === 'warn' ? 220 : l.s === '' ? 80 : 100));
    };
    timers.current.push(setTimeout(run, 350));
    return () => timers.current.forEach(clearTimeout);
  }, [onDone]);

  const col = (t) =>
    t === 'ok' ? '#3a7a50' : t === 'warn' ? '#8a6020' : '#3a5870';

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#080e16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 320, padding: 28 }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            fontFamily: 'monospace', fontSize: 11.5, letterSpacing: '0.06em',
            color: col(l.t), marginBottom: 3, minHeight: 17,
          }}>{l.s || '\u00a0'}</div>
        ))}
        <div style={{ marginTop: 18, height: 2, background: '#0f1e2e', borderRadius: 1 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#2a6090', borderRadius: 1, transition: 'width 0.1s' }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
export default function NexusApp() {
  const [screen, setScreen] = useState('nfc');

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#050a10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        {screen === 'nfc' && (
          <NfcScanScreen onDone={() => setScreen('boot')} />
        )}
        {screen === 'boot' && (
          <BootScreen onDone={() => setScreen('chat')} />
        )}
        {screen === 'chat' && <MessengerScreen />}
      </div>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a10; }
      `}</style>
    </div>
  );
}
