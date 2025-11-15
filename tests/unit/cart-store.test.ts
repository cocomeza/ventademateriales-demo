import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cart-store';

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.getState().clearCart();
  });

  it('should add item to cart', () => {
    const store = useCartStore.getState();
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    expect(store.items).toHaveLength(1);
    expect(store.items[0].name).toBe('Test Product');
  });

  it('should increment quantity when adding same item', () => {
    const store = useCartStore.getState();
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    const store = useCartStore.getState();
    
    store.addToCart({
      id: '1',
      name: 'Product 1',
      price: 100,
      quantity: 2,
      image_url: null,
    });

    store.addToCart({
      id: '2',
      name: 'Product 2',
      price: 50,
      quantity: 3,
      image_url: null,
    });

    expect(store.getTotal()).toBe(350); // (100 * 2) + (50 * 3)
  });

  it('should remove item from cart', () => {
    const store = useCartStore.getState();
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    store.removeFromCart('1');

    expect(store.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const store = useCartStore.getState();
    
    store.addToCart({
      id: '1',
      name: 'Product 1',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    store.addToCart({
      id: '2',
      name: 'Product 2',
      price: 50,
      quantity: 1,
      image_url: null,
    });

    store.clearCart();

    expect(store.items).toHaveLength(0);
  });
});

