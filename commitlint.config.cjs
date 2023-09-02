/*
 * @LastEditTime: 2023-08-08 15:11:41
 * @Description:
 * @Date: 2023-02-24 11:27:43
 * @Author: @周星星同学
 */
/** @type {import('cz-git').UserConfig} */

const types = [
  { value: "feat", name: "feat:     ✨  A new feature", emoji: "✨" },
  { value: "fix", name: "fix:      🐛  A bug fix", emoji: "🐛" },
  {
    value: "docs",
    name: "docs:     📝  Documentation only changes",
    emoji: "📝",
  },
  {
    value: "style",
    name: "style:    💄  Changes that do not affect the meaning of the code",
    emoji: "💄",
  },
  {
    value: "refactor",
    name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
    emoji: "♻️",
  },
  {
    value: "perf",
    name: "perf:     ⚡️  A code change that improves performance",
    emoji: "⚡️",
  },
  {
    value: "test",
    name: "test:     ✅  Adding missing tests or correcting existing tests",
    emoji: "✅",
  },
  {
    value: "build",
    name: "build:    📦️   Changes that affect the build system or external dependencies",
    emoji: "📦️",
  },
  {
    value: "ci",
    name: "ci:       🎡  Changes to our CI configuration files and scripts",
    emoji: "🎡",
  },
  {
    value: "chore",
    name: "chore:    🔨  Other changes that don't modify src or test files",
    emoji: "🔨",
  },
  {
    value: "revert",
    name: "revert:   ⏪️  Reverts a previous commit",
    emoji: "⏪️",
  },
  {
    value: "release",
    name: "release:   🍀  release",
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
