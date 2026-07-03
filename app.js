// COSPICK 상품 데이터 (목록형 쇼핑몰)
const products = [
  { brand: "COSPICK", name: "수분 가득 히알루론 토너 300ml", price: 19000, sale: 15200, emoji: "🧴", bg: "#e9f1f4", badge: "BEST" },
  { brand: "COSPICK", name: "비타민C 브라이트닝 세럼 30ml", price: 32000, sale: 25600, emoji: "💧", bg: "#fdeede", badge: "SALE" },
  { brand: "COSPICK", name: "촉촉 수분 크림 50ml", price: 24000, sale: 19200, emoji: "🪻", bg: "#efe7f4", badge: "BEST" },
  { brand: "COSPICK", name: "데일리 마일드 클렌징폼 150ml", price: 14000, sale: 11200, emoji: "🧼", bg: "#e8f4ec", badge: "" },
  { brand: "COSPICK", name: "진정 시카 마스크팩 (10매)", price: 18000, sale: 12600, emoji: "🌸", bg: "#fdeaf0", badge: "SALE" },
  { brand: "COSPICK", name: "무기자차 톤업 선크림 SPF50+", price: 22000, sale: 17600, emoji: "☀️", bg: "#fdf6dc", badge: "BEST" },
  { brand: "COSPICK", name: "콜라겐 탄력 아이크림 20ml", price: 28000, sale: 22400, emoji: "👁️", bg: "#eef0f5", badge: "" },
  { brand: "COSPICK", name: "벨벳 립 틴트 5g", price: 16000, sale: 12800, emoji: "💄", bg: "#fce8e6", badge: "NEW" },
];

const won = (n) => n.toLocaleString("ko-KR") + "원";

const grid = document.getElementById("grid");
grid.innerHTML = products.map((p) => `
  <article class="card">
    <div class="thumb" style="background:${p.bg}">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      ${p.emoji}
    </div>
    <div class="info">
      <p class="brand">${p.brand}</p>
      <p class="name">${p.name}</p>
      <p class="price"><small>${won(p.price)}</small>${won(p.sale)}</p>
    </div>
  </article>
`).join("");

// 장바구니/검색 버튼 안내 (데모)
document.querySelectorAll(".nav-icons button").forEach((b) =>
  b.addEventListener("click", () => alert("준비 중인 기능입니다 🙂"))
);
