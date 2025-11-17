import { CartView } from "@/components/cart-view";

export default function CartPage() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">Carrito de Compras</h1>
      <CartView />
    </div>
  );
}

