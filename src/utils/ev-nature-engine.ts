/**
 * Pure, testable animation and physics math for EV Nature background.
 *
 * Implements procedural canopy sway curves, drifting botanical leaf & spore
 * physics with wind currents, and theme-dependent color palettes.
 */

export interface NatureParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  angularSpeed: number;
  wobble: number;
  opacity: number;
  type: 'leaf' | 'spore';
}

export interface CanopyBranchCurves {
  topLeft: {
    start: [number, number];
    cp1: [number, number];
    cp2: [number, number];
    end: [number, number];
  };
  topRight: {
    start: [number, number];
    cp1: [number, number];
    cp2: [number, number];
    end: [number, number];
  };
}

export interface NatureThemeColors {
  branchStroke: string;
  leafFill: string;
  leafVein: string;
  sporeCenter: string;
  sporeGlow: string;
}

/**
 * Creates a single nature particle (leaf or bioluminescent spore).
 */
export function createNatureParticle(
  width: number,
  height: number,
  random: () => number = Math.random,
  overrides?: Partial<NatureParticle>
): NatureParticle {
  const isLeaf = (overrides?.type ?? (random() > 0.4 ? 'leaf' : 'spore')) === 'leaf';

  return {
    x: random() * Math.max(1, width),
    y: random() * Math.max(1, height),
    size: isLeaf ? random() * 6 + 4 : random() * 3 + 2,
    speedX: (random() - 0.5) * 0.8,
    speedY: random() * 0.6 + 0.3,
    angle: random() * Math.PI * 2,
    angularSpeed: (random() - 0.5) * 0.02,
    wobble: random() * Math.PI,
    opacity: random() * 0.4 + 0.25,
    type: isLeaf ? 'leaf' : 'spore',
    ...overrides,
  };
}

/**
 * Generates an array of nature particles.
 */
export function createNatureParticles(
  count: number,
  width: number,
  height: number,
  random: () => number = Math.random
): NatureParticle[] {
  return Array.from({ length: count }, () => createNatureParticle(width, height, random));
}

/**
 * Updates a single particle's position, rotation, and boundary wrapping.
 * Applies breeze vector and gentle cursor wind repulsion when cursor coordinates are provided.
 */
export function updateNatureParticle(
  particle: NatureParticle,
  width: number,
  height: number,
  breezeSpeed: number = 1.0,
  mouseX?: number,
  mouseY?: number,
  random: () => number = Math.random
): NatureParticle {
  const updated: NatureParticle = { ...particle };
  const safeBreeze = Math.max(0.1, Number.isFinite(breezeSpeed) ? breezeSpeed : 1.0);

  // Angular rotation and sinusoidal wobble
  updated.angle += updated.angularSpeed * safeBreeze;
  updated.wobble += 0.02 * safeBreeze;

  // Gentle cursor wind repulsion
  if (
    mouseX !== undefined &&
    mouseY !== undefined &&
    Number.isFinite(mouseX) &&
    Number.isFinite(mouseY)
  ) {
    const dx = updated.x - mouseX;
    const dy = updated.y - mouseY;
    const distSq = dx * dx + dy * dy;
    const maxDist = 140;

    if (distSq > 0 && distSq < maxDist * maxDist) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / maxDist) * 1.8;
      updated.x += (dx / dist) * force;
      updated.y += (dy / dist) * force;
    }
  }

  // Linear drift with natural harmonic sway
  updated.x += (updated.speedX + Math.sin(updated.wobble) * 0.5) * safeBreeze;
  updated.y += updated.speedY * safeBreeze;

  // Screen wrapping
  const margin = 24;
  if (updated.y > height + margin) {
    updated.y = -margin;
    updated.x = random() * Math.max(1, width);
  } else if (updated.y < -margin) {
    updated.y = height + margin;
  }

  if (updated.x < -margin) {
    updated.x = width + margin;
  } else if (updated.x > width + margin) {
    updated.x = -margin;
  }

  return updated;
}

/**
 * Calculates bezier control points for the top corner canopy branches.
 * The branches gently sway in the breeze using harmonic sines.
 */
export function getCanopyBranchCurves(
  width: number,
  height: number,
  time: number,
  breezeSpeed: number = 1.0
): CanopyBranchCurves {
  const safeTime = Number.isFinite(time) ? time : 0;
  const safeBreeze = Math.max(0.1, Number.isFinite(breezeSpeed) ? breezeSpeed : 1.0);

  const sway1 = Math.sin(safeTime * 0.8) * 14 * safeBreeze;
  const sway2 = Math.cos(safeTime * 0.6) * 10 * safeBreeze;

  return {
    topLeft: {
      start: [-20, -20],
      cp1: [width * 0.15, height * 0.05 + sway1],
      cp2: [width * 0.26, height * 0.18 + sway2],
      end: [width * 0.36, height * 0.12 + sway1 * 0.5],
    },
    topRight: {
      start: [width + 20, -20],
      cp1: [width * 0.85, height * 0.08 - sway1],
      cp2: [width * 0.72, height * 0.22 + sway2],
      end: [width * 0.64, height * 0.14 - sway1 * 0.5],
    },
  };
}

/**
 * Theme-aware canvas rendering colors.
 */
export function getNatureThemeColors(isDark: boolean): NatureThemeColors {
  if (isDark) {
    return {
      branchStroke: 'rgba(52, 211, 153, 0.07)',
      leafFill: 'rgba(52, 211, 153, ',
      leafVein: 'rgba(255, 255, 255, 0.16)',
      sporeCenter: 'rgba(110, 231, 183, ',
      sporeGlow: 'rgba(16, 185, 129, 0)',
    };
  }

  return {
    branchStroke: 'rgba(16, 185, 129, 0.12)',
    leafFill: 'rgba(5, 150, 105, ',
    leafVein: 'rgba(0, 0, 0, 0.12)',
    sporeCenter: 'rgba(16, 185, 129, ',
    sporeGlow: 'rgba(5, 150, 105, 0)',
  };
}
