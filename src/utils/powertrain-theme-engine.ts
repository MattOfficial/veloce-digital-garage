import type { EnergyTheme } from './energy-theme';

export interface ThemeParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  stream?: 'electric' | 'kinetic';
}

export interface PulseRing {
  radius: number;
  alpha: number;
}

export interface AeroLinePoint {
  x: number;
  y: number;
}

export interface ThematicColors {
  strokePrimary: string;
  strokeSecondary: string;
  particleFill: string;
  particleShadow: string;
  shadowBlur: number;
}

/**
 * Creates particles for the given energy theme.
 */
export function createThematicParticles(
  theme: EnergyTheme,
  count: number,
  width: number,
  height: number,
  random: () => number = Math.random
): ThemeParticle[] {
  return Array.from({ length: count }, (_, idx) => ({
    x: random() * Math.max(1, width),
    y: random() * Math.max(1, height),
    size: random() * 3.5 + 1.5,
    speedX: (random() - 0.5) * 0.6,
    speedY: theme === 'petrol' ? random() * 0.8 + 0.8 : (random() - 0.5) * 0.6,
    opacity: random() * 0.5 + 0.25,
    stream: idx % 2 === 0 ? 'electric' : 'kinetic',
  }));
}

/**
 * Updates a petrol ember particle: floats upward, sways horizontally, repelled by cursor.
 */
export function updatePetrolEmber(
  p: ThemeParticle,
  width: number,
  height: number,
  time: number,
  breeze: number = 1.0,
  mouseX?: number,
  mouseY?: number,
  random: () => number = Math.random
): ThemeParticle {
  const updated = { ...p };
  const safeBreeze = Math.max(0.1, Number.isFinite(breeze) ? breeze : 1.0);
  const safeTime = Number.isFinite(time) ? time : 0;

  // Floating upward (combustion heat)
  updated.y -= updated.speedY * safeBreeze;
  updated.x += Math.sin(safeTime + updated.y * 0.02) * 0.6 * safeBreeze;

  // Cursor repulsion
  if (mouseX !== undefined && mouseY !== undefined && Number.isFinite(mouseX) && Number.isFinite(mouseY)) {
    const dx = updated.x - mouseX;
    const dy = updated.y - mouseY;
    const distSq = dx * dx + dy * dy;
    const maxDist = 120;

    if (distSq > 0 && distSq < maxDist * maxDist) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / maxDist) * 1.8;
      updated.x += (dx / dist) * force;
      updated.y += (dy / dist) * force;
    }
  }

  // Wrap around when rising past the top
  const margin = 16;
  if (updated.y < -margin) {
    updated.y = height + margin;
    updated.x = random() * Math.max(1, width);
  }

  if (updated.x < -margin) {
    updated.x = width + margin;
  } else if (updated.x > width + margin) {
    updated.x = -margin;
  }

  return updated;
}

/**
 * Calculates aerodynamic streamline coordinates for Petrol theme.
 */
export function getPetrolAeroY(
  x: number,
  baseY: number,
  time: number
): number {
  const safeTime = Number.isFinite(time) ? time : 0;
  return baseY + Math.sin(x * 0.003 + safeTime * 2) * 22 + Math.cos(x * 0.001 - safeTime) * 12;
}

/**
 * Updates a diesel torque dust particle: drifts with smooth inertia.
 */
export function updateDieselParticle(
  p: ThemeParticle,
  width: number,
  height: number,
  breeze: number = 1.0
): ThemeParticle {
  const updated = { ...p };
  const safeBreeze = Math.max(0.1, Number.isFinite(breeze) ? breeze : 1.0);

  updated.x += updated.speedX * 0.8 * safeBreeze;
  updated.y += updated.speedY * 0.8 * safeBreeze;

  const margin = 16;
  if (updated.x < -margin) updated.x = width + margin;
  if (updated.x > width + margin) updated.x = -margin;
  if (updated.y < -margin) updated.y = height + margin;
  if (updated.y > height + margin) updated.y = -margin;

  return updated;
}

/**
 * Calculates kinetic torque compression pulse rings for Diesel theme.
 */
export function getDieselPulseRings(
  time: number,
  maxRadius: number = 600,
  ringCount: number = 3,
  isDark: boolean = true
): PulseRing[] {
  const safeTime = Number.isFinite(time) ? time : 0;
  const baseAlpha = isDark ? 0.08 : 0.07;
  const rings: PulseRing[] = [];

  for (let r = 1; r <= ringCount; r++) {
    const radius = (safeTime * 32 + r * 160) % maxRadius;
    const alpha = Math.max(0, baseAlpha * (1 - radius / maxRadius));
    rings.push({ radius, alpha });
  }

  return rings;
}

