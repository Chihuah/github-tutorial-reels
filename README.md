# GitHub 實戰教學短片（Reels）

這個 repo 放的是「GitHub 實戰教學」講義的直式教學短片，以及製作這些影片的程式。

- 講義網站：<https://github-tutorial.scholarverse.cc>
- 示範用的專案：[Chihuah/calculator-app](https://github.com/Chihuah/calculator-app)

每支影片都是 **直式 9:16（1080×1920）**，適合放在手機短影音平台。影片只有轉場音效（打字時沒有聲音），另外附一份字幕檔（`.srt`），之後可以拿來配旁白。

## 影片列表

| 集數 | 講義段落 | 影片 | 字幕 |
|---|---|---|---|
| 02 | 步驟 2：透過樣式調整熟悉基本 Git 操作流程 | [02-git-basic-flow.mp4](videos/02-git-basic-flow.mp4) | [02-git-basic-flow.srt](videos/02-git-basic-flow.srt) |
| 03 | 步驟 3：使用 Pull Request 實現程式碼審查機制 | [03-pull-request.mp4](videos/03-pull-request.mp4) | [03-pull-request.srt](videos/03-pull-request.srt) |

## 畫面上的輸出都是真的

影片裡終端機顯示的每一行輸出、每一個 commit 編號（hash），都是在 calculator-app 上實際執行指令得到的結果。例如步驟 2 的 commit `7434ffb`，就是 calculator-app 歷史紀錄裡的同一個 commit。

在 GitHub 網頁上完成的操作（例如合併 Pull Request），終端機無法重現。這類畫面使用 GitHub 上的真實資料：步驟 3 的 PR #1 標題、修改的檔案數和行數，以及合併後產生的 commit `e5e29b9`，都和 calculator-app 的實際紀錄相同。

為了讓手機上看得清楚，畫面有做兩種精簡：

- `git status` 省略括號裡的提示行。
- `git diff` 只保留主要的修改行，省略檔頭和沒有修改的行。
- 遠端網址顯示為 `https://github.com/Chihuah/calculator-app.git`（`replay.sh` 用本機資料夾代替 GitHub，所以這一行的網址會不同）。

每一集都有一個 `replay.sh`，可以重新執行一次影片中的指令，讓你自己對照：

```bash
./episodes/02-git-basic-flow/replay.sh <calculator-app 的本機路徑>
```

這個腳本只在暫存資料夾裡操作，不會修改你的 calculator-app。

## 資料夾結構

```
lib/reel.js                  所有集數共用的動畫程式（時間軸、終端機、卡片、說明文字）
lib/reel.css                 所有集數共用的版面樣式
episodes/<集數>/scene.html   每一集的動畫畫面：卡片內容和時間軸
episodes/<集數>/replay.sh    重新執行該集指令，驗證輸出
tools/record.mjs             用瀏覽器逐格錄製畫面
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
