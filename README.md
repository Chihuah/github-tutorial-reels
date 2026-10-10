# GitHub 實戰教學短片（Reels）

這個 repo 放的是「GitHub 實戰教學」講義的直式教學短片，以及製作這些影片的程式。

- 講義網站：<https://github-tutorial.scholarverse.cc>
- 示範用的專案：[Chihuah/calculator-app](https://github.com/Chihuah/calculator-app)

每支影片都是 **直式 9:16（1080×1920）**，適合放在手機短影音平台。影片只有轉場音效（打字時沒有聲音），另外附一份字幕檔（`.srt`），之後可以拿來配旁白。

## 完整版

8 集接成一部，開頭有一張目錄卡，總長約 8 分鐘：

- 影片：[full-github-tutorial.mp4](videos/full-github-tutorial.mp4)（內含章節，播放器可以直接跳到某一步）
- 字幕：[full-github-tutorial.srt](videos/full-github-tutorial.srt)
- 章節時間：[full-github-tutorial-chapters.txt](videos/full-github-tutorial-chapters.txt)（YouTube 說明欄可以直接貼上）

重新產生：先用 `build.sh` 做好 8 集，再執行 `./tools/build-full.sh`。

## 講義

- 修正後的講義：[handout/github-tutorial.md](handout/github-tutorial.md)
- 修訂說明：[handout/CHANGES.md](handout/CHANGES.md)（每一處改了什麼、為什麼要改）

## 影片列表

| 集數 | 講義段落 | 影片 | 字幕 |
|---|---|---|---|
| 01 | 步驟 1：建立專案基礎並完成首次部署 | [01-first-deploy.mp4](videos/01-first-deploy.mp4) | [01-first-deploy.srt](videos/01-first-deploy.srt) |
| 02 | 步驟 2：透過樣式調整熟悉基本 Git 操作流程 | [02-git-basic-flow.mp4](videos/02-git-basic-flow.mp4) | [02-git-basic-flow.srt](videos/02-git-basic-flow.srt) |
| 03 | 步驟 3：使用 Pull Request 實現程式碼審查機制 | [03-pull-request.mp4](videos/03-pull-request.mp4) | [03-pull-request.srt](videos/03-pull-request.srt) |
| 04 | 步驟 4：學會版本倒退以應對錯誤情況 | [04-undo-changes.mp4](videos/04-undo-changes.mp4) | [04-undo-changes.srt](videos/04-undo-changes.srt) |
| 05 | 步驟 5：使用分支策略開發新功能（記憶功能） | [05-feature-branch.mp4](videos/05-feature-branch.mp4) | [05-feature-branch.srt](videos/05-feature-branch.srt) |
| 06 | 步驟 6：完整測試後透過 Pull Request 合併新功能 | [06-test-and-merge.mp4](videos/06-test-and-merge.mp4) | [06-test-and-merge.srt](videos/06-test-and-merge.srt) |
| 07 | 步驟 7：實作 A/B 測試比較兩種設計方案 | [07-ab-test.mp4](videos/07-ab-test.mp4) | [07-ab-test.srt](videos/07-ab-test.srt) |
| 08 | 步驟 8：評估測試結果並合併最佳方案 | [08-pick-and-release.mp4](videos/08-pick-and-release.mp4) | [08-pick-and-release.srt](videos/08-pick-and-release.srt) |

## 畫面上的輸出都是真的

影片裡終端機顯示的每一行輸出、每一個 commit 編號（hash），都是在 calculator-app 上實際執行指令得到的結果。例如步驟 2 的 commit `7434ffb`，就是 calculator-app 歷史紀錄裡的同一個 commit。

在 GitHub 網頁上完成的操作（例如合併 Pull Request），終端機無法重現。這類畫面使用 GitHub 上的真實資料：PR #1、PR #3 的標題、commit 數、修改的檔案數和行數，以及合併後產生的 commit `e5e29b9`、`0e86477`，都和 calculator-app 的實際紀錄相同。

各集和 calculator-app 歷史的對照：

| 集數 | commit 的來源 |
|---|---|
| 01 | `779adb0`、`3108cfa`：與 calculator-app 相同 |
| 02 | `7434ffb`：與 calculator-app 相同 |
| 03 | `17bde93`、`e5e29b9`（PR #1）：與 calculator-app 相同 |
| 04 | calculator-app 的歷史裡**沒有**這一步的 commit。影片中的 `361b398`（有錯誤）和 `9d043d7`（revert）是依照講義實際做出來的；最後 `reset` 回到 `e5e29b9`，剛好接上 calculator-app 的真實歷史 |
| 05 | `f3cdf64`、`d459664`：與 calculator-app 相同 |
| 06 | `0e86477`（PR #3）：與 calculator-app 相同；5 個測試用 `tools/calc-test.mjs` 對真正的 `script.js` 執行過 |
| 07 | 版本 2 `89553d4`：與 calculator-app 相同。版本 1 `2e272ca` 不在 calculator-app 裡，是依照講義 7.2 的程式碼實際做出來的（見 `episodes/07-ab-test/make-v1.sh`） |
| 08 | `89553d4` 與 `v2.0` 標籤：與 calculator-app 完全相同 |

「實際做出來」的 commit 都固定了作者和時間，所以每次執行 `replay.sh`，hash 都一樣。

為了讓手機上看得清楚，畫面有做幾種精簡：

- `git status` 省略括號裡的提示行。
- `git diff` 只保留主要的修改行，省略檔頭和沒有修改的行。
- 遠端網址顯示為 `https://github.com/Chihuah/calculator-app.git`（`replay.sh` 用本機資料夾代替 GitHub，所以這一行的網址會不同）。
- `git clone` 只顯示第一行 `Cloning into 'calculator-app'...`（從 GitHub 下載時，後面還會有幾行下載進度）。
- 第 4 集的 `git revert` 省略一行 `Date: ...`（只因為 `replay.sh` 固定了時間才會出現）。
- 在 GitHub 網頁上的操作，終端機會以 `#` 開頭的註解表示，例如 `# 在 GitHub 建立 Pull Request #3`。

每一集都有一個 `replay.sh`，可以重新執行一次影片中的指令，讓你自己對照：

```bash
./episodes/02-git-basic-flow/replay.sh <calculator-app 的本機路徑>
```

結尾會用 ✓ 標示哪些 hash 和 calculator-app 相同。

這個腳本只在暫存資料夾裡操作，不會修改你的 calculator-app。

## 資料夾結構

```
lib/reel.js                  所有集數共用的動畫程式（時間軸、終端機、卡片、說明文字）
lib/reel.css                 所有集數共用的版面樣式
episodes/<集數>/scene.html   每一集的動畫畫面：卡片內容和時間軸
episodes/<集數>/replay.sh    重新執行該集指令，驗證輸出
lib/graph.js                 共用的 commit 圖形和小計算機畫法
tools/record.mjs             用瀏覽器逐格錄製畫面
tools/replay-lib.sh          replay.sh 共用的工具
tools/calc-test.mjs          用真正的 script.js 跑講義 6.1 的記憶功能測試
tools/build-full.sh          把 8 集接成完整版，合併字幕、加上章節
full/title.html              完整版的開頭目錄卡
handout/                     修正後的講義和修訂說明
tools/sfx.py                 合成音效、輸出字幕檔
build.sh                     一次完成錄製、音效、合併
videos/                      完成的影片和字幕
```

## 製作原理

1. **畫面是一個網頁**：`scene.html` 提供一個 `render(t)` 函式，只要給它時間 `t`（秒），就畫出那一瞬間的畫面。因為畫面完全由時間決定，每次錄出來的結果都一樣，不會掉格。共用的部分放在 `lib/`，每一集只需要寫自己的卡片內容和時間軸。
2. **逐格錄製**：`record.mjs` 用 Playwright（自動操作瀏覽器的工具）打開網頁，每秒 30 格，一格一格截圖，再交給 ffmpeg（影音處理工具）壓成 MP4。
3. **音效和字幕**：網頁同時提供每次檔案移動、切換步驟的時間點。`sfx.py` 依照這些時間點用程式合成轉場音效（打字時沒有聲音），並依照網頁裡的字幕句子產生 `.srt` 字幕檔。

## 自己重新製作影片

需要的軟體：

- Node.js 18 以上，並執行 `npm install`（會安裝 Playwright）
- Playwright 的 Chromium 瀏覽器：`npx playwright install chromium`
- ffmpeg
- Python 3 和 numpy
- 網路連線（畫面會從 Google Fonts 載入 Noto Sans TC 和 JetBrains Mono 字型）

執行：

```bash
./build.sh 02-git-basic-flow
```

## 修改內容

- **字幕和旁白句子**：在 `scene.html` 裡搜尋 `cue(`，每一句字幕都寫在那裡，時間會自動對齊畫面。
- **畫面下方的說明文字**：在 `scene.html` 裡 `Reel.setup` 的 `caps`（每個步驟）、`intro`（開頭）和 `outro`（結尾）。
- **音效音量**：在 `tools/sfx.py` 的 `LEVEL`，每一種音效可以分別調整。
- **節奏快慢**：在 `scene.html` 的時間軸（timeline）區塊，調整 `wait(秒數)`。
- **預覽單張畫面**：`node tools/record.mjs episodes/02-git-basic-flow/scene.html preview build/preview 5 20 40`，會輸出第 5、20、40 秒的截圖。

## 製作時發現的講義問題

實際執行講義的指令時，發現有幾個地方的結果和講義寫的不一樣，例如 6.1 的測試步驟、7.6 的本機測試方法、8.4 的刪除分支。影片都照實際的結果呈現，講義也已經修正，詳見 [handout/CHANGES.md](handout/CHANGES.md)。
