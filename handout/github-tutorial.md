# GitHub 實戰教學 - 完整指令與程式碼範例

本文件提供簡報中每個步驟的具體Git指令與程式碼範例，方便學生跟隨操作。

---

## 步驟1：建立專案基礎並完成首次部署

### 1.1 在GitHub上建立私人Repository

1. 登入GitHub網站
2. 點擊右上角的 `+` 按鈕，選擇 `New repository`
3. 填寫repository資訊：
   - Repository name: `calculator-app`
   - Description: `Simple calculator web application`
   - 選擇 `Private`
   - 勾選 `Add a README file`
4. 點擊 `Create repository`

> **注意**：GitHub 免費帳號的 Private repository 不能使用 GitHub Pages（1.5）。如果要完成 1.5，請改選 `Public`，或先申請 [GitHub Student Developer Pack](https://education.github.com/pack)（內含 GitHub Pro，Private repository 也能使用 Pages）。

### 1.2 Clone Repository到本地

```bash
# 複製repository URL後執行
git clone https://github.com/your-username/calculator-app.git

# 進入專案目錄
cd calculator-app
```

### 1.3 建立專案檔案

#### index.html
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>簡易計算機</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('/')">/</button>
            <button onclick="appendToDisplay('*')">*</button>
            <button onclick="deleteLast()">←</button>
            
            <button onclick="appendToDisplay('7')">7</button>
            <button onclick="appendToDisplay('8')">8</button>
            <button onclick="appendToDisplay('9')">9</button>
            <button onclick="appendToDisplay('-')">-</button>
            
            <button onclick="appendToDisplay('4')">4</button>
            <button onclick="appendToDisplay('5')">5</button>
            <button onclick="appendToDisplay('6')">6</button>
            <button onclick="appendToDisplay('+')">+</button>
            
            <button onclick="appendToDisplay('1')">1</button>
            <button onclick="appendToDisplay('2')">2</button>
            <button onclick="appendToDisplay('3')">3</button>
            <button onclick="calculate()" class="equals">=</button>
            
            <button onclick="appendToDisplay('0')" class="zero">0</button>
            <button onclick="appendToDisplay('.')">.</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### style.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

.calculator {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 320px;
}

.display {
    background: #222;
    color: #fff;
    font-size: 2em;
    padding: 20px;
    text-align: right;
    border-radius: 5px;
    margin-bottom: 10px;
    min-height: 60px;
    word-wrap: break-word;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button {
    padding: 20px;
    font-size: 1.2em;
    border: none;
    background: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #e0e0e0;
}

button:active {
    transform: scale(0.95);
}

.equals {
    background: #667eea;
    color: white;
    grid-row: span 2;
}

.equals:hover {
    background: #5568d3;
}

.zero {
    grid-column: span 2;
}
```

#### script.js
```javascript
let display = document.getElementById('display');
let currentInput = '0';

function updateDisplay() {
    display.textContent = currentInput;
}

function appendToDisplay(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        currentInput = eval(currentInput).toString();
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}
```

### 1.4 首次Commit與Push

```bash
# 查看檔案狀態
git status

# 將所有檔案加入暫存區
git add .

# 或者個別加入檔案
git add index.html style.css script.js

# 建立commit
git commit -m "Initial calculator with basic operations"

# 推送到GitHub
git push origin main
```

### 1.5 啟用GitHub Pages

1. 前往GitHub repository頁面
2. 點擊 `Settings`
3. 在左側選單找到 `Pages`
4. 在 `Build and deployment` 的 `Source` 選擇 `Deploy from a branch`
5. 在 `Branch` 下拉選單選擇 `main`，資料夾選 `/ (root)`，再點擊 `Save`
6. 等待幾分鐘後，訪問 `https://your-username.github.io/calculator-app/`

---

## 步驟2：透過樣式調整熟悉基本Git操作流程

### 2.1 修改CSS樣式

修改 `style.css`，例如改變按鈕顏色：

```css
/* 修改 button 的背景色 */
button {
    padding: 20px;
    font-size: 1.2em;
    border: none;
    background: #e3f2fd;  /* 改為淺藍色 */
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #bbdefb;  /* hover時的顏色 */
}

/* 修改等號按鈕的顏色 */
.equals {
    background: #2196f3;  /* 改為藍色 */
    color: white;
    grid-row: span 2;
}

.equals:hover {
    background: #1976d2;
}
```

### 2.2 Git基本操作

```bash
# 查看變更狀態
git status

# 查看具體變更內容
git diff style.css

# 將變更加入暫存區
git add style.css

# 查看暫存區狀態
git status

# 建立commit
git commit -m "Update button colors to blue theme"

# 查看commit歷史
git log

# 查看簡潔版本的commit歷史
git log --oneline

# 推送到遠端
git push origin main
```

### 2.3 查看遠端repository資訊

```bash
# 查看遠端repository
git remote -v

# 查看遠端分支
git branch -r

# 查看所有分支（本地+遠端）
git branch -a
```

---

## 步驟3：使用Pull Request實現程式碼審查機制

### 3.1 建立新分支並開發功能

```bash
# 建立並切換到新分支
git checkout -b feature/percentage-button

# 或者分兩步執行
git branch feature/percentage-button
git checkout feature/percentage-button

# 確認當前分支
git branch
```

### 3.2 修改程式碼：增加百分比功能

修改 `index.html`，在按鈕區域增加百分比按鈕：

```html
<!-- 在 C 按鈕後面增加 % 按鈕 -->
<button onclick="clearDisplay()">C</button>
<button onclick="calculatePercentage()">%</button>
<button onclick="appendToDisplay('/')">/</button>
<button onclick="appendToDisplay('*')">*</button>
```

> **說明**：按鈕區每一排有 4 格。加上 % 按鈕後，`←` 會被擠到第二排，後面的按鈕也會依序往後移一格。這是正常的結果，計算功能不受影響。

修改 `script.js`，增加百分比計算函數：

```javascript
// 在 script.js 末尾增加
function calculatePercentage() {
    try {
        currentInput = (eval(currentInput) / 100).toString();
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}
```

### 3.3 提交變更並推送分支

```bash
# 查看變更
git status

# 加入暫存區
git add index.html script.js

# 提交變更
git commit -m "Add percentage calculation button"

# 推送分支到遠端
git push origin feature/percentage-button
```

### 3.4 在GitHub上建立Pull Request

1. 前往GitHub repository頁面
2. 會看到提示 `Compare & pull request` 按鈕，點擊它
3. 填寫PR資訊：
   - Title: `Add percentage calculation feature`
   - Description:
     ```
     ## 變更內容
     - 新增百分比按鈕到計算機介面
     - 實作百分比計算功能
     
     ## 測試項目
     - [x] 百分比按鈕正常顯示
     - [x] 點擊%按鈕能正確計算百分比
     - [x] 錯誤處理正常運作
     ```
4. 點擊 `Create pull request`

### 3.5 審查與合併PR

1. 在PR頁面查看 `Files changed` 標籤，檢視程式碼變更
2. 可以在程式碼行號旁邊點擊 `+` 號添加評論
3. 確認無誤後，點擊 `Merge pull request`
4. 點擊 `Confirm merge`
5. 可選：點擊 `Delete branch` 刪除遠端的feature分支

### 3.6 更新本地main分支

```bash
# 切換回main分支
git checkout main

# 拉取最新變更
git pull origin main

# 刪除本地的feature分支（可選）
git branch -d feature/percentage-button
```

---

## 步驟4：學會版本倒退以應對錯誤情況

### 4.1 模擬錯誤：刪除重要函數

修改 `script.js`，故意刪除 `calculate()` 函數：

```javascript
// 故意註解掉或刪除這個函數
/*
function calculate() {
    try {
        currentInput = eval(currentInput).toString();
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}
*/
```

### 4.2 提交錯誤的變更

```bash
# 加入變更
git add script.js

# 提交錯誤
git commit -m "Update script (contains bug)"

# 推送到遠端
git push origin main
```

### 4.3 查看Commit歷史

```bash
# 查看詳細歷史
git log

# 查看簡潔版本
git log --oneline

# 查看最近3個commit
git log --oneline -3

# 輸出範例（你的 commit 編號會不同）：
# 361b398 (HEAD -> main, origin/main) Update script (contains bug)
# e5e29b9 Merge pull request #1 from your-username/feature/percentage-button
# 17bde93 Add percentage calculation button
#
# 361b398 是有錯誤的 commit；它前面的 e5e29b9 是步驟 3 合併 PR 產生的 commit
```

### 4.4 方法一：使用git revert（推薦）

```bash
# 撤銷最新的commit（使用commit ID）
git revert 361b398

# 或者撤銷最新的commit（使用HEAD）
git revert HEAD

# Git會打開編輯器讓你編輯commit訊息
# 預設訊息為：Revert "Update script (contains bug)"
# 保存並關閉編輯器

# 推送到遠端
git push origin main

# 查看歷史，會看到新增了一個revert commit
git log --oneline
```

### 4.5 方法二：使用git reset（謹慎使用）

> **注意**：4.4 和 4.5 是兩種不同的方法，擇一使用即可。如果已經做了 4.4 的 revert，再做 4.5 的 `reset --hard`，會連 revert 的 commit 一起丟掉。

```bash
# 查看要回退到的commit ID
git log --oneline

# 以下的 e5e29b9 是出錯之前的 commit（4.3 輸出中的第二行）

# 軟重置：保留變更在暫存區
git reset --soft e5e29b9

# 混合重置：保留變更在工作區，清空暫存區（預設）
git reset --mixed e5e29b9
# 或簡寫為
git reset e5e29b9

# 硬重置：完全刪除變更（危險！）
git reset --hard e5e29b9

# 強制推送到遠端（會改寫歷史，影響其他協作者）
git push -f origin main
```

### 4.6 比較兩種方法

```bash
# revert：建立新commit來撤銷
# 優點：保留完整歷史，安全
# 缺點：會增加commit數量

# reset：直接回到過去的commit
# 優點：歷史乾淨
# 缺點：會改寫歷史，可能影響協作者
```

---

## 步驟5：使用分支策略開發新功能（記憶功能）

### 5.1 建立功能分支

```bash
# 確保在main分支且是最新版本
git checkout main
git pull origin main

# 建立並切換到新分支
git checkout -b feature/memory-function

# 確認當前分支
git branch
```

### 5.2 修改index.html：增加記憶按鈕

在計算機按鈕區域增加記憶功能按鈕：

```html
<div class="calculator">
    <div class="display" id="display">0</div>
    
    <!-- 新增記憶功能區 -->
    <div class="memory-buttons">
        <button onclick="memoryAdd()" class="memory-btn">M+</button>
        <button onclick="memorySubtract()" class="memory-btn">M-</button>
        <button onclick="memoryRecall()" class="memory-btn">MR</button>
        <button onclick="memoryClear()" class="memory-btn">MC</button>
    </div>
    
    <div class="buttons">
        <!-- 原有按鈕 -->
        ...
    </div>
</div>
```

### 5.3 修改style.css：記憶按鈕樣式

```css
/* 新增記憶按鈕樣式 */
.memory-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 10px;
}

.memory-btn {
    padding: 15px;
    font-size: 1em;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.memory-btn:hover {
    background: #f57c00;
}

.memory-btn:active {
    transform: scale(0.95);
}
```

### 5.4 修改script.js：實作記憶功能

```javascript
// 在檔案開頭增加記憶變數
let display = document.getElementById('display');
let currentInput = '0';
let memoryValue = 0;  // 新增記憶變數

// ... 原有函數 ...

// 新增記憶功能函數
function memoryAdd() {
    try {
        let currentValue = eval(currentInput);
        memoryValue += currentValue;
        console.log('Memory:', memoryValue);
        // 可選：顯示提示
        showMemoryIndicator();
    } catch (error) {
        console.error('Memory add error:', error);
    }
}

function memorySubtract() {
    try {
        let currentValue = eval(currentInput);
        memoryValue -= currentValue;
        console.log('Memory:', memoryValue);
        showMemoryIndicator();
    } catch (error) {
        console.error('Memory subtract error:', error);
    }
}

function memoryRecall() {
    currentInput = memoryValue.toString();
    updateDisplay();
}

function memoryClear() {
    memoryValue = 0;
    console.log('Memory cleared');
    hideMemoryIndicator();
}

// 可選：顯示記憶指示器
function showMemoryIndicator() {
    display.style.borderLeft = '5px solid #ff9800';
}

function hideMemoryIndicator() {
    display.style.borderLeft = 'none';
}
```

### 5.5 分階段提交

```bash
# 第一次提交：UI部分
git add index.html style.css
git commit -m "Add memory buttons UI"

# 第二次提交：功能實作
git add script.js
git commit -m "Implement M+, M-, MR, MC functions"

# 查看commit歷史
git log --oneline

# 推送分支到遠端
git push origin feature/memory-function
```

### 5.6 本地測試

```bash
# 在本地開啟index.html測試記憶功能
# 或者使用簡單的HTTP伺服器
python3 -m http.server 8000

# 在瀏覽器訪問 http://localhost:8000
```

### 5.7 查看分支狀態

```bash
# 查看所有分支
git branch -a

# 查看分支差異
git diff main feature/memory-function

# 查看分支的commit差異
git log main..feature/memory-function
```

---

## 步驟6：完整測試後透過Pull Request合併新功能

### 6.1 完整測試清單

測試以下情境並記錄結果：

> **注意**：按完 M+ 或 M- 之後，畫面上的數字不會自動清掉。這時直接輸入新數字，數字會接在後面（例如 5 後面輸入 3 會變成 53）。所以輸入新數字前，要先按 `C` 清除畫面。

```bash
# 測試1：M+ 累加
# 操作：輸入 5 → M+ → C → 輸入 3 → M+ → MR
# 預期結果：顯示 8

# 測試2：M- 減去
# 操作：MC → 輸入 10 → M+ → C → 輸入 3 → M- → MR
# 預期結果：顯示 7

# 測試3：MR 讀取
# 操作：MC → 輸入 15 → M+ → C → MR
# 預期結果：顯示 15

# 測試4：MC 清除
# 操作：輸入 20 → M+ → MC → MR
# 預期結果：顯示 0

# 測試5：組合使用
# 操作：MC → 5 → M+ → C → 10 → M+ → C → 3 → M- → MR
# 預期結果：顯示 12
```

### 6.2 建立Pull Request

```bash
# 確保所有變更都已提交
git status

# 推送最新版本
git push origin feature/memory-function
```

在GitHub上建立PR，使用以下模板：

```markdown
## 功能說明
新增計算機記憶功能，包含 M+、M-、MR、MC 四個按鈕。

## 變更內容
- 新增記憶功能按鈕UI（橘色主題）
- 實作記憶值的累加、減去、讀取、清除功能
- 增加記憶狀態視覺指示器（左側橘色邊框）

## 測試清單
- [x] M+ 功能正常累加數值
- [x] M- 功能正常減去數值
- [x] MR 正確讀取記憶值
- [x] MC 完全清除記憶
- [x] 組合使用情境測試通過
- [x] 錯誤處理正常運作
- [x] 視覺指示器正常顯示/隱藏

## 截圖
（可選：附上功能截圖）

## 相關Issue
無

## 檢查項目
- [x] 程式碼已通過本地測試
- [x] 無console錯誤
- [x] 程式碼符合專案風格
- [x] 已更新相關文件（如需要）
```

### 6.3 Code Review檢查清單

審查者應檢查：

```bash
# 1. 查看程式碼變更
# 在GitHub PR頁面點擊 "Files changed"

# 2. 檢查項目：
# - 變數命名是否清晰（memoryValue）
# - 函數功能是否單一
# - 是否有適當的錯誤處理
# - CSS樣式是否與現有風格一致
# - 是否有console.log需要移除

# 3. 測試功能
# - 在本地checkout該分支進行測試
git fetch origin
git checkout feature/memory-function

# 4. 提供回饋
# - 在程式碼行號旁點擊 + 號添加評論
# - 或在PR頁面添加整體評論
```

### 6.4 合併PR

```bash
# 在GitHub上點擊 "Merge pull request"
# 選擇合併方式：
# - Create a merge commit（預設，保留所有commit）
# - Squash and merge（壓縮成一個commit）
# - Rebase and merge（重新套用commit）

# 推薦使用 "Create a merge commit"
```

### 6.5 更新本地main分支

```bash
# 切換回main分支
git checkout main

# 拉取最新變更
git pull origin main

# 查看合併後的歷史
git log --oneline --graph

# 刪除本地feature分支
git branch -d feature/memory-function

# 刪除遠端feature分支（如果GitHub上沒有自動刪除）
git push origin --delete feature/memory-function
```

---

## 步驟7：實作A/B測試比較兩種設計方案

### 7.1 建立版本1分支（按鈕式設計）

```bash
# 確保在最新的main分支
git checkout main
git pull origin main

# 建立版本1分支
git checkout -b feature/scientific-v1
```

### 7.2 版本1：實作按鈕式科學計算

修改 `index.html`：

```html
<div class="calculator">
    <div class="display" id="display">0</div>
    
    <div class="memory-buttons">
        <!-- 記憶按鈕 -->
    </div>
    
    <!-- 新增科學計算按鈕區 -->
    <div class="scientific-buttons">
        <button onclick="scientificCalc('sin')">sin</button>
        <button onclick="scientificCalc('cos')">cos</button>
        <button onclick="scientificCalc('tan')">tan</button>
        <button onclick="scientificCalc('log')">log</button>
        <button onclick="scientificCalc('sqrt')">√</button>
        <button onclick="scientificCalc('pow')">x²</button>
    </div>
    
    <div class="buttons">
        <!-- 原有按鈕 -->
    </div>
</div>
```

修改 `style.css`：

```css
/* 科學計算按鈕樣式 */
.scientific-buttons {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    margin-bottom: 10px;
}

.scientific-buttons button {
    padding: 12px 8px;
    font-size: 0.9em;
    background: #4caf50;
    color: white;
}

.scientific-buttons button:hover {
    background: #45a049;
}
```

修改 `script.js`：

```javascript
// 新增科學計算函數
function scientificCalc(operation) {
    try {
        let value = eval(currentInput);
        let result;
        
        switch(operation) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            default:
                result = value;
        }
        
        currentInput = result.toString();
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}
```

提交版本1：

```bash
git add .
git commit -m "Add scientific calculator - button style (v1)"
git push origin feature/scientific-v1
```

### 7.3 建立版本2分支（下拉選單式設計）

```bash
# 回到main分支
git checkout main

# 建立版本2分支
git checkout -b feature/scientific-v2
```

### 7.4 版本2：實作下拉選單式科學計算

修改 `index.html`：

```html
<div class="calculator">
    <div class="display" id="display">0</div>
    
    <div class="memory-buttons">
        <!-- 記憶按鈕 -->
    </div>
    
    <!-- 新增科學計算選單 -->
    <div class="scientific-dropdown">
        <select id="scientificOp" onchange="applyScientificOp()">
            <option value="">選擇科學計算...</option>
            <option value="sin">sin (正弦)</option>
            <option value="cos">cos (餘弦)</option>
            <option value="tan">tan (正切)</option>
            <option value="log">log (對數)</option>
            <option value="sqrt">√ (平方根)</option>
            <option value="pow">x² (平方)</option>
        </select>
    </div>
    
    <div class="buttons">
        <!-- 原有按鈕 -->
    </div>
</div>
```

修改 `style.css`：

```css
/* 科學計算下拉選單樣式 */
.scientific-dropdown {
    margin-bottom: 10px;
}

.scientific-dropdown select {
    width: 100%;
    padding: 12px;
    font-size: 1em;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.scientific-dropdown select:focus {
    outline: 2px solid #45a049;
}

.scientific-dropdown option {
    background: white;
    color: #333;
}
```

修改 `script.js`：

```javascript
// 新增科學計算函數（下拉選單版本）
function applyScientificOp() {
    let select = document.getElementById('scientificOp');
    let operation = select.value;
    
    if (!operation) return;
    
    try {
        let value = eval(currentInput);
        let result;
        
        switch(operation) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            default:
                result = value;
        }
        
        currentInput = result.toString();
        updateDisplay();
        
        // 重置選單
        select.value = '';
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(() => {
            currentInput = '0';
            updateDisplay();
        }, 1500);
    }
}
```

提交版本2：

```bash
git add .
git commit -m "Add scientific calculator - dropdown style (v2)"
git push origin feature/scientific-v2
```

### 7.5 比較兩個版本

```bash
# 查看所有分支
git branch -a

# 比較兩個分支的差異
git diff feature/scientific-v1 feature/scientific-v2

# 切換分支進行測試
git checkout feature/scientific-v1
# 測試版本1

git checkout feature/scientific-v2
# 測試版本2
```

### 7.6 部署兩個版本進行測試

方法1：使用不同的GitHub Pages分支

> **注意**：一個 repository 同一時間只能用 GitHub Pages 發布**一個**分支。建立兩個分支之後，要在 `Settings` → `Pages` 的 `Branch` 輪流切換成 `gh-pages-v1`、`gh-pages-v2`，分別測試；無法同時上線兩個版本。想同時比較，請用方法2。

```bash
# 版本1部署到gh-pages-v1分支
git checkout feature/scientific-v1
git checkout -b gh-pages-v1
git push origin gh-pages-v1

# 版本2部署到gh-pages-v2分支
git checkout feature/scientific-v2
git checkout -b gh-pages-v2
git push origin gh-pages-v2
```

方法2：本地測試

在同一個資料夾裡切換分支，兩個伺服器讀到的是同一份檔案：終端機2 切到版本2 之後，終端機1 看到的也會變成版本2。所以要用 `git worktree` 把兩個版本放在不同的資料夾。

```bash
# 先回到 main（正在使用中的分支，不能再放進另一個資料夾）
git checkout main

# 建立兩個資料夾，各放一個版本
git worktree add ../calculator-v1 feature/scientific-v1
git worktree add ../calculator-v2 feature/scientific-v2

# 終端機1：測試版本1
cd ../calculator-v1
python3 -m http.server 8001

# 終端機2：測試版本2
cd ../calculator-v2
python3 -m http.server 8002

# 在瀏覽器分別訪問：
# http://localhost:8001
# http://localhost:8002

# 測試完成後（按 Ctrl+C 停止伺服器），回到 calculator-app 移除這兩個資料夾
git worktree remove ../calculator-v1
git worktree remove ../calculator-v2
```

---

## 步驟8：評估測試結果並合併最佳方案

### 8.1 收集測試回饋

建立測試回饋表格：

```markdown
| 評估標準 | 版本1（按鈕式） | 版本2（下拉選單） | 備註 |
|---------|---------------|----------------|------|
| 操作直覺性 | ★★★★☆ | ★★★★★ | v2操作流程更清晰 |
| 介面美觀度 | ★★★☆☆ | ★★★★★ | v2介面更簡潔 |
| 功能易用性 | ★★★★☆ | ★★★★☆ | 兩者相當 |
| 使用者偏好 | ★★★☆☆ | ★★★★★ | 多數使用者偏好v2 |
```

### 8.2 決策：選擇版本2

```bash
# 切換到main分支
git checkout main

# 確保main分支是最新的
git pull origin main
```

### 8.3 合併選定的版本

如果 main 在建立分支之後沒有新的 commit，Git 會直接把 main「快轉」（Fast-forward）到版本2 的 commit，不會產生合併 commit，也不會有衝突。

```bash
# 合併版本2到main
git merge feature/scientific-v2

# 如果有衝突，解決衝突後：
git add .
git commit -m "Merge scientific calculator v2 (dropdown style)"

# 推送到遠端
git push origin main
```

### 8.4 刪除未採用的分支

```bash
# 刪除本地分支
# 版本1 沒有合併進 main，用 -d 會被拒絕：
#   error: the branch 'feature/scientific-v1' is not fully merged.
# 確定不要了，才用 -D 強制刪除（兩者的差別見最後的「延伸閱讀」）
git branch -D feature/scientific-v1
git branch -d feature/scientific-v2

# 刪除遠端分支
git push origin --delete feature/scientific-v1
git push origin --delete feature/scientific-v2

# 如果建立了測試用的gh-pages分支，也一併刪除
git push origin --delete gh-pages-v1
git push origin --delete gh-pages-v2
```

### 8.5 驗證部署

```bash
# 等待GitHub Pages更新（約1-2分鐘）
# 訪問 https://your-username.github.io/calculator-app/
# 確認新功能已上線
```

### 8.6 標記重要版本（可選）

```bash
# 為這個重要版本打上tag
git tag -a v2.0 -m "Version 2.0: Add scientific calculator with dropdown interface"

# 推送tag到遠端
git push origin v2.0

# 查看所有tag
git tag

# 查看特定tag的詳細資訊
git show v2.0
```

---

## 進階Git指令與技巧

### 查看與比較

```bash
# 查看特定檔案的修改歷史
git log --follow -- script.js

# 查看特定檔案在某個commit的內容
git show commit-id:script.js

# 比較工作區與暫存區
git diff

# 比較暫存區與最新commit
git diff --staged

# 比較兩個commit
git diff commit1 commit2

# 查看分支圖
git log --oneline --graph --all
```

### 暫存工作進度

```bash
# 暫存當前變更
git stash

# 查看stash列表
git stash list

# 恢復最新的stash
git stash pop

# 恢復特定的stash
git stash apply stash@{0}

# 刪除stash
git stash drop stash@{0}
```

### 修改Commit

```bash
# 修改最新的commit訊息
git commit --amend -m "New commit message"

# 將新變更加入最新的commit
git add forgotten-file.js
git commit --amend --no-edit

# 互動式rebase（整理commit歷史）
git rebase -i HEAD~3
```

### 分支管理

```bash
# 重新命名分支
git branch -m old-name new-name

# 查看已合併的分支
git branch --merged

# 查看未合併的分支
git branch --no-merged

# 強制刪除未合併的分支
git branch -D branch-name
```

### 遠端操作

```bash
# 查看遠端詳細資訊
git remote show origin

# 修改遠端URL
git remote set-url origin new-url

# 拉取遠端所有分支
git fetch --all

# 清理已刪除的遠端分支參考
git remote prune origin
```

### 疑難排解

```bash
# 查看reflog（操作歷史）
git reflog

# 恢復被刪除的commit：從 reflog 找到 commit-id，替它建立一個分支
git branch recovered-work commit-id

# 取消add（從暫存區移除）
git reset HEAD file.js

# 放棄工作區的變更
git checkout -- file.js

# 或使用新語法
git restore file.js

# 放棄暫存區的變更
git restore --staged file.js
```

---

## Git最佳實踐總結

### Commit訊息規範

```bash
# 好的commit訊息範例：
git commit -m "Add user authentication feature"
git commit -m "Fix calculation error in percentage function"
git commit -m "Update button styles for better accessibility"
git commit -m "Remove deprecated API calls"

# 避免的commit訊息：
# "update"
# "fix bug"
# "changes"
# "asdfasdf"
```

### 分支命名規範

```bash
# 功能開發
feature/user-login
feature/payment-integration

# Bug修復
bugfix/calculation-error
bugfix/memory-leak

# 緊急修復
hotfix/security-vulnerability
hotfix/production-crash

# 實驗性功能
experiment/new-ui-design
```

### 工作流程範本

```bash
# 1. 開始新功能
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 開發與提交
# ... 進行開發 ...
git add .
git commit -m "Descriptive commit message"

# 3. 推送並建立PR
git push origin feature/new-feature
# 在GitHub上建立Pull Request

# 4. 審查與合併
# 在GitHub上進行code review
# 合併PR

# 5. 清理
git checkout main
git pull origin main
git branch -d feature/new-feature
```

---

## 常見問題與解決方案

### Q1: 如何撤銷已經push的commit？

```bash
# 方法1：使用revert（推薦）
git revert commit-id
git push origin main

# 方法2：使用reset（需要強制推送）
git reset --hard commit-id
git push -f origin main
```

### Q2: 如何解決merge衝突？

```bash
# 1. 嘗試合併
git merge feature-branch

# 2. 如果有衝突，Git會提示哪些檔案有衝突
# 3. 打開衝突檔案，會看到：
# <<<<<<< HEAD
# 當前分支的內容
# =======
# 要合併的分支的內容
# >>>>>>> feature-branch

# 4. 手動編輯檔案，保留需要的內容
# 5. 標記為已解決
git add conflicted-file.js

# 6. 完成合併
git commit -m "Resolve merge conflict"
```

### Q3: 如何同步fork的repository？

```bash
# 1. 添加上游repository
git remote add upstream https://github.com/original-owner/original-repo.git

# 2. 拉取上游變更
git fetch upstream

# 3. 合併到本地main
git checkout main
git merge upstream/main

# 4. 推送到自己的fork
git push origin main
```

### Q4: 如何查看誰修改了某一行程式碼？

```bash
# 使用blame命令
git blame script.js

# 查看特定行範圍
git blame -L 10,20 script.js

# 查看特定commit之前的狀態
git blame commit-id^ -- script.js
```

---

## 結語

本文件提供了完整的Git指令與程式碼範例，涵蓋從基礎到進階的所有操作。建議按照順序練習每個步驟，並在實際專案中應用這些技巧。記住：

1. **經常commit**：小步快跑，每個功能點都commit
2. **清晰的訊息**：讓未來的自己和團隊成員能理解你的變更
3. **使用分支**：保持main分支的穩定性
4. **定期同步**：避免大規模衝突
5. **審查程式碼**：透過PR提升程式碼品質

祝學習愉快！

---

## 延伸閱讀

### git branch -d 和 -D 有什麼不同？

兩個指令都會刪除分支。差別在於：**刪除前，Git 會不會先幫你檢查。**

| 指令 | 完整寫法 | Git 會做什麼 |
|------|---------|-------------|
| `git branch -d` | `--delete` | 先檢查這個分支是否**已經合併**。已合併才刪除；沒有合併就拒絕。 |
| `git branch -D` | `--delete --force` | 不檢查，直接刪除。 |

#### 為什麼要檢查「有沒有合併」？

分支就像貼在某個 commit 上的**名牌**。刪除分支只是撕掉名牌，commit 本身不會馬上消失。

- **已經合併的分支**：它的 commit 已經是 main 歷史的一部分。撕掉名牌後，從 main 往回找，還是找得到這些 commit。所以刪除很安全，`-d` 會直接刪除。
- **沒有合併的分支**：只有這個名牌指向它的 commit。撕掉之後，就沒有任何分支找得到這些 commit 了。所以 `-d` 會拒絕刪除，提醒你可能會失去工作成果。

#### 以步驟 8 為例

- **版本 2** 已經合併進 main，所以 `git branch -d feature/scientific-v2` 可以直接刪除。
- **版本 1** 沒有合併，所以 `git branch -d feature/scientific-v1` 會出現錯誤：

```bash
error: the branch 'feature/scientific-v1' is not fully merged.
If you are sure you want to delete it, run 'git branch -D feature/scientific-v1'
```

因為已經決定不採用版本 1，所以改用 `-D` 強制刪除。

#### 使用建議

- **平常一律先用 `-d`**：它是安全的做法。如果被拒絕，正好提醒你：「這個分支還有沒合併的內容，確定不要了嗎？」
- **確定內容不要了，才用 `-D`**：例如 A/B 測試中沒有被採用的版本，或是失敗的實驗。

#### 用 -D 刪錯了怎麼辦？

刪除時，Git 會印出這個分支最後的 commit 編號：

```bash
$ git branch -D feature/scientific-v1
Deleted branch feature/scientific-v1 (was 2e272ca).
```

括號裡的 `2e272ca` 就是救回分支需要的編號。用它重新建立分支即可：

```bash
git branch feature/scientific-v1 2e272ca
```

如果當時沒有記下編號，可以用 `git reflog` 找。它會列出 HEAD（目前所在位置）最近走過的每一個 commit：

```bash
$ git reflog
0e86477 HEAD@{0}: checkout: moving from feature/scientific-v1 to main
2e272ca HEAD@{1}: commit: Add scientific calculator - button style (v1)
...
```

注意：

- 預設情況下，大約 **30 天**內都還救得回來。之後 Git 會自動清理這些沒有分支的 commit，所以發現刪錯時要盡快處理。
- `git reflog` 只記錄**你自己電腦上**的操作。如果分支已經 push 到 GitHub，而且 GitHub 上的分支還沒刪除，也可以從 GitHub 重新取回。
