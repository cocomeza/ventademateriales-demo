import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import { CategoryProductCatalog } from "@/components/category-product-catalog";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const supabase = await createClient();
    
    const { data: category } = await supabase
      .from("categories")
      .select("name, description")
      .eq("slug", params.slug)
      .eq("active", true)
      .single();

    if (!category) {
      return {
        title: "Categoría no encontrada",
      };
    }

    return {
      title: `${category.name} - MaterialesYA`,
      description: category.description || `Explora ${category.name} en MaterialesYA. Encuentra los mejores productos de construcción.`,
      alternates: {
        canonical: `/categorias/${params.slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Categoría - MaterialesYA",
    };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const supabase = await createClient();
    
    const { data: category, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url")
      .eq("slug", params.slug)
      .eq("active", true)
      .single();

    if (error || !category) {
      notFound();
    }

    return (
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Inicio
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/" className="hover:text-primary transition-colors">
            Categorías
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        {/* Header de categoría */}
        <div className="mb-6 sm:mb-8">
          {category.image_url && (
            <div className="relative w-full h-48 sm:h-64 md:h-80 mb-4 rounded-lg overflow-hidden">
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-primary">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        {/* Catálogo filtrado por categoría */}
        <CategoryProductCatalog categoryId={category.id} categoryName={category.name} />
      </main>
    );
  } catch (error) {
    notFound();
  }
}

