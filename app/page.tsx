import { ProductCatalog } from "@/components/product-catalog";
import { PromotionalBanner } from "@/components/promotional-banner";
import { CategoryShowcase } from "@/components/category-showcase";
import { FeaturedProducts } from "@/components/featured-products";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Materiales de Construcción",
  description: "Encuentra los mejores materiales de construcción para tu proyecto. Amplio catálogo de productos de calidad con precios competitivos y entrega rápida.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MaterialesYA - Materiales de Construcción",
    description: "Encuentra los mejores materiales de construcción para tu proyecto. Amplio catálogo de productos de calidad.",
    url: "/",
  },
};

export default async function Home() {
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  
  try {
    const supabase = await createClient();
    
    // Cargar categorías destacadas
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .eq("active", true)
      .order("name")
      .limit(6);

    if (!categoriesError && categoriesData) {
      categories = categoriesData;
    }

    // Cargar productos destacados (puedes agregar un campo "featured" en la BD)
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!productsError && productsData) {
      featuredProducts = productsData;
    }
  } catch (error) {
    // Silenciar errores - los componentes manejarán la ausencia de datos
    console.error("Error loading homepage data:", error);
  }

  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Banner Promocional Principal */}
      <PromotionalBanner
        title="Materiales de Construcción de Calidad"
        description="Encuentra todo lo que necesitas para tu proyecto. Amplio catálogo con los mejores precios del mercado."
        imageUrl="/images/banner-hero.jpg"
        imageAlt="Materiales de construcción de calidad para tu obra"
        linkUrl="/"
        linkText="Explorar Catálogo"
        badge="Nuevo"
        variant="large"
        className="mb-6 sm:mb-12"
      />

      {/* Categorías Destacadas */}
      {categories && categories.length > 0 && (
        <CategoryShowcase
          categories={categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug || undefined,
            description: cat.description || undefined,
          }))}
          title="Categorías Destacadas"
          columns={3}
          className="mb-6 sm:mb-12"
        />
      )}

      {/* Productos Destacados */}
      {featuredProducts && featuredProducts.length > 0 && (
        <FeaturedProducts
          products={featuredProducts as any}
          title="Productos Destacados"
          showViewAll={true}
          viewAllUrl="/"
          maxItems={8}
          className="mb-6 sm:mb-12"
        />
      )}

      {/* Título y Catálogo Completo */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Catálogo Completo</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explora todos nuestros productos y encuentra lo que necesitas
        </p>
      </div>
      <ProductCatalog />
    </main>
  );
}

