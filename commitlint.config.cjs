/*
 * @LastEditTime: 2023-08-08 17:20:00
 * @Description:
 * @Date: 2023-02-24 11:27:43
 * @Author: @周星星同学
 */
/** @type {import('cz-git').UserConfig} */

const types = [
  { value: "feat", name: "feat: ✨ 添加新功能", emoji: "✨" },
  { value: "fix", name: "fix: 🐛 修复Bug", emoji: "🐛" },
  {
    value: "docs",
    name: "docs: 📝 仅文档变更",
    emoji: "📝",
  },
  {
    value: "style",
    name: "style: 💄 不影响代码含义的变化（如格式调整）",
    emoji: "💄",
  },
  {
    value: "refactor",
    name: "refactor: ♻️ 代码更改，既不修复Bug也不添加新功能",
    emoji: "♻️",
  },
  {
    value: "perf",
    name: "perf: ⚡️ 提升性能的代码变动",
    emoji: "⚡️",
  },
  {
    value: "test",
    name: "test: ✅ 添加缺失的测试或修正现有测试",
    emoji: "✅",
  },
  {
    value: "build",
    name: "build: 📦️ 影响构建系统或外部依赖的变动",
    emoji: "📦️",
  },
  {
    value: "ci",
    name: "ci: 🎡 更改CI配置文件和脚本",
    emoji: "🎡",
  },
  {
    value: "chore",
    name: "chore: 🔨 其他不涉及源代码或测试文件的变动",
    emoji: "🔨",
  },
  {
    value: "revert",
    name: "revert: ⏪️ 撤销先前的提交",
    emoji: "⏪️",
  },
  {
    value: "release",
    name: "release: 🍀 版本发布",
    emoji: "🍀",
  },
];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", types.map(({ value }) => value)],
  },
  prompt: {
    types,
    useEmoji: true,
    emojiAlign: "center",
  },
};
