#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
#
# 注意：版本 1（按鈕式）的 commit 不在 calculator-app 的歷史裡，這裡依照講義 7.2
# 的程式碼實際做出來（見 make-v1.sh；作者和時間固定，hash 每次都一樣）。
# 版本 2 的 commit 與 calculator-app 的 89553d4 完全相同。
source "$(dirname "$0")/../../tools/replay-lib.sh"
source "$(dirname "$0")/make-v1.sh"

make_remote 0e8647710acfc6b48498ebaf7748959277175150   # 步驟 6 合併 PR #3 之後
clone_local

# 7.1–7.2 版本 1：按鈕式
run git checkout -b feature/scientific-v1
build_v1
run git add .
commit_as unknown chihua.tung@gmail.com "$V1_DATE" "Add scientific calculator - button style (v1)"
run git push origin feature/scientific-v1

# 7.3–7.4 版本 2：下拉選單式（內容與 calculator-app 的 89553d4 相同）
run git checkout main
run git checkout -b feature/scientific-v2
take 89553d4 index.html style.css script.js
run git add .
commit_like 89553d4
run git push origin feature/scientific-v2

# 7.5 比較兩個版本
run git branch -a
run git diff feature/scientific-v1 feature/scientific-v2 --stat
# 切換分支，分別測試兩種設計
run git checkout feature/scientific-v1
run git checkout feature/scientific-v2

echo
check feature/scientific-v2 89553d4fc546e8b71234fb9c62b90f41c7b0c7f7 "版本 2 的 commit 與 calculator-app 的 89553d4 相同"
