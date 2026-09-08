# Pulse

> 面向高校场景的移动端社交 Web 应用：滑卡匹配、匿名树洞、短视频与语音房、校园社区，配 SBTI / 掌纹等轻社交游戏。

Pulse 是一个跑在 **Cloudflare Workers** 上的全栈 Web 应用，前端为 **TanStack Start + React 19**，数据层使用 **Supabase**（Auth / Postgres / Storage / RLS / Realtime）。所有业务读写都经由 TanStack **Server Functions** 在服务端完成，浏览器端只持有 anon key，敏感数据通过服务角色密钥在 Worker 侧访问。

## ✨ 功能特性

- **发现与匹配**：滑卡（喜欢 / 超级喜欢 / 跳过）、互滑自动建立匹配、雷达查看附近用户
- **1v1 社交**：私聊（含图片/语音等附件）、语音 / 视频通话、消息实时更新
- **匿名树洞**：吐槽 / 提问 / 情感树洞，匿名昵称与头像、多图发布、点赞、评论、按帖匿名私聊，消息满 30 条后可双向“揭开身份”
- **内容社区**：校园社区帖子、短视频发布与评论、语音房、场所 / 比赛 / 兼职信息
- **轻社交游戏**：SBTI 人格测试（含“喝醉”彩蛋模式）、AI 掌纹解读
- **账号体系**：手机认证、学生 / 真人认证、拉黑、统一举报、隐私设置、通知中心
- **运营后台**：内容审核（举报处理 / 内容下架 / 用户处理）、数据看板

## 🧱 技术栈

| 层 | 选型 |
| --- | --- |
| 前端框架 | TanStack Start（React 19 + Vite 7） |
| 路由 / 数据 | TanStack Router、TanStack Query、Server Functions（Zod 校验入参） |
| 样式 | Tailwind CSS v4 + shadcn/ui 风格组件（Radix UI）+ Framer Motion |
| 后端 | Supabase：Auth、Postgres、Row Level Security、Storage、Realtime |
| 运行时 | Cloudflare Workers（`@cloudflare/vite-plugin`） |
| AI 能力 | DeepSeek（仅服务端调用，掌纹解读 / 文案生成） |
| 分析 | PostHog（可选，留空自动关闭） |
| 包管理 / CI | Bun、GitHub Actions（typecheck + build） |

## 📁 目录结构

```
.
├── src/
│   ├── routes/            # 文件路由（页面 + 每个页面的 Server 入口）
│   ├── components/        # 通用组件与 ui 组件库
│   ├── integrations/
│   │   └── supabase/      # Supabase 客户端、服务端客户端、类型、认证中间件
│   ├── lib/               # Server Functions、SBTI/Palm 引擎、工具库
│   ├── hooks/             # 自定义 Hooks（实时通知等）
│   ├── server.ts          # Cloudflare Worker 入口
│   └── start.ts           # TanStack Start 装配（请求/函数中间件）
├── supabase/
│   ├── config.toml        # Supabase CLI 配置
│   └── migrations/        # 数据库迁移（含 treehole v2、举报/审核等）
├── docs/CONTRIBUTING.md   # 协作规范
└── public/                # SBTI 类型图、种子数据等静态资源
```

## 🚀 快速开始

### 前置要求

- [Bun](https://bun.sh) ≥ 1.1（仓库使用 `bun.lock`，CI 同样基于 Bun）
- [Supabase CLI](https://supabase.com/docs/guides/cli)（应用迁移时可选）
- 一个 Supabase 项目（本地 `supabase start` 或云端项目均可）

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

按表填入你的 Supabase 项目地址与密钥（`.env.example` 中有完整说明）。Bun 会自动加载 `.env`，因此同组变量可同时供浏览器端（`VITE_` 前缀）与服务端读取。

### 3. 初始化数据库

```bash
# 方式 A：推送到云端项目（推荐，会自动读取 supabase/migrations）
supabase link --project-ref <your-project-ref>
supabase db push

# 方式 B：本地起一个完整 Supabase 后应用迁移
supabase start
supabase db reset
```

### 4. 启动开发服务器

```bash
bun run dev
```

访问 <http://localhost:8080>。迁移已包含 RLS 策略与存储桶（`avatars` / `media` / `treehole-media`），本地调试前可先 `supabase start` 保证 Storage 与 Realtime 可用。

### 构建与预览

```bash
bun run build     # 构建 Cloudflare Worker 产物
bun run preview   # 本地预览构建结果
bun run lint      # ESLint
bunx tsc --noEmit # 类型检查
```

## 🔐 环境变量

| 变量 | 位置 | 说明 |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | 浏览器 / Worker | Supabase 项目地址（`https://<ref>.supabase.co`） |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | 浏览器 / Worker | anon / publishable key，可安全暴露 |
| `SUPABASE_URL` | 仅服务端 | 同上（Server Functions 读取） |
| `SUPABASE_PUBLISHABLE_KEY` | 仅服务端 | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | 仅服务端 | **服务角色密钥，严禁出现在浏览器端** |
| `DEEPSEEK_API_KEY` | 仅服务端 | DeepSeek 密钥（掌纹解读等 AI 能力） |
| `VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST` | 浏览器 | PostHog 产品分析，留空即关闭 |

## 🗄️ 数据模型（Supabase 迁移）

- 迁移全部位于 `supabase/migrations/`，按时间戳顺序执行；已应用的迁移不要改动，变更一律新增迁移文件。
- 核心表：`profiles` / `profiles_private`（含手机与认证标记）、`swipes` / `matches`、`conversations` / `messages`、`treehole_posts` / `treehole_comments` / `treehole_likes` / `treehole_chats` / `treehole_chat_messages` / `treehole_reveal_requests`、`community_posts`、`short_videos`、`reports` / `content_flags` / `moderation_actions`、`notifications`、`game_scores` 等。
- 点赞 / 评论 / 浏览计数由数据库触发器维护，保证与明细行一致。
- 树洞对客户端只暴露脱敏视图 `treehole_posts_public`（不含 `author_id`）；其余树洞读写走 Server Functions + 服务角色，受 RLS 兜底。
- 手写类型 `src/integrations/supabase/types.ts` 与迁移保持同步，改动表结构后请同步更新（或 `supabase gen types` 重新生成）。

## ☁️ 部署（Cloudflare Workers）

1. 构建产物由 `@cloudflare/vite-plugin` 生成（`bun run build`）。
2. 为 Worker 配置运行环境：
   - 将 `SUPABASE_URL`、`SUPABASE_PUBLISHABLE_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`DEEPSEEK_API_KEY` 作为 **Worker Secret** 注入；
   - 将 `VITE_SUPABASE_URL`、`VITE_SUPABASE_PUBLISHABLE_KEY` 等 `VITE_` 变量在构建时传入（与 CI 一致）。
3. 发布流程可参考 `.github/workflows/ci.yml`：`bun install --frozen-lockfile` → `bunx tsc --noEmit` → `bun run build`。

> CI 中 `VITE_SUPABASE_URL` 等以 Secrets 形式注入，请在仓库 Settings → Secrets and variables → Actions 中配置。

## 🤝 贡献

分支模型、Commit 规范与 Review 流程见 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)。
