"""Synthesize the sound track and SRT from the recorder's JSON.
Usage: python3 -I tools/sfx.py <meta.json> <out.wav> <out.srt>
Only transition sounds are made (fly, land, step change, final chime); typing stays silent.
"""
import json, sys, wave
import numpy as np

SR = 48000
meta = json.load(open(sys.argv[1], encoding="utf-8"))
dur = meta["duration"] + 0.5
L = np.zeros(int(SR * dur)); R = np.zeros_like(L)
rng = np.random.default_rng(7)


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= len(L):
        return
    n = min(len(sig), len(L) - i)
    L[i:i + n] += sig[:n] * gain * (1 - max(pan, 0))
    R[i:i + n] += sig[:n] * gain * (1 + min(pan, 0))


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def lowpass(x, k):
    # simple one-pole low-pass, k in (0,1): higher = brighter
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc); y[i] = acc
    return y


def whoosh(d):
    n = int((d + 0.15) * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    shape = np.sin(np.pi * np.clip(t / (d + 0.15), 0, 1)) ** 2
    # sweep brightness by mixing two filtered copies
    a = lowpass(noise, 0.03); b = lowpass(noise, 0.25)
    m = np.clip(t / d, 0, 1)
    return (a * (1 - m) * 3 + b * m * 0.9) * shape * 0.35


def pop(f):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.15 * np.sin(2 * np.pi * 3 * f * t)
    return s * env(n, 0.002, 0.11) * 0.32


def tick():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1320 * t) * env(n, 0.001, 0.03) * 0.12


def chime():
    out = np.zeros(int(1.6 * SR))
    for j, f in enumerate([523.25, 659.25, 783.99, 1046.5]):
        p = pop(f) * 0.9
        i = int(j * 0.11 * SR)
        out[i:i + len(p)] += p[:len(out) - i]
    return out


LAND_F = {1: 659.25, 2: 783.99, 3: 1046.5}
for e in meta["sounds"]:
    k = e["k"]
    if k == "whoosh":
        add(whoosh(e["dur"]), e["t"], 0.8)
    elif k == "land":
        add(pop(LAND_F[e["to"]]), e["t"], 1.0)
    elif k == "step":
        add(tick(), e["t"], 1.0)
    elif k == "chime":
        add(chime(), e["t"], 0.8)

mx = max(np.abs(L).max(), np.abs(R).max(), 1e-9)
g = 0.7 / mx
stereo = (np.stack([L, R], 1) * g * 32767).astype(np.int16)
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())


def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


with open(sys.argv[3], "w", encoding="utf-8") as f:
    for i, c in enumerate(meta["cues"], 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'] - 0.05)}\n{c['text']}\n\n")
print("ok", len(meta["sounds"]), "sound events,", len(meta["cues"]), "cues")
