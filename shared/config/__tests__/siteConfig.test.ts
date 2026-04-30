import { describe, it, expect } from 'vitest';
import { siteConfig } from '@shared/config/siteConfig';

describe('siteConfig', () => {
  describe('campos obrigatórios', () => {
    it('tem siteName definido', () => {
      expect(siteConfig.siteName).toBe('Serena Glasses');
    });

    it('tem siteDescription definido', () => {
      expect(siteConfig.siteDescription.length).toBeGreaterThan(0);
    });

    it('tem author definido', () => {
      expect(siteConfig.author.length).toBeGreaterThan(0);
    });

    it('tem locale pt-BR', () => {
      expect(siteConfig.locale).toBe('pt-BR');
    });
  });

  describe('socialLinks', () => {
    it('tem Instagram com URL válida', () => {
      expect(siteConfig.socialLinks.instagram).toMatch(/^https:\/\/www\.instagram\.com\//);
    });

    it('tem Facebook com URL válida', () => {
      expect(siteConfig.socialLinks.facebook).toMatch(/^https:\/\/www\.facebook\.com\//);
    });

    it('tem TikTok com URL válida', () => {
      expect(siteConfig.socialLinks.tiktok).toMatch(/^https:\/\/www\.tiktok\.com\//);
    });
  });

  describe('openGraph', () => {
    it('tem título definido', () => {
      expect(siteConfig.openGraph.title.length).toBeGreaterThan(0);
    });

    it('tem URL do site com https', () => {
      expect(siteConfig.openGraph.url).toMatch(/^https:\/\//);
    });

    it('tem pelo menos uma imagem', () => {
      expect(siteConfig.openGraph.images.length).toBeGreaterThan(0);
    });

    it('imagem tem url e alt', () => {
      const img = siteConfig.openGraph.images[0];
      expect(img.url.length).toBeGreaterThan(0);
      expect(img.alt.length).toBeGreaterThan(0);
    });

    it('type é website', () => {
      expect(siteConfig.openGraph.type).toBe('website');
    });
  });

  describe('twitter', () => {
    it('card é summary_large_image', () => {
      expect(siteConfig.twitter.card).toBe('summary_large_image');
    });

    it('tem site handle', () => {
      expect(siteConfig.twitter.site).toMatch(/^@/);
    });

    it('tem pelo menos uma imagem', () => {
      expect(siteConfig.twitter.images.length).toBeGreaterThan(0);
    });
  });
});
