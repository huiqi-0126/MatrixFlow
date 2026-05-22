# 🌐 MatrixFlow (MCN FARM PRO) - 海外自媒体账号培育与发布系统

MatrixFlow（在系统中以 **MCN FARM PRO** 运营）是一套针对海外主流自媒体平台（如 TikTok、Instagram、YouTube）设计的一站式账号模拟培育、多模态人设管理、智能排班发帖以及商业化数据分析平台。

该系统通过模拟每台移动设备独立的网络代理（ residential proxy ）、制定专属的用户画像（ Persona ），并利用以 **Gemini 大模型（Google GenAI）** 为核心的智能体（Agents）进行多模态内容审计、自动克隆复刻、以及拟人化社交互动（养号），为跨境电商、外贸出海、海外品牌推广提供矩阵化私域流量沉淀与转化方案。

---

## 🚀 核心架构与功能模块

系统采用现代前端 Bento Grid（便当盒）式的分块响应式布局，整合了以下五大核心智能体模块及管理中心：

```mermaid
graph TD
    A[MCN FARM PRO 控制台] --> B[🧠 基本信息与人设中心]
    A --> C[💬 社交互动智能体 (养号)]
    A --> D[🔍 数据采集智能体 (挖爆款)]
    A --> E[📊 素材生成与克隆中心]
    A --> F[📤 内容排期发布管理]
    
    B --> B1[网络设备管理 - 独享静态/住宅IP]
    B --> B2[深度人设定制 - 种族/性格/ tone]
    
    C --> C1[7天自动化养号脚本]
    C --> C2[拟人动作流 - 完播/点赞/滑评/回评]
    
    D --> D1[竞品热度追踪与爆款采集]
    D --> D2[账号流量来源及粉丝画像]
    
    E --> E1[视频素材库 & 多维属性]
    E --> E2[AI 多模态视频克隆与文案重写]
    
    F --> F1[月度内容规划蓝图]
    F --> F2[定时发布调度器 & proxy 异常重试]
```

### 1. 🧠 基本信息与人设中心 (`PersonaManager.tsx`)
*   **多维度人设刻画**：每个设备绑定独立的拟真海外用户（Persona），包括头像、兴趣标签、种族倾向（如 Caucasian、Latina、African-American）、性别、价值观、垂直利基（Niche）领域、Bio（签名）和专属沟通基调（Tone）。
*   **网络驻留仿真**：每台设备绑定专属的区域代理 IP（如 `US-NY-Residential` 住宅代理、`UK-LDN-Residential` 伦敦代理等），支持“全部/活跃/休眠/异常（被封禁）”四种账号状态管理。
*   **设备模拟器 (`DeviceSimulator.tsx`)**：可视化仿真 iPhone 设备界面，运行短视频界面预览并追踪账号活跃度。

### 2. 💬 社交互动智能体 (`WarmupPlanner.tsx`)
*   **7天自动化养号计划**：针对新注册或休眠账号提供阶梯式“养号”调度。
*   **拟人动作流仿真**：模拟自然人在海外短视频 App 的交互行为，包含搜索特定关键词、For You Page 推荐流滑屏、双击点赞、访问对标博主主页、收藏热门视频、分享视频链接至剪贴板等。
*   **执行日志与终端监控**：实时渲染虚拟控制台运行日志（如 `INFO - HTTP`、`LLM 调用`、`页面渲染`），并支持加载设备执行截图，高度还原沙盒跑测状态。

### 3. 🔍 数据采集智能体 (`DataCollector.tsx`)
*   **爆款视频挖掘**：实时监测竞品账号和垂直利基，追踪千级至百万级播放量的视频趋势。
*   **关键词热度分析**：通过云标签挖掘海外当季热点词汇。
*   **流量来源追踪**：展示各账号精准的数据流量配比（如 For You Page 推荐、标签搜索、个人主页访问、粉丝订阅比重）。

### 4. 📊 素材生成与管理 (`AssetManager.tsx`)
*   **多维视频素材库**：结构化管理视频素材，包含持续时间、分辨率、视频格式、AI 生成的分步脚本（Script）和定制标签。
*   **多模态视频克隆**：利用 Google Gemini 大模型，只需输入外部热门视频 URL 链接，系统即可自动对视频进行**多模态结构化解构、文案克隆、多语种本土化重构**，快速产出符合该账号人设的高质量重拍脚本。

