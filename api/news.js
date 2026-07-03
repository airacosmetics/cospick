// GET /api/news?cat=트렌드
// → 화장품/뷰티 뉴스를 크롤링해 카드형 JSON 으로 반환.
//   소스 = Google News RSS (공개 피드). 서버리스 인스턴스 메모리에 5분 캐시.
//   네트워크 실패 시 내장 샘플 데이터로 폴백 (데모 안정성).

// 카테고리 → 검색 키워드 매핑 (PRD §3.3)
const CATEGORIES = {
  전체: "화장품",
  신제품: "화장품 신제품 출시",
  트렌드: "화장품 뷰티 트렌드",
  성분: "화장품 성분",
  브랜드: "화장품 브랜드 소식",
};

// 인스턴스 메모리 캐시 { key: { at, items } }
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5분

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "") // 남은 태그 제거
    .trim();

function parseRss(xml) {
  const items = [];
  const blocks = xml.split(/<item>/).slice(1);
  for (const b of blocks) {
    const pick = (tag) => {
      const m = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
      return m ? decode(m[1]) : "";
    };
    const rawTitle = pick("title");
    const link = pick("link");
    if (!rawTitle || !link) continue;
    // Google News title 형식: "제목 - 출처"
    const dash = rawTitle.lastIndexOf(" - ");
    const title = dash > 0 ? rawTitle.slice(0, dash) : rawTitle;
    const source = dash > 0 ? rawTitle.slice(dash + 3) : (pick("source") || "뉴스");
    const desc = pick("description").slice(0, 140);
    items.push({ title, source, link, pubDate: pick("pubDate"), summary: desc });
  }
  return items.slice(0, 24);
}

async function crawl(cat) {
  const query = CATEGORIES[cat] || CATEGORIES["전체"];
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const r = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; COSPICK-NewsBot/1.0)" },
  });
  if (!r.ok) throw new Error("rss " + r.status);
  const xml = await r.text();
  const items = parseRss(xml);
  if (!items.length) throw new Error("empty rss");
  return items;
}

const SAMPLE = [
  { title: "올여름 뷰티 키워드는 '글로우 스킨'… 물광 제품 판매 급증", source: "뷰티데일리", link: "https://cospick.vercel.app/news", pubDate: "", summary: "촉촉한 물광 피부를 연출하는 세럼·미스트 제품이 여름 시즌 판매량을 견인하고 있다." },
  { title: "무기자차 선크림 대세… 성분 따지는 소비자 늘었다", source: "코스메틱뉴스", link: "https://cospick.vercel.app/news", pubDate: "", summary: "백탁 없는 무기자차 선크림에 대한 관심이 높아지며 성분 표기를 확인하는 소비 트렌드가 확산." },
  { title: "시카·판테놀 진정 라인 신제품 잇단 출시", source: "뷰티누리", link: "https://cospick.vercel.app/news", pubDate: "", summary: "민감성 피부를 겨냥한 진정 성분 제품이 브랜드별 신제품 라인으로 연이어 공개됐다." },
  { title: "K-뷰티 립 틴트, 글로벌 시장서 인기 지속", source: "코스인", link: "https://cospick.vercel.app/news", pubDate: "", summary: "롱래스팅 벨벳 틴트를 중심으로 한 K-뷰티 메이크업 수출이 꾸준히 성장 중이다." },
];

export default async function handler(req, res) {
  const cat = (req.query?.cat || "전체").trim();
  const key = CATEGORIES[cat] ? cat : "전체";

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) {
    res.status(200).json({ items: hit.items, category: key, cached: true, source: "google-news-rss" });
    return;
  }

  try {
    const items = await crawl(key);
    cache.set(key, { at: Date.now(), items });
    res.status(200).json({ items, category: key, cached: false, source: "google-news-rss" });
  } catch (e) {
    res.status(200).json({ items: SAMPLE, category: key, cached: false, source: "sample-fallback" });
  }
}
