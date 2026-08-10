# 发布 nice-use-modal

[English](RELEASING.md) | 简体中文

GitHub Actions 是 npm 与 GitHub Release 的唯一发布者。Release Please 自动维护发版 PR，维护者不在工作站上升版、创建 tag 或发布。

普通改动通过受保护的 `master` 与必需检查合入。Release Please 根据 Conventional Commit 或 squash merge 标题维护唯一发版 PR和 `CHANGELOG.md`。维护者检查受限差异、版本、Changelog 与 CI 后合并；`.github/workflows/release.yml` 会重新验证准确的合并 PR，构建并只打包一次，创建 `vX.Y.Z`，通过 npm trusted publishing 发布已经检查的产物，并创建匹配的 GitHub Release。

发布后独立核对工作流、远端 tag、Release 状态、npm 版本与 dist-tags，以及公开包的干净安装。普通 PR 合并不会发布，不要在本地推送发版 tag、运行 `npm publish` 或编辑自动发版分支。

仓库通过 `RELEASE_APP_CLIENT_ID` 和 `RELEASE_APP_PRIVATE_KEY` 使用已安装且具备 Contents、Issues、Pull requests 读写权限的 GitHub App。

失败恢复前先检查已合并发版 PR、工作流、远端 tag、GitHub Release 与 npm 状态，再从 `master` 手动运行 `Release npm package` 并传入准确的发版 PR 编号。不得复用已公开版本或退回本地发布。
