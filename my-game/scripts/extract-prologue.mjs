import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const outPath = path.join(root, 'src', 'scenes', 'Prologue.jsx');

const lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
const body = lines.slice(400, 1156).join('\n');

const header = `import React, {
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

const footer = `

/**
 * Opening act: NFC pairing → boot logs → TalkLine messenger → prologue ending card.
 * Parent should set \`currentScene\` to 'chapter1' when \`onProceedToChapterOne\` fires.
 *
 * @param {object} props
 * @param {(nickname: string | null) => void} props.onProceedToChapterOne
 * @param {() => void} [props.onRestartRun] - Optional notifier when player restarts from the ending (NFC again).
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

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + body + footer, 'utf8');
console.log('Wrote', outPath);
