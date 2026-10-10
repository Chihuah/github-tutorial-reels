#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
# 會在暫存資料夾裡操作，不會修改你的 calculator-app。
set -euo pipefail

src="$(cd "${1:?請指定 calculator-app 的本機路徑}" && pwd)"
BEFORE=7434ffbf5bca93c7732fcc80b9093081294a53f5   # Update button colors to blue theme
FEATURE=17bde931138fb16f8e315ea655fb1f5c0b8be283  # Add percentage calculation button
MERGE=e5e29b9ac22ad65416b033ca6b1f801050f8549c    # Merge pull request #1（GitHub 網頁上合併產生）
BRANCH=feature/percentage-button
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# 用本機的 bare repo 代替 GitHub，main 停在步驟 3 之前
git clone -q --bare "$src" "$work/remote.git"
git -C "$work/remote.git" update-ref refs/heads/main "$BEFORE"
git clone -q "$work/remote.git" "$work/calculator-app"
cd "$work/calculator-app"
# 作者資訊從原 commit 讀取，才能重做出相同的 hash
git config user.name "$(git -C "$src" log -1 --format=%an "$FEATURE")"
git config user.email "$(git -C "$src" log -1 --format=%ae "$FEATURE")"

run() { echo; echo "\$ $*"; "$@"; }

# 3.1 建立並切換到新分支
run git checkout -b "$BRANCH"
run git branch

# 3.2 修改 index.html 和 script.js（直接取用原 commit 的檔案內容）
git -C "$src" show "$FEATURE:index.html" > index.html
git -C "$src" show "$FEATURE:script.js" > script.js

# 3.3 提交變更並推送分支
run git status --short
run git add index.html script.js
# 用原 commit 的時間、關閉簽章，重做出相同的 hash 17bde93
GIT_AUTHOR_DATE="1762831055 +0800" GIT_COMMITTER_DATE="1762831055 +0800" \
  run git -c commit.gpgsign=false commit -m "Add percentage calculation button"
run git push origin "$BRANCH"

# 3.4–3.5 在 GitHub 網頁上建立並合併 PR #1：
# 這一步無法在終端機重現，所以直接把遠端的 main 移到 GitHub 產生的合併 commit
git -C "$work/remote.git" update-ref refs/heads/main "$MERGE"

# 3.6 更新本地 main 分支
run git checkout main
run git pull origin main
run git branch -d "$BRANCH"
run git log --oneline --graph -4

echo
test "$(git rev-parse "$MERGE^2")" = "$FEATURE" && echo "✓ 分支上的 commit 與 calculator-app 的 17bde93 相同"
test "$(git rev-parse HEAD)" = "$MERGE" && echo "✓ 更新後的 main 指向合併 commit e5e29b9"
