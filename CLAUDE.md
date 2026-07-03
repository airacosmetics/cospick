# COSPICK — 프로젝트 헌법

## 1. 프로젝트
- 한 줄: 화장품 신상·가격·성분을 크롤링해 비교하고 뷰티 뉴스까지 큐레이션하는 화장품 셀렉트샵 + 미디어 SaaS (데스크톱·모바일 웹)
- 단일 진실 공급원: `PRD.md`

## 2. 기술 스택
- 프론트엔드: 순수 HTML/CSS/JavaScript 정적 사이트 (빌드 없음) — `index.html` · `styles.css` · `app.js`
- 백엔드: Vercel 서버리스 함수 (`/api/*.js`, ESM) — products · cart · search · (신규) crawl · news
- AI 검색: Google Gemini API (`GEMINI_API_KEY`, 실패 시 키워드 검색 폴백)
- 크롤링: Vercel 서버리스 크롤러 (신상/랭킹/뉴스 수집)
- (예정) 인증·DB: Supabase (Auth Email 단독 + Postgres + RLS)
- (예정) 결제: Polar.sh (KRW 월간 구독, Merchant of Record)
- 호스팅: Vercel 자동 배포 (`cospick.vercel.app`)

## 3. 디자인
- 디자인 시스템은 `DESIGN.md` 참조 (PRD 본문엔 디자인 X)
- 브랜드 컬러: 로즈 `#c98a7a` / 딥 로즈 `#a9695b`
- 한국어 전용 · Noto Sans KR

## 4. 규칙
- 한국어로 답변
- 코드는 명확한 변수명·짧은 함수, 현재 파일 스타일(바닐라 JS, ESM 서버리스) 유지
- 주석은 "왜" 만 (무엇은 코드가 말함)

## 5. 검증
- 프론트 변경 후 `index.html` 브라우저 확인
- API 변경 후 `curl`/브라우저로 `/api/*` 응답 확인
- 결제 흐름(Polar Sandbox 4242) 막히지 않게

## 6. 절대 금지
- `.env` / `.env.local` 커밋
- `PRD.md` 와 어긋나는 구현 (PRD 먼저 업데이트)
- 크롤링 시 대상 사이트 robots/이용약관 위반·과도한 요청 (rate limit 준수)
