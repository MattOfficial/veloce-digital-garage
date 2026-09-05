import { describe, it, expect } from 'vitest';
import {
  createThematicParticles,
  updatePetrolEmber,
  getPetrolAeroY,
  updateDieselParticle,
  getDieselPulseRings,
  updateHybridParticle,
  getHybridWaveY,
  getThematicColors,
  type ThemeParticle,
} from '@/utils/powertrain-theme-engine';

describe('powertrain-theme-engine', () => {
  describe('createThematicParticles', () => {
    it('creates requested count of particles with valid properties', () => {
      const particles = createThematicParticles('petrol', 20, 800, 600);
      expect(particles).toHaveLength(20);
      particles.forEach((p) => {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.size).toBeGreaterThan(0);
        expect(p.opacity).toBeGreaterThan(0);
      });
    });

    it('assigns upward speedY for petrol particles', () => {
      const particles = createThematicParticles('petrol', 10, 500, 500, () => 0.5);
      particles.forEach((p) => {
        expect(p.speedY).toBeGreaterThan(0);
      });
    });
  });

  describe('updatePetrolEmber', () => {
    it('moves ember upward and wraps past top margin', () => {
      const ember: ThemeParticle = {
        x: 200,
        y: 200,
        size: 3,
        speedX: 0,
        speedY: 2,
        opacity: 0.5,
      };

      const updated = updatePetrolEmber(ember, 1000, 1000, 0, 1.0);
      expect(updated.y).toBeLessThan(200);

      const topEmber: ThemeParticle = { ...ember, y: -20 };
      const wrapped = updatePetrolEmber(topEmber, 1000, 1000, 0, 1.0, undefined, undefined, () => 0.5);
      expect(wrapped.y).toBe(1016);
    });

    it('repels ember when cursor is near', () => {
      const ember: ThemeParticle = {
        x: 100,
        y: 100,
        size: 3,
        speedX: 0,
        speedY: 1,
        opacity: 0.5,
      };

      const repelled = updatePetrolEmber(ember, 1000, 1000, 0, 1.0, 90, 100);
      expect(repelled.x).toBeGreaterThan(100);
    });
  });

  describe('getPetrolAeroY', () => {
    it('returns calculated sine wave offset', () => {
      const y0 = getPetrolAeroY(100, 200, 0);
      const y1 = getPetrolAeroY(100, 200, 1);
      expect(Number.isFinite(y0)).toBe(true);
      expect(y0).not.toEqual(y1);
    });
  });

  describe('updateDieselParticle', () => {
    it('applies inertial drift and wraps boundaries', () => {
      const p: ThemeParticle = {
        x: 1020,
        y: 1020,
        size: 2,
        speedX: 1,
        speedY: 1,
        opacity: 0.4,
      };

      const updated = updateDieselParticle(p, 1000, 1000, 1.0);
      expect(updated.x).toBe(-16);
      expect(updated.y).toBe(-16);
    });
  });

  describe('getDieselPulseRings', () => {
    it('calculates expanding pulse rings with fading alpha', () => {
      const rings = getDieselPulseRings(10, 600, 3, true);
      expect(rings).toHaveLength(3);
      rings.forEach((r) => {
        expect(r.radius).toBeGreaterThanOrEqual(0);
        expect(r.radius).toBeLessThanOrEqual(600);
        expect(r.alpha).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('updateHybridParticle', () => {
    it('moves electric stream to the right and kinetic to the left', () => {
      const electric: ThemeParticle = {
        x: 100,
        y: 200,
        size: 3,
        speedX: 0,
        speedY: 0,
        opacity: 0.5,
        stream: 'electric',
      };

      const kinetic: ThemeParticle = {
        x: 100,
        y: 200,
        size: 3,
        speedX: 0,
        speedY: 0,
        opacity: 0.5,
        stream: 'kinetic',
      };

      const updatedElec = updateHybridParticle(electric, 1000, 1000, 0, 1.0);
      const updatedKin = updateHybridParticle(kinetic, 1000, 1000, 0, 1.0);

      expect(updatedElec.x).toBeGreaterThan(100);
      expect(updatedKin.x).toBeLessThan(100);
    });
  });

  describe('getHybridWaveY', () => {
    it('calculates opposite vertical displacements for electric and kinetic streams', () => {
      const yElec = getHybridWaveY(100, 300, 0, 'electric');
      const yKin = getHybridWaveY(100, 300, 0, 'kinetic');

      expect(yElec - 300).toBeCloseTo(-(yKin - 300), 4);
    });
  });

  describe('getThematicColors', () => {
    it('returns valid dark colors for all themes with shadowBlur > 0', () => {
      const themes = ['petrol', 'diesel', 'hybrid', 'ev'] as const;
      themes.forEach((t) => {
        const colors = getThematicColors(t, true);
        expect(colors.strokePrimary).toBeDefined();
        expect(colors.particleFill).toBeDefined();
        expect(colors.shadowBlur).toBeGreaterThan(0);
      });
    });

    it('returns zero-blur light colors for all themes', () => {
      const themes = ['petrol', 'diesel', 'hybrid', 'ev'] as const;
      themes.forEach((t) => {
        const colors = getThematicColors(t, false);
        expect(colors.shadowBlur).toBe(0);
        expect(colors.particleShadow).toBe('transparent');
      });
    });
  });
});
