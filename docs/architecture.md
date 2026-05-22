# 双模（Hybrid）系统文档

## 概述
本项目已重构为双模混合系统：

- `本地 Canvas 拼贴模式`：前端在用户照片基础上本地生成大头贴合成图，包含霓虹背景、贴纸、超大中文文字覆盖。
- `云端 AI API 模式`：将用户照片发送到后端 `/api/reconstruct`，调用 Gemini AI 编辑图像，再由前端在结果上叠加命理大字与贴纸。
- `本地文字渲染`：无论 AI 模式还是本地模式，最终大字命理文本都由前端 Canvas 生成，保证文字位置和效果一致。

## 关键文件

- `src/App.tsx`
  - 管理 UI、模式切换、图像上传、贴纸编辑、文本自定义、下载功能。
  - `renderMode` 定义当前模式：`local` 或 `ai`。
  - `generateLocalShamateDestiny()` 负责本地 Canvas 渲染并生成本地命理结果。
  - `handleTriggerRitual()` 负责提交流，AI 模式调用后端接口，本地模式直接生成合成图。

- `server.ts`
  - 提供 `GET /api/health` 与 `POST /api/reconstruct`。
  - 使用 `@google/genai` 的 `GoogleGenAI.models.editImage()` 进行 AI 图像编辑。
  - 当没有 API Key 时返回本地 fallback 数据，保证体验不中断。

- `src/data/fortuneData.json`
  - 本地命理文本数据库，含 `titles`、`fortunes`、`advices`。
  - 用于未来扩展、随机命理文本生成或本地 fallback 文案。

## 本地模式工作流

1. 用户上传照片或选择样例图片。
2. 选择 `本地 Canvas 拼贴` 模式。
3. 前端使用 `createCompositeDataUrl()`：
   - 绘制霓虹背景
   - 渲染用户照片
   - 绘制贴纸 emoji / 自定义文本贴纸
   - 绘制顶部大标题与左右说明文字
4. 生成结果图后可直接下载。

## AI 模式工作流

1. 用户选择 `云端 AI API 模式`。
2. 输入 API Base URL 与模型名称。
3. 点击触发后，前端将照片 Base64 与 prompt 发送到 `POST /api/reconstruct`。
4. 后端尝试调用 Gemini 编辑图像：
   - `model`: AI 模型
   - `prompt`: 参考生成大头贴的命理命令词
   - `referenceImages`: 原始照片
5. 服务器返回生成图与命理结果；前端继续叠加文字与贴纸。

## 环境变量

- `GEMINI_API_KEY` 或 `GOOGLE_API_KEY`
- `VITE_AI_API_BASE_URL`（默认 `/api/reconstruct`）
- `VITE_AI_MODEL`（默认 `imagen-4.0-generate-001`）

## 运行与构建

```bash
npm install
npm run dev
```

打包生产：

```bash
npm run build
npm start
```

## 注意

- 生产构建已将后端输出改为 `ESM`，避免 `import.meta.url` 与 CJS 输出冲突。
- 本地模式可完全脱离外部 AI，实现快速本地合成与下载。
- `src/data/fortuneData.json` 已生成并可直接用于本地命理文案扩展。 
