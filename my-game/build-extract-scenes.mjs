import fs from 'fs';

const APP = 'src/App.jsx';
let raw = fs.readFileSync(APP, 'utf8');
raw = raw.replace(/\r\n/g, '\n');

const iTimers = raw.indexOf('// ══════════════════════════════════════════════════════\n// 타이머 훅 (챕터 1 공용)');
const iPrologue = raw.indexOf('// ══════════════════════════════════════════════════════\n// PROLOGUE COMPONENTS');
const iChapter = raw.indexOf('// ══════════════════════════════════════════════════════\n// CHAPTER 1 COMPONENTS');
const iErr = raw.indexOf('// ══════════════════════════════════════════════════════\n// Error Boundary');

if (iTimers < 0 || iPrologue < 0 || iChapter < 0 || iErr < 0) {
  console.error('Marker not found:', { iTimers, iPrologue, iChapter, iErr });
  process.exit(1);
}

const useTimersBlk = raw.slice(iTimers, iPrologue).trim();
const prologueBody = raw.slice(iPrologue, iChapter).trim();
let chapterBody = raw.slice(iChapter, iErr).trim();

chapterBody = chapterBody
  .replace(
    /^function Chapter1\(\{ nickname = '플레이어', onClear \}\)/m,
    "export default function Chapter1({ playerNickname = '플레이어', onChapterComplete })",
  )
  .replace(/\bcurrentScene\b/g, 'flowSceneKey')
  .replace(/\bsetCurrentScene\b/g, 'setFlowSceneKey');

chapterBody = chapterBody.replace(
  /<ChatScene key=\{flowSceneKey\} sceneKey=\{flowSceneKey\} nickname=\{nickname\}/g,
  '<ChatScene key={flowSceneKey} sceneKey={flowSceneKey} nickname={playerNickname}',
);

chapterBody = chapterBody.replace(
  /<Chapter1End nickname=\{nickname\} onClear=\{onClear \?\? \(\(\) => \{\}\)\} \/>/,
  '<Chapter1End nickname={playerNickname} onChapterComplete={onChapterComplete ?? (() => {})} />',
);

chapterBody = chapterBody.replace(
  /<span style=\{\{ fontSize: 9\.5, color: '#1a3040', fontFamily: 'monospace' \}\}>\{nickname\}<\/span>/,
  '<span style={{ fontSize: 9.5, color: \'#1a3040\', fontFamily: \'monospace\' }}>{playerNickname}</span>',
);

const chapterChapter1EndFix = () => {
  const old = /^function Chapter1End\(\{ nickname, onClear \}\)/m;
  if (!chapterBody.match(old)) return;
  chapterBody = chapterBody.replace(
    old,
    'function Chapter1End({ nickname, onChapterComplete })',
  );
  chapterBody = chapterBody.replace(
    /<button type="button" onClick=\{onClear\}/,
    '<button type="button" onClick={onChapterComplete}',
  );
};

chapterChapter1EndFix();

const chapterHeader = `import React, {
  useState, useEffect, useRef, useMemo, useCallback,
} from 'react';
import {
  CHARS, SCENES, MAPS, MAP_COLS, MAP_ROWS, TILE_SIZE, uid,
} from '../gameData';

`;

const chapterOut = `${chapterHeader}${useTimersBlk}

${chapterBody}
`;

const prologueHeader = `import React, { useState, useEffect, useRef, useId, useMemo, useCallback } from 'react';
import {
  COMPANY, SESSION_EMP_ID, BUBBLE_MAX, CHARS, EMOTIONS, dialogueScript, uid,
} from '../gameData';

`;

const prologueFooter = `
export default function Prologue({ onProceedToChapterOne, onRestartRun }) {
  const [phase, setPhase] = useState('nfc');
  const [endingNickname, setEndingNickname] = useState(null);
  const [messengerResetKey, setMessengerResetKey] = useState(0);

  const handleMessengerEnd = useCallback((nick) => {
    setEndingNickname(nick);
    setPhase('ending');
  }, []);

  const handleRestartFromEnding = useCallback(() => {
    setEndingNickname(null);
    setMessengerResetKey((k) => k + 1);
    setPhase('nfc');
    onRestartRun?.();
  }, [onRestartRun]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {phase === 'nfc' && (
        <NfcScanScreen key="nfc" onDone={() => setPhase('boot')} />
      )}
      {phase === 'boot' && (
        <BootScreen key="boot" onDone={() => setPhase('chat')} />
      )}
      {phase === 'chat' && (
        <MessengerScreen key={\`chat-\${messengerResetKey}\`} onEnd={handleMessengerEnd} />
      )}
      {phase === 'ending' && (
        <EndingScreen
          key="ending"
          nickname={endingNickname}
          onRestart={handleRestartFromEnding}
          onClear={() => onProceedToChapterOne?.(endingNickname ?? '플레이어')}
        />
      )}
    </div>
  );
}
`;

fs.mkdirSync('src/scenes', { recursive: true });
fs.writeFileSync('src/scenes/Prologue.jsx', `${prologueHeader}${prologueBody}\n${prologueFooter}`, 'utf8');
fs.writeFileSync('src/scenes/Chapter1.jsx', chapterOut, 'utf8');

console.log('Wrote src/scenes/Prologue.jsx, src/scenes/Chapter1.jsx');
