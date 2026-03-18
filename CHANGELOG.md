
# 3.0.0 (2026-07-13)

### Breaking Changes

- Replace `ModalType<Data, Props>` with named modal definitions such as `{ data?: Data; props: Props }`.
- Enforce required and optional `data` and `props` fields in `show` and `useModal` calls.
- Remove the public `useModalContext` API.
- Destroy hook-owned modals when their owner unmounts.

### Performance Improvements

- Keep modal actions in a stable Context so modal updates do not re-render hook owners.
- Memoize modal hosts so unrelated modal instances do not re-render.

### Bug Fixes

- Ignore stale close-animation callbacks after a modal is shown again.
- Separate demo and library output directories to prevent broken package contents.


# [2.1.0](https://github.com/cixiangtao/nice-use-modal/compare/v2.0.0...v2.1.0) (2025-07-28)


### Performance Improvements

* ⚡️ 重构 ([b2ea6e2](https://github.com/cixiangtao/nice-use-modal/commit/b2ea6e2b25a01be62c62f102f849f403192c9534))

# [2.0.0](https://github.com/cixiangtao/nice-use-modal/compare/v1.1.4...v2.0.0) (2023-11-01)

## [1.1.4](https://github.com/cixiangtao/nice-use-modal/compare/v1.1.3...v1.1.4) (2023-10-30)


### Bug Fixes

* 🐛 修复hide无法关闭弹窗的bug ([00f1576](https://github.com/cixiangtao/nice-use-modal/commit/00f157610fb8a3be7a63cb88903d1d3c61973d20))

## [1.1.3](https://github.com/cixiangtao/nice-use-modal/compare/v1.1.2...v1.1.3) (2023-09-01)


### Bug Fixes

* 🐛 更新d.ts引用地址 ([f6a6ec1](https://github.com/cixiangtao/nice-use-modal/commit/f6a6ec17ea4ae57ec753b270aa82c1107dfca1ff))

## [1.1.2](https://github.com/cixiangtao/nice-use-modal/compare/v1.1.1...v1.1.2) (2023-08-31)


### Bug Fixes

* 🐛 add key ([ee6c2e5](https://github.com/cixiangtao/nice-use-modal/commit/ee6c2e5813e30a95314eac0691c45cbe680c4f9f))

## [1.1.1](https://github.com/cixiangtao/nice-use-modal/compare/v1.1.0...v1.1.1) (2023-08-31)

# [1.1.0](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.7...v1.1.0) (2023-08-31)


### Features

* ✨ 新增props,简化写法 ([b41fd05](https://github.com/cixiangtao/nice-use-modal/commit/b41fd05549bd2b8e4ea0f8c3803826615d800ecb))

## [1.0.7](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.6...v1.0.7) (2023-08-09)

## [1.0.6](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.5...v1.0.6) (2023-08-09)


### Features

* ✨ 导出部分ts类型 ([5a1eaea](https://github.com/cixiangtao/nice-use-modal/commit/5a1eaea6087cbb2884ac85b1f28afb3e755ffcb2))

## [1.0.5](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.4...v1.0.5) (2023-08-08)


### Bug Fixes

* 🐛 关闭弹窗时增加当前实例判断 ([feb88c1](https://github.com/cixiangtao/nice-use-modal/commit/feb88c186266192fc4788efbf0e827aa716aab43))

## [1.0.4](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.3...v1.0.4) (2023-08-08)

## [1.0.3](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.2...v1.0.3) (2023-08-08)

## [1.0.2](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.1...v1.0.2) (2023-08-08)

## [1.0.1](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.0...v1.0.1) (2023-08-08)

# [1.0.0](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.0-beta.2...v1.0.0) (2023-08-08)


### Features

* ✨ 完善ts类型提示 ([bdeb470](https://github.com/cixiangtao/nice-use-modal/commit/bdeb470f220e628463a502cfdd2260995678b4a2))

# [1.0.0-beta.2](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2023-08-08)

# [1.0.0-beta.1](https://github.com/cixiangtao/nice-use-modal/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2023-08-08)

# 1.0.0-beta.0 (2023-08-08)


### Features

* nice use modal ([a355427](https://github.com/cixiangtao/nice-use-modal/commit/a355427b215559aadf073d6c28eef144baae69f2))
