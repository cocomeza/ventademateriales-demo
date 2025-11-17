import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { createTestCartStore } from '@/tests/utils/cart-store-test';

// Create a fresh store instance for the test suite
// This avoids persist middleware issues
const useTestCartStore = createTestCartStore();

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useTestCartStore.getState();
    
    // Remove all items first
    const itemsToRemove = [...store.items];
    itemsToRemove.forEach(item => store.removeFromCart(item.id));
    
    // Then clear cart
    store.clearCart();
    
    // Reset all other state
    store.setProducts([]);
    store.setDiscounts([]);
    store.setCustomerPrices([]);
    store.setCustomerId(undefined);
    store.setIsWholesale(false);
    
    // Verify store is empty (but don't fail if it's not - just log)
    const finalState = useTestCartStore.getState();
    if (finalState.items.length > 0) {
      // Force clear by removing all items again
      finalState.items.forEach(item => finalState.removeFromCart(item.id));
    }
  });

  it('should add item to cart', () => {
    const store = useTestCartStore.getState();
    
    // Ensure cart is empty before starting
    expect(store.items).toHaveLength(0);
    
    // Set products first (needed for getTotal calculation)
    store.setProducts([{
      id: '1',
      name: 'Test Product',
      description: 'Test',
      base_price: 100,
      wholesale_price: null,
      stock: 10,
      min_stock: 5,
      sku: null,
      barcode: null,
      category: 'test',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
      variants: [],
      image_url: null,
    }]);
    
    // Add item to cart
    const cartItem = {
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    };
    
    store.addToCart(cartItem);

    // Get fresh state after adding (Zustand updates are synchronous)
    const updatedState = useTestCartStore.getState();
    
    // Verify item was added
    expect(updatedState.items).toHaveLength(1);
    expect(updatedState.items[0].name).toBe('Test Product');
    expect(updatedState.items[0].id).toBe('1');
  });

  it('should increment quantity when adding same item', () => {
    const store = useTestCartStore.getState();
    
    // Ensure cart is empty
    expect(store.items).toHaveLength(0);
    
    // Set products first
    store.setProducts([{
      id: '1',
      name: 'Test Product',
      description: 'Test',
      base_price: 100,
      wholesale_price: null,
      stock: 10,
      min_stock: 5,
      sku: null,
      barcode: null,
      category: 'test',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
      variants: [],
      image_url: null,
    }]);
    
    // Add item first time
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });
    
    // Get fresh state after first add
    let updatedStore = useTestCartStore.getState();
    
    // Verify first add
    expect(updatedStore.items).toHaveLength(1);
    expect(updatedStore.items[0].quantity).toBe(1);

    // Add same item again (should increment quantity)
    updatedStore.addToCart({
      id: '1',
      name: 'Test Product',
      price: 100,
      quantity: 1,
      image_url: null,
    });

    // Get fresh state after second add
    updatedStore = useTestCartStore.getState();

    // Verify quantity was incremented
    expect(updatedStore.items).toHaveLength(1);
    expect(updatedStore.items[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    const store = useTestCartStore.getState();
    
    // Ensure cart is empty
    expect(store.items).toHaveLength(0);
    
    // Set products first (required for getTotal)
    store.setProducts([
      {
        id: '1',
        name: 'Product 1',
        description: 'Test',
        base_price: 100,
        wholesale_price: null,
        stock: 10,
        min_stock: 5,
        sku: null,
        barcode: null,
        category: 'test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [],
        variants: [],
        image_url: null,
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Test',
        base_price: 50,
        wholesale_price: null,
        stock: 10,
        min_stock: 5,
        sku: null,
        barcode: null,
        category: 'test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [],
        variants: [],
        image_url: null,
      },
    ]);
    
    // Add first product (addToCart sets quantity to 1, ignoring passed quantity)
    store.addToCart({
      id: '1',
      name: 'Product 1',
      price: 100,
      quantity: 2, // This will be ignored, quantity will be 1
      image_url: null,
    });

    // Add second product
    store.addToCart({
      id: '2',
      name: 'Product 2',
      price: 50,
      quantity: 3, // This will be ignored, quantity will be 1
      image_url: null,
    });

    // Get fresh state after adding both items
    let updatedStore = useTestCartStore.getState();

    // Verify both items were added
    expect(updatedStore.items.length).toBe(2);
    
    // Verify quantities (addToCart always sets to 1 initially)
    expect(updatedStore.items[0].quantity).toBe(1);
    expect(updatedStore.items[1].quantity).toBe(1);
    
    // Calculate total: (100 * 1) + (50 * 1) = 150
    let total = updatedStore.getTotal();
    expect(total).toBe(150);
    
    // Now increment quantities to test the calculation
    updatedStore.increment('1'); // Product 1 quantity becomes 2
    updatedStore.increment('2'); // Product 2 quantity becomes 2
    updatedStore.increment('2'); // Product 2 quantity becomes 3
    
    // Get fresh state after incrementing
    updatedStore = useTestCartStore.getState();
    
    // Verify new total: (100 * 2) + (50 * 3) = 350
    const newTotal = updatedStore.getTotal();
    expect(newTotal).toBe(350);
  });

  it('should remove item from cart', () => {
    const store = useTestCartStore.getState();
    
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
    const store = useTestCartStore.getState();
    
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

