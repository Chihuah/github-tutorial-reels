#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
source "$(dirname "$0")/../../tools/replay-lib.sh"
here="$(cd "$(dirname "$0")/../.." && pwd)"

# 步驟 5 結束時：GitHub 上有 feature/memory-function（d459664），本機在這個分支上
make_remote e5e29b9ac22ad65416b033ca6b1f801050f8549c
remote_ref feature/memory-function d459664eb2140fbc88e5b0fc23e160a30302ff28
clone_local
git checkout -q -b feature/memory-function origin/feature/memory-function

# 6.1 本機測試：啟動網頁伺服器（只看第一行輸出就停止）
echo; echo '$ python3 -m http.server 8000'
(timeout 2 python3 -u -m http.server 8000 || true) 2>&1 | head -1
# 用真正的 script.js 跑講義的 5 個測試（輸入新數字前先按 C，見 tools/calc-test.mjs）
echo; node "$here/tools/calc-test.mjs" script.js --clear-before-number

# 6.2 確認都已提交、推送
run git status
run git push origin feature/memory-function

# 6.3–6.4 在 GitHub 審查並合併 PR #3（Create a merge commit）：GitHub 產生 0e86477
remote_ref main 0e8647710acfc6b48498ebaf7748959277175150

# 6.5 更新本機 main，刪除用完的分支
run git checkout main
run git pull origin main
run git branch -d feature/memory-function
run git push origin --delete feature/memory-function

echo
check HEAD 0e8647710acfc6b48498ebaf7748959277175150 "main 更新到 calculator-app 的合併 commit 0e86477"
