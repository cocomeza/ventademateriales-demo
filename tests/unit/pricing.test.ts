import { describe, it, expect } from 'vitest';
import { calculateProductPrice } from '@/lib/pricing';
import type { Product, CustomerPrice } from '@/types';

describe('Pricing', () => {
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

  it('should return base price when no customer prices or discounts', () => {
    const price = calculateProductPrice(mockProduct, {});
    expect(price).toBe(100);
  });

  it('should apply customer price when available', () => {
    const customerPrice: CustomerPrice = {
      id: '1',
      customer_id: 'customer-1',
      product_id: '1',
      price: 90,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const price = calculateProductPrice(mockProduct, {
      customerId: 'customer-1',
      customerPrices: [customerPrice],
    });
    expect(price).toBe(90);
  });

  it('should return wholesale price when isWholesale is true', () => {
    const price = calculateProductPrice(mockProduct, {
      isWholesale: true,
    });
    expect(price).toBe(80);
  });

  it('should prioritize customer price over wholesale price', () => {
    const customerPrice: CustomerPrice = {
      id: '1',
      customer_id: 'customer-1',
      product_id: '1',
      price: 85,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const price = calculateProductPrice(mockProduct, {
      customerId: 'customer-1',
      isWholesale: true,
      customerPrices: [customerPrice],
    });
    expect(price).toBe(85);
  });
});

