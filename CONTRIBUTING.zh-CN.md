# 参与贡献

[English](CONTRIBUTING.md) | 简体中文

使用 Node.js 24.11+ 与 `packageManager` 声明的 pnpm 10.34.5。开始前搜索现有 Issue，安全问题使用 GitHub 私密漏洞报告。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm release:check
```

`release:check` 会运行静态检查、单元与类型契约测试、包和演示构建、真实 npm 包检查，以及 React 18/19 的干净消费者冒烟测试。

保持提交聚焦并使用 Conventional Commits；公共行为或类型变化需要同步测试和文档。不要提交 `dist`、`demo-dist`、包压缩文件、凭据或本地配置。PR 应说明用户可见影响、验证结果和兼容性或迁移影响。发布操作仅由维护者执行，见[发布说明](RELEASING.zh-CN.md)。
