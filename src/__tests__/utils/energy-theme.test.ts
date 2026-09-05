import { describe, it, expect } from 'vitest';
import { getEnergyTheme } from '@/utils/energy-theme';

describe('getEnergyTheme', () => {
  it('returns ice when vehicle is null or undefined', () => {
    expect(getEnergyTheme(null)).toBe('ice');
    expect(getEnergyTheme(undefined)).toBe('ice');
    expect(getEnergyTheme({})).toBe('ice');
  });

  it('returns ev for electric powertrain', () => {
    expect(getEnergyTheme({ powertrain: 'ev', fuel_type: null })).toBe('ev');
    expect(getEnergyTheme({ powertrain: 'ev', fuel_type: 'petrol' })).toBe('ev');
  });

  it('returns hybrid for hev, phev, and rex powertrains', () => {
    expect(getEnergyTheme({ powertrain: 'hev', fuel_type: 'petrol' })).toBe('hybrid');
    expect(getEnergyTheme({ powertrain: 'phev', fuel_type: 'petrol' })).toBe('hybrid');
    expect(getEnergyTheme({ powertrain: 'rex', fuel_type: 'petrol' })).toBe('hybrid');
    expect(getEnergyTheme({ powertrain: 'hev', fuel_type: null })).toBe('hybrid');
  });

  it('returns petrol for ice with petrol fuel', () => {
    expect(getEnergyTheme({ powertrain: 'ice', fuel_type: 'petrol' })).toBe('petrol');
  });

  it('returns diesel for ice with diesel fuel', () => {
    expect(getEnergyTheme({ powertrain: 'ice', fuel_type: 'diesel' })).toBe('diesel');
  });

  it('falls back to ice when fuel_type is cng, lpg, or null', () => {
    expect(getEnergyTheme({ powertrain: 'ice', fuel_type: 'cng' })).toBe('ice');
    expect(getEnergyTheme({ powertrain: 'ice', fuel_type: 'lpg' })).toBe('ice');
    expect(getEnergyTheme({ powertrain: 'ice', fuel_type: null })).toBe('ice');
  });
});
