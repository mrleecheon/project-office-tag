# GROOMY OFFICE

> 사내 메신저·CCTV·출입 로그를 통해 전임자의 죽음을 파헤치는 하이브리드 내러티브 게임  
> *(TalkLine INTERNAL × 비주얼노벨 × 탐색 RPG)*

**GROOMY OFFICE**는 신입 사원이 되어 폐건물 위에 덮인 「회사」 환영을 탐색하며,  
전임자 **박서이**의 죽음과 안드로이드 동료 **그루미**의 비밀을 밝혀 나가는 오피스 미스터리입니다.

🎮 **[플레이하기](https://mrleecheon.github.io/project-office-tag/)** (GitHub Pages)

<!-- Netlify 등 다른 호스트를 쓰는 경우 위 링크를 교체하세요 -->

---

## 한 줄 소개

사원증 NFC 태그로 시작하는 인트로부터, 실제 앱처럼 동작하는 **사내 메신저**에서 단서를 모으고,  
**비주얼노벨**과 **타일맵 탐색**으로 현장을 조사하며, 선택에 따라 갈라지는 **다중 엔딩**으로 이어집니다.

| 항목 | 내용 |
|------|------|
| 장르 | 오피스 미스터리 / 인터랙티브 픽션 |
| 분량 | 프롤로그 + 5챕터 · 추정 플레이타임 **약 45~51분** (루트별) |
| 엔딩 | TRUE / NORMAL / BAD A / BAD B + 챕터 조기 종료 |
| 플랫폼 | 웹 브라우저 (React SPA) |

---

## 게임 특징

### 스토리 & 분기
- **지각 보정 레이어** — 사원증이 만들어내는 「GROOMY OFFICE」 환영과 폐건물의 진실이 겹쳐 보입니다.
- **그루미 호감도** — 프롤로그~CH3의 대화·조사 선택이 CH4·CH5 분기와 엔딩을 결정합니다.
- **단서·추론 시스템** — CCTV 메모, 출입 로그, 배터리 영수증 등을 수집해 타살 결론까지 도달합니다.
- **10개 검증 루트** — 주요 분기 조합을 자동 플레이스루로 검증했습니다. ([보고서](my-game/docs/multi-route-playthrough-report.md))

### 하이브리드 연출
| 모드 | 역할 |
|------|------|
| **Messenger** | TalkLine INTERNAL 채널·DM·타이핑 연출 |
| **Visual Novel** | 프롤로그·핵심 이벤트 대사 연출 |
| **RPG 탐색** | 사무실·로비·서버홀 타일맵 조사 |
| **System UI** | NFC 부팅, 세이브, 단서 패널, 챕터 클리어 |

---

## 기술 스택

- **React 19** · **Vite 8** · **Framer Motion**
- 자체 **씬 그래프** · **세이브/마이그레이션** · **분기 조건 엔진**
- 챕터별 **콘텐츠 모듈** + **스키마 검증** + **풀 플레이스루 테스트** (17 suites)
- (선택) Unity 연동용 JSON 익스포트 — [`UNITY_INTEGRATION.md`](my-game/UNITY_INTEGRATION.md)

---

## 이 프로젝트에서 한 일

- 메신저 UI를 실제 앱 수준으로 구현 (채널·개인 DM·읽음·타이핑 페이싱)
- VN / RPG / 채팅 3가지 렌더러를 **단일 런타임 오케스트레이터**로 통합
- 호감도·증거·플래그 기반 분기를 데이터 레이어로 분리해 콘텐츠 추가·테스트 용이하게 설계
- 프롤로그~CH5 전 구간 **자동 검증 파이프라인** 구축 (분기 일관성, 엔딩 해석, 스키마)
- SF 오피스 세계관(지각 보정·보호자 안드로이드·배터리 복선)을 게임 시스템과 연동

---

## 스크린샷

<!-- docs/screenshots/ 에 이미지 추가 후 아래 주석을 해제하세요 -->
<!--
| 메신저 | 비주얼노벨 | 탐색 | 엔딩 |
|--------|-----------|------|------|
| ![메신저](my-game/docs/screenshots/messenger.png) | ![VN](my-game/docs/screenshots/vn.png) | ![탐색](my-game/docs/screenshots/rpg.png) | ![엔딩](my-game/docs/screenshots/ending.png) |
-->

> `npm run dev` 실행 후 메신저 / VN / 탐색 / 엔딩 화면을 캡처해 `my-game/docs/screenshots/`에 넣으면 됩니다.

---

## 프로젝트 구조

```
project-office-tag/
├── README.md                 ← 이 문서 (포트폴리오)
├── package.json              ← 루트에서 my-game 실행
└── my-game/
    ├── src/
    │   ├── app/              ← 라우팅·런타임 훅
    │   ├── content/          ← 챕터·스토리·월드 데이터
    │   ├── engine/           ← 진행·세이브·분기·오디오
    │   ├── renderers/        ← Messenger / VN / RPG / System UI
    │   ├── game/             ← 씬 오케스트레이션·탐색 런타임
    │   └── tests/            ← 자동 검증 테스트
    ├── public/assets/        ← 이미지·CG·포트레이트
    ├── docs/                 ← 설계·플레이스루 보고서
    └── netlify.toml          ← 배포 설정
```

---

## 로컬 실행

저장소 루트에서:

```bash
cd my-game
npm install
npm run dev
```

또는 루트 `package.json` 스크립트 사용:

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run test     # 전체 검증 테스트
npm run preview  # 빌드 결과 미리보기
```

---

## 배포

### GitHub Pages (권장)

`main` 브랜치에 push하면 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)이 자동으로 빌드·배포합니다.

**최초 1회 설정**

1. GitHub 저장소 → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. `main`에 변경 사항 push (또는 Actions 탭에서 **Deploy to GitHub Pages** 수동 실행)

배포 URL: **https://mrleecheon.github.io/project-office-tag/**

> `demo` 브랜치만 사용 중이라면 `main`으로 merge하거나, 워크플로의 `branches`에 `demo`를 추가하세요.

### Netlify (대안)

`netlify.toml`이 포함되어 있습니다.

| 항목 | 값 |
|------|------|
| Base directory | `my-game` |
| Build command | `npm run build` |
| Publish directory | `my-game/dist` |

Netlify는 루트 경로(`/`)로 서빙하므로 `VITE_BASE_PATH` 없이 빌드하면 됩니다.

SPA 라우팅을 위해 `public/_redirects`도 포함되어 있습니다.

---

## 설계 문서

- [그루미 호감도 라우팅](my-game/docs/groomy-affinity-routing.md) — CH4 abandon / CH5 badB 분기 설계
- [10갈래 플레이스루 보고서](my-game/docs/multi-route-playthrough-report.md) — 엔딩·볼륨·추정 플레이타임
- [Unity 연동 가이드](my-game/UNITY_INTEGRATION.md) — 콘텐츠 JSON 익스포트

개발자용 상세 가이드는 [`my-game/README.md`](my-game/README.md)를 참고하세요.

---

## 포트폴리오용 요약 (복사용)

**짧은 버전**

> GROOMY OFFICE — React 기반 하이브리드 내러티브 게임. 메신저·VN·탐색을 하나의 엔진으로 통합하고, 분기·세이브·콘텐츠 검증 파이프라인을 직접 구현했습니다.

**상세 버전**

> 사내 메신저 인터페이스를 중심으로 미스터리를 풀어가는 인터랙티브 스토리입니다. 플레이어 선택에 따라 호감도와 단서가 쌓이고, 챕터마다 다른 씬 타입(채팅, 비주얼노벨, 타일맵 탐색)으로 전환됩니다. 씬 그래프·요구 조건·엔딩 해석을 엔진 레이어로 분리해 콘텐츠 추가와 테스트를 쉽게 했고, 전체 플레이스루·분기 일관성을 자동 검증하는 테스트 스위트를 구축했습니다.

---

## 라이선스

개인 포트폴리오·비상업적 공개 목적. 상업적 이용·에셋 재배포는 별도 문의.
