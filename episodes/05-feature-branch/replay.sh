#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
source "$(dirname "$0")/../../tools/replay-lib.sh"

make_remote e5e29b9ac22ad65416b033ca6b1f801050f8549c
clone_local

# 5.1 確認 main 是最新的，再建立功能分支
run git checkout main
run git pull origin main
run git checkout -b feature/memory-function

# 5.2–5.3 介面：index.html、style.css（內容與 calculator-app 的 f3cdf64 相同）
take f3cdf64 index.html style.css
run git status --short
run git add index.html style.css
commit_like f3cdf64

# 5.4 功能：script.js（內容與 d459664 相同）
take d459664 script.js
run git add script.js
commit_like d459664

# 5.7 只列出分支上比 main 多的 commit
run git log main..feature/memory-function --oneline --decorate
run git push origin feature/memory-function

echo
check HEAD~1 f3cdf64ad9aaef0bd36482cbfe94c08ec4372f31 "第一個 commit 與 calculator-app 的 f3cdf64 相同"
check HEAD d459664eb2140fbc88e5b0fc23e160a30302ff28 "第二個 commit 與 calculator-app 的 d459664 相同"
