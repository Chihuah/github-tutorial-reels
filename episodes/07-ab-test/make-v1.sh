# build_v1: write the version-1 files (button style, handout 7.2) into the current
# directory, starting from main after step 6 (0e86477). Sourced by the 07 and 08 replays.
# Like version 2 (89553d4), the new code goes after the memory buttons and at the end
# of style.css / script.js, and the files keep ending without a newline.
V1_DATE=1763433300   # fixed time, between PR #3 (0e86477) and version 2 (89553d4)

build_v1() {
  git show 0e86477:index.html | awk '
    {print}
    /class="memory-btn">MC</ {mc=1}
    mc && /^        <\/div>$/ {getline; print;
      print "        <!-- 新增科學計算按鈕區 -->"
      print "        <div class=\"scientific-buttons\">"
      n=split("sin cos tan log sqrt pow", ops, " "); split("sin cos tan log √ x²", labels, " ")
      for (i=1;i<=n;i++) printf "            <button onclick=\"scientificCalc(\x27%s\x27)\">%s</button>\n", ops[i], labels[i]
      print "        </div>"
      mc=0}' > index.html
  truncate -s -1 index.html
  cat >> style.css <<'CSS'


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
CSS
  cat >> script.js <<'JS'


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
JS
  truncate -s -1 style.css script.js
}
