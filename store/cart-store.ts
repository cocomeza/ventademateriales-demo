import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Discount, CustomerPrice } from '@/types';
import { calculateCartTotal, PricingContext } from '@/lib/pricing';

interface CartStore {
  items: CartItem[];
  products: Product[];
  discounts: Discount[];
  customerPrices: CustomerPrice[];
  customerId?: string;
  isWholesale: boolean;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
  setDiscounts: (discounts: Discount[]) => void;
  setCustomerPrices: (prices: CustomerPrice[]) => void;
  setCustomerId: (id: string | undefined) => void;
  setIsWholesale: (value: boolean) => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getItemCount: () => number;
  getPricingContext: () => PricingContext;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      products: [],
      discounts: [],
      customerPrices: [],
      customerId: undefined,
      isWholesale: false,
      addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      increment: (productId) => {
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      },
      decrement: (productId) => {
        const items = get().items;
        const item = items.find((item) => item.id === productId);
        if (item && item.quantity > 1) {
          set({
            items: items.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          set({ items: items.filter((item) => item.id !== productId) });
        }
      },
      clearCart: () => {
        set({ items: [] });
      },
      setProducts: (products) => {
        set({ products });
      },
      setDiscounts: (discounts) => {
        set({ discounts });
      },
      setCustomerPrices: (customerPrices) => {
        set({ customerPrices });
      },
      setCustomerId: (customerId) => {
        set({ customerId });
      },
      setIsWholesale: (isWholesale) => {
        set({ isWholesale });
      },
      getPricingContext: () => {
        const state = get();
        return {
          customerId: state.customerId,
          isWholesale: state.isWholesale,
          discounts: state.discounts,
          customerPrices: state.customerPrices,
        };
      },
      getTotal: () => {
        const state = get();
        const { subtotal, discountAmount } = calculateCartTotal(
          state.items,
          state.products,
          state.getPricingContext()
        );
        return subtotal - discountAmount;
      },
      getSubtotal: () => {
        const state = get();
        const { subtotal } = calculateCartTotal(
          state.items,
          state.products,
          state.getPricingContext()
        );
        return subtotal;
      },
      getDiscountAmount: () => {
        const state = get();
        const { discountAmount } = calculateCartTotal(
          state.items,
          state.products,
          state.getPricingContext()
        );
        return discountAmount;
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, isWholesale: state.isWholesale }),
    }
  )
);

