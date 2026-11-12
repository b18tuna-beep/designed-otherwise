"""Travelling-wave model for the basilar membrane (used by H1/H7 ripples, H2, H5).

x is the normalised position along the membrane: 0 = base (stiff, high pitch),
1 = apex (floppy, low pitch). A forward pass starts at the base, its crests travel
toward the apex while the wavelength shortens and the amplitude grows to a peak at
xp (the place tuned to that pitch), then the wave dies within a short distance past
the peak (von Bekesy's travelling wave, qualitatively). A reverse pass starts at xp
and runs back out toward the base (the emission in H5).
"""
import numpy as np

from ear_common import smoothstep

_XG = np.linspace(0.0, 1.2, 2401)


class Pass:
    def __init__(self, t0, xp, freq, amp, t_front=1.2, hold=0.6, t_fade=0.8,
                 lam0=0.16, sigma=0.05, reverse=False):
        self.t0, self.xp, self.freq, self.amp = t0, xp, freq, amp
        self.t_front, self.hold, self.t_fade = t_front, hold, t_fade
        self.sigma, self.reverse = sigma, reverse
        # wavelength shortens toward the peak; phase = 2*pi * integral of 1/lambda
        lam = lam0 * (1 - 0.72 * np.minimum(_XG / xp, 1.0))
        k = 1.0 / lam
        ph = np.concatenate([[0.0], np.cumsum(0.5 * (k[1:] + k[:-1]) * np.diff(_XG))]) * 2 * np.pi
        self.ph_at_xp = np.interp(xp, _XG, ph)
        self.ph = ph
        self.t_end = t_front + hold + t_fade

    def envelope(self, x):
        xp, s = self.xp, self.sigma
        if not self.reverse:
            before = 0.12 + 0.88 * np.clip(x / xp, 0, 1) ** 2.2
        else:
            before = 0.55 + 0.45 * np.clip(x / xp, 0, 1)
        after = np.exp(-((x - xp) / s) ** 2)
        return np.where(x <= xp, before, after)

    def gain(self, tau):
        return float(smoothstep(0.0, 0.35, tau) * (1 - smoothstep(self.t_end - self.t_fade, self.t_end, tau)))

    def disp(self, x, t):
        """displacement (in units of amp) at positions x (array) and time t."""
        tau = t - self.t0
        if tau <= 0 or tau >= self.t_end:
            return np.zeros_like(x)
        g = self.gain(tau)
        prog = min(tau / self.t_front, 1.0)
        phx = np.interp(x, _XG, self.ph)
        if not self.reverse:
            front = prog * (self.xp + 2.5 * self.sigma)
            W = 1 - smoothstep(front - 0.07, front + 0.01, x)
            phase = 2 * np.pi * self.freq * tau - phx
        else:
            front = self.xp - prog * (self.xp + 0.05)
            W = smoothstep(front - 0.01, front + 0.07, x)
            phase = 2 * np.pi * self.freq * tau - (self.ph_at_xp - phx)
        return self.amp * g * W * self.envelope(x) * np.sin(phase)


def total(passes, x, t):
    out = np.zeros_like(x)
    for p in passes:
        out = out + p.disp(x, t)
    return out
