#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
source "$(dirname "$0")/../../tools/replay-lib.sh"
source "$(dirname "$0")/../07-ab-test/make-v1.sh"

# 步驟 7 結束時：本機和 GitHub 都有兩個版本的分支
make_remote 0e8647710acfc6b48498ebaf7748959277175150
clone_local
git checkout -q -b feature/scientific-v1
build_v1; git add .
commit_as unknown chihua.tung@gmail.com "$V1_DATE" "Add scientific calculator - button style (v1)" >/dev/null
git checkout -q main; git checkout -q -b feature/scientific-v2
take 89553d4 index.html style.css script.js; git add .
commit_like 89553d4 >/dev/null
git push -q origin feature/scientific-v1 feature/scientific-v2 2>/dev/null

# 8.2 選擇版本 2：先回到最新的 main
run git checkout main
run git pull origin main

# 8.3 合併版本 2（main 沒有新 commit，所以是快轉合併 fast-forward）
run git merge feature/scientific-v2
run git push origin main

# 8.4 刪除分支：版本 1 沒有合併，-d 會拒絕，要用 -D
run git branch -d feature/scientific-v1 || true
run git branch -D feature/scientific-v1
run git branch -d feature/scientific-v2
run git push origin --delete feature/scientific-v1 feature/scientific-v2

# 8.6 標記版本：作者和時間與 calculator-app 的 v2.0 標籤相同
echo; echo '$ git tag -a v2.0 -m "Version 2.0: Add scientific calculator with dropdown interface"'
GIT_COMMITTER_NAME=unknown GIT_COMMITTER_EMAIL=chihua.tung@gmail.com GIT_COMMITTER_DATE="1763434062 +0800" \
  git tag -a v2.0 -m "Version 2.0: Add scientific calculator with dropdown interface"
run git push origin v2.0
run git tag

echo
check HEAD 89553d4fc546e8b71234fb9c62b90f41c7b0c7f7 "main 指向 calculator-app 的 89553d4"
check v2.0 "$(git -C "$src" rev-parse v2.0 2>/dev/null || echo none)" "v2.0 標籤與 calculator-app 的相同"
