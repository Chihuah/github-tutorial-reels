#!/usr/bin/env bash
# 產生一集影片：錄製畫面 → 合成音效 → 合併成 MP4，並輸出字幕檔。
# 用法：./build.sh <集數資料夾名稱>
#   例：./build.sh 02-git-basic-flow
set -euo pipefail
cd "$(dirname "$0")"

ep="${1:?請指定集數，例如 02-git-basic-flow}"
scene="episodes/$ep/scene.html"
work="build/$ep"
mkdir -p "$work" videos

node tools/record.mjs "$scene" video "$work/silent.mp4" 30
python3 -I tools/sfx.py "$work/silent.json" "$work/sfx.wav" "videos/$ep.srt"
ffmpeg -v error -y -i "$work/silent.mp4" -i "$work/sfx.wav" \
  -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "videos/$ep.mp4"
echo "完成：videos/$ep.mp4、videos/$ep.srt"
