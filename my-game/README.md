# GROOMY OFFICE — 개발 가이드

포트폴리오 소개·게임 개요는 [저장소 루트 README](../README.md)를 참고하세요.

## 요구 사항

- Node.js 18+
- npm

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (HMR) |
| `npm run build` | `dist/` 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run test` | 콘텐츠·런타임·풀 플레이스루 검증 (17 suites) |
| `npm run lint` | ESLint |
| `npm run validate:content` | 챕터 스키마·콘텐츠 검증 리포트 생성 |
| `npm run export:unity` | Unity용 JSON 콘텐츠 번들 익스포트 |
| `npm run bundle:claude` | AI 리뷰용 소스 번들 생성 (로컬 전용, gitignore) |

## 아키텍처 개요

```
src/
├── app/           라우팅, 런타임 훅, 프로바이더
├── content/       챕터·씬·대사·월드 상수 (데이터 레이어)
├── engine/        씬 그래프, 세이브, 분기 조건, 오디오, 상태
├── game/          씬 오케스트레이터, 탐색 런타임, 부트스트랩
├── renderers/     씬 타입별 UI (chat / vn / rpg / system)
├── features/      메신저 페이싱, 시스템 UI 패널
├── tests/         자동 검증 (분기·엔딩·스키마·풀 플레이스루)
└── tools/         콘텐츠 빌드·디버그 스크립트
```

### 콘텐츠 추가 흐름

1. `src/content/chapters/chapter-XX/`에 `scenes.js`, `maps.js` 등 추가
2. `src/content/chapters/index.js`에 챕터 등록
3. `src/engine/progression/sceneGraph.js` · `chapterRegistry.js`에서 연결
4. `npm run test`로 분기·엔딩·스키마 검증

### 주요 런타임

- **`sceneOrchestrator`** — 씬 타입 전환, 분기 평가, 챕터 진행
- **`pacingController`** — 메신저 타이핑·읽음·지연 연출
- **`investigationProgress`** — 단서 수집·추론 게이트
- **`endings.js`** — 호감도·증거·플래그 기반 엔딩 해석

## 테스트

```bash
npm run test
```

포함 항목:

- 씬 그래프·진행 조건·세이브 스키마
- 챕터별 분기 (CH2 엔딩, CH4 shield/abandon, CH5 final choice)
- 엔딩 해석 (true / normal / badA / badB)
- **fullPlaythrough** — 주요 루트 자동 시뮬레이션

추가 디버그 도구 (`src/tools/debug/`):

```bash
node src/tools/debug/multiRoutePlaythroughReport.mjs   # 10갈래 보고서
node src/tools/debug/groomyAffinityAudit.mjs             # 호감도 라우팅 감사
node src/tools/content-build/estimatePlaytime.mjs      # 플레이타임 추정
```

## 배포

### GitHub Pages

`main` push 시 자동 배포. 설정: 저장소 **Settings → Pages → Source: GitHub Actions**.

- 워크플로: [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml)
- URL: https://mrleecheon.github.io/project-office-tag/
- GitHub Pages는 `/저장소이름/` 서브경로이므로 빌드 시 `VITE_BASE_PATH`가 자동 설정됩니다.

### Netlify (대안)

`netlify.toml`이 포함되어 있습니다.

| Netlify 설정 | 값 |
|--------------|-----|
| Base directory | `my-game` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Netlify는 루트(`/`)로 서빙 — `VITE_BASE_PATH` 없이 빌드.

## 로컬 전용 파일 (gitignore)

다음은 개발·리뷰용이며 저장소에 올라가지 않습니다.

- `_phase1_extract/` — 구버전 백업
- `claude_review_bundle.txt` — `npm run bundle:claude` 출력
- `*.zip`, `tools/butler/`
- `docs/full-playthrough-transcript.txt`, `docs/route-audit.txt`

## 관련 문서

- [그루미 호감도 라우팅](docs/groomy-affinity-routing.md)
- [10갈래 플레이스루 보고서](docs/multi-route-playthrough-report.md)
- [Unity 연동](UNITY_INTEGRATION.md)
