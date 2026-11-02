// Scene clock (seconds since the current scene started). The scene runner drives it;
// parts read it for ambient motion (flowing heat, circulating refrigerant, shimmer).
import {createSignal} from '@motion-canvas/core';

export const T = createSignal(0);
export const wave = (speed = 2, phase = 0, amp = 1) => () => Math.sin(T() * speed + phase) * amp;
export const cycle = (period: number, phase = 0) => () => (((T() / period + phase) % 1) + 1) % 1;
export const val = (v: any) => (typeof v === 'function' ? v() : v);
