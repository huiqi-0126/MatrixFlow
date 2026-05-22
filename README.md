<div align="center">
  <img width="1200" height="475" alt="MCN FARM PRO Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
</div>

# 🌐 MatrixFlow (MCN FARM PRO)

> 一站式海外自媒体（TikTok, Instagram, YouTube）账号模拟培育、深度人设管理、智能排班发布与爆款数据同步系统。

### 🌟 核心价值与能力
本系统围绕 **Google Gemini 大模型** 强大的多模态推理能力，提供：
* 📱 **独立住宅IP设备矩阵**：每台设备绑定专属网络及拟真地理位置，模拟Idle/Warmup/Posting状态。
* 🧠 **深度多模态人设定制**：结合海外不同族群、兴趣、价值观，定制高仿真海外用户画像。
* 💬 <b>社交互动养号智能体 (Warmup Agent)</b>：7天仿真养号动作链，完全模拟人类刷屏、点赞、评论行为，大幅降低封号率。
* 📊 **多模态视频克隆**：只需提供热门视频链接，AI 自动进行文案拆解、脚本重构与二创建议。
* 📤 **排期发布与故障记录**：支持长达月的排班发帖计划，自带高保真住宅代理异常重试与日志审计。

---

## 📘 快速导航
* 🚀 **[深度项目描述与架构分析](PROJECT_DESCRIPTION.md)** — 点击查看系统详尽的功能模块、数据流向设计与技术栈。
* ⚙️ **[AI Studio 运行视图](https://ai.studio/apps/0a63489c-91d1-4d70-9759-4ed2c7495eb8)** — 访问官方 AI Studio 部署版本。

---

## 🟢 本地开发运行 (Quick Start)

### **必要前提:** Node.js (推荐 v18+)

1. **克隆并安装依赖:**
   ```bash
   npm install
   ```

2. **环境变量配置:**
   将 `.env.example` 复制为 `.env.local` 并在其中填入您的 Gemini API Key：
   ```bash
   # 在 .env.local 中设置密钥
   GEMINI_API_KEY=你的_gemini_api_key_在此
   ```

3. **运行开发服务器:**
   ```bash
   npm run dev
   ```
   *本地服务默认启动于：`http://localhost:3000`*

4. **进行生产打包:**
   ```bash
   npm run build
   ```

