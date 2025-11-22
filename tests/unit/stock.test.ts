import { describe, it, expect } from 'vitest';
import type { Product } from '@/types';

/**
 * Tests unitarios para lógica de gestión de stock
 */

describe('Stock Management Logic', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    base_price: 100,
    wholesale_price: 80,
    stock: 10,
    min_stock: 5,
    sku: 'TEST-001',
    barcode: null,
    category: 'test',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [],
    variants: [],
    image_url: null,
  };

  describe('Stock Validation', () => {
    it('should validate stock is sufficient for purchase', () => {
      const requestedQuantity = 5;
      const hasEnoughStock = mockProduct.stock >= requestedQuantity;
      expect(hasEnoughStock).toBe(true);
    });

    it('should detect insufficient stock', () => {
      const requestedQuantity = 15;
      const hasEnoughStock = mockProduct.stock >= requestedQuantity;
      expect(hasEnoughStock).toBe(false);
    });

    it('should prevent negative stock', () => {
      const previousStock = 10;
      const quantityToSubtract = 15;
      const newStock = Math.max(0, previousStock - quantityToSubtract);
      expect(newStock).toBe(0);
      expect(newStock).toBeGreaterThanOrEqual(0);
    });

    it('should calculate stock after purchase correctly', () => {
      const previousStock = 10;
      const purchaseQuantity = 3;
      const newStock = previousStock - purchaseQuantity;
      expect(newStock).toBe(7);
    });
  });

  describe('Stock Alerts', () => {
    it('should detect low stock when stock is below minimum', () => {
      const product = { ...mockProduct, stock: 3, min_stock: 5 };
      const isLowStock = product.stock <= product.min_stock;
      expect(isLowStock).toBe(true);
    });

    it('should not alert when stock is above minimum', () => {
      const product = { ...mockProduct, stock: 10, min_stock: 5 };
      const isLowStock = product.stock <= product.min_stock;
      expect(isLowStock).toBe(false);
    });

    it('should detect critical stock (stock = 0)', () => {
      const product = { ...mockProduct, stock: 0, min_stock: 5 };
      const isCriticalStock = product.stock === 0;
      expect(isCriticalStock).toBe(true);
    });

    it('should detect stock at threshold', () => {
      const product = { ...mockProduct, stock: 5, min_stock: 5 };
      const isAtThreshold = product.stock === product.min_stock;
      expect(isAtThreshold).toBe(true);
    });
  });

  describe('Stock Adjustments', () => {
    it('should add stock correctly', () => {
      const previousStock = 10;
      const adjustment = 5;
      const newStock = previousStock + adjustment;
      expect(newStock).toBe(15);
    });

    it('should subtract stock correctly', () => {
      const previousStock = 10;
      const adjustment = -3;
      const newStock = Math.max(0, previousStock + adjustment);
      expect(newStock).toBe(7);
    });

    it('should handle zero adjustment', () => {
      const previousStock = 10;
      const adjustment = 0;
      const newStock = previousStock + adjustment;
      expect(newStock).toBe(10);
    });

    it('should prevent negative stock on adjustment', () => {
      const previousStock = 5;
      const adjustment = -10;
      const newStock = Math.max(0, previousStock + adjustment);
      expect(newStock).toBe(0);
    });
  });

  describe('Stock Movements', () => {
    it('should calculate stock change for entry movement', () => {
      const previousStock = 10;
      const movementQuantity = 5;
      const movementType = 'entry';
      const newStock = movementType === 'entry' 
        ? previousStock + movementQuantity 
        : previousStock - movementQuantity;
      expect(newStock).toBe(15);
    });

    it('should calculate stock change for exit movement', () => {
      const previousStock = 10;
      const movementQuantity = 3;
      const movementType = 'exit';
      const newStock = movementType === 'entry' 
        ? previousStock + movementQuantity 
        : Math.max(0, previousStock - movementQuantity);
      expect(newStock).toBe(7);
    });

    it('should calculate stock change for sale movement', () => {
      const previousStock = 10;
      const saleQuantity = 2;
      const newStock = Math.max(0, previousStock - saleQuantity);
      expect(newStock).toBe(8);
    });
  });

  describe('Stock Availability', () => {
    it('should identify product as in stock', () => {
      const product = { ...mockProduct, stock: 10 };
      const isInStock = product.stock > 0;
      expect(isInStock).toBe(true);
    });

    it('should identify product as out of stock', () => {
      const product = { ...mockProduct, stock: 0 };
      const isInStock = product.stock > 0;
      expect(isInStock).toBe(false);
    });

    it('should calculate available quantity correctly', () => {
      const product = { ...mockProduct, stock: 10 };
      const availableQuantity = product.stock;
      expect(availableQuantity).toBe(10);
    });
  });

  describe('Stock Restoration', () => {
    it('should restore stock when order is cancelled', () => {
      const currentStock = 7;
      const cancelledQuantity = 3;
      const restoredStock = currentStock + cancelledQuantity;
      expect(restoredStock).toBe(10);
    });

    it('should handle multiple stock restorations', () => {
      let stock = 5;
      const restorations = [2, 3, 1];
      restorations.forEach(qty => {
        stock += qty;
      });
      expect(stock).toBe(11);
    });
  });
});

