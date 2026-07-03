// GET /api/crawl
// → "이번 주 신상·랭킹" 데이터 (PRD §3.2).
//   ① 뷰티 뉴스 제목에서 트렌드 키워드 추출 + ② 상품 카탈로그 랭킹.
//   뉴스 크롤은 /api/news 로직을 재사용, 실패해도 상품 랭킹은 항상 반환.
import { products } from "./_products.js";

const cache = { at: 0, data: null };
const TTL = 10 * 60 * 1000; // 10분

// 뉴스 제목에서 뽑아낼 뷰티 트렌드 키워드 후보
const KEYWORDS = ["물광", "글로우", "무기자차", "선크림", "시카", "판테놀", "진정", "비타민C", "미백", "레티놀", "탄력", "립틴트", "클렌징", "수분"];

async function fetchNewsTitles() {
  const url = "https://news.google.com/rss/search?q=" + encodeURIComponent("화장품 뷰티 트렌드") + "&hl=ko&gl=KR&ceid=KR:ko";
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; COSPICK-CrawlBot/1.0)" } });
  if (!r.ok) throw new Error("rss " + r.status);
  const xml = await r.text();
  return (xml.match(/<title>([\s\S]*?)<\/title>/gi) || []).map((t) => t.replace(/<\/?title>/gi, ""));
}

function rankProducts() {
  // 할인율 높은 순 = 이번 주 프로모션 랭킹
  return [...products]
    .map((p) => ({ ...p, discount: Math.round((1 - p.sale / p.price) * 100) }))
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 6)
    .map(({ id, brand, name, sale, price, discount, emoji, bg, badge }) => ({ id, brand, name, sale, price, discount, emoji, bg, badge }));
}

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.at < TTL) {
    res.status(200).json({ ...cache.data, cached: true });
    return;
  }

  let trends = [];
  let source = "sample";
  try {
    const titles = await fetchNewsTitles();
    const text = titles.join(" ");
    const counts = KEYWORDS.map((k) => ({ keyword: k, count: (text.match(new RegExp(k, "g")) || []).length }))
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count);
    trends = counts.slice(0, 8).map((x) => x.keyword);
    source = "google-news-rss";
  } catch {
    trends = ["물광", "무기자차", "시카", "비타민C", "수분"];
  }
  if (!trends.length) trends = ["물광", "무기자차", "시카", "비타민C", "수분"];

  const data = { trends, ranking: rankProducts(), source, updatedAt: new Date().toISOString() };
  cache.at = Date.now();
  cache.data = data;
  res.status(200).json({ ...data, cached: false });
}
