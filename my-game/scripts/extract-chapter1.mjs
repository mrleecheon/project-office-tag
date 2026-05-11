import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appPath = path.join(root, 'src', 'App.jsx');
const outPath = path.join(root, 'src', 'scenes', 'Chapter1.jsx');

const text = fs.readFileSync(appPath, 'utf8');

const timerStart = text.indexOf('// 타이머 훅 (챕터 1 공용)');
const prologueStart = text.indexOf('// PROLOGUE COMPONENTS');
if (timerStart < 0 || prologueStart < 0) throw new Error('Timer/prologue markers missing');
const timerHook = text.slice(timerStart, prologueStart).trim();

const ch1Start = text.indexOf('// ── Ch1Bubble');
const errBoundary = text.indexOf('// ══════════════════════════════════════════════════════\n// Error Boundary');
if (ch1Start < 0 || errBoundary < 0) throw new Error('Chapter1 / ErrorBoundary markers missing');
const chapterBody = text.slice(ch1Start, errBoundary).trim();

let body = `${timerHook}

${chapterBody}`;

body = body.replace(
  /function Chapter1\(\{\s*nickname\s*=\s*'플레이어',\s*onClear\s*\}\)/,
  "export default function Chapter1({ playerNickname = '플레이어', onChapterComplete })",
);

body = body.replace(
  /const \[currentScene, setCurrentScene] = useState\('rpg_floor7_init'\);/,
  "const [flowSceneKey, setFlowSceneKey] = useState('rpg_floor7_init');",
);
body = body.replace(/\bcurrentScene\b/g, 'flowSceneKey');
body = body.replace(/\bsetCurrentScene\b/g, 'setFlowSceneKey');

body = body.replace(
  /<Chapter1End nickname=\{nickname\} onClear=\{onClear/g,
  '<Chapter1End nickname={playerNickname} onClear={onChapterComplete',
);
body = body.replace(
  /<ChatScene key=\{flowSceneKey\} sceneKey=\{flowSceneKey\} nickname=\{nickname\}/,
  '<ChatScene key={flowSceneKey} sceneKey={flowSceneKey} nickname={playerNickname}',
);
body = body.replace(
  /<span style=\{\{ fontSize: 9\.5, color: '#1a3040', fontFamily: 'monospace' \}\}>\{nickname\}<\/span>/,
  `<span style={{ fontSize: 9.5, color: '#1a3040', fontFamily: 'monospace' }}>{playerNickname}</span>`,
);

const header = `import React, {
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

const footer = `

/**
 * Chapter 1 — RPG plus scripted chat/VN scenes.
 * \`playerNickname\` comes from Prologue; \`onChapterComplete\` runs after the Chapter 1 end card.
 */
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + body + footer, 'utf8');
console.log('Wrote', outPath);
