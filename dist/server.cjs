var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_genai = require("@google/genai");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "15mb" }));
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY or GOOGLE_API_KEY is missing! Please configure your API key in the Settings > Secrets panel of AI Studio.");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/reconstruct", async (req, res) => {
  try {
    const { imageB64, mimeType, model, prompt } = req.body;
    if (!imageB64 || !mimeType) {
      return res.status(400).json({ error: "Missing image data (imageB64) or mimeType" });
    }
    const fallbackData = getFallbackShamateDestiny();
    const aiPrompt = prompt || fallbackData.aiPrompt || "\u4EE5\u53C2\u8003\u56FE\u4EBA\u7269\u4E3A\u539F\u578B\uFF0C\u4EC5\u6539\u53D8\u53D1\u578B\u3001\u5986\u5BB9\u548C\u80CC\u666F\uFF0C\u4FDD\u7559\u539F\u56FE\u9762\u90E8\u7279\u5F81\u3002";
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
              mimeType
            }
          }
        ],
        config: {
          numberOfImages: 1,
          editMode: import_genai.EditMode.EDIT_MODE_DEFAULT
        }
      });
      const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
      const outputUrl = imageBytes ? `data:image/png;base64,${imageBytes}` : void 0;
      if (outputUrl) {
        return res.json({
          ...fallbackData,
          generatedImageUrl: outputUrl,
          aiPrompt,
          aiPromptAlternative: fallbackData.aiPromptAlternative
        });
      }
    } catch (innerErr) {
      console.error("Gemini editImage error:", innerErr);
      return res.status(200).json({ error: "NO_API_KEY", fallback: fallbackData });
    }
    return res.status(200).json({ error: "NO_IMAGE_RESULT", fallback: fallbackData });
  } catch (err) {
    console.error("Error in /api/reconstruct:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: err.message, fallback: getFallbackShamateDestiny() });
  }
});
function getFallbackShamateDestiny() {
  const nicknames = ["\u309E\u5425\u616C\uFE4E\u83AAd\u0113\u3115\u0101\u043Bg", "\u3024\u846C\u611Bo\u041E\u51B7\u5C11\u3024", "\u309E\u7CD6\u83D3\u03C9\u016B\u5B69\u5B53", "\u3002\u8CB4\u65CF\u309E\u5357\u5BAE\u50B2"];
  const attributes = ["\u6C34\u6CE5\u821E\u6C60\u9996\u5E2D\u6218\u795E", "\u7687\u5BB6\u9177\u70AB\u7EA2\u53D1\u6CD5\u738B", "\u5FE7\u90C1\u7F51\u5427\u51B7\u9762\u738B\u5B50", "\u846C\u7231\u767D\u53D1\u5B64\u72EC\u957F\u8001"];
  const hairFortunes = ["68cm - \u523A\u7834\u82CD\u7A79\uFF0C\u9707\u6151\u51E1\u5C18", "45cm - \u84EC\u677E\u98D8\u9038\uFF0C\u7F51\u5427\u7126\u70B9", "88cm - \u659C\u5218\u6D77\u906E\u4F4F\u53F3\u773C\uFF0C\u51B7\u9177\u5982\u971C", "120cm - \u5929\u5D29\u5730\u88C2\uFF0C\u5168\u7F51\u901A\u7F09"];
  const dyes = ["#FF00FF", "#00FFFF", "#FF0055", "#FFCC00"];
  const dyeNames = ["\u6B7B\u4EA1\u8537\u8587\u7C89", "\u7535\u6CE2\u5E7B\u5F71\u84DD", "\u558B\u8840\u51B7\u9177\u7EA2", "\u9EC4\u91D1\u5355\u8EAB\u8D35\u65CF\u9EC4"];
  const stickers = ["wings", "tears", "heart", "sparks", "hair"];
  const analyses = [
    "\u4F60\u5929\u751F\u9AA8\u9ABC\u60CA\u5947\uFF0C\u5DE6\u773C\u5E38\u5E74\u88AB\u5FAE\u659C\u7684\u5218\u6D77\u906E\u6321\uFF0C\u8FD9\u662F\u4F60\u5438\u7EB3\u5929\u5730\u7075\u6C14\u3001\u9694\u79BB\u51E1\u4FD7\u5C18\u57C3\u7684\u8D5B\u535A\u6CD5\u9635\u3002\u53EA\u8981\u8FC8\u5165\u52B2\u821E\u56E2\uFF0C\u4F60\u5C31\u662F\u65E0\u53EF\u5339\u654C\u7684\u795E\u8BDD\u3002",
    "\u4F60\u773C\u795E\u4E2D\u95EA\u70C1\u7740\u7684\u5B64\u72EC\uFF0C\u662F512MB\u5185\u5B58\u65E0\u6CD5\u627F\u8F7D\u7684\u91CD\u91CF\u3002\u57282006\u5E74\u7684\u90A3\u4E2A\u843D\u96E8\u9EC4\u660F\uFF0C\u7EA2\u94BB\u7687\u65CF\u5C06\u662F\u4F60\u4E00\u751F\u6CE8\u5B9A\u7684\u5F52\u5BBF\u4E0E\u7F81\u7ECA\u3002",
    "\u4F60\u7684\u51E1\u8EAB\u4E4B\u4E2D\u6F5C\u85CF\u7740\u5F3A\u70C8\u7684\u9006\u53CD\u9AA8\u9ABC\uFF0C\u9AD8\u9971\u548C\u5EA6\u7684\u9713\u8679\u5149\u67F1\u6B63\u5728\u547C\u5524\u4F60\u7684\u89C9\u9192\u3002\u4E0D\u8981\u518D\u63A9\u9970\u4E86\uFF0C\u5728\u7F51\u5427\u7684\u70DF\u96FE\u4E0E\u9713\u8679\u91CC\uFF0C\u91CD\u83B7\u65B0\u751F\u5427\u3002"
  ];
  const sayings = [
    "\u309E\u3001 o\u041E \u6D33 \u6DC9 s\u3093I \u3064\uFF0C \u8BF7 \u5814\u3064 \uFF1B \u6D33 \u6DC9 \u044CU \u3064\uFF0C \u57E5 l\xEC. \u959E \uFE4E..",
    "\u3002 \u83AA\u5011s\u3093I\u846C\u611B \u309E \u25CBo. \u4F31\u4E0Dd\u03C3ng\u03C9\u01D2\u7684\uE816 \uE7EC",
    "\uFE4E.. \u6D90 \u30A3\u95E8 \u2490 \u5BD4 \u846C \u3048 \u256E\u2570 \u6CB5 \u4E06 \u5B1E \u6D90 \u54D2 s\u3093\u0101\u043Bg \u2532 \uFE4A"
  ];
  const titles = ["\u2605\u5BBF\u547D\xB7\u661F\u75D5\u2605", "\u2605\u547D\u8F2A\xB7\u6D41\u8F49\u2605", "\u2605\u661F\u8ECC\xB7\u7F88\u7D46\u2605", "\u2605\u56E0\u679C\xB7\u8F2A\u8FF4\u2605"];
  const adagesLeft = [
    "\u624B\u638C\u5FAE\u661F\u523B\u756B\u547D\u683C\u4E4B\u52AB \u9AEE\u8272\u5982\u8679\u9810\u793A\u6D41\u5E74\u7F88\u7D46",
    "\u773C\u7738\u6DF1\u8655\u85CF\u8457\u5BBF\u547D\u7684\u788E\u7247 \u9AEE\u7D72\u5FAE\u63DA\u9810\u8A00\u8457\u76F8\u9022\u4E4B\u7F18",
    "\u5BD2\u591C\u5B64\u661F\u6307\u5F15\u9B42\u9B44\u91CD\u5851 \u547D\u7406\u4EA4\u7E54\u5316\u4F5C\u7709\u9593\u6731\u7802",
    "\u6307\u5C16\u5149\u83EF\u6F14\u7B97\u5929\u6A5F\u6D41\u8F49 \u5875\u4E16\u5BBF\u6028\u7D42\u5728\u7DB2\u4E2D\u6D88\u878D"
  ];
  const adagesRight = [
    "\u6D41\u6DDA\u7684\u773C\u7DDA\u6703\u5316 \u552F\u6709\u661F\u5149\u80FD\u7167\u4EAE\u4F60\u7684\u5FC3",
    "\u547D\u76E4\u5982\u6D17\u83AB\u554F\u524D\u7A0B \u4E14\u67D3\u4E00\u62B9\u9713\u8679\u7167\u4EAE\u5E7D\u51A5",
    "\u5BBF\u547D\u7121\u5E38\u4E0D\u5FD8\u521D\u5FC3 \u9006\u5149\u8D77\u821E\u7D42\u6703\u6D85\u69C3\u91CD\u5851",
    "\u7D05\u5875\u7D1B\u64FE\u6E05\u5FC3\u81EA\u6E21 \u51DD\u805A\u661F\u8292\u559A\u9192\u6C89\u7761\u9748\u9B42"
  ];
  const randIdx = Math.floor(Math.random() * nicknames.length);
  const pickedTitle = titles[randIdx % titles.length];
  const pickedLeft = adagesLeft[randIdx % adagesLeft.length];
  const pickedRight = adagesRight[randIdx % adagesRight.length];
  const fallbackPromptClassic = `\u4EE5\u53C2\u8003\u56FE\u4EBA\u7269\u4E3A\u539F\u578B\uFF0C\u4EC5\u6539\u53D8\u53D1\u578B\u3001\u53D1\u8272\u3001\u5986\u5BB9\u548C\u80CC\u666F\uFF0C\u4FDD\u7559\u539F\u56FE100%\u7684\u9762\u90E8\u7279\u5F81\u548C\u4E94\u5B98\u6BD4\u4F8B\u3002\u5C06\u539F\u56FE\u4EBA\u7269\u7684\u8138\u578B\u3001\u773C\u775B\u3001\u7709\u6BDB\u3001\u9F3B\u5B50\u3001\u5634\u5507\u3001\u4E0B\u988C\u7EBF\u3001\u76AE\u80A4\u8D28\u611F\u5B8C\u7F8E\u590D\u523B\u3002\u3010\u6740\u9A6C\u7279\u9020\u578B\u3011\u6781\u7AEF\u5938\u5F20\u9AD8\u8038\u7684\u6740\u9A6C\u7279\u9020\u578B\u53D1\u578B\uFF0C\u642D\u914D${dyeNames[randIdx % dyeNames.length]}\uFF1B\u6D53\u90C1\u6697\u9ED1\u70DF\u718F\u5986+\u5938\u5F20\u773C\u7EBF+\u7A7F\u5B54\u88C5\u9970\u3002\u3010\u9713\u8679\u80CC\u666F\u3011\u660F\u6697\u9713\u8679\u706F\u5149\u80CC\u666F\uFF0C\u8D5B\u535A\u670B\u514B+\u54E5\u7279\u98CE\u683C\u6DF7\u5408\u3002\u3010\u8D85\u5927\u5B57\u547D\u7406\u6587\u5B57\u3011\u9876\u90E8\u5C45\u4E2D\u5927\u6807\u9898\uFF1A${pickedTitle}\uFF1B\u5DE6\u4E0B\u89D2\u5927\u5B57\u6279\u8BED\uFF1A${pickedLeft}\uFF1B\u53F3\u4E0B\u89D2\u5927\u5B57\u5EFA\u8BAE\uFF1A${pickedRight}\u3002\u6587\u5B57\u98CE\u683C\uFF1A\u7E41\u4F53\u4E2D\u6587+\u706B\u661F\u6587\u7B26\u53F7\uFF0C\u53D1\u5149\u9713\u8679\u6548\u679C\u30028K\u8D85\u9AD8\u6E05\uFF0C\u5927\u5934\u8D34\u7279\u5199\uFF0C\u4EBA\u50CF\u5C45\u4E2D\u3002`;
  const fallbackPromptAlternative = `\u4EE5\u53C2\u8003\u56FE\u4EBA\u7269\u4E3A\u539F\u578B\uFF08\u53BB\u9664\u773C\u955C\uFF09\uFF0C\u4FDD\u7559\u539F\u56FE100%\u7684\u9762\u90E8\u7279\u5F81\u548C\u4E94\u5B98\u6BD4\u4F8B\uFF08\u692D\u5706\u8138\u578B\u3001\u67D4\u548C\u4E94\u5B98\u3001\u76AE\u80A4\u8D28\u611F\uFF09\u3002\u3010\u9762\u90E8\u6740\u9A6C\u7279\u5143\u7D20\u3011\u8138\u4E0A\u8D34\u6709\u661F\u661F\u3001\u7231\u5FC3\u7B49\u5C0F\u578B\u88C5\u9970\u8D34\uFF1B\u5728\u989D\u5934\u753B\u6709\u795E\u79D8\u547D\u7406\u7B26\u6587\uFF1B\u7CBE\u81F4\u7A7F\u5B54\u88C5\u9970\u3002\u3010\u6740\u9A6C\u7279\u53D1\u578B\u3011\u6781\u7AEF\u5938\u5F20\u9AD8\u8038\u7684\u6740\u9A6C\u7279\u9020\u578B\u53D1\u578B\uFF0C\u6E10\u53D8\u8272\u53D1\u8272\uFF1A\u5929\u7A7A\u84DD\u6E10\u53D8\u3002 \u3010\u5986\u5BB9\u3011\u67D4\u548C\u6D45\u7070\u8272\u70DF\u718F+\u767D\u8272\u773C\u7EBF\u3002\u3010\u73AF\u5883\u6C1B\u56F4\u3011\u68A6\u5E7B\u7C89\u8272\u6A31\u82B1\u96E8\u80CC\u666F\uFF0C\u6F02\u6D6E\u5149\u5C18\u6C14\u6CE1\u3002\u3010\u8D85\u5927\u5B57\u547D\u7406\u6587\u5B57\u3011\u9876\u90E8\u5C45\u4E2D\u5927\u6807\u9898\uFF1A${pickedTitle}\uFF1B\u5DE6\u4E0B\u89D2\u5927\u5B57\u547D\u7406\u6279\u8BED\uFF1A${pickedLeft} (\u6B63\u4F53\u4E2D\u6587\u5F62\u5F0F)\uFF1B\u53F3\u4E0B\u89D2\u5927\u5B57\u5F00\u8FD0\u5EFA\u8BAE\uFF1A${pickedRight} (\u6B63\u4F53\u4E2D\u6587\u5F62\u5F0F)\u3002\u5168\u90E8\u4F7F\u7528\u6B63\u4F53\u4E2D\u6587\uFF0C\u4F46\u5B57\u5F62\u5177\u6709\u54E5\u7279\u4F53\u548C\u706B\u661F\u6587\u7684\u661F\u5149\u88C5\u9970\u30028K\u8D85\u9AD8\u6E05\uFF0C\u80CC\u666F\u865A\u5316\uFF0C\u68A6\u5E7B\u5927\u5934\u8D34\u7279\u5199\u3002`;
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
    resonanceScore: Math.floor(Math.random() * 21) + 80,
    // 80-100
    generatedImageUrl: pickedGeneratedUrl
  };
}
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Shamate Metaphysics Server] Running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
