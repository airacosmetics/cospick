// COSPICK 프론트엔드 — 상품 로드 / AI 검색 / 장바구니 (Vercel API 연동)
const won = (n) => n.toLocaleString("ko-KR") + "원";
const grid = document.getElementById("grid");

let ALL = [];
let cart = loadCart(); // [{ id, qty }]

// ---------- 상품 목록 ----------
async function loadProducts() {
  try {
    const r = await fetch("/api/products");
    const d = await r.json();
    ALL = d.products || [];
  } catch {
    ALL = [];
  }
  renderGrid(ALL);
}

function renderGrid(list) {
  if (!list.length) {
    grid.innerHTML = `<p class="empty">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }
  grid.innerHTML = list
    .map(
      (p) => `
    <article class="card">
      <div class="thumb" style="background:${p.bg}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        ${p.emoji}
      </div>
      <div class="info">
        <p class="brand">${p.brand}</p>
        <p class="name">${p.name}</p>
        <p class="price"><small>${won(p.price)}</small>${won(p.sale)}</p>
        <button class="add-btn" data-id="${p.id}">장바구니 담기</button>
      </div>
    </article>`
    )
    .join("");
}

// 카드의 '담기' 버튼 (이벤트 위임)
grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  addToCart(Number(btn.dataset.id));
});

// ---------- AI 검색 ----------
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const searchMsg = document.getElementById("searchMsg");

searchToggle.addEventListener("click", () => {
  searchBar.hidden = !searchBar.hidden;
  if (!searchBar.hidden) searchInput.focus();
});

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) {
    renderGrid(ALL);
    searchMsg.textContent = "";
    return;
  }
  searchMsg.textContent = "🔎 검색 중…";
  try {
    const r = await fetch("/api/search?q=" + encodeURIComponent(q));
    const d = await r.json();
    const map = new Map(ALL.map((p) => [p.id, p]));
    const list = (d.ids || []).map((id) => map.get(id)).filter(Boolean);
    renderGrid(list);
    if (d.ai && d.message) searchMsg.textContent = "🤖 " + d.message;
    else if (!list.length) searchMsg.textContent = "검색 결과가 없습니다.";
    else searchMsg.textContent = `${list.length}개의 상품을 찾았어요.`;
  } catch {
    searchMsg.textContent = "검색 중 오류가 발생했습니다.";
  }
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchMsg.textContent = "";
  renderGrid(ALL);
});

// ---------- 장바구니 ----------
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cospick_cart") || "[]");
  } catch {
    return [];
  }
}
function saveCart() {
  localStorage.setItem("cospick_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const found = cart.find((c) => c.id === id);
  if (found) found.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
  refreshCart();
}
function changeQty(id, delta) {
  const c = cart.find((c) => c.id === id);
  if (!c) return;
  c.qty += delta;
  if (c.qty <= 0) cart = cart.filter((x) => x.id !== id);
  saveCart();
  refreshCart();
}

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

document.getElementById("cartToggle").addEventListener("click", () => {
  openCart();
  refreshCart();
});
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return alert("장바구니가 비어 있습니다 🙂");
  alert("주문 기능은 준비 중입니다 🙂 (데모)");
});

function openCart() {
  cartDrawer.hidden = false;
  cartOverlay.hidden = false;
}
function closeCart() {
  cartDrawer.hidden = true;
  cartOverlay.hidden = true;
}

// 서버(/api/cart)에서 가격·합계를 계산해 렌더
async function refreshCart() {
  updateBadge();
  if (!cart.length) {
    cartBody.innerHTML = `<p class="cart-empty">장바구니가 비어 있어요.</p>`;
    cartTotal.textContent = won(0);
    return;
  }
  try {
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    const d = await r.json();
    cartBody.innerHTML = d.lines
      .map(
        (l) => `
      <div class="cart-item">
        <div class="ci-thumb" style="background:${l.bg}">${l.emoji}</div>
        <div class="ci-info">
          <p class="ci-name">${l.name}</p>
          <p class="ci-price">${won(l.price)}</p>
          <div class="ci-qty">
            <button data-id="${l.id}" data-d="-1">−</button>
            <span>${l.qty}</span>
            <button data-id="${l.id}" data-d="1">＋</button>
          </div>
        </div>
        <p class="ci-total">${won(l.lineTotal)}</p>
      </div>`
      )
      .join("");
    cartTotal.textContent = won(d.total);
  } catch {
    cartBody.innerHTML = `<p class="cart-empty">장바구니를 불러오지 못했습니다.</p>`;
  }
}

// 수량 조절 버튼 (이벤트 위임)
cartBody.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (!b) return;
  changeQty(Number(b.dataset.id), Number(b.dataset.d));
});

function updateBadge() {
  const n = cart.reduce((s, c) => s + c.qty, 0);
  cartCount.textContent = n;
  cartCount.hidden = n === 0;
}

// ---------- 초기화 ----------
loadProducts();
updateBadge();
