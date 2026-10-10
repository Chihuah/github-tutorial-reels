#!/usr/bin/env bash
# 重新執行影片中的每一個指令，確認畫面上的終端機輸出都是真的。
# 用法：./replay.sh <calculator-app 的本機路徑>
#
# 注意：calculator-app 的歷史裡沒有這一步的 commit（最後用 reset 把它們移除了）。
# 這裡的「有錯誤的 commit」和「revert commit」是依照講義實際做出來的，
# 作者和時間固定，所以每次執行的 hash 都一樣。
source "$(dirname "$0")/../../tools/replay-lib.sh"
ME=(Chihuah chihua.tung@gmail.com)

make_remote e5e29b9ac22ad65416b033ca6b1f801050f8549c   # 步驟 3 合併 PR #1 之後
clone_local

# 4.1 模擬錯誤：把 calculate() 整個註解掉
awk '/^function calculate\(\)/{print "/*"} {print} f&&/^}/{print "*/"; f=0} /^function calculate\(\)/{f=1}' script.js > s.tmp && mv s.tmp script.js
truncate -s -1 script.js   # awk 會在檔尾補換行；原檔沒有，所以去掉，讓 diff 只顯示 /* 和 */ 兩行
run git diff --stat

# 4.2 提交錯誤的變更
run git add script.js
commit_as "${ME[@]}" 1762844400 "Update script (contains bug)"
run git push origin main

# 4.3 查看 commit 歷史
run git log --oneline --decorate -3

# 4.4 方法一：git revert（產生一個新的 commit 抵銷錯誤）
# 因為作者時間是固定的，git 會多印一行「Date: ...」；平常操作不會出現，影片中省略
echo; echo '$ git revert HEAD'
GIT_AUTHOR_NAME=${ME[0]} GIT_AUTHOR_EMAIL=${ME[1]} GIT_AUTHOR_DATE="1762844700 +0800" \
GIT_COMMITTER_NAME=${ME[0]} GIT_COMMITTER_EMAIL=${ME[1]} GIT_COMMITTER_DATE="1762844700 +0800" \
  git revert HEAD
run git push origin main
run git log --oneline --decorate -4

# 4.5 方法二：git reset --hard（直接回到 e5e29b9，後面的 commit 都丟掉）
run git reset --hard e5e29b9
run git push -f origin main
run git log --oneline --decorate -2

echo
check HEAD e5e29b9ac22ad65416b033ca6b1f801050f8549c "reset 之後 main 回到 e5e29b9，和 calculator-app 的歷史一致"
