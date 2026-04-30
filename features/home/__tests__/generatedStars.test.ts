import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeneratedStars } from '../utils/generatedStars';

describe('useGeneratedStars', () => {
  it('gera a quantidade correta de estrelas', async () => {
    const { result } = renderHook(() => useGeneratedStars(10));
    await act(() => Promise.resolve());

    expect(result.current.stars).toHaveLength(10);
    expect(result.current.mounted).toBe(true);
  });

  it('gera 0 estrelas quando count é 0', async () => {
    const { result } = renderHook(() => useGeneratedStars(0));
    await act(() => Promise.resolve());

    expect(result.current.stars).toHaveLength(0);
    expect(result.current.mounted).toBe(true);
  });

  it('cada estrela tem todas as propriedades', async () => {
    const { result } = renderHook(() => useGeneratedStars(5));
    await act(() => Promise.resolve());

    result.current.stars.forEach(star => {
      expect(star).toHaveProperty('size');
      expect(star).toHaveProperty('x');
      expect(star).toHaveProperty('y');
      expect(star).toHaveProperty('duration');
      expect(star).toHaveProperty('delay');
    });
  });

  it('size está entre 3 e 11', async () => {
    const { result } = renderHook(() => useGeneratedStars(50));
    await act(() => Promise.resolve());

    result.current.stars.forEach(star => {
      expect(star.size).toBeGreaterThanOrEqual(3);
      expect(star.size).toBeLessThan(11);
    });
  });

  it('x e y estão entre 0 e 100', async () => {
    const { result } = renderHook(() => useGeneratedStars(50));
    await act(() => Promise.resolve());

    result.current.stars.forEach(star => {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(100);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(100);
    });
  });

  it('duration está entre 2 e 5', async () => {
    const { result } = renderHook(() => useGeneratedStars(50));
    await act(() => Promise.resolve());

    result.current.stars.forEach(star => {
      expect(star.duration).toBeGreaterThanOrEqual(2);
      expect(star.duration).toBeLessThan(5);
    });
  });

  it('delay está entre 0 e 6', async () => {
    const { result } = renderHook(() => useGeneratedStars(50));
    await act(() => Promise.resolve());

    result.current.stars.forEach(star => {
      expect(star.delay).toBeGreaterThanOrEqual(0);
      expect(star.delay).toBeLessThan(6);
    });
  });
});
