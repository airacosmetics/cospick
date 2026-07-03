// GET /api/products          → 전체 상품
// GET /api/products?q=토너    → 키워드 검색
import { keywordSearch } from "./_products.js";

export default function handler(req, res) {
  const q = req.query?.q || "";
  res.status(200).json({ products: keywordSearch(q) });
}
