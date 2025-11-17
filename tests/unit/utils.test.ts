import { describe, it, expect } from 'vitest';
import { formatPrice, formatWhatsAppMessage } from '@/lib/utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      // Intl.NumberFormat uses non-breaking space (\u00A0) in es-AR locale
      const result1 = formatPrice(1000);
      const result2 = formatPrice(1234.56);
      const result3 = formatPrice(0);
      
      expect(result1).toMatch(/\$\s*1\.000,00/);
      expect(result2).toMatch(/\$\s*1\.234,56/);
      expect(result3).toMatch(/\$\s*0,00/);
    });

    it('should handle large numbers', () => {
      const result = formatPrice(1000000);
      expect(result).toMatch(/\$\s*1\.000\.000,00/);
    });

    it('should handle decimal prices', () => {
      const result = formatPrice(99.99);
      expect(result).toMatch(/\$\s*99,99/);
    });
  });

  describe('formatWhatsAppMessage', () => {
    it('should format WhatsApp message correctly', () => {
      const items = [
        { name: 'Product 1', quantity: 2, price: 100 },
        { name: 'Product 2', quantity: 1, price: 50 },
      ];

      const message = formatWhatsAppMessage(
        items,
        250,
        0,
        250,
        'John Doe',
        '123456789',
        'john@example.com'
      );

      expect(message).toContain('Product 1');
      expect(message).toContain('Product 2');
      expect(message).toContain('John Doe');
      expect(message).toContain('123456789');
      expect(message).toContain('john@example.com');
      expect(message).toMatch(/\$\s*250,00/); // Format includes non-breaking space
    });

    it('should include discount in message', () => {
      const items = [{ name: 'Product 1', quantity: 1, price: 100 }];
      const message = formatWhatsAppMessage(
        items,
        100,
        10,
        90,
        'John Doe',
        '123456789',
        'john@example.com'
      );

      expect(message).toContain('Descuento');
      expect(message).toMatch(/\$\s*10,00/); // Format includes non-breaking space
    });
  });
});

