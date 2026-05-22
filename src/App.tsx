import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  Sparkles, 
  RefreshCw, 
  Download, 
  UserPlus, 
  Clock, 
  Heart, 
  Zap, 
  Camera, 
  Sliders, 
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Save,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppStage, ShamateDestiny, ClanMember, RitualLog, StickerType } from "./types";

// Predefined mock samples for quick testing (so users can try without uploading immediately)
const SAMPLE_SELFIES = [
  {
    name: "忧郁少爷 (Sample)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "冷艳水手 (Sample)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "深邃黑客 (Sample)",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  }
];

const STICKER_EMOJI_MAP: Record<StickerType, string> = {
  hair: "💇",
  wings: "🪶",
  tears: "💧",
  heart: "💔",
  sparks: "✨",
  skull: "💀",
  guitar: "🎸",
  crown: "👑",
  rose: "🌹",
  bandage: "🩹",
  star: "⭐",
  clover: "🍀",
  butterfly: "🦋",
  music: "🎵",
  diamond: "💎",
  withered_rose: "🥀",
  chain: "⛓️",
  dark_heart: "🖤",
  alien: "👽",
  game: "👾",
  web: "🕸️",
  crystal: "🔮",
  planet: "🪐",
  blood: "🩸",
  cup: "🍷",
  arrow_heart: "💘",
  custom: "✍️" // will draw customStickerText
};

const getPromptStyles = (title: string, left: string, right: string, hairColor: string = "至尊炫彩") => [
  {
    id: "style_0",
    name: "暗黑哥特狂少风",
    tagline: "极黑深邃，暗色骷髅与冷峻眼线的孤傲传奇",
    description: "极致夸张发型，深沉烟熏哥特妆容，闪烁紫粉霓虹，带有神秘命理脖子纹身。",
    prompt: `【杀马特大头贴特写】以参考图人物为原型（去除眼镜），保留原图100%的面部特征和五官比例。进行杀马特凡身二次觉醒。 【面部杀马特元素】面部绘有神秘暗黑命理符文与银色图腾，面部点缀精致唇钉与眉钉，眼角画有黑色墨黑泪滴彩绘，挂有极细的晶莹银链条。【极度发耸发型】极端夸张高耸、蓬松炸毛的经典杀马特刺刺头造型。发色为深邃魅惑紫渐变死亡蔷薇粉。【孤傲烟熏妆容】浓厚的黑色哥特烟熏妆，搭配锋利夸张的纯黑眼线，眼神充满冷峻孤独感。【非主流大头贴氛围】红黑霓虹交织的低调阴暗网吧背景，闪烁的冷色灯管，空气中漂浮着紫红色微光尘埃与神秘印记，带有一种赛博葬爱的孤独落寞感。【超大字大头贴命理文字版】（全正体中文，字体巨大，发光霓虹特效） 顶部居中大标题：${title || "★宿命·星痕★"} ； 左下角大字批语：${left || "手掌微星刻畫命格之劫 髮色如虹預示流年羈絆"} ； 右下角大字建议：${right || "流淚的眼線會化 唯有星光能照亮你的心"} ；文字风格：全部使用正体中文（不出现任何火星替代字），但字形具有极其夸张的复古歌特发光纹饰。8K超高清，大头贴框限制，肖像居中，完美人像特写。`
  },
  {
    id: "style_1",
    name: "七彩梦幻樱花风",
    tagline: "唯美纯爱，彩虹糖果与粉色花瓣的梦幻交织",
    description: "粉嫩马卡龙系柔和发色，面部贴花水晶贴，白色蕾丝眼线，唯美日式Purikura大头贴樱花雨背景。",
    prompt: `【柔美梦幻杀马特大头贴】以参考图人物为原型（去除眼镜），保留原图100%的面部特征和五官比例。进行梦幻灵魄觉醒。 【面部杀马特元素】脸上贴有精致的水晶爱心、粉色闪星贴纸，面部点缀微小的水钻泪痕。眉间绘有淡蓝色的星轨印记，精致鼻饰。【柔和炫彩发型】夸张而柔顺高耸的杀马特刘海造型，发色为马卡龙色系的薄荷绿渐变蜜桃粉，梦幻斑斓。【纯爱明朗妆容】清透的彩色眼妆，粉嫩腮红，边缘画有白色蕾丝夸张眼线。【梦幻可爱背景】日式大头贴（Purikura）拼贴背景，粉色樱花雨、彩虹光斑、漂浮的星星与爱心。 【超大字大头贴命理文字版】（全正体中文，字体巨大，霓虹发光，具有星光粒子特效） 顶部居中大标题：${title || "★星軌·羈絆★"} ； 左下角大字批语：${left || "眼眸深處藏著宿命的碎片 髮絲微揚預言著相逢之緣"} ； 右下角大字建议：${right || "命盤如洗莫問前程 且染一抹霓虹照亮幽冥"} ； 文字风格：必须使用100%纯正体中文，呈现极致华丽大头贴艺术刻字体。8K分辨率，大头贴专属镜头特写，糖果暖色调。`
  },
  {
    id: "style_2",
    name: "电磁幽蓝冰霜风",
    tagline: "电极科技，幽蓝射线与晶莹冰晶的冷艳星芒",
    description: "荧光深蓝渐变冰青色，眼周冰晶法阵，幽蓝网吧液晶光芒，清冷且具有强烈电磁科技感。",
    prompt: `【电感冰霜杀马特大头贴】以参考图人物为原型（去除眼镜），保留100%的面部比例和皮肤质感。【面部杀马特元素】眼周绘有淡蓝色的几何冰晶图案，鼻翼一侧带有精致小孔鼻环，额头处印有一枚幽蓝色的星痕法阵符文。【炸裂电波发型】极其蓬松暴躁炸开的刺猬发型，发色为亮眼的萤光深蓝渐变电感冰青色，具有强烈的科技金属感。【电气清冷妆容】深灰色微烟熏，搭配夺目的天蓝色和冰白色双重夸张眼线。【赛博网吧背景】充斥着幽蓝色液晶屏幕反光的2006年复古网吧背光，闪烁着湛蓝色激光光束，虚化背景，带着一丝冰冷空灵。【超大字大头贴命理文字版】（全正体中文，超大极简字体，幽蓝荧光特效） 顶部居中大标题：${title || "★星芒·寂灭★"} ； 左下角大字批语：${left || "寒夜孤星指引魂魄重塑 命理交織化作眉間朱砂"} ； 右下角大字建议：${right || "宿命無常不忘初心 逆光起舞終會涅槃重塑"} ；文字风格：高饱和冰蓝字体。8K超高清，清冷格调大头贴特写，冷艳人像。`
  },
  {
    id: "style_3",
    name: "黄金帝王劲舞风",
    tagline: "至尊张扬，黄金流光与舞池激光的狂傲风采",
    description: "亮金色渐变柠檬黄冲天冠发，眼眉贴金色碎钻，复古舞厅七彩镭射，尊显帝王狂霸之气。",
    prompt: `【黄金帝王杀马特大头贴】以参考图人物为原型（去除眼镜），保留100%的核心面部特征。【面部杀马特元素】脸颊两侧绘有烈阳黄金轮廓，额中央有星形印记，眉宇间镶嵌极小的闪烁金色假钻。【至尊尊爵发型】冲天高耸的大高发冠造型，极致倾斜的45度刘海。发色为亮金色渐变柠檬黄，张扬尊贵。【闪耀眼部妆容】浅金色烟熏，极黑猫眼线，面部有金色细小银色链条垂落挂坠。【炫彩舞池背景】复古热烈劲舞舞厅灯效背景，七彩镭射光扫射，五彩斑斓的炫金光环，空气中洋溢着音符与热烈动感。【超大字大头贴命理文字版】（全正体中文，字形极高耸，黄金边缘霓虹发光） 顶部居中大标题：${title || "★帝尊·狂舞★"} ； 左下角大字批语：${left || "指尖光華演算天機流轉 塵世宿怨終在網中消融"} ； 右下角大字建议：${right || "紅塵紛擾清心自渡 凝聚星芒喚醒沉睡靈魂"} ； 文字风格：正体中文，黄金立体火焰字样。8K极佳画质，大头贴透视感，贵族风采。`
  },
  {
    id: "style_4",
    name: "落日黄昏忧郁风",
    tagline: "余晖微醺，温柔晚霞与飘飞羽毛的寂寞追忆",
    description: "晚霞逆光胶片质感，落日暖橙渐变奶油米色蓬松发，微熏眼妆，散落细小羽毛，充满浪漫寂寞。",
    prompt: `【柔和寂寞黄昏大头贴】以参考图人像为核心比例，去除遮挡镜框，保留柔和肤质，百分之百还原五官。【面部杀马特元素】眼角下方绘有凄美哀怨的淡橙色眼影，一侧脸颊有树叶形状的微型命理印记，面部贴有微小金色星星贴纸。【温柔渐变发型】蓬松但极具层次感的斜刘海大波发型。发色为温柔落日暖橙渐变奶油米色。【忧郁深沉妆容】浅褐色大地色眼影，夸张的棕色细长拉尾眼线。【唯美余晖背景】古旧复古的晚霞落日逆光窗口背景，带有泛黄的照片质感，空气中漂浮着轻柔的淡色羽毛与飞扬的微尘粒子，极其温柔寂寞。【超大字大头贴命理文字版】（全正体中文，温暖橙红发光，复古手书体） 顶部居中大标题：${title || "★黃昏·悲歌★"} ； 左下角大字批语：${left || "眼眸深處藏著宿命的碎片 髮絲微揚預言著相逢之緣"} ； 右下角大字建议：${right || "流淚的眼線會化 唯有星光能照亮你的心"} ； 文字风格：100%全正体字。8K高清拍摄，落日人像，带有孤独回忆的大头贴气息。`
  },
  {
    id: "style_5",
    name: "火红涅槃狂野风",
    tagline: "烈烈焚心，火焰凤凰与岩浆辐射的狂放觉醒",
    description: "根根立起熔岩色炸毛，面额绘火焰凤凰羽图腾，赛博地仙岩浆高热射线，霸气野性。",
    prompt: `【烈火涅槃火红杀马特大头贴】以参考人像为原型比例重构。【面部杀马特元素】额头绘有炽烈燃烧的火红命理符文，侧脸勾画有凤凰羽毛的图腾，挂有极细的小银链，一侧带有耳钉点缀。【狂傲火焰发型】极端根根立起、夸张野性的烈火刺猬头。发色为鲜艳夺目的熔岩红渐变炭黑色，动感张扬。【妖娆烈焰妆容】粉黛烟熏底妆，配极粗耀眼勾线，眼睑处点缀烈火焰红光芒亮片。【焚心烈焰背景】具有暗色熔岩碎屑漂浮的赛博地核霓虹风格，深红与橙黄色的荧光射线，高热气泡与闪烁的光带。【超大字大头贴命理文字版】（全正体中文，烈焰熔岩质感，灼热发光） 顶部居中大标题：${title || "★涅槃·焚心★"} ； 左下角大字批语：${left || "手掌微星刻畫命格之劫 髮色如虹預示流年羈絆"} ； 右下角大字建议：${right || "宿命無常不忘初心 逆光起舞終會涅槃重塑"} ；文字风格：烈火岩浆色彩霓虹大字体。8K极致品质，大头贴比例，气势磅礴的人像特写。`
  }
];

