import { Product, Discount, CustomerPrice, CartItem } from "@/types";

export interface PricingContext {
  customerId?: string;
  isWholesale?: boolean;
  discounts?: Discount[];
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
 * Calcula el descuento aplicable a un producto
 */
export function calculateDiscount(
  product: Product,
  quantity: number,
  subtotal: number,
  context: PricingContext = {}
): { discount: number; appliedDiscount: Discount | null } {
  const { discounts = [] } = context;
  let maxDiscount = 0;
  let appliedDiscount: Discount | null = null;

  const now = new Date();

  for (const discount of discounts) {
    // Verificar si el descuento está activo
    if (!discount.active) continue;

    // Verificar fechas
    if (discount.start_date && new Date(discount.start_date) > now) continue;
    if (discount.end_date && new Date(discount.end_date) < now) continue;

    // Verificar si aplica al producto
    if (discount.product_id && discount.product_id !== product.id) continue;
    if (discount.category && discount.category !== product.category) continue;

    // Verificar condiciones de cantidad/monto
    if (discount.min_quantity && quantity < discount.min_quantity) continue;
    if (discount.min_amount && subtotal < discount.min_amount) continue;

    // Calcular descuento
    let discountAmount = 0;
    const productPrice = calculateProductPrice(product, context);

    if (discount.discount_type === "percentage") {
      discountAmount = (productPrice * quantity * discount.discount_value) / 100;
    } else if (discount.discount_type === "fixed") {
      discountAmount = discount.discount_value * quantity;
    } else if (discount.discount_type === "volume") {
      // Descuento por volumen: ejemplo 10% si compras más de 10 unidades
      discountAmount = (productPrice * quantity * discount.discount_value) / 100;
    }

    if (discountAmount > maxDiscount) {
      maxDiscount = discountAmount;
      appliedDiscount = discount;
    }
  }

  return { discount: maxDiscount, appliedDiscount };
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

    const { discount } = calculateDiscount(
      product,
      item.quantity,
      itemSubtotal,
      context
    );
    totalDiscount += discount;
  }

  return {
    subtotal,
    discountAmount: totalDiscount,
    total: Math.max(0, subtotal - totalDiscount),
  };
}

