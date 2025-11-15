import { ProductCatalog } from "@/components/product-catalog";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Materiales de Construcción</h1>
        <p className="text-muted-foreground">
          Encuentra los mejores materiales para tu proyecto
        </p>
      </div>
      <ProductCatalog />
    </div>
  );
}

