# AGENTS.md — COSPICK

AI 코딩 에이전트(Claude Code / Codex / Cursor 등)를 위한 작업 가이드. 사람용 규칙은 `CLAUDE.md`, 제품 기획은 `PRD.md` 참조.

## 프로젝트 요약
화장품 셀렉트샵 + 크롤링 + 뷰티 뉴스 SaaS. 정적 프론트(HTML/CSS/JS) + Vercel 서버리스 API.

## 개발 환경
- 빌드 도구 없음. `index.html` 을 브라우저로 열면 프론트 동작.
- 로컬 API 테스트: `vercel dev` (또는 배포 후 `curl https://cospick.vercel.app/api/...`).
- Node ESM (`"type": "module"`). 서버리스 함수는 `export default async function handler(req, res)`.

## 코드 규칙
- 바닐라 JS 유지 (프레임워크 도입 금지, 별도 지시 없으면).
- 변수·함수명 명확히, 함수는 짧게. 주석은 "왜".
- 새 API 는 `api/` 에 추가하고 기존 `_products.js` 같은 공유 모듈 패턴을 따른다.

## 자주 하는 작업
- 상품 데이터: `api/_products.js`
- AI 검색: `api/search.js` (Gemini + 폴백)
- 장바구니 합계: `api/cart.js`
- 신규 크롤링/뉴스: `api/crawl.js` · `api/news.js`

## 금지
- 시크릿 커밋 금지(`.env*`). 키는 Vercel 환경변수로.
- 크롤링 대상의 robots/약관 위반 금지, 요청 rate limit 준수, 결과는 캐시.

## 검증 체크
- 프론트: 브라우저 렌더 확인.
- API: 200 응답 + JSON 스키마 확인.
- 배포: `git push` → Vercel 자동 배포 → production URL 확인.
