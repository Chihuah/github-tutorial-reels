#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
# 會在暫存資料夾裡操作，不會修改你的 calculator-app。
set -euo pipefail

src="$(cd "${1:?請指定 calculator-app 的本機路徑}" && pwd)"
BEFORE=3108cfa83679bef70c032563cb55423d275daad4   # Initial calculator with basic operations
AFTER=7434ffbf5bca93c7732fcc80b9093081294a53f5    # Update button colors to blue theme
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# 用本機的 bare repo 代替 GitHub，main 停在步驟 2 之前
git clone -q --bare "$src" "$work/remote.git"
git -C "$work/remote.git" update-ref refs/heads/main "$BEFORE"
git clone -q "$work/remote.git" "$work/calculator-app"
cd "$work/calculator-app"
# 作者資訊從原 commit 讀取，才能重做出相同的 hash
git config user.name "$(git -C "$src" log -1 --format=%an "$AFTER")"
git config user.email "$(git -C "$src" log -1 --format=%ae "$AFTER")"

# 2.1 修改 style.css（直接取用原 commit 的檔案內容）
git -C "$src" show "$AFTER:style.css" > style.css

run() { echo; echo "\$ $*"; "$@"; }
run git status
run git diff style.css
run git add style.css
run git status
# 用原 commit 的時間、關閉簽章，重做出相同的 hash 7434ffb
GIT_AUTHOR_DATE="1762830492 +0800" GIT_COMMITTER_DATE="1762830492 +0800" \
  run git -c commit.gpgsign=false commit -m "Update button colors to blue theme"
run git log --oneline --decorate
run git push origin main
run git status

test "$(git rev-parse HEAD)" = "$AFTER" && echo && echo "✓ commit hash 與 calculator-app 的 7434ffb 相同"
