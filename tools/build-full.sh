#!/usr/bin/env bash
# 把開頭目錄卡和 8 集接成一部完整影片，並合併字幕、加上章節。
# 用法：./tools/build-full.sh   （先用 build.sh 產生 8 集）
# 輸出：videos/full-github-tutorial.mp4、.srt、-chapters.txt
set -euo pipefail
cd "$(dirname "$0")/.."

EPISODES=(01-first-deploy 02-git-basic-flow 03-pull-request 04-undo-changes
          05-feature-branch 06-test-and-merge 07-ab-test 08-pick-and-release)
work=build/full
out=videos/full-github-tutorial
mkdir -p "$work"
for ep in "${EPISODES[@]}"; do test -f "videos/$ep.mp4" || { echo "缺少 videos/$ep.mp4，請先執行 ./build.sh $ep"; exit 1; }; done

# 1. 開頭目錄卡：和每一集用同一套流程產生，所以影音格式完全相同，可以直接接起來
node tools/record.mjs full/title.html video "$work/title-silent.mp4" 30
python3 -I tools/sfx.py "$work/title-silent.json" "$work/title.wav" "$work/title.srt"
ffmpeg -v error -y -i "$work/title-silent.mp4" -i "$work/title.wav" \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$work/title.mp4"

# 2. 依序接起來（不重新壓縮）
parts=("$work/title.mp4")
for ep in "${EPISODES[@]}"; do parts+=("videos/$ep.mp4"); done
: > "$work/list.txt"
for p in "${parts[@]}"; do echo "file '$PWD/$p'" >> "$work/list.txt"; done

# 3. 字幕、章節：每一段依照前面所有片段的實際長度往後移
python3 -I - "$work" "$out" "${parts[@]}" <<'PY'
import re, subprocess, sys
work, out, parts = sys.argv[1], sys.argv[2], sys.argv[3:]
# chapter titles come from the CHAPTERS list on the opening card
toc = re.search(r'const CHAPTERS = \[(.*?)\];', open('full/title.html', encoding='utf-8').read(), re.S).group(1)
titles = ['開場：8 個步驟'] + [f'步驟 {i}：{t}' for i, t in enumerate(re.findall(r"\['([^']+)',", toc), 1)]
srts = [f'{work}/title.srt'] + [p[:-4] + '.srt' for p in parts[1:]]

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p],
                                capture_output=True, text=True, check=True).stdout)
def to_s(ts):
    h, m, s = ts.replace(',', '.').split(':'); return int(h) * 3600 + int(m) * 60 + float(s)
def to_ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'

offset, n, lines, chapters = 0.0, 0, [], []
for part, srt, title in zip(parts, srts, titles):
    chapters.append((offset, title))
    for block in open(srt, encoding='utf-8').read().strip().split('\n\n'):
        _, times, *text = block.split('\n')
        a, b = times.split(' --> ')
        n += 1
        lines.append(f'{n}\n{to_ts(to_s(a) + offset)} --> {to_ts(to_s(b) + offset)}\n' + '\n'.join(text) + '\n')
    offset += dur(part)

open(out + '.srt', 'w', encoding='utf-8').write('\n'.join(lines))
# chapter list in the "0:00 title" form used by YouTube descriptions
fmt = lambda x: f'{int(x // 60)}:{int(x % 60):02}'
open(out + '-chapters.txt', 'w', encoding='utf-8').write(''.join(f'{fmt(s)} {t}\n' for s, t in chapters))
# ffmpeg metadata so players show the chapters
meta = [';FFMETADATA1', 'title=GitHub 實戰教學完整版']
for i, (s, t) in enumerate(chapters):
    e = chapters[i + 1][0] if i + 1 < len(chapters) else offset
    meta += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={int(s * 1000)}', f'END={int(e * 1000)}', f'title={t}']
open(f'{work}/chapters.txt', 'w', encoding='utf-8').write('\n'.join(meta) + '\n')
print(f'{n} 句字幕、{len(chapters)} 個章節，總長 {fmt(offset)}')
PY

ffmpeg -v error -y -f concat -safe 0 -i "$work/list.txt" -i "$work/chapters.txt" \
  -map 0 -map_metadata 1 -map_chapters 1 -c copy -movflags +faststart "$out.mp4"
echo "完成：$out.mp4、$out.srt、$out-chapters.txt"
