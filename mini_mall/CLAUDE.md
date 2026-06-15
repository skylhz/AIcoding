# Mini Mall

微型电商项目，基于 Next.js 16 + TypeScript + Prisma 5 + SQLite + TailwindCSS 4。

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.2.9 | App Router 全栈框架 |
| React | 19.2.4 | UI 库 |
| TypeScript | ^5 | 类型安全 |
| Prisma | 5.22.0 | ORM |
| SQLite | - | 嵌入式数据库 (dev.db) |
| TailwindCSS | ^4 | CSS-first 原子化样式 |
| next-auth | 5.0.0-beta.31 | 认证 |
| bcryptjs | 2.4.3 | 密码哈希 |
| tsx | 4.19.3 | TypeScript 脚本执行 |

## 项目结构

```
mini_mall/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── seed.ts                # 种子数据
├── src/
│   ├── app/                   # App Router 页面
│   ├── components/            # 可复用组件
│   └── lib/                   # 工具函数
│       ├── prisma.ts          # Prisma 单例
│       └── auth.ts            # Auth.js 配置
├── proxy.ts                   # Next.js 16 路由保护（替代 middleware）
└── .env                       # 环境变量
```

## 命令

```bash
npm run dev          # 启动开发服务器 (Turbopack)
npm run build        # 生产构建
npm run db:push      # 同步 Prisma Schema 到 SQLite
npm run db:seed      # 填充种子数据
npm run db:studio    # 打开 Prisma Studio
npm run lint         # ESLint
```

## Next.js 16 关键变化

### middleware → proxy

Next.js 16 将 `middleware.ts` 重命名为 `proxy.ts`，导出的函数名也改为 `proxy`：

```ts
// proxy.ts (NOT middleware.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // 认证检查、重定向等
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/cart', '/checkout', '/orders/:path*'],
}
```

### async params / searchParams

页面组件的 `params` 和 `searchParams` 现在都是 `Promise` 类型，必须 `await`：

