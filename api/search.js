// GET /api/search?q=여드름에 좋은 진정 제품 추천해줘
// → Google Gemini API로 자연어 질문을 이해해 관련 상품을 추천.
//   GEMINI_API_KEY 환경변수가 없거나 오류 시 키워드 검색으로 자동 폴백.
import { products, keywordSearch } from "./_products.js";

const MODEL = "gemini-2.5-flash"; // 필요 시 gemini-2.0-flash 등으로 교체 가능

export default async function handler(req, res) {
  const q = (req.query?.q || "").trim();
  if (!q) {
    res.status(200).json({ ids: products.map((p) => p.id), message: "", ai: false });
    return;
  }

  const fallback = () => keywordSearch(q).map((p) => p.id);
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    res.status(200).json({ ids: fallback(), message: "", ai: false });
    return;
  }

  try {
    const catalog = products
      .map((p) => `#${p.id} ${p.name} [${p.category}] - ${p.desc} (${p.sale}원)`)
      .join("\n");

    const prompt = `너는 화장품 셀렉트샵 COSPICK의 친절한 AI 쇼핑 도우미야.
아래 상품 목록 중에서 고객의 질문/고민에 가장 잘 맞는 상품을 골라 추천해.
반드시 아래 JSON 형식으로만 답해:
{"ids": [관련도 높은 순서의 상품 id 숫자 배열], "message": "따뜻한 한 문장 추천 코멘트"}

[상품목록]
${catalog}

[고객질문]
${q}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      }),
    });

    if (!r.ok) throw new Error("gemini " + r.status);
    const data = await r.json();
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(txt);

    let ids = Array.isArray(parsed.ids)
      ? parsed.ids.map(Number).filter((id) => products.some((p) => p.id === id))
      : [];
    if (!ids.length) ids = fallback();

    res.status(200).json({ ids, message: parsed.message || "", ai: true });
  } catch (e) {
    res.status(200).json({ ids: fallback(), message: "", ai: false });
  }
}