const DEFAULT_TEXT_TITLE = "★宿命·星痕★";
const DEFAULT_TEXT_LEFT = "孒吢眼眸藏著宿命的碎片 髮色如霓虹預吂著8123の羈絆 痣為七星の印記 紋上路人之緣";
const DEFAULT_TEXT_RIGHT = "流涙の眼線會花 呮冇星光能照亮伱の吢";

const getAiPromptPure = () => `以参考图人物为原型，仅改变发型、发色、妆容和背景，保留原图100%的面部特征和五官比例。
【杀马特造型】极端夸张高耸的杀马特造型发型，渐变色发色（薄荷绿+天空蓝 或 蜜桃粉+柠檬黄）；浓郁暗黑烟熏妆+夸张眼线+穿孔装饰（眉钉唇钉鼻环）；脸颊或眼角挂有细小银色链条，脸上贴有星星、爱心等小型装饰贴。
【霓虹背景】昏暗霓虹灯光背景，赛博朋克+哥特风格混合，闪烁紫粉色灯管，飘浮金色尘埃与灵魂碎片，梦幻光晕点缀。
8K超高清，大头贴特写，人像居中，背景虚化。`.trim();

const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error("Failed to load image"));
  img.src = src;
});

const wrapTextLines = (text: string, maxChars: number) => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = `${current} ${word}`;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
};

const drawNeonBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, "#09000d");
  gradient.addColorStop(0.35, "#13001f");
  gradient.addColorStop(0.65, "#1f002f");
  gradient.addColorStop(1, "#020004");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 8; i += 1) {
    const lineY = (h / 8) * i + Math.random() * 28;
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.06 + Math.random() * 0.08})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, lineY);
    ctx.lineTo(w, lineY + Math.random() * 10 - 5);
    ctx.stroke();
  }

  for (let i = 0; i < 70; i += 1) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const size = Math.random() * 2 + 0.5;
    ctx.fillStyle = `rgba(255, 192, 203, ${Math.random() * 0.15})`;
    ctx.fillRect(x, y, size, size);
  }

  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = "rgba(138, 43, 226, 0.06)";
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
};

const drawUserPhotoOnCanvas = async (ctx: CanvasRenderingContext2D, src: string, w: number, h: number) => {
  const img = await loadImage(src);
  ctx.save();
  ctx.filter = "saturate(1.3) contrast(1.05) brightness(1.02)";
  const ratio = img.width / img.height;
  let drawWidth = w;
  let drawHeight = h;
  let offsetX = 0;
  let offsetY = 0;
  if (ratio > 1) {
    drawHeight = h;
    drawWidth = h * ratio;
    offsetX = -(drawWidth - w) / 2;
  } else {
    drawWidth = w;
    drawHeight = w / ratio;
    offsetY = -(drawHeight - h) / 2;
  }
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  ctx.restore();
};

const drawStickerOverlay = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stickerType: StickerType,
  stickerColor: string,
  stickerX: number,
  stickerY: number,
  stickerSize: number,
  stickerRotation: number,
  customStickerText: string
) => {
  const symbol = stickerType === "custom" ? (customStickerText || "葬愛") : (STICKER_EMOJI_MAP[stickerType] || "💇");
  const posX = (stickerX / 100) * w;
  const posY = (stickerY / 100) * h;
  const fontSize = Math.max(40, Math.min(220, stickerSize * 1.4));

  ctx.save();
  ctx.translate(posX, posY);
  ctx.rotate((stickerRotation * Math.PI) / 180);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = stickerColor;
  ctx.shadowColor = stickerColor;
  ctx.shadowBlur = 28;
  ctx.fillText(symbol, 0, 0);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = Math.max(1, fontSize * 0.07);
  ctx.strokeText(symbol, 0, 0);
  ctx.restore();
};

const drawOverlayText = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string,
  left: string,
  right: string
) => {
  const drawGlowText = (text: string, x: number, y: number, align: CanvasTextAlign, color: string, font: string) => {
    ctx.save();
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(text, x, y);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.strokeText(text, x, y);
    ctx.restore();
  };

  drawGlowText(title, w / 2, 84, "center", "#FF00FF", "bold 44px sans-serif");

  const leftLines = wrapTextLines(left, 24);
  const rightLines = wrapTextLines(right, 24);
  let lineY = h - 160;
  ctx.font = "bold 18px sans-serif";
  for (const line of leftLines) {
    drawGlowText(line, 40, lineY, "left", "#00FF00", "bold 18px sans-serif");
    lineY += 24;
  }

  lineY = h - 160;
  for (const line of rightLines) {
    drawGlowText(line, w - 40, lineY, "right", "#FF00FF", "bold 18px sans-serif");
    lineY += 24;
  }
};

const createCompositeDataUrl = async (
  photoUrl: string,
  opts: {
    stickerType: StickerType;
    stickerColor: string;
    stickerX: number;
    stickerY: number;
    stickerSize: number;
    stickerRotation: number;
    customStickerText: string;
    title: string;
    left: string;
    right: string;
  }
) => {
  const canvas = document.createElement("canvas");
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return photoUrl;

  drawNeonBackground(ctx, size, size);
  await drawUserPhotoOnCanvas(ctx, photoUrl, size, size);
  drawStickerOverlay(
    ctx,
    size,
    size,
    opts.stickerType,
    opts.stickerColor,
    opts.stickerX,
    opts.stickerY,
    opts.stickerSize,
    opts.stickerRotation,
    opts.customStickerText
  );
  drawOverlayText(ctx, size, size, opts.title, opts.left, opts.right);
  return canvas.toDataURL("image/png");
};

const createAiOverlayDataUrl = async (
  baseImageUrl: string,
  opts: {
    stickerType: StickerType;
    stickerColor: string;
    stickerX: number;
    stickerY: number;
    stickerSize: number;
    stickerRotation: number;
    customStickerText: string;
    title: string;
    left: string;
    right: string;
  }
) => {
  const canvas = document.createElement("canvas");
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return baseImageUrl;

  ctx.fillStyle = "#050008";
  ctx.fillRect(0, 0, size, size);

  try {
    const img = await loadImage(baseImageUrl);
    const ratio = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;
    let offsetX = 0;
    let offsetY = 0;
    if (ratio > 1) {
      drawHeight = size;
      drawWidth = size * ratio;
      offsetX = -(drawWidth - size) / 2;
    } else {
      drawWidth = size;
      drawHeight = size / ratio;
      offsetY = -(drawHeight - size) / 2;
    }
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  } catch (error) {
    drawNeonBackground(ctx, size, size);
  }

  drawStickerOverlay(
    ctx,
    size,
    size,
    opts.stickerType,
    opts.stickerColor,
    opts.stickerX,
    opts.stickerY,
    opts.stickerSize,
    opts.stickerRotation,
    opts.customStickerText
  );
  drawOverlayText(ctx, size, size, opts.title, opts.left, opts.right);
  return canvas.toDataURL("image/png");
};

const generateLocalShamateDestiny = async (
  photoUrl: string,
  opts: {
    stickerType: StickerType;
    stickerColor: string;
    stickerX: number;
    stickerY: number;
    stickerSize: number;
    stickerRotation: number;
    customStickerText: string;
    title: string;
    left: string;
    right: string;
  }
): Promise<ShamateDestiny> => {
  const generatedImageUrl = await createCompositeDataUrl(photoUrl, opts);
  const nicknames = [
    "ゞ葬愛本地魂ゞ",
    "★本地重构冥君★",
    "幽灵网吧幻影",
    "孤独Canvas主宰"
  ];
  const attributes = [
    "前端Canvas巫师",
    "本地灵魂合成者",
    "无服务器网吧孤星",
    "霓虹粘贴操作者"
  ];
  const tidbits = [
    "通过本地画布叠加，保持原图面容与客户选择的印记。",
    "纯前端渲染，不依赖外部 API 的杀马特命理大头贴。",
    "本地模式已完成贴纸位置锁定与大字命理蒙版。",
    "你现在看到的是前端画布下的即时灵魂预览。"
  ];

  return {
    nickname: nicknames[Math.floor(Math.random() * nicknames.length)],
    soulAttribute: attributes[Math.floor(Math.random() * attributes.length)],
    hairHeightFortune: "88cm - 本地重塑冲天，宿命轨迹已锁定",
    colorDye: opts.stickerColor,
    colorName: "本地霓虹炫彩",
    filterSaturate: 3.5,
    stickerType: opts.stickerType,
    destinyAnalysis: tidbits[Math.floor(Math.random() * tidbits.length)],
    shamateSayings: [
      "本地秘术已激活，画布成为你的第二层法身。",
      "不依赖云端，前端Canvas 也能召唤杀马特宿命。"
    ],
    resonanceScore: Math.floor(Math.random() * 11) + 90,
    titleText: opts.title,
    adageLeft: opts.left,
    adageRight: opts.right,
    aiPrompt: getAiPromptPure(),
    aiPromptAlternative: "本地 Canvas 纯渲染模式",
    generatedImageUrl,
  };
};

