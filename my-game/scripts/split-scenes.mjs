import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const text = fs.readFileSync(appPath, 'utf8');

const prologueStart = text.indexOf('// PROLOGUE COMPONENTS');
const chapterStart = text.indexOf('// CHAPTER 1 COMPONENTS');
const errClass = text.indexOf('class GameErrorBoundary');
const useTimersStart = text.indexOf('function useTimers()');

if (prologueStart < 0 || chapterStart < 0 || errClass < 0 || useTimersStart < 0) {
  console.error('Markers:', { prologueStart, chapterStart, errClass, useTimersStart });
  throw new Error('App.jsx structure changed — manual update needed');
}

const prologueRaw = text.slice(prologueStart, chapterStart).trim();
const timerHook = text.slice(useTimersStart, prologueStart).trim();
const chapterRaw = text.slice(chapterStart, errClass).trim();

const prologueHeader = `import React, {
  useState, useEffect, useRef, useId, useMemo, useCallback,
} from 'react';
import {
  COMPANY,
  SESSION_EMP_ID,
  BUBBLE_MAX,
  CHARS,
  EMOTIONS,
  dialogueScript,
  uid,
} from '../gameData';

`;

const prologueFooter = `

/**
 * NFC → boot → TalkLine → ending. Parent sets \`currentScene\` to 'chapter1' after \`onProceedToChapterOne\`.
 */
export default function Prologue({ onProceedToChapterOne, onRestartRun }) {
  const [phase, setPhase] = useState('nfc');
  const [endingNickname, setEndingNickname] = useState(null);
  const [messengerMountKey, setMessengerMountKey] = useState(0);

  const restartFromTitle = useCallback(() => {
    setEndingNickname(null);
    setMessengerMountKey((k) => k + 1);
    setPhase('nfc');
    onRestartRun?.();
  }, [onRestartRun]);

  return (
    <>
      {phase === 'nfc' && (
        <NfcScanScreen key="nfc" onDone={() => setPhase('boot')} />
      )}
      {phase === 'boot' && (
        <BootScreen key="boot" onDone={() => setPhase('chat')} />
      )}
      {phase === 'chat' && (
        <MessengerScreen
          key={\`chat-\${messengerMountKey}\`}
          onEnd={(nick) => {
            setEndingNickname(nick);
            setPhase('ending');
          }}
        />
      )}
      {phase === 'ending' && (
        <EndingScreen
          nickname={endingNickname}
          onRestart={restartFromTitle}
          onClear={() => onProceedToChapterOne?.(endingNickname)}
        />
      )}
    </>
  );
}
`;

let chapterBody = `${timerHook}

${chapterRaw}`;

chapterBody = chapterBody.replace(
  /function Chapter1\(\{\s*nickname\s*=\s*'플레이어',\s*onClear\s*\}\)/,
  "export default function Chapter1({ playerNickname = '플레이어', onChapterComplete })",
);
chapterBody = chapterBody.replace(
  /const \[currentScene, setCurrentScene] = useState\('rpg_floor7_init'\);/,
  "const [flowSceneKey, setFlowSceneKey] = useState('rpg_floor7_init');",
);
chapterBody = chapterBody.replace(/\bcurrentScene\b/g, 'flowSceneKey');
chapterBody = chapterBody.replace(/\bsetCurrentScene\b/g, 'setFlowSceneKey');
chapterBody = chapterBody.replace(
  /<Chapter1End nickname=\{nickname\} onClear=\{onClear/g,
  '<Chapter1End nickname={playerNickname} onClear={onChapterComplete',
);
chapterBody = chapterBody.replace(
  /<ChatScene key=\{flowSceneKey\} sceneKey=\{flowSceneKey\} nickname=\{nickname\}/,
  '<ChatScene key={flowSceneKey} sceneKey={flowSceneKey} nickname={playerNickname}',
);
chapterBody = chapterBody.replace(
  /<span style=\{\{ fontSize: 9\.5, color: '#1a3040', fontFamily: 'monospace' \}\}>\{nickname\}<\/span>/,
  `<span style={{ fontSize: 9.5, color: '#1a3040', fontFamily: 'monospace' }}>{playerNickname}</span>`,
);

const chapterHeader = `import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import {
  CHARS,
  SCENES,
  MAPS,
  MAP_COLS,
  MAP_ROWS,
  TILE_SIZE,
  uid,
} from '../gameData';

`;

const chapterFooter = `

/**
 * Chapter 1 — RPG + chat/VN script. Receives \`playerNickname\` from Prologue.
 */
`;

const outPrologue = path.join(root, 'src', 'scenes', 'Prologue.jsx');
const outChapter = path.join(root, 'src', 'scenes', 'Chapter1.jsx');
fs.mkdirSync(path.dirname(outPrologue), { recursive: true });
fs.writeFileSync(outPrologue, prologueHeader + prologueRaw + prologueFooter, 'utf8');
fs.writeFileSync(outChapter, chapterHeader + chapterBody + chapterFooter, 'utf8');
console.log('OK Prologue + Chapter1 bytes', prologueHeader.length + prologueRaw.length, chapterHeader.length + chapterBody.length);
