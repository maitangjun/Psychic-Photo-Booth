import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, EditMode } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase request size limit to handle uploaded base64 photos easily
app.use(express.json({ limit: "15mb" }));

let aiClient: GoogleGenAI | null = null;

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing! Please configure your API key in the Settings > Secrets panel of AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. API: Reconstruct Photo (Shamate Metaphysics Engine)
app.post("/api/reconstruct", async (req, res) => {
  try {
    const { imageB64, mimeType, model, prompt } = req.body;

    if (!imageB64 || !mimeType) {
      return res.status(400).json({ error: "Missing image data (imageB64) or mimeType" });
    }

    const fallbackData = getFallbackShamateDestiny();
    const aiPrompt = prompt || fallbackData.aiPrompt || "以参考图人物为原型，仅改变发型、妆容和背景，保留原图面部特征。";
    const aiModel = model || process.env.GEMINI_MODEL || process.env.VITE_AI_MODEL || "imagen-4.0-generate-001";
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ error: "NO_API_KEY", fallback: fallbackData });
    }

    try {
      const response = await getGeminiClient().models.editImage({
        model: aiModel,
        prompt: aiPrompt,
        referenceImages: [
          {
            referenceImage: {
              imageBytes: imageB64,
              mimeType,
            }
          }
        ],
        config: {
          numberOfImages: 1,
          editMode: EditMode.EDIT_MODE_DEFAULT,
        }
      });

      const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
      const outputUrl = imageBytes ? `data:image/png;base64,${imageBytes}` : undefined;

      if (outputUrl) {
        return res.json({
          ...fallbackData,
          generatedImageUrl: outputUrl,
          aiPrompt: aiPrompt,
          aiPromptAlternative: fallbackData.aiPromptAlternative,
        });
      }
    } catch (innerErr: any) {
      console.error("Gemini editImage error:", innerErr);
      return res.status(200).json({ error: "NO_API_KEY", fallback: fallbackData });
    }

    return res.status(200).json({ error: "NO_IMAGE_RESULT", fallback: fallbackData });
  } catch (err: any) {
    console.error("Error in /api/reconstruct:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: err.message, fallback: getFallbackShamateDestiny() });
  }
});

