import { WishlistView } from "@/components/wishlist-view";

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mi Lista de Deseos</h1>
      <WishlistView />
    </div>
  );
}

