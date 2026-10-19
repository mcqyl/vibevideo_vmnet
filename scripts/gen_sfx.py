"""Synthesize all UI / motion-graphics sound effects for the VMware short film.
Output: public/audio/sfx/*.wav  (48 kHz, 16-bit stereo)
"""
import numpy as np, wave, os, math

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "sfx")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(20261018)


def t(n):
    return np.arange(int(n * SR)) / SR


def env(n, a=0.005, d=0.2, curve=3.0):
    x = np.arange(int(n * SR)) / SR
    total = n
    atk = np.clip(x / max(a, 1e-4), 0, 1)
    dec = np.exp(-np.clip((x - a) / max(d, 1e-4), 0, None) * curve)
    return atk * dec


def lowpass(x, cutoff, sr=SR):
    """one-pole lowpass, cutoff may be array"""
    c = np.asarray(cutoff, dtype=float)
    if c.ndim == 0:
        alpha = 1 - math.exp(-2 * math.pi * c / sr)
        y = np.empty_like(x)
        acc = 0.0
        for i in range(len(x)):
            acc += alpha * (x[i] - acc)
            y[i] = acc
        return y
    a = 1 - np.exp(-2 * np.pi * c / sr)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def saw(freq, n, harm=12):
    tt = np.arange(int(n * SR)) / SR
    f = np.asarray(freq, dtype=float)
    if f.ndim == 0:
        f = np.full(tt.shape, f)
    phase = 2 * np.pi * np.cumsum(f) / SR
    out = np.zeros_like(phase)
    for k in range(1, harm + 1):
        out += np.sin(phase * k) / k
    return out * 0.55


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def write(name, sig, pan=0.0):
    sig = np.asarray(sig, dtype=float)
    if sig.ndim == 1:
        # tiny Haas widening
        d = int(0.004 * SR)
        left = sig
        right = np.concatenate([np.zeros(d), sig[:-d]]) if d else sig
        g = (pan + 1) / 2
        st = np.stack([left * (1 - 0.35 * g), right * (1 - 0.35 * (1 - g))], axis=1)
    else:
        st = sig
    st = norm(st, 0.92)
    pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("  ", name, f"{len(sig)/SR:.2f}s")


# ---------------------------------------------------------------- impacts
def impact(dur=1.0, sub=52, drop=0.45, bright=0.35, punch=1.0):
    n = int(dur * SR)
    x = t(dur)
    f = sub * (1 + drop * np.exp(-x * 14))
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 3.4)
    click = highpass(rng.normal(0, 1, n), 2500) * np.exp(-x * 90) * 0.5
    mid = np.sin(2 * np.pi * 180 * x) * np.exp(-x * 22) * bright
    noise = lowpass(rng.normal(0, 1, n), 900) * np.exp(-x * 9) * 0.35
    s = (body * punch + click + mid + noise)
    return np.tanh(s * 1.6) * 0.9


write("impact.wav", impact(1.1, 54, 0.5, 0.4))
write("impact_big.wav", impact(1.9, 46, 0.62, 0.55, 1.15))
write("impact_soft.wav", impact(0.55, 90, 0.3, 0.25, 0.55))

# ---------------------------------------------------------------- whoosh
def whoosh(dur=0.75, f0=260, f1=3200, f2=700, amp=1.0):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    fc = np.where(x < 0.55, f0 + (f1 - f0) * (x / 0.55) ** 1.7,
                  f1 + (f2 - f1) * ((x - 0.55) / 0.45) ** 0.7)
    nz = rng.normal(0, 1, n)
    sig = lowpass(nz, fc)
    sig = highpass(sig, 120)
    e = np.sin(np.pi * np.clip(x / 0.85, 0, 1)) ** 1.6
    e *= np.exp(-np.clip(x - 0.7, 0, None) * 9)
    return sig * e * amp


write("whoosh.wav", whoosh(0.8), pan=-0.2)
write("whoosh_long.wav", whoosh(1.5, 180, 4200, 500), pan=0.2)
write("swipe.wav", whoosh(0.38, 1400, 7000, 1500), pan=0.3)

