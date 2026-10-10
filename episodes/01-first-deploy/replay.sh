#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
source "$(dirname "$0")/../../tools/replay-lib.sh"

# 1.1 在 GitHub 建立 repository（勾選 README）：GitHub 產生的第一個 commit 是 779adb0
make_remote 779adb0ab68370cea848396dcfb2635788cbc686

# 1.2 clone 到本機（影片顯示 https 網址；這裡用本機資料夾代替 GitHub）
cd "$work"
run git clone "$work/remote.git" calculator-app
clone_local_dir="$work/calculator-app"; cd "$clone_local_dir"
git config commit.gpgsign false

# 1.3 建立三個專案檔案（內容與 calculator-app 的 3108cfa 相同）
take 3108cfa index.html style.css script.js
run git status

# 1.4 首次 commit 與 push
run git add .
commit_like 3108cfa
run git push origin main

echo
check HEAD 3108cfa83679bef70c032563cb55423d275daad4 "首次 commit 與 calculator-app 的 3108cfa 相同"