export default function App() {
  // Application Stage
  const [stage, setStage] = useState<AppStage>("idle");
  const [viewMode, setViewMode] = useState<"raw" | "ai">("ai");

  // Input States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>("image/jpeg");
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Destiny result from Server
  const [destiny, setDestiny] = useState<ShamateDestiny | null>(null);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(false);

  // Active user modification/filter states
  const [userSaturation, setUserSaturation] = useState<number>(3.5);
  const [userHueRotate, setUserHueRotate] = useState<number>(0);
  const [activeSticker, setActiveSticker] = useState<StickerType>("hair");
  const [stickerColor, setStickerColor] = useState<string>("#FF00FF");
  const [stickerX, setStickerX] = useState<number>(50); // percentage coordinates
  const [stickerY, setStickerY] = useState<number>(30);
  const [isDraggingSticker, setIsDraggingSticker] = useState<boolean>(false);
  const [customStickerText, setCustomStickerText] = useState<string>("葬愛");
  const [stickerSize, setStickerSize] = useState<number>(100);
  const [stickerRotation, setStickerRotation] = useState<number>(0);

  const [renderMode, setRenderMode] = useState<"local" | "ai">("local");
  const [aiApiBaseUrl, setAiApiBaseUrl] = useState<string>(import.meta.env.VITE_AI_API_BASE_URL || "/api/reconstruct");
  const [aiModel, setAiModel] = useState<string>(import.meta.env.VITE_AI_MODEL || "imagen-4.0-generate-001");
  const [generatedImageDataUrl, setGeneratedImageDataUrl] = useState<string | null>(null);

  // New High-Fidelity Custom text overlays and Prompt Customizers
  const [customTitle, setCustomTitle] = useState<string>(DEFAULT_TEXT_TITLE);
  const [customTopRight, setCustomTopRight] = useState<string>("杀马特大头贴");
  const [customLeft, setCustomLeft] = useState<string>(DEFAULT_TEXT_LEFT);
  const [customRight, setCustomRight] = useState<string>(DEFAULT_TEXT_RIGHT);
  const [showTextOverlay, setShowTextOverlay] = useState<boolean>(true);
  const [activePromptTab, setActivePromptTab] = useState<string>("style_0");
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // UI state variables
  const [processingLine, setProcessingLine] = useState<string>("正在注入高饱和色彩...");
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [ritualLogs, setRitualLogs] = useState<RitualLog[]>([
    { time: "11:22:01", user: "冷少·南宫", action: "献祭了高清凡人自拍照", result: "觉醒为【暗黑金发雷皇】", isSystem: false },
    { time: "11:15:33", user: "糖果屋女孩", action: "调整了斜刘海倾角至45度", result: "获得神物【炫彩芭比发卡】", isSystem: false },
    { time: "11:10:12", user: "系统管理员", action: "注入了500%杀马特狂野因子", result: "服务器负载率飙升至200%", isSystem: true },
  ]);

  // Join Clan input state
  const [clanFormName, setClanFormName] = useState<string>("");
  const [clanFormEmail, setClanFormEmail] = useState<string>("");
  const [clanFormSuccess, setClanFormSuccess] = useState<string | null>(null);

  // Reference for the composite canvas
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Dragging of Sticker Ref
  const dragConstraintRef = useRef<HTMLDivElement>(null);

  // Status updates in processing mode
  const PROCESSING_MESSAGES = [
    "正在开启 512Kbps 宽带超速传输...",
    "正在召唤葬爱大长老灵魂碎片...",
    "正在注入 400% 非主流火星文神印...",
    "发蓬指数正在暴涨 500% ...",
    "正在进行极致色彩高饱和饱和度重构...",
    "正在抹去世俗尘埃，觉醒忧郁贵族之眼...",
    "正在刻画 2006 经典网吧非主流宿命诅咒..."
  ];

  // Live Append of Logs simulation
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const users = ["幽冥·魅影", "伤感尐少", "樱花落泪", "狂舞狂少", "孤傲玫瑰"];
        const actions = ["上传了火星文个性签名", "更换了暗黑忧郁头像", "献祭凡俗自拍", "通宵包夜玩劲舞团"];
        const results = ["觉醒为【非主流水泥舞神】", "悟出【如果爱请深爱】真理", "发型高度拔高50cm", "获得网吧尊贵VIP红钻尊号"];
        
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        setRitualLogs((prev) => [
          {
            time: timeStr,
            user: users[Math.floor(Math.random() * users.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            result: results[Math.floor(Math.random() * results.length)],
            isSystem: false
          },
          ...prev.slice(0, 7) // keep recent 8 items
        ]);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Handler for image upload / selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedMimeType(file.type || "image/jpeg");
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedMimeType(file.type || "image/jpeg");
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset click handler
  const handleSelectPreset = async (presetUrl: string) => {
    try {
      setSelectedMimeType("image/jpeg");
      // Fetch of image to base64 encoding to represent local upload safely
      const response = await fetch(presetUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      // Fallback
      setSelectedImage(presetUrl);
    }
  };

  // Main Submit Ritual Trigger
  const handleTriggerRitual = async () => {
    if (!selectedImage) return;

    // Enter Processing state
    setStage("processing");
    setProcessingProgress(10);
    setProcessingLine("正在开启 512Kbps 宽带超载传输与安全套接字校验...");

    // Animate progress bar as loading ticker
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        const textIdx = Math.floor((prev / 100) * PROCESSING_MESSAGES.length);
        if (PROCESSING_MESSAGES[textIdx]) {
          setProcessingLine(PROCESSING_MESSAGES[textIdx]);
        }
        return prev + Math.floor(Math.random() * 15) + 3;
      });
    }, 600);

    try {
      setIsApiLoading(renderMode === "ai");
      setApiError(null);
      setShowApiKeyWarning(false);

      const opts = {
        stickerType: activeSticker,
        stickerColor,
        stickerX,
        stickerY,
        stickerSize,
        stickerRotation,
        customStickerText,
        title: customTitle,
        left: customLeft,
        right: customRight,
      };

      if (renderMode === "local") {
        const localDestiny = await generateLocalShamateDestiny(selectedImage, opts);
        setDestiny(localDestiny);
        setUserSaturation(localDestiny.filterSaturate || 3.5);
        setViewMode("ai");
        setProcessingLine("本地模式已完成画布重构，开始显灵...");

        clearInterval(progressInterval);
        setProcessingProgress(100);
        setTimeout(() => {
          setStage("done");
          const logTime = new Date().toLocaleTimeString();
          setRitualLogs((prev) => [
            {
              time: logTime,
              user: localDestiny.nickname,
              action: "本地Canvas模式完成重构",
              result: `觉醒为【${localDestiny.soulAttribute}】`,
              isSystem: false
            },
            ...prev
          ]);
        }, 700);

        return;
      }

      const base64Content = selectedImage.split(",")[1] || selectedImage;
      const serverRes = await fetch(aiApiBaseUrl || "/api/reconstruct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageB64: base64Content,
          mimeType: selectedMimeType,
          model: aiModel,
          prompt: getAiPromptPure(),
        })
      });

      if (!serverRes.ok) {
        throw new Error(`Server responded with status ${serverRes.status}`);
      }

      const resData = await serverRes.json();
      const data = resData.error === "NO_API_KEY" ? resData.fallback : resData;

      setDestiny(data);
      setUserSaturation(data.filterSaturate || 3.5);
      setActiveSticker(data.stickerType || "hair");
      setStickerColor(data.colorDye || "#FF00FF");
      setCustomTitle(data.titleText || DEFAULT_TEXT_TITLE);
      setCustomLeft(data.adageLeft || DEFAULT_TEXT_LEFT);
      setCustomRight(data.adageRight || DEFAULT_TEXT_RIGHT);
      setViewMode("ai");

      if (resData.error === "NO_API_KEY") {
        setShowApiKeyWarning(true);
      }

      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingLine("神业回传已完成，正在准备最终大头贴...");

      setTimeout(() => {
        setStage("done");
        const logTime = new Date().toLocaleTimeString();
        setRitualLogs((prev) => [
          {
            time: logTime,
            user: resData.nickname || "尊贵会员",
            action: `触发了AI模式重构`,
            result: `觉醒为【${resData.soulAttribute || "杀马特新星"}】`,
            isSystem: false
          },
          ...prev
        ]);
      }, 1000);

    } catch (err: any) {
      console.error("API Call error:", err);
      // Fail back gracefully so the user is never stuck
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingLine("仪式受凡尘浊气干扰，正启动本地秘宗防线...");
      
      // Let's instantiate beautiful client-side local fallback
      setTimeout(() => {
        const fallbacks = [
          {
            nickname: "ゞ吥慬﹎莪dēㄕāлg",
            soulAttribute: "水泥舞池首席战神",
            hairHeightFortune: "68cm - 刺破苍穹，震慑凡尘",
            colorDye: "#FF00FF",
            colorName: "死亡蔷薇粉",
            filterSaturate: 3.8,
            stickerType: "hair" as StickerType,
            destinyAnalysis: "你骨骼精奇，左眼常年被微斜的刘海遮挡，这是你吸纳天地灵气、隔离凡俗尘埃的赛博法阵。只要迈入劲舞团，你就是无可匹敌的神话。",
            shamateSayings: [
              "ゞ、 oО 洳 淉 sんI つ， 请 堔つ ； 洳 淉 ьU つ， 埥 lì. 閞 ﹎..",
              "。 莪們sんI葬愛 ゞ ○o. 伱不dσngωǒ的 ",
              "﹎.. 涐 ィ门 ⒐ 寔 葬 え ╮╰ 沵 丆 嬞 涐 哒 sんāлg ┲ ﹊"
            ],
            titleText: "★殇璃☆硭绫★",
            adageLeft: "孒吢，硋の眸孔里藏著未綕の情殇，預吂著眂絡將茬網吧裡遇見宿命的羈絆",
            adageRight: "不要吶吶，眼線會侢花の乄",
            aiPrompt: "以参考图人物为原型，仅改变发型、发色、妆容和背景，保留原图100%的面部特征和五官比例。将原图人物的脸型、眼睛、眉毛、鼻子、嘴唇、下颌线、皮肤质感完美复刻。【杀马特造型】极端夸张高耸的杀马特造型发型，搭配死亡蔷薇粉；浓郁暗黑烟熏妆+夸张眼线+穿孔装饰（眉钉唇钉鼻环）。【霓虹背景】昏暗霓虹灯光背景，赛博朋克+哥特风格混合，闪烁紫粉色灯管，飘浮金色尘埃与灵魂碎片。【超大字命理文字】（必须嵌入图片中，字体要很大很醒目）顶部居中大标题：★殇璃☆硭绫★；左下角大字批语：孒吢，硋oО藏著未綕情殇；右下角大字建议：不要吶吶，眼線會侢花の乄。文字风格：繁体中文+火星文符号，发光金色或粉色。8K超高清，大头贴特写，人像居中，背景虚化，霓虹高光点缀。",
            aiPromptAlternative: "以参考图人物为原型（去除眼镜），保留原图100%的面部特征和五官比例（柔和五官、皮肤质感）。【面部杀马特元素】脸上贴有星星、爱心等小型装饰贴；在额头画有神秘命理符文；精致穿孔装饰。【杀马特发型】极端夸张高耸的杀马特造型发型，渐变色发色：薄荷绿+天空蓝渐变。【环境氛围】梦幻粉色樱花雨背景，漂浮爱心星星等可爱符号。【超大字命理文字】顶部居中大标题：★殇璃☆硭绫★；左下角大字命理批语：孒吢眼眸藏著宿命的碎片 (全部使用正体中文呈现)；右下角大字开运建议：流涙の眼線會花 (全部使用正体中文形式)。全部使用正体中文，字形具有哥特体和火星文特色。8K超高清，背景虚化，梦幻大头贴特写。",
            resonanceScore: 98
          },
          {
            nickname: "〤葬愛oО冷少〤",
            soulAttribute: "忧郁网吧冷面王子",
            hairHeightFortune: "85cm - 顶天倒挂，吸干空气",
            colorDye: "#00FFFF",
            colorName: "极光闪烁蓝",
            filterSaturate: 4.2,
            stickerType: "wings" as StickerType,
            destinyAnalysis: "你眼神中锁着512M内存承载不了的冷漠悲凉。2006年的非主流红钻石，是宿命留给你的最后一座避风港口。",
            shamateSayings: [
              "︻︻︻ 緈畐、sんI、嗰、ぐ恠夢裏ぐ、綫oО",
              "。_。吥懂硪dē伤，じòぴé~請 đừng 硪 ╭☆",
              " ╭¤ 莪們 ゞ 從 吥 認 輸，╰ 因 爲 ╰ 莪 們 ╰ 寔 貴 族.. ¤╮"
            ],
            titleText: "★宿命·星痕★",
            adageLeft: "孒吢眼眸藏著宿命的碎片 髮色如霓虹預吂著8123oО的羈絆",
            adageRight: "流涙の眼線會花 呮冇星光能照亮伱の吢",
            aiPrompt: "以参考图人物为原型，仅改变发型、发色、妆容和背景，保留原图100%的面部特征和五官比例。将原图人物的脸型、眼睛、眉毛、鼻子、嘴唇、下颌线、皮肤质感完美复刻。【杀马特造型】极端夸张高耸的杀马特造型发型，搭配极光闪烁蓝；浓郁暗黑烟熏妆+夸张眼线+穿孔装饰。【霓虹背景】昏暗霓虹灯光背景，赛博朋克+哥特风格混合。【超大字命理文字】顶部居中大标题：★宿命·星痕★；左下角大字批语：孒吢眼眸藏著宿命的碎片；右下角大字建议：流涙の眼線會花。文字风格：繁体中文+火星文符号，霓虹发光效果。8K超高清，大头贴特写，人像居中，背景虚化，霓虹高光点缀。",
            aiPromptAlternative: "以参考图人物为原型（去除眼镜），保留原图100%的面部特征和五官比例。 【面部杀马特元素】脸上贴有闪钻装饰贴，额头刻有符文；面部饰有链条。【杀马特发型】极端夸张高耸的杀马特造型发型，渐变色发色：薄荷绿渐变。【环境氛围】梦幻彩虹背景，漂浮可爱符号。【超大字命理文字】顶部居中大标题：★宿命·星痕★；左下角大字命理批语：孒吢眼眸藏著宿命的碎片 (全部使用正体中文呈现)；右下角大字开运建议：流涙oО的眼線會花 (全部使用正体中文形式)。全部使用正体中文，字形具有星光霓虹装饰。8K超高清，背景虚化，梦幻大头贴特写。",
            resonanceScore: 94
          }
        ];
        
        const fallbackIdx = Math.floor(Math.random() * fallbacks.length);
        const selectedFallbackRaw = fallbacks[fallbackIdx];
        
        const localPresets = [
          "/presets/goth_rose_shamate.png",
          "/presets/ice_blue_shamate.png"
        ];
        
        const selectedFallback = {
          ...selectedFallbackRaw,
          generatedImageUrl: localPresets[fallbackIdx % localPresets.length]
        };

        setDestiny(selectedFallback);
        setUserSaturation(selectedFallback.filterSaturate || 3.5);
        setActiveSticker(selectedFallback.stickerType || "hair");
        setStickerColor(selectedFallback.colorDye || "#FF00FF");

        // Initialize editable neon texts
        setCustomTitle(selectedFallback.titleText);
        setCustomLeft(selectedFallback.adageLeft);
        setCustomRight(selectedFallback.adageRight);
        setViewMode("ai");

        setStage("done");
      }, 1200);
    } finally {
      setIsApiLoading(false);
    }
  };

  // Sticker drag positioning logic
  const handleStickerMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSticker(true);
  };

  const handleStickerDrag = (e: React.MouseEvent) => {
    if (!isDraggingSticker || !photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Contain coordinates inside 0-100% boundary
    setStickerX(Math.max(5, Math.min(95, x)));
    setStickerY(Math.max(5, Math.min(95, y)));
  };

  const handleStickerTouchMove = (e: React.TouchEvent) => {
    if (!photoContainerRef.current) return;
    const rect = photoContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setStickerX(Math.max(5, Math.min(95, x)));
    setStickerY(Math.max(5, Math.min(95, y)));
  };

  const handleStickerMouseUp = () => {
    setIsDraggingSticker(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDraggingSticker(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Save/Download Canvas Composite
  const handleDownloadResult = async () => {
    if (!selectedImage || !destiny) return;

    const filename = `shamate_destiny_${destiny.nickname || "avatar"}.png`;

    // Local mode already stores a full canvas composite with text overlay.
    if (renderMode === "local" && destiny.generatedImageUrl?.startsWith("data:")) {
      const link = document.createElement("a");
      link.download = filename;
      link.href = destiny.generatedImageUrl;
      link.click();
      return;
    }

    const sourceUrl = (renderMode === "ai" ? destiny.generatedImageUrl : selectedImage) || selectedImage;
    const finalUrl = renderMode === "ai"
      ? await createAiOverlayDataUrl(sourceUrl, {
          stickerType: activeSticker,
          stickerColor,
          stickerX,
          stickerY,
          stickerSize,
          stickerRotation,
          customStickerText,
          title: customTitle,
          left: customLeft,
          right: customRight,
        })
      : await createCompositeDataUrl(sourceUrl, {
          stickerType: activeSticker,
          stickerColor,
          stickerX,
          stickerY,
          stickerSize,
          stickerRotation,
          customStickerText,
          title: customTitle,
          left: customLeft,
          right: customRight,
        });

    const link = document.createElement("a");
    link.download = filename;
    link.href = finalUrl;
    link.click();
  };

  // One-click copy handler for tailored image generation prompts
  const handleCopyPrompt = () => {
    if (!destiny) return;
    const promptStyles = getPromptStyles(customTitle, customLeft, customRight, destiny.colorName || "至尊炫彩");
    const selected = promptStyles.find(p => p.id === activePromptTab) || promptStyles[0];
    const textToCopy = selected ? selected.prompt : "";
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.warn("Failed to copy to clipboard", e);
    }
  };

  // Clan Join Handler
  const handleJoinClan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clanFormName || !clanFormEmail) return;

    // Simulate joining
    setClanFormSuccess(`恭喜！您的法号【${clanFormName}】已被葬爱圣殿（SHAMATE-AES）加密存入！`);
    
    // Add to logs
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setRitualLogs((prev) => [
      {
        time: timeStr,
        user: clanFormName,
        action: `提交了圣殿申请书`,
        result: `受封为：【葬爱预备护法】`,
        isSystem: false
      },
      ...prev
    ]);

    setClanFormName("");
    setClanFormEmail("");
  };

  return (
    <div id="shamate_app" class="crt-overlay w-full max-w-7xl mx-auto h-screen max-h-[850px] bg-black text-[#00FF00] font-mono flex flex-col overflow-hidden border-4 border-[#FF00FF] box-border relative my-auto shadow-[0_0_30px_rgba(255,0,255,0.4)]">
      
      {/* 1. Header Area holding system indicators */}
      <header id="shamate_header" className="h-12 bg-zinc-950 border-b-2 border-[#FF00FF] flex items-center px-6 justify-between select-none z-20">
        <div className="flex items-center gap-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF00] animate-pulse"></span>
          <span className="uppercase tracking-[0.25em] text-xs font-black glowing-green">
            Shamate Soul System v2.0.06
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-6 text-[10px] uppercase font-bold opacity-85 hidden lg:flex text-[#00FF00]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF00FF]">CON:</span> Stable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF00FF]">RITUAL:</span> Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF00FF]">PORT:</span> 3000
            </span>
          </div>
          {/* Glowing Top-Right App Name */}
          <div className="flex items-center gap-1.5 bg-[#FF00FF]/15 border border-[#FF00FF] px-2.5 py-1 rounded shadow-[0_0_8px_rgba(255,0,255,0.4)]">
            <span className="w-1.5 h-1.5 bg-[#FF00FF] rounded-full animate-ping"></span>
            <span className="text-[10.5px] md:text-[11.5px] font-black text-[#FF00FF] tracking-widest font-sans">
              ✨ 杀马特命理大头贴 ✨
            </span>
          </div>
        </div>
      </header>

      {/* 2. Hot-pink Marquee Ticker */}
      <section id="shamate_ticker" className="bg-[#FF00FF] text-black h-8 flex items-center overflow-hidden whitespace-nowrap font-black text-xs border-b-2 border-black relative z-10 select-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
        <div className="animate-marquee tracking-[0.15em] flex items-center">
          <span>*** 欢迎来到杀马特命理大头贴 · 葬爱家族灵魂重构道场 · SHAMATE METAPHYSICS · 只有杀马特才能理解的孤独 · 即使世界毁灭，莪们依然在网吧相见 · 吥懂莪的伤 ***</span>
          <span className="ml-[100%]">*** 欢迎来到杀马特命理大头贴 · 葬爱家族灵魂重构道场 · SHAMATE METAPHYSICS · 只有杀马特才能理解的孤独 · 即使世界毁灭，莪们依然在网吧相见 · 吥懂莪的伤 ***</span>
        </div>
      </section>

      {/* 3. Main Split Grid Container */}
      <main id="shamate_grid" className="flex-1 grid grid-cols-12 gap-0 overflow-hidden relative">
        
        {/* Left Column - Sacrifice/Ritual History Logs */}
        <div id="shamate_left_panel" className={`${stage === "done" ? "hidden lg:flex" : "hidden md:flex"} col-span-12 lg:col-span-3 pb-6 md:pb-0 border-r border-[#FF00FF]/30 p-4 xl:p-6 flex flex-col overflow-hidden bg-zinc-950/80`}>
          <div className="flex items-center justify-between mb-4 border-b border-[#FF00FF]/30 pb-2">
            <h3 className="text-[#FF00FF] text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} />
              献祭记录 / History
            </h3>
            <span className="text-[9px] bg-[#00FF00]/10 border border-[#00FF00]/40 px-1.5 py-0.5 rounded text-[#00FF00] uppercase animate-pulse">
              Live
            </span>
          </div>

          {/* Logs scroll area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 md:pr-0 scrollbar-thin">
            <AnimatePresence initial={false}>
              {ritualLogs.map((log, idx) => (
                <motion.div 
                  key={idx + "-" + log.time}
                  initial={{ opacity: 0, x: -15, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -15, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-l-2 border-[#00FF00] pl-3 text-[11px] leading-relaxed"
                >
                  <p className="text-[#FF00FF] font-bold text-[10px] tracking-wider mb-0.5">{log.time}</p>
                  <p className="text-zinc-300">
                    <span className="text-[#00FF00] font-bold">{log.user}</span> {log.action}
                  </p>
                  {log.result && (
                    <p className="bg-[#FF00FF]/10 text-[#FF00FF] inline-block px-1 mt-0.5 border border-[#FF00FF]/30 text-[10px] font-bold">
                      {log.result}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-4 border-t border-[#FF00FF]/30">
            <div className="p-3.5 bg-[#FF00FF]/5 border border-[#FF00FF]/30 text-[10px] text-zinc-400 leading-relaxed italic relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-10px] text-6xl text-[#FF00FF]/10 select-none font-bold">"</div>
              “如果愛，埥罙愛； 洳淉ьUつ，埥lí閞。。莪們zんI是网吧dē過客，斜劉海遮zんU涐dē涙。”
              <p className="text-right mt-2 text-[#00FF00] not-italic">— 葬爱大长老 南宫傲</p>
            </div>
          </div>
        </div>

        {/* Middle Column - Metaphysical Altar Image Zone (6 cols) */}
        <div 
          id="shamate_main_altar" 
          className={`${
            stage === "done" ? "col-span-12 lg:col-span-6 lg:px-4" : "col-span-12 md:col-span-6"
          } p-4 md:p-6 lg:p-8 flex flex-col items-center relative bg-[radial-gradient(circle_at_center,_#121214_0%,_#000000_100%)] overflow-y-auto scrollbar-thin transition-all duration-300 ${
            stage === "done" ? "justify-start pt-6 pb-12" : "justify-center"
          }`}
        >
          
          {/* Scanline subtle static grid background */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #00FF00 1px, #00FF00 2px)", backgroundSize: "100% 4px" }}></div>

          <AnimatePresence mode="wait">
            
            {/* STAGE 1: IDLE / UPLOAD */}
            {stage === "idle" && (
              <motion.div 
                key="stage_idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm flex flex-col items-center"
              >
                {/* Title Badge */}
                <div className="text-center mb-6 md:mb-8 select-none">
                  <h1 className="text-4xl md:text-5xl font-black text-[#FF00FF] drop-shadow-[0_0_12px_#FF00FF] mb-1 tracking-wider glowing-magenta">
                    献祭凡身
                  </h1>
                  <p className="text-[10px] tracking-widest text-[#00FF00] font-bold uppercase">
                    RECONSTRUCTING CYBER SOULS SINCE 2006
                  </p>
                </div>

                {/* Main upload drop area */}
                <div className="w-full border-4 border-double border-[#00FF00] p-4 bg-zinc-950 shadow-[10px_10px_0px_#FF00FF] relative">
                  
                  {/* File Input */}
                  <input 
                    type="file" 
                    id="selfie_input"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden" 
                    onChange={handleFileChange}
                  />

                  {/* Drag drop drop zone action card */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed h-48 md:h-56 flex flex-col items-center justify-center bg-black cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? "border-[#FF00FF] bg-zinc-900 shadow-[0_0_15px_rgba(255,0,255,0.2)]" 
                        : "border-[#00FF00]/50 hover:border-[#00FF00] hover:bg-zinc-900"
                    }`}
                  >
                    {selectedImage ? (
                      <div className="relative w-full h-full p-2 flex items-center justify-center overflow-hidden">
                        <img 
                          src={selectedImage} 
                          alt="Uploaded mortal body" 
                          className="max-w-full max-h-full object-contain filter saturate-[1.5]"
                        />
                        <div className="absolute inset-0 bg-[#00FF00]/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-opacity-70 text-[11px] font-bold text-black font-mono">
                          点击重新上传照片
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center p-4 text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#00FF00]/50 flex items-center justify-center mb-3">
                          <Upload className="text-[#00FF00] animate-bounce" size={24} />
                        </div>
                        <p className="text-sm font-black text-[#00FF00]">
                          点击或拖拽照片献祭
                        </p>
                        <p className="text-[10px] opacity-60 mt-1 max-w-[240px]">
                          支持 JPG, PNG 等常用规格自拍照 
                        </p>
                        <p className="text-[9px] text-[#FF00FF] mt-2 font-black tracking-widest uppercase">
                          * 200MB HAIR VOLUME MAX *
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 text-[10px]">
                      <div className="flex-1 border border-[#FF00FF]/25 bg-zinc-950 p-3 rounded text-[#00FF00] text-[9.5px]">
                        <div className="font-black uppercase tracking-[0.25em] text-[#FF00FF] mb-1">生成模式切换</div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setRenderMode("local")}
                            className={`px-3 py-2 rounded border text-[10px] font-black uppercase transition ${renderMode === "local" ? "bg-[#00FF00] text-black border-[#00FF00]" : "border-zinc-800 text-zinc-400 hover:border-[#00FF00]"}`}
                          >
                            本地 Canvas 拼贴
                          </button>
                          <button
                            type="button"
                            onClick={() => setRenderMode("ai")}
                            className={`px-3 py-2 rounded border text-[10px] font-black uppercase transition ${renderMode === "ai" ? "bg-[#FF00FF] text-black border-[#FF00FF]" : "border-zinc-800 text-zinc-400 hover:border-[#FF00FF]"}`}
                          >
                            云端 AI API 模式
                          </button>
                        </div>
                      </div>

                      {renderMode === "ai" && (
                        <div className="flex-1 border border-[#FF00FF]/25 bg-black/70 p-3 rounded text-[9px] text-zinc-300">
                          <div className="font-black uppercase tracking-[0.25em] text-[#FF00FF] mb-1">AI 端口配置</div>
                          <div className="space-y-2">
                            <label className="block text-[9px] text-zinc-400">Base URL</label>
                            <input
                              type="text"
                              value={aiApiBaseUrl}
                              onChange={(e) => setAiApiBaseUrl(e.target.value)}
                              className="w-full bg-zinc-900 border border-[#00FF00]/20 text-[#00FF00] px-2 py-1 rounded text-[10px] outline-none focus:border-[#00FF00]"
                            />
                            <label className="block text-[9px] text-zinc-400">Model</label>
                            <input
                              type="text"
                              value={aiModel}
                              onChange={(e) => setAiModel(e.target.value)}
                              className="w-full bg-zinc-900 border border-[#FF00FF]/20 text-[#FF00FF] px-2 py-1 rounded text-[10px] outline-none focus:border-[#FF00FF]"
                            />
                            <p className="text-[8.5px] text-zinc-500 leading-snug">
                              当前 AI 模式会通过后端服务器发送图片与纯净提示词，文字排版由前端 Canvas 叠加。
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Button to trigger the ritual */}
                    {selectedImage && (
                      <button 
                        onClick={handleTriggerRitual}
                        className="w-full mt-0 bg-[#00FF00] text-black font-black py-3 uppercase tracking-widest text-xs shadow-[3px_3px_0px_#FF00FF] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none"
                      >
                        🔮 灵魂显现 激活宿命 🔮
                      </button>
                    )}
                  </div>
                </div>

                {/* Preset Selfies Picker */}
                <div className="w-full mt-6 bg-zinc-950 p-3.5 border border-[#FF00FF]/30">
                  <p className="text-[10px] uppercase font-bold text-[#FF00FF] tracking-wider mb-2 text-center">
                    -- 快捷凡俗躯壳（免上传测试） --
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {SAMPLE_SELFIES.map((cell, sidx) => (
                      <button
                        key={sidx}
                        onClick={() => handleSelectPreset(cell.url)}
                        className={`flex flex-col items-center bg-black p-1 border hover:border-[#00FF00] transition-colors ${
                          selectedImage === cell.url 
                            ? "border-[#00FF00] bg-zinc-900" 
                            : "border-[#FF00FF]/25"
                        }`}
                      >
                        <img 
                          src={cell.url} 
                          alt={cell.name}
                          className="w-full h-12 object-cover object-center filter grayscale" 
                        />
                        <span className="text-[9px] mt-1 text-zinc-400 capitalize whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                          {cell.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* STAGE 2: PROCESSING / LOADING */}
            {stage === "processing" && (
              <motion.div 
                key="stage_processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm flex flex-col items-center"
              >
                <div className="text-center mb-8 select-none">
                  <h1 className="text-4xl font-black text-[#00FF00] mb-2 tracking-widest animate-pulse">
                    法力加持中
                  </h1>
                  <p className="text-xs text-[#FF00FF] font-black uppercase tracking-widest">
                    SOUL RECONSTRUCTING IN PROGRESS
                  </p>
                </div>

                {/* Retromodern loading altar bar */}
                <div className="w-full border-4 border-double border-[#FF00FF] p-6 bg-zinc-950 shadow-[10px_10px_0px_#00FF00]">
                  <div className="space-y-4">
                    {/* Retro animated terminal readout */}
                    <div className="h-20 bg-black border border-[#FF00FF]/50 p-3.5 text-[10px] flex items-center justify-center font-mono select-none text-center">
                      <span className="text-[#00FF00] font-black blinking-text">
                        {processingLine}
                      </span>
                    </div>

                    {/* Loading status bar */}
                    <div className="space-y-2">
                      <div className="h-6 bg-zinc-900 border border-[#00FF00]/40 p-0.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF00FF] to-[#00FF00] transition-all duration-300"
                          style={{ width: `${processingProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-[#FF00FF]">Soul Resonance: {processingProgress}%</span>
                        <span className="text-[#00FF00] animate-pulse">Wait for Magic...</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-400">
                  <RefreshCw className="animate-spin text-[#FF00FF]" size={12} />
                  <span>512MB RAM Ritual Memory fully utilized.</span>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: DONE / COMPLETE */}
            {stage === "done" && destiny && (
              <motion.div 
                key="stage_done"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full max-w-6xl flex flex-col items-center"
              >
                
                {/* Header Back controls */}
                <div className="w-full flex justify-between items-center mb-4 select-none">
                  <button 
                    onClick={() => setStage("idle")}
                    className="flex items-center gap-1.5 text-xs text-[#00FF00] bg-black border border-[#00FF00]/40 px-2.5 py-1 select-none hover:border-[#00FF00] hover:bg-zinc-900 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={12} /> 返回尘道重新献祭
                  </button>
                  <span className="text-[10px] text-[#FF00FF] bg-[#FF00FF]/10 border border-[#FF00FF]/40 px-3.5 py-0.5 font-bold uppercase animate-pulse">
                    ● 灵魂重构道场·已觉醒
                  </span>
                </div>

                {/* Main destiny preview board with split side-by-side layout */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Sticky Photo sticker-booth + Name Plate + Action Buttons (width bounded to never scroll out) */}
                  <div className="col-span-12 lg:col-span-5 flex flex-col items-center gap-4 lg:sticky lg:top-4 bg-zinc-950/40 p-4 border border-[#FF00FF]/25 rounded select-none">
                    
                    {/* View Mode Switcher: Raw (Show uploaded face with stickers) vs AI (Show fully compiled Shamate) */}
                    <div className="flex bg-black border border-[#FF00FF]/40 p-1.5 rounded w-full justify-between items-center select-none shadow-[2px_2px_0px_rgba(255,0,255,0.15)]">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase pl-1.5">视觉相显 (Mode):</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setViewMode("raw")}
                          className={`text-[9px] px-2.5 py-1 font-black uppercase transition-all cursor-pointer rounded border ${
                            viewMode === "raw" 
                              ? "bg-[#FF00FF] text-black border-[#FF00FF] shadow-[0_0_5px_#FF00FF]" 
                              : "text-[#FF00FF] hover:bg-zinc-900 border-transparent"
                          }`}
                        >
                          📷 凡尘素颜 + sticker
                        </button>
                        <button
                          onClick={() => setViewMode("ai")}
                          className={`text-[9px] px-2.5 py-1 font-black uppercase transition-all cursor-pointer rounded border ${
                            viewMode === "ai" 
                              ? "bg-[#00FF00] text-black border-[#00FF00] shadow-[0_0_5px_#00FF00]" 
                              : "text-[#00FF00] hover:bg-zinc-900 border-transparent"
                          }`}
                        >
                          🔮 觉醒红尘法身 (Full AI)
                        </button>
                      </div>
                    </div>

                    {/* Composite layout container */}
                    <div 
                      id="shamate_photomask"
                      ref={photoContainerRef}
                      className="w-80 h-80 border-4 border-double border-[#FF00FF] bg-zinc-950 shadow-[10px_10px_0px_#00FF00] relative overflow-hidden flex items-center justify-center"
                      style={{ filter: "drop-shadow(0 0 10px rgba(0, 255, 0, 0.25))" }}
                    >
                      {/* Interactive Drag drop instructions overlay */}
                      <div className="absolute bottom-16 right-2 z-20 text-[7.5px] bg-black/80 text-[#00FF00] border border-[#00FF00]/40 px-1 select-none pointer-events-none uppercase">
                        ↕ 拖拽印记
                      </div>

                      {/* Photo base displaying custom filters */}
                      <img 
                        src={(viewMode === "ai" && destiny?.generatedImageUrl) ? destiny.generatedImageUrl : (selectedImage || SAMPLE_SELFIES[0].url)} 
                        alt="Reconstructed Soul" 
                        className="w-full h-full object-cover select-none pointer-events-none"
                        style={{ 
                          filter: viewMode === "ai" ? "none" : `saturate(${userSaturation}) hue-rotate(${userHueRotate}deg) contrast(1.1) brightness(1.03)` 
                        }}
                      />

                      {/* Scanlines layer */}
                      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-75 z-20"></div>

                      {/* CUSTOM STICKER OVERLAY CARD (Draggable on target coordinates) */}
                      <div 
                        onMouseDown={handleStickerMouseDown}
                        onTouchMove={handleStickerTouchMove}
                        onMouseMove={handleStickerDrag}
                        onMouseUp={handleStickerMouseUp}
                        className={`absolute select-none z-30 cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 ${
                          isDraggingSticker ? "border border-[#FF00FF]/40 bg-zinc-950/40 rounded" : ""
                        }`}
                        style={{ 
                          left: `${stickerX}%`, 
                          top: `${stickerY}%`,
                        }}
                      >
                        {/* Sticker types inside emoji font or custom text */}
                        <span 
                          className="pointer-events-none select-none drop-shadow-[0_0_12px_rgba(255,0,255,0.8)] filter transition-all scale-[1.1] font-semibold"
                          style={{ 
                            color: stickerColor,
                            fontSize: `${(stickerSize / 100) * 4.5}rem`,
                            textShadow: `0 0 10px ${stickerColor}`
                          }}
                        >
                          {activeSticker === "custom" ? (customStickerText || "葬愛") : (STICKER_EMOJI_MAP[activeSticker] || "💇")}
                        </span>
                      </div>

                      {/* Custom Stamp on photo */}
                      <div className="absolute top-2 left-2 z-10 text-[8px] bg-black/60 border border-[#00FF00]/40 px-1 py-0.5 text-[#00FF00] select-none font-bold uppercase tracking-wider font-mono">
                        SHAMATE CORP 2006
                      </div>

                      {/* Top Right Customizable Stamp */}
                      {customTopRight && (
                        <div className="absolute top-2 right-2 z-10 text-[8px] bg-black/75 border border-[#FF00FF]/40 px-1.5 py-0.5 text-[#FF00FF] font-black select-none uppercase tracking-wider font-mono text-shadow-glow">
                          ★ {customTopRight} ★
                        </div>
                      )}

                      {/* Brand-new high-fidelity neon large-text overlays */}
                      {showTextOverlay && (
                        <>
                          {/* Top center big title */}
                          {customTitle && (
                            <div className="absolute top-10 left-0 right-0 text-center select-none z-35 px-1.5 pointer-events-none">
                              <span className="text-[14px] font-black tracking-widest text-[#FF00FF] drop-shadow-[0_0_5px_#FF00FF] uppercase filter saturate-[2] font-semibold">
                                {customTitle}
                              </span>
                            </div>
                          )}

                          {/* Left bottom huge adage */}
                          {customLeft && (
                            <div className="absolute bottom-12 left-3 max-w-[48%] text-left select-none z-35 pointer-events-none leading-tight">
                              <span className="text-[9px] font-black text-[#00FF00] drop-shadow-[0_0_4px_#00FF00] tracking-tight block filter saturate-[1.8] font-semibold">
                                {customLeft}
                              </span>
                            </div>
                          )}

                          {/* Right bottom huge advice */}
                          {customRight && (
                            <div className="absolute bottom-12 right-3 max-w-[45%] text-right select-none z-35 pointer-events-none leading-tight">
                              <span className="text-[9px] font-black text-[#FF00FF] drop-shadow-[0_0_4px_#FF00FF] tracking-tight block filter saturate-[1.8] font-semibold">
                                {customRight}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {/* Nickname and resonance bottom badge overlay */}
                      <div className="absolute bottom-2 left-2 right-2 bg-black/85 z-10 p-1 border border-[#00FF00]/30 flex flex-col items-center">
                        <span className="text-[10px] text-[#FF00FF] font-black">{destiny.nickname}</span>
                        <span className="text-[8px] text-[#00FF00] font-mono leading-none tracking-widest scale-[0.9]">
                          【{destiny.soulAttribute}】
                        </span>
                      </div>
                    </div>

                    {/* Quick Core Action buttons, immediately visible next to image container */}
                    <div className="w-full space-y-2 mt-1">
                      {/* Save Sticker button */}
                      <button 
                        onClick={handleDownloadResult}
                        className="w-full bg-[#FF00FF] text-black font-black py-3 uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow-[4px_4px_0px_#00FF00] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer rounded"
                      >
                        <Download size={14} /> 保存灵魂大头贴 (Save Picture)
                      </button>

                      {/* Re-generate/Re-roll options */}
                      <button 
                        onClick={handleTriggerRitual}
                        className="w-full bg-[#00FF00] text-black font-black py-2.5 uppercase tracking-widest text-xs flex items-center justify-center gap-1.5 shadow-[4px_4px_0px_#FF00FF] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer border-2 border-black rounded"
                      >
                        <RefreshCw size={14} /> 🔮 继续以此图生成新运势 (Re-Gen Destiny)
                      </button>

                      <button 
                        onClick={() => setStage("idle")}
                        className="w-full bg-zinc-950 text-[#00FF00] border border-[#00FF00]/40 font-black py-2 uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 hover:bg-zinc-900 transition-all cursor-pointer rounded"
                      >
                        📸 换张照片重新重构 (Choose New Photo)
                      </button>
                    </div>

                    {/* E-Nickname & Soul Attributes Plate */}
                    <div className="w-full mt-1 bg-zinc-950 border-2 border-double border-[#00FF00] p-3 text-center shadow-[4px_4px_0px_#FF00FF]">
                      <p className="text-[#FF00FF] text-[9px] uppercase font-bold tracking-widest mb-1">
                        法号·非主流命签 (E-Nickname)
                      </p>
                      <p className="text-lg font-bold tracking-wider glowing-magenta text-[#FF00FF]">
                        {destiny.nickname}
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 text-[9px] mt-2 select-none">
                        <div className="bg-zinc-900/60 border border-[#00FF00]/30 py-1.5 px-2">
                          <span className="text-zinc-500 block text-[8px]">魂魄属性 (Soul Class)</span>
                          <span className="text-[#00FF00] font-bold block mt-0.5 truncate">{destiny.soulAttribute}</span>
                        </div>
                        <div className="bg-zinc-900/60 border border-[#FF00FF]/30 py-1.5 px-2">
                          <span className="text-zinc-500 block text-[8px]">幸运染发色 (Hair Hue)</span>
                          <span className="text-[#FF00FF] font-bold block mt-0.5 truncate" style={{ color: stickerColor }}>
                            {destiny.colorName || "至尊炫彩"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Scrollable Customizer Panel list & Forge temple choices */}
                  <div className="col-span-12 lg:col-span-7 flex flex-col gap-5 overflow-y-auto max-h-[820px] lg:max-h-[740px] pr-2 scrollbar-thin">
                    
                    {/* Panel 1: Image Adjustment & Stickers Control Pad */}
                    <div className="bg-zinc-950 border border-[#00FF00]/30 p-4 flex flex-col gap-2 shadow-[4px_4px_0px_rgba(255,0,255,0.2)]">
                      <div className="flex items-center gap-1 text-[11px] font-black text-[#FF00FF] border-b border-[#00FF00]/20 pb-1.5 mb-1.5">
                        <Sliders size={12} /> 
                        <span>重构外物与视觉校准 (Calibration & Stickers)</span>
                      </div>

                      {/* Adjustment sliders */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">
                        {/* Saturation Slider */}
                        <div className="flex flex-col gap-1 text-[9px] select-none">
                          <span className="text-zinc-400">色彩饱和 (Saturation):</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="range"
                              min="1.0"
                              max="5.0"
                              step="0.1"
                              value={userSaturation}
                              onChange={(e) => setUserSaturation(parseFloat(e.target.value))}
                              className="flex-1 h-1 bg-zinc-800 rounded outline-none accent-[#FF00FF]"
                            />
                            <span className="font-bold text-[#00FF00] shrink-0">{(userSaturation * 100).toFixed(0)}%</span>
                          </div>
                        </div>

                        {/* Hue Rotation Slider */}
                        <div className="flex flex-col gap-1 text-[9px] select-none">
                          <span className="text-zinc-400">心境色调 (Hue Rotate):</span>
                          <div className="flex items-center gap-2">
                            <input 
                              type="range"
                              min="0"
                              max="360"
                              step="5"
                              value={userHueRotate}
                              onChange={(e) => setUserHueRotate(parseInt(e.target.value))}
                              className="flex-1 h-1 bg-zinc-800 rounded outline-none accent-[#00FF00]"
                            />
                            <span className="font-bold text-[#FF00FF] shrink-0">{userHueRotate}°</span>
                          </div>
                        </div>
                      </div>

                      {/* Sticker Selection Grid */}
                      <div className="flex flex-col gap-1.5 mt-1 text-[9px]">
                        <div className="flex items-center justify-between border-t border-[#00FF00]/10 pt-2 pb-1">
                          <span className="text-zinc-400 font-bold">请选印记 (Select Decal):</span>
                          <span className="text-[10px] font-bold text-[#FF00FF]">
                            {activeSticker === "custom" ? "自定义文字印" : `已选: ${STICKER_EMOJI_MAP[activeSticker]}`}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1">
                          {(Object.keys(STICKER_EMOJI_MAP) as StickerType[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setActiveSticker(st);
                                if (st !== "custom" && STICKER_EMOJI_MAP[st]) {
                                  // Assign default sticker color hints if needed
                                }
                              }}
                              className={`py-1 text-center border text-[13px] transition-all relative cursor-pointer flex items-center justify-center rounded ${
                                activeSticker === st 
                                  ? "border-[#00FF00] text-[#00FF00] bg-zinc-900 shadow-[0_0_5px_#00FF00]" 
                                  : "border-zinc-800 text-zinc-400 bg-black hover:border-zinc-700"
                              }`}
                              title={st}
                            >
                              {st === "custom" ? "✍️" : STICKER_EMOJI_MAP[st]}
                            </button>
                          ))}
                        </div>

                        {/* Custom text sticker editor, visible when "custom" is selected */}
                        {activeSticker === "custom" && (
                          <div className="bg-black/50 border border-[#00FF00]/30 p-2.5 rounded flex flex-col gap-2 mt-1.5 animate-fadeIn select-none">
                            <span className="text-[8px] text-[#00FF00]/85">✎ 极寒冰霜火星字 / 痛心自造刻印 (Custom Sticker Text):</span>
                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                maxLength={10}
                                value={customStickerText}
                                onChange={(e) => setCustomStickerText(e.target.value)}
                                placeholder="输入贴纸文字..."
                                className="flex-1 bg-black border border-[#FF00FF]/40 text-[#FF00FF] px-2 py-1 text-[10px] outline-none focus:border-[#FF00FF] font-mono rounded"
                              />
                            </div>
                            {/* Preset Buttons for easy 1-click text stickers */}
                            <div className="flex flex-wrap gap-1 mt-1 border-t border-[#00FF00]/10 pt-1.5 pb-0.5">
                              {["葬愛", "冷少", "淚", "傷", "宿命", "莣情", "孤獨", "緄", "涐の愛"].map((word) => (
                                <button
                                  key={word}
                                  type="button"
                                  onClick={() => setCustomStickerText(word)}
                                  className="text-[8.5px] px-2 py-0.5 bg-zinc-900 border border-[#FF00FF]/25 text-zinc-300 hover:text-[#FF00FF] hover:border-[#FF00FF] hover:bg-black rounded transition-all cursor-pointer font-bold"
                                >
                                  {word}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sticker Size & Color settings combined */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5 border-t border-[#00FF00]/10 pt-2">
                          <div className="flex flex-col gap-1 text-[9px]">
                            <span className="text-zinc-400">印记大小 (Decal Size):</span>
                            <div className="flex items-center gap-2">
                              <input 
                                type="range"
                                min="40"
                                max="250"
                                step="5"
                                value={stickerSize}
                                onChange={(e) => setStickerSize(parseInt(e.target.value))}
                                className="flex-1 h-1 bg-zinc-800 rounded outline-none accent-[#FF00FF]"
                              />
                              <span className="font-bold text-[#00FF00] shrink-0">{stickerSize}%</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 text-[9px]">
                            <span className="text-zinc-400">印记色彩 (Decal Color):</span>
                            <div className="flex items-center gap-2 py-0.5">
                              <input 
                                type="color" 
                                value={stickerColor} 
                                onChange={(e) => setStickerColor(e.target.value)}
                                className="w-9 h-4 bg-transparent border border-zinc-700 rounded cursor-pointer p-0"
                              />
                              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">{stickerColor}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Panel 2: Neon Text Customizer Input Fields (Words Customizer) */}
                    <div className="bg-zinc-950 border border-[#FF00FF]/30 p-4 flex flex-col gap-2.5 shadow-[4px_4px_0px_rgba(0,255,0,0.2)]">
                      <div className="flex items-center justify-between border-b border-[#00FF00]/20 pb-2 mb-1 select-none">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#00FF00]">
                          <Zap size={11} className="text-[#00FF00]" />
                          <span>大字命理刻字板 (Words Customizer)</span>
                        </div>
                        <button
                          onClick={() => setShowTextOverlay(!showTextOverlay)}
                          className={`text-[9px] px-2 py-0.5 border font-bold transition-all cursor-pointer ${
                            showTextOverlay 
                              ? "border-[#FF00FF] text-[#FF00FF] bg-[#FF00FF]/5" 
                              : "border-zinc-800 text-zinc-500 bg-black"
                          }`}
                        >
                          {showTextOverlay ? "[ 开启文本覆层 ]" : "[ 隐藏文本覆层 ]"}
                        </button>
                      </div>

                      {showTextOverlay ? (
                        <div className="space-y-3 text-[10px]">
                          {/* 1. Custom Title */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-zinc-400">仙风顶部大标题 (Top Center Neon Heading):</label>
                              <div className="flex gap-1">
                                {["★宿命·星痕★", "★命輪·流轉★", "★星軌·羈絆★", "★因果·輪迴★"].map((t) => (
                                  <button 
                                    key={t}
                                    type="button"
                                    onClick={() => setCustomTitle(t)}
                                    className="text-[8px] bg-zinc-900 hover:bg-black px-1 border border-zinc-800 hover:border-[#FF00FF] text-zinc-300 rounded cursor-pointer"
                                  >
                                    {t.replace(/★/g, "")}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <input
                              type="text"
                              value={customTitle}
                              onChange={(e) => setCustomTitle(e.target.value)}
                              className="w-full bg-black border border-[#FF00FF]/30 text-[#FF00FF] p-1.5 rounded text-[10px] font-mono outline-none focus:border-[#FF00FF]"
                            />
                          </div>

                          {/* 2. Custom Top Right Stamp */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-zinc-400">右上角命理大头贴名字 (Top Right Neon Stamp Name):</label>
                              <div className="flex gap-1">
                                {["杀马特大头贴", "葬爱首席之约", "流年祭祀印记"].map((st) => (
                                  <button 
                                    key={st}
                                    type="button"
                                    onClick={() => setCustomTopRight(st)}
                                    className="text-[8px] bg-zinc-900 hover:bg-black px-1 border border-zinc-800 hover:border-[#FF00FF] text-zinc-300 rounded cursor-pointer"
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <input
                              type="text"
                              maxLength={12}
                              value={customTopRight}
                              onChange={(e) => setCustomTopRight(e.target.value)}
                              className="w-full bg-black border border-[#FF00FF]/30 text-[#FF00FF] p-1.5 rounded text-[10px] font-mono outline-none focus:border-[#FF00FF]"
                            />
                          </div>

                          {/* 3. Custom Left Adage */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-zinc-400">左下角大字批语 (Bottom Left Neon Destiny Adage):</label>
                              <button 
                                type="button"
                                onClick={() => setCustomLeft("手掌微星刻畫命格之劫 髮色如虹預示流年羈絆")}
                                className="text-[8px] bg-zinc-900 hover:bg-black px-1.5 border border-zinc-800 hover:border-[#00FF00] text-zinc-300 rounded cursor-pointer"
                              >
                                填入预设神符 A
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={customLeft}
                              onChange={(e) => setCustomLeft(e.target.value)}
                              className="w-full bg-black border border-[#00FF00]/30 text-[#00FF00] p-1.5 rounded text-[10px] font-mono outline-none focus:border-[#00FF00] resize-none"
                            />
                          </div>

                          {/* 4. Custom Right Advice */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-zinc-400">右下角大字开运建议 (Bottom Right Advice Text):</label>
                              <button 
                                type="button"
                                onClick={() => setCustomRight("流淚的眼線會化 唯有星光能照亮你的心")}
                                className="text-[8px] bg-zinc-900 hover:bg-black px-1.5 border border-zinc-800 hover:border-[#FF00FF] text-zinc-300 rounded cursor-pointer"
                              >
                                填入预设神符 B
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={customRight}
                              onChange={(e) => setCustomRight(e.target.value)}
                              className="w-full bg-black border border-[#FF00FF]/30 text-[#FF00FF] p-1.5 rounded text-[10px] font-mono outline-none focus:border-[#FF00FF] resize-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-zinc-500 py-4 text-center select-none">
                          水镜刻印已被掩饰，大头贴框内文字将不会在画布和导出的自拍照中显露。
                        </p>
                      )}
                    </div>

                    {/* Panel 3: AI Prompt Forge Console Box (Generates multiple prompt choices) */}
                    <div className="bg-zinc-950 border-2 border-double border-[#FF00FF] p-4 shadow-[6px_6px_0px_#00FF00]">
                      <div className="flex flex-col border-b border-[#FF00FF]/30 pb-3 mb-3 gap-2">
                        <h3 className="text-[#FF00FF] text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 select-none">
                          <Sparkles size={12} className="text-[#00FF00]" />
                          <span>生图提示词神符重构坊 (Cyber AI Prompt Forge Choices)</span>
                        </h3>
                        <p className="text-[9.5px] text-zinc-400 select-none">
                          请轻触法印以挑选各类神异面容视觉风格（点击切换以在下方合成特制Prompt）：
                        </p>
                        
                        {/* Tab Selector Buttons for the 6 Distinct presets */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-1.5 mt-1">
                          {getPromptStyles(customTitle, customLeft, customRight, destiny?.colorName).map((style) => (
                            <button
                              key={style.id}
                              onClick={() => {
                                setActivePromptTab(style.id);
                              }}
                              className={`text-[9.5px] px-2.5 py-1.5 font-bold transition-all rounded border text-left cursor-pointer flex flex-col justify-between ${
                                activePromptTab === style.id 
                                  ? "bg-[#00FF00] border-[#00FF00] text-black shadow-[0_0_8px_rgba(0,255,0,0.35)]" 
                                  : "text-zinc-300 border-zinc-800 bg-black hover:border-zinc-700 hover:text-white"
                              }`}
                            >
                              <span className="font-extrabold truncate">{style.name}</span>
                              <span className={`text-[7px] max-w-full font-normal leading-tight truncate mt-0.5 ${
                                activePromptTab === style.id ? "text-black/75" : "text-zinc-500"
                              }`}>
                                {style.tagline}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Prompt Display area */}
                      <div className="relative">
                        <textarea
                          readOnly
                          rows={6}
                          className="w-full bg-black border border-[#00FF00]/30 rounded p-2.5 text-[10.5px] text-zinc-300 font-mono leading-relaxed focus:border-[#00FF00] focus:ring-0 resize-none outline-none select-all scrollbar-thin"
                          value={
                            getPromptStyles(customTitle, customLeft, customRight, destiny?.colorName).find(p => p.id === activePromptTab)?.prompt || "正在凝聚狂傲法印..."
                          }
                        />
                        <div className="absolute bottom-2.5 right-2.5 flex items-center">
                          <button
                            onClick={handleCopyPrompt}
                            className="bg-[#00FF00] hover:bg-[#00FF00]/85 text-black text-[9px] font-black px-3 py-1.5 uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0px_#FF00FF] active:shadow-none transition-all cursor-pointer rounded"
                          >
                            {copiedPrompt ? "已复制 ✔" : "一键复制 Prompt"}
                          </button>
                        </div>
                      </div>

                      {/* Display Selected style features info box */}
                      <div className="mt-3 p-2.5 bg-black border border-zinc-800 rounded text-[9px] leading-relaxed select-none">
                        <span className="text-[#FF00FF] font-black uppercase tracking-wider block mb-0.5">风格特征评解：</span>
                        <p className="text-zinc-400">
                          {getPromptStyles(customTitle, customLeft, customRight, destiny?.colorName).find(p => p.id === activePromptTab)?.description}
                        </p>
                      </div>
                    </div>

                    {/* Panel 4: Metaphysics Reads & Prophecies */}
                    <div className="bg-zinc-950 border border-[#FF00FF]/45 p-4 flex flex-col gap-3 shadow-[4px_4px_0px_rgba(0,10,0,0.5)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-[#00FF00] border-b border-zinc-800 pb-1.5 mb-1 select-none">
                        <Terminal size={11} />
                        <span>大长老玄学评注与本相大势 (Prophetic Destiny Matrix)</span>
                      </div>

                      <div className="space-y-3 pr-1">
                        {/* Hairstyle height destiny */}
                        <div className="bg-black/50 border border-[#00FF00]/25 p-3 text-[10.5px] leading-relaxed rounded">
                          <span className="text-[#00FF00] font-bold">【重构·发发高度宿命】</span>
                          <p className="text-zinc-300 mt-1">{destiny.hairHeightFortune}</p>
                        </div>

                        {/* Destiny text Analysis */}
                        <div className="bg-black/50 border border-[#FF00FF]/25 p-3 text-[10.5px] leading-relaxed rounded">
                          <span className="text-[#FF00FF] font-bold">【重构·命理大执政词】</span>
                          <p className="text-zinc-300 mt-1 font-sans">{destiny.destinyAnalysis}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* API Key missing notice/warning panel */}
                {showApiKeyWarning && (
                  <div className="w-full mt-5 p-3 bg-zinc-950 border border-amber-600 rounded text-[10px] text-zinc-300 leading-relaxed flex items-start gap-2 select-none">
                    <ShieldAlert className="text-amber-500 flex-shrink-0 mt-0.5 animate-bounce" size={14} />
                    <div>
                      <span className="text-amber-500 font-bold">玄镜微瑕提示:</span> 
                      &nbsp;由于未检测到全局加密密钥（GEMINI_API_KEY），灵魂重构仪式已通过道场预留的「葬爱备用玄学芯片（即席Fallback数据和高逼真本地演算法）」为您全自动完成。
                      你可以随时前往 <span className="text-[#FF00FF] font-bold">Settings &gt; Secrets</span> 填入自己的 `GEMINI_API_KEY` 来触发真实的 Gemini LLM 重构！
                    </div>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* Right Column - The Council Board & Join Clan */}
        <div id="shamate_right_panel" className={`${stage === "done" ? "hidden lg:flex" : "hidden md:flex"} col-span-12 lg:col-span-3 pb-6 md:pb-0 border-l border-[#FF00FF]/30 p-4 xl:p-6 flex flex-col justify-between overflow-y-auto bg-zinc-950/80`}>
          
          {/* Council Area */}
          <div>
            <h3 className="text-[#FF00FF] text-xs font-black uppercase tracking-widest border-b border-[#FF00FF]/30 pb-2 mb-4 flex items-center gap-2">
              <Terminal size={12} />
              葬爱議會 / The Council
            </h3>

            <div className="space-y-4">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#00FF00] bg-zinc-900 flex items-center justify-center text-lg select-none">
                  👑
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    长老·南宫傲
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] inline-block animate-ping"></span>
                  </p>
                  <p className="text-[9px] text-[#00FF00]/70 uppercase font-mono tracking-widest">
                    Ritual Master
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FF00FF] bg-zinc-900 flex items-center justify-center text-lg select-none">
                  💇
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    护法·杀阡陌
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] inline-block"></span>
                  </p>
                  <p className="text-[9px] text-[#FF00FF]/70 uppercase font-mono tracking-widest">
                    Hair Stylist
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-45 select-none">
                <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-lg">
                  ☠️
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400">
                    堂主·幽冥魂
                  </p>
                  <p className="text-[9px] text-zinc-500 uppercase font-mono">
                    Offline (网卡欠费)
                  </p>
                </div>
              </div>

              {/* Dynamic User Member State display */}
              {destiny && (
                <div className="flex items-center gap-3 border border-[#00FF00]/40 p-2 bg-[#00FF00]/5 animate-pulse">
                  <div className="w-10 h-10 rounded-full border border-[#00FF00] bg-zinc-900 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-black text-white capitalize overflow-hidden text-ellipsis max-w-[120px]">
                      {destiny.nickname}
                    </p>
                    <p className="text-[9px] text-[#00FF00] uppercase font-bold">
                      葬爱首席新贵 (Elite)
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Join Clan Form Block */}
          <div className="mt-8 border-t border-[#FF00FF]/30 pt-4">
            <h4 className="text-[#00FF00] text-[10.5px] uppercase font-bold tracking-widest mb-3 flex items-center gap-1.5 select-none">
              <UserPlus size={11} />
              加入家族 / Register Clan
            </h4>

            {clanFormSuccess ? (
              <div className="p-3 bg-zinc-900 border border-[#00FF00] rounded text-[10px] text-zinc-300 leading-relaxed">
                <span className="text-[#00FF00] font-bold block mb-1">【重组秘印落成】</span>
                {clanFormSuccess}
              </div>
            ) : (
              <form onSubmit={handleJoinClan} className="space-y-3">
                <div>
                  <label className="block text-[9px] uppercase text-zinc-500 mb-1 select-none">
                    非主流法号 (Shamate Nickname)
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. ゞ伤杺尐少"
                    value={clanFormName}
                    onChange={(e) => setClanFormName(e.target.value)}
                    className="w-full bg-black border border-[#FF00FF]/40 text-[#FF00FF] placeholder:text-[#FF00FF]/25 p-2 rounded text-[11px] font-mono outline-none focus:border-[#FF00FF] focus:ring-1 focus:ring-[#FF00FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase text-zinc-500 mb-1 select-none">
                    赛博脑电邮箱 (Soul Mailbox)
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. lingshao@qq.com"
                    value={clanFormEmail}
                    onChange={(e) => setClanFormEmail(e.target.value)}
                    className="w-full bg-black border border-[#00FF00]/40 text-[#00FF00] placeholder:text-[#00FF00]/25 p-2 rounded text-[11px] font-mono outline-none focus:border-[#00FF00] focus:ring-1 focus:ring-[#00FF00]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#00FF00] text-black font-black py-2.5 uppercase tracking-widest text-[10px] shadow-[3px_3px_0px_#FF00FF] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  誓死追随葬爱家族 (Join)
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      {/* 4. Footer Bar */}
      <footer id="shamate_footer" className="h-10 bg-black border-t-2 border-[#FF00FF] flex items-center px-4 justify-between text-[9px] font-bold select-none z-20">
        <div className="flex gap-4 uppercase text-[#00FF00] overflow-x-auto truncate">
          <span className="text-[#FF00FF] shrink-0 font-black">[STATUS: READY]</span>
          <span className="shrink-0 font-mono hidden sm:inline">[BUFFER: 0x00FF2A]</span>
          <span className="shrink-0 font-mono hidden sm:inline">[ENCRYPTION: SHAMATE-AES]</span>
        </div>
        <div className="text-zinc-500 uppercase font-extrabold shrink-0 pl-2">
          COPYRIGHT © 2006 LOVE BURIAL WORLDWIDES LTD.
        </div>
      </footer>

    </div>
  );
}
