import { describe, it, expect } from 'vitest';
import {
  createNatureParticle,
  createNatureParticles,
  updateNatureParticle,
  getCanopyBranchCurves,
  getNatureThemeColors,
  type NatureParticle,
} from '@/utils/ev-nature-engine';

describe('ev-nature-engine', () => {
  describe('createNatureParticle', () => {
    it('creates a particle within specified bounds', () => {
      let callCount = 0;
      const fakeRandom = () => {
        callCount++;
        return 0.5;
      };

      const particle = createNatureParticle(1000, 800, fakeRandom);
      expect(particle.x).toBe(500);
      expect(particle.y).toBe(400);
      expect(particle.size).toBeGreaterThan(0);
      expect(particle.opacity).toBeGreaterThan(0);
      expect(particle.type).toBe('leaf'); // 0.5 > 0.4 -> leaf
      expect(callCount).toBeGreaterThan(0);
    });

    it('creates a spore when random roll <= 0.4', () => {
      const fakeRandom = () => 0.2;
      const particle = createNatureParticle(500, 500, fakeRandom);
      expect(particle.type).toBe('spore');
    });

    it('respects explicit overrides', () => {
      const particle = createNatureParticle(500, 500, Math.random, {
        type: 'spore',
        x: 42,
        y: 84,
        size: 15,
      });

      expect(particle.type).toBe('spore');
      expect(particle.x).toBe(42);
      expect(particle.y).toBe(84);
      expect(particle.size).toBe(15);
    });
  });

  describe('createNatureParticles', () => {
    it('creates the requested number of particles', () => {
      const particles = createNatureParticles(25, 800, 600);
      expect(particles).toHaveLength(25);
      particles.forEach((p) => {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(800);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(600);
      });
    });
  });

  describe('updateNatureParticle', () => {
    it('updates position and angle based on breeze speed', () => {
      const initial: NatureParticle = {
        x: 100,
        y: 100,
        size: 6,
        speedX: 0.5,
        speedY: 1.0,
        angle: 0,
        angularSpeed: 0.05,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      const updated = updateNatureParticle(initial, 1000, 1000, 1.5);
      expect(updated.angle).toBeCloseTo(0.075, 4); // 0 + 0.05 * 1.5
      expect(updated.y).toBeGreaterThan(initial.y); // drifted down
    });

    it('repels particle when mouse is near', () => {
      const particle: NatureParticle = {
        x: 100,
        y: 100,
        size: 5,
        speedX: 0,
        speedY: 0,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      // Mouse is positioned at (90, 100), 10px to the left
      const repelled = updateNatureParticle(particle, 1000, 1000, 1.0, 90, 100);
      // Repulsion force should push x to the right (positive dx direction)
      expect(repelled.x).toBeGreaterThan(100);
    });

    it('does not repel particle when mouse is beyond threshold', () => {
      const particle: NatureParticle = {
        x: 100,
        y: 100,
        size: 5,
        speedX: 0,
        speedY: 0,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      // Mouse is positioned 300px away (beyond 140px threshold)
      const untouched = updateNatureParticle(particle, 1000, 1000, 1.0, 400, 400);
      // dx sway comes only from wobble increment (Math.sin(0.02) * 0.5 ≈ 0.01)
      expect(untouched.x).toBeCloseTo(100.01, 2);
    });

    it('wraps particles around screen boundaries', () => {
      const bottomParticle: NatureParticle = {
        x: 500,
        y: 1050, // Beyond height (1000) + margin (24)
        size: 5,
        speedX: 0,
        speedY: 1,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      const wrapped = updateNatureParticle(bottomParticle, 1000, 1000, 1.0, undefined, undefined, () => 0.5);
      expect(wrapped.y).toBe(-24);
      expect(wrapped.x).toBe(500);

      const topParticle: NatureParticle = {
        x: 500,
        y: -30, // Past top margin
        size: 5,
        speedX: 0,
        speedY: -1,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      const wrappedTop = updateNatureParticle(topParticle, 1000, 1000, 1.0);
      expect(wrappedTop.y).toBe(1024);

      const rightParticle: NatureParticle = {
        x: 1030, // Beyond width (1000) + margin (24)
        y: 500,
        size: 5,
        speedX: 1,
        speedY: 0,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      const wrappedRight = updateNatureParticle(rightParticle, 1000, 1000, 1.0);
      expect(wrappedRight.x).toBe(-24);

      const leftParticle: NatureParticle = {
        x: -30, // Past left margin
        y: 500,
        size: 5,
        speedX: -1,
        speedY: 0,
        angle: 0,
        angularSpeed: 0,
        wobble: 0,
        opacity: 0.5,
        type: 'leaf',
      };

      const wrappedLeft = updateNatureParticle(leftParticle, 1000, 1000, 1.0);
      expect(wrappedLeft.x).toBe(1024);
    });

    it('handles non-finite breeze speed gracefully', () => {
      const particle = createNatureParticle(500, 500);
      const updated = updateNatureParticle(particle, 500, 500, NaN);
      expect(Number.isFinite(updated.x)).toBe(true);
      expect(Number.isFinite(updated.y)).toBe(true);
    });
  });

  describe('getCanopyBranchCurves', () => {
    it('returns structured control points for both top corners', () => {
      const curves = getCanopyBranchCurves(1200, 800, 1.5, 1.2);

      expect(curves.topLeft.start).toEqual([-20, -20]);
      expect(curves.topLeft.cp1[0]).toBeCloseTo(180, 1);
      expect(curves.topLeft.end[0]).toBeCloseTo(432, 1);

      expect(curves.topRight.start).toEqual([1220, -20]);
      expect(curves.topRight.cp1[0]).toBeCloseTo(1020, 1);
      expect(curves.topRight.end[0]).toBeCloseTo(768, 1);
    });

    it('responds to time changes with varying sway', () => {
      const curvesT0 = getCanopyBranchCurves(1000, 1000, 0, 1.0);
      const curvesT1 = getCanopyBranchCurves(1000, 1000, Math.PI / 2, 1.0);

      expect(curvesT0.topLeft.cp1[1]).not.toEqual(curvesT1.topLeft.cp1[1]);
    });

    it('handles non-finite time inputs safely', () => {
      const safeCurves = getCanopyBranchCurves(1000, 1000, NaN, Infinity);
      expect(Number.isFinite(safeCurves.topLeft.cp1[1])).toBe(true);
    });
  });

  describe('getNatureThemeColors', () => {
    it('returns dark mode palette when isDark is true', () => {
      const darkColors = getNatureThemeColors(true);
      expect(darkColors.branchStroke).toContain('rgba(52, 211, 153');
      expect(darkColors.leafVein).toContain('255, 255, 255');
    });

    it('returns light mode palette when isDark is false', () => {
      const lightColors = getNatureThemeColors(false);
      expect(lightColors.branchStroke).toContain('rgba(16, 185, 129');
      expect(lightColors.leafVein).toContain('0, 0, 0');
    });
  });
});