/**
 * Updates a hybrid dual-flux particle.
 */
export function updateHybridParticle(
  p: ThemeParticle,
  width: number,
  height: number,
  time: number,
  breeze: number = 1.0
): ThemeParticle {
  const updated = { ...p };
  const safeBreeze = Math.max(0.1, Number.isFinite(breeze) ? breeze : 1.0);
  const safeTime = Number.isFinite(time) ? time : 0;

  const dir = updated.stream === 'electric' ? 1 : -1;
  updated.x += dir * 0.75 * safeBreeze;

  const centerY = height * 0.42;
  const waveSign = updated.stream === 'electric' ? 1 : -1;
  updated.y = centerY + waveSign * Math.sin(safeTime * 1.5 + updated.x * 0.006) * 45;

  const margin = 16;
  if (updated.x < -margin) updated.x = width + margin;
  if (updated.x > width + margin) updated.x = -margin;

  return updated;
}

/**
 * Calculates Y-coordinates for the dual intertwined flux ribbons (Hybrid).
 */
export function getHybridWaveY(
  x: number,
  centerY: number,
  time: number,
  stream: 'electric' | 'kinetic'
): number {
  const safeTime = Number.isFinite(time) ? time : 0;
  const sign = stream === 'electric' ? 1 : -1;
  return centerY + sign * Math.sin(x * 0.004 + safeTime) * 55;
}

/**
 * Palette definitions for all energy themes across both light and dark modes.
 */
export function getThematicColors(theme: EnergyTheme, isDark: boolean): ThematicColors {
  if (isDark) {
    switch (theme) {
      case 'petrol':
        return {
          strokePrimary: 'rgba(244, 63, 94, 0.07)',
          strokeSecondary: 'rgba(225, 29, 72, 0.15)',
          particleFill: 'rgba(244, 63, 94, ',
          particleShadow: 'rgba(225, 29, 72, 0.8)',
          shadowBlur: 8,
        };
      case 'diesel':
        return {
          strokePrimary: 'rgba(245, 158, 11, ',
          strokeSecondary: 'rgba(251, 191, 36, 0.15)',
          particleFill: 'rgba(245, 158, 11, ',
          particleShadow: 'rgba(251, 191, 36, 0.6)',
          shadowBlur: 6,
        };
      case 'hybrid':
        return {
          strokePrimary: 'rgba(14, 165, 233, 0.16)',
          strokeSecondary: 'rgba(52, 211, 153, 0.14)',
          particleFill: 'rgba(14, 165, 233, ',
          particleShadow: 'rgba(14, 165, 233, 0.6)',
          shadowBlur: 6,
        };
      case 'ev':
      default:
        return {
          strokePrimary: 'rgba(52, 211, 153, 0.08)',
          strokeSecondary: 'rgba(16, 185, 129, 0.15)',
          particleFill: 'rgba(52, 211, 153, ',
          particleShadow: 'rgba(16, 185, 129, 0.7)',
          shadowBlur: 8,
        };
    }
  }

  // Light Mode (crisp watercolor/sketch pigments, 0 shadow blur)
  switch (theme) {
    case 'petrol':
      return {
        strokePrimary: 'rgba(190, 18, 60, 0.08)',
        strokeSecondary: 'rgba(225, 29, 72, 0.12)',
        particleFill: 'rgba(190, 18, 60, ',
        particleShadow: 'transparent',
        shadowBlur: 0,
      };
    case 'diesel':
      return {
        strokePrimary: 'rgba(180, 83, 9, ',
        strokeSecondary: 'rgba(217, 119, 6, 0.12)',
        particleFill: 'rgba(180, 83, 9, ',
        particleShadow: 'transparent',
        shadowBlur: 0,
      };
    case 'hybrid':
      return {
        strokePrimary: 'rgba(2, 132, 199, 0.14)',
        strokeSecondary: 'rgba(5, 150, 105, 0.12)',
        particleFill: 'rgba(2, 132, 199, ',
        particleShadow: 'transparent',
        shadowBlur: 0,
      };
    case 'ev':
    default:
      return {
        strokePrimary: 'rgba(16, 185, 129, 0.15)',
        strokeSecondary: 'rgba(5, 150, 105, 0.12)',
        particleFill: 'rgba(5, 150, 105, ',
        particleShadow: 'transparent',
        shadowBlur: 0,
      };
  }
}
