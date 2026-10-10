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


def norm(x):
    return x / max(np.abs(x).max(), 1e-9)


def band(x, lo, hi):
    # FFT band-pass with soft edges, keeps lo..hi Hz
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= np.clip((f - lo * 0.7) / (lo * 0.3), 0, 1) * np.clip((hi * 1.3 - f) / (hi * 0.3), 0, 1)
    return np.fft.irfft(X, len(x))


def whoosh(d):
    # soft airy swish: mid/high band noise only (no low rumble), slow swell in and out
    n = int((d + 0.2) * SR)
    t = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(t / (d + 0.2), 0, 1)) ** 3
    return norm(band(rng.standard_normal(n), 900, 5000) * shape)


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


# Fixed peak level for each sound (1.0 = full scale). No overall normalization,
# so adding or removing one kind of sound never changes the loudness of the others.
LEVEL = {"whoosh": 0.07, "land": 0.22, "step": 0.08, "chime": 0.22}
LAND_F = {0: 523.25, 1: 659.25, 2: 783.99, 3: 1046.5}  # pitch by card index
for e in meta["sounds"]:
    k = e["k"]
    if k == "whoosh":
        add(whoosh(e["dur"]), e["t"], LEVEL[k])
    elif k == "land":
        add(norm(pop(LAND_F[e["to"]])), e["t"], LEVEL[k])
    elif k == "step":
        add(norm(tick()), e["t"], LEVEL[k])
    elif k == "chime":
        add(norm(chime()), e["t"], LEVEL[k])

mix = np.clip(np.stack([L, R], 1), -1, 1)
stereo = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())


def ts(x):
    ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


with open(sys.argv[3], "w", encoding="utf-8") as f:
    for i, c in enumerate(meta["cues"], 1):
        f.write(f"{i}\n{ts(c['start'])} --> {ts(c['end'] - 0.05)}\n{c['text']}\n\n")
print("ok", len(meta["sounds"]), "sound events,", len(meta["cues"]), "cues")
