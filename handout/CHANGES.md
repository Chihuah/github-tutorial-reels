# 講義修訂說明

`github-tutorial.md` 是修正後的講義。修正前的原稿在這個 repo 的歷史紀錄裡（加入講義的第一個 commit），可以用 `git diff` 比對。

下面每一項修正，都是在製作教學短片時，實際執行講義的指令後發現的。

## 會讓操作失敗或結果錯誤的地方

| 段落 | 原本的寫法 | 實際發生的情況 | 修正 |
|---|---|---|---|
| 6.1 測試清單 | 測試 1、2、5 在 M+ 之後直接輸入下一個數字 | 按完 M+ 後畫面上的數字不會清掉，新數字會接在後面。測試 1 會得到 58（不是 8），測試 2 得到 -93，測試 5 得到 -4588 | 在輸入新數字前加上 `C`，並說明原因。修正後 5 個測試都得到預期結果（用 `tools/calc-test.mjs` 對真正的 `script.js` 執行過） |
| 7.6 方法 2 | 兩個終端機在同一個資料夾，分別 `git checkout` 兩個分支 | 兩個伺服器讀的是同一份檔案；終端機 2 切到版本 2 之後，終端機 1 看到的也變成版本 2，無法同時比較 | 改用 `git worktree` 把兩個版本放在不同資料夾。已實測：8001 埠是按鈕版，8002 埠是下拉選單版 |
| 8.4 刪除分支 | `git branch -d feature/scientific-v1` | 版本 1 沒有合併進 main，Git 拒絕刪除：`error: the branch 'feature/scientific-v1' is not fully merged.` | 改成 `git branch -D`，並說明 `-d` 為什麼會被拒絕 |
| 1.1 建立 repository | 選擇 `Private`，之後在 1.5 啟用 GitHub Pages | GitHub 免費帳號的 Private repository 不能使用 Pages | 加上說明：改選 Public，或申請 GitHub Student Developer Pack |

## 容易誤解的地方

| 段落 | 修正 |
|---|---|
| 1.5 啟用 GitHub Pages | 依照目前 GitHub 的畫面改寫：`Source` 選 `Deploy from a branch`，再到 `Branch` 選 `main` 和 `/ (root)` |
| 3.2 百分比按鈕 | 加上說明：每排 4 格，加上 % 之後 `←` 會被擠到下一排，這是正常的結果 |
| 4.3 查看 commit 歷史 | 輸出範例改成步驟 3 合併 PR 之後真正會看到的樣子：出錯的 commit 前面是合併 commit，而不是「Add percentage calculation button」 |
| 4.4、4.5 | commit 編號和 4.3 的範例對應（`361b398`、`e5e29b9`），並說明 revert 和 reset 擇一使用，兩個都做會連 revert 一起丟掉 |
| 4.5 `git reset --soft` | 原本寫「保留變更在工作區」，改成正確的「保留變更在暫存區」 |
| 7.6 方法 1 | 加上說明：一個 repository 同一時間只能用 Pages 發布一個分支，要輪流切換測試 |
| 8.3 合併 | 加上說明：main 沒有新 commit 時，Git 會快轉（Fast-forward），不會產生合併 commit |
| 疑難排解：恢復被刪除的 commit | `git checkout commit-id` 會進入 detached HEAD（沒有分支的狀態），改成 `git branch recovered-work commit-id`，替這個 commit 建立分支 |

## 沒有修改，但要注意的地方

- **2.1 等號按鈕的 hover 顏色**：講義寫 `#1976d2`（深藍色），calculator-app 的 commit `7434ffb` 實際用的是 `#73eb97`（綠色）。講義的藍色和其他按鈕比較搭配，所以講義不改；不同的是 calculator-app，學生照講義做不會有問題。