// Mock/Fallback data generator for seamless UX even when API key is missing
function getFallbackShamateDestiny() {
  const nicknames = ["ゞ吥慬﹎莪dēㄕāлg", "〤葬愛oО冷少〤", "ゞ糖菓ωū孩孓", "。貴族ゞ南宮傲"];
  const attributes = ["水泥舞池首席战神", "皇家酷炫红发法王", "忧郁网吧冷面王子", "葬爱白发孤独长老"];
  const hairFortunes = ["68cm - 刺破苍穹，震慑凡尘", "45cm - 蓬松飘逸，网吧焦点", "88cm - 斜刘海遮住右眼，冷酷如霜", "120cm - 天崩地裂，全网通缉"];
  const dyes = ["#FF00FF", "#00FFFF", "#FF0055", "#FFCC00"];
  const dyeNames = ["死亡蔷薇粉", "电波幻影蓝", "喋血冷酷红", "黄金单身贵族黄"];
  const stickers = ["wings", "tears", "heart", "sparks", "hair"];
  const analyses = [
    "你天生骨骼惊奇，左眼常年被微斜的刘海遮挡，这是你吸纳天地灵气、隔离凡俗尘埃的赛博法阵。只要迈入劲舞团，你就是无可匹敌的神话。",
    "你眼神中闪烁着的孤独，是512MB内存无法承载的重量。在2006年的那个落雨黄昏，红钻皇族将是你一生注定的归宿与羁绊。",
    "你的凡身之中潜藏着强烈的逆反骨骼，高饱和度的霓虹光柱正在呼唤你的觉醒。不要再掩饰了，在网吧的烟雾与霓虹里，重获新生吧。"
  ];
  const sayings = [
    "ゞ、 oО 洳 淉 sんI つ， 请 堔つ ； 洳 淉 ьU つ， 埥 lì. 閞 ﹎..",
    "。 莪們sんI葬愛 ゞ ○o. 伱不dσngωǒ的 ",
    "﹎.. 涐 ィ门 ⒐ 寔 葬 え ╮╰ 沵 丆 嬞 涐 哒 sんāлg ┲ ﹊"
  ];

  const titles = ["★宿命·星痕★", "★命輪·流轉★", "★星軌·羈絆★", "★因果·輪迴★"];
  const adagesLeft = [
    "手掌微星刻畫命格之劫 髮色如虹預示流年羈絆",
    "眼眸深處藏著宿命的碎片 髮絲微揚預言著相逢之缘",
    "寒夜孤星指引魂魄重塑 命理交織化作眉間朱砂",
    "指尖光華演算天機流轉 塵世宿怨終在網中消融"
  ];
  const adagesRight = [
    "流淚的眼線會化 唯有星光能照亮你的心",
    "命盤如洗莫問前程 且染一抹霓虹照亮幽冥",
    "宿命無常不忘初心 逆光起舞終會涅槃重塑",
    "紅塵紛擾清心自渡 凝聚星芒喚醒沉睡靈魂"
  ];

  const randIdx = Math.floor(Math.random() * nicknames.length);
  const pickedTitle = titles[randIdx % titles.length];
  const pickedLeft = adagesLeft[randIdx % adagesLeft.length];
  const pickedRight = adagesRight[randIdx % adagesRight.length];

  const fallbackPromptClassic = `以参考图人物为原型，仅改变发型、发色、妆容和背景，保留原图100%的面部特征和五官比例。将原图人物的脸型、眼睛、眉毛、鼻子、嘴唇、下颌线、皮肤质感完美复刻。【杀马特造型】极端夸张高耸的杀马特造型发型，搭配${dyeNames[randIdx % dyeNames.length]}；浓郁暗黑烟熏妆+夸张眼线+穿孔装饰。【霓虹背景】昏暗霓虹灯光背景，赛博朋克+哥特风格混合。【超大字命理文字】顶部居中大标题：${pickedTitle}；左下角大字批语：${pickedLeft}；右下角大字建议：${pickedRight}。文字风格：繁体中文+火星文符号，发光霓虹效果。8K超高清，大头贴特写，人像居中。`;
  
  const fallbackPromptAlternative = `以参考图人物为原型（去除眼镜），保留原图100%的面部特征和五官比例（椭圆脸型、柔和五官、皮肤质感）。【面部杀马特元素】脸上贴有星星、爱心等小型装饰贴；在额头画有神秘命理符文；精致穿孔装饰。【杀马特发型】极端夸张高耸的杀马特造型发型，渐变色发色：天空蓝渐变。 【妆容】柔和浅灰色烟熏+白色眼线。【环境氛围】梦幻粉色樱花雨背景，漂浮光尘气泡。【超大字命理文字】顶部居中大标题：${pickedTitle}；左下角大字命理批语：${pickedLeft} (正体中文形式)；右下角大字开运建议：${pickedRight} (正体中文形式)。全部使用正体中文，但字形具有哥特体和火星文的星光装饰。8K超高清，背景虚化，梦幻大头贴特写。`;

  const fallbackPresets = [
    "/presets/goth_rose_shamate.png",
    "/presets/ice_blue_shamate.png",
    "/presets/rainbow_shamate.png"
  ];
  const pickedGeneratedUrl = fallbackPresets[randIdx % fallbackPresets.length];

  return {
    nickname: nicknames[randIdx],
    soulAttribute: attributes[randIdx],
    hairHeightFortune: hairFortunes[randIdx],
    colorDye: dyes[randIdx],
    colorName: dyeNames[randIdx],
    filterSaturate: 3.5,
    stickerType: stickers[Math.floor(Math.random() * stickers.length)],
    destinyAnalysis: analyses[Math.floor(Math.random() * analyses.length)],
    shamateSayings: sayings,
    titleText: pickedTitle,
    adageLeft: pickedLeft,
    adageRight: pickedRight,
    aiPrompt: fallbackPromptClassic,
    aiPromptAlternative: fallbackPromptAlternative,
    resonanceScore: Math.floor(Math.random() * 21) + 80, // 80-100
    generatedImageUrl: pickedGeneratedUrl
  };
}


// Start Vite or serve client asset
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid esbuild resolving Vite server-side dependencies in production bundles
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Shamate Metaphysics Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
