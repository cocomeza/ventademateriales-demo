import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/components/product-detail";
import { notFound } from "next/navigation";

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
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

