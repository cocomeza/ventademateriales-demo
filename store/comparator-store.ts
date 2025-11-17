import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface ComparatorStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearComparator: () => void;
  isInComparator: (productId: string) => boolean;
  canAddMore: () => boolean;
}

export const useComparatorStore = create<ComparatorStore>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const state = get();
        // Máximo 4 productos
        if (state.products.length >= 4) {
          return;
        }
        // Evitar duplicados
        if (!state.products.find((p) => p.id === product.id)) {
          set({ products: [...state.products, product] });
        }
      },
      removeProduct: (productId) => {
        set({ products: get().products.filter((p) => p.id !== productId) });
      },
      clearComparator: () => {
        set({ products: [] });
      },
      isInComparator: (productId) => {
        return get().products.some((p) => p.id === productId);
      },
      canAddMore: () => {
        return get().products.length < 4;
      },
    }),
    {
      name: 'comparator-storage',
    }
  )
);

