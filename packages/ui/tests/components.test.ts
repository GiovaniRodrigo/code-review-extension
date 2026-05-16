import { describe, expect, it } from 'vitest';
import { Button } from '../src/components/Button';
import { Badge } from '../src/components/Badge';
import { Card } from '../src/components/Card';
import { Page } from '../src/components/Page';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders shadcn/m3 inspired button class', () => {
      const html = Button('Analyze', 'analyze');
      expect(html).toContain('cr-button');
      expect(html).toContain('data-command="analyze"');
      expect(html).toContain('Analyze');
    });

    it('renders secondary variant', () => {
      const html = Button('Cancel', 'cancel', 'secondary');
      expect(html).toContain('cr-button secondary');
    });

    it('escapes label', () => {
      const html = Button('<script>alert(1)</script>', 'x');
      expect(html).not.toContain('<script>');
    });
  });

  describe('Badge', () => {
    it('renders badge class', () => {
      const html = Badge('High');
      expect(html).toContain('cr-badge');
      expect(html).toContain('High');
    });
  });

  describe('Card', () => {
    it('renders card class', () => {
      const html = Card('Content');
      expect(html).toContain('cr-card');
      expect(html).toContain('Content');
    });
  });

  describe('Page', () => {
    it('renders page class', () => {
      const html = Page('Content');
      expect(html).toContain('cr-page');
      expect(html).toContain('Content');
    });
  });
});