# ---------------------------------------------------------------- pops / ticks
def pop(f=880, dur=0.16, gliss=1.7):
    n = int(dur * SR)
    x = t(dur)
    freq = f * (1 + gliss * np.exp(-x * 45))
    s = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-x * 26)
    s += highpass(rng.normal(0, 1, n), 3000) * np.exp(-x * 140) * 0.25
    return s


for i, f in enumerate([740, 880, 1040, 1240]):
    write(f"pop{i+1}.wav", pop(f))


def tick(dur=0.05, f=2600):
    n = int(dur * SR)
    x = t(dur)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 220)
    s += highpass(rng.normal(0, 1, n), 4500) * np.exp(-x * 320) * 0.6
    return s


write("tick.wav", tick())
write("tick_low.wav", tick(0.07, 1500))

# ---------------------------------------------------------------- riser
def riser(dur=2.0, f0=180, f1=2600):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** (x ** 1.5)
    tone = saw(f, dur, 8) * 0.5
    nz = highpass(rng.normal(0, 1, n), 400) * (0.35 + 0.5 * x)
    s = (tone + nz) * (x ** 2.2)
    trem = 1 + 0.35 * np.sin(2 * np.pi * (4 + 22 * x ** 2) * x * dur)
    return s * trem


write("riser.wav", riser(1.8))
write("riser_short.wav", riser(0.9, 300, 3000))

# ---------------------------------------------------------------- digital / data
def datazip(dur=0.55, f0=3400, f1=520):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** x
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sign(np.sin(ph)) * 0.35 + np.sin(ph * 2) * 0.4
    am = (np.sin(2 * np.pi * (28 + 60 * x) * x * dur) > -0.2).astype(float)
    am = lowpass(am, 3000)
    return s * am * (1 - x) ** 1.4


write("datazip.wav", datazip(), pan=-0.35)
write("datazip_up.wav", datazip(0.5, 600, 3800), pan=0.35)


def blip(dur=0.3, f=1320, ratio=1.5):
    n = int(dur * SR)
    x = t(dur)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * 16)
    s += np.sin(2 * np.pi * f * ratio * x) * np.exp(-x * 22) * 0.5
    return s


write("blip.wav", blip())
write("blip_hi.wav", blip(0.25, 1980, 1.335))

# ---------------------------------------------------------------- chime / success
def chime(notes=(880, 1174.7, 1567.98), dur=1.5):
    n = int(dur * SR)
    out = np.zeros(n)
    for i, f in enumerate(notes):
        st = int(i * 0.075 * SR)
        m = n - st
        x = np.arange(m) / SR
        tone = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2 * x)) * np.exp(-x * 4.2)
        tone *= np.clip(x / 0.004, 0, 1)
        out[st:st + m] += tone * (0.8 ** i)
    return out


write("chime.wav", chime())
write("chime_low.wav", chime((587.3, 784, 1046.5), 1.8))

# ---------------------------------------------------------------- error / deny
def error(dur=0.6):
    n = int(dur * SR)
    x = t(dur)
    s = np.zeros(n)
    for st, ln in ((0.0, 0.16), (0.22, 0.3)):
        m = int(ln * SR)
        y = np.arange(m) / SR
        buzz = np.sign(np.sin(2 * np.pi * 130 * y)) * 0.5
        buzz = lowpass(buzz, 1400)
        buzz *= np.exp(-y * 9) * np.clip(y / 0.003, 0, 1)
        s[int(st * SR):int(st * SR) + m] += buzz
    return s


write("error.wav", error())

# ---------------------------------------------------------------- sub drop
def drop(dur=1.4, f0=90, f1=28):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    f = f0 * (f1 / f0) ** (x ** 0.5)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = np.tanh(s * 2.2) * (1 - x) ** 1.6
    return s


write("drop.wav", drop())

# ---------------------------------------------------------------- reverse swell
def swell(dur=1.1):
    n = int(dur * SR)
    x = np.linspace(0, 1, n)
    nz = lowpass(rng.normal(0, 1, n), 300 + 4200 * x ** 2)
    return nz * (x ** 2.6)


write("swell.wav", swell())

print("done ->", os.path.abspath(OUT))