```tsx
// app/products/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

### TailwindCSS 4 CSS-first 配置

- 无需 `tailwind.config.js`
- 在 `globals.css` 中用 `@import "tailwindcss"` 和 `@theme inline` 配置
- PostCSS 使用 `@tailwindcss/postcss` 插件

## 数据库模型

```
User ──1:N── CartItem ──N:1── Product ──N:1── Category
User ──1:N── Order ──1:N── OrderItem ──N:1── Product
```

- **User**: id, email, password, name, role(USER/ADMIN)
- **Category**: id, name, slug, description, image
- **Product**: id, name, slug, description, price, stock, images(JSON), isFeatured, categoryId
- **CartItem**: id, userId, productId, quantity, [userId, productId] unique
- **Order**: id, userId, status(PENDING/PAID/SHIPPED/DELIVERED/CANCELLED), total, address, phone, note
- **OrderItem**: id, orderId, productId, productName, price, quantity (下单时快照)

## 路由设计

### 公开页面
| 路由 | 功能 |
|------|------|
| `/` | 首页 |
| `/products` | 商品列表（搜索+分类筛选+分页） |
| `/products/[slug]` | 商品详情 |
| `/login` | 登录 |
| `/register` | 注册 |

### 用户页面（需登录）
| 路由 | 功能 |
|------|------|
| `/cart` | 购物车 |
| `/checkout` | 结算（模拟支付） |
| `/orders` | 订单历史 |
| `/orders/[id]` | 订单详情 |

### 后台管理（需 ADMIN 角色）
| 路由 | 功能 |
|------|------|
| `/admin` | 仪表盘 |
| `/admin/products` | 商品管理 |
| `/admin/products/new` | 新建商品 |
| `/admin/products/[id]/edit` | 编辑商品 |
| `/admin/categories` | 分类管理 |
| `/admin/orders` | 订单管理 |

## 开发约定

- 服务端组件优先，仅在需要交互时使用 `'use client'`
- Server Actions 处理数据变更（购物车、下单、后台 CRUD）
- `params` 和 `searchParams` 必须用 `await` 解包（Next.js 16 的 Promise 类型）
- 密码用 `bcryptjs.hash()` 加密，用 `bcryptjs.compare()` 验证
- 购物车用 `@@unique([userId, productId])` 限制重复添加，已存在则更新数量
- 订单创建时快照商品名称和价格到 OrderItem
- Admin 路由通过 proxy.ts 检查 session 中的 role 字段

<!-- superpowers-zh:begin (do not edit between these markers) -->
# Superpowers-ZH 中文增强版

本项目已安装 superpowers-zh 技能框架（20 个 skills）。

## 核心规则

1. **收到任务时，先检查是否有匹配的 skill** — 哪怕只有 1% 的可能性也要检查
2. **设计先于编码** — 收到功能需求时，先用 brainstorming skill 做需求分析
3. **测试先于实现** — 写代码前先写测试（TDD）
4. **验证先于完成** — 声称完成前必须运行验证命令

## 可用 Skills

Skills 位于 `.claude/skills/` 目录，每个 skill 有独立的 `SKILL.md` 文件。

- **brainstorming**: 在任何创造性工作之前必须使用此技能——创建功能、构建组件、添加功能或修改行为。在实现之前先探索用户意图、需求和设计。
- **chinese-code-review**: 中文 review 沟通参考——话术模板、分级标注（必须修复/建议修改/仅供参考）、国内团队常见反模式应对。仅在用户显式 /chinese-code-review 时调用，不要根据上下文自动触发。
- **chinese-commit-conventions**: 中文 commit 与 changelog 配置参考——Conventional Commits 中文适配、commitlint/husky/commitizen 中文模板、conventional-changelog 中文配置。仅在用户显式 /chinese-commit-conventions 时调用，不要根据上下文自动触发。
- **chinese-documentation**: 中文文档排版参考——中英文空格、全半角标点、术语保留、链接格式、中文文案排版指北约定。仅在用户显式 /chinese-documentation 时调用，不要根据上下文自动触发。
- **chinese-git-workflow**: 国内 Git 平台配置参考——Gitee、Coding.net、极狐 GitLab、CNB 的 SSH/HTTPS/凭据/CI 接入差异与镜像同步配置。仅在用户显式 /chinese-git-workflow 时调用，不要根据上下文自动触发。
- **dispatching-parallel-agents**: 当面对 2 个以上可以独立进行、无共享状态或顺序依赖的任务时使用
- **executing-plans**: 当你有一份书面实现计划需要在单独的会话中执行，并设有审查检查点时使用
- **finishing-a-development-branch**: 当实现完成、所有测试通过、需要决定如何集成工作时使用——通过提供合并、PR 或清理等结构化选项来引导开发工作的收尾
- **mcp-builder**: MCP 服务器构建方法论 — 系统化构建生产级 MCP 工具，让 AI 助手连接外部能力
- **receiving-code-review**: 收到代码审查反馈后、实施建议之前使用，尤其当反馈不明确或技术上有疑问时——需要技术严谨性和验证，而非敷衍附和或盲目执行
- **requesting-code-review**: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
- **subagent-driven-development**: 当在当前会话中执行包含独立任务的实现计划时使用
- **systematic-debugging**: 遇到任何 bug、测试失败或异常行为时使用，在提出修复方案之前执行
- **test-driven-development**: 在实现任何功能或修复 bug 时使用，在编写实现代码之前
- **using-git-worktrees**: 当需要开始与当前工作区隔离的功能开发，或在执行实现计划之前使用——通过原生工具或 git worktree 回退机制确保隔离工作区存在
- **using-superpowers**: 在开始任何对话时使用——确立如何查找和使用技能，要求在任何响应（包括澄清性问题）之前调用 Skill 工具
- **verification-before-completion**: 在宣称工作完成、已修复或测试通过之前使用，在提交或创建 PR 之前——必须运行验证命令并确认输出后才能声称成功；始终用证据支撑断言
- **workflow-runner**: 在 Claude Code / OpenClaw / Cursor 中直接运行 agency-orchestrator YAML 工作流——无需 API key，使用当前会话的 LLM 作为执行引擎。当用户提供 .yaml 工作流文件或要求多角色协作完成任务时触发。
- **writing-plans**: 当你有规格说明或需求用于多步骤任务时使用，在动手写代码之前
- **writing-skills**: 当创建新技能、编辑现有技能或在部署前验证技能是否有效时使用

## 如何使用

当任务匹配某个 skill 时，使用 `Skill` 工具加载对应 skill 并严格遵循其流程。绝不要用 Read 工具读取 SKILL.md 文件。

如果你认为哪怕只有 1% 的可能性某个 skill 适用于你正在做的事情，你必须调用该 skill 检查。
<!-- superpowers-zh:end -->
