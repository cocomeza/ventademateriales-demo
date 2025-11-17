import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/product-detail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const supabase = await createClient();
    
    const { data: product } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        category:categories(name, slug)
      `)
      .eq("id", params.id)
      .single();

    if (!product) {
      return {
        title: "Producto no encontrado",
      };
    }

    const mainImage = product.images?.[0]?.image_url || product.image_url || "/images/logo.materiales.jpeg";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const productUrl = `${siteUrl}/products/${params.id}`;

    return {
      title: product.name,
      description: product.description || `Compra ${product.name} en MaterialesYA. ${product.category?.name ? `Categoría: ${product.category.name}` : ""}`,
      alternates: {
        canonical: `/products/${params.id}`,
      },
      openGraph: {
        title: product.name,
        description: product.description || `Compra ${product.name} en MaterialesYA`,
        url: productUrl,
        type: "product",
        images: [
          {
            url: mainImage,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || `Compra ${product.name} en MaterialesYA`,
        images: [mainImage],
      },
    };
  } catch (error) {
    return {
      title: "Producto",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        category:categories(name, slug)
      `)
      .eq("id", params.id)
      .single();

    if (error || !product) {
      notFound();
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </main>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