### 5. 📤 内容排期发布管理 (`PublisherScheduler.tsx`)
*   **内容规划蓝图 (`ContentPlanner.tsx`)**：为各垂类（如美食 ASMR、健身活力、街头穿搭、数码科技、奢华生活）定制长达一月的每日选题策划、创作方向、脚本 Prompt 以及推荐 Hashtags。
*   **高仿真发布调度器**：支持将素材库的视频一键排班发布，支持编辑个性化文案，自动分析视频内容。在“发布中”、“发布成功”及“网络超时异常”等状态之间自动切换，并保留完整的网络代理失败错误日志（如 `residential proxy handshakes exceeded 15s limit`）。

---

## 🛠️ 技术栈与依赖库

项目基于现代化的前端工程流及高性能依赖构建：

*   **前端核心框架**：`React 19.0.1` + `TypeScript` + `Vite 6.2.3`
*   **CSS 设计系统**：`TailwindCSS v4.1.14`（极速 JIT 编译，完美的暗黑质感与流畅布局）
*   **动画与动效**：`Motion 12.23.24`（实现 Bento 网格及各组件间丝滑微交互）
*   **图标库**：`lucide-react 0.546.0`（现代简约的线性 icon 集）
*   **大模型集成**：`@google/genai 1.29.0`（无缝集成 Gemini 多模态推理及创意脚本生成）
*   **后端支撑（可选）**：`Express 4.21.2` + `dotenv 17.2.3`（用于本地服务器与环境变量配给）

---

## 📂 项目目录结构分析

```text
MatrixFlow/
├── src/                          # 前端核心源码
│   ├── components/               # Bento Grid 组件集合
│   │   ├── AnalyticsAdvisor.tsx  # 数据分析与优化建议面板
│   │   ├── AssetManager.tsx      # 素材生成、上传与视频克隆管理
│   │   ├── ContentPlanner.tsx    # 月度创作方向与选题生成器
│   │   ├── DataCollector.tsx     # 爆款采集与流量源画像追踪
│   │   ├── DeviceSimulator.tsx   # 可视化移动设备沙盒模拟器
│   │   ├── PersonaManager.tsx    # 账号基本信息与海外深度人设模型
│   │   ├── PublisherScheduler.tsx# 排班发布、脚本生成与代理故障记录
│   │   ├── SharedVideoList.tsx   # 共享视频组件库
│   │   └── WarmupPlanner.tsx     # 养号互动智能体（7日计划与日志截图）
│   ├── App.tsx                   # 主应用入口，协调全局数据状态与 Bento 调度
│   ├── constants.ts              # 预设数据源（默认设备矩阵、养号策略、选题库）
│   ├── types.ts                  # 全局 TypeScript 接口定义
│   ├── index.css                 # 基础样式表及 Tailwind 配置
│   └── main.tsx                  # 渲染挂载入口
├── tsconfig.json                 # TS 配置
├── vite.config.ts                # Vite 编译与代理配置
├── package.json                  # 依赖声明与编译脚本
├── .env.example                  # 环境变量模版
└── *.py / *.cjs                  # 自动化调试与批量 UI 更新脚本库
```

### ⚙️ 特色脚本库（*.py & *.cjs）说明
在根目录下存在大量的 Python 和 CommonJS 辅助脚本（如 `modify_planner.py`、`update_persona.py`、`rewrite_asset_manager.py` 等）。它们的作用是**免人工手动排版，通过自动化脚本在各组件内注入/更新 UI 特效、逻辑增强与 Mock 数据结构**，是高效开发和迭代的特色资产。

---

## 🟢 本地开发与运行指南

### 1. 环境准备
确保您的计算机上已安装 **Node.js**（推荐使用 v18.0.0 以上版本）。

### 2. 克隆与安装依赖
在项目根目录下执行以下命令安装依赖项：
```bash
npm install
```

### 3. 配置 API Key 与代理环境
将项目根目录下的 `.env.example` 复制重命名为 `.env.local` 或 `.env`：
```bash
cp .env.example .env.local
```
在文件中配置您的 **Gemini API Key**：
```env
GEMINI_API_KEY=你的_gemini_api_key_在此
```

### 4. 启动开发服务器
使用 Vite 极速热更新启动本地开发服务，默认运行在 `3000` 端口：
```bash
npm run dev
```
启动后，打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始管理您的自媒体账号矩阵！

### 5. 项目构建（生产部署）
如需打包用于生产环境的高性能静态资源 bundle：
```bash
npm run build
```
打包产物将输出至 `dist/` 目录。
