export interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  wholesale_price: number | null;
  stock: number;
  min_stock: number;
  sku: string | null;
  barcode: string | null;
  category: string;
  category_id?: string | null;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  image_url?: string | null; // Para compatibilidad con datos mock
}

// Tipo para insertar un producto (excluye campos generados automáticamente)
export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'variants' | 'image_url'>;

// Tipo para actualizar un producto (todos los campos opcionales excepto los que no se pueden cambiar)
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'images' | 'variants' | 'image_url'>>;

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  variant_type: 'size' | 'color' | 'model' | 'other';
  value: string;
  price_modifier: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  created_at: string;
}

export interface Discount {
  id: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed' | 'volume';
  discount_value: number;
  min_quantity: number | null;
  min_amount: number | null;
  product_id: string | null;
  category: string | null;
  customer_id: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  created_at: string;
}

export interface CustomerPrice {
  id: string;
  customer_id: string;
  product_id: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  product_id: string;
  variant_id: string | null;
  created_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface InventoryMovement {
  id: string;
  product_id: string;
  movement_type: 'entry' | 'exit' | 'adjustment' | 'sale' | 'return';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string | null;
  notes: string | null;
  user_id: string | null;
  order_id: string | null;
  created_at: string;
}

export interface StockAlert {
  id: string;
  product_id: string;
  threshold: number;
  notified: boolean;
  notified_at: string | null;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_id: string | null;
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  status: 'pending' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  status_history?: OrderStatusHistory[];
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

