import { describe, it, expect } from 'vitest';
import { isActive } from '@features/navigation/utils/isActive';

describe('isActive', () => {
  it('root only matches root', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/outlet', '/')).toBe(false);
  });

  it('matches exact', () => {
    expect(isActive('/outlet', '/outlet')).toBe(true);
  });

  it('matches subroute', () => {
    expect(isActive('/outlet/promos', '/outlet')).toBe(true);
  });

  it('avoids false positives', () => {
    expect(isActive('/outlet-vip', '/outlet')).toBe(false);
  });
});
