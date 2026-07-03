// POST /api/cart  { items: [{ id, qty }] }
// → 서버에서 가격/합계를 계산해 반환 (클라이언트 가격 위변조 방지)
import { products } from "./_products.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const items = Array.isArray(body?.items) ? body.items : [];

  const lines = [];
  let total = 0;
  let count = 0;

  for (const it of items) {
    const p = products.find((p) => p.id === Number(it.id));
    if (!p) continue;
    const qty = Math.max(1, Math.min(99, Number(it.qty) || 1));
    const lineTotal = p.sale * qty;
    total += lineTotal;
    count += qty;
    lines.push({ id: p.id, name: p.name, emoji: p.emoji, bg: p.bg, price: p.sale, qty, lineTotal });
  }

  res.status(200).json({ lines, total, count, shipping: 0 });
}
