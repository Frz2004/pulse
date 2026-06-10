# Pulse 协作工作流

## 分支模型
- `main`:受保护,只接受 PR 合入,始终可发布
- `feat/xxx`:新功能
- `fix/xxx`:Bug 修复
- `chore/xxx`:构建、依赖、文档等杂项

## 标准流程
```bash
# 1. 同步最新 main
git checkout main && git pull

# 2. 新建功能分支
git checkout -b feat/voice-chat-webrtc

# 3. 开发并提交(建议用 Conventional Commits)
git add .
git commit -m "feat(voice): 接入 WebRTC 信令服务"

# 4. 推送并发起 PR
git push -u origin feat/voice-chat-webrtc
# 在 GitHub 上点 "Compare & pull request"

# 5. 通过 Review + CI 后,Squash & Merge 到 main
# 6. 删除分支(GitHub 自动处理)
```

## Commit 规范(Conventional Commits)
- `feat:` 新功能 / `fix:` 修复 / `chore:` 杂项
- `docs:` 文档 / `refactor:` 重构 / `style:` 样式
- `test:` 测试 / `perf:` 性能

## Lovable 的协作位置
- Lovable 编辑器默认推送到 `main`,会被分支保护**拒绝**
- 解决方案二选一:
  1. **推荐**:让 Lovable 改动也走 PR——在 Lovable 中开启实验性功能 *Account Settings → Labs → GitHub Branch Switching*,切到 feature 分支再让 AI 改
  2. 临时:在 Branch ruleset 中把 Lovable 的 GitHub App 加入 *Bypass list*(仅 Owner 使用,不推荐长期)

## PR Review 检查清单
- [ ] 标题符合 Conventional Commits
- [ ] CI 全部通过(typecheck / build / lint)
- [ ] 数据库迁移文件已包含且可重放
- [ ] 不含 Secrets / API Key
- [ ] UI 改动附截图或预览链接
