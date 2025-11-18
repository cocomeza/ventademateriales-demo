import { Product, CustomerPrice, CartItem } from "@/types";

export interface PricingContext {
  customerId?: string;
  isWholesale?: boolean;
  customerPrices?: CustomerPrice[];
}

/**
 * Calcula el precio de un producto considerando descuentos, precios por cliente, etc.
 */
export function calculateProductPrice(
  product: Product,
  context: PricingContext = {}
): number {
  const { customerId, isWholesale, customerPrices } = context;

  // 1. Precio base: mayorista o minorista
  let price = isWholesale && product.wholesale_price
    ? product.wholesale_price
    : product.base_price;

  // 2. Precio personalizado por cliente
  if (customerId && customerPrices) {
    const customerPrice = customerPrices.find(
      (cp) => cp.customer_id === customerId && cp.product_id === product.id
    );
    if (customerPrice) {
      price = customerPrice.price;
    }
  }

  return price;
}

/**
 * Calcula el descuento aplicable a un producto (siempre retorna 0, descuentos deshabilitados)
 */
export function calculateDiscount(
  product: Product,
  quantity: number,
  subtotal: number,
  context: PricingContext = {}
): { discount: number; appliedDiscount: null } {
  return { discount: 0, appliedDiscount: null };
}

/**
 * Calcula el precio total del carrito con descuentos
 */
export function calculateCartTotal(
  items: CartItem[],
  products: Product[],
  context: PricingContext = {}
): { subtotal: number; discountAmount: number; total: number } {
  let subtotal = 0;
  let totalDiscount = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product) continue;

    const itemPrice = calculateProductPrice(product, context);
    const itemSubtotal = itemPrice * item.quantity;
    subtotal += itemSubtotal;
  }

  return {
    subtotal,
    discountAmount: totalDiscount,
    total: Math.max(0, subtotal - totalDiscount),
  };
}

