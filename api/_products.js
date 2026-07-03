// 상품 데이터 (서버 소스 오브 트루스) — 파일명 _ 접두사라 Vercel 라우트로 노출되지 않음
export const products = [
  { id: 1, brand: "COSPICK", name: "수분 가득 히알루론 토너 300ml", price: 19000, sale: 15200, emoji: "🧴", bg: "#e9f1f4", badge: "BEST", category: "스킨케어", desc: "건조하고 당기는 피부에 수분을 채워주는 저자극 데일리 토너" },
  { id: 2, brand: "COSPICK", name: "비타민C 브라이트닝 세럼 30ml", price: 32000, sale: 25600, emoji: "💧", bg: "#fdeede", badge: "SALE", category: "에센스", desc: "칙칙한 피부톤과 잡티를 케어하는 미백 비타민C 세럼" },
  { id: 3, brand: "COSPICK", name: "촉촉 수분 크림 50ml", price: 24000, sale: 19200, emoji: "🪻", bg: "#efe7f4", badge: "BEST", category: "스킨케어", desc: "장벽을 지켜주는 고보습 수분 크림, 건성 피부 추천" },
  { id: 4, brand: "COSPICK", name: "데일리 마일드 클렌징폼 150ml", price: 14000, sale: 11200, emoji: "🧼", bg: "#e8f4ec", badge: "", category: "클렌징", desc: "자극 없이 노폐물을 씻어내는 약산성 클렌징폼" },
  { id: 5, brand: "COSPICK", name: "진정 시카 마스크팩 (10매)", price: 18000, sale: 12600, emoji: "🌸", bg: "#fdeaf0", badge: "SALE", category: "마스크팩", desc: "붉어지고 예민해진 피부를 가라앉히는 시카 진정 마스크팩" },
  { id: 6, brand: "COSPICK", name: "무기자차 톤업 선크림 SPF50+", price: 22000, sale: 17600, emoji: "☀️", bg: "#fdf6dc", badge: "BEST", category: "선케어", desc: "백탁 없이 자외선을 차단하는 톤업 무기자차 선크림" },
  { id: 7, brand: "COSPICK", name: "콜라겐 탄력 아이크림 20ml", price: 28000, sale: 22400, emoji: "👁️", bg: "#eef0f5", badge: "", category: "스킨케어", desc: "눈가 주름과 탄력을 케어하는 콜라겐 아이크림" },
  { id: 8, brand: "COSPICK", name: "벨벳 립 틴트 5g", price: 16000, sale: 12800, emoji: "💄", bg: "#fce8e6", badge: "NEW", category: "메이크업", desc: "하루종일 지속되는 벨벳 매트 립 틴트" },
];

// 키워드 검색 (검색 폴백 및 /api/products 공용)
export function keywordSearch(q) {
  const s = (q || "").trim().toLowerCase();
  if (!s) return products;
  return products.filter((p) =>
    `${p.name} ${p.brand} ${p.category} ${p.desc}`.toLowerCase().includes(s)
  );
}
